import Head from "next/head";
const mapboxgl = require("mapbox-gl/dist/mapbox-gl.js");
import { useState, useEffect } from "react";
import MapboxLanguage from "@mapbox/mapbox-gl-language";
import axios from "axios";
import Link from "next/link";



export default function Map() {
  const [Map, setMap] = useState();
  const [pageIsMounted, setPageIsMounted] = useState(false);
  // const router = useRouter();
  // const currentPath = router.pathNamev;
  const [posts, setPosts] = useState([]);
  const [isLogined, setIsLogined] = useState(false);

  mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN;

  function mapView(lng, lat) {
    setPageIsMounted(true);

    const map = new mapboxgl.Map({
      container: "map",
      style: "mapbox://styles/mapbox/streets-v11",
      center: [lng, lat],
      zoom: 15,
    });
    const language = new MapboxLanguage({ defaultLanguage: "ja" });
    const zoom = new MapboxLanguage();
    map.addControl(language);
    map.addControl(zoom);
    setMap(map);
  }

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(function (position) {
      console.log("Latitude is :", position.coords.latitude);
      console.log("Longitude is :", position.coords.longitude);
      var lng = position.coords.longitude;
      var lat = position.coords.latitude;
      mapView(lng, lat);
    });
  }, [posts]);

  useEffect(() => {
    const username = localStorage.getItem("name")
    if (username !== null) {
      setIsLogined(true);
    }
  }, []);

  const logout = () => {
    localStorage.removeItem("name");
    location.reload()
  };

  /* 上記の GeoJSON オブジェクトの各機能について: */
  // 投稿一覧を取得する関数
  const getPosts = () => {
    axios.get("/api/get_posts").then((res) => {
      const json = res.data;
      setPosts(json.posts);
    });
  };

  useEffect(() => {
    getPosts();
  }, []);

  useEffect(() => {
    const pins = [];

    for (let p of posts) {
      pins.push({
        type: "Feature",
        geometry: {
          type: "Point",
          coordinates: [p.lng, p.lat],
        },
        post_id: p.id,
        favorite: p.favorite,
      });
    }

    let stores = {
      type: "FeatureCollection",
      features: pins,
    };

    stores.features.forEach((store, i) => {
      store.geometry.id = i;
    });

    console.log(stores);

    if (pageIsMounted && stores) {
      Map.on("load", () => {
        // Map.addSource('places', {
        //   'type': 'geojson',
        //   'data': stores
        // });

        for (const marker of stores.features) {
          /* マーカーの div 要素を作成します。 */
          const el = document.createElement("div");
          /* マーカーに一意の「id」を割り当てます。 */
          el.id = `marker-${marker.geometry.id}`;
          /* スタイリングのために各マーカーに `marker` クラスを割り当てます。 */

          if (marker.favorite < 3) {
            el.className = "marker-green";
          } else if (marker.favorite < 5) {
            el.className = "marker-yellow";
          } else {
            el.className = "marker-red";
          }

          /**
           * div 要素を使用してマーカーを作成する
           * 上記で定義し、マップに追加します。
           **/

          new mapboxgl.Marker(el, { offset: [0, -23] })
            .setLngLat(marker.geometry.coordinates)
            .addTo(Map);

          /**
           * 要素を聞いてクリックしたら、次の 3 つのことを行います。
           * 1.ポイントに飛ぶ
           * 2. 他のすべてのポップアップを閉じ、クリックされたストアのポップアップを表示します
           * 3. サイドバーのリストを強調表示します (他のすべてのリストの強調表示を削除します)
           **/
          el.addEventListener("click", (e) => {
            location.href = `posts/${marker.post_id}`;

            // /* ポイントに飛ぶ */
            // flyToStore(marker);
            // /* 他のすべてのポップアップを閉じ、クリックされたストアのポップアップを表示します*/
            // createPopUp(marker);
            // /* サイドバーのハイライト リスト */
            // const activeItem = document.getElementsByClassName('active');
            // e.stopPropagation();
            // if (activeItem[0]) {
            //   activeItem[0].classList.remove('active');
            // }
          });
        }
      });
    }
  }, [Map, posts]);

  /**
   * すべての店舗リストの地図にマーカーを追加します。
  

  function flyToStore(currentFeature) {
    Map.flyTo({
      center: currentFeature.geometry.coordinates,
      zoom: 15,
    });
  }

  /**
   * Mapbox GL JS `Popup` を作成します。
   **/
  function createPopUp(currentFeature) {
    const popUps = document.getElementsByClassName("mapboxgl-popup");
    if (popUps[0]) popUps[0].remove();
    const popup = new mapboxgl.Popup({ closeOnClick: false })
      .setLngLat(currentFeature.geometry.coordinates)
      .setHTML(`<h3>投稿</h3>`)
      .addTo(Map);
  }

  return (
    <>
      <div>
        <Head>
          <title>みんはざ：ホーム</title>
          <meta name="description" content="Generated by create next app" />
          <link rel="icon" href="/favicon.ico" />
          <link
            href="https://api.tiles.mapbox.com/mapbox-gl-js/v2.9.1/mapbox-gl.css"
            rel="stylesheet"
          />
        </Head>


        <div className="bg-lime-700 content-center p-4 text-white text-center fixed top-0 w-full">
          <a className="text-white m-5">Safe City</a>
        </div>

        
        {/* <main className={styles.main}> */}
        <main className="flex flex-col w-screen items-center">
          <div
            id="map"
            className="mt-10 bg-sky-300 w-screen h-screen left-0 bottom-5 border-2 border-gray-700 rounded-xl"
          />
        </main>
        <script src="https://api.tiles.mapbox.com/mapbox-gl-js/v2.9.1/mapbox-gl.js"></script>

        <footer className="bg-lime-700 content-center w-full p-4 text-white text-center fixed bottom-0">
          <Link href="/post">
            <button className="h-auto w-auto mx-5 text-white">
              投稿する
            </button>
          </Link>
          <Link href="/postview">
            <button className="h-auto w-auto mx-5 text-white">
              投稿一覧
            </button>
          </Link>
          <button className="h-auto w-auto mx-5">マップ</button>

          {isLogined && (
            <button onClick={logout}>
              ログアウト
            </button>
          )}
        </footer>
      </div>
    </>
  );
}
