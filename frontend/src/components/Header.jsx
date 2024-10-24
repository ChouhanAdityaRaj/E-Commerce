import React, {useEffect, useState} from 'react'
import { Link, NavLink } from 'react-router-dom';
import { SlMagnifier, SlBasket, SlUser } from "react-icons/sl"
import { useSelector } from "react-redux";
import { SearchBar, AccountNavSidebar } from "../components";

function Header() {

  const authStatus = useSelector((state) => state.auth.status);
  const [isOpen, setIsOpen] = useState(false);
  const [navBackground, setNavBackground] = useState(false);
  const [isSearchBarOpen, setIsSearchBarOpen] = useState(false);
  const [isAccountSidebarOpen, setIsAccountSidebarOpen] = useState(false);

  useEffect(() => {
    const activeHeaderOn = ["/", "/collections"]; 
    if(!activeHeaderOn.includes(window.location.pathname)){
      setNavBackground(true);
    } else {
      window.addEventListener('scroll', handleScroll);
      return () => {
        window.removeEventListener('scroll', handleScroll);
      };
    }
  }, [window.location.href])
  
  const handleScroll = () => {
    if (window.scrollY > 50) {
      setNavBackground(true);
    } else {
      setNavBackground(false);
    }
  };

  

  
  const toggleAccountNavSidebar = () => {
    isAccountSidebarOpen ? setNavBackground(false) : setNavBackground(true)
    setIsSearchBarOpen(false)
    setIsOpen(false)
    setIsAccountSidebarOpen(!isAccountSidebarOpen);
  };

  const toggleSearchBar = () => {
    setIsOpen(false)
    setIsAccountSidebarOpen(false)
    setIsSearchBarOpen(!isSearchBarOpen)
  }

  const toggleBurgerMenu = () => {
    setIsSearchBarOpen(false);
    setIsAccountSidebarOpen(false);
    setIsOpen(!isOpen)
  }



  const navigationMenu = [
    {
      name: "Home",
      path: "/",
      activeStatus: true
    },
    {
      name: "Shop",
      path: "/shop",
      activeStatus: false
    },
    {
      name: "Collection",
      path: "/collections",
      activeStatus: true
    },
    {
      name: "About",
      path: "/about",
      activeStatus: true
    }
  ]

  return (
    <nav className={`transition   duration-300  ease-linear w-full fixed z-10 bg-transparent text-white ${isOpen ? "bg-white hover:text-black" : "lg:hover:bg-white" } md:hover:text-black lg:hover:shadow-sm hover:shadow-white ${navBackground ? 'bg-white' : 'bg-transparent'} ${isSearchBarOpen? "bg-white" : ""}`}>
      <div className={` container mx-auto flex items-center py-2 px-4 justify-between  ${!isOpen ? "bg-transparent": ""} `}>
        {/* Logo */}
        <div className="flex items-center">
          <Link to="/" className={`text-2xl mx-2 font-bold ${navBackground || isSearchBarOpen || isOpen ? 'text-black' : ''}`}>Heritage Clothiers</Link>
        </div>

        {/* Desktop Navigation */}
        <div className="hidden md:flex flex-grow justify-center space-x-7">
          {navigationMenu.map((item, i) => (
            item.activeStatus ? 
            <NavLink key={i} to={item.path} className={({isActive}) => ` hover:text-gray-600 border-black ${navBackground || isSearchBarOpen ? 'text-black' : ''} ${isActive ? "font-semibold" : ""}`}>{item.name}</NavLink>
            :null
          ))}
        </div>

        {/* Mobile Burger Menu Button */}
        <div className="md:hidden flex items-center">
        <button onClick={toggleSearchBar} className={` mx-3 pt-1 ${navBackground || isSearchBarOpen || isOpen ? 'text-black' : ''}`}><SlMagnifier/></button>
          <button onClick={toggleBurgerMenu} className="text-white focus:outline-none">
            <svg className={`w-6 h-6 ${navBackground || isSearchBarOpen || isOpen ? 'text-black' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7" />
            </svg>
          </button>
        </div>
 
        {/* Desktop Cart and Account Section */}
        <div className="hidden md:flex items-center space-x-4 mr-3">

        <button onClick={toggleSearchBar} className={` mx-3 pt-1 ${navBackground || isSearchBarOpen || isOpen ? 'text-black' : ''}`}><SlMagnifier/></button>

          {!authStatus && (<Link to="/login" className={`hover:text-gray-600 ${navBackground || isSearchBarOpen ? 'text-black' : ''}`}>Login</Link>)}
          {!authStatus && (<Link to="/signup" className={`hover:text-gray-600 ${navBackground || isSearchBarOpen ? 'text-black' : ''}`}>Sign Up</Link>)}

          {authStatus && (<Link to="/cart" className={`hover:text-gray-600 ${navBackground || isSearchBarOpen ? 'text-black' : ''}`}><SlBasket/></Link>)} 
          {authStatus && (<button onClick={toggleAccountNavSidebar} className={`hover:text-gray-600 ${navBackground || isSearchBarOpen ? 'text-black' : ''} ${isAccountSidebarOpen && "text-xl text-indigo-500"}`}><SlUser/></button>)}
        </div>
      </div>

      {/* Mobile Menu */}
      <div aria-disabled className={`md:hidden border-b-2 transition-all duration-200 ease-in-out transform ${isOpen ? 'block opacity-100' : 'hidden opacity-0'} ${isSearchBarOpen ? 'hidden' : 'block'} ${navBackground || isSearchBarOpen ? 'text-black' : ''} bg-white text-black  absolute w-full overflow-hidden`}>
        {navigationMenu.map((item, i) => (
          item.activeStatus ?
          <Link key={i} to={item.path} className="block px-4 py-2 hover:bg-slate-100 text-center text-2xl font-semibold">{item.name}</Link>
          : null
        ))}
        
        {!authStatus && (<Link to="/login" className="block px-4 py-2 hover:bg-slate-100 text-center text-2xl font-semibold">Login</Link>)}
        {!authStatus && (<Link to="/signup" className="block px-4 py-2 hover:bg-slate-100 text-center text-2xl font-semibold">Sign Up</Link>)}

        {authStatus && (<Link to="/cart" className="block px-4 py-2 hover:bg-slate-100 text-center text-2xl font-semibold">Cart</Link>)}
        {authStatus && (<button onClick={toggleAccountNavSidebar} className="w-full block px-4 py-2 hover:bg-slate-100 text-center text-2xl font-semibold">Account</button>)}
      </div>


      {/* Search Dropdown */}
      <SearchBar isSearchBarOpen={isSearchBarOpen} setIsSearchBarOpen={setIsSearchBarOpen}/>

      {/* Account Navigation Sidebar */}
      <AccountNavSidebar isAccountSidebarOpen={isAccountSidebarOpen} setIsAccountSidebarOpen={setIsAccountSidebarOpen}/>
    </nav>
  );
}

export default Header