import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { MessageSquare, Plus, Store } from "lucide-react";
import { api } from "../api";
import { cn } from "../utils/cn";
import { MagneticButton, EmptyState } from "../components/ui";
import Seo from "../components/Seo";

interface ConversationData {
  id: number;
  subject: string | null;
  is_closed: boolean;
  created_at: string;
  customer: { id: number; name: string; avatar?: string } | null;
  store: { id: number; name: string; slug: string; avatar?: string } | null;
  last_message: { content: string; created_at: string; user_id: number } | null;
}

export default function Messages() {
  const [conversations, setConversations] = useState<ConversationData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.messages.conversations().then((res) => setConversations(res.conversations)).catch(() => {}).finally(() => setLoading(false));
  }, []);

  return (
    <div className="overflow-x-hidden bg-[#F8F9FA] pt-24 lg:pt-28">
      <Seo title="Messages - Gihanga Market" path="/messages" />
      <div className="mx-auto max-w-4xl px-4 pb-24 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="font-display text-[clamp(1.4rem,4.5vw,4.5rem)] font-black leading-[0.92] tracking-[-0.06em]">Messages</h1>
          <p className="mt-2 text-[#666666]">Your conversations with stores.</p>
        </div>

        {loading ? (
          <div className="flex justify-center py-20"><div className="h-8 w-8 animate-spin rounded-full border-2 border-[#BFD7F1] border-t-transparent" /></div>
        ) : conversations.length === 0 ? (
          <EmptyState title="No conversations yet" copy="Start a conversation with a store from their profile page."
            action={<MagneticButton to="/stores" variant="berry" className="min-h-12 px-6 py-3 text-sm">Browse stores</MagneticButton>} />
        ) : (
          <div className="space-y-2">
            {conversations.map((c) => (
              <Link key={c.id} to={`/messages/${c.id}`}
                className="flex items-center gap-4 rounded-2xl border border-black/[0.06] bg-white p-4 transition hover:bg-[#F8F9FA]">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[#BFD7F1]/20">
                  <Store className="h-5 w-5 text-[#BFD7F1]" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-bold truncate">{c.store?.name ?? "Store"}</p>
                    {c.is_closed ? <span className="rounded-full bg-[#F8F9FA] px-2 py-0.5 text-[0.5rem] font-bold uppercase tracking-[0.15em] text-[#666666]">Closed</span> : null}
                  </div>
                  <p className="text-xs text-[#666666] mt-0.5 truncate">{c.last_message?.content ?? c.subject ?? "No messages yet"}</p>
                </div>
                <div className="text-right shrink-0">
                  <p className="text-[0.6rem] text-[#666666]">{c.last_message ? new Date(c.created_at).toLocaleDateString() : ""}</p>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}