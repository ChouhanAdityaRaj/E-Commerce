import { BaseLayout } from "../layouts"
import { BannerDetails  } from "../pages";

const BannerRoutes = [
    {
        path: "b",
        element: <BaseLayout/>,
        children: [
            {
                path: ":bannerid",
                element: <BannerDetails/>
            },
        ]
    }
]

export default BannerRoutes;