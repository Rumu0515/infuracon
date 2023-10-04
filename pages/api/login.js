// pages/api/login.js
// import passport from 'passport';

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(req, res) {
  const json = req.body;

  try {
    const results = await prisma.users.findMany({
      where: {name: json.username}
    });

    // もしそのIDが見つからなければ新規作成
    if (results.length === 0) {
      await prisma.users.create({
        data: {
            name: json.username
        }
      })
    }

    return res.status(200).json({
      name: json.username
    });

  } catch (error) {
    return res.status(500).json({
      error: error
    });
  }

  // passport.authenticate('local', (err, user, info) => {
  //   if (err) {
  //     return res.status(500).json({ message: 'エラーが発生しました' });
  //   }
  //   if (!user) {
  //     return res.status(401).json({ message: 'ユーザー名またはパスワードが正しくありません' });
  //   }
  //   req.logIn(user, (err) => {
  //     if (err) {
  //       return res.status(500).json({ message: 'エラーが発生しました' });
  //     }
  //     return res.json({ message: 'ログイン成功' });
  //   });
  // })(req, res);
}