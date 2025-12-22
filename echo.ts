import Echo from "laravel-echo";
import Pusher from "pusher-js";
import { getUserSession } from "./action";

declare global {
  interface Window {
    Echo: Echo<any>;
    Pusher: typeof Pusher;
  }
}

let echo: Echo<any> | null = null;

let token: string | null = "";

(async () => {
  const res = await getUserSession()
  token = res?.accessToken;
 
})()




export function getEcho() {
  if (!echo && typeof window !== "undefined") {
    window.Pusher = Pusher;

    echo = new Echo({
      broadcaster: "reverb",
      key: process.env.NEXT_PUBLIC_REVERB_APP_KEY as string,

      wsHost: process.env.NEXT_PUBLIC_REVERB_HOST,
      forceTLS: true,
      enabledTransports: ["ws", "wss"],

      authEndpoint: `${process.env.NEXT_PUBLIC_SOCKEI_ENDPOIND}`,
      auth: {
        headers: {
          "X-Requested-With": "XMLHttpRequest",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
      },
    });

    window.Echo = echo;
  }

  return echo!;
}
