import { AuthLayout, BaseLayout } from "../layouts"
import { ProductReviews } from "../pages";

const ReviewRoutes = [
    {
        path: "review",
        element: <BaseLayout/>,
        children: [
            {
                path: "product/:productid",
                element: <ProductReviews/>
            },
        ]
    }
]

export default ReviewRoutes;