import * as React from "react";
import { Outlet } from "react-router-dom";
import type { RouteObject } from "react-router-dom";
import { AuthGuard } from "@/components/auth/auth-guard";

export const toolsRoute: RouteObject = {
  path: "tools",
  element: (
    <AuthGuard>
      <Outlet />
    </AuthGuard>
  ),
  children: [{
            index: true,
            lazy: async () => {
                const { Page } = await import("@/pages/main/tools/details");
                return { Component: Page };
            },
        },

  ],
};
