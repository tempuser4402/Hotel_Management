
import { useState } from "react";
import {
  RefreshCw, Link2, Building2, BedDouble, IndianRupee,
  CalendarDays, CheckCircle2, AlertTriangle, XCircle,
  Settings, Plus, Search, X, Play, Clock, Download,
} from "lucide-react";

const initialMappings = [
  { id: 1, property: "Hotel Amar Palace", channel: "Booking.com", room: "Deluxe Room", channelRoom: "Deluxe Double", rate: "Standard Rate", channelRate: "BAR", inventory: 8, status: "Mapped" },
  { id: 2, property: "Hotel Amar Palace", channel: "Expedia", room: "Standard Room", channelRoom: "Standard King", rate: "Standard Rate", channelRate: "Room Only", inventory: 10, status: "Mapped" },
  { id: 3, property: "Hotel Amar Palace", channel: "Booking.com", room: "Suite Room", channelRoom: "Suite", rate: "Weekend Rate", channelRate: "Weekend BAR", inventory: 3, status: "Pending" },
];

const initialLogs = [
  { id: 1, type: "Inventory Sync", channel: "Booking.com", time: "06 Nov 2026, 10:45 AM", status: "Success", message: "8 room inventories synchronized." },
  { id: 2, type: "Booking Sync", channel: "Expedia", time: "06 Nov 2026, 10:20 AM", status: "Success", message: "2 reservations imported." },
  { id: 3, type: "Rate Sync", channel: "Booking.com", time: "06 Nov 2026, 09:55 AM", status: "Failed", message: "Rate plan mapping is incomplete." },
];

export default function ChannelManager() {
  const [mappings, setMappings] = useState(initialMappings);
  const [logs, setLogs] = useState(initialLogs);
  const [modal, setModal] = useState(false);
  const [syncing, setSyncing] = useState(false);
  const [search, setSearch] = useState("");
  const [channel, setChannel] = useState("All");
  const [draft, setDraft] = useState({ property: "Hotel Amar Palace", channel: "Booking.com", room: "", channelRoom: "", rate: "", channelRate: "", inventory: 0, status: "Mapped" });

  const filtered = mappings.filter(m =>
    (channel === "All" || m.channel === channel) &&
    `${m.room} ${m.channelRoom} ${m.rate}`.toLowerCase().includes(search.toLowerCase())
  );

  const addMapping = e => {
    e.preventDefault();
    setMappings(prev => [...prev, { ...draft, id: Date.now(), inventory: Number(draft.inventory) }]);
    setModal(false);
    setDraft({ property: "Hotel Amar Palace", channel: "Booking.com", room: "", channelRoom: "", rate: "", channelRate: "", inventory: 0, status: "Mapped" });
  };

  const runSync = () => {
    if (syncing) return;
    setSyncing(true);
    setTimeout(() => {
      setLogs(prev => [{
        id: Date.now(), type: "Manual Sync", channel: "All Channels",
        time: new Date().toLocaleString(), status: "Success",
        message: "Demo sync completed. No external channel was contacted.",
      }, ...prev]);
      setSyncing(false);
    }, 900);
  };

  const exportLogs = () => {
    const csv = ["Type,Channel,Time,Status,Message", ...logs.map(l => [l.type,l.channel,l.time,l.status,l.message].map(v => `"${String(v).replace(/"/g, '""')}"`).join(","))].join("\n");
    const url = URL.createObjectURL(new Blob([csv], { type: "text/csv" }));
    const a = document.createElement("a"); a.href = url; a.download = "channel-sync-logs.csv"; a.click(); URL.revokeObjectURL(url);
  };

  const stats = [
    ["Connected Channels", 2, Link2, "text-blue-600", "bg-blue-50"],
    ["Mapped Room Types", mappings.filter(m => m.status === "Mapped").length, BedDouble, "text-green-600", "bg-green-50"],
    ["Sync Successful", logs.filter(l => l.status === "Success").length, CheckCircle2, "text-emerald-600", "bg-emerald-50"],
    ["Sync Errors", logs.filter(l => l.status === "Failed").length, AlertTriangle, "text-red-600", "bg-red-50"],
  ];

  return (
    <div className="w-full min-h-screen bg-[#F5F7FA] p-4 md:p-6 lg:p-7 space-y-6">
      <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
        <div>
          <p className="text-sm font-semibold text-blue-600 mb-1">Integrations</p>
          <h1 className="text-2xl font-bold text-slate-900">Channel Manager</h1>
          <p className="text-sm text-slate-500 mt-1">Manage distribution channels, mappings and synchronization.</p>
        </div>
        <div className="flex gap-2">
          <button onClick={runSync} disabled={syncing} className="flex items-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 disabled:opacity-60 text-white rounded-lg text-sm font-semibold">
            <RefreshCw size={16} className={syncing ? "animate-spin" : ""} /> {syncing ? "Syncing..." : "Sync Now"}
          </button>
          <button onClick={() => setModal(true)} className="flex items-center gap-2 px-4 py-2.5 border border-slate-300 bg-white rounded-lg text-sm font-semibold"><Plus size={16} /> Add Mapping</button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {stats.map(([label, value, Icon, color, bg]) => (
          <div key={label} className="bg-white border border-slate-200 rounded-xl p-5">
            <div className="flex justify-between"><p className="text-sm text-slate-500">{label}</p><span className={`p-2 rounded-lg ${bg}`}><Icon size={19} className={color} /></span></div>
            <p className="text-2xl font-bold mt-2 text-slate-900">{value}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <div className="bg-white border border-slate-200 rounded-xl p-5">
          <h2 className="font-semibold text-slate-900">Channel Connections</h2>
          <p className="text-sm text-slate-500 mt-1">Connection overview</p>
          {["Booking.com", "Expedia"].map((name, i) => (
            <div key={name} className="mt-4 border border-slate-200 rounded-lg p-4 flex items-center justify-between gap-3">
              <div className="flex items-center gap-3"><div className="w-10 h-10 rounded-lg bg-blue-50 text-blue-700 grid place-items-center font-bold">{name[0]}</div><div><p className="font-semibold text-sm">{name}</p><p className="text-xs text-slate-500">Last sync: {i === 0 ? "10:45 AM" : "10:20 AM"}</p></div></div>
              <span className="text-xs font-semibold text-green-700 bg-green-50 px-3 py-1.5 rounded-full">Connected (Demo)</span>
            </div>
          ))}
        </div>
        <div className="bg-white border border-slate-200 rounded-xl p-5">
          <h2 className="font-semibold text-slate-900">Synchronization Controls</h2>
          <p className="text-sm text-slate-500 mt-1">Select what should be synchronized when backend integration is enabled.</p>
          {["Room inventory", "Room rates", "New reservations", "Reservation modifications", "Reservation cancellations"].map((item, i) => (
            <label key={item} className="flex items-center justify-between py-3 border-b border-slate-100 text-sm text-slate-700">
              {item}<input type="checkbox" defaultChecked={i !== 4} className="w-4 h-4 accent-blue-600" />
            </label>
          ))}
          <p className="text-xs text-slate-400 mt-3">These controls are UI settings only until connected to the integration service.</p>
        </div>
      </div>

      <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">
        <div className="p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b border-slate-200">
          <div><h2 className="font-semibold text-slate-900">Property & Room Mapping</h2><p className="text-xs text-slate-500 mt-1">Match PMS room types and rate plans to channel listings.</p></div>
          <div className="flex gap-2">
            <div className="relative"><Search size={15} className="absolute left-3 top-3 text-slate-400" /><input className="form-input pl-9" placeholder="Search mapping..." value={search} onChange={e => setSearch(e.target.value)} /></div>
            <select className="form-input min-w-32" value={channel} onChange={e => setChannel(e.target.value)}><option>All</option><option>Booking.com</option><option>Expedia</option></select>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[850px] text-sm">
            <thead className="bg-slate-50 text-slate-500"><tr>{["Property","Channel","PMS Room Type","Channel Room","PMS Rate","Channel Rate","Inventory","Status","Action"].map(x => <th key={x} className="text-left p-3 font-medium">{x}</th>)}</tr></thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.map(m => <tr key={m.id}>
                <td className="p-3">{m.property}</td><td className="p-3 font-medium">{m.channel}</td><td className="p-3">{m.room}</td><td className="p-3">{m.channelRoom}</td><td className="p-3">{m.rate}</td><td className="p-3">{m.channelRate}</td><td className="p-3">{m.inventory}</td>
                <td className="p-3"><span className={`px-2 py-1 rounded-full text-xs ${m.status === "Mapped" ? "bg-green-50 text-green-700" : "bg-amber-50 text-amber-700"}`}>{m.status}</span></td>
                <td className="p-3"><button onClick={() => setMappings(prev => prev.map(x => x.id === m.id ? { ...x, status: x.status === "Mapped" ? "Pending" : "Mapped" } : x))} className="text-blue-600 text-xs font-semibold">Change status</button></td>
              </tr>)}
              {!filtered.length && <tr><td colSpan="9" className="p-8 text-center text-slate-500">No mappings found.</td></tr>}
            </tbody>
          </table>
        </div>
      </div>

      <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">
        <div className="p-4 flex justify-between items-center border-b border-slate-200"><div><h2 className="font-semibold">Synchronization History & Error Logs</h2><p className="text-xs text-slate-500 mt-1">Recent channel operations</p></div><button onClick={exportLogs} className="flex items-center gap-2 text-sm text-blue-600"><Download size={16} /> Export</button></div>
        <div className="divide-y divide-slate-100">
          {logs.map(log => <div key={log.id} className="p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
            <div><p className="font-medium text-sm text-slate-800">{log.type} · {log.channel}</p><p className="text-xs text-slate-500 mt-1">{log.message}</p><p className="text-xs text-slate-400 mt-1">{log.time}</p></div>
            <span className={`text-xs font-semibold px-3 py-1.5 rounded-full w-fit ${log.status === "Success" ? "bg-green-50 text-green-700" : "bg-red-50 text-red-700"}`}>{log.status}</span>
          </div>)}
        </div>
      </div>

      {modal && <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-3"><form onSubmit={addMapping} className="bg-white rounded-xl w-full max-w-xl p-5 space-y-4 max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between"><h2 className="font-bold text-lg">Add Channel Mapping</h2><button type="button" onClick={() => setModal(false)}><X /></button></div>
        {[
          ["channel","Channel",["Booking.com","Expedia","Other OTA"]],
          ["room","PMS Room Type",["Standard Room","Deluxe Room","Suite Room"]],
          ["channelRoom","Channel Room Type",[]],
          ["rate","PMS Rate Plan",["Standard Rate","Weekend Rate","Seasonal Rate"]],
          ["channelRate","Channel Rate Plan",[]],
        ].map(([key,label,options]) => <label key={key} className="block text-sm font-medium text-slate-700">{label}
          {options.length ? <select required className="form-input mt-1" value={draft[key]} onChange={e => setDraft({ ...draft, [key]: e.target.value })}><option value="">Select {label}</option>{options.map(o => <option key={o}>{o}</option>)}</select> : <input required className="form-input mt-1" value={draft[key]} onChange={e => setDraft({ ...draft, [key]: e.target.value })} placeholder={`Enter ${label}`} />}
        </label>)}
        <label className="block text-sm font-medium">Inventory<input type="number" min="0" className="form-input mt-1" value={draft.inventory} onChange={e => setDraft({ ...draft, inventory: e.target.value })} /></label>
        <div className="flex justify-end gap-2"><button type="button" onClick={() => setModal(false)} className="px-4 py-2 border rounded-lg text-sm">Cancel</button><button className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm">Save Mapping</button></div>
      </form></div>}
    </div>
  );
}
