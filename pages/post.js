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
    <div>
      <Head>
        <title>みんはざ：投稿作成</title>
      </Head>

      <main>
        <div className="flex flex-row">
          {/* <h1 className="">{username} さん</h1> */}
          <Link href="/">
            <button className="mt-5 border-2 w-96 font-bold text-2xl border-gray-700 rounded-xl">
              ホームに戻る
            </button>
          </Link>
          {/* <Link href="/">
            <button className="mt-5 border-2 w-96 font-bold text-2xl border-gray-700 rounded-xl">
              {username} さん　
            </button>
          </Link> */}
          <Link href="../postview">
            <button className="mt-5 border-2 w-96 font-bold text-2xl border-gray-700 rounded-xl">
              投稿を見る
            </button>
          </Link>
        </div>
        {/* 投稿アイコン */}
        <div className="mt-10 flex flex-row justify-center">
          <div>
            {/* pngをアイコンにする */}
            <Image src="/image/post.png" width={43} height={43} />
          </div>
          <h1 className="text-4xl font-bold">投稿</h1>
        </div>
        <div className="m-10 font-bold text-2xl text-center  text-black flex flex-col justify-center items-center">
          <label>
            <div>
              <div className="w-96 border-2 border-gray-700  rounded-lg">
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
            className="mt-5"
            src={imageUrl}
            width={380}
            height={380}
            alt="選択した画像はここに表示されます"
          />
        </div>
        <label
          className="m-10 font-bold text-2xl text-center text-black flex flex-col justify-center items-center"
          htmlFor="name"
        >
          <h3>名前を入力して下さい。</h3>
          <textarea
            className="mt-5 border-2
            w-96
            border-gray-700 
            text-center
            resize-none
            rounded-lg"
            value={username}
            onChange={changeusername}
            name="text"
            rows="1"
            cols="40"
            maxLength="40"
          ></textarea>
        </label>
        <label
          className="m-10 font-bold text-2xl text-center text-black flex flex-col justify-center items-center"
          htmlFor="location"
        >
          <h3>撮影した場所の座標を取得</h3>

          <div className="App">
            {!isFirstRef && !isAvailable && <ErrorText />}
            {isAvailable && (
              <div>
                <div>
                  <button
                    onClick={getCurrentPosition}
                    className="mt-5 border-2 w-96 border-gray-700 rounded-lg"
                  >
                    取得
                  </button>
                </div>
                <div className="flex flex-row mt-5  border-gray-700 rounded-xl">
                  <input
                    className="border-2 w-48 border-neutral-500 rounded-lg text-center"
                    readOnly
                    type="number"
                    style={{ resize: "none" }}
                    rows="1"
                    cols="9"
                    value={lat}
                    onChange={changeLat}
                  />

                  <input
                    className="border-2 w-48 border-neutral-500 rounded-lg text-center"
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
        </label>
        <div className="m-10 font-bold text-2xl text-center  border-gray-700 text-black flex flex-col justify-center items-center">
          <label htmlFor="first">
            <h3>投稿文を入力して下さい。</h3>
          </label>
          <textarea
            className="mt-5 border-2 w-96 border-neutral-500 rounded-lg resize-none"
            value={context}
            onChange={changeContext}
            name="context"
            style={{ resize: "none" }}
            rows="4"
            cols="40"
            maxLength="200"
          ></textarea>
        </div>
        <label className=" flex flex-col justify-center items-center ">
          <button
            onClick={postPosts}
            className="mt-5 mb-10 border-2 w-96 font-bold text-2xl border-gray-700 rounded-lg"
          >
            投稿
          </button>
        </label>
      </main>
    </div>
  );
}
