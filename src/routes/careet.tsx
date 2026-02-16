import * as React from "react";
import { Outlet } from "react-router-dom";
import type { RouteObject } from "react-router-dom";
import { AuthGuard } from "@/components/auth/auth-guard";

export const careerRoute: RouteObject = {
  path: "career",
  element: (
    <AuthGuard>
      <Outlet />
    </AuthGuard>
  ),
  children: [
    {
      index: true, // /career
      lazy: async () => {
        const { Page } = await import("@/pages/main/career/details");
        return { Component: Page };
      },
    },
    {
      path: "career-paths", // /career/career-path
      lazy: async () => {
        const { Page } = await import(
          "@/pages/main/career/careerpath/details"
        );
        return { Component: Page };
      },
    },  
    {
      path: "learning-upskilling", // /career/learning
      lazy: async () => {
        const { Page } = await import(
          "@/pages/main/career/learning/details"
        );
        return { Component: Page };
      },
    },
    {
      path: "market-intelligence", // /career/market-intelligence
      lazy: async () => {
        const { Page } = await import(
          "@/pages/main/career/marketintelligence/details"
        );
        return { Component: Page };
      },
    },
    {
      path: "salary-benchmarks", // /career/salary-benchmark
      lazy: async () => {
        const { Page } = await import(
          "@/pages/main/career/salarybenchmarks/details"
        );
        return { Component: Page };
      },
    },
  ],
};
