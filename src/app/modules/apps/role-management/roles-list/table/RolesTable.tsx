import { useMemo } from "react";
import { useTable, ColumnInstance, Row } from "react-table";
import { CustomHeaderColumn } from "./columns/CustomHeaderColumn";
import { CustomRow } from "./columns/CustomRow";
import {
  useQueryResponseData,
  useQueryResponseLoading,
} from "../core/QueryResponseProvider";
import { rolesColumns } from "./columns/_columns";
import { Role } from "../core/_models";
import { RolesListLoading } from "../components/loading/RolesListLoading";
import { RolesListPagination } from "../components/pagination/RolesListPagination";
import { KTCardBody } from "../../../../../../_metronic/helpers";

const RolesTable = () => {
  const roles = useQueryResponseData();
  const isLoading = useQueryResponseLoading();
  const data = useMemo(() => roles, [roles]);
  const columns = useMemo(() => rolesColumns, []);
  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } =
    useTable({
      columns,
      data,
    });

  return (
    <KTCardBody className="py-4">
      <div className="table-responsive">
        <table
          id="kt_table_roles"
          className="table align-middle table-row-dashed fs-6 gy-5 dataTable no-footer"
          {...getTableProps()}
        >
          <thead>
            {headerGroups.map((headerGroup) => (
              <tr
                {...headerGroup.getHeaderGroupProps()}
                className="text-start text-muted fw-bolder fs-7 text-uppercase gs-0"
              >
                {headerGroup.headers.map((column: ColumnInstance<Role>) => (
                  <th {...column.getHeaderProps()} className="text-gray-800">
                    <CustomHeaderColumn column={column} />
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody className="text-gray-600 fw-bold" {...getTableBodyProps()}>
            {isLoading ? (
              <tr>
                <td colSpan={columns.length} className="text-center">
                  <RolesListLoading />
                </td>
              </tr>
            ) : rows.length > 0 ? (
              rows.map((row: Row<Role>, i) => {
                prepareRow(row);
                return <CustomRow row={row} key={`row-${i}-${row.id}`} />;
              })
            ) : (
              <tr>
                <td colSpan={columns.length} className="text-center">
                  <div className="p-3">Tidak ada data yang ditemukan</div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      <RolesListPagination />
    </KTCardBody>
  );
};

export { RolesTable };
