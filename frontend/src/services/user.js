import config from "../config/config";

class User{
    changeFullName({fullName}){
        return {
            urlPath: `${config.backendUrl}/user/change-fullname`,
            method: "patch",
            data: {fullName}
        };
    }

    currentUser(){
        return {
            urlPath: `${config.backendUrl}/user/current-user`
        };
    }

    changePassword({oldPassword, newPassword, conformPassword}){
        return {
            urlPath: `${config.backendUrl}/user/change-password`,
            method: "patch",
            data: { oldPassword, newPassword, conformPassword }
        };
    }


    //Address

    addAddress({mobileNumber, pinCode, state, city, address}){
        return {
            urlPath: `${config.backendUrl}/address/`,
            method: "post",
            data: {
                mobileNumber,
                pinCode,
                state,
                city,
                address
            }
        };
    }

    updateAddress(addressId, data){
        return {
            urlPath: `${config.backendUrl}/address/${addressId}`,
            method: "patch",
            data
        };
    }

    deleteAddress(addressId){
        return {
            urlPath: `${config.backendUrl}/address/${addressId}`,
            method: "delete",
        };
    }

    getAddressById(addressId){
        return {
            urlPath: `${config.backendUrl}/address/${addressId}`,
        };
    }

    getUserAddresses(){
        return {
            urlPath: `${config.backendUrl}/address/user`,
        };
    }

    //Cart

    addToCart(productId, data){
        return {
            urlPath: `${config.backendUrl}/cart/p/${productId}`,
            method: "post",
            data
        };
    }
    
    updateCartItem(cartId, productId, data){
        return {
            urlPath: `${config.backendUrl}/cart/${cartId}/i/${productId}`,
            method: "patch",
            data
        };
    }

    deleteCartItem(cartId, productId){
        return {
            urlPath: `${config.backendUrl}/cart/${cartId}/i/${productId}`,
            method: "delete",
        };
    }

    getCartInfo(cartId){
        return {
            urlPath: `${config.backendUrl}/cart/${cartId}`,
        };
    }

};

const user = new User();

export default user;