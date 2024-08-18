import { useState, useEffect } from "react";
import axios from "axios";

const useApi = function (urlPath, method = "get", data) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        setError("");

        const response = data ? await axios[method](urlPath, data) : await axios[method](urlPath)

        setData(response.data);
        setLoading(false);
      } catch (error) {
        setError(error);
      }
    })();
  }, []);

  return [data, loading, error];
};

export default useApi;
