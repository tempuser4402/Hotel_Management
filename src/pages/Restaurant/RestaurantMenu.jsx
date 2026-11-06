
import { useMemo, useState } from "react";
import {
  Plus,
  Search,
  Utensils,
  IndianRupee,
  Leaf,
  Clock,
  Eye,
  Pencil,
  Trash2,
  X,
  ImagePlus,
  ToggleLeft,
  ToggleRight,
  ChefHat,
  Filter,
  Tag,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";

const initialCategories = [
  "All",
  "Breakfast",
  "Starters",
  "Main Course",
  "Rice & Biryani",
  "Bread",
  "Beverages",
  "Desserts",
];

const initialMenu = [
  {
    id: "M001",
    name: "Paneer Butter Masala",
    category: "Main Course",
    description: "Soft paneer cubes cooked in a rich tomato and butter gravy.",
    price: 280,
    type: "Veg",
    prepTime: 20,
    available: true,
    image: "",
    addons: ["Extra Paneer", "Extra Gravy"],
    instructions: "Can be prepared less spicy.",
  },
  {
    id: "M002",
    name: "Dal Makhani",
    category: "Main Course",
    description: "Slow-cooked black lentils with cream and aromatic spices.",
    price: 220,
    type: "Veg",
    prepTime: 18,
    available: true,
    image: "",
    addons: ["Extra Butter", "Extra Cream"],
    instructions: "Serve hot.",
  },
  {
    id: "M003",
    name: "Veg Biryani",
    category: "Rice & Biryani",
    description: "Fragrant basmati rice cooked with vegetables and spices.",
    price: 240,
    type: "Veg",
    prepTime: 20,
    available: true,
    image: "",
    addons: ["Raita", "Extra Gravy"],
    instructions: "Spice level can be adjusted.",
  },
  {
    id: "M004",
    name: "Chicken Biryani",
    category: "Rice & Biryani",
    description: "Traditional chicken biryani with aromatic basmati rice.",
    price: 320,
    type: "Non-Veg",
    prepTime: 25,
    available: true,
    image: "",
    addons: ["Boiled Egg", "Raita"],
    instructions: "Serve with onion salad.",
  },
  {
    id: "M005",
    name: "Butter Naan",
    category: "Bread",
    description: "Soft tandoor-baked naan finished with butter.",
    price: 55,
    type: "Veg",
    prepTime: 8,
    available: true,
    image: "",
    addons: ["Extra Butter"],
    instructions: "",
  },
  {
    id: "M006",
    name: "Masala Dosa",
    category: "Breakfast",
    description: "Crispy dosa filled with seasoned potato masala.",
    price: 160,
    type: "Veg",
    prepTime: 15,
    available: false,
    image: "",
    addons: ["Extra Chutney", "Extra Sambhar"],
    instructions: "",
  },
  {
    id: "M007",
    name: "Cold Coffee",
    category: "Beverages",
    description: "Chilled coffee blended with milk and ice cream.",
    price: 130,
    type: "Veg",
    prepTime: 5,
    available: true,
    image: "",
    addons: ["Extra Ice Cream", "Chocolate Syrup"],
    instructions: "Serve chilled.",
  },
  {
    id: "M008",
    name: "Gulab Jamun",
    category: "Desserts",
    description: "Soft milk-solid dumplings served in sugar syrup.",
    price: 100,
    type: "Veg",
    prepTime: 5,
    available: true,
    image: "",
    addons: ["Extra Syrup", "Vanilla Ice Cream"],
    instructions: "Serve warm.",
  },
];

const emptyForm = {
  name: "",
  category: "Main Course",
  description: "",
  price: "",
  type: "Veg",
  prepTime: 15,
  available: true,
  image: "",
  addons: "",
  instructions: "",
};

const currency = (value) =>
  `₹${Number(value || 0).toLocaleString("en-IN", {
    maximumFractionDigits: 2,
  })}`;

function StatCard({ title, value, subtitle, icon: Icon, color }) {
  const colors = {
    blue: "bg-blue-50 text-blue-600",
    green: "bg-emerald-50 text-emerald-600",
    amber: "bg-amber-50 text-amber-600",
    purple: "bg-purple-50 text-purple-600",
  };

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-sm text-slate-500">{title}</p>
          <h3 className="mt-2 text-2xl font-bold text-slate-900">{value}</h3>
          <p className="mt-1 text-xs text-slate-400">{subtitle}</p>
        </div>
        <div className={`rounded-xl p-3 ${colors[color]}`}>
          <Icon size={21} />
        </div>
      </div>
    </div>
  );
}

export default function RestaurantMenu() {
  const [menu, setMenu] = useState(initialMenu);
  const [categories, setCategories] = useState(initialCategories);
  const [activeCategory, setActiveCategory] = useState("All");
  const [search, setSearch] = useState("");
  const [availabilityFilter, setAvailabilityFilter] = useState("All");
  const [typeFilter, setTypeFilter] = useState("All");

  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [viewItem, setViewItem] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [newCategory, setNewCategory] = useState("");

  const availableCount = menu.filter((item) => item.available).length;
  const unavailableCount = menu.length - availableCount;
  const vegCount = menu.filter((item) => item.type === "Veg").length;
  const nonVegCount = menu.filter((item) => item.type === "Non-Veg").length;

  const filteredMenu = useMemo(() => {
    return menu.filter((item) => {
      const matchesSearch = [
        item.name,
        item.category,
        item.description,
      ]
        .join(" ")
        .toLowerCase()
        .includes(search.toLowerCase());

      const matchesCategory =
        activeCategory === "All" || item.category === activeCategory;

      const matchesAvailability =
        availabilityFilter === "All" ||
        (availabilityFilter === "Available" && item.available) ||
        (availabilityFilter === "Unavailable" && !item.available);

      const matchesType =
        typeFilter === "All" || item.type === typeFilter;

      return (
        matchesSearch &&
        matchesCategory &&
        matchesAvailability &&
        matchesType
      );
    });
  }, [menu, search, activeCategory, availabilityFilter, typeFilter]);

  const updateForm = (key, value) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const openNewItem = () => {
    setEditingId(null);
    setForm({
      ...emptyForm,
      category: categories.find((category) => category !== "All") || "Main Course",
    });
    setShowModal(true);
  };

  const openEditItem = (item) => {
    setEditingId(item.id);
    setForm({
      ...item,
      addons: (item.addons || []).join(", "),
    });
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingId(null);
  };

  const saveItem = (event) => {
    event.preventDefault();

    if (!form.name.trim()) {
      alert("Please enter the food item name.");
      return;
    }

    if (form.price === "" || Number(form.price) < 0) {
      alert("Please enter a valid item price.");
      return;
    }

    const itemData = {
      ...form,
      name: form.name.trim(),
      price: Number(form.price),
      prepTime: Number(form.prepTime),
      addons: form.addons
        .split(",")
        .map((addon) => addon.trim())
        .filter(Boolean),
      description: form.description.trim(),
      instructions: form.instructions.trim(),
    };

    if (editingId) {
      setMenu((prev) =>
        prev.map((item) =>
          item.id === editingId ? { ...item, ...itemData } : item
        )
      );
    } else {
      setMenu((prev) => [
        {
          ...itemData,
          id: `M${Date.now().toString().slice(-6)}`,
        },
        ...prev,
      ]);
    }

    closeModal();
  };

  const toggleAvailability = (id) => {
    setMenu((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, available: !item.available } : item
      )
    );
  };

  const deleteItem = (item) => {
    if (window.confirm(`Delete "${item.name}" from the menu?`)) {
      setMenu((prev) => prev.filter((menuItem) => menuItem.id !== item.id));
      if (viewItem?.id === item.id) setViewItem(null);
    }
  };

  const addCategory = (event) => {
    event.preventDefault();
    const value = newCategory.trim();

    if (!value) return;

    if (
      categories.some(
        (category) => category.toLowerCase() === value.toLowerCase()
      )
    ) {
      alert("This category already exists.");
      return;
    }

    setCategories((prev) => [...prev, value]);
    setNewCategory("");
  };

  const removeCategory = (category) => {
    if (category === "All") return;

    const hasItems = menu.some((item) => item.category === category);

    if (hasItems) {
      alert("Move or delete the menu items in this category before deleting it.");
      return;
    }

    if (window.confirm(`Delete category "${category}"?`)) {
      setCategories((prev) => prev.filter((item) => item !== category));
      if (activeCategory === category) setActiveCategory("All");
    }
  };

  return (
    <div className="min-h-screen w-full bg-slate-50 p-3 md:p-5">
      <div className="w-full space-y-5">
        {/* Header */}
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <div className="flex items-center gap-2 text-sm text-slate-500">
              <Utensils size={16} />
              <span>Restaurant & Dining</span>
              <span>/</span>
              <span className="text-slate-800">Menu Management</span>
            </div>

            <h1 className="mt-2 text-2xl font-bold text-slate-900">
              Menu Management
            </h1>

            <p className="mt-1 text-sm text-slate-500">
              Manage food items, categories, pricing and availability.
            </p>
          </div>

          <button
            onClick={openNewItem}
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-blue-700"
          >
            <Plus size={18} />
            Add Menu Item
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <StatCard
            title="Total Menu Items"
            value={menu.length}
            subtitle="Items listed in menu"
            icon={Utensils}
            color="blue"
          />
          <StatCard
            title="Available Items"
            value={availableCount}
            subtitle="Ready to order"
            icon={CheckCircle2}
            color="green"
          />
          <StatCard
            title="Unavailable Items"
            value={unavailableCount}
            subtitle="Currently not orderable"
            icon={AlertCircle}
            color="amber"
          />
          <StatCard
            title="Veg / Non-Veg"
            value={`${vegCount} / ${nonVegCount}`}
            subtitle="Menu item distribution"
            icon={Leaf}
            color="purple"
          />
        </div>

        {/* Category management */}
        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
          <div className="flex flex-col justify-between gap-3 lg:flex-row lg:items-center">
            <div>
              <h2 className="font-semibold text-slate-900">Menu Categories</h2>
              <p className="mt-1 text-xs text-slate-500">
                Select a category to filter the menu items.
              </p>
            </div>

            <form onSubmit={addCategory} className="flex gap-2">
              <input
                value={newCategory}
                onChange={(e) => setNewCategory(e.target.value)}
                placeholder="New category name"
                className="min-w-0 rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-blue-500"
              />
              <button
                type="submit"
                className="inline-flex shrink-0 items-center gap-1.5 rounded-lg border border-blue-200 bg-blue-50 px-3 py-2 text-sm font-semibold text-blue-700 hover:bg-blue-100"
              >
                <Plus size={15} />
                Add
              </button>
            </form>
          </div>

          <div className="mt-4 flex flex-wrap gap-2">
            {categories.map((category) => {
              const count =
                category === "All"
                  ? menu.length
                  : menu.filter((item) => item.category === category).length;

              return (
                <div key={category} className="group relative">
                  <button
                    onClick={() => setActiveCategory(category)}
                    className={`inline-flex items-center gap-2 rounded-lg border px-3 py-2 text-sm font-medium transition ${
                      activeCategory === category
                        ? "border-blue-600 bg-blue-600 text-white"
                        : "border-slate-200 bg-white text-slate-600 hover:border-blue-300 hover:text-blue-600"
                    }`}
                  >
                    {category}
                    <span
                      className={`rounded-full px-1.5 py-0.5 text-xs ${
                        activeCategory === category
                          ? "bg-white/20 text-white"
                          : "bg-slate-100 text-slate-500"
                      }`}
                    >
                      {count}
                    </span>
                  </button>

                  {category !== "All" && (
                    <button
                      title={`Delete ${category} category`}
                      onClick={() => removeCategory(category)}
                      className="absolute -right-1 -top-1 hidden rounded-full bg-red-500 p-1 text-white shadow group-hover:block"
                    >
                      <X size={10} />
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-col gap-3 rounded-xl border border-slate-200 bg-white p-4 shadow-sm lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h2 className="font-semibold text-slate-900">Food Items</h2>
            <p className="mt-1 text-xs text-slate-500">
              {filteredMenu.length} items matching your filters.
            </p>
          </div>

          <div className="flex flex-col gap-2 sm:flex-row">
            <div className="relative">
              <Search
                size={17}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
              />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search food items..."
                className="w-full rounded-lg border border-slate-200 py-2 pl-9 pr-3 text-sm outline-none focus:border-blue-500 sm:w-56"
              />
            </div>

            <div className="relative">
              <Filter
                size={15}
                className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
              />
              <select
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value)}
                className="w-full appearance-none rounded-lg border border-slate-200 bg-white py-2 pl-9 pr-8 text-sm outline-none focus:border-blue-500 sm:w-36"
              >
                <option value="All">All Food Types</option>
                <option value="Veg">Veg</option>
                <option value="Non-Veg">Non-Veg</option>
              </select>
            </div>

            <select
              value={availabilityFilter}
              onChange={(e) => setAvailabilityFilter(e.target.value)}
              className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:border-blue-500"
            >
              <option value="All">All Availability</option>
              <option value="Available">Available</option>
              <option value="Unavailable">Unavailable</option>
            </select>

            <button
              onClick={() => {
                setSearch("");
                setActiveCategory("All");
                setTypeFilter("All");
                setAvailabilityFilter("All");
              }}
              className="rounded-lg border border-slate-200 px-3 py-2 text-sm font-medium text-slate-600 hover:bg-slate-50"
            >
              Clear Filters
            </button>
          </div>
        </div>

        {/* Menu cards */}
        {filteredMenu.length === 0 ? (
          <div className="rounded-xl border border-slate-200 bg-white px-4 py-16 text-center">
            <Utensils size={36} className="mx-auto mb-3 text-slate-300" />
            <h3 className="font-semibold text-slate-800">No menu items found</h3>
            <p className="mt-1 text-sm text-slate-500">
              Try another search or add a new menu item.
            </p>
            <button
              onClick={openNewItem}
              className="mt-4 rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700"
            >
              Add Menu Item
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
            {filteredMenu.map((item) => (
              <div
                key={item.id}
                className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm transition hover:shadow-md"
              >
                {/* Image area */}
                <div className="relative flex h-40 items-center justify-center overflow-hidden bg-slate-100">
                  {item.image ? (
                    <img
                      src={item.image}
                      alt={item.name}
                      className="h-full w-full object-cover"
                      onError={(e) => {
                        e.currentTarget.style.display = "none";
                      }}
                    />
                  ) : (
                    <div className="flex flex-col items-center gap-2 text-slate-300">
                      <ImagePlus size={36} />
                      <span className="text-xs">No image added</span>
                    </div>
                  )}

                  <span
                    className={`absolute left-3 top-3 rounded-full px-2.5 py-1 text-xs font-semibold ${
                      item.type === "Veg"
                        ? "bg-emerald-50 text-emerald-700"
                        : "bg-red-50 text-red-700"
                    }`}
                  >
                    <span className="mr-1">●</span>
                    {item.type}
                  </span>

                  <span
                    className={`absolute right-3 top-3 rounded-full px-2.5 py-1 text-xs font-semibold ${
                      item.available
                        ? "bg-emerald-50 text-emerald-700"
                        : "bg-slate-800/80 text-white"
                    }`}
                  >
                    {item.available ? "Available" : "Unavailable"}
                  </span>
                </div>

                {/* Item content */}
                <div className="space-y-3 p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <p className="text-xs font-medium text-blue-600">
                        {item.category}
                      </p>
                      <h3 className="mt-1 truncate font-semibold text-slate-900">
                        {item.name}
                      </h3>
                    </div>
                    <p className="shrink-0 text-lg font-bold text-slate-900">
                      {currency(item.price)}
                    </p>
                  </div>

                  <p className="min-h-10 text-sm leading-5 text-slate-500">
                    {item.description || "No description added."}
                  </p>

                  <div className="flex items-center justify-between border-t border-slate-100 pt-3 text-xs text-slate-500">
                    <span className="inline-flex items-center gap-1">
                      <Clock size={14} />
                      {item.prepTime} min
                    </span>
                    <span className="inline-flex items-center gap-1">
                      <Tag size={14} />
                      {item.addons?.length || 0} add-ons
                    </span>
                  </div>

                  <div className="flex items-center justify-between gap-2 border-t border-slate-100 pt-3">
                    <button
                      onClick={() => toggleAvailability(item.id)}
                      className={`inline-flex items-center gap-1.5 text-xs font-semibold ${
                        item.available
                          ? "text-emerald-700 hover:text-emerald-800"
                          : "text-slate-500 hover:text-slate-700"
                      }`}
                    >
                      {item.available ? (
                        <ToggleRight size={21} />
                      ) : (
                        <ToggleLeft size={21} />
                      )}
                      {item.available ? "Enabled" : "Disabled"}
                    </button>

                    <div className="flex items-center gap-1">
                      <button
                        title="View item"
                        onClick={() => setViewItem(item)}
                        className="rounded-lg p-2 text-slate-500 hover:bg-blue-50 hover:text-blue-600"
                      >
                        <Eye size={16} />
                      </button>
                      <button
                        title="Edit item"
                        onClick={() => openEditItem(item)}
                        className="rounded-lg p-2 text-slate-500 hover:bg-amber-50 hover:text-amber-600"
                      >
                        <Pencil size={16} />
                      </button>
                      <button
                        title="Delete item"
                        onClick={() => deleteItem(item)}
                        className="rounded-lg p-2 text-slate-500 hover:bg-red-50 hover:text-red-600"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Add / Edit Menu Item Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 p-3">
          <div className="flex max-h-[95vh] w-full max-w-2xl flex-col overflow-hidden rounded-2xl bg-white shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4">
              <div>
                <h2 className="text-lg font-bold text-slate-900">
                  {editingId ? "Edit Menu Item" : "Add Menu Item"}
                </h2>
                <p className="mt-1 text-xs text-slate-500">
                  Enter food details, pricing and preparation information.
                </p>
              </div>
              <button
                onClick={closeModal}
                className="rounded-lg p-2 text-slate-500 hover:bg-slate-100"
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={saveItem} className="overflow-y-auto">
              <div className="space-y-5 p-5">
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <div className="md:col-span-2">
                    <label className="mb-1.5 block text-xs font-medium text-slate-600">
                      Food Item Name *
                    </label>
                    <input
                      required
                      value={form.name}
                      onChange={(e) => updateForm("name", e.target.value)}
                      placeholder="e.g. Paneer Butter Masala"
                      className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-blue-500"
                    />
                  </div>

                  <div>
                    <label className="mb-1.5 block text-xs font-medium text-slate-600">
                      Category *
                    </label>
                    <select
                      required
                      value={form.category}
                      onChange={(e) => updateForm("category", e.target.value)}
                      className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-blue-500"
                    >
                      {categories
                        .filter((category) => category !== "All")
                        .map((category) => (
                          <option key={category} value={category}>
                            {category}
                          </option>
                        ))}
                    </select>
                  </div>

                  <div>
                    <label className="mb-1.5 block text-xs font-medium text-slate-600">
                      Price (₹) *
                    </label>
                    <input
                      required
                      type="number"
                      min="0"
                      step="0.01"
                      value={form.price}
                      onChange={(e) => updateForm("price", e.target.value)}
                      placeholder="Enter price"
                      className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-blue-500"
                    />
                  </div>

                  <div>
                    <label className="mb-1.5 block text-xs font-medium text-slate-600">
                      Food Type
                    </label>
                    <select
                      value={form.type}
                      onChange={(e) => updateForm("type", e.target.value)}
                      className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-blue-500"
                    >
                      <option value="Veg">Vegetarian</option>
                      <option value="Non-Veg">Non-Vegetarian</option>
                    </select>
                  </div>

                  <div>
                    <label className="mb-1.5 block text-xs font-medium text-slate-600">
                      Preparation Time (minutes)
                    </label>
                    <input
                      type="number"
                      min="0"
                      value={form.prepTime}
                      onChange={(e) =>
                        updateForm("prepTime", e.target.value)
                      }
                      className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-blue-500"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="mb-1.5 block text-xs font-medium text-slate-600">
                      Description
                    </label>
                    <textarea
                      rows={3}
                      value={form.description}
                      onChange={(e) =>
                        updateForm("description", e.target.value)
                      }
                      placeholder="Describe the food item..."
                      className="w-full resize-none rounded-lg border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-blue-500"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="mb-1.5 block text-xs font-medium text-slate-600">
                      Food Image URL
                    </label>
                    <input
                      type="url"
                      value={form.image}
                      onChange={(e) => updateForm("image", e.target.value)}
                      placeholder="https://example.com/food-image.jpg"
                      className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-blue-500"
                    />
                    <p className="mt-1 text-xs text-slate-400">
                      Enter an image URL. Image upload can be connected with backend storage later.
                    </p>
                    {form.image && (
                      <img
                        src={form.image}
                        alt="Food preview"
                        className="mt-3 h-32 w-48 rounded-lg border border-slate-200 object-cover"
                        onError={(e) => {
                          e.currentTarget.style.display = "none";
                        }}
                      />
                    )}
                  </div>

                  <div className="md:col-span-2">
                    <label className="mb-1.5 block text-xs font-medium text-slate-600">
                      Add-ons
                    </label>
                    <input
                      value={form.addons}
                      onChange={(e) => updateForm("addons", e.target.value)}
                      placeholder="Extra cheese, Extra sauce, Raita"
                      className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-blue-500"
                    />
                    <p className="mt-1 text-xs text-slate-400">
                      Separate multiple add-ons with commas.
                    </p>
                  </div>

                  <div className="md:col-span-2">
                    <label className="mb-1.5 block text-xs font-medium text-slate-600">
                      Special Instructions
                    </label>
                    <textarea
                      rows={2}
                      value={form.instructions}
                      onChange={(e) =>
                        updateForm("instructions", e.target.value)
                      }
                      placeholder="e.g. Less spicy, no onion, serve hot..."
                      className="w-full resize-none rounded-lg border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-blue-500"
                    />
                  </div>
                </div>

                <label className="flex cursor-pointer items-center justify-between rounded-xl border border-slate-200 p-4">
                  <div>
                    <p className="text-sm font-semibold text-slate-800">
                      Item Availability
                    </p>
                    <p className="mt-1 text-xs text-slate-500">
                      Make this item available for new orders.
                    </p>
                  </div>
                  <input
                    type="checkbox"
                    checked={form.available}
                    onChange={(e) =>
                      updateForm("available", e.target.checked)
                    }
                    className="h-5 w-5 accent-blue-600"
                  />
                </label>
              </div>

              <div className="flex flex-col-reverse justify-end gap-2 border-t border-slate-200 bg-slate-50 px-5 py-4 sm:flex-row">
                <button
                  type="button"
                  onClick={closeModal}
                  className="rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-600 hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="inline-flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-blue-700"
                >
                  <CheckCircle2 size={16} />
                  {editingId ? "Update Item" : "Save Menu Item"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* View Menu Item Modal */}
      {viewItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 p-3">
          <div className="w-full max-w-lg overflow-hidden rounded-2xl bg-white shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4">
              <div>
                <h2 className="font-bold text-slate-900">Menu Item Details</h2>
                <p className="mt-1 text-xs text-slate-500">{viewItem.id}</p>
              </div>
              <button
                onClick={() => setViewItem(null)}
                className="rounded-lg p-2 text-slate-500 hover:bg-slate-100"
              >
                <X size={20} />
              </button>
            </div>

            <div className="space-y-4 p-5">
              {viewItem.image ? (
                <img
                  src={viewItem.image}
                  alt={viewItem.name}
                  className="h-48 w-full rounded-xl object-cover"
                />
              ) : (
                <div className="flex h-36 items-center justify-center rounded-xl bg-slate-100 text-slate-300">
                  <ImagePlus size={42} />
                </div>
              )}

              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-xs font-medium text-blue-600">
                    {viewItem.category}
                  </p>
                  <h3 className="mt-1 text-xl font-bold text-slate-900">
                    {viewItem.name}
                  </h3>
                </div>
                <p className="text-xl font-bold text-slate-900">
                  {currency(viewItem.price)}
                </p>
              </div>

              <p className="text-sm leading-6 text-slate-600">
                {viewItem.description || "No description available."}
              </p>

              <div className="grid grid-cols-2 gap-3">
                <div className="rounded-lg bg-slate-50 p-3">
                  <p className="text-xs text-slate-500">Food Type</p>
                  <p className="mt-1 text-sm font-semibold text-slate-800">
                    {viewItem.type}
                  </p>
                </div>
                <div className="rounded-lg bg-slate-50 p-3">
                  <p className="text-xs text-slate-500">Preparation Time</p>
                  <p className="mt-1 text-sm font-semibold text-slate-800">
                    {viewItem.prepTime} minutes
                  </p>
                </div>
              </div>

              <div>
                <p className="mb-2 text-xs font-semibold uppercase text-slate-500">
                  Add-ons
                </p>
                {viewItem.addons?.length ? (
                  <div className="flex flex-wrap gap-2">
                    {viewItem.addons.map((addon) => (
                      <span
                        key={addon}
                        className="rounded-full bg-blue-50 px-3 py-1.5 text-xs font-medium text-blue-700"
                      >
                        {addon}
                      </span>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-slate-400">No add-ons configured.</p>
                )}
              </div>

              {viewItem.instructions && (
                <div className="rounded-lg bg-amber-50 p-3 text-sm text-amber-800">
                  <strong>Special instructions:</strong> {viewItem.instructions}
                </div>
              )}

              <div className="flex items-center gap-2 text-sm">
                {viewItem.available ? (
                  <CheckCircle2 size={17} className="text-emerald-600" />
                ) : (
                  <AlertCircle size={17} className="text-amber-600" />
                )}
                <span className="font-medium text-slate-700">
                  {viewItem.available ? "Currently available" : "Currently unavailable"}
                </span>
              </div>
            </div>

            <div className="flex justify-end gap-2 border-t border-slate-200 px-5 py-4">
              <button
                onClick={() => {
                  const item = viewItem;
                  setViewItem(null);
                  openEditItem(item);
                }}
                className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700"
              >
                <Pencil size={15} />
                Edit Item
              </button>
              <button
                onClick={() => setViewItem(null)}
                className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-50"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
