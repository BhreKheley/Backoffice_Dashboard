import axios, { AxiosResponse } from "axios";
import { ID, Response } from "../../../../../../_metronic/helpers";
import { Employee, EmployeesQueryResponse } from "./_models";

const API_URL = import.meta.env.VITE_APP_API_URL_LOCAL;
const EMPLOYEE_URL = `${API_URL}/employee`;
console.log(EMPLOYEE_URL);

const getEmployees = (query: string): Promise<EmployeesQueryResponse> => {
  return axios
    .get(`${EMPLOYEE_URL}/`)
    .then((d: AxiosResponse<EmployeesQueryResponse>) => d.data);
};


const getEmployeeById = (id: ID): Promise<Employee | undefined> => {
  return axios
    .get(`${EMPLOYEE_URL}/${id}`)
    .then((response: AxiosResponse<Response<Employee>>) => response.data)
    .then((response: Response<Employee>) => response.data);
};

const createEmployee = (Employee: Employee): Promise<Employee | undefined> => {
  return axios
    .post(EMPLOYEE_URL + "/create_employee", Employee)
    .then((response: AxiosResponse<Response<Employee>>) => response.data)
    .then((response: Response<Employee>) => response.data);
};

const updateEmployee = (Employee: Employee): Promise<Employee | undefined> => {
  return axios
    .put(`${EMPLOYEE_URL}/${Employee.id}`, Employee)
    .then((response: AxiosResponse<Response<Employee>>) => response.data)
    .then((response: Response<Employee>) => response.data);
};

const deleteEmployee = (EmployeeId: ID): Promise<void> => {
  return axios.delete(`${EMPLOYEE_URL}/${EmployeeId}`).then(() => {});
};

const deleteSelectedEmployees = (EmployeeIds: Array<ID>): Promise<void> => {
  const requests = EmployeeIds.map((id) => axios.delete(`${EMPLOYEE_URL}/${id}`));
  return axios.all(requests).then(() => {});
};

export {
  getEmployees,
  deleteEmployee,
  deleteSelectedEmployees,
  getEmployeeById,
  createEmployee,
  updateEmployee,
};
