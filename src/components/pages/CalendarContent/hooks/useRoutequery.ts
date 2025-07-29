/** Hooks */
import { useMemo } from 'react';
import { useLocation } from 'react-router-dom';

export function useRouteQuery() {
  const searchQueryParams = useLocation().search;

  const query: any = useMemo(() => {
    const urlSearchParams = new URLSearchParams(searchQueryParams);
    const queryParams: any = {};
    for (const [key, value] of urlSearchParams) {
      queryParams[key] = value;
    }
    return queryParams;
  }, [searchQueryParams]);

  return [query];
}
