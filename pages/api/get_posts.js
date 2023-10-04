import { PrismaClient } from "@prisma/client";

// 投稿一覧を取得するAPI
export default async function handler(req, res) {
  const prisma = new PrismaClient();
  const rows = await prisma.posts.findMany({
    orderBy: [
      {
        publish_at: "desc",
      },
    ],
  });

  res.status(200).json({
    // JSONの中にpostsというキーを作り、投稿一覧を入れる
    posts: rows,
  });
}
