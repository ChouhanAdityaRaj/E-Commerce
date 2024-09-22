import { createBrowserRouter } from "react-router-dom";
import  AuthRoutes from "./AuthRoutes";
import HomeRoutes from "./HomeRoutes";
import CollectionsRoutes from "./CollectionsRoutes";
import ProductRoutes from "./ProductRoutes";
import AccountRoutes from "./AccountRoutes";


const router = createBrowserRouter([
    ...HomeRoutes,
    ...AuthRoutes,
    ...CollectionsRoutes,
    ...ProductRoutes,
    ...AccountRoutes
]);

export default router;

