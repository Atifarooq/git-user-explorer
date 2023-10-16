export enum APIAction {
  SUCCESS = "success",
  REQUEST = "request",
  ERROR = "error",
}

export interface APICallState {
  content: any;
  error: boolean;
  loading: boolean;
}

export interface APIActions {
  type: APIAction.SUCCESS | APIAction.REQUEST | APIAction.ERROR;
  payload?: any;
}
