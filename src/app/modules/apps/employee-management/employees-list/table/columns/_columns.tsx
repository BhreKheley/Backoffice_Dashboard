import { Column } from "react-table";
import { EmployeeInfoCell } from "./EmployeeInfoCell";
import { EmployeeActionsCell } from "./EmployeeActionsCell";
import { EmployeeSelectionCell } from "./EmployeeSelectionCell";
import { EmployeeCustomHeader } from "./EmployeeCustomHeader";
import { EmployeeSelectionHeader } from "./EmployeeSelectionHeader";
import { Employee } from "../../core/_models";
import { EmployeeIsActiveCell } from "./EmployeeIsActiveCell";

const employeesColumns: ReadonlyArray<Column<Employee>> = [
  {
    Header: (props) => <EmployeeSelectionHeader tableProps={props} />,
    id: "selection",
    Cell: ({ ...props }) => (
      <EmployeeSelectionCell id={props.data[props.row.index].id} />
    ),
  },
  {
    Header: (props) => (
      <EmployeeCustomHeader
        tableProps={props}
        title="Full Name"
        className="min-w-150px"
      />
    ),
    id: "full_name",
    Cell: ({ ...props }) => (
      <EmployeeInfoCell employee={props.data[props.row.index]} />
    ),
  },
  {
    Header: (props) => (
      <EmployeeCustomHeader
        tableProps={props}
        title="Phone"
        className="min-w-125px"
      />
    ),
    accessor: "phone",
  },
  {
    Header: (props) => (
      <EmployeeCustomHeader
        tableProps={props}
        title="Position"
        className="min-w-125px"
      />
    ),
    accessor: "position_id",
  },
  {
    Header: (props) => (
      <EmployeeCustomHeader
        tableProps={props}
        title="Division"
        className="min-w-125px"
      />
    ),
    accessor: "division_id",
  },
  {
    Header: (props) => (
      <EmployeeCustomHeader
        tableProps={props}
        title="Status"
        className="min-w-125px"
      />
    ),
    id: "is_active",
    Cell: ({ ...props }) => (
      <EmployeeIsActiveCell is_active={props.data[props.row.index].is_active} />
    ),
  },
  {
    Header: (props) => (
      <EmployeeCustomHeader
        tableProps={props}
        title="Actions"
        className="text-end min-w-100px"
      />
    ),
    id: "actions",
    Cell: ({ ...props }) => (
      <EmployeeActionsCell id={props.data[props.row.index].id} />
    ),
  },
];

export { employeesColumns };
