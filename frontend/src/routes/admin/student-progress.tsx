import { createFileRoute } from "@tanstack/react-router";
import { AdminLayout } from "../../components/layout/AdminLayout";
import { StudentProgressReports } from "../../components/staff/StudentProgressReports";
export const Route = createFileRoute("/admin/student-progress")({
  component: () => <AdminLayout activeItem="/admin/student-progress"><StudentProgressReports /></AdminLayout>,
});
