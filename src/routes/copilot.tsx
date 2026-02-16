import * as React from "react";
import { Outlet } from "react-router-dom";
import type { RouteObject } from "react-router-dom";
import { AuthGuard } from "@/components/auth/auth-guard";

export const route: RouteObject = {
  path: "copilot",
  element: (
    <AuthGuard>
      <Outlet />
    </AuthGuard>
  ),
  children: [{
			index: true,
			lazy: async () => {
				const { Page } = await import("@/pages/main/copilots/deatils");
				return { Component: Page };
			},
		},
    {
			path:"create",
			lazy: async () => {
				const { Page } = await import("@/pages/main/copilots/create");
				return { Component: Page };
			},
		},

  ],
};
