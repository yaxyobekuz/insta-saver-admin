// Toast
import { toast } from "sonner";

// API
import * as usersAPI from "@/api/users.api";

// Utils
import { formatDateUZ } from "@/utils/date.utils";

// Router
import { useSearchParams } from "react-router-dom";

// Icons
import { Users, Download, RefreshCw } from "lucide-react";

// Components
import Card from "@/components/ui/card.component";
import Input from "@/components/form/input.component";
import Select from "@/components/form/select.component";
import Button from "@/components/form/button.component";
import Pagination from "@/components/ui/pagination.component";

// React
import { useState, useEffect, useCallback, useMemo } from "react";

// Data
import languages, { getLangLabel } from "@/data/languages.data";
import { recentOptions, sortOptions, statusOptions } from "@/data/filters.data";

const UsersPage = () => {
  // State
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [pagination, setPagination] = useState({});
  const [stats, setStats] = useState(null);

  // Search params
  const [searchParams, setSearchParams] = useSearchParams();
  const currentPage = parseInt(searchParams.get("page") || "1", 10);

  // Filters state
  const [filters, setFilters] = useState({
    search: searchParams.get("search") || "",
    lang: searchParams.get("lang") || "all",
    statsFilter: searchParams.get("statsFilter") || "all",
    recentDays: searchParams.get("recentDays") || "",
    sort: searchParams.get("sort") || "createdAt-desc",
  });

  // Debounced search
  const [searchInput, setSearchInput] = useState(filters.search);

  // Parse sort value
  const parsedSort = useMemo(() => {
    const [sortBy, sortOrder] = filters.sort.split("-");
    return { sortBy, sortOrder };
  }, [filters.sort]);

  // Fetch users
  const fetchUsers = useCallback(async () => {
    setIsLoading(true);
    try {
      const params = {
        page: currentPage,
        limit: 24,
        sortBy: parsedSort.sortBy,
        sortOrder: parsedSort.sortOrder,
      };

      // Add filters
      if (filters.search) params.search = filters.search;
      if (filters.lang !== "all") params.lang = filters.lang;
      if (filters.statsFilter !== "all")
        params.statsFilter = filters.statsFilter;
      if (filters.recentDays) params.recentDays = filters.recentDays;

      const response = await usersAPI.getUsers(params);
      setUsers(response.data);
      setPagination(response.pagination);
    } catch (error) {
      toast.error(error.message || "Foydalanuvchilarni yuklashda xatolik");
    } finally {
      setIsLoading(false);
    }
  }, [currentPage, filters, parsedSort]);

  // Fetch user stats
  const fetchStats = useCallback(async () => {
    try {
      const response = await usersAPI.getUserStats();
      setStats(response.data);
    } catch (error) {
      console.error("Stats error:", error);
    }
  }, []);

  // Initial load
  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchInput !== filters.search) {
        setFilters((prev) => ({ ...prev, search: searchInput }));
        updateSearchParams({ search: searchInput, page: "1" });
      }
    }, 500);
    return () => clearTimeout(timer);
  }, [searchInput]);

  // Update search params
  const updateSearchParams = (updates) => {
    const newParams = new URLSearchParams(searchParams);
    Object.entries(updates).forEach(([key, value]) => {
      if (value && value !== "all" && value !== "") {
        newParams.set(key, value);
      } else {
        newParams.delete(key);
      }
    });
    setSearchParams(newParams);
  };

  // Handle filter change
  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
    updateSearchParams({ [key]: value, page: "1" });
  };

  // Handle page change
  const goToPage = (page) => {
    updateSearchParams({ page: page.toString() });
  };

  // Reset filters
  const resetFilters = () => {
    setFilters({
      search: "",
      lang: "all",
      statsFilter: "all",
      recentDays: "",
      sort: "createdAt-desc",
    });
    setSearchInput("");
    setSearchParams({});
  };

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      {stats && (
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          <Card className="!p-4">
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center size-10 bg-indigo-100 rounded-lg">
                <Users className="size-5 text-indigo-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Jami foydalanuvchilar</p>
                <p className="text-xl font-bold text-gray-900">
                  {stats.totalUsers?.toLocaleString()}
                </p>
              </div>
            </div>
          </Card>

          {stats.languageStats?.slice(0, 7).map((lang) => (
            <Card key={lang._id} className="!p-4">
              <div className="flex items-center gap-3">
                <div className="flex items-center justify-center size-10 bg-gray-100 rounded-lg">
                  <span className="text-lg">
                    {getLangLabel(lang._id).slice(0, 2)}
                  </span>
                </div>
                <div>
                  <p className="text-sm text-gray-500">
                    {getLangLabel(lang._id)}
                  </p>
                  <p className="text-xl font-bold text-gray-900">
                    {lang.count?.toLocaleString()}
                  </p>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Filters */}
      <Card className="!p-4">
        <div className="flex flex-wrap gap-3">
          {/* Search */}
          <div className="flex-1 min-w-[200px]">
            <Input
              size="md"
              name="search"
              value={searchInput}
              placeholder="Qidirish (ism, username)..."
              onChange={setSearchInput}
            />
          </div>

          {/* Language Filter */}
          <div className="w-40">
            <Select
              size="md"
              name="lang"
              value={filters.lang}
              options={languages}
              placeholder="Til"
              onChange={(value) => handleFilterChange("lang", value)}
            />
          </div>

          {/* Stats Filter */}
          <div className="w-48">
            <Select
              size="md"
              name="statsFilter"
              value={filters.statsFilter}
              options={statusOptions}
              placeholder="Faollik"
              onChange={(value) => handleFilterChange("statsFilter", value)}
            />
          </div>

          {/* Recent Filter */}
          <div className="w-40">
            <Select
              size="md"
              name="recentDays"
              value={filters.recentDays}
              options={recentOptions}
              placeholder="Vaqt"
              onChange={(value) => handleFilterChange("recentDays", value)}
            />
          </div>

          {/* Sort */}
          <div className="w-44">
            <Select
              size="md"
              name="sort"
              value={filters.sort}
              options={sortOptions}
              placeholder="Saralash"
              onChange={(value) => handleFilterChange("sort", value)}
            />
          </div>

          {/* Reset Button */}
          <Button
            size="md"
            variant="neutral"
            onClick={resetFilters}
            className="px-3"
          >
            <RefreshCw className="size-4" />
          </Button>
        </div>
      </Card>

      {/* Table */}
      <Card responsive>
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <div className="spin-loader size-8" />
          </div>
        ) : users.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            <Users className="size-12 mx-auto mb-3 opacity-50" />
            <p>Foydalanuvchilar topilmadi</p>
          </div>
        ) : (
          <>
            <div className="rounded-lg overflow-x-auto">
              <table className="w-full divide-y divide-gray-200">
                <thead>
                  <tr>
                    <th className="px-4 py-3 text-left tracking-wider">
                      Foydalanuvchi
                    </th>
                    <th className="px-4 py-3 text-left tracking-wider">
                      Username
                    </th>
                    <th className="px-4 py-3 text-left tracking-wider">Til</th>
                    <th className="px-4 py-3 text-center tracking-wider">
                      <Download className="size-4 inline mr-1" />
                      Yuklab olish
                    </th>
                    <th className="px-4 py-3 text-left tracking-wider">
                      Qo'shilgan
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {users.map((user) => (
                    <tr key={user._id} className="hover:bg-gray-50">
                      {/* Name */}
                      <td className="px-4 py-3 whitespace-nowrap">
                        <div className="flex items-center gap-3">
                          <div className="flex items-center justify-center size-9 bg-indigo-100 rounded-full">
                            <span className="text-sm font-medium text-indigo-600">
                              {user.firstName?.charAt(0)?.toUpperCase() || "?"}
                            </span>
                          </div>
                          <div>
                            <p className="text-sm font-medium text-gray-900">
                              {user.firstName} {user.lastName}
                            </p>
                            <p className="text-xs text-gray-500">
                              ID: {user.chatId}
                            </p>
                          </div>
                        </div>
                      </td>

                      {/* Username */}
                      <td className="px-4 py-3 whitespace-nowrap">
                        <span className="text-sm text-gray-600">
                          {user.username ? `@${user.username}` : "—"}
                        </span>
                      </td>

                      {/* Language */}
                      <td className="px-4 py-3 whitespace-nowrap">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                          {getLangLabel(user.lang)}
                        </span>
                      </td>

                      {/* Stats */}
                      <td className="px-4 py-3 whitespace-nowrap text-center">
                        <div className="flex items-center justify-center gap-3 text-sm">
                          <span
                            className="text-green-600"
                            title="Muvaffaqiyatli"
                          >
                            ✓ {user.stats?.success || 0}
                          </span>
                          <span className="text-red-600" title="Xatolik">
                            ✗ {user.stats?.failed || 0}
                          </span>
                        </div>
                      </td>

                      {/* Created At */}
                      <td className="px-4 py-3 whitespace-nowrap">
                        <span className="text-sm text-gray-500">
                          {formatDateUZ(user.createdAt)}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {pagination.totalPages > 1 && (
              <Pagination
                currentPage={currentPage}
                totalPages={pagination.totalPages}
                hasNextPage={pagination.hasNextPage}
                hasPrevPage={pagination.hasPrevPage}
                onPageChange={goToPage}
                className="pt-6"
              />
            )}
          </>
        )}
      </Card>
    </div>
  );
};

export default UsersPage;
