import Head from "next/head";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import axios from "axios";
import dayjs from "dayjs";
import React from "react";
import Image from "next/image";
import Link from "next/link";

export default function Postview(props) {
  const router = useRouter();

  // const [postId, setPostId] = useState("");
  const [post, setPost] = useState({});
  // 自分の情報
  const [username, setUsername] = useState("");
  const [context, setContext] = useState("");

  // 表示されるコメント一覧
  const [comments, setComments] = useState([]);

  const [post_id, setPost_id] = useState("");

  //いいねの数
  const [favorites, setFavorites] = useState(0);

  const changeusername = (e) => {
    setUsername(e.target.value);
  };

  //
  const changeContext = (e) => {
    setContext(e.target.value);
  };

  const changepost_id = (e) => {
    setPost_id(e.target.value);
  };

  const changefavorite = (e) => {
    setFavorite(e.target.value);
  };

  useEffect(() => {
    if (!router.isReady) {
      return;
    }
    setPost_id(router.query.post_id);
  }, [router.isReady]);

  const getPost = (id) => {
    axios.get(`/api/get_post/${id}`).then((res) => {
      setPost(res.data);
      setFavorites(res.data.favorite);
    });
  };

  //いいね
  const getFavorite = (id) => {
    axios.get(`/api/get_favorite/${id}`).then((res) => {
      setPost(res.data);
    });
  };

  useEffect(() => {
    if (post_id === "") {
      return;
    }

    getPost(post_id);
  }, [post_id]);

  // いいね数を投稿する関数
  const postfavorite = () => {
    axios.post(`/api/add_favorite/${post_id}`).then(() => {
      setFavorites(favorites + 1);
      console.log("いいね完了しました");
    });
  };

  // コメントを投稿する関数
  const postcomments = () => {
    axios
      .post("/api/post_comments", {
        // APIに渡すJSONの中にauthorとcontextを入れる
        author: username,
        context: context,
        post_id: parseInt(post_id),
      })
      .then(() => {
        getComments();
        console.log("投稿完了しました");
      });
  };

  // コメント一覧を取得する関数
  const getComments = () => {
    axios.get(`/api/get_comments/${post_id}`).then((res) => {
      const json = res.data;
      setComments(json.comments);
      // setPostId = { id };
    });
  };

  // ページを読み込んだときに実行する処理
  useEffect(() => {
    if (post_id === "") {
      return;
    }
    getComments();
  }, [post_id]);

  //いいね写真
  var pics_src = new Array("/image/good.png", "/image/redgood.png");
  var num = 0;
  function slideshow() {
    if (num == 1) {
      num = 1;
    } else {
      num = 1;
    }
    document.getElementById("mypic").src = pics_src[num];
    console.log(pics_src[num]);
  }

  return (
    <div className="justfy-center">
      <Head>
        <title>みんはざ：投稿を見る</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main>
        <div className="flex flex-row">
          <Link href="/">
            <button className="mt-5 border-2 w-96 font-bold text-2xl border-gray-700 rounded-xl">
              ホームに戻る
            </button>
          </Link>
          <Link href="../postview">
            <button className="mt-5 border-2 w-96 font-bold text-2xl border-gray-700 rounded-xl">
              投稿一覧に戻る
            </button>
          </Link>
        </div>
        <div className="flex flex-col">
          <div className="mt-10 flex flex-row justify-center">
            <div>
              {/* pngをアイコンにする */}
              <Image src="/image/posts.png" width={43} height={43} />
            </div>
            <h1 className="text-4xl font-bold flex justify-items-center">
              投稿を見る
            </h1>
          </div>
          <div>
            <div className="flex flex-col justify-center">
              {post !== {} && (
                <div className="m-10 p-10  flex flex-col items-center">
                  <div>
                    <div>
                      <img
                        className="border-1 rounded-xl"
                        src={post.image_url}
                        alt="投稿画像"
                        width={300}
                        height={300}
                      />
                    </div>
                    <div>
                      <p className="mt-5 mb-5 text-left text-xl font-bold">
                        {post.author}
                      </p>
                      <p className="mb-5 text-left text-lg">{post.context}</p>
                      <div className="text-left">
                        {dayjs(post.publish_at).format(
                          `MM月DD日HH時mm分に投稿されました`
                        )}
                      </div>

                      <div className="mt-5 mb-5">
                        <label onClick={postfavorite}>
                          <img
                            id="mypic"
                            onClick={slideshow}
                            src={"/image/1.png"}
                            width="100"
                            height="100"
                          />
                        </label>
                      </div>
                    </div>

                    <p>{favorites}回いいねが押されました！</p>
                  </div>
                  <div className="mt-10 w-96 h-1 bg-gray-400 rounded-full" />

                  <div className=" w-96 h-1 m-10 font-bold text-2xl items-center text-center">
                    コメント
                  </div>

                  {comments.map((info) => (
                    // infoの中には、id、author、contextの3つが入っている(データベースはこの3つを格納しているから)
                    <div key={info.id} className="pb-2">
                      {info.favorite}
                    </div>
                  ))}

                  <ul>
                    {/* おまじない */}
                    {/* リストから一つ一つ取り出して、infoに代入して、そのinfoを使う */}
                    {comments.map((info) => (
                      // infoの中には、id、author、contextの3つが入っている(データベースはこの3つを格納しているから)
                      <li
                        key={info.id}
                        className="m-5 flex flex-col items-center"
                      >
                        <div className="flex flex-row text-lg text-center">
                          <div className="text-left text-xl font-bold">
                            {info.author}：
                          </div>
                          <div>{info.context}</div>
                        </div>
                      </li>
                    ))}
                  </ul>

                  <div className="w-96 h-1 bg-gray-400 rounded-full" />

                  <div className="m-10 font-bold text-2xl text-center border-gray-700 text-black flex flex-col justify-center items-center">
                    <p>コメントの入力</p>
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
                    <label htmlFor="first">
                      <h3>コメントを入力</h3>
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
                  <div>
                    <button
                      onClick={postcomments}
                      className="mt-5 border-2 w-96 font-bold text-2xl border-gray-700 rounded-lg"
                    >
                      コメントを投稿
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}