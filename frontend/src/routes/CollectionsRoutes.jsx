import { BaseLayout } from "../layouts"
import { Collections, CollectionProductList } from "../pages";

const CollectionsRoutes = [
    {
        path: "/collections",
        element: <BaseLayout/>,
        children: [
            {
                path: "",
                element: <Collections/>
            },
            {
                path:":categoryid",
                element: <CollectionProductList/>
            }
        ]
    }
]

export default CollectionsRoutes;