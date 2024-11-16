import { FC, useEffect, useState } from "react";
import * as Yup from "yup";
import { useFormik } from "formik";
import { isNotEmpty } from "../../../../../../_metronic/helpers";
import { initialEmployee, Employee } from "../core/_models";
import clsx from "clsx";
import { useListView } from "../core/ListViewProvider";
import { EmployeesListLoading } from "../components/loading/EmployeesListLoading";
import { createEmployee, updateEmployee } from "../core/_requests";
import { useQueryResponse } from "../core/QueryResponseProvider";
import axios from "axios";
import { User } from "../../../user-management/users-list/core/_models";

type Props = {
  isEmployeeLoading: boolean;
  employee: Employee;
};

const editEmployeeSchema = Yup.object().shape({
  full_name: Yup.string()
    .min(3, "Minimal 3 karakter")
    .max(50, "Maksimal 50 karakter")
    .required("Nama lengkap wajib diisi"),
  phone: Yup.string()
    .min(10, "Minimal 10 karakter")
    .max(15, "Maksimal 15 karakter")
    .required("Nomor telepon wajib diisi"),
  position_id: Yup.string().required("Jabatan wajib diisi"),
  division_id: Yup.string().required("Divisi wajib diisi"),
});

const EmployeeEditModalForm: FC<Props> = ({ employee, isEmployeeLoading }) => {
  const { setItemIdForUpdate } = useListView();
  const { refetch } = useQueryResponse();
  const [users, setUsers] = useState<User[]>([]);
  const [positions, setPositions] = useState<
    { id: string; position_name: string }[]
  >([]);
  const [divisions, setDivisions] = useState<
    { id: string; division_name: string }[]
  >([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch all users
        const usersResponse = await axios.get("http://localhost:8080/user/");
        const allUsers = usersResponse.data.data;

        // Fetch employees to find users already in use
        const employeesResponse = await axios.get(
          "http://localhost:8080/employee/"
        );
        const usedUserIds = employeesResponse.data.data.map(
          (emp: Employee) => emp.user_id
        );

        // Filter out users that are already assigned to employees
        const availableUsers = allUsers.filter(
          (user: User) => !usedUserIds.includes(user.id)
        );
        setUsers(availableUsers);

        // Fetch divisions and positions
        const divisionsResponse = await axios.get(
          "http://localhost:8080/division/"
        );
        setDivisions(divisionsResponse.data);

        const positionsResponse = await axios.get(
          "http://localhost:8080/position/"
        );
        setPositions(positionsResponse.data);
      } catch (error) {
        console.error("Error fetching data", error);
      }
    };

    fetchData();
  }, []);

  const EmployeeForEdit: Employee = {
    ...employee,
    full_name: employee.full_name || initialEmployee.full_name,
    phone: employee.phone || initialEmployee.phone,
    position_id: employee.position_id || initialEmployee.position_id,
    division_id: employee.division_id || initialEmployee.division_id,
    user_id: employee.user_id || undefined,
  };

  const cancel = (withRefresh?: boolean) => {
    if (withRefresh) {
      refetch();
    }
    setItemIdForUpdate(undefined);
  };

  const formik = useFormik({
    initialValues: EmployeeForEdit,
    validationSchema: editEmployeeSchema,
    onSubmit: async (values, { setSubmitting }) => {
      setSubmitting(true);
      try {
        const updatedValues = {
          ...values,
          user_id: Number(values.user_id),
          position_id: Number(values.position_id),
          division_id: Number(values.division_id),
        };
        if (isNotEmpty(values.id)) {
          await updateEmployee(updatedValues);
        } else {
          await createEmployee(updatedValues);
        }
      } catch (ex) {
        console.error(ex);
      } finally {
        setSubmitting(false);
        cancel(true);
      }
    },
  });

  return (
    <form
      id="kt_modal_add_employee_form"
      className="form"
      onSubmit={formik.handleSubmit}
      noValidate
    >
      <div
        className="d-flex flex-column scroll-y me-n7 pe-7"
        id="kt_modal_add_employee_scroll"
      >
        {/* User Selection */}
        <div className="mb-4">
          <label className="required fw-bold fs-6 mb-2">User</label>
          <div className="relative">
            <select
              {...formik.getFieldProps("user_id")}
              className="form-select form-select-solid"
              disabled={formik.isSubmitting || isEmployeeLoading}
            >
              <option value="">Pilih user</option>
              {users.map((user) => (
                <option key={user.id} value={String(user.id)}>
                  {user.username}
                </option>
              ))}
            </select>
            {formik.touched.user_id && formik.errors.user_id && (
              <div className="fv-plugins-message-container text-danger">
                <span className="fv-help-block">{formik.errors.user_id}</span>
              </div>
            )}
          </div>
        </div>

        {/* Nama Lengkap */}
        <div className="fv-row mb-7">
          <label className="required fw-bold fs-6 mb-2">Nama Lengkap</label>
          <input
            placeholder="Nama Lengkap"
            {...formik.getFieldProps("full_name")}
            type="text"
            className={clsx("form-control form-control-solid mb-3", {
              "is-invalid": formik.touched.full_name && formik.errors.full_name,
              "is-valid": formik.touched.full_name && !formik.errors.full_name,
            })}
          />
          {formik.touched.full_name && formik.errors.full_name && (
            <div className="fv-plugins-message-container">
              <span className="fv-help-block">{formik.errors.full_name}</span>
            </div>
          )}
        </div>

        {/* Nomor Telepon */}
        <div className="fv-row mb-7">
          <label className="required fw-bold fs-6 mb-2">Nomor Telepon</label>
          <input
            placeholder="Nomor Telepon"
            {...formik.getFieldProps("phone")}
            className={clsx("form-control form-control-solid mb-3", {
              "is-invalid": formik.touched.phone && formik.errors.phone,
              "is-valid": formik.touched.phone && !formik.errors.phone,
            })}
            type="text"
            disabled={formik.isSubmitting || isEmployeeLoading}
          />
          {formik.touched.phone && formik.errors.phone && (
            <div className="fv-plugins-message-container">
              <span className="fv-help-block">{formik.errors.phone}</span>
            </div>
          )}
        </div>

        {/* Jabatan */}
        <div className="mb-4">
          <label className="required fw-bold fs-6 mb-2">Jabatan</label>
          <div className="relative">
            <select
              {...formik.getFieldProps("position_id")}
              className="form-select form-select-solid"
              disabled={formik.isSubmitting || isEmployeeLoading}
            >
              <option value="">Pilih Jabatan</option>
              {positions.map((position) => (
                <option key={position.id} value={String(position.id)}>
                  {position.position_name}
                </option>
              ))}
            </select>
            {formik.touched.position_id && formik.errors.position_id && (
              <div className="fv-plugins-message-container text-danger">
                <span className="fv-help-block">
                  {formik.errors.position_id}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Divisi */}
        <div className="mb-4">
          <label className="required fw-bold fs-6 mb-2">Divisi</label>
          <div className="relative">
            <select
              {...formik.getFieldProps("division_id")}
              className="form-select form-select-solid"
              disabled={formik.isSubmitting || isEmployeeLoading}
            >
              <option value="">Pilih Divisi</option>
              {divisions.map((division) => (
                <option key={division.id} value={String(division.id)}>
                  {division.division_name}
                </option>
              ))}
            </select>
            {formik.touched.division_id && formik.errors.division_id && (
              <div className="fv-plugins-message-container text-danger">
                <span className="fv-help-block">
                  {formik.errors.division_id}
                </span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Footer with cancel and submit buttons */}
      <div className="modal-footer">
        <button
          type="button"
          onClick={() => cancel()}
          className="btn btn-light me-3"
          disabled={formik.isSubmitting}
        >
          Batal
        </button>
        <button
          type="submit"
          className="btn btn-primary"
          disabled={formik.isSubmitting}
        >
          {formik.isSubmitting ? "Menyimpan..." : "Simpan"}
        </button>
      </div>
    </form>
  );
};

export { EmployeeEditModalForm };
