import { useMemo } from "react";
import { useMatches } from "react-router-dom";
import { RouteInfo, RouteData } from "../types/route.type";

const useRouterData = <T extends RouteData>(): T | undefined => {
  const match: RouteInfo<T>[] | null = useMatches() as RouteInfo<T>[] | null;

  const routeData = useMemo(() => {
    if (match) {
      const lastMatch = match[match.length - 1];
      return lastMatch.data;
    }
  }, [match])

  return routeData;
};

export default useRouterData;
