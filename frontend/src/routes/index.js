import { createBrowserRouter } from "react-router-dom";
import { BaseLayout, AuthLayout } from "../layouts";
import  AuthRoutes from "./AuthRoutes";


const router = createBrowserRouter([
    ...AuthRoutes
    
]);

export default router;

