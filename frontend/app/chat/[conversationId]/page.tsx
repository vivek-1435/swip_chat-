import { AppShell } from "@/components/layout/AppShell";

type ConversationPageProps = {
  params: Promise<{ conversationId: string }>;
};

export default async function ConversationPage({ params }: ConversationPageProps) {
  const { conversationId } = await params;

  return <AppShell activeId={Number(conversationId)} />;
}
