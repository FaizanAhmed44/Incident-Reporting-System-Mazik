import React, { useState, useEffect, KeyboardEvent } from "react";
import {
  Search,
  Plus,
  Edit3,
  Trash2,
  X,
  User,
  Building,
  Calendar,
} from "lucide-react";
import { get_users, Staff } from "../../api/users_to_admin";
import { addStaffUser } from "../../api/add_staff";
import { updateStaffUser, UpdateStaffRequest } from "../../api/edit_staff";
import { deleteStaffUser } from "../../api/delete_staff";
import { CustomLoader } from '../ui/CustomLoader';


interface NewStaff {
  id: string;
  name: string;
  email: string;
  department: string;
  skillset: string;
  joinDate: string;
  status: "active" | "inactive";
  lastLogin?: string;
}

interface EditingStaffState extends Omit<NewStaff, "skillset"> {
  skillset: string[];
}

const StaffManagement: React.FC = () => {
  const [staffMembers, setStaffMembers] = useState<NewStaff[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [departmentFilter, setDepartmentFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingStaff, setEditingStaff] = useState<EditingStaffState | null>(
    null
  );
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(
    null
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [newStaff, setNewStaff] = useState({
    name: "",
    email: "",
    department: "",
    skillset: [] as string[],
    password: "",
  });
  const [currentSkill, setCurrentSkill] = useState("");
  const [currentEditSkill, setCurrentEditSkill] = useState("");

  const [validationErrors, setValidationErrors] = useState({
    email: "",
    password: "",
  });
  const [editValidationErrors, setEditValidationErrors] = useState({
    name: "",
    email: "",
  });

  const departments = [
    "HR",
    "IT Support",
    "Finance & Operations (MBS)",
    "Customer Experience/CRM",
    "Administration",
  ];

  useEffect(() => {
    const fetchStaff = async () => {
      try {
        setLoading(true);
        const staffData = await get_users();
        const mappedStaff: NewStaff[] = staffData.map((staff: Staff) => ({
          id: staff.cr6dd_UserID.cr6dd_userid,
          name: staff.cr6dd_UserID.cr6dd_name,
          email: staff.cr6dd_UserID.cr6dd_email,
          department: staff.cr6dd_departmentname,
          skillset: staff.cr6dd_skillset || "",
          joinDate: staff.cr6dd_UserID.createdon.split("T")[0],
          status: staff.cr6dd_availability === "True" ? "active" : "inactive",
          lastLogin: undefined,
        }));
        setStaffMembers(mappedStaff);
        setLoading(false);
      } catch (err) {
        setError("Failed to load staff members. Please try again later.");
        setLoading(false);
      }
    };

    fetchStaff();
  }, []);

  const filteredStaff = staffMembers.filter((staff) => {
    const matchesSearch =
      staff.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      staff.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      staff.skillset.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDepartment =
      departmentFilter === "all" || staff.department === departmentFilter;
    const matchesStatus =
      statusFilter === "all" || staff.status === statusFilter;

    return matchesSearch && matchesDepartment && matchesStatus;
  });

  const validateForm = () => {
    const errors = { email: "", password: "" };
    let isValid = true;

    // Email validation
    if (!newStaff.email.endsWith("@mazikcloud.com")) {
      errors.email = "Email must end with @mazikcloud.com";
      isValid = false;
    }

    // Password validation
    if (newStaff.password.length <= 4) {
      errors.password = "Password must be longer than 4 characters.";
      isValid = false;
    }

    setValidationErrors(errors);
    return isValid;
  };

  const validateEditForm = () => {
    if (!editingStaff) return false;
    const errors = { name: "", email: "" };
    let isValid = true;
    if (!editingStaff.name.trim()) {
      errors.name = "Name cannot be empty.";
      isValid = false;
    }
    if (!editingStaff.email.endsWith("@mazikcloud.com")) {
      errors.email = "Email must end with @mazikcloud.com";
      isValid = false;
    }
    setEditValidationErrors(errors);
    return isValid;
  };

  const handleAddStaff = async () => {
    // Run validation before submitting
    if (!validateForm()) {
      return;
    }

    try {
      // Convert skillset array to a comma-separated string for the API
      const apiPayload = {
        ...newStaff,
        skillset: newStaff.skillset.join(","),
      };

      const response = await addStaffUser(apiPayload);
      const newStaffMember: NewStaff = {
        id: response.staff_id,
        name: newStaff.name,
        email: newStaff.email,
        department: newStaff.department,
        skillset: newStaff.skillset.join(","), // Store as comma-separated for consistency
        joinDate: new Date().toISOString().split("T")[0],
        status: "active",
        lastLogin: undefined,
      };
      setStaffMembers([...staffMembers, newStaffMember]);
      // Reset form
      setNewStaff({
        name: "",
        email: "",
        department: "",
        skillset: [],
        password: "",
      });
      setValidationErrors({ email: "", password: "" });
      setShowAddModal(false);
    } catch (err) {
      setError("Failed to add staff member. Please try again.");
    }
  };

  // --- CHANGE 4: Skillset input handling ---
  const handleSkillKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "," || e.key === "Enter") {
      e.preventDefault();
      const skill = currentSkill.trim();
      if (skill && !newStaff.skillset.includes(skill)) {
        setNewStaff((prev) => ({
          ...prev,
          skillset: [...prev.skillset, skill],
        }));
      }
      setCurrentSkill("");
    }
  };

  const removeSkill = (skillToRemove: string) => {
    setNewStaff((prev) => ({
      ...prev,
      skillset: prev.skillset.filter((skill) => skill !== skillToRemove),
    }));
  };

  const handleEditStaff = (staff: NewStaff) => {
    setEditingStaff({
      ...staff,
      // Convert the string "Skill1,Skill2" into an array ["Skill1", "Skill2"]
      skillset: staff.skillset
        ? staff.skillset
            .split(",")
            .map((s) => s.trim())
            .filter(Boolean)
        : [],
    });
    setEditValidationErrors({ name: "", email: "" });
  };

  const handleSaveEdit = async () => {
    if (!validateEditForm()) return;

    if (editingStaff) {
      try {
        const updateData: UpdateStaffRequest = {
          id: editingStaff.id,
          name: editingStaff.name,
          email: editingStaff.email,
          department: editingStaff.department,
          // Convert the skillset array back to a comma-separated string for the API
          skillset: editingStaff.skillset.join(","),
          status: editingStaff.status === "active" ? "True" : "False",
        };

        await updateStaffUser(updateData);

        // Update local state, storing skillset as comma-separated string
        const updatedStaffMember: NewStaff = {
          ...editingStaff,
          skillset: editingStaff.skillset.join(","),
        };

        setStaffMembers(
          staffMembers.map((emp) =>
            emp.id === editingStaff.id ? updatedStaffMember : emp
          )
        );
        setEditingStaff(null);
      } catch (err) {
        setError("Failed to update staff member. Please try again.");
      }
    }
  };

  const handleEditSkillKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "," || e.key === "Enter") {
      e.preventDefault();
      const skill = currentEditSkill.trim();
      if (skill && editingStaff && !editingStaff.skillset.includes(skill)) {
        setEditingStaff((prev) =>
          prev ? { ...prev, skillset: [...prev.skillset, skill] } : null
        );
      }
      setCurrentEditSkill("");
    }
  };

  const removeEditSkill = (skillToRemove: string) => {
    setEditingStaff((prev) =>
      prev
        ? {
            ...prev,
            skillset: prev.skillset.filter((skill) => skill !== skillToRemove),
          }
        : null
    );
  };

  const handleDeleteStaff = async (id: string) => {
    try {
      const deleteData = { id };
      const response = await deleteStaffUser(deleteData);
      console.log("Staff deleted successfully:", response);

      setStaffMembers(staffMembers.filter((emp) => emp.id !== id));
      setShowDeleteConfirm(null);
      setError(null);
    } catch (err: any) {
      console.error("Error in handleDeleteStaff:", {
        message: err.message,
        response: err.response
          ? {
              status: err.response.status,
              data: err.response.data,
            }
          : "No response data",
      });

      let errorMessage = "Failed to delete staff member. Please try again.";
      if (err.response) {
        if (err.response.status === 400) {
          errorMessage = "Invalid staff ID provided.";
        } else if (err.response.status === 401) {
          errorMessage =
            "Unauthorized. Please check your authentication credentials.";
        } else if (err.response.status === 404) {
          errorMessage = "Staff member not found.";
        } else if (err.response.status >= 500) {
          errorMessage = "Server error. Please try again later.";
        }
      }
      setError(errorMessage);
    }
  };

  const getSkillsetColor = () =>
    "bg-purple-100 text-purple-800 dark:bg-purple-900/50 dark:text-purple-300";

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="text-center">
          <CustomLoader />
          <h2 className="mt-4 text-xl font-semibold text-gray-700 dark:text-gray-200">
            Loading Employee Details...
          </h2>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex-1 overflow-auto p-4 sm:p-6 lg:p-8 bg-gray-50 dark:bg-gray-900">
        <div className="max-w-7xl mx-auto text-center">
          <p className="text-red-600 dark:text-red-300">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-auto p-4 sm:p-6 lg:p-8 bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 sm:mb-8 space-y-4 sm:space-y-0">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">
              Staff Management
            </h1>
            <p className="text-sm sm:text-base text-gray-600 dark:text-gray-300 mt-2">
              Manage staff accounts and permissions
            </p>
          </div>
          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center space-x-2 px-4 sm:px-6 py-2.5 sm:py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors shadow-lg text-sm sm:text-base"
          >
            <Plus className="h-4 w-4 sm:h-5 sm:w-5" />
            <span>Add Staff</span>
          </button>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-4 sm:p-6 mb-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 dark:text-gray-500" />
              <input
                type="text"
                placeholder="Search staff..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 text-sm border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500"
              />
            </div>

            <select
              value={departmentFilter}
              onChange={(e) => setDepartmentFilter(e.target.value)}
              className="px-3 py-2.5 text-sm border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            >
              <option value="all">All Departments</option>
              {departments.map((dept) => (
                <option key={dept} value={dept}>
                  {dept}
                </option>
              ))}
            </select>

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2.5 text-sm border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 dark:bg-gray-700">
                <tr>
                  <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Staff
                  </th>
                  <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Department
                  </th>
                  <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Skillset
                  </th>
                  <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Join Date
                  </th>
                  <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-600">
                {filteredStaff.map((staff) => (
                  <tr
                    key={staff.id}
                    className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                  >
                    <td className="px-4 sm:px-6 py-4">
                      <div className="flex items-center space-x-3">
                        <div className="bg-blue-100 dark:bg-blue-900/50 p-2 rounded-full">
                          <User className="h-4 w-4 text-blue-600" />
                        </div>
                        <div>
                          <div className="text-sm font-medium text-gray-900 dark:text-white">
                            {staff.name}
                          </div>
                          <div className="text-sm text-gray-500 dark:text-gray-400">
                            {staff.email}
                          </div>
                          <div className="text-xs text-gray-400 dark:text-gray-500">
                            ID: {staff.id}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 sm:px-6 py-4">
                      <div className="flex items-center space-x-2">
                        <Building className="h-4 w-4 text-gray-400 dark:text-gray-500" />
                        <span className="text-sm text-gray-900 dark:text-white">
                          {staff.department}
                        </span>
                      </div>
                    </td>
                    <td className="px-4 sm:px-6 py-4">
                      <div className="flex flex-wrap gap-2">
                        {staff.skillset
                          ? staff.skillset
                              .split(",")
                              .map((s) => s.trim())
                              .filter(Boolean)
                              .map((skill, index) => (
                                <span
                                  key={index}
                                  className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getSkillsetColor()}`}
                                >
                                  {skill}
                                </span>
                              ))
                          : null}
                      </div>
                    </td>
                    <td className="px-4 sm:px-6 py-4">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          staff.status === "active"
                            ? "bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300"
                            : "bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-300"
                        }`}
                      >
                        {staff.status.charAt(0).toUpperCase() +
                          staff.status.slice(1)}
                      </span>
                    </td>
                    <td className="px-4 sm:px-6 py-4">
                      <div className="flex items-center space-x-2">
                        <Calendar className="h-4 w-4 text-gray-400 dark:text-gray-500" />
                        <span className="text-sm text-gray-900 dark:text-white">
                          {new Date(staff.joinDate).toLocaleDateString()}
                        </span>
                      </div>
                    </td>
                    <td className="px-4 sm:px-6 py-4">
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => handleEditStaff(staff)}
                          className="p-1.5 text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded transition-colors"
                        >
                          <Edit3 className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => setShowDeleteConfirm(staff.id)}
                          className="p-1.5 text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300 hover:bg-red-50 dark:hover:bg-red-900/20 rounded transition-colors"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {filteredStaff.length === 0 && (
            <div className="text-center py-12">
              <div className="flex justify-center mb-4">
                <div className="bg-gray-100 dark:bg-gray-700 p-4 rounded-full">
                  <User className="h-8 w-8 text-gray-400 dark:text-gray-500" />
                </div>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                No staff found
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                Try adjusting your search criteria or filters
              </p>
            </div>
          )}
        </div>

        {showAddModal && (
          <div className="fixed inset-0 z-50 overflow-y-auto">
            <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
              <div
                className="fixed inset-0 transition-opacity bg-gray-500 bg-opacity-75 dark:bg-gray-900 dark:bg-opacity-75"
                onClick={() => setShowAddModal(false)}
              />

              <div className="inline-block w-full max-w-md p-6 my-8 overflow-hidden text-left align-middle transition-all transform bg-white dark:bg-gray-800 shadow-xl rounded-2xl">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    Add New Staff
                  </h3>
                  <button
                    onClick={() => setShowAddModal(false)}
                    className="p-2 text-gray-400 hover:text-gray-600 dark:text-gray-300 dark:hover:text-gray-100 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Full Name
                    </label>
                    <input
                      type="text"
                      value={newStaff.name}
                      onChange={(e) =>
                        setNewStaff({ ...newStaff, name: e.target.value })
                      }
                      className="w-full px-3 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      placeholder="Enter full name"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Email Address
                    </label>
                    <input
                      type="email"
                      value={newStaff.email}
                      onChange={(e) =>
                        setNewStaff({ ...newStaff, email: e.target.value })
                      }
                      className={`w-full px-3 py-2.5 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white ${
                        validationErrors.email
                          ? "border-red-500"
                          : "border-gray-300 dark:border-gray-600"
                      }`}
                      placeholder="Enter email address"
                    />
                    {validationErrors.email && (
                      <p className="text-xs text-red-500 mt-1">
                        {validationErrors.email}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Department
                    </label>
                    <select
                      value={newStaff.department}
                      onChange={(e) =>
                        setNewStaff({ ...newStaff, department: e.target.value })
                      }
                      className="w-full px-3 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    >
                      <option value="">Select Department</option>
                      {departments.map((dept) => (
                        <option key={dept} value={dept}>
                          {dept}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Skillset
                    </label>
                    <div className="flex flex-wrap items-center gap-2 p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700">
                      {newStaff.skillset.map((skill, index) => (
                        <div
                          key={index}
                          className="flex items-center bg-purple-100 text-purple-800 dark:bg-purple-900/50 dark:text-purple-300 text-sm font-medium px-2.5 py-1 rounded-full"
                        >
                          {skill}
                          <button
                            onClick={() => removeSkill(skill)}
                            className="ml-1.5 text-purple-600 hover:text-purple-800 dark:text-purple-300 dark:hover:text-purple-100"
                          >
                            <X className="h-4 w-4" />
                          </button>
                        </div>
                      ))}
                      <input
                        type="text"
                        value={currentSkill}
                        onChange={(e) => setCurrentSkill(e.target.value)}
                        onKeyDown={handleSkillKeyDown}
                        className="flex-grow bg-transparent outline-none p-1 text-gray-900 dark:text-white"
                        placeholder="Add a skill..."
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Password
                    </label>
                    <input
                      type="password"
                      value={newStaff.password}
                      onChange={(e) =>
                        setNewStaff({ ...newStaff, password: e.target.value })
                      }
                      className={`w-full px-3 py-2.5 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white ${
                        validationErrors.password
                          ? "border-red-500"
                          : "border-gray-300 dark:border-gray-600"
                      }`}
                      placeholder="Enter password"
                    />
                    {validationErrors.password && (
                      <p className="text-xs text-red-500 mt-1">
                        {validationErrors.password}
                      </p>
                    )}
                  </div>
                </div>

                <div className="flex space-x-3 mt-6">
                  <button
                    onClick={() => setShowAddModal(false)}
                    className="flex-1 px-4 py-2.5 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleAddStaff}
                    disabled={
                      !newStaff.name ||
                      !newStaff.email ||
                      !newStaff.department ||
                      !newStaff.password
                    }
                    className="flex-1 px-4 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
                  >
                    Add Staff
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {editingStaff && (
          <div className="fixed inset-0 z-50 overflow-y-auto">
            <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
              <div
                className="fixed inset-0 transition-opacity bg-gray-500 bg-opacity-75 dark:bg-gray-900 dark:bg-opacity-75"
                onClick={() => setEditingStaff(null)}
              />

              <div className="inline-block w-full max-w-md p-6 my-8 overflow-hidden text-left align-middle transition-all transform bg-white dark:bg-gray-800 shadow-xl rounded-2xl">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    Edit Staff
                  </h3>
                  <button
                    onClick={() => setEditingStaff(null)}
                    className="p-2 text-gray-400 hover:text-gray-600 dark:text-gray-300 dark:hover:text-gray-100 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Full Name
                    </label>
                    <input
                      type="text"
                      value={editingStaff.name}
                      onChange={(e) =>
                        setEditingStaff({
                          ...editingStaff,
                          name: e.target.value,
                        })
                      }
                      className={`w-full px-3 py-2.5 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white ${
                        editValidationErrors.name
                          ? "border-red-500"
                          : "border-gray-300 dark:border-gray-600"
                      }`}
                    />
                    {editValidationErrors.name && (
                      <p className="text-xs text-red-500 mt-1">
                        {editValidationErrors.name}
                      </p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Email Address
                    </label>
                    <input
                      type="email"
                      value={editingStaff.email}
                      onChange={(e) =>
                        setEditingStaff({
                          ...editingStaff,
                          email: e.target.value,
                        })
                      }
                      className={`w-full px-3 py-2.5 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white ${
                        editValidationErrors.email
                          ? "border-red-500"
                          : "border-gray-300 dark:border-gray-600"
                      }`}
                    />
                    {editValidationErrors.email && (
                      <p className="text-xs text-red-500 mt-1">
                        {editValidationErrors.email}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Department
                    </label>
                    <select
                      value={editingStaff.department}
                      onChange={(e) =>
                        setEditingStaff({
                          ...editingStaff,
                          department: e.target.value,
                        })
                      }
                      className="w-full px-3 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    >
                      {departments.map((dept) => (
                        <option key={dept} value={dept}>
                          {dept}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Skillset
                    </label>
                    <div className="flex flex-wrap items-center gap-2 p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700">
                      {editingStaff.skillset.map((skill, index) => (
                        <div
                          key={index}
                          className="flex items-center bg-purple-100 text-purple-800 dark:bg-purple-900/50 dark:text-purple-300 text-sm font-medium px-2.5 py-1 rounded-full"
                        >
                          {skill}
                          <button
                            onClick={() => removeEditSkill(skill)}
                            className="ml-1.5 text-purple-600 hover:text-purple-800 dark:text-purple-300 dark:hover:text-purple-100"
                          >
                            <X className="h-4 w-4" />
                          </button>
                        </div>
                      ))}
                      <input
                        type="text"
                        value={currentEditSkill}
                        onChange={(e) => setCurrentEditSkill(e.target.value)}
                        onKeyDown={handleEditSkillKeyDown}
                        className="flex-grow bg-transparent outline-none p-1 text-gray-900 dark:text-white"
                        placeholder="Add a skill..."
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Status
                    </label>
                    <select
                      value={editingStaff.status}
                      onChange={(e) =>
                        setEditingStaff({
                          ...editingStaff,
                          status: e.target.value as "active" | "inactive",
                        })
                      }
                      className="w-full px-3 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    >
                      <option value="active">Active</option>
                      <option value="inactive">Inactive</option>
                    </select>
                  </div>
                </div>

                <div className="flex space-x-3 mt-6">
                  <button
                    onClick={() => setEditingStaff(null)}
                    className="flex-1 px-4 py-2.5 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSaveEdit}
                    className="flex-1 px-4 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Save Changes
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {showDeleteConfirm && (
          <div className="fixed inset-0 z-50 overflow-y-auto">
            <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
              <div
                className="fixed inset-0 transition-opacity bg-gray-500 bg-opacity-75 dark:bg-gray-900 dark:bg-opacity-75"
                onClick={() => setShowDeleteConfirm(null)}
              />

              <div className="inline-block w-full max-w-md p-6 my-8 overflow-hidden text-left align-middle transition-all transform bg-white dark:bg-gray-800 shadow-xl rounded-2xl">
                <div className="flex items-center space-x-3 mb-4">
                  <div className="bg-red-100 dark:bg-red-900/50 p-2 rounded-full">
                    <Trash2 className="h-5 w-5 text-red-600" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    Delete Staff
                  </h3>
                </div>

                <p className="text-gray-600 dark:text-gray-300 mb-6">
                  Are you sure you want to delete this staff member? This action
                  cannot be undone.
                </p>

                <div className="flex space-x-3">
                  <button
                    onClick={() => setShowDeleteConfirm(null)}
                    className="flex-1 px-4 py-2.5 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => handleDeleteStaff(showDeleteConfirm)}
                    className="flex-1 px-4 py-2.5 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default StaffManagement;