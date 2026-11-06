
import { useMemo, useState } from "react";
import {
  TrendingUp,
  TrendingDown,
  IndianRupee,
  Wallet,
  CreditCard,
  Clock,
  Download,
  Printer,
  Filter,
  RefreshCw,
  CalendarDays,
  ArrowUpRight,
  ArrowDownRight,
  Receipt,
  Building2,
} from "lucide-react";

const dailyRevenue = [
  { date: "01 Nov", rooms: 18000, restaurant: 8500, services: 2500, events: 0 },
  { date: "02 Nov", rooms: 22000, restaurant: 9200, services: 3200, events: 5000 },
  { date: "03 Nov", rooms: 19500, restaurant: 7800, services: 1800, events: 0 },
  { date: "04 Nov", rooms: 26000, restaurant: 11000, services: 4200, events: 8000 },
  { date: "05 Nov", rooms: 24000, restaurant: 9800, services: 3000, events: 0 },
  { date: "06 Nov", rooms: 29000, restaurant: 12500, services: 4500, events: 12000 },
  { date: "07 Nov", rooms: 32000, restaurant: 14000, services: 5200, events: 10000 },
];

const monthlyRevenue = [
  { month: "May", rooms: 420000, restaurant: 125000, services: 45000, events: 60000 },
  { month: "Jun", rooms: 465000, restaurant: 142000, services: 51000, events: 75000 },
  { month: "Jul", rooms: 440000, restaurant: 138000, services: 48000, events: 55000 },
  { month: "Aug", rooms: 510000, restaurant: 155000, services: 62000, events: 90000 },
  { month: "Sep", rooms: 535000, restaurant: 168000, services: 68000, events: 105000 },
  { month: "Oct", rooms: 580000, restaurant: 175000, services: 72000, events: 115000 },
  { month: "Nov", rooms: 620000, restaurant: 190000, services: 85000, events: 135000 },
];

const departments = [
  { name: "Rooms", revenue: 620000, collected: 580000, pending: 40000, color: "bg-indigo-500" },
  { name: "Restaurant", revenue: 190000, collected: 172000, pending: 18000, color: "bg-emerald-500" },
  { name: "Events & Banquets", revenue: 135000, collected: 110000, pending: 25000, color: "bg-amber-500" },
  { name: "Guest Services", revenue: 85000, collected: 76000, pending: 9000, color: "bg-sky-500" },
];

const paymentRecords = [
  { id: "PAY-2001", guest: "Aarav Sharma", booking: "RES-1001", department: "Rooms", method: "UPI", amount: 10500, date: "2026-11-01", status: "Collected" },
  { id: "PAY-2002", guest: "Priya Verma", booking: "RES-1002", department: "Rooms", method: "Card", amount: 12000, date: "2026-11-02", status: "Collected" },
  { id: "PAY-2003", guest: "Rahul Mehta", booking: "RES-1003", department: "Restaurant", method: "Cash", amount: 4500, date: "2026-11-03", status: "Collected" },
  { id: "PAY-2004", guest: "Neha Singh", booking: "RES-1004", department: "Events & Banquets", method: "Bank Transfer", amount: 25000, date: "2026-11-04", status: "Pending" },
  { id: "PAY-2005", guest: "Karan Patel", booking: "RES-1005", department: "Rooms", method: "Card", amount: 7500, date: "2026-11-05", status: "Collected" },
  { id: "PAY-2006", guest: "Ananya Gupta", booking: "RES-1006", department: "Guest Services", method: "UPI", amount: 3200, date: "2026-11-06", status: "Collected" },
  { id: "PAY-2007", guest: "Vikram Rao", booking: "RES-1007", department: "Restaurant", method: "Cash", amount: 2800, date: "2026-11-07", status: "Pending" },
  { id: "PAY-2008", guest: "Isha Kapoor", booking: "RES-1008", department: "Rooms", method: "UPI", amount: 15000, date: "2026-11-08", status: "Collected" },
  { id: "PAY-2009", guest: "Rohan Das", booking: "RES-1009", department: "Events & Banquets", method: "Card", amount: 18000, date: "2026-11-09", status: "Pending" },
];

const money = (value) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(value);

const dateLabel = (value) =>
  new Date(`${value}T00:00:00`).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });

function MetricCard({ title, value, subtitle, icon: Icon, trend, positive }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-slate-500">{title}</p>
          <h3 className="mt-2 text-2xl font-bold text-slate-900">{value}</h3>
          <p className="mt-2 text-xs text-slate-500">{subtitle}</p>
        </div>
        <div className="rounded-xl bg-indigo-50 p-3 text-indigo-600">
          <Icon size={21} />
        </div>
      </div>
      {trend && (
        <div className={`mt-4 flex items-center gap-1 text-xs font-semibold ${positive ? "text-emerald-600" : "text-rose-600"}`}>
          {positive ? <ArrowUpRight size={15} /> : <ArrowDownRight size={15} />}
          {trend}
          <span className="font-normal text-slate-400">vs previous period</span>
        </div>
      )}
    </div>
  );
}

function StatusBadge({ status }) {
  return (
    <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${
      status === "Collected"
        ? "bg-emerald-50 text-emerald-700"
        : "bg-amber-50 text-amber-700"
    }`}>
      {status}
    </span>
  );
}

function RevenueBars({ rows, mode }) {
  const totals = rows.map((r) => r.rooms + r.restaurant + r.services + r.events);
  const max = Math.max(...totals, 1);

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-4 text-xs text-slate-500">
        <span className="flex items-center gap-2"><i className="h-2.5 w-2.5 rounded-full bg-indigo-500" /> Rooms</span>
        <span className="flex items-center gap-2"><i className="h-2.5 w-2.5 rounded-full bg-emerald-500" /> Restaurant</span>
        <span className="flex items-center gap-2"><i className="h-2.5 w-2.5 rounded-full bg-amber-500" /> Services</span>
        <span className="flex items-center gap-2"><i className="h-2.5 w-2.5 rounded-full bg-sky-500" /> Events</span>
      </div>

      <div className="flex h-64 items-end gap-3 border-b border-slate-200 pb-2">
        {rows.map((row) => {
          const total = row.rooms + row.restaurant + row.services + row.events;
          const height = (total / max) * 100;

          return (
            <div key={row[mode]} className="flex h-full min-w-0 flex-1 flex-col justify-end">
              <div className="mb-2 text-center text-[10px] font-semibold text-slate-500 sm:text-xs">
                {money(total)}
              </div>
              <div
                className="flex w-full flex-col-reverse overflow-hidden rounded-t-md"
                style={{ height: `${height}%` }}
                title={`${row[mode]}: ${money(total)}`}
              >
                <div style={{ height: `${(row.rooms / total) * 100}%` }} className="bg-indigo-500" />
                <div style={{ height: `${(row.restaurant / total) * 100}%` }} className="bg-emerald-500" />
                <div style={{ height: `${(row.services / total) * 100}%` }} className="bg-amber-500" />
                <div style={{ height: `${(row.events / total) * 100}%` }} className="bg-sky-500" />
              </div>
              <span className="mt-2 truncate text-center text-xs text-slate-500">{row[mode]}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default function RevenueReports() {
  const [view, setView] = useState("monthly");
  const [period, setPeriod] = useState("november");
  const [departmentFilter, setDepartmentFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");
  const [search, setSearch] = useState("");
  const [startDate, setStartDate] = useState("2026-11-01");
  const [endDate, setEndDate] = useState("2026-11-30");

  const chartRows = view === "daily" ? dailyRevenue : monthlyRevenue;
  const chartKey = view === "daily" ? "date" : "month";

  const filteredPayments = useMemo(() => {
    return paymentRecords.filter((payment) => {
      const query = search.toLowerCase();

      const matchesSearch =
        payment.id.toLowerCase().includes(query) ||
        payment.guest.toLowerCase().includes(query) ||
        payment.booking.toLowerCase().includes(query);

      const matchesDepartment =
        departmentFilter === "All" ||
        payment.department === departmentFilter;

      const matchesStatus =
        statusFilter === "All" || payment.status === statusFilter;

      let matchesPeriod = true;

      if (period === "custom") {
        matchesPeriod =
          payment.date >= startDate && payment.date <= endDate;
      } else if (period === "november") {
        matchesPeriod = payment.date.startsWith("2026-11");
      } else if (period === "october") {
        matchesPeriod = payment.date.startsWith("2026-10");
      }

      return matchesSearch && matchesDepartment && matchesStatus && matchesPeriod;
    });
  }, [search, departmentFilter, statusFilter, period, startDate, endDate]);

  const paymentStats = useMemo(() => {
    const collected = filteredPayments
      .filter((p) => p.status === "Collected")
      .reduce((sum, p) => sum + p.amount, 0);

    const pending = filteredPayments
      .filter((p) => p.status === "Pending")
      .reduce((sum, p) => sum + p.amount, 0);

    return { collected, pending };
  }, [filteredPayments]);

  const departmentRows = useMemo(() => {
    return departmentFilter === "All"
      ? departments
      : departments.filter((d) => d.name === departmentFilter);
  }, [departmentFilter]);

  const totalDepartmentRevenue = departmentRows.reduce(
    (sum, d) => sum + d.revenue,
    0
  );

  const totalDepartmentCollected = departmentRows.reduce(
    (sum, d) => sum + d.collected,
    0
  );

  const totalDepartmentPending = departmentRows.reduce(
    (sum, d) => sum + d.pending,
    0
  );

  const clearFilters = () => {
    setSearch("");
    setDepartmentFilter("All");
    setStatusFilter("All");
    setPeriod("november");
    setStartDate("2026-11-01");
    setEndDate("2026-11-30");
  };

  const exportPayments = () => {
    const headers = ["Payment ID", "Guest", "Booking", "Department", "Method", "Amount", "Date", "Status"];
    const rows = filteredPayments.map((p) => [
      p.id, p.guest, p.booking, p.department, p.method, p.amount, p.date, p.status,
    ]);

    const csv = [headers, ...rows]
      .map((row) => row.map((v) => `"${String(v).replace(/"/g, '""')}"`).join(","))
      .join("\n");

    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "revenue-payment-report.csv";
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen w-full bg-slate-50 p-2 md:p-4">
      <div className="w-full space-y-5">
        {/* Header */}
        <div className="flex flex-col justify-between gap-4 lg:flex-row lg:items-center">
          <div>
            <div className="flex items-center gap-2 text-sm text-slate-500">
              <span>Reports & Analytics</span>
              <span>/</span>
              <span className="font-medium text-indigo-600">Revenue Reports</span>
            </div>
            <h1 className="mt-2 text-2xl font-bold text-slate-900 md:text-3xl">
              Revenue Reports
            </h1>
            <p className="mt-1 text-sm text-slate-500">
              Track revenue trends, department performance, collections and outstanding balances.
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => window.print()}
              className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50"
            >
              <Printer size={17} /> Print
            </button>
            <button
              onClick={exportPayments}
              className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-indigo-700"
            >
              <Download size={17} /> Export CSV
            </button>
          </div>
        </div>

        {/* Filters */}
        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
          <div className="mb-4 flex items-center justify-between gap-2">
            <div className="flex items-center gap-2 font-semibold text-slate-800">
              <Filter size={18} className="text-indigo-600" />
              Report Filters
            </div>
            <button onClick={clearFilters} className="flex items-center gap-1 text-sm font-medium text-indigo-600">
              <RefreshCw size={14} /> Reset filters
            </button>
          </div>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
            <select
              value={period}
              onChange={(e) => setPeriod(e.target.value)}
              className="rounded-xl border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-indigo-400"
            >
              <option value="november">November 2026</option>
              <option value="october">October 2026</option>
              <option value="all">All dates</option>
              <option value="custom">Custom date range</option>
            </select>

            <select
              value={departmentFilter}
              onChange={(e) => setDepartmentFilter(e.target.value)}
              className="rounded-xl border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-indigo-400"
            >
              <option value="All">All departments</option>
              {departments.map((d) => (
                <option key={d.name} value={d.name}>{d.name}</option>
              ))}
            </select>

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="rounded-xl border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-indigo-400"
            >
              <option value="All">All payment statuses</option>
              <option value="Collected">Collected</option>
              <option value="Pending">Pending</option>
            </select>

            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search payment, guest or booking"
              className="rounded-xl border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-indigo-400"
            />
          </div>

          {period === "custom" && (
            <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2">
              <label className="text-xs font-medium text-slate-500">
                Start date
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="mt-1 block w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm"
                />
              </label>
              <label className="text-xs font-medium text-slate-500">
                End date
                <input
                  type="date"
                  min={startDate}
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="mt-1 block w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm"
                />
              </label>
            </div>
          )}
        </div>

        {/* KPI cards */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <MetricCard
            title="Total Revenue"
            value={money(1030000)}
            subtitle="Illustrative November revenue"
            icon={IndianRupee}
            trend="+14.8%"
            positive
          />
          <MetricCard
            title="Total Collected"
            value={money(938000)}
            subtitle="Illustrative amount received"
            icon={Wallet}
            trend="+11.2%"
            positive
          />
          <MetricCard
            title="Outstanding Balance"
            value={money(92000)}
            subtitle="Illustrative unpaid balance"
            icon={Clock}
            trend="-4.5%"
            positive
          />
          <MetricCard
            title="Department Revenue"
            value={money(1030000)}
            subtitle="Across all hotel departments"
            icon={Building2}
            trend="+9.6%"
            positive
          />
        </div>

        {/* Collections summary */}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          <div className="rounded-2xl border border-slate-200 bg-white p-5">
            <div className="flex items-center justify-between">
              <p className="text-sm text-slate-500">Filtered collections</p>
              <CreditCard className="text-emerald-600" size={20} />
            </div>
            <p className="mt-2 text-2xl font-bold text-slate-900">{money(paymentStats.collected)}</p>
            <p className="mt-1 text-xs text-slate-400">Based on payment filters below</p>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-white p-5">
            <div className="flex items-center justify-between">
              <p className="text-sm text-slate-500">Filtered pending payments</p>
              <Clock className="text-amber-600" size={20} />
            </div>
            <p className="mt-2 text-2xl font-bold text-slate-900">{money(paymentStats.pending)}</p>
            <p className="mt-1 text-xs text-slate-400">Based on payment filters below</p>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-white p-5">
            <div className="flex items-center justify-between">
              <p className="text-sm text-slate-500">Collection rate</p>
              <TrendingUp className="text-indigo-600" size={20} />
            </div>
            <p className="mt-2 text-2xl font-bold text-slate-900">
              {paymentStats.collected + paymentStats.pending
                ? ((paymentStats.collected / (paymentStats.collected + paymentStats.pending)) * 100).toFixed(1)
                : "0.0"}%
            </p>
            <p className="mt-1 text-xs text-slate-400">Collected ÷ filtered payment amount</p>
          </div>
        </div>

        {/* Revenue chart */}
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="mb-5 flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
            <div>
              <h2 className="font-bold text-slate-900">Revenue Trends</h2>
              <p className="mt-1 text-sm text-slate-500">
                Revenue split across hotel departments
              </p>
            </div>
            <div className="flex rounded-xl bg-slate-100 p-1">
              <button
                onClick={() => setView("daily")}
                className={`rounded-lg px-4 py-2 text-sm font-semibold ${view === "daily" ? "bg-white text-indigo-600 shadow-sm" : "text-slate-500"}`}
              >
                Daily
              </button>
              <button
                onClick={() => setView("monthly")}
                className={`rounded-lg px-4 py-2 text-sm font-semibold ${view === "monthly" ? "bg-white text-indigo-600 shadow-sm" : "text-slate-500"}`}
              >
                Monthly
              </button>
            </div>
          </div>

          <RevenueBars rows={chartRows} mode={chartKey} />
          <p className="mt-4 text-xs text-slate-400">
            Chart values are illustrative sample figures and are not recalculated by the payment filters.
          </p>
        </div>

        {/* Department performance */}
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="mb-5">
            <h2 className="font-bold text-slate-900">Department Revenue & Collections</h2>
            <p className="mt-1 text-sm text-slate-500">
              Revenue, collected amounts and outstanding balances
            </p>
          </div>

          <div className="space-y-5">
            {departmentRows.map((department) => (
              <div key={department.name}>
                <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
                  <span className="font-semibold text-slate-800">{department.name}</span>
                  <span className="text-sm font-bold text-slate-900">{money(department.revenue)}</span>
                </div>
                <div className="flex h-3 overflow-hidden rounded-full bg-slate-100">
                  <div
                    className="h-full bg-emerald-500"
                    style={{ width: `${department.revenue ? (department.collected / department.revenue) * 100 : 0}%` }}
                  />
                  <div
                    className="h-full bg-amber-400"
                    style={{ width: `${department.revenue ? (department.pending / department.revenue) * 100 : 0}%` }}
                  />
                </div>
                <div className="mt-2 flex flex-wrap justify-between gap-2 text-xs text-slate-500">
                  <span>Collected: {money(department.collected)}</span>
                  <span>Pending: {money(department.pending)}</span>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6 grid grid-cols-1 gap-3 border-t border-slate-100 pt-5 sm:grid-cols-3">
            <div>
              <p className="text-xs text-slate-500">Total revenue</p>
              <p className="mt-1 font-bold text-slate-900">{money(totalDepartmentRevenue)}</p>
            </div>
            <div>
              <p className="text-xs text-slate-500">Total collected</p>
              <p className="mt-1 font-bold text-emerald-700">{money(totalDepartmentCollected)}</p>
            </div>
            <div>
              <p className="text-xs text-slate-500">Total outstanding</p>
              <p className="mt-1 font-bold text-amber-700">{money(totalDepartmentPending)}</p>
            </div>
          </div>
        </div>

        {/* Payment records */}
        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="flex flex-col justify-between gap-3 border-b border-slate-100 p-5 sm:flex-row sm:items-center">
            <div>
              <h2 className="font-bold text-slate-900">Payment Collection Records</h2>
              <p className="mt-1 text-sm text-slate-500">
                {filteredPayments.length} payment records matching filters
              </p>
            </div>
            <button
              onClick={exportPayments}
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"
            >
              <Download size={16} /> Export records
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full min-w-[950px] text-left text-sm">
              <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
                <tr>
                  <th className="px-5 py-4 font-semibold">Payment ID</th>
                  <th className="px-5 py-4 font-semibold">Guest</th>
                  <th className="px-5 py-4 font-semibold">Booking Ref.</th>
                  <th className="px-5 py-4 font-semibold">Department</th>
                  <th className="px-5 py-4 font-semibold">Payment Method</th>
                  <th className="px-5 py-4 font-semibold">Date</th>
                  <th className="px-5 py-4 font-semibold">Amount</th>
                  <th className="px-5 py-4 font-semibold">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredPayments.map((payment) => (
                  <tr key={payment.id} className="hover:bg-slate-50">
                    <td className="px-5 py-4 font-semibold text-indigo-600">{payment.id}</td>
                    <td className="px-5 py-4 font-medium text-slate-800">{payment.guest}</td>
                    <td className="px-5 py-4 text-slate-600">{payment.booking}</td>
                    <td className="px-5 py-4 text-slate-600">{payment.department}</td>
                    <td className="px-5 py-4 text-slate-600">{payment.method}</td>
                    <td className="px-5 py-4 text-slate-600">{dateLabel(payment.date)}</td>
                    <td className="px-5 py-4 font-semibold text-slate-800">{money(payment.amount)}</td>
                    <td className="px-5 py-4"><StatusBadge status={payment.status} /></td>
                  </tr>
                ))}

                {filteredPayments.length === 0 && (
                  <tr>
                    <td colSpan="8" className="px-5 py-12 text-center text-slate-500">
                      No payment records match your filters.
                      <button onClick={clearFilters} className="ml-2 font-semibold text-indigo-600">
                        Reset filters
                      </button>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Comparison */}
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center gap-2">
            <CalendarDays size={20} className="text-indigo-600" />
            <h2 className="font-bold text-slate-900">Period Comparison</h2>
          </div>
          <p className="mt-1 text-sm text-slate-500">
            Illustrative comparison with the previous reporting period
          </p>

          <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-3">
            <div className="rounded-xl bg-slate-50 p-4">
              <p className="text-sm text-slate-500">Revenue growth</p>
              <p className="mt-2 flex items-center gap-1 text-xl font-bold text-emerald-600">
                <ArrowUpRight size={19} /> 14.8%
              </p>
            </div>
            <div className="rounded-xl bg-slate-50 p-4">
              <p className="text-sm text-slate-500">Collection growth</p>
              <p className="mt-2 flex items-center gap-1 text-xl font-bold text-emerald-600">
                <ArrowUpRight size={19} /> 11.2%
              </p>
            </div>
            <div className="rounded-xl bg-slate-50 p-4">
              <p className="text-sm text-slate-500">Outstanding balance</p>
              <p className="mt-2 flex items-center gap-1 text-xl font-bold text-emerald-600">
                <ArrowDownRight size={19} /> 4.5%
              </p>
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800">
          <strong>Demo data:</strong> Revenue charts, department figures and comparison metrics use sample values. Payment filters operate on the included sample payment records. Connect the finance and payments APIs later for live reporting.
        </div>
      </div>

      <style>{`
        @media print {
          body { background: white !important; }
          button, input, select { display: none !important; }
          * { print-color-adjust: exact; -webkit-print-color-adjust: exact; }
        }
      `}</style>
    </div>
  );
}
