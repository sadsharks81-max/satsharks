import { createFileRoute, Navigate } from "@tanstack/react-router";
import { useAuth } from "../hooks/useAuth";
import { ClassroomPage } from "../features/classroom/ClassroomPage";

export const Route = createFileRoute("/classroom/$roomId")({
  component: ClassroomRoute,
});

// Deliberately NOT nested under /dashboard or /teacher: this page is full-bleed
// (no StudentLayout/TeacherLayout chrome) and shared by students, teachers, and admins.
function ClassroomRoute() {
  const { roomId } = Route.useParams();
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#0B1120] text-white/70">
        Loading...
      </div>
    );
  }

  if (!user) return <Navigate to="/auth/login" />;

  return <ClassroomPage roomId={roomId} />;
}
