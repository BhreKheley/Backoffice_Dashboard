import {ID, Response} from '../../../../../../_metronic/helpers'
export type User = {
  id?: ID
  username?: string,
  password?: string,
  email?: string
  role_name?: string,
  role_id?: any,
  avatar?: string,
  is_active?: boolean,
}

export type UsersQueryResponse = Response<Array<User>>

export const initialUser: User = {
  role_id: 0,
  username: '',
  email: '',
}
