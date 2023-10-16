export const usersData = (state: any) => state.users.data;
export const totalData = (state: any) => state.users.total;
export const params = (state: any) => state.users.params;
export const page = (state: any) => state.users.params.page;
export const query = (state: any) => state.users.params.q;

export const usersLoading = (state: any) => state.users.loading;
export const error = (state: any) => state.users.error;
