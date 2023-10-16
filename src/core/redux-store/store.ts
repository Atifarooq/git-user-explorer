import { configureStore } from "@reduxjs/toolkit";
import { usersReducer } from "../../modules/User/redux/users/reducer";
import { favouritesReducer } from "../../modules/User/redux/favourites/reducer";
import { userReducer } from "../../modules/User/redux/user/reducer";

export const store = configureStore({
  reducer: {
    users: usersReducer,
    favourites: favouritesReducer,
    user: userReducer
  },
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;
