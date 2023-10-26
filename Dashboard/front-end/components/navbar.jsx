"use client";

import React, { useState } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faHouse,
  faStore,
  faUser,
  faCartArrowDown,
  faTruckFast,
  faBullhorn,
  faGear,
  faCircleInfo,
  faBell,
  faRightFromBracket,
} from "@fortawesome/free-solid-svg-icons";

import Logo from "~/logo.png";
import Login from "~/image/login.jpg";
import { useLogoutUserMutation } from "@/redux/api/authApi";
import { CustomSpinner } from ".";

const navItemData = {
  menu: [
    { url: "/dashboard", title: "Dashboard", icon: faHouse },
    { url: "/product", title: "Product", icon: faStore },
    { url: "/user", title: "User", icon: faUser },
    { url: "/order", title: "Order", icon: faCartArrowDown },
    { url: "/shipping", title: "Shipping", icon: faTruckFast },
    { url: "/ads", title: "Ads", icon: faBullhorn },
  ],
  others: [
    { url: "/setting", title: "Setting", icon: faGear },
    { url: "/help", title: "Help", icon: faCircleInfo },
  ],
};

const styleConfig = {
  navItem:
    "flex gap-5 items-center w-fit lg:w-full lg:w-auto p-4 text-sm font-semibold rounded-4xl transition-all ",
  activeItem: "bg-[#c4ccff6e] text-[#5a67bad5] ",
};

function Navbar() {
  const pathName = usePathname();

  const [logout, { isLoading }] = useLogoutUserMutation();

  return (
    <>
      {/* ========= HEADER ========= */}
      <div className="h-[80px] w-screen bg-white fixed  z-[998] pr-12 flex justify-end items-center gap-6 shadow">
        <div className="flex items-center p-4 gap-3">
          <Image
            src={Login}
            alt="Avatar User"
            className="h-10 w-10 rounded-full object-cover"
          />
          Le Tuans
        </div>
        <div className="text-xl text-gray-400">
          <FontAwesomeIcon icon={faBell} />
        </div>
      </div>

      {/* ========= LEFT NAV ========= */}
      <div className=" h-screen flex flex-col w-[70px] lg:w-[18vw] fixed left-0 top-0 z-[999] bg-[#ededed88] shadow-xl">
        {/* ========= LOGO ========= */}
        <Link
          href="/"
          className="flex items-center gap-2 m-4 text-[#5a67bad5] font-bold text-2xl whitespace-nowrap"
        >
          <Image src={Logo} alt="Logo" className="w-[50px]" />
          <div className="hidden lg:block">Le Tuans</div>
        </Link>

        {/* ========= LIST ITEM ========= */}
        <div className="h-full text-xs lg:text-md overflow-y-auto overflow-x-hidden mt-3 p-5 lg:px-[10%] text-gray-600 flex flex-col items-center lg:items-start gap-2">
          {/* ========= Menu ========= */}
          <div>MENU</div>
          {navItemData.menu.map((item, i) => {
            return (
              <Link
                key={i}
                href={item.url}
                className={
                  styleConfig.navItem +
                  (pathName.includes(item.url)
                    ? styleConfig.activeItem
                    : " hover:bg-gray-200")
                }
              >
                <FontAwesomeIcon icon={item.icon} />
                <div className="hidden lg:block">{item.title}</div>
              </Link>
            );
          })}

          {/* ========= Others ========= */}
          <div className="mt-6">OTHERS</div>
          {navItemData.others.map((item, i) => {
            return (
              <Link
                key={i}
                href={item.url}
                className={
                  styleConfig.navItem +
                  (pathName.includes(item.url)
                    ? styleConfig.activeItem
                    : " hover:bg-gray-200")
                }
              >
                <FontAwesomeIcon icon={item.icon} />
                <div className="hidden lg:block">{item.title}</div>
              </Link>
            );
          })}
          <button
            onClick={logout}
            className={styleConfig.navItem + " hover:bg-gray-200"}
          >
            <FontAwesomeIcon icon={faRightFromBracket} />
            <div className="hidden lg:block">Logout</div>
          </button>
          {isLoading && <CustomSpinner className={"h-10 w-10"} />}
        </div>
      </div>
    </>
  );
}

export default Navbar;
