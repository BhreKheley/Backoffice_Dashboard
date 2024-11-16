import { useMemo } from 'react';
import { useTable, ColumnInstance, Row } from 'react-table';
import { CustomHeaderColumn } from './columns/CustomHeaderColumn';
import { CustomRow } from './columns/CustomRow';
import { useQueryResponseData, useQueryResponseLoading } from '../core/QueryResponseProvider';
import { employeesColumns } from './columns/_columns';
import { Employee } from '../core/_models';
import { EmployeesListLoading } from '../components/loading/EmployeesListLoading';
import { EmployeesListPagination } from '../components/pagination/EmployeesListPagination';
import { KTCardBody } from '../../../../../../_metronic/helpers';

const EmployeesTable = () => {
  const employees = useQueryResponseData();
  const isLoading = useQueryResponseLoading();
  const data = useMemo(() => employees, [employees]);
  
  const columns = useMemo(() => employeesColumns, []);
  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } = useTable({
    columns,
    data: data as Employee[],
  });

  return (
    <KTCardBody className='py-4'>
      <div className='table-responsive'>
        <table
          id='kt_table_employees'
          className='table align-middle table-row-dashed fs-6 gy-5 dataTable no-footer'
          {...getTableProps()}
        >
          <thead>
            {headerGroups.map(headerGroup => (
              <tr {...headerGroup.getHeaderGroupProps()} className='text-start text-muted fw-bolder fs-7 text-uppercase gs-0'>
                {headerGroup.headers.map((column: ColumnInstance<Employee>) => (
                  <th {...column.getHeaderProps()} className='text-gray-800'>
                    <CustomHeaderColumn column={column} />
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody className='text-gray-600 fw-bold' {...getTableBodyProps()}>
            {isLoading ? (
              <tr>
                <td colSpan={columns.length} className='text-center'>
                  <EmployeesListLoading />
                </td>
              </tr>
            ) : rows.length > 0 ? (
              rows.map((row: Row<Employee>, i) => {
                prepareRow(row);
                return <CustomRow row={row} key={`row-${i}-${row.id}`} />;
              })
            ) : (
              <tr>
                <td colSpan={columns.length} className='text-center'>
                  <div className='p-3'>No matching records found</div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      <EmployeesListPagination />
    </KTCardBody>
  );
};

export { EmployeesTable };
