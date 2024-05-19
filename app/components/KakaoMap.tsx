"use client";

import { useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  Map,
  MapMarker,
  MapTypeControl,
  ZoomControl,
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
  const [initialLocation, setInitialLocation] = useState({
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

  const handleClickMap = (
    _: kakao.maps.Map,
    mouseEvent: MouseEventWithLatLng
  ) => {
    const latlng = mouseEvent.latLng;
    const lat = latlng.getLat();
    const lng = latlng.getLng();
    setPosition({
      lat,
      lng,
    });
    getAddressFromCoords(lat, lng)
      .then(({ address, roadAddress }) => {
        // 도로명 주소가 있으면 그 값을, 없으면 지번 주소를 사용
        const finalAddress = roadAddress || address;
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
            setPosition({
              lat: y,
              lng: x,
            });
            const kakaoPosition = new window.kakao.maps.LatLng(y, x);

            map.panTo(kakaoPosition);
          }
        } else if (status === window.kakao.maps.services.Status.ZERO_RESULT) {
          toast.warn("검색 결과가 존재하지 않습니다.");
          //   alert("검색 결과가 존재하지 않습니다.");
        } else if (status === window.kakao.maps.services.Status.ERROR) {
          toast.error("검색 중 오류가 발생했습니다.");
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

  const handleCopyAddress = async (text: string) => {
    if (text) {
      try {
        await navigator.clipboard.writeText(text);
        toast.success(`${text} 복사되었습니다.`);
      } catch (copyError) {
        toast.error("복사 중 오류가 발생했습니다.");
        console.error("복사 중 오류 발생:", copyError);
      }
    }
  };

  const handleCopyLatLng = async (position: number) => {
    if (position) {
      try {
        await navigator.clipboard.writeText(position.toString());
        toast.success(`${position} 복사되었습니다.`);
      } catch (copyError) {
        toast.error("복사 중 오류가 발생했습니다.");
        console.error("복사 중 오류 발생:", copyError);
      }
    }
  };

  return (
    <>
      <div className="bg-white z-10 flex sm:w-full items-center justify-center rounded-md bg-background p-1 shadow-lg mb-4">
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
          <IoSearchSharp size={24} className="text-sky-500 hover:text-black" />
        </button>
      </div>
      <div>
        <Map
          className="relative w-full h-[500px]"
          id="map"
          center={initialLocation.center}
          level={6}
          onCreate={setMap}
          onClick={handleClickMap}
        >
          {position && <MapMarker position={position} />}
          <MapTypeControl position="BOTTOMLEFT" />
          <ZoomControl position="RIGHT" />
        </Map>
        <ToastContainer />
        <div className="mt-2">
          <div
            className="py-2 cursor-pointer"
            onClick={(e) => {
              e.preventDefault();
              handleCopyAddress(clickPositionAddress);
            }}
          >
            <p>주소: {clickPositionAddress}</p>
          </div>
          <div className="py-2">
            {position && (
              <p>
                클릭한 위치의 위도는{" "}
                <span
                  id="latitude"
                  className="cursor-pointer"
                  tabIndex={0}
                  onClick={(e) => {
                    e.preventDefault();
                    handleCopyLatLng(position.lat);
                  }}
                >
                  {position.lat}
                </span>{" "}
                이고, 경도는{" "}
                <span
                  id="longitude"
                  className="cursor-pointer"
                  tabIndex={0}
                  onClick={(e) => {
                    e.preventDefault();
                    handleCopyLatLng(position.lng);
                  }}
                >
                  {position.lng}
                </span>{" "}
                입니다.
              </p>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default KakaoMap;
