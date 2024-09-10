import { BaseLayout } from "../layouts"
import { ProductList } from "../pages";

const ProductRoutes = [
    {
        path: "product",
        element: <BaseLayout/>,
        children: [
            {
                path: "",
                element: <ProductList/>
            }
        ]
    }
]

export default ProductRoutes;