import { BaseLayout } from "../layouts"
import { About } from "../pages";

const AboutRoutes = [
    {
        path: "/about",
        element: <BaseLayout/>,
        children: [
            {
                path: "",
                element: <About/>
            }
        ]
    }
]

export default AboutRoutes;