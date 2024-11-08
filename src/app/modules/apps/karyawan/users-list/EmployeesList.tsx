import { ListViewProvider, useListView } from "./core/ListViewProvider";
import { QueryRequestProvider } from "./core/QueryRequestProvider";
import { QueryResponseProvider } from "./core/QueryResponseProvider";
import { EmployeesListHeader } from "./components/header/EmployeesListHeader";
import { EmployeesTable } from "./table/EmployeesTable";
import { EmployeeEditModal } from "./employee-edit-modal/EmployeeEditModal";
import { KTCard } from "../../../../../_metronic/helpers";
import { ToolbarWrapper } from "../../../../../_metronic/layout/components/toolbar";
import { Content } from "../../../../../_metronic/layout/components/content";

const EmployeesList = () => {
  const { itemIdForUpdate } = useListView();
  return (
    <>
      <KTCard>
        <EmployeesListHeader />
        <EmployeesTable />
      </KTCard>
      {itemIdForUpdate !== undefined && <EmployeeEditModal />}
    </>
  );
};

const EmployeesListWrapper = () => (
  <QueryRequestProvider>
    <QueryResponseProvider>
      <ListViewProvider>
        <ToolbarWrapper />
        <Content>
          <EmployeesList />
        </Content>
      </ListViewProvider>
    </QueryResponseProvider>
  </QueryRequestProvider>
);

export { EmployeesListWrapper };
