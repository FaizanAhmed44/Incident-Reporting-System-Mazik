import React, { useState, useEffect } from "react";
import {
  Search,
  Filter,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  Eye,
  Calendar,
  User,
  Loader2,
} from "lucide-react";
import { useAuth } from "../../contexts/AuthContext"; // Import the useAuth hook
import { getUserTickets } from "../../api/incidentApi"; // Import our new API function

// The interface for how our component USES a ticket.
// This is our clean, internal format.
interface Ticket {
  id: string;
  title: string;
  category: string;
  status: "new" | "accepted" | "in-progress" | "resolved" | "rejected";
  priority: "low" | "medium" | "high";
  createdAt: string;
  updatedAt: string;
  assignedTeam: string;
  assignedAgent?: string;
  assignedResolverName?: string;
}

const TrackTickets: React.FC = () => {
  // --- STATE MANAGEMENT for live data ---
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // State for UI controls
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [filterType, setFilterType] = useState("title"); // Add filter type state

  const { user } = useAuth(); // Get the logged-in user from context

  // --- DATA FETCHING with useEffect ---
  useEffect(() => {
    const fetchTickets = async () => {
      if (!user) {
        setError("You must be logged in to view your tickets.");
        setIsLoading(false);
        return;
      }

      try {
        const response = await getUserTickets(user.id);

        const mappedTickets: Ticket[] = response.tickets.map((apiTicket) => ({
          id: apiTicket.incidentID,
          title: apiTicket.title || apiTicket.description,
          category: apiTicket.category,
          status: apiTicket.status
            .toLowerCase()
            .replace(" ", "-") as Ticket["status"],
          priority: "medium",
          createdAt: apiTicket.lastUpdated,
          updatedAt: apiTicket.lastUpdated,
          assignedTeam: apiTicket.category,
          assignedAgent: "Unassigned",
          assignedResolverName: "Unassigned", // Map resolver name if available
        }));

        setTickets(mappedTickets);
      } catch (err: any) {
        setError(
          err.message || "An unknown error occurred while fetching tickets."
        );
      } finally {
        setIsLoading(false);
      }
    };

    fetchTickets();
  }, [user]); // This effect runs once when the component loads, or if the user logs in/out.

  // --- FILTERING LOGIC (no changes needed here) ---
  const filteredTickets = tickets.filter((ticket) => {
    const search = searchTerm.toLowerCase();
    let matchesSearch = false;
    if (filterType === "title") {
      matchesSearch = ticket.title.toLowerCase().includes(search);
    } else if (filterType === "id") {
      matchesSearch = ticket.id.toLowerCase().includes(search);
    } else {
      matchesSearch =
        ticket.title.toLowerCase().includes(search) ||
        ticket.id.toLowerCase().includes(search);
    }
    const matchesStatus =
      statusFilter === "all" || ticket.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  // --- HELPER FUNCTIONS & COMPONENTS (no changes needed here) ---
  const getStatusIcon = (status: string) => {
    /* ... same as before ... */ switch (status) {
      case "new":
        return <Clock className="h-3 w-3 sm:h-4 sm:w-4" />;
      case "accepted":
        return <AlertCircle className="h-3 w-3 sm:h-4 sm:w-4" />;
      case "in-progress":
        return <Clock className="h-3 w-3 sm:h-4 sm:w-4" />;
      case "resolved":
        return <CheckCircle className="h-3 w-3 sm:h-4 sm:w-4" />;
      case "rejected":
        return <XCircle className="h-3 w-3 sm:h-4 sm:w-4" />;
      default:
        return <Clock className="h-3 w-3 sm:h-4 sm:w-4" />;
    }
  };
  const getStatusColor = (status: string) => {
    /* ... same as before ... */ switch (status) {
      case "new":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "accepted":
        return "bg-purple-100 text-purple-800 border-purple-200";
      case "in-progress":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "resolved":
        return "bg-green-100 text-green-800 border-green-200";
      case "rejected":
        return "bg-red-100 text-red-800 border-red-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };
  const getPriorityColor = (priority: string) => {
    /* ... same as before ... */ switch (priority) {
      case "high":
        return "bg-red-100 text-red-800 border-red-200";
      case "medium":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "low":
        return "bg-green-100 text-green-800 border-green-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };
  const ProgressIndicator: React.FC<{ status: string }> = ({ status }) => {
    /* ... same as before ... */ const stages = [
      { key: "new", label: "New", icon: AlertCircle },
      { key: "accepted", label: "Accepted", icon: CheckCircle },
      { key: "in-progress", label: "In Progress", icon: Clock },
      { key: "resolved", label: "Resolved", icon: CheckCircle },
    ];
    const currentIndex = stages.findIndex((stage) => stage.key === status);
    return (
      <div className="flex items-center justify-between mb-4 sm:mb-6 bg-gray-50 dark:bg-gray-700 rounded-xl p-3 sm:p-4">
        {" "}
        {stages.map((stage, index) => {
          const Icon = stage.icon;
          const isActive = index <= currentIndex;
          const isCurrent = index === currentIndex;
          return (
            <div key={stage.key} className="flex items-center flex-1">
              {" "}
              <div className="flex flex-col items-center">
                {" "}
                <div
                  className={`w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center transition-all duration-300 ${
                    isActive
                      ? isCurrent
                        ? "bg-blue-600 text-white shadow-lg scale-110"
                        : "bg-green-600 text-white"
                      : "bg-gray-200 text-gray-400"
                  }`}
                >
                  {" "}
                  <Icon className="h-3 w-3 sm:h-5 sm:w-5" />{" "}
                </div>{" "}
                <span
                  className={`text-xs mt-1 sm:mt-2 font-medium ${
                    isActive ? "text-gray-400" : "text-gray-400"
                  }`}
                >
                  {" "}
                  {stage.label}{" "}
                </span>{" "}
              </div>{" "}
              {index < stages.length - 1 && (
                <div
                  className={`flex-1 h-0.5 sm:h-1 mx-2 sm:mx-4 rounded transition-all duration-300 ${
                    index < currentIndex
                      ? "bg-green-600"
                      : "bg-gray-200 dark:bg-gray-600"
                  }`}
                />
              )}{" "}
            </div>
          );
        })}{" "}
      </div>
    );
  };

  // --- CONDITIONAL RENDERING for loading and error states ---
  if (isLoading) {
    return (
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="text-center">
          <Loader2 className="h-12 w-12 text-blue-600 animate-spin mx-auto" />
          <h2 className="mt-4 text-xl font-semibold text-gray-700 dark:text-gray-200">
            Loading Your Tickets...
          </h2>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="text-center bg-red-50 dark:bg-red-900/20 p-8 rounded-lg">
          <XCircle className="h-12 w-12 text-red-500 mx-auto" />
          <h2 className="mt-4 text-xl font-semibold text-red-700 dark:text-red-300">
            An Error Occurred
          </h2>
          <p className="text-red-600 dark:text-red-400">{error}</p>
        </div>
      </div>
    );
  }

  // --- RENDER the main UI with live data ---
  return (
    <div className="flex-1 overflow-auto">
      <div className="min-h-full bg-gradient-to-br from-blue-50 via-white to-blue-50 dark:from-gray-900 dark:via-gray-800 dark:to-blue-900 p-4 sm:p-6 lg:p-8">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="text-center mb-6 sm:mb-8">
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white mb-2">
              Track My Tickets
            </h1>
            <p className="text-base sm:text-lg text-gray-600 dark:text-gray-300">
              Monitor the progress of your submitted incidents
            </p>
          </div>

          {/* Search and Filter */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-700 p-4 sm:p-6 mb-6 sm:mb-8">
            <div className="flex flex-col lg:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 sm:left-4 top-1/2 transform -translate-y-1/2 h-4 w-4 sm:h-5 sm:w-5 text-gray-400 dark:text-gray-500" />
                <input
                  type="text"
                  placeholder={`Search tickets by ${filterType}...`}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 sm:pl-12 pr-3 sm:pr-4 py-2.5 sm:py-3 text-sm sm:text-base border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500"
                />
              </div>
              <div className="flex items-center space-x-3">
                <Filter className="h-4 w-4 sm:h-5 sm:w-5 text-gray-400 dark:text-gray-500" />
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="px-3 sm:px-4 py-2.5 sm:py-3 text-sm sm:text-base border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                >
                  <option value="all">All Status</option>
                  <option value="new">New</option>
                  <option value="accepted">Accepted</option>
                  <option value="in-progress">In Progress</option>
                  <option value="resolved">Resolved</option>
                  <option value="rejected">Rejected</option>
                </select>
                <select
                  value={filterType}
                  onChange={(e) => setFilterType(e.target.value)}
                  className="px-3 sm:px-4 py-2.5 sm:py-3 text-sm sm:text-base border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                >
                  <option value="title">Title</option>
                  <option value="id">ID</option>
                  <option value="both">Title & ID</option>
                </select>
              </div>
            </div>
          </div>

          {/* Tickets List */}
          <div className="space-y-4 sm:space-y-6">
            {filteredTickets.length > 0 ? (
              filteredTickets.map((ticket) => (
                <div
                  key={ticket.id}
                  className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-700 overflow-hidden"
                >
                  {/* All the JSX for a ticket card remains the same, it will now use the live mapped data */}
                  <div className="p-4 sm:p-6">
                    <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4 mb-4 sm:mb-6">
                      <div className="flex-1">
                        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between mb-3 space-y-2 sm:space-y-0">
                          <div>
                            <h3 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white mb-1">
                              {ticket.title}
                            </h3>
                            <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 font-mono">
                              {ticket.id}
                            </p>
                          </div>
                          <div className="flex flex-wrap items-center gap-2">
                            <span
                              className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border ${getPriorityColor(
                                ticket.priority
                              )}`}
                            >
                              {" "}
                              {ticket.priority.toUpperCase()}{" "}
                            </span>
                            <span
                              className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border ${getStatusColor(
                                ticket.status
                              )}`}
                            >
                              {" "}
                              {getStatusIcon(ticket.status)}{" "}
                              <span className="ml-1">
                                {ticket.status.charAt(0).toUpperCase() +
                                  ticket.status.slice(1).replace("-", " ")}
                              </span>{" "}
                            </span>
                          </div>
                        </div>
                      </div>
                      <button className="flex items-center space-x-2 px-3 sm:px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors shadow-lg text-sm sm:text-base">
                        {" "}
                        <Eye className="h-3 w-3 sm:h-4 sm:w-4" />{" "}
                        <span>View Details</span>{" "}
                      </button>
                    </div>
                    <ProgressIndicator status={ticket.status} />
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 p-3 sm:p-4 bg-gray-50 dark:bg-gray-700 rounded-xl">
                      <div className="flex items-center space-x-2 sm:space-x-3">
                        {" "}
                        <div className="bg-blue-100 dark:bg-blue-900/50 p-1.5 sm:p-2 rounded-lg">
                          {" "}
                          <User className="h-3 w-3 sm:h-4 sm:w-4 text-blue-600" />{" "}
                        </div>{" "}
                        <div>
                          {" "}
                          <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                            Category
                          </p>{" "}
                          <p className="text-xs sm:text-sm font-semibold text-gray-900 dark:text-white">
                            {ticket.category}
                          </p>{" "}
                        </div>{" "}
                      </div>
                      <div className="flex items-center space-x-2 sm:space-x-3">
                        {" "}
                        <div className="bg-green-100 dark:bg-green-900/50 p-1.5 sm:p-2 rounded-lg">
                          {" "}
                          <User className="h-3 w-3 sm:h-4 sm:w-4 text-green-600" />{" "}
                        </div>{" "}
                        <div>
                          {" "}
                          <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                            Assigned Team
                          </p>{" "}
                          <p className="text-xs sm:text-sm font-semibold text-gray-900 dark:text-white">
                            {ticket.assignedTeam}
                          </p>{" "}
                        </div>{" "}
                      </div>
                      <div className="flex items-center space-x-2 sm:space-x-3">
                        {" "}
                        <div className="bg-purple-100 dark:bg-purple-900/50 p-1.5 sm:p-2 rounded-lg">
                          {" "}
                          <User className="h-3 w-3 sm:h-4 sm:w-4 text-purple-600" />{" "}
                        </div>{" "}
                        <div>
                          {" "}
                          <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                            Assigned Member
                          </p>{" "}
                          <p className="text-xs sm:text-sm font-semibold text-gray-900 dark:text-white">
                            {ticket.assignedAgent || "Unassigned"}
                          </p>{" "}
                        </div>{" "}
                      </div>
                      <div className="flex items-center space-x-2 sm:space-x-3">
                        {" "}
                        <div className="bg-orange-100 dark:bg-orange-900/50 p-1.5 sm:p-2 rounded-lg">
                          {" "}
                          <Calendar className="h-3 w-3 sm:h-4 sm:w-4 text-orange-600" />{" "}
                        </div>{" "}
                        <div>
                          {" "}
                          <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                            Last Updated
                          </p>{" "}
                          <p className="text-xs sm:text-sm font-semibold text-gray-900 dark:text-white">
                            {new Date(ticket.updatedAt).toLocaleDateString()}
                          </p>{" "}
                        </div>{" "}
                      </div>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-12 sm:py-16">
                {" "}
                <div className="flex justify-center mb-4 sm:mb-6">
                  {" "}
                  <div className="bg-gray-100 dark:bg-gray-700 p-4 sm:p-6 rounded-full">
                    {" "}
                    <Search className="h-8 w-8 sm:h-12 sm:w-12 text-gray-400 dark:text-gray-500" />{" "}
                  </div>{" "}
                </div>{" "}
                <h3 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-white mb-2">
                  No tickets found
                </h3>{" "}
                <p className="text-sm sm:text-base text-gray-600 dark:text-gray-300 mb-4 sm:mb-6">
                  It looks like you haven't submitted any tickets yet, or none
                  match your current search.
                </p>{" "}
                <button className="px-4 sm:px-6 py-2.5 sm:py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors text-sm sm:text-base">
                  {" "}
                  Submit New Ticket{" "}
                </button>{" "}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TrackTickets;
