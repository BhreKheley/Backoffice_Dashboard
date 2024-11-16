import { Route, Routes, Outlet, Navigate } from "react-router-dom";
import { PageLink, PageTitle } from "../../../../_metronic/layout/core";
import { RolesListWrapper } from "./roles-list/RolesList";

const rolesBreadcrumbs: Array<PageLink> = [
  {
    title: "Role Management",
    path: "/apps/role-management/roles",
    isSeparator: false,
    isActive: false,
  },
  {
    title: "",
    path: "",
    isSeparator: true,
    isActive: false,
  },
];

const RolesPage = () => {
  return (
    <Routes>
      <Route element={<Outlet />}>
        <Route
          path="roles"
          element={
            <>
              <PageTitle breadcrumbs={rolesBreadcrumbs}>Roles list</PageTitle>
              <RolesListWrapper />
            </>
          }
        />
      </Route>
      <Route index element={<Navigate to="/apps/role-management/roles" />} />
    </Routes>
  );
};

export default RolesPage;
