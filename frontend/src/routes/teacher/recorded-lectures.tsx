import { createFileRoute } from "@tanstack/react-router";
import { RecordedLectures } from "../../components/dashboard/RecordedLectures";
import { TeacherLayout } from "../../components/layout/TeacherLayout";

export const Route = createFileRoute("/teacher/recorded-lectures")({
  component: () => (
    <TeacherLayout activeItem="/teacher/recorded-lectures">
      <RecordedLectures />
    </TeacherLayout>
  ),
});
