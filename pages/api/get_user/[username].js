import { PrismaClient } from "@prisma/client";

// 新しく投稿するAPI
export default async function handler(req, res) {
  const prisma = new PrismaClient();

  // そのauthorのポイント数を持ってくる
  const results = await prisma.users.findMany({
    where: {name: req.query.username}
  });

  // もしそのIDが見つからなければNot Foundを返す
  if (results.length === 0) {
    res.status(404).json({
      "status": "not found",
      "message": "this user is not found"
    });
    return;
  }

  res.status(200).json({
    "status": "ok",
    "info": {
        "name": results[0].name,
        "point": results[0].point
    }
  });
}
