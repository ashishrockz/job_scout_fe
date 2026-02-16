import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import './i18n';
import App from './App'
import { createBrowserRouter, ScrollRestoration, Outlet, RouterProvider } from 'react-router-dom';
import { routes } from './store';
const root = createRoot(document.querySelector("#root")!);

const router = createBrowserRouter([
	{
		path: "/",
		element: (
			<App>
				<Outlet />
			</App>
		),
		children: [...routes],
	},
]);

root.render(
	// <React.StrictMode>
	<RouterProvider router={router} />
	// </React.StrictMode>
);
