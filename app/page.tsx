import Footer from "./components/Footer";
import KakaoMap from "./components/KakaoMap";
import Navigation from "./components/Navigation";
import { FaMapMarkedAlt } from "react-icons/fa";

export default function Home() {
  return (
    <main>
      <Navigation />
      <div className="p-5">
        <div className="mb-4">
          <div className="flex gap-2 items-center">
            <FaMapMarkedAlt className="text-slate-700" size={24} />
            <p className="text-xl font-medium py-4">
              지도로 원하는 주소, 위도 경도 찾기
            </p>
          </div>
          <div>
            <p>
              장소 검색으로 원하는 위치로 이동한 후 지도를 클릭하면 해당 위치에
              마커가 생성되고 주소와 위도, 경도 정보를 알 수 있습니다.
            </p>
          </div>
        </div>
        <KakaoMap />
      </div>
      <Footer />
    </main>
  );
}
