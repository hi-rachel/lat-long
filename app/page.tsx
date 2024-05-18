import KakaoMap from "./components/KakaoMap";

export default function Home() {
  return (
    <main className="p-5">
      <div>
        <h1 className="text-xl font-semibold pb-4">
          지도로 주소, 위도 경도 찾기
        </h1>
      </div>
      <KakaoMap />
    </main>
  );
}
