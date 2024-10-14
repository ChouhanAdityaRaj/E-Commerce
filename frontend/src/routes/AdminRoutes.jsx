import { AuthLayout, AdminNavbarLayout } from "../layouts";
import { Users, Products, CreateProduct, UpdateProduct, Categories, CreateCategory, UpdateCategory } from "../pages";

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
      {
        path: "categories",
        children: [
          {
            path: "",
            element: (
              <AuthLayout>
                <Categories />
              </AuthLayout>
            ),
          },
          {
            path: "create-category",
            element: (
              <AuthLayout>
                <CreateCategory />
              </AuthLayout>
            ),
          },
          {
            path: "update-category/:categoryid",
            element: (
              <AuthLayout>
                <UpdateCategory />
              </AuthLayout>
            ),
          }
        ]
      }
    ],
  },
];

export default AdminRoutes;
