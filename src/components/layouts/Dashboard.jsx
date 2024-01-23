import React, { useState, useEffect } from "react";
import Navbar from "./Navbar";
import Sidebar from "./Sidebar";

const Dashboard = ({ children }) => {
  const [isMobile, setIsMobile] = useState(true);
  const [isOpen, setIsOpen] = useState(false);

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  useEffect(() => {
    const checkScreenWidth = () => {
      if (window.innerWidth < 768) {
        setIsMobile(true);
      } else {
        setIsMobile(false);
      }
    };

    // Check screen width on component mount
    checkScreenWidth();

    // Attach event listener for changes in screen width
    window.addEventListener("resize", checkScreenWidth);

    // Remove event listener on component unmount
    return () => {
      window.removeEventListener("resize", checkScreenWidth);
    };
  }, []);

  return (
    <div className="">
      <Navbar className="" />

      {isMobile ? (
        <button
          onClick={toggleSidebar}
          className={`${isOpen ? "right-0" : "left-0"}
     bg-black text-white fixed top-[69px] w-15 py-3 px-4 mr-1 h-15 z-50 transition-all ease-in-out`}
        >
          {isOpen ? (
            "X"
          ) : (
            <svg
              class="w-5 h-6 text-gray-800 dark:text-white"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 17 14"
            >
              <path
                stroke="currentColor"
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M1 1h15M1 7h15M1 13h15"
              />
            </svg>
          )}
        </button>
      ) : (
        <Sidebar />
      )}

      {isOpen ? <Sidebar isOpen openSidebar={setIsOpen} /> : null}

      <div
        className=" px-10 py-24 sm:ml-64 transition-all ease-in-out"
        // className={`sm:px-10 sm:py-24`}
      >
        {children}
      </div>
    </div>
  );
};

export default Dashboard;
