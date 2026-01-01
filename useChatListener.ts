"use client";

import { getEcho } from "@/lib/echo";
import { Message } from "@/types/chat";
import { useEffect, useState, useRef } from "react";

export function useChatListener(
  chatId: number,
  onMessage: (message: Message) => void
) {
  const [token, setToken] = useState<string | null>(null);
  const onMessageRef = useRef(onMessage);

  useEffect(() => {
    onMessageRef.current = onMessage;
  }, [onMessage]);

  useEffect(() => {
    async function loadToken() {
      const res = await fetch("/api/session");
      const data = await res.json();
      setToken(data.accessToken);
    }
    loadToken();
  }, []);

  useEffect(() => {
    // Add this check
    if (!chatId || chatId === 0 || !token) return;

    let mounted = true;
    let channel: any = null;
    let echoInstance: any = null;
    const channelName = `chat.${chatId}`;

    (async () => {
      const e = await getEcho(token);
      if (!e || !mounted) return;
      echoInstance = e;

      channel = echoInstance.private(channelName);
      console.log(`🔌 Listening to channel: ${channelName}`); // Debug log

      channel.listen("MessageSent", (e: { message: Message }) => {
        console.log("📨 New message received:", e); // Debug log
        onMessageRef.current(e.message);
      });
    })();

    return () => {
      mounted = false;
      console.log(`🔌 Disconnecting from channel: ${channelName}`); // Debug log
      try {
        channel?.stopListening("MessageSent");
        echoInstance?.leave(`private-${channelName}`);
      } catch (err) {
        // ignore cleanup errors
      }
    };
  }, [chatId, token]);
}
