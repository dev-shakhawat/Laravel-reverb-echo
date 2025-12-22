"use client";
 
import { getEcho } from "@/lib/echo";
import {   useEffect, useState } from "react"; 

 

export function useChatListener(
  chatId: number,
  onMessage: (message: any) => void
) {


    const [token, setToken] = useState<string | null>(null);

    
  useEffect(() => {
    async function loadToken() {
      const res = await fetch("/api/session");
      const data = await res.json();
      console.log(data);
      
      setToken(data.accessToken);
    }
    loadToken();
  }, []);



  useEffect(() => {
    if (!chatId || !token) return;

    let channel: any;

    const echo = getEcho(token);

    channel = echo.private(`chat.${chatId}`);

    channel.listen(".MessageSent", (e: any) => {
      onMessage(e.message);
    });

    return () => {
      channel.stopListening(".MessageSent");
      echo.leave(`private-chat.${chatId}`);
    };
  }, [chatId, token , onMessage]);
}
