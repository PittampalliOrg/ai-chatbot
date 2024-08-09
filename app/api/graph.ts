import { NextApiRequest, NextApiResponse } from 'next';
import { initializeGraphClient } from '../../lib/graphClient';
import { MailFolder } from '@/kiota/models';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const accessToken = req.headers.authorization?.split(' ')[1];

  if (!accessToken) {
    return res.status(401).json({ error: 'No access token provided' });
  }

  const graphClient = initializeGraphClient(accessToken);

  try {
    const mailFolders = await graphClient.me.mailFolders.get();
    res.status(200).json(mailFolders);
  } catch (error) {
    console.error('Error fetching mail folders:', error);
    res.status(500).json({ error: 'Error fetching mail folders' });
  }
}