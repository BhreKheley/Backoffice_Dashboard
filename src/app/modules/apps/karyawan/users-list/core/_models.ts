import { ID, Response } from '../../../../../../_metronic/helpers'

export type Employee = {
  id?: ID
  user_id?: ID
  full_name?: string
  phone?: string
  position_id?: ID
  division_id?: ID
  created_at?: string
  updated_at?: string
  is_active: boolean
}

export type EmployeesQueryResponse = Response<Array<Employee>>

export const initialEmployee: Employee = {
  user_id: 0,
  full_name: '',
  phone: '',
  is_active: true
}
