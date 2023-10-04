import { useState } from 'react';
import uploadImgFile from '../lib/uploadImgFile';

const UploadTest = () => {
  const [imgUrl, setImgUrl] = useState('');

  // ファイルが選択されたときに行う処理
  const handleChangeFile = async (e) => {
    const file = e.target.files[0];
    // ファイルをアップロードしてURLを取得
    setImgUrl(await uploadImgFile(file));
  };

  return (
    <>
      <h2>画像をアップロード</h2>

      <input type="file" accept="image/*" onChange={handleChangeFile} />

      {imgUrl !== '' && (
        <div>
          <img src={imgUrl} alt="アップロードした画像" />
        </div>
      )}

      <div>{imgUrl}</div>
    </>
  );
};

export default UploadTest;
