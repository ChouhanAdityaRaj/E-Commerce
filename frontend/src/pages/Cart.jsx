import React, { useEffect, useState } from "react";
import { apiHandler } from "../utils";
import userService from "../services/user";
import { ErrorMessage, MessageAlert, Loader } from "../components";
import { Link } from "react-router-dom";

function Cart() {
  // Dummy product data
  const [cart, setCart] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showSaveReset, setShowSaveReset] = useState(false);
  const [updateQuantityId, setUpdateQuantityId] = useState([]);
  const [errorAlertMessage, setErrorAlertMessage] = useState("");
  const [responseAlertMessage, setResponseAlertMessage] = useState("");
  const [reload, setReload] = useState(false);

  
  useEffect(() => {
    (async () => {
      setLoading(true);
      const [response, error] = await apiHandler(userService.getUserCartInfo());
      
      if (response) {
        setCart(response.data);     
      }
      
      if (error) {
        setError(error.message);
      }
      setLoading(false);
    })();
  }, [reload]);


  // Handle quantity change
  const handleQuantityChange = (id, value) => {
    setCart((prevCart) => ({
      ...prevCart,
      items: prevCart.items.map((item) => item._id === id ? { ...item, quantity: value } : item), 
    }));
    setShowSaveReset(true);
    setUpdateQuantityId((prevQuantityId) => [...prevQuantityId, id]);
  };

  // Save changes
  const handleSave = async () => {
    const updateQuantityIdSet = new Set(updateQuantityId);
   
   for(const setId of updateQuantityIdSet){
    for(const item of cart.items){
      if(item._id === setId){
        const [response, error] = await apiHandler(userService.updateCartItem(cart._id, item._id, {quantity: item.quantity}));

        if(response){
          setReload(!reload);
          setResponseAlertMessage(response.message);
        }

        if(error){
          setErrorAlertMessage(error.message);
        }
      }
    }

   } 
    
    setShowSaveReset(false);
  };


  const handleReset = () => {
    setUpdateQuantityId([]);
    setReload(!reload)
    setShowSaveReset(false);
  }



  if (error) {
    <ErrorMessage message={error} />;
  }

  if (loading) {
    <Loader />;
  }

  if (cart) {
    return (
      <div className="pt-14 pb-5 px-4 bg-gray-50">
        {errorAlertMessage && (
          <MessageAlert
            message={errorAlertMessage}
            handleMessage={() => setErrorAlertMessage("")}
          />
        )}
        {responseAlertMessage && (
          <MessageAlert
            message={responseAlertMessage}
            isError={false}
            handleMessage={() => setResponseAlertMessage("")}
          />
        )}
        <h1 className="text-7xl font-bold text-center">Cart</h1>
        <p className="text-md font-semibold text-gray-400 mb-5 ml-5">
          {cart.items.length} item{cart.items.length > 1 ? "s" : ""} in your bag.
        </p>
        <div className="bg-white shadow rounded-lg p-4 lg:p-6">
          {/* Table Headers */}
          <div className="hidden lg:grid lg:grid-cols-12 gap-4 border-b pb-2 mb-4">
            <div className="col-span-6 text-left">Product</div>
            <div className="col-span-2 text-left">Price</div>
            <div className="col-span-2 text-left">Quantity</div>
            <div className="col-span-2 text-left">Total Price</div>
          </div>

          {/* Cart Items */}
          {cart.items.map((item) => (
            <div
              key={item._id}
              className="grid grid-cols-1 lg:grid-cols-12 gap-4 border-b pb-4 mb-4"
            >
              {/* Product Info */}
              <div className="col-span-6 flex">
                <Link to={`/product/${item.product._id}`}>
                  <img
                    src={item.product.productImage}
                    alt={item.product.productName}
                    className="w-16 h-16 lg:w-24 lg:h-24 object-cover mr-4 rounded"
                  />
                </Link>
                <div>
                  <h2 className="text-xl font-bold">{item.product.productName}</h2>
                  <h3 className="text-md font-medium">{item.product.description}</h3>
                  <p>Size: {item.size}</p>
                </div>
              </div>

              {/* Price */}
              <div className="col-span-2 flex items-center text-left">
                <p className="text-lg font-semibold">
                  ₹{item.product.price}
                </p>
              </div>

              {/* Quantity */}
              <div className="col-span-2 flex items-center justify-start">
                <button
                  onClick={() =>
                    handleQuantityChange(
                      item._id,
                      item.quantity > 1 ? item.quantity - 1 : 1
                    )
                  }
                  className="p-2 border rounded"
                >
                  -
                </button>
                <span className="mx-2 text-lg">{item.quantity}</span>
                <button
                  onClick={() =>
                    handleQuantityChange(item._id, item.quantity + 1)
                  }
                  className="p-2 border rounded"
                >
                  +
                </button>
              </div>

              {/* Total Price */}
              <div className="col-span-2 text-left flex items-center">
                <p className="text-lg font-bold">
                ₹{(item.product.price * item.quantity)}
                </p>
              </div>
            </div>
          ))}

          {/* Save Button */}
          {showSaveReset && (
            <div className="flex justify-end mt-4 mr-10 space-x-3">
              <button
                onClick={handleReset}
                className="bg-slate-600 text-white px-4 py-2 rounded-lg shadow-md hover:bg-slate-500"
              >
                Reset Changes
              </button>
              <button
                onClick={handleSave}
                className="bg-slate-600 text-white px-4 py-2 rounded-lg shadow-md hover:bg-slate-500"
              >
                Save Changes
              </button>
            </div>
          )}

          {/* Total Section */}
          <div className="w-[100%] flex justify-center">
          <div className="w-[80%]  mt-6 mx-5 flex justify-end items-center">
            <button className=" transition-colors ease-in-out duration-500 mx-5 border-2 border-gray-300 bg-black text-white font-bold px-7 py-3 rounded-full hover:text-black hover:bg-white">Buy Now</button>
            <p className="text-2xl font-bold">
              Total:{" "}
              <span >₹{cart.totalAmount}</span>
            </p>
          </div>
          </div>
        </div>
      </div>
    );
  }
}

export default Cart;
