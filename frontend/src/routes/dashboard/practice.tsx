import { createFileRoute } from "@tanstack/react-router";
import { StudentLayout } from "../../components/layout/StudentLayout";
import { PracticeContent } from "../../components/dashboard/PracticeContent";

export const Route = createFileRoute("/dashboard/practice")({
  component: Practice,
});

function Practice() {
  return (
    <StudentLayout activeItem="/dashboard/practice">
      <PracticeContent />
    </StudentLayout>
  );
}
