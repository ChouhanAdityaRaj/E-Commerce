import { AuthLayout } from "../layouts"
import { AddressSelect } from "../pages";

const PlaceOrderRoutes = [
    {
        path: "/place-order/select-address",
        element: (
            <AuthLayout>
                <AddressSelect/>
            </AuthLayout>
        )
    }
]

export default PlaceOrderRoutes;