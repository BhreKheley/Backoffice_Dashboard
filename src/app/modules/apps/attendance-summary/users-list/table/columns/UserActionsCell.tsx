import { FC, useEffect } from 'react';
import { useMutation, useQueryClient } from 'react-query';
import { MenuComponent } from '../../../../../../../_metronic/assets/ts/components';
import { ID, KTIcon, QUERIES } from '../../../../../../../_metronic/helpers';
import { useListView } from '../../core/ListViewProvider';
import { useQueryResponse } from '../../core/QueryResponseProvider';
import { deleteUser } from '../../core/_requests';

type Props = {
  id: ID;
  roleName: string; // Add prop for role name
};

const UserActionsCell: FC<Props> = ({ id, roleName }) => {
  const { setItemIdForUpdate } = useListView();
  const { query } = useQueryResponse();
  const queryClient = useQueryClient();

  useEffect(() => {
    MenuComponent.reinitialization();
  }, []);

  const openEditModal = () => {
    setItemIdForUpdate(id);
  };

  const viewDetails = () => {
    // Logic to open the detail view
    console.log(`Viewing details for user ID: ${id}, Role: ${roleName}`);
    // You can implement a modal or a redirect here to show details
  };

  const deleteItem = useMutation(() => deleteUser(id), {
    onSuccess: () => {
      queryClient.invalidateQueries([`${QUERIES.USERS_LIST}-${query}`]);
    },
  });

  return (
    <>
      <a
        href='#'
        className='btn btn-light btn-active-light-primary btn-sm'
        data-kt-menu-trigger='click'
        data-kt-menu-placement='bottom-end'
      >
        Actions
        <KTIcon iconName='down' className='fs-5 m-0' />
      </a>
      {/* begin::Menu */}
      <div
        className='menu menu-sub menu-sub-dropdown menu-column menu-rounded menu-gray-600 menu-state-bg-light-primary fw-bold fs-7 w-125px py-4'
        data-kt-menu='true'
      >
        {/* View Details Menu Item */}
        <div className='menu-item px-3'>
          <a className='menu-link px-3' onClick={viewDetails}>
            View Details
          </a>
        </div>

        {/* Edit Menu Item */}
        <div className='menu-item px-3'>
          <a className='menu-link px-3' onClick={openEditModal}>
            Edit
          </a>
        </div>

        {/* Delete Menu Item */}
        <div className='menu-item px-3'>
          <a
            className='menu-link px-3'
            data-kt-users-table-filter='delete_row'
            onClick={async () => await deleteItem.mutateAsync()}
          >
            Delete
          </a>
        </div>
      </div>
      {/* end::Menu */}
    </>
  );
};

export { UserActionsCell };
