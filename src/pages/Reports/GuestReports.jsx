
import { useMemo, useState } from "react";
import {
  Users,
  UserPlus,
  Repeat2,
  Crown,
  Wallet,
  Star,
  TrendingUp,
  Download,
  Printer,
  Filter,
  RefreshCw,
  Search,
  ArrowUpRight,
  ArrowDownRight,
  Heart,
  Award,
  MessageSquare,
  CalendarDays,
} from "lucide-react";

const guests = [
  { id: "GST-1001", name: "Aarav Sharma", email: "aarav@example.com", city: "Delhi", visits: 5, spending: 48500, type: "Returning", vip: true, loyalty: "Gold", satisfaction: 5, joined: "2026-01-15" },
  { id: "GST-1002", name: "Priya Verma", email: "priya@example.com", city: "Jaipur", visits: 1, spending: 12000, type: "New", vip: false, loyalty: "Silver", satisfaction: 4, joined: "2026-11-02" },
  { id: "GST-1003", name: "Rahul Mehta", email: "rahul@example.com", city: "Mumbai", visits: 8, spending: 92500, type: "Returning", vip: true, loyalty: "Platinum", satisfaction: 5, joined: "2025-09-10" },
  { id: "GST-1004", name: "Neha Singh", email: "neha@example.com", city: "Gurugram", visits: 2, spending: 22500, type: "Returning", vip: false, loyalty: "Silver", satisfaction: 4, joined: "2026-05-12" },
  { id: "GST-1005", name: "Karan Patel", email: "karan@example.com", city: "Ahmedabad", visits: 1, spending: 8500, type: "New", vip: false, loyalty: "Bronze", satisfaction: 3, joined: "2026-11-04" },
  { id: "GST-1006", name: "Ananya Gupta", email: "ananya@example.com", city: "Noida", visits: 6, spending: 67500, type: "Returning", vip: true, loyalty: "Gold", satisfaction: 5, joined: "2025-12-20" },
  { id: "GST-1007", name: "Vikram Rao", email: "vikram@example.com", city: "Pune", visits: 1, spending: 9500, type: "New", vip: false, loyalty: "Bronze", satisfaction: 4, joined: "2026-11-06" },
  { id: "GST-1008", name: "Isha Kapoor", email: "isha@example.com", city: "Chandigarh", visits: 4, spending: 42000, type: "Returning", vip: true, loyalty: "Gold", satisfaction: 5, joined: "2026-02-18" },
  { id: "GST-1009", name: "Rohan Das", email: "rohan@example.com", city: "Kolkata", visits: 1, spending: 11000, type: "New", vip: false, loyalty: "Silver", satisfaction: 3, joined: "2026-11-08" },
  { id: "GST-1010", name: "Meera Joshi", email: "meera@example.com", city: "Jaipur", visits: 10, spending: 118000, type: "Returning", vip: true, loyalty: "Platinum", satisfaction: 5, joined: "2025-07-14" },
  { id: "GST-1011", name: "Arjun Nair", email: "arjun@example.com", city: "Kochi", visits: 3, spending: 28500, type: "Returning", vip: false, loyalty: "Silver", satisfaction: 4, joined: "2026-03-11" },
  { id: "GST-1012", name: "Simran Kaur", email: "simran@example.com", city: "Delhi", visits: 1, spending: 14500, type: "New", vip: false, loyalty: "Silver", satisfaction: 5, joined: "2026-11-10" },
];

const money = (value) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(value);

const loyaltyColors = {
  Bronze: "bg-orange-50 text-orange-700",
  Silver: "bg-slate-100 text-slate-700",
  Gold: "bg-amber-50 text-amber-700",
  Platinum: "bg-indigo-50 text-indigo-700",
};

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

function LoyaltyBadge({ level }) {
  return (
    <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${loyaltyColors[level] || "bg-slate-100 text-slate-600"}`}>
      {level}
    </span>
  );
}

function Stars({ rating }) {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          size={14}
          className={star <= rating ? "fill-amber-400 text-amber-400" : "text-slate-200"}
        />
      ))}
      <span className="ml-1 text-xs text-slate-500">{rating}/5</span>
    </div>
  );
}

export default function GuestReports() {
  const [search, setSearch] = useState("");
  const [guestType, setGuestType] = useState("All");
  const [loyaltyFilter, setLoyaltyFilter] = useState("All");
  const [vipFilter, setVipFilter] = useState("All");
  const [satisfactionFilter, setSatisfactionFilter] = useState("All");
  const [period, setPeriod] = useState("all");
  const [startDate, setStartDate] = useState("2026-11-01");
  const [endDate, setEndDate] = useState("2026-11-30");

  const filteredGuests = useMemo(() => {
    const query = search.toLowerCase();

    return guests.filter((guest) => {
      const matchesSearch =
        guest.id.toLowerCase().includes(query) ||
        guest.name.toLowerCase().includes(query) ||
        guest.email.toLowerCase().includes(query) ||
        guest.city.toLowerCase().includes(query);

      const matchesType =
        guestType === "All" || guest.type === guestType;

      const matchesLoyalty =
        loyaltyFilter === "All" || guest.loyalty === loyaltyFilter;

      const matchesVIP =
        vipFilter === "All" ||
        (vipFilter === "VIP" && guest.vip) ||
        (vipFilter === "Regular" && !guest.vip);

      const matchesSatisfaction =
        satisfactionFilter === "All" ||
        guest.satisfaction === Number(satisfactionFilter);

      let matchesPeriod = true;

      if (period === "custom") {
        matchesPeriod = guest.joined >= startDate && guest.joined <= endDate;
      } else if (period === "november") {
        matchesPeriod = guest.joined.startsWith("2026-11");
      } else if (period === "october") {
        matchesPeriod = guest.joined.startsWith("2026-10");
      }

      return (
        matchesSearch &&
        matchesType &&
        matchesLoyalty &&
        matchesVIP &&
        matchesSatisfaction &&
        matchesPeriod
      );
    });
  }, [
    search,
    guestType,
    loyaltyFilter,
    vipFilter,
    satisfactionFilter,
    period,
    startDate,
    endDate,
  ]);

  const stats = useMemo(() => {
    const total = filteredGuests.length;
    const newGuests = filteredGuests.filter((g) => g.type === "New").length;
    const returning = filteredGuests.filter((g) => g.type === "Returning").length;
    const vip = filteredGuests.filter((g) => g.vip).length;
    const spending = filteredGuests.reduce((sum, g) => sum + g.spending, 0);
    const averageSpending = total ? spending / total : 0;
    const averageRating = total
      ? filteredGuests.reduce((sum, g) => sum + g.satisfaction, 0) / total
      : 0;

    return {
      total,
      newGuests,
      returning,
      vip,
      spending,
      averageSpending,
      averageRating,
    };
  }, [filteredGuests]);

  const loyaltyData = useMemo(() => {
    const levels = ["Bronze", "Silver", "Gold", "Platinum"];

    return levels.map((level) => ({
      level,
      count: filteredGuests.filter((g) => g.loyalty === level).length,
    }));
  }, [filteredGuests]);

  const satisfactionData = useMemo(() => {
    return [5, 4, 3, 2, 1].map((rating) => ({
      rating,
      count: filteredGuests.filter((g) => g.satisfaction === rating).length,
    }));
  }, [filteredGuests]);

  const cityData = useMemo(() => {
    const cities = {};

    filteredGuests.forEach((guest) => {
      cities[guest.city] = (cities[guest.city] || 0) + 1;
    });

    return Object.entries(cities)
      .map(([city, count]) => ({ city, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);
  }, [filteredGuests]);

  const maxLoyalty = Math.max(...loyaltyData.map((d) => d.count), 1);
  const maxSatisfaction = Math.max(...satisfactionData.map((d) => d.count), 1);
  const maxCity = Math.max(...cityData.map((d) => d.count), 1);

  const clearFilters = () => {
    setSearch("");
    setGuestType("All");
    setLoyaltyFilter("All");
    setVipFilter("All");
    setSatisfactionFilter("All");
    setPeriod("all");
    setStartDate("2026-11-01");
    setEndDate("2026-11-30");
  };

  const exportCSV = () => {
    const headers = [
      "Guest ID",
      "Guest Name",
      "Email",
      "City",
      "Visits",
      "Total Spending",
      "Guest Type",
      "VIP",
      "Loyalty Level",
      "Satisfaction",
      "Joined Date",
    ];

    const rows = filteredGuests.map((g) => [
      g.id,
      g.name,
      g.email,
      g.city,
      g.visits,
      g.spending,
      g.type,
      g.vip ? "Yes" : "No",
      g.loyalty,
      g.satisfaction,
      g.joined,
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
    link.download = "guest-report.csv";
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
              <span className="font-medium text-indigo-600">Guest Reports</span>
            </div>
            <h1 className="mt-2 text-2xl font-bold text-slate-900 md:text-3xl">
              Guest Reports
            </h1>
            <p className="mt-1 text-sm text-slate-500">
              Understand guest growth, loyalty, spending patterns and satisfaction.
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
              onClick={exportCSV}
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
            <button
              onClick={clearFilters}
              className="flex items-center gap-1 text-sm font-medium text-indigo-600"
            >
              <RefreshCw size={14} /> Reset filters
            </button>
          </div>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-5">
            <div className="relative">
              <Search size={17} className="absolute left-3 top-3 text-slate-400" />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search guest, ID or city"
                className="w-full rounded-xl border border-slate-200 py-2.5 pl-10 pr-3 text-sm outline-none focus:border-indigo-400"
              />
            </div>

            <select
              value={period}
              onChange={(e) => setPeriod(e.target.value)}
              className="rounded-xl border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-indigo-400"
            >
              <option value="all">All join dates</option>
              <option value="november">November 2026</option>
              <option value="october">October 2026</option>
              <option value="custom">Custom date range</option>
            </select>

            <select
              value={guestType}
              onChange={(e) => setGuestType(e.target.value)}
              className="rounded-xl border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-indigo-400"
            >
              <option value="All">All guest types</option>
              <option value="New">New guests</option>
              <option value="Returning">Returning guests</option>
            </select>

            <select
              value={vipFilter}
              onChange={(e) => setVipFilter(e.target.value)}
              className="rounded-xl border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-indigo-400"
            >
              <option value="All">VIP and regular</option>
              <option value="VIP">VIP guests</option>
              <option value="Regular">Regular guests</option>
            </select>

            <select
              value={loyaltyFilter}
              onChange={(e) => setLoyaltyFilter(e.target.value)}
              className="rounded-xl border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-indigo-400"
            >
              <option value="All">All loyalty levels</option>
              <option value="Bronze">Bronze</option>
              <option value="Silver">Silver</option>
              <option value="Gold">Gold</option>
              <option value="Platinum">Platinum</option>
            </select>
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

          <div className="mt-3 max-w-xs">
            <select
              value={satisfactionFilter}
              onChange={(e) => setSatisfactionFilter(e.target.value)}
              className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-indigo-400"
            >
              <option value="All">All satisfaction ratings</option>
              <option value="5">5 star</option>
              <option value="4">4 star</option>
              <option value="3">3 star</option>
              <option value="2">2 star</option>
              <option value="1">1 star</option>
            </select>
          </div>
        </div>

        {/* KPI cards */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <MetricCard
            title="Total Guests"
            value={stats.total}
            subtitle="Guests matching selected filters"
            icon={Users}
            trend="+12.5%"
            positive
          />
          <MetricCard
            title="New Guests"
            value={stats.newGuests}
            subtitle="First-time guest records"
            icon={UserPlus}
            trend="+18.2%"
            positive
          />
          <MetricCard
            title="Returning Guests"
            value={stats.returning}
            subtitle="Guests with repeat visits"
            icon={Repeat2}
            trend="+9.4%"
            positive
          />
          <MetricCard
            title="VIP Guests"
            value={stats.vip}
            subtitle="VIP guests in current selection"
            icon={Crown}
            trend="+6.8%"
            positive
          />
        </div>

        {/* Spending and satisfaction */}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          <div className="rounded-2xl border border-slate-200 bg-white p-5">
            <div className="flex items-center justify-between">
              <p className="text-sm text-slate-500">Total guest spending</p>
              <Wallet size={20} className="text-emerald-600" />
            </div>
            <p className="mt-2 text-2xl font-bold text-slate-900">{money(stats.spending)}</p>
            <p className="mt-1 text-xs text-slate-400">Sample lifetime spending total</p>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-white p-5">
            <div className="flex items-center justify-between">
              <p className="text-sm text-slate-500">Average spending per guest</p>
              <TrendingUp size={20} className="text-indigo-600" />
            </div>
            <p className="mt-2 text-2xl font-bold text-slate-900">{money(stats.averageSpending)}</p>
            <p className="mt-1 text-xs text-slate-400">Total spending ÷ selected guests</p>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-white p-5">
            <div className="flex items-center justify-between">
              <p className="text-sm text-slate-500">Average satisfaction</p>
              <Star size={20} className="fill-amber-400 text-amber-400" />
            </div>
            <p className="mt-2 text-2xl font-bold text-slate-900">
              {stats.averageRating.toFixed(1)} / 5
            </p>
            <p className="mt-1 text-xs text-slate-400">Average sample guest rating</p>
          </div>
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 gap-5 xl:grid-cols-2">
          {/* Loyalty */}
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="mb-5">
              <h2 className="font-bold text-slate-900">Loyalty Program Distribution</h2>
              <p className="mt-1 text-sm text-slate-500">
                Guests by membership tier
              </p>
            </div>

            <div className="space-y-5">
              {loyaltyData.map((item) => (
                <div key={item.level}>
                  <div className="mb-2 flex items-center justify-between text-sm">
                    <LoyaltyBadge level={item.level} />
                    <span className="font-semibold text-slate-700">{item.count} guests</span>
                  </div>
                  <div className="h-3 overflow-hidden rounded-full bg-slate-100">
                    <div
                      className="h-full rounded-full bg-indigo-500 transition-all"
                      style={{ width: `${(item.count / maxLoyalty) * 100}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Satisfaction */}
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="mb-5">
              <h2 className="font-bold text-slate-900">Guest Satisfaction</h2>
              <p className="mt-1 text-sm text-slate-500">
                Distribution of guest feedback ratings
              </p>
            </div>

            <div className="space-y-4">
              {satisfactionData.map((item) => (
                <div key={item.rating} className="flex items-center gap-3">
                  <span className="flex w-12 items-center gap-1 text-sm font-medium text-slate-600">
                    {item.rating} <Star size={13} className="fill-amber-400 text-amber-400" />
                  </span>
                  <div className="h-3 flex-1 overflow-hidden rounded-full bg-slate-100">
                    <div
                      className="h-full rounded-full bg-amber-400"
                      style={{ width: `${(item.count / maxSatisfaction) * 100}%` }}
                    />
                  </div>
                  <span className="w-7 text-right text-sm font-semibold text-slate-700">
                    {item.count}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Guest locations */}
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="mb-5 flex items-center gap-2">
            <Heart size={20} className="text-rose-500" />
            <div>
              <h2 className="font-bold text-slate-900">Guest City Distribution</h2>
              <p className="mt-1 text-sm text-slate-500">
                Top guest cities in the selected dataset
              </p>
            </div>
          </div>

          <div className="space-y-4">
            {cityData.map((item) => (
              <div key={item.city} className="flex items-center gap-3">
                <span className="w-28 text-sm font-medium text-slate-700">{item.city}</span>
                <div className="h-3 flex-1 overflow-hidden rounded-full bg-slate-100">
                  <div
                    className="h-full rounded-full bg-sky-500"
                    style={{ width: `${(item.count / maxCity) * 100}%` }}
                  />
                </div>
                <span className="w-8 text-right text-sm font-semibold text-slate-700">{item.count}</span>
              </div>
            ))}
            {cityData.length === 0 && (
              <p className="text-sm text-slate-500">No city data available for these filters.</p>
            )}
          </div>
        </div>

        {/* Guest records */}
        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="flex flex-col justify-between gap-3 border-b border-slate-100 p-5 sm:flex-row sm:items-center">
            <div>
              <h2 className="font-bold text-slate-900">Guest Details Report</h2>
              <p className="mt-1 text-sm text-slate-500">
                Showing {filteredGuests.length} of {guests.length} guest records
              </p>
            </div>
            <button
              onClick={exportCSV}
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"
            >
              <Download size={16} /> Download report
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full min-w-[1100px] text-left text-sm">
              <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
                <tr>
                  <th className="px-5 py-4 font-semibold">Guest</th>
                  <th className="px-5 py-4 font-semibold">City</th>
                  <th className="px-5 py-4 font-semibold">Visits</th>
                  <th className="px-5 py-4 font-semibold">Total Spending</th>
                  <th className="px-5 py-4 font-semibold">Guest Type</th>
                  <th className="px-5 py-4 font-semibold">VIP</th>
                  <th className="px-5 py-4 font-semibold">Loyalty</th>
                  <th className="px-5 py-4 font-semibold">Satisfaction</th>
                  <th className="px-5 py-4 font-semibold">Joined</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredGuests.map((guest) => (
                  <tr key={guest.id} className="transition hover:bg-slate-50">
                    <td className="px-5 py-4">
                      <div className="font-semibold text-slate-800">{guest.name}</div>
                      <div className="mt-1 text-xs text-slate-400">{guest.id} · {guest.email}</div>
                    </td>
                    <td className="px-5 py-4 text-slate-600">{guest.city}</td>
                    <td className="px-5 py-4 text-slate-700">{guest.visits}</td>
                    <td className="px-5 py-4 font-semibold text-slate-800">{money(guest.spending)}</td>
                    <td className="px-5 py-4">
                      <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${guest.type === "New" ? "bg-blue-50 text-blue-700" : "bg-purple-50 text-purple-700"}`}>
                        {guest.type}
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      {guest.vip ? (
                        <span className="inline-flex items-center gap-1 font-semibold text-amber-600">
                          <Crown size={14} /> VIP
                        </span>
                      ) : (
                        <span className="text-slate-400">Regular</span>
                      )}
                    </td>
                    <td className="px-5 py-4"><LoyaltyBadge level={guest.loyalty} /></td>
                    <td className="px-5 py-4"><Stars rating={guest.satisfaction} /></td>
                    <td className="px-5 py-4 text-slate-600">
                      {new Date(`${guest.joined}T00:00:00`).toLocaleDateString("en-IN")}
                    </td>
                  </tr>
                ))}

                {filteredGuests.length === 0 && (
                  <tr>
                    <td colSpan="9" className="px-5 py-12 text-center">
                      <Search size={28} className="mx-auto text-slate-300" />
                      <p className="mt-3 font-semibold text-slate-700">No guests found</p>
                      <p className="mt-1 text-sm text-slate-500">Try changing your search or filters.</p>
                      <button onClick={clearFilters} className="mt-3 text-sm font-semibold text-indigo-600">
                        Clear filters
                      </button>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Summary */}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div className="rounded-2xl border border-slate-200 bg-white p-5">
            <div className="flex items-center gap-2">
              <Award size={20} className="text-amber-500" />
              <h2 className="font-bold text-slate-900">Guest Retention</h2>
            </div>
            <p className="mt-3 text-2xl font-bold text-slate-900">
              {stats.total ? ((stats.returning / stats.total) * 100).toFixed(1) : "0.0"}%
            </p>
            <p className="mt-1 text-sm text-slate-500">
              Returning guests as a share of selected guests
            </p>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-5">
            <div className="flex items-center gap-2">
              <MessageSquare size={20} className="text-indigo-500" />
              <h2 className="font-bold text-slate-900">Satisfaction Overview</h2>
            </div>
            <p className="mt-3 text-2xl font-bold text-slate-900">
              {stats.total
                ? ((filteredGuests.filter((g) => g.satisfaction >= 4).length / stats.total) * 100).toFixed(1)
                : "0.0"}%
            </p>
            <p className="mt-1 text-sm text-slate-500">
              Selected guests with ratings of 4 or 5 stars
            </p>
          </div>
        </div>

        <div className="rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800">
          <strong>Demo data:</strong> Guest records, spending, VIP labels, loyalty tiers and satisfaction ratings are illustrative. The date filter uses guest join dates, not stay dates. Connect guest, reservation, loyalty and feedback APIs for live reporting.
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
