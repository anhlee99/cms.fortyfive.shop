import { usePathname } from "next/navigation";

export function useBreadcrumb() {
  const pathname = usePathname();
  const segments = pathname?.split("/").filter(Boolean) || [];

  const breadcrumbItems = segments.map((segment, index) => {
    const href = "/" + segments.slice(0, index + 1).join("/");
    // Capitalize the first letter and replace hyphens with spaces
    const title = segment.charAt(0).toUpperCase() + segment.slice(1).replace(/-/g, " ");
    return { title, href };
  });

  return { breadcrumbItems };
}