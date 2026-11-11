import { createFileRoute } from "@tanstack/react-router";
import { RecordedLectures } from "../../components/dashboard/RecordedLectures";
import { AdminLayout } from "../../components/layout/AdminLayout";

export const Route = createFileRoute("/admin/recorded-lectures")({
  component: () => (
    <AdminLayout activeItem="/admin/recorded-lectures">
      <RecordedLectures />
    </AdminLayout>
  ),
});
