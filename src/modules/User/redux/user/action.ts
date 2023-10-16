import { createAsyncThunk } from "@reduxjs/toolkit";
import userSerice from "../../services/user.service";
import { observableToPromise } from "../../helpers";
import favouriteService from "../../services/favourites.service";

export const fetchUser = createAsyncThunk("user/fetch", async (params: any) =>
  observableToPromise(userSerice.user(params))
);

export const toggleUserFavourite = createAsyncThunk(
  "user/update",
  async (payload: any) => observableToPromise(favouriteService.toggle(payload))
);
