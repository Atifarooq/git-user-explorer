import React from "react";
import { RouterProvider, createBrowserRouter } from "react-router-dom";

import Layout from "./modules/Layouts";
import { userRoutes } from "./modules/User";

import "./App.css"

export const BASE_URL = "/";
const router = createBrowserRouter([
  {
    path: BASE_URL,
    element: <Layout />,
    children: [...userRoutes],
  },
]);

const App = () => <RouterProvider router={router} />;
export default App;
