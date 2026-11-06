
import { useState } from "react";
import {
  Settings,
  Globe,
  Clock,
  Coins,
  CalendarDays,
  Building2,
  Phone,
  Mail,
  Save,
  RotateCcw,
  CheckCircle2,
  Languages,
  SlidersHorizontal,
} from "lucide-react";

const initialSettings = {
  propertyName: "StayFlow Hotel",
  language: "en",
  timezone: "Asia/Kolkata",
  currency: "INR",
  dateFormat: "DD/MM/YYYY",
  timeFormat: "12",
  startOfWeek: "Monday",
  checkInTime: "14:00",
  checkOutTime: "11:00",
  businessStart: "00:00",
  businessEnd: "23:59",
  phone: "+91 98765 43210",
  email: "hotel@example.com",
  website: "https://www.example.com",
  address: "Rewari, Haryana, India",
  autoConfirm: true,
  emailNotifications: true,
  smsNotifications: false,
  allowOverbooking: false,
  enableHousekeepingAlerts: true,
  enablePaymentReminders: true,
};

const inputClass =
  "w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm text-slate-800 outline-none transition focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100";

const labelClass = "mb-1.5 block text-sm font-medium text-slate-700";

function Section({ icon: Icon, title, description, children }) {
  return (
    <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
      <div className="flex items-start gap-3 border-b border-slate-100 p-5">
        <div className="rounded-xl bg-indigo-50 p-2.5 text-indigo-600">
          <Icon size={20} />
        </div>
        <div>
          <h2 className="font-bold text-slate-900">{title}</h2>
          <p className="mt-1 text-sm text-slate-500">{description}</p>
        </div>
      </div>
      <div className="grid grid-cols-1 gap-5 p-5 md:grid-cols-2">
        {children}
      </div>
    </section>
  );
}

function Field({ label, children, description }) {
  return (
    <div>
      <label className={labelClass}>{label}</label>
      {children}
      {description && (
        <p className="mt-1.5 text-xs text-slate-400">{description}</p>
      )}
    </div>
  );
}

function Toggle({ label, description, checked, onChange }) {
  return (
    <div className="flex items-center justify-between gap-4 rounded-xl border border-slate-200 p-4">
      <div>
        <p className="text-sm font-semibold text-slate-800">{label}</p>
        {description && (
          <p className="mt-1 text-xs text-slate-500">{description}</p>
        )}
      </div>
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        onClick={() => onChange(!checked)}
        className={`relative h-6 w-11 shrink-0 rounded-full transition ${
          checked ? "bg-indigo-600" : "bg-slate-300"
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

export default function GeneralSettings() {
  const [settings, setSettings] = useState(initialSettings);
  const [saved, setSaved] = useState(false);

  const update = (key, value) => {
    setSettings((current) => ({
      ...current,
      [key]: value,
    }));
    setSaved(false);
  };

  const handleReset = () => {
    setSettings(initialSettings);
    setSaved(false);
  };

  const handleSave = (e) => {
    e.preventDefault();

    // Demo only: settings remain in React state.
    // Connect this handler to your settings API when building the backend.
    setSaved(true);
  };

  return (
    <div className="min-h-screen w-full bg-slate-50 p-2 md:p-4">
      <form onSubmit={handleSave} className="w-full space-y-5">
        {/* Header */}
        <div className="flex flex-col justify-between gap-4 lg:flex-row lg:items-center">
          <div>
            <div className="flex items-center gap-2 text-sm text-slate-500">
              <span>Configuration</span>
              <span>/</span>
              <span className="font-medium text-indigo-600">General Settings</span>
            </div>

            <h1 className="mt-2 text-2xl font-bold text-slate-900 md:text-3xl">
              General Settings
            </h1>

            <p className="mt-1 text-sm text-slate-500">
              Configure your hotel's basic system preferences and operating details.
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={handleReset}
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50"
            >
              <RotateCcw size={16} />
              Reset
            </button>

            <button
              type="submit"
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-700"
            >
              <Save size={17} />
              Save Settings
            </button>
          </div>
        </div>

        {saved && (
          <div className="flex items-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-sm font-medium text-emerald-700">
            <CheckCircle2 size={18} />
            Settings saved in the current demo session.
          </div>
        )}

        {/* Property identity */}
        <Section
          icon={Building2}
          title="Property Information"
          description="Set the basic identity used throughout your StayFlow system."
        >
          <Field label="Property Name">
            <input
              required
              value={settings.propertyName}
              onChange={(e) => update("propertyName", e.target.value)}
              className={inputClass}
              placeholder="Enter property name"
            />
          </Field>

          <Field label="Default Language">
            <select
              value={settings.language}
              onChange={(e) => update("language", e.target.value)}
              className={inputClass}
            >
              <option value="en">English</option>
              <option value="hi">Hindi</option>
              <option value="fr">French</option>
              <option value="es">Spanish</option>
              <option value="de">German</option>
              <option value="ar">Arabic</option>
            </select>
          </Field>
        </Section>

        {/* Regional settings */}
        <Section
          icon={Globe}
          title="Regional & Localization"
          description="Choose the region, timezone and formats used by the application."
        >
          <Field label="Time Zone">
            <select
              value={settings.timezone}
              onChange={(e) => update("timezone", e.target.value)}
              className={inputClass}
            >
              <option value="Asia/Kolkata">India Standard Time (Asia/Kolkata)</option>
              <option value="Asia/Dubai">Gulf Standard Time (Asia/Dubai)</option>
              <option value="Asia/Singapore">Singapore (Asia/Singapore)</option>
              <option value="Europe/London">London (Europe/London)</option>
              <option value="Europe/Paris">Paris (Europe/Paris)</option>
              <option value="America/New_York">New York (America/New_York)</option>
              <option value="America/Los_Angeles">Los Angeles (America/Los_Angeles)</option>
              <option value="Australia/Sydney">Sydney (Australia/Sydney)</option>
            </select>
          </Field>

          <Field label="Currency">
            <select
              value={settings.currency}
              onChange={(e) => update("currency", e.target.value)}
              className={inputClass}
            >
              <option value="INR">INR - Indian Rupee (₹)</option>
              <option value="USD">USD - US Dollar ($)</option>
              <option value="EUR">EUR - Euro (€)</option>
              <option value="GBP">GBP - British Pound (£)</option>
              <option value="AED">AED - UAE Dirham</option>
              <option value="SGD">SGD - Singapore Dollar</option>
              <option value="AUD">AUD - Australian Dollar</option>
              <option value="CAD">CAD - Canadian Dollar</option>
            </select>
          </Field>

          <Field label="Date Format">
            <select
              value={settings.dateFormat}
              onChange={(e) => update("dateFormat", e.target.value)}
              className={inputClass}
            >
              <option value="DD/MM/YYYY">DD/MM/YYYY (06/11/2026)</option>
              <option value="MM/DD/YYYY">MM/DD/YYYY (11/06/2026)</option>
              <option value="YYYY-MM-DD">YYYY-MM-DD (2026-11-06)</option>
              <option value="DD-MMM-YYYY">DD-MMM-YYYY (06-Nov-2026)</option>
            </select>
          </Field>

          <Field label="Time Format">
            <select
              value={settings.timeFormat}
              onChange={(e) => update("timeFormat", e.target.value)}
              className={inputClass}
            >
              <option value="12">12-hour (02:00 PM)</option>
              <option value="24">24-hour (14:00)</option>
            </select>
          </Field>

          <Field label="First Day of Week">
            <select
              value={settings.startOfWeek}
              onChange={(e) => update("startOfWeek", e.target.value)}
              className={inputClass}
            >
              <option value="Monday">Monday</option>
              <option value="Sunday">Sunday</option>
              <option value="Saturday">Saturday</option>
            </select>
          </Field>
        </Section>

        {/* Business hours */}
        <Section
          icon={Clock}
          title="Business Hours"
          description="Configure the hotel's general operating hours and standard guest timings."
        >
          <Field label="Business Opening Time">
            <input
              type="time"
              value={settings.businessStart}
              onChange={(e) => update("businessStart", e.target.value)}
              className={inputClass}
            />
          </Field>

          <Field label="Business Closing Time">
            <input
              type="time"
              value={settings.businessEnd}
              onChange={(e) => update("businessEnd", e.target.value)}
              className={inputClass}
            />
          </Field>

          <Field label="Default Check-in Time">
            <input
              type="time"
              value={settings.checkInTime}
              onChange={(e) => update("checkInTime", e.target.value)}
              className={inputClass}
            />
          </Field>

          <Field label="Default Check-out Time">
            <input
              type="time"
              value={settings.checkOutTime}
              onChange={(e) => update("checkOutTime", e.target.value)}
              className={inputClass}
            />
          </Field>
        </Section>

        {/* Contact details */}
        <Section
          icon={Phone}
          title="Contact Details"
          description="Default contact information used for property-related communication."
        >
          <Field label="Contact Phone">
            <input
              type="tel"
              value={settings.phone}
              onChange={(e) => update("phone", e.target.value)}
              className={inputClass}
              placeholder="+91 00000 00000"
            />
          </Field>

          <Field label="Contact Email">
            <input
              type="email"
              value={settings.email}
              onChange={(e) => update("email", e.target.value)}
              className={inputClass}
              placeholder="hotel@example.com"
            />
          </Field>

          <Field label="Website">
            <input
              type="url"
              value={settings.website}
              onChange={(e) => update("website", e.target.value)}
              className={inputClass}
              placeholder="https://example.com"
            />
          </Field>

          <Field label="Property Address">
            <input
              value={settings.address}
              onChange={(e) => update("address", e.target.value)}
              className={inputClass}
              placeholder="Enter property address"
            />
          </Field>
        </Section>

        {/* Preferences */}
        <Section
          icon={SlidersHorizontal}
          title="Default Preferences"
          description="Set default behavior and notification preferences for your hotel."
        >
          <div className="space-y-3 md:col-span-2">
            <Toggle
              label="Automatically Confirm Reservations"
              description="Automatically confirm new reservations when the booking rules allow it."
              checked={settings.autoConfirm}
              onChange={(value) => update("autoConfirm", value)}
            />

            <Toggle
              label="Email Notifications"
              description="Enable system notifications through email."
              checked={settings.emailNotifications}
              onChange={(value) => update("emailNotifications", value)}
            />

            <Toggle
              label="SMS Notifications"
              description="Enable SMS alerts for relevant hotel activities."
              checked={settings.smsNotifications}
              onChange={(value) => update("smsNotifications", value)}
            />

            <Toggle
              label="Allow Overbooking"
              description="Allow reservations beyond the normal available room inventory."
              checked={settings.allowOverbooking}
              onChange={(value) => update("allowOverbooking", value)}
            />

            <Toggle
              label="Housekeeping Alerts"
              description="Enable alerts for pending and overdue housekeeping tasks."
              checked={settings.enableHousekeepingAlerts}
              onChange={(value) => update("enableHousekeepingAlerts", value)}
            />

            <Toggle
              label="Payment Reminders"
              description="Enable reminders for pending guest payments."
              checked={settings.enablePaymentReminders}
              onChange={(value) => update("enablePaymentReminders", value)}
            />
          </div>
        </Section>

        {/* Bottom actions */}
        <div className="flex flex-col justify-between gap-3 rounded-2xl border border-slate-200 bg-white p-4 sm:flex-row sm:items-center">
          <div className="flex items-center gap-2 text-sm text-slate-500">
            <Settings size={17} />
            Review your configuration before saving.
          </div>

          <div className="flex gap-2">
            <button
              type="button"
              onClick={handleReset}
              className="rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50"
            >
              Reset Changes
            </button>
            <button
              type="submit"
              className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-indigo-700"
            >
              <Save size={16} />
              Save Settings
            </button>
          </div>
        </div>

        <div className="rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800">
          <strong>Frontend demo:</strong> Changes are held in React state and are not persisted after refreshing the page. The save handler is ready to connect to your backend settings API.
        </div>
      </form>
    </div>
  );
}
