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
  const [deletingUserId, setDeletingUserId] = useState<string | null>(null);
  const [selectedUserIds, setSelectedUserIds] = useState<Set<string>>(new Set());
  const [bulkDeleting, setBulkDeleting] = useState(false);

  const fetchUsers = async () => {
    const res = await api.get("/api/users");
    if (res.success) {
      setUsersList(res.users || []);
      setSelectedUserIds(new Set());
    }
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

  const updateAccessDates = async (userRow: any) => {
    const res = await api.put(`/api/users/${userRow._id}/access-dates`, {
      portalAccessStart: userRow.portalAccessStart || null,
      portalAccessEnd: userRow.portalAccessEnd || null,
    });
    if (res.success) {
      setUsersList((prev) => prev.map((item) => item._id === userRow._id ? res.user : item));
    } else {
      alert(res.error || "Could not update access dates.");
    }
  };

  const deleteUser = async (userRow: any) => {
    if (!confirm(`Permanently delete ${userRow.name} (${userRow.email}) and their account activity? This cannot be undone.`)) return;
    setDeletingUserId(userRow._id);
    const res = await api.delete(`/api/users/${userRow._id}`);
    setDeletingUserId(null);
    if (res.success) {
      setUsersList((prev) => prev.filter((item) => item._id !== userRow._id));
      setSelectedUserIds((prev) => {
        const next = new Set(prev);
        next.delete(userRow._id);
        return next;
      });
    } else {
      alert(res.error || "Could not delete this user.");
    }
  };

  const selectableUserIds = usersList
    .filter((userRow) => userRow.role !== "ADMIN" && userRow._id !== user?.id)
    .map((userRow) => userRow._id as string);
  const allSelectableUsersSelected =
    selectableUserIds.length > 0 && selectableUserIds.every((id) => selectedUserIds.has(id));

  const toggleUserSelection = (id: string) => {
    setSelectedUserIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const toggleAllUsers = () => {
    setSelectedUserIds(
      allSelectableUsersSelected ? new Set() : new Set(selectableUserIds),
    );
  };

  const deleteSelectedUsers = async () => {
    const count = selectedUserIds.size;
    if (count === 0) return;
    if (!confirm(`Permanently delete ${count} selected user${count === 1 ? "" : "s"} and their account activity? This cannot be undone.`)) return;

    setBulkDeleting(true);
    const ids = [...selectedUserIds];
    const res = await api.post("/api/users/bulk-delete", { userIds: ids });
    setBulkDeleting(false);
    if (res.success) {
      const deletedIds = new Set(ids);
      setUsersList((prev) => prev.filter((item) => !deletedIds.has(item._id)));
      setSelectedUserIds(new Set());
    } else {
      alert(res.error || "Could not delete the selected users.");
    }
  };

  return (
    <AdminLayout activeItem="/admin/users">
      <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">User Management</h1>
          <p className="mt-1 text-sm text-on-surface-variant">Select one or more users using the checkboxes, then delete them together.</p>
        </div>
        <button
          onClick={deleteSelectedUsers}
          disabled={selectedUserIds.size === 0 || bulkDeleting}
          className="inline-flex items-center gap-2 rounded-lg bg-error px-4 py-2.5 text-sm font-bold text-white shadow-sm transition-colors hover:bg-error/90 disabled:cursor-not-allowed disabled:opacity-40"
        >
          <span className="material-symbols-outlined text-lg">delete</span>
          {bulkDeleting ? "Deleting..." : `Delete Selected (${selectedUserIds.size})`}
        </button>
      </div>

      <div className="rounded-xl bg-surface-container-lowest border border-outline-variant/40 overflow-x-auto shark-shadow">
        <table className="w-full min-w-[1180px] text-left border-collapse">
          <thead>
            <tr className="bg-surface-container-low border-b border-outline-variant/40 text-xs uppercase tracking-wider text-on-surface-variant">
              <th className="p-4 font-semibold">
                <input
                  type="checkbox"
                  aria-label="Select all deletable users"
                  checked={allSelectableUsersSelected}
                  onChange={toggleAllUsers}
                  className="h-4 w-4 cursor-pointer accent-error"
                />
              </th>
              <th className="p-4 font-semibold">Name & Email</th>
              <th className="p-4 font-semibold">Country</th>
              <th className="p-4 font-semibold">Tier</th>
              <th className="p-4 font-semibold">Status</th>
              <th className="p-4 font-semibold">Portal Access</th>
              <th className="p-4 font-semibold">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-outline-variant/20">
            {usersList.map((u) => (
              <tr key={u._id} className="hover:bg-surface-container-low/50 transition-colors">
                <td className="p-4">
                  {u.role !== "ADMIN" && u._id !== user?.id && (
                    <input
                      type="checkbox"
                      aria-label={`Select ${u.name}`}
                      checked={selectedUserIds.has(u._id)}
                      onChange={() => toggleUserSelection(u._id)}
                      className="h-4 w-4 cursor-pointer accent-error"
                    />
                  )}
                </td>
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
                  {u.role === "STUDENT" ? (
                    <div className="flex min-w-[230px] flex-col gap-2">
                      <input type="date" value={u.portalAccessStart?.slice(0, 10) || ""} onChange={(e) => setUsersList((prev) => prev.map((item) => item._id === u._id ? { ...item, portalAccessStart: e.target.value } : item))} className="rounded-lg border border-outline-variant bg-surface px-2 py-1 text-xs" />
                      <input type="date" value={u.portalAccessEnd?.slice(0, 10) || ""} onChange={(e) => setUsersList((prev) => prev.map((item) => item._id === u._id ? { ...item, portalAccessEnd: e.target.value } : item))} className="rounded-lg border border-outline-variant bg-surface px-2 py-1 text-xs" />
                      <button onClick={() => updateAccessDates(u)} className="rounded-lg bg-primary px-3 py-1 text-xs font-bold text-on-primary">Save Dates</button>
                    </div>
                  ) : <span className="text-xs text-on-surface-variant">Not applicable</span>}
                </td>
                <td className="p-4">
                  {u.role !== "ADMIN" && (
                    <div className="flex flex-wrap gap-2">
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
                      <button
                        onClick={() => deleteUser(u)}
                        disabled={deletingUserId === u._id}
                        className="px-3 py-1 bg-error text-white hover:bg-error/90 rounded text-sm transition-colors cursor-pointer disabled:opacity-50"
                      >
                        {deletingUserId === u._id ? "Deleting..." : "Delete"}
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
