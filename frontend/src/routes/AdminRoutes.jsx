import { AuthLayout, AdminNavbarLayout } from "../layouts";
import { Users, Products, CreateProduct, UpdateProduct } from "../pages";

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
      {
        path: "products",
        children: [
          {
            path: "",
            element: (
              <AuthLayout>
                <Products />
              </AuthLayout>
            ),
          },
          {
            path: "create-product",
            element: (
              <AuthLayout>
                <CreateProduct />
              </AuthLayout>
            ),
          },
          {
            path: "update-product/:productid",
            element: (
              <AuthLayout>
                <UpdateProduct />
              </AuthLayout>
            ),
          },

        ]

        
      },
    ],
  },
];

export default AdminRoutes;
