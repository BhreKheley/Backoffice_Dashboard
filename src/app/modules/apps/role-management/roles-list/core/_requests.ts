import axios, { AxiosResponse } from "axios";
import { ID, Response } from "../../../../../../_metronic/helpers";
import { Role, RolesQueryResponse } from "./_models";

// const API_URL = import.meta.env.VITE_APP_THEME_API_URL;
// const ROLE_URL = `${API_URL}/role`;
// const GET_ROLES_URL = `${API_URL}/roles/query`;

const API_URL = import.meta.env.VITE_APP_API_URL_LOCAL;
const ROLE_URL = `${API_URL}/role`;

const getRoles = (query: string): Promise<RolesQueryResponse> => {
  return axios
    .get(`${ROLE_URL}/`)
    .then((d: AxiosResponse<RolesQueryResponse>) => d.data);
};

const getRoleById = (id: ID): Promise<Role | undefined> => {
  return axios
    .get(`${ROLE_URL}/${id}`)
    .then((response: AxiosResponse<Response<Role>>) => response.data)
    .then((response: Response<Role>) => response.data);
};

const createRole = (role: Role): Promise<Role | undefined> => {
  return axios
    .post(ROLE_URL + "/create_role", role)
    .then((response: AxiosResponse<Response<Role>>) => response.data)
    .then((response: Response<Role>) => response.data);
};

const updateRole = (role: Role): Promise<Role | undefined> => {
  return axios
    .put(`${ROLE_URL}/${role.id}`, role)
    .then((response: AxiosResponse<Response<Role>>) => response.data)
    .then((response: Response<Role>) => response.data);
};

const deleteRole = (roleId: ID): Promise<void> => {
  return axios.delete(`${ROLE_URL}/${roleId}`).then(() => {});
};

const deleteSelectedRoles = (roleIds: Array<ID>): Promise<void> => {
  const requests = roleIds.map((id) => axios.delete(`${ROLE_URL}/${id}`));
  return axios.all(requests).then(() => {});
};

const checkRoleDuplicate = async (roleName: string): Promise<boolean> => {
  const response = await axios.post(`${ROLE_URL}/check-duplicate`, { roleName });
  return response.data.role_name_exists; // Assuming response.data contains role_name_exists
};

export {
  getRoles,
  deleteRole,
  deleteSelectedRoles,
  getRoleById,
  createRole,
  updateRole,
  checkRoleDuplicate,
};
