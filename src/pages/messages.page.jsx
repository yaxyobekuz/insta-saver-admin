// Icons
import {
  Ban,
  Send,
  Users,
  Clock,
  XCircle,
  Loader2,
  ChevronUp,
  ChevronDown,
  CheckCircle,
  AlertCircle,
} from "lucide-react";

// Toast
import { toast } from "sonner";

// Utils
import { formatDateUZ } from "@/utils/date.utils";

// Router
import { useSearchParams } from "react-router-dom";

// API
import * as usersAPI from "@/api/users.api";
import * as settingsAPI from "@/api/settings.api";
import * as broadcastsAPI from "@/api/broadcasts.api";

// React
import { useState, useEffect, useCallback } from "react";

// Components
import Card from "@/components/ui/card.component";
import Input from "@/components/form/input.component";
import Select from "@/components/form/select.component";
import Button from "@/components/form/button.component";
import Pagination from "@/components/ui/pagination.component";

// Data
import { statusOptions } from "@/data/filters.data";
import languages, { getLangLabel } from "@/data/languages.data";

// Status Badge Component
const StatusBadge = ({ status }) => {
  const config = {
    pending: {
      icon: Clock,
      class: "bg-yellow-100 text-yellow-800",
      label: "Kutilmoqda",
    },
    in_progress: {
      icon: Loader2,
      class: "bg-blue-100 text-blue-800",
      label: "Jarayonda",
    },
    completed: {
      icon: CheckCircle,
      class: "bg-green-100 text-green-800",
      label: "Tugallandi",
    },
    cancelled: {
      icon: Ban,
      class: "bg-gray-100 text-gray-800",
      label: "Bekor qilindi",
    },
    failed: {
      icon: XCircle,
      class: "bg-red-100 text-red-800",
      label: "Xatolik",
    },
  };

  const {
    icon: Icon,
    class: className,
    label,
  } = config[status] || config.pending;

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${className}`}
    >
      <Icon
        className={`size-3.5 ${status === "in_progress" ? "animate-spin" : ""}`}
      />
      {label}
    </span>
  );
};

// Recipients Modal Component
const RecipientsModal = ({ broadcast, onClose }) => {
  const [recipients, setRecipients] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [pagination, setPagination] = useState({});
  const [page, setPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState("all");
  const [expandedError, setExpandedError] = useState(null);

  const fetchRecipients = useCallback(async () => {
    setIsLoading(true);
    try {
      const params = { page, limit: 20 };
      if (statusFilter !== "all") params.status = statusFilter;

      const response = await broadcastsAPI.getBroadcastRecipients(
        broadcast._id,
        params
      );
      setRecipients(response.data);
      setPagination(response.pagination);
    } catch (error) {
      toast.error("Yuborilgan foydalanuvchilarni yuklashda xatolik");
    } finally {
      setIsLoading(false);
    }
  }, [broadcast._id, page, statusFilter]);

  useEffect(() => {
    fetchRecipients();
  }, [fetchRecipients]);

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl w-full max-w-3xl max-h-[80vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="p-4 border-b flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold">
              Yuborilgan foydalanuvchilar
            </h3>
            <p className="text-sm text-gray-500 mt-0.5">
              {broadcast.stats?.sent} muvaffaqiyatli, {broadcast.stats?.failed}{" "}
              xatolik
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg"
          >
            <XCircle className="size-5" />
          </button>
        </div>

        {/* Filter */}
        <div className="p-4 border-b">
          <Select
            size="sm"
            value={statusFilter}
            options={[
              { value: "all", label: "Barchasi" },
              { value: "sent", label: "Yuborilgan" },
              { value: "failed", label: "Xatolik" },
              { value: "pending", label: "Kutilmoqda" },
            ]}
            onChange={(v) => {
              setStatusFilter(v);
              setPage(1);
            }}
            className="w-40"
          />
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto">
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="size-8 animate-spin text-indigo-500" />
            </div>
          ) : recipients.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              Foydalanuvchilar topilmadi
            </div>
          ) : (
            <div className="divide-y">
              {recipients.map((r) => (
                <div key={r._id} className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="size-9 bg-gray-100 rounded-full flex items-center justify-center">
                        <span className="text-sm font-medium">
                          {r.userId?.firstName?.charAt(0) || "?"}
                        </span>
                      </div>
                      <div>
                        <p className="font-medium text-sm">
                          {r.userId?.firstName} {r.userId?.lastName}
                        </p>
                        <p className="text-xs text-gray-500">
                          {r.userId?.username
                            ? `@${r.userId.username}`
                            : `ID: ${r.chatId}`}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {r.status === "sent" && (
                        <span className="text-green-600 text-sm">
                          ✓ Yuborildi
                        </span>
                      )}
                      {r.status === "failed" && (
                        <button
                          onClick={() =>
                            setExpandedError(
                              expandedError === r._id ? null : r._id
                            )
                          }
                          className="flex items-center gap-1 text-red-600 text-sm hover:underline"
                        >
                          <AlertCircle className="size-4" />
                          Xatolik
                          {expandedError === r._id ? (
                            <ChevronUp className="size-4" />
                          ) : (
                            <ChevronDown className="size-4" />
                          )}
                        </button>
                      )}
                      {r.status === "pending" && (
                        <span className="text-yellow-600 text-sm">
                          ⏳ Kutilmoqda
                        </span>
                      )}
                    </div>
                  </div>
                  {/* Error details */}
                  {expandedError === r._id && r.error && (
                    <div className="mt-3 p-3 bg-red-50 rounded-lg text-sm text-red-700 font-mono">
                      {r.error}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Pagination */}
        {pagination.totalPages > 1 && (
          <div className="p-4 border-t">
            <Pagination
              currentPage={page}
              totalPages={pagination.totalPages}
              hasNextPage={pagination.hasNextPage}
              hasPrevPage={pagination.hasPrevPage}
              onPageChange={setPage}
            />
          </div>
        )}
      </div>
    </div>
  );
};

const MessagesPage = () => {
  // Form state
  const [message, setMessage] = useState("");
  const [targetLang, setTargetLang] = useState("all");
  const [rateLimit, setRateLimit] = useState(20);
  const [maxRateLimit, setMaxRateLimit] = useState(25);
  const [isSending, setIsSending] = useState(false);

  // Broadcasts state
  const [broadcasts, setBroadcasts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [pagination, setPagination] = useState({});

  // Filter state
  const [searchParams, setSearchParams] = useSearchParams();
  const currentPage = parseInt(searchParams.get("page") || "1", 10);
  const statusFilter = searchParams.get("status") || "all";

  // Modal state
  const [selectedBroadcast, setSelectedBroadcast] = useState(null);

  // User count for selected language
  const [userCount, setUserCount] = useState(null);

  // Fetch settings
  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const response = await settingsAPI.getSettings();
        const broadcastLimit = response.data?.broadcast_rate_limit;
        if (broadcastLimit) {
          setRateLimit(broadcastLimit.value);
          setMaxRateLimit(broadcastLimit.constraints?.max || 25);
        }
      } catch (error) {
        console.error("Settings error:", error);
      }
    };
    fetchSettings();
  }, []);

  // Fetch user count for target language
  useEffect(() => {
    const fetchUserCount = async () => {
      try {
        const params =
          targetLang !== "all" ? { lang: targetLang, limit: 1 } : { limit: 1 };
        const response = await usersAPI.getUsers(params);
        setUserCount(response.pagination?.total || 0);
      } catch (error) {
        setUserCount(null);
      }
    };
    fetchUserCount();
  }, [targetLang]);

  // Fetch broadcasts
  const fetchBroadcasts = useCallback(async () => {
    setIsLoading(true);
    try {
      const params = { page: currentPage, limit: 20 };
      if (statusFilter !== "all") params.status = statusFilter;

      const response = await broadcastsAPI.getBroadcasts(params);
      setBroadcasts(response.data);
      setPagination(response.pagination);
    } catch (error) {
      toast.error("Xabarlar tarixini yuklashda xatolik");
    } finally {
      setIsLoading(false);
    }
  }, [currentPage, statusFilter]);

  useEffect(() => {
    fetchBroadcasts();
  }, [fetchBroadcasts]);

  // Auto-refresh for in-progress broadcasts
  useEffect(() => {
    const hasInProgress = broadcasts.some((b) => b.status === "in_progress");
    if (hasInProgress) {
      const interval = setInterval(fetchBroadcasts, 5000);
      return () => clearInterval(interval);
    }
  }, [broadcasts, fetchBroadcasts]);

  // Handle send
  const handleSend = async () => {
    if (!message.trim()) {
      toast.error("Xabar matnini kiriting");
      return;
    }

    setIsSending(true);
    try {
      await broadcastsAPI.createBroadcast({
        message: message.trim(),
        targetLanguage: targetLang,
        rateLimit: parseInt(rateLimit) || 20,
      });

      toast.success("Xabar yuborish boshlandi");
      setMessage("");
      fetchBroadcasts();
    } catch (error) {
      toast.error(error.message || "Xabar yuborishda xatolik");
    } finally {
      setIsSending(false);
    }
  };

  // Handle cancel
  const handleCancel = async (id) => {
    try {
      await broadcastsAPI.cancelBroadcast(id);
      toast.success("Xabar bekor qilindi");
      fetchBroadcasts();
    } catch (error) {
      toast.error(error.message || "Bekor qilishda xatolik");
    }
  };

  // Handle rate limit change
  const handleRateLimitChange = async (value) => {
    const numValue = Math.min(Math.max(parseInt(value) || 1, 1), maxRateLimit);
    setRateLimit(numValue);
  };

  // Save rate limit
  const saveRateLimit = async () => {
    try {
      await settingsAPI.updateSetting("broadcast_rate_limit", rateLimit);
      toast.success("Tezlik sozlamasi saqlandi");
    } catch (error) {
      toast.error(error.message || "Saqlashda xatolik");
    }
  };

  // Update search params
  const updateSearchParams = (updates) => {
    const newParams = new URLSearchParams(searchParams);
    Object.entries(updates).forEach(([key, value]) => {
      if (value && value !== "all") {
        newParams.set(key, value);
      } else {
        newParams.delete(key);
      }
    });
    setSearchParams(newParams);
  };

  return (
    <div className="space-y-6">
      {/* Send Form */}
      <Card>
        <h2 className="mb-4 text-lg font-semibold flex items-center gap-2">
          <Send className="size-5" />
          Yangi xabar yuborish
        </h2>

        <div className="space-y-4">
          {/* Message Input */}
          <Input
            type="textarea"
            name="message"
            label="Xabar matni"
            value={message}
            onChange={setMessage}
            placeholder="Foydalanuvchilarga yuboriladigan xabar..."
            required
          />

          {/* Options Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Target Language */}
            <Select
              name="targetLang"
              label="Maqsad"
              value={targetLang}
              options={languages}
              onChange={setTargetLang}
            />

            {/* Rate Limit */}
            <div>
              <Input
                type="number"
                name="rateLimit"
                label={`Tezlik (max: ${maxRateLimit}/s)`}
                value={rateLimit}
                onChange={handleRateLimitChange}
                min={1}
                max={maxRateLimit}
              />
            </div>

            {/* User Count */}
            <div className="flex items-end">
              <div className="flex-1 h-11 px-4 bg-gray-50 rounded-lg flex items-center justify-between">
                <span className="text-sm text-gray-600">
                  Maqsad foydalanuvchilar:
                </span>
                <span className="font-bold text-indigo-600">
                  {userCount !== null ? userCount.toLocaleString() : "—"}
                </span>
              </div>
            </div>
          </div>

          {/* Send Button */}
          <div className="flex items-center gap-3">
            <Button
              onClick={handleSend}
              disabled={isSending || !message.trim()}
              className="px-6"
            >
              {isSending ? (
                <>
                  <Loader2 className="size-5 mr-2 animate-spin" />
                  Yuborilmoqda...
                </>
              ) : (
                <>
                  <Send className="size-5 mr-2" />
                  Yuborish
                </>
              )}
            </Button>

            <Button variant="neutral" onClick={saveRateLimit} className="px-4">
              Tezlikni saqlash
            </Button>
          </div>
        </div>
      </Card>

      {/* History Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-gray-900">Xabarlar tarixi</h2>
        <Select
          size="sm"
          value={statusFilter}
          options={statusOptions}
          onChange={(v) => updateSearchParams({ status: v, page: "1" })}
          className="w-44"
        />
      </div>

      {/* History Table */}
      <Card responsive>
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="size-8 animate-spin text-indigo-500" />
          </div>
        ) : broadcasts.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            <Send className="size-12 mx-auto mb-3 opacity-50" />
            <p>Xabarlar tarixi bo'sh</p>
          </div>
        ) : (
          <>
            <div className="rounded-lg overflow-x-auto">
              <table className="w-full divide-y divide-gray-200">
                <thead>
                  <tr>
                    <th className="px-4 py-3 text-left">Xabar</th>
                    <th className="px-4 py-3 text-left">Maqsad</th>
                    <th className="px-4 py-3 text-center">Status</th>
                    <th className="px-4 py-3 text-center">Natija</th>
                    <th className="px-4 py-3 text-left">Sana</th>
                    <th className="px-4 py-3 text-right">Amallar</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {broadcasts.map((broadcast) => (
                    <tr key={broadcast._id} className="hover:bg-gray-50">
                      {/* Message */}
                      <td className="px-4 py-3">
                        <p className="text-sm text-gray-900 line-clamp-2 max-w-xs">
                          {broadcast.message}
                        </p>
                      </td>

                      {/* Target */}
                      <td className="px-4 py-3 whitespace-nowrap">
                        <span className="text-sm text-gray-600">
                          {getLangLabel(broadcast.targetLanguage)}
                        </span>
                      </td>

                      {/* Status */}
                      <td className="px-4 py-3 whitespace-nowrap text-center">
                        <StatusBadge status={broadcast.status} />
                      </td>

                      {/* Stats */}
                      <td className="px-4 py-3 whitespace-nowrap text-center">
                        <div className="flex items-center justify-center gap-3 text-sm">
                          <span className="text-green-600">
                            ✓ {broadcast.stats?.sent || 0}
                          </span>
                          <span className="text-red-600">
                            ✗ {broadcast.stats?.failed || 0}
                          </span>
                          <span className="text-gray-400">
                            / {broadcast.stats?.total || 0}
                          </span>
                        </div>
                      </td>

                      {/* Date */}
                      <td className="px-4 py-3 whitespace-nowrap">
                        <span className="text-sm text-gray-500">
                          {formatDateUZ(broadcast.createdAt)}
                        </span>
                      </td>

                      {/* Actions */}
                      <td className="px-4 py-3 whitespace-nowrap text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Button
                            size="sm"
                            variant="neutral"
                            onClick={() => setSelectedBroadcast(broadcast)}
                            className="px-3 h-8 text-xs"
                          >
                            <Users className="size-3.5 mr-1" />
                            Ko'rish
                          </Button>

                          {(broadcast.status === "pending" ||
                            broadcast.status === "in_progress") && (
                            <Button
                              size="sm"
                              variant="danger"
                              onClick={() => handleCancel(broadcast._id)}
                              className="px-3 h-8 text-xs"
                            >
                              <Ban className="size-3.5 mr-1" />
                              Bekor
                            </Button>
                          )}
                        </div>
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
                onPageChange={(p) => updateSearchParams({ page: p.toString() })}
                className="pt-6"
              />
            )}
          </>
        )}
      </Card>

      {/* Recipients Modal */}
      {selectedBroadcast && (
        <RecipientsModal
          broadcast={selectedBroadcast}
          onClose={() => setSelectedBroadcast(null)}
        />
      )}
    </div>
  );
};

export default MessagesPage;
