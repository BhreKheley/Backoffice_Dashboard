import clsx from "clsx";
import { FC } from "react";
import { toAbsoluteUrl } from "../../../../../../../_metronic/helpers";
import { Role } from "../../core/_models"; // Updated type from User to Role

type Props = {
  role: Role; // Updated prop type to Role
};

const RoleInfoCell: FC<Props> = ({ role }) => (
  <div className="d-flex align-items-center">
    {/* begin:: Avatar or Icon Placeholder */}
    {/* <div className='symbol symbol-circle symbol-50px overflow-hidden me-3'>
      <a href='#'>
        {role.icon ? ( // If roles have an icon property
          <div className='symbol-label'>
            <img src={toAbsoluteUrl(`media/${role.icon}`)} alt={role.name} className='w-100' />
          </div>
        ) : (
          <div
            className={clsx(
              'symbol-label fs-3',
            )}
          >
          </div>
        )}
      </a>
    </div> */}
    <div className="d-flex flex-column">
      <a href="#" className="text-gray-800 text-hover-primary mb-1">
        {role.role_name} {/* Adjusted to show role name */}
      </a>
      {/* <span>{role.description}</span>{" "} */}
      {/* Adjusted to show role description or other details */}
    </div>
  </div>
);

export { RoleInfoCell };
