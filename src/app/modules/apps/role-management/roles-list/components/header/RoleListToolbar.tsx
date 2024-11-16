import { KTIcon } from "../../../../../../../_metronic/helpers";
import { useListView } from "../../core/ListViewProvider";
import { RolesListFilter } from "./RolesListFilter"; // Changed to RolesListFilter

const RolesListToolbar = () => {
  // Changed UsersListToolbar to RolesListToolbar
  const { setItemIdForUpdate } = useListView();
  const openAddRoleModal = () => {
    // Changed to openAddRoleModal
    setItemIdForUpdate(null);
  };

  return (
    <div
      className="d-flex justify-content-end"
      data-kt-user-table-toolbar="base"
    >
      <RolesListFilter /> {/* Changed to RolesListFilter */}
      {/* begin::Export */}
      <button type="button" className="btn btn-light-primary me-3">
        <KTIcon iconName="exit-up" className="fs-2" />
        Export
      </button>
      {/* end::Export */}
      {/* begin::Add role */}
      <button
        type="button"
        className="btn btn-primary"
        onClick={openAddRoleModal}
      >
        <KTIcon iconName="plus" className="fs-2" />
        Add Role {/* Changed to Add Role */}
      </button>
      {/* end::Add role */}
    </div>
  );
};

export { RolesListToolbar }; // Changed export name to RolesListToolbar
