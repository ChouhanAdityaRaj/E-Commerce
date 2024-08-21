import { useState, useEffect } from "react";
import axios from "axios";

const useApi = function (urlPath, method = "get", data) {
  const [response, setResponse] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        setError("");

        const res = data ? await axios[method](urlPath, data) : await axios[method](urlPath);

        setResponse(res.data);
        setLoading(false);
      } catch (error) {
        setError(error.response.data);
      }
    })();
  }, []);

  return [response, loading, error];
};

export default useApi;
