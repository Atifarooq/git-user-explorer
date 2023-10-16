import { useMemo, useReducer } from "react";
import { Error } from "../core";

interface ServiceCallResult<T> extends APICallState<T> {
  dispatch: (...args: any) => void;
  handleSubscription: any;
}

export interface APICallState<T> {
  data: T | any;
  error: Error | null;
  pending: boolean;
}

export enum DataCallAction {
  SUCCESS = "SUCCESS",
  UPDATE = "UPDATE",
  REQUEST = "REQUEST",
  ERROR = "ERROR",
  RESET = "RESET",
}

type DataCallActions<T> =
  | { type: DataCallAction.SUCCESS; payload: T }
  | { type: DataCallAction.UPDATE; payload: T }
  | { type: DataCallAction.REQUEST }
  | { type: DataCallAction.RESET; payload: T }
  | { type: DataCallAction.ERROR; payload: Error };

const initialState: APICallState<any> = {
  data: undefined,
  error: null,
  pending: false,
};

const reducer = <T>(state: APICallState<T>, action: DataCallActions<T>) => {
  switch (action.type) {
    case DataCallAction.REQUEST:
      return {
        ...state,
        pending: true,
      };
    case DataCallAction.SUCCESS:
      return {
        ...state,
        pending: false,
        data: action.payload,
      };
    case DataCallAction.ERROR:
      return {
        ...state,
        pending: false,
        error: action.payload,
      };
    case DataCallAction.RESET:
      return {
        data: action.payload,
        pending: false,
        error: null,
      };
    default:
      return state;
  }
};

export const useAPICallHandler = <T>(
  initData?: any,
  payloadMapper?: any
): ServiceCallResult<T> => {
  const [{ pending, data, error }, dispatch] = useReducer(reducer, {
    ...initialState,
    data: initData,
  });

  const handleSubscription = useMemo(
    () => ({
      next: (resp: any) => {
        resp.fetching
          ? dispatch({ type: DataCallAction.REQUEST })
          : dispatch({
              type: DataCallAction.SUCCESS,
              payload: payloadMapper ? payloadMapper(resp) : resp,
            });
      },
      error: (err: Error) =>
        dispatch({ type: DataCallAction.ERROR, payload: err }),
    }),
    [payloadMapper]
  );

  return { pending, data, error, dispatch, handleSubscription };
};
