import { GetStaticPaths, GetStaticProps } from 'next';
import Notion from '../../services/notion';

const notion = new Notion();

interface IBlog {
  blogInfo: any;
  blogContent: any;
}

const Blog = (props: IBlog) => {
  return (
    <>
      <h1 className="text-white">
        {props.blogInfo?.properties?.name?.title[0]?.plain_text}
      </h1>
      <div
        className="text-white"
        dangerouslySetInnerHTML={{
          __html: re(props.blogContent?.results),
        }}></div>
    </>
  );
};

export default Blog;

export const getStaticPaths: GetStaticPaths = async () => {
  const database = await notion.getDatabase(
    '914232ab-7e40-448b-bfc4-ddade4d4ccde',
  );

  const paths = database.results?.map((page) => ({
    params: {
      id: page.id,
    },
  }));

  return {
    paths,
    fallback: true,
  };
};

export const getStaticProps: GetStaticProps = async ({ params }) => {
  if (!params || !params.id) throw new Error('No id found in params');

  const blogInfo = await notion.getPageInfo(
    typeof params.id === 'string' ? params.id : params.id[0],
  );

  const blogContent = await notion.getPageContent(
    typeof params.id === 'string' ? params.id : params.id[0],
  );

  return {
    props: {
      blogInfo,
      blogContent,
    },
    revalidate: 10,
  };
};

const annotationToHtml = (text, type) => {
  const annotations = text.annotations;

  if (
    !annotations.bold &&
    !annotations.italic &&
    !annotations.underline &&
    !annotations.strikethrough
  ) {
    return text.plain_text;
  }

  // let bg;
  // if (annotations.color.indexOf("_background") > -1) {
  //   bg = annotations.color.replace("_background", "");
  // }

  return `<${type} style="color:${annotations.color}">
  ${annotations.bold ? '<b>' : ''}
  ${annotations.italic ? '<em>' : ''}
  ${annotations.code ? '<code style="color:red">' : ''}
  ${annotations.strikethrough ? '<s>' : ''}
  ${annotations.underline ? '<u>' : ''}
  ${text?.text?.link?.url ? `<a href=${text?.text?.link?.url}>` : ''}
  ${text.plain_text}
  ${text?.text?.link?.url ? `</a>` : ''}
  ${annotations.underline ? '</u>' : ''}
  ${annotations.strikethrough ? '</s>' : ''}
  ${annotations.code ? '</code>' : ''}
  ${annotations.italic ? '</em>' : ''}
  ${annotations.bold ? '</b>' : ''}
  </${type}>`;
};

function re(results) {
  let code = '';

  results?.forEach((block) => {
    code += `<div> </div>`;

    switch (block.type) {
      case 'paragraph':
        block.paragraph?.text.map((text) => {
          code += annotationToHtml(text, 'span');
        });

        break;

      case 'heading_1':
        block.heading_1?.text.map((text) => {
          code += annotationToHtml(text, 'h1');
        });
        break;

      case 'heading_2':
        block.heading_2?.text.map((text) => {
          code += annotationToHtml(text, 'h2');
        });
        break;

      case 'heading_3':
        block.heading_3?.text.map((text) => {
          code += annotationToHtml(text, 'h3');
        });
        break;

      case 'image':
        code += `<div><img src="${block.image.file.url}" alt="${block.image.caption[0]?.plain_text}" width="100%"/>
      <small>${block.image.caption[0]?.plain_text}</small>
      </div>`;
        break;

      case 'divider':
        code += `<hr />`;
        break;

      case 'code':
        code += `<pre><code language=language-${block.code.language}>${block.code.text[0].plain_text}</code></pre>`;
        break;

      case 'quote':
        block.quote?.text.map((text) => {
          code += annotationToHtml(text, 'blockquote');
        });
        break;

      default:
        break;
    }
  });

  return code;
}