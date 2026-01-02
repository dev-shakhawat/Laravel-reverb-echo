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
      console.log(`Listening to channel: ${channelName}`); 

      channel.listen("MessageSent", (e: Message) => {
        console.log("New event received:", e); 
        onMessageRef.current(e);
      });
    })();

    return () => {
      mounted = false;
      console.log(`Disconnecting from channel: ${channelName}`); 
      try {
        channel?.stopListening("MessageSent");
        echoInstance?.leave(`private-${channelName}`);
      } catch (err) {
        // ignore cleanup errors
      }
    };
  }, [chatId, token]);
}
