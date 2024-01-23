import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Logo from "./Logo";
import { FaSignOutAlt } from "react-icons/fa";
import { setMessage } from "../../redux/user/userSlice";
import { Dropdown } from "flowbite-react";

const Navbar = () => {
  const { currentUser } = useSelector((state) => state.user);
  console.log(currentUser);
  const dispatch = useDispatch();
  const signout = () => {
    localStorage.removeItem("token");
    dispatch(setMessage("logged out successfully"));
  };
  return (
    <nav className="fixed flex justify-between top-0 z-50 w-screen  pr-7  border-b border-gray-600 bg-slate-800 h-[70px] ">
      <Logo />
      <div className="w-full flex justify-end place-items-center h-full ">
        <Dropdown
          className="w-[100px]"
          label=""
          dismissOnClick={false}
          renderTrigger={() => (
            <img
              className="w-10 h-10 rounded-full bg-orange-600 cursor-pointer"
              src="https://flowbite.com/docs/images/people/profile-picture-5.jpg"
              alt="user photo"
            />
          )}
        >
          <Dropdown.Item
            className="w-full"
            icon={FaSignOutAlt}
            onClick={() => {
              signout();
            }}
          >
            Sign out
          </Dropdown.Item>
        </Dropdown>
      </div>
    </nav>
  );
};

export default Navbar;
