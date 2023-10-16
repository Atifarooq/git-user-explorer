import { createAction, createAsyncThunk } from "@reduxjs/toolkit";
import { observableToPromise } from "../../helpers";
import favouriteService from "../../services/favourites.service";

export const fetchFavourites = createAsyncThunk(
  "favourites/fetch",
  async (params: any) =>
    observableToPromise(favouriteService.favourites(params))
);

export const toggleFavourite = createAsyncThunk(
  "favourite/update",
  async (payload: any) => observableToPromise(favouriteService.toggle(payload))
);

export const resetFavourites = createAction("favourites/reset");
