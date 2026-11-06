
import { useMemo, useState } from "react";
import {
  ShieldCheck, Plus, Search, Pencil, Trash2, Copy, X,
  Users, Lock, Eye, Save, Check, UserRound, Shield,
} from "lucide-react";

const modules = [
  "Dashboard", "Reservations", "Guests", "Rooms", "Front Desk",
  "Housekeeping", "Restaurant", "Events", "Revenue", "Payments",
  "Reports", "Maintenance", "Staff", "Access Control",
];

const initialRoles = [
  {
    id: 1, name: "Super Admin", description: "Complete system access.",
    users: 1, system: true, financial: true, sensitive: true,
    permissions: Object.fromEntries(modules.map(m => [m, ["view", "create", "edit", "delete"]])),
  },
  {
    id: 2, name: "Hotel Manager", description: "Manage hotel operations.",
    users: 2, system: false, financial: true, sensitive: true,
    permissions: Object.fromEntries(modules.map(m => [
      m, ["Dashboard", "Reservations", "Guests", "Rooms", "Front Desk",
        "Housekeeping", "Restaurant", "Events", "Revenue", "Payments",
        "Reports", "Maintenance"].includes(m) ? ["view", "create", "edit"] : ["view"],
    ])),
  },
  {
    id: 3, name: "Receptionist", description: "Front desk and guest handling.",
    users: 2, system: false, financial: false, sensitive: false,
    permissions: Object.fromEntries(modules.map(m => [
      m, ["Dashboard", "Reservations", "Guests", "Rooms", "Front Desk"].includes(m)
        ? ["view", "create", "edit"] : [],
    ])),
  },
  {
    id: 4, name: "Accountant", description: "Financial records and reporting.",
    users: 1, system: false, financial: true, sensitive: true,
    permissions: Object.fromEntries(modules.map(m => [
      m, ["Dashboard", "Payments", "Revenue", "Reports"].includes(m)
        ? ["view", "create", "edit"] : [],
    ])),
  },
  {
    id: 5, name: "Housekeeping Staff", description: "Room cleaning and status updates.",
    users: 4, system: false, financial: false, sensitive: false,
    permissions: Object.fromEntries(modules.map(m => [
      m, ["Dashboard", "Rooms", "Housekeeping"].includes(m) ? ["view", "edit"] : [],
    ])),
  },
  {
    id: 6, name: "Restaurant Manager", description: "Restaurant operations.",
    users: 1, system: false, financial: false, sensitive: false,
    permissions: Object.fromEntries(modules.map(m => [
      m, ["Dashboard", "Restaurant"].includes(m) ? ["view", "create", "edit", "delete"] : [],
    ])),
  },
  {
    id: 7, name: "Event Manager", description: "Events and banquet management.",
    users: 1, system: false, financial: false, sensitive: false,
    permissions: Object.fromEntries(modules.map(m => [
      m, ["Dashboard", "Events", "Guests"].includes(m) ? ["view", "create", "edit"] : [],
    ])),
  },
];

const actions = ["view", "create", "edit", "delete"];

const emptyRole = () => ({
  name: "", description: "", financial: false, sensitive: false,
  permissions: Object.fromEntries(modules.map(m => [m, []])),
});

export default function RolesPermissions() {
  const [roles, setRoles] = useState(initialRoles);
  const [selectedId, setSelectedId] = useState(1);
  const [search, setSearch] = useState("");
  const [modal, setModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [draft, setDraft] = useState(emptyRole());
  const [tab, setTab] = useState("permissions");
  const [notice, setNotice] = useState("");

  const selected = roles.find(r => r.id === selectedId) || roles[0];
  const filtered = roles.filter(r =>
    r.name.toLowerCase().includes(search.toLowerCase())
  );

  const openCreate = () => {
    setEditing(null);
    setDraft(emptyRole());
    setModal(true);
  };

  const openEdit = role => {
    setEditing(role.id);
    setDraft({
      name: role.name,
      description: role.description,
      financial: role.financial,
      sensitive: role.sensitive,
      permissions: Object.fromEntries(
        modules.map(m => [m, [...(role.permissions[m] || [])]])
      ),
    });
    setModal(true);
  };

  const togglePermission = (module, action) => {
    setDraft(prev => {
      const current = prev.permissions[module] || [];
      return {
        ...prev,
        permissions: {
          ...prev.permissions,
          [module]: current.includes(action)
            ? current.filter(a => a !== action)
            : [...current, action],
        },
      };
    });
  };

  const toggleAll = module => {
    setDraft(prev => ({
      ...prev,
      permissions: {
        ...prev.permissions,
        [module]: prev.permissions[module]?.length === 4 ? [] : [...actions],
      },
    }));
  };

  const saveRole = e => {
    e.preventDefault();
    if (!draft.name.trim()) return;
    if (editing) {
      setRoles(prev => prev.map(r => r.id === editing ? { ...r, ...draft } : r));
      setNotice("Role updated successfully.");
    } else {
      const newRole = { ...draft, id: Date.now(), users: 0, system: false };
      setRoles(prev => [...prev, newRole]);
      setSelectedId(newRole.id);
      setNotice("New role created successfully.");
    }
    setModal(false);
  };

  const duplicateRole = role => {
    const copy = {
      ...role, id: Date.now(), name: `${role.name} Copy`,
      system: false, users: 0,
      permissions: Object.fromEntries(
        modules.map(m => [m, [...(role.permissions[m] || [])]])
      ),
    };
    setRoles(prev => [...prev, copy]);
    setSelectedId(copy.id);
    setNotice("Role duplicated successfully.");
  };

  const deleteRole = role => {
    if (role.system) return;
    if (!window.confirm(`Delete the "${role.name}" role?`)) return;
    setRoles(prev => prev.filter(r => r.id !== role.id));
    if (selectedId === role.id) setSelectedId(1);
    setNotice("Role deleted.");
  };

  return (
    <div className="w-full min-h-screen bg-[#F5F7FA] p-4 md:p-6 lg:p-7 space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-blue-600 mb-1">
            <ShieldCheck size={21} />
            <span className="text-sm font-semibold">Access Control</span>
          </div>
          <h1 className="text-2xl font-bold text-slate-900">Roles & Permissions</h1>
          <p className="text-sm text-slate-500 mt-1">Manage roles and control access to hotel modules.</p>
        </div>
        <button onClick={openCreate} className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2.5 rounded-lg text-sm font-semibold">
          <Plus size={17} /> Create Role
        </button>
      </div>

      {notice && (
        <div className="flex justify-between items-center bg-blue-50 border border-blue-200 text-blue-700 rounded-lg px-4 py-3 text-sm">
          {notice}
          <button onClick={() => setNotice("")}><X size={16} /></button>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          ["Total Roles", roles.length, Shield],
          ["Assigned Users", roles.reduce((sum, r) => sum + r.users, 0), Users],
          ["Protected Modules", modules.length, Lock],
        ].map(([label, value, Icon]) => (
          <div key={label} className="bg-white border border-slate-200 rounded-xl p-5">
            <div className="flex justify-between items-center">
              <p className="text-sm text-slate-500">{label}</p>
              <Icon size={19} className="text-blue-600" />
            </div>
            <p className="text-2xl font-bold text-slate-900 mt-2">{value}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        <div className="lg:col-span-4 bg-white border border-slate-200 rounded-xl overflow-hidden">
          <div className="p-4 border-b border-slate-200">
            <h2 className="font-semibold text-slate-900">Available Roles</h2>
            <div className="relative mt-3">
              <Search size={16} className="absolute left-3 top-3 text-slate-400" />
              <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search roles..." className="form-input pl-9" />
            </div>
          </div>
          <div className="divide-y divide-slate-100">
            {filtered.map(role => (
              <button key={role.id} onClick={() => setSelectedId(role.id)}
                className={`w-full text-left p-4 hover:bg-slate-50 ${selectedId === role.id ? "bg-blue-50 border-l-4 border-blue-600" : ""}`}>
                <div className="flex items-center justify-between gap-2">
                  <span className="font-semibold text-sm text-slate-800">{role.name}</span>
                  {role.system && <span className="text-[10px] bg-purple-100 text-purple-700 px-2 py-1 rounded-full">System</span>}
                </div>
                <p className="text-xs text-slate-500 mt-1">{role.description}</p>
                <p className="text-xs text-slate-400 mt-2">{role.users} assigned user(s)</p>
              </button>
            ))}
            {filtered.length === 0 && <p className="p-5 text-sm text-slate-500">No roles found.</p>}
          </div>
        </div>

        <div className="lg:col-span-8 bg-white border border-slate-200 rounded-xl overflow-hidden">
          <div className="p-4 md:p-5 border-b border-slate-200 flex flex-col sm:flex-row sm:justify-between gap-3">
            <div>
              <h2 className="text-lg font-bold text-slate-900">{selected.name}</h2>
              <p className="text-sm text-slate-500 mt-1">{selected.description}</p>
            </div>
            <div className="flex gap-2">
              <button onClick={() => duplicateRole(selected)} className="border border-slate-300 rounded-lg px-3 py-2 text-sm flex items-center gap-2 hover:bg-slate-50"><Copy size={15} /> Duplicate</button>
              <button onClick={() => openEdit(selected)} className="bg-blue-600 text-white rounded-lg px-3 py-2 text-sm flex items-center gap-2 hover:bg-blue-700"><Pencil size={15} /> Edit</button>
              {!selected.system && (
                <button onClick={() => deleteRole(selected)} className="border border-red-200 text-red-600 rounded-lg px-3 py-2 hover:bg-red-50"><Trash2 size={16} /></button>
              )}
            </div>
          </div>

          <div className="flex gap-5 px-5 border-b border-slate-200">
            <button onClick={() => setTab("permissions")} className={`py-3 text-sm font-medium border-b-2 ${tab === "permissions" ? "border-blue-600 text-blue-600" : "border-transparent text-slate-500"}`}>Permission Matrix</button>
            <button onClick={() => setTab("security")} className={`py-3 text-sm font-medium border-b-2 ${tab === "security" ? "border-blue-600 text-blue-600" : "border-transparent text-slate-500"}`}>Sensitive Access</button>
          </div>

          {tab === "permissions" ? (
            <div className="p-4 md:p-5 overflow-x-auto">
              <div className="flex justify-between items-center mb-4">
                <div>
                  <h3 className="font-semibold text-slate-800">Module-wise access</h3>
                  <p className="text-xs text-slate-500 mt-1">Permissions currently configured for this role.</p>
                </div>
                <span className="text-xs text-slate-500">{modules.filter(m => (selected.permissions[m] || []).length).length} / {modules.length} modules enabled</span>
              </div>
              <table className="w-full min-w-[560px] text-sm">
                <thead>
                  <tr className="bg-slate-50 text-slate-500">
                    <th className="text-left p-3 font-medium">Module</th>
                    {actions.map(a => <th key={a} className="p-3 text-center capitalize font-medium">{a}</th>)}
                  </tr>
                </thead>
                <tbody>
                  {modules.map(module => (
                    <tr key={module} className="border-b border-slate-100">
                      <td className="p-3 font-medium text-slate-700">{module}</td>
                      {actions.map(action => (
                        <td key={action} className="p-3 text-center">
                          {(selected.permissions[module] || []).includes(action)
                            ? <Check size={17} className="text-green-600 mx-auto" />
                            : <X size={15} className="text-slate-200 mx-auto" />}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
              <p className="text-xs text-slate-400 mt-4">Edit this role to change its permissions.</p>
            </div>
          ) : (
            <div className="p-5 space-y-4">
              <div className="flex items-start gap-3 p-4 rounded-lg border border-slate-200">
                <Lock className="text-blue-600 mt-1" size={20} />
                <div>
                  <p className="font-semibold text-slate-800">Financial approval</p>
                  <p className="text-sm text-slate-500">Can approve eligible financial transactions and refunds.</p>
                  <span className={`inline-block mt-2 text-xs rounded-full px-2 py-1 ${selected.financial ? "bg-green-100 text-green-700" : "bg-slate-100 text-slate-600"}`}>{selected.financial ? "Enabled" : "Disabled"}</span>
                </div>
              </div>
              <div className="flex items-start gap-3 p-4 rounded-lg border border-slate-200">
                <Eye className="text-blue-600 mt-1" size={20} />
                <div>
                  <p className="font-semibold text-slate-800">Sensitive data access</p>
                  <p className="text-sm text-slate-500">Can access restricted guest, staff and financial information.</p>
                  <span className={`inline-block mt-2 text-xs rounded-full px-2 py-1 ${selected.sensitive ? "bg-green-100 text-green-700" : "bg-slate-100 text-slate-600"}`}>{selected.sensitive ? "Enabled" : "Disabled"}</span>
                </div>
              </div>
              <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg text-sm text-amber-800">
                Sensitive permissions should be granted only to authorized personnel. Apply the same restrictions on the backend API.
              </div>
            </div>
          )}
        </div>
      </div>

      {modal && (
        <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-3">
          <form onSubmit={saveRole} className="bg-white w-full max-w-4xl max-h-[92vh] overflow-y-auto rounded-xl shadow-xl">
            <div className="p-5 border-b border-slate-200 flex justify-between items-center">
              <div>
                <h2 className="text-lg font-bold">{editing ? "Edit Role" : "Create New Role"}</h2>
                <p className="text-sm text-slate-500">Set role details and module permissions.</p>
              </div>
              <button type="button" onClick={() => setModal(false)}><X /></button>
            </div>
            <div className="p-5 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <label className="text-sm font-medium text-slate-700">Role name
                  <input required value={draft.name} onChange={e => setDraft({ ...draft, name: e.target.value })} className="form-input mt-1" placeholder="e.g. Front Office Supervisor" />
                </label>
                <label className="text-sm font-medium text-slate-700">Description
                  <input value={draft.description} onChange={e => setDraft({ ...draft, description: e.target.value })} className="form-input mt-1" placeholder="Describe role responsibilities" />
                </label>
              </div>
              <div className="flex flex-wrap gap-5">
                <label className="flex gap-2 items-center text-sm"><input type="checkbox" checked={draft.financial} onChange={e => setDraft({ ...draft, financial: e.target.checked })} /> Financial approval permission</label>
                <label className="flex gap-2 items-center text-sm"><input type="checkbox" checked={draft.sensitive} onChange={e => setDraft({ ...draft, sensitive: e.target.checked })} /> Sensitive data access</label>
              </div>
              <div className="border border-slate-200 rounded-lg overflow-x-auto">
                <div className="p-3 bg-slate-50 font-semibold text-sm">Permission matrix</div>
                <table className="w-full min-w-[550px] text-sm">
                  <thead><tr className="text-slate-500 border-b"><th className="text-left p-3">Module</th><th className="p-3">All</th>{actions.map(a => <th key={a} className="p-3 capitalize">{a}</th>)}</tr></thead>
                  <tbody>
                    {modules.map(module => (
                      <tr key={module} className="border-b border-slate-100">
                        <td className="p-3 font-medium">{module}</td>
                        <td className="text-center"><input type="checkbox" checked={(draft.permissions[module] || []).length === 4} onChange={() => toggleAll(module)} /></td>
                        {actions.map(action => (
                          <td key={action} className="text-center"><input type="checkbox" checked={(draft.permissions[module] || []).includes(action)} onChange={() => togglePermission(module, action)} /></td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
            <div className="p-5 border-t border-slate-200 flex justify-end gap-3">
              <button type="button" onClick={() => setModal(false)} className="px-4 py-2 border rounded-lg text-sm">Cancel</button>
              <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm flex gap-2 items-center"><Save size={16} /> Save Role</button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
