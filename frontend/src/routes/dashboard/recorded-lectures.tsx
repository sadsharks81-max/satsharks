import { createFileRoute } from "@tanstack/react-router";
import { RecordedLectures } from "../../components/dashboard/RecordedLectures";
import { StudentLayout } from "../../components/layout/StudentLayout";

export const Route = createFileRoute("/dashboard/recorded-lectures")({
  component: () => (
    <StudentLayout activeItem="/dashboard/recorded-lectures">
      <RecordedLectures />
    </StudentLayout>
  ),
});
