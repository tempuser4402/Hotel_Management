
import { useMemo, useState } from "react";
import {
  ArrowLeftRight,
  Plus,
  Search,
  Filter,
  Eye,
  Pencil,
  Trash2,
  X,
  Package,
  CheckCircle2,
  Clock,
  Truck,
  Warehouse,
  CalendarDays,
  User,
  MapPin,
  Save,
  Boxes,
  Check,
  AlertCircle,
  History,
  Download,
} from "lucide-react";

const stores = [
  "Main Store",
  "Kitchen Store",
  "Restaurant Store",
  "Housekeeping Store",
  "Maintenance Store",
];

const stockItems = [
  { id: "ITEM-001", name: "Basmati Rice", sku: "FOOD-001", unit: "kg" },
  { id: "ITEM-002", name: "Cooking Oil", sku: "FOOD-002", unit: "litre" },
  { id: "ITEM-003", name: "All Purpose Flour", sku: "FOOD-003", unit: "kg" },
  { id: "ITEM-004", name: "Floor Cleaner", sku: "CLN-001", unit: "litre" },
  { id: "ITEM-005", name: "Bath Towels", sku: "LIN-001", unit: "piece" },
  { id: "ITEM-006", name: "Shampoo Bottles", sku: "GST-001", unit: "piece" },
  { id: "ITEM-007", name: "Hand Wash", sku: "CLN-002", unit: "litre" },
  { id: "ITEM-008", name: "Tea Leaves", sku: "FOOD-004", unit: "kg" },
];

const initialTransfers = [
  {
    id: "TRF-2026-001",
    fromStore: "Main Store",
    toStore: "Kitchen Store",
    date: "2026-11-02",
    expectedDate: "2026-11-03",
    requestedBy: "Rahul Sharma",
    approvedBy: "Admin",
    status: "Completed",
    notes: "Weekly kitchen stock replenishment.",
    items: [
      { itemId: "ITEM-001", name: "Basmati Rice", sku: "FOOD-001", unit: "kg", quantity: 40, received: 40 },
      { itemId: "ITEM-002", name: "Cooking Oil", sku: "FOOD-002", unit: "litre", quantity: 20, received: 20 },
    ],
    history: [
      { action: "Transfer Created", by: "Rahul Sharma", date: "2026-11-02 09:00", note: "Weekly kitchen stock replenishment." },
      { action: "Approved", by: "Admin", date: "2026-11-02 10:30", note: "Transfer approved." },
      { action: "Dispatched", by: "Store Manager", date: "2026-11-02 12:00", note: "Items sent to Kitchen Store." },
      { action: "Received", by: "Kitchen Manager", date: "2026-11-03 09:00", note: "All quantities received." },
    ],
  },
  {
    id: "TRF-2026-002",
    fromStore: "Main Store",
    toStore: "Housekeeping Store",
    date: "2026-11-04",
    expectedDate: "2026-11-07",
    requestedBy: "Priya Mehta",
    approvedBy: "Admin",
    status: "In Transit",
    notes: "Monthly housekeeping supplies.",
    items: [
      { itemId: "ITEM-004", name: "Floor Cleaner", sku: "CLN-001", unit: "litre", quantity: 25, received: 0 },
      { itemId: "ITEM-007", name: "Hand Wash", sku: "CLN-002", unit: "litre", quantity: 15, received: 0 },
    ],
    history: [
      { action: "Transfer Created", by: "Priya Mehta", date: "2026-11-04 09:00", note: "Monthly housekeeping supplies." },
      { action: "Approved", by: "Admin", date: "2026-11-04 11:00", note: "Approved for dispatch." },
      { action: "Dispatched", by: "Store Manager", date: "2026-11-05 10:00", note: "Items dispatched." },
    ],
  },
  {
    id: "TRF-2026-003",
    fromStore: "Main Store",
    toStore: "Restaurant Store",
    date: "2026-11-05",
    expectedDate: "2026-11-08",
    requestedBy: "Amit Verma",
    approvedBy: "",
    status: "Pending Approval",
    notes: "Restaurant stock requirement.",
    items: [
      { itemId: "ITEM-008", name: "Tea Leaves", sku: "FOOD-004", unit: "kg", quantity: 8, received: 0 },
      { itemId: "ITEM-003", name: "All Purpose Flour", sku: "FOOD-003", unit: "kg", quantity: 20, received: 0 },
    ],
    history: [
      { action: "Transfer Created", by: "Amit Verma", date: "2026-11-05 14:00", note: "Restaurant stock requirement." },
    ],
  },
  {
    id: "TRF-2026-004",
    fromStore: "Main Store",
    toStore: "Maintenance Store",
    date: "2026-11-06",
    expectedDate: "2026-11-09",
    requestedBy: "Suresh Kumar",
    approvedBy: "",
    status: "Draft",
    notes: "Maintenance supplies.",
    items: [
      { itemId: "ITEM-004", name: "Floor Cleaner", sku: "CLN-001", unit: "litre", quantity: 10, received: 0 },
    ],
    history: [
      { action: "Transfer Created", by: "Suresh Kumar", date: "2026-11-06 09:00", note: "Draft transfer created." },
    ],
  },
];

const inputClass =
  "w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100";

const statusStyles = {
  Draft: "bg-slate-100 text-slate-700",
  "Pending Approval": "bg-amber-50 text-amber-700",
  Approved: "bg-blue-50 text-blue-700",
  "In Transit": "bg-indigo-50 text-indigo-700",
  "Partially Received": "bg-orange-50 text-orange-700",
  Completed: "bg-emerald-50 text-emerald-700",
  Rejected: "bg-red-50 text-red-700",
};

const formatDateTime = () => {
  const now = new Date();
  return now.toLocaleString("en-IN", {
    dateStyle: "medium",
    timeStyle: "short",
  });
};

function StatusBadge({ status }) {
  return (
    <span
      className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${
        statusStyles[status] || "bg-slate-100 text-slate-600"
      }`}
    >
      {status}
    </span>
  );
}

function Field({ label, children, required = false }) {
  return (
    <label className="block space-y-1.5">
      <span className="text-sm font-medium text-slate-700">
        {label} {required && <span className="text-red-500">*</span>}
      </span>
      {children}
    </label>
  );
}

function StatCard({ title, value, subtitle, icon: Icon, color }) {
  const styles = {
    blue: "bg-blue-50 text-blue-600",
    amber: "bg-amber-50 text-amber-600",
    purple: "bg-purple-50 text-purple-600",
    green: "bg-emerald-50 text-emerald-600",
  };

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-sm text-slate-500">{title}</p>
          <h3 className="mt-2 text-2xl font-bold text-slate-900">{value}</h3>
          <p className="mt-1 text-xs text-slate-400">{subtitle}</p>
        </div>
        <div className={`rounded-xl p-3 ${styles[color]}`}>
          <Icon size={22} />
        </div>
      </div>
    </div>
  );
}

const emptyItem = {
  itemId: "",
  name: "",
  sku: "",
  unit: "",
  quantity: 1,
  received: 0,
};

export default function StockTransfers() {
  const [transfers, setTransfers] = useState(initialTransfers);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [storeFilter, setStoreFilter] = useState("All");
  const [dateFilter, setDateFilter] = useState("");

  const [modal, setModal] = useState("");
  const [selectedTransfer, setSelectedTransfer] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [notification, setNotification] = useState("");

  const [form, setForm] = useState({
    fromStore: "Main Store",
    toStore: "",
    date: new Date().toISOString().slice(0, 10),
    expectedDate: "",
    requestedBy: "",
    notes: "",
    status: "Draft",
    items: [{ ...emptyItem }],
  });

  const [receiveItems, setReceiveItems] = useState([]);
  const [receiveNote, setReceiveNote] = useState("");

  const pendingCount = transfers.filter(
    (item) => item.status === "Pending Approval"
  ).length;

  const transitCount = transfers.filter(
    (item) => item.status === "In Transit"
  ).length;

  const completedCount = transfers.filter(
    (item) => item.status === "Completed"
  ).length;

  const totalItemsTransferred = transfers.reduce(
    (sum, transfer) =>
      sum +
      transfer.items.reduce((itemSum, item) => itemSum + item.received, 0),
    0
  );

  const filteredTransfers = useMemo(() => {
    return transfers.filter((transfer) => {
      const searchText = search.toLowerCase();

      const matchesSearch =
        transfer.id.toLowerCase().includes(searchText) ||
        transfer.fromStore.toLowerCase().includes(searchText) ||
        transfer.toStore.toLowerCase().includes(searchText) ||
        transfer.requestedBy.toLowerCase().includes(searchText);

      const matchesStatus =
        statusFilter === "All" || transfer.status === statusFilter;

      const matchesStore =
        storeFilter === "All" ||
        transfer.fromStore === storeFilter ||
        transfer.toStore === storeFilter;

      const matchesDate = !dateFilter || transfer.date === dateFilter;

      return matchesSearch && matchesStatus && matchesStore && matchesDate;
    });
  }, [transfers, search, statusFilter, storeFilter, dateFilter]);

  const showMessage = (message) => {
    setNotification(message);
    window.setTimeout(() => setNotification(""), 3000);
  };

  const createTransferId = () => {
    const next =
      Math.max(
        0,
        ...transfers.map((transfer) =>
          Number(transfer.id.split("-").pop()) || 0
        )
      ) + 1;

    return `TRF-2026-${String(next).padStart(3, "0")}`;
  };

  const addHistory = (transfer, action, by, note = "") => ({
    ...transfer,
    history: [
      ...(transfer.history || []),
      {
        action,
        by,
        date: formatDateTime(),
        note,
      },
    ],
  });

  const openCreate = () => {
    setSelectedTransfer(null);
    setForm({
      fromStore: "Main Store",
      toStore: "",
      date: new Date().toISOString().slice(0, 10),
      expectedDate: "",
      requestedBy: "",
      notes: "",
      status: "Draft",
      items: [{ ...emptyItem }],
    });
    setModal("form");
  };

  const openEdit = (transfer) => {
    setSelectedTransfer(transfer);
    setForm({
      fromStore: transfer.fromStore,
      toStore: transfer.toStore,
      date: transfer.date,
      expectedDate: transfer.expectedDate,
      requestedBy: transfer.requestedBy,
      notes: transfer.notes || "",
      status: transfer.status,
      items: transfer.items.map((item) => ({ ...item })),
    });
    setModal("form");
  };

  const updateItem = (index, key, value) => {
    setForm((previous) => ({
      ...previous,
      items: previous.items.map((item, i) =>
        i === index ? { ...item, [key]: value } : item
      ),
    }));
  };

  const selectItem = (index, itemId) => {
    const selected = stockItems.find((item) => item.id === itemId);

    if (!selected) {
      updateItem(index, "itemId", "");
      return;
    }

    setForm((previous) => ({
      ...previous,
      items: previous.items.map((item, i) =>
        i === index
          ? {
              ...item,
              itemId: selected.id,
              name: selected.name,
              sku: selected.sku,
              unit: selected.unit,
            }
          : item
      ),
    }));
  };

  const addItemRow = () => {
    setForm((previous) => ({
      ...previous,
      items: [...previous.items, { ...emptyItem }],
    }));
  };

  const removeItemRow = (index) => {
    setForm((previous) => ({
      ...previous,
      items:
        previous.items.length === 1
          ? previous.items
          : previous.items.filter((_, i) => i !== index),
    }));
  };

  const saveTransfer = (event) => {
    event.preventDefault();

    if (!form.toStore) {
      showMessage("Please select a destination store.");
      return;
    }

    if (form.fromStore === form.toStore) {
      showMessage("Source and destination stores must be different.");
      return;
    }

    if (!form.requestedBy.trim()) {
      showMessage("Please enter the requester name.");
      return;
    }

    if (!form.expectedDate) {
      showMessage("Please select an expected date.");
      return;
    }

    if (form.expectedDate < form.date) {
      showMessage("Expected date cannot be before the transfer date.");
      return;
    }

    if (
      form.items.some(
        (item) => !item.itemId || Number(item.quantity) <= 0
      )
    ) {
      showMessage("Please select valid items and quantities.");
      return;
    }

    const uniqueItems = new Set(form.items.map((item) => item.itemId));

    if (uniqueItems.size !== form.items.length) {
      showMessage("Each item can only appear once in a transfer.");
      return;
    }

    if (selectedTransfer) {
      setTransfers((previous) =>
        previous.map((transfer) => {
          if (transfer.id !== selectedTransfer.id) return transfer;

          const updated = {
            ...transfer,
            ...form,
            items: form.items.map((item) => ({
              ...item,
              quantity: Number(item.quantity),
              received: item.received || 0,
            })),
          };

          return addHistory(
            updated,
            "Transfer Updated",
            form.requestedBy,
            "Transfer details were updated."
          );
        })
      );

      showMessage("Transfer updated successfully.");
    } else {
      const newTransfer = {
        id: createTransferId(),
        ...form,
        approvedBy: "",
        items: form.items.map((item) => ({
          ...item,
          quantity: Number(item.quantity),
          received: 0,
        })),
        history: [],
      };

      const withHistory = addHistory(
        newTransfer,
        "Transfer Created",
        form.requestedBy,
        form.notes || "Transfer request created."
      );

      setTransfers((previous) => [withHistory, ...previous]);
      showMessage("Transfer request created successfully.");
    }

    setModal("");
  };

  const changeTransferStatus = (transferId, status, actor, note = "") => {
    setTransfers((previous) =>
      previous.map((transfer) => {
        if (transfer.id !== transferId) return transfer;

        const updated = {
          ...transfer,
          status,
          approvedBy:
            status === "Approved" || status === "In Transit"
              ? actor
              : transfer.approvedBy,
        };

        return addHistory(updated, status, actor, note);
      })
    );

    if (selectedTransfer?.id === transferId) {
      setSelectedTransfer((previous) => ({
        ...previous,
        status,
        approvedBy:
          status === "Approved" || status === "In Transit"
            ? actor
            : previous.approvedBy,
      }));
    }

    showMessage(`${transferId} updated to ${status}.`);
  };

  const approveTransfer = (transfer) => {
    changeTransferStatus(
      transfer.id,
      "Approved",
      "Admin",
      "Transfer request approved."
    );
  };

  const dispatchTransfer = (transfer) => {
    changeTransferStatus(
      transfer.id,
      "In Transit",
      "Store Manager",
      "Stock dispatched from source store."
    );
  };

  const rejectTransfer = (transfer) => {
    changeTransferStatus(
      transfer.id,
      "Rejected",
      "Admin",
      "Transfer request rejected."
    );
  };

  const openReceive = (transfer) => {
    setSelectedTransfer(transfer);
    setReceiveItems(
      transfer.items.map((item) => ({
        ...item,
        receivedNow: 0,
      }))
    );
    setReceiveNote("");
    setModal("receive");
  };

  const saveReceivedItems = (event) => {
    event.preventDefault();

    if (!receiveItems.some((item) => Number(item.receivedNow) > 0)) {
      showMessage("Enter at least one received quantity.");
      return;
    }

    const invalid = receiveItems.some(
      (item) =>
        Number(item.receivedNow) < 0 ||
        Number(item.received) + Number(item.receivedNow) >
          Number(item.quantity)
    );

    if (invalid) {
      showMessage("Received quantity cannot exceed the transferred quantity.");
      return;
    }

    const updatedItems = receiveItems.map((item) => ({
      itemId: item.itemId,
      name: item.name,
      sku: item.sku,
      unit: item.unit,
      quantity: Number(item.quantity),
      received: Number(item.received) + Number(item.receivedNow),
    }));

    const allReceived = updatedItems.every(
      (item) => item.received >= item.quantity
    );

    const anyReceived = updatedItems.some(
      (item) => item.received > 0
    );

    const newStatus = allReceived
      ? "Completed"
      : anyReceived
        ? "Partially Received"
        : "In Transit";

    setTransfers((previous) =>
      previous.map((transfer) => {
        if (transfer.id !== selectedTransfer.id) return transfer;

        const updated = {
          ...transfer,
          items: updatedItems,
        };

        return addHistory(
          {
            ...updated,
            status: newStatus,
          },
          "Stock Received",
          "Destination Store Manager",
          receiveNote || "Received quantities confirmed."
        );
      })
    );

    setModal("");
    showMessage(
      newStatus === "Completed"
        ? "Transfer completed. All items received."
        : "Partial receipt recorded successfully."
    );
  };

  const openDetails = (transfer) => {
    setSelectedTransfer(transfer);
    setModal("details");
  };

  const deleteTransfer = () => {
    if (!deleteTarget) return;

    setTransfers((previous) =>
      previous.filter((transfer) => transfer.id !== deleteTarget.id)
    );

    setDeleteTarget(null);
    showMessage("Transfer deleted successfully.");
  };

  const clearFilters = () => {
    setSearch("");
    setStatusFilter("All");
    setStoreFilter("All");
    setDateFilter("");
  };

  const exportTransfers = () => {
    const headers = [
      "Transfer ID",
      "Source Store",
      "Destination Store",
      "Date",
      "Expected Date",
      "Requester",
      "Approver",
      "Status",
      "Items",
      "Quantity Transferred",
      "Quantity Received",
    ];

    const rows = filteredTransfers.map((transfer) => [
      transfer.id,
      transfer.fromStore,
      transfer.toStore,
      transfer.date,
      transfer.expectedDate,
      transfer.requestedBy,
      transfer.approvedBy || "",
      transfer.status,
      transfer.items.length,
      transfer.items.reduce((sum, item) => sum + item.quantity, 0),
      transfer.items.reduce((sum, item) => sum + item.received, 0),
    ]);

    const csv = [headers, ...rows]
      .map((row) =>
        row.map((value) => `"${String(value).replace(/"/g, '""')}"`).join(",")
      )
      .join("\n");

    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "stock-transfers.csv";
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen w-full bg-slate-50 p-2 md:p-4">
      <div className="w-full space-y-5">

        {/* Header */}
        <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
          <div className="flex items-center gap-3">
            <div className="rounded-xl bg-blue-100 p-3 text-blue-600">
              <ArrowLeftRight size={24} />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-slate-900">
                Stock Transfers
              </h1>
              <p className="mt-1 text-sm text-slate-500">
                Move stock between hotel stores and track every transfer.
              </p>
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            <button
              onClick={exportTransfers}
              className="flex items-center gap-2 rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50"
            >
              <Download size={16} />
              Export CSV
            </button>
            <button
              onClick={openCreate}
              className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-blue-700"
            >
              <Plus size={17} />
              New Transfer
            </button>
          </div>
        </div>

        {notification && (
          <div className="flex items-center justify-between rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800">
            {notification}
            <button onClick={() => setNotification("")}>
              <X size={17} />
            </button>
          </div>
        )}

        {/* Statistics */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <StatCard
            title="Total Transfers"
            value={transfers.length}
            subtitle="All transfer requests"
            icon={ArrowLeftRight}
            color="blue"
          />
          <StatCard
            title="Pending Approval"
            value={pendingCount}
            subtitle="Waiting for authorization"
            icon={Clock}
            color="amber"
          />
          <StatCard
            title="In Transit"
            value={transitCount}
            subtitle="Stock dispatched"
            icon={Truck}
            color="purple"
          />
          <StatCard
            title="Completed Transfers"
            value={completedCount}
            subtitle={`${totalItemsTransferred} units received`}
            icon={CheckCircle2}
            color="green"
          />
        </div>

        {/* Transfer Process */}
        <div className="rounded-xl border border-slate-200 bg-white p-4">
          <h2 className="mb-4 font-semibold text-slate-800">
            Transfer Process
          </h2>

          <div className="grid grid-cols-2 gap-4 md:grid-cols-5">
            {[
              ["01", "Create Request", "Choose stores and items"],
              ["02", "Approval", "Manager authorizes"],
              ["03", "Dispatch", "Source store sends stock"],
              ["04", "Receive", "Destination confirms quantity"],
              ["05", "Complete", "Transfer is finalized"],
            ].map(([number, title, description]) => (
              <div key={number} className="flex items-start gap-2">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-blue-50 text-xs font-bold text-blue-700">
                  {number}
                </div>
                <div>
                  <p className="text-sm font-semibold text-slate-800">{title}</p>
                  <p className="mt-1 text-xs text-slate-400">{description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Filters */}
        <div className="rounded-xl border border-slate-200 bg-white p-4">
          <div className="mb-3 flex items-center gap-2">
            <Filter size={17} className="text-slate-500" />
            <h2 className="font-semibold text-slate-800">Search & Filters</h2>
          </div>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
            <div className="relative">
              <Search
                size={17}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
              />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search transfer, store or requester..."
                className={`${inputClass} pl-9`}
              />
            </div>

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className={inputClass}
            >
              <option value="All">All Statuses</option>
              {[
                "Draft",
                "Pending Approval",
                "Approved",
                "In Transit",
                "Partially Received",
                "Completed",
                "Rejected",
              ].map((status) => (
                <option key={status}>{status}</option>
              ))}
            </select>

            <select
              value={storeFilter}
              onChange={(e) => setStoreFilter(e.target.value)}
              className={inputClass}
            >
              <option value="All">All Stores</option>
              {stores.map((store) => (
                <option key={store}>{store}</option>
              ))}
            </select>

            <input
              type="date"
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
              className={inputClass}
              aria-label="Filter by transfer date"
            />
          </div>

          <div className="mt-3 flex items-center justify-between">
            <p className="text-xs text-slate-500">
              Showing {filteredTransfers.length} of {transfers.length} transfers
            </p>
            <button
              onClick={clearFilters}
              className="text-xs font-semibold text-blue-600 hover:text-blue-800"
            >
              Clear filters
            </button>
          </div>
        </div>

        {/* Transfer Table */}
        <div className="overflow-hidden rounded-xl border border-slate-200 bg-white">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 p-4">
            <div>
              <h2 className="font-semibold text-slate-900">Transfer History</h2>
              <p className="mt-1 text-xs text-slate-500">
                View and manage all stock movements between stores.
              </p>
            </div>
            <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600">
              {filteredTransfers.length} records
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full min-w-[1100px] text-left text-sm">
              <thead className="bg-slate-50 text-xs uppercase text-slate-500">
                <tr>
                  <th className="px-4 py-3">Transfer ID</th>
                  <th className="px-4 py-3">Source Store</th>
                  <th className="px-4 py-3">Destination Store</th>
                  <th className="px-4 py-3">Transfer Date</th>
                  <th className="px-4 py-3">Items</th>
                  <th className="px-4 py-3">Received</th>
                  <th className="px-4 py-3">Requester</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3 text-right">Actions</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-100">
                {filteredTransfers.map((transfer) => {
                  const totalQuantity = transfer.items.reduce(
                    (sum, item) => sum + item.quantity,
                    0
                  );

                  const receivedQuantity = transfer.items.reduce(
                    (sum, item) => sum + item.received,
                    0
                  );

                  return (
                    <tr key={transfer.id} className="hover:bg-slate-50">
                      <td className="px-4 py-3">
                        <p className="font-semibold text-blue-600">{transfer.id}</p>
                        <p className="mt-1 text-xs text-slate-400">
                          Due {transfer.expectedDate}
                        </p>
                      </td>

                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2 text-slate-700">
                          <Warehouse size={15} className="text-slate-400" />
                          {transfer.fromStore}
                        </div>
                      </td>

                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2 text-slate-700">
                          <MapPin size={15} className="text-slate-400" />
                          {transfer.toStore}
                        </div>
                      </td>

                      <td className="px-4 py-3 text-slate-600">{transfer.date}</td>

                      <td className="px-4 py-3">
                        <span className="rounded-md bg-slate-100 px-2 py-1 text-xs font-semibold text-slate-700">
                          {transfer.items.length} items
                        </span>
                      </td>

                      <td className="px-4 py-3">
                        <p className="font-semibold text-slate-800">
                          {receivedQuantity} / {totalQuantity}
                        </p>
                        <div className="mt-1 h-1.5 w-20 overflow-hidden rounded-full bg-slate-100">
                          <div
                            className="h-full rounded-full bg-emerald-500"
                            style={{
                              width: `${totalQuantity ? (receivedQuantity / totalQuantity) * 100 : 0}%`,
                            }}
                          />
                        </div>
                      </td>

                      <td className="px-4 py-3 text-slate-600">
                        {transfer.requestedBy}
                      </td>

                      <td className="px-4 py-3">
                        <StatusBadge status={transfer.status} />
                      </td>

                      <td className="px-4 py-3">
                        <div className="flex justify-end gap-1">
                          <button
                            title="View details"
                            onClick={() => openDetails(transfer)}
                            className="rounded-lg p-2 text-slate-500 hover:bg-blue-50 hover:text-blue-600"
                          >
                            <Eye size={16} />
                          </button>

                          {["Draft", "Pending Approval"].includes(transfer.status) && (
                            <button
                              title="Edit transfer"
                              onClick={() => openEdit(transfer)}
                              className="rounded-lg p-2 text-slate-500 hover:bg-amber-50 hover:text-amber-600"
                            >
                              <Pencil size={16} />
                            </button>
                          )}

                          {transfer.status === "Pending Approval" && (
                            <button
                              title="Approve transfer"
                              onClick={() => approveTransfer(transfer)}
                              className="rounded-lg p-2 text-emerald-600 hover:bg-emerald-50"
                            >
                              <Check size={16} />
                            </button>
                          )}

                          {transfer.status === "Approved" && (
                            <button
                              title="Dispatch transfer"
                              onClick={() => dispatchTransfer(transfer)}
                              className="rounded-lg p-2 text-blue-600 hover:bg-blue-50"
                            >
                              <Truck size={16} />
                            </button>
                          )}

                          {["In Transit", "Partially Received"].includes(transfer.status) && (
                            <button
                              title="Receive stock"
                              onClick={() => openReceive(transfer)}
                              className="rounded-lg p-2 text-emerald-600 hover:bg-emerald-50"
                            >
                              <Boxes size={16} />
                            </button>
                          )}

                          {["Draft", "Pending Approval"].includes(transfer.status) && (
                            <button
                              title="Delete transfer"
                              onClick={() => setDeleteTarget(transfer)}
                              className="rounded-lg p-2 text-slate-500 hover:bg-red-50 hover:text-red-600"
                            >
                              <Trash2 size={16} />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}

                {filteredTransfers.length === 0 && (
                  <tr>
                    <td colSpan="9" className="px-4 py-12 text-center">
                      <ArrowLeftRight size={35} className="mx-auto text-slate-300" />
                      <p className="mt-2 font-semibold text-slate-700">
                        No transfers found
                      </p>
                      <p className="mt-1 text-sm text-slate-400">
                        Change your filters or create a new transfer request.
                      </p>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Create / Edit Modal */}
        {modal === "form" && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 p-3">
            <div className="max-h-[94vh] w-full max-w-5xl overflow-y-auto rounded-2xl bg-white shadow-2xl">
              <div className="sticky top-0 z-20 flex items-center justify-between border-b border-slate-200 bg-white p-5">
                <div>
                  <h2 className="text-lg font-bold text-slate-900">
                    {selectedTransfer ? "Edit Stock Transfer" : "Create Stock Transfer"}
                  </h2>
                  <p className="mt-1 text-xs text-slate-500">
                    Select source and destination stores and add stock items.
                  </p>
                </div>
                <button
                  onClick={() => setModal("")}
                  className="rounded-lg p-2 text-slate-500 hover:bg-slate-100"
                >
                  <X size={20} />
                </button>
              </div>

              <form onSubmit={saveTransfer} className="space-y-5 p-5">
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
                  <Field label="Source Store" required>
                    <select
                      value={form.fromStore}
                      onChange={(e) => setForm({ ...form, fromStore: e.target.value })}
                      className={inputClass}
                    >
                      {stores.map((store) => (
                        <option key={store}>{store}</option>
                      ))}
                    </select>
                  </Field>

                  <Field label="Destination Store" required>
                    <select
                      required
                      value={form.toStore}
                      onChange={(e) => setForm({ ...form, toStore: e.target.value })}
                      className={inputClass}
                    >
                      <option value="">Select destination</option>
                      {stores
                        .filter((store) => store !== form.fromStore)
                        .map((store) => (
                          <option key={store}>{store}</option>
                        ))}
                    </select>
                  </Field>

                  <Field label="Requester Name" required>
                    <input
                      required
                      value={form.requestedBy}
                      onChange={(e) => setForm({ ...form, requestedBy: e.target.value })}
                      placeholder="Enter requester name"
                      className={inputClass}
                    />
                  </Field>

                  <Field label="Transfer Date" required>
                    <input
                      type="date"
                      required
                      value={form.date}
                      onChange={(e) => setForm({ ...form, date: e.target.value })}
                      className={inputClass}
                    />
                  </Field>

                  <Field label="Expected Arrival Date" required>
                    <input
                      type="date"
                      required
                      min={form.date}
                      value={form.expectedDate}
                      onChange={(e) => setForm({ ...form, expectedDate: e.target.value })}
                      className={inputClass}
                    />
                  </Field>

                  <Field label="Initial Status">
                    <select
                      value={form.status}
                      onChange={(e) => setForm({ ...form, status: e.target.value })}
                      className={inputClass}
                    >
                      <option>Draft</option>
                      <option>Pending Approval</option>
                    </select>
                  </Field>
                </div>

                <div className="rounded-xl border border-slate-200 p-4">
                  <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
                    <div>
                      <h3 className="font-semibold text-slate-900">Transfer Items</h3>
                      <p className="mt-1 text-xs text-slate-500">
                        Add the stock items and quantities to transfer.
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={addItemRow}
                      className="flex items-center gap-2 rounded-lg border border-blue-200 bg-blue-50 px-3 py-2 text-sm font-semibold text-blue-700 hover:bg-blue-100"
                    >
                      <Plus size={16} />
                      Add Item
                    </button>
                  </div>

                  <div className="space-y-3">
                    {form.items.map((item, index) => (
                      <div
                        key={index}
                        className="rounded-xl border border-slate-200 bg-slate-50 p-3"
                      >
                        <div className="mb-3 flex items-center justify-between">
                          <p className="text-sm font-semibold text-slate-700">
                            Item {index + 1}
                          </p>
                          <button
                            type="button"
                            disabled={form.items.length === 1}
                            onClick={() => removeItemRow(index)}
                            className="rounded-lg p-2 text-slate-400 hover:bg-red-50 hover:text-red-600 disabled:opacity-30"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>

                        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
                          <div className="sm:col-span-2 lg:col-span-2">
                            <Field label="Stock Item" required>
                              <select
                                required
                                value={item.itemId}
                                onChange={(e) => selectItem(index, e.target.value)}
                                className={inputClass}
                              >
                                <option value="">Select stock item</option>
                                {stockItems.map((stock) => (
                                  <option key={stock.id} value={stock.id}>
                                    {stock.name} ({stock.sku})
                                  </option>
                                ))}
                              </select>
                            </Field>
                          </div>

                          <Field label="Transfer Quantity" required>
                            <input
                              type="number"
                              min="1"
                              step="1"
                              required
                              value={item.quantity}
                              onChange={(e) => updateItem(index, "quantity", e.target.value)}
                              className={inputClass}
                            />
                          </Field>
                        </div>

                        <div className="mt-3 flex flex-wrap justify-between gap-2 border-t border-slate-200 pt-3 text-xs text-slate-500">
                          <span>SKU: {item.sku || "Not selected"}</span>
                          <span>Unit: {item.unit || "—"}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <Field label="Transfer Notes">
                  <textarea
                    rows={3}
                    value={form.notes}
                    onChange={(e) => setForm({ ...form, notes: e.target.value })}
                    placeholder="Reason for transfer or handling instructions..."
                    className={inputClass}
                  />
                </Field>

                <div className="flex flex-wrap justify-end gap-2 border-t border-slate-200 pt-4">
                  <button
                    type="button"
                    onClick={() => setModal("")}
                    className="rounded-lg border border-slate-300 px-4 py-2.5 text-sm font-semibold text-slate-700"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex items-center gap-2 rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-blue-700"
                  >
                    <Save size={16} />
                    {selectedTransfer ? "Save Changes" : "Create Transfer"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Details Modal */}
        {modal === "details" && selectedTransfer && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 p-3">
            <div className="max-h-[92vh] w-full max-w-4xl overflow-y-auto rounded-2xl bg-white shadow-2xl">
              <div className="flex items-center justify-between border-b border-slate-200 p-5">
                <div>
                  <h2 className="text-lg font-bold text-slate-900">
                    {selectedTransfer.id}
                  </h2>
                  <p className="mt-1 text-xs text-slate-500">
                    Stock transfer details and activity history
                  </p>
                </div>
                <button
                  onClick={() => setModal("")}
                  className="rounded-lg p-2 hover:bg-slate-100"
                >
                  <X size={20} />
                </button>
              </div>

              <div className="space-y-5 p-5">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <p className="text-xs text-slate-400">Current Status</p>
                    <div className="mt-2">
                      <StatusBadge status={selectedTransfer.status} />
                    </div>
                  </div>
                  <p className="text-xs text-slate-500">
                    Created on {selectedTransfer.date}
                  </p>
                </div>

                <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                  <div className="rounded-xl border border-slate-200 p-4">
                    <div className="flex items-center gap-2 text-xs font-semibold uppercase text-slate-400">
                      <Warehouse size={15} />
                      Source Store
                    </div>
                    <p className="mt-2 font-semibold text-slate-900">
                      {selectedTransfer.fromStore}
                    </p>
                  </div>

                  <div className="rounded-xl border border-slate-200 p-4">
                    <div className="flex items-center gap-2 text-xs font-semibold uppercase text-slate-400">
                      <MapPin size={15} />
                      Destination Store
                    </div>
                    <p className="mt-2 font-semibold text-slate-900">
                      {selectedTransfer.toStore}
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
                  {[
                    ["Requester", selectedTransfer.requestedBy],
                    ["Approver", selectedTransfer.approvedBy || "Not approved"],
                    ["Transfer Date", selectedTransfer.date],
                    ["Expected Arrival", selectedTransfer.expectedDate],
                  ].map(([label, value]) => (
                    <div key={label} className="rounded-lg bg-slate-50 p-3">
                      <p className="text-xs text-slate-400">{label}</p>
                      <p className="mt-1 text-sm font-semibold text-slate-800">{value}</p>
                    </div>
                  ))}
                </div>

                <div>
                  <h3 className="mb-3 font-semibold text-slate-800">
                    Transfer Items
                  </h3>
                  <div className="overflow-x-auto rounded-lg border border-slate-200">
                    <table className="w-full min-w-[600px] text-left text-sm">
                      <thead className="bg-slate-50 text-xs text-slate-500">
                        <tr>
                          <th className="px-3 py-3">Item</th>
                          <th className="px-3 py-3">SKU</th>
                          <th className="px-3 py-3">Transferred</th>
                          <th className="px-3 py-3">Received</th>
                          <th className="px-3 py-3">Remaining</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {selectedTransfer.items.map((item) => (
                          <tr key={item.itemId}>
                            <td className="px-3 py-3 font-semibold text-slate-800">
                              {item.name}
                            </td>
                            <td className="px-3 py-3 text-slate-500">{item.sku}</td>
                            <td className="px-3 py-3">
                              {item.quantity} {item.unit}
                            </td>
                            <td className="px-3 py-3 font-semibold text-emerald-700">
                              {item.received} {item.unit}
                            </td>
                            <td className="px-3 py-3 text-slate-600">
                              {item.quantity - item.received} {item.unit}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                {selectedTransfer.notes && (
                  <div>
                    <h3 className="text-sm font-semibold text-slate-800">Notes</h3>
                    <p className="mt-1 text-sm text-slate-600">
                      {selectedTransfer.notes}
                    </p>
                  </div>
                )}

                {/* History */}
                <div>
                  <div className="mb-3 flex items-center gap-2">
                    <History size={18} className="text-slate-500" />
                    <h3 className="font-semibold text-slate-800">
                      Transfer Activity History
                    </h3>
                  </div>

                  <div className="space-y-3">
                    {(selectedTransfer.history || []).map((entry, index) => (
                      <div key={index} className="flex gap-3">
                        <div className="flex flex-col items-center">
                          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-50 text-blue-600">
                            <CheckCircle2 size={16} />
                          </div>
                          {index !== selectedTransfer.history.length - 1 && (
                            <div className="my-1 w-px flex-1 bg-slate-200" />
                          )}
                        </div>

                        <div className="flex-1 pb-3">
                          <div className="flex flex-wrap items-center justify-between gap-2">
                            <p className="text-sm font-semibold text-slate-800">
                              {entry.action}
                            </p>
                            <p className="text-xs text-slate-400">{entry.date}</p>
                          </div>
                          <p className="mt-1 text-xs text-slate-500">
                            By {entry.by}
                          </p>
                          {entry.note && (
                            <p className="mt-1 text-sm text-slate-600">
                              {entry.note}
                            </p>
                          )}
                        </div>
                      </div>
                    ))}

                    {(!selectedTransfer.history || selectedTransfer.history.length === 0) && (
                      <p className="text-sm text-slate-400">No activity recorded yet.</p>
                    )}
                  </div>
                </div>

                <div className="flex flex-wrap justify-end gap-2 border-t border-slate-200 pt-4">
                  {selectedTransfer.status === "Pending Approval" && (
                    <>
                      <button
                        onClick={() => {
                          rejectTransfer(selectedTransfer);
                          setModal("");
                        }}
                        className="rounded-lg border border-red-200 px-4 py-2 text-sm font-semibold text-red-600 hover:bg-red-50"
                      >
                        Reject
                      </button>
                      <button
                        onClick={() => {
                          approveTransfer(selectedTransfer);
                          setModal("");
                        }}
                        className="flex items-center gap-2 rounded-lg bg-emerald-600 px-4 py-2 text-sm font-semibold text-white"
                      >
                        <Check size={16} />
                        Approve
                      </button>
                    </>
                  )}

                  {selectedTransfer.status === "Approved" && (
                    <button
                      onClick={() => {
                        dispatchTransfer(selectedTransfer);
                        setModal("");
                      }}
                      className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white"
                    >
                      <Truck size={16} />
                      Dispatch Stock
                    </button>
                  )}

                  {["In Transit", "Partially Received"].includes(selectedTransfer.status) && (
                    <button
                      onClick={() => openReceive(selectedTransfer)}
                      className="flex items-center gap-2 rounded-lg bg-emerald-600 px-4 py-2 text-sm font-semibold text-white"
                    >
                      <Boxes size={16} />
                      Receive Stock
                    </button>
                  )}

                  {["Draft", "Pending Approval"].includes(selectedTransfer.status) && (
                    <button
                      onClick={() => openEdit(selectedTransfer)}
                      className="flex items-center gap-2 rounded-lg border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700"
                    >
                      <Pencil size={16} />
                      Edit
                    </button>
                  )}

                  <button
                    onClick={() => setModal("")}
                    className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700"
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Receive Stock Modal */}
        {modal === "receive" && selectedTransfer && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 p-3">
            <div className="max-h-[92vh] w-full max-w-3xl overflow-y-auto rounded-2xl bg-white shadow-2xl">
              <div className="flex items-center justify-between border-b border-slate-200 p-5">
                <div>
                  <h2 className="text-lg font-bold text-slate-900">
                    Confirm Stock Received
                  </h2>
                  <p className="mt-1 text-xs text-slate-500">
                    {selectedTransfer.id} · {selectedTransfer.toStore}
                  </p>
                </div>
                <button
                  onClick={() => setModal("")}
                  className="rounded-lg p-2 hover:bg-slate-100"
                >
                  <X size={20} />
                </button>
              </div>

              <form onSubmit={saveReceivedItems} className="space-y-4 p-5">
                <div className="rounded-lg border border-blue-100 bg-blue-50 p-3 text-sm text-blue-800">
                  Enter the actual quantity received at the destination store.
                  You can confirm partial deliveries.
                </div>

                <div className="space-y-3">
                  {receiveItems.map((item, index) => {
                    const remaining = item.quantity - item.received;

                    return (
                      <div
                        key={item.itemId}
                        className="rounded-xl border border-slate-200 p-3"
                      >
                        <div className="flex flex-wrap items-start justify-between gap-2">
                          <div>
                            <p className="font-semibold text-slate-800">{item.name}</p>
                            <p className="mt-1 text-xs text-slate-400">{item.sku}</p>
                          </div>
                          <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs text-slate-600">
                            Remaining: {remaining} {item.unit}
                          </span>
                        </div>

                        <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-3">
                          <div>
                            <p className="text-xs text-slate-500">Transferred</p>
                            <p className="mt-1 font-semibold text-slate-800">
                              {item.quantity} {item.unit}
                            </p>
                          </div>

                          <div>
                            <p className="text-xs text-slate-500">Previously Received</p>
                            <p className="mt-1 font-semibold text-emerald-700">
                              {item.received} {item.unit}
                            </p>
                          </div>

                          <Field label="Received Now">
                            <input
                              type="number"
                              min="0"
                              max={remaining}
                              step="1"
                              disabled={remaining === 0}
                              value={item.receivedNow}
                              onChange={(e) =>
                                setReceiveItems((previous) =>
                                  previous.map((entry, i) =>
                                    i === index
                                      ? { ...entry, receivedNow: e.target.value }
                                      : entry
                                  )
                                )
                              }
                              className={inputClass}
                            />
                          </Field>
                        </div>
                      </div>
                    );
                  })}
                </div>

                <Field label="Receiving Notes">
                  <textarea
                    rows={3}
                    value={receiveNote}
                    onChange={(e) => setReceiveNote(e.target.value)}
                    placeholder="Enter receiving remarks, shortages or damaged items..."
                    className={inputClass}
                  />
                </Field>

                <div className="flex flex-wrap justify-end gap-2 border-t border-slate-200 pt-4">
                  <button
                    type="button"
                    onClick={() => setModal("")}
                    className="rounded-lg border border-slate-300 px-4 py-2.5 text-sm font-semibold text-slate-700"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex items-center gap-2 rounded-lg bg-emerald-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-emerald-700"
                  >
                    <CheckCircle2 size={16} />
                    Confirm Received Stock
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Delete Confirmation */}
        {deleteTarget && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center bg-slate-950/50 p-3">
            <div className="w-full max-w-md rounded-2xl bg-white p-5 shadow-2xl">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-red-50 text-red-600">
                <Trash2 size={22} />
              </div>

              <h2 className="mt-4 text-lg font-bold text-slate-900">
                Delete Transfer?
              </h2>

              <p className="mt-2 text-sm text-slate-500">
                Are you sure you want to delete{" "}
                <strong>{deleteTarget.id}</strong>? This action cannot be undone.
              </p>

              <div className="mt-5 flex justify-end gap-2">
                <button
                  onClick={() => setDeleteTarget(null)}
                  className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700"
                >
                  Cancel
                </button>
                <button
                  onClick={deleteTransfer}
                  className="rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white hover:bg-red-700"
                >
                  Delete Transfer
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
