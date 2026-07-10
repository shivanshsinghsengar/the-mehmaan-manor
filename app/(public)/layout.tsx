// This layout wraps all public pages
// Navigation and Footer are included on public pages individually
// to allow per-page customization if needed

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
