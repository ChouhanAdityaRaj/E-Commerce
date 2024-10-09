import axios from "axios";

const apiHandler = async ({urlPath, method = "get", data, isFormData=false}) => {
    let response = null;
    let error = null;
    const options = { 
        withCredentials: true,
    }

    if(isFormData === true){
        options.headers = {
            "Content-Type": "multipart/form-data",
          }
    } 

    try {
        const res = data ? await axios[method](urlPath, data, options) : await axios[method](urlPath, options);
        
        if(res){
            response = res?.data;
        }
    } catch (err) {
        
        error = err?.response?.data;
    }

    return [response, error];
}

export default apiHandler;