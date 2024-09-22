import React, { useEffect, useState } from 'react'
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Loader } from "../components/index";

function AuthLayout({children, authentication=true}) {

    const [loading, setLoading] = useState(false);

    const authStatus = useSelector((state) => state.auth.status);
    const navigate = useNavigate();

    useEffect(() => {
        setLoading(true);
        if(authentication && !authStatus){
            navigate("/login");
        }

        setLoading(false);
    }, [])

    return loading ? <Loader/> : <>{children}</>

}

export default AuthLayout;