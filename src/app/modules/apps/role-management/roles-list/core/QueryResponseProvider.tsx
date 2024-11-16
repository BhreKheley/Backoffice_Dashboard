/* eslint-disable react-refresh/only-export-components */
/* eslint-disable react-hooks/exhaustive-deps */
import { FC, useContext, useState, useEffect, useMemo } from "react";
import { useQuery } from "react-query";
import {
  createResponseContext,
  initialQueryResponse,
  initialQueryState,
  PaginationState,
  QUERIES,
  stringifyRequestQuery,
  WithChildren,
} from "../../../../../../_metronic/helpers";
import { getRoles } from "./_requests"; // Mengubah ke getRoles
import { Role } from "./_models"; // Mengubah ke Role
import { useQueryRequest } from "./QueryRequestProvider";

const QueryResponseContext = createResponseContext<Role>(initialQueryResponse); // Menggunakan Role

const QueryResponseProvider: FC<WithChildren> = ({ children }) => {
  const { state } = useQueryRequest();

  // Menyiapkan query berdasarkan state kueri
  const [query, setQuery] = useState<string>(stringifyRequestQuery(state));
  const updatedQuery = useMemo(() => stringifyRequestQuery(state), [state]);

  // Mengupdate query jika ada perubahan pada state
  useEffect(() => {
    if (query !== updatedQuery) {
      setQuery(updatedQuery);
    }
  }, [updatedQuery]);

  // Menggunakan React Query untuk mengambil data role
  const {
    isFetching,
    refetch,
    data: response,
  } = useQuery(
    `${QUERIES.ROLES_LIST}-${query}`, // Mengubah key menjadi ROLES_LIST
    () => {
      return getRoles(query); // Mengambil data role
    },
    { cacheTime: 0, keepPreviousData: true, refetchOnWindowFocus: false }
  );

  return (
    <QueryResponseContext.Provider
      value={{ isLoading: isFetching, refetch, response, query }}
    >
      {children} {/* Menyediakan data melalui konteks */}
    </QueryResponseContext.Provider>
  );
};

// Hook untuk mengambil data dari konteks
const useQueryResponse = () => useContext(QueryResponseContext);

// Hook untuk mendapatkan data role
const useQueryResponseData = () => {
  const { response } = useQueryResponse();
  if (!response) {
    return [];
  }
  return response?.data || [];
};

// Hook untuk mendapatkan informasi pagination
const useQueryResponsePagination = () => {
  const defaultPaginationState: PaginationState = {
    links: [],
    ...initialQueryState,
  };

  const { response } = useQueryResponse();
  if (!response || !response.payload || !response.payload.pagination) {
    return defaultPaginationState;
  }

  return response.payload.pagination;
};

// Hook untuk mengecek apakah data sedang dimuat
const useQueryResponseLoading = (): boolean => {
  const { isLoading } = useQueryResponse();
  return isLoading;
};

export {
  QueryResponseProvider,
  useQueryResponse,
  useQueryResponseData,
  useQueryResponsePagination,
  useQueryResponseLoading,
};
