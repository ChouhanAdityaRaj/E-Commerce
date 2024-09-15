import axios from "axios";

const apiHandler = async ({urlPath, method = "get", data}) => {
    let response = null;
    let error = null;

    try {
        const res = data ? await axios[method](urlPath, data, { withCredentials: true }) : await axios[method](urlPath, {withCredentials: true});
        
        if(res){
            response = res?.data;
        }
    } catch (err) {
        
        error = err?.response?.data;
    }

    return [response, error];
}

export default apiHandler;