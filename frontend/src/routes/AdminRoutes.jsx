import { AuthLayout, AdminNavbarLayout } from "../layouts";
import { Users } from "../pages";

const AdminRoutes = [
  {
    path: "admin",
    element: <AdminNavbarLayout/>,
    children: [
      {
        path: "users",
        element: (
          <AuthLayout>
            <Users />
          </AuthLayout>
        ),
      },
    ],
  },
];

export default AdminRoutes;
