import React from 'react'
import userService from "../../services/user";
import { useApi } from "../../hooks";
import { Link } from 'react-router-dom';
import { Loader, ErrorMessage } from "../../components"

function Orders() {
    const [response, loading, error] = useApi(userService.getUserOrdersOverview());

    const DateTimeFormate = (isoString) => {
        const date = new Date(isoString);
    
        const day = date.getDate().toString().padStart(2, "0"); // Day (2 digits)
        const month = (date.getMonth() + 1).toString().padStart(2, "0"); // Month (2 digits, +1 because months are zero-indexed)
        const year = date.getFullYear(); // Year (4 digits)
    
        // Extracting time components
        const hours = date.getHours().toString().padStart(2, "0"); // Hours (2 digits)
        const minutes = date.getMinutes().toString().padStart(2, "0"); // Minutes (2 digits)
        const seconds = date.getSeconds().toString().padStart(2, "0"); // Seconds (2 digits)
    
        // Formatting the date and time
        return `${day}-${month}-${year} ${hours}:${minutes}:${seconds}`;
      };

    if(error){
        return (
            <ErrorMessage/>
        )
    }

    if(loading){
        return (
            <Loader/>
        )
    }

    if(response){
        return (
        <div className="container mx-auto px-4 py-8 pt-16 min-h-screen">
            <h1 className="text-2xl lg:text-4xl font-bold mb-6 text-center">
                Your Orders
            </h1>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {response.data?.map((order) => (
                    <Link
                        key={order._id}
                        to={`/account/orders/${order._id}`}
                        className="flex items-center p-4 bg-white rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300"
                    >
                        <img
                            src={order.productsDetails.items[0].product.productImage}
                            alt={order.productsDetails.items[0].product.productName}
                            className="w-44 h-44 object-contain rounded-md mr-4"
                        />
                        <div className="flex-grow">
                            <h2 className="text-lg lg:text-xl xl:text-2xl font-semibold mb-1">
                                {order.productsDetails.items[0].product.productName}
                            </h2>
                            <p className="text-sm lg:text-base text-gray-500 mb-1">
                                Status: <span className="font-medium">{order.orderStatus}</span>
                            </p>
                            <p className="text-sm lg:text-base text-gray-500">
                                Date: {DateTimeFormate(order.createdAt)}
                            </p>
                        </div>
                    </Link>
                ))}
            </div>
        </div>
    );
}
}

export default Orders