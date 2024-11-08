import { FC, useEffect, useState } from 'react';
import * as Yup from 'yup';
import { useFormik } from 'formik';
import { isNotEmpty, toAbsoluteUrl } from '../../../../../../_metronic/helpers';
import { initialUser, User } from '../core/_models';
import clsx from 'clsx';
import { useListView } from '../core/ListViewProvider';
import { UsersListLoading } from '../components/loading/UsersListLoading';
import { createUser, updateUser } from '../core/_requests';
import { useQueryResponse } from '../core/QueryResponseProvider';
import axios from 'axios';

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

  // Fetch data role dari backend
  useEffect(() => {
    const fetchRoles = async () => {
      try {
        const response = await axios.get('http://localhost:8080/role/');
        setRoles(response.data.data);
      } catch (error) {
        console.error('Error fetching roles:', error);
      }
    };
    fetchRoles();
  }, []);

  const [userForEdit] = useState<User>({
    ...user,
    avatar: user.avatar || initialUser.avatar,
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
  email: Yup.string()
    .email('Format email tidak valid')
    .min(3, 'Minimal 3 karakter')
    .max(50, 'Maksimal 50 karakter')
    .matches(/^\S*$/, 'Email tidak boleh mengandung spasi')
    .required('Email wajib diisi')
    .test('unique-email', 'Email sudah digunakan', async (value) => {
      if (!value) return true;
      const response = await axios.get(`http://localhost:8080/user/check-email/${value}`);
      return response.data.isUnique;
    }),
  username: Yup.string()
    .min(3, 'Minimal 3 karakter')
    .max(50, 'Maksimal 50 karakter')
    .matches(/^\S*$/, 'Username tidak boleh mengandung spasi')
    .required('Username wajib diisi')
    .test('unique-username', 'Username sudah digunakan', async (value) => {
      if (!value) return true;
      const response = await axios.get(`http://localhost:8080/user/check-username/${value}`);
      return response.data.isUnique;
    }),
  role_id: Yup.number().required('Role wajib dipilih'),
  ...(user.id
    ? {}
    : {
        password: Yup.string()
          .min(6, 'Minimal 6 karakter')
          .required('Password wajib diisi'),
      }),
});

  const formik = useFormik({
    initialValues: userForEdit,
    validationSchema: editUserSchema,
    onSubmit: async (values, { setSubmitting }) => {
      setSubmitting(true);
      try {
        values.role_id = parseInt(values.role_id, 10);
        values.is_active = true;

        if (isNotEmpty(values.id)) {
          await updateUser(values);
        } else {
          await createUser(values);
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
    <div className='modal-content'>
      <form id='kt_modal_add_user_form' className='form' onSubmit={formik.handleSubmit} noValidate>
        <div className='modal-header'>
          <h5 className='modal-title'>Edit Pengguna</h5>
          <button type='button' className='btn-close' onClick={() => cancel()}></button>
        </div>
        <div className='modal-body'>
          <div className='mb-4'>
            {/* Username */}
            <label className='required fw-bold fs-6 mb-2'>Username</label>
            <input
              placeholder='Masukkan Username'
              {...formik.getFieldProps('username')}
              type='text'
              className={clsx(
                'form-control form-control-solid',
                { 'is-invalid': formik.touched.username && formik.errors.username },
                { 'is-valid': formik.touched.username && !formik.errors.username }
              )}
              disabled={formik.isSubmitting || isUserLoading}
            />
            {formik.touched.username && formik.errors.username && (
              <div className='fv-plugins-message-container text-danger'>
                <span className='fv-help-block'>{formik.errors.username}</span>
              </div>
            )}
          </div>

          <div className='mb-4'>
            {/* Email */}
            <label className='required fw-bold fs-6 mb-2'>Email</label>
            <input
              placeholder='Masukkan Email'
              {...formik.getFieldProps('email')}
              className={clsx(
                'form-control form-control-solid',
                { 'is-invalid': formik.touched.email && formik.errors.email },
                { 'is-valid': formik.touched.email && !formik.errors.email }
              )}
              type='email'
              disabled={formik.isSubmitting || isUserLoading}
            />
            {formik.touched.email && formik.errors.email && (
              <div className='fv-plugins-message-container text-danger'>
                <span className='fv-help-block'>{formik.errors.email}</span>
              </div>
            )}
          </div>

          {/* Password - hanya ditampilkan saat menambahkan user baru */}
          {!user.id && (
            <div className='mb-4'>
              <label className='required fw-bold fs-6 mb-2'>Password</label>
              <input
                placeholder='Masukkan Password'
                {...formik.getFieldProps('password')}
                type='password'
                className={clsx(
                  'form-control form-control-solid',
                  { 'is-invalid': formik.touched.password && formik.errors.password },
                  { 'is-valid': formik.touched.password && !formik.errors.password }
                )}
                disabled={formik.isSubmitting || isUserLoading}
              />
              {formik.touched.password && formik.errors.password && (
                <div className='fv-plugins-message-container text-danger'>
                  <span className='fv-help-block'>{formik.errors.password}</span>
                </div>
              )}
            </div>
          )}

          <div className='mb-4'>
            {/* Role */}
            <label className='required fw-bold fs-6 mb-2'>Role</label>
            <div className="relative">
              <select
                {...formik.getFieldProps('role_id')}
                className='form-select form-select-solid'
                disabled={formik.isSubmitting || isUserLoading}
              >
                <option value=''>Pilih Role</option>
                {roles.map((role) => (
                  <option key={role.id} value={role.id}>
                    {role.role_name}
                  </option>
                ))}
              </select>
              {formik.touched.role_id && formik.errors.role_id && (
                <div className='fv-plugins-message-container text-danger'>
                  <span className='fv-help-block'>{formik.errors.role_name}</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className='modal-footer'>
          <button
            type='button'
            onClick={() => cancel()}
            className='btn btn-light'
            disabled={formik.isSubmitting || isUserLoading}
          >
            Batal
          </button>
          <button
            type='submit'
            className='btn btn-primary'
            disabled={formik.isSubmitting || isUserLoading || !formik.isValid}
          >
            {formik.isSubmitting ? (
              <span className='spinner-border spinner-border-sm align-middle ms-2'></span>
            ) : (
              'Simpan'
            )}
          </button>
        </div>
        {(formik.isSubmitting || isUserLoading) && <UsersListLoading />}
      </form>
    </div>
  );
};

export { UserEditModalForm };
