import { BaseLayout } from "../layouts"
import { Home } from "../pages";

const HomeRoutes = [
    {
        path: "/",
        element: <BaseLayout/>,
        children: [
            {
                path: "/",
                element: <Home/>
            }
        ]
    }
]

export default HomeRoutes;