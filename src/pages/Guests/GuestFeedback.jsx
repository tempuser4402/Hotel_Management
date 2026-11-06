
import React, { useMemo, useState } from "react";
import {
  Search,
  Star,
  MessageSquare,
  MessageCircle,
  ThumbsUp,
  ThumbsDown,
  AlertCircle,
  CheckCircle2,
  Clock,
  Filter,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ArrowUpDown,
  Eye,
  Send,
  X,
  Download,
  TrendingUp,
  Users,
  CalendarDays,
  UserRound,
  Pencil,
  Check,
  MoreHorizontal,
  Flag,
  FileText,
} from "lucide-react";

const initialReviews = [
  {
    id: "REV-001",
    guestName: "Rahul Sharma",
    guestId: "GST-001",
    email: "rahul.sharma@gmail.com",
    rating: 5,
    category: "Room Quality",
    title: "Excellent stay and wonderful service",
    comment:
      "The room was spotless and very comfortable. The staff were extremely helpful throughout our stay. Would definitely recommend this hotel.",
    date: "2026-11-04",
    status: "Responded",
    isComplaint: false,
    staffResponse:
      "Thank you for your wonderful feedback, Rahul! We are delighted that you enjoyed your stay. We look forward to welcoming you again.",
    respondedBy: "Ananya Sharma",
    respondedAt: "2026-11-05",
    internalNotes: "Returning VIP guest. Maintain room preference.",
  },
  {
    id: "REV-002",
    guestName: "Priya Verma",
    guestId: "GST-002",
    email: "priya.verma@gmail.com",
    rating: 2,
    category: "Housekeeping",
    title: "Room cleanliness needs improvement",
    comment:
      "The bathroom was not properly cleaned when we checked in. I also had to call housekeeping twice before someone arrived.",
    date: "2026-11-03",
    status: "Under Review",
    isComplaint: true,
    staffResponse: "",
    respondedBy: "",
    respondedAt: "",
    internalNotes: "Housekeeping supervisor needs to investigate.",
  },
  {
    id: "REV-003",
    guestName: "Amit Kumar",
    guestId: "GST-003",
    email: "amit.kumar@gmail.com",
    rating: 4,
    category: "Staff Service",
    title: "Friendly and professional staff",
    comment:
      "The reception team was very professional and check-in was smooth. Overall a pleasant experience.",
    date: "2026-11-02",
    status: "Responded",
    isComplaint: false,
    staffResponse:
      "Thank you, Amit! We appreciate your kind words about our reception team.",
    respondedBy: "Rohan Mehta",
    respondedAt: "2026-11-03",
    internalNotes: "",
  },
  {
    id: "REV-004",
    guestName: "Sneha Gupta",
    guestId: "GST-004",
    email: "sneha.gupta@gmail.com",
    rating: 1,
    category: "Food & Dining",
    title: "Very disappointing restaurant experience",
    comment:
      "The food arrived cold and the order took almost an hour. The dining experience was disappointing.",
    date: "2026-11-01",
    status: "Open",
    isComplaint: true,
    staffResponse: "",
    respondedBy: "",
    respondedAt: "",
    internalNotes: "Forward to restaurant manager. Check kitchen service times.",
  },
  {
    id: "REV-005",
    guestName: "Vikram Singh",
    guestId: "GST-005",
    email: "vikram.singh@gmail.com",
    rating: 5,
    category: "Overall Experience",
    title: "Amazing experience",
    comment:
      "Everything was perfect. Great location, comfortable rooms, and excellent hospitality.",
    date: "2026-10-30",
    status: "Responded",
    isComplaint: false,
    staffResponse:
      "Thank you for choosing us, Vikram. We are happy to hear that everything met your expectations!",
    respondedBy: "Ananya Sharma",
    respondedAt: "2026-10-31",
    internalNotes: "",
  },
  {
    id: "REV-006",
    guestName: "Neha Malhotra",
    guestId: "GST-006",
    email: "neha.malhotra@gmail.com",
    rating: 3,
    category: "Facilities",
    title: "Good stay but facilities can improve",
    comment:
      "The stay was comfortable, but the gym equipment was not working properly. The swimming pool was nice.",
    date: "2026-10-28",
    status: "Under Review",
    isComplaint: false,
    staffResponse: "",
    respondedBy: "",
    respondedAt: "",
    internalNotes: "Maintenance team should inspect gym equipment.",
  },
  {
    id: "REV-007",
    guestName: "Arjun Mehta",
    guestId: "GST-007",
    email: "arjun.mehta@gmail.com",
    rating: 4,
    category: "Room Quality",
    title: "Comfortable room",
    comment:
      "The room was spacious and the bed was comfortable. Good experience overall.",
    date: "2026-10-25",
    status: "Open",
    isComplaint: false,
    staffResponse: "",
    respondedBy: "",
    respondedAt: "",
    internalNotes: "",
  },
  {
    id: "REV-008",
    guestName: "Ananya Rao",
    guestId: "GST-008",
    email: "ananya.rao@gmail.com",
    rating: 2,
    category: "Staff Service",
    title: "Delay during check-in",
    comment:
      "We had to wait quite a while before the room was ready. The front desk communication could have been better.",
    date: "2026-10-22",
    status: "Closed",
    isComplaint: true,
    staffResponse:
      "We sincerely apologize for the delay. We have reviewed this with our front desk team and are working to improve our check-in process.",
    respondedBy: "Rohan Mehta",
    respondedAt: "2026-10-23",
    internalNotes: "Issue discussed with front desk supervisor.",
  },
];

const categories = [
  "Room Quality",
  "Housekeeping",
  "Staff Service",
  "Food & Dining",
  "Facilities",
  "Overall Experience",
];

const statuses = ["Open", "Under Review", "Responded", "Closed"];

const statusStyles = {
  Open: "bg-rose-50 text-rose-700 border-rose-200",
  "Under Review": "bg-amber-50 text-amber-700 border-amber-200",
  Responded: "bg-blue-50 text-blue-700 border-blue-200",
  Closed: "bg-emerald-50 text-emerald-700 border-emerald-200",
};

const getSentiment = (rating) => {
  if (rating >= 4) return "Positive";
  if (rating <= 2) return "Negative";
  return "Neutral";
};

const sentimentStyles = {
  Positive: "bg-emerald-50 text-emerald-700",
  Neutral: "bg-amber-50 text-amber-700",
  Negative: "bg-rose-50 text-rose-700",
};

const formatDate = (date) => {
  if (!date) return "—";

  return new Date(date + "T00:00:00").toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

const getInitials = (name) =>
  name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

const GuestFeedback = () => {
  const [reviews, setReviews] = useState(initialReviews);

  const [search, setSearch] = useState("");
  const [ratingFilter, setRatingFilter] = useState("All");
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");
  const [sentimentFilter, setSentimentFilter] = useState("All");
  const [complaintFilter, setComplaintFilter] = useState("All");

  const [sortBy, setSortBy] = useState("date");
  const [sortDirection, setSortDirection] = useState("desc");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);

  const [selectedReview, setSelectedReview] = useState(null);
  const [staffResponse, setStaffResponse] = useState("");
  const [internalNotes, setInternalNotes] = useState("");
  const [reviewStatus, setReviewStatus] = useState("Open");
  const [activeTab, setActiveTab] = useState("details");

  const [successMessage, setSuccessMessage] = useState("");

  const filteredReviews = useMemo(() => {
    let result = reviews.filter((review) => {
      const searchValue = search.toLowerCase();

      const matchesSearch =
        review.guestName.toLowerCase().includes(searchValue) ||
        review.guestId.toLowerCase().includes(searchValue) ||
        review.title.toLowerCase().includes(searchValue) ||
        review.comment.toLowerCase().includes(searchValue) ||
        review.id.toLowerCase().includes(searchValue);

      const matchesRating =
        ratingFilter === "All" ||
        review.rating === Number(ratingFilter);

      const matchesCategory =
        categoryFilter === "All" ||
        review.category === categoryFilter;

      const matchesStatus =
        statusFilter === "All" ||
        review.status === statusFilter;

      const matchesSentiment =
        sentimentFilter === "All" ||
        getSentiment(review.rating) === sentimentFilter;

      const matchesComplaint =
        complaintFilter === "All" ||
        (complaintFilter === "Complaints" && review.isComplaint) ||
        (complaintFilter === "Non-complaints" && !review.isComplaint);

      return (
        matchesSearch &&
        matchesRating &&
        matchesCategory &&
        matchesStatus &&
        matchesSentiment &&
        matchesComplaint
      );
    });

    result.sort((a, b) => {
      let first;
      let second;

      if (sortBy === "rating") {
        first = a.rating;
        second = b.rating;
      } else if (sortBy === "guestName") {
        first = a.guestName.toLowerCase();
        second = b.guestName.toLowerCase();
      } else {
        first = a.date;
        second = b.date;
      }

      if (first < second) return sortDirection === "asc" ? -1 : 1;
      if (first > second) return sortDirection === "asc" ? 1 : -1;
      return 0;
    });

    return result;
  }, [
    reviews,
    search,
    ratingFilter,
    categoryFilter,
    statusFilter,
    sentimentFilter,
    complaintFilter,
    sortBy,
    sortDirection,
  ]);

  const totalPages = Math.max(
    1,
    Math.ceil(filteredReviews.length / pageSize)
  );

  const paginatedReviews = filteredReviews.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  const analytics = useMemo(() => {
    const total = reviews.length;

    const positive = reviews.filter(
      (review) => review.rating >= 4
    ).length;

    const negative = reviews.filter(
      (review) => review.rating <= 2
    ).length;

    const neutral = reviews.filter(
      (review) => review.rating === 3
    ).length;

    const averageRating = total
      ? reviews.reduce((sum, review) => sum + review.rating, 0) / total
      : 0;

    const complaints = reviews.filter(
      (review) => review.isComplaint
    ).length;

    const openComplaints = reviews.filter(
      (review) =>
        review.isComplaint &&
        review.status !== "Closed"
    ).length;

    const responseCount = reviews.filter(
      (review) => review.staffResponse?.trim()
    ).length;

    const responseRate = total
      ? Math.round((responseCount / total) * 100)
      : 0;

    return {
      total,
      positive,
      negative,
      neutral,
      averageRating,
      complaints,
      openComplaints,
      responseRate,
    };
  }, [reviews]);

  const categoryAnalytics = useMemo(() => {
    return categories.map((category) => {
      const categoryReviews = reviews.filter(
        (review) => review.category === category
      );

      const average = categoryReviews.length
        ? categoryReviews.reduce(
            (sum, review) => sum + review.rating,
            0
          ) / categoryReviews.length
        : 0;

      return {
        category,
        count: categoryReviews.length,
        average,
      };
    });
  }, [reviews]);

  const showSuccessMessage = (message) => {
    setSuccessMessage(message);
  };

  React.useEffect(() => {
    if (!successMessage) return;

    const timeout = setTimeout(() => {
      setSuccessMessage("");
    }, 3500);

    return () => clearTimeout(timeout);
  }, [successMessage]);

  React.useEffect(() => {
    setCurrentPage(1);
  }, [
    search,
    ratingFilter,
    categoryFilter,
    statusFilter,
    sentimentFilter,
    complaintFilter,
    pageSize,
  ]);

  const openReview = (review) => {
    setSelectedReview(review);
    setStaffResponse(review.staffResponse || "");
    setInternalNotes(review.internalNotes || "");
    setReviewStatus(review.status);
    setActiveTab("details");
  };

  const saveReviewUpdates = () => {
    if (!selectedReview) return;

    const hasResponse = staffResponse.trim().length > 0;

    setReviews((previous) =>
      previous.map((review) =>
        review.id === selectedReview.id
          ? {
              ...review,
              staffResponse: staffResponse.trim(),
              internalNotes: internalNotes.trim(),
              status: reviewStatus,
              respondedBy: hasResponse
                ? review.respondedBy || "Current Staff"
                : "",
              respondedAt: hasResponse
                ? review.respondedAt ||
                  new Date().toISOString().slice(0, 10)
                : "",
            }
          : review
      )
    );

    setSelectedReview(null);
    showSuccessMessage("Feedback updated successfully.");
  };

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

  const exportCSV = () => {
    const headers = [
      "Review ID",
      "Guest",
      "Guest ID",
      "Rating",
      "Category",
      "Title",
      "Comment",
      "Date",
      "Sentiment",
      "Complaint",
      "Status",
      "Staff Response",
      "Responded By",
      "Internal Notes",
    ];

    const escapeCSV = (value) =>
      `"${String(value ?? "").replace(/"/g, '""')}"`;

    const rows = filteredReviews.map((review) => [
      review.id,
      review.guestName,
      review.guestId,
      review.rating,
      review.category,
      review.title,
      review.comment,
      review.date,
      getSentiment(review.rating),
      review.isComplaint ? "Yes" : "No",
      review.status,
      review.staffResponse,
      review.respondedBy,
      review.internalNotes,
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
    link.download = "stayflow-guest-feedback.csv";
    link.click();

    URL.revokeObjectURL(url);
  };

  const clearFilters = () => {
    setSearch("");
    setRatingFilter("All");
    setCategoryFilter("All");
    setStatusFilter("All");
    setSentimentFilter("All");
    setComplaintFilter("All");
  };

  const selectSentiment = (sentiment) => {
    setSentimentFilter((previous) =>
      previous === sentiment ? "All" : sentiment
    );
  };

  return (
    <div className="min-h-screen bg-slate-50 p-4 md:p-6 lg:p-7 space-y-6">

      {/* Page Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2 text-sm text-slate-500">
            <MessageSquare size={16} />
            <span>Guests</span>
            <span>/</span>
            <span className="text-slate-800">Reviews & Feedback</span>
          </div>

          <h1 className="mt-2 text-2xl font-bold tracking-tight text-slate-900">
            Reviews & Feedback
          </h1>

          <p className="mt-1 text-sm text-slate-500">
            Monitor guest experiences, manage complaints, and improve
            service quality.
          </p>
        </div>

        <button
          onClick={exportCSV}
          className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 shadow-sm transition hover:bg-slate-50"
        >
          <Download size={16} />
          Export Feedback
        </button>
      </div>

      {/* Analytics Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          title="Total Reviews"
          value={analytics.total}
          subtitle="All submitted guest reviews"
          icon={<MessageSquare size={20} />}
          color="blue"
        />

        <StatCard
          title="Average Rating"
          value={`${analytics.averageRating.toFixed(1)} / 5`}
          subtitle="Overall guest satisfaction"
          icon={<Star size={20} />}
          color="amber"
          rating={analytics.averageRating}
        />

        <StatCard
          title="Open Complaints"
          value={analytics.openComplaints}
          subtitle={`${analytics.complaints} total complaints`}
          icon={<AlertCircle size={20} />}
          color="rose"
        />

        <StatCard
          title="Response Rate"
          value={`${analytics.responseRate}%`}
          subtitle="Reviews with staff responses"
          icon={<MessageCircle size={20} />}
          color="violet"
        />
      </div>

      {/* Sentiment Analytics */}
      <div className="grid grid-cols-1 gap-4 xl:grid-cols-3">

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm xl:col-span-2">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div>
              <h2 className="font-semibold text-slate-900">
                Feedback Sentiment
              </h2>
              <p className="mt-1 text-xs text-slate-500">
                Breakdown of positive, neutral, and negative reviews
              </p>
            </div>

            <TrendingUp size={19} className="text-slate-400" />
          </div>

          <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-3">
            <SentimentCard
              label="Positive"
              count={analytics.positive}
              total={analytics.total}
              icon={<ThumbsUp size={18} />}
              color="emerald"
              onClick={() => selectSentiment("Positive")}
              active={sentimentFilter === "Positive"}
            />

            <SentimentCard
              label="Neutral"
              count={analytics.neutral}
              total={analytics.total}
              icon={<MessageCircle size={18} />}
              color="amber"
              onClick={() => selectSentiment("Neutral")}
              active={sentimentFilter === "Neutral"}
            />

            <SentimentCard
              label="Negative"
              count={analytics.negative}
              total={analytics.total}
              icon={<ThumbsDown size={18} />}
              color="rose"
              onClick={() => selectSentiment("Negative")}
              active={sentimentFilter === "Negative"}
            />
          </div>

          <div className="mt-6 flex h-3 overflow-hidden rounded-full bg-slate-100">
            {analytics.total > 0 && (
              <>
                <div
                  className="bg-emerald-500 transition-all"
                  style={{
                    width: `${
                      (analytics.positive / analytics.total) * 100
                    }%`,
                  }}
                />
                <div
                  className="bg-amber-400 transition-all"
                  style={{
                    width: `${
                      (analytics.neutral / analytics.total) * 100
                    }%`,
                  }}
                />
                <div
                  className="bg-rose-500 transition-all"
                  style={{
                    width: `${
                      (analytics.negative / analytics.total) * 100
                    }%`,
                  }}
                />
              </>
            )}
          </div>

          <div className="mt-3 flex flex-wrap gap-4 text-xs text-slate-500">
            <span className="flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full bg-emerald-500" />
              Positive
            </span>
            <span className="flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full bg-amber-400" />
              Neutral
            </span>
            <span className="flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full bg-rose-500" />
              Negative
            </span>
          </div>
        </div>

        {/* Category Analytics */}
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div>
            <h2 className="font-semibold text-slate-900">
              Category Performance
            </h2>
            <p className="mt-1 text-xs text-slate-500">
              Average rating by review category
            </p>
          </div>

          <div className="mt-5 space-y-4">
            {categoryAnalytics.map((item) => (
              <div key={item.category}>
                <div className="mb-1.5 flex items-center justify-between gap-2">
                  <span className="text-xs font-medium text-slate-600">
                    {item.category}
                  </span>
                  <span className="text-xs font-semibold text-slate-700">
                    {item.count ? item.average.toFixed(1) : "—"}
                    {item.count > 0 && (
                      <span className="text-slate-400"> / 5</span>
                    )}
                  </span>
                </div>

                <div className="h-2 overflow-hidden rounded-full bg-slate-100">
                  <div
                    className="h-full rounded-full bg-blue-500 transition-all"
                    style={{
                      width: `${(item.average / 5) * 100}%`,
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
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

      {/* Reviews Table */}
      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">

        {/* Table Header */}
        <div className="flex flex-col gap-4 border-b border-slate-100 p-5">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="font-semibold text-slate-900">
                Guest Reviews
              </h2>
              <p className="mt-1 text-sm text-slate-500">
                {filteredReviews.length} feedback records found
              </p>
            </div>
          </div>

          {/* Filters */}
          <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 xl:grid-cols-6">
            <div className="relative sm:col-span-2 xl:col-span-2">
              <Search
                size={16}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
              />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search guest, review, or ID..."
                className="w-full rounded-xl border border-slate-200 py-2.5 pl-9 pr-3 text-sm outline-none transition focus:border-blue-400 focus:ring-4 focus:ring-blue-50"
              />
            </div>

            <FilterSelect
              value={categoryFilter}
              onChange={setCategoryFilter}
              options={["All", ...categories]}
              allLabel="All Categories"
            />

            <FilterSelect
              value={ratingFilter}
              onChange={setRatingFilter}
              options={["All", "5", "4", "3", "2", "1"]}
              allLabel="All Ratings"
              formatOption={(value) =>
                value === "All" ? value : `${value} Stars`
              }
            />

            <FilterSelect
              value={statusFilter}
              onChange={setStatusFilter}
              options={["All", ...statuses]}
              allLabel="All Statuses"
            />

            <FilterSelect
              value={complaintFilter}
              onChange={setComplaintFilter}
              options={["All", "Complaints", "Non-complaints"]}
              allLabel="All Feedback"
            />
          </div>

          {(search ||
            categoryFilter !== "All" ||
            ratingFilter !== "All" ||
            statusFilter !== "All" ||
            sentimentFilter !== "All" ||
            complaintFilter !== "All") && (
            <div className="flex flex-wrap items-center justify-between gap-2">
              <p className="text-xs text-slate-500">
                Filters are currently applied.
                {sentimentFilter !== "All" &&
                  ` Sentiment: ${sentimentFilter}.`}
              </p>
              <button
                onClick={clearFilters}
                className="text-xs font-semibold text-blue-600 hover:text-blue-700"
              >
                Clear all filters
              </button>
            </div>
          )}
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full min-w-[1050px] text-left">
            <thead className="bg-slate-50">
              <tr className="border-b border-slate-100">
                <th className="px-5 py-3.5 text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Guest / Review
                </th>

                <th className="px-4 py-3.5 text-xs font-semibold uppercase tracking-wide text-slate-500">
                  <button
                    onClick={() => changeSort("rating")}
                    className="inline-flex items-center gap-1"
                  >
                    Rating
                    <ArrowUpDown size={13} />
                  </button>
                </th>

                <th className="px-4 py-3.5 text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Category
                </th>

                <th className="px-4 py-3.5 text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Sentiment
                </th>

                <th className="px-4 py-3.5 text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Complaint
                </th>

                <th className="px-4 py-3.5 text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Status
                </th>

                <th className="px-4 py-3.5 text-xs font-semibold uppercase tracking-wide text-slate-500">
                  <button
                    onClick={() => changeSort("date")}
                    className="inline-flex items-center gap-1"
                  >
                    Date
                    <ArrowUpDown size={13} />
                  </button>
                </th>

                <th className="px-4 py-3.5 text-right text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Action
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100">
              {paginatedReviews.map((review) => (
                <tr
                  key={review.id}
                  className="transition hover:bg-slate-50/70"
                >
                  <td className="px-5 py-4">
                    <div className="flex items-start gap-3">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-blue-100 text-xs font-bold text-blue-700">
                        {getInitials(review.guestName)}
                      </div>

                      <div className="min-w-0 max-w-[260px]">
                        <p className="text-sm font-semibold text-slate-800">
                          {review.guestName}
                        </p>
                        <p className="mt-0.5 text-xs text-slate-400">
                          {review.id} · {review.guestId}
                        </p>
                        <p className="mt-1 truncate text-xs font-medium text-slate-600">
                          {review.title}
                        </p>
                        <p className="mt-0.5 line-clamp-1 text-xs text-slate-400">
                          {review.comment}
                        </p>
                      </div>
                    </div>
                  </td>

                  <td className="px-4 py-4">
                    <div className="inline-flex items-center gap-1.5">
                      <Star
                        size={15}
                        className="fill-amber-400 text-amber-400"
                      />
                      <span className="text-sm font-semibold text-slate-700">
                        {review.rating}.0
                      </span>
                    </div>
                  </td>

                  <td className="px-4 py-4">
                    <span className="rounded-lg bg-slate-100 px-2.5 py-1.5 text-xs font-medium text-slate-600">
                      {review.category}
                    </span>
                  </td>

                  <td className="px-4 py-4">
                    <span
                      className={`rounded-full px-2.5 py-1 text-xs font-medium ${
                        sentimentStyles[getSentiment(review.rating)]
                      }`}
                    >
                      {getSentiment(review.rating)}
                    </span>
                  </td>

                  <td className="px-4 py-4">
                    {review.isComplaint ? (
                      <span className="inline-flex items-center gap-1 text-xs font-medium text-rose-600">
                        <Flag size={13} />
                        Yes
                      </span>
                    ) : (
                      <span className="text-xs text-slate-400">No</span>
                    )}
                  </td>

                  <td className="px-4 py-4">
                    <span
                      className={`inline-flex rounded-full border px-2.5 py-1 text-xs font-medium ${
                        statusStyles[review.status]
                      }`}
                    >
                      {review.status}
                    </span>
                  </td>

                  <td className="px-4 py-4 text-sm text-slate-500">
                    {formatDate(review.date)}
                  </td>

                  <td className="px-4 py-4 text-right">
                    <button
                      onClick={() => openReview(review)}
                      className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 px-3 py-2 text-xs font-medium text-slate-600 transition hover:border-blue-200 hover:bg-blue-50 hover:text-blue-600"
                    >
                      <Eye size={14} />
                      View
                    </button>
                  </td>
                </tr>
              ))}

              {paginatedReviews.length === 0 && (
                <tr>
                  <td colSpan={8} className="px-5 py-16 text-center">
                    <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-slate-100 text-slate-400">
                      <MessageSquare size={22} />
                    </div>
                    <h3 className="mt-3 text-sm font-semibold text-slate-800">
                      No feedback found
                    </h3>
                    <p className="mt-1 text-sm text-slate-500">
                      Try changing your search or filters.
                    </p>
                    <button
                      onClick={clearFilters}
                      className="mt-3 text-sm font-medium text-blue-600 hover:text-blue-700"
                    >
                      Clear filters
                    </button>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex flex-col gap-3 border-t border-slate-100 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-wrap items-center gap-2 text-sm text-slate-500">
            <span>Rows per page</span>

            <select
              value={pageSize}
              onChange={(e) => setPageSize(Number(e.target.value))}
              className="rounded-lg border border-slate-200 bg-white px-2 py-1.5 text-sm outline-none"
            >
              <option value={5}>5</option>
              <option value={10}>10</option>
              <option value={20}>20</option>
            </select>

            <span>
              Showing{" "}
              {filteredReviews.length === 0
                ? 0
                : (currentPage - 1) * pageSize + 1}
              {" "}to{" "}
              {Math.min(currentPage * pageSize, filteredReviews.length)}
              {" "}of {filteredReviews.length}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              disabled={currentPage === 1}
              onClick={() =>
                setCurrentPage((previous) => Math.max(1, previous - 1))
              }
              className="rounded-lg border border-slate-200 p-2 text-slate-500 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
            >
              <ChevronLeft size={17} />
            </button>

            <span className="min-w-20 text-center text-sm text-slate-600">
              Page {currentPage} of {totalPages}
            </span>

            <button
              disabled={currentPage >= totalPages}
              onClick={() =>
                setCurrentPage((previous) =>
                  Math.min(totalPages, previous + 1)
                )
              }
              className="rounded-lg border border-slate-200 p-2 text-slate-500 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
            >
              <ChevronRight size={17} />
            </button>
          </div>
        </div>
      </div>

      {/* Review Details Modal */}
      {selectedReview && (
        <Modal
          title="Review Details"
          subtitle={`Review ID: ${selectedReview.id}`}
          onClose={() => setSelectedReview(null)}
        >
          <div className="space-y-5">

            {/* Guest and Rating */}
            <div className="flex flex-col gap-4 rounded-xl bg-slate-50 p-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-100 text-sm font-bold text-blue-700">
                  {getInitials(selectedReview.guestName)}
                </div>

                <div>
                  <p className="font-semibold text-slate-900">
                    {selectedReview.guestName}
                  </p>
                  <p className="mt-0.5 text-xs text-slate-500">
                    {selectedReview.guestId}
                  </p>
                  <p className="mt-0.5 text-xs text-slate-500">
                    {selectedReview.email}
                  </p>
                </div>
              </div>

              <div className="sm:text-right">
                <div className="flex items-center gap-1 sm:justify-end">
                  {Array.from({ length: 5 }).map((_, index) => (
                    <Star
                      key={index}
                      size={17}
                      className={
                        index < selectedReview.rating
                          ? "fill-amber-400 text-amber-400"
                          : "text-slate-300"
                      }
                    />
                  ))}
                </div>

                <p className="mt-1 text-xs text-slate-500">
                  {selectedReview.rating} out of 5 ·{" "}
                  {getSentiment(selectedReview.rating)}
                </p>
              </div>
            </div>

            {/* Tabs */}
            <div className="flex gap-5 border-b border-slate-100">
              {[
                { id: "details", label: "Review Details" },
                { id: "response", label: "Staff Response" },
                { id: "notes", label: "Internal Notes" },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`border-b-2 pb-3 text-sm font-medium transition ${
                    activeTab === tab.id
                      ? "border-blue-600 text-blue-600"
                      : "border-transparent text-slate-500 hover:text-slate-800"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Review Details */}
            {activeTab === "details" && (
              <div className="space-y-4">
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  <DetailItem
                    label="Category"
                    value={selectedReview.category}
                    icon={<FileText size={16} />}
                  />
                  <DetailItem
                    label="Submitted Date"
                    value={formatDate(selectedReview.date)}
                    icon={<CalendarDays size={16} />}
                  />
                  <DetailItem
                    label="Feedback Status"
                    value={selectedReview.status}
                    icon={<Clock size={16} />}
                  />
                  <DetailItem
                    label="Complaint"
                    value={selectedReview.isComplaint ? "Yes" : "No"}
                    icon={<AlertCircle size={16} />}
                  />
                </div>

                <div className="rounded-xl border border-slate-200 p-4">
                  <h3 className="font-semibold text-slate-800">
                    {selectedReview.title}
                  </h3>
                  <p className="mt-2 whitespace-pre-line text-sm leading-6 text-slate-600">
                    {selectedReview.comment}
                  </p>
                </div>

                {selectedReview.isComplaint && (
                  <div className="flex gap-3 rounded-xl border border-rose-200 bg-rose-50 p-3">
                    <AlertCircle
                      size={18}
                      className="mt-0.5 shrink-0 text-rose-600"
                    />
                    <div>
                      <p className="text-sm font-semibold text-rose-800">
                        Guest complaint
                      </p>
                      <p className="mt-1 text-xs text-rose-700">
                        This feedback has been marked as a complaint and
                        should be reviewed by the appropriate department.
                      </p>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Staff Response */}
            {activeTab === "response" && (
              <div className="space-y-4">
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-slate-700">
                    Staff Response
                  </label>
                  <textarea
                    rows={5}
                    value={staffResponse}
                    onChange={(e) => setStaffResponse(e.target.value)}
                    placeholder="Write a professional response to the guest..."
                    className="w-full rounded-xl border border-slate-200 px-3.5 py-3 text-sm text-slate-700 outline-none transition focus:border-blue-400 focus:ring-4 focus:ring-blue-50"
                  />
                  <p className="mt-1 text-xs text-slate-400">
                    This response is intended for the guest. It is not a
                    private internal note.
                  </p>
                </div>

                {selectedReview.staffResponse && (
                  <div className="rounded-xl border border-blue-100 bg-blue-50 p-4">
                    <p className="text-xs font-semibold uppercase tracking-wide text-blue-700">
                      Previous response
                    </p>
                    <p className="mt-2 text-sm leading-6 text-slate-700">
                      {selectedReview.staffResponse}
                    </p>
                    <p className="mt-2 text-xs text-slate-500">
                      By {selectedReview.respondedBy || "Staff"} ·{" "}
                      {formatDate(selectedReview.respondedAt)}
                    </p>
                  </div>
                )}
              </div>
            )}

            {/* Internal Notes */}
            {activeTab === "notes" && (
              <div className="space-y-3">
                <div className="rounded-xl border border-amber-200 bg-amber-50 p-3">
                  <p className="text-xs font-semibold text-amber-800">
                    Private staff notes
                  </p>
                  <p className="mt-1 text-xs text-amber-700">
                    These notes are internal and should not be shared with
                    the guest.
                  </p>
                </div>

                <textarea
                  rows={6}
                  value={internalNotes}
                  onChange={(e) => setInternalNotes(e.target.value)}
                  placeholder="Add internal observations, follow-up actions, or department instructions..."
                  className="w-full rounded-xl border border-slate-200 px-3.5 py-3 text-sm text-slate-700 outline-none transition focus:border-blue-400 focus:ring-4 focus:ring-blue-50"
                />
              </div>
            )}

            {/* Status */}
            <div className="rounded-xl border border-slate-200 p-4">
              <label className="mb-2 block text-sm font-semibold text-slate-800">
                Feedback Status
              </label>

              <select
                value={reviewStatus}
                onChange={(e) => setReviewStatus(e.target.value)}
                className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm outline-none focus:border-blue-400 focus:ring-4 focus:ring-blue-50"
              >
                {statuses.map((status) => (
                  <option key={status} value={status}>
                    {status}
                  </option>
                ))}
              </select>
            </div>

            {/* Modal Actions */}
            <div className="flex flex-col-reverse gap-2 border-t border-slate-100 pt-4 sm:flex-row sm:justify-end">
              <button
                onClick={() => setSelectedReview(null)}
                className="rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-medium text-slate-600 hover:bg-slate-50"
              >
                Cancel
              </button>

              <button
                onClick={saveReviewUpdates}
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700"
              >
                <Check size={16} />
                Save Changes
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};

/* Reusable Components */

const StatCard = ({ title, value, subtitle, icon, color, rating }) => {
  const colors = {
    blue: "bg-blue-50 text-blue-600",
    amber: "bg-amber-50 text-amber-600",
    rose: "bg-rose-50 text-rose-600",
    violet: "bg-violet-50 text-violet-600",
  };

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-sm font-medium text-slate-500">{title}</p>
          <h3 className="mt-2 text-2xl font-bold tracking-tight text-slate-900">
            {value}
          </h3>

          {rating > 0 && (
            <div className="mt-1 flex items-center gap-1">
              <Star size={12} className="fill-amber-400 text-amber-400" />
              <Star size={12} className="fill-amber-400 text-amber-400" />
              <Star size={12} className="fill-amber-400 text-amber-400" />
              <Star size={12} className="fill-amber-400 text-amber-400" />
              <Star size={12} className="text-slate-300" />
            </div>
          )}
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

const SentimentCard = ({
  label,
  count,
  total,
  icon,
  color,
  onClick,
  active,
}) => {
  const styles = {
    emerald: {
      container: "bg-emerald-50 border-emerald-100 text-emerald-700",
      icon: "bg-emerald-100 text-emerald-600",
      bar: "bg-emerald-500",
    },
    amber: {
      container: "bg-amber-50 border-amber-100 text-amber-700",
      icon: "bg-amber-100 text-amber-600",
      bar: "bg-amber-400",
    },
    rose: {
      container: "bg-rose-50 border-rose-100 text-rose-700",
      icon: "bg-rose-100 text-rose-600",
      bar: "bg-rose-500",
    },
  };

  const percentage = total ? Math.round((count / total) * 100) : 0;
  const style = styles[color];

  return (
    <button
      onClick={onClick}
      className={`rounded-xl border p-4 text-left transition ${
        style.container
      } ${active ? "ring-2 ring-blue-400 ring-offset-2" : "hover:shadow-sm"}`}
    >
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium">{label}</span>
        <span
          className={`flex h-9 w-9 items-center justify-center rounded-lg ${style.icon}`}
        >
          {icon}
        </span>
      </div>

      <div className="mt-3 flex items-end justify-between">
        <span className="text-2xl font-bold">{count}</span>
        <span className="text-xs font-medium">{percentage}%</span>
      </div>

      <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-white/70">
        <div
          className={`h-full rounded-full ${style.bar}`}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </button>
  );
};

const FilterSelect = ({
  value,
  onChange,
  options,
  allLabel,
  formatOption,
}) => {
  return (
    <div className="relative">
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full appearance-none rounded-xl border border-slate-200 bg-white px-3 py-2.5 pr-8 text-sm text-slate-600 outline-none transition focus:border-blue-400 focus:ring-4 focus:ring-blue-50"
      >
        {options.map((option) => (
          <option key={option} value={option}>
            {option === "All"
              ? allLabel
              : formatOption
                ? formatOption(option)
                : option}
          </option>
        ))}
      </select>

      <ChevronDown
        size={15}
        className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-400"
      />
    </div>
  );
};

const DetailItem = ({ icon, label, value }) => {
  return (
    <div className="flex min-w-0 items-start gap-3">
      <div className="mt-0.5 text-slate-400">{icon}</div>
      <div className="min-w-0">
        <p className="text-xs text-slate-400">{label}</p>
        <p className="mt-1 break-words text-sm font-medium text-slate-700">
          {value}
        </p>
      </div>
    </div>
  );
};

const Modal = ({
  title,
  subtitle,
  onClose,
  children,
}) => {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/40 p-4 backdrop-blur-[2px]"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl bg-white p-5 shadow-2xl sm:p-6">
        <div className="mb-5 flex items-start justify-between gap-3">
          <div>
            <h2 className="text-lg font-bold text-slate-900">
              {title}
            </h2>
            {subtitle && (
              <p className="mt-1 text-sm text-slate-500">
                {subtitle}
              </p>
            )}
          </div>

          <button
            onClick={onClose}
            className="rounded-lg p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
          >
            <X size={19} />
          </button>
        </div>

        {children}
      </div>
    </div>
  );
};

export default GuestFeedback;
