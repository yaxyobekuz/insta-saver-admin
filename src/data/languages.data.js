const languages = [
  { value: "all", label: "Barcha tillar" },
  { value: "uz", label: "O'zbek" },
  { value: "en", label: "Ingliz" },
  { value: "ru", label: "Rus" },
  { value: "kk", label: "Qozoq" },
  { value: "ky", label: "Qirg'iz" },
  { value: "tr", label: "Turk" },
  { value: "tg", label: "Tojik" },
  { value: "tk", label: "Turkman" },
  { value: "az", label: "Ozarbayjon" },
  { value: "fa", label: "Fors" },
  { value: "ar", label: "Arab" },
  { value: "pt-pt", label: "Portugal Portugalcha" },
  { value: "pt-br", label: "Braziliya Portugalcha" },
  { value: "es", label: "Ispan" },
  { value: "fr", label: "Fransuz" },
  { value: "de", label: "Nemis" },
  { value: "it", label: "Italyan" },
  { value: "id", label: "Indoneziya" },
  { value: "hi", label: "Hind" },
  { value: "uk", label: "Ukrain" },
  { value: "pl", label: "Polyak" },
  { value: "vi", label: "Vyetnam" },
  { value: "th", label: "Tay" },
  { value: "ko", label: "Koreys" },
  { value: "ja", label: "Yapon" },
  { value: "nl", label: "Niderland" },
  { value: "ro", label: "Rumin" },
  { value: "cs", label: "Chex" },
  { value: "hu", label: "Venger" },
  { value: "el", label: "Grek" },
  { value: "sv", label: "Shved" },
  { value: "da", label: "Daniya" },
  { value: "fi", label: "Finlyandiya" },
  { value: "zh", label: "Xitoy" },
];

export const getLangLabel = (code) => {
  const lang = languages.find((l) => l.value === code);
  return lang ? lang.label : code || "—";
};

export default languages;
