import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import adminService from "../../services/admin";
import { Loader, ErrorMessage, MessageAlert } from "../../components";
import { apiHandler } from "../../utils";

function OrderInfo() {
  const { orderid } = useParams();
  
  const statusList = ["pending", "on the way", "delivered", "cancelled"];
  
  const [response, setResponse] = useState(null);
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(false)
  const [responseAlertMessage, setResponseAlertMessage] = useState("");
  const [errorAlertMessage, setErrorAlertMessage] = useState("");
  const [reload, setReload] = useState(false);
  
  useEffect(() => {
    (async () => {
      setError("")
      setLoading(true)

      const [response, error] = await apiHandler(adminService.getOrderById(orderid));

      if(response){
        setResponse(response);
      }

      if(error){
        setError(error);
      }

      setLoading(false);
    })()

  }, [reload])

  const handleUpdateStatus = async (e) => {
    
    const [response, error] = await apiHandler(adminService.updateOrderStatus(orderid, {status: e.target.value}));

    if(response){
      setResponseAlertMessage(response.message);
        setReload(!reload);
    }

    if(error){
      setErrorAlertMessage(error.message)
    }
  }
  
  if (error) {
    return <ErrorMessage />;
  }
  
  if (loading) {
    return <Loader />;
  }
  
  if (response) {
    const order = response?.data;
    const items = response?.data?.productsDetails.items;
    const address = response?.data?.address;

    
    return (
      <div className="container mx-auto px-4 py-8 pt-16 w-[100%] flex flex-col justify-center items-center">
        {responseAlertMessage && (
          <MessageAlert
            message={responseAlertMessage}
            isError={false}
            handleMessage={() => setResponseAlertMessage("")}
          />
        )}
        {errorAlertMessage && (
          <MessageAlert
            message={errorAlertMessage}
            handleMessage={() => setErrorAlertMessage("")}
          />
        )}
        <h1 className="text-3xl lg:text-4xl font-bold mb-6 text-center">
          Your Order
        </h1>

        {/* Product List */}
        <div className="space-y-6 lg:w-[80%]">
          {items.map((item) => (
            <div
              key={item.product._id}
              className="flex items-start p-6 bg-white rounded-lg border"
            >
              <img
                src={item.product.productImage}
                alt={item.product.productName}
                className="w-36 h-36 object-contain rounded-md mr-6"
              />
              <div className="flex-grow">
                <h2 className="text-lg lg:text-xl font-semibold mb-1">
                  {item.product.productName}
                </h2>
                <p className="text-sm lg:text-base text-gray-500 mb-1">
                  {item.product.description}
                </p>
                <p className="text-sm lg:text-base">
                  <span className="font-medium">Size:</span> {item.size}
                </p>
                <p className="text-sm lg:text-base">
                  <span className="font-medium">Quantity:</span> {item.quantity}
                </p>
                <p className="text-sm lg:text-base font-medium text-gray-700">
                  Price: ₹{item.product.price}
                </p>
              </div>
            </div>
          ))}
          <p className="text-sm lg:text-base font-medium text-gray-700">
                  Shipping: ₹{order.productsDetails.shippingCharge}
                </p>
        </div>

        {/* Total Price and Cancel Button */}
        <div className="mt-8 flex flex-col sm:flex-row items-center justify-between bg-gray-50 p-4 rounded-lg border w-[70%] lg:w-[60%]">
          <p className="text-lg lg:text-xl font-semibold">
            Total Price: ₹{order.total}
          </p>
          <p className="text-lg lg:text-xl font-semibold">
            Update Status: <select onChange={handleUpdateStatus} className="w-full my-3 p-2 border rounded">
                <option value={order.orderStatus} hidden>
                  {order.orderStatus}
                </option>

                {statusList?.map((status, i) => (
                  <option
                    key={i}
                    hidden={order.orderStatus === status}
                    value={status}
                  >
                    {status}
                  </option>
                ))}
              </select>
          </p>
        </div>

        {/* Address Section */}
        <div className="mt-8 bg-gray-100 p-6 rounded-lg  lg:w-[60%]">
          <h3 className="text-xl font-semibold mb-4">Address</h3>
          <p className="text-sm lg:text-base">
            <span className="font-medium">Name:</span> {order.user.fullName}
          </p>
          <p className="text-sm lg:text-base">
            <span className="font-medium">Email:</span> {order.user.email}
          </p>
          <p className="text-sm lg:text-base">
            <span className="font-medium">Mobile:</span> {address.mobileNumber}
          </p>
          <p className="text-sm lg:text-base">
            <span className="font-medium">Address:</span> {address.address},{" "}
            {address.city}, {address.state}
          </p>
          <p className="text-sm lg:text-base">
            <span className="font-medium">Pin Code:</span> {address.pinCode}
          </p>
        </div>
      </div>
    );
  }
}

export default OrderInfo