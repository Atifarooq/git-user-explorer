import { createAction, createAsyncThunk } from "@reduxjs/toolkit";
import userSerice from "../../services/user.service";
import favouriteService from "../../services/favourites.service";
import { observableToPromise } from "../../helpers";

export const fetchUsers = createAsyncThunk("users/fetch", async (params: any) =>
  observableToPromise(userSerice.search(params))
);

export const toggleUserFavourite = createAsyncThunk(
  "user/update",
  async (payload: any) => observableToPromise(favouriteService.toggle(payload))
);

export const resetUsers = createAction("users/reset");
