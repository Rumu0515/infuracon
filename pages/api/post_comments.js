import { PrismaClient } from "@prisma/client";

// 新しくコメントするAPI
export default async function handler(req, res) {
  // 送られたJSONを取得
  const json = req.body;

  const prisma = new PrismaClient();
  await prisma.comments.create({
    data: {
      // JSONの中のauthorとcontextを使う
      author: json.author,
      context: json.context,
      post_id: json.post_id,
      publish_at: new Date().toISOString(),
      // -540 JST
      // 0 UTC
    },
  });

  res.status(200).json({});
}
