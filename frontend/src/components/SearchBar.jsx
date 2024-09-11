import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom"
import { SlMagnifier } from "react-icons/sl"
import { apiHandler } from "../utils";
import productService from "../services/product";
import product from "../services/product";


function SearchBar({isSearchBarOpen = false, setIsSearchBarOpen}) {
  const navigate = useNavigate();

  const [searchQuery, setSearchQuery] = useState("");
  const [filteredSuggestions, setFilteredSuggestions] = useState([]);
  const [suggestionsList, setSuggestionsList] = useState([]);

  useEffect(() => {
    (async () => {
      const [response, error] = await apiHandler(productService.getAllProducts());
      
      if(response){
        const suggestionsArray = response.data
          .map((product) => product.productName)
          .filter((v, i, self) => i == self.indexOf(v));

          setSuggestionsList(suggestionsArray);
      }
    })()

  }, [])


  const handleInputChange = (e) => {
    const value = e.target.value;
    setSearchQuery(value);

    if (value.length > 0) {
      const filtered = suggestionsList.filter((suggestion) =>
        suggestion.toLowerCase().includes(value.toLowerCase())
      );

      if (!filtered.length) {
        setFilteredSuggestions([]);
        setIsNoSuggestionsResult(true);
      }

      if (filtered.length) {
        setFilteredSuggestions(filtered);
        setIsNoSuggestionsResult(false);
      }
    } else {
      setFilteredSuggestions([]);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault()
    setIsSearchBarOpen(false)
    navigate(`/product?search=${searchQuery}`);
        
  };

  const handleSearchOnClick = (suggestionSearchQuery) => {
    setIsSearchBarOpen(false)
    navigate(`/product?search=${suggestionSearchQuery}`);
        
  };

  return (
    <div className="relative text-black">
      <div className={`${isSearchBarOpen ? "block" : "hidden"} relative w-full max-w-lg mx-auto z-20 h-[25vh] overflow-hidden`}>
        <form onSubmit={handleSearch} className="flex">
          <input
            type="text"
            value={searchQuery}
            placeholder="Search..."
            className="w-full text-xl px-4 py-2 border-b-2 border-black focus:outline-none mt-10"
            onChange={handleInputChange}
          />
          <button type="submit" className=" inline-block relative top-4 right-5"><SlMagnifier className=""/></button>
        </form>
        {filteredSuggestions.length > 0 && (
          <ul className="absolute flex w-full max-w-lg mx-auto z-30 bg-white mt-4">
            {filteredSuggestions.map((suggestion, index) => (
              <li
                key={index}
                className="flex items-center mx-2 px-4 py-2 hover:font-semibold hover:underline cursor-pointer"
                onClick={() => handleSearchOnClick(suggestion)}
              >
                {suggestion}<SlMagnifier className="ml-2 text-sm"/>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

export default SearchBar;
