
import { useMemo, useState } from "react";
import {
  Users,
  ShieldCheck,
  ClipboardList,
  Plus,
  Search,
  Lock,
  Unlock,
  KeyRound,
  Pencil,
  Trash2,
  X,
  Check,
  UserPlus,
  Filter,
  Download,
  Eye,
  Clock,
} from "lucide-react";

const initialUsers = [
  { id: "USR-001", name: "Admin User", email: "admin@hotelamarpalace.com", role: "Super Admin", department: "Administration", status: "Active", lastLogin: "06 Nov 2026, 09:15 AM", locked: false },
  { id: "USR-002", name: "Rahul Sharma", email: "rahul@hotelamarpalace.com", role: "Hotel Manager", department: "Management", status: "Active", lastLogin: "06 Nov 2026, 08:45 AM", locked: false },
  { id: "USR-003", name: "Priya Singh", email: "priya@hotelamarpalace.com", role: "Receptionist", department: "Front Office", status: "Active", lastLogin: "05 Nov 2026, 10:20 PM", locked: false },
  { id: "USR-004", name: "Amit Verma", email: "amit@hotelamarpalace.com", role: "Accountant", department: "Accounts", status: "Inactive", lastLogin: "01 Nov 2026, 04:10 PM", locked: false },
  { id: "USR-005", name: "Neha Kumari", email: "neha@hotelamarpalace.com", role: "Restaurant Manager", department: "Restaurant", status: "Active", lastLogin: "06 Nov 2026, 07:30 AM", locked: true },
];

const modules = [
  "Dashboard",
  "Reservations",
  "Guests",
  "Rooms",
  "Restaurant",
  "Housekeeping",
  "Events",
  "Maintenance",
  "Revenue",
  "Finance",
  "Reports",
  "Users & Access",
];

const permissionTypes = ["View", "Create", "Edit", "Delete"];

const initialRoles = [
  { id: "ROL-001", name: "Super Admin", description: "Complete system access", users: 1, permissions: Object.fromEntries(modules.map((m) => [m, ["View", "Create", "Edit", "Delete"]])) },
  { id: "ROL-002", name: "Hotel Manager", description: "Hotel operations and management", users: 1, permissions: Object.fromEntries(modules.map((m) => [m, ["View", "Create", "Edit"]])) },
  { id: "ROL-003", name: "Receptionist", description: "Front office and guest services", users: 1, permissions: { Dashboard: ["View"], Reservations: ["View", "Create", "Edit"], Guests: ["View", "Create", "Edit"], Rooms: ["View"], Reports: ["View"] } },
  { id: "ROL-004", name: "Accountant", description: "Financial operations and reporting", users: 1, permissions: { Dashboard: ["View"], Finance: ["View", "Create", "Edit"], Revenue: ["View"], Reports: ["View"] }, financialApproval: true },
  { id: "ROL-005", name: "Housekeeping Staff", description: "Room cleaning and housekeeping", users: 0, permissions: { Dashboard: ["View"], Rooms: ["View", "Edit"], Housekeeping: ["View", "Create", "Edit"] } },
  { id: "ROL-006", name: "Restaurant Manager", description: "Restaurant operations", users: 1, permissions: { Dashboard: ["View"], Restaurant: ["View", "Create", "Edit"], Reports: ["View"] } },
  { id: "ROL-007", name: "Event Manager", description: "Events and banquet management", users: 0, permissions: { Dashboard: ["View"], Events: ["View", "Create", "Edit"], Guests: ["View"], Finance: ["View"] } },
];

const initialLogs = [
  { id: "LOG-001", user: "Rahul Sharma", email: "rahul@hotelamarpalace.com", action: "Price Updated", module: "Revenue", reference: "PRICE-104", date: "06 Nov 2026, 09:15 AM", previous: "₹2,000", updated: "₹2,500", device: "Windows / Chrome", ip: "192.168.1.10" },
  { id: "LOG-002", user: "Priya Singh", email: "priya@hotelamarpalace.com", action: "Booking Cancelled", module: "Reservations", reference: "RES-2026-045", date: "06 Nov 2026, 08:50 AM", previous: "Confirmed", updated: "Cancelled", device: "Windows / Chrome", ip: "192.168.1.12" },
  { id: "LOG-003", user: "Admin User", email: "admin@hotelamarpalace.com", action: "Permission Updated", module: "Users & Access", reference: "ROL-003", date: "05 Nov 2026, 05:30 PM", previous: "View only", updated: "View, Create, Edit", device: "Windows / Edge", ip: "192.168.1.5" },
  { id: "LOG-004", user: "Amit Verma", email: "amit@hotelamarpalace.com", action: "Payment Recorded", module: "Finance", reference: "PAY-0082", date: "05 Nov 2026, 03:20 PM", previous: "Pending", updated: "Paid", device: "Android / Chrome", ip: "192.168.1.15" },
  { id: "LOG-005", user: "Admin User", email: "admin@hotelamarpalace.com", action: "Refund Approved", module: "Finance", reference: "REF-0018", date: "04 Nov 2026, 01:10 PM", previous: "Requested", updated: "Approved", device: "Windows / Chrome", ip: "192.168.1.5" },
];

const inputClass = "w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100";
const cardClass = "rounded-xl border border-slate-200 bg-white p-5";
const buttonClass = "inline-flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-blue-700";
const secondaryButton = "inline-flex items-center justify-center gap-2 rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50";

function PageHeader({ title, subtitle, icon: Icon, children }) {
  return (
    <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
      <div className="flex items-center gap-3">
        <div className="rounded-xl bg-blue-50 p-3 text-blue-600"><Icon size={24} /></div>
        <div>
          <h1 className="text-2xl font-bold text-slate-900">{title}</h1>
          <p className="mt-1 text-sm text-slate-500">{subtitle}</p>
        </div>
      </div>
      <div className="flex flex-wrap gap-2">{children}</div>
    </div>
  );
}

function StatCard({ label, value, icon: Icon, color = "blue" }) {
  const colors = {
    blue: "bg-blue-50 text-blue-600",
    green: "bg-green-50 text-green-600",
    amber: "bg-amber-50 text-amber-600",
    red: "bg-red-50 text-red-600",
  };
  return (
    <div className={cardClass}>
      <div className="flex items-center justify-between">
        <p className="text-sm text-slate-500">{label}</p>
        <div className={`rounded-lg p-2 ${colors[color]}`}><Icon size={19} /></div>
      </div>
      <p className="mt-3 text-2xl font-bold text-slate-900">{value}</p>
    </div>
  );
}

function Modal({ title, onClose, children, size = "max-w-lg" }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 p-4">
      <div className={`max-h-[90vh] w-full ${size} overflow-y-auto rounded-2xl bg-white shadow-xl`}>
        <div className="sticky top-0 flex items-center justify-between border-b border-slate-200 bg-white px-5 py-4">
          <h2 className="text-lg font-semibold text-slate-900">{title}</h2>
          <button onClick={onClose} className="rounded-lg p-2 text-slate-500 hover:bg-slate-100"><X size={19} /></button>
        </div>
        <div className="p-5">{children}</div>
      </div>
    </div>
  );
}

function Field({ label, children }) {
  return <label className="block space-y-1.5"><span className="text-sm font-medium text-slate-700">{label}</span>{children}</label>;
}

function StatusBadge({ status }) {
  const style = status === "Active" || status === "Completed" || status === "Approved"
    ? "bg-green-50 text-green-700"
    : status === "Inactive" || status === "Locked" || status === "Cancelled"
      ? "bg-red-50 text-red-700"
      : "bg-amber-50 text-amber-700";
  return <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${style}`}>{status}</span>;
}

// A. ALL USERS
export function AllUsers() {
  const [users, setUsers] = useState(initialUsers);
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");
  const [selected, setSelected] = useState(null);
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", role: "Receptionist", department: "Front Office" });

  const filtered = users.filter((u) => {
    const matchesSearch = `${u.name} ${u.email} ${u.id}`.toLowerCase().includes(search.toLowerCase());
    return matchesSearch && (roleFilter === "All" || u.role === roleFilter) && (statusFilter === "All" || u.status === statusFilter);
  });

  const active = users.filter((u) => u.status === "Active").length;
  const locked = users.filter((u) => u.locked).length;

  const saveUser = (e) => {
    e.preventDefault();
    if (!form.name.trim() || !form.email.trim()) return;
    if (editing) {
      setUsers((prev) => prev.map((u) => u.id === editing ? { ...u, ...form } : u));
    } else {
      setUsers((prev) => [...prev, {
        ...form,
        id: `USR-${String(Date.now()).slice(-5)}`,
        status: "Active",
        lastLogin: "Never",
        locked: false,
      }]);
    }
    setSelected(null);
    setEditing(false);
    setForm({ name: "", email: "", role: "Receptionist", department: "Front Office" });
  };

  const openEdit = (user) => {
    setForm({ name: user.name, email: user.email, role: user.role, department: user.department });
    setEditing(user.id);
    setSelected(null);
  };

  const toggleLock = (id) => setUsers((prev) => prev.map((u) => u.id === id ? { ...u, locked: !u.locked } : u));
  const toggleStatus = (id) => setUsers((prev) => prev.map((u) => u.id === id ? { ...u, status: u.status === "Active" ? "Inactive" : "Active" } : u));

  const resetPassword = (user) => {
    alert(`Demo only: Password reset invitation would be sent to ${user.email} after backend integration.`);
  };

  return (
    <div className="min-h-screen space-y-6 bg-[#F5F7FA] p-4 md:p-6 lg:p-7">
      <PageHeader title="All Users" subtitle="Create and manage hotel system user accounts." icon={Users}>
        <button className={buttonClass} onClick={() => { setEditing(false); setForm({ name: "", email: "", role: "Receptionist", department: "Front Office" }); setSelected("new"); }}>
          <UserPlus size={17} /> Add User
        </button>
      </PageHeader>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Total Users" value={users.length} icon={Users} />
        <StatCard label="Active Users" value={active} icon={Check} color="green" />
        <StatCard label="Inactive Users" value={users.length - active} icon={Users} color="amber" />
        <StatCard label="Locked Accounts" value={locked} icon={Lock} color="red" />
      </div>

      <div className={cardClass}>
        <div className="mb-4 flex flex-col gap-3 lg:flex-row">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-3 text-slate-400" size={17} />
            <input className={`${inputClass} pl-10`} placeholder="Search by name, email or user ID..." value={search} onChange={(e) => setSearch(e.target.value)} />
          </div>
          <select className={`${inputClass} lg:w-52`} value={roleFilter} onChange={(e) => setRoleFilter(e.target.value)}>
            <option>All</option>{initialRoles.map((r) => <option key={r.id}>{r.name}</option>)}
          </select>
          <select className={`${inputClass} lg:w-40`} value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
            <option>All</option><option>Active</option><option>Inactive</option>
          </select>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[950px] text-left text-sm">
            <thead className="bg-slate-50 text-xs uppercase text-slate-500">
              <tr>{["User", "Role", "Department", "Status", "Last Login", "Account", "Actions"].map((h) => <th key={h} className="px-4 py-3 font-semibold">{h}</th>)}</tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.map((u) => (
                <tr key={u.id} className="hover:bg-slate-50/70">
                  <td className="px-4 py-4">
                    <p className="font-semibold text-slate-800">{u.name}</p>
                    <p className="text-xs text-slate-500">{u.email}</p>
                    <p className="mt-1 text-xs text-slate-400">{u.id}</p>
                  </td>
                  <td className="px-4 py-4 text-slate-700">{u.role}</td>
                  <td className="px-4 py-4 text-slate-600">{u.department}</td>
                  <td className="px-4 py-4"><StatusBadge status={u.status} /></td>
                  <td className="px-4 py-4 text-slate-600">{u.lastLogin}</td>
                  <td className="px-4 py-4"><StatusBadge status={u.locked ? "Locked" : "Unlocked"} /></td>
                  <td className="px-4 py-4">
                    <div className="flex gap-1">
                      <button title="View details" onClick={() => setSelected(u)} className="rounded-lg p-2 text-slate-500 hover:bg-slate-100"><Eye size={17} /></button>
                      <button title="Edit user" onClick={() => openEdit(u)} className="rounded-lg p-2 text-blue-600 hover:bg-blue-50"><Pencil size={17} /></button>
                      <button title={u.locked ? "Unlock account" : "Lock account"} onClick={() => toggleLock(u.id)} className="rounded-lg p-2 text-amber-600 hover:bg-amber-50">{u.locked ? <Unlock size={17} /> : <Lock size={17} />}</button>
                      <button title="Reset password" onClick={() => resetPassword(u)} className="rounded-lg p-2 text-slate-600 hover:bg-slate-100"><KeyRound size={17} /></button>
                    </div>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && <tr><td colSpan="7" className="py-12 text-center text-slate-500">No users found.</td></tr>}
            </tbody>
          </table>
        </div>
        <div className="mt-4 flex flex-wrap items-center justify-between gap-2 text-xs text-slate-500">
          <span>Showing {filtered.length} of {users.length} users</span>
          <span>Account actions are demo-only until authentication is connected.</span>
        </div>
      </div>

      {(selected === "new" || editing) && (
        <Modal title={editing ? "Edit User" : "Create New User"} onClose={() => { setSelected(null); setEditing(false); }}>
          <form onSubmit={saveUser} className="space-y-4">
            <Field label="Full Name"><input className={inputClass} required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Enter full name" /></Field>
            <Field label="Email Address"><input type="email" className={inputClass} required value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="name@hotel.com" /></Field>
            <Field label="Assigned Role"><select className={inputClass} value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })}>{initialRoles.map((r) => <option key={r.id}>{r.name}</option>)}</select></Field>
            <Field label="Department"><select className={inputClass} value={form.department} onChange={(e) => setForm({ ...form, department: e.target.value })}>{["Administration", "Management", "Front Office", "Accounts", "Housekeeping", "Restaurant", "Events", "Maintenance"].map((d) => <option key={d}>{d}</option>)}</select></Field>
            {!editing && <div className="rounded-lg bg-blue-50 p-3 text-sm text-blue-700">A login invitation should be sent to this email after email service integration.</div>}
            <div className="flex justify-end gap-2 pt-2"><button type="button" className={secondaryButton} onClick={() => { setSelected(null); setEditing(false); }}>Cancel</button><button className={buttonClass} type="submit"><Check size={16} /> {editing ? "Save Changes" : "Create User"}</button></div>
          </form>
        </Modal>
      )}

      {selected && selected !== "new" && typeof selected === "object" && (
        <Modal title="User Details" onClose={() => setSelected(null)}>
          <div className="space-y-4 text-sm">
            {[["User ID", selected.id], ["Name", selected.name], ["Email", selected.email], ["Role", selected.role], ["Department", selected.department], ["Status", selected.status], ["Last Login", selected.lastLogin], ["Account", selected.locked ? "Locked" : "Unlocked"]].map(([label, value]) => <div key={label} className="flex justify-between gap-4 border-b border-slate-100 pb-3"><span className="text-slate-500">{label}</span><span className="text-right font-medium text-slate-800">{value}</span></div>)}
            <div className="flex flex-wrap justify-end gap-2 pt-2">
              <button className={secondaryButton} onClick={() => toggleStatus(selected.id)}>{selected.status === "Active" ? "Deactivate" : "Activate"}</button>
              <button className={buttonClass} onClick={() => { toggleLock(selected.id); setSelected({ ...selected, locked: !selected.locked }); }}>{selected.locked ? <Unlock size={16} /> : <Lock size={16} />}{selected.locked ? "Unlock" : "Lock"} Account</button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}