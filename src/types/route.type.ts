export type RouteData = {
  name: string;
  searchBar: boolean;
};

export interface RouteInfo<T = RouteData> {
  id: string;
  pathname: string;
  params: Record<string, any>;
  data: T;
}
