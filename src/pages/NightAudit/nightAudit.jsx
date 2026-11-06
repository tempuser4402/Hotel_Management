
import { useMemo, useState } from "react";
import {
  CalendarDays,
  ClipboardCheck,
  Clock,
  DoorOpen,
  LogOut,
  BedDouble,
  IndianRupee,
  Utensils,
  CreditCard,
  Wallet,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  Lock,
  History,
  FileText,
  Plus,
  Trash2,
  Eye,
  ShieldCheck,
  RefreshCw,
} from "lucide-react";

import reservationsData from "../Reservations/reservationData";

const currency = (value) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 2,
  }).format(Number(value) || 0);

const todayDate = () => {
  const date = new Date();
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(
    2,
    "0"
  )}-${String(date.getDate()).padStart(2, "0")}`;
};

const formatDate = (date) => {
  if (!date) return "-";

  return new Date(`${date}T00:00:00`).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

const getReservationId = (reservation) =>
  reservation.reservationId || reservation.id;

const getRoomNumber = (reservation) =>
  reservation.room?.roomNumber || reservation.room?.roomId || "-";

const getGuestName = (reservation) =>
  reservation.guest?.name || "Unknown Guest";

const getAmount = (value) => Math.max(Number(value) || 0, 0);

const initialReconciliation = {
  restaurantExpected: "",
  restaurantActual: "",
  paymentExpected: "",
  paymentActual: "",
  openingCash: "",
  cashPayments: "",
  cashRefunds: "",
  actualCash: "",
  notes: "",
};

const tabs = [
  { id: "overview", label: "Overview", icon: ClipboardCheck },
  { id: "room-charges", label: "Room Charges", icon: BedDouble },
  { id: "reconciliation", label: "Reconciliation", icon: Wallet },
  { id: "transactions", label: "Pending Transactions", icon: Clock },
  { id: "history", label: "Audit History", icon: History },
];

export default function NightAudit({ userRole = "manager", currentUser = "Manager" }) {
  const [businessDate, setBusinessDate] = useState(todayDate());
  const [activeTab, setActiveTab] = useState("overview");

  const [reservations] = useState(() =>
    reservationsData.map((item) => ({
      ...item,
      guest: { ...item.guest },
      room: { ...item.room },
      pricing: { ...item.pricing },
      payment: { ...item.payment },
    }))
  );

  const [postedRoomCharges, setPostedRoomCharges] = useState({});
  const [reconciliation, setReconciliation] = useState(
    initialReconciliation
  );

  const [pendingTransactions, setPendingTransactions] = useState([]);
  const [transactionTitle, setTransactionTitle] = useState("");
  const [transactionAmount, setTransactionAmount] = useState("");
  const [transactionType, setTransactionType] = useState("payment");

  const [auditHistory, setAuditHistory] = useState([]);
  const [showClosingConfirmation, setShowClosingConfirmation] =
    useState(false);
  const [closingAcknowledged, setClosingAcknowledged] = useState(false);
  const [closingNotes, setClosingNotes] = useState("");

  const [showPostingConfirmation, setShowPostingConfirmation] =
    useState(false);

  // Only admin can officially close the business day.
  const canCloseAudit = String(userRole).toLowerCase() === "admin";

  const isDateClosed = auditHistory.some(
    (audit) => audit.businessDate === businessDate
  );

  const isRoomChargePosted = Boolean(postedRoomCharges[businessDate]);

  const arrivals = useMemo(
    () =>
      reservations.filter(
        (reservation) =>
          reservation.checkIn === businessDate &&
          !["cancelled", "checked-out"].includes(
            reservation.status?.toLowerCase()
          )
      ),
    [reservations, businessDate]
  );

  const departures = useMemo(
    () =>
      reservations.filter(
        (reservation) =>
          reservation.checkOut === businessDate &&
          reservation.status?.toLowerCase() === "checked-in"
      ),
    [reservations, businessDate]
  );

  const pendingCheckIns = arrivals.filter(
    (reservation) =>
      !["checked-in", "checked-out", "cancelled"].includes(
        reservation.status?.toLowerCase()
      )
  );

  const pendingCheckOuts = departures.filter(
    (reservation) => reservation.status?.toLowerCase() !== "checked-out"
  );

  // Guests staying during the selected business date.
  const inHouseReservations = useMemo(
    () =>
      reservations.filter(
        (reservation) =>
          reservation.status?.toLowerCase() === "checked-in" &&
          reservation.checkIn <= businessDate &&
          reservation.checkOut > businessDate
      ),
    [reservations, businessDate]
  );

  const roomChargeRows = useMemo(
    () =>
      inHouseReservations.map((reservation) => {
        const nights = Math.max(Number(reservation.nights) || 1, 1);
        const totalRoomCharges = getAmount(
          reservation.pricing?.roomCharges
        );

        return {
          id: getReservationId(reservation),
          guest: getGuestName(reservation),
          room: getRoomNumber(reservation),
          amount: totalRoomCharges / nights,
        };
      }),
    [inHouseReservations]
  );

  const totalRoomCharges = roomChargeRows.reduce(
    (total, row) => total + row.amount,
    0
  );

  const postedAmount = postedRoomCharges[businessDate]?.amount || 0;

  const restaurantDifference =
    getAmount(reconciliation.restaurantActual) -
    getAmount(reconciliation.restaurantExpected);

  const paymentDifference =
    getAmount(reconciliation.paymentActual) -
    getAmount(reconciliation.paymentExpected);

  const expectedCash =
    getAmount(reconciliation.openingCash) +
    getAmount(reconciliation.cashPayments) -
    getAmount(reconciliation.cashRefunds);

  const cashDifference =
    getAmount(reconciliation.actualCash) - expectedCash;

  const pendingTransactionTotal = pendingTransactions
    .filter((transaction) => transaction.status === "pending")
    .reduce((total, transaction) => total + transaction.amount, 0);

  const reconciliationComplete =
    reconciliation.restaurantExpected !== "" &&
    reconciliation.restaurantActual !== "" &&
    reconciliation.paymentExpected !== "" &&
    reconciliation.paymentActual !== "" &&
    reconciliation.openingCash !== "" &&
    reconciliation.cashPayments !== "" &&
    reconciliation.cashRefunds !== "" &&
    reconciliation.actualCash !== "";

  const reconciliationBalanced =
    reconciliationComplete &&
    Math.abs(restaurantDifference) < 0.01 &&
    Math.abs(paymentDifference) < 0.01 &&
    Math.abs(cashDifference) < 0.01;

  const hasPendingTransactions = pendingTransactions.some(
    (transaction) => transaction.status === "pending"
  );

  const auditChecks = [
    {
      label: "Room charges posted",
      complete: isRoomChargePosted,
      detail: isRoomChargePosted
        ? `${currency(postedAmount)} posted`
        : "Room charges require posting",
    },
    {
      label: "Restaurant reconciliation",
      complete:
        reconciliation.restaurantExpected !== "" &&
        reconciliation.restaurantActual !== "" &&
        Math.abs(restaurantDifference) < 0.01,
      detail:
        reconciliation.restaurantExpected === "" ||
        reconciliation.restaurantActual === ""
          ? "Not reconciled"
          : Math.abs(restaurantDifference) < 0.01
          ? "Balanced"
          : `Difference: ${currency(restaurantDifference)}`,
    },
    {
      label: "Payment reconciliation",
      complete:
        reconciliation.paymentExpected !== "" &&
        reconciliation.paymentActual !== "" &&
        Math.abs(paymentDifference) < 0.01,
      detail:
        reconciliation.paymentExpected === "" ||
        reconciliation.paymentActual === ""
          ? "Not reconciled"
          : Math.abs(paymentDifference) < 0.01
          ? "Balanced"
          : `Difference: ${currency(paymentDifference)}`,
    },
    {
      label: "Cash reconciliation",
      complete:
        reconciliation.openingCash !== "" &&
        reconciliation.cashPayments !== "" &&
        reconciliation.cashRefunds !== "" &&
        reconciliation.actualCash !== "" &&
        Math.abs(cashDifference) < 0.01,
      detail:
        !reconciliationComplete
          ? "Not reconciled"
          : Math.abs(cashDifference) < 0.01
          ? "Balanced"
          : `Difference: ${currency(cashDifference)}`,
    },
    {
      label: "Pending transactions",
      complete: !hasPendingTransactions,
      detail: hasPendingTransactions
        ? `${pendingTransactions.filter((t) => t.status === "pending").length} pending`
        : "No pending transactions",
    },
    {
      label: "Check-in / check-out review",
      complete: pendingCheckIns.length === 0 && pendingCheckOuts.length === 0,
      detail: `${pendingCheckIns.length} pending check-ins, ${pendingCheckOuts.length} pending check-outs`,
    },
  ];

  const completedChecks = auditChecks.filter(
    (check) => check.complete
  ).length;

  const canClose =
    canCloseAudit &&
    !isDateClosed &&
    isRoomChargePosted &&
    reconciliationBalanced &&
    !hasPendingTransactions &&
    pendingCheckIns.length === 0 &&
    pendingCheckOuts.length === 0;

  const updateReconciliation = (field, value) => {
    setReconciliation((previous) => ({
      ...previous,
      [field]: value,
    }));
  };

  const postRoomCharges = () => {
    if (isDateClosed || isRoomChargePosted) return;

    setPostedRoomCharges((previous) => ({
      ...previous,
      [businessDate]: {
        amount: totalRoomCharges,
        count: roomChargeRows.length,
        postedAt: new Date().toISOString(),
        postedBy: currentUser,
      },
    }));

    setShowPostingConfirmation(false);
  };

  const addPendingTransaction = () => {
    if (!transactionTitle.trim() || !transactionAmount) return;

    const amount = Number(transactionAmount);

    if (!Number.isFinite(amount) || amount <= 0) {
      alert("Enter a valid transaction amount.");
      return;
    }

    setPendingTransactions((previous) => [
      ...previous,
      {
        id: `TXN-${Date.now()}`,
        title: transactionTitle.trim(),
        amount,
        type: transactionType,
        status: "pending",
        createdAt: new Date().toISOString(),
      },
    ]);

    setTransactionTitle("");
    setTransactionAmount("");
  };

  const updateTransactionStatus = (id, status) => {
    if (isDateClosed) return;

    setPendingTransactions((previous) =>
      previous.map((transaction) =>
        transaction.id === id
          ? { ...transaction, status }
          : transaction
      )
    );
  };

  const removeTransaction = (id) => {
    if (isDateClosed) return;

    if (!window.confirm("Remove this pending transaction?")) return;

    setPendingTransactions((previous) =>
      previous.filter((transaction) => transaction.id !== id)
    );
  };

  const closeBusinessDay = () => {
    if (!canClose) return;

    if (!closingAcknowledged) {
      alert("Please confirm that you reviewed the audit details.");
      return;
    }

    const auditRecord = {
      id: `AUD-${Date.now()}`,
      businessDate,
      closedAt: new Date().toISOString(),
      closedBy: currentUser,
      role: userRole,
      roomCharges: postedAmount,
      restaurantSales: getAmount(reconciliation.restaurantActual),
      payments: getAmount(reconciliation.paymentActual),
      expectedCash,
      actualCash: getAmount(reconciliation.actualCash),
      pendingTransactions: pendingTransactions.length,
      notes: closingNotes,
    };

    setAuditHistory((previous) => [auditRecord, ...previous]);
    setShowClosingConfirmation(false);
    setClosingAcknowledged(false);
    setClosingNotes("");
  };

  const statCards = [
    {
      label: "Today's Arrivals",
      value: arrivals.length,
      icon: DoorOpen,
      color: "text-blue-600",
      bg: "bg-blue-50",
    },
    {
      label: "Today's Departures",
      value: departures.length,
      icon: LogOut,
      color: "text-purple-600",
      bg: "bg-purple-50",
    },
    {
      label: "Pending Check-ins",
      value: pendingCheckIns.length,
      icon: Clock,
      color: "text-amber-600",
      bg: "bg-amber-50",
    },
    {
      label: "Pending Check-outs",
      value: pendingCheckOuts.length,
      icon: AlertTriangle,
      color: "text-red-600",
      bg: "bg-red-50",
    },
  ];

  const InputField = ({
    label,
    value,
    onChange,
    placeholder = "0.00",
    type = "number",
  }) => (
    <div>
      <label className="mb-1.5 block text-sm font-medium text-slate-700">
        {label}
      </label>
      <input
        type={type}
        min={type === "number" ? "0" : undefined}
        step={type === "number" ? "0.01" : undefined}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        disabled={isDateClosed}
        className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 disabled:bg-slate-100"
      />
    </div>
  );

  const StatusBadge = ({ complete, children }) => (
    <span
      className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-medium ${
        complete
          ? "bg-emerald-50 text-emerald-700"
          : "bg-amber-50 text-amber-700"
      }`}
    >
      {complete ? (
        <CheckCircle2 size={13} />
      ) : (
        <Clock size={13} />
      )}
      {children}
    </span>
  );

  return (
    <div className="min-h-screen space-y-6 bg-slate-50 p-4 md:p-6">
      {/* Header */}
      <div className="flex flex-col justify-between gap-4 lg:flex-row lg:items-center">
        <div>
          <div className="mb-1 flex items-center gap-2 text-sm text-slate-500">
            <span>Operations</span>
            <span>/</span>
            <span className="text-slate-700">Night Audit</span>
          </div>

          <h1 className="text-2xl font-bold text-slate-900">
            Night Audit
          </h1>

          <p className="mt-1 text-sm text-slate-500">
            Review daily operations, reconcile finances and close the
            business day.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2">
            <CalendarDays size={17} className="text-slate-500" />
            <input
              type="date"
              value={businessDate}
              onChange={(event) => setBusinessDate(event.target.value)}
              className="bg-transparent text-sm font-medium text-slate-700 outline-none"
            />
          </div>

          <span
            className={`rounded-lg px-3 py-2 text-sm font-medium ${
              isDateClosed
                ? "bg-emerald-100 text-emerald-700"
                : "bg-amber-100 text-amber-700"
            }`}
          >
            {isDateClosed ? "Day Closed" : "Day Open"}
          </span>
        </div>
      </div>

      {/* Permission notice */}
      <div className="flex items-start gap-3 rounded-xl border border-indigo-100 bg-indigo-50 p-4">
        <ShieldCheck className="mt-0.5 shrink-0 text-indigo-600" size={20} />
        <div>
          <p className="text-sm font-semibold text-indigo-900">
            Night Audit Access Control
          </p>
          <p className="mt-1 text-sm text-indigo-700">
            Signed in as {currentUser} ({userRole}).{" "}
            {canCloseAudit
              ? "You have permission to close the business day."
              : "You can prepare and review the audit. Admin permission is required for final day closing."}
          </p>
        </div>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {statCards.map((stat) => {
          const Icon = stat.icon;

          return (
            <div
              key={stat.label}
              className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-500">{stat.label}</p>
                  <h2 className="mt-2 text-2xl font-bold text-slate-900">
                    {stat.value}
                  </h2>
                </div>

                <div className={`rounded-xl p-3 ${stat.bg}`}>
                  <Icon size={22} className={stat.color} />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Tabs */}
      <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white">
        <div className="flex min-w-max gap-1 border-b border-slate-200 p-2">
          {tabs.map((tab) => {
            const Icon = tab.icon;

            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 rounded-lg px-4 py-2.5 text-sm font-medium transition ${
                  activeTab === tab.id
                    ? "bg-indigo-600 text-white"
                    : "text-slate-600 hover:bg-slate-100"
                }`}
              >
                <Icon size={16} />
                {tab.label}
              </button>
            );
          })}
        </div>

        <div className="p-4 md:p-6">
          {/* OVERVIEW */}
          {activeTab === "overview" && (
            <div className="space-y-6">
              <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
                <div>
                  <h2 className="text-lg font-semibold text-slate-900">
                    Daily Operations Summary
                  </h2>
                  <p className="text-sm text-slate-500">
                    Business date: {formatDate(businessDate)}
                  </p>
                </div>

                <button
                  onClick={() => setActiveTab("reconciliation")}
                  className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
                >
                  Open Reconciliation
                </button>
              </div>

              {/* Arrivals */}
              <div>
                <h3 className="mb-3 flex items-center gap-2 font-semibold text-slate-800">
                  <DoorOpen size={18} className="text-blue-600" />
                  Today's Arrivals
                </h3>

                <div className="overflow-x-auto rounded-xl border border-slate-200">
                  <table className="w-full min-w-162.5 text-left text-sm">
                    <thead className="bg-slate-50 text-slate-500">
                      <tr>
                        <th className="px-4 py-3">Booking ID</th>
                        <th className="px-4 py-3">Guest</th>
                        <th className="px-4 py-3">Room</th>
                        <th className="px-4 py-3">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {arrivals.length ? (
                        arrivals.map((reservation) => (
                          <tr key={getReservationId(reservation)}>
                            <td className="px-4 py-3 font-medium text-slate-700">
                              {getReservationId(reservation)}
                            </td>
                            <td className="px-4 py-3">
                              {getGuestName(reservation)}
                            </td>
                            <td className="px-4 py-3">
                              {getRoomNumber(reservation)}
                            </td>
                            <td className="px-4 py-3">
                              <StatusBadge
                                complete={
                                  reservation.status === "checked-in"
                                }
                              >
                                {reservation.status}
                              </StatusBadge>
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td
                            colSpan="4"
                            className="px-4 py-8 text-center text-slate-400"
                          >
                            No arrivals for this business date.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Departures */}
              <div>
                <h3 className="mb-3 flex items-center gap-2 font-semibold text-slate-800">
                  <LogOut size={18} className="text-purple-600" />
                  Today's Departures
                </h3>

                <div className="overflow-x-auto rounded-xl border border-slate-200">
                  <table className="w-full min-w-162.5 text-left text-sm">
                    <thead className="bg-slate-50 text-slate-500">
                      <tr>
                        <th className="px-4 py-3">Booking ID</th>
                        <th className="px-4 py-3">Guest</th>
                        <th className="px-4 py-3">Room</th>
                        <th className="px-4 py-3">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {departures.length ? (
                        departures.map((reservation) => (
                          <tr key={getReservationId(reservation)}>
                            <td className="px-4 py-3 font-medium text-slate-700">
                              {getReservationId(reservation)}
                            </td>
                            <td className="px-4 py-3">
                              {getGuestName(reservation)}
                            </td>
                            <td className="px-4 py-3">
                              {getRoomNumber(reservation)}
                            </td>
                            <td className="px-4 py-3">
                              <StatusBadge
                                complete={
                                  reservation.status === "checked-out"
                                }
                              >
                                {reservation.status}
                              </StatusBadge>
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td
                            colSpan="4"
                            className="px-4 py-8 text-center text-slate-400"
                          >
                            No departures for this business date.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Pending check-ins / check-outs */}
              <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
                <div className="rounded-xl border border-amber-200 bg-amber-50/50 p-4">
                  <h3 className="font-semibold text-slate-800">
                    Pending Check-ins
                  </h3>
                  <p className="mt-1 text-2xl font-bold text-amber-700">
                    {pendingCheckIns.length}
                  </p>

                  {pendingCheckIns.length ? (
                    <ul className="mt-3 space-y-2">
                      {pendingCheckIns.map((reservation) => (
                        <li
                          key={getReservationId(reservation)}
                          className="flex justify-between gap-2 text-sm text-slate-600"
                        >
                          <span>{getGuestName(reservation)}</span>
                          <span>Room {getRoomNumber(reservation)}</span>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="mt-2 text-sm text-slate-500">
                      All scheduled arrivals have been reviewed.
                    </p>
                  )}
                </div>

                <div className="rounded-xl border border-red-200 bg-red-50/50 p-4">
                  <h3 className="font-semibold text-slate-800">
                    Pending Check-outs
                  </h3>
                  <p className="mt-1 text-2xl font-bold text-red-700">
                    {pendingCheckOuts.length}
                  </p>

                  {pendingCheckOuts.length ? (
                    <ul className="mt-3 space-y-2">
                      {pendingCheckOuts.map((reservation) => (
                        <li
                          key={getReservationId(reservation)}
                          className="flex justify-between gap-2 text-sm text-slate-600"
                        >
                          <span>{getGuestName(reservation)}</span>
                          <span>Room {getRoomNumber(reservation)}</span>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="mt-2 text-sm text-slate-500">
                      All scheduled departures have been reviewed.
                    </p>
                  )}
                </div>
              </div>

              {/* Audit checklist */}
              <div className="rounded-xl border border-slate-200 p-4">
                <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <h3 className="font-semibold text-slate-900">
                      Audit Checklist
                    </h3>
                    <p className="text-sm text-slate-500">
                      Complete all checks before closing the business day.
                    </p>
                  </div>

                  <span className="rounded-lg bg-slate-100 px-3 py-1.5 text-sm font-semibold text-slate-700">
                    {completedChecks}/{auditChecks.length} completed
                  </span>
                </div>

                <div className="mb-4 h-2 overflow-hidden rounded-full bg-slate-100">
                  <div
                    className="h-full rounded-full bg-indigo-600 transition-all"
                    style={{
                      width: `${
                        (completedChecks / auditChecks.length) * 100
                      }%`,
                    }}
                  />
                </div>

                <div className="space-y-3">
                  {auditChecks.map((check) => (
                    <div
                      key={check.label}
                      className="flex flex-col justify-between gap-2 border-b border-slate-100 pb-3 last:border-0 sm:flex-row sm:items-center"
                    >
                      <div className="flex items-center gap-2">
                        {check.complete ? (
                          <CheckCircle2
                            size={18}
                            className="text-emerald-600"
                          />
                        ) : (
                          <AlertTriangle
                            size={18}
                            className="text-amber-500"
                          />
                        )}
                        <span className="text-sm font-medium text-slate-700">
                          {check.label}
                        </span>
                      </div>

                      <span className="text-sm text-slate-500">
                        {check.detail}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ROOM CHARGES */}
          {activeTab === "room-charges" && (
            <div className="space-y-5">
              <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
                <div>
                  <h2 className="text-lg font-semibold text-slate-900">
                    Room Charges Posting
                  </h2>
                  <p className="text-sm text-slate-500">
                    Review room charges for guests staying during this
                    business date.
                  </p>
                </div>

                <button
                  disabled={
                    isDateClosed ||
                    isRoomChargePosted ||
                    roomChargeRows.length === 0
                  }
                  onClick={() => setShowPostingConfirmation(true)}
                  className="flex items-center justify-center gap-2 rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-indigo-700 disabled:cursor-not-allowed disabled:bg-slate-300"
                >
                  <IndianRupee size={16} />
                  {isRoomChargePosted ? "Charges Posted" : "Post Room Charges"}
                </button>
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                <div className="rounded-xl border border-slate-200 p-4">
                  <p className="text-sm text-slate-500">In-house Rooms</p>
                  <p className="mt-2 text-2xl font-bold text-slate-900">
                    {roomChargeRows.length}
                  </p>
                </div>

                <div className="rounded-xl border border-slate-200 p-4">
                  <p className="text-sm text-slate-500">Charges to Post</p>
                  <p className="mt-2 text-2xl font-bold text-slate-900">
                    {currency(totalRoomCharges)}
                  </p>
                </div>

                <div className="rounded-xl border border-slate-200 p-4">
                  <p className="text-sm text-slate-500">Posted Amount</p>
                  <p className="mt-2 text-2xl font-bold text-emerald-600">
                    {currency(postedAmount)}
                  </p>
                </div>
              </div>

              <div className="overflow-x-auto rounded-xl border border-slate-200">
                <table className="w-full min-w-150 text-left text-sm">
                  <thead className="bg-slate-50 text-slate-500">
                    <tr>
                      <th className="px-4 py-3">Booking ID</th>
                      <th className="px-4 py-3">Guest</th>
                      <th className="px-4 py-3">Room</th>
                      <th className="px-4 py-3 text-right">
                        Daily Room Charge
                      </th>
                    </tr>
                  </thead>

                  <tbody className="divide-y divide-slate-100">
                    {roomChargeRows.length ? (
                      roomChargeRows.map((row) => (
                        <tr key={row.id}>
                          <td className="px-4 py-3 font-medium text-slate-700">
                            {row.id}
                          </td>
                          <td className="px-4 py-3">{row.guest}</td>
                          <td className="px-4 py-3">{row.room}</td>
                          <td className="px-4 py-3 text-right font-medium">
                            {currency(row.amount)}
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td
                          colSpan="4"
                          className="px-4 py-10 text-center text-slate-400"
                        >
                          No in-house reservations found for this date.
                        </td>
                      </tr>
                    )}
                  </tbody>

                  <tfoot className="bg-slate-50">
                    <tr>
                      <td
                        colSpan="3"
                        className="px-4 py-3 font-semibold text-slate-700"
                      >
                        Total
                      </td>
                      <td className="px-4 py-3 text-right font-bold text-slate-900">
                        {currency(totalRoomCharges)}
                      </td>
                    </tr>
                  </tfoot>
                </table>
              </div>

              {isRoomChargePosted && (
                <div className="flex items-start gap-3 rounded-xl border border-emerald-200 bg-emerald-50 p-4">
                  <CheckCircle2
                    size={20}
                    className="mt-0.5 text-emerald-600"
                  />
                  <div>
                    <p className="font-semibold text-emerald-800">
                      Room charges posted for this session
                    </p>
                    <p className="mt-1 text-sm text-emerald-700">
                      {currency(postedAmount)} posted by{" "}
                      {postedRoomCharges[businessDate]?.postedBy}.
                    </p>
                  </div>
                </div>
              )}

              <p className="text-xs text-slate-500">
                This prototype records a posting in local page state. In
                production, the posting must create an auditable ledger
                transaction in the backend and prevent duplicate postings.
              </p>
            </div>
          )}

          {/* RECONCILIATION */}
          {activeTab === "reconciliation" && (
            <div className="space-y-6">
              <div>
                <h2 className="text-lg font-semibold text-slate-900">
                  Financial Reconciliation
                </h2>
                <p className="text-sm text-slate-500">
                  Enter the figures from your restaurant, payment and cash
                  records. Differences must be investigated.
                </p>
              </div>

              {/* Restaurant */}
              <div className="rounded-xl border border-slate-200 p-4">
                <div className="mb-4 flex items-center gap-2">
                  <Utensils size={19} className="text-orange-600" />
                  <h3 className="font-semibold text-slate-900">
                    Restaurant Charges Reconciliation
                  </h3>
                </div>

                <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                  <InputField
                    label="Restaurant System Total (₹)"
                    value={reconciliation.restaurantExpected}
                    onChange={(value) =>
                      updateReconciliation("restaurantExpected", value)
                    }
                  />

                  <InputField
                    label="Reconciled / Verified Total (₹)"
                    value={reconciliation.restaurantActual}
                    onChange={(value) =>
                      updateReconciliation("restaurantActual", value)
                    }
                  />

                  <div className="rounded-lg bg-slate-50 p-3">
                    <p className="text-sm text-slate-500">Difference</p>
                    <p
                      className={`mt-2 text-xl font-bold ${
                        restaurantDifference === 0
                          ? "text-emerald-600"
                          : "text-red-600"
                      }`}
                    >
                      {currency(restaurantDifference)}
                    </p>
                  </div>
                </div>
              </div>

              {/* Payments */}
              <div className="rounded-xl border border-slate-200 p-4">
                <div className="mb-4 flex items-center gap-2">
                  <CreditCard size={19} className="text-blue-600" />
                  <h3 className="font-semibold text-slate-900">
                    Payment Reconciliation
                  </h3>
                </div>

                <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                  <InputField
                    label="System Payment Total (₹)"
                    value={reconciliation.paymentExpected}
                    onChange={(value) =>
                      updateReconciliation("paymentExpected", value)
                    }
                  />

                  <InputField
                    label="Verified Payment Total (₹)"
                    value={reconciliation.paymentActual}
                    onChange={(value) =>
                      updateReconciliation("paymentActual", value)
                    }
                  />

                  <div className="rounded-lg bg-slate-50 p-3">
                    <p className="text-sm text-slate-500">Difference</p>
                    <p
                      className={`mt-2 text-xl font-bold ${
                        paymentDifference === 0
                          ? "text-emerald-600"
                          : "text-red-600"
                      }`}
                    >
                      {currency(paymentDifference)}
                    </p>
                  </div>
                </div>
              </div>

              {/* Cash */}
              <div className="rounded-xl border border-slate-200 p-4">
                <div className="mb-4 flex items-center gap-2">
                  <Wallet size={19} className="text-emerald-600" />
                  <h3 className="font-semibold text-slate-900">
                    Cash Reconciliation
                  </h3>
                </div>

                <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
                  <InputField
                    label="Opening Cash (₹)"
                    value={reconciliation.openingCash}
                    onChange={(value) =>
                      updateReconciliation("openingCash", value)
                    }
                  />

                  <InputField
                    label="Cash Payments Received (₹)"
                    value={reconciliation.cashPayments}
                    onChange={(value) =>
                      updateReconciliation("cashPayments", value)
                    }
                  />

                  <InputField
                    label="Cash Refunds / Payouts (₹)"
                    value={reconciliation.cashRefunds}
                    onChange={(value) =>
                      updateReconciliation("cashRefunds", value)
                    }
                  />

                  <InputField
                    label="Actual Cash Counted (₹)"
                    value={reconciliation.actualCash}
                    onChange={(value) =>
                      updateReconciliation("actualCash", value)
                    }
                  />
                </div>

                <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div className="rounded-lg bg-slate-50 p-4">
                    <p className="text-sm text-slate-500">
                      Expected Cash in Drawer
                    </p>
                    <p className="mt-2 text-xl font-bold text-slate-900">
                      {currency(expectedCash)}
                    </p>
                  </div>

                  <div className="rounded-lg bg-slate-50 p-4">
                    <p className="text-sm text-slate-500">
                      Cash Difference
                    </p>
                    <p
                      className={`mt-2 text-xl font-bold ${
                        cashDifference === 0
                          ? "text-emerald-600"
                          : "text-red-600"
                      }`}
                    >
                      {currency(cashDifference)}
                    </p>
                  </div>
                </div>
              </div>

              {/* Notes */}
              <div>
                <label className="mb-1.5 block text-sm font-medium text-slate-700">
                  Reconciliation Notes
                </label>
                <textarea
                  rows={3}
                  value={reconciliation.notes}
                  disabled={isDateClosed}
                  onChange={(event) =>
                    updateReconciliation("notes", event.target.value)
                  }
                  placeholder="Enter explanation for any difference or adjustment..."
                  className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 disabled:bg-slate-100"
                />
              </div>

              <div
                className={`flex items-start gap-3 rounded-xl border p-4 ${
                  reconciliationBalanced
                    ? "border-emerald-200 bg-emerald-50"
                    : "border-amber-200 bg-amber-50"
                }`}
              >
                {reconciliationBalanced ? (
                  <CheckCircle2
                    size={20}
                    className="text-emerald-600"
                  />
                ) : (
                  <AlertTriangle size={20} className="text-amber-600" />
                )}

                <div>
                  <p className="font-semibold text-slate-800">
                    {reconciliationBalanced
                      ? "Reconciliation balanced"
                      : "Reconciliation incomplete or differences found"}
                  </p>
                  <p className="mt-1 text-sm text-slate-600">
                    {reconciliationBalanced
                      ? "All entered reconciliation figures match."
                      : "Complete all required figures and investigate differences before day closing."}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* PENDING TRANSACTIONS */}
          {activeTab === "transactions" && (
            <div className="space-y-5">
              <div>
                <h2 className="text-lg font-semibold text-slate-900">
                  Pending Transactions
                </h2>
                <p className="text-sm text-slate-500">
                  Track unresolved payments, refunds and financial entries
                  before closing.
                </p>
              </div>

              <div className="grid grid-cols-1 gap-4 rounded-xl border border-slate-200 bg-slate-50 p-4 md:grid-cols-3">
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-slate-700">
                    Transaction Description
                  </label>
                  <input
                    value={transactionTitle}
                    onChange={(event) =>
                      setTransactionTitle(event.target.value)
                    }
                    disabled={isDateClosed}
                    placeholder="e.g. Guest UPI payment pending"
                    className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-indigo-500 disabled:bg-slate-100"
                  />
                </div>

                <div>
                  <label className="mb-1.5 block text-sm font-medium text-slate-700">
                    Amount (₹)
                  </label>
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    value={transactionAmount}
                    onChange={(event) =>
                      setTransactionAmount(event.target.value)
                    }
                    disabled={isDateClosed}
                    placeholder="Enter amount"
                    className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-indigo-500 disabled:bg-slate-100"
                  />
                </div>

                <div>
                  <label className="mb-1.5 block text-sm font-medium text-slate-700">
                    Transaction Type
                  </label>
                  <select
                    value={transactionType}
                    onChange={(event) =>
                      setTransactionType(event.target.value)
                    }
                    disabled={isDateClosed}
                    className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-indigo-500 disabled:bg-slate-100"
                  >
                    <option value="payment">Payment</option>
                    <option value="refund">Refund</option>
                    <option value="expense">Expense</option>
                    <option value="adjustment">Adjustment</option>
                  </select>
                </div>

                <button
                  onClick={addPendingTransaction}
                  disabled={isDateClosed}
                  className="flex items-center justify-center gap-2 rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-indigo-700 disabled:bg-slate-300 md:col-span-3"
                >
                  <Plus size={16} />
                  Add Pending Transaction
                </button>
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="rounded-xl border border-slate-200 p-4">
                  <p className="text-sm text-slate-500">
                    Pending Transactions
                  </p>
                  <p className="mt-2 text-2xl font-bold text-slate-900">
                    {
                      pendingTransactions.filter(
                        (item) => item.status === "pending"
                      ).length
                    }
                  </p>
                </div>

                <div className="rounded-xl border border-slate-200 p-4">
                  <p className="text-sm text-slate-500">
                    Pending Transaction Value
                  </p>
                  <p className="mt-2 text-2xl font-bold text-red-600">
                    {currency(pendingTransactionTotal)}
                  </p>
                </div>
              </div>

              <div className="overflow-x-auto rounded-xl border border-slate-200">
                <table className="w-full min-w-187.5 text-left text-sm">
                  <thead className="bg-slate-50 text-slate-500">
                    <tr>
                      <th className="px-4 py-3">Description</th>
                      <th className="px-4 py-3">Type</th>
                      <th className="px-4 py-3">Amount</th>
                      <th className="px-4 py-3">Status</th>
                      <th className="px-4 py-3">Actions</th>
                    </tr>
                  </thead>

                  <tbody className="divide-y divide-slate-100">
                    {pendingTransactions.length ? (
                      pendingTransactions.map((transaction) => (
                        <tr key={transaction.id}>
                          <td className="px-4 py-3 font-medium text-slate-700">
                            {transaction.title}
                          </td>
                          <td className="px-4 py-3 capitalize">
                            {transaction.type}
                          </td>
                          <td className="px-4 py-3">
                            {currency(transaction.amount)}
                          </td>
                          <td className="px-4 py-3">
                            <StatusBadge
                              complete={transaction.status === "resolved"}
                            >
                              {transaction.status}
                            </StatusBadge>
                          </td>
                          <td className="px-4 py-3">
                            <div className="flex items-center gap-2">
                              {transaction.status === "pending" && (
                                <button
                                  onClick={() =>
                                    updateTransactionStatus(
                                      transaction.id,
                                      "resolved"
                                    )
                                  }
                                  disabled={isDateClosed}
                                  className="rounded-lg bg-emerald-50 px-3 py-1.5 text-xs font-medium text-emerald-700 hover:bg-emerald-100 disabled:opacity-50"
                                >
                                  Resolve
                                </button>
                              )}

                              <button
                                onClick={() =>
                                  removeTransaction(transaction.id)
                                }
                                disabled={isDateClosed}
                                className="rounded-lg p-2 text-red-500 hover:bg-red-50 disabled:opacity-50"
                                title="Remove transaction"
                              >
                                <Trash2 size={15} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td
                          colSpan="5"
                          className="px-4 py-10 text-center text-slate-400"
                        >
                          No pending transactions added.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* AUDIT HISTORY */}
          {activeTab === "history" && (
            <div className="space-y-5">
              <div>
                <h2 className="text-lg font-semibold text-slate-900">
                  Audit History
                </h2>
                <p className="text-sm text-slate-500">
                  View previously closed business days.
                </p>
              </div>

              <div className="overflow-x-auto rounded-xl border border-slate-200">
                <table className="w-full min-w-212.5 text-left text-sm">
                  <thead className="bg-slate-50 text-slate-500">
                    <tr>
                      <th className="px-4 py-3">Business Date</th>
                      <th className="px-4 py-3">Closed By</th>
                      <th className="px-4 py-3">Room Charges</th>
                      <th className="px-4 py-3">Restaurant</th>
                      <th className="px-4 py-3">Payments</th>
                      <th className="px-4 py-3">Actual Cash</th>
                      <th className="px-4 py-3">Closed At</th>
                    </tr>
                  </thead>

                  <tbody className="divide-y divide-slate-100">
                    {auditHistory.length ? (
                      auditHistory.map((audit) => (
                        <tr key={audit.id}>
                          <td className="px-4 py-3 font-medium text-slate-700">
                            {formatDate(audit.businessDate)}
                          </td>
                          <td className="px-4 py-3">{audit.closedBy}</td>
                          <td className="px-4 py-3">
                            {currency(audit.roomCharges)}
                          </td>
                          <td className="px-4 py-3">
                            {currency(audit.restaurantSales)}
                          </td>
                          <td className="px-4 py-3">
                            {currency(audit.payments)}
                          </td>
                          <td className="px-4 py-3">
                            {currency(audit.actualCash)}
                          </td>
                          <td className="px-4 py-3 text-slate-500">
                            {new Date(audit.closedAt).toLocaleString("en-IN")}
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td
                          colSpan="7"
                          className="px-4 py-12 text-center text-slate-400"
                        >
                          <History
                            size={28}
                            className="mx-auto mb-2 text-slate-300"
                          />
                          No audit history available yet.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* FINAL AUDIT SUMMARY */}
      <div className="rounded-xl border border-slate-200 bg-white p-5">
        <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
          <div>
            <h2 className="text-lg font-semibold text-slate-900">
              Day Closing Summary
            </h2>
            <p className="mt-1 text-sm text-slate-500">
              Review the audit checklist before confirming the business day.
            </p>
          </div>

          <div className="text-left md:text-right">
            <p className="text-sm text-slate-500">Audit Completion</p>
            <p className="text-2xl font-bold text-slate-900">
              {completedChecks}/{auditChecks.length}
            </p>
          </div>
        </div>

        <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-lg bg-slate-50 p-3">
            <p className="text-xs text-slate-500">Room Charges</p>
            <p className="mt-1 font-semibold text-slate-900">
              {currency(postedAmount)}
            </p>
          </div>

          <div className="rounded-lg bg-slate-50 p-3">
            <p className="text-xs text-slate-500">Restaurant Sales</p>
            <p className="mt-1 font-semibold text-slate-900">
              {currency(reconciliation.restaurantActual)}
            </p>
          </div>

          <div className="rounded-lg bg-slate-50 p-3">
            <p className="text-xs text-slate-500">Payments Reconciled</p>
            <p className="mt-1 font-semibold text-slate-900">
              {currency(reconciliation.paymentActual)}
            </p>
          </div>

          <div className="rounded-lg bg-slate-50 p-3">
            <p className="text-xs text-slate-500">Cash Difference</p>
            <p
              className={`mt-1 font-semibold ${
                cashDifference === 0
                  ? "text-emerald-600"
                  : "text-red-600"
              }`}
            >
              {currency(cashDifference)}
            </p>
          </div>
        </div>

        {isDateClosed ? (
          <div className="mt-5 flex items-center gap-3 rounded-lg bg-emerald-50 p-4 text-emerald-800">
            <CheckCircle2 size={21} />
            <div>
              <p className="font-semibold">Business day successfully closed</p>
              <p className="text-sm">
                This date is locked in the current page session.
              </p>
            </div>
          </div>
        ) : (
          <div className="mt-5 flex flex-col justify-between gap-4 border-t border-slate-100 pt-5 md:flex-row md:items-center">
            <div className="flex items-start gap-2 text-sm text-slate-500">
              <Lock size={17} className="mt-0.5 shrink-0" />
              <p>
                {canCloseAudit
                  ? canClose
                    ? "All required checks are complete. You can close this business day."
                    : "Complete all audit checks before closing the business day."
                  : "Only an authorized admin can confirm the final day closing."}
              </p>
            </div>

            <button
              onClick={() => setShowClosingConfirmation(true)}
              disabled={!canClose}
              className="flex items-center justify-center gap-2 rounded-lg bg-indigo-600 px-5 py-3 text-sm font-semibold text-white hover:bg-indigo-700 disabled:cursor-not-allowed disabled:bg-slate-300"
            >
              <Lock size={16} />
              Confirm Day Closing
            </button>
          </div>
        )}
      </div>

      {/* ROOM CHARGE POSTING CONFIRMATION */}
      {showPostingConfirmation && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-indigo-50 text-indigo-600">
              <IndianRupee size={23} />
            </div>

            <h3 className="text-lg font-bold text-slate-900">
              Confirm Room Charge Posting
            </h3>

            <p className="mt-2 text-sm text-slate-500">
              You are about to post room charges for{" "}
              {roomChargeRows.length} in-house reservations.
            </p>

            <div className="my-5 rounded-lg bg-slate-50 p-4">
              <p className="text-sm text-slate-500">Total to post</p>
              <p className="mt-1 text-2xl font-bold text-slate-900">
                {currency(totalRoomCharges)}
              </p>
            </div>

            <p className="mb-5 text-xs text-amber-700">
              Verify the amounts before proceeding. Duplicate posting must
              be prevented by the backend in the production version.
            </p>

            <div className="flex gap-3">
              <button
                onClick={() => setShowPostingConfirmation(false)}
                className="flex-1 rounded-lg border border-slate-200 px-4 py-2.5 text-sm font-medium text-slate-700"
              >
                Cancel
              </button>

              <button
                onClick={postRoomCharges}
                className="flex-1 rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-indigo-700"
              >
                Confirm Posting
              </button>
            </div>
          </div>
        </div>
      )}

      {/* DAY CLOSING CONFIRMATION */}
      {showClosingConfirmation && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-2xl bg-white p-6 shadow-xl">
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-amber-50 text-amber-600">
              <Lock size={22} />
            </div>

            <h3 className="text-xl font-bold text-slate-900">
              Confirm Business Day Closing
            </h3>

            <p className="mt-2 text-sm text-slate-500">
              You are closing the business date{" "}
              <strong>{formatDate(businessDate)}</strong>. Review the
              following figures carefully.
            </p>

            <div className="my-5 space-y-3 rounded-xl bg-slate-50 p-4 text-sm">
              <div className="flex justify-between">
                <span className="text-slate-500">Room Charges</span>
                <strong>{currency(postedAmount)}</strong>
              </div>

              <div className="flex justify-between">
                <span className="text-slate-500">Restaurant Sales</span>
                <strong>
                  {currency(reconciliation.restaurantActual)}
                </strong>
              </div>

              <div className="flex justify-between">
                <span className="text-slate-500">Payments</span>
                <strong>{currency(reconciliation.paymentActual)}</strong>
              </div>

              <div className="flex justify-between">
                <span className="text-slate-500">Expected Cash</span>
                <strong>{currency(expectedCash)}</strong>
              </div>

              <div className="flex justify-between">
                <span className="text-slate-500">Actual Cash</span>
                <strong>{currency(reconciliation.actualCash)}</strong>
              </div>

              <div className="flex justify-between border-t border-slate-200 pt-3">
                <span className="text-slate-500">Cash Difference</span>
                <strong>{currency(cashDifference)}</strong>
              </div>
            </div>

            <div className="mb-4">
              <label className="mb-1.5 block text-sm font-medium text-slate-700">
                Closing Notes (Optional)
              </label>
              <textarea
                rows={3}
                value={closingNotes}
                onChange={(event) => setClosingNotes(event.target.value)}
                placeholder="Enter final audit notes..."
                className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-indigo-500"
              />
            </div>

            <label className="mb-5 flex items-start gap-2 text-sm text-slate-600">
              <input
                type="checkbox"
                checked={closingAcknowledged}
                onChange={(event) =>
                  setClosingAcknowledged(event.target.checked)
                }
                className="mt-1 accent-indigo-600"
              />
              I confirm that I have reviewed the audit figures and approve
              closing this business date.
            </label>

            <div className="flex gap-3">
              <button
                onClick={() => {
                  setShowClosingConfirmation(false);
                  setClosingAcknowledged(false);
                }}
                className="flex-1 rounded-lg border border-slate-200 px-4 py-2.5 text-sm font-medium text-slate-700"
              >
                Go Back
              </button>

              <button
                onClick={closeBusinessDay}
                disabled={!closingAcknowledged || !canClose}
                className="flex-1 rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-indigo-700 disabled:cursor-not-allowed disabled:bg-slate-300"
              >
                Confirm & Close Day
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
