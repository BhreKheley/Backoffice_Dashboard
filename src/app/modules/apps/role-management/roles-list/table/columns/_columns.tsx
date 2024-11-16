import { Column } from "react-table";
import { RoleInfoCell } from "./RoleInfoCell";
import { RoleActionsCell } from "./RoleActionsCell";
import { RoleSelectionCell } from "./RoleSelectionCell";
import { RoleCustomHeader } from "./RoleCustomHeader";
import { RoleSelectionHeader } from "./RoleSelectionHeader";
import { Role } from "../../core/_models"; // Changed User to Role
import { RoleIsActiveCell } from "./RoleIsActiveCell"; // Ensure this cell works with role data
import { string } from "yup";

const rolesColumns: ReadonlyArray<Column<Role>> = [
  // Changed User to Role
  {
    Header: (props) => <RoleSelectionHeader tableProps={props} />, // Updated to RoleSelectionHeader
    id: "selection",
    Cell: ({ ...props }) => (
      <RoleSelectionCell id={props.data[props.row.index].id} /> // Updated to RoleSelectionCell
    ),
  },
  {
    Header: (props) => (
      <RoleCustomHeader
        tableProps={props}
        title="Name"
        className="min-w-125px"
      />
    ),
    id: "Name",
    Cell: ({ ...props }) => <RoleInfoCell role={props.data[props.row.index]} />, // Updated to RoleInfoCell
  },
  {
    Header: (props) => (
      <RoleCustomHeader
        tableProps={props}
        title="Code"
        className="min-w-125px"
      />
    ),
    accessor: "code", // Ensure this reflects the role's name
  },
  {
    Header: (props) => (
      <RoleCustomHeader
        tableProps={props}
        title="Status"
        className="min-w-125px"
      />
    ),
    id: "is_active",
    Cell: ({ ...props }) => (
      <RoleIsActiveCell is_active={props.data[props.row.index].is_active} /> // Updated to RoleIsActiveCell
    ),
  },
  {
    Header: (props) => (
      <RoleCustomHeader
        tableProps={props}
        title="Actions"
        className="text-end min-w-100px"
      />
    ),
    id: "actions",
    Cell: ({ ...props }) => (
      <RoleActionsCell
        id={props.data[props.row.index].id}
        role_name={props.data[props.row.index].role_name}
        is_active={props.data[props.row.index].is_active ?? false}
      />
    ),
  },
];

export { rolesColumns }; // Changed usersColumns to rolesColumns
