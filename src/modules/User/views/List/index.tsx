import React, { FC, useCallback, useContext, useEffect } from "react";
import InfiniteWindowScroller from "../../functions/withInfiniteScroll";
import FavouriteButton from "../../../../components/Favourite";
import { Typography } from "@mui/material";
import { SearchContext } from "../../../Layouts";
import { getPageNumber } from "../../helpers";
import { ITEM_HEIGHT, PAGE_SIZE } from "../../constants";
import {
  useAppDispatch,
  useAppSelector,
} from "../../../../core/redux-store/hooks";
import { totalData, usersData, usersLoading } from "../../redux/users/selector";
import {
  fetchUsers,
  resetUsers,
  toggleUserFavourite,
} from "../../redux/users/action";

interface UserListProps {}

const UserList: FC<UserListProps> = () => {
  const dispatch = useAppDispatch();
  const term = useContext(SearchContext);

  const total: number = useAppSelector(totalData);
  const users: any = useAppSelector(usersData);
  const pending: boolean = useAppSelector(usersLoading);

  const isRowLoaded = useCallback(
    ({ index }: { index: number }) => !!users[`${index}`],
    [users]
  );

  const loadMoreRows = useCallback(
    ({ startIndex }: { startIndex: number }) => {
      const next = getPageNumber(startIndex);
      dispatch(
        fetchUsers({
          q: term,
          page: next,
          per_page: PAGE_SIZE,
          startIndex,
        })
      );
    },
    [term, dispatch]
  );

  const updateUser = useCallback(
    (user: any) => dispatch(toggleUserFavourite(user)),
    [dispatch]
  );

  useEffect(() => {
    if (term && term !== "") loadMoreRows({ startIndex: 0 });
    else dispatch(resetUsers());
  }, [term, dispatch, loadMoreRows]);

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

export default UserList;
