import { useQueryClient, useMutation } from "react-query";
import { QUERIES } from "../../../../../../../_metronic/helpers";
import { useListView } from "../../core/ListViewProvider";
import { useQueryResponse } from "../../core/QueryResponseProvider";
import { deleteSelectedRoles } from "../../core/_requests"; // Adjusted to delete selected roles

const RolesListGrouping = () => {
  // Changed from UsersListGrouping to RolesListGrouping
  const { selected, clearSelected } = useListView();
  const queryClient = useQueryClient();
  const { query } = useQueryResponse();

  const deleteSelectedItems = useMutation(() => deleteSelectedRoles(selected), {
    // Adjusted for roles
    onSuccess: () => {
      queryClient.invalidateQueries([`${QUERIES.ROLES_LIST}-${query}`]); // Adjusted query key for roles
      clearSelected();
    },
  });

  return (
    <div className="d-flex justify-content-end align-items-center">
      <div className="fw-bolder me-5">
        <span className="me-2">{selected.length}</span> Selected
      </div>

      <button
        type="button"
        className="btn btn-danger"
        onClick={async () => await deleteSelectedItems.mutateAsync()}
      >
        Delete Selected
      </button>
    </div>
  );
};

export { RolesListGrouping }; // Changed from UsersListGrouping to RolesListGrouping
