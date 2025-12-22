"use client";

import { getEcho } from "@/lib/echo";
import { useEffect } from "react"; 

export function useChatListener(
  chatId: number,
  onMessage: (message: any) => void
) {
  useEffect(() => {
    if (!chatId) return;

    let channel: any;

    ( () => {
      const echo =  getEcho();

      channel = echo.private(`chat.${chatId}`);

      channel.listen("MessageSent", (e: any) => {
        onMessage(e.message);
      });
    })();

    return () => {
      if (channel) {
        channel.stopListening("MessageSent");
      }
    };
  }, [chatId, onMessage]);
}
