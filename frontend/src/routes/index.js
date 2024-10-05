import { createBrowserRouter } from "react-router-dom";
import  AuthRoutes from "./AuthRoutes";
import HomeRoutes from "./HomeRoutes";
import CollectionsRoutes from "./CollectionsRoutes";
import ProductRoutes from "./ProductRoutes";
import AccountRoutes from "./AccountRoutes";
import CartRoutes  from "./CartRoutes";
import ReviewRoutes from "./ReviewRoutes";
import AdminRoutes from "./AdminRoutes";


const router = createBrowserRouter([
    ...HomeRoutes,
    ...AuthRoutes,
    ...CollectionsRoutes,
    ...ProductRoutes,
    ...AccountRoutes,
    ...CartRoutes,
    ...ReviewRoutes,
    ...AdminRoutes
]);

export default router;

