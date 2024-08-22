import useApi from "../hooks/useApi";
import config from "../config/config";

class User{
    changeFullName({fullName}){
        const response = useApi(`${config.backendUrl}/user/change-fullname`, "patch", {
            fullName
        });

        return response;
    }

    currentUser({fullName}){
        const response = useApi(`${config.backendUrl}/user/current-user`);

        return response;
    }

    changePassword({oldPassword, newPassword, conformPassword}){
        const response = useApi(`${config.backendUrl}/user/change-password`, "patch", {
            oldPassword,
            newPassword,
            conformPassword
        });

        return response;
    }


    //Address

    addAddress({mobileNumber, pinCode, state, city, address}){
        const response = useApi(`${config.backendUrl}/address/`, "post", {
            mobileNumber,
            pinCode,
            state,
            city,
            address
        });

        return response;
    }

    updateAddress(addressId, data){
        const response = useApi(`${config.backendUrl}/address/${addressId}`, "patch", data);

        return response;
    }

    deleteAddress(addressId){
        const response = useApi(`${config.backendUrl}/address/${addressId}`, "delete");

        return response;
    }

    getAddressById(addressId){
        const response = useApi(`${config.backendUrl}/address/${addressId}`);

        return response;
    }

    getUserAddresses(){
        const response = useApi(`${config.backendUrl}/address/user`);

        return response;
    }

    //Cart

    addToCart(productId, data){
        const response = useApi(`${config.backendUrl}/cart/p/${productId}`, "post", data);

        return response;
    }
    
    updateCartItem(cartId, productId, data){
        const response = useApi(`${config.backendUrl}/cart/${cartId}/i/${productId}`, "patch", data);

        return response;
    }

    deleteCartItem(cartId, productId){
        const response = useApi(`${config.backendUrl}/cart/${cartId}/i/${productId}`, "delete");

        return response;
    }

    getCartInfo(cartId){
        const response = useApi(`${config.backendUrl}/cart/${cartId}`);

        return response;
    }

};

const user = new User();

export default user;