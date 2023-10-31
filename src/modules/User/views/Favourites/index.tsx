import React, { FC, useCallback, useEffect } from "react";
import InfiniteWindowScroller from "../../functions/withInfiniteScroll";
import { Typography } from "@mui/material";
import { getPageNumber } from "../../helpers";
import { ITEM_HEIGHT, PAGE_SIZE } from "../../constants";
import FavouriteButton from "../../../../shared/components/Favourite";
import {
  useAppDispatch,
  useAppSelector,
} from "../../../../core/redux-store/hooks";
import { totalData, usersData, usersLoading } from "../../redux/favourites/selector";
import { fetchFavourites, toggleFavourite } from "../../redux/favourites/action";

interface UserListProps {}

const FavouriteUsersList: FC<UserListProps> = () => {
  const dispatch = useAppDispatch();

  const total: number = useAppSelector(totalData);
  const users: any = useAppSelector(usersData);
  const pending: boolean = useAppSelector(usersLoading);

  const isRowLoaded = useCallback(
    ({ index }: { index: number }) => !!users[`${index}`],
    [users]
  );

  const loadMoreRows = useCallback(({ startIndex }: { startIndex: number }) => {
    const next = getPageNumber(startIndex);
    dispatch(
      fetchFavourites({
        page: next,
        per_page: PAGE_SIZE,
        startIndex,
      })
    );
  }, [dispatch]);

  const updateUser = useCallback(
    (user: any) => dispatch(toggleFavourite(user)),
    [dispatch]
  );

  useEffect(() => {
    loadMoreRows({ startIndex: 0 });
  }, [loadMoreRows]);

  return total > 0 ? (
    <InfiniteWindowScroller
      rowHeight={ITEM_HEIGHT}
      total={total}
      list={users}
      loading={pending}
      secondaryAction={(user: any) => (
        <FavouriteButton
          favourite={user.favourite}
          onClick={() => updateUser(user)}
        />
      )}
      rowLoaded={isRowLoaded}
      loadMore={loadMoreRows}
    />
  ) : (
    <Typography align="center" variant="body2">
      No search results...
    </Typography>
  );
};

export default FavouriteUsersList;
