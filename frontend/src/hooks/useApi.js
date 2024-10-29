import { useState, useEffect } from "react";
import axios from "axios";
import { useLocation } from "react-router-dom";
import { apiHandler } from "../utils";
import authService from "../services/auth";

const useApi = function ({urlPath, method = "get", data}) {
  const location = useLocation();
  const [response, setResponse] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        setError("");

        const res = data ? await axios[method](urlPath, data, {withCredentials: true}) : await axios[method](urlPath, {withCredentials: true});

        setResponse(res.data);
        setLoading(false);
      } catch (error) {
        if (error?.response?.data.message === 'jwt expired') {

          const [res, err] = await apiHandler(authService.refreshAccessToken());

          if (res) {
              try {
                setLoading(true);
                setError("");
        
                const res = data ? await axios[method](urlPath, data, {withCredentials: true}) : await axios[method](urlPath, {withCredentials: true});
        
                setResponse(res.data);
                setLoading(false);
              } catch (error) {
                setError(error.response.data);
              }
          }

          if (err) {
            setError(error.response.data);
          }
      } else {
          setError(error.response.data);
      }
      }
    })();
  }, [location.search]);

  return [response, loading, error];
};

export default useApi;
