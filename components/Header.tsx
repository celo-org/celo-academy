import { useUser } from "@/context/userContext";
import useIsMobile from "@/hooks/useIsMobile";
import { Bars4Icon, XCircleIcon } from "@heroicons/react/24/solid";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import Link from "next/link";
import { useRouter } from "next/router";
import { useState } from "react";

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const isMobile = useIsMobile();

  const router = useRouter();
  const { user } = useUser();

  const toggleMenu = () => {
    console.log("menuOpen", menuOpen);
    setMenuOpen(!menuOpen);
  };

  return (
    <>
      {isMobile && (
        <div
          id="menu"
          className={`fixed z-50 flex flex-col justify-start items-start py-7 px-5 bg-white duration-100 ${
            menuOpen ? "w-screen h-screen opacity-100" : "w-0 h-0 opacity-0"
          }`}
        >
          <XCircleIcon
            className="w-8 h-8"
            stroke="white"
            onClick={() => {
              toggleMenu();
            }}
          />
          <div className="flex flex-col text-black text-center text-xl font-light space-y-3 mt-8 w-full">
            <Link href="/" className="flex items-center">
              <span className="self-center text-2xl font-bold whitespace-nowrap">
                Celo Academy
              </span>
            </Link>

            <ul className="font-medium flex items-start flex-col w-full mt-20">
              <ConnectButton
                showBalance={{ smallScreen: false, largeScreen: false }}
              />
              {(!user || !user.name) && (
                <div className=" mt-5">
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      router.push("/signup");
                    }}
                    className="button"
                  >
                    Sign Up
                  </button>
                </div>
              )}
            </ul>
          </div>
        </div>
      )}
      <nav className="bg-white border-gray-200">
        <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4">
          <Link href="/" className="flex items-center">
            <span className="self-center text-2xl font-bold whitespace-nowrap">
              Celo Academy
            </span>
          </Link>
          <button
            type="button"
            onClick={() => {
              toggleMenu();
            }}
            className="inline-flex items-center p-2 ml-3 text-sm text-gray-500 rounded-lg md:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600"
          >
            <span className="sr-only">Open main menu</span>
            <Bars4Icon strokeWidth={500} className="w-6 h-6" stroke="white" />
          </button>
          <div className="hidden w-full md:block md:w-auto" id="navbar-default">
            <ul className="font-medium flex items-center flex-col p-4 md:p-0 mt-4 border border-gray-100 rounded-lg bg-gray-50 md:flex-row md:space-x-8 md:mt-0 md:border-0 md:bg-white">
              <li>
                <a
                  href="#"
                  className="block py-2 pl-3 pr-4 text-black rounded md:p-0 "
                  aria-current="page"
                >
                  Home
                </a>
              </li>
              <ConnectButton
                showBalance={{ smallScreen: true, largeScreen: false }}
              />
              {(!user || !user.name) && (
                <div className="w-32 ml-3">
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      router.push("/signup");
                    }}
                    className="button"
                  >
                    Sign Up
                  </button>
                </div>
              )}
            </ul>
          </div>
        </div>
      </nav>
    </>
  );
}
