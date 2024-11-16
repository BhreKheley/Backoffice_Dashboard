import { useQuery } from "react-query";
import { RoleEditModalForm } from "./RoleEditModalForm";
import { isNotEmpty, QUERIES } from "../../../../../../_metronic/helpers";
import { useListView } from "../core/ListViewProvider";
import { getRoleById } from "../core/_requests";

const RoleEditModalFormWrapper = () => {
  const { itemIdForUpdate, setItemIdForUpdate } = useListView();
  const enabledQuery: boolean = isNotEmpty(itemIdForUpdate);
  const {
    isLoading,
    data: role,
    error,
  } = useQuery(
    `${QUERIES.ROLES_LIST}-role-${itemIdForUpdate}`,
    () => {
      return getRoleById(itemIdForUpdate);
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
    return (
      <RoleEditModalForm
        isRoleLoading={isLoading}
        role={{ id: undefined, role_name: "", is_active: false, code: "" }}
      />
    );
  }

  if (!isLoading && !error && role) {
    return <RoleEditModalForm isRoleLoading={isLoading} role={role} />;
  }

  return null;
};

export { RoleEditModalFormWrapper };
