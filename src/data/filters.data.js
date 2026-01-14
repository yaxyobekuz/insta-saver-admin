const statusOptions = [
  { value: "all", label: "Barcha foydalanuvchilar" },
  { value: "high_activity", label: "Ko'p yuklagan (20+)" },
  { value: "high_success", label: "Muvaffaqiyatli (10+)" },
  { value: "high_failed", label: "Xatolik ko'p (5+)" },
  { value: "low_activity", label: "Kam faol (5-)" },
];

// Recent filter options
const recentOptions = [
  { value: "", label: "Barcha vaqt" },
  { value: "1", label: "Bugun" },
  { value: "7", label: "So'nggi 7 kun" },
  { value: "30", label: "So'nggi 30 kun" },
];

// Sort options
const sortOptions = [
  { value: "createdAt-desc", label: "Eng yangi" },
  { value: "createdAt-asc", label: "Eng eski" },
  { value: "stats.total-desc", label: "Ko'p yuklagan" },
  { value: "stats.success-desc", label: "Muvaffaqiyatli" },
  { value: "stats.failed-desc", label: "Xatolik ko'p" },
];

export { statusOptions, recentOptions, sortOptions };
