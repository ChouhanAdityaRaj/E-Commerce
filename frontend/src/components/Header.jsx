import React, {useEffect, useState} from 'react'
import { Link, NavLink } from 'react-router-dom';
import { SlMagnifier, SlBasket, SlUser } from "react-icons/sl"
import { useSelector } from "react-redux"

function Header() {

  const [isOpen, setIsOpen] = useState(false);
  const authStatus = useSelector((state) => state.auth.status);

  const navigationMenu = [
    {
      name: "Home",
      path: "/",
      activeStatus: true
    },
    {
      name: "Shop",
      path: "/shop",
      activeStatus: true
    },
    {
      name: "About",
      path: "/about",
      activeStatus: true
    }
  ]

  return (
    <nav className=" sticky bg-white text-black border-b-2">
      <div className="container mx-auto flex items-center py-2 px-4 justify-between">
        {/* Logo */}
        <div className="flex items-center">
          <Link to="/" className="text-2xl mx-2 font-bold">ABCD</Link>
        </div>

        {/* Desktop Navigation */}
        <div className="hidden md:flex flex-grow justify-center space-x-4">
          {navigationMenu.map((item) => (
            item.activeStatus ? 
            <NavLink to={item.path} className={({isActive}) => `text-black hover:text-gray-600 border-black ${isActive ? "font-semibold" : ""}`}>{item.name}</NavLink>
            :null
          ))}
        </div>

        {/* Mobile Burger Menu Button */}
        <div className="md:hidden flex items-center">
          <button onClick={() => setIsOpen(!isOpen)} className="text-black focus:outline-none">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7" />
            </svg>
          </button>
        </div>
 
        {/* Desktop Cart and Account Section */}
        <div className="hidden md:flex items-center space-x-4 mr-3">
          <Link to="/search" className="hover:text-gray-600 mx-3 pt-1"><SlMagnifier/></Link>

          {!authStatus && (<Link to="/login" className="hover:text-gray-600">Login</Link>)}
          {!authStatus && (<Link to="/signup" className="hover:text-gray-600">Sign Up</Link>)}

          {authStatus && (<Link to="/cart" className="hover:text-gray-600"><SlBasket/></Link>)}
          {authStatus && (<Link to="/account" className="hover:text-gray-600"><SlUser/></Link>)}
        </div>
      </div>

      {/* Mobile Menu */}
      <div className={`md:hidden ${isOpen ? 'block' : 'hidden'}  bg-white text-black border-b-2 absolute w-full`}>
        {navigationMenu.map((item) => (
          item.activeStatus ?
          <Link to={item.path} className="block px-4 py-2 hover:bg-slate-100 text-center text-2xl font-semibold">{item.name}</Link>
          : null
        ))}
        
        {!authStatus && (<Link to="/login" className="block px-4 py-2 hover:bg-slate-100 text-center text-2xl font-semibold">Login</Link>)}
        {!authStatus && (<Link to="/signup" className="block px-4 py-2 hover:bg-slate-100 text-center text-2xl font-semibold">Sign Up</Link>)}

        {authStatus && (<Link to="/cart" className="block px-4 py-2 hover:bg-slate-100 text-center text-2xl font-semibold">Cart</Link>)}
        {authStatus && (<Link to="/account" className="block px-4 py-2 hover:bg-slate-100 text-center text-2xl font-semibold">Account</Link>)}
      </div>
    </nav>
  );
}

export default Header