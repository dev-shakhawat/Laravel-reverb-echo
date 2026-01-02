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
    if (!chatId || chatId === 0 || !token) {
      console.log("Skipping listener setup:", { chatId, hasToken: !!token });
      return;
    }

    let mounted = true;
    let channel: any = null;
    let echoInstance: any = null;
    const channelName = `chat.${chatId}`;

    (async () => {
      try {
        const e = await getEcho(token);
        if (!e || !mounted) {
          console.log("Echo not available or component unmounted");
          return;
        }
        echoInstance = e;

        channel = echoInstance.private(channelName);
        console.log(`🔌 Subscribing to channel: ${channelName}`);

        // Add subscription success/error handlers
        channel
          .subscribed(() => {
            console.log(`Successfully subscribed to: ${channelName}`);
          })
          .error((error: any) => {
            console.error(`Subscription error for ${channelName}:`, error);
          });

        // Listen for the event
        channel.listen("MessageSent", (e: { message: Message }) => {
          console.log("New message received:", e);
          if (mounted) {
            onMessageRef.current(e.message);
          }
        });
      } catch (error) {
        console.error("Error setting up echo listener:", error);
      }
    })();

    return () => {
      mounted = false;
      console.log(`Cleaning up channel: ${channelName}`);
      try {
        if (channel) {
          channel.stopListening("MessageSent");
        }
        if (echoInstance) {
          echoInstance.leave(`private-${channelName}`);
        }
      } catch (err) {
        console.error("Error during cleanup:", err);
      }
    };
  }, [chatId, token]);
}
