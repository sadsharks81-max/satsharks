import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { AdminLayout } from "../../components/layout/AdminLayout";
import { Badge } from "../../components/ui/Badge";
import { api } from "../../services/api";
import { useAuth } from "../../hooks/useAuth";

export const Route = createFileRoute("/admin/users")({
  component: AdminUsers,
});

function AdminUsers() {
  const { user } = useAuth();
  const [usersList, setUsersList] = useState<any[]>([]);

  const fetchUsers = async () => {
    const res = await api.get("/api/users");
    if (res.success) setUsersList(res.users || []);
  };

  useEffect(() => {
    if (user?.role === "ADMIN") fetchUsers();
  }, [user]);

  const updateSubscription = async (id: string, current: string) => {
    const nextSub = current === "FREE" ? "PAID" : "FREE";
    const res = await api.put(`/api/users/${id}/subscription`, { subscription: nextSub });
    if (res.success) {
      setUsersList((prev) => prev.map((u) => (u._id === id ? { ...u, subscription: nextSub } : u)));
    }
  };

  const updateStatus = async (id: string, current: string) => {
    const nextStatus = current === "ACTIVE" ? "SUSPENDED" : "ACTIVE";
    const res = await api.put(`/api/users/${id}/status`, { status: nextStatus });
    if (res.success) {
      setUsersList((prev) => prev.map((u) => (u._id === id ? { ...u, status: nextStatus } : u)));
    }
  };

  const updateRole = async (id: string, current: string) => {
    const nextRole = current === "STUDENT" ? "TEACHER" : "STUDENT";
    const res = await api.put(`/api/users/${id}/role`, { role: nextRole });
    if (res.success) {
      setUsersList((prev) => prev.map((u) => (u._id === id ? { ...u, role: nextRole } : u)));
    }
  };

  return (
    <AdminLayout activeItem="/admin/users">
      <h1 className="text-3xl font-bold mb-8">User Management</h1>

      <div className="rounded-xl bg-surface-container-lowest border border-outline-variant/40 overflow-hidden shark-shadow">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-surface-container-low border-b border-outline-variant/40 text-xs uppercase tracking-wider text-on-surface-variant">
              <th className="p-4 font-semibold">Name & Email</th>
              <th className="p-4 font-semibold">Country</th>
              <th className="p-4 font-semibold">Tier</th>
              <th className="p-4 font-semibold">Status</th>
              <th className="p-4 font-semibold">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-outline-variant/20">
            {usersList.map((u) => (
              <tr key={u._id} className="hover:bg-surface-container-low/50 transition-colors">
                <td className="p-4">
                  <div className="font-semibold">
                    {u.name}{" "}
                    {u.role === "ADMIN" && <Badge variant="accent" className="ml-2">ADMIN</Badge>}
                    {u.role === "TEACHER" && <Badge variant="info" className="ml-2 bg-info/10 text-info border border-info/20">TEACHER</Badge>}
                  </div>
                  <div className="text-sm text-on-surface-variant">{u.email}</div>
                </td>
                <td className="p-4 text-sm">
                  <div>{u.country}</div>
                  <div className="text-xs text-on-surface-variant">{u.region}</div>
                </td>
                <td className="p-4">
                  <Badge variant={u.subscription === "PAID" ? "accent" : "default"}>{u.subscription}</Badge>
                </td>
                <td className="p-4">
                  <Badge variant={u.status === "ACTIVE" ? "success" : "error"}>{u.status}</Badge>
                </td>
                <td className="p-4">
                  {u.role !== "ADMIN" && (
                    <div className="flex gap-2">
                      <button
                        onClick={() => updateSubscription(u._id, u.subscription)}
                        className="px-3 py-1 bg-surface-container-high hover:bg-surface-container-highest rounded text-sm transition-colors cursor-pointer"
                      >
                        {u.subscription === "FREE" ? "Upgrade" : "Downgrade"}
                      </button>
                      <button
                        onClick={() => updateRole(u._id, u.role)}
                        className="px-3 py-1 bg-primary/10 text-primary hover:bg-primary/20 rounded text-sm transition-colors cursor-pointer"
                      >
                        {u.role === "STUDENT" ? "Make Teacher" : "Make Student"}
                      </button>
                      <button
                        onClick={() => updateStatus(u._id, u.status)}
                        className={`px-3 py-1 rounded text-sm transition-colors cursor-pointer ${
                          u.status === "ACTIVE"
                            ? "bg-error/10 text-error hover:bg-error/20"
                            : "bg-primary/10 text-primary hover:bg-primary/20"
                        }`}
                      >
                        {u.status === "ACTIVE" ? "Suspend" : "Activate"}
                      </button>
                    </div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </AdminLayout>
  );
}
