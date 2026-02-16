import * as React from "react";
import type { RouteObject } from "react-router-dom";
import { Outlet } from "react-router-dom";
import { GuestGuard } from "@/components/auth/GuestGuard";

export const route: RouteObject = {
	path: "auth",
	element: (
		<GuestGuard>
			<Outlet />
		</GuestGuard>
	),
	children: [
		{
			path: "signin",
			lazy: async () => {
				const { Page } = await import("@/pages/auth/signin");
				return { Component: Page };
			},
		},
		{
			path: "signup",
			lazy: async () => {
				const { Page } = await import("@/pages/auth/signup");
				return { Component: Page };
			},
		},
	],
};
