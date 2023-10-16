import { createReducer } from "@reduxjs/toolkit";
import { fetchUser, toggleUserFavourite } from "./action";
import { initialState } from "./state";

export const userReducer = createReducer(initialState, (builder) => {
  builder
    .addCase(fetchUser.pending, (state) => {
      state.loading = true;
    })
    .addCase(fetchUser.fulfilled, (state, action) => ({
      ...state,
      loading: false,
      data: { ...state.data, ...action.payload },
    }))
    .addCase(fetchUser.rejected, (state, action) => {
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
        ...action.payload,
      },
    }))
    .addCase(toggleUserFavourite.rejected, (state, action) => {
      state.loading = false;
      state.error = action.error;
    })
    .addDefaultCase(() => initialState);
});
