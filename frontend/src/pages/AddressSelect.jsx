import React, { useEffect, useState } from 'react'
import { useApi } from '../hooks';
import userService from "../services/user";
import { ErrorMessage, Loader, MessageAlert } from "../components";
import { apiHandler } from '../utils';
import paymentService from "../services/payment";
import config  from "../config/config";
import { useNavigate } from 'react-router-dom';



function AddressSelect() {
  const [addressResponse, addressLoading, addressError] = useApi(userService.getUserAddresses());
  const [cartResponse, cartLoading, cartError] = useApi(userService.getUserCartInfo());
  const navigate = useNavigate();

  const [selectedAddress, setSelectedAddress] = useState(null);
  const [responseAlertMessage, setResponseAlertMessage] = useState("");
  const [errorAlertMessage, setErrorAlertMessage] = useState("");

  useEffect(() => {
    if(addressResponse?.data.length  <= 0){
      navigate("/account/address")
    }
  }, [])

  const handleSelect = (id) => {
    setSelectedAddress(id);
  };

  const handlePayment = async () => {
    const [selectedArddressDetails] = addressResponse.data.filter((address) => selectedAddress === address._id);
    
    const [orderResponse, orderError] = await apiHandler(paymentService.createOrder({cartId: cartResponse?.data?._id, addressId: selectedArddressDetails?._id}));

    
    if(orderResponse){
        const { id: orderId } = orderResponse.data;
        

        const paymentDetails = {
            key : config.razorpayIdKey,
            amount: orderResponse.data.amount,
            currency: orderResponse.data.currency,
            name: selectedArddressDetails?.user.fullName,
            description: "Test",
            order_id: orderId,
            handler: async (response) => {
              const { razorpay_payment_id, razorpay_order_id, razorpay_signature } = response;

              const [res, err] = await apiHandler(paymentService.verifyPayment({ razorpay_payment_id, razorpay_order_id, razorpay_signature, addressId: selectedArddressDetails?._id, cartId: cartResponse?.data._id }));
              
                if(res){
                    navigate("/account/orders");
                }
            },
            theme: {
              color: "#3399cc",
            },
            prefill: {
              name: selectedArddressDetails?.user.fullName,
              email: selectedArddressDetails?.user.email,
              contact: selectedArddressDetails?.mobileNumber,
            },
          };
          
        const razorpayObject = new window.Razorpay(paymentDetails);
        razorpayObject.open();
    }

    if(orderError){
      setErrorAlertMessage(orderError.message)
    }
  }

 

  if (addressError || cartError) {
    return (
        <ErrorMessage message={cartError.message || addressError.message } />
    )
  }

  if (addressLoading && cartLoading) {
    return (
        <Loader />
    )
  }

  

  if(addressResponse && cartResponse){
    return (
    <div className="flex flex-col justify-center max-w-2xl mx-auto p-4">
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
      <h2 className="text-xl font-semibold mb-4 text-center">Select Address</h2>
      <div className="space-y-4">
        {addressResponse?.data.map((addr) => (
          <label
            key={addr._id}
            className={`block p-4 border rounded-lg cursor-pointer ${
              selectedAddress === addr.id ? "border-blue-500" : "border-gray-300"
            }`}
          >
            <div className="flex items-start gap-4">
              <input
                type="radio"
                name="address"
                value={addr.id}
                checked={selectedAddress === addr._id}
                onChange={() => handleSelect(addr._id)}
                className="mt-1"
              />
              <div className="space-y-1">
                <p className="text-lg font-semibold">{addr.user.fullName}</p>
                <p className="text-sm text-gray-600">Mobile: {addr.mobileNumber}</p>
                <p className="text-sm text-gray-600">{addr.address}</p>
                <p className="text-sm text-gray-600">
                  {addr.state} - {addr.pinCode}
                </p>
              </div>
            </div>
          </label>
        ))}
        <button disabled={!selectedAddress} onClick={handlePayment} className={`text-3xl border-2 text-center mt-10 w-[30%] self-center  text-white px-4 py-2 rounded-3xl  ${selectedAddress ? "bg-red-400 hover:bg-red-500" : "bg-red-100 hover:bg-red-100"}`}>Pay</button>
      </div>
      
    </div>
  );
}
}

export default AddressSelect