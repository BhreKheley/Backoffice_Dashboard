import { FC } from "react";

type Props = {
  is_active?: boolean;
};

const EmployeeIsActiveCell: FC<Props> = ({ is_active }) => (
  <>
    {" "}
    {is_active ? (
      <div className="badge badge-light-success fw-bolder">Aktif</div>
    ) : (
      <div className="badge badge-light-danger fw-bolder">Tidak Aktif</div>
    )}
  </>
);

export { EmployeeIsActiveCell };
