import { FC } from "react";
import { ColumnInstance } from "react-table";
import { Role } from "../../core/_models"; // Changed User to Role

type Props = {
  column: ColumnInstance<Role>; // Changed User to Role
};

const CustomHeaderColumn: FC<Props> = ({ column }) => (
  <>
    {column.Header && typeof column.Header === "string" ? (
      <th {...column.getHeaderProps()}>{column.render("Header")}</th>
    ) : (
      column.render("Header")
    )}
  </>
);

export { CustomHeaderColumn };
