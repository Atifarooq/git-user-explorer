import { IUser } from "../../types/user.type";

export interface UsersState {
  loading: boolean;
  error: any;
  data: {};
  hasMore: boolean;
  total: number;
  params: {
    page: null | number;
    q: null | string;
  };
}

export const initialState: UsersState = {
  loading: false,
  hasMore: false,
  error: null,
  data: {} as Record<string, IUser>,
  total: 0,
  params: {
    page: null as null | number,
    q: null as null | string,
  },
};
