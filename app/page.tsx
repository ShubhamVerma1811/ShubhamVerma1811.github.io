import { About } from 'components/About';
import { PageLayout } from 'layouts';

import { Metadata } from 'next';

export const revalidate = 86400;

export const metadata: Metadata = {
  title: 'Shubham Verma | Frontend Developer',
  description:
    'Frontend Developer, Likes to build open source tools and write articles. ',
  openGraph: {
    title: 'Shubham Verma | Frontend Developer',
    description:
      'Frontend Developer, Likes to build open source tools and write articles. ',
    images: [
      {
        url: `${process.env.DOMAIN}/api/og?title=Shubham Verma&desc=Builder, Writer, Learner.`
      }
    ]
  }
};

export default function Home() {
  return (
    <PageLayout>
      <About />
    </PageLayout>
  );
}
