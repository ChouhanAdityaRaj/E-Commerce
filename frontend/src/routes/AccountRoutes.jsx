import { BaseLayout, AuthLayout } from "../layouts";
import { Profile, Address } from "../pages";

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
    ],
  },
];

export default AccountRoutes;
