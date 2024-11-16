import {ID, Response} from '../../../../../../_metronic/helpers'

export type Role = {
  id?: ID
  role_name?: string
  code?: string
  is_active: boolean
  permissions?: Array<string>
}

export type RolesQueryResponse = Response<Array<Role>>

export const initialRole: Role = {
  role_name: '',
  code: '',
  is_active: false,
  permissions: []
}
