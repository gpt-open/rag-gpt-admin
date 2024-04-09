import HomeLayout from "@/layout/HomeLayout";
import { getToken } from "@/utils/storage";
import { createBrowserRouter, redirect } from "react-router-dom";

const router = createBrowserRouter([
  {
    path: "/",
    children: [
      {
        element: <HomeLayout />,
        loader: () => {
          const token = getToken();
          if (!token) {
            return redirect("/login");
          }
          return {};
        },
        children: [
          {
            index: true,
            async lazy() {
              const { Setting } = await import("@/pages/Setting");
              return { Component: Setting };
            },
          },
          {
            path: "/dashboard",
            async lazy() {
              const { Dashboard } = await import("@/pages/dashboard/Dashboard");
              return { Component: Dashboard };
            },
          },
          {
            path: "/source",
            async lazy() {
              const { Source } = await import("@/pages/source/Source");
              return { Component: Source };
            },
            children: [
              {
                index: true,
                async lazy() {
                  const { Website } = await import("@/pages/source/Website");
                  return { Component: Website };
                },
              },
            ],
          },
          {
            path: "/embed",
            async lazy() {
              const { Embed } = await import("@/pages/Embed");
              return { Component: Embed };
            },
          },
        ],
      },
    ],
  },
  {
    path: "login",
    async lazy() {
      const { Login } = await import("@/pages/Login");
      return { Component: Login };
    },
  },
]);

export default router;
