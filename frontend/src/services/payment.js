import config  from "../config/config";

class PaymentService {
    createOrder({cartId, addressId}){
        return {
            urlPath: `${config.backendUrl}/payment/create-order`,
            method: "post",
            data: {cartId, addressId}
        };
    }


    verifyPayment(data){
        return {
            urlPath: `${config.backendUrl}/payment/verify-payment`,
            method: "post",
            data
        };
    }
}

const paymentService = new PaymentService();

export default paymentService;