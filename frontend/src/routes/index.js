import { createBrowserRouter } from "react-router-dom";
import  AuthRoutes from "./AuthRoutes";
import HomeRoutes from "./HomeRoutes";
import AboutRoutes from "./AboutRoutes";
import CollectionsRoutes from "./CollectionsRoutes";
import ProductRoutes from "./ProductRoutes";
import AccountRoutes from "./AccountRoutes";
import CartRoutes  from "./CartRoutes";
import ReviewRoutes from "./ReviewRoutes";
import AdminRoutes from "./AdminRoutes";
import BannerRoutes from "./BannerRoutes";
import PlaceOrderRoutes from "./PlaceOrderRoutes";
import NotFoundRoutes from "./NotFoundRoutes";


const router = createBrowserRouter([
    ...HomeRoutes,
    ...AuthRoutes,
    ...CollectionsRoutes,
    ...AboutRoutes,
    ...ProductRoutes,
    ...AccountRoutes,
    ...CartRoutes,
    ...ReviewRoutes,
    ...AdminRoutes,
    ...BannerRoutes,
    ...PlaceOrderRoutes,
    ...NotFoundRoutes
]);

export default router;

