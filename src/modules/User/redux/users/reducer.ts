import { createReducer } from "@reduxjs/toolkit";
import { fetchUsers, resetUsers, toggleUserFavourite } from "./action";
import { initialState } from "./state";

export const usersReducer = createReducer(initialState, (builder) => {
  builder
    .addCase(fetchUsers.pending, (state) => {
      state.loading = true;
    })
    .addCase(fetchUsers.fulfilled, (state, action) => {
      const { users, params, total, hasMore } = action.payload as any;
      return {
        ...state,
        loading: false,
        data: { ...state.data, ...users },
        params,
        total,
        hasMore,
      };
    })
    .addCase(fetchUsers.rejected, (state, action) => {
      state.loading = false;
      state.error = action.error;
    })
    .addCase(toggleUserFavourite.pending, (state) => {
      state.loading = true;
    })
    .addCase(toggleUserFavourite.fulfilled, (state: any, action: any) => ({
      ...state,
      loading: false,
      data: {
        ...state.data,
        [`${action.payload.index}`]: {
          ...state.data[`${action.payload.index}`],
          favourite: action.payload.favourite,
        },
      },
    }))
    .addCase(toggleUserFavourite.rejected, (state, action) => {
      state.loading = false;
      state.error = action.error;
    })
    .addCase(resetUsers, () => initialState)
    .addDefaultCase(() => initialState);
});
