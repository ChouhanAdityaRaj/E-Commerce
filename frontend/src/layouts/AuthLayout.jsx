import React, { useEffect, useState } from 'react'
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Loader } from "../components/index";

function AuthLayout({children}) {

    const [loading, setLoading] = useState(false);

    const authStatus = useSelector((state) => state.auth.status);
    const navigate = useNavigate();

    useEffect(() => {
        setLoading(true);
        
        if(authStatus === false){
            navigate("/login");
        }

        setLoading(false);
    }, [authStatus])

    return loading ? <Loader/> : <>{children}</>

}

export default AuthLayout;