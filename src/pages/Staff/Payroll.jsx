
import { useMemo, useState } from "react";
import {
  Wallet,
  Users,
  CircleDollarSign,
  Clock,
  Plus,
  Search,
  Download,
  Eye,
  Pencil,
  Trash2,
  X,
  Printer,
  CheckCircle2,
  CalendarDays,
  FileText,
  Calculator,
  Banknote,
  AlertCircle,
} from "lucide-react";

const money = (value) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 2,
  }).format(Number(value) || 0);

const currentMonth = new Date().toISOString().slice(0, 7);

const employees = [
  { id: "EMP-001", name: "Rahul Sharma", department: "Front Desk", designation: "Front Office Manager" },
  { id: "EMP-002", name: "Priya Verma", department: "Housekeeping", designation: "Housekeeping Supervisor" },
  { id: "EMP-003", name: "Amit Kumar", department: "Kitchen", designation: "Chef" },
  { id: "EMP-004", name: "Neha Singh", department: "Finance", designation: "Accountant" },
  { id: "EMP-005", name: "Vikas Yadav", department: "Security", designation: "Security Officer" },
  { id: "EMP-006", name: "Anjali Gupta", department: "Front Desk", designation: "Receptionist" },
  { id: "EMP-007", name: "Rohit Meena", department: "Housekeeping", designation: "Room Attendant" },
  { id: "EMP-008", name: "Sneha Patel", department: "Kitchen", designation: "Sous Chef" },
];

const initialPayroll = [
  {
    id: "PAY-1001",
    employeeId: "EMP-001",
    employee: "Rahul Sharma",
    department: "Front Desk",
    designation: "Front Office Manager",
    month: currentMonth,
    basic: 30000,
    hra: 9000,
    allowances: 3000,
    overtime: 2000,
    bonus: 1500,
    deductions: 2000,
    leaveAdjustment: 0,
    paidDays: 30,
    workingDays: 30,
    status: "Pending",
    paymentDate: "",
    paymentMethod: "Bank Transfer",
    transactionId: "",
  },
  {
    id: "PAY-1002",
    employeeId: "EMP-002",
    employee: "Priya Verma",
    department: "Housekeeping",
    designation: "Housekeeping Supervisor",
    month: currentMonth,
    basic: 22000,
    hra: 6000,
    allowances: 1500,
    overtime: 1000,
    bonus: 0,
    deductions: 1200,
    leaveAdjustment: 0,
    paidDays: 30,
    workingDays: 30,
    status: "Paid",
    paymentDate: "2026-11-02",
    paymentMethod: "Bank Transfer",
    transactionId: "TXN-88201",
  },
  {
    id: "PAY-1003",
    employeeId: "EMP-003",
    employee: "Amit Kumar",
    department: "Kitchen",
    designation: "Chef",
    month: currentMonth,
    basic: 28000,
    hra: 7000,
    allowances: 2000,
    overtime: 3000,
    bonus: 1000,
    deductions: 1800,
    leaveAdjustment: 500,
    paidDays: 29,
    workingDays: 30,
    status: "Pending",
    paymentDate: "",
    paymentMethod: "Bank Transfer",
    transactionId: "",
  },
  {
    id: "PAY-1004",
    employeeId: "EMP-004",
    employee: "Neha Singh",
    department: "Finance",
    designation: "Accountant",
    month: currentMonth,
    basic: 25000,
    hra: 7500,
    allowances: 2000,
    overtime: 0,
    bonus: 2000,
    deductions: 1500,
    leaveAdjustment: 0,
    paidDays: 30,
    workingDays: 30,
    status: "Paid",
    paymentDate: "2026-11-03",
    paymentMethod: "UPI",
    transactionId: "UPI-55821",
  },
  {
    id: "PAY-1005",
    employeeId: "EMP-005",
    employee: "Vikas Yadav",
    department: "Security",
    designation: "Security Officer",
    month: currentMonth,
    basic: 18000,
    hra: 4500,
    allowances: 1500,
    overtime: 2500,
    bonus: 0,
    deductions: 1000,
    leaveAdjustment: 0,
    paidDays: 30,
    workingDays: 30,
    status: "Pending",
    paymentDate: "",
    paymentMethod: "Cash",
    transactionId: "",
  },
];

const emptyForm = {
  employeeId: "",
  month: currentMonth,
  basic: "",
  hra: "",
  allowances: "",
  overtime: "",
  bonus: "",
  deductions: "",
  leaveAdjustment: "0",
  paidDays: "30",
  workingDays: "30",
  paymentMethod: "Bank Transfer",
};

const calculate = (item) => {
  const earnings =
    Number(item.basic || 0) +
    Number(item.hra || 0) +
    Number(item.allowances || 0) +
    Number(item.overtime || 0) +
    Number(item.bonus || 0);

  const deductions =
    Number(item.deductions || 0) +
    Number(item.leaveAdjustment || 0);

  return {
    earnings,
    deductions,
    net: Math.max(0, earnings - deductions),
  };
};

const monthLabel = (month) => {
  if (!month) return "—";
  return new Date(`${month}-01T00:00:00`).toLocaleDateString("en-IN", {
    month: "long",
    year: "numeric",
  });
};

const statusClass = {
  Paid: "bg-emerald-50 text-emerald-700 border-emerald-200",
  Pending: "bg-amber-50 text-amber-700 border-amber-200",
  Processing: "bg-blue-50 text-blue-700 border-blue-200",
};

export default function Payroll() {
  const [records, setRecords] = useState(initialPayroll);
  const [search, setSearch] = useState("");
  const [monthFilter, setMonthFilter] = useState(currentMonth);
  const [departmentFilter, setDepartmentFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");
  const [modal, setModal] = useState(null);
  const [selected, setSelected] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [error, setError] = useState("");
  const [paymentDetails, setPaymentDetails] = useState({
    paymentMethod: "Bank Transfer",
    transactionId: "",
  });

  const departments = [...new Set(employees.map((e) => e.department))];

  const filtered = useMemo(() => {
    return records.filter((item) => {
      const searchMatch =
        item.employee.toLowerCase().includes(search.toLowerCase()) ||
        item.employeeId.toLowerCase().includes(search.toLowerCase()) ||
        item.id.toLowerCase().includes(search.toLowerCase());

      return (
        searchMatch &&
        (monthFilter === "All" || item.month === monthFilter) &&
        (departmentFilter === "All" ||
          item.department === departmentFilter) &&
        (statusFilter === "All" || item.status === statusFilter)
      );
    });
  }, [records, search, monthFilter, departmentFilter, statusFilter]);

  const summary = useMemo(() => {
    const monthRecords = records.filter(
      (item) => monthFilter === "All" || item.month === monthFilter
    );

    const totals = monthRecords.reduce(
      (acc, item) => {
        const result = calculate(item);
        acc.gross += result.earnings;
        acc.net += result.net;
        if (item.status === "Paid") acc.paid += result.net;
        else acc.pending += result.net;
        return acc;
      },
      { gross: 0, net: 0, paid: 0, pending: 0 }
    );

    return {
      ...totals,
      employees: monthRecords.length,
      paidCount: monthRecords.filter((r) => r.status === "Paid").length,
      pendingCount: monthRecords.filter((r) => r.status !== "Paid").length,
    };
  }, [records, monthFilter]);

  const updateForm = (key, value) => {
    setForm((prev) => ({ ...prev, [key]: value }));
    setError("");
  };

  const openCreate = () => {
    setSelected(null);
    setForm(emptyForm);
    setError("");
    setModal("form");
  };

  const openEdit = (record) => {
    setSelected(record);
    setForm({
      employeeId: record.employeeId,
      month: record.month,
      basic: String(record.basic),
      hra: String(record.hra),
      allowances: String(record.allowances),
      overtime: String(record.overtime),
      bonus: String(record.bonus),
      deductions: String(record.deductions),
      leaveAdjustment: String(record.leaveAdjustment),
      paidDays: String(record.paidDays),
      workingDays: String(record.workingDays),
      paymentMethod: record.paymentMethod,
    });
    setError("");
    setModal("form");
  };

  const savePayroll = (event) => {
    event.preventDefault();

    const employee = employees.find(
      (item) => item.id === form.employeeId
    );

    if (!employee) {
      setError("Please select an employee.");
      return;
    }

    if (!form.month || Number(form.basic) < 0) {
      setError("Please enter valid payroll details.");
      return;
    }

    if (
      Number(form.paidDays) < 0 ||
      Number(form.workingDays) <= 0 ||
      Number(form.paidDays) > Number(form.workingDays)
    ) {
      setError("Please check the paid days and working days.");
      return;
    }

    const duplicate = records.some(
      (item) =>
        item.employeeId === form.employeeId &&
        item.month === form.month &&
        item.id !== selected?.id
    );

    if (duplicate) {
      setError("Payroll already exists for this employee and month.");
      return;
    }

    const numericFields = [
      "basic",
      "hra",
      "allowances",
      "overtime",
      "bonus",
      "deductions",
      "leaveAdjustment",
      "paidDays",
      "workingDays",
    ];

    const numericData = {};
    numericFields.forEach((key) => {
      numericData[key] = Number(form[key] || 0);
    });

    const data = {
      ...numericData,
      employeeId: employee.id,
      employee: employee.name,
      department: employee.department,
      designation: employee.designation,
      month: form.month,
      paymentMethod: form.paymentMethod,
    };

    if (selected) {
      setRecords((prev) =>
        prev.map((item) =>
          item.id === selected.id ? { ...item, ...data } : item
        )
      );
    } else {
      setRecords((prev) => [
        {
          ...data,
          id: `PAY-${Date.now().toString().slice(-6)}`,
          status: "Pending",
          paymentDate: "",
          transactionId: "",
        },
        ...prev,
      ]);
    }

    setModal(null);
    setSelected(null);
  };

  const openPayment = (record) => {
    setSelected(record);
    setPaymentDetails({
      paymentMethod: record.paymentMethod || "Bank Transfer",
      transactionId: record.transactionId || "",
    });
    setModal("payment");
  };

  const markPaid = (event) => {
    event.preventDefault();

    if (!selected) return;

    setRecords((prev) =>
      prev.map((item) =>
        item.id === selected.id
          ? {
              ...item,
              status: "Paid",
              paymentDate: new Date().toISOString().slice(0, 10),
              paymentMethod: paymentDetails.paymentMethod,
              transactionId: paymentDetails.transactionId.trim(),
            }
          : item
      )
    );

    setModal(null);
    setSelected(null);
  };

  const deleteRecord = (record) => {
    if (!window.confirm(`Delete payroll record ${record.id}?`)) return;

    setRecords((prev) => prev.filter((item) => item.id !== record.id));
  };

  const exportCSV = () => {
    const headers = [
      "Payroll ID",
      "Employee ID",
      "Employee",
      "Department",
      "Month",
      "Basic",
      "HRA",
      "Allowances",
      "Overtime",
      "Bonus",
      "Deductions",
      "Leave Adjustment",
      "Gross Earnings",
      "Net Salary",
      "Status",
      "Payment Method",
      "Transaction ID",
    ];

    const rows = filtered.map((item) => {
      const totals = calculate(item);
      return [
        item.id,
        item.employeeId,
        item.employee,
        item.department,
        item.month,
        item.basic,
        item.hra,
        item.allowances,
        item.overtime,
        item.bonus,
        item.deductions,
        item.leaveAdjustment,
        totals.earnings,
        totals.net,
        item.status,
        item.paymentMethod,
        item.transactionId,
      ];
    });

    const escapeCSV = (value) =>
      `"${String(value ?? "").replace(/"/g, '""')}"`;

    const csv = [headers, ...rows]
      .map((row) => row.map(escapeCSV).join(","))
      .join("\n");

    const blob = new Blob([csv], {
      type: "text/csv;charset=utf-8;",
    });

    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "stayflow-payroll.csv";
    link.click();
    URL.revokeObjectURL(url);
  };

  const printPayslip = (record) => {
    const totals = calculate(record);
    const printWindow = window.open("", "_blank");

    if (!printWindow) {
      alert("Please allow pop-ups to print the payslip.");
      return;
    }

    const safe = (value) =>
      String(value ?? "").replace(/[&<>"']/g, (char) => ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#39;",
      })[char]);

    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
      <head>
        <title>Payslip - ${safe(record.employee)}</title>
        <style>
          body { font-family: Arial, sans-serif; padding: 35px; color: #1e293b; }
          h1 { margin-bottom: 5px; }
          .muted { color: #64748b; font-size: 13px; }
          .header { border-bottom: 2px solid #334155; padding-bottom: 20px; }
          .grid { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin: 25px 0; }
          .box { background: #f8fafc; padding: 12px; }
          table { width: 100%; border-collapse: collapse; margin-top: 20px; }
          th, td { padding: 12px; border-bottom: 1px solid #e2e8f0; text-align: left; }
          .total { font-size: 20px; font-weight: bold; }
          .right { text-align: right; }
          @media print { body { padding: 0; } }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>STAYFLOW</h1>
          <p class="muted">Employee Salary Payslip</p>
          <h2>${safe(monthLabel(record.month))}</h2>
        </div>
        <div class="grid">
          <div class="box"><b>Employee</b><br/>${safe(record.employee)}</div>
          <div class="box"><b>Employee ID</b><br/>${safe(record.employeeId)}</div>
          <div class="box"><b>Department</b><br/>${safe(record.department)}</div>
          <div class="box"><b>Designation</b><br/>${safe(record.designation)}</div>
          <div class="box"><b>Payroll ID</b><br/>${safe(record.id)}</div>
          <div class="box"><b>Payment Status</b><br/>${safe(record.status)}</div>
        </div>
        <table>
          <tr><th>Earnings</th><th class="right">Amount</th></tr>
          <tr><td>Basic Salary</td><td class="right">${money(record.basic)}</td></tr>
          <tr><td>House Rent Allowance</td><td class="right">${money(record.hra)}</td></tr>
          <tr><td>Other Allowances</td><td class="right">${money(record.allowances)}</td></tr>
          <tr><td>Overtime</td><td class="right">${money(record.overtime)}</td></tr>
          <tr><td>Bonus</td><td class="right">${money(record.bonus)}</td></tr>
          <tr><th>Total Earnings</th><th class="right">${money(totals.earnings)}</th></tr>
        </table>
        <table>
          <tr><th>Deductions</th><th class="right">Amount</th></tr>
          <tr><td>Other Deductions</td><td class="right">${money(record.deductions)}</td></tr>
          <tr><td>Leave Adjustment</td><td class="right">${money(record.leaveAdjustment)}</td></tr>
          <tr><th>Total Deductions</th><th class="right">${money(totals.deductions)}</th></tr>
        </table>
        <p class="total">Net Salary: ${money(totals.net)}</p>
        <p class="muted">Paid Days: ${safe(record.paidDays)} / ${safe(record.workingDays)}</p>
        <p class="muted">Payment Method: ${safe(record.paymentMethod)}</p>
        <p class="muted">Transaction ID: ${safe(record.transactionId || "—")}</p>
        <p class="muted">Payment Date: ${safe(record.paymentDate || "Not paid")}</p>
        <script>window.onload = () => window.print();<\/script>
      </body>
      </html>
    `);

    printWindow.document.close();
  };

  const liveCalculation = calculate(form);

  return (
    <div className="min-h-screen w-full bg-slate-50 p-2 md:p-4">
      <div className="w-full space-y-5">
        <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
          <div>
            <h1 className="text-2xl font-bold text-slate-800">Payroll</h1>
            <p className="mt-1 text-sm text-slate-500">
              Manage salaries, deductions, bonuses and employee payslips.
            </p>
          </div>
          <button
            onClick={openCreate}
            className="flex items-center justify-center gap-2 rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-indigo-700"
          >
            <Plus size={18} />
            Generate Payroll
          </button>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {[
            {
              label: "Total Gross Payroll",
              value: money(summary.gross),
              icon: Wallet,
              color: "bg-indigo-50 text-indigo-600",
            },
            {
              label: "Net Payroll",
              value: money(summary.net),
              icon: CircleDollarSign,
              color: "bg-sky-50 text-sky-600",
            },
            {
              label: "Paid Amount",
              value: money(summary.paid),
              icon: CheckCircle2,
              color: "bg-emerald-50 text-emerald-600",
            },
            {
              label: "Pending Amount",
              value: money(summary.pending),
              icon: Clock,
              color: "bg-amber-50 text-amber-600",
            },
          ].map((card) => {
            const Icon = card.icon;
            return (
              <div
                key={card.label}
                className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm"
              >
                <div className="flex items-center justify-between">
                  <p className="text-sm text-slate-500">{card.label}</p>
                  <span className={`rounded-lg p-2 ${card.color}`}>
                    <Icon size={19} />
                  </span>
                </div>
                <p className="mt-3 text-xl font-bold text-slate-800">
                  {card.value}
                </p>
              </div>
            );
          })}
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          <div className="rounded-xl border border-slate-200 bg-white p-4">
            <p className="text-sm text-slate-500">Employees in Payroll</p>
            <p className="mt-2 text-2xl font-bold text-slate-800">
              {summary.employees}
            </p>
          </div>
          <div className="rounded-xl border border-slate-200 bg-white p-4">
            <p className="text-sm text-slate-500">Paid Employees</p>
            <p className="mt-2 text-2xl font-bold text-emerald-600">
              {summary.paidCount}
            </p>
          </div>
          <div className="rounded-xl border border-slate-200 bg-white p-4">
            <p className="text-sm text-slate-500">Pending Employees</p>
            <p className="mt-2 text-2xl font-bold text-amber-600">
              {summary.pendingCount}
            </p>
          </div>
        </div>

        <div className="flex flex-col gap-3 rounded-xl border border-slate-200 bg-white p-4 shadow-sm xl:flex-row">
          <div className="relative flex-1">
            <Search
              size={18}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
            />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search employee, payroll ID..."
              className="w-full rounded-lg border border-slate-200 py-2.5 pl-10 pr-3 text-sm outline-none focus:border-indigo-500"
            />
          </div>

          <input
            type="month"
            value={monthFilter === "All" ? "" : monthFilter}
            onChange={(e) => setMonthFilter(e.target.value || "All")}
            className="rounded-lg border border-slate-200 px-3 py-2.5 text-sm"
          />

          <select
            value={departmentFilter}
            onChange={(e) => setDepartmentFilter(e.target.value)}
            className="rounded-lg border border-slate-200 px-3 py-2.5 text-sm"
          >
            <option value="All">All Departments</option>
            {departments.map((department) => (
              <option key={department}>{department}</option>
            ))}
          </select>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="rounded-lg border border-slate-200 px-3 py-2.5 text-sm"
          >
            <option value="All">All Status</option>
            <option value="Paid">Paid</option>
            <option value="Pending">Pending</option>
          </select>

          <button
            onClick={exportCSV}
            className="flex items-center justify-center gap-2 rounded-lg border border-slate-200 px-4 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50"
          >
            <Download size={17} />
            Export
          </button>
        </div>

        <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
          <div className="border-b border-slate-200 p-4">
            <h2 className="font-semibold text-slate-800">
              Payroll Records
            </h2>
            <p className="mt-1 text-xs text-slate-500">
              {filtered.length} payroll records found
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full min-w-[1100px] text-left text-sm">
              <thead className="bg-slate-50 text-xs uppercase text-slate-500">
                <tr>
                  <th className="px-4 py-3">Employee</th>
                  <th className="px-4 py-3">Payroll Month</th>
                  <th className="px-4 py-3">Basic Salary</th>
                  <th className="px-4 py-3">Gross Earnings</th>
                  <th className="px-4 py-3">Deductions</th>
                  <th className="px-4 py-3">Net Salary</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filtered.map((record) => {
                  const totals = calculate(record);

                  return (
                    <tr key={record.id} className="hover:bg-slate-50">
                      <td className="px-4 py-4">
                        <p className="font-medium text-slate-800">
                          {record.employee}
                        </p>
                        <p className="mt-1 text-xs text-slate-500">
                          {record.employeeId} · {record.department}
                        </p>
                      </td>
                      <td className="px-4 py-4 text-slate-600">
                        {monthLabel(record.month)}
                      </td>
                      <td className="px-4 py-4 text-slate-700">
                        {money(record.basic)}
                      </td>
                      <td className="px-4 py-4 text-slate-700">
                        {money(totals.earnings)}
                      </td>
                      <td className="px-4 py-4 text-rose-600">
                        {money(totals.deductions)}
                      </td>
                      <td className="px-4 py-4 font-semibold text-slate-800">
                        {money(totals.net)}
                      </td>
                      <td className="px-4 py-4">
                        <span
                          className={`rounded-full border px-2.5 py-1 text-xs font-medium ${statusClass[record.status]}`}
                        >
                          {record.status}
                        </span>
                      </td>
                      <td className="px-4 py-4">
                        <div className="flex justify-end gap-1">
                          <button
                            title="View payslip"
                            onClick={() => {
                              setSelected(record);
                              setModal("view");
                            }}
                            className="rounded-lg p-2 text-slate-500 hover:bg-indigo-50 hover:text-indigo-600"
                          >
                            <Eye size={16} />
                          </button>
                          <button
                            title="Edit payroll"
                            onClick={() => openEdit(record)}
                            className="rounded-lg p-2 text-slate-500 hover:bg-amber-50 hover:text-amber-600"
                          >
                            <Pencil size={16} />
                          </button>
                          <button
                            title="Print payslip"
                            onClick={() => printPayslip(record)}
                            className="rounded-lg p-2 text-slate-500 hover:bg-slate-100"
                          >
                            <Printer size={16} />
                          </button>
                          {record.status !== "Paid" && (
                            <button
                              title="Record payment"
                              onClick={() => openPayment(record)}
                              className="rounded-lg p-2 text-emerald-600 hover:bg-emerald-50"
                            >
                              <Banknote size={17} />
                            </button>
                          )}
                          <button
                            title="Delete"
                            onClick={() => deleteRecord(record)}
                            className="rounded-lg p-2 text-slate-400 hover:bg-rose-50 hover:text-rose-600"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}

                {filtered.length === 0 && (
                  <tr>
                    <td colSpan="8" className="py-12 text-center text-slate-500">
                      No payroll records found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {modal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 p-3"
          onMouseDown={(e) => {
            if (e.target === e.currentTarget) setModal(null);
          }}
        >
          <div className="max-h-[92vh] w-full max-w-3xl overflow-y-auto rounded-2xl bg-white shadow-2xl">
            <div className="sticky top-0 z-10 flex items-center justify-between border-b border-slate-200 bg-white px-5 py-4">
              <div>
                <h2 className="font-semibold text-slate-800">
                  {modal === "form"
                    ? selected
                      ? "Edit Payroll"
                      : "Generate Payroll"
                    : modal === "payment"
                    ? "Record Salary Payment"
                    : "Payslip Details"}
                </h2>
                <p className="mt-1 text-xs text-slate-500">
                  {selected?.id || "Enter employee salary information"}
                </p>
              </div>
              <button
                onClick={() => setModal(null)}
                className="rounded-lg p-2 text-slate-500 hover:bg-slate-100"
              >
                <X size={20} />
              </button>
            </div>

            {modal === "form" && (
              <form onSubmit={savePayroll} className="space-y-5 p-5">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className="mb-1.5 block text-sm font-medium text-slate-700">
                      Employee *
                    </label>
                    <select
                      required
                      value={form.employeeId}
                      onChange={(e) => updateForm("employeeId", e.target.value)}
                      className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm"
                    >
                      <option value="">Select employee</option>
                      {employees.map((employee) => (
                        <option key={employee.id} value={employee.id}>
                          {employee.name} ({employee.id})
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="mb-1.5 block text-sm font-medium text-slate-700">
                      Payroll Month *
                    </label>
                    <input
                      required
                      type="month"
                      value={form.month}
                      onChange={(e) => updateForm("month", e.target.value)}
                      className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm"
                    />
                  </div>
                </div>

                <div>
                  <h3 className="mb-3 flex items-center gap-2 font-semibold text-slate-800">
                    <Wallet size={18} className="text-indigo-600" />
                    Earnings
                  </h3>
                  <div className="grid gap-4 sm:grid-cols-2">
                    {[
                      ["basic", "Basic Salary *"],
                      ["hra", "House Rent Allowance"],
                      ["allowances", "Other Allowances"],
                      ["overtime", "Overtime Amount"],
                      ["bonus", "Bonus / Incentives"],
                    ].map(([key, label]) => (
                      <div key={key}>
                        <label className="mb-1.5 block text-sm font-medium text-slate-700">
                          {label}
                        </label>
                        <input
                          required={key === "basic"}
                          type="number"
                          min="0"
                          step="0.01"
                          value={form[key]}
                          onChange={(e) => updateForm(key, e.target.value)}
                          className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm"
                        />
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="mb-3 flex items-center gap-2 font-semibold text-slate-800">
                    <Calculator size={18} className="text-rose-600" />
                    Deductions and Attendance
                  </h3>
                  <div className="grid gap-4 sm:grid-cols-2">
                    {[
                      ["deductions", "Other Deductions"],
                      ["leaveAdjustment", "Leave Adjustment"],
                      ["paidDays", "Paid Days"],
                      ["workingDays", "Working Days"],
                    ].map(([key, label]) => (
                      <div key={key}>
                        <label className="mb-1.5 block text-sm font-medium text-slate-700">
                          {label}
                        </label>
                        <input
                          type="number"
                          min="0"
                          step={key.includes("Days") ? "1" : "0.01"}
                          value={form[key]}
                          onChange={(e) => updateForm(key, e.target.value)}
                          className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm"
                        />
                      </div>
                    ))}
                  </div>
                </div>

                <div className="rounded-xl border border-indigo-100 bg-indigo-50 p-4">
                  <h3 className="font-semibold text-indigo-900">
                    Payroll Calculation
                  </h3>
                  <div className="mt-3 space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-slate-600">Gross Earnings</span>
                      <strong>{money(liveCalculation.earnings)}</strong>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-600">Total Deductions</span>
                      <strong className="text-rose-600">
                        {money(liveCalculation.deductions)}
                      </strong>
                    </div>
                    <div className="flex justify-between border-t border-indigo-200 pt-3 text-base">
                      <strong className="text-indigo-900">Net Salary</strong>
                      <strong className="text-indigo-700">
                        {money(liveCalculation.net)}
                      </strong>
                    </div>
                  </div>
                </div>

                <div>
                  <label className="mb-1.5 block text-sm font-medium text-slate-700">
                    Preferred Payment Method
                  </label>
                  <select
                    value={form.paymentMethod}
                    onChange={(e) => updateForm("paymentMethod", e.target.value)}
                    className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm"
                  >
                    <option>Bank Transfer</option>
                    <option>UPI</option>
                    <option>Cash</option>
                    <option>Cheque</option>
                  </select>
                </div>

                {error && (
                  <div className="flex gap-2 rounded-lg bg-rose-50 p-3 text-sm text-rose-700">
                    <AlertCircle size={17} />
                    {error}
                  </div>
                )}

                <div className="flex justify-end gap-3 border-t border-slate-100 pt-4">
                  <button
                    type="button"
                    onClick={() => setModal(null)}
                    className="rounded-lg border border-slate-200 px-4 py-2.5 text-sm"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="rounded-lg bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-indigo-700"
                  >
                    {selected ? "Save Changes" : "Generate Payroll"}
                  </button>
                </div>
              </form>
            )}

            {modal === "payment" && selected && (
              <form onSubmit={markPaid} className="space-y-5 p-5">
                <div className="rounded-xl bg-slate-50 p-4">
                  <p className="font-semibold text-slate-800">
                    {selected.employee}
                  </p>
                  <p className="mt-1 text-sm text-slate-500">
                    {selected.employeeId} · {monthLabel(selected.month)}
                  </p>
                  <p className="mt-3 text-2xl font-bold text-emerald-700">
                    {money(calculate(selected).net)}
                  </p>
                  <p className="text-xs text-slate-500">Net salary payable</p>
                </div>

                <div>
                  <label className="mb-1.5 block text-sm font-medium text-slate-700">
                    Payment Method
                  </label>
                  <select
                    value={paymentDetails.paymentMethod}
                    onChange={(e) =>
                      setPaymentDetails((prev) => ({
                        ...prev,
                        paymentMethod: e.target.value,
                      }))
                    }
                    className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm"
                  >
                    <option>Bank Transfer</option>
                    <option>UPI</option>
                    <option>Cash</option>
                    <option>Cheque</option>
                  </select>
                </div>

                <div>
                  <label className="mb-1.5 block text-sm font-medium text-slate-700">
                    Transaction / Reference ID
                  </label>
                  <input
                    value={paymentDetails.transactionId}
                    onChange={(e) =>
                      setPaymentDetails((prev) => ({
                        ...prev,
                        transactionId: e.target.value,
                      }))
                    }
                    placeholder="Enter transaction reference"
                    className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm"
                  />
                </div>

                <div className="flex justify-end gap-3 border-t border-slate-100 pt-4">
                  <button
                    type="button"
                    onClick={() => setModal(null)}
                    className="rounded-lg border border-slate-200 px-4 py-2.5 text-sm"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="rounded-lg bg-emerald-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-emerald-700"
                  >
                    Confirm Payment
                  </button>
                </div>
              </form>
            )}

            {modal === "view" && selected && (
              <div className="space-y-5 p-5">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <p className="text-xs text-slate-500">Employee</p>
                    <h3 className="mt-1 text-lg font-bold text-slate-800">
                      {selected.employee}
                    </h3>
                    <p className="text-sm text-slate-500">
                      {selected.employeeId} · {selected.designation}
                    </p>
                  </div>
                  <span
                    className={`rounded-full border px-3 py-1 text-xs font-semibold ${statusClass[selected.status]}`}
                  >
                    {selected.status}
                  </span>
                </div>

                <div className="rounded-xl bg-slate-50 p-4">
                  <p className="text-sm text-slate-500">
                    Net Salary · {monthLabel(selected.month)}
                  </p>
                  <p className="mt-2 text-3xl font-bold text-indigo-700">
                    {money(calculate(selected).net)}
                  </p>
                </div>

                <div className="grid gap-3 sm:grid-cols-2">
                  {[
                    ["Basic Salary", selected.basic],
                    ["HRA", selected.hra],
                    ["Other Allowances", selected.allowances],
                    ["Overtime", selected.overtime],
                    ["Bonus", selected.bonus],
                    ["Other Deductions", selected.deductions],
                    ["Leave Adjustment", selected.leaveAdjustment],
                    ["Gross Earnings", calculate(selected).earnings],
                    ["Total Deductions", calculate(selected).deductions],
                  ].map(([label, value]) => (
                    <div
                      key={label}
                      className="flex justify-between gap-2 rounded-lg border border-slate-100 p-3"
                    >
                      <span className="text-sm text-slate-500">{label}</span>
                      <strong className="text-sm text-slate-800">
                        {money(value)}
                      </strong>
                    </div>
                  ))}
                </div>

                <div className="grid gap-3 sm:grid-cols-2">
                  <div className="rounded-lg bg-slate-50 p-3">
                    <p className="text-xs text-slate-500">Attendance</p>
                    <p className="mt-1 font-semibold text-slate-800">
                      {selected.paidDays} / {selected.workingDays} days
                    </p>
                  </div>
                  <div className="rounded-lg bg-slate-50 p-3">
                    <p className="text-xs text-slate-500">Payment Method</p>
                    <p className="mt-1 font-semibold text-slate-800">
                      {selected.paymentMethod}
                    </p>
                  </div>
                  <div className="rounded-lg bg-slate-50 p-3">
                    <p className="text-xs text-slate-500">Payment Date</p>
                    <p className="mt-1 font-semibold text-slate-800">
                      {selected.paymentDate || "Not paid"}
                    </p>
                  </div>
                  <div className="rounded-lg bg-slate-50 p-3">
                    <p className="text-xs text-slate-500">Transaction ID</p>
                    <p className="mt-1 font-semibold text-slate-800">
                      {selected.transactionId || "—"}
                    </p>
                  </div>
                </div>

                <div className="flex flex-wrap justify-end gap-2 border-t border-slate-100 pt-4">
                  <button
                    onClick={() => printPayslip(selected)}
                    className="flex items-center gap-2 rounded-lg border border-slate-200 px-4 py-2.5 text-sm font-medium hover:bg-slate-50"
                  >
                    <Printer size={16} />
                    Print Payslip
                  </button>
                  {selected.status !== "Paid" && (
                    <button
                      onClick={() => openPayment(selected)}
                      className="flex items-center gap-2 rounded-lg bg-emerald-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-emerald-700"
                    >
                      <CheckCircle2 size={16} />
                      Record Payment
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
