import { FC } from "react";
import { NavLink } from "react-router-dom";
import {
  ListItem,
  ListItemText,
  ListItemAvatar,
  Avatar,
  ListItemButton,
  Divider,
  Paper,
} from "@mui/material";
import { USER_ROUTES } from "../../types/user.type";
import LoadingSign from "./Skeleton";

const ListBox: FC<any> = ({ user, secondaryAction, ...rest }: any) => {
  return (
    <Paper elevation={0} {...rest}>
      {user && (
        <ListItem disablePadding secondaryAction={secondaryAction(user)}>
          <ListItemButton
            component={NavLink}
            to={`/${USER_ROUTES.USER}/${user?.login}`}
          >
            <ListItemAvatar>
              <Avatar alt="user avatar" src={user?.avatar_url} />
            </ListItemAvatar>
            <ListItemText primary={`@${user?.login}`} secondary={user?.bio} />
          </ListItemButton>
        </ListItem>
      )}
      {!user && <LoadingSign />}
      <Divider sx={{ position: "relative", zIndex: 9 }} />
    </Paper>
  );
};

export default ListBox;
