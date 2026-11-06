
import { useRef, useState } from "react";
import {
  Building2,
  Upload,
  ImagePlus,
  Trash2,
  Save,
  RotateCcw,
  MapPin,
  Phone,
  Mail,
  Globe,
  FileText,
  Camera,
  X,
  CheckCircle2,
} from "lucide-react";

const initialProfile = {
  hotelName: "StayFlow Grand Hotel",
  category: "4 Star Hotel",
  description:
    "A comfortable hotel offering quality accommodation, dining, and hospitality services for business and leisure travellers.",
  address: "123 Main Road",
  city: "Rewari",
  state: "Haryana",
  postalCode: "123401",
  country: "India",
  phone: "+91 98765 43210",
  alternatePhone: "",
  email: "info@stayflowhotel.com",
  website: "https://www.stayflowhotel.com",
  registrationNumber: "",
  gstin: "",
  pan: "",
};

const categories = [
  "Budget Hotel",
  "3 Star Hotel",
  "4 Star Hotel",
  "5 Star Hotel",
  "Luxury Hotel",
  "Resort",
  "Boutique Hotel",
  "Business Hotel",
  "Guest House",
];

const inputClass =
  "w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-800 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100";

const labelClass = "mb-1.5 block text-sm font-medium text-slate-700";

function Section({ title, description, icon: Icon, children }) {
  return (
    <section className="rounded-xl border border-slate-200 bg-white shadow-sm">
      <div className="flex items-start gap-3 border-b border-slate-100 px-5 py-4">
        <div className="rounded-lg bg-blue-50 p-2 text-blue-600">
          <Icon size={19} />
        </div>
        <div>
          <h2 className="font-semibold text-slate-800">{title}</h2>
          <p className="mt-0.5 text-xs text-slate-500">{description}</p>
        </div>
      </div>
      <div className="space-y-4 p-5">{children}</div>
    </section>
  );
}

function Field({ label, children, className = "" }) {
  return (
    <div className={className}>
      <label className={labelClass}>{label}</label>
      {children}
    </div>
  );
}

export default function PropertyProfile() {
  const [profile, setProfile] = useState(initialProfile);
  const [savedProfile, setSavedProfile] = useState(initialProfile);
  const [logo, setLogo] = useState("");
  const [gallery, setGallery] = useState([]);
  const [savedLogo, setSavedLogo] = useState("");
  const [savedGallery, setSavedGallery] = useState([]);
  const [notice, setNotice] = useState("");
  const [isDirty, setIsDirty] = useState(false);

  const logoInputRef = useRef(null);
  const galleryInputRef = useRef(null);

  const updateField = (key, value) => {
    setProfile((prev) => ({ ...prev, [key]: value }));
    setIsDirty(true);
    setNotice("");
  };

  const readImage = (file, callback) => {
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setNotice("Please select a valid image file.");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setNotice("Image size must be less than 5 MB.");
      return;
    }

    const reader = new FileReader();
    reader.onload = () => callback(reader.result);
    reader.readAsDataURL(file);
  };

  const handleLogoUpload = (event) => {
    const file = event.target.files?.[0];
    readImage(file, (result) => {
      setLogo(result);
      setIsDirty(true);
      setNotice("");
    });
    event.target.value = "";
  };

  const handleGalleryUpload = (event) => {
    const files = Array.from(event.target.files || []);
    const available = Math.max(0, 12 - gallery.length);

    if (files.length > available) {
      setNotice("You can upload a maximum of 12 property images.");
    }

    files.slice(0, available).forEach((file) => {
      readImage(file, (result) => {
        setGallery((prev) => [...prev, result].slice(0, 12));
        setIsDirty(true);
      });
    });

    event.target.value = "";
  };

  const removeGalleryImage = (index) => {
    setGallery((prev) => prev.filter((_, i) => i !== index));
    setIsDirty(true);
  };

  const handleSave = (event) => {
    event.preventDefault();
    setSavedProfile({ ...profile });
    setSavedLogo(logo);
    setSavedGallery([...gallery]);
    setIsDirty(false);
    setNotice("Property profile saved for this demo session.");
  };

  const handleReset = () => {
    setProfile({ ...savedProfile });
    setLogo(savedLogo);
    setGallery([...savedGallery]);
    setIsDirty(false);
    setNotice("Changes have been reset.");
  };

  const handleDiscard = () => {
    setProfile(initialProfile);
    setSavedProfile(initialProfile);
    setLogo("");
    setSavedLogo("");
    setGallery([]);
    setSavedGallery([]);
    setIsDirty(false);
    setNotice("Profile has been reset to the sample details.");
  };

  return (
    <div className="min-h-screen w-full bg-slate-50 p-2 md:p-4">
      <div className="w-full space-y-5">
        {/* Header */}
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <div className="flex items-center gap-2 text-sm text-slate-500">
              <Building2 size={16} />
              Configuration / Property Profile
            </div>
            <h1 className="mt-2 text-2xl font-bold text-slate-900">
              Property Profile
            </h1>
            <p className="mt-1 text-sm text-slate-500">
              Manage your hotel's identity, images, contact information, and
              registration details.
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={handleReset}
              className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50"
            >
              <RotateCcw size={16} />
              Reset Changes
            </button>
            <button
              type="button"
              onClick={handleDiscard}
              className="inline-flex items-center gap-2 rounded-lg border border-red-200 bg-white px-4 py-2.5 text-sm font-medium text-red-600 hover:bg-red-50"
            >
              <X size={16} />
              Restore Defaults
            </button>
          </div>
        </div>

        {/* Status */}
        {notice && (
          <div className="flex items-center gap-2 rounded-lg border border-blue-200 bg-blue-50 px-4 py-3 text-sm text-blue-800">
            <CheckCircle2 size={17} />
            {notice}
          </div>
        )}

        <form onSubmit={handleSave} className="space-y-5">
          {/* Basic information */}
          <Section
            title="Hotel Information"
            description="Your property's public identity and basic details."
            icon={Building2}
          >
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <Field label="Hotel / Property Name *">
                <input
                  required
                  value={profile.hotelName}
                  onChange={(e) => updateField("hotelName", e.target.value)}
                  className={inputClass}
                  placeholder="Enter hotel name"
                />
              </Field>

              <Field label="Property Category *">
                <select
                  required
                  value={profile.category}
                  onChange={(e) => updateField("category", e.target.value)}
                  className={inputClass}
                >
                  {categories.map((category) => (
                    <option key={category}>{category}</option>
                  ))}
                </select>
              </Field>

              <Field label="Property Description" className="md:col-span-2">
                <textarea
                  rows={4}
                  maxLength={1000}
                  value={profile.description}
                  onChange={(e) => updateField("description", e.target.value)}
                  className={inputClass}
                  placeholder="Describe your hotel and its facilities..."
                />
                <p className="mt-1 text-right text-xs text-slate-400">
                  {profile.description.length}/1000 characters
                </p>
              </Field>
            </div>
          </Section>

          {/* Logo */}
          <Section
            title="Property Logo"
            description="Upload your hotel's logo for use across the system."
            icon={Camera}
          >
            <div className="flex flex-col items-start gap-5 sm:flex-row sm:items-center">
              <div className="flex h-32 w-32 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-dashed border-slate-300 bg-slate-50">
                {logo ? (
                  <img
                    src={logo}
                    alt="Hotel logo"
                    className="h-full w-full object-contain p-2"
                  />
                ) : (
                  <div className="text-center text-slate-400">
                    <Building2 size={32} className="mx-auto" />
                    <span className="mt-2 block text-xs">No logo uploaded</span>
                  </div>
                )}
              </div>

              <div>
                <div className="flex flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={() => logoInputRef.current?.click()}
                    className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-blue-700"
                  >
                    <Upload size={16} />
                    Upload Logo
                  </button>
                  {logo && (
                    <button
                      type="button"
                      onClick={() => {
                        setLogo("");
                        setIsDirty(true);
                      }}
                      className="rounded-lg border border-red-200 px-4 py-2.5 text-sm font-medium text-red-600 hover:bg-red-50"
                    >
                      Remove Logo
                    </button>
                  )}
                </div>
                <p className="mt-2 text-xs text-slate-500">
                  PNG, JPG, or WEBP. Maximum file size: 5 MB.
                </p>
              </div>

              <input
                ref={logoInputRef}
                type="file"
                accept="image/*"
                onChange={handleLogoUpload}
                className="hidden"
              />
            </div>
          </Section>

          {/* Gallery */}
          <Section
            title="Hotel Images"
            description="Upload property photos for your hotel gallery. Maximum 12 images."
            icon={ImagePlus}
          >
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
              {gallery.map((image, index) => (
                <div
                  key={`${index}-${image.slice(-20)}`}
                  className="group relative aspect-video overflow-hidden rounded-lg border border-slate-200 bg-slate-100"
                >
                  <img
                    src={image}
                    alt={`Hotel gallery ${index + 1}`}
                    className="h-full w-full object-cover"
                  />
                  <button
                    type="button"
                    onClick={() => removeGalleryImage(index)}
                    aria-label="Remove image"
                    className="absolute right-2 top-2 rounded-lg bg-white/90 p-2 text-red-600 shadow hover:bg-white"
                  >
                    <Trash2 size={15} />
                  </button>
                </div>
              ))}

              {gallery.length < 12 && (
                <button
                  type="button"
                  onClick={() => galleryInputRef.current?.click()}
                  className="flex aspect-video flex-col items-center justify-center rounded-lg border-2 border-dashed border-slate-300 bg-slate-50 text-slate-500 transition hover:border-blue-400 hover:bg-blue-50 hover:text-blue-600"
                >
                  <ImagePlus size={25} />
                  <span className="mt-2 text-xs font-medium">
                    Add Property Image
                  </span>
                </button>
              )}
            </div>

            <input
              ref={galleryInputRef}
              type="file"
              accept="image/*"
              multiple
              onChange={handleGalleryUpload}
              className="hidden"
            />

            <p className="text-xs text-slate-500">
              {gallery.length} of 12 images selected. Each image must be
              smaller than 5 MB.
            </p>
          </Section>

          {/* Address */}
          <Section
            title="Property Address"
            description="Official location and postal address of your hotel."
            icon={MapPin}
          >
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
              <Field label="Address / Street *" className="md:col-span-2">
                <input
                  required
                  value={profile.address}
                  onChange={(e) => updateField("address", e.target.value)}
                  className={inputClass}
                  placeholder="Street, building, locality"
                />
              </Field>

              <Field label="City *">
                <input
                  required
                  value={profile.city}
                  onChange={(e) => updateField("city", e.target.value)}
                  className={inputClass}
                  placeholder="City"
                />
              </Field>

              <Field label="State *">
                <input
                  required
                  value={profile.state}
                  onChange={(e) => updateField("state", e.target.value)}
                  className={inputClass}
                  placeholder="State"
                />
              </Field>

              <Field label="Postal Code *">
                <input
                  required
                  value={profile.postalCode}
                  onChange={(e) => updateField("postalCode", e.target.value)}
                  className={inputClass}
                  placeholder="Postal code"
                />
              </Field>

              <Field label="Country *">
                <input
                  required
                  value={profile.country}
                  onChange={(e) => updateField("country", e.target.value)}
                  className={inputClass}
                  placeholder="Country"
                />
              </Field>
            </div>
          </Section>

          {/* Contact */}
          <Section
            title="Contact Information"
            description="Contact details used for guest communication and property enquiries."
            icon={Phone}
          >
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <Field label="Primary Phone *">
                <input
                  required
                  type="tel"
                  value={profile.phone}
                  onChange={(e) => updateField("phone", e.target.value)}
                  className={inputClass}
                  placeholder="+91 XXXXX XXXXX"
                />
              </Field>

              <Field label="Alternate Phone">
                <input
                  type="tel"
                  value={profile.alternatePhone}
                  onChange={(e) => updateField("alternatePhone", e.target.value)}
                  className={inputClass}
                  placeholder="Alternate contact number"
                />
              </Field>

              <Field label="Email Address *">
                <div className="relative">
                  <Mail
                    size={16}
                    className="absolute left-3 top-3 text-slate-400"
                  />
                  <input
                    required
                    type="email"
                    value={profile.email}
                    onChange={(e) => updateField("email", e.target.value)}
                    className={`${inputClass} pl-9`}
                    placeholder="hotel@example.com"
                  />
                </div>
              </Field>

              <Field label="Website">
                <div className="relative">
                  <Globe
                    size={16}
                    className="absolute left-3 top-3 text-slate-400"
                  />
                  <input
                    type="url"
                    value={profile.website}
                    onChange={(e) => updateField("website", e.target.value)}
                    className={`${inputClass} pl-9`}
                    placeholder="https://www.example.com"
                  />
                </div>
              </Field>
            </div>
          </Section>

          {/* Registration */}
          <Section
            title="Registration & Tax Information"
            description="Official business identification and tax registration details."
            icon={FileText}
          >
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <Field label="Business Registration Number">
                <input
                  value={profile.registrationNumber}
                  onChange={(e) =>
                    updateField("registrationNumber", e.target.value)
                  }
                  className={inputClass}
                  placeholder="Enter registration number"
                />
              </Field>

              <Field label="GSTIN">
                <input
                  value={profile.gstin}
                  onChange={(e) => updateField("gstin", e.target.value.toUpperCase())}
                  className={inputClass}
                  maxLength={15}
                  placeholder="15-character GSTIN"
                />
              </Field>

              <Field label="PAN Number">
                <input
                  value={profile.pan}
                  onChange={(e) => updateField("pan", e.target.value.toUpperCase())}
                  className={inputClass}
                  maxLength={10}
                  placeholder="10-character PAN"
                />
              </Field>
            </div>
            <p className="rounded-lg bg-amber-50 px-3 py-2 text-xs text-amber-800">
              Keep registration and tax information accurate. These fields are
              optional in this frontend demo; validate them with your backend
              before using them for official invoices or tax reporting.
            </p>
          </Section>

          {/* Footer actions */}
          <div className="sticky bottom-0 z-10 flex flex-col justify-between gap-3 rounded-xl border border-slate-200 bg-white/95 p-4 shadow-lg backdrop-blur sm:flex-row sm:items-center">
            <p className="text-xs text-slate-500">
              {isDirty
                ? "You have unsaved changes."
                : "Your profile has no unsaved changes."}
            </p>

            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={handleReset}
                className="rounded-lg border border-slate-200 px-4 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50"
              >
                Cancel Changes
              </button>
              <button
                type="submit"
                className="inline-flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-blue-700"
              >
                <Save size={16} />
                Save Property Profile
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
