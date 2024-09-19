import React from 'react'
import { NavLink } from 'react-router-dom'
import { CiLocationOn, CiShoppingCart, CiUser, CiHome } from "react-icons/ci";

function AccountNavSidebar({isAccountSidebarOpen, setIsAccountSidebarOpen}) {

    const navigations = [
        {
          name: "Profile",
          icon: <CiUser />,
          path: "/account/profile",
        },
        {
          name: "Orders",
          icon: <CiShoppingCart />,
          path: "/account/orders",
        },
        {
          name: "Addresses",
          icon: <CiLocationOn />,
          path: "/account/address",
        },
      ];

  return (
    <div
    className={`absolute left-0  w-56 border-t   bg-white  shadow-lg text-black transform transition-transform duration-300 ease-in-out
      ${isAccountSidebarOpen ? 'translate-x-0 opacity-100' : '-translate-x-full opacity-0 pointer-events-none'}`}
  >
    <h1 className='text-2xl text-center font-semibold my-1'>Account</h1>

    <ul className="flex flex-col space-y-1 p-2">
        {navigations.map((navigation, i) => (
      <li>
        <NavLink
          onClick={() => setIsAccountSidebarOpen(false)}
          to={navigation.path}
          className={({isActive}) => `${isActive && "bg-indigo-500 text-white"} hover:bg-indigo-400 hover:text-white px-5 py-2 overflow-hidden h-fit rounded-lg flex items-center`}
        >
          <span className='mr-2'>{navigation.icon}</span>
          <h3>{navigation.name}</h3>
        </NavLink>
      </li>
        ))}
    </ul>
  </div>
  )
}

export default AccountNavSidebar