"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { useState, useEffect } from "react";

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
    <div className="p-5 pb-0 flex gap-14 text-lg font-bold mb-2 border-b border-gray">
      <div>Spot Logo</div>
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
              <div className="hover:bg-gray-200 hover:rounded-md mb-1 p-1">
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
