
import { useMemo, useState } from "react";
import {
  IndianRupee,
  BedDouble,
  Utensils,
  CalendarDays,
  TrendingUp,
  TrendingDown,
  Wallet,
  Percent,
  Users,
  ArrowUpRight,
  ArrowDownRight,
  Download,
  RefreshCw,
  BarChart3,
  Building2,
  Clock,
} from "lucide-react";

const monthlyData = [
  { month: "May", room: 820000, restaurant: 210000, event: 120000, other: 25000 },
  { month: "Jun", room: 910000, restaurant: 235000, event: 145000, other: 30000 },
  { month: "Jul", room: 780000, restaurant: 205000, event: 90000, other: 22000 },
  { month: "Aug", room: 1050000, restaurant: 280000, event: 165000, other: 35000 },
  { month: "Sep", room: 1120000, restaurant: 295000, event: 175000, other: 38000 },
  { month: "Oct", room: 1260000, restaurant: 320000, event: 180000, other: 40000 },
];

const departmentData = [
  { name: "Room Revenue", value: 1260000, color: "bg-blue-500", percentage: 70 },
  { name: "Restaurant Revenue", value: 320000, color: "bg-emerald-500", percentage: 17.8 },
  { name: "Event Revenue", value: 180000, color: "bg-purple-500", percentage: 10 },
  { name: "Other Revenue", value: 40000, color: "bg-orange-400", percentage: 2.2 },
];

const money = (value) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(Number(value || 0));

const compactMoney = (value) => {
  if (value >= 100000) return `₹${(value / 100000).toFixed(1)}L`;
  if (value >= 1000) return `₹${(value / 1000).toFixed(0)}K`;
  return money(value);
};

function StatCard({ title, value, change, icon: Icon, positive, description }) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-5">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-slate-500">{title}</p>
          <h3 className="mt-2 text-2xl font-bold text-slate-800">{value}</h3>
        </div>
        <div className="rounded-xl bg-blue-50 p-3 text-blue-600">
          <Icon size={22} />
        </div>
      </div>

      <div className="mt-4 flex items-center gap-2">
        <span
          className={`flex items-center gap-1 text-xs font-semibold ${
            positive ? "text-green-600" : "text-red-600"
          }`}
        >
          {positive ? <ArrowUpRight size={15} /> : <ArrowDownRight size={15} />}
          {change}
        </span>
        <span className="text-xs text-slate-400">{description}</span>
      </div>
    </div>
  );
}

function SectionCard({ title, subtitle, children, action }) {
  return (
    <section className="rounded-xl border border-slate-200 bg-white">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 px-5 py-4">
        <div>
          <h2 className="font-semibold text-slate-800">{title}</h2>
          {subtitle && <p className="mt-1 text-xs text-slate-500">{subtitle}</p>}
        </div>
        {action}
      </div>
      <div className="p-5">{children}</div>
    </section>
  );
}

export default function RevenueOverview() {
  const [selectedMonth, setSelectedMonth] = useState("Oct");
  const [comparison, setComparison] = useState("Previous Month");

  const selectedData = useMemo(
    () => monthlyData.find((item) => item.month === selectedMonth) || monthlyData[5],
    [selectedMonth]
  );

  const previousIndex = monthlyData.findIndex(
    (item) => item.month === selectedMonth
  );

  const previousData = monthlyData[Math.max(0, previousIndex - 1)];

  const totalRevenue =
    selectedData.room +
    selectedData.restaurant +
    selectedData.event +
    selectedData.other;

  const previousRevenue =
    previousData.room +
    previousData.restaurant +
    previousData.event +
    previousData.other;

  const revenueChange =
    previousRevenue > 0
      ? ((totalRevenue - previousRevenue) / previousRevenue) * 100
      : 0;

  // Sample operational figures for the selected month.
  const availableRoomNights = 900;
  const occupiedRoomNights =
    selectedMonth === "Oct" ? 630 : Math.round(availableRoomNights * 0.68);

  const occupancy =
    (occupiedRoomNights / availableRoomNights) * 100;

  const adr = selectedData.room / occupiedRoomNights;
  const revpar = selectedData.room / availableRoomNights;

  const maxRevenue = Math.max(
    ...monthlyData.map(
      (item) => item.room + item.restaurant + item.event + item.other
    )
  );

  const totalTrend = monthlyData.map((item) => ({
    month: item.month,
    total: item.room + item.restaurant + item.event + item.other,
  }));

  const exportCSV = () => {
    const headers = [
      "Month",
      "Room Revenue",
      "Restaurant Revenue",
      "Event Revenue",
      "Other Revenue",
      "Total Revenue",
    ];

    const rows = monthlyData.map((item) => [
      item.month,
      item.room,
      item.restaurant,
      item.event,
      item.other,
      item.room + item.restaurant + item.event + item.other,
    ]);

    const csv = [headers, ...rows]
      .map((row) =>
        row.map((value) => `"${String(value).replace(/"/g, '""')}"`).join(",")
      )
      .join("\n");

    const url = URL.createObjectURL(
      new Blob([csv], { type: "text/csv;charset=utf-8;" })
    );

    const link = document.createElement("a");
    link.href = url;
    link.download = "hotel-revenue-report.csv";
    link.click();
    URL.revokeObjectURL(url);
  };

  const occupancyColor =
    occupancy >= 70 ? "text-green-600" : occupancy >= 50 ? "text-yellow-600" : "text-red-600";

  return (
    <div className="min-h-screen w-full space-y-6 bg-[#F5F7FA] p-4 md:p-6 lg:p-7">
      {/* Header */}
      <div className="flex flex-col justify-between gap-4 lg:flex-row lg:items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">
            Revenue Overview
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            Monitor hotel revenue, room performance and financial trends.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <select
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(e.target.value)}
            className="rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm outline-none focus:border-blue-500"
          >
            {monthlyData.map((item) => (
              <option key={item.month} value={item.month}>
                {item.month} 2026
              </option>
            ))}
          </select>

          <button
            onClick={exportCSV}
            className="flex items-center gap-2 rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50"
          >
            <Download size={17} />
            Export Report
          </button>
        </div>
      </div>

      {/* Main Revenue Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          title="Total Revenue"
          value={money(totalRevenue)}
          change={`${Math.abs(revenueChange).toFixed(1)}%`}
          positive={revenueChange >= 0}
          description="vs previous month"
          icon={Wallet}
        />

        <StatCard
          title="Room Revenue"
          value={money(selectedData.room)}
          change="Room earnings"
          positive
          description="Selected month"
          icon={BedDouble}
        />

        <StatCard
          title="Restaurant Revenue"
          value={money(selectedData.restaurant)}
          change="F&B earnings"
          positive
          description="Selected month"
          icon={Utensils}
        />

        <StatCard
          title="Event Revenue"
          value={money(selectedData.event)}
          change="Event earnings"
          positive
          description="Selected month"
          icon={CalendarDays}
        />
      </div>

      {/* Revenue and Performance */}
      <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
        <div className="xl:col-span-2">
          <SectionCard
            title="Revenue Trends"
            subtitle="Monthly revenue breakdown across hotel departments"
            action={
              <span className="rounded-lg bg-blue-50 px-3 py-1.5 text-xs font-medium text-blue-700">
                May – October 2026
              </span>
            }
          >
            <div className="mb-5 flex flex-wrap gap-4 text-xs text-slate-500">
              {departmentData.map((item) => (
                <span key={item.name} className="flex items-center gap-2">
                  <span className={`h-2.5 w-2.5 rounded-full ${item.color}`} />
                  {item.name.replace(" Revenue", "")}
                </span>
              ))}
            </div>

            <div className="flex h-64 items-end justify-between gap-3 border-b border-l border-slate-200 px-2 pb-2">
              {monthlyData.map((item) => {
                const total =
                  item.room + item.restaurant + item.event + item.other;

                const height = (total / maxRevenue) * 100;

                return (
                  <div
                    key={item.month}
                    className="flex h-full flex-1 flex-col items-center justify-end gap-2"
                  >
                    <span className="text-[10px] font-medium text-slate-500 sm:text-xs">
                      {compactMoney(total)}
                    </span>

                    <div
                      className="flex w-full max-w-14 flex-col justify-end overflow-hidden rounded-t-md"
                      style={{ height: `${height}%` }}
                    >
                      <div
                        className="bg-orange-400"
                        style={{ height: `${(item.other / total) * 100}%` }}
                      />
                      <div
                        className="bg-purple-500"
                        style={{ height: `${(item.event / total) * 100}%` }}
                      />
                      <div
                        className="bg-emerald-500"
                        style={{ height: `${(item.restaurant / total) * 100}%` }}
                      />
                      <div
                        className="bg-blue-500"
                        style={{ height: `${(item.room / total) * 100}%` }}
                      />
                    </div>

                    <span className="text-xs font-medium text-slate-500">
                      {item.month}
                    </span>
                  </div>
                );
              })}
            </div>

            <p className="mt-3 text-xs text-slate-400">
              Values represent sample monthly revenue in INR.
            </p>
          </SectionCard>
        </div>

        <SectionCard
          title="Revenue Distribution"
          subtitle={`Department contribution · ${selectedMonth} 2026`}
        >
          <div className="space-y-5">
            <div className="flex h-4 overflow-hidden rounded-full bg-slate-100">
              {departmentData.map((item) => (
                <div
                  key={item.name}
                  className={item.color}
                  style={{
                    width: `${
                      (item.value / totalRevenue) * 100
                    }%`,
                  }}
                />
              ))}
            </div>

            {departmentData.map((item) => {
              const value = selectedData[
                item.name === "Room Revenue"
                  ? "room"
                  : item.name === "Restaurant Revenue"
                  ? "restaurant"
                  : item.name === "Event Revenue"
                  ? "event"
                  : "other"
              ];

              const percentage = (value / totalRevenue) * 100;

              return (
                <div key={item.name}>
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span className={`h-3 w-3 rounded-full ${item.color}`} />
                      <span className="text-sm text-slate-600">
                        {item.name}
                      </span>
                    </div>
                    <span className="text-sm font-semibold text-slate-800">
                      {percentage.toFixed(1)}%
                    </span>
                  </div>
                  <p className="mt-1 pl-5 text-xs text-slate-400">
                    {money(value)}
                  </p>
                </div>
              );
            })}

            <div className="border-t border-slate-100 pt-4">
              <p className="text-sm text-slate-500">Other Revenue</p>
              <p className="mt-1 text-xl font-bold text-slate-800">
                {money(selectedData.other)}
              </p>
            </div>
          </div>
        </SectionCard>
      </div>

      {/* Hotel Performance Metrics */}
      <div>
        <div className="mb-4">
          <h2 className="text-lg font-semibold text-slate-800">
            Hotel Performance Metrics
          </h2>
          <p className="mt-1 text-sm text-slate-500">
            Key room revenue and occupancy indicators for {selectedMonth} 2026.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <div className="rounded-xl border border-slate-200 bg-white p-5">
            <div className="flex items-center justify-between">
              <p className="text-sm text-slate-500">Average Daily Rate (ADR)</p>
              <IndianRupee className="text-blue-500" size={21} />
            </div>
            <h3 className="mt-3 text-2xl font-bold text-slate-800">
              {money(adr)}
            </h3>
            <p className="mt-2 text-xs text-slate-400">
              Room revenue ÷ occupied room nights
            </p>
          </div>

          <div className="rounded-xl border border-slate-200 bg-white p-5">
            <div className="flex items-center justify-between">
              <p className="text-sm text-slate-500">
                Revenue Per Available Room (RevPAR)
              </p>
              <TrendingUp className="text-green-500" size={21} />
            </div>
            <h3 className="mt-3 text-2xl font-bold text-slate-800">
              {money(revpar)}
            </h3>
            <p className="mt-2 text-xs text-slate-400">
              Room revenue ÷ available room nights
            </p>
          </div>

          <div className="rounded-xl border border-slate-200 bg-white p-5">
            <div className="flex items-center justify-between">
              <p className="text-sm text-slate-500">Occupancy Rate</p>
              <Percent className="text-purple-500" size={21} />
            </div>
            <h3 className={`mt-3 text-2xl font-bold ${occupancyColor}`}>
              {occupancy.toFixed(1)}%
            </h3>
            <div className="mt-3 h-2 overflow-hidden rounded-full bg-slate-100">
              <div
                className="h-full rounded-full bg-purple-500"
                style={{ width: `${occupancy}%` }}
              />
            </div>
            <p className="mt-2 text-xs text-slate-400">
              {occupiedRoomNights} / {availableRoomNights} room nights
            </p>
          </div>

          <div className="rounded-xl border border-slate-200 bg-white p-5">
            <div className="flex items-center justify-between">
              <p className="text-sm text-slate-500">Other Revenue</p>
              <Building2 className="text-orange-500" size={21} />
            </div>
            <h3 className="mt-3 text-2xl font-bold text-slate-800">
              {money(selectedData.other)}
            </h3>
            <p className="mt-2 text-xs text-slate-400">
              Additional hotel income
            </p>
          </div>
        </div>
      </div>

      {/* Monthly Comparison */}
      <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
        <SectionCard
          title="Monthly Revenue Comparison"
          subtitle="Compare the selected month with the previous month"
        >
          <div className="mb-4 flex justify-end">
            <select
              value={comparison}
              onChange={(e) => setComparison(e.target.value)}
              className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs outline-none"
            >
              <option>Previous Month</option>
              <option>Same Month Last Year</option>
            </select>
          </div>

          <div className="space-y-5">
            {[
              {
                label: "Room Revenue",
                current: selectedData.room,
                previous: previousData.room,
              },
              {
                label: "Restaurant Revenue",
                current: selectedData.restaurant,
                previous: previousData.restaurant,
              },
              {
                label: "Event Revenue",
                current: selectedData.event,
                previous: previousData.event,
              },
              {
                label: "Other Revenue",
                current: selectedData.other,
                previous: previousData.other,
              },
            ].map((item) => {
              const oldValue = comparison === "Previous Month"
                ? item.previous
                : item.previous;

              const change = oldValue
                ? ((item.current - oldValue) / oldValue) * 100
                : 0;

              return (
                <div key={item.label}>
                  <div className="mb-2 flex items-center justify-between">
                    <span className="text-sm font-medium text-slate-700">
                      {item.label}
                    </span>
                    <span className="text-sm font-semibold text-slate-800">
                      {money(item.current)}
                    </span>
                  </div>
                  <div className="h-2 overflow-hidden rounded-full bg-slate-100">
                    <div
                      className="h-full rounded-full bg-blue-500"
                      style={{
                        width: `${(item.current / maxRevenue) * 100}%`,
                      }}
                    />
                  </div>
                  <p
                    className={`mt-1 text-xs ${
                      change >= 0 ? "text-green-600" : "text-red-600"
                    }`}
                  >
                    {change >= 0 ? "+" : ""}
                    {change.toFixed(1)}% compared with reference month
                  </p>
                </div>
              );
            })}
          </div>

          {comparison === "Same Month Last Year" && (
            <p className="mt-4 rounded-lg bg-yellow-50 p-3 text-xs text-yellow-800">
              Last-year comparison data is not available in this demo. The displayed comparison currently uses the previous month's sample values.
            </p>
          )}
        </SectionCard>

        <SectionCard
          title="Revenue Trend Summary"
          subtitle="Monthly total revenue performance"
        >
          <div className="space-y-3">
            {totalTrend.map((item, index) => {
              const previous = totalTrend[index - 1]?.total;
              const change = previous
                ? ((item.total - previous) / previous) * 100
                : 0;

              return (
                <div
                  key={item.month}
                  className="flex items-center justify-between rounded-lg border border-slate-100 p-3"
                >
                  <div className="flex items-center gap-3">
                    <div className="rounded-lg bg-blue-50 p-2 text-blue-600">
                      <CalendarDays size={17} />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-slate-700">
                        {item.month} 2026
                      </p>
                      <p className="text-xs text-slate-400">
                        Monthly revenue
                      </p>
                    </div>
                  </div>

                  <div className="text-right">
                    <p className="text-sm font-semibold text-slate-800">
                      {money(item.total)}
                    </p>
                    <p
                      className={`text-xs ${
                        change >= 0 ? "text-green-600" : "text-red-600"
                      }`}
                    >
                      {index === 0
                        ? "Starting month"
                        : `${change >= 0 ? "+" : ""}${change.toFixed(1)}%`}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </SectionCard>
      </div>

      {/* Operational Summary */}
      <SectionCard
        title="Revenue Calculation Reference"
        subtitle="Understand how the hotel performance metrics are calculated"
      >
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          <div className="rounded-lg bg-blue-50 p-4">
            <BedDouble className="mb-3 text-blue-600" size={22} />
            <h3 className="font-semibold text-slate-800">ADR</h3>
            <p className="mt-2 text-sm text-slate-600">
              Average room selling price for each occupied room night.
            </p>
            <p className="mt-3 text-xs font-medium text-blue-700">
              Room Revenue ÷ Occupied Room Nights
            </p>
          </div>

          <div className="rounded-lg bg-green-50 p-4">
            <TrendingUp className="mb-3 text-green-600" size={22} />
            <h3 className="font-semibold text-slate-800">RevPAR</h3>
            <p className="mt-2 text-sm text-slate-600">
              Revenue generated per available room night, including unoccupied rooms.
            </p>
            <p className="mt-3 text-xs font-medium text-green-700">
              Room Revenue ÷ Available Room Nights
            </p>
          </div>

          <div className="rounded-lg bg-purple-50 p-4">
            <Users className="mb-3 text-purple-600" size={22} />
            <h3 className="font-semibold text-slate-800">Occupancy</h3>
            <p className="mt-2 text-sm text-slate-600">
              Percentage of available room nights sold to guests.
            </p>
            <p className="mt-3 text-xs font-medium text-purple-700">
              Occupied Room Nights ÷ Available Room Nights × 100
            </p>
          </div>
        </div>
      </SectionCard>

      <p className="text-xs text-slate-400">
        Demo dashboard: revenue, occupancy and monthly figures are sample values.
        Live figures will be calculated from reservations, checkout bills,
        restaurant orders, event bookings and payments after backend integration.
      </p>
    </div>
  );
}
