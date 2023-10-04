import { PrismaClient } from "@prisma/client";

// いいねするAPI
export default async function handler(req, res) {
  const prisma = new PrismaClient();
  const row = await prisma.posts.findUnique({
    where: {
      id: parseInt(req.query.post_id),
    },
  });

  await prisma.posts.update({
    where: {
      id: parseInt(req.query.post_id),
    },
    data: {
      favorite: row.favorite + 1,
    },
  });

  res.status(200).json({});
}
