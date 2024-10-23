import { BaseLayout, AuthLayout } from "../layouts";
import { Profile, Address, Orders, OrderDetail } from "../pages";

const AccountRoutes = [
  {
    path: "account",
    element: <BaseLayout />,
    children: [
      {
        path: "profile",
        element: (
          <AuthLayout>
            <Profile />
          </AuthLayout>
        ),
      },
      {
        path: "address",
        element: (
          <AuthLayout>
            <Address />
          </AuthLayout>
        ),
      },
      {
        path: "orders",
        children: [
          {
            path: "",
            element: (
              <AuthLayout>
                <Orders />
              </AuthLayout>
            ),
          },
          {
            path: ":orderid",
            element: (
              <AuthLayout>
                <OrderDetail />
              </AuthLayout>
            ),
          },
        ]
      },
    ],
  },
];

export default AccountRoutes;
