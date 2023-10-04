import axios from 'axios';
import fileToBase64 from '../utils/fileToBase64';

const uploadImgFile = async (file) => {
  const b64 = await fileToBase64(file);

  const res = await axios.post('/api/upload_image', {
    image: b64,
  });

  return res.data['secure_url'];
};

export default uploadImgFile;
