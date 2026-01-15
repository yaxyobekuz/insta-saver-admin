// Icons
import {
  Link,
  Plus,
  Copy,
  Trash2,
  Users,
  Loader2,
  RefreshCw,
  CheckCircle,
  XCircle,
  Eye,
  Edit2,
  Calendar,
  TrendingUp,
} from "lucide-react";

// Toast
import { toast } from "sonner";

// Utils
import { formatDateUZ } from "@/utils/date.utils";

// Router
import { useSearchParams } from "react-router-dom";

// API
import * as inviteLinksAPI from "@/api/inviteLinks.api";

// React
import { useState, useEffect, useCallback } from "react";

// Components
import Card from "@/components/ui/card.component";
import Input from "@/components/form/input.component";
import Select from "@/components/form/select.component";
import Button from "@/components/form/button.component";
import Pagination from "@/components/ui/pagination.component";
import SimpleModal from "@/components/modals/simple.modal";

// Bot username - should match your bot
const BOT_USERNAME = "topinstasaverbot";

// Create Link Modal
const CreateLinkModal = ({ isOpen, onClose, onSuccess }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      toast.error("Havola nomini kiriting");
      return;
    }

    setIsLoading(true);
    try {
      await inviteLinksAPI.createInviteLink(formData);
      toast.success("Havola muvaffaqiyatli yaratildi");
      setFormData({ name: "", description: "" });
      onSuccess();
      onClose();
    } catch (error) {
      toast.error(error.message || "Havolani yaratishda xatolik");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SimpleModal
      isOpen={isOpen}
      onClose={onClose}
      title="Yangi havola yaratish"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="Havola nomi"
          placeholder="masalan: promo_2026"
          value={formData.name}
          onChange={(e) =>
            setFormData((prev) => ({
              ...prev,
              name: e.toLowerCase().replace(/[^a-z0-9_-]/g, ""),
            }))
          }
          helperText="Faqat kichik harflar, raqamlar, - va _ ishlatilishi mumkin"
        />
        <Input
          label="Tavsif (ixtiyoriy)"
          placeholder="Havola haqida qisqacha ma'lumot"
          value={formData.description}
          onChange={(e) => setFormData((prev) => ({ ...prev, description: e }))}
        />
        <div className="flex gap-3 pt-2">
          <Button type="button" variant="secondary" onClick={onClose} fullWidth>
            Bekor qilish
          </Button>
          <Button type="submit" isLoading={isLoading} fullWidth>
            Yaratish
          </Button>
        </div>
      </form>
    </SimpleModal>
  );
};

// Edit Link Modal
const EditLinkModal = ({ isOpen, onClose, link, onSuccess }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    description: link?.description || "",
    isActive: link?.isActive ?? true,
  });

  useEffect(() => {
    if (link) {
      setFormData({
        description: link.description || "",
        isActive: link.isActive,
      });
    }
  }, [link]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await inviteLinksAPI.updateInviteLink(link._id, formData);
      toast.success("Havola muvaffaqiyatli yangilandi");
      onSuccess();
      onClose();
    } catch (error) {
      toast.error(error.message || "Havolani yangilashda xatolik");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SimpleModal isOpen={isOpen} onClose={onClose} title="Havolani tahrirlash">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="p-3 bg-gray-50 rounded-lg">
          <p className="text-sm text-gray-500">Havola nomi</p>
          <p className="font-medium">{link?.name}</p>
        </div>
        <Input
          label="Tavsif"
          placeholder="Havola haqida qisqacha ma'lumot"
          value={formData.description}
          onChange={(e) => setFormData((prev) => ({ ...prev, description: e }))}
        />
        <Select
          label="Holat"
          value={formData.isActive ? "active" : "inactive"}
          onChange={(v) =>
            setFormData((prev) => ({ ...prev, isActive: v === "active" }))
          }
          options={[
            { value: "active", label: "Faol" },
            { value: "inactive", label: "Nofaol" },
          ]}
        />
        <div className="flex gap-3 pt-2">
          <Button type="button" variant="secondary" onClick={onClose} fullWidth>
            Bekor qilish
          </Button>
          <Button type="submit" isLoading={isLoading} fullWidth>
            Saqlash
          </Button>
        </div>
      </form>
    </SimpleModal>
  );
};

// Invited Users Modal
const InvitedUsersModal = ({ isOpen, onClose, link }) => {
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [pagination, setPagination] = useState({});
  const [page, setPage] = useState(1);

  const fetchUsers = useCallback(async () => {
    if (!link?._id) return;
    setIsLoading(true);
    try {
      const response = await inviteLinksAPI.getInvitedUsers(link._id, {
        page,
        limit: 20,
      });
      setUsers(response.data);
      setPagination(response.pagination);
    } catch (error) {
      toast.error("Foydalanuvchilarni yuklashda xatolik");
    } finally {
      setIsLoading(false);
    }
  }, [link?._id, page]);

  useEffect(() => {
    if (isOpen && link) {
      fetchUsers();
    }
  }, [isOpen, link, fetchUsers]);

  return (
    <SimpleModal
      isOpen={isOpen}
      onClose={onClose}
      title={`"${link?.name}" orqali qo'shilganlar`}
    >
      <div className="space-y-4">
        <div className="p-3 bg-indigo-50 rounded-lg flex items-center gap-3">
          <Users className="size-5 text-indigo-600" />
          <div>
            <p className="text-sm text-indigo-600">Jami qo'shilganlar</p>
            <p className="font-semibold text-indigo-700">
              {link?.stats?.totalJoins || 0} ta foydalanuvchi
            </p>
          </div>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="size-8 animate-spin text-indigo-500" />
          </div>
        ) : users.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            Hali hech kim qo'shilmagan
          </div>
        ) : (
          <div className="space-y-2 max-h-80 overflow-y-auto">
            {users.map((item) => (
              <div
                key={item._id}
                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
              >
                <div className="flex items-center gap-3">
                  <div className="size-9 bg-indigo-100 rounded-full flex items-center justify-center">
                    <span className="text-sm font-medium text-indigo-600">
                      {item.userId?.firstName?.charAt(0) || "?"}
                    </span>
                  </div>
                  <div>
                    <p className="font-medium text-sm">
                      {item.userId?.firstName} {item.userId?.lastName}
                    </p>
                    <p className="text-xs text-gray-500">
                      {item.userId?.username
                        ? `@${item.userId.username}`
                        : `ID: ${item.chatId}`}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-xs text-gray-500">
                    {formatDateUZ(item.createdAt)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}

        {pagination.totalPages > 1 && (
          <div className="pt-2">
            <Pagination
              currentPage={page}
              totalPages={pagination.totalPages}
              onPageChange={setPage}
            />
          </div>
        )}
      </div>
    </SimpleModal>
  );
};

// Main Page Component
const InviteLinksPage = () => {
  // State
  const [links, setLinks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [pagination, setPagination] = useState({});
  const [stats, setStats] = useState(null);

  // Modals
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [usersModalOpen, setUsersModalOpen] = useState(false);
  const [selectedLink, setSelectedLink] = useState(null);

  // Search params
  const [searchParams, setSearchParams] = useSearchParams();
  const currentPage = parseInt(searchParams.get("page") || "1", 10);

  // Filters
  const [filters, setFilters] = useState({
    search: searchParams.get("search") || "",
    isActive: searchParams.get("isActive") || "all",
    sort: searchParams.get("sort") || "createdAt-desc",
  });

  const [searchInput, setSearchInput] = useState(filters.search);

  // Fetch links
  const fetchLinks = useCallback(async () => {
    setIsLoading(true);
    try {
      const [sortBy, sortOrder] = filters.sort.split("-");
      const params = {
        page: currentPage,
        limit: 20,
        sortBy,
        sortOrder,
      };

      if (filters.search) params.search = filters.search;
      if (filters.isActive !== "all") params.isActive = filters.isActive;

      const response = await inviteLinksAPI.getInviteLinks(params);
      setLinks(response.data);
      setPagination(response.pagination);
    } catch (error) {
      toast.error(error.message || "Havolalarni yuklashda xatolik");
    } finally {
      setIsLoading(false);
    }
  }, [currentPage, filters]);

  // Fetch stats
  const fetchStats = useCallback(async () => {
    try {
      const response = await inviteLinksAPI.getInviteLinkStats();
      setStats(response.data);
    } catch (error) {
      console.error("Stats error:", error);
    }
  }, []);

  useEffect(() => {
    fetchLinks();
  }, [fetchLinks]);

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

  // Copy link to clipboard
  const copyLink = (name) => {
    const link = `https://t.me/${BOT_USERNAME}?start=${name}`;
    navigator.clipboard.writeText(link);
    toast.success("Havola nusxalandi!");
  };

  // Delete link
  const handleDelete = async (link) => {
    if (!confirm(`"${link.name}" havolasini o'chirishni tasdiqlaysizmi?`)) {
      return;
    }

    try {
      await inviteLinksAPI.deleteInviteLink(link._id);
      toast.success("Havola muvaffaqiyatli o'chirildi");
      fetchLinks();
      fetchStats();
    } catch (error) {
      toast.error(error.message || "Havolani o'chirishda xatolik");
    }
  };

  // Open edit modal
  const openEditModal = (link) => {
    setSelectedLink(link);
    setEditModalOpen(true);
  };

  // Open users modal
  const openUsersModal = (link) => {
    setSelectedLink(link);
    setUsersModalOpen(true);
  };

  // Refresh data
  const refresh = () => {
    fetchLinks();
    fetchStats();
  };

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      {stats && (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-indigo-100 rounded-lg">
                <Link className="size-5 text-indigo-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{stats.totalLinks}</p>
                <p className="text-sm text-gray-500">Jami havolalar</p>
              </div>
            </div>
          </Card>
          <Card className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-100 rounded-lg">
                <Users className="size-5 text-green-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{stats.totalJoins}</p>
                <p className="text-sm text-gray-500">Jami qo'shilganlar</p>
              </div>
            </div>
          </Card>
          <Card className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Calendar className="size-5 text-blue-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{stats.todayJoins}</p>
                <p className="text-sm text-gray-500">Bugun</p>
              </div>
            </div>
          </Card>
          <Card className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-100 rounded-lg">
                <TrendingUp className="size-5 text-purple-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{stats.thisWeekJoins}</p>
                <p className="text-sm text-gray-500">Bu hafta</p>
              </div>
            </div>
          </Card>
        </div>
      )}

      {/* Filters */}
      <Card>
        <div className="flex flex-col sm:flex-row gap-4">
          <Input
            placeholder="Qidirish..."
            value={searchInput}
            onChange={(e) => setSearchInput(e)}
            className="w-full"
          />

          <Select
            value={filters.isActive}
            onChange={(v) => handleFilterChange("isActive", v)}
            options={[
              { value: "all", label: "Barcha holatlar" },
              { value: "true", label: "Faol" },
              { value: "false", label: "Nofaol" },
            ]}
            className="w-full"
          />

          <Select
            value={filters.sort}
            onChange={(v) => handleFilterChange("sort", v)}
            options={[
              { value: "createdAt-desc", label: "Yangi" },
              { value: "createdAt-asc", label: "Eski" },
              { value: "stats.totalJoins-desc", label: "Ko'p qo'shilgan" },
              { value: "stats.totalJoins-asc", label: "Kam qo'shilgan" },
              { value: "name-asc", label: "Nom (A-Z)" },
              { value: "name-desc", label: "Nom (Z-A)" },
            ]}
            className="w-full"
          />

          <Button
            variant="secondary"
            onClick={refresh}
            className="shrink-0 sm:w-11 sm:p-0"
          >
            <RefreshCw className="size-4" />
          </Button>
        </div>
      </Card>

      {/* Links List */}
      <Card>
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="size-8 animate-spin text-indigo-500" />
          </div>
        ) : links.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            <Link className="size-12 mx-auto mb-4 text-gray-300" />
            <p>Havolalar topilmadi</p>
            <Button
              onClick={() => setCreateModalOpen(true)}
              className="mt-4"
              variant="secondary"
            >
              <Plus className="size-4 mr-2" />
              Yangi havola yaratish
            </Button>
          </div>
        ) : (
          <ul className="divide-y">
            {links.map((link) => (
              <li
                key={link._id}
                className="flex flex-col sm:flex-row sm:items-center gap-4 py-4"
              >
                {/* Link Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    {/* Link Name */}
                    <h3 className="capitalize font-semibold text-gray-900 truncate">
                      {link.name}
                    </h3>

                    {/* Status Badge */}
                    {link.isActive ? (
                      <span className="inline-flex items-center gap-1 px-1 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-700">
                        <CheckCircle className="size-3" />
                        Faol
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 px-1 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-600">
                        <XCircle className="size-3" />
                        Nofaol
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-4 mt-2 text-sm text-gray-500">
                    {/* Total joined */}
                    <span className="flex items-center gap-1">
                      <Users className="size-4" />
                      {link.stats?.totalJoins || 0} ta qo'shilgan
                    </span>

                    {/* Created date */}
                    <span className="flex items-center gap-1">
                      <Calendar className="size-4" />
                      {formatDateUZ(link.createdAt)}
                    </span>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2">
                  <Button
                    size="sm"
                    variant="secondary"
                    onClick={() => copyLink(link.name)}
                    title="Havolani nusxalash"
                  >
                    <Copy className="size-4" />
                  </Button>

                  <Button
                    size="sm"
                    variant="secondary"
                    onClick={() => openUsersModal(link)}
                    title="Qo'shilganlarni ko'rish"
                  >
                    <Eye className="size-4" />
                  </Button>

                  <Button
                    size="sm"
                    variant="secondary"
                    onClick={() => openEditModal(link)}
                    title="Tahrirlash"
                  >
                    <Edit2 className="size-4" />
                  </Button>

                  <Button
                    size="sm"
                    variant="danger"
                    onClick={() => handleDelete(link)}
                    title="O'chirish"
                  >
                    <Trash2 className="size-4" />
                  </Button>
                </div>
              </li>
            ))}
          </ul>
        )}

        {/* Pagination */}
        {pagination.totalPages > 1 && (
          <div className="p-4 border-t">
            <Pagination
              currentPage={currentPage}
              totalPages={pagination.totalPages}
              onPageChange={goToPage}
            />
          </div>
        )}
      </Card>

      {/* Modals */}
      <CreateLinkModal
        isOpen={createModalOpen}
        onClose={() => setCreateModalOpen(false)}
        onSuccess={() => {
          fetchLinks();
          fetchStats();
        }}
      />

      {selectedLink && (
        <>
          <EditLinkModal
            isOpen={editModalOpen}
            onClose={() => {
              setEditModalOpen(false);
              setSelectedLink(null);
            }}
            link={selectedLink}
            onSuccess={() => {
              fetchLinks();
              fetchStats();
            }}
          />
          <InvitedUsersModal
            isOpen={usersModalOpen}
            onClose={() => {
              setUsersModalOpen(false);
              setSelectedLink(null);
            }}
            link={selectedLink}
          />
        </>
      )}
    </div>
  );
};

export default InviteLinksPage;
