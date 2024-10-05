import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import adminService from "../../services/admin";
import { ErrorMessage, Loader } from "../../components";
import { apiHandler } from "../../utils";
import { useForm } from "react-hook-form";
import { GrPowerReset } from "react-icons/gr";

function Users() {
  const sortOptions = ["Recent first", "Oldest first", "Ascending", "Descending"];
  const {register, handleSubmit, reset} = useForm();

  const [users, setUsers] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [reload, setReload] = useState(false);
  const [isButtonDisable, setIsButtonDisable] = useState(false);
  const [sortByFilter, setSortByFilter] = useState("");
  const [sortTypeFilter, setSortTypeFilter] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [filter, setFilter] = useState("");
  const [searchQuery, setSearchQuery] = useState("");


  const handleFilter = () => {
    setLoading(true)
    setIsOpen(false);

    if(filter === "Recent first"){
      setSortByFilter("createdAt");
      setSortTypeFilter(-1);
    }
    if(filter === "Oldest first"){
      setSortByFilter("createdAt");
      setSortTypeFilter(1);
    }
    if(filter === "Ascending"){
      setSortByFilter("fullName");
      setSortTypeFilter(-1);
    }
    if(filter === "Descending"){
      setSortByFilter("fullName");
      setSortTypeFilter(1);
    }
    setReload(!reload)
    setLoading(false)
  }

  const handleSearchUser = ({query}) => {
    setLoading(true);
    
    setSearchQuery(query);
    setReload(!reload);
    setLoading(false);
  }

  const DateTimeFormate = (isoString) => {

    const date = new Date(isoString);

    const day = date.getDate().toString().padStart(2, '0'); // Day (2 digits)
    const month = (date.getMonth() + 1).toString().padStart(2, '0'); // Month (2 digits, +1 because months are zero-indexed)
    const year = date.getFullYear(); // Year (4 digits)

    // Extracting time components
    const hours = date.getHours().toString().padStart(2, '0'); // Hours (2 digits)
    const minutes = date.getMinutes().toString().padStart(2, '0'); // Minutes (2 digits)
    const seconds = date.getSeconds().toString().padStart(2, '0'); // Seconds (2 digits)

    // Formatting the date and time
    return `${day}-${month}-${year} ${hours}:${minutes}:${seconds}`;
  }

  useEffect(() => {
    
    (async () => {
      setError("");
      setLoading(true);
      const [response, error] = await apiHandler( adminService.getAllUsers({
          sortBy: sortByFilter,
          sortType: sortTypeFilter,
          search: searchQuery 
        })
      );

      if (response) {
        setUsers(response.data);
      }

      if (error) {
        setError(error.message);
      }
      setLoading(false);
    })();

  }, [reload]);


  if (error) {
    return <ErrorMessage message={error.message} />;
  }

  if (loading) {
    return <Loader />;
  }

  if (users) {
    return (
      <div className=" p-8 bg-white rounded shadow-lg ">

        {/* Search bar */}
        <form onSubmit={handleSubmit(handleSearchUser)} className="flex justify-center">
          <input type="text" placeholder="Search name"  className="border py-2 px-2 text-xl" {...register("query", {
            
          })}/>
          <button type="submit" disabled={isButtonDisable} className="text-xl font-medium hover:underline text-center px-3 text-white bg-red-400 hover:text-gray-300 hover:bg-red-100">
            Search
          </button>
        </form>

        {/* Sort&Filter And Reset Button */}
        <div className="flex justify-end">
          <button
            className="text-xl font-medium text-gray-600 hover:underline"
            onClick={() => setIsOpen(true)}
            disabled={isButtonDisable}
          >
            <span className="inline-block mr-2">&#x2630;</span> Filter & Sort
          </button>
          
        </div>

        {/* Reste Button   */}
        <div className={`${searchQuery !== "" ? "flex" : "hidden"} justify-end mt-3 mr-5`}>
          <button
            className="text-xl font-medium text-indigo-400 hover:underline"
            onClick={() => {
              setSearchQuery(""),
              reset()
              setReload(!reload)
            }}
            disabled={isButtonDisable}
            >
           <GrPowerReset className=" inline-block mr-2" />Restet
          </button>
          </div>

        {/* Users List */}
        <h2 className="text-2xl font-semibold mb-6">Users List</h2>
        <div className="overflow-auto">
          <table className="min-w-full bg-gray-50">
            <thead>
              <tr>
                <th className="py-2 px-4 border-b text-left">Full Name</th>
                <th className="py-2 px-4 border-b text-left">Email</th>
                <th className="py-2 px-4 border-b text-left">Joined Date</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user._id} className="hover:bg-gray-100">
                  <td className="py-2 px-4 border-b">
                    <Link
                      to={`/users/${user.id}`}
                      className="text-blue-500 hover:underline"
                    >
                      {user.fullName}
                    </Link>
                  </td>
                  <td className="py-2 px-4 border-b">{user.email}</td>
                  <td className="py-2 px-4 border-b">{DateTimeFormate(user.createdAt)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>


        {/* Filter Sidebar */}
        <div className="relative">
          {/* Sidebar (shown when isOpen is true) */}
          <div
            className={`fixed top-0 right-0 h-full w-64 lg:w-96 bg-white shadow-lg transform transition-transform ${
              isOpen ? "translate-x-0" : "translate-x-full"
            }`}
            style={{ zIndex: 999 }}
          >
            {/* Close Button */}
            <button
              onClick={() => setIsOpen(false)}
              className="text-lg absolute top-4 right-4 text-gray-600"
            >
              &#x2715;
            </button>

            {/* Sidebar Content */}
            <div className="p-6 space-y-6">
              <h2 className="text-xl lg:text-4xl font-bold">Filter & Sort</h2>

              {/* Sort By Options */}
              <div className="mb-4">
                <h3 className="text-lg lg:text-2xl font-semibold mb-2 lg:mb-7">Sort By</h3>
                <div className="flex flex-wrap gap-2">
                  {sortOptions.map((option, index) => (
                    <button
                      onClick={() => setFilter(option)}
                      key={index}
                      className={`${filter === option ? "border border-gray-700 font-semibold" : "border border-gray-400 hover:bg-gray-100"} px-3 py-1  rounded-full text-xl`}
                    >
                      {option}
                    </button>
                  ))}
                </div>
              </div>


              {/* Done Button */}
              <button
                onClick={handleFilter}
                className="w-full py-3 bg-red-400 text-white font-semibold rounded-full lg:text-2xl"
              >
                Apply
              </button>
            </div>
          </div>

          {/* Overlay (visible when sidebar is open) */}
          {isOpen && (
            <div
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 bg-black opacity-50"
              style={{ zIndex: 998 }}
            />
          )}
        </div>
      </div>
    );
  }
}

export default Users;
