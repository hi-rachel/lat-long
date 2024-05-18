"use client";

import { useState } from "react";
import {
  Map,
  MapMarker,
  MapTypeControl,
  ZoomControl,
  CustomOverlayMap,
} from "react-kakao-maps-sdk";
import { getAddressFromCoords } from "@/utils/getUserLocation";
import { IoSearchSharp } from "react-icons/io5";

export interface LatLng {
  getLat: () => number;
  getLng: () => number;
}

export interface MouseEventWithLatLng {
  latLng: LatLng;
}

const KakaoMap = () => {
  const [map, setMap] = useState<any>();
  const [coord, setCoord] = useState("");
  const [location, setLocation] = useState({
    center: {
      lat: 37.5737,
      lng: 127.0484,
    },
  });
  const [position, setPosition] = useState<{
    lat: number;
    lng: number;
  } | null>(null);
  const [clickPositionAddress, setClickPositionAddress] = useState<string>("");
  const [searchKeyword, setSearchKeyword] = useState<string>("");

  const handleClickReport = (
    _: kakao.maps.Map,
    mouseEvent: MouseEventWithLatLng
  ) => {
    const latlng = mouseEvent.latLng;
    const lat = latlng.getLat();
    const lng = latlng.getLng();
    setCoord(
      `클릭한 위치의 위도는 ${latlng.getLat()} 이고, 경도는 ${latlng.getLng()} 입니다`
    );
    console.log(coord);
    setPosition({
      lat,
      lng,
    });
    getAddressFromCoords(lat, lng)
      .then(({ address, roadAddress }) => {
        // 도로명 주소가 있으면 그 값을, 없으면 지번 주소를 사용
        const finalAddress = roadAddress || address;
        console.log(address);
        console.log(roadAddress);
        setClickPositionAddress(finalAddress);
      })
      .catch((error) => {
        console.error("주소 정보를 가져오는데 실패했습니다.", error);
      });
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchKeyword(e.target.value);
  };

  const handleSearch = () => {
    if (!map) return;

    const ps = new window.kakao.maps.services.Places();
    ps.keywordSearch(
      searchKeyword,
      (data: any, status: any) => {
        if (status === window.kakao.maps.services.Status.OK) {
          const firstResult = data[0];
          if (firstResult) {
            const { x, y } = firstResult;
            const kakaoPosition = new window.kakao.maps.LatLng(y, x);
            map.panTo(kakaoPosition);
          }
        } else if (status === window.kakao.maps.services.Status.ZERO_RESULT) {
          alert("검색 결과가 존재하지 않습니다.");
        } else if (status === window.kakao.maps.services.Status.ERROR) {
          alert("검색 결과 중 오류가 발생했습니다.");
        }
      },
      { location: map.getCenter() }
    );
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  return (
    <div>
      <Map
        className="relative w-full h-[500px]"
        id="map"
        center={location.center}
        level={6}
        onCreate={setMap}
        onClick={handleClickReport}
      >
        <div className="absolute left-1/2 top-40 z-10 flex w-4/5 max-w-lg -translate-x-1/2 transform items-center justify-center rounded-md bg-background p-1 shadow-md">
          <input
            type="text"
            placeholder="장소 검색"
            className="flex-grow rounded-md border-0 p-2 focus:outline-none focus:ring-0"
            value={searchKeyword}
            onChange={handleSearchChange}
            onKeyDown={handleKeyDown}
          />
          <button
            aria-label="Search"
            type="button"
            onClick={handleSearch}
            className="ml-2 mr-2 flex h-full items-center justify-center rounded-md focus:outline-none"
          >
            <IoSearchSharp
              size={20}
              className="text-gray-400 hover:text-black"
            />
          </button>
        </div>
        {position && (
          <>
            <MapMarker position={position} clickable />
            <CustomOverlayMap
              key={`overlay__${position.lat}-${position.lng}`}
              position={position}
              yAnchor={2.6}
              xAnchor={0.67}
            >
              <div className="ml-12 flex items-center rounded border-1 border-primary bg-white px-2 py-1 text-sm font-medium text-black shadow-sm">
                spot
              </div>
            </CustomOverlayMap>
          </>
        )}
        <MapTypeControl position="BOTTOMLEFT" />
        <ZoomControl position="RIGHT" />
      </Map>
      <div>
        <p className="py-2">주소: {clickPositionAddress}</p>
        <p>{coord}</p>
      </div>
    </div>
  );
};

export default KakaoMap;
