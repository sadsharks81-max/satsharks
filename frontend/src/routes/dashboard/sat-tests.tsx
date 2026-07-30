import { createFileRoute } from "@tanstack/react-router";
import { StudentLayout } from "../../components/layout/StudentLayout";
import { SATTestList } from "../../components/dashboard/SATTestList";

export const Route = createFileRoute("/dashboard/sat-tests")({
  component: SATTestListWrapper,
});

function SATTestListWrapper() {
  return (
    <StudentLayout activeItem="/dashboard/sat-tests">
      <SATTestList />
    </StudentLayout>
  );
}
