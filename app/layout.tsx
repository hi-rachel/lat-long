import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Script from "next/script";
import { GoogleTagManager } from "@next/third-parties/google";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "지도로 원하는 주소, 위도 경도 찾기",
  description: "위도, 경도 찾기 사이트",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <Script
          strategy="beforeInteractive"
          src={`//dapi.kakao.com/v2/maps/sdk.js?appkey=${process.env.NEXT_PUBLIC_MAP_KEY}&autoload=false&libraries=services,clusterer`}
        />
        <meta
          name="google-site-verification"
          content="gPP7sY1hto9tigiWfmR9RgG3B7_Ts2S-SLsfxt5X-Xo"
        />
      </head>
      <GoogleTagManager gtmId="G-52FKEMJECN" />
      <body className={inter.className}>{children}</body>
    </html>
  );
}
