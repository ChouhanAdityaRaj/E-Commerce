import { BaseLayout, AuthLayout} from "../layouts"
import { Profile } from "../pages";

const AccountRoutes = [
    {
        path: "account",
        element: <BaseLayout/>,
        children: [
            {
                path: "profile",
                element: (
                    
                    <AuthLayout>
                        <Profile/>
                    </AuthLayout>
                )
            },
        ]
    }
]

export default AccountRoutes;