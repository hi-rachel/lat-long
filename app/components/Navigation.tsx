import Link from "next/link";

const Navigation = () => {
  return (
    <div className="flex justify-betweens gap-14 text-lg font-bold mb-2">
      <div>Spot Logo</div>
      <div className="flex gap-6">
        <Link href={"https://lat-long.vercel.app/"}>
          <div>주소, 위도 경도 찾기</div>
        </Link>
        <div>
          <Link href={"https://www.slam-talk.site/map"} target="_blank">
            농구장 지도
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Navigation;
