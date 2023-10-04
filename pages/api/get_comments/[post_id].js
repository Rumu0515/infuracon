import { PrismaClient } from "@prisma/client";

// コメントを取得するAPI
export default async function handler(req, res) {
  const prisma = new PrismaClient();
  const rows = await prisma.comments.findMany({
    where: {
      post_id: parseInt(req.query.post_id),
    },
  });

  res.status(200).json({
    comments: rows,
  });
}
