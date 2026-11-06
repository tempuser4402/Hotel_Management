
import { useMemo, useRef, useState } from "react";
import {
  Users, UserPlus, Search, Filter, Download, Plus, Eye, Pencil,
  Trash2, X, Save, Phone, Mail, CalendarDays, Building2,
  BriefcaseBusiness, ShieldCheck, FileText, Upload, Camera,
  MoreHorizontal, UserRound, AlertCircle
} from "lucide-react";

const departments = [
  "Front Desk", "Housekeeping", "Kitchen", "Restaurant",
  "Finance", "Security", "Maintenance", "Management", "Human Resources"
];

const statuses = ["Active", "On Leave", "Probation", "Inactive", "Terminated"];

const initialStaff = [
  {
    id: "EMP-001",
    name: "Aarav Sharma",
    email: "aarav@stayflow.com",
    phone: "9876543210",
    department: "Front Desk",
    designation: "Front Desk Manager",
    joiningDate: "2024-02-15",
    status: "Active",
    emergencyName: "Rajesh Sharma",
    emergencyPhone: "9876500001",
    address: "New Delhi, India",
    photo: "",
    documents: [],
  },
  {
    id: "EMP-002",
    name: "Priya Verma",
    email: "priya@stayflow.com",
    phone: "9876543211",
    department: "Housekeeping",
    designation: "Housekeeping Supervisor",
    joiningDate: "2024-05-10",
    status: "Active",
    emergencyName: "Sunita Verma",
    emergencyPhone: "9876500002",
    address: "Gurugram, India",
    photo: "",
    documents: [],
  },
  {
    id: "EMP-003",
    name: "Rohan Singh",
    email: "rohan@stayflow.com",
    phone: "9876543212",
    department: "Kitchen",
    designation: "Chef",
    joiningDate: "2025-01-20",
    status: "Probation",
    emergencyName: "Amit Singh",
    emergencyPhone: "9876500003",
    address: "Rewari, India",
    photo: "",
    documents: [],
  },
  {
    id: "EMP-004",
    name: "Neha Gupta",
    email: "neha@stayflow.com",
    phone: "9876543213",
    department: "Finance",
    designation: "Accountant",
    joiningDate: "2023-11-05",
    status: "On Leave",
    emergencyName: "Kavita Gupta",
    emergencyPhone: "9876500004",
    address: "Jaipur, India",
    photo: "",
    documents: [],
  },
];

const emptyForm = {
  id: "",
  name: "",
  email: "",
  phone: "",
  department: "Front Desk",
  designation: "",
  joiningDate: new Date().toISOString().slice(0, 10),
  status: "Active",
  emergencyName: "",
  emergencyPhone: "",
  address: "",
  photo: "",
  documents: [],
};

const inputClass =
  "w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100";

const moneyDate = (date) =>
  date
    ? new Date(`${date}T00:00:00`).toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      })
    : "—";

function StatusBadge({ status }) {
  const styles = {
    Active: "bg-emerald-50 text-emerald-700",
    "On Leave": "bg-amber-50 text-amber-700",
    Probation: "bg-blue-50 text-blue-700",
    Inactive: "bg-slate-100 text-slate-600",
    Terminated: "bg-red-50 text-red-700",
  };

  return (
    <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${styles[status] || styles.Inactive}`}>
      {status}
    </span>
  );
}

function Field({ label, required, children }) {
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
    green: "bg-emerald-50 text-emerald-600",
    amber: "bg-amber-50 text-amber-600",
    purple: "bg-purple-50 text-purple-600",
  };

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-slate-500">{title}</p>
          <h3 className="mt-2 text-2xl font-bold text-slate-900">{value}</h3>
          <p className="mt-1 text-xs text-slate-400">{subtitle}</p>
        </div>
        <div className={`rounded-xl p-3 ${styles[color]}`}>
          <Icon size={21} />
        </div>
      </div>
    </div>
  );
}

export default function StaffDirectory() {
  const [staff, setStaff] = useState(initialStaff);
  const [search, setSearch] = useState("");
  const [departmentFilter, setDepartmentFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");

  const [modal, setModal] = useState("");
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [notification, setNotification] = useState("");

  const photoRef = useRef(null);
  const documentsRef = useRef(null);

  const showMessage = (message) => {
    setNotification(message);
    window.setTimeout(() => setNotification(""), 3000);
  };

  const updateForm = (key, value) => {
    setForm((previous) => ({ ...previous, [key]: value }));
  };

  const stats = useMemo(() => ({
    total: staff.length,
    active: staff.filter((item) => item.status === "Active").length,
    onLeave: staff.filter((item) => item.status === "On Leave").length,
    probation: staff.filter((item) => item.status === "Probation").length,
  }), [staff]);

  const filteredStaff = useMemo(() => {
    const query = search.toLowerCase();

    return staff.filter((employee) => {
      const matchesSearch =
        employee.id.toLowerCase().includes(query) ||
        employee.name.toLowerCase().includes(query) ||
        employee.email.toLowerCase().includes(query) ||
        employee.phone.includes(query) ||
        employee.designation.toLowerCase().includes(query);

      return (
        matchesSearch &&
        (departmentFilter === "All" || employee.department === departmentFilter) &&
        (statusFilter === "All" || employee.status === statusFilter)
      );
    });
  }, [staff, search, departmentFilter, statusFilter]);

  const openCreate = () => {
    setEditingId(null);
    setForm({
      ...emptyForm,
      id: `EMP-${String(Date.now()).slice(-6)}`,
      joiningDate: new Date().toISOString().slice(0, 10),
    });
    setModal("form");
  };

  const openEdit = (employee) => {
    setEditingId(employee.id);
    setForm({ ...employee });
    setModal("form");
  };

  const handlePhoto = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      showMessage("Please select an image file.");
      return;
    }

    if (file.size > 3 * 1024 * 1024) {
      showMessage("Profile photo must be smaller than 3 MB.");
      return;
    }

    const reader = new FileReader();
    reader.onload = () => updateForm("photo", reader.result);
    reader.readAsDataURL(file);
  };

  const handleDocuments = (event) => {
    const files = Array.from(event.target.files || []);

    if (!files.length) return;

    const newDocuments = files.map((file) => ({
      name: file.name,
      size: file.size,
      type: file.type,
    }));

    updateForm("documents", [...form.documents, ...newDocuments]);
    event.target.value = "";
  };

  const removeDocument = (index) => {
    updateForm(
      "documents",
      form.documents.filter((_, i) => i !== index)
    );
  };

  const saveEmployee = (event) => {
    event.preventDefault();

    if (!form.name.trim() || !form.phone.trim() || !form.designation.trim()) {
      showMessage("Please fill in all required employee details.");
      return;
    }

    const duplicatePhone = staff.some(
      (employee) =>
        employee.phone === form.phone.trim() &&
        employee.id !== editingId
    );

    if (duplicatePhone) {
      showMessage("This phone number is already assigned to another employee.");
      return;
    }

    const record = {
      ...form,
      id: editingId || form.id || `EMP-${Date.now()}`,
      name: form.name.trim(),
      email: form.email.trim(),
      phone: form.phone.trim(),
      designation: form.designation.trim(),
    };

    if (editingId) {
      setStaff((previous) =>
        previous.map((employee) =>
          employee.id === editingId ? record : employee
        )
      );
      showMessage("Employee updated successfully.");
    } else {
      setStaff((previous) => [record, ...previous]);
      showMessage("Employee added successfully.");
    }

    setModal("");
  };

  const deleteEmployee = () => {
    if (!deleteTarget) return;

    setStaff((previous) =>
      previous.filter((employee) => employee.id !== deleteTarget.id)
    );

    setDeleteTarget(null);
    showMessage("Employee deleted successfully.");
  };

  const exportCSV = () => {
    const headers = [
      "Employee ID", "Name", "Email", "Phone", "Department",
      "Designation", "Joining Date", "Status",
      "Emergency Contact", "Emergency Phone", "Address",
    ];

    const rows = filteredStaff.map((employee) => [
      employee.id,
      employee.name,
      employee.email,
      employee.phone,
      employee.department,
      employee.designation,
      employee.joiningDate,
      employee.status,
      employee.emergencyName,
      employee.emergencyPhone,
      employee.address,
    ]);

    const csv = [headers, ...rows]
      .map((row) =>
        row.map((value) => `"${String(value ?? "").replace(/"/g, '""')}"`).join(",")
      )
      .join("\n");

    const blob = new Blob(["\uFEFF" + csv], {
      type: "text/csv;charset=utf-8;",
    });

    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "stayflow-staff-directory.csv";
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
              <Users size={25} />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-slate-900">Staff Directory</h1>
              <p className="mt-1 text-sm text-slate-500">
                Manage employee profiles, departments and employment information.
              </p>
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            <button
              onClick={exportCSV}
              className="flex items-center gap-2 rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50"
            >
              <Download size={16} /> Export CSV
            </button>
            <button
              onClick={openCreate}
              className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-blue-700"
            >
              <UserPlus size={17} /> Add Employee
            </button>
          </div>
        </div>

        {notification && (
          <div className="flex items-center justify-between rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800">
            {notification}
            <button onClick={() => setNotification("")}><X size={17} /></button>
          </div>
        )}

        {/* Summary */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <StatCard title="Total Employees" value={stats.total} subtitle="Registered employees" icon={Users} color="blue" />
          <StatCard title="Active Employees" value={stats.active} subtitle="Currently working" icon={ShieldCheck} color="green" />
          <StatCard title="On Leave" value={stats.onLeave} subtitle="Currently on leave" icon={CalendarDays} color="amber" />
          <StatCard title="On Probation" value={stats.probation} subtitle="Probation employees" icon={BriefcaseBusiness} color="purple" />
        </div>

        {/* Filters */}
        <div className="rounded-xl border border-slate-200 bg-white p-4">
          <div className="mb-3 flex items-center gap-2">
            <Filter size={17} className="text-slate-500" />
            <h2 className="font-semibold text-slate-800">Search & Filters</h2>
          </div>

          <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
            <div className="relative">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search employee, ID, phone..."
                className={`${inputClass} pl-9`}
              />
            </div>

            <select
              value={departmentFilter}
              onChange={(e) => setDepartmentFilter(e.target.value)}
              className={inputClass}
            >
              <option value="All">All Departments</option>
              {departments.map((department) => (
                <option key={department}>{department}</option>
              ))}
            </select>

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className={inputClass}
            >
              <option value="All">All Employment Statuses</option>
              {statuses.map((status) => (
                <option key={status}>{status}</option>
              ))}
            </select>
          </div>

          <div className="mt-3 flex justify-between text-xs text-slate-500">
            <span>Showing {filteredStaff.length} of {staff.length} employees</span>
            <button
              onClick={() => {
                setSearch("");
                setDepartmentFilter("All");
                setStatusFilter("All");
              }}
              className="font-semibold text-blue-600"
            >
              Clear filters
            </button>
          </div>
        </div>

        {/* Employee Table */}
        <div className="overflow-hidden rounded-xl border border-slate-200 bg-white">
          <div className="border-b border-slate-200 p-4">
            <h2 className="font-semibold text-slate-900">All Employees</h2>
            <p className="mt-1 text-xs text-slate-500">
              Employee directory and contact information.
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full min-w-[1100px] text-left text-sm">
              <thead className="bg-slate-50 text-xs uppercase text-slate-500">
                <tr>
                  <th className="px-4 py-3">Employee</th>
                  <th className="px-4 py-3">Contact</th>
                  <th className="px-4 py-3">Department</th>
                  <th className="px-4 py-3">Designation</th>
                  <th className="px-4 py-3">Joining Date</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3 text-right">Actions</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-100">
                {filteredStaff.map((employee) => (
                  <tr key={employee.id} className="hover:bg-slate-50">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        {employee.photo ? (
                          <img
                            src={employee.photo}
                            alt={employee.name}
                            className="h-10 w-10 rounded-full object-cover"
                          />
                        ) : (
                          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100 font-bold text-blue-700">
                            {employee.name.charAt(0).toUpperCase()}
                          </div>
                        )}
                        <div>
                          <p className="font-semibold text-slate-800">{employee.name}</p>
                          <p className="mt-1 text-xs text-slate-400">{employee.id}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <p className="flex items-center gap-1.5 text-slate-700">
                        <Mail size={13} className="text-slate-400" /> {employee.email || "—"}
                      </p>
                      <p className="mt-1 flex items-center gap-1.5 text-xs text-slate-500">
                        <Phone size={13} /> {employee.phone}
                      </p>
                    </td>
                    <td className="px-4 py-3 text-slate-600">{employee.department}</td>
                    <td className="px-4 py-3 text-slate-600">{employee.designation}</td>
                    <td className="px-4 py-3 text-slate-600">{moneyDate(employee.joiningDate)}</td>
                    <td className="px-4 py-3"><StatusBadge status={employee.status} /></td>
                    <td className="px-4 py-3">
                      <div className="flex justify-end gap-1">
                        <button
                          title="View employee"
                          onClick={() => {
                            setSelectedEmployee(employee);
                            setModal("details");
                          }}
                          className="rounded-lg p-2 text-slate-500 hover:bg-blue-50 hover:text-blue-600"
                        >
                          <Eye size={16} />
                        </button>
                        <button
                          title="Edit employee"
                          onClick={() => openEdit(employee)}
                          className="rounded-lg p-2 text-slate-500 hover:bg-amber-50 hover:text-amber-600"
                        >
                          <Pencil size={16} />
                        </button>
                        <button
                          title="Delete employee"
                          onClick={() => setDeleteTarget(employee)}
                          className="rounded-lg p-2 text-slate-500 hover:bg-red-50 hover:text-red-600"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}

                {filteredStaff.length === 0 && (
                  <tr>
                    <td colSpan="7" className="px-4 py-12 text-center text-slate-500">
                      <Users size={32} className="mx-auto mb-2 text-slate-300" />
                      No employees found.
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
            <div className="max-h-[94vh] w-full max-w-3xl overflow-y-auto rounded-2xl bg-white shadow-2xl">
              <div className="sticky top-0 z-10 flex items-center justify-between border-b border-slate-200 bg-white p-5">
                <div>
                  <h2 className="text-lg font-bold text-slate-900">
                    {editingId ? "Edit Employee" : "Add New Employee"}
                  </h2>
                  <p className="mt-1 text-xs text-slate-500">
                    Enter employee details and emergency contact information.
                  </p>
                </div>
                <button onClick={() => setModal("")} className="rounded-lg p-2 hover:bg-slate-100">
                  <X size={20} />
                </button>
              </div>

              <form onSubmit={saveEmployee} className="space-y-5 p-5">
                {/* Profile photo */}
                <div className="flex flex-col items-center gap-3 rounded-xl bg-slate-50 p-4 sm:flex-row">
                  {form.photo ? (
                    <img src={form.photo} alt="Profile preview" className="h-20 w-20 rounded-full object-cover" />
                  ) : (
                    <div className="flex h-20 w-20 items-center justify-center rounded-full bg-blue-100 text-blue-600">
                      <UserRound size={35} />
                    </div>
                  )}
                  <div>
                    <p className="font-semibold text-slate-800">Employee Profile Photo</p>
                    <p className="mt-1 text-xs text-slate-500">JPG, PNG or WebP. Maximum 3 MB.</p>
                    <button
                      type="button"
                      onClick={() => photoRef.current?.click()}
                      className="mt-2 flex items-center gap-2 rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs font-semibold text-slate-700"
                    >
                      <Camera size={14} /> Upload Photo
                    </button>
                    <input ref={photoRef} type="file" accept="image/*" hidden onChange={handlePhoto} />
                  </div>
                </div>

                <div>
                  <h3 className="mb-3 font-semibold text-slate-900">Personal & Contact Details</h3>
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <Field label="Employee ID">
                      <input value={form.id} readOnly className={`${inputClass} bg-slate-50`} />
                    </Field>
                    <Field label="Full Name" required>
                      <input required value={form.name} onChange={(e) => updateForm("name", e.target.value)} className={inputClass} placeholder="Enter full name" />
                    </Field>
                    <Field label="Email Address">
                      <input type="email" value={form.email} onChange={(e) => updateForm("email", e.target.value)} className={inputClass} placeholder="employee@example.com" />
                    </Field>
                    <Field label="Phone Number" required>
                      <input required value={form.phone} onChange={(e) => updateForm("phone", e.target.value)} className={inputClass} placeholder="Enter phone number" />
                    </Field>
                    <div className="sm:col-span-2">
                      <Field label="Address">
                        <textarea rows={2} value={form.address} onChange={(e) => updateForm("address", e.target.value)} className={inputClass} placeholder="Employee address" />
                      </Field>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="mb-3 font-semibold text-slate-900">Employment Details</h3>
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <Field label="Department" required>
                      <select value={form.department} onChange={(e) => updateForm("department", e.target.value)} className={inputClass}>
                        {departments.map((department) => <option key={department}>{department}</option>)}
                      </select>
                    </Field>
                    <Field label="Designation" required>
                      <input required value={form.designation} onChange={(e) => updateForm("designation", e.target.value)} className={inputClass} placeholder="e.g. Front Desk Manager" />
                    </Field>
                    <Field label="Joining Date" required>
                      <input type="date" required value={form.joiningDate} onChange={(e) => updateForm("joiningDate", e.target.value)} className={inputClass} />
                    </Field>
                    <Field label="Employment Status" required>
                      <select value={form.status} onChange={(e) => updateForm("status", e.target.value)} className={inputClass}>
                        {statuses.map((status) => <option key={status}>{status}</option>)}
                      </select>
                    </Field>
                  </div>
                </div>

                <div>
                  <h3 className="mb-3 font-semibold text-slate-900">Emergency Contact</h3>
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <Field label="Contact Person">
                      <input value={form.emergencyName} onChange={(e) => updateForm("emergencyName", e.target.value)} className={inputClass} placeholder="Emergency contact name" />
                    </Field>
                    <Field label="Emergency Phone">
                      <input value={form.emergencyPhone} onChange={(e) => updateForm("emergencyPhone", e.target.value)} className={inputClass} placeholder="Emergency phone number" />
                    </Field>
                  </div>
                </div>

                {/* Documents */}
                <div>
                  <div className="mb-3 flex items-center justify-between gap-2">
                    <h3 className="font-semibold text-slate-900">Employee Documents</h3>
                    <button
                      type="button"
                      onClick={() => documentsRef.current?.click()}
                      className="flex items-center gap-2 rounded-lg border border-slate-300 px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50"
                    >
                      <Upload size={14} /> Add Documents
                    </button>
                    <input ref={documentsRef} type="file" multiple hidden onChange={handleDocuments} />
                  </div>

                  <div className="space-y-2">
                    {form.documents.map((document, index) => (
                      <div key={`${document.name}-${index}`} className="flex items-center justify-between rounded-lg border border-slate-200 p-3">
                        <div className="flex min-w-0 items-center gap-2">
                          <FileText size={18} className="shrink-0 text-blue-600" />
                          <div className="min-w-0">
                            <p className="truncate text-sm font-medium text-slate-700">{document.name}</p>
                            <p className="text-xs text-slate-400">{(document.size / 1024).toFixed(1)} KB</p>
                          </div>
                        </div>
                        <button type="button" onClick={() => removeDocument(index)} className="rounded p-2 text-red-500 hover:bg-red-50">
                          <X size={16} />
                        </button>
                      </div>
                    ))}
                    {form.documents.length === 0 && (
                      <p className="rounded-lg border border-dashed border-slate-300 p-5 text-center text-sm text-slate-400">
                        No documents attached.
                      </p>
                    )}
                  </div>
                </div>

                <div className="flex justify-end gap-2 border-t border-slate-200 pt-4">
                  <button type="button" onClick={() => setModal("")} className="rounded-lg border border-slate-300 px-4 py-2.5 text-sm font-semibold text-slate-700">
                    Cancel
                  </button>
                  <button type="submit" className="flex items-center gap-2 rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-blue-700">
                    <Save size={16} /> {editingId ? "Save Changes" : "Create Employee"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Employee Details */}
        {modal === "details" && selectedEmployee && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 p-3">
            <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl bg-white shadow-2xl">
              <div className="flex items-center justify-between border-b border-slate-200 p-5">
                <div>
                  <h2 className="text-lg font-bold text-slate-900">Employee Profile</h2>
                  <p className="mt-1 text-xs text-slate-500">{selectedEmployee.id}</p>
                </div>
                <button onClick={() => setModal("")} className="rounded-lg p-2 hover:bg-slate-100">
                  <X size={20} />
                </button>
              </div>

              <div className="space-y-5 p-5">
                <div className="flex flex-col items-center gap-4 rounded-xl bg-slate-50 p-5 sm:flex-row">
                  {selectedEmployee.photo ? (
                    <img src={selectedEmployee.photo} alt={selectedEmployee.name} className="h-20 w-20 rounded-full object-cover" />
                  ) : (
                    <div className="flex h-20 w-20 items-center justify-center rounded-full bg-blue-100 text-2xl font-bold text-blue-700">
                      {selectedEmployee.name.charAt(0)}
                    </div>
                  )}
                  <div className="flex-1 text-center sm:text-left">
                    <h3 className="text-xl font-bold text-slate-900">{selectedEmployee.name}</h3>
                    <p className="mt-1 text-sm text-slate-500">{selectedEmployee.designation}</p>
                    <div className="mt-2"><StatusBadge status={selectedEmployee.status} /></div>
                  </div>
                </div>

                <div>
                  <h3 className="mb-3 font-semibold text-slate-900">Employee Information</h3>
                  <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                    {[
                      ["Employee ID", selectedEmployee.id],
                      ["Department", selectedEmployee.department],
                      ["Email", selectedEmployee.email || "—"],
                      ["Phone", selectedEmployee.phone],
                      ["Joining Date", moneyDate(selectedEmployee.joiningDate)],
                      ["Address", selectedEmployee.address || "—"],
                      ["Emergency Contact", selectedEmployee.emergencyName || "—"],
                      ["Emergency Phone", selectedEmployee.emergencyPhone || "—"],
                    ].map(([label, value]) => (
                      <div key={label} className="rounded-lg border border-slate-200 p-3">
                        <p className="text-xs text-slate-400">{label}</p>
                        <p className="mt-1 break-words text-sm font-semibold text-slate-800">{value}</p>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="mb-3 font-semibold text-slate-900">Documents ({selectedEmployee.documents.length})</h3>
                  {selectedEmployee.documents.length ? (
                    selectedEmployee.documents.map((document, index) => (
                      <div key={`${document.name}-${index}`} className="mb-2 flex items-center gap-2 rounded-lg border border-slate-200 p-3 text-sm text-slate-700">
                        <FileText size={17} className="text-blue-600" />
                        {document.name}
                      </div>
                    ))
                  ) : (
                    <p className="text-sm text-slate-400">No documents uploaded.</p>
                  )}
                </div>

                <div className="flex justify-end border-t border-slate-200 pt-4">
                  <button
                    onClick={() => openEdit(selectedEmployee)}
                    className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white"
                  >
                    <Pencil size={15} /> Edit Employee
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Delete confirmation */}
        {deleteTarget && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center bg-slate-950/50 p-3">
            <div className="w-full max-w-md rounded-2xl bg-white p-5 shadow-2xl">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-red-50 text-red-600">
                <Trash2 size={22} />
              </div>
              <h2 className="mt-4 text-lg font-bold text-slate-900">Delete Employee?</h2>
              <p className="mt-2 text-sm text-slate-500">
                Are you sure you want to delete {deleteTarget.name} ({deleteTarget.id})?
              </p>
              <div className="mt-5 flex justify-end gap-2">
                <button onClick={() => setDeleteTarget(null)} className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-semibold">
                  Cancel
                </button>
                <button onClick={deleteEmployee} className="rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white">
                  Delete Employee
                </button>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
