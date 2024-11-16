/* eslint-disable react-hooks/exhaustive-deps */

import { useEffect, useState } from "react";
import {
  initialQueryState,
  KTIcon,
  useDebounce,
} from "../../../../../../../_metronic/helpers";
import { useQueryRequest } from "../../core/QueryRequestProvider";

const RolesListSearchComponent = () => {
  const { updateState } = useQueryRequest();
  const [searchTerm, setSearchTerm] = useState<string>("");
  // Debounce search term so that it only gives us the latest value ...
  // ... if searchTerm has not been updated within last 150ms.
  // The goal is to only trigger the API call when user stops typing ...
  // ... so that we aren't hitting the API rapidly.
  const debouncedSearchTerm = useDebounce(searchTerm, 150);

  // Effect for API call when search term changes
  useEffect(() => {
    if (debouncedSearchTerm !== undefined && searchTerm !== undefined) {
      updateState({ search: debouncedSearchTerm, ...initialQueryState });
    }
  }, [debouncedSearchTerm]); // Only call effect if debounced search term changes

  return (
    <div className="card-title">
      {/* begin::Search */}
      <div className="d-flex align-items-center position-relative my-1">
        <KTIcon iconName="magnifier" className="fs-1 position-absolute ms-6" />
        <input
          type="text"
          data-kt-role-table-filter="search"
          className="form-control form-control-solid w-250px ps-14"
          placeholder="Search role"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
      {/* end::Search */}
    </div>
  );
};

export { RolesListSearchComponent };
