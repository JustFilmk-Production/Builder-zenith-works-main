import React, { useState, useMemo } from "react";
import { useProjectStore, User } from "../../store/projectStore";
import AdminLayout from "../../components/admin/AdminLayout";

const UsersAdmin: React.FC = () => {
  const { users, addUser, updateUser, deleteUser } = useProjectStore();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [sortBy, setSortBy] = useState<string>("name");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [selectedUsers, setSelectedUsers] = useState<number[]>([]);
  const [showUserDetails, setShowUserDetails] = useState<User | null>(null);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    role: "viewer" as const,
    isActive: true,
  });

  const resetForm = () => {
    setFormData({
      name: "",
      email: "",
      role: "viewer",
      isActive: true,
    });
    setEditingUser(null);
    setIsFormOpen(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (editingUser) {
      updateUser(editingUser.id, formData);
    } else {
      addUser(formData);
    }

    resetForm();
  };

  const handleEdit = (user: User) => {
    setEditingUser(user);
    setFormData({
      name: user.name,
      email: user.email,
      role: user.role,
      isActive: user.isActive,
    });
    setIsFormOpen(true);
  };

  const handleDelete = (id: number) => {
    if (window.confirm("Are you sure you want to delete this user?")) {
      deleteUser(id);
    }
  };

  const handleBulkAction = (action: string) => {
    switch (action) {
      case "activate":
        selectedUsers.forEach((id) => updateUser(id, { isActive: true }));
        break;
      case "deactivate":
        selectedUsers.forEach((id) => updateUser(id, { isActive: false }));
        break;
      case "delete":
        if (
          window.confirm(
            `Are you sure you want to delete ${selectedUsers.length} users?`,
          )
        ) {
          selectedUsers.forEach((id) => deleteUser(id));
        }
        break;
    }
    setSelectedUsers([]);
  };

  const toggleUserSelection = (id: number) => {
    setSelectedUsers((prev) =>
      prev.includes(id) ? prev.filter((uid) => uid !== id) : [...prev, id],
    );
  };

  // Enhanced filtering and sorting
  const filteredUsers = useMemo(() => {
    let filtered = users.filter((user) => {
      const matchesSearch =
        user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesRole = roleFilter === "all" || user.role === roleFilter;
      const matchesStatus =
        statusFilter === "all" ||
        (statusFilter === "active" && user.isActive) ||
        (statusFilter === "inactive" && !user.isActive);

      return matchesSearch && matchesRole && matchesStatus;
    });

    // Apply sorting
    filtered.sort((a, b) => {
      let aValue, bValue;

      switch (sortBy) {
        case "name":
          aValue = a.name.toLowerCase();
          bValue = b.name.toLowerCase();
          break;
        case "email":
          aValue = a.email.toLowerCase();
          bValue = b.email.toLowerCase();
          break;
        case "role":
          aValue = a.role;
          bValue = b.role;
          break;
        case "lastLogin":
          aValue = new Date(a.lastLogin).getTime();
          bValue = new Date(b.lastLogin).getTime();
          break;
        case "created":
          aValue = new Date(a.createdAt).getTime();
          bValue = new Date(b.createdAt).getTime();
          break;
        default:
          aValue = a.name.toLowerCase();
          bValue = b.name.toLowerCase();
      }

      if (sortOrder === "asc") {
        return aValue < bValue ? -1 : aValue > bValue ? 1 : 0;
      } else {
        return aValue > bValue ? -1 : aValue < bValue ? 1 : 0;
      }
    });

    return filtered;
  }, [users, searchTerm, roleFilter, statusFilter, sortBy, sortOrder]);

  const roleColors = {
    admin:
      "text-verse-accent-red bg-verse-accent-red/20 border-verse-accent-red/30",
    manager:
      "text-verse-accent-blue bg-verse-accent-blue/20 border-verse-accent-blue/30",
    viewer:
      "text-verse-accent-green bg-verse-accent-green/20 border-verse-accent-green/30",
  };

  const stats = {
    total: users.length,
    active: users.filter((u) => u.isActive).length,
    admin: users.filter((u) => u.role === "admin").length,
    manager: users.filter((u) => u.role === "manager").length,
    viewer: users.filter((u) => u.role === "viewer").length,
  };

  const getRolePermissions = (role: string) => {
    switch (role) {
      case "admin":
        return [
          "Full system access",
          "User management",
          "Project management",
          "Analytics access",
          "System settings",
        ];
      case "manager":
        return [
          "Project management",
          "View analytics",
          "User view access",
          "Map configuration",
        ];
      case "viewer":
        return ["View projects", "View basic analytics", "Read-only access"];
      default:
        return [];
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-8">
        {/* Enhanced Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-verse-3xl font-verse-bold text-verse-text-primary">
              👥 User Management
            </h1>
            <p className="text-verse-lg text-verse-text-secondary mt-2">
              Manage user accounts, roles, and permissions
            </p>
          </div>
          <div className="flex space-x-3">
            <button
              onClick={() => setIsFormOpen(true)}
              className="
                px-6 py-3
                bg-gradient-to-r from-verse-accent-blue to-verse-accent-purple
                text-white rounded-verse
                hover:shadow-verse-blue-glow hover:scale-105
                transition-all duration-verse
                flex items-center space-x-2
                font-verse-medium
              "
            >
              <span>👤</span>
              <span>Add New User</span>
            </button>
            <button
              onClick={() => {
                /* Export function */
              }}
              className="
                px-4 py-3
                bg-verse-glass-bg hover:bg-verse-glass-hover
                border border-verse-glass-border
                text-verse-text-primary
                rounded-verse
                transition-all duration-verse
                flex items-center space-x-2
              "
            >
              <span>📊</span>
              <span>Export Report</span>
            </button>
          </div>
        </div>

        {/* Stats Dashboard */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
          {[
            {
              label: "Total Users",
              value: stats.total,
              icon: "👥",
              color: "blue",
            },
            {
              label: "Active Users",
              value: stats.active,
              icon: "✅",
              color: "green",
            },
            {
              label: "Admins",
              value: stats.admin,
              icon: "👑",
              color: "red",
            },
            {
              label: "Managers",
              value: stats.manager,
              icon: "🏢",
              color: "purple",
            },
            {
              label: "Viewers",
              value: stats.viewer,
              icon: "👁️",
              color: "orange",
            },
          ].map((stat, index) => (
            <div
              key={stat.label}
              className="
                bg-verse-glass-bg backdrop-blur-verse
                border border-verse-glass-border
                rounded-verse-lg p-6
                hover:bg-verse-glass-hover
                transition-all duration-verse
                animate-scale-in
              "
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="flex items-center justify-between mb-4">
                <div className="text-2xl">{stat.icon}</div>
                <div
                  className={`text-verse-2xl font-verse-bold text-verse-accent-${stat.color}`}
                >
                  {stat.value}
                </div>
              </div>
              <div className="text-verse-sm text-verse-text-secondary">
                {stat.label}
              </div>
            </div>
          ))}
        </div>

        {/* Filters and Controls */}
        <div className="bg-verse-glass-bg backdrop-blur-verse border border-verse-glass-border rounded-verse-lg p-6">
          <div className="flex flex-wrap items-center justify-between gap-4">
            {/* Search */}
            <div className="flex-1 min-w-64">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search users by name or email..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="
                    w-full px-4 py-2 pl-10
                    bg-verse-glass-hover
                    border border-verse-glass-border
                    rounded-verse
                    text-verse-text-primary
                    placeholder-verse-text-secondary
                    focus:outline-none focus:ring-2 focus:ring-verse-accent-blue/50
                  "
                />
                <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-verse-text-secondary">
                  🔍
                </div>
              </div>
            </div>

            {/* Filters */}
            <div className="flex items-center space-x-4">
              <select
                value={roleFilter}
                onChange={(e) => setRoleFilter(e.target.value)}
                className="px-3 py-2 bg-verse-glass-hover border border-verse-glass-border rounded-verse text-verse-text-primary"
              >
                <option value="all">All Roles</option>
                <option value="admin">Admin</option>
                <option value="manager">Manager</option>
                <option value="viewer">Viewer</option>
              </select>

              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-3 py-2 bg-verse-glass-hover border border-verse-glass-border rounded-verse text-verse-text-primary"
              >
                <option value="all">All Status</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>

              <select
                value={`${sortBy}-${sortOrder}`}
                onChange={(e) => {
                  const [field, order] = e.target.value.split("-");
                  setSortBy(field);
                  setSortOrder(order as "asc" | "desc");
                }}
                className="px-3 py-2 bg-verse-glass-hover border border-verse-glass-border rounded-verse text-verse-text-primary"
              >
                <option value="name-asc">Name A-Z</option>
                <option value="name-desc">Name Z-A</option>
                <option value="email-asc">Email A-Z</option>
                <option value="role-asc">Role</option>
                <option value="lastLogin-desc">Last Login</option>
                <option value="created-desc">Newest First</option>
              </select>
            </div>
          </div>

          {/* Bulk Actions */}
          {selectedUsers.length > 0 && (
            <div className="mt-4 p-4 bg-verse-accent-blue/10 border border-verse-accent-blue/30 rounded-verse">
              <div className="flex items-center justify-between">
                <span className="text-verse-sm text-verse-text-primary">
                  {selectedUsers.length} user(s) selected
                </span>
                <div className="flex space-x-2">
                  <button
                    onClick={() => handleBulkAction("activate")}
                    className="px-3 py-1 bg-verse-accent-green text-white rounded-verse text-verse-sm hover:bg-verse-accent-green/80"
                  >
                    Activate
                  </button>
                  <button
                    onClick={() => handleBulkAction("deactivate")}
                    className="px-3 py-1 bg-verse-accent-orange text-white rounded-verse text-verse-sm hover:bg-verse-accent-orange/80"
                  >
                    Deactivate
                  </button>
                  <button
                    onClick={() => handleBulkAction("delete")}
                    className="px-3 py-1 bg-verse-accent-red text-white rounded-verse text-verse-sm hover:bg-verse-accent-red/80"
                  >
                    Delete
                  </button>
                  <button
                    onClick={() => setSelectedUsers([])}
                    className="px-3 py-1 bg-verse-glass-hover text-verse-text-primary rounded-verse text-verse-sm border border-verse-glass-border"
                  >
                    Clear
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Users Table */}
        <div className="bg-verse-glass-bg backdrop-blur-verse border border-verse-glass-border rounded-verse-lg overflow-hidden">
          <div className="p-6 border-b border-verse-glass-border">
            <h3 className="text-verse-xl font-verse-semibold text-verse-text-primary">
              Users ({filteredUsers.length})
            </h3>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-verse-glass-hover border-b border-verse-glass-border">
                <tr>
                  <th className="px-6 py-4 text-left">
                    <input
                      type="checkbox"
                      onChange={(e) => {
                        if (e.target.checked) {
                          setSelectedUsers(filteredUsers.map((u) => u.id));
                        } else {
                          setSelectedUsers([]);
                        }
                      }}
                      checked={
                        selectedUsers.length === filteredUsers.length &&
                        filteredUsers.length > 0
                      }
                      className="w-4 h-4 rounded border-verse-glass-border"
                    />
                  </th>
                  <th className="px-6 py-4 text-left text-verse-sm font-verse-semibold text-verse-text-primary">
                    User
                  </th>
                  <th className="px-6 py-4 text-left text-verse-sm font-verse-semibold text-verse-text-primary">
                    Role
                  </th>
                  <th className="px-6 py-4 text-left text-verse-sm font-verse-semibold text-verse-text-primary">
                    Status
                  </th>
                  <th className="px-6 py-4 text-left text-verse-sm font-verse-semibold text-verse-text-primary">
                    Last Login
                  </th>
                  <th className="px-6 py-4 text-left text-verse-sm font-verse-semibold text-verse-text-primary">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map((user) => (
                  <tr
                    key={user.id}
                    className="border-b border-verse-glass-border hover:bg-verse-glass-hover transition-colors"
                  >
                    <td className="px-6 py-4">
                      <input
                        type="checkbox"
                        checked={selectedUsers.includes(user.id)}
                        onChange={() => toggleUserSelection(user.id)}
                        className="w-4 h-4 rounded border-verse-glass-border"
                      />
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-3">
                        <div
                          className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-verse-semibold bg-gradient-to-r ${
                            user.role === "admin"
                              ? "from-verse-accent-red to-verse-accent-orange"
                              : user.role === "manager"
                                ? "from-verse-accent-blue to-verse-accent-purple"
                                : "from-verse-accent-green to-verse-accent-blue"
                          }`}
                        >
                          {user.name.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <div className="text-verse-sm font-verse-medium text-verse-text-primary">
                            {user.name}
                          </div>
                          <div className="text-verse-xs text-verse-text-secondary">
                            {user.email}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`
                        px-3 py-1 rounded-verse-sm text-verse-xs font-verse-medium border
                        ${roleColors[user.role]}
                      `}
                      >
                        {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-2">
                        <div
                          className={`w-2 h-2 rounded-full ${
                            user.isActive
                              ? "bg-verse-accent-green"
                              : "bg-verse-accent-red"
                          }`}
                        ></div>
                        <span
                          className={`text-verse-xs ${
                            user.isActive
                              ? "text-verse-accent-green"
                              : "text-verse-accent-red"
                          }`}
                        >
                          {user.isActive ? "Active" : "Inactive"}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-verse-xs text-verse-text-secondary">
                        {new Date(user.lastLogin).toLocaleDateString()}
                        <br />
                        {new Date(user.lastLogin).toLocaleTimeString()}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => setShowUserDetails(user)}
                          className="px-2 py-1 text-verse-xs bg-verse-accent-blue/20 text-verse-accent-blue rounded-verse hover:bg-verse-accent-blue/30 transition-colors"
                        >
                          View
                        </button>
                        <button
                          onClick={() => handleEdit(user)}
                          className="px-2 py-1 text-verse-xs bg-verse-accent-green/20 text-verse-accent-green rounded-verse hover:bg-verse-accent-green/30 transition-colors"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(user.id)}
                          className="px-2 py-1 text-verse-xs bg-verse-accent-red/20 text-verse-accent-red rounded-verse hover:bg-verse-accent-red/30 transition-colors"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {filteredUsers.length === 0 && (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">👥</div>
              <h3 className="text-verse-lg font-verse-semibold text-verse-text-primary mb-2">
                No users found
              </h3>
              <p className="text-verse-text-secondary">
                Try adjusting your search or filter criteria
              </p>
            </div>
          )}
        </div>

        {/* User Form Modal */}
        {isFormOpen && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-verse-glass-bg backdrop-blur-verse border border-verse-glass-border rounded-verse-lg w-full max-w-md">
              <div className="p-6 border-b border-verse-glass-border">
                <h3 className="text-verse-xl font-verse-semibold text-verse-text-primary">
                  {editingUser ? "Edit User" : "Add New User"}
                </h3>
              </div>

              <form onSubmit={handleSubmit} className="p-6 space-y-6">
                <div>
                  <label className="block text-verse-sm font-verse-medium text-verse-text-primary mb-2">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    className="w-full px-4 py-2 bg-verse-glass-hover border border-verse-glass-border rounded-verse text-verse-text-primary focus:outline-none focus:ring-2 focus:ring-verse-accent-blue/50"
                  />
                </div>

                <div>
                  <label className="block text-verse-sm font-verse-medium text-verse-text-primary mb-2">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                    className="w-full px-4 py-2 bg-verse-glass-hover border border-verse-glass-border rounded-verse text-verse-text-primary focus:outline-none focus:ring-2 focus:ring-verse-accent-blue/50"
                  />
                </div>

                <div>
                  <label className="block text-verse-sm font-verse-medium text-verse-text-primary mb-2">
                    Role *
                  </label>
                  <select
                    value={formData.role}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        role: e.target.value as any,
                      })
                    }
                    className="w-full px-4 py-2 bg-verse-glass-hover border border-verse-glass-border rounded-verse text-verse-text-primary focus:outline-none focus:ring-2 focus:ring-verse-accent-blue/50"
                  >
                    <option value="viewer">Viewer</option>
                    <option value="manager">Manager</option>
                    <option value="admin">Admin</option>
                  </select>
                  <div className="mt-2 p-3 bg-verse-glass-hover rounded-verse">
                    <div className="text-verse-xs text-verse-text-secondary mb-2">
                      Role Permissions:
                    </div>
                    <ul className="text-verse-xs text-verse-text-primary space-y-1">
                      {getRolePermissions(formData.role).map((permission) => (
                        <li
                          key={permission}
                          className="flex items-center space-x-2"
                        >
                          <span className="text-verse-accent-green">✓</span>
                          <span>{permission}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <input
                    type="checkbox"
                    id="isActive"
                    checked={formData.isActive}
                    onChange={(e) =>
                      setFormData({ ...formData, isActive: e.target.checked })
                    }
                    className="w-4 h-4 rounded border-verse-glass-border"
                  />
                  <label
                    htmlFor="isActive"
                    className="text-verse-sm text-verse-text-primary"
                  >
                    Active User
                  </label>
                </div>

                <div className="flex space-x-4 pt-6 border-t border-verse-glass-border">
                  <button
                    type="submit"
                    className="flex-1 px-6 py-3 bg-gradient-to-r from-verse-accent-blue to-verse-accent-purple text-white rounded-verse hover:shadow-verse-blue-glow transition-all duration-verse font-verse-medium"
                  >
                    {editingUser ? "Update User" : "Create User"}
                  </button>
                  <button
                    type="button"
                    onClick={resetForm}
                    className="px-6 py-3 bg-verse-glass-hover border border-verse-glass-border text-verse-text-primary rounded-verse hover:bg-verse-glass-border transition-all duration-verse"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* User Details Modal */}
        {showUserDetails && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-verse-glass-bg backdrop-blur-verse border border-verse-glass-border rounded-verse-lg w-full max-w-lg">
              <div className="p-6 border-b border-verse-glass-border">
                <div className="flex items-center justify-between">
                  <h3 className="text-verse-xl font-verse-semibold text-verse-text-primary">
                    User Details
                  </h3>
                  <button
                    onClick={() => setShowUserDetails(null)}
                    className="text-verse-text-secondary hover:text-verse-text-primary"
                  >
                    ✕
                  </button>
                </div>
              </div>

              <div className="p-6 space-y-6">
                <div className="flex items-center space-x-4">
                  <div
                    className={`w-16 h-16 rounded-full flex items-center justify-center text-white font-verse-bold text-verse-xl bg-gradient-to-r ${
                      showUserDetails.role === "admin"
                        ? "from-verse-accent-red to-verse-accent-orange"
                        : showUserDetails.role === "manager"
                          ? "from-verse-accent-blue to-verse-accent-purple"
                          : "from-verse-accent-green to-verse-accent-blue"
                    }`}
                  >
                    {showUserDetails.name.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <h4 className="text-verse-lg font-verse-semibold text-verse-text-primary">
                      {showUserDetails.name}
                    </h4>
                    <p className="text-verse-text-secondary">
                      {showUserDetails.email}
                    </p>
                    <div className="flex items-center space-x-2 mt-1">
                      <span
                        className={`
                        px-2 py-1 rounded-verse-sm text-verse-xs font-verse-medium border
                        ${roleColors[showUserDetails.role]}
                      `}
                      >
                        {showUserDetails.role.charAt(0).toUpperCase() +
                          showUserDetails.role.slice(1)}
                      </span>
                      <div
                        className={`w-2 h-2 rounded-full ${
                          showUserDetails.isActive
                            ? "bg-verse-accent-green"
                            : "bg-verse-accent-red"
                        }`}
                      ></div>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <div className="text-verse-xs text-verse-text-secondary mb-1">
                      Last Login
                    </div>
                    <div className="text-verse-sm text-verse-text-primary">
                      {new Date(showUserDetails.lastLogin).toLocaleDateString()}
                      <br />
                      {new Date(showUserDetails.lastLogin).toLocaleTimeString()}
                    </div>
                  </div>
                  <div>
                    <div className="text-verse-xs text-verse-text-secondary mb-1">
                      Account Created
                    </div>
                    <div className="text-verse-sm text-verse-text-primary">
                      {new Date(showUserDetails.createdAt).toLocaleDateString()}
                    </div>
                  </div>
                </div>

                <div>
                  <div className="text-verse-xs text-verse-text-secondary mb-2">
                    Permissions
                  </div>
                  <div className="bg-verse-glass-hover rounded-verse p-3">
                    <ul className="text-verse-xs text-verse-text-primary space-y-1">
                      {getRolePermissions(showUserDetails.role).map(
                        (permission) => (
                          <li
                            key={permission}
                            className="flex items-center space-x-2"
                          >
                            <span className="text-verse-accent-green">✓</span>
                            <span>{permission}</span>
                          </li>
                        ),
                      )}
                    </ul>
                  </div>
                </div>

                <div className="flex space-x-3 pt-4 border-t border-verse-glass-border">
                  <button
                    onClick={() => {
                      setShowUserDetails(null);
                      handleEdit(showUserDetails);
                    }}
                    className="flex-1 px-4 py-2 bg-verse-accent-blue text-white rounded-verse hover:bg-verse-accent-blue/80 transition-colors"
                  >
                    Edit User
                  </button>
                  <button
                    onClick={() => setShowUserDetails(null)}
                    className="px-4 py-2 bg-verse-glass-hover border border-verse-glass-border text-verse-text-primary rounded-verse hover:bg-verse-glass-border transition-colors"
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default UsersAdmin;
