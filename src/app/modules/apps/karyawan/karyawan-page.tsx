import { Route, Routes, Outlet, Navigate } from "react-router-dom";
import { PageLink, PageTitle } from "../../../../_metronic/layout/core";
import { EmployeesListWrapper } from "./users-list/EmployeesList";

const usersBreadcrumbs: Array<PageLink> = [
  {
    title: "Karyawan",
    path: "/apps/karyawan/karyawan",
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

const KaryawanPage = () => {
  return (
    <Routes>
      <Route element={<Outlet />}>
        <Route
          path="karyawan"
          element={
            <>
              <PageTitle breadcrumbs={usersBreadcrumbs}>
                Karyawan list
              </PageTitle>
              <EmployeesListWrapper />
            </>
          }
        />
      </Route>
      <Route index element={<Navigate to="/apps/user-management/users" />} />
    </Routes>
  );
};

export default KaryawanPage;
