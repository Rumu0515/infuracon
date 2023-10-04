import { PrismaClient } from "@prisma/client";

// 投稿内容を変更するAPI
export default async function handler(req, res) {
  // 送られたJSONを取得
  const json = req.body;

  const prisma = new PrismaClient();
  await prisma.posts.update({
    where: {
      // JSONの中のidを使う
      id: json.id,
    },
    data: {
      // JSONの中のcontextを使う
      context: json.context,
    },
  });

  res.status(200);
}
