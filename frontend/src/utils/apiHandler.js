import axios from "axios";
import authService from "../services/auth";

const apiHandler = async ({ urlPath, method = "get", data, isFormData = false }) => {
    let response = null;
    let error = null;
    const options = {
        withCredentials: true,
    }

    if (isFormData === true) {
        options.headers = {
            "Content-Type": "multipart/form-data",
        }
    }

    try {
        const res = data ? await axios[method](urlPath, data, options) : await axios[method](urlPath, options);

        if (res) {
            response = res?.data;
        }
    } catch (err) {
        if (err?.response?.data.message === 'jwt expired') {
            const [res, err] = await apiHandler(authService.refreshAccessToken());

            if (res) {
                try {
                    const res = data ? await axios[method](urlPath, data, options) : await axios[method](urlPath, options);

                    if (res) {
                        response = res?.data;
                    }
                } catch (error) {
                    error = err?.response?.data;

                }
            }

            if (err) {
                error = err?.response?.data;
            }
        } else {
            error = err?.response?.data;
        }

    }

    return [response, error];
}

export default apiHandler;