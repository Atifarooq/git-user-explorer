import { Observable, Subscription } from "rxjs";
import { PAGE_SIZE } from "../constants";
import { IUserSearchResult, IUserSearchServerResult } from "../types/user.type";

export const getPageNumber = (startIndex: number): number => {
  const pNum: number = startIndex / PAGE_SIZE;
  return startIndex % PAGE_SIZE === 0 ? pNum + 1 : Math.ceil(pNum) || 1;
};

export const transformUsersData = (
  data: IUserSearchServerResult,
  params: any
): IUserSearchResult | any => {
  const { incomplete_results: hasMore, items, total_count: total } = data;
  const users: any = {};
  for (let index = 0; index < items.length; index++) {
    const identity = params.startIndex + index;
    users[identity] = { ...items[index], index: identity };
  }

  return {
    total,
    users,
    params,
    hasMore,
  };
};

export const observableToPromise = (observer$: Observable<any>): Promise<any> => {
  let subscription: Subscription;
  return new Promise((resolve, reject) => {
    subscription = observer$.subscribe({
      next: (resp: any) => {
        if (!resp.fetching) {
          resolve(resp);
          subscription.unsubscribe(); // Unsubscribe when the value is received
        }
      },
      error: (err: Error) => {
        reject(err);
        subscription.unsubscribe(); // Unsubscribe in case of an error as well
      },
    });
  });
};
