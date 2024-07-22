import { io, type Socket } from "socket.io-client";

let socket: Socket;

export const useSocket = (): Socket & { reconnect: () => void } => {
  const { tokens } = useDirectusTokens();
  if (!socket) {
    socket = io(import.meta.env.NUXT_PUBLIC_DIRECTUS_URL, {
      transports: ["websocket"],
      extraHeaders: { authorization: tokens.value?.access_token as string }
    });
  }

  return Object.assign(socket, {
    reconnect() {
      socket.disconnect().connect();
    }
  });
};
