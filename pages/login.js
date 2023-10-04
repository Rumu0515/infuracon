// pages/login.js
import { useState } from 'react';
import axios from 'axios';

export default function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    // ここで自分の情報をデータベースに登録する (もし登録されていなかったら)
    try {
      await axios.post('/api/login', {
        "username": username
      });
      localStorage.setItem('name', username);
      alert('ログイン成功');
    } catch (error) {
      alert('ログイン失敗');
    }
  };

  return (
    <div>
      <h1>ログイン</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label>ユーザー名:</label>
          <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} />
        </div>
        <button type="submit">ログイン</button>
      </form>
    </div>
  );
}