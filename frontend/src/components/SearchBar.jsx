import React, { useState } from "react";
import { useForm } from "react-hook-form"

function SearchBar({isSearchBarOpen = false}) {
  const { register, handleSubmit } = useForm();

  const [searchQuery, setSearchQuery] = useState("");
  const [filteredSuggestions, setFilteredSuggestions] = useState([]);
  const [isNoSuggestionsResult, setIsNoSuggestionsResult] = useState(false);

  const suggestionsList = [
    "TROUSER",
    "POLO",
    "JACKET",
    "SHOES",
    "SHIRT",
    "JEANS",
  ];

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

  const handleSearch = ({ query }) => {
    //TODO: Work in progress
  };

  return (
    <div className="relative text-black">
      <div className={`${isSearchBarOpen ? "block" : "hidden"} relative w-full max-w-lg mx-auto z-20 h-[40vh] overflow-hidden`}>
        <form onSubmit={handleSubmit(handleSearch)}>
          <input
            type="text"
            placeholder="Search..."
            className="w-full text-xl px-4 py-2 border-b-2 border-black focus:outline-none mt-10"
            {...register("query", {
              required: true,
            })}
            onChange={handleInputChange}
            value={searchQuery}
          />
        </form>
        <h4 className="px-4 py-2 text-xl font-bold cursor-pointer">
          {isNoSuggestionsResult && "No result found!"}
        </h4>
        {filteredSuggestions.length > 0 && (
          <ul className="absolute w-full max-w-lg mx-auto z-30 bg-white mt-4">
            {filteredSuggestions.map((suggestion, index) => (
              <li
                key={index}
                className="px-4 py-2 hover:font-semibold cursor-pointer"
                onClick={() => setSearchQuery(suggestion)}
              >
                {suggestion}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

export default SearchBar;
