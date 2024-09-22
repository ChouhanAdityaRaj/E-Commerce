import config  from "../config/config";

class AuthServie {
    signup({fullName, email, password}){
        return {
            urlPath: `${config.backendUrl}/user/signup`,
            method: "post",
            data: {fullName,email, password}
        };
    }


    login({email, password}){
        return {
            urlPath: `${config.backendUrl}/user/login`,
            method: "post",
            data: {email, password}
        };
    }

    logout(){
        return {
            urlPath: `${config.backendUrl}/user/logout`,
            method: "post",
            data: {}
        };
    }

    refreshAccessToken(){
        return {
            urlPath: `${config.backendUrl}/user/refresh-token`,
            method: "post",
        };
    }
}

const authService = new AuthServie();

export default authService;