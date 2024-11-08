import { FC, useEffect } from "react";
import { useMutation, useQueryClient } from "react-query";
import { MenuComponent } from "../../../../../../../_metronic/assets/ts/components";
import { ID, KTIcon, QUERIES } from "../../../../../../../_metronic/helpers";
import { useListView } from "../../core/ListViewProvider";
import { useQueryResponse } from "../../core/QueryResponseProvider";
import { deleteUser } from "../../core/_requests";
// import { ViewDetail } from "./ViewDetail"; // Import the new component

type Props = {
  id: ID;
  role_name?: string;
  is_active: boolean; // Add prop for active status
};

const UserActionsCell: FC<Props> = ({ id, role_name, is_active }) => {
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
    // Open a detail modal or pass ID to the ViewDetail component for rendering
    console.log(`Viewing details for user ID: ${id}, Role: ${role_name}`);
  };

  const deleteItem = useMutation(() => deleteUser(id), {
    onSuccess: () => {
      queryClient.invalidateQueries([`${QUERIES.USERS_LIST}-${query}`]);
    },
  });

  return (
    <>
      <a
        href="#"
        className="btn btn-light btn-active-light-primary btn-sm"
        data-kt-menu-trigger="click"
        data-kt-menu-placement="bottom-end"
      >
        Actions
        <KTIcon iconName="down" className="fs-5 m-0" />
      </a>
      {/* begin::Menu */}
      <div
        className="menu menu-sub menu-sub-dropdown menu-column menu-rounded menu-gray-600 menu-state-bg-light-primary fw-bold fs-7 w-125px py-4"
        data-kt-menu="true"
      >
        {/* View Details Menu Item */}
        <div className="menu-item px-3">
          <a className="menu-link px-3" onClick={viewDetails}>
            View Details
          </a>
        </div>

        {/* Edit Menu Item */}
        <div className="menu-item px-3">
          <a className="menu-link px-3" onClick={openEditModal}>
            Edit
          </a>
        </div>

        {/* Conditionally Render Delete Menu Item */}
        {!is_active && (
          <div className="menu-item px-3">
            <a
              className="menu-link px-3"
              data-kt-users-table-filter="delete_row"
              onClick={async () => await deleteItem.mutateAsync()}
            >
              Delete
            </a>
          </div>
        )}
      </div>
      {/* end::Menu */}
    </>
  );
};

export { UserActionsCell };
