import { useRouter } from 'next/router';
export default function Name() {
    const router = useRouter();
    console.log(router.query);
    return <h1>商品{router.query.name}のページです</h1>;
  }