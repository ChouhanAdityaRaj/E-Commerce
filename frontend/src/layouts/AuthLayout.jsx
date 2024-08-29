import React, { useEffect, useState } from 'react'
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Loader } from "../components/index";

function AuthLayout({childrean, authentication=true}) {

    const [loading, setLoading] = useState(true);

    const authStatus = useSelector((state) => state.auth.status);
    const navigate = useNavigate();

    useEffect(() => {
        if(authentication && !authStatus){
            navigate("/login");
        }

        setLoading(false);
    }, [])

  return loading ? <Loader/> : <>{childrean}</>;
}

export default AuthLayout;