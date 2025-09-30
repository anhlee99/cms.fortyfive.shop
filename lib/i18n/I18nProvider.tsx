// app/providers/I18nProvider.tsx
"use client";

import { I18nextProvider } from "react-i18next";
import i18next from "i18next";
import { initReactI18next } from "react-i18next/initReactI18next";

type Resources = Record<string, { [ns: string]: any }>;

let isInitialized = false;

export default function I18nProvider({
  children,
  locale,
  resources,
}: {
  children: React.ReactNode;
  locale: string;
  namespaces: string[];
  resources: Resources;
}) {

  // Lấy danh sách ns thực sự có trong resources của locale hiện tại
  const nsList = Object.keys(resources[locale] || {});
  // đảm bảo 'common' luôn đứng đầu làm defaultNS
  const defaultNS = nsList.includes("common") ? "common" : nsList[0];
  if (!isInitialized) {

    i18next
      .use(initReactI18next)
      .init({
        resources,               // nạp sẵn tài nguyên từ server
        lng: locale,             // đặt ngôn ngữ hiện tại
        ns: nsList,   
        defaultNS: defaultNS,       // các namespace sử dụng
        fallbackLng: "vi",
        interpolation: { escapeValue: false },
        returnNull: false,
      });
    isInitialized = true;
  } else {
    // Nếu đã init: đảm bảo mọi ns đều có bundle, rồi đổi ngôn ngữ nếu cần
    for (const ns of nsList) {
      const has = i18next.hasResourceBundle(locale, ns);
      if (!has) {
        i18next.addResourceBundle(locale, ns, resources[locale][ns], true, true);
      }
    }
    if (i18next.language !== locale) {
      i18next.changeLanguage(locale);
    }
  }

  return <I18nextProvider i18n={i18next}>{children}</I18nextProvider>;
}
