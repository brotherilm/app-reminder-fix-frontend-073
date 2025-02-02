import { Html, Head, Main, NextScript } from "next/document";

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        {/* Menambahkan link untuk font Manrope */}
        <link
          href="https://fonts.googleapis.com/css2?family=Roboto:wght@300;400;500;700&display=swap"
          rel="stylesheet"
        />
      </Head>
      <body className="min-h-screen w-full bg-custom-gradient bg-cover text-white ">
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
