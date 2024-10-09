import React from "react";
import { NavLink, Outlet } from "react-router-dom";
import { LuUsers } from "react-icons/lu";
import { FaTshirt } from "react-icons/fa";
import { BiSolidCategoryAlt } from "react-icons/bi";
import { BsGraphUp, BsCart3 } from "react-icons/bs";

function AdminNavbarLayout() {
  const adminNavigation = [
    {
      name: "Users",
      path: "users",
      icon: <LuUsers />,
      activeStatus: true,
    },
    {
      name: "Products",
      path: "products",
      icon: <FaTshirt />,
      activeStatus: true,
    },
    {
      name: "Categories",
      path: "categorys",
      icon: <BiSolidCategoryAlt />,
      activeStatus: true,
    },
    {
      name: "Sales",
      path: "sales",
      icon: <BsGraphUp />,
      activeStatus: true,
    },
    {
      name: "Orders",
      path: "orders",
      icon: <BsCart3 />,
      activeStatus: true,
    },
  ];

  return (
    <>
      <div className="h-screen w-full flex fixed">
        {/* Left Side Navbar */}
        <aside className="w-64 bg-gray-100 p-4 ">
          <div className="mb-8 text-xl font-bold">Heritage Clothiers</div>
          <nav className="space-y-4">
            {adminNavigation?.map((nav, i) =>
              nav.activeStatus ? (
                <NavLink
                  key={i}
                  to={nav.path}
                  className={({ isActive }) =>
                    `px-5 font-semibold text-lg block p-2 rounded ${
                      isActive ? "bg-red-400 text-white" : ""
                    } flex items-center justify-start`
                  }
                >
                  <span className=" inline-block mr-3">{nav.icon}</span>
                  {nav.name}
                </NavLink>
              ) : null
            )}
          </nav>
        </aside>

        <div className="flex-1 flex flex-col">
          <header className="flex items-center justify-center p-4 bg-white shadow">
            <div className="text-2xl font-semibold">Admin Panel</div>
          </header>

          <main className="flex-1 bg-gray-50 p-5 overflow-scroll">
             <Outlet/>
          </main>
        </div>
      </div>

    </>
  );
}

export default AdminNavbarLayout;
