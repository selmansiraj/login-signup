import { useCallback, useEffect, useRef, useState } from "react";

export const TRAVEL_GUIDE_SYSTEM_PROMPT =
  "You are Kia, a helpful and witty AI assistant for a New Zealand tourism site. Answer any question clearly and concisely. Prioritize New Zealand travel, culture, planning, and local recommendations. Use a warm professional tone.";

const GREETING_MESSAGE = "Kia Ora! Ready to explore the edge of the world?";
const GEMINI_ENDPOINT =
  process.env.REACT_APP_GEMINI_ENDPOINT || "http://localhost/php/gemini_chat.php";

const PREFERENCE_PROMPTS = {
  traditional:
    "The traveller prefers traditional and cultural experiences. Prioritize Maori heritage, marae etiquette, living traditions, local food, history, crafts, museums, cultural festivals, and respectful storytelling.",
  modern:
    "The traveller prefers modern experiences. Prioritize stylish city stays, contemporary food spots, urban waterfronts, architecture, premium cafes, design-forward spaces, modern museums, and polished travel convenience.",
  adventuric:
    "The traveller prefers adventurous experiences. Prioritize hiking, road trips, dramatic landscapes, adrenaline activities, wildlife, outdoor planning, weather readiness, and scenic routes with energetic recommendations."
};

function randomId() {
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
    return crypto.randomUUID();
  }

  return `${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
}

function normalizeMessage(message) {
  return {
    id: message.id || randomId(),
    role: message.role,
    content: message.content ?? ""
  };
}

function messagesToGeminiContents(messages) {
  return messages
    .filter((message) => message.role === "user" || message.role === "assistant")
    .map((message) => ({
      role: message.role === "assistant" ? "model" : "user",
      parts: [{ text: message.content }]
    }));
}

function buildSystemPrompt(preference) {
  const preferencePrompt = PREFERENCE_PROMPTS[preference] || PREFERENCE_PROMPTS.traditional;
  return `${TRAVEL_GUIDE_SYSTEM_PROMPT} ${preferencePrompt} When giving recommendations, tailor them to this preference first unless the user clearly asks for something else.`;
}

async function requestGeminiReply(messages, preference) {
  const response = await fetch(GEMINI_ENDPOINT, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json"
    },
    body: JSON.stringify({
      systemPrompt: buildSystemPrompt(preference),
      messages: messagesToGeminiContents(messages)
    })
  });

  const responseText = await response.text();
  let responseData = {};

  if (responseText) {
    try {
      responseData = JSON.parse(responseText);
    } catch (error) {
      responseData = {};
    }
  }

  if (!response.ok) {
    const errorText = responseData?.error || responseText;
    throw new Error(errorText || `Gemini request failed with status ${response.status}`);
  }

  const text = String(responseData?.reply ?? "").trim();

  if (!text) {
    throw new Error("Gemini returned an empty response");
  }

  return text;
}

export function useChat({ initialMessages = [], preference = "traditional" } = {}) {
  const [messages, setMessages] = useState(() => {
    const seed = initialMessages.length
      ? initialMessages
      : [
          {
            role: "assistant",
            content: GREETING_MESSAGE
          }
        ];

    return seed.map(normalizeMessage);
  });
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const streamRef = useRef(null);

  const clearStream = useCallback(() => {
    if (streamRef.current) {
      window.clearInterval(streamRef.current);
      streamRef.current = null;
    }
    setIsLoading(false);
  }, []);

  useEffect(() => {
    return () => {
      if (streamRef.current) {
        window.clearInterval(streamRef.current);
      }
    };
  }, []);

  const append = useCallback((message) => {
    const nextMessage = normalizeMessage(message);
    setMessages((currentMessages) => [...currentMessages, nextMessage]);
  }, []);

  const streamAssistantReply = useCallback((assistantId, replyText) => {
    let cursor = 0;
    const step = Math.max(1, Math.ceil(replyText.length / 50));

    streamRef.current = window.setInterval(() => {
      cursor = Math.min(replyText.length, cursor + step);

      setMessages((currentMessages) =>
        currentMessages.map((message) =>
          message.id === assistantId
            ? { ...message, content: replyText.slice(0, cursor) }
            : message
        )
      );

      if (cursor >= replyText.length) {
        if (streamRef.current) {
          window.clearInterval(streamRef.current);
          streamRef.current = null;
        }

        setIsLoading(false);
      }
    }, 18);
  }, []);

  const sendMessage = useCallback(
    (rawMessage) => {
      const content = String(rawMessage ?? "").trim();

      if (!content || isLoading) {
        return;
      }

      clearStream();

      const userMessage = {
        id: randomId(),
        role: "user",
        content
      };
      const assistantId = randomId();

      setMessages((currentMessages) => [
        ...currentMessages,
        userMessage,
        {
          id: assistantId,
          role: "assistant",
          content: ""
        }
      ]);

      setInput("");
      setIsLoading(true);

      const conversation = [...messages, userMessage];

      requestGeminiReply(conversation, preference)
        .then((replyText) => {
          streamAssistantReply(assistantId, replyText);
        })
        .catch((error) => {
          const errorText =
            error?.message ||
            "I couldn't reach Gemini right now. Please check the backend API key and try again.";
          streamAssistantReply(assistantId, errorText);
        });
    },
    [clearStream, isLoading, messages, preference, streamAssistantReply]
  );

  const handleInputChange = useCallback((event) => {
    setInput(event.target.value);
  }, []);

  const handleSubmit = useCallback(
    (event) => {
      event?.preventDefault?.();
      sendMessage(input);
    },
    [input, sendMessage]
  );

  const startNewChat = useCallback(() => {
    clearStream();
    setInput("");
    setMessages([
      {
        id: randomId(),
        role: "assistant",
        content: GREETING_MESSAGE
      }
    ]);
  }, [clearStream]);

  return {
    messages,
    input,
    isLoading,
    setInput,
    append,
    handleInputChange,
    handleSubmit,
    sendMessage,
    startNewChat,
    systemPrompt: buildSystemPrompt(preference)
  };
}
