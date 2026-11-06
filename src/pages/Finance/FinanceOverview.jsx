
import { useMemo, useState } from "react";
import {
  Wallet,
  TrendingUp,
  TrendingDown,
  CreditCard,
  Receipt,
  RefreshCcw,
  FileText,
  ArrowUpRight,
  ArrowDownRight,
  CalendarDays,
  Download,
  Search,
  Filter,
  IndianRupee,
  Building2,
  CircleDollarSign,
  X,
  Eye,
  ChevronDown,
} from "lucide-react";

const monthlyData = [
  { month: "May", revenue: 385000, expenses: 210000 },
  { month: "Jun", revenue: 420000, expenses: 225000 },
  { month: "Jul", revenue: 460000, expenses: 238000 },
  { month: "Aug", revenue: 435000, expenses: 230000 },
  { month: "Sep", revenue: 510000, expenses: 265000 },
  { month: "Oct", revenue: 550000, expenses: 280000 },
  { month: "Nov", revenue: 485000, expenses: 245000 },
];

const initialTransactions = [
  {
    id: "TXN-1001",
    date: "2026-11-06",
    description: "Room booking payment",
    reference: "INV-2026-001",
    customer: "Rahul Sharma",
    type: "Income",
    category: "Room Revenue",
    amount: 12500,
    status: "Completed",
    mode: "UPI",
  },
  {
    id: "TXN-1002",
    date: "2026-11-06",
    description: "Restaurant payment",
    reference: "INV-2026-002",
    customer: "Priya Verma",
    type: "Income",
    category: "Restaurant",
    amount: 3200,
    status: "Completed",
    mode: "Card",
  },
  {
    id: "TXN-1003",
    date: "2026-11-05",
    description: "Electricity bill",
    reference: "EXP-2026-031",
    customer: "Haryana Power",
    type: "Expense",
    category: "Utilities",
    amount: 18500,
    status: "Paid",
    mode: "Bank Transfer",
  },
  {
    id: "TXN-1004",
    date: "2026-11-05",
    description: "Room booking balance",
    reference: "INV-2026-003",
    customer: "Amit Kumar",
    type: "Income",
    category: "Room Revenue",
    amount: 8500,
    status: "Pending",
    mode: "Pending",
  },
  {
    id: "TXN-1005",
    date: "2026-11-04",
    description: "Housekeeping supplies",
    reference: "EXP-2026-030",
    customer: "CleanPro Distributors",
    type: "Expense",
    category: "Housekeeping",
    amount: 6400,
    status: "Paid",
    mode: "UPI",
  },
  {
    id: "TXN-1006",
    date: "2026-11-04",
    description: "Guest cancellation refund",
    reference: "REF-2026-008",
    customer: "Neha Singh",
    type: "Refund",
    category: "Refund",
    amount: 2500,
    status: "Completed",
    mode: "UPI",
  },
  {
    id: "TXN-1007",
    date: "2026-11-03",
    description: "Staff salary payment",
    reference: "EXP-2026-029",
    customer: "Hotel Payroll",
    type: "Expense",
    category: "Salary",
    amount: 42000,
    status: "Paid",
    mode: "Bank Transfer",
  },
];

const formatCurrency = (amount) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount || 0);

const formatCompact = (amount) => {
  if (amount >= 100000) return `₹${(amount / 100000).toFixed(1)}L`;
  if (amount >= 1000) return `₹${(amount / 1000).toFixed(1)}K`;
  return `₹${amount}`;
};

const inputClass =
  "w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100";

function StatCard({
  title,
  value,
  subtitle,
  icon: Icon,
  color,
  trend,
  trendLabel,
}) {
  const colors = {
    blue: "bg-blue-50 text-blue-600",
    green: "bg-emerald-50 text-emerald-600",
    red: "bg-red-50 text-red-600",
    amber: "bg-amber-50 text-amber-600",
    purple: "bg-purple-50 text-purple-600",
  };

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-sm text-slate-500">{title}</p>
          <h3 className="mt-2 text-2xl font-bold text-slate-900">
            {value}
          </h3>
          <p className="mt-1 text-xs text-slate-400">{subtitle}</p>
        </div>
        <div className={`rounded-xl p-3 ${colors[color]}`}>
          <Icon size={22} />
        </div>
      </div>

      {trend && (
        <div className="mt-4 flex items-center gap-1.5">
          <span
            className={`flex items-center gap-1 text-xs font-semibold ${
              trend.startsWith("-") ? "text-red-600" : "text-emerald-600"
            }`}
          >
            {trend.startsWith("-") ? (
              <TrendingDown size={14} />
            ) : (
              <TrendingUp size={14} />
            )}
            {trend}
          </span>
          <span className="text-xs text-slate-400">{trendLabel}</span>
        </div>
      )}
    </div>
  );
}

function SectionHeading({ title, subtitle, action }) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-3">
      <div>
        <h2 className="font-semibold text-slate-900">{title}</h2>
        {subtitle && (
          <p className="mt-1 text-xs text-slate-500">{subtitle}</p>
        )}
      </div>
      {action}
    </div>
  );
}

function StatusBadge({ status }) {
  const styles = {
    Completed: "bg-emerald-50 text-emerald-700",
    Paid: "bg-emerald-50 text-emerald-700",
    Pending: "bg-amber-50 text-amber-700",
    Failed: "bg-red-50 text-red-700",
  };

  return (
    <span
      className={`rounded-full px-2.5 py-1 text-xs font-semibold ${
        styles[status] || "bg-slate-100 text-slate-600"
      }`}
    >
      {status}
    </span>
  );
}

export default function FinanceOverview() {
  const [transactions] = useState(initialTransactions);
  const [period, setPeriod] = useState("This Month");
  const [transactionSearch, setTransactionSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("All");
  const [selectedTransaction, setSelectedTransaction] = useState(null);
  const [showAllTransactions, setShowAllTransactions] = useState(false);

  const financeStats = {
    revenue: 485000,
    expenses: 245000,
    pending: 38500,
    collected: 446500,
    refunds: 12500,
    taxCollected: 58200,
    taxPayable: 31400,
  };

  const netIncome = financeStats.revenue - financeStats.expenses;

  const filteredTransactions = useMemo(() => {
    const search = transactionSearch.toLowerCase();

    return transactions.filter((transaction) => {
      const matchesSearch =
        transaction.id.toLowerCase().includes(search) ||
        transaction.description.toLowerCase().includes(search) ||
        transaction.customer.toLowerCase().includes(search) ||
        transaction.reference.toLowerCase().includes(search);

      const matchesType =
        typeFilter === "All" || transaction.type === typeFilter;

      return matchesSearch && matchesType;
    });
  }, [transactions, transactionSearch, typeFilter]);

  const visibleTransactions = showAllTransactions
    ? filteredTransactions
    : filteredTransactions.slice(0, 5);

  const maxChartValue = Math.max(
    ...monthlyData.map((item) => item.revenue)
  );

  const totalMonthlyRevenue = monthlyData.reduce(
    (sum, item) => sum + item.revenue,
    0
  );

  const totalMonthlyExpenses = monthlyData.reduce(
    (sum, item) => sum + item.expenses,
    0
  );

  const revenueShare =
    (financeStats.collected / financeStats.revenue) * 100;

  const expenseCategories = [
    { name: "Staff Salaries", amount: 95000, color: "bg-blue-500" },
    { name: "Utilities", amount: 48000, color: "bg-purple-500" },
    { name: "Inventory & Supplies", amount: 42000, color: "bg-amber-500" },
    { name: "Maintenance", amount: 35000, color: "bg-emerald-500" },
    { name: "Other Expenses", amount: 25000, color: "bg-slate-400" },
  ];

  const totalCategoryExpenses = expenseCategories.reduce(
    (sum, category) => sum + category.amount,
    0
  );

  const exportTransactions = () => {
    const headers = [
      "Transaction ID",
      "Date",
      "Description",
      "Reference",
      "Customer",
      "Type",
      "Category",
      "Amount",
      "Status",
      "Payment Mode",
    ];

    const rows = filteredTransactions.map((item) => [
      item.id,
      item.date,
      item.description,
      item.reference,
      item.customer,
      item.type,
      item.category,
      item.amount,
      item.status,
      item.mode,
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
    link.download = "finance-transactions.csv";
    link.click();
    URL.revokeObjectURL(url);
  };

  const quickLinks = [
    {
      title: "Invoices",
      description: "Create and manage guest invoices",
      icon: FileText,
      path: "/finance/invoices",
      color: "text-blue-600 bg-blue-50",
    },
    {
      title: "Payments",
      description: "View payment records and receipts",
      icon: CreditCard,
      path: "/finance/payments",
      color: "text-emerald-600 bg-emerald-50",
    },
    {
      title: "Refunds",
      description: "Manage refund requests and approvals",
      icon: RefreshCcw,
      path: "/finance/refunds",
      color: "text-purple-600 bg-purple-50",
    },
    {
      title: "Expenses",
      description: "Track hotel operating expenses",
      icon: Receipt,
      path: "/finance/expenses",
      color: "text-orange-600 bg-orange-50",
    },
    {
      title: "Taxes & Charges",
      description: "Manage tax rates and service charges",
      icon: IndianRupee,
      path: "/finance/taxes",
      color: "text-amber-600 bg-amber-50",
    },
    {
      title: "Cash Book",
      description: "Manage daily cash transactions",
      icon: Wallet,
      path: "/finance/cash-book",
      color: "text-cyan-600 bg-cyan-50",
    },
  ];

  return (
    <div className="min-h-screen w-full bg-slate-50 p-2 md:p-4">
      <div className="w-full space-y-5">

        {/* Header */}
        <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
          <div className="flex items-center gap-3">
            <div className="rounded-xl bg-blue-100 p-3 text-blue-600">
              <Wallet size={25} />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-slate-900">
                Finance & Accounting
              </h1>
              <p className="mt-1 text-sm text-slate-500">
                Monitor hotel revenue, expenses, payments and financial performance.
              </p>
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            <div className="relative">
              <CalendarDays
                size={16}
                className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
              />
              <select
                value={period}
                onChange={(e) => setPeriod(e.target.value)}
                className={`${inputClass} min-w-40 pl-9`}
              >
                <option>This Month</option>
                <option>Last Month</option>
                <option>Last 3 Months</option>
                <option>Last 6 Months</option>
                <option>This Year</option>
              </select>
            </div>

            <button
              onClick={exportTransactions}
              className="flex items-center gap-2 rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50"
            >
              <Download size={16} />
              Export
            </button>
          </div>
        </div>

        {/* Main Stats */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <StatCard
            title="Total Revenue"
            value={formatCurrency(financeStats.revenue)}
            subtitle="Revenue generated"
            icon={TrendingUp}
            color="green"
            trend="+12.8%"
            trendLabel="vs last month"
          />

          <StatCard
            title="Total Expenses"
            value={formatCurrency(financeStats.expenses)}
            subtitle="Operating expenses"
            icon={TrendingDown}
            color="red"
            trend="+4.2%"
            trendLabel="vs last month"
          />

          <StatCard
            title="Net Income"
            value={formatCurrency(netIncome)}
            subtitle="Revenue minus expenses"
            icon={CircleDollarSign}
            color="blue"
            trend="+18.5%"
            trendLabel="vs last month"
          />

          <StatCard
            title="Pending Payments"
            value={formatCurrency(financeStats.pending)}
            subtitle="Awaiting collection"
            icon={ClockIcon}
            color="amber"
            trendLabel="Outstanding balance"
          />
        </div>

        {/* Payment Stats */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <StatCard
            title="Collected Payments"
            value={formatCurrency(financeStats.collected)}
            subtitle="Successfully collected"
            icon={CreditCard}
            color="green"
          />

          <StatCard
            title="Total Refunds"
            value={formatCurrency(financeStats.refunds)}
            subtitle="Refunds processed"
            icon={RefreshCcw}
            color="purple"
          />

          <StatCard
            title="Tax Collected"
            value={formatCurrency(financeStats.taxCollected)}
            subtitle="Tax collected from transactions"
            icon={IndianRupee}
            color="blue"
          />
        </div>

        {/* Revenue and Expenses Chart */}
        <div className="grid grid-cols-1 gap-5 xl:grid-cols-3">
          <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm xl:col-span-2">
            <SectionHeading
              title="Revenue & Expenses"
              subtitle="Monthly financial performance"
              action={
                <span className="rounded-lg bg-slate-50 px-3 py-1.5 text-xs text-slate-500">
                  {period}
                </span>
              }
            />

            <div className="mt-5 flex flex-wrap gap-4">
              <div className="flex items-center gap-2 text-xs text-slate-600">
                <span className="h-2.5 w-2.5 rounded-sm bg-blue-500" />
                Revenue
              </div>
              <div className="flex items-center gap-2 text-xs text-slate-600">
                <span className="h-2.5 w-2.5 rounded-sm bg-orange-400" />
                Expenses
              </div>
            </div>

            <div className="mt-6 flex h-64 items-end justify-between gap-2 border-b border-slate-200 px-1 sm:gap-4">
              {monthlyData.map((item) => (
                <div
                  key={item.month}
                  className="flex h-full flex-1 flex-col items-center justify-end"
                >
                  <div className="mb-2 flex h-full w-full items-end justify-center gap-1">
                    <div
                      title={`Revenue: ${formatCurrency(item.revenue)}`}
                      className="w-[42%] rounded-t-md bg-blue-500 transition hover:bg-blue-600"
                      style={{
                        height: `${(item.revenue / maxChartValue) * 85}%`,
                      }}
                    />
                    <div
                      title={`Expenses: ${formatCurrency(item.expenses)}`}
                      className="w-[42%] rounded-t-md bg-orange-400 transition hover:bg-orange-500"
                      style={{
                        height: `${(item.expenses / maxChartValue) * 85}%`,
                      }}
                    />
                  </div>
                  <span className="pb-2 text-xs text-slate-500">
                    {item.month}
                  </span>
                </div>
              ))}
            </div>

            <div className="mt-4 grid grid-cols-2 gap-3">
              <div className="rounded-lg bg-blue-50 p-3">
                <p className="text-xs text-blue-600">Period Revenue</p>
                <p className="mt-1 text-lg font-bold text-blue-900">
                  {formatCurrency(totalMonthlyRevenue)}
                </p>
              </div>
              <div className="rounded-lg bg-orange-50 p-3">
                <p className="text-xs text-orange-600">Period Expenses</p>
                <p className="mt-1 text-lg font-bold text-orange-900">
                  {formatCurrency(totalMonthlyExpenses)}
                </p>
              </div>
            </div>
          </div>

          {/* Payment Collection */}
          <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
            <SectionHeading
              title="Payment Collection"
              subtitle="Collection against total revenue"
            />

            <div className="mt-7 flex flex-col items-center">
              <div
                className="relative flex h-44 w-44 items-center justify-center rounded-full"
                style={{
                  background: `conic-gradient(#2563eb ${revenueShare}%, #e2e8f0 ${revenueShare}% 100%)`,
                }}
              >
                <div className="flex h-32 w-32 flex-col items-center justify-center rounded-full bg-white">
                  <span className="text-xs text-slate-400">Collected</span>
                  <span className="mt-1 text-2xl font-bold text-slate-900">
                    {Math.round(revenueShare)}%
                  </span>
                </div>
              </div>

              <div className="mt-7 w-full space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="h-2.5 w-2.5 rounded-full bg-blue-600" />
                    <span className="text-sm text-slate-600">Collected</span>
                  </div>
                  <span className="text-sm font-semibold text-slate-900">
                    {formatCurrency(financeStats.collected)}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="h-2.5 w-2.5 rounded-full bg-slate-200" />
                    <span className="text-sm text-slate-600">Pending</span>
                  </div>
                  <span className="text-sm font-semibold text-slate-900">
                    {formatCurrency(financeStats.pending)}
                  </span>
                </div>

                <div className="border-t border-slate-100 pt-3">
                  <div className="flex justify-between">
                    <span className="text-sm font-medium text-slate-600">
                      Total Revenue
                    </span>
                    <span className="text-sm font-bold text-slate-900">
                      {formatCurrency(financeStats.revenue)}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Expense Breakdown and Tax Summary */}
        <div className="grid grid-cols-1 gap-5 xl:grid-cols-2">
          <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
            <SectionHeading
              title="Expense Breakdown"
              subtitle="Operating expense categories"
            />

            <div className="mt-5 space-y-4">
              {expenseCategories.map((category) => {
                const percentage =
                  (category.amount / totalCategoryExpenses) * 100;

                return (
                  <div key={category.name}>
                    <div className="mb-2 flex items-center justify-between gap-2">
                      <span className="text-sm text-slate-600">
                        {category.name}
                      </span>
                      <span className="text-sm font-semibold text-slate-900">
                        {formatCurrency(category.amount)}
                      </span>
                    </div>

                    <div className="h-2.5 overflow-hidden rounded-full bg-slate-100">
                      <div
                        className={`h-full rounded-full ${category.color}`}
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                    <p className="mt-1 text-right text-xs text-slate-400">
                      {percentage.toFixed(1)}%
                    </p>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
            <SectionHeading
              title="Tax Summary"
              subtitle="Tax collection and payable overview"
              action={
                <a
                  href="/finance/taxes"
                  className="text-xs font-semibold text-blue-600 hover:underline"
                >
                  Manage Taxes
                </a>
              }
            />

            <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2">
              <div className="rounded-xl border border-blue-100 bg-blue-50 p-4">
                <div className="flex items-center justify-between">
                  <p className="text-sm text-blue-700">Tax Collected</p>
                  <IndianRupee size={18} className="text-blue-600" />
                </div>
                <h3 className="mt-3 text-2xl font-bold text-blue-950">
                  {formatCurrency(financeStats.taxCollected)}
                </h3>
                <p className="mt-1 text-xs text-blue-700">
                  Tax received from customers
                </p>
              </div>

              <div className="rounded-xl border border-amber-100 bg-amber-50 p-4">
                <div className="flex items-center justify-between">
                  <p className="text-sm text-amber-700">Tax Payable</p>
                  <Receipt size={18} className="text-amber-600" />
                </div>
                <h3 className="mt-3 text-2xl font-bold text-amber-950">
                  {formatCurrency(financeStats.taxPayable)}
                </h3>
                <p className="mt-1 text-xs text-amber-700">
                  Current payable estimate
                </p>
              </div>
            </div>

            <div className="mt-4 rounded-lg border border-slate-200 p-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-slate-600">
                  Estimated Tax Difference
                </span>
                <span className="font-bold text-emerald-600">
                  {formatCurrency(
                    financeStats.taxCollected - financeStats.taxPayable
                  )}
                </span>
              </div>
              <p className="mt-2 text-xs leading-5 text-slate-400">
                This is a sample management summary, not a statutory tax liability calculation.
                Verify applicable GST rules and accounting records before filing.
              </p>
            </div>
          </div>
        </div>

        {/* Recent Transactions */}
        <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
          <div className="border-b border-slate-200 p-4">
            <SectionHeading
              title="Recent Financial Transactions"
              subtitle="Latest income, expenses and refunds"
              action={
                <button
                  onClick={exportTransactions}
                  className="flex items-center gap-2 rounded-lg border border-slate-300 px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50"
                >
                  <Download size={14} />
                  Export CSV
                </button>
              }
            />

            <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
              <div className="relative">
                <Search
                  size={16}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                />
                <input
                  value={transactionSearch}
                  onChange={(e) => setTransactionSearch(e.target.value)}
                  placeholder="Search transaction, customer or reference..."
                  className={`${inputClass} pl-9`}
                />
              </div>

              <select
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value)}
                className={inputClass}
              >
                <option value="All">All Transaction Types</option>
                <option value="Income">Income</option>
                <option value="Expense">Expense</option>
                <option value="Refund">Refund</option>
              </select>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full min-w-[950px] text-left text-sm">
              <thead className="bg-slate-50 text-xs uppercase text-slate-500">
                <tr>
                  <th className="px-4 py-3">Transaction</th>
                  <th className="px-4 py-3">Date</th>
                  <th className="px-4 py-3">Reference</th>
                  <th className="px-4 py-3">Customer / Vendor</th>
                  <th className="px-4 py-3">Type</th>
                  <th className="px-4 py-3">Payment Mode</th>
                  <th className="px-4 py-3">Amount</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3 text-right">Action</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-100">
                {visibleTransactions.map((transaction) => (
                  <tr key={transaction.id} className="hover:bg-slate-50">
                    <td className="px-4 py-3">
                      <p className="font-semibold text-slate-800">
                        {transaction.description}
                      </p>
                      <p className="mt-1 text-xs text-slate-400">
                        {transaction.id}
                      </p>
                    </td>

                    <td className="px-4 py-3 text-slate-600">
                      {transaction.date}
                    </td>

                    <td className="px-4 py-3 font-medium text-blue-600">
                      {transaction.reference}
                    </td>

                    <td className="px-4 py-3 text-slate-600">
                      {transaction.customer}
                    </td>

                    <td className="px-4 py-3">
                      <span
                        className={`rounded-full px-2.5 py-1 text-xs font-semibold ${
                          transaction.type === "Income"
                            ? "bg-emerald-50 text-emerald-700"
                            : transaction.type === "Expense"
                              ? "bg-orange-50 text-orange-700"
                              : "bg-purple-50 text-purple-700"
                        }`}
                      >
                        {transaction.type}
                      </span>
                    </td>

                    <td className="px-4 py-3 text-slate-600">
                      {transaction.mode}
                    </td>

                    <td
                      className={`px-4 py-3 font-bold ${
                        transaction.type === "Income"
                          ? "text-emerald-600"
                          : "text-red-600"
                      }`}
                    >
                      {transaction.type === "Income" ? "+" : "-"}
                      {formatCurrency(transaction.amount)}
                    </td>

                    <td className="px-4 py-3">
                      <StatusBadge status={transaction.status} />
                    </td>

                    <td className="px-4 py-3 text-right">
                      <button
                        onClick={() => setSelectedTransaction(transaction)}
                        className="rounded-lg p-2 text-slate-500 hover:bg-blue-50 hover:text-blue-600"
                        title="View transaction"
                      >
                        <Eye size={16} />
                      </button>
                    </td>
                  </tr>
                ))}

                {visibleTransactions.length === 0 && (
                  <tr>
                    <td colSpan="9" className="px-4 py-12 text-center">
                      <Receipt
                        size={32}
                        className="mx-auto text-slate-300"
                      />
                      <p className="mt-2 font-semibold text-slate-700">
                        No transactions found
                      </p>
                      <p className="mt-1 text-xs text-slate-400">
                        Try changing your search or filter.
                      </p>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {filteredTransactions.length > 5 && (
            <div className="border-t border-slate-200 p-3 text-center">
              <button
                onClick={() => setShowAllTransactions(!showAllTransactions)}
                className="text-sm font-semibold text-blue-600 hover:underline"
              >
                {showAllTransactions ? "Show Less" : "View All Transactions"}
              </button>
            </div>
          )}
        </div>

        {/* Finance Navigation */}
        <div className="space-y-3">
          <SectionHeading
            title="Finance Management"
            subtitle="Access all finance and accounting sections"
          />

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-3">
            {quickLinks.map((link) => {
              const Icon = link.icon;

              return (
                <a
                  key={link.path}
                  href={link.path}
                  className="group flex items-center gap-3 rounded-xl border border-slate-200 bg-white p-4 transition hover:border-blue-200 hover:shadow-sm"
                >
                  <div className={`rounded-xl p-3 ${link.color}`}>
                    <Icon size={21} />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="font-semibold text-slate-800 group-hover:text-blue-600">
                      {link.title}
                    </p>
                    <p className="mt-1 text-xs text-slate-500">
                      {link.description}
                    </p>
                  </div>
                  <ArrowUpRight
                    size={17}
                    className="text-slate-400 group-hover:text-blue-600"
                  />
                </a>
              );
            })}
          </div>
        </div>

        {/* Transaction Details Modal */}
        {selectedTransaction && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 p-3">
            <div className="w-full max-w-lg rounded-2xl bg-white shadow-2xl">
              <div className="flex items-center justify-between border-b border-slate-200 p-5">
                <div>
                  <h2 className="text-lg font-bold text-slate-900">
                    Transaction Details
                  </h2>
                  <p className="mt-1 text-xs text-slate-500">
                    {selectedTransaction.id}
                  </p>
                </div>
                <button
                  onClick={() => setSelectedTransaction(null)}
                  className="rounded-lg p-2 hover:bg-slate-100"
                >
                  <X size={20} />
                </button>
              </div>

              <div className="space-y-3 p-5">
                <div className="rounded-xl bg-slate-50 p-4">
                  <p className="text-xs text-slate-500">Transaction Amount</p>
                  <p
                    className={`mt-1 text-2xl font-bold ${
                      selectedTransaction.type === "Income"
                        ? "text-emerald-600"
                        : "text-red-600"
                    }`}
                  >
                    {selectedTransaction.type === "Income" ? "+" : "-"}
                    {formatCurrency(selectedTransaction.amount)}
                  </p>
                </div>

                {[
                  ["Description", selectedTransaction.description],
                  ["Transaction ID", selectedTransaction.id],
                  ["Reference", selectedTransaction.reference],
                  ["Customer / Vendor", selectedTransaction.customer],
                  ["Date", selectedTransaction.date],
                  ["Transaction Type", selectedTransaction.type],
                  ["Category", selectedTransaction.category],
                  ["Payment Mode", selectedTransaction.mode],
                  ["Status", selectedTransaction.status],
                ].map(([label, value]) => (
                  <div
                    key={label}
                    className="flex justify-between gap-4 border-b border-slate-100 pb-3 text-sm"
                  >
                    <span className="text-slate-500">{label}</span>
                    <span className="text-right font-semibold text-slate-800">
                      {value}
                    </span>
                  </div>
                ))}
              </div>

              <div className="flex justify-end border-t border-slate-200 p-4">
                <button
                  onClick={() => setSelectedTransaction(null)}
                  className="rounded-lg bg-slate-900 px-5 py-2.5 text-sm font-semibold text-white hover:bg-slate-800"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function ClockIcon({ size = 22 }) {
  return <CalendarDays size={size} />;
}
