import React, {useEffect, useState} from 'react'
import { Link, NavLink } from 'react-router-dom';
import { SlMagnifier, SlBasket, SlUser } from "react-icons/sl"
import { useSelector } from "react-redux"

function Header() {

  const [isOpen, setIsOpen] = useState(false);
  const authStatus = useSelector((state) => state.auth.status);

  const [navBackground, setNavBackground] = useState(false);

  const handleScroll = () => {
    if (window.scrollY > 50) {
      setNavBackground(true);
    } else {
      setNavBackground(false);
    }
  };

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

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
      name: "Sale",
      path: "/sale",
      activeStatus: true
    },
    {
      name: "About",
      path: "/about",
      activeStatus: true
    }
  ]

  return (
    <nav className={`transition duration-500 ease-in-out w-full fixed z-10 bg-transparent text-white hover:bg-white hover:text-black hover:shadow-sm hover:shadow-white ${navBackground ? 'bg-white' : 'bg-transparent'}`}>
      <div className="container mx-auto flex items-center py-2 px-4 justify-between">
        {/* Logo */}
        <div className="flex items-center">
          <Link to="/" className={`text-2xl mx-2 font-bold ${navBackground ? 'text-black' : ''}`}>Heritage Clothiers</Link>
        </div>

        {/* Desktop Navigation */}
        <div className="hidden md:flex flex-grow justify-center space-x-7">
          {navigationMenu.map((item, i) => (
            item.activeStatus ? 
            <NavLink key={i} to={item.path} className={({isActive}) => ` hover:text-gray-600 border-black ${navBackground ? 'text-black' : ''} ${isActive ? "font-semibold" : ""}`}>{item.name}</NavLink>
            :null
          ))}
        </div>

        {/* Mobile Burger Menu Button */}
        <div className="md:hidden flex items-center">
          <button onClick={() => setIsOpen(!isOpen)} className="text-white focus:outline-none">
            <svg className={`w-6 h-6 ${navBackground ? 'text-black' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7" />
            </svg>
          </button>
        </div>
 
        {/* Desktop Cart and Account Section */}
        <div className="hidden md:flex items-center space-x-4 mr-3">
          <Link to="/search" className={`hover:text-gray-600 mx-3 pt-1 ${navBackground ? 'text-black' : ''}`}><SlMagnifier/></Link>

          {!authStatus && (<Link to="/login" className={`hover:text-gray-600 ${navBackground ? 'text-black' : ''}`}>Login</Link>)}
          {!authStatus && (<Link to="/signup" className={`hover:text-gray-600 ${navBackground ? 'text-black' : ''}`}>Sign Up</Link>)}

          {authStatus && (<Link to="/cart" className={`hover:text-gray-600 ${navBackground ? 'text-black' : ''}`}><SlBasket/></Link>)}
          {authStatus && (<Link to="/account" className={`hover:text-gray-600 ${navBackground ? 'text-black' : ''}`}><SlUser/></Link>)}
        </div>
      </div>

      {/* Mobile Menu */}
      <div className={`md:hidden ${isOpen ? 'block' : 'hidden'}  bg-white text-black border-b-2 absolute w-full`}>
        {navigationMenu.map((item, i) => (
          item.activeStatus ?
          <Link key={i} to={item.path} className="block px-4 py-2 hover:bg-slate-100 text-center text-2xl font-semibold">{item.name}</Link>
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