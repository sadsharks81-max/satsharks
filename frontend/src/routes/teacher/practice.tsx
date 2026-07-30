import { createFileRoute } from "@tanstack/react-router";
import { TeacherLayout } from "../../components/layout/TeacherLayout";
import { PracticeContent } from "../dashboard/practice";

export const Route = createFileRoute("/teacher/practice")({
  component: TeacherPractice,
});

function TeacherPractice() {
  return (
    <TeacherLayout activeItem="/teacher/practice">
      <PracticeContent />
    </TeacherLayout>
  );
}
