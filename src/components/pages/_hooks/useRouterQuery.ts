import { useMemo, useCallback } from 'react';
import { useLocation, useHistory } from 'react-router-dom';

export const useRouterQuery = () => {
  const location = useLocation();
  const history = useHistory();

  const queries = useMemo(() => {
    console.log(location);

    const urlParams = new URLSearchParams(location.search);
    let params: any = {};

    const entries = urlParams.entries();

    let item: any = entries.next();

    while (!item.done) {
      params[item.value[0]] = item.value[1];
      item = entries.next();
    }
    console.log('params', params);
    return params;
  }, [location]);

  const updateQueries = useCallback(
    (newQueries: any) => {
      const params = new URLSearchParams(newQueries);

      history.push(`${location.pathname}?${params.toString()}`);
    },
    [location]
  );

  return [queries, updateQueries];
};
