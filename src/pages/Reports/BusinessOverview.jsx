
import { useMemo, useState } from "react";
import {
  BarChart3,
  TrendingUp,
  TrendingDown,
  Users,
  BedDouble,
  CalendarDays,
  IndianRupee,
  Download,
  Printer,
  RefreshCw,
  FileText,
  Building2,
  Utensils,
  Sparkles,
  Wallet,
  Ticket,
  ArrowUpRight,
  ArrowDownRight,
} from "lucide-react";

const money = (value) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(value || 0);

const initialData = [
  { month: "Jan", revenue: 420000, expenses: 245000, occupancy: 62, reservations: 118 },
  { month: "Feb", revenue: 460000, expenses: 258000, occupancy: 66, reservations: 126 },
  { month: "Mar", revenue: 510000, expenses: 275000, occupancy: 71, reservations: 139 },
  { month: "Apr", revenue: 480000, expenses: 268000, occupancy: 68, reservations: 132 },
  { month: "May", revenue: 560000, expenses: 291000, occupancy: 76, reservations: 151 },
  { month: "Jun", revenue: 530000, expenses: 280000, occupancy: 73, reservations: 144 },
  { month: "Jul", revenue: 610000, expenses: 310000, occupancy: 79, reservations: 163 },
  { month: "Aug", revenue: 590000, expenses: 305000, occupancy: 77, reservations: 158 },
  { month: "Sep", revenue: 650000, expenses: 325000, occupancy: 82, reservations: 174 },
  { month: "Oct", revenue: 690000, expenses: 342000, occupancy: 85, reservations: 186 },
  { month: "Nov", revenue: 720000, expenses: 350000, occupancy: 88, reservations: 192 },
  { month: "Dec", revenue: 780000, expenses: 375000, occupancy: 91, reservations: 205 },
];

const departments = [
  { name: "Rooms", revenue: 420000, expenses: 155000, color: "bg-indigo-500", icon: BedDouble },
  { name: "Restaurant", revenue: 185000, expenses: 92000, color: "bg-emerald-500", icon: Utensils },
  { name: "Events & Banquets", revenue: 85000, expenses: 43000, color: "bg-amber-500", icon: Ticket },
  { name: "Guest Services", revenue: 30000, expenses: 17000, color: "bg-sky-500", icon: Sparkles },
];

const comparisonData = {
  "7": {
    revenue: 185000,
    previousRevenue: 162000,
    occupancy: 78,
    previousOccupancy: 73,
    reservations: 48,
    previousReservations: 42,
    adr: 4200,
    previousAdr: 3950,
    guests: 36,
    previousGuests: 29,
    events: 5,
    previousEvents: 4,
    expenses: 92000,
    previousExpenses: 87000,
  },
  "30": {
    revenue: 720000,
    previousRevenue: 650000,
    occupancy: 88,
    previousOccupancy: 82,
    reservations: 192,
    previousReservations: 174,
    adr: 4500,
    previousAdr: 4250,
    guests: 146,
    previousGuests: 124,
    events: 18,
    previousEvents: 15,
    expenses: 350000,
    previousExpenses: 325000,
  },
  "90": {
    revenue: 1980000,
    previousRevenue: 1760000,
    occupancy: 82,
    previousOccupancy: 77,
    reservations: 528,
    previousReservations: 471,
    adr: 4350,
    previousAdr: 4100,
    guests: 398,
    previousGuests: 350,
    events: 46,
    previousEvents: 39,
    expenses: 965000,
    previousExpenses: 895000,
  },
  "365": {
    revenue: 7200000,
    previousRevenue: 6420000,
    occupancy: 78,
    previousOccupancy: 72,
    reservations: 1888,
    previousReservations: 1640,
    adr: 4300,
    previousAdr: 4050,
    guests: 1420,
    previousGuests: 1280,
    events: 165,
    previousEvents: 140,
    expenses: 3490000,
    previousExpenses: 3200000,
  },
};

const formatPercent = (value) => `${value.toFixed(1)}%`;

function Comparison({ current, previous, suffix = "%" }) {
  const change = previous
    ? ((current - previous) / previous) * 100
    : 0;
  const positive = change >= 0;

  return (
    <span
      className={`inline-flex items-center gap-1 text-xs font-semibold ${
        positive ? "text-emerald-600" : "text-rose-600"
      }`}
    >
      {positive ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
      {Math.abs(change).toFixed(1)}% {suffix}
    </span>
  );
}

function StatCard({ title, value, icon: Icon, color, change, subtitle }) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-sm text-slate-500">{title}</p>
          <h3 className="mt-2 text-2xl font-bold text-slate-800">{value}</h3>
        </div>
        <span className={`rounded-xl p-3 ${color}`}>
          <Icon size={21} />
        </span>
      </div>
      <div className="mt-3 flex flex-wrap items-center gap-2">
        {change}
        <span className="text-xs text-slate-400">{subtitle}</span>
      </div>
    </div>
  );
}

export default function BusinessOverview() {
  const [range, setRange] = useState("30");
  const [departmentFilter, setDepartmentFilter] = useState("All");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [showCustom, setShowCustom] = useState(false);

  const data = comparisonData[range];

  const visibleDepartments = departments.filter(
    (item) =>
      departmentFilter === "All" || item.name === departmentFilter
  );

  const departmentTotals = useMemo(() => {
    return visibleDepartments.reduce(
      (acc, item) => {
        acc.revenue += item.revenue;
        acc.expenses += item.expenses;
        return acc;
      },
      { revenue: 0, expenses: 0 }
    );
  }, [visibleDepartments]);

  const netIncome = data.revenue - data.expenses;

  const filteredDepartmentRevenue = departmentTotals.revenue;
  const filteredDepartmentExpenses = departmentTotals.expenses;

  const exportCSV = () => {
    const rows = [
      ["StayFlow Business Overview"],
      ["Report Period", range === "custom" ? `${startDate} to ${endDate}` : `Last ${range} days`],
      [],
      ["Metric", "Current Period", "Previous Period"],
      ["Revenue", data.revenue, data.previousRevenue],
      ["Occupancy", data.occupancy, data.previousOccupancy],
      ["Reservations", data.reservations, data.previousReservations],
      ["Average Room Rate", data.adr, data.previousAdr],
      ["Guest Growth", data.guests, data.previousGuests],
      ["Events", data.events, data.previousEvents],
      ["Expenses", data.expenses, data.previousExpenses],
      ["Net Income", netIncome, data.previousRevenue - data.previousExpenses],
      [],
      ["Department", "Revenue", "Expenses", "Net Income"],
      ...visibleDepartments.map((item) => [
        item.name,
        item.revenue,
        item.expenses,
        item.revenue - item.expenses,
      ]),
    ];

    const csv = rows
      .map((row) =>
        row
          .map((value) => `"${String(value ?? "").replace(/"/g, '""')}"`)
          .join(",")
      )
      .join("\n");

    const blob = new Blob([csv], {
      type: "text/csv;charset=utf-8;",
    });

    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "stayflow-business-overview.csv";
    link.click();
    URL.revokeObjectURL(url);
  };

  const printReport = () => window.print();

  const maxRevenue = Math.max(...initialData.map((item) => item.revenue));

  const chartData =
    range === "7"
      ? initialData.slice(-1)
      : range === "30"
      ? initialData.slice(-3)
      : range === "90"
      ? initialData.slice(-6)
      : initialData;

  return (
    <div className="min-h-screen w-full bg-slate-50 p-2 md:p-4">
      <div className="w-full space-y-5">

        {/* Header */}
        <div className="flex flex-col justify-between gap-4 lg:flex-row lg:items-center">
          <div>
            <div className="flex items-center gap-2">
              <BarChart3 className="text-indigo-600" size={25} />
              <h1 className="text-2xl font-bold text-slate-800">
                Business Overview
              </h1>
            </div>
            <p className="mt-1 text-sm text-slate-500">
              Monitor hotel performance, revenue, occupancy and operations.
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            <button
              onClick={exportCSV}
              className="flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50"
            >
              <Download size={17} />
              Export CSV
            </button>
            <button
              onClick={printReport}
              className="flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-indigo-700"
            >
              <Printer size={17} />
              Print Report
            </button>
          </div>
        </div>

        {/* Filters */}
        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
          <div className="flex flex-col gap-4 xl:flex-row xl:items-end xl:justify-between">
            <div className="flex-1">
              <label className="mb-2 block text-xs font-semibold uppercase text-slate-500">
                Report Period
              </label>
              <div className="flex flex-wrap gap-2">
                {[
                  ["7", "Last 7 Days"],
                  ["30", "Last 30 Days"],
                  ["90", "Last 90 Days"],
                  ["365", "Last 12 Months"],
                ].map(([value, label]) => (
                  <button
                    key={value}
                    onClick={() => {
                      setRange(value);
                      setShowCustom(false);
                    }}
                    className={`rounded-lg border px-3 py-2 text-sm font-medium ${
                      range === value && !showCustom
                        ? "border-indigo-600 bg-indigo-50 text-indigo-700"
                        : "border-slate-200 text-slate-600 hover:bg-slate-50"
                    }`}
                  >
                    {label}
                  </button>
                ))}
                <button
                  onClick={() => setShowCustom((prev) => !prev)}
                  className={`rounded-lg border px-3 py-2 text-sm font-medium ${
                    showCustom
                      ? "border-indigo-600 bg-indigo-50 text-indigo-700"
                      : "border-slate-200 text-slate-600 hover:bg-slate-50"
                  }`}
                >
                  Custom Range
                </button>
              </div>
            </div>

            <div className="w-full xl:max-w-56">
              <label className="mb-2 block text-xs font-semibold uppercase text-slate-500">
                Department
              </label>
              <select
                value={departmentFilter}
                onChange={(e) => setDepartmentFilter(e.target.value)}
                className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-indigo-500"
              >
                <option value="All">All Departments</option>
                {departments.map((item) => (
                  <option key={item.name}>{item.name}</option>
                ))}
              </select>
            </div>
          </div>

          {showCustom && (
            <div className="mt-4 grid gap-3 border-t border-slate-100 pt-4 sm:grid-cols-3">
              <div>
                <label className="mb-1 block text-xs font-medium text-slate-500">
                  Start Date
                </label>
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm"
                />
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium text-slate-500">
                  End Date
                </label>
                <input
                  type="date"
                  min={startDate || undefined}
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm"
                />
              </div>
              <div className="flex items-end">
                <button
                  disabled={!startDate || !endDate || endDate < startDate}
                  onClick={() => {
                    setRange("custom");
                  }}
                  className="w-full rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:opacity-40"
                >
                  Apply Date Range
                </button>
              </div>
              {range === "custom" && (
                <p className="text-xs text-slate-500 sm:col-span-3">
                  Selected: {startDate} to {endDate}. Custom-range metrics require actual date-filtered records when connected to your backend; the sample figures below remain illustrative.
                </p>
              )}
            </div>
          )}
        </div>

        {/* Main Metrics */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <StatCard
            title="Total Revenue"
            value={money(data.revenue)}
            icon={IndianRupee}
            color="bg-indigo-50 text-indigo-600"
            change={
              <Comparison
                current={data.revenue}
                previous={data.previousRevenue}
              />
            }
            subtitle="vs previous period"
          />
          <StatCard
            title="Occupancy Rate"
            value={formatPercent(data.occupancy)}
            icon={BedDouble}
            color="bg-emerald-50 text-emerald-600"
            change={
              <Comparison
                current={data.occupancy}
                previous={data.previousOccupancy}
              />
            }
            subtitle="vs previous period"
          />
          <StatCard
            title="Reservations"
            value={data.reservations.toLocaleString("en-IN")}
            icon={CalendarDays}
            color="bg-sky-50 text-sky-600"
            change={
              <Comparison
                current={data.reservations}
                previous={data.previousReservations}
              />
            }
            subtitle="vs previous period"
          />
          <StatCard
            title="Average Room Rate"
            value={money(data.adr)}
            icon={Wallet}
            color="bg-amber-50 text-amber-600"
            change={
              <Comparison
                current={data.adr}
                previous={data.previousAdr}
              />
            }
            subtitle="vs previous period"
          />
        </div>

        {/* Secondary Metrics */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <StatCard
            title="Guest Growth"
            value={data.guests.toLocaleString("en-IN")}
            icon={Users}
            color="bg-violet-50 text-violet-600"
            change={
              <Comparison
                current={data.guests}
                previous={data.previousGuests}
              />
            }
            subtitle="new guests"
          />
          <StatCard
            title="Event Performance"
            value={data.events}
            icon={Ticket}
            color="bg-orange-50 text-orange-600"
            change={
              <Comparison
                current={data.events}
                previous={data.previousEvents}
              />
            }
            subtitle="events handled"
          />
          <StatCard
            title="Total Expenses"
            value={money(data.expenses)}
            icon={Wallet}
            color="bg-rose-50 text-rose-600"
            change={
              <Comparison
                current={data.expenses}
                previous={data.previousExpenses}
              />
            }
            subtitle="vs previous period"
          />
          <StatCard
            title="Net Operating Income"
            value={money(netIncome)}
            icon={TrendingUp}
            color="bg-teal-50 text-teal-600"
            change={
              <Comparison
                current={netIncome}
                previous={data.previousRevenue - data.previousExpenses}
              />
            }
            subtitle="revenue minus expenses"
          />
        </div>

        {/* Revenue Chart */}
        <div className="grid grid-cols-1 gap-5 xl:grid-cols-3">
          <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm xl:col-span-2">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <h2 className="font-semibold text-slate-800">
                  Revenue & Expenses
                </h2>
                <p className="mt-1 text-xs text-slate-500">
                  Monthly financial performance
                </p>
              </div>
              <div className="flex gap-4 text-xs text-slate-500">
                <span className="flex items-center gap-2">
                  <span className="h-2.5 w-2.5 rounded-full bg-indigo-500" />
                  Revenue
                </span>
                <span className="flex items-center gap-2">
                  <span className="h-2.5 w-2.5 rounded-full bg-rose-400" />
                  Expenses
                </span>
              </div>
            </div>

            <div className="mt-6 flex h-64 items-end gap-2 border-b border-l border-slate-200 px-2 pb-2 sm:gap-4">
              {chartData.map((item) => (
                <div
                  key={item.month}
                  className="flex h-full flex-1 flex-col items-center justify-end gap-2"
                >
                  <div className="flex h-[90%] w-full items-end justify-center gap-1">
                    <div
                      title={`Revenue: ${money(item.revenue)}`}
                      className="w-[42%] rounded-t-md bg-indigo-500 transition-all hover:bg-indigo-600"
                      style={{
                        height: `${(item.revenue / maxRevenue) * 100}%`,
                      }}
                    />
                    <div
                      title={`Expenses: ${money(item.expenses)}`}
                      className="w-[42%] rounded-t-md bg-rose-400 transition-all hover:bg-rose-500"
                      style={{
                        height: `${(item.expenses / maxRevenue) * 100}%`,
                      }}
                    />
                  </div>
                  <span className="text-[10px] text-slate-500 sm:text-xs">
                    {item.month}
                  </span>
                </div>
              ))}
            </div>
            <p className="mt-3 text-right text-xs text-slate-400">
              Values in INR · Illustrative monthly data
            </p>
          </div>

          {/* Occupancy */}
          <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
            <h2 className="font-semibold text-slate-800">
              Occupancy Performance
            </h2>
            <p className="mt-1 text-xs text-slate-500">
              Monthly occupancy trend
            </p>

            <div className="mt-6 space-y-4">
              {chartData.map((item) => (
                <div key={item.month}>
                  <div className="mb-1.5 flex justify-between text-xs">
                    <span className="font-medium text-slate-600">
                      {item.month}
                    </span>
                    <span className="font-semibold text-slate-800">
                      {item.occupancy}%
                    </span>
                  </div>
                  <div className="h-2.5 overflow-hidden rounded-full bg-slate-100">
                    <div
                      className="h-full rounded-full bg-emerald-500"
                      style={{ width: `${item.occupancy}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-5 rounded-lg bg-emerald-50 p-3">
              <p className="text-xs text-emerald-700">Current occupancy</p>
              <p className="mt-1 text-2xl font-bold text-emerald-800">
                {data.occupancy}%
              </p>
            </div>
          </div>
        </div>

        {/* Department Performance */}
        <div className="grid grid-cols-1 gap-5 xl:grid-cols-3">
          <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm xl:col-span-2">
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-200 p-4">
              <div>
                <h2 className="font-semibold text-slate-800">
                  Department Performance
                </h2>
                <p className="mt-1 text-xs text-slate-500">
                  Revenue and expense breakdown
                </p>
              </div>
              <span className="rounded-lg bg-slate-100 px-3 py-1.5 text-xs text-slate-600">
                {departmentFilter === "All" ? "All Departments" : departmentFilter}
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full min-w-[650px] text-left text-sm">
                <thead className="bg-slate-50 text-xs uppercase text-slate-500">
                  <tr>
                    <th className="px-4 py-3">Department</th>
                    <th className="px-4 py-3">Revenue</th>
                    <th className="px-4 py-3">Expenses</th>
                    <th className="px-4 py-3">Net Income</th>
                    <th className="px-4 py-3">Margin</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {visibleDepartments.map((item) => {
                    const net = item.revenue - item.expenses;
                    const margin = item.revenue
                      ? (net / item.revenue) * 100
                      : 0;
                    const Icon = item.icon;

                    return (
                      <tr key={item.name}>
                        <td className="px-4 py-4">
                          <div className="flex items-center gap-2">
                            <span className="rounded-lg bg-slate-100 p-2 text-slate-600">
                              <Icon size={17} />
                            </span>
                            <span className="font-medium text-slate-800">
                              {item.name}
                            </span>
                          </div>
                        </td>
                        <td className="px-4 py-4 text-slate-700">
                          {money(item.revenue)}
                        </td>
                        <td className="px-4 py-4 text-rose-600">
                          {money(item.expenses)}
                        </td>
                        <td className="px-4 py-4 font-semibold text-slate-800">
                          {money(net)}
                        </td>
                        <td className="px-4 py-4">
                          <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-700">
                            {margin.toFixed(1)}%
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
                <tfoot className="bg-slate-50 font-semibold text-slate-800">
                  <tr>
                    <td className="px-4 py-3">Total</td>
                    <td className="px-4 py-3">
                      {money(filteredDepartmentRevenue)}
                    </td>
                    <td className="px-4 py-3 text-rose-600">
                      {money(filteredDepartmentExpenses)}
                    </td>
                    <td className="px-4 py-3">
                      {money(filteredDepartmentRevenue - filteredDepartmentExpenses)}
                    </td>
                    <td className="px-4 py-3">—</td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>

          {/* Revenue Distribution */}
          <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
            <h2 className="font-semibold text-slate-800">
              Revenue Distribution
            </h2>
            <p className="mt-1 text-xs text-slate-500">
              Department contribution
            </p>

            <div className="mt-6 space-y-5">
              {visibleDepartments.map((item) => {
                const total = filteredDepartmentRevenue || 1;
                const percent = (item.revenue / total) * 100;
                const Icon = item.icon;

                return (
                  <div key={item.name}>
                    <div className="mb-2 flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <Icon size={16} className="text-slate-500" />
                        <span className="text-sm text-slate-700">
                          {item.name}
                        </span>
                      </div>
                      <span className="text-xs font-semibold text-slate-800">
                        {percent.toFixed(1)}%
                      </span>
                    </div>
                    <div className="h-2.5 overflow-hidden rounded-full bg-slate-100">
                      <div
                        className={`h-full rounded-full ${item.color}`}
                        style={{ width: `${percent}%` }}
                      />
                    </div>
                    <p className="mt-1 text-right text-xs text-slate-400">
                      {money(item.revenue)}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Comparison */}
        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
          <div className="mb-4">
            <h2 className="font-semibold text-slate-800">
              Period Comparison
            </h2>
            <p className="mt-1 text-xs text-slate-500">
              Current period compared with the previous equivalent period
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full min-w-[600px] text-left text-sm">
              <thead className="bg-slate-50 text-xs uppercase text-slate-500">
                <tr>
                  <th className="px-4 py-3">Metric</th>
                  <th className="px-4 py-3">Current Period</th>
                  <th className="px-4 py-3">Previous Period</th>
                  <th className="px-4 py-3">Change</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {[
                  ["Revenue", data.revenue, data.previousRevenue, true],
                  ["Occupancy", data.occupancy, data.previousOccupancy, false],
                  ["Reservations", data.reservations, data.previousReservations, true],
                  ["Average Room Rate", data.adr, data.previousAdr, true],
                  ["New Guests", data.guests, data.previousGuests, true],
                  ["Events", data.events, data.previousEvents, true],
                  ["Expenses", data.expenses, data.previousExpenses, true],
                ].map(([label, current, previous, isMoney]) => {
                  const change = previous
                    ? ((current - previous) / previous) * 100
                    : 0;
                  const isExpense = label === "Expenses";
                  const good = isExpense ? change <= 0 : change >= 0;

                  return (
                    <tr key={label}>
                      <td className="px-4 py-3 font-medium text-slate-700">
                        {label}
                      </td>
                      <td className="px-4 py-3 font-semibold text-slate-800">
                        {isMoney && ["Revenue", "Average Room Rate", "Expenses"].includes(label)
                          ? money(current)
                          : label === "Occupancy"
                          ? `${current}%`
                          : current}
                      </td>
                      <td className="px-4 py-3 text-slate-500">
                        {isMoney && ["Revenue", "Average Room Rate", "Expenses"].includes(label)
                          ? money(previous)
                          : label === "Occupancy"
                          ? `${previous}%`
                          : previous}
                      </td>
                      <td className="px-4 py-3">
                        <span
                          className={`inline-flex items-center gap-1 text-xs font-semibold ${
                            good ? "text-emerald-600" : "text-rose-600"
                          }`}
                        >
                          {change >= 0 ? (
                            <TrendingUp size={14} />
                          ) : (
                            <TrendingDown size={14} />
                          )}
                          {change > 0 ? "+" : ""}
                          {change.toFixed(1)}%
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        <div className="rounded-xl border border-indigo-100 bg-indigo-50 p-4">
          <div className="flex items-start gap-3">
            <FileText className="mt-0.5 text-indigo-600" size={20} />
            <div>
              <h3 className="font-semibold text-indigo-900">
                Reporting information
              </h3>
              <p className="mt-1 text-sm leading-6 text-indigo-800">
                This dashboard currently uses illustrative sample data.
                Revenue, occupancy, reservations, expenses and department
                figures will be calculated from actual StayFlow records when
                the backend is connected. CSV export and browser printing
                currently work with the displayed sample data.
              </p>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @media print {
          body { background: white !important; }
          button, input, select { display: none !important; }
          .min-h-screen { min-height: auto !important; }
        }
      `}</style>
    </div>
  );
}
