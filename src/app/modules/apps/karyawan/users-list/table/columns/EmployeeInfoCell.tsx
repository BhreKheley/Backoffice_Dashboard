import clsx from 'clsx';
import { FC } from 'react';
import { toAbsoluteUrl } from '../../../../../../../_metronic/helpers';
import { Employee } from '../../core/_models';

type Props = {
  employee: Employee;
};

const EmployeeInfoCell: FC<Props> = ({ employee }) => (
  <div className='d-flex align-items-center'>
    {/* begin:: Avatar */}
    {/* <div className='symbol symbol-circle symbol-50px overflow-hidden me-3'>
      <a href='#'>
        {employee.avatar ? (
          <div className='symbol-label'>
            <img src={toAbsoluteUrl(`media/${employee.avatar}`)} alt={employee.username} className='w-100' />
          </div>
        ) : (
          <div className={clsx('symbol-label fs-3')}>
            <span className="text-muted">?</span>
          </div>
        )}
      </a>
    </div> */}
    <div className='d-flex flex-column'>
      <a href='#' className='text-gray-800 text-hover-primary mb-1'>
        {employee.full_name}
      </a>
      {/* <span>{employee.email}</span> */}
    </div>
  </div>
);

export { EmployeeInfoCell };
