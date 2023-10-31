import React, { FC, useEffect } from "react";

import ItemBox from "../../components/ItemBox";
import { useRouteParams } from "../../../../shared/hooks/useRouteParams";
import FavouriteButton from "../../../../shared/components/Favourite";
import {
  useAppDispatch,
  useAppSelector,
} from "../../../../core/redux-store/hooks";
import { userData, userLoading } from "../../redux/user/selector";
import { fetchUser, toggleUserFavourite } from "../../redux/user/action";

const User: FC = () => {
  const { userId } = useRouteParams<{ userId: string }>();
  const dispatch = useAppDispatch();
  const user = useAppSelector(userData);
  const pending = useAppSelector(userLoading);

  useEffect(() => {
    userId && dispatch(fetchUser(userId));
  }, [userId, dispatch]);

  return (
    <ItemBox
      loading={pending}
      user={user}
      secondaryAction={
        <FavouriteButton
          favourite={user.favourite}
          onClick={() => dispatch(toggleUserFavourite(user))}
        />
      }
    />
  );
};

export default User;
