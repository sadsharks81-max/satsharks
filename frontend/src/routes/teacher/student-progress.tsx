import { createFileRoute } from "@tanstack/react-router";
import { TeacherLayout } from "../../components/layout/TeacherLayout";
import { StudentProgressReports } from "../../components/staff/StudentProgressReports";
export const Route = createFileRoute("/teacher/student-progress")({
  component: () => <TeacherLayout activeItem="/teacher/student-progress"><StudentProgressReports /></TeacherLayout>,
});
