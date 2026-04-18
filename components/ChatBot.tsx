"use client";

import { useChat } from "ai/react";
import { MessageSquare } from "lucide-react";
import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger
} from "@/components/ui/popover";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";

const SYSTEM_PROMPT =
  'You are Kia, a helpful and witty New Zealand travel guide. You use Kiwi slang like "Kia Ora" and "Sweet as". You are an expert on the South Island and Māori culture. Keep responses under 3 sentences.';

const QUICK_REPLIES = [
  "What is the best time to visit?",
  "Show me North Island highlights",
  "Top 3 photo spots in Queenstown"
];

export function ChatBot() {
  const [open, setOpen] = useState(false);
  const { messages, input, handleInputChange, handleSubmit, append, isLoading } = useChat({
    api: "/api/chat",
    initialMessages: [
      {
        id: "kia-welcome",
        role: "assistant",
        content: "Kia Ora! Ready to explore the edge of the world?"
      }
    ],
    body: {
      system: SYSTEM_PROMPT
    }
  });

  const hasConversation = useMemo(
    () => messages.some((message) => message.role === "user"),
    [messages]
  );

  return (
    <div className="fixed bottom-5 right-5 z-50">
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            size="icon"
            className="h-14 w-14 rounded-full bg-slate-950 text-white shadow-2xl hover:bg-slate-900"
          >
            <MessageSquare className="h-5 w-5" />
          </Button>
        </PopoverTrigger>

        <PopoverContent
          side="top"
          align="end"
          className="w-[min(92vw,23rem)] border border-white/10 bg-slate-950 p-0 text-white shadow-2xl"
        >
          <div className="flex items-center justify-between border-b border-white/10 px-4 py-3">
            <div>
              <p className="text-xs uppercase tracking-[0.24em] text-white/50">NZ Travel Guide</p>
              <h3 className="mt-1 text-base font-semibold">Kia</h3>
            </div>
            <span className="rounded-full border border-emerald-400/20 bg-emerald-400/10 px-2 py-1 text-xs text-emerald-300">
              Online
            </span>
          </div>

          <div className="space-y-3 p-4">
            {!hasConversation ? (
              <div className="rounded-2xl border border-white/10 bg-white/5 p-3 text-sm text-white/70">
                {SYSTEM_PROMPT}
              </div>
            ) : null}

            <div className="grid gap-2">
              {QUICK_REPLIES.map((reply) => (
                <button
                  key={reply}
                  type="button"
                  onClick={() => append({ role: "user", content: reply })}
                  className="rounded-2xl border border-white/10 bg-slate-900 px-3 py-2 text-left text-sm text-white/85 hover:border-amber-500/40 hover:bg-slate-800"
                >
                  {reply}
                </button>
              ))}
            </div>

            <ScrollArea className="h-72 rounded-2xl border border-white/10 bg-black/40 p-3">
              <div className="space-y-3">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
                  >
                    <div
                      className={`max-w-[82%] rounded-3xl px-4 py-3 text-sm leading-6 ${
                        message.role === "user"
                          ? "bg-sky-600 text-white"
                          : "border border-amber-500/40 bg-slate-800 text-white"
                      }`}
                    >
                      {message.content}
                    </div>
                  </div>
                ))}
                {isLoading ? (
                  <div className="flex justify-start">
                    <div className="rounded-3xl border border-amber-500/40 bg-slate-800 px-4 py-3 text-sm">
                      Kia is typing...
                    </div>
                  </div>
                ) : null}
              </div>
            </ScrollArea>

            <form onSubmit={handleSubmit} className="flex items-center gap-2">
              <Input
                value={input}
                onChange={handleInputChange}
                placeholder="Ask Kia something..."
                className="h-11 rounded-2xl border-white/10 bg-white/5 text-white placeholder:text-white/35"
              />
              <Button type="submit" className="h-11 rounded-2xl bg-sky-500 text-slate-950 hover:bg-sky-400">
                Send
              </Button>
            </form>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
}
