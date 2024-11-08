import {useQuery} from 'react-query';
import {EmployeeEditModalForm} from './EmployeeEditModalForm';
import {isNotEmpty, QUERIES} from '../../../../../../_metronic/helpers';
import {useListView} from '../core/ListViewProvider';
import {getEmployeeById} from '../core/_requests';

const EmployeeEditModalFormWrapper = () => {
  const {itemIdForUpdate, setItemIdForUpdate} = useListView();
  const enabledQuery: boolean = isNotEmpty(itemIdForUpdate);
  
  const {
    isLoading,
    data: employee,
    error,
  } = useQuery(
    `${QUERIES.EMPLOYEES_LIST}-employee-${itemIdForUpdate}`,
    () => {
      return getEmployeeById(itemIdForUpdate);
    },
    {
      cacheTime: 0,
      enabled: enabledQuery,
      onError: (err) => {
        setItemIdForUpdate(undefined);
        console.error(err);
      },
    }
  );
  if (!itemIdForUpdate) {
    return <EmployeeEditModalForm isEmployeeLoading={isLoading} employee={{id: undefined, is_active: true}} />;
  }

  if (!isLoading && !error && employee) {
    return <EmployeeEditModalForm isEmployeeLoading={isLoading} employee={employee} />;
  }

  return null;
};

export {EmployeeEditModalFormWrapper};
