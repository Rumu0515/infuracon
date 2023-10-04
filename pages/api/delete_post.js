import { PrismaClient } from "@prisma/client";

// 投稿を削除するAPI
export default async function handler(req, res) {
  // 送られたJSONを取得
  const json = req.body;

  const prisma = new PrismaClient();
  await prisma.posts.delete({
    where: {
      // JSONの中のidを使う
      id: json.id,
    },
  });

  res.status(200);
}
