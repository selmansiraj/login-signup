import React, { useEffect, useMemo, useRef, useState } from "react";
import { Button } from "../../../components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../../../components/ui/card";
import { Input } from "../../../components/ui/input";
import { useChat } from "../hooks/useChat";

const TRAVEL_STYLES = [
  {
    key: "traditional",
    label: "Traditional",
    description: "Culture, heritage, Maori stories"
  },
  {
    key: "modern",
    label: "Modern",
    description: "City life, polished stays, design"
  },
  {
    key: "adventuric",
    label: "Adventuric",
    description: "Road trips, hikes, outdoor energy"
  }
];

function MessageSquareIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" className="h-5 w-5">
      <path
        d="M4.5 5.75A2.25 2.25 0 0 1 6.75 3.5h10.5A2.25 2.25 0 0 1 19.5 5.75v7.5A2.25 2.25 0 0 1 17.25 15.5H11l-4.25 3.5v-3.5H6.75A2.25 2.25 0 0 1 4.5 13.25v-7.5Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
      <path d="M8 7.75h8M8 10.75h5.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

function NewChatIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" className="h-4.5 w-4.5">
      <path
        d="M4.5 5.75A2.25 2.25 0 0 1 6.75 3.5h10.5A2.25 2.25 0 0 1 19.5 5.75v7.5A2.25 2.25 0 0 1 17.25 15.5H11l-4.25 3.5v-3.5H6.75A2.25 2.25 0 0 1 4.5 13.25v-7.5Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
      <path d="M12 8.75v4M10 10.75h4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

function SendIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" className="h-4 w-4">
      <path d="m4 12 15.5-7.5-4.7 15.25-4.2-6.1L4 12Z" fill="currentColor" />
    </svg>
  );
}

function CloseIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" className="h-4 w-4">
      <path d="M6 6l12 12M18 6 6 18" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
    </svg>
  );
}

function TypingDots() {
  return (
    <div className="flex items-center gap-1.5 px-1 py-0.5">
      <span className="h-2 w-2 animate-bounce rounded-full bg-[#7dd3fc] [animation-delay:-0.2s]" />
      <span className="h-2 w-2 animate-bounce rounded-full bg-[#7dd3fc] [animation-delay:-0.1s]" />
      <span className="h-2 w-2 animate-bounce rounded-full bg-[#7dd3fc]" />
    </div>
  );
}

export default function TravelChatbot() {
  const [open, setOpen] = useState(false);
  const [travelStyle, setTravelStyle] = useState("traditional");
  const messagesEndRef = useRef(null);
  const {
    messages,
    input,
    isLoading,
    handleInputChange,
    handleSubmit,
    startNewChat
  } = useChat({ preference: travelStyle });

  const messageCount = useMemo(
    () => messages.filter((message) => message.role !== "system").length,
    [messages]
  );

  useEffect(() => {
    if (open) {
      messagesEndRef.current?.scrollIntoView({ block: "end", behavior: "smooth" });
    }
  }, [messages, open]);

  return (
    <div className="fixed bottom-4 right-4 z-[90] pointer-events-none sm:bottom-6 sm:right-6">
      <div className="pointer-events-auto">
        {open ? (
          <Card className="flex h-[min(88vh,44rem)] w-[min(92vw,22rem)] flex-col overflow-hidden border border-[#5a4633]/40 bg-[#0f120f] text-[#f5f0e8] shadow-[0_30px_110px_rgba(0,0,0,0.62)] backdrop-blur-2xl sm:w-[22rem]">
            <CardHeader className="shrink-0 border-b border-[#5a4633]/35 bg-[#181a15]/95 px-4 py-4">
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-start gap-3">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="mt-0.5 h-10 w-10 rounded-full border border-[#7a5b3b]/35 bg-[#20150f] text-[#f5f0e8] hover:bg-[#2a1d14] hover:text-white"
                    onClick={startNewChat}
                    aria-label="Start new chat"
                  >
                    <NewChatIcon />
                  </Button>

                  <div className="min-w-0">
                    <div className="text-[0.72rem] font-semibold uppercase tracking-[0.24em] text-[#b9aa98]">
                      NZ Travel Guide
                    </div>
                    <CardTitle className="mt-2 flex flex-wrap items-center gap-2 text-lg font-semibold tracking-[-0.03em] text-[#f5f0e8]">
                      <span>Kia guide</span>
                      <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-2 py-1 text-[0.68rem] font-medium text-emerald-300">
                        <span className="h-2 w-2 rounded-full bg-emerald-400 shadow-[0_0_18px_rgba(74,222,128,0.9)]" />
                        Online
                      </span>
                    </CardTitle>
                  </div>
                </div>

                <Button
                  variant="ghost"
                  size="icon"
                  className="h-10 w-10 rounded-full border border-[#7a5b3b]/25 bg-[#20150f] text-[#f5f0e8] hover:bg-[#2a1d14] hover:text-white"
                  onClick={() => setOpen(false)}
                  aria-label="Close travel chat"
                >
                  <CloseIcon />
                </Button>
              </div>
            </CardHeader>

            <CardContent className="flex min-h-0 flex-1 flex-col gap-3 bg-[#0f120f] px-4 py-4">
              <div className="grid gap-2">
                <div className="flex items-center justify-between text-[0.68rem] font-semibold uppercase tracking-[0.18em] text-[#8e806f]">
                  <span>Travel style</span>
                  <span>AI mode</span>
                </div>

                <div className="grid grid-cols-3 gap-2">
                  {TRAVEL_STYLES.map((style) => {
                    const isActive = style.key === travelStyle;

                    return (
                      <button
                        key={style.key}
                        type="button"
                        onClick={() => setTravelStyle(style.key)}
                        className={`grid gap-1 rounded-2xl border px-2.5 py-2.5 text-left transition ${
                          isActive
                            ? "border-emerald-400/40 bg-[#1b241b] shadow-[0_12px_24px_rgba(0,0,0,0.18)]"
                            : "border-[#5a4633]/28 bg-[#171914] hover:border-emerald-500/25 hover:bg-[#1b1d18]"
                        }`}
                      >
                        <span
                          className={`text-[0.78rem] font-semibold leading-4 ${
                            isActive ? "text-[#f5f0e8]" : "text-[#dfd5c7]"
                          }`}
                        >
                          {style.label}
                        </span>
                        <span className="text-[0.66rem] leading-4 text-[#b9aa98]/70">{style.description}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="flex items-center justify-between text-[0.72rem] font-semibold uppercase tracking-[0.2em] text-[#8e806f]">
                <span>Chat</span>
                <span>{messageCount} messages</span>
              </div>

              <div className="flex min-h-0 flex-1 flex-col overflow-hidden rounded-[1.5rem] border border-[#5a4633]/35 bg-[#151712] p-3">
                <div className="min-h-0 flex-1 overflow-y-auto pr-1">
                  <div className="space-y-3">
                    {messages.map((message) => {
                      const isUser = message.role === "user";

                      return (
                        <div
                          key={message.id}
                          className={`flex ${isUser ? "justify-end" : "justify-start"}`}
                        >
                          <div
                            className={`max-w-[84%] rounded-3xl px-4 py-3 text-sm leading-6 shadow-lg ${
                              isUser
                                ? "border border-emerald-500/20 bg-[#214c37] text-[#f5f0e8]"
                                : "border border-amber-500/35 bg-[#2a2018] text-[#f5f0e8]"
                            }`}
                          >
                            <p className="whitespace-pre-line">{message.content}</p>
                          </div>
                        </div>
                      );
                    })}

                    {isLoading ? (
                      <div className="flex justify-start">
                        <div className="rounded-3xl border border-amber-500/35 bg-[#2a2018] px-4 py-3 text-sm text-[#f5f0e8]/80 shadow-lg">
                          <TypingDots />
                        </div>
                      </div>
                    ) : null}

                    <div ref={messagesEndRef} />
                  </div>
                </div>
              </div>

              <form onSubmit={handleSubmit} className="shrink-0 flex items-center gap-2">
                <Input
                  value={input}
                  onChange={handleInputChange}
                  placeholder="Ask about routes, seasons, or photo spots..."
                  className="h-12 rounded-2xl border border-[#5a4633]/35 bg-[#151712] px-4 text-sm text-[#f5f0e8] placeholder:text-[#b9aa98]/55 focus:border-emerald-400/40 focus:ring-0"
                />

                <Button
                  type="submit"
                  className="h-12 shrink-0 rounded-2xl bg-[#2d6b48] px-4 font-semibold text-[#f5f0e8] shadow-[0_12px_30px_rgba(24,56,38,0.28)] transition hover:-translate-y-0.5 hover:bg-[#387855]"
                  disabled={isLoading || !input.trim()}
                >
                  <span className="flex items-center gap-2">
                    <SendIcon />
                    Send
                  </span>
                </Button>
              </form>
            </CardContent>
          </Card>
        ) : (
          <button
            type="button"
            onClick={() => setOpen(true)}
            className="group relative inline-flex h-14 w-14 items-center justify-center rounded-full border border-[#7a5b3b]/35 bg-[#151712] text-[#f5f0e8] shadow-[0_20px_60px_rgba(0,0,0,0.55)] backdrop-blur-xl transition hover:-translate-y-1 hover:border-emerald-400/35 hover:bg-[#20150f]"
            aria-label="Open travel guide chat"
          >
            <span className="absolute h-14 w-14 rounded-full bg-emerald-500/10 blur-xl transition group-hover:bg-emerald-400/15" />
            <span className="relative">
              <MessageSquareIcon />
            </span>
          </button>
        )}
      </div>
    </div>
  );
}
