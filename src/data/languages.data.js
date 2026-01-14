const languages = [
  { value: "all", label: "Barcha tillar" },
  { value: "uz", label: "O'zbek" },
  { value: "en", label: "English" },
  { value: "ru", label: "Русский" },
  { value: "kk", label: "Қазақ" },
  { value: "ky", label: "Кыргыз" },
  { value: "tr", label: "Türkçe" },
  { value: "tg", label: "Тоҷикӣ" },
  { value: "tk", label: "Türkmen" },
  { value: "az", label: "Azərbaycan" },
  { value: "fa", label: "فارسی" },
  { value: "ar", label: "العربية" },
  { value: "es", label: "Español" },
  { value: "fr", label: "Français" },
  { value: "de", label: "Deutsch" },
  { value: "hi", label: "हिंदी" },
  { value: "zh", label: "中文" },
  { value: "ja", label: "日本語" },
  { value: "ko", label: "한국어" },
];

export const getLangLabel = (code) => {
  const lang = languages.find((l) => l.value === code);
  return lang ? lang.label : code || "—";
};

export default languages;
