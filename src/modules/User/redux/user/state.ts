import { IUser } from "../../types/user.type";

export interface UserState {
  loading: boolean;
  error: any;
  data: IUser | {};
}

export const initialState: UserState = {
  loading: false,
  error: null,
  data: {}
};
