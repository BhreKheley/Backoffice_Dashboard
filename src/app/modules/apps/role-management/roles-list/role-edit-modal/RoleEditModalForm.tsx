import { FC, useEffect, useState } from "react";
import * as Yup from "yup";
import { useFormik } from "formik";
import { initialRole, Role } from "../core/_models"; // Mengubah ke Role
import clsx from "clsx";
import { useListView } from "../core/ListViewProvider";
import {
  createRole, // Mengubah ke createRole
  updateRole, // Mengubah ke updateRole
} from "../core/_requests"; // Mengubah ke _requests yang berkaitan dengan Role
import { useQueryResponse } from "../core/QueryResponseProvider";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import { debounce } from "lodash";
import "react-toastify/dist/ReactToastify.css";
import ConfirmModal from "../components/confirmBox/ConfirmModal";
import Button from "react-bootstrap/Button";

type Props = {
  isRoleLoading: boolean; // Mengubah isUserLoading ke isRoleLoading
  role: Role; // Mengubah ke Role
};

const RoleEditModalForm: FC<Props> = ({ role, isRoleLoading }) => {
  const { setItemIdForUpdate } = useListView();
  const { refetch } = useQueryResponse();
  const [roles, setRoles] = useState<Role[]>([]); // Menyiapkan state untuk roles
  const [roleError, setRoleError] = useState<string | null>(null);
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  useEffect(() => {
    const fetchRoles = async () => {
      try {
        const response = await axios.get("http://localhost:8080/role/");
        setRoles(response.data.data);
      } catch (error) {
        console.error("Error fetching roles:", error);
      }
    };
    fetchRoles();
  }, []);

  const [roleForEdit] = useState<Role>({
    ...role,
    role_name: role.role_name || initialRole.role_name,
  });

  const cancel = (withRefresh?: boolean) => {
    if (withRefresh) {
      refetch();
    }
    setItemIdForUpdate(undefined);
  };

  const editRoleSchema = Yup.object().shape({
    role_name: Yup.string()
      .min(3, "Minimal 3 karakter")
      .max(50, "Maksimal 50 karakter")
      .required("Role wajib diisi"),
  });

  const formik = useFormik({
    initialValues: roleForEdit,
    validationSchema: editRoleSchema,
    enableReinitialize: true,
    onSubmit: async (values, { setSubmitting }) => {
      setSubmitting(true);
      try {
        if (role.id) {
          await updateRole(values); // Edit role
        } else {
          await createRole(values); // Create role
        }

        toast.success("Role berhasil disimpan!");
      } catch (ex) {
        console.error(ex);
        toast.error("Terjadi kesalahan saat menyimpan role");
      } finally {
        setSubmitting(false);
        cancel(true);
      }
    },
  });

  // useEffect(() => {
  //   const checkDuplicates = debounce(async () => {
  //     try {
  //       // Hanya periksa jika role_name berbeda dari yang sedang diedit
  //       if (
  //         formik.values.role_name &&
  //         formik.values.role_name !== role.role_name
  //       ) {
  //         const roleExists = await checkRoleName(formik.values.role_name);
  //         setRoleError(roleExists ? "Role sudah digunakan" : null);
  //       } else {
  //         setRoleError(null); // Reset error jika role_name sama
  //       }
  //     } catch (error) {
  //       console.error("Error checking duplicates:", error);
  //     }
  //   }, 500);

  //   checkDuplicates();

  //   return () => {
  //     checkDuplicates.cancel();
  //   };
  // }, [formik.values.role_name, role.role_name]);

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    setShowConfirmModal(true);
  };

  return (
    <div className="modal-content">
      <form
        id="kt_modal_add_role_form"
        className="form"
        onSubmit={handleSubmit}
        noValidate
      >
        <div className="modal-body">
          {/* Role Name Input */}
          <div className="mb-4">
            <label className="required fw-bold fs-6 mb-2">Role Name</label>
            <input
              placeholder="Masukkan Role Name"
              {...formik.getFieldProps("role_name")}
              type="text"
              className={clsx(
                "form-control form-control-solid",
                {
                  "is-invalid":
                    formik.touched.role_name &&
                    (formik.errors.role_name || roleError),
                },
                {
                  "is-valid":
                    formik.touched.role_name &&
                    !formik.errors.role_name &&
                    !roleError,
                }
              )}
              disabled={formik.isSubmitting || isRoleLoading}
            />
            {formik.touched.role_name &&
              (formik.errors.role_name || roleError) && (
                <div className="fv-plugins-message-container text-danger">
                  <span className="fv-help-block">
                    {formik.errors.role_name || roleError}
                  </span>
                </div>
              )}
          </div>

          {/* Role Code Input */}
          <div className="mb-4">
            <label className="required fw-bold fs-6 mb-2">Role Name</label>
            <input
              placeholder="Masukkan Role Code"
              {...formik.getFieldProps("code")}
              type="text"
              className={clsx(
                "form-control form-control-solid",
                {
                  "is-invalid":
                    formik.touched.code &&
                    (formik.errors.code || roleError),
                },
                {
                  "is-valid":
                    formik.touched.code &&
                    !formik.errors.code &&
                    !roleError,
                }
              )}
              disabled={formik.isSubmitting || isRoleLoading}
            />
            {formik.touched.code &&
              (formik.errors.code || roleError) && (
                <div className="fv-plugins-message-container text-danger">
                  <span className="fv-help-block">
                    {formik.errors.code || roleError}
                  </span>
                </div>
              )}
          </div>

          {/* Active Switch */}
          <div className="mb-4">
            <label className="form-check-label">
              <input
                type="checkbox"
                className="form-check-input"
                checked={formik.values.is_active}
                onChange={(e) =>
                  formik.setFieldValue("is_active", e.target.checked)
                }
                disabled={formik.isSubmitting || isRoleLoading}
              />
              Aktif
            </label>
          </div>
        </div>

        <div className="modal-footer">
          <button
            type="button"
            className="btn btn-light me-3"
            onClick={() => cancel(false)}
            disabled={formik.isSubmitting || isRoleLoading}
          >
            Batal
          </button>
          <button
            type="submit"
            className="btn btn-primary"
            disabled={
              !formik.isValid ||
              formik.isSubmitting ||
              isRoleLoading ||
              !!roleError
            }
          >
            Simpan
          </button>
        </div>
      </form>

      {/* Confirmation Modal */}
      <ConfirmModal
        show={showConfirmModal}
        onHide={() => setShowConfirmModal(false)}
        onConfirm={formik.handleSubmit}
      />

      <ToastContainer />
    </div>
  );
};

export { RoleEditModalForm };
