import { BaseLayout } from "../layouts"
import { NotFound } from "../pages";

const NotFoundRoutes = [
    {
        path: "",
        element: <BaseLayout/>,
        children: [
            {
                path: "*",
                element: <NotFound/>
            },
        ]
    }
]

export default NotFoundRoutes;