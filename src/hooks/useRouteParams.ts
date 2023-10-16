import { useParams } from "react-router-dom";

export const useRouteParams = <T extends Record<string, unknown>>() => useParams() as T;
