import Head from "next/head";
import { useRouter } from "next/router";
import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import uploadImgFile from "../lib/uploadImgFile";
import Image from "next/image";
import Link from "next/link";

// 位置情報のエラーテキスト
const ErrorText = () => (
  <p className="App-error-text">geolocation IS NOT available</p>
);

export default function posting() {
  const router = useRouter();

  const isFirstRef = useRef(true);
  //位置情報の関数呼び出し
  const [isAvailable, setAvailable] = useState(false);
  // 自分の情報
  const [username, setUsername] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [lat, setLat] = useState(0);
  const [lng, setLng] = useState(0);
  const [context, setContext] = useState("");
  const [point, setPoint] = useState(-1);

  //緯度経度読み込み
  useEffect(() => {
    isFirstRef.current = false;
    if ("geolocation" in navigator) {
      setAvailable(true);
    }
  }, [isAvailable]);

  useEffect(() => {
    const value = localStorage.getItem("name")
    if (value !== null) {
      setUsername(value);
    }
  }, []);

  useEffect(() => {
    if (username === '') {
      return;
    }

    axios.get(`/api/get_user/${username}`).then((res) => {
      const json = res.data;
      setPoint(json.info.point);
    });
  }, [username]);

  const getCurrentPosition = () => {
    navigator.geolocation.getCurrentPosition((pos) => {
      const { latitude, longitude } = pos.coords;
      setLat(latitude);
      setLng(longitude);
    });
  };

  // useEffect実行前であれば、"Loading..."という呼び出しを表示させます
  if (isFirstRef.current) return <div className="App">Loading...</div>;

  // ファイルが選択されたときに行う処理
  const handleChangeFile = async (e) => {
    const file = e.target.files[0];
    // ファイルをアップロードしてURLを取得
    setImageUrl(await uploadImgFile(file));
  };

  const changeusername = (e) => {
    setUsername(e.target.value);
  };

  const changeLat = (e) => {
    setLat(e.target.value);
  };

  const changeLng = (e) => {
    setLng(e.target.value);
  };

  const changeContext = (e) => {
    setContext(e.target.value);
  };

  // 日誌を投稿する関数
  const postPosts = () => {
    axios
      .post("/api/post_post", {
        // APIに渡すJSONの中にauthorとcontextを入れる
        author: username,
        image_url: imageUrl,
        lat: lat,
        lng: lng,
        context: context
      })
      .then(() => {
        console.log("投稿完了しました");
        router.push("/postview");
      });
  };

  return (
    <div className="">
      <Head>
        <title>みんはざ：投稿作成</title>
      </Head>
      <div className="gap-10 bg-lime-700 content-center p-4 text-white text-center flex flex-row justify-center fixed top-0 w-full">
        <a className="text-white m-5">Safe City</a> 

        {username !== '' && (
          <div className="">
            <div>
              {username}さん
            </div>
            <div>
              {point !== -1 && `${point}ポイント`}
            </div>
          </div>
        )}

      </div>


      <div className="flex flex-col items-center justify-center mt-14 mb-2 text-lime-700">
        <h1 className="text-lime-700 text-lg">投稿作成</h1>
        <div className="flex flex-col items-center justify-center p-5 border-2 w-96 border-lime-700 rounded-md">
          <div className="name">
            <a className="p-3">名前</a>
            <textarea readOnly
              className="mt-5 border-2 w-40 border-lime-700 resize-none rounded-md"
              value={username}
              onChange={changeusername}
              name="text"
              rows="1"
              cols="40"
              maxLength="40"
            ></textarea>
          </div>

          <div className="pic">
            <label>
              <div>
                <div>
                  ここをクリックして画像を選択
                </div>
                <input
                  hidden //ファイルを選択を非表示に
                  type="file"
                  accept="image/*"
                  onChange={handleChangeFile}
                />
              </div>
            </label>
            <img
              className="h-80 w-80 border-2 border-lime-700 rounded-md"
              src={imageUrl}
              alt="選択した画像はここに表示されます"
            />
          </div>

          <div className="coord">
            <a>座標を取得する</a>
            <div className="App">
              {!isFirstRef && !isAvailable && <ErrorText />}
              {isAvailable && (
                <div>
                  <div className="border-2 w-80 border-lime-700 rounded-md">
                    <input
                      className="w-14 text-center"
                      readOnly
                      type="number"
                      style={{ resize: "none" }}
                      rows="1"
                      cols="9"
                      value={lat}
                      onChange={changeLat}
                    />

                    <input
                      className="w-14 text-center"
                      type="number"
                      readOnly
                      style={{ resize: "none" }}
                      rows="1"
                      cols="9"
                      value={lng}
                      onChange={changeLng}
                    />
                  </div>
                </div>
              )}
            </div>
            <button onClick={getCurrentPosition} className="text-white border-2 w-20 bg-lime-700 rounded-md">
              取得
            </button>
          </div>

          <div className="border-lime-700">
            <a>投稿文を入力して下さい。</a>
            <textarea
              className="border-2 w-80 border-lime-700 rounded-md resize-none"
              value={context}
              onChange={changeContext}
              name="context"
              style={{ resize: "none" }}
              rows="4"
              cols="40"
              maxLength="200"
            ></textarea>
          </div>
        </div>
      </div>
      <button
        onClick={postPosts}
        className="border-2 w-96 font-bold text-white border-lime-700 bg-lime-700 rounded-md"
      >
        投稿
      </button>


      <footer className="bg-lime-700 content-center w-full p-4 text-white text-center fixed bottom-0">
        <Link href="/">
          <button className="h-auto w-auto mx-5 text-white">ホーム</button>
        </Link>
        <Link href="/postview">
          <button className="h-auto w-auto mx-5">投稿一覧</button>
        </Link>
        <Link href="/">
          <button className="h-auto w-auto mx-5">マップ</button>
        </Link>
      </footer>


    </div>
  );
}
