import cloudinary from 'cloudinary';

// 新しく投稿するAPI
export default async function handler(req, res) {
  // 送られたJSONを取得
  const json = req.body;

  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
    secure: true,
  });

  const resUpload = await cloudinary.v2.uploader.upload(json.image);

  res.status(200).json(resUpload);
}
