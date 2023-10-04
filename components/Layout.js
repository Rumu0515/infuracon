export default function Layout({ children, title = 'default title' }) {
  return (
    <div className="flex justify-center items-center flex-col min-h-screen text-white font-mono bg-gray-800">
      <head>
        <title>{title}</title>
      </head>
      <main className="flex flex-1 justify-center items-center w-screen flex-col">{children}</main>
      <footer className="mb-4 w-full h-6 flex justify-center items-center text-gray-500 text-sm"></footer>
    </div>
  );
}
