import { Error, Fetching } from "../../../core";

export type UserSearch = IUserSearchResult | Error | Fetching;
export type UserProps = {
  login: string;
  avatar_url: string;
  bio: string;
};

export type UsersProps = {
  users: Array<UserProps>;
};

export enum USER_ROUTES {
  DEFAULT="/",
  USER="user",
  FAVOURITES="favourties"
}

export interface StatsProps {
  caption: string
  value: number;
}

/**
 * Interfaces: User
 */
export interface IServerUser {
  id: any;
  login: string;
  name: string;
  bio?: string;
  avatar_url: string;
  html_url?: string;
  followers?: number;
  following?: number;
  public_repos?: number;
  favourite: boolean;
}

export interface IUser extends IServerUser {
  stats?: Array<IUserStat>;
  index?: number;
}

export interface IUserStat {
  caption: string;
  value: number;
}

export interface IUserSearchServerResult {
  total_count: number;
  incomplete_results: boolean;
  items: IUser[];
}
export interface IUserSearchResult {
  total: number;
  hasMore: boolean;
  users: IUser[];
}
