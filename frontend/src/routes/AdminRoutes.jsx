import { AuthLayout, AdminNavbarLayout } from "../layouts";
import { Users, Products, CreateProduct, UpdateProduct, Categories, CreateCategory, UpdateCategory, OrdersList, OrderInfo, Banners, CreateBanner, UpdateBanner } from "../pages";

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
      },
      {
        path: "orders",
        children: [
          {
            path: "",
            element: (
              <AuthLayout>
                <OrdersList />
              </AuthLayout>
            )
          },
          {
            path: ":orderid",
            element: (
              <AuthLayout>
                <OrderInfo />
              </AuthLayout>
            )
          }
        ]
      },
      {
        path: "banner",
        children: [
          {
            path: "",
            element: (
              <AuthLayout>
                <Banners />
              </AuthLayout>
            )
          },
          {
            path: "create-banner",
            element: (
              <AuthLayout>
                <CreateBanner />
              </AuthLayout>
            )
          },
          {
            path: "update-banner/:bannerid",
            element: (
              <AuthLayout>
                <UpdateBanner />
              </AuthLayout>
            )
          }
        ]
      }
    ],
  },
];

export default AdminRoutes;
