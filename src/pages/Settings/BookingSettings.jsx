
import { useState } from "react";
import {
  CalendarCheck,
  Hash,
  CheckCircle2,
  Wallet,
  CalendarX,
  Clock,
  Save,
  RotateCcw,
  Settings2,
  AlertCircle,
} from "lucide-react";

const initialSettings = {
  defaultReservationStatus: "Pending",
  autoConfirm: false,
  confirmationMethod: "Manual",
  confirmationMessage:
    "Your reservation request has been received. We will confirm your booking shortly.",

  reservationPrefix: "STF",
  reservationSeparator: "-",
  reservationNumberLength: "6",
  reservationStartingNumber: "100001",
  includeYear: true,

  advancePaymentEnabled: true,
  advancePaymentType: "percentage",
  advancePaymentValue: "25",
  advancePaymentDeadline: "24",
  acceptPartialPayment: true,
  paymentDueBeforeCheckIn: "24",
  allowPayAtHotel: true,

  cancellationEnabled: true,
  freeCancellationHours: "48",
  cancellationChargeType: "percentage",
  cancellationCharge: "50",
  allowCancellationAfterConfirmation: true,
  noShowPolicy: "full",
  cancellationMessage:
    "Please review the cancellation terms before cancelling your reservation.",

  bookingExpiryEnabled: true,
  pendingBookingExpiry: "30",
  unpaidBookingExpiry: "60",
  expiryAction: "Cancel Booking",
  sendExpiryNotification: true,

  defaultCheckInTime: "14:00",
  defaultCheckOutTime: "11:00",
  minimumStay: "1",
  maximumStay: "30",
  advanceBookingDays: "365",
  sameDayBooking: true,
  allowOverbooking: false,
};

const inputClass =
  "w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-800 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100";

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

function Toggle({ label, description, checked, onChange }) {
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

function Notice({ children }) {
  return (
    <div className="flex items-start gap-2 rounded-lg border border-amber-200 bg-amber-50 p-3 text-xs text-amber-800">
      <AlertCircle size={16} className="mt-0.5 shrink-0" />
      <p>{children}</p>
    </div>
  );
}

export default function BookingSettings() {
  const [settings, setSettings] = useState(initialSettings);
  const [savedSettings, setSavedSettings] = useState(initialSettings);
  const [notice, setNotice] = useState("");
  const [isDirty, setIsDirty] = useState(false);

  const update = (key, value) => {
    setSettings((prev) => ({ ...prev, [key]: value }));
    setIsDirty(true);
    setNotice("");
  };

  const saveSettings = (event) => {
    event.preventDefault();

    const paymentValue = Number(settings.advancePaymentValue);
    const cancellationValue = Number(settings.cancellationCharge);

    if (
      settings.advancePaymentEnabled &&
      (!Number.isFinite(paymentValue) ||
        paymentValue < 0 ||
        (settings.advancePaymentType === "percentage" && paymentValue > 100))
    ) {
      setNotice("Enter a valid advance payment value.");
      return;
    }

    if (
      settings.cancellationEnabled &&
      (!Number.isFinite(cancellationValue) ||
        cancellationValue < 0 ||
        (settings.cancellationChargeType === "percentage" &&
          cancellationValue > 100))
    ) {
      setNotice("Enter a valid cancellation charge.");
      return;
    }

    if (
      Number(settings.minimumStay) < 1 ||
      Number(settings.maximumStay) < Number(settings.minimumStay)
    ) {
      setNotice("Maximum stay must be greater than or equal to minimum stay.");
      return;
    }

    if (
      Number(settings.reservationNumberLength) < 3 ||
      Number(settings.reservationNumberLength) > 12
    ) {
      setNotice("Reservation number length must be between 3 and 12.");
      return;
    }

    if (!settings.reservationPrefix.trim()) {
      setNotice("Reservation ID prefix cannot be empty.");
      return;
    }

    setSavedSettings({ ...settings });
    setIsDirty(false);
    setNotice("Booking settings saved for this demo session.");
  };

  const resetChanges = () => {
    setSettings({ ...savedSettings });
    setIsDirty(false);
    setNotice("Unsaved changes have been reset.");
  };

  const restoreDefaults = () => {
    if (!window.confirm("Restore all booking settings to sample defaults?")) {
      return;
    }

    setSettings({ ...initialSettings });
    setSavedSettings({ ...initialSettings });
    setIsDirty(false);
    setNotice("Default booking settings have been restored.");
  };

  const reservationPreview = () => {
    const number = String(settings.reservationStartingNumber || "1").padStart(
      Number(settings.reservationNumberLength),
      "0"
    );

    const year = settings.includeYear ? `${new Date().getFullYear()}${settings.reservationSeparator}` : "";

    return `${settings.reservationPrefix}${settings.reservationSeparator}${year}${number}`;
  };

  return (
    <div className="min-h-screen w-full bg-slate-50 p-2 md:p-4">
      <div className="w-full space-y-5">
        {/* Header */}
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <div className="flex items-center gap-2 text-sm text-slate-500">
              <Settings2 size={16} />
              Configuration / Booking Settings
            </div>
            <h1 className="mt-2 text-2xl font-bold text-slate-900">
              Booking Settings
            </h1>
            <p className="mt-1 text-sm text-slate-500">
              Configure reservation defaults, confirmation, payment
              requirements, cancellation, and booking expiry rules.
            </p>
          </div>

          <button
            type="button"
            onClick={restoreDefaults}
            className="inline-flex items-center justify-center gap-2 self-start rounded-lg border border-red-200 bg-white px-4 py-2.5 text-sm font-medium text-red-600 hover:bg-red-50"
          >
            <RotateCcw size={16} />
            Restore Defaults
          </button>
        </div>

        {notice && (
          <div className="flex items-center gap-2 rounded-lg border border-blue-200 bg-blue-50 px-4 py-3 text-sm text-blue-800">
            <CheckCircle2 size={17} />
            {notice}
          </div>
        )}

        <form onSubmit={saveSettings} className="space-y-5">
          {/* Reservation defaults */}
          <Section
            title="Default Reservation Settings"
            description="Define the initial status and confirmation behavior for new reservations."
            icon={CalendarCheck}
          >
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <Field label="Default Reservation Status">
                <select
                  value={settings.defaultReservationStatus}
                  onChange={(e) =>
                    update("defaultReservationStatus", e.target.value)
                  }
                  className={inputClass}
                >
                  <option>Pending</option>
                  <option>Confirmed</option>
                  <option>Awaiting Payment</option>
                  <option>Requested</option>
                </select>
              </Field>

              <Field label="Confirmation Method">
                <select
                  value={settings.confirmationMethod}
                  onChange={(e) => update("confirmationMethod", e.target.value)}
                  className={inputClass}
                >
                  <option>Manual</option>
                  <option>Automatic</option>
                  <option>Payment Based</option>
                </select>
              </Field>
            </div>

            <Toggle
              label="Automatically Confirm Reservations"
              description="Confirm eligible bookings without manual staff approval."
              checked={settings.autoConfirm}
              onChange={(v) => update("autoConfirm", v)}
            />

            <Field label="Booking Confirmation Message">
              <textarea
                rows={3}
                maxLength={500}
                value={settings.confirmationMessage}
                onChange={(e) => update("confirmationMessage", e.target.value)}
                className={inputClass}
                placeholder="Enter the confirmation message..."
              />
              <p className="mt-1 text-right text-xs text-slate-400">
                {settings.confirmationMessage.length}/500
              </p>
            </Field>

            <Notice>
              Automatic confirmation should only be enabled after your
              availability and payment validation workflows are connected.
            </Notice>
          </Section>

          {/* Reservation ID */}
          <Section
            title="Reservation ID Format"
            description="Configure how unique booking reference numbers should be structured."
            icon={Hash}
          >
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
              <Field label="Reservation Prefix *">
                <input
                  required
                  value={settings.reservationPrefix}
                  onChange={(e) =>
                    update("reservationPrefix", e.target.value.toUpperCase())
                  }
                  maxLength={10}
                  className={inputClass}
                  placeholder="STF"
                />
              </Field>

              <Field label="Separator">
                <select
                  value={settings.reservationSeparator}
                  onChange={(e) =>
                    update("reservationSeparator", e.target.value)
                  }
                  className={inputClass}
                >
                  <option value="-">Hyphen (-)</option>
                  <option value="/">Slash (/)</option>
                  <option value="">No Separator</option>
                </select>
              </Field>

              <Field label="Number Length">
                <select
                  value={settings.reservationNumberLength}
                  onChange={(e) =>
                    update("reservationNumberLength", e.target.value)
                  }
                  className={inputClass}
                >
                  <option value="4">4 Digits</option>
                  <option value="5">5 Digits</option>
                  <option value="6">6 Digits</option>
                  <option value="7">7 Digits</option>
                  <option value="8">8 Digits</option>
                  <option value="9">9 Digits</option>
                  <option value="10">10 Digits</option>
                  <option value="11">11 Digits</option>
                  <option value="12">12 Digits</option>
                </select>
              </Field>

              <Field label="Starting Number">
                <input
                  type="number"
                  min="1"
                  value={settings.reservationStartingNumber}
                  onChange={(e) =>
                    update("reservationStartingNumber", e.target.value)
                  }
                  className={inputClass}
                />
              </Field>
            </div>

            <Toggle
              label="Include Booking Year"
              description="Include the current year in generated reservation IDs."
              checked={settings.includeYear}
              onChange={(v) => update("includeYear", v)}
            />

            <div className="rounded-xl border border-blue-100 bg-blue-50 p-4">
              <p className="text-xs font-medium text-blue-700">
                Reservation ID Preview
              </p>
              <p className="mt-2 break-all text-2xl font-bold tracking-wider text-blue-900">
                {reservationPreview()}
              </p>
              <p className="mt-1 text-xs text-blue-700">
                Example only. Actual unique IDs must be generated by the backend.
              </p>
            </div>
          </Section>

          {/* Confirmation */}
          <Section
            title="Booking Confirmation Rules"
            description="Control how bookings become confirmed and how confirmation is communicated."
            icon={CheckCircle2}
          >
            <div className="space-y-3">
              <Toggle
                label="Allow Automatic Confirmation"
                description="Permit the system to confirm bookings automatically."
                checked={settings.autoConfirm}
                onChange={(v) => update("autoConfirm", v)}
              />

              <Toggle
                label="Require Advance Payment Before Confirmation"
                description="Require the configured advance amount before confirming a reservation."
                checked={settings.advancePaymentEnabled}
                onChange={(v) => update("advancePaymentEnabled", v)}
              />

              <Toggle
                label="Allow Pay at Hotel"
                description="Allow eligible guests to pay when they arrive at the property."
                checked={settings.allowPayAtHotel}
                onChange={(v) => update("allowPayAtHotel", v)}
              />
            </div>
          </Section>

          {/* Advance Payment */}
          <Section
            title="Advance Payment Settings"
            description="Configure the advance amount and payment deadlines for reservations."
            icon={Wallet}
          >
            <Toggle
              label="Enable Advance Payment"
              description="Require guests to pay an advance for eligible reservations."
              checked={settings.advancePaymentEnabled}
              onChange={(v) => update("advancePaymentEnabled", v)}
            />

            {settings.advancePaymentEnabled && (
              <>
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                  <Field label="Advance Payment Type">
                    <select
                      value={settings.advancePaymentType}
                      onChange={(e) =>
                        update("advancePaymentType", e.target.value)
                      }
                      className={inputClass}
                    >
                      <option value="percentage">Percentage of Booking</option>
                      <option value="fixed">Fixed Amount (₹)</option>
                      <option value="first-night">First Night Charge</option>
                      <option value="full">Full Booking Amount</option>
                    </select>
                  </Field>

                  {settings.advancePaymentType === "percentage" ||
                  settings.advancePaymentType === "fixed" ? (
                    <Field
                      label={
                        settings.advancePaymentType === "percentage"
                          ? "Advance Percentage (%)"
                          : "Advance Amount (₹)"
                      }
                    >
                      <input
                        type="number"
                        min="0"
                        max={
                          settings.advancePaymentType === "percentage"
                            ? 100
                            : undefined
                        }
                        step="0.01"
                        value={settings.advancePaymentValue}
                        onChange={(e) =>
                          update("advancePaymentValue", e.target.value)
                        }
                        className={inputClass}
                      />
                    </Field>
                  ) : (
                    <Field label="Payment Calculation">
                      <input
                        disabled
                        value={
                          settings.advancePaymentType === "full"
                            ? "100% of booking"
                            : "One night room charge"
                        }
                        className={`${inputClass} bg-slate-50`}
                      />
                    </Field>
                  )}

                  <Field label="Payment Deadline (Hours)">
                    <input
                      type="number"
                      min="0"
                      value={settings.advancePaymentDeadline}
                      onChange={(e) =>
                        update("advancePaymentDeadline", e.target.value)
                      }
                      className={inputClass}
                    />
                  </Field>

                  <Field label="Remaining Balance Due Before Check-in (Hours)">
                    <input
                      type="number"
                      min="0"
                      value={settings.paymentDueBeforeCheckIn}
                      onChange={(e) =>
                        update("paymentDueBeforeCheckIn", e.target.value)
                      }
                      className={inputClass}
                    />
                  </Field>
                </div>

                <Toggle
                  label="Allow Partial Payments"
                  description="Allow the guest to pay the outstanding balance in multiple payments."
                  checked={settings.acceptPartialPayment}
                  onChange={(v) => update("acceptPartialPayment", v)}
                />
              </>
            )}
          </Section>

          {/* Cancellation */}
          <Section
            title="Booking Cancellation Settings"
            description="Define cancellation eligibility, fees, and no-show handling."
            icon={CalendarX}
          >
            <Toggle
              label="Enable Booking Cancellation"
              description="Allow reservations to be cancelled according to configured rules."
              checked={settings.cancellationEnabled}
              onChange={(v) => update("cancellationEnabled", v)}
            />

            {settings.cancellationEnabled && (
              <>
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                  <Field label="Free Cancellation Before (Hours)">
                    <input
                      type="number"
                      min="0"
                      value={settings.freeCancellationHours}
                      onChange={(e) =>
                        update("freeCancellationHours", e.target.value)
                      }
                      className={inputClass}
                    />
                  </Field>

                  <Field label="Cancellation Charge Type">
                    <select
                      value={settings.cancellationChargeType}
                      onChange={(e) =>
                        update("cancellationChargeType", e.target.value)
                      }
                      className={inputClass}
                    >
                      <option value="percentage">Percentage (%)</option>
                      <option value="fixed">Fixed Amount (₹)</option>
                      <option value="night">One Night Charge</option>
                      <option value="full">Full Booking Amount</option>
                    </select>
                  </Field>

                  {(settings.cancellationChargeType === "percentage" ||
                    settings.cancellationChargeType === "fixed") && (
                    <Field
                      label={
                        settings.cancellationChargeType === "percentage"
                          ? "Cancellation Charge (%)"
                          : "Cancellation Charge (₹)"
                      }
                    >
                      <input
                        type="number"
                        min="0"
                        max={
                          settings.cancellationChargeType === "percentage"
                            ? 100
                            : undefined
                        }
                        step="0.01"
                        value={settings.cancellationCharge}
                        onChange={(e) =>
                          update("cancellationCharge", e.target.value)
                        }
                        className={inputClass}
                      />
                    </Field>
                  )}

                  <Field label="No-show Policy">
                    <select
                      value={settings.noShowPolicy}
                      onChange={(e) => update("noShowPolicy", e.target.value)}
                      className={inputClass}
                    >
                      <option value="full">Charge Full Booking Amount</option>
                      <option value="partial">Charge Partial Amount</option>
                      <option value="first-night">Charge First Night</option>
                      <option value="manual">Manual Review</option>
                    </select>
                  </Field>
                </div>

                <Toggle
                  label="Allow Cancellation After Confirmation"
                  description="Permit guests or staff to cancel confirmed reservations."
                  checked={settings.allowCancellationAfterConfirmation}
                  onChange={(v) =>
                    update("allowCancellationAfterConfirmation", v)
                  }
                />

                <Field label="Cancellation Message">
                  <textarea
                    rows={3}
                    value={settings.cancellationMessage}
                    onChange={(e) =>
                      update("cancellationMessage", e.target.value)
                    }
                    className={inputClass}
                  />
                </Field>
              </>
            )}
          </Section>

          {/* Expiry */}
          <Section
            title="Booking Expiry Settings"
            description="Automatically handle pending or unpaid reservations after a defined period."
            icon={Clock}
          >
            <Toggle
              label="Enable Automatic Booking Expiry"
              description="Apply expiry rules to pending and unpaid reservations."
              checked={settings.bookingExpiryEnabled}
              onChange={(v) => update("bookingExpiryEnabled", v)}
            />

            {settings.bookingExpiryEnabled && (
              <>
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <Field label="Pending Booking Expiry (Minutes)">
                    <input
                      type="number"
                      min="1"
                      value={settings.pendingBookingExpiry}
                      onChange={(e) =>
                        update("pendingBookingExpiry", e.target.value)
                      }
                      className={inputClass}
                    />
                  </Field>

                  <Field label="Unpaid Booking Expiry (Minutes)">
                    <input
                      type="number"
                      min="1"
                      value={settings.unpaidBookingExpiry}
                      onChange={(e) =>
                        update("unpaidBookingExpiry", e.target.value)
                      }
                      className={inputClass}
                    />
                  </Field>

                  <Field label="Expiry Action">
                    <select
                      value={settings.expiryAction}
                      onChange={(e) => update("expiryAction", e.target.value)}
                      className={inputClass}
                    >
                      <option>Cancel Booking</option>
                      <option>Mark as Expired</option>
                      <option>Send for Manual Review</option>
                    </select>
                  </Field>
                </div>

                <Toggle
                  label="Send Expiry Notification"
                  description="Notify guests when their booking is approaching expiry or expires."
                  checked={settings.sendExpiryNotification}
                  onChange={(v) => update("sendExpiryNotification", v)}
                />
              </>
            )}
            <Notice>
              Expiry timers require a backend scheduler. These frontend settings
              only store the selected configuration in the current session.
            </Notice>
          </Section>

          {/* Stay rules */}
          <Section
            title="Default Stay & Availability Settings"
            description="Configure standard check-in/out times and booking duration limits."
            icon={CalendarCheck}
          >
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
              <Field label="Default Check-in Time">
                <input
                  type="time"
                  value={settings.defaultCheckInTime}
                  onChange={(e) =>
                    update("defaultCheckInTime", e.target.value)
                  }
                  className={inputClass}
                />
              </Field>

              <Field label="Default Check-out Time">
                <input
                  type="time"
                  value={settings.defaultCheckOutTime}
                  onChange={(e) =>
                    update("defaultCheckOutTime", e.target.value)
                  }
                  className={inputClass}
                />
              </Field>

              <Field label="Minimum Stay (Nights)">
                <input
                  type="number"
                  min="1"
                  value={settings.minimumStay}
                  onChange={(e) => update("minimumStay", e.target.value)}
                  className={inputClass}
                />
              </Field>

              <Field label="Maximum Stay (Nights)">
                <input
                  type="number"
                  min="1"
                  value={settings.maximumStay}
                  onChange={(e) => update("maximumStay", e.target.value)}
                  className={inputClass}
                />
              </Field>

              <Field label="Advance Booking Window (Days)">
                <input
                  type="number"
                  min="0"
                  value={settings.advanceBookingDays}
                  onChange={(e) =>
                    update("advanceBookingDays", e.target.value)
                  }
                  className={inputClass}
                />
              </Field>
            </div>

            <div className="space-y-3">
              <Toggle
                label="Allow Same-day Reservations"
                description="Allow guests to book rooms for the current date."
                checked={settings.sameDayBooking}
                onChange={(v) => update("sameDayBooking", v)}
              />

              <Toggle
                label="Allow Overbooking"
                description="Allow reservations beyond available room inventory."
                checked={settings.allowOverbooking}
                onChange={(v) => update("allowOverbooking", v)}
              />
            </div>

            {settings.allowOverbooking && (
              <Notice>
                Overbooking can create operational problems if room inventory
                is not controlled carefully. Enable this only with a defined
                overselling and relocation process.
              </Notice>
            )}
          </Section>

          {/* Summary */}
          <Section
            title="Booking Configuration Summary"
            description="Review the main booking rules before saving."
            icon={Settings2}
          >
            <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
              {[
                {
                  label: "Default Status",
                  value: settings.defaultReservationStatus,
                },
                {
                  label: "Confirmation",
                  value: settings.autoConfirm ? "Automatic" : "Manual",
                },
                {
                  label: "Advance Payment",
                  value: settings.advancePaymentEnabled ? "Enabled" : "Disabled",
                },
                {
                  label: "Cancellation",
                  value: settings.cancellationEnabled ? "Enabled" : "Disabled",
                },
                {
                  label: "Booking Expiry",
                  value: settings.bookingExpiryEnabled ? "Enabled" : "Disabled",
                },
                {
                  label: "Check-in",
                  value: settings.defaultCheckInTime,
                },
                {
                  label: "Check-out",
                  value: settings.defaultCheckOutTime,
                },
                {
                  label: "Minimum Stay",
                  value: `${settings.minimumStay} night(s)`,
                },
              ].map((item) => (
                <div
                  key={item.label}
                  className="rounded-lg bg-slate-50 p-4"
                >
                  <p className="text-xs text-slate-500">{item.label}</p>
                  <p className="mt-1 break-words text-base font-bold text-slate-800">
                    {item.value}
                  </p>
                </div>
              ))}
            </div>
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
                Save Booking Settings
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
