import React, { FC } from "react";
import { NavLink } from "react-router-dom";
import { Toolbar } from "@mui/material";

import FavouriteButton from "../../../../shared/components/Favourite";
import useRouterData from "../../../../shared/hooks/useRouterData";
import Breadcrumb from "../Breadcrumb";
import { RouteData } from "../../../../types/route.type";
import { USER_ROUTES } from "../../../User/types/user.type";

const Topbar: FC<any> = ({ typeAhead }) => {
  const { searchBar = null, name = null } = useRouterData<RouteData>() || {};
  return (
    <Toolbar sx={{ justifyContent: "space-between" }}>
      {typeAhead}
      <Breadcrumb data={name} hidden={searchBar} />
      <FavouriteButton favourite={false} component={NavLink} to={`/${USER_ROUTES.FAVOURITES}`} />
    </Toolbar>
  );
};

export default Topbar;
