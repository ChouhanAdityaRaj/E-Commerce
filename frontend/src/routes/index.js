import { createBrowserRouter } from "react-router-dom";
import  AuthRoutes from "./AuthRoutes";
import HomeRoutes from "./HomeRoutes";
import CollectionsRoutes from "./CollectionsRoutes";

const router = createBrowserRouter([
    ...HomeRoutes,
    ...AuthRoutes,
    ...CollectionsRoutes
]);

export default router;

