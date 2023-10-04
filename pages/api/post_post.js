import { PrismaClient } from "@prisma/client";

// 新しく投稿するAPI
export default async function handler(req, res) {
  // 送られたJSONを取得
  const json = req.body;

  const prisma = new PrismaClient();
  await prisma.posts.create({
    data: {
      // JSONの中のauthorとcontextを使う
      author: json.author,
      image_url: json.image_url,
      lat: json.lat,
      lng: json.lng,
      context: json.context,
      // publish_at: new Date().toISOString({ timeZone: "Asia/Tokyo" }),
      // publish_at: new Date(
      //   Date.now() + (new Date().getTimezoneOffset() + 9 * 60) * 60 * 1000
      // ),
      publish_at: new Date().toISOString(),
      // -540 JST
      // 0 UTC
    },
  });

  // そのauthorのポイント数を持ってくる
  const results = await prisma.users.findMany({
    where: {name: json.author}
  });

  // もしそのIDが見つからなければNot Foundを返す
  if (results.length === 0) {
    res.status(404).json({
      "status": "not found",
      "message": "this user is not found"
    });
    return;
  }

  const newPoint = results[0].point + 1;

  await prisma.users.update({
    data: {
      point: newPoint
    },
    where: {id: results[0].id}
  });

  res.status(200).json({
    "status": "ok",
    "point": newPoint
  });
}
