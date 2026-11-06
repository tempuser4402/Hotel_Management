
import { useState } from "react";
import {
  Plus, X, CreditCard, Wallet, ShieldCheck, RefreshCw,
  CheckCircle2, AlertTriangle, Search, Download, Settings,
  Eye, EyeOff, Webhook, IndianRupee,
} from "lucide-react";

const initialGateways = [
  { id: 1, name: "Razorpay", keyId: "rzp_test_••••1234", mode: "Test", status: "Configured", methods: ["UPI", "Cards", "Net Banking", "Wallets"], webhook: true },
  { id: 2, name: "Cashfree", keyId: "cf_test_••••5678", mode: "Test", status: "Not Connected", methods: ["UPI", "Cards"], webhook: false },
];

const initialTransactions = [
  { id: "TXN-1001", gateway: "Razorpay", reference: "RES-2026-014", amount: 8500, method: "UPI", date: "06 Nov 2026, 10:30 AM", status: "Success" },
  { id: "TXN-1002", gateway: "Razorpay", reference: "RES-2026-015", amount: 4200, method: "Card", date: "06 Nov 2026, 09:45 AM", status: "Failed" },
  { id: "TXN-1003", gateway: "Cashfree", reference: "RES-2026-011", amount: 6000, method: "Net Banking", date: "05 Nov 2026, 06:15 PM", status: "Pending" },
];

const initialFailures = [
  { id: "ERR-001", gateway: "Razorpay", reference: "TXN-1002", reason: "Payment declined by issuing bank.", date: "06 Nov 2026, 09:45 AM" },
];

export default function PaymentGateways() {
  const [gateways, setGateways] = useState(initialGateways);
  const [transactions, setTransactions] = useState(initialTransactions);
  const [failures, setFailures] = useState(initialFailures);
  const [modal, setModal] = useState(false);
  const [selected, setSelected] = useState(null);
  const [search, setSearch] = useState("");
  const [modeFilter, setModeFilter] = useState("All");
  const [draft, setDraft] = useState({ name: "Razorpay", keyId: "", secret: "", mode: "Test", webhook: "", methods: ["UPI", "Cards"] });

  const filtered = transactions.filter(t =>
    (modeFilter === "All" || t.status === modeFilter) &&
    `${t.id} ${t.gateway} ${t.reference} ${t.method}`.toLowerCase().includes(search.toLowerCase())
  );

  const addGateway = e => {
    e.preventDefault();
    setGateways(prev => [...prev, {
      id: Date.now(), name: draft.name, keyId: "Not configured",
      mode: draft.mode, status: "Pending Setup",
      methods: draft.methods, webhook: Boolean(draft.webhook),
    }]);
    setDraft({ name: "Razorpay", keyId: "", secret: "", mode: "Test", webhook: "", methods: ["UPI", "Cards"] });
    setModal(false);
  };

  const toggleMethod = method => setDraft(prev => ({
    ...prev,
    methods: prev.methods.includes(method)
      ? prev.methods.filter(m => m !== method)
      : [...prev.methods, method],
  }));

  const toggleMode = id => setGateways(prev => prev.map(g =>
    g.id === id ? { ...g, mode: g.mode === "Test" ? "Live" : "Test" } : g
  ));

  const requestRefund = txn => {
    if (txn.status !== "Success") {
      alert("Only successful transactions can be submitted for refund.");
      return;
    }
    if (!window.confirm(`Submit a demo refund request for ₹${txn.amount.toLocaleString("en-IN")}?`)) return;
    setTransactions(prev => prev.map(t => t.id === txn.id ? { ...t, status: "Refund Requested" } : t));
    alert("Demo refund request recorded locally. No money has been refunded.");
  };

  const exportTransactions = () => {
    const csv = ["Transaction ID,Gateway,Reference,Amount,Method,Date,Status", ...filtered.map(t => [t.id,t.gateway,t.reference,t.amount,t.method,t.date,t.status].map(v => `"${String(v).replace(/"/g,'""')}"`).join(","))].join("\n");
    const url = URL.createObjectURL(new Blob([csv], { type: "text/csv" }));
    const a = document.createElement("a"); a.href = url; a.download = "payment-transactions.csv"; a.click(); URL.revokeObjectURL(url);
  };

  const stats = [
    ["Transactions", transactions.length, CreditCard],
    ["Successful", transactions.filter(t => t.status === "Success").length, CheckCircle2],
    ["Failed", transactions.filter(t => t.status === "Failed").length, AlertTriangle],
    ["Refund Requests", transactions.filter(t => t.status === "Refund Requested").length, RefreshCw],
  ];

  return (
    <div className="w-full min-h-screen bg-[#F5F7FA] p-4 md:p-6 lg:p-7 space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div><p className="text-sm font-semibold text-blue-600 mb-1">Integrations</p><h1 className="text-2xl font-bold text-slate-900">Payment Gateways</h1><p className="text-sm text-slate-500 mt-1">Configure online payments, webhooks and transaction monitoring.</p></div>
        <button onClick={() => setModal(true)} className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2.5 rounded-lg text-sm font-semibold"><Plus size={17} /> Add Gateway</button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {stats.map(([label,value,Icon]) => <div key={label} className="bg-white border border-slate-200 rounded-xl p-5"><div className="flex justify-between"><p className="text-sm text-slate-500">{label}</p><Icon size={19} className="text-blue-600" /></div><p className="text-2xl font-bold text-slate-900 mt-2">{value}</p></div>)}
      </div>

      <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">
        <div className="p-4 border-b border-slate-200"><h2 className="font-semibold text-slate-900">Gateway Configuration</h2><p className="text-xs text-slate-500 mt-1">Manage provider settings and supported payment methods.</p></div>
        <div className="divide-y divide-slate-100">
          {gateways.map(g => <div key={g.id} className="p-4 md:p-5 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div className="flex items-center gap-3"><div className="w-11 h-11 bg-blue-50 text-blue-700 rounded-xl grid place-items-center"><CreditCard size={21} /></div><div><p className="font-semibold text-slate-900">{g.name}</p><p className="text-xs text-slate-500 mt-1">Key ID: {g.keyId}</p><div className="flex flex-wrap gap-1 mt-2">{g.methods.map(m => <span key={m} className="text-[11px] bg-slate-100 text-slate-600 px-2 py-1 rounded">{m}</span>)}</div></div></div>
            <div className="flex flex-wrap items-center gap-2"><span className={`text-xs px-3 py-1.5 rounded-full font-semibold ${g.status === "Configured" ? "bg-green-50 text-green-700" : "bg-amber-50 text-amber-700"}`}>{g.status}</span><button onClick={() => toggleMode(g.id)} className={`text-xs px-3 py-1.5 rounded-full font-semibold ${g.mode === "Live" ? "bg-red-50 text-red-700" : "bg-blue-50 text-blue-700"}`}>{g.mode} Mode · Toggle</button><span className={`text-xs px-3 py-1.5 rounded-full ${g.webhook ? "bg-green-50 text-green-700" : "bg-slate-100 text-slate-500"}`}>Webhook {g.webhook ? "Enabled" : "Disabled"}</span><button onClick={() => setSelected(g)} className="text-blue-600 text-sm font-semibold">Settings</button></div>
          </div>)}
        </div>
      </div>

      <div className="bg-white border border-slate-200 rounded-xl p-5 space-y-4">
        <div><h2 className="font-semibold text-slate-900">Payment Method Configuration</h2><p className="text-xs text-slate-500 mt-1">Supported payment methods shown for hotel checkout.</p></div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {["UPI","Credit / Debit Cards","Net Banking","Wallets","Payment Links","QR Payments","International Cards","EMI"].map((method,i) => <div key={method} className="border border-slate-200 rounded-lg p-3 flex items-center justify-between gap-2"><span className="text-sm text-slate-700">{method}</span><span className={`text-xs ${i < 4 ? "text-green-600" : "text-slate-400"}`}>{i < 4 ? "Enabled" : "Optional"}</span></div>)}
        </div>
      </div>

      <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">
        <div className="p-4 border-b border-slate-200 flex flex-col md:flex-row md:justify-between md:items-center gap-3"><div><h2 className="font-semibold text-slate-900">Transaction History</h2><p className="text-xs text-slate-500 mt-1">Monitor online payment status and refund requests.</p></div><button onClick={exportTransactions} className="text-sm text-blue-600 flex items-center gap-2"><Download size={16} /> Export CSV</button></div>
        <div className="p-4 grid grid-cols-1 sm:grid-cols-3 gap-3"><div className="relative sm:col-span-2"><Search size={16} className="absolute left-3 top-3 text-slate-400" /><input className="form-input pl-9" placeholder="Search transaction, gateway or reference..." value={search} onChange={e => setSearch(e.target.value)} /></div><select className="form-input" value={modeFilter} onChange={e => setModeFilter(e.target.value)}><option value="All">All statuses</option>{["Success","Failed","Pending","Refund Requested"].map(s => <option key={s}>{s}</option>)}</select></div>
        <div className="overflow-x-auto"><table className="w-full min-w-[850px] text-sm"><thead className="bg-slate-50 text-slate-500"><tr>{["Transaction ID","Gateway","Booking Reference","Amount","Method","Date","Status","Action"].map(h => <th key={h} className="text-left p-3 font-medium">{h}</th>)}</tr></thead><tbody className="divide-y divide-slate-100">
          {filtered.map(t => <tr key={t.id}><td className="p-3 font-medium text-blue-600">{t.id}</td><td className="p-3">{t.gateway}</td><td className="p-3">{t.reference}</td><td className="p-3 font-semibold">₹{t.amount.toLocaleString("en-IN")}</td><td className="p-3">{t.method}</td><td className="p-3">{t.date}</td><td className="p-3"><span className={`text-xs px-2 py-1 rounded-full ${t.status === "Success" ? "bg-green-50 text-green-700" : t.status === "Failed" ? "bg-red-50 text-red-700" : "bg-amber-50 text-amber-700"}`}>{t.status}</span></td><td className="p-3">{t.status === "Success" && <button onClick={() => requestRefund(t)} className="text-blue-600 text-xs font-semibold">Request Refund</button>}</td></tr>)}
          {!filtered.length && <tr><td colSpan="8" className="text-center p-8 text-slate-500">No transactions found.</td></tr>}
        </tbody></table></div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">
          <div className="p-4 border-b border-slate-200"><h2 className="font-semibold">Webhook Configuration</h2><p className="text-xs text-slate-500 mt-1">Receive payment status events from gateway providers.</p></div>
          <div className="p-4 space-y-3"><label className="block text-sm font-medium text-slate-700">Webhook endpoint URL<input readOnly value="https://your-backend.com/api/webhooks/payments" className="form-input mt-1 bg-slate-50" /></label><div className="flex items-center gap-2 text-sm text-slate-600"><Webhook size={18} className="text-blue-600" /> Signature verification required</div><p className="text-xs text-slate-400">Use your actual deployed backend URL. Verify provider signatures before accepting webhook events.</p></div>
        </div>
        <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">
          <div className="p-4 border-b border-slate-200"><h2 className="font-semibold">Payment Failure Logs</h2><p className="text-xs text-slate-500 mt-1">Recent failed payment attempts.</p></div>
          <div className="divide-y divide-slate-100">{failures.map(f => <div key={f.id} className="p-4"><div className="flex justify-between gap-2"><p className="font-medium text-sm">{f.id} · {f.gateway}</p><span className="text-xs text-red-600">Failed</span></div><p className="text-xs text-slate-500 mt-1">{f.reference} · {f.date}</p><p className="text-sm text-slate-600 mt-2">{f.reason}</p></div>)}{!failures.length && <p className="p-5 text-sm text-slate-500">No payment failures recorded.</p>}</div>
        </div>
      </div>

      {selected && <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-3"><div className="bg-white rounded-xl w-full max-w-lg p-5 space-y-4">
        <div className="flex justify-between"><div><h2 className="font-bold text-lg">{selected.name} Settings</h2><p className="text-xs text-slate-500">Gateway configuration overview</p></div><button onClick={() => setSelected(null)}><X /></button></div>
        <div className="p-3 border rounded-lg text-sm"><p className="text-slate-500 text-xs">Public Key ID</p><p className="font-medium mt-1">{selected.keyId}</p></div>
        <div className="p-3 border rounded-lg text-sm"><p className="text-slate-500 text-xs">Environment</p><p className="font-medium mt-1">{selected.mode}</p></div>
        <div className="p-3 border rounded-lg text-sm"><p className="text-slate-500 text-xs">Webhook</p><p className="font-medium mt-1">{selected.webhook ? "Enabled" : "Not configured"}</p></div>
        <p className="text-xs text-amber-700 bg-amber-50 rounded-lg p-3">Secret keys are intentionally not displayed. Configure and rotate them through secured backend administration, never through frontend source code.</p>
        <button onClick={() => setSelected(null)} className="w-full py-2 bg-blue-600 text-white rounded-lg text-sm">Close</button>
      </div></div>}

      {modal && <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-3"><form onSubmit={addGateway} className="bg-white rounded-xl w-full max-w-lg p-5 space-y-4 max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between"><h2 className="font-bold text-lg">Add Payment Gateway</h2><button type="button" onClick={() => setModal(false)}><X /></button></div>
        <label className="block text-sm font-medium">Gateway Provider<select className="form-input mt-1" value={draft.name} onChange={e => setDraft({...draft,name:e.target.value})}><option>Razorpay</option><option>Cashfree</option><option>PayU</option><option>Other</option></select></label>
        <label className="block text-sm font-medium">Public Key ID<input className="form-input mt-1" value={draft.keyId} onChange={e => setDraft({...draft,keyId:e.target.value})} placeholder="Demo field only" /></label>
        <label className="block text-sm font-medium">Secret API Key<input type="password" autoComplete="new-password" className="form-input mt-1" value={draft.secret} onChange={e => setDraft({...draft,secret:e.target.value})} placeholder="Never enter a real secret here" /></label>
        <label className="block text-sm font-medium">Mode<select className="form-input mt-1" value={draft.mode} onChange={e => setDraft({...draft,mode:e.target.value})}><option>Test</option><option>Live</option></select></label>
        <label className="block text-sm font-medium">Webhook URL<input className="form-input mt-1" value={draft.webhook} onChange={e => setDraft({...draft,webhook:e.target.value})} placeholder="https://your-backend.com/api/webhooks/..." /></label>
        <div><p className="text-sm font-medium mb-2">Payment Methods</p><div className="flex flex-wrap gap-4">{["UPI","Cards","Net Banking","Wallets"].map(m => <label key={m} className="text-sm flex items-center gap-2"><input type="checkbox" checked={draft.methods.includes(m)} onChange={() => toggleMethod(m)} />{m}</label>)}</div></div>
        <p className="text-xs text-amber-700 bg-amber-50 rounded-lg p-3">Demo form only. Credentials are not sent to a server or saved. Never store secret keys in React state, localStorage, GitHub or frontend environment variables. Use a secured backend endpoint and encrypted secret storage.</p>
        <div className="flex justify-end gap-2"><button type="button" onClick={() => setModal(false)} className="px-4 py-2 border rounded-lg text-sm">Cancel</button><button className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm">Save Gateway</button></div>
      </form></div>}
    </div>
  );
}
