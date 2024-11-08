import { Column } from "react-table";
import { UserInfoCell } from "./UserInfoCell";
import { UserActionsCell } from "./UserActionsCell";
import { UserSelectionCell } from "./UserSelectionCell";
import { UserCustomHeader } from "./UserCustomHeader";
import { UserSelectionHeader } from "./UserSelectionHeader";
import { User } from "../../core/_models";
import { UserIsActiveCell } from "./UserIsActiveCell";
import { string } from "yup";

const usersColumns: ReadonlyArray<Column<User>> = [
  {
    Header: (props) => <UserSelectionHeader tableProps={props} />,
    id: "selection",
    Cell: ({ ...props }) => (
      <UserSelectionCell id={props.data[props.row.index].id} />
    ),
  },
  {
    Header: (props) => (
      <UserCustomHeader
        tableProps={props}
        title="Name"
        className="min-w-125px"
      />
    ),
    id: "name",
    Cell: ({ ...props }) => <UserInfoCell user={props.data[props.row.index]} />,
  },
  {
    Header: (props) => (
      <UserCustomHeader
        tableProps={props}
        title="Role"
        className="min-w-125px"
      />
    ),
    accessor: "role_name",
  },
  {
    Header: (props) => (
      <UserCustomHeader
        tableProps={props}
        title="Status"
        className="min-w-125px"
      />
    ),
    id: "is_active",
    Cell: ({ ...props }) => (
      <UserIsActiveCell is_active={props.data[props.row.index].is_active} />
    ),
  },
  {
    Header: (props) => (
      <UserCustomHeader
        tableProps={props}
        title="Actions"
        className="text-end min-w-100px"
      />
    ),
    id: "actions",
    Cell: ({ ...props }) => (
      <UserActionsCell
        id={props.data[props.row.index].id}
        role_name={props.data[props.row.index].role_name}
        is_active={props.data[props.row.index].is_active}
      />
    ),
  },
];

export { usersColumns };
