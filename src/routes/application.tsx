import * as React from "react";
import { Outlet } from "react-router-dom";
import type { RouteObject } from "react-router-dom";
import { AuthGuard } from "@/components/auth/auth-guard";

export const applicationRoute: RouteObject = {
  path: "applications",
  element: (
    <AuthGuard>
      <Outlet />
    </AuthGuard>
  ),
  children: [{
            index: true,
            lazy: async () => {
                const { Page } = await import("@/pages/main/applications/list");
                return { Component: Page };
            },
        },

  ],
};
