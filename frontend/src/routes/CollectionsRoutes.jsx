import { BaseLayout } from "../layouts"
import { Collections } from "../pages";

const CollectionsRoutes = [
    {
        path: "/collections",
        element: <BaseLayout/>,
        children: [
            {
                path: "",
                element: <Collections/>
            }
        ]
    }
]

export default CollectionsRoutes;