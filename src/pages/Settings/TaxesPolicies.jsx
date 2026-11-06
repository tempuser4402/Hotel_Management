
import { useState } from "react";
import {
  ShieldCheck,
  Clock,
  CalendarX,
  Users,
  PawPrint,
  Wallet,
  Receipt,
  RotateCcw,
  Save,
  Plus,
  Trash2,
  AlertCircle,
  CheckCircle2,
  FileText,
} from "lucide-react";

const initialPolicies = {
  checkInTime: "14:00",
  checkOutTime: "11:00",
  earlyCheckIn: true,
  lateCheckOut: true,
  earlyCheckInCharge: "500",
  lateCheckOutCharge: "500",

  cancellationEnabled: true,
  freeCancellationHours: "48",
  cancellationType: "percentage",
  cancellationCharge: "50",
  noShowCharge: "100",
  cancellationDescription:
    "Free cancellation is available up to 48 hours before check-in. Late cancellations may incur a cancellation charge.",

  childrenAllowed: true,
  minimumChildAge: "0",
  childBedPolicy: "subject_to_availability",
  childExtraBedCharge: "500",
  childDescription: "Children are welcome. Extra beds are subject to availability.",

  petsAllowed: false,
  petCharge: "500",
  petDescription: "Pets are not permitted inside the property.",

  depositEnabled: true,
  depositType: "fixed",
  depositAmount: "1000",
  depositRefundable: true,
  depositDescription: "A refundable security deposit is collected at check-in.",

  gstEnabled: true,
  gstRate: "12",
  gstInclusive: false,
  serviceChargeEnabled: false,
  serviceChargeRate: "5",
  additionalChargesDescription: "",

  refundProcessingDays: "7",
  refundMethod: "original",
  refundConditions:
    "Approved refunds are processed to the original payment method within the specified processing period.",
};

const defaultTaxRules = [
  {
    id: 1,
    name: "Room GST",
    type: "GST",
    rate: "12",
    appliesTo: "Room Charges",
    enabled: true,
  },
  {
    id: 2,
    name: "Restaurant GST",
    type: "GST",
    rate: "5",
    appliesTo: "Food & Beverage",
    enabled: true,
  },
];

const inputClass =
  "w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-800 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100";

const labelClass = "mb-1.5 block text-sm font-medium text-slate-700";

function Field({ label, children, className = "" }) {
  return (
    <div className={className}>
      <label className={labelClass}>{label}</label>
      {children}
    </div>
  );
}

function Section({ title, description, icon: Icon, children }) {
  return (
    <section className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
      <div className="flex items-start gap-3 border-b border-slate-100 px-5 py-4">
        <div className="rounded-lg bg-blue-50 p-2 text-blue-600">
          <Icon size={19} />
        </div>
        <div>
          <h2 className="font-semibold text-slate-800">{title}</h2>
          <p className="mt-0.5 text-xs text-slate-500">{description}</p>
        </div>
      </div>
      <div className="space-y-5 p-5">{children}</div>
    </section>
  );
}

function Toggle({ label, checked, onChange, description }) {
  return (
    <div className="flex items-center justify-between gap-4 rounded-lg border border-slate-200 p-3">
      <div>
        <p className="text-sm font-medium text-slate-800">{label}</p>
        {description && (
          <p className="mt-0.5 text-xs text-slate-500">{description}</p>
        )}
      </div>
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        onClick={() => onChange(!checked)}
        className={`relative h-6 w-11 shrink-0 rounded-full transition ${
          checked ? "bg-blue-600" : "bg-slate-300"
        }`}
      >
        <span
          className={`absolute top-1 h-4 w-4 rounded-full bg-white shadow transition ${
            checked ? "left-6" : "left-1"
          }`}
        />
      </button>
    </div>
  );
}

function PolicyNote({ children }) {
  return (
    <div className="flex gap-2 rounded-lg border border-amber-200 bg-amber-50 p-3 text-xs text-amber-800">
      <AlertCircle size={16} className="mt-0.5 shrink-0" />
      <p>{children}</p>
    </div>
  );
}

export default function TaxesPolicies() {
  const [policies, setPolicies] = useState(initialPolicies);
  const [savedPolicies, setSavedPolicies] = useState(initialPolicies);
  const [taxRules, setTaxRules] = useState(defaultTaxRules);
  const [savedTaxRules, setSavedTaxRules] = useState(defaultTaxRules);
  const [notice, setNotice] = useState("");
  const [isDirty, setIsDirty] = useState(false);
  const [showTaxForm, setShowTaxForm] = useState(false);
  const [taxForm, setTaxForm] = useState({
    name: "",
    type: "GST",
    rate: "",
    appliesTo: "All Services",
    enabled: true,
  });
  const [editingTaxId, setEditingTaxId] = useState(null);

  const update = (key, value) => {
    setPolicies((prev) => ({ ...prev, [key]: value }));
    setIsDirty(true);
    setNotice("");
  };

  const updateTaxRule = (id, key, value) => {
    setTaxRules((prev) =>
      prev.map((rule) =>
        rule.id === id ? { ...rule, [key]: value } : rule
      )
    );
    setIsDirty(true);
  };

  const openAddTax = () => {
    setEditingTaxId(null);
    setTaxForm({
      name: "",
      type: "GST",
      rate: "",
      appliesTo: "All Services",
      enabled: true,
    });
    setShowTaxForm(true);
  };

  const openEditTax = (rule) => {
    setEditingTaxId(rule.id);
    setTaxForm({
      name: rule.name,
      type: rule.type,
      rate: rule.rate,
      appliesTo: rule.appliesTo,
      enabled: rule.enabled,
    });
    setShowTaxForm(true);
  };

  const saveTaxRule = (event) => {
    event.preventDefault();

    const rate = Number(taxForm.rate);
    if (!taxForm.name.trim() || taxForm.rate === "" || !Number.isFinite(rate) || rate < 0 || rate > 100) {
      return;
    }

    if (editingTaxId !== null) {
      setTaxRules((prev) =>
        prev.map((rule) =>
          rule.id === editingTaxId ? { ...rule, ...taxForm } : rule
        )
      );
    } else {
      setTaxRules((prev) => [
        ...prev,
        { ...taxForm, id: Date.now() },
      ]);
    }

    setIsDirty(true);
    setShowTaxForm(false);
    setNotice("");
  };

  const deleteTaxRule = (id) => {
    setTaxRules((prev) => prev.filter((rule) => rule.id !== id));
    setIsDirty(true);
  };

  const saveAll = (event) => {
    event.preventDefault();
    setSavedPolicies({ ...policies });
    setSavedTaxRules([...taxRules]);
    setIsDirty(false);
    setNotice("Taxes and policies saved for this demo session.");
  };

  const resetChanges = () => {
    setPolicies({ ...savedPolicies });
    setTaxRules([...savedTaxRules]);
    setIsDirty(false);
    setNotice("Unsaved changes have been reset.");
  };

  const restoreDefaults = () => {
    setPolicies({ ...initialPolicies });
    setTaxRules([...defaultTaxRules]);
    setSavedPolicies({ ...initialPolicies });
    setSavedTaxRules([...defaultTaxRules]);
    setIsDirty(false);
    setNotice("Default sample policies have been restored.");
  };

  const money = (value) =>
    `₹${Number(value || 0).toLocaleString("en-IN")}`;

  return (
    <div className="min-h-screen w-full bg-slate-50 p-2 md:p-4">
      <div className="w-full space-y-5">
        {/* Header */}
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <div className="flex items-center gap-2 text-sm text-slate-500">
              <ShieldCheck size={16} />
              Configuration / Taxes & Policies
            </div>
            <h1 className="mt-2 text-2xl font-bold text-slate-900">
              Taxes & Policies
            </h1>
            <p className="mt-1 text-sm text-slate-500">
              Configure hotel rules, guest policies, taxes, deposits, and
              refund conditions.
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={resetChanges}
              className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50"
            >
              <RotateCcw size={16} />
              Reset Changes
            </button>
            <button
              type="button"
              onClick={restoreDefaults}
              className="rounded-lg border border-red-200 bg-white px-4 py-2.5 text-sm font-medium text-red-600 hover:bg-red-50"
            >
              Restore Defaults
            </button>
          </div>
        </div>

        {notice && (
          <div className="flex items-center gap-2 rounded-lg border border-blue-200 bg-blue-50 px-4 py-3 text-sm text-blue-800">
            <CheckCircle2 size={17} />
            {notice}
          </div>
        )}

        <form onSubmit={saveAll} className="space-y-5">
          {/* Check-in/out */}
          <Section
            title="Check-in & Check-out Policy"
            description="Set standard arrival and departure times and optional service charges."
            icon={Clock}
          >
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <Field label="Standard Check-in Time *">
                <input
                  type="time"
                  required
                  value={policies.checkInTime}
                  onChange={(e) => update("checkInTime", e.target.value)}
                  className={inputClass}
                />
              </Field>
              <Field label="Standard Check-out Time *">
                <input
                  type="time"
                  required
                  value={policies.checkOutTime}
                  onChange={(e) => update("checkOutTime", e.target.value)}
                  className={inputClass}
                />
              </Field>
            </div>

            <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
              <div className="space-y-3">
                <Toggle
                  label="Allow Early Check-in"
                  checked={policies.earlyCheckIn}
                  onChange={(v) => update("earlyCheckIn", v)}
                  description="Allow guests to request early room access."
                />
                {policies.earlyCheckIn && (
                  <Field label="Early Check-in Charge (₹)">
                    <input
                      type="number"
                      min="0"
                      value={policies.earlyCheckInCharge}
                      onChange={(e) => update("earlyCheckInCharge", e.target.value)}
                      className={inputClass}
                    />
                  </Field>
                )}
              </div>

              <div className="space-y-3">
                <Toggle
                  label="Allow Late Check-out"
                  checked={policies.lateCheckOut}
                  onChange={(v) => update("lateCheckOut", v)}
                  description="Allow guests to request a later departure."
                />
                {policies.lateCheckOut && (
                  <Field label="Late Check-out Charge (₹)">
                    <input
                      type="number"
                      min="0"
                      value={policies.lateCheckOutCharge}
                      onChange={(e) => update("lateCheckOutCharge", e.target.value)}
                      className={inputClass}
                    />
                  </Field>
                )}
              </div>
            </div>
          </Section>

          {/* Cancellation */}
          <Section
            title="Cancellation Policy"
            description="Define free cancellation windows, cancellation charges, and no-show rules."
            icon={CalendarX}
          >
            <Toggle
              label="Enable Cancellation Policy"
              checked={policies.cancellationEnabled}
              onChange={(v) => update("cancellationEnabled", v)}
              description="Apply cancellation rules to reservations."
            />

            {policies.cancellationEnabled && (
              <>
                <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                  <Field label="Free Cancellation Before (Hours)">
                    <input
                      type="number"
                      min="0"
                      value={policies.freeCancellationHours}
                      onChange={(e) => update("freeCancellationHours", e.target.value)}
                      className={inputClass}
                    />
                  </Field>

                  <Field label="Cancellation Charge Type">
                    <select
                      value={policies.cancellationType}
                      onChange={(e) => update("cancellationType", e.target.value)}
                      className={inputClass}
                    >
                      <option value="percentage">Percentage (%)</option>
                      <option value="fixed">Fixed Amount (₹)</option>
                      <option value="night">One Night Charge</option>
                    </select>
                  </Field>

                  <Field label="Cancellation Charge">
                    <input
                      type="number"
                      min="0"
                      value={policies.cancellationCharge}
                      onChange={(e) => update("cancellationCharge", e.target.value)}
                      className={inputClass}
                    />
                  </Field>

                  <Field label="No-show Charge (%)">
                    <input
                      type="number"
                      min="0"
                      max="100"
                      value={policies.noShowCharge}
                      onChange={(e) => update("noShowCharge", e.target.value)}
                      className={inputClass}
                    />
                  </Field>
                </div>

                <Field label="Cancellation Policy Description">
                  <textarea
                    rows={3}
                    value={policies.cancellationDescription}
                    onChange={(e) => update("cancellationDescription", e.target.value)}
                    className={inputClass}
                  />
                </Field>
              </>
            )}
          </Section>

          {/* Child */}
          <Section
            title="Child Policy"
            description="Configure child accommodation, age rules, and extra bed charges."
            icon={Users}
          >
            <Toggle
              label="Children Allowed"
              checked={policies.childrenAllowed}
              onChange={(v) => update("childrenAllowed", v)}
            />

            {policies.childrenAllowed && (
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <Field label="Minimum Child Age">
                  <input
                    type="number"
                    min="0"
                    max="17"
                    value={policies.minimumChildAge}
                    onChange={(e) => update("minimumChildAge", e.target.value)}
                    className={inputClass}
                  />
                </Field>

                <Field label="Extra Bed Policy">
                  <select
                    value={policies.childBedPolicy}
                    onChange={(e) => update("childBedPolicy", e.target.value)}
                    className={inputClass}
                  >
                    <option value="subject_to_availability">Subject to Availability</option>
                    <option value="free">Free Extra Bed</option>
                    <option value="paid">Paid Extra Bed</option>
                    <option value="not_available">Not Available</option>
                  </select>
                </Field>

                <Field label="Extra Bed Charge (₹)">
                  <input
                    type="number"
                    min="0"
                    value={policies.childExtraBedCharge}
                    onChange={(e) => update("childExtraBedCharge", e.target.value)}
                    className={inputClass}
                  />
                </Field>

                <Field label="Child Policy Description">
                  <textarea
                    rows={2}
                    value={policies.childDescription}
                    onChange={(e) => update("childDescription", e.target.value)}
                    className={inputClass}
                  />
                </Field>
              </div>
            )}
          </Section>

          {/* Pets */}
          <Section
            title="Pet Policy"
            description="Choose whether pets are allowed and configure applicable charges."
            icon={PawPrint}
          >
            <Toggle
              label="Allow Pets"
              checked={policies.petsAllowed}
              onChange={(v) => update("petsAllowed", v)}
              description="Permit guests to bring pets to the property."
            />

            {policies.petsAllowed && (
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <Field label="Pet Charge (₹)">
                  <input
                    type="number"
                    min="0"
                    value={policies.petCharge}
                    onChange={(e) => update("petCharge", e.target.value)}
                    className={inputClass}
                  />
                </Field>

                <Field label="Pet Policy Description">
                  <textarea
                    rows={2}
                    value={policies.petDescription}
                    onChange={(e) => update("petDescription", e.target.value)}
                    className={inputClass}
                  />
                </Field>
              </div>
            )}
          </Section>

          {/* Deposit */}
          <Section
            title="Security Deposit Policy"
            description="Configure deposits collected from guests during check-in."
            icon={Wallet}
          >
            <Toggle
              label="Require Security Deposit"
              checked={policies.depositEnabled}
              onChange={(v) => update("depositEnabled", v)}
              description="Collect a deposit in addition to booking charges."
            />

            {policies.depositEnabled && (
              <>
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <Field label="Deposit Type">
                    <select
                      value={policies.depositType}
                      onChange={(e) => update("depositType", e.target.value)}
                      className={inputClass}
                    >
                      <option value="fixed">Fixed Amount</option>
                      <option value="percentage">Percentage of Booking</option>
                      <option value="per_night">Per Night</option>
                    </select>
                  </Field>

                  <Field label={policies.depositType === "percentage" ? "Deposit Percentage (%)" : "Deposit Amount (₹)"}>
                    <input
                      type="number"
                      min="0"
                      value={policies.depositAmount}
                      onChange={(e) => update("depositAmount", e.target.value)}
                      className={inputClass}
                    />
                  </Field>
                </div>

                <Toggle
                  label="Refundable Deposit"
                  checked={policies.depositRefundable}
                  onChange={(v) => update("depositRefundable", v)}
                  description="Return the deposit after checking for additional charges or damages."
                />

                <Field label="Deposit Policy Description">
                  <textarea
                    rows={2}
                    value={policies.depositDescription}
                    onChange={(e) => update("depositDescription", e.target.value)}
                    className={inputClass}
                  />
                </Field>
              </>
            )}
          </Section>

          {/* Taxes */}
          <Section
            title="Taxes & Additional Charges"
            description="Configure tax defaults and maintain additional tax rules."
            icon={Receipt}
          >
            <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
              <div className="space-y-3">
                <Toggle
                  label="Enable GST"
                  checked={policies.gstEnabled}
                  onChange={(v) => update("gstEnabled", v)}
                  description="Apply the default GST rate to applicable charges."
                />
                {policies.gstEnabled && (
                  <Field label="Default GST Rate (%)">
                    <input
                      type="number"
                      min="0"
                      max="100"
                      step="0.01"
                      value={policies.gstRate}
                      onChange={(e) => update("gstRate", e.target.value)}
                      className={inputClass}
                    />
                  </Field>
                )}
              </div>

              <div className="space-y-3">
                <Toggle
                  label="Tax Inclusive Pricing"
                  checked={policies.gstInclusive}
                  onChange={(v) => update("gstInclusive", v)}
                  description="Treat displayed prices as including the configured GST."
                />
                <Toggle
                  label="Enable Service Charge"
                  checked={policies.serviceChargeEnabled}
                  onChange={(v) => update("serviceChargeEnabled", v)}
                  description="Apply a separate service charge."
                />
                {policies.serviceChargeEnabled && (
                  <Field label="Service Charge (%)">
                    <input
                      type="number"
                      min="0"
                      max="100"
                      step="0.01"
                      value={policies.serviceChargeRate}
                      onChange={(e) => update("serviceChargeRate", e.target.value)}
                      className={inputClass}
                    />
                  </Field>
                )}
              </div>
            </div>

            <Field label="Additional Charges Description">
              <textarea
                rows={2}
                value={policies.additionalChargesDescription}
                onChange={(e) => update("additionalChargesDescription", e.target.value)}
                className={inputClass}
                placeholder="Describe additional fees, if applicable..."
              />
            </Field>

            <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
              <div>
                <h3 className="font-semibold text-slate-800">Additional Tax Rules</h3>
                <p className="text-xs text-slate-500">
                  Manage separate tax rules for different services.
                </p>
              </div>
              <button
                type="button"
                onClick={openAddTax}
                className="inline-flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
              >
                <Plus size={16} />
                Add Tax Rule
              </button>
            </div>

            <div className="overflow-x-auto rounded-lg border border-slate-200">
              <table className="w-full min-w-[650px] text-left text-sm">
                <thead className="bg-slate-50 text-xs uppercase text-slate-500">
                  <tr>
                    <th className="px-4 py-3">Tax Name</th>
                    <th className="px-4 py-3">Type</th>
                    <th className="px-4 py-3">Rate</th>
                    <th className="px-4 py-3">Applies To</th>
                    <th className="px-4 py-3">Status</th>
                    <th className="px-4 py-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {taxRules.length === 0 ? (
                    <tr>
                      <td colSpan="6" className="px-4 py-8 text-center text-slate-500">
                        No additional tax rules configured.
                      </td>
                    </tr>
                  ) : (
                    taxRules.map((rule) => (
                      <tr key={rule.id}>
                        <td className="px-4 py-3 font-medium text-slate-800">{rule.name}</td>
                        <td className="px-4 py-3 text-slate-600">{rule.type}</td>
                        <td className="px-4 py-3 text-slate-600">{rule.rate}%</td>
                        <td className="px-4 py-3 text-slate-600">{rule.appliesTo}</td>
                        <td className="px-4 py-3">
                          <button
                            type="button"
                            onClick={() => updateTaxRule(rule.id, "enabled", !rule.enabled)}
                            className={`rounded-full px-2.5 py-1 text-xs font-medium ${
                              rule.enabled
                                ? "bg-emerald-50 text-emerald-700"
                                : "bg-slate-100 text-slate-500"
                            }`}
                          >
                            {rule.enabled ? "Active" : "Inactive"}
                          </button>
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex justify-end gap-2">
                            <button
                              type="button"
                              onClick={() => openEditTax(rule)}
                              className="rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-medium hover:bg-slate-50"
                            >
                              Edit
                            </button>
                            <button
                              type="button"
                              onClick={() => deleteTaxRule(rule.id)}
                              className="rounded-lg p-2 text-red-600 hover:bg-red-50"
                              aria-label="Delete tax rule"
                            >
                              <Trash2 size={15} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </Section>

          {/* Refunds */}
          <Section
            title="Refund Policy"
            description="Define refund processing time, payment method, and refund conditions."
            icon={RotateCcw}
          >
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <Field label="Refund Processing Time (Business Days)">
                <input
                  type="number"
                  min="0"
                  value={policies.refundProcessingDays}
                  onChange={(e) => update("refundProcessingDays", e.target.value)}
                  className={inputClass}
                />
              </Field>

              <Field label="Refund Method">
                <select
                  value={policies.refundMethod}
                  onChange={(e) => update("refundMethod", e.target.value)}
                  className={inputClass}
                >
                  <option value="original">Original Payment Method</option>
                  <option value="bank">Bank Transfer</option>
                  <option value="cash">Cash</option>
                  <option value="wallet">Wallet / Credit</option>
                  <option value="manual">Manual Processing</option>
                </select>
              </Field>

              <Field label="Refund Conditions" className="md:col-span-2">
                <textarea
                  rows={4}
                  value={policies.refundConditions}
                  onChange={(e) => update("refundConditions", e.target.value)}
                  className={inputClass}
                />
              </Field>
            </div>
          </Section>

          {/* Summary */}
          <Section
            title="Policy Summary"
            description="Review the main settings before saving."
            icon={FileText}
          >
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
              <div className="rounded-lg bg-slate-50 p-4">
                <p className="text-xs text-slate-500">Check-in</p>
                <p className="mt-1 text-lg font-bold text-slate-800">{policies.checkInTime}</p>
              </div>
              <div className="rounded-lg bg-slate-50 p-4">
                <p className="text-xs text-slate-500">Check-out</p>
                <p className="mt-1 text-lg font-bold text-slate-800">{policies.checkOutTime}</p>
              </div>
              <div className="rounded-lg bg-slate-50 p-4">
                <p className="text-xs text-slate-500">Default GST</p>
                <p className="mt-1 text-lg font-bold text-slate-800">
                  {policies.gstEnabled ? `${policies.gstRate}%` : "Disabled"}
                </p>
              </div>
              <div className="rounded-lg bg-slate-50 p-4">
                <p className="text-xs text-slate-500">Security Deposit</p>
                <p className="mt-1 text-lg font-bold text-slate-800">
                  {policies.depositEnabled ? money(policies.depositAmount) : "Disabled"}
                </p>
              </div>
            </div>
            <PolicyNote>
              Tax rates and hotel policies must comply with applicable local
              laws and your property's actual terms. The sample GST rates in
              this demo are configurable examples, not tax advice or verified
              statutory rates. Configure and validate rates with your
              accountant before using them in invoices.
            </PolicyNote>
          </Section>

          {/* Save */}
          <div className="sticky bottom-0 z-10 flex flex-col justify-between gap-3 rounded-xl border border-slate-200 bg-white/95 p-4 shadow-lg backdrop-blur sm:flex-row sm:items-center">
            <p className="text-xs text-slate-500">
              {isDirty ? "You have unsaved changes." : "No unsaved changes."}
            </p>
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={resetChanges}
                className="rounded-lg border border-slate-200 px-4 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50"
              >
                Cancel Changes
              </button>
              <button
                type="submit"
                className="inline-flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-blue-700"
              >
                <Save size={16} />
                Save Taxes & Policies
              </button>
            </div>
          </div>
        </form>

        {/* Tax rule modal */}
        {showTaxForm && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 p-4">
            <div className="w-full max-w-lg rounded-xl bg-white shadow-2xl">
              <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4">
                <div>
                  <h3 className="font-semibold text-slate-900">
                    {editingTaxId !== null ? "Edit Tax Rule" : "Add Tax Rule"}
                  </h3>
                  <p className="mt-1 text-xs text-slate-500">
                    Configure a tax rule for a hotel service.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setShowTaxForm(false)}
                  className="rounded-lg p-2 text-slate-500 hover:bg-slate-100"
                  aria-label="Close"
                >
                  ✕
                </button>
              </div>

              <form onSubmit={saveTaxRule} className="space-y-4 p-5">
                <Field label="Tax Name *">
                  <input
                    required
                    value={taxForm.name}
                    onChange={(e) => setTaxForm({ ...taxForm, name: e.target.value })}
                    className={inputClass}
                    placeholder="e.g. Room GST"
                  />
                </Field>

                <div className="grid grid-cols-2 gap-3">
                  <Field label="Tax Type">
                    <select
                      value={taxForm.type}
                      onChange={(e) => setTaxForm({ ...taxForm, type: e.target.value })}
                      className={inputClass}
                    >
                      <option>GST</option>
                      <option>Service Tax</option>
                      <option>Local Tax</option>
                      <option>Other</option>
                    </select>
                  </Field>
                  <Field label="Rate (%) *">
                    <input
                      required
                      type="number"
                      min="0"
                      max="100"
                      step="0.01"
                      value={taxForm.rate}
                      onChange={(e) => setTaxForm({ ...taxForm, rate: e.target.value })}
                      className={inputClass}
                      placeholder="e.g. 12"
                    />
                  </Field>
                </div>

                <Field label="Applies To">
                  <select
                    value={taxForm.appliesTo}
                    onChange={(e) => setTaxForm({ ...taxForm, appliesTo: e.target.value })}
                    className={inputClass}
                  >
                    <option>All Services</option>
                    <option>Room Charges</option>
                    <option>Food & Beverage</option>
                    <option>Events & Banquets</option>
                    <option>Other Services</option>
                  </select>
                </Field>

                <Toggle
                  label="Tax Rule Active"
                  checked={taxForm.enabled}
                  onChange={(v) => setTaxForm({ ...taxForm, enabled: v })}
                />

                <div className="flex justify-end gap-2 border-t border-slate-100 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowTaxForm(false)}
                    className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700"
                  >
                    {editingTaxId !== null ? "Update Tax Rule" : "Add Tax Rule"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
