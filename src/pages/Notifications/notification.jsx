import { useMemo, useState } from "react";
import {
  Bell,
  CalendarCheck,
  CalendarDays,
  Check,
  CheckCheck,
  Clock,
  CreditCard,
  DoorOpen,
  Eye,
  Filter,
  Hammer,
  Package,
  Search,
  Trash2,
  Archive,
  X,
  Users,
  Building2,
  AlertTriangle,
  MoreHorizontal,
  RotateCcw,
} from "lucide-react";

import notificationsData from "./notifcationData";

const categoryConfig = {
  booking: {
    label: "Booking",
    icon: CalendarCheck,
    color: "text-blue-600",
    bg: "bg-blue-50",
  },
  "check-in": {
    label: "Check-in",
    icon: DoorOpen,
    color: "text-green-600",
    bg: "bg-green-50",
  },
  "check-out": {
    label: "Check-out",
    icon: Users,
    color: "text-purple-600",
    bg: "bg-purple-50",
  },
  payment: {
    label: "Payment",
    icon: CreditCard,
    color: "text-amber-600",
    bg: "bg-amber-50",
  },
  housekeeping: {
    label: "Housekeeping",
    icon: Building2,
    color: "text-cyan-600",
    bg: "bg-cyan-50",
  },
  maintenance: {
    label: "Maintenance",
    icon: Hammer,
    color: "text-red-600",
    bg: "bg-red-50",
  },
  inventory: {
    label: "Inventory",
    icon: Package,
    color: "text-orange-600",
    bg: "bg-orange-50",
  },
  event: {
    label: "Event",
    icon: CalendarDays,
    color: "text-indigo-600",
    bg: "bg-indigo-50",
  },
};

const priorityConfig = {
  high: "bg-red-50 text-red-600 border-red-100",
  medium: "bg-amber-50 text-amber-600 border-amber-100",
  low: "bg-green-50 text-green-600 border-green-100",
};

const formatDate = (date) => {
  return new Date(date).toLocaleString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

const getRelativeTime = (date) => {
  const seconds = Math.floor((Date.now() - new Date(date).getTime()) / 1000);

  if (seconds < 60) return "Just now";

  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes} min ago`;

  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours} hour${hours > 1 ? "s" : ""} ago`;

  const days = Math.floor(hours / 24);
  if (days < 7) return `${days} day${days > 1 ? "s" : ""} ago`;

  return formatDate(date);
};

export default function Notifications() {
  const [notifications, setNotifications] = useState(notificationsData);
  const [activeTab, setActiveTab] = useState("all");
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [priorityFilter, setPriorityFilter] = useState("all");
  const [selectedNotification, setSelectedNotification] = useState(null);

  // Summary statistics
  const totalCount = notifications.length;

  const unreadCount = notifications.filter(
    (item) => !item.isRead && !item.isArchived,
  ).length;

  const highPriorityCount = notifications.filter(
    (item) => item.priority === "high" && !item.isArchived,
  ).length;

  const archivedCount = notifications.filter((item) => item.isArchived).length;

  // Filter notifications
  const filteredNotifications = useMemo(() => {
    return notifications
      .filter((item) => {
        if (activeTab === "unread") {
          return !item.isRead && !item.isArchived;
        }

        if (activeTab === "read") {
          return item.isRead && !item.isArchived;
        }

        if (activeTab === "archived") {
          return item.isArchived;
        }

        return !item.isArchived;
      })
      .filter((item) => {
        if (categoryFilter === "all") return true;
        return item.category === categoryFilter;
      })
      .filter((item) => {
        if (priorityFilter === "all") return true;
        return item.priority === priorityFilter;
      })
      .filter((item) => {
        const query = search.toLowerCase();

        return (
          item.title.toLowerCase().includes(query) ||
          item.message.toLowerCase().includes(query) ||
          item.relatedEntity?.guestName?.toLowerCase().includes(query) ||
          item.relatedEntity?.id?.toLowerCase().includes(query) ||
          item.relatedEntity?.roomNumber?.toLowerCase().includes(query)
        );
      })
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  }, [notifications, activeTab, categoryFilter, priorityFilter, search]);

  // Mark one notification as read
  const markAsRead = (id) => {
    setNotifications((prev) =>
      prev.map((item) => (item.id === id ? { ...item, isRead: true } : item)),
    );

    setSelectedNotification((prev) =>
      prev?.id === id ? { ...prev, isRead: true } : prev,
    );
  };

  // Mark all active notifications as read
  const markAllAsRead = () => {
    setNotifications((prev) =>
      prev.map((item) => (!item.isArchived ? { ...item, isRead: true } : item)),
    );

    setSelectedNotification((prev) =>
      prev && !prev.isArchived ? { ...prev, isRead: true } : prev,
    );
  };

  // Archive notification
  const archiveNotification = (id) => {
    setNotifications((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, isArchived: true } : item,
      ),
    );

    setSelectedNotification((prev) => (prev?.id === id ? null : prev));
  };

  // Restore archived notification
  const restoreNotification = (id) => {
    setNotifications((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, isArchived: false } : item,
      ),
    );
  };

  // Permanently delete notification
  const deleteNotification = (id) => {
    setNotifications((prev) => prev.filter((item) => item.id !== id));

    setSelectedNotification((prev) => (prev?.id === id ? null : prev));
  };

  // Open notification details
  const openNotification = (item) => {
    if (!item.isRead) {
      markAsRead(item.id);
    }

    setSelectedNotification({
      ...item,
      isRead: true,
    });
  };

  const tabs = [
    { id: "all", label: "All", count: totalCount - archivedCount },
    { id: "unread", label: "Unread", count: unreadCount },
    {
      id: "read",
      label: "Read",
      count: notifications.filter((item) => item.isRead && !item.isArchived)
        .length,
    },
    { id: "archived", label: "Archived", count: archivedCount },
  ];

  const resetFilters = () => {
    setSearch("");
    setCategoryFilter("all");
    setPriorityFilter("all");
  };

  return (
    <div className="min-h-screen bg-[#F5F7FA] p-4 sm:p-6 lg:p-8">
      {/* Page Header */}
      <div className="mb-7 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <div className="flex items-center gap-2">
            <Bell size={23} className="text-blue-600" />
            <h1 className="text-2xl font-bold text-slate-800">Notifications</h1>
          </div>

          <p className="mt-1 text-sm text-slate-500">
            Stay updated with important hotel activities and alerts.
          </p>
        </div>

        <button
          onClick={markAllAsRead}
          disabled={unreadCount === 0}
          className="flex items-center justify-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
        >
          <CheckCheck size={17} />
          Mark all as read
        </button>
      </div>

      {/* Summary Cards */}
      <div className="mb-7 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <SummaryCard
          title="Total Notifications"
          value={totalCount}
          subtitle="All notifications"
          icon={Bell}
          color="blue"
        />

        <SummaryCard
          title="Unread"
          value={unreadCount}
          subtitle="Require your attention"
          icon={Eye}
          color="amber"
        />

        <SummaryCard
          title="High Priority"
          value={highPriorityCount}
          subtitle="Important alerts"
          icon={AlertTriangle}
          color="red"
        />

        <SummaryCard
          title="Archived"
          value={archivedCount}
          subtitle="Stored notifications"
          icon={Archive}
          color="purple"
        />
      </div>

      {/* Notification List Container */}
      <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
        {/* Tabs */}
        <div className="flex gap-6 overflow-x-auto border-b border-slate-200 px-5 pt-4">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`relative flex shrink-0 items-center gap-2 pb-3 text-sm font-medium transition ${
                activeTab === tab.id
                  ? "text-blue-600"
                  : "text-slate-500 hover:text-slate-800"
              }`}
            >
              {tab.label}

              <span
                className={`rounded-full px-2 py-0.5 text-xs ${
                  activeTab === tab.id
                    ? "bg-blue-50 text-blue-600"
                    : "bg-slate-100 text-slate-500"
                }`}
              >
                {tab.count}
              </span>

              {activeTab === tab.id && (
                <span className="absolute bottom-0 left-0 h-0.5 w-full rounded-full bg-blue-600" />
              )}
            </button>
          ))}
        </div>

        {/* Search and Filters */}
        <div className="flex flex-col gap-3 border-b border-slate-200 p-4 lg:flex-row lg:items-center">
          <div className="relative flex-1">
            <Search
              size={18}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
            />

            <input
              type="text"
              placeholder="Search notifications, guests, booking ID..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full rounded-lg border border-slate-200 bg-[#F8FAFC] py-2.5 pl-10 pr-4 text-sm text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
            />
          </div>

          <div className="flex flex-wrap gap-2">
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-600 outline-none focus:border-blue-400"
            >
              <option value="all">All Categories</option>
              {Object.entries(categoryConfig).map(([key, value]) => (
                <option key={key} value={key}>
                  {value.label}
                </option>
              ))}
            </select>

            <select
              value={priorityFilter}
              onChange={(e) => setPriorityFilter(e.target.value)}
              className="rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-600 outline-none focus:border-blue-400"
            >
              <option value="all">All Priorities</option>
              <option value="high">High Priority</option>
              <option value="medium">Medium Priority</option>
              <option value="low">Low Priority</option>
            </select>

            {(search ||
              categoryFilter !== "all" ||
              priorityFilter !== "all") && (
              <button
                onClick={resetFilters}
                className="flex items-center gap-1 rounded-lg px-3 py-2 text-sm font-medium text-blue-600 hover:bg-blue-50"
              >
                <RotateCcw size={14} />
                Reset
              </button>
            )}
          </div>
        </div>

        {/* Notification List */}
        <div>
          {filteredNotifications.length > 0 ? (
            filteredNotifications.map((item) => {
              const category =
                categoryConfig[item.category] || categoryConfig.booking;

              const CategoryIcon = category.icon;

              return (
                <div
                  key={item.id}
                  onClick={() => openNotification(item)}
                  className={`group flex cursor-pointer gap-3 border-b border-slate-100 px-4 py-5 transition hover:bg-slate-50 sm:px-5 ${
                    !item.isRead ? "bg-blue-50/30" : "bg-white"
                  }`}
                >
                  {/* Category Icon */}
                  <div
                    className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${category.bg}`}
                  >
                    <CategoryIcon size={20} className={category.color} />
                  </div>

                  {/* Notification Content */}
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <h3
                        className={`text-sm ${
                          !item.isRead
                            ? "font-semibold text-slate-900"
                            : "font-medium text-slate-700"
                        }`}
                      >
                        {item.title}
                      </h3>

                      <span
                        className={`rounded-md px-2 py-0.5 text-xs font-medium ${category.bg} ${category.color}`}
                      >
                        {category.label}
                      </span>

                      <span
                        className={`rounded-md border px-2 py-0.5 text-xs font-medium capitalize ${
                          priorityConfig[item.priority]
                        }`}
                      >
                        {item.priority}
                      </span>
                    </div>

                    <p className="mt-1.5 line-clamp-2 text-sm leading-5 text-slate-500">
                      {item.message}
                    </p>

                    <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-slate-400">
                      <span className="flex items-center gap-1">
                        <Clock size={13} />
                        {getRelativeTime(item.createdAt)}
                      </span>

                      {item.relatedEntity?.id && (
                        <span>ID: {item.relatedEntity.id}</span>
                      )}

                      {!item.isRead && (
                        <span className="font-medium text-blue-600">
                          Unread
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Notification Actions */}
                  <div
                    className="flex shrink-0 items-center gap-1"
                    onClick={(e) => e.stopPropagation()}
                  >
                    {!item.isArchived && (
                      <button
                        title={item.isRead ? "Mark as unread" : "Mark as read"}
                        onClick={() =>
                          setNotifications((prev) =>
                            prev.map((notification) =>
                              notification.id === item.id
                                ? {
                                    ...notification,
                                    isRead: !notification.isRead,
                                  }
                                : notification,
                            ),
                          )
                        }
                        className="rounded-lg p-2 text-slate-400 hover:bg-blue-50 hover:text-blue-600"
                      >
                        <Check size={17} />
                      </button>
                    )}

                    {item.isArchived ? (
                      <button
                        title="Restore notification"
                        onClick={() => restoreNotification(item.id)}
                        className="rounded-lg p-2 text-slate-400 hover:bg-green-50 hover:text-green-600"
                      >
                        <RotateCcw size={17} />
                      </button>
                    ) : (
                      <button
                        title="Archive notification"
                        onClick={() => archiveNotification(item.id)}
                        className="rounded-lg p-2 text-slate-400 hover:bg-amber-50 hover:text-amber-600"
                      >
                        <Archive size={17} />
                      </button>
                    )}

                    <button
                      title="Delete notification"
                      onClick={() => deleteNotification(item.id)}
                      className="rounded-lg p-2 text-slate-400 hover:bg-red-50 hover:text-red-600"
                    >
                      <Trash2 size={17} />
                    </button>
                  </div>

                  {/* Unread Indicator */}
                  {!item.isRead && !item.isArchived && (
                    <div className="mt-2 hidden h-2 w-2 shrink-0 rounded-full bg-blue-600 sm:block" />
                  )}
                </div>
              );
            })
          ) : (
            <div className="flex flex-col items-center justify-center px-5 py-20 text-center">
              <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-slate-100">
                <Bell size={28} className="text-slate-400" />
              </div>

              <h3 className="font-semibold text-slate-700">
                No notifications found
              </h3>

              <p className="mt-1 max-w-sm text-sm text-slate-400">
                There are no notifications matching your current filters.
              </p>

              <button
                onClick={resetFilters}
                className="mt-4 text-sm font-medium text-blue-600 hover:underline"
              >
                Clear filters
              </button>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex flex-col justify-between gap-2 bg-slate-50 px-5 py-3 text-xs text-slate-500 sm:flex-row sm:items-center">
          <span>
            Showing {filteredNotifications.length} of{" "}
            {activeTab === "archived"
              ? archivedCount
              : activeTab === "all"
                ? totalCount - archivedCount
                : tabs.find((tab) => tab.id === activeTab)?.count}{" "}
            notifications
          </span>

          <span>Notifications are sorted by newest first</span>
        </div>
      </div>

      {/* Notification Details Modal */}
      {selectedNotification && (
        <NotificationDetails
          notification={selectedNotification}
          onClose={() => setSelectedNotification(null)}
          onArchive={archiveNotification}
          onDelete={deleteNotification}
          onRestore={restoreNotification}
        />
      )}
    </div>
  );
}

// Summary Card Component
function SummaryCard({ title, value, subtitle, icon: Icon, color }) {
  const colorConfig = {
    blue: "bg-blue-50 text-blue-600",
    amber: "bg-amber-50 text-amber-600",
    red: "bg-red-50 text-red-600",
    purple: "bg-purple-50 text-purple-600",
  };

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-slate-500">{title}</p>

          <h2 className="mt-2 text-2xl font-bold text-slate-800">{value}</h2>

          <p className="mt-1 text-xs text-slate-400">{subtitle}</p>
        </div>

        <div
          className={`flex h-11 w-11 items-center justify-center rounded-xl ${colorConfig[color]}`}
        >
          <Icon size={21} />
        </div>
      </div>
    </div>
  );
}

// Notification Details Component
function NotificationDetails({
  notification,
  onClose,
  onArchive,
  onDelete,
  onRestore,
}) {
  const category =
    categoryConfig[notification.category] || categoryConfig.booking;

  const CategoryIcon = category.icon;
  const related = notification.relatedEntity || {};

  return (
    <div
      className="fixed inset-0 z-50 flex justify-end bg-slate-900/40"
      onClick={onClose}
    >
      <div
        className="flex h-full w-full max-w-md flex-col overflow-y-auto bg-white shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4">
          <h2 className="font-semibold text-slate-800">Notification Details</h2>

          <button
            onClick={onClose}
            className="rounded-lg p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-700"
          >
            <X size={19} />
          </button>
        </div>

        {/* Details */}
        <div className="flex-1 p-5">
          <div
            className={`mb-5 flex h-14 w-14 items-center justify-center rounded-xl ${category.bg}`}
          >
            <CategoryIcon size={26} className={category.color} />
          </div>

          <div className="flex flex-wrap gap-2">
            <span
              className={`rounded-md px-2.5 py-1 text-xs font-medium ${category.bg} ${category.color}`}
            >
              {category.label}
            </span>

            <span
              className={`rounded-md border px-2.5 py-1 text-xs font-medium capitalize ${
                priorityConfig[notification.priority]
              }`}
            >
              {notification.priority} priority
            </span>

            <span className="rounded-md bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-600">
              {notification.isArchived
                ? "Archived"
                : notification.isRead
                  ? "Read"
                  : "Unread"}
            </span>
          </div>

          <h3 className="mt-5 text-xl font-bold text-slate-800">
            {notification.title}
          </h3>

          <p className="mt-3 text-sm leading-6 text-slate-500">
            {notification.message}
          </p>

          <div className="mt-5 flex items-center gap-2 text-sm text-slate-400">
            <CalendarDays size={16} />
            {formatDate(notification.createdAt)}
          </div>

          {/* Related Entity */}
          <div className="mt-7 rounded-xl border border-slate-200 p-4">
            <h4 className="mb-4 text-sm font-semibold text-slate-800">
              Related Information
            </h4>

            <div className="space-y-4">
              <DetailRow label="Reference ID" value={related.id} />

              <DetailRow label="Related Type" value={related.type} />

              <DetailRow label="Guest Name" value={related.guestName} />

              <DetailRow label="Room Number" value={related.roomNumber} />

              <DetailRow
                label="Amount"
                value={
                  related.amount !== undefined
                    ? `₹${related.amount.toLocaleString("en-IN")}`
                    : undefined
                }
              />

              <DetailRow label="Item Name" value={related.itemName} />

              <DetailRow label="Event Name" value={related.eventName} />

              <DetailRow label="Venue" value={related.venueName} />
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="flex flex-wrap gap-2 border-t border-slate-200 p-5">
          {notification.isArchived ? (
            <button
              onClick={() => {
                onRestore(notification.id);
                onClose();
              }}
              className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-green-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-green-700"
            >
              <RotateCcw size={16} />
              Restore
            </button>
          ) : (
            <button
              onClick={() => {
                onArchive(notification.id);
              }}
              className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-amber-50 px-4 py-2.5 text-sm font-medium text-amber-700 hover:bg-amber-100"
            >
              <Archive size={16} />
              Archive
            </button>
          )}

          <button
            onClick={() => onDelete(notification.id)}
            className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-red-50 px-4 py-2.5 text-sm font-medium text-red-600 hover:bg-red-100"
          >
            <Trash2 size={16} />
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}

function DetailRow({ label, value }) {
  if (!value) return null;

  return (
    <div className="flex items-start justify-between gap-3">
      <span className="text-xs text-slate-400">{label}</span>

      <span className="text-right text-sm font-medium text-slate-700">
        {value}
      </span>
    </div>
  );
}
