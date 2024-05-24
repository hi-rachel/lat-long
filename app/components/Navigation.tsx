"use client";

import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { FaMagnifyingGlassLocation } from "react-icons/fa6";

const Navigation = () => {
  const pathname = usePathname();
  const [activeLink, setActiveLink] = useState("");

  useEffect(() => {
    setActiveLink(pathname);
  }, [pathname]);

  const links = [
    { href: "/", label: "주소, 위도 경도 찾기" },
    {
      href: "https://www.slam-talk.site/map",
      label: "농구장 지도",
      external: true,
    },
  ];

  return (
    <div className="p-5 pb-0 flex gap-14 font-bold mb-2 border-b border-gray">
      <div className="flex gap-2 text-sky-500">
        <div className="mt-1">
          <FaMagnifyingGlassLocation aria-label="Find Spot" size={22} />
        </div>
        <div className="hidden md:block text-lg">Find Spot</div>
      </div>

      <div className="flex gap-6">
        {links.map((link) => (
          <Link
            href={link.href}
            key={link.label}
            target={link.external ? "_blank" : "_self"}
            className="relative"
          >
            <div
              className={`${
                activeLink === link.href ? "border-b-2 border-sky-500" : ""
              }  `}
            >
              <div className="hover:bg-gray-200 hover:rounded-md mb-1 p-1 text-md md:text-lg text-wrap">
                {link.label}
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default Navigation;
