export const usersData = (state: any) => state.favourites.data;
export const totalData = (state: any) => state.favourites.total;
export const params = (state: any) => state.favourites.params;
export const page = (state: any) => state.favourites.params.page;
export const query = (state: any) => state.favourites.params.q;

export const usersLoading = (state: any) => state.favourites.loading;
export const error = (state: any) => state.favourites.error;
