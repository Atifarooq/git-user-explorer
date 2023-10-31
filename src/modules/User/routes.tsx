import React from "react";
import { RouteObject } from "react-router-dom";
import { USER_ROUTES } from "./types/user.type";

import UserList from "./views/List";
import User from "./views/User";
import FavouriteUsers from "./views/Favourites";

export const userRoutes: RouteObject[] = [
  {
    path: USER_ROUTES.DEFAULT,
    id: "users",
    element: <UserList />,
    loader: () => ({
      searchBar: true,
    }),
  },
  {
    path: `${USER_ROUTES.USER}/:userId`,
    id: "user",
    element: <User />,
    loader: ({ params }) => ({
      name: params.userId,
      searchBar: false,
    }),
  },
  {
    path: USER_ROUTES.FAVOURITES,
    id: "favourites",
    element: <FavouriteUsers />,
    loader: () => ({
      name: "Favourites",
      searchBar: false,
    }),
  },
];
