import {useListView} from '../../core/ListViewProvider'
import {EmployeesListToolbar} from './EmployeeListToolbar'
import {EmployeesListGrouping} from './EmployeesListGrouping'
import {EmployeesListSearchComponent} from './EmployeesListSearchComponent'

const EmployeesListHeader = () => {
  const {selected} = useListView()
  return (
    <div className='card-header border-0 pt-6'>
      <EmployeesListSearchComponent />
      {/* begin::Card toolbar */}
      <div className='card-toolbar'>
        {/* begin::Group actions */}
        {selected.length > 0 ? <EmployeesListGrouping /> : <EmployeesListToolbar />}
        {/* end::Group actions */}
      </div>
      {/* end::Card toolbar */}
    </div>
  )
}

export {EmployeesListHeader}
