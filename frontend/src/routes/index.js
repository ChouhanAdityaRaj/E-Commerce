import { createBrowserRouter } from "react-router-dom";
import  AuthRoutes from "./AuthRoutes";
import HomeRoutes from "./HomeRoutes";


const router = createBrowserRouter([
    ...AuthRoutes,
    ...HomeRoutes
    
]);

export default router;

