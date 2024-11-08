import { FC, useEffect, useState } from "react";
import * as Yup from "yup";
import { useFormik } from "formik";
import { initialUser, User } from "../core/_models";
import clsx from "clsx";
import { useListView } from "../core/ListViewProvider";
import {
  createUser,
  updateUser,
  checkUsername,
  checkEmail,
} from "../core/_requests";
import { useQueryResponse } from "../core/QueryResponseProvider";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import { debounce } from "lodash";
import "react-toastify/dist/ReactToastify.css";
import ConfirmModal from "../components/confirmBox/ConfirmModal";
import Button from "react-bootstrap/Button";

type Props = {
  isUserLoading: boolean;
  user: User;
};

type Role = {
  id: number;
  role_name: string;
};

const UserEditModalForm: FC<Props> = ({ user, isUserLoading }) => {
  const { setItemIdForUpdate } = useListView();
  const { refetch } = useQueryResponse();
  const [roles, setRoles] = useState<Role[]>([]);
  const [usernameError, setUsernameError] = useState<string | null>(null);
  const [emailError, setEmailError] = useState<string | null>(null);
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

  const [userForEdit] = useState<User>({
    ...user,
    role_id: user.role_id || initialUser.role_id,
    username: user.username || initialUser.username,
    email: user.email || initialUser.email,
    is_active: user.is_active !== undefined ? user.is_active : true,
  });

  const cancel = (withRefresh?: boolean) => {
    if (withRefresh) {
      refetch();
    }
    setItemIdForUpdate(undefined);
  };

  const editUserSchema = Yup.object().shape({
    username: Yup.string()
      .matches(/^\S*$/, "Username tidak boleh mengandung spasi")
      .min(3, "Minimal 3 karakter")
      .max(50, "Maksimal 50 karakter")
      .required("Username wajib diisi"),
    email: Yup.string()
      .email("Format email tidak valid")
      .min(3, "Minimal 3 karakter")
      .max(50, "Maksimal 50 karakter")
      .required("Email wajib diisi"),
    role_id: Yup.number().required("Role wajib dipilih"),
    ...(user.id
      ? {}
      : {
          password: Yup.string()
            .min(6, "Minimal 6 karakter")
            .required("Password wajib diisi"),
        }),
  });

  const formik = useFormik({
    initialValues: userForEdit,
    validationSchema: editUserSchema,
    enableReinitialize: true,
    onSubmit: async (values, { setSubmitting }) => {
      setSubmitting(true);
      try {
        values.role_id = parseInt(values.role_id, 10);
        values.is_active = formik.values.is_active;

        if (user.id) {
          await updateUser(values); // Edit user
        } else {
          await createUser(values); // Create user
        }

        toast.success("Pengguna berhasil disimpan!");
      } catch (ex) {
        console.error(ex);
        toast.error("Terjadi kesalahan saat menyimpan pengguna");
      } finally {
        setSubmitting(false);
        cancel(true);
      }
    },
  });

  useEffect(() => {
    const checkDuplicates = debounce(async () => {
      try {
        if (
          formik.values.username &&
          formik.values.username !== user.username
        ) {
          const usernameExists = await checkUsername(formik.values.username);
          setUsernameError(usernameExists ? "Username sudah digunakan" : null);
        } else {
          setUsernameError(null); // Reset error jika username sama
        }

        // Hanya periksa email jika berbeda dari email yang sedang diedit
        if (formik.values.email && formik.values.email !== user.email) {
          const emailExists = await checkEmail(formik.values.email);
          setEmailError(emailExists ? "Email sudah digunakan" : null);
        } else {
          setEmailError(null); // Reset error jika email sama
        }
      } catch (error) {
        console.error("Error checking duplicates:", error);
      }
    }, 500);

    checkDuplicates();

    return () => {
      checkDuplicates.cancel();
    };
  }, [formik.values.username, formik.values.email, user.username, user.email]);

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    setShowConfirmModal(true);
  };

  return (
    <div className="modal-content">
      <form
        id="kt_modal_add_user_form"
        className="form"
        onSubmit={handleSubmit}
        noValidate
      >
        <div className="modal-body">
          {/* Username Input */}
          <div className="mb-4">
            <label className="required fw-bold fs-6 mb-2">Username</label>
            <input
              placeholder="Masukkan Username"
              {...formik.getFieldProps("username")}
              type="text"
              className={clsx(
                "form-control form-control-solid",
                {
                  "is-invalid":
                    formik.touched.username &&
                    (formik.errors.username || usernameError),
                },
                {
                  "is-valid":
                    formik.touched.username &&
                    !formik.errors.username &&
                    !usernameError,
                }
              )}
              disabled={formik.isSubmitting || isUserLoading}
            />
            {formik.touched.username &&
              (formik.errors.username || usernameError) && (
                <div className="fv-plugins-message-container text-danger">
                  <span className="fv-help-block">
                    {formik.errors.username || usernameError}
                  </span>
                </div>
              )}
          </div>

          {/* Email Input */}
          <div className="mb-4">
            <label className="required fw-bold fs-6 mb-2">Email</label>
            <input
              placeholder="Masukkan Email"
              {...formik.getFieldProps("email")}
              type="email"
              className={clsx(
                "form-control form-control-solid",
                {
                  "is-invalid":
                    formik.touched.email && (formik.errors.email || emailError),
                },
                {
                  "is-valid":
                    formik.touched.email && !formik.errors.email && !emailError,
                }
              )}
              disabled={formik.isSubmitting || isUserLoading}
            />
            {formik.touched.email && (formik.errors.email || emailError) && (
              <div className="fv-plugins-message-container text-danger">
                <span className="fv-help-block">
                  {formik.errors.email || emailError}
                </span>
              </div>
            )}
          </div>

          {/* Password Input */}
          {!user.id && (
            <div className="mb-4">
              <label className="required fw-bold fs-6 mb-2">Password</label>
              <input
                placeholder="Masukkan Password"
                {...formik.getFieldProps("password")}
                type="password"
                className={clsx(
                  "form-control form-control-solid",
                  {
                    "is-invalid":
                      formik.touched.password && formik.errors.password,
                  },
                  {
                    "is-valid":
                      formik.touched.password && !formik.errors.password,
                  }
                )}
                disabled={formik.isSubmitting || isUserLoading}
              />
              {formik.touched.password && formik.errors.password && (
                <div className="fv-plugins-message-container text-danger">
                  <span className="fv-help-block">
                    {formik.errors.password}
                  </span>
                </div>
              )}
            </div>
          )}

          {/* Role Selector */}
          <div className="mb-4">
            <label className="required fw-bold fs-6 mb-2">Role</label>
            <select
              {...formik.getFieldProps("role_id")}
              className="form-control form-control-solid"
              disabled={formik.isSubmitting || isUserLoading}
            >
              <option value="">Pilih Role</option>
              {roles.map((role) => (
                <option key={role.id} value={role.id}>
                  {role.role_name}
                </option>
              ))}
            </select>
            {formik.touched.role_id && formik.errors.role_id && (
              <div className="fv-plugins-message-container text-danger">
                <span className="fv-help-block">{formik.errors.role_name}</span>
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
                disabled={formik.isSubmitting || isUserLoading}
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
            disabled={formik.isSubmitting || isUserLoading}
          >
            Batal
          </button>
          <button
            type="submit"
            className="btn btn-primary"
            disabled={
              !formik.isValid ||
              formik.isSubmitting ||
              isUserLoading ||
              !!usernameError ||
              !!emailError
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

export { UserEditModalForm };
