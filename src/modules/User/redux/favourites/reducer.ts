import { createReducer } from "@reduxjs/toolkit";
import { fetchFavourites, resetFavourites, toggleFavourite } from "./action";
import { initialState } from "./state";

export const favouritesReducer = createReducer(initialState, (builder) => {
  builder
    .addCase(fetchFavourites.pending, (state) => {
      state.loading = true;
    })
    .addCase(fetchFavourites.fulfilled, (state, action) => {
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
    .addCase(fetchFavourites.rejected, (state, action) => {
      state.loading = false;
      state.error = action.error;
    })
    .addCase(toggleFavourite.pending, (state) => {
      state.loading = true;
    })
    .addCase(toggleFavourite.fulfilled, (state: any, action: any) => ({
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
    .addCase(toggleFavourite.rejected, (state, action) => {
      state.loading = false;
      state.error = action.error;
    })
    .addCase(resetFavourites, () => initialState)
    .addDefaultCase(() => initialState);
});
