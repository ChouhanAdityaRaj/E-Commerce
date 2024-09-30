import { BaseLayout, AuthLayout } from "../layouts";
import { Cart } from "../pages";

const CartRoutes = [
  {
    path: "cart",
    element: <BaseLayout />,
    children: [
      {
        path: "",
        element: (
          <AuthLayout>
            <Cart />
          </AuthLayout>
        ),
      },
    ],
  },
];

export default CartRoutes;
