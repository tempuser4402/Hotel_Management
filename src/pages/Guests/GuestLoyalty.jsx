
import React, { useEffect, useMemo, useState } from "react";
import {
  Award,
  Star,
  Crown,
  Gift,
  Coins,
  TrendingUp,
  Users,
  CalendarDays,
  Search,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ArrowUpDown,
  Plus,
  X,
  Check,
  Pencil,
  Eye,
  Download,
  Clock,
  History,
  Settings,
  Sparkles,
  TicketPercent,
  CircleDollarSign,
  AlertCircle,
  CheckCircle2,
  ArrowUpRight,
  ArrowDownRight,
  ShieldCheck,
  Wallet,
  Trash2,
} from "lucide-react";

/* -------------------- Demo Data -------------------- */

const initialMembers = [
  {
    id: "GST-001",
    name: "Rahul Sharma",
    email: "rahul.sharma@gmail.com",
    phone: "+91 98765 43210",
    tier: "Gold",
    points: 4250,
    lifetimePoints: 6800,
    earned: 1200,
    redeemed: 350,
    joined: "2025-06-12",
    expiry: "2027-06-12",
    status: "Active",
  },
  {
    id: "GST-002",
    name: "Priya Verma",
    email: "priya.verma@gmail.com",
    phone: "+91 98765 12345",
    tier: "Silver",
    points: 1850,
    lifetimePoints: 2600,
    earned: 800,
    redeemed: 200,
    joined: "2025-09-20",
    expiry: "2027-09-20",
    status: "Active",
  },
  {
    id: "GST-003",
    name: "Amit Kumar",
    email: "amit.kumar@gmail.com",
    phone: "+91 99887 77665",
    tier: "Platinum",
    points: 9200,
    lifetimePoints: 14500,
    earned: 2500,
    redeemed: 800,
    joined: "2024-11-05",
    expiry: "2026-12-05",
    status: "Active",
  },
  {
    id: "GST-004",
    name: "Sneha Gupta",
    email: "sneha.gupta@gmail.com",
    phone: "+91 98765 55555",
    tier: "Bronze",
    points: 450,
    lifetimePoints: 700,
    earned: 300,
    redeemed: 100,
    joined: "2026-03-15",
    expiry: "2027-03-15",
    status: "Active",
  },
  {
    id: "GST-005",
    name: "Vikram Singh",
    email: "vikram.singh@gmail.com",
    phone: "+91 98765 66666",
    tier: "Gold",
    points: 5100,
    lifetimePoints: 7400,
    earned: 1600,
    redeemed: 500,
    joined: "2025-04-10",
    expiry: "2027-04-10",
    status: "Active",
  },
  {
    id: "GST-006",
    name: "Neha Malhotra",
    email: "neha.malhotra@gmail.com",
    phone: "+91 98765 77777",
    tier: "Silver",
    points: 1250,
    lifetimePoints: 1900,
    earned: 650,
    redeemed: 150,
    joined: "2025-12-01",
    expiry: "2026-12-01",
    status: "Active",
  },
  {
    id: "GST-007",
    name: "Arjun Mehta",
    email: "arjun.mehta@gmail.com",
    phone: "+91 98765 88888",
    tier: "Bronze",
    points: 300,
    lifetimePoints: 500,
    earned: 200,
    redeemed: 50,
    joined: "2026-05-18",
    expiry: "2027-05-18",
    status: "Active",
  },
  {
    id: "GST-008",
    name: "Ananya Rao",
    email: "ananya.rao@gmail.com",
    phone: "+91 98765 99999",
    tier: "Platinum",
    points: 7800,
    lifetimePoints: 12000,
    earned: 2100,
    redeemed: 900,
    joined: "2024-10-22",
    expiry: "2026-11-20",
    status: "Active",
  },
];

const initialTransactions = [
  {
    id: "TXN-001",
    guestId: "GST-001",
    guestName: "Rahul Sharma",
    type: "Earned",
    points: 500,
    description: "Completed reservation - RES-1042",
    date: "2026-11-04",
    status: "Completed",
  },
  {
    id: "TXN-002",
    guestId: "GST-003",
    guestName: "Amit Kumar",
    type: "Redeemed",
    points: 800,
    description: "Free room upgrade reward",
    date: "2026-11-03",
    status: "Completed",
  },
  {
    id: "TXN-003",
    guestId: "GST-002",
    guestName: "Priya Verma",
    type: "Earned",
    points: 250,
    description: "Completed reservation - RES-1038",
    date: "2026-11-02",
    status: "Completed",
  },
  {
    id: "TXN-004",
    guestId: "GST-005",
    guestName: "Vikram Singh",
    type: "Earned",
    points: 400,
    description: "Completed reservation - RES-1031",
    date: "2026-10-30",
    status: "Completed",
  },
  {
    id: "TXN-005",
    guestId: "GST-004",
    guestName: "Sneha Gupta",
    type: "Redeemed",
    points: 100,
    description: "Restaurant discount coupon",
    date: "2026-10-28",
    status: "Completed",
  },
  {
    id: "TXN-006",
    guestId: "GST-006",
    guestName: "Neha Malhotra",
    type: "Earned",
    points: 300,
    description: "Completed reservation - RES-1025",
    date: "2026-10-25",
    status: "Completed",
  },
  {
    id: "TXN-007",
    guestId: "GST-008",
    guestName: "Ananya Rao",
    type: "Redeemed",
    points: 500,
    description: "Dining voucher",
    date: "2026-10-22",
    status: "Completed",
  },
];

const initialTiers = [
  {
    id: "BRONZE",
    name: "Bronze",
    minPoints: 0,
    multiplier: 1,
    color: "amber",
    benefits: ["Earn 1 point per ₹100", "Member-only offers", "Birthday reward"],
  },
  {
    id: "SILVER",
    name: "Silver",
    minPoints: 1000,
    multiplier: 1.25,
    color: "slate",
    benefits: ["Earn 1.25x points", "5% dining discount", "Priority check-in"],
  },
  {
    id: "GOLD",
    name: "Gold",
    minPoints: 3000,
    multiplier: 1.5,
    color: "yellow",
    benefits: ["Earn 1.5x points", "10% dining discount", "Complimentary welcome drink"],
  },
  {
    id: "PLATINUM",
    name: "Platinum",
    minPoints: 8000,
    multiplier: 2,
    color: "violet",
    benefits: ["Earn 2x points", "15% dining discount", "Room upgrade priority", "Late checkout"],
  },
];

const initialRewards = [
  {
    id: "RWD-001",
    name: "Restaurant Discount",
    description: "10% discount on restaurant bills",
    points: 500,
    category: "Dining",
    status: "Active",
    validity: "30 days",
  },
  {
    id: "RWD-002",
    name: "Free Breakfast",
    description: "Complimentary breakfast for one stay",
    points: 1000,
    category: "Dining",
    status: "Active",
    validity: "60 days",
  },
  {
    id: "RWD-003",
    name: "Room Upgrade",
    description: "One-category room upgrade, subject to availability",
    points: 2000,
    category: "Room",
    status: "Active",
    validity: "90 days",
  },
  {
    id: "RWD-004",
    name: "Late Checkout",
    description: "Complimentary late checkout",
    points: 750,
    category: "Service",
    status: "Active",
    validity: "30 days",
  },
  {
    id: "RWD-005",
    name: "Spa Voucher",
    description: "₹500 spa service voucher",
    points: 1500,
    category: "Wellness",
    status: "Inactive",
    validity: "60 days",
  },
];

const initialOffers = [
  {
    id: "OFF-001",
    title: "Double Points Weekend",
    description: "Earn 2x points on completed weekend stays.",
    type: "Bonus Points",
    value: "2x points",
    startDate: "2026-11-01",
    endDate: "2026-11-30",
    status: "Active",
  },
  {
    id: "OFF-002",
    title: "Welcome Bonus",
    description: "New members receive 200 bonus points.",
    type: "Welcome Bonus",
    value: "200 points",
    startDate: "2026-10-01",
    endDate: "2026-12-31",
    status: "Active",
  },
  {
    id: "OFF-003",
    title: "Festive Dining Offer",
    description: "Redeem points for special festive dining rewards.",
    type: "Discount",
    value: "15% off",
    startDate: "2026-10-15",
    endDate: "2026-11-15",
    status: "Expired",
  },
];

const initialConfig = {
  programName: "StayFlow Rewards",
  enabled: true,
  pointsPerAmount: 100,
  pointsPerBooking: 0,
  welcomeBonus: 200,
  minimumRedemption: 100,
  pointValue: 0.5,
  expiryMonths: 12,
  expiryEnabled: true,
  autoUpgrade: true,
  autoAward: true,
  allowPartialRedemption: true,
};

/* -------------------- Helpers -------------------- */

const formatDate = (date) => {
  if (!date) return "—";

  return new Date(date + "T00:00:00").toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

const formatPoints = (value) => Number(value || 0).toLocaleString("en-IN");

const getInitials = (name) =>
  name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

const tierStyles = {
  Bronze: "bg-orange-50 text-orange-700 border-orange-200",
  Silver: "bg-slate-100 text-slate-700 border-slate-200",
  Gold: "bg-yellow-50 text-yellow-700 border-yellow-200",
  Platinum: "bg-violet-50 text-violet-700 border-violet-200",
};

const getTierIcon = (tier, size = 15) => {
  const props = { size };

  if (tier === "Platinum") return <Crown {...props} />;
  if (tier === "Gold") return <Award {...props} />;
  if (tier === "Silver") return <ShieldCheck {...props} />;

  return <Star {...props} />;
};

/* -------------------- Main Page -------------------- */

const GuestLoyalty = () => {
  const [members, setMembers] = useState(initialMembers);
  const [transactions, setTransactions] = useState(initialTransactions);
  const [tiers, setTiers] = useState(initialTiers);
  const [rewards, setRewards] = useState(initialRewards);
  const [offers, setOffers] = useState(initialOffers);
  const [config, setConfig] = useState(initialConfig);

  const [activeTab, setActiveTab] = useState("members");
  const [search, setSearch] = useState("");
  const [tierFilter, setTierFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");
  const [transactionFilter, setTransactionFilter] = useState("All");
  const [sortBy, setSortBy] = useState("points");
  const [sortDirection, setSortDirection] = useState("desc");

  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);

  const [selectedMember, setSelectedMember] = useState(null);
  const [showPointsModal, setShowPointsModal] = useState(false);
  const [showRewardModal, setShowRewardModal] = useState(false);
  const [showTierModal, setShowTierModal] = useState(false);
  const [showOfferModal, setShowOfferModal] = useState(false);
  const [editingTier, setEditingTier] = useState(null);
  const [editingReward, setEditingReward] = useState(null);
  const [editingOffer, setEditingOffer] = useState(null);

  const [pointsForm, setPointsForm] = useState({
    guestId: "",
    type: "Earned",
    points: "",
    description: "",
  });

  const [rewardForm, setRewardForm] = useState({
    name: "",
    description: "",
    points: "",
    category: "Dining",
    status: "Active",
    validity: "30 days",
  });

  const [tierForm, setTierForm] = useState({
    name: "",
    minPoints: "",
    multiplier: "",
    benefits: "",
    color: "blue",
  });

  const [offerForm, setOfferForm] = useState({
    title: "",
    description: "",
    type: "Bonus Points",
    value: "",
    startDate: "",
    endDate: "",
    status: "Active",
  });

  const [successMessage, setSuccessMessage] = useState("");

  useEffect(() => {
    if (!successMessage) return;

    const timer = setTimeout(() => setSuccessMessage(""), 3500);
    return () => clearTimeout(timer);
  }, [successMessage]);

  useEffect(() => {
    setCurrentPage(1);
  }, [search, tierFilter, statusFilter, pageSize, activeTab]);

  /* -------------------- Statistics -------------------- */

  const stats = useMemo(() => {
    const totalPoints = members.reduce(
      (sum, member) => sum + member.points,
      0
    );

    const averagePoints = members.length
      ? Math.round(totalPoints / members.length)
      : 0;

    const expiringSoon = members.filter((member) => {
      const expiry = new Date(member.expiry + "T00:00:00");
      const today = new Date();
      const days = (expiry - today) / (1000 * 60 * 60 * 24);

      return days >= 0 && days <= 60;
    }).length;

    const totalEarned = transactions
      .filter((transaction) => transaction.type === "Earned")
      .reduce((sum, transaction) => sum + transaction.points, 0);

    const totalRedeemed = transactions
      .filter((transaction) => transaction.type === "Redeemed")
      .reduce((sum, transaction) => sum + transaction.points, 0);

    return {
      members: members.length,
      totalPoints,
      averagePoints,
      expiringSoon,
      totalEarned,
      totalRedeemed,
    };
  }, [members, transactions]);

  const tierDistribution = useMemo(
    () =>
      tiers.map((tier) => ({
        ...tier,
        count: members.filter((member) => member.tier === tier.name).length,
      })),
    [tiers, members]
  );

  /* -------------------- Filtering -------------------- */

  const filteredMembers = useMemo(() => {
    let result = members.filter((member) => {
      const query = search.toLowerCase();

      const matchesSearch =
        member.name.toLowerCase().includes(query) ||
        member.email.toLowerCase().includes(query) ||
        member.id.toLowerCase().includes(query) ||
        member.phone.toLowerCase().includes(query);

      const matchesTier =
        tierFilter === "All" || member.tier === tierFilter;

      const matchesStatus =
        statusFilter === "All" || member.status === statusFilter;

      return matchesSearch && matchesTier && matchesStatus;
    });

    result.sort((a, b) => {
      let first;
      let second;

      if (sortBy === "name") {
        first = a.name.toLowerCase();
        second = b.name.toLowerCase();
      } else if (sortBy === "expiry") {
        first = a.expiry;
        second = b.expiry;
      } else {
        first = a.points;
        second = b.points;
      }

      if (first < second) return sortDirection === "asc" ? -1 : 1;
      if (first > second) return sortDirection === "asc" ? 1 : -1;
      return 0;
    });

    return result;
  }, [members, search, tierFilter, statusFilter, sortBy, sortDirection]);

  const totalPages = Math.max(1, Math.ceil(filteredMembers.length / pageSize));

  const paginatedMembers = filteredMembers.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  const filteredTransactions = useMemo(() => {
    return transactions.filter((transaction) => {
      const query = search.toLowerCase();

      const matchesSearch =
        transaction.guestName.toLowerCase().includes(query) ||
        transaction.guestId.toLowerCase().includes(query) ||
        transaction.description.toLowerCase().includes(query) ||
        transaction.id.toLowerCase().includes(query);

      const matchesType =
        transactionFilter === "All" ||
        transaction.type === transactionFilter;

      return matchesSearch && matchesType;
    });
  }, [transactions, search, transactionFilter]);

  /* -------------------- Actions -------------------- */

  const showMessage = (message) => setSuccessMessage(message);

  const changeSort = (field) => {
    if (sortBy === field) {
      setSortDirection((previous) =>
        previous === "asc" ? "desc" : "asc"
      );
    } else {
      setSortBy(field);
      setSortDirection("desc");
    }
  };

  const openPointsModal = (member = null) => {
    setPointsForm({
      guestId: member?.id || "",
      type: "Earned",
      points: "",
      description: "",
    });
    setShowPointsModal(true);
  };

  const savePoints = (event) => {
    event.preventDefault();

    const points = Number(pointsForm.points);

    if (!pointsForm.guestId || !points || points <= 0) {
      showMessage("Select a guest and enter valid points.");
      return;
    }

    const member = members.find((item) => item.id === pointsForm.guestId);
    if (!member) return;

    if (pointsForm.type === "Redeemed" && member.points < points) {
      showMessage("Guest does not have enough points.");
      return;
    }

    const newBalance =
      pointsForm.type === "Earned"
        ? member.points + points
        : member.points - points;

    setMembers((previous) =>
      previous.map((item) =>
        item.id === member.id
          ? {
              ...item,
              points: newBalance,
              lifetimePoints:
                pointsForm.type === "Earned"
                  ? item.lifetimePoints + points
                  : item.lifetimePoints,
              earned:
                pointsForm.type === "Earned"
                  ? item.earned + points
                  : item.earned,
              redeemed:
                pointsForm.type === "Redeemed"
                  ? item.redeemed + points
                  : item.redeemed,
            }
          : item
      )
    );

    setTransactions((previous) => [
      {
        id: `TXN-${String(Date.now()).slice(-6)}`,
        guestId: member.id,
        guestName: member.name,
        type: pointsForm.type,
        points,
        description:
          pointsForm.description.trim() ||
          (pointsForm.type === "Earned"
            ? "Manual points credit"
            : "Manual points redemption"),
        date: new Date().toISOString().slice(0, 10),
        status: "Completed",
      },
      ...previous,
    ]);

    setShowPointsModal(false);
    showMessage(
      `${formatPoints(points)} points ${
        pointsForm.type === "Earned" ? "credited to" : "redeemed from"
      } ${member.name}.`
    );
  };

  const redeemReward = (member, reward) => {
    if (member.points < reward.points) {
      showMessage(`${member.name} does not have enough points.`);
      return;
    }

    const confirmed = window.confirm(
      `Redeem ${reward.name} for ${formatPoints(reward.points)} points from ${member.name}?`
    );

    if (!confirmed) return;

    setMembers((previous) =>
      previous.map((item) =>
        item.id === member.id
          ? {
              ...item,
              points: item.points - reward.points,
              redeemed: item.redeemed + reward.points,
            }
          : item
      )
    );

    setTransactions((previous) => [
      {
        id: `TXN-${String(Date.now()).slice(-6)}`,
        guestId: member.id,
        guestName: member.name,
        type: "Redeemed",
        points: reward.points,
        description: `Reward redeemed: ${reward.name}`,
        date: new Date().toISOString().slice(0, 10),
        status: "Completed",
      },
      ...previous,
    ]);

    setSelectedMember(null);
    showMessage(`${reward.name} redeemed successfully.`);
  };

  const saveTier = (event) => {
    event.preventDefault();

    if (
      !tierForm.name.trim() ||
      tierForm.minPoints === "" ||
      Number(tierForm.minPoints) < 0 ||
      Number(tierForm.multiplier) <= 0
    ) {
      showMessage("Enter valid membership tier details.");
      return;
    }

    const tierData = {
      id: editingTier?.id || `TIER-${Date.now()}`,
      name: tierForm.name.trim(),
      minPoints: Number(tierForm.minPoints),
      multiplier: Number(tierForm.multiplier),
      color: tierForm.color,
      benefits: tierForm.benefits
        .split("\n")
        .map((item) => item.trim())
        .filter(Boolean),
    };

    setTiers((previous) =>
      editingTier
        ? previous.map((tier) =>
            tier.id === editingTier.id ? tierData : tier
          )
        : [...previous, tierData]
    );

    setShowTierModal(false);
    setEditingTier(null);
    showMessage("Membership tier saved successfully.");
  };

  const editTier = (tier) => {
    setEditingTier(tier);
    setTierForm({
      name: tier.name,
      minPoints: String(tier.minPoints),
      multiplier: String(tier.multiplier),
      benefits: tier.benefits.join("\n"),
      color: tier.color,
    });
    setShowTierModal(true);
  };

  const saveReward = (event) => {
    event.preventDefault();

    if (
      !rewardForm.name.trim() ||
      !rewardForm.points ||
      Number(rewardForm.points) <= 0
    ) {
      showMessage("Enter a reward name and valid points.");
      return;
    }

    const rewardData = {
      ...rewardForm,
      id: editingReward?.id || `RWD-${Date.now()}`,
      points: Number(rewardForm.points),
    };

    setRewards((previous) =>
      editingReward
        ? previous.map((reward) =>
            reward.id === editingReward.id ? rewardData : reward
          )
        : [...previous, rewardData]
    );

    setShowRewardModal(false);
    setEditingReward(null);
    showMessage("Reward saved successfully.");
  };

  const editReward = (reward) => {
    setEditingReward(reward);
    setRewardForm({
      name: reward.name,
      description: reward.description,
      points: String(reward.points),
      category: reward.category,
      status: reward.status,
      validity: reward.validity,
    });
    setShowRewardModal(true);
  };

  const toggleRewardStatus = (id) => {
    setRewards((previous) =>
      previous.map((reward) =>
        reward.id === id
          ? {
              ...reward,
              status: reward.status === "Active" ? "Inactive" : "Active",
            }
          : reward
      )
    );
  };

  const saveOffer = (event) => {
    event.preventDefault();

    if (
      !offerForm.title.trim() ||
      !offerForm.startDate ||
      !offerForm.endDate ||
      offerForm.endDate < offerForm.startDate
    ) {
      showMessage("Enter a title and valid offer dates.");
      return;
    }

    const offerData = {
      ...offerForm,
      id: editingOffer?.id || `OFF-${Date.now()}`,
    };

    setOffers((previous) =>
      editingOffer
        ? previous.map((offer) =>
            offer.id === editingOffer.id ? offerData : offer
          )
        : [...previous, offerData]
    );

    setShowOfferModal(false);
    setEditingOffer(null);
    showMessage("Offer saved successfully.");
  };

  const editOffer = (offer) => {
    setEditingOffer(offer);
    setOfferForm({
      title: offer.title,
      description: offer.description,
      type: offer.type,
      value: offer.value,
      startDate: offer.startDate,
      endDate: offer.endDate,
      status: offer.status,
    });
    setShowOfferModal(true);
  };

  const saveConfiguration = (event) => {
    event.preventDefault();

    if (
      Number(config.pointsPerAmount) <= 0 ||
      Number(config.minimumRedemption) < 0 ||
      Number(config.pointValue) <= 0 ||
      Number(config.expiryMonths) <= 0
    ) {
      showMessage("Please enter valid loyalty program settings.");
      return;
    }

    showMessage("Loyalty program configuration saved.");
  };

  const exportMembers = () => {
    const headers = [
      "Guest ID",
      "Guest Name",
      "Email",
      "Phone",
      "Membership Tier",
      "Available Points",
      "Lifetime Points",
      "Points Earned",
      "Points Redeemed",
      "Joined Date",
      "Membership Expiry",
      "Status",
    ];

    const escapeCSV = (value) =>
      `"${String(value ?? "").replace(/"/g, '""')}"`;

    const rows = filteredMembers.map((member) => [
      member.id,
      member.name,
      member.email,
      member.phone,
      member.tier,
      member.points,
      member.lifetimePoints,
      member.earned,
      member.redeemed,
      member.joined,
      member.expiry,
      member.status,
    ]);

    const csv = [
      headers.map(escapeCSV).join(","),
      ...rows.map((row) => row.map(escapeCSV).join(",")),
    ].join("\n");

    const blob = new Blob([csv], {
      type: "text/csv;charset=utf-8;",
    });

    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "stayflow-loyalty-members.csv";
    link.click();
    URL.revokeObjectURL(url);
  };

  const clearFilters = () => {
    setSearch("");
    setTierFilter("All");
    setStatusFilter("All");
    setTransactionFilter("All");
  };

  const openNewTier = () => {
    setEditingTier(null);
    setTierForm({
      name: "",
      minPoints: "",
      multiplier: "1",
      benefits: "",
      color: "blue",
    });
    setShowTierModal(true);
  };

  const openNewReward = () => {
    setEditingReward(null);
    setRewardForm({
      name: "",
      description: "",
      points: "",
      category: "Dining",
      status: "Active",
      validity: "30 days",
    });
    setShowRewardModal(true);
  };

  const openNewOffer = () => {
    setEditingOffer(null);
    setOfferForm({
      title: "",
      description: "",
      type: "Bonus Points",
      value: "",
      startDate: "",
      endDate: "",
      status: "Active",
    });
    setShowOfferModal(true);
  };

  /* -------------------- Page UI -------------------- */

  return (
    <div className="min-h-screen bg-slate-50 p-4 md:p-6 lg:p-7 space-y-6">

      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2 text-sm text-slate-500">
            <Users size={16} />
            <span>Guests</span>
            <span>/</span>
            <span className="text-slate-800">Loyalty Program</span>
          </div>

          <h1 className="mt-2 text-2xl font-bold tracking-tight text-slate-900">
            Loyalty Program
          </h1>

          <p className="mt-1 text-sm text-slate-500">
            Manage memberships, reward points, redemption rules, and guest benefits.
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          <button
            onClick={exportMembers}
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 shadow-sm hover:bg-slate-50"
          >
            <Download size={16} />
            Export Members
          </button>

          <button
            onClick={() => openPointsModal()}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700"
          >
            <Plus size={16} />
            Adjust Points
          </button>
        </div>
      </div>

      {/* Success Message */}
      {successMessage && (
        <div className="flex items-center justify-between gap-3 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
          <div className="flex items-center gap-2">
            <CheckCircle2 size={17} />
            {successMessage}
          </div>
          <button onClick={() => setSuccessMessage("")}>
            <X size={16} />
          </button>
        </div>
      )}

      {/* Statistics */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          title="Loyalty Members"
          value={stats.members}
          subtitle="Registered program members"
          icon={<Users size={20} />}
          color="blue"
        />

        <StatCard
          title="Points in Circulation"
          value={formatPoints(stats.totalPoints)}
          subtitle="Current available guest points"
          icon={<Coins size={20} />}
          color="violet"
        />

        <StatCard
          title="Points Earned"
          value={formatPoints(stats.totalEarned)}
          subtitle="From recorded transactions"
          icon={<TrendingUp size={20} />}
          color="emerald"
        />

        <StatCard
          title="Expiring Soon"
          value={stats.expiringSoon}
          subtitle="Memberships expiring within 60 days"
          icon={<Clock size={20} />}
          color="amber"
        />
      </div>

      {/* Program Status Banner */}
      <div className="flex flex-col gap-4 rounded-2xl border border-blue-100 bg-gradient-to-r from-blue-50 to-indigo-50 p-5 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-start gap-3">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white text-blue-600 shadow-sm">
            <Award size={23} />
          </div>

          <div>
            <div className="flex flex-wrap items-center gap-2">
              <h2 className="font-bold text-slate-900">
                {config.programName}
              </h2>
              <span
                className={`rounded-full px-2.5 py-1 text-xs font-semibold ${
                  config.enabled
                    ? "bg-emerald-100 text-emerald-700"
                    : "bg-slate-200 text-slate-600"
                }`}
              >
                {config.enabled ? "Program Active" : "Program Paused"}
              </span>
            </div>

            <p className="mt-1 text-sm text-slate-600">
              Members earn {config.pointsPerAmount} point(s) for every ₹
              {Number(config.pointsPerAmount) > 0
                ? formatPoints(config.pointsPerAmount)
                : "100"}{" "}
              spent on eligible completed reservations.
            </p>
          </div>
        </div>

        <button
          onClick={() => setActiveTab("settings")}
          className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl border border-blue-200 bg-white px-4 py-2.5 text-sm font-semibold text-blue-700 transition hover:bg-blue-100"
        >
          <Settings size={16} />
          Program Settings
        </button>
      </div>

      {/* Tier Distribution */}
      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="font-semibold text-slate-900">
              Membership Levels
            </h2>
            <p className="mt-1 text-xs text-slate-500">
              Guest distribution across loyalty tiers
            </p>
          </div>

          <button
            onClick={() => setActiveTab("tiers")}
            className="inline-flex items-center gap-2 text-sm font-semibold text-blue-600 hover:text-blue-700"
          >
            Manage Levels
            <ArrowUpRight size={15} />
          </button>
        </div>

        <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
          {tierDistribution.map((tier) => (
            <div
              key={tier.id}
              className="rounded-xl border border-slate-200 p-4 transition hover:border-blue-200 hover:shadow-sm"
            >
              <div className="flex items-center justify-between">
                <TierBadge tier={tier.name} />
                <span className="text-xs text-slate-400">
                  {tier.multiplier}x points
                </span>
              </div>

              <p className="mt-4 text-2xl font-bold text-slate-900">
                {tier.count}
              </p>

              <p className="mt-0.5 text-xs text-slate-500">
                Members in this level
              </p>

              <p className="mt-3 text-xs font-medium text-slate-600">
                {formatPoints(tier.minPoints)} lifetime points required
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Main Tabs */}
      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="overflow-x-auto border-b border-slate-100">
          <div className="flex min-w-max gap-1 px-4 pt-2">
            {[
              { id: "members", label: "Guest Members", icon: Users },
              { id: "transactions", label: "Points History", icon: History },
              { id: "tiers", label: "Membership Levels", icon: Crown },
              { id: "rewards", label: "Rewards & Redemption", icon: Gift },
              { id: "offers", label: "Benefits & Offers", icon: TicketPercent },
              { id: "settings", label: "Program Settings", icon: Settings },
            ].map((tab) => {
              const Icon = tab.icon;

              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`inline-flex items-center gap-2 border-b-2 px-4 py-3 text-sm font-medium transition ${
                    activeTab === tab.id
                      ? "border-blue-600 text-blue-600"
                      : "border-transparent text-slate-500 hover:text-slate-800"
                  }`}
                >
                  <Icon size={16} />
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Guest Members */}
        {activeTab === "members" && (
          <div>
            <div className="flex flex-col gap-4 p-5">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <h2 className="font-semibold text-slate-900">
                    Loyalty Members
                  </h2>
                  <p className="mt-1 text-sm text-slate-500">
                    View guest membership levels and available points.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 xl:grid-cols-4">
                <div className="relative sm:col-span-2">
                  <Search
                    size={16}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                  />
                  <input
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Search guest, email, phone, or ID..."
                    className="w-full rounded-xl border border-slate-200 py-2.5 pl-9 pr-3 text-sm outline-none focus:border-blue-400 focus:ring-4 focus:ring-blue-50"
                  />
                </div>

                <FilterSelect
                  value={tierFilter}
                  onChange={setTierFilter}
                  options={["All", ...tiers.map((tier) => tier.name)]}
                  allLabel="All Membership Levels"
                />

                <FilterSelect
                  value={statusFilter}
                  onChange={setStatusFilter}
                  options={["All", "Active", "Inactive", "Expired"]}
                  allLabel="All Member Statuses"
                />
              </div>

              {(search || tierFilter !== "All" || statusFilter !== "All") && (
                <div className="flex items-center justify-between">
                  <p className="text-xs text-slate-500">
                    {filteredMembers.length} matching members
                  </p>
                  <button
                    onClick={clearFilters}
                    className="text-xs font-semibold text-blue-600"
                  >
                    Clear filters
                  </button>
                </div>
              )}
            </div>

            <div className="overflow-x-auto">
              <table className="w-full min-w-[1000px] text-left">
                <thead className="bg-slate-50">
                  <tr className="border-y border-slate-100">
                    <TableHeader>Guest</TableHeader>
                    <TableHeader>Membership</TableHeader>
                    <TableHeader>
                      <button
                        onClick={() => changeSort("points")}
                        className="inline-flex items-center gap-1"
                      >
                        Available Points <ArrowUpDown size={13} />
                      </button>
                    </TableHeader>
                    <TableHeader>Lifetime Points</TableHeader>
                    <TableHeader>
                      <button
                        onClick={() => changeSort("expiry")}
                        className="inline-flex items-center gap-1"
                      >
                        Expiry Date <ArrowUpDown size={13} />
                      </button>
                    </TableHeader>
                    <TableHeader>Status</TableHeader>
                    <TableHeader align="right">Actions</TableHeader>
                  </tr>
                </thead>

                <tbody className="divide-y divide-slate-100">
                  {paginatedMembers.map((member) => (
                    <tr key={member.id} className="hover:bg-slate-50/70">
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          <Avatar name={member.name} />
                          <div>
                            <p className="text-sm font-semibold text-slate-800">
                              {member.name}
                            </p>
                            <p className="mt-0.5 text-xs text-slate-400">
                              {member.id}
                            </p>
                            <p className="mt-0.5 text-xs text-slate-500">
                              {member.email}
                            </p>
                          </div>
                        </div>
                      </td>

                      <td className="px-4 py-4">
                        <TierBadge tier={member.tier} />
                      </td>

                      <td className="px-4 py-4">
                        <div className="flex items-center gap-1.5">
                          <Coins size={15} className="text-amber-500" />
                          <span className="text-sm font-bold text-slate-800">
                            {formatPoints(member.points)}
                          </span>
                        </div>
                      </td>

                      <td className="px-4 py-4 text-sm text-slate-600">
                        {formatPoints(member.lifetimePoints)}
                      </td>

                      <td className="px-4 py-4">
                        <ExpiryLabel date={member.expiry} />
                      </td>

                      <td className="px-4 py-4">
                        <StatusBadge status={member.status} />
                      </td>

                      <td className="px-4 py-4">
                        <div className="flex justify-end gap-2">
                          <button
                            onClick={() => setSelectedMember(member)}
                            title="View member"
                            className="rounded-lg border border-slate-200 p-2 text-slate-500 hover:bg-blue-50 hover:text-blue-600"
                          >
                            <Eye size={15} />
                          </button>

                          <button
                            onClick={() => openPointsModal(member)}
                            title="Adjust points"
                            className="rounded-lg border border-slate-200 p-2 text-slate-500 hover:bg-blue-50 hover:text-blue-600"
                          >
                            <Coins size={15} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}

                  {paginatedMembers.length === 0 && (
                    <EmptyTable
                      colSpan={7}
                      title="No loyalty members found"
                      description="Try changing your search or filters."
                    />
                  )}
                </tbody>
              </table>
            </div>

            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              pageSize={pageSize}
              total={filteredMembers.length}
              onPageChange={setCurrentPage}
              onPageSizeChange={setPageSize}
            />
          </div>
        )}

        {/* Points History */}
        {activeTab === "transactions" && (
          <div>
            <div className="flex flex-col gap-4 p-5">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <h2 className="font-semibold text-slate-900">
                    Points Transaction History
                  </h2>
                  <p className="mt-1 text-sm text-slate-500">
                    Track points earned and redeemed by guests.
                  </p>
                </div>

                <button
                  onClick={() => openPointsModal()}
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-blue-700"
                >
                  <Plus size={16} />
                  New Transaction
                </button>
              </div>

              <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
                <div className="relative sm:col-span-2">
                  <Search
                    size={16}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                  />
                  <input
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Search guest, transaction, or description..."
                    className="w-full rounded-xl border border-slate-200 py-2.5 pl-9 pr-3 text-sm outline-none focus:border-blue-400 focus:ring-4 focus:ring-blue-50"
                  />
                </div>

                <FilterSelect
                  value={transactionFilter}
                  onChange={setTransactionFilter}
                  options={["All", "Earned", "Redeemed"]}
                  allLabel="All Transactions"
                />
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full min-w-[850px] text-left">
                <thead className="bg-slate-50">
                  <tr className="border-y border-slate-100">
                    <TableHeader>Transaction</TableHeader>
                    <TableHeader>Guest</TableHeader>
                    <TableHeader>Type</TableHeader>
                    <TableHeader>Points</TableHeader>
                    <TableHeader>Date</TableHeader>
                    <TableHeader>Status</TableHeader>
                  </tr>
                </thead>

                <tbody className="divide-y divide-slate-100">
                  {filteredTransactions.map((transaction) => (
                    <tr key={transaction.id} className="hover:bg-slate-50/70">
                      <td className="px-5 py-4">
                        <p className="text-sm font-semibold text-slate-800">
                          {transaction.id}
                        </p>
                        <p className="mt-1 text-xs text-slate-500">
                          {transaction.description}
                        </p>
                      </td>

                      <td className="px-4 py-4">
                        <p className="text-sm font-medium text-slate-700">
                          {transaction.guestName}
                        </p>
                        <p className="mt-0.5 text-xs text-slate-400">
                          {transaction.guestId}
                        </p>
                      </td>

                      <td className="px-4 py-4">
                        <TransactionBadge type={transaction.type} />
                      </td>

                      <td className="px-4 py-4">
                        <span
                          className={`text-sm font-bold ${
                            transaction.type === "Earned"
                              ? "text-emerald-600"
                              : "text-rose-600"
                          }`}
                        >
                          {transaction.type === "Earned" ? "+" : "-"}
                          {formatPoints(transaction.points)}
                        </span>
                      </td>

                      <td className="px-4 py-4 text-sm text-slate-500">
                        {formatDate(transaction.date)}
                      </td>

                      <td className="px-4 py-4">
                        <StatusBadge status={transaction.status} />
                      </td>
                    </tr>
                  ))}

                  {filteredTransactions.length === 0 && (
                    <EmptyTable
                      colSpan={6}
                      title="No transactions found"
                      description="There are no matching points transactions."
                    />
                  )}
                </tbody>
              </table>
            </div>

            <div className="border-t border-slate-100 px-5 py-4 text-xs text-slate-500">
              Showing {filteredTransactions.length} transaction records
            </div>
          </div>
        )}

        {/* Membership Levels */}
        {activeTab === "tiers" && (
          <div className="p-5">
            <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h2 className="font-semibold text-slate-900">
                  Membership Level Configuration
                </h2>
                <p className="mt-1 text-sm text-slate-500">
                  Configure tier requirements, earning multipliers, and benefits.
                </p>
              </div>

              <button
                onClick={openNewTier}
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-blue-700"
              >
                <Plus size={16} />
                Add Membership Level
              </button>
            </div>

            <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
              {tiers.map((tier) => (
                <div
                  key={tier.id}
                  className="rounded-2xl border border-slate-200 p-5 transition hover:shadow-sm"
                >
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <TierBadge tier={tier.name} />
                    <button
                      onClick={() => editTier(tier)}
                      className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 px-3 py-2 text-xs font-medium text-slate-600 hover:bg-slate-50"
                    >
                      <Pencil size={13} />
                      Edit Level
                    </button>
                  </div>

                  <div className="mt-4 grid grid-cols-2 gap-3">
                    <div className="rounded-xl bg-slate-50 p-3">
                      <p className="text-xs text-slate-500">
                        Minimum Lifetime Points
                      </p>
                      <p className="mt-1 text-lg font-bold text-slate-900">
                        {formatPoints(tier.minPoints)}
                      </p>
                    </div>

                    <div className="rounded-xl bg-slate-50 p-3">
                      <p className="text-xs text-slate-500">
                        Earning Multiplier
                      </p>
                      <p className="mt-1 text-lg font-bold text-slate-900">
                        {tier.multiplier}x
                      </p>
                    </div>
                  </div>

                  <div className="mt-4">
                    <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-400">
                      Membership Benefits
                    </p>
                    <div className="space-y-2">
                      {tier.benefits.map((benefit, index) => (
                        <div
                          key={index}
                          className="flex items-start gap-2 text-sm text-slate-600"
                        >
                          <CheckCircle2
                            size={15}
                            className="mt-0.5 shrink-0 text-emerald-500"
                          />
                          {benefit}
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="mt-4 border-t border-slate-100 pt-3 text-xs text-slate-500">
                    {members.filter((member) => member.tier === tier.name).length}{" "}
                    current members
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Rewards */}
        {activeTab === "rewards" && (
          <div className="p-5">
            <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h2 className="font-semibold text-slate-900">
                  Rewards & Redemption
                </h2>
                <p className="mt-1 text-sm text-slate-500">
                  Configure rewards that guests can redeem using loyalty points.
                </p>
              </div>

              <button
                onClick={openNewReward}
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-blue-700"
              >
                <Plus size={16} />
                Add Reward
              </button>
            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
              {rewards.map((reward) => (
                <div
                  key={reward.id}
                  className="flex flex-col rounded-2xl border border-slate-200 p-5 transition hover:shadow-sm"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-violet-50 text-violet-600">
                      <Gift size={21} />
                    </div>

                    <StatusBadge status={reward.status} />
                  </div>

                  <h3 className="mt-4 font-semibold text-slate-900">
                    {reward.name}
                  </h3>

                  <p className="mt-1 min-h-10 text-sm leading-5 text-slate-500">
                    {reward.description}
                  </p>

                  <div className="mt-4 flex items-center justify-between gap-2">
                    <div>
                      <p className="text-xs text-slate-400">Required points</p>
                      <p className="mt-1 flex items-center gap-1 text-lg font-bold text-slate-900">
                        <Coins size={16} className="text-amber-500" />
                        {formatPoints(reward.points)}
                      </p>
                    </div>

                    <span className="rounded-lg bg-slate-100 px-2.5 py-1.5 text-xs font-medium text-slate-600">
                      {reward.category}
                    </span>
                  </div>

                  <div className="mt-3 text-xs text-slate-400">
                    Validity: {reward.validity}
                  </div>

                  <div className="mt-4 flex gap-2 border-t border-slate-100 pt-4">
                    <button
                      onClick={() => editReward(reward)}
                      className="inline-flex flex-1 items-center justify-center gap-1.5 rounded-lg border border-slate-200 px-3 py-2 text-xs font-medium text-slate-600 hover:bg-slate-50"
                    >
                      <Pencil size={13} />
                      Edit
                    </button>

                    <button
                      onClick={() => toggleRewardStatus(reward.id)}
                      className={`flex-1 rounded-lg px-3 py-2 text-xs font-semibold ${
                        reward.status === "Active"
                          ? "bg-rose-50 text-rose-600 hover:bg-rose-100"
                          : "bg-emerald-50 text-emerald-600 hover:bg-emerald-100"
                      }`}
                    >
                      {reward.status === "Active" ? "Deactivate" : "Activate"}
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-6 rounded-xl border border-blue-100 bg-blue-50 p-4">
              <div className="flex items-start gap-3">
                <AlertCircle
                  size={18}
                  className="mt-0.5 shrink-0 text-blue-600"
                />
                <div>
                  <p className="text-sm font-semibold text-blue-900">
                    Reward redemption
                  </p>
                  <p className="mt-1 text-xs leading-5 text-blue-700">
                    Open a guest's profile from the Guest Members tab to
                    redeem an available reward against their points balance.
                    Redemption is deducted from the guest's available points.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Offers */}
        {activeTab === "offers" && (
          <div className="p-5">
            <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h2 className="font-semibold text-slate-900">
                  Benefits & Special Offers
                </h2>
                <p className="mt-1 text-sm text-slate-500">
                  Create promotional offers and special loyalty benefits.
                </p>
              </div>

              <button
                onClick={openNewOffer}
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-blue-700"
              >
                <Plus size={16} />
                Create Offer
              </button>
            </div>

            <div className="space-y-3">
              {offers.map((offer) => (
                <div
                  key={offer.id}
                  className="flex flex-col gap-4 rounded-xl border border-slate-200 p-4 sm:flex-row sm:items-center sm:justify-between"
                >
                  <div className="flex min-w-0 items-start gap-3">
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                      <Sparkles size={20} />
                    </div>

                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <h3 className="font-semibold text-slate-900">
                          {offer.title}
                        </h3>
                        <StatusBadge status={offer.status} />
                      </div>

                      <p className="mt-1 text-sm text-slate-500">
                        {offer.description}
                      </p>

                      <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-xs text-slate-400">
                        <span>{offer.type}</span>
                        <span>{offer.value}</span>
                        <span>
                          {formatDate(offer.startDate)} –{" "}
                          {formatDate(offer.endDate)}
                        </span>
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => editOffer(offer)}
                    className="inline-flex shrink-0 items-center justify-center gap-1.5 rounded-lg border border-slate-200 px-3 py-2 text-xs font-medium text-slate-600 hover:bg-slate-50"
                  >
                    <Pencil size={13} />
                    Edit Offer
                  </button>
                </div>
              ))}

              {offers.length === 0 && (
                <div className="py-12 text-center text-sm text-slate-500">
                  No offers created yet.
                </div>
              )}
            </div>
          </div>
        )}

        {/* Program Settings */}
        {activeTab === "settings" && (
          <form onSubmit={saveConfiguration} className="p-5">
            <div className="mb-6">
              <h2 className="font-semibold text-slate-900">
                Loyalty Program Configuration
              </h2>
              <p className="mt-1 text-sm text-slate-500">
                Control how guests earn, redeem, and maintain loyalty points.
              </p>
            </div>

            <div className="space-y-6">
              <SettingsSection
                title="Program Details"
                description="Configure the main loyalty program."
              >
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <FormField label="Program Name">
                    <input
                      value={config.programName}
                      onChange={(e) =>
                        setConfig({
                          ...config,
                          programName: e.target.value,
                        })
                      }
                      required
                      className={inputClass}
                    />
                  </FormField>

                  <FormField label="Program Status">
                    <select
                      value={config.enabled ? "Active" : "Paused"}
                      onChange={(e) =>
                        setConfig({
                          ...config,
                          enabled: e.target.value === "Active",
                        })
                      }
                      className={inputClass}
                    >
                      <option value="Active">Active</option>
                      <option value="Paused">Paused</option>
                    </select>
                  </FormField>
                </div>
              </SettingsSection>

              <SettingsSection
                title="Points Earning Rules"
                description="Define how guests receive points after completing reservations."
              >
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <FormField label="Points per eligible spend">
                    <div className="relative">
                      <input
                        type="number"
                        min="1"
                        value={config.pointsPerAmount}
                        onChange={(e) =>
                          setConfig({
                            ...config,
                            pointsPerAmount: e.target.value,
                          })
                        }
                        className={inputClass}
                      />
                    </div>
                    <p className="mt-1 text-xs text-slate-400">
                      Points awarded for every ₹100 spent.
                    </p>
                  </FormField>

                  <FormField label="Bonus points per completed reservation">
                    <input
                      type="number"
                      min="0"
                      value={config.pointsPerBooking}
                      onChange={(e) =>
                        setConfig({
                          ...config,
                          pointsPerBooking: e.target.value,
                        })
                      }
                      className={inputClass}
                    />
                  </FormField>

                  <FormField label="New member welcome bonus">
                    <input
                      type="number"
                      min="0"
                      value={config.welcomeBonus}
                      onChange={(e) =>
                        setConfig({
                          ...config,
                          welcomeBonus: e.target.value,
                        })
                      }
                      className={inputClass}
                    />
                  </FormField>
                </div>

                <div className="mt-4 space-y-3">
                  <ToggleSetting
                    title="Automatic points awarding"
                    description="Automatically award points after a reservation is completed."
                    checked={config.autoAward}
                    onChange={(value) =>
                      setConfig({ ...config, autoAward: value })
                    }
                  />

                  <ToggleSetting
                    title="Automatic membership upgrade"
                    description="Upgrade members when they meet the required lifetime points."
                    checked={config.autoUpgrade}
                    onChange={(value) =>
                      setConfig({ ...config, autoUpgrade: value })
                    }
                  />
                </div>
              </SettingsSection>

              <SettingsSection
                title="Points Redemption Rules"
                description="Set the value and restrictions for redeemed points."
              >
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <FormField label="Minimum points for redemption">
                    <input
                      type="number"
                      min="0"
                      value={config.minimumRedemption}
                      onChange={(e) =>
                        setConfig({
                          ...config,
                          minimumRedemption: e.target.value,
                        })
                      }
                      className={inputClass}
                    />
                  </FormField>

                  <FormField label="Value of one point (₹)">
                    <input
                      type="number"
                      min="0.01"
                      step="0.01"
                      value={config.pointValue}
                      onChange={(e) =>
                        setConfig({
                          ...config,
                          pointValue: e.target.value,
                        })
                      }
                      className={inputClass}
                    />
                  </FormField>
                </div>

                <div className="mt-4">
                  <ToggleSetting
                    title="Allow partial redemption"
                    description="Allow guests to redeem only a portion of their available points."
                    checked={config.allowPartialRedemption}
                    onChange={(value) =>
                      setConfig({
                        ...config,
                        allowPartialRedemption: value,
                      })
                    }
                  />
                </div>
              </SettingsSection>

              <SettingsSection
                title="Membership & Expiry"
                description="Control how long loyalty points and memberships remain valid."
              >
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <FormField label="Membership validity (months)">
                    <input
                      type="number"
                      min="1"
                      value={config.expiryMonths}
                      onChange={(e) =>
                        setConfig({
                          ...config,
                          expiryMonths: e.target.value,
                        })
                      }
                      className={inputClass}
                    />
                  </FormField>
                </div>

                <div className="mt-4">
                  <ToggleSetting
                    title="Enable membership expiry"
                    description="Track membership expiry according to the configured validity period."
                    checked={config.expiryEnabled}
                    onChange={(value) =>
                      setConfig({
                        ...config,
                        expiryEnabled: value,
                      })
                    }
                  />
                </div>
              </SettingsSection>

              <div className="flex flex-col-reverse gap-2 border-t border-slate-100 pt-5 sm:flex-row sm:justify-end">
                <button
                  type="button"
                  onClick={() => setConfig(initialConfig)}
                  className="rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-medium text-slate-600 hover:bg-slate-50"
                >
                  Reset Defaults
                </button>

                <button
                  type="submit"
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-blue-700"
                >
                  <Check size={16} />
                  Save Configuration
                </button>
              </div>
            </div>
          </form>
        )}
      </div>

      {/* Member Details Modal */}
      {selectedMember && (
        <Modal
          title="Loyalty Member Details"
          subtitle={`Member ID: ${selectedMember.id}`}
          onClose={() => setSelectedMember(null)}
        >
          <div className="space-y-5">
            <div className="flex flex-col gap-4 rounded-xl bg-slate-50 p-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-3">
                <Avatar name={selectedMember.name} size="large" />
                <div>
                  <h3 className="font-semibold text-slate-900">
                    {selectedMember.name}
                  </h3>
                  <p className="mt-1 text-xs text-slate-500">
                    {selectedMember.email}
                  </p>
                  <p className="mt-1 text-xs text-slate-500">
                    {selectedMember.phone}
                  </p>
                </div>
              </div>

              <TierBadge tier={selectedMember.tier} />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <BalanceCard
                label="Available Points"
                value={formatPoints(selectedMember.points)}
                color="blue"
              />
              <BalanceCard
                label="Lifetime Points"
                value={formatPoints(selectedMember.lifetimePoints)}
                color="violet"
              />
              <BalanceCard
                label="Total Earned"
                value={formatPoints(selectedMember.earned)}
                color="emerald"
              />
              <BalanceCard
                label="Total Redeemed"
                value={formatPoints(selectedMember.redeemed)}
                color="amber"
              />
            </div>

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <DetailItem
                label="Membership Joined"
                value={formatDate(selectedMember.joined)}
                icon={<CalendarDays size={16} />}
              />
              <DetailItem
                label="Membership Expiry"
                value={formatDate(selectedMember.expiry)}
                icon={<Clock size={16} />}
              />
            </div>

            <div className="rounded-xl border border-slate-200 p-4">
              <div className="flex items-center justify-between gap-2">
                <h3 className="font-semibold text-slate-800">
                  Available Rewards
                </h3>
                <span className="text-xs text-slate-400">
                  {rewards.filter((reward) => reward.status === "Active").length}{" "}
                  active
                </span>
              </div>

              <div className="mt-3 space-y-3">
                {rewards
                  .filter((reward) => reward.status === "Active")
                  .map((reward) => {
                    const canRedeem =
                      selectedMember.points >= reward.points &&
                      selectedMember.points >= config.minimumRedemption;

                    return (
                      <div
                        key={reward.id}
                        className="flex flex-col gap-2 border-b border-slate-100 pb-3 last:border-0 last:pb-0 sm:flex-row sm:items-center sm:justify-between"
                      >
                        <div>
                          <p className="text-sm font-medium text-slate-800">
                            {reward.name}
                          </p>
                          <p className="mt-1 text-xs text-slate-500">
                            {formatPoints(reward.points)} points
                          </p>
                        </div>

                        <button
                          disabled={!canRedeem}
                          onClick={() => redeemReward(selectedMember, reward)}
                          className="rounded-lg bg-blue-600 px-3 py-2 text-xs font-semibold text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-slate-200 disabled:text-slate-400"
                        >
                          {canRedeem ? "Redeem" : "Insufficient Points"}
                        </button>
                      </div>
                    );
                  })}
              </div>
            </div>

            <div className="flex flex-col-reverse gap-2 border-t border-slate-100 pt-4 sm:flex-row sm:justify-end">
              <button
                onClick={() => setSelectedMember(null)}
                className="rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-medium text-slate-600 hover:bg-slate-50"
              >
                Close
              </button>

              <button
                onClick={() => {
                  const member = selectedMember;
                  setSelectedMember(null);
                  openPointsModal(member);
                }}
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-blue-700"
              >
                <Coins size={16} />
                Adjust Points
              </button>
            </div>
          </div>
        </Modal>
      )}

      {/* Points Adjustment Modal */}
      {showPointsModal && (
        <Modal
          title="Points Adjustment"
          subtitle="Credit or redeem loyalty points for a guest."
          onClose={() => setShowPointsModal(false)}
        >
          <form onSubmit={savePoints} className="space-y-4">
            <FormField label="Select Guest">
              <select
                required
                value={pointsForm.guestId}
                onChange={(e) =>
                  setPointsForm({
                    ...pointsForm,
                    guestId: e.target.value,
                  })
                }
                className={inputClass}
              >
                <option value="">Choose a guest</option>
                {members.map((member) => (
                  <option key={member.id} value={member.id}>
                    {member.name} ({member.id}) — {formatPoints(member.points)} points
                  </option>
                ))}
              </select>
            </FormField>

            <FormField label="Transaction Type">
              <select
                value={pointsForm.type}
                onChange={(e) =>
                  setPointsForm({
                    ...pointsForm,
                    type: e.target.value,
                  })
                }
                className={inputClass}
              >
                <option value="Earned">Credit Points</option>
                <option value="Redeemed">Redeem Points</option>
              </select>
            </FormField>

            <FormField label="Points">
              <input
                type="number"
                min="1"
                required
                value={pointsForm.points}
                onChange={(e) =>
                  setPointsForm({
                    ...pointsForm,
                    points: e.target.value,
                  })
                }
                placeholder="Enter points"
                className={inputClass}
              />
            </FormField>

            <FormField label="Transaction Description">
              <textarea
                rows={3}
                value={pointsForm.description}
                onChange={(e) =>
                  setPointsForm({
                    ...pointsForm,
                    description: e.target.value,
                  })
                }
                placeholder="Reason for points adjustment..."
                className={inputClass}
              />
            </FormField>

            <ModalActions
              onCancel={() => setShowPointsModal(false)}
              submitLabel="Save Transaction"
            />
          </form>
        </Modal>
      )}

      {/* Tier Modal */}
      {showTierModal && (
        <Modal
          title={editingTier ? "Edit Membership Level" : "Add Membership Level"}
          subtitle="Configure the membership requirements and benefits."
          onClose={() => setShowTierModal(false)}
        >
          <form onSubmit={saveTier} className="space-y-4">
            <FormField label="Level Name">
              <input
                required
                value={tierForm.name}
                onChange={(e) =>
                  setTierForm({ ...tierForm, name: e.target.value })
                }
                placeholder="e.g. Diamond"
                className={inputClass}
              />
            </FormField>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <FormField label="Minimum Lifetime Points">
                <input
                  type="number"
                  min="0"
                  required
                  value={tierForm.minPoints}
                  onChange={(e) =>
                    setTierForm({
                      ...tierForm,
                      minPoints: e.target.value,
                    })
                  }
                  className={inputClass}
                />
              </FormField>

              <FormField label="Points Multiplier">
                <input
                  type="number"
                  min="0.1"
                  step="0.1"
                  required
                  value={tierForm.multiplier}
                  onChange={(e) =>
                    setTierForm({
                      ...tierForm,
                      multiplier: e.target.value,
                    })
                  }
                  className={inputClass}
                />
              </FormField>
            </div>

            <FormField label="Benefits (one per line)">
              <textarea
                rows={5}
                value={tierForm.benefits}
                onChange={(e) =>
                  setTierForm({
                    ...tierForm,
                    benefits: e.target.value,
                  })
                }
                placeholder={"Priority check-in\nDining discount\nRoom upgrade"}
                className={inputClass}
              />
            </FormField>

            <FormField label="Display Color">
              <select
                value={tierForm.color}
                onChange={(e) =>
                  setTierForm({ ...tierForm, color: e.target.value })
                }
                className={inputClass}
              >
                <option value="blue">Blue</option>
                <option value="amber">Amber</option>
                <option value="slate">Silver</option>
                <option value="yellow">Gold</option>
                <option value="violet">Violet</option>
                <option value="emerald">Green</option>
              </select>
            </FormField>

            <ModalActions
              onCancel={() => setShowTierModal(false)}
              submitLabel="Save Membership Level"
            />
          </form>
        </Modal>
      )}

      {/* Reward Modal */}
      {showRewardModal && (
        <Modal
          title={editingReward ? "Edit Reward" : "Add New Reward"}
          subtitle="Create a reward that guests can redeem using points."
          onClose={() => setShowRewardModal(false)}
        >
          <form onSubmit={saveReward} className="space-y-4">
            <FormField label="Reward Name">
              <input
                required
                value={rewardForm.name}
                onChange={(e) =>
                  setRewardForm({ ...rewardForm, name: e.target.value })
                }
                placeholder="e.g. Free Breakfast"
                className={inputClass}
              />
            </FormField>

            <FormField label="Description">
              <textarea
                rows={3}
                value={rewardForm.description}
                onChange={(e) =>
                  setRewardForm({
                    ...rewardForm,
                    description: e.target.value,
                  })
                }
                placeholder="Describe the reward..."
                className={inputClass}
              />
            </FormField>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <FormField label="Required Points">
                <input
                  type="number"
                  min="1"
                  required
                  value={rewardForm.points}
                  onChange={(e) =>
                    setRewardForm({
                      ...rewardForm,
                      points: e.target.value,
                    })
                  }
                  className={inputClass}
                />
              </FormField>

              <FormField label="Category">
                <select
                  value={rewardForm.category}
                  onChange={(e) =>
                    setRewardForm({
                      ...rewardForm,
                      category: e.target.value,
                    })
                  }
                  className={inputClass}
                >
                  <option>Dining</option>
                  <option>Room</option>
                  <option>Service</option>
                  <option>Wellness</option>
                  <option>Discount</option>
                  <option>Other</option>
                </select>
              </FormField>

              <FormField label="Validity">
                <select
                  value={rewardForm.validity}
                  onChange={(e) =>
                    setRewardForm({
                      ...rewardForm,
                      validity: e.target.value,
                    })
                  }
                  className={inputClass}
                >
                  <option>7 days</option>
                  <option>15 days</option>
                  <option>30 days</option>
                  <option>60 days</option>
                  <option>90 days</option>
                </select>
              </FormField>

              <FormField label="Status">
                <select
                  value={rewardForm.status}
                  onChange={(e) =>
                    setRewardForm({
                      ...rewardForm,
                      status: e.target.value,
                    })
                  }
                  className={inputClass}
                >
                  <option>Active</option>
                  <option>Inactive</option>
                </select>
              </FormField>
            </div>

            <ModalActions
              onCancel={() => setShowRewardModal(false)}
              submitLabel="Save Reward"
            />
          </form>
        </Modal>
      )}

      {/* Offer Modal */}
      {showOfferModal && (
        <Modal
          title={editingOffer ? "Edit Offer" : "Create Loyalty Offer"}
          subtitle="Configure a promotional offer for loyalty members."
          onClose={() => setShowOfferModal(false)}
        >
          <form onSubmit={saveOffer} className="space-y-4">
            <FormField label="Offer Title">
              <input
                required
                value={offerForm.title}
                onChange={(e) =>
                  setOfferForm({ ...offerForm, title: e.target.value })
                }
                placeholder="e.g. Double Points Weekend"
                className={inputClass}
              />
            </FormField>

            <FormField label="Description">
              <textarea
                rows={3}
                value={offerForm.description}
                onChange={(e) =>
                  setOfferForm({
                    ...offerForm,
                    description: e.target.value,
                  })
                }
                placeholder="Describe the offer..."
                className={inputClass}
              />
            </FormField>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <FormField label="Offer Type">
                <select
                  value={offerForm.type}
                  onChange={(e) =>
                    setOfferForm({ ...offerForm, type: e.target.value })
                  }
                  className={inputClass}
                >
                  <option>Bonus Points</option>
                  <option>Welcome Bonus</option>
                  <option>Discount</option>
                  <option>Special Benefit</option>
                </select>
              </FormField>

              <FormField label="Offer Value">
                <input
                  value={offerForm.value}
                  onChange={(e) =>
                    setOfferForm({ ...offerForm, value: e.target.value })
                  }
                  placeholder="e.g. 2x points"
                  className={inputClass}
                />
              </FormField>

              <FormField label="Start Date">
                <input
                  type="date"
                  required
                  value={offerForm.startDate}
                  onChange={(e) =>
                    setOfferForm({
                      ...offerForm,
                      startDate: e.target.value,
                    })
                  }
                  className={inputClass}
                />
              </FormField>

              <FormField label="End Date">
                <input
                  type="date"
                  required
                  min={offerForm.startDate || undefined}
                  value={offerForm.endDate}
                  onChange={(e) =>
                    setOfferForm({
                      ...offerForm,
                      endDate: e.target.value,
                    })
                  }
                  className={inputClass}
                />
              </FormField>

              <FormField label="Status">
                <select
                  value={offerForm.status}
                  onChange={(e) =>
                    setOfferForm({ ...offerForm, status: e.target.value })
                  }
                  className={inputClass}
                >
                  <option>Active</option>
                  <option>Inactive</option>
                  <option>Expired</option>
                </select>
              </FormField>
            </div>

            <ModalActions
              onCancel={() => setShowOfferModal(false)}
              submitLabel="Save Offer"
            />
          </form>
        </Modal>
      )}
    </div>
  );
};

/* -------------------- Reusable Components -------------------- */

const inputClass =
  "w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm text-slate-700 outline-none transition focus:border-blue-400 focus:ring-4 focus:ring-blue-50";

const StatCard = ({ title, value, subtitle, icon, color }) => {
  const colors = {
    blue: "bg-blue-50 text-blue-600",
    violet: "bg-violet-50 text-violet-600",
    emerald: "bg-emerald-50 text-emerald-600",
    amber: "bg-amber-50 text-amber-600",
  };

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-sm font-medium text-slate-500">{title}</p>
          <h3 className="mt-2 text-2xl font-bold tracking-tight text-slate-900">
            {value}
          </h3>
        </div>

        <div
          className={`flex h-11 w-11 items-center justify-center rounded-xl ${colors[color]}`}
        >
          {icon}
        </div>
      </div>

      <p className="mt-3 text-xs text-slate-400">{subtitle}</p>
    </div>
  );
};

const Avatar = ({ name, size = "normal" }) => (
  <div
    className={`flex shrink-0 items-center justify-center rounded-full bg-blue-100 font-bold text-blue-700 ${
      size === "large" ? "h-14 w-14 text-base" : "h-10 w-10 text-xs"
    }`}
  >
    {getInitials(name)}
  </div>
);

const TierBadge = ({ tier }) => (
  <span
    className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-semibold ${
      tierStyles[tier] || "border-blue-200 bg-blue-50 text-blue-700"
    }`}
  >
    {getTierIcon(tier, 14)}
    {tier}
  </span>
);

const StatusBadge = ({ status }) => {
  const styles = {
    Active: "bg-emerald-50 text-emerald-700 border-emerald-200",
    Inactive: "bg-slate-100 text-slate-600 border-slate-200",
    Expired: "bg-rose-50 text-rose-700 border-rose-200",
    Completed: "bg-emerald-50 text-emerald-700 border-emerald-200",
  };

  return (
    <span
      className={`inline-flex rounded-full border px-2.5 py-1 text-xs font-medium ${
        styles[status] || "border-slate-200 bg-slate-50 text-slate-600"
      }`}
    >
      {status}
    </span>
  );
};

const TransactionBadge = ({ type }) => (
  <span
    className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium ${
      type === "Earned"
        ? "bg-emerald-50 text-emerald-700"
        : "bg-rose-50 text-rose-700"
    }`}
  >
    {type === "Earned" ? (
      <ArrowDownRight size={13} />
    ) : (
      <ArrowUpRight size={13} />
    )}
    {type}
  </span>
);

const ExpiryLabel = ({ date }) => {
  const expiry = new Date(date + "T00:00:00");
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const days = Math.ceil((expiry - today) / (1000 * 60 * 60 * 24));

  if (days < 0) {
    return (
      <div>
        <p className="text-sm text-slate-600">{formatDate(date)}</p>
        <p className="mt-0.5 text-xs font-medium text-rose-600">
          Expired
        </p>
      </div>
    );
  }

  if (days <= 60) {
    return (
      <div>
        <p className="text-sm text-slate-600">{formatDate(date)}</p>
        <p className="mt-0.5 text-xs font-medium text-amber-600">
          {days} days left
        </p>
      </div>
    );
  }

  return <span className="text-sm text-slate-500">{formatDate(date)}</span>;
};

const TableHeader = ({ children, align = "left" }) => (
  <th
    className={`px-4 py-3.5 text-xs font-semibold uppercase tracking-wide text-slate-500 ${
      align === "right" ? "text-right" : "text-left"
    }`}
  >
    {children}
  </th>
);

const FilterSelect = ({ value, onChange, options, allLabel }) => (
  <div className="relative">
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="w-full appearance-none rounded-xl border border-slate-200 bg-white px-3 py-2.5 pr-8 text-sm text-slate-600 outline-none focus:border-blue-400 focus:ring-4 focus:ring-blue-50"
    >
      {options.map((option) => (
        <option key={option} value={option}>
          {option === "All" ? allLabel : option}
        </option>
      ))}
    </select>

    <ChevronDown
      size={15}
      className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-400"
    />
  </div>
);

const Pagination = ({
  currentPage,
  totalPages,
  pageSize,
  total,
  onPageChange,
  onPageSizeChange,
}) => (
  <div className="flex flex-col gap-3 border-t border-slate-100 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
    <div className="flex flex-wrap items-center gap-2 text-sm text-slate-500">
      <span>Rows per page</span>
      <select
        value={pageSize}
        onChange={(e) => onPageSizeChange(Number(e.target.value))}
        className="rounded-lg border border-slate-200 bg-white px-2 py-1.5 text-sm outline-none"
      >
        <option value={5}>5</option>
        <option value={10}>10</option>
        <option value={20}>20</option>
      </select>

      <span>
        Showing {total === 0 ? 0 : (currentPage - 1) * pageSize + 1} to{" "}
        {Math.min(currentPage * pageSize, total)} of {total}
      </span>
    </div>

    <div className="flex items-center gap-2">
      <button
        disabled={currentPage === 1}
        onClick={() => onPageChange((page) => Math.max(1, page - 1))}
        className="rounded-lg border border-slate-200 p-2 text-slate-500 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
      >
        <ChevronLeft size={17} />
      </button>

      <span className="min-w-20 text-center text-sm text-slate-600">
        Page {currentPage} of {totalPages}
      </span>

      <button
        disabled={currentPage >= totalPages}
        onClick={() =>
          onPageChange((page) => Math.min(totalPages, page + 1))
        }
        className="rounded-lg border border-slate-200 p-2 text-slate-500 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
      >
        <ChevronRight size={17} />
      </button>
    </div>
  </div>
);

const EmptyTable = ({ colSpan, title, description }) => (
  <tr>
    <td colSpan={colSpan} className="px-5 py-16 text-center">
      <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-slate-100 text-slate-400">
        <Search size={21} />
      </div>
      <h3 className="mt-3 text-sm font-semibold text-slate-800">{title}</h3>
      <p className="mt-1 text-sm text-slate-500">{description}</p>
    </td>
  </tr>
);

const FormField = ({ label, children }) => (
  <div>
    <label className="mb-1.5 block text-sm font-medium text-slate-700">
      {label}
    </label>
    {children}
  </div>
);

const Modal = ({ title, subtitle, onClose, children }) => (
  <div
    className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/40 p-4 backdrop-blur-[2px]"
    onMouseDown={(e) => {
      if (e.target === e.currentTarget) onClose();
    }}
  >
    <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl bg-white p-5 shadow-2xl sm:p-6">
      <div className="mb-5 flex items-start justify-between gap-3">
        <div>
          <h2 className="text-lg font-bold text-slate-900">{title}</h2>
          {subtitle && (
            <p className="mt-1 text-sm text-slate-500">{subtitle}</p>
          )}
        </div>

        <button
          onClick={onClose}
          className="rounded-lg p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-700"
        >
          <X size={19} />
        </button>
      </div>

      {children}
    </div>
  </div>
);

const ModalActions = ({ onCancel, submitLabel }) => (
  <div className="flex flex-col-reverse gap-2 border-t border-slate-100 pt-4 sm:flex-row sm:justify-end">
    <button
      type="button"
      onClick={onCancel}
      className="rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-medium text-slate-600 hover:bg-slate-50"
    >
      Cancel
    </button>

    <button
      type="submit"
      className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-blue-700"
    >
      <Check size={16} />
      {submitLabel}
    </button>
  </div>
);

const BalanceCard = ({ label, value, color }) => {
  const styles = {
    blue: "bg-blue-50 text-blue-700",
    violet: "bg-violet-50 text-violet-700",
    emerald: "bg-emerald-50 text-emerald-700",
    amber: "bg-amber-50 text-amber-700",
  };

  return (
    <div className={`rounded-xl p-3 ${styles[color]}`}>
      <p className="text-xs opacity-80">{label}</p>
      <p className="mt-1 text-xl font-bold">{value}</p>
    </div>
  );
};

const DetailItem = ({ icon, label, value }) => (
  <div className="flex items-start gap-3">
    <div className="mt-0.5 text-slate-400">{icon}</div>
    <div>
      <p className="text-xs text-slate-400">{label}</p>
      <p className="mt-1 text-sm font-medium text-slate-700">{value}</p>
    </div>
  </div>
);

const SettingsSection = ({ title, description, children }) => (
  <section className="rounded-xl border border-slate-200 p-4 sm:p-5">
    <div className="mb-4">
      <h3 className="font-semibold text-slate-800">{title}</h3>
      <p className="mt-1 text-xs text-slate-500">{description}</p>
    </div>
    {children}
  </section>
);

const ToggleSetting = ({ title, description, checked, onChange }) => (
  <div className="flex items-center justify-between gap-4 rounded-xl border border-slate-100 p-3">
    <div>
      <p className="text-sm font-medium text-slate-800">{title}</p>
      <p className="mt-1 text-xs text-slate-500">{description}</p>
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
        className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow-sm transition ${
          checked ? "left-[22px]" : "left-0.5"
        }`}
      />
    </button>
  </div>
);

export default GuestLoyalty;
