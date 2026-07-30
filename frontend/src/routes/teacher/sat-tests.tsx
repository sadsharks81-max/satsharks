import { createFileRoute } from "@tanstack/react-router";
import { TeacherLayout } from "../../components/layout/TeacherLayout";
import { SATTestList } from "../dashboard/sat-tests";

export const Route = createFileRoute("/teacher/sat-tests")({
  component: TeacherSATTestList,
});

function TeacherSATTestList() {
  return (
    <TeacherLayout activeItem="/teacher/sat-tests">
      <SATTestList />
    </TeacherLayout>
  );
}
