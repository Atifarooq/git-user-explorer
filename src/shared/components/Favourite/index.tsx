import React, { FC } from "react";
import { IconButton } from "@mui/material";
import StarIcon from "@mui/icons-material/Star";
import StarOutlineIcon from "@mui/icons-material/StarOutline";
// import { NavLinkProps } from "react-router-dom";

// type FavouriteProps = {
//   favourite: boolean;
// }

// type FavouriteButtonProps = FavouriteProps & ButtonBaseProps & IconButtonProps & NavLinkProps;

const FavouriteButton: FC<any> = ({ favourite, ...rest }) => {
  return (
    <IconButton aria-label="favourite" color={favourite ? "warning" : "default"} {...rest}>
      {favourite ? <StarIcon /> : <StarOutlineIcon />}
    </IconButton>
  );
};

export default FavouriteButton;
