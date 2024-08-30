import { Login, Signup } from "../pages";

const AuthRoutes = [
    {
        path: "/login",
        element: <Login/>
    },
    {
        path: "/signup",
        element: <Signup/>
    }
]

export default AuthRoutes;