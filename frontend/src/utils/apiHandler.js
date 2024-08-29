import axios from "axios";

const apiHandler = async ({urlPath, method = "get", data}) => {
    let response = null;
    let error = null;

    try {
        const res = data ? await axios[method](urlPath, data) : await axios[method](urlPath);
        
        if(res){
            response = res?.data;
        }
    } catch (err) {
        
        error = err?.response?.data;
    }

    return [response, error];
}

export default apiHandler;