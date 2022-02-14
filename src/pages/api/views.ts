import { NextApiRequest, NextApiResponse } from 'next';
import Notion from '../../services/notion';

const notion = new Notion();
const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === 'POST') {
    const { page_id, views } = JSON.parse(req.body);
    const view = await notion.updateViews(page_id, views);
    res.send(view);
  } else res.send('Request method is not supported');
};

export default handler;