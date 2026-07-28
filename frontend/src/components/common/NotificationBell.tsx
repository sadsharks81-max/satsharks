import { useState, useRef, useEffect } from "react";
import { useNavigate } from "@tanstack/react-router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Icon } from "./Icon";
import { api } from "../../services/api";
import { Notification } from "../../types";
import { useAuth } from "../../hooks/useAuth";

export function NotificationBell() {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const { user } = useAuth();

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const { data } = useQuery({
    queryKey: ["notifications"],
    queryFn: async () => {
      const res = await api.get("/api/notifications/my");
      if (!res.success) throw new Error(res.error);
      return res.data as Notification[];
    },
    refetchInterval: 30000, // Poll every 30s
    refetchOnWindowFocus: true,
  });

  const notifications = data || [];
  const unreadCount = notifications.filter((n) => !n.isRead).length;

  const markReadMutation = useMutation({
    mutationFn: async (id: string) => {
      const res = await api.put(`/api/notifications/${id}/read`);
      if (!res.success) throw new Error(res.error);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
    },
  });

  const markAllReadMutation = useMutation({
    mutationFn: async () => {
      const res = await api.put("/api/notifications/read-all");
      if (!res.success) throw new Error(res.error);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
    },
  });

  const clearAllMutation = useMutation({
    mutationFn: async () => {
      const res = await api.delete("/api/notifications/clear-all");
      if (!res.success) throw new Error(res.error);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
    },
  });

  const handleMarkRead = (notif: Notification) => {
    if (!notif.isRead) {
      markReadMutation.mutate(notif._id);
    }
    setIsOpen(false);
    
    const isAdmin = user?.role === "ADMIN";
    
    if (notif.type === "ESSAY_SUBMITTED" || notif.type === "ESSAY_REVIEWED") {
      navigate({ to: isAdmin ? "/admin/essays" : "/dashboard/essays" as any });
    } else if (notif.type === "CONSULTING_SUBMITTED") {
      navigate({ to: isAdmin ? "/admin/consulting" : "/consulting" as any });
    } else if (notif.type === "CONTACT_INQUIRY") {
      navigate({ to: isAdmin ? "/admin/contact-requests" : "/contact" as any });
    } else if (notif.type === "ADMIN_REPLY") {
      navigate({ to: "/contact" as any });
    } else if (notif.type === "PAYMENT_SUCCESS" || notif.type === "ACCOUNT") {
      navigate({ to: isAdmin ? "/admin/users" : "/dashboard" as any });
    }
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative rounded-full p-2 text-on-surface-variant hover:bg-surface-container-low transition-colors"
        aria-label="Notifications"
      >
        <Icon name="notifications" className="text-[22px]" />
        {unreadCount > 0 && (
          <span className="absolute top-1 right-1 flex h-4 w-4 items-center justify-center rounded-full bg-accent text-[10px] font-bold text-on-primary">
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 sm:w-96 rounded-2xl border border-outline-variant/40 bg-surface-container-lowest py-2 shadow-xl z-50">
          <div className="flex items-center justify-between border-b border-outline-variant/40 px-4 pb-2 pt-1 gap-2">
            <h3 className="font-display text-base font-bold text-on-surface">Notifications</h3>
            <div className="flex items-center gap-3">
              {unreadCount > 0 && (
                <button
                  onClick={() => markAllReadMutation.mutate()}
                  className="text-[10px] font-bold uppercase tracking-[0.05em] text-primary hover:text-accent transition-colors cursor-pointer"
                >
                  Mark read
                </button>
              )}
              {notifications.length > 0 && (
                <button
                  onClick={() => {
                    if (confirm("Are you sure you want to clear all notifications?")) {
                      clearAllMutation.mutate();
                    }
                  }}
                  className="text-[10px] font-bold uppercase tracking-[0.05em] text-error hover:text-red-600 transition-colors cursor-pointer"
                >
                  Clear all
                </button>
              )}
            </div>
          </div>

          <div className="max-h-[60vh] overflow-y-auto overflow-x-hidden">
            {notifications.length === 0 ? (
              <div className="px-4 py-8 text-center text-sm text-on-surface-variant">
                You have no notifications yet.
              </div>
            ) : (
              notifications.map((notif) => (
                <div
                  key={notif._id}
                  onClick={() => handleMarkRead(notif)}
                  className={`cursor-pointer border-b border-outline-variant/20 px-4 py-3 transition-colors hover:bg-surface-container-low ${
                    !notif.isRead ? "bg-primary/5" : ""
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <h4 className={`text-sm font-semibold ${!notif.isRead ? "text-primary" : "text-on-surface"}`}>
                      {notif.title}
                    </h4>
                    {!notif.isRead && <span className="mt-1.5 h-2 w-2 flex-shrink-0 rounded-full bg-accent" />}
                  </div>
                  <p className="mt-1 text-xs text-on-surface-variant line-clamp-2 leading-relaxed">
                    {notif.message}
                  </p>
                  <span className="mt-2 block text-[10px] font-medium text-on-surface-variant/70 uppercase tracking-wider">
                    {new Date(notif.createdAt).toLocaleDateString()}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}
