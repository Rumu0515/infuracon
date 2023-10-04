import { PrismaClient } from '@prisma/client';

// 投稿を取得するAPI
export default async function handler(req, res) {
  const prisma = new PrismaClient();
  const row = await prisma.posts.findUnique({
    where: {
      id: parseInt(req.query.post_id),
    },
  });

  res.status(200).json(row);
}
