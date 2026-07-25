import { useEffect, useRef, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { ArrowLeft, CheckCheck, Send, Store, X } from "lucide-react";
import { api } from "../api";
import { useAuth } from "../context/AuthContext";
import { cn } from "../utils/cn";
import { MagneticButton } from "../components/ui";
import Seo from "../components/Seo";

interface MessageData {
  id: number;
  content: string;
  is_read: boolean;
  created_at: string;
  attachments: string[] | null;
  user: { id: number; name: string; avatar?: string };
}

export default function ChatDetail() {
  const { id } = useParams();
  const { user } = useAuth();
  const [messages, setMessages] = useState<MessageData[]>([]);
  const [conversation, setConversation] = useState<{ id: number; subject: string | null; is_closed: boolean; store: { id: number; name: string } | null } | null>(null);
  const [loading, setLoading] = useState(true);
  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!id) return;
    api.messages.show(Number(id)).then((res) => {
      setConversation(res.conversation);
      setMessages(res.messages);
    }).catch(() => {}).finally(() => setLoading(false));
  }, [id]);

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages]);

  const send = async () => {
    if (!input.trim() || !id) return;
    setSending(true);
    try {
      const res = await api.messages.reply(Number(id), { content: input.trim() });
      setMessages((prev) => [...prev, res.message]);
      setInput("");
    } catch { /* ignore */ }
    finally { setSending(false); }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); send(); }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#F8F9FA] pt-24">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-[#D4AF37] border-t-transparent" />
      </div>
    );
  }

  if (!conversation) {
    return (
      <div className="overflow-x-hidden bg-[#F8F9FA] pt-24 lg:pt-28">
        <div className="mx-auto max-w-4xl px-4 py-20 sm:px-6 lg:px-8">
          <div className="rounded-[2rem] border border-dashed border-black/10 bg-white/60 px-6 py-16 text-center">
            <p className="font-editorial text-6xl text-[#D4AF37]">∅</p>
            <h2 className="mt-4 font-display text-2xl font-black tracking-[-0.04em]">Conversation not found</h2>
            <MagneticButton to="/messages" variant="gold" className="mt-6 min-h-12 px-6 py-3 text-sm">Back to messages</MagneticButton>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="overflow-x-hidden bg-[#F8F9FA] pt-24 lg:pt-28">
      <Seo title={`Chat with ${conversation.store?.name ?? "Store"} - Gihanga Market`} path={`/messages/${id}`} />
      <div className="mx-auto flex max-w-4xl flex-col px-4 pb-24 sm:px-6 lg:px-8">
        <div className="mb-4 flex items-center gap-4">
          <Link to="/messages" className="flex h-11 w-11 items-center justify-center rounded-full border border-black/10 text-[#666666] transition hover:bg-[#111111] hover:text-white">
            <ArrowLeft className="h-4 w-4" />
          </Link>
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#D4AF37]/20">
            <Store className="h-5 w-5 text-[#D4AF37]" />
          </div>
          <div className="min-w-0">
            <p className="font-display text-lg font-black tracking-[-0.03em] truncate">{conversation.store?.name ?? "Store"}</p>
            <p className="text-xs text-[#666666]">{conversation.subject ?? "Chat"}{conversation.is_closed ? " · Closed" : ""}</p>
          </div>
        </div>

        <div className="flex-1 rounded-[2rem] border border-black/[0.08] bg-white p-4 shadow-[0_12px_40px_rgba(0,0,0,0.04)] sm:p-6" style={{ minHeight: "60vh", maxHeight: "65vh", overflowY: "auto" }}>
          {messages.length === 0 ? (
            <div className="flex h-full items-center justify-center text-center">
              <div>
                <MessageSquare className="mx-auto h-8 w-8 text-[#D4AF37]" />
                <p className="mt-4 font-display text-lg font-black tracking-[-0.04em]">No messages yet</p>
                <p className="mt-2 text-sm text-[#666666]">Send a message to start the conversation.</p>
              </div>
            </div>
          ) : (
            <div className="space-y-3">
              {messages.map((msg) => {
                const isMine = msg.user?.id === user?.id;
                return (
                  <div key={msg.id} className={cn("flex", isMine ? "justify-end" : "justify-start")}>
                    <div className={cn("max-w-[80%] rounded-2xl px-4 py-3", isMine ? "bg-[#111111] text-white" : "bg-[#F8F9FA] text-[#111111]")}>
                      <p className="text-sm whitespace-pre-wrap">{msg.content}</p>
                      <div className={cn("mt-1 flex items-center gap-1.5 text-[0.55rem]", isMine ? "text-white/55 justify-end" : "text-[#999] justify-start")}>
                        <span>{new Date(msg.created_at).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</span>
                        {isMine ? <CheckCheck className={cn("h-3 w-3", msg.is_read ? "text-[#D4AF37]" : "text-white/40")} /> : null}
                      </div>
                    </div>
                  </div>
                );
              })}
              <div ref={bottomRef} />
            </div>
          )}
        </div>

        {conversation.is_closed ? (
          <div className="mt-4 rounded-2xl border border-black/10 bg-[#F8F9FA] p-4 text-center text-sm text-[#666666]">This conversation is closed.</div>
        ) : (
          <div className="mt-4 flex items-end gap-3">
            <textarea
              value={input} onChange={(e) => setInput(e.target.value)} onKeyDown={handleKeyDown}
              rows={2} placeholder="Type your message…"
              className="min-h-12 flex-1 resize-none rounded-2xl border border-black/10 bg-white px-4 py-3 text-sm outline-none transition focus:border-[#D4AF37]"
            />
            <button type="button" onClick={send} disabled={sending || !input.trim()}
              className="flex h-12 w-12 min-w-12 items-center justify-center rounded-full bg-[#111111] text-white transition hover:bg-[#333] disabled:opacity-40">
              <Send className="h-4 w-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

function MessageSquare({ className }: { className?: string }) {
  return <svg className={className} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>;
}

