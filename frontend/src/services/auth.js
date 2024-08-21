import useApi from "../hooks/useApi";
import config  from "../config/config";

class AuthServie {
    signup({fullName, email, password}){
        const response = useApi(`${config.backendUrl}/user/signup`, "post",{
            fullName,
            email,
            password
        });

        return response;
    }


    login({email, password}){
        const response = useApi(`${config.backendUrl}/user/login`, "post", {
            email,
            password
        });

        return response;
    }

    logout(){
        const response = useApi(`${config.backendUrl}/user/logout`, "post");

        return response;
    }

    refreshAccessToken(){
        const response = useApi(`${config.backendUrl}/user/refresh-token`, "post");

        return response;
    }
}

const authService = new AuthServie();

export default authService;