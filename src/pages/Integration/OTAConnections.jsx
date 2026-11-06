
import { useState } from "react";
import {
  Plus, Search, X, Link2, CheckCircle2, AlertCircle,
  RefreshCw, Download, Settings, Eye, EyeOff, Clock,
} from "lucide-react";

const initialAccounts = [
  { id: 1, name: "Booking.com", propertyId: "PROP-1042", email: "hotel@example.com", status: "Connected", mode: "Live", lastSync: "06 Nov 2026, 10:45 AM", rooms: 3, reservations: 24 },
  { id: 2, name: "Expedia", propertyId: "EXP-2048", email: "reservations@example.com", status: "Connected", mode: "Live", lastSync: "06 Nov 2026, 10:20 AM", rooms: 2, reservations: 12 },
];

const initialHistory = [
  { id: 1, channel: "Booking.com", action: "Reservation Import", reference: "BKG-88021", time: "06 Nov 2026, 10:45 AM", status: "Success", details: "1 reservation imported." },
  { id: 2, channel: "Expedia", action: "Inventory Update", reference: "INV-102", time: "06 Nov 2026, 10:20 AM", status: "Success", details: "Room inventory updated." },
  { id: 3, channel: "Booking.com", action: "Reservation Import", reference: "BKG-88019", time: "05 Nov 2026, 06:15 PM", status: "Failed", details: "Reservation mapping requires review." },
];

export default function OTAConnections() {
  const [accounts, setAccounts] = useState(initialAccounts);
  const [history, setHistory] = useState(initialHistory);
  const [modal, setModal] = useState(false);
  const [selected, setSelected] = useState(null);
  const [showSecret, setShowSecret] = useState(false);
  const [search, setSearch] = useState("");
  const [draft, setDraft] = useState({ name: "Booking.com", propertyId: "", email: "", clientId: "", credential: "", mode: "Test" });

  const filtered = accounts.filter(a => `${a.name} ${a.email} ${a.propertyId}`.toLowerCase().includes(search.toLowerCase()));

  const addAccount = e => {
    e.preventDefault();
    setAccounts(prev => [...prev, {
      id: Date.now(), name: draft.name, propertyId: draft.propertyId,
      email: draft.email, status: "Pending Setup", mode: draft.mode,
      lastSync: "Never", rooms: 0, reservations: 0,
    }]);
    setDraft({ name: "Booking.com", propertyId: "", email: "", clientId: "", credential: "", mode: "Test" });
    setModal(false);
  };

  const syncAccount = account => {
    setHistory(prev => [{
      id: Date.now(), channel: account.name, action: "Manual Sync",
      reference: account.propertyId, time: new Date().toLocaleString(),
      status: "Pending", details: "Demo sync request. No external OTA contacted.",
    }, ...prev]);
  };

  const exportHistory = () => {
    const csv = ["Channel,Action,Reference,Time,Status,Details", ...history.map(h => [h.channel,h.action,h.reference,h.time,h.status,h.details].map(v => `"${String(v).replace(/"/g,'""')}"`).join(","))].join("\n");
    const url = URL.createObjectURL(new Blob([csv], { type: "text/csv" }));
    const a = document.createElement("a"); a.href = url; a.download = "ota-sync-history.csv"; a.click(); URL.revokeObjectURL(url);
  };

  return (
    <div className="w-full min-h-screen bg-[#F5F7FA] p-4 md:p-6 lg:p-7 space-y-6">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
        <div><p className="text-sm font-semibold text-blue-600 mb-1">Integrations</p><h1 className="text-2xl font-bold text-slate-900">OTA Connections</h1><p className="text-sm text-slate-500 mt-1">Manage online travel agency accounts and reservation imports.</p></div>
        <button onClick={() => setModal(true)} className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2.5 rounded-lg text-sm font-semibold"><Plus size={17} /> Add OTA Account</button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          ["Total Accounts", accounts.length, Link2],
          ["Connected Accounts", accounts.filter(a => a.status === "Connected").length, CheckCircle2],
          ["Imported Reservations", accounts.reduce((s,a) => s + a.reservations, 0), RefreshCw],
        ].map(([label,value,Icon]) => <div key={label} className="bg-white border border-slate-200 rounded-xl p-5"><div className="flex justify-between"><p className="text-sm text-slate-500">{label}</p><Icon size={19} className="text-blue-600" /></div><p className="text-2xl font-bold mt-2">{value}</p></div>)}
      </div>

      <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">
        <div className="p-4 border-b border-slate-200 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3"><div><h2 className="font-semibold text-slate-900">OTA Accounts</h2><p className="text-xs text-slate-500 mt-1">Connection status and property configuration</p></div><div className="relative"><Search size={16} className="absolute left-3 top-3 text-slate-400" /><input className="form-input pl-9" placeholder="Search accounts..." value={search} onChange={e => setSearch(e.target.value)} /></div></div>
        <div className="divide-y divide-slate-100">
          {filtered.map(account => <div key={account.id} className="p-4 md:p-5 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div className="flex items-center gap-3"><div className="w-11 h-11 rounded-xl bg-blue-50 text-blue-700 grid place-items-center font-bold text-lg">{account.name[0]}</div><div><p className="font-semibold text-slate-900">{account.name}</p><p className="text-xs text-slate-500">{account.email} · Property ID: {account.propertyId}</p><p className="text-xs text-slate-400 mt-1">Last sync: {account.lastSync}</p></div></div>
            <div className="flex flex-wrap items-center gap-3"><span className={`text-xs rounded-full px-3 py-1.5 font-semibold ${account.status === "Connected" ? "bg-green-50 text-green-700" : "bg-amber-50 text-amber-700"}`}>{account.status}</span><span className="text-xs bg-slate-100 rounded-full px-3 py-1.5">{account.mode} mode</span><span className="text-xs text-slate-500">{account.rooms} mapped rooms</span><button onClick={() => setSelected(account)} className="text-blue-600 text-sm font-semibold">Configure</button><button onClick={() => syncAccount(account)} className="border rounded-lg p-2 hover:bg-slate-50" title="Request sync"><RefreshCw size={16} /></button></div>
          </div>)}
          {!filtered.length && <p className="p-8 text-center text-sm text-slate-500">No OTA accounts found.</p>}
        </div>
      </div>

      <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">
        <div className="p-4 border-b border-slate-200 flex justify-between items-center"><div><h2 className="font-semibold">OTA Sync History</h2><p className="text-xs text-slate-500 mt-1">Reservation imports and channel updates</p></div><button onClick={exportHistory} className="text-sm text-blue-600 flex items-center gap-2"><Download size={16} /> Export</button></div>
        <div className="overflow-x-auto"><table className="w-full min-w-[700px] text-sm"><thead className="bg-slate-50 text-slate-500"><tr>{["Channel","Action","Reference","Date & Time","Status","Details"].map(x => <th key={x} className="text-left p-3 font-medium">{x}</th>)}</tr></thead><tbody className="divide-y divide-slate-100">{history.map(h => <tr key={h.id}><td className="p-3 font-medium">{h.channel}</td><td className="p-3">{h.action}</td><td className="p-3">{h.reference}</td><td className="p-3">{h.time}</td><td className="p-3"><span className={`text-xs px-2 py-1 rounded-full ${h.status === "Success" ? "bg-green-50 text-green-700" : h.status === "Failed" ? "bg-red-50 text-red-700" : "bg-amber-50 text-amber-700"}`}>{h.status}</span></td><td className="p-3 text-slate-500">{h.details}</td></tr>)}</tbody></table></div>
      </div>

      {selected && <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-3"><div className="bg-white rounded-xl w-full max-w-lg p-5 space-y-4">
        <div className="flex justify-between"><div><h2 className="text-lg font-bold">Configure {selected.name}</h2><p className="text-xs text-slate-500">Account settings and mapping status</p></div><button onClick={() => setSelected(null)}><X /></button></div>
        <div className="grid grid-cols-2 gap-3 text-sm">{[["Property ID",selected.propertyId],["Account Email",selected.email],["Connection",selected.status],["Environment",selected.mode],["Mapped Rooms",selected.rooms],["Reservations",selected.reservations]].map(([k,v]) => <div key={k} className="p-3 border rounded-lg"><p className="text-xs text-slate-500">{k}</p><p className="font-medium mt-1">{v}</p></div>)}</div>
        <p className="text-xs text-amber-700 bg-amber-50 p-3 rounded-lg">Actual API credentials, room mapping and reservation import configuration must be completed through the backend integration service.</p>
        <button onClick={() => setSelected(null)} className="w-full bg-blue-600 text-white rounded-lg py-2 text-sm">Close</button>
      </div></div>}

      {modal && <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-3"><form onSubmit={addAccount} className="bg-white rounded-xl w-full max-w-lg p-5 space-y-4 max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between"><h2 className="font-bold text-lg">Add OTA Account</h2><button type="button" onClick={() => setModal(false)}><X /></button></div>
        <label className="block text-sm font-medium">OTA Provider<select className="form-input mt-1" value={draft.name} onChange={e => setDraft({...draft,name:e.target.value})}><option>Booking.com</option><option>Expedia</option><option>Agoda</option><option>MakeMyTrip</option><option>Other OTA</option></select></label>
        <label className="block text-sm font-medium">Property / Hotel ID<input required className="form-input mt-1" value={draft.propertyId} onChange={e => setDraft({...draft,propertyId:e.target.value})} placeholder="Enter provider property ID" /></label>
        <label className="block text-sm font-medium">Account Email<input required type="email" className="form-input mt-1" value={draft.email} onChange={e => setDraft({...draft,email:e.target.value})} placeholder="Account email" /></label>
        <label className="block text-sm font-medium">Client ID<input className="form-input mt-1" value={draft.clientId} onChange={e => setDraft({...draft,clientId:e.target.value})} placeholder="Optional identifier (demo only)" /></label>
        <label className="block text-sm font-medium">API credential<input type="password" autoComplete="new-password" className="form-input mt-1" value={draft.credential} onChange={e => setDraft({...draft,credential:e.target.value})} placeholder="Do not enter a real secret here" /></label>
        <label className="block text-sm font-medium">Environment<select className="form-input mt-1" value={draft.mode} onChange={e => setDraft({...draft,mode:e.target.value})}><option>Test</option><option>Live</option></select></label>
        <p className="text-xs text-amber-700 bg-amber-50 p-3 rounded-lg">Demo only: this form does not transmit or store credentials. Do not enter real API secrets. Production credentials must be submitted directly to a secured backend endpoint.</p>
        <div className="flex justify-end gap-2"><button type="button" onClick={() => setModal(false)} className="px-4 py-2 border rounded-lg text-sm">Cancel</button><button className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm">Add Account</button></div>
      </form></div>}
    </div>
  );
}
