import { PageContainer } from "@/components/layout/page-container";

export default function AppLayout({ children }: LayoutProps<"/">) {
  return (
    <main>
      <PageContainer>{children}</PageContainer>
    </main>
  );
}
