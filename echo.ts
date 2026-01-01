declare global {
  interface Window {
    Echo: any;
    Pusher: any;
  }
}

let echo: any = null;

export async function getEcho(token?: string) {
  if (!token) return null; 

  if (!echo && typeof window !== "undefined") {
    const [{ default: Echo }, { default: Pusher }] = await Promise.all([
      import("laravel-echo"),
      import("pusher-js"),
    ]);

    window.Pusher = Pusher;

    echo = new Echo({
      broadcaster: "reverb",
      key: process.env.NEXT_PUBLIC_REVERB_APP_KEY as string,
      wsHost: process.env.NEXT_PUBLIC_REVERB_HOST,
      wsPort: 8083,
      wssPort: 443,
      forceTLS: true,
      enabledTransports: ["ws", "wss"],
      authEndpoint: `https://${process.env.NEXT_PUBLIC_SOCKET_ENDPOINT}`,
      auth: { headers: { Authorization: `Bearer ${token}` } },
    });

    window.Echo = echo;
  }

  return echo;
}
