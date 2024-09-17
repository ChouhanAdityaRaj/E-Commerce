import { BaseLayout } from "../layouts"
import { ProductList, ProductDetail } from "../pages";

const ProductRoutes = [
    {
        path: "product",
        element: <BaseLayout/>,
        children: [
            {
                path: "",
                element: <ProductList/>
            },
            {
                path: ":productid",
                element: <ProductDetail/>
            }
        ]
    }
]

export default ProductRoutes;