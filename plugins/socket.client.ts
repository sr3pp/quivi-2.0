import io from "socket.io-client";

export default defineNuxtPlugin(({ $router: { currentRoute } }: any) => {
  const route = currentRoute.value;
  if (route.path.includes("/chat")) {
    const socket = io("http://localhost:3000");

    return {
      provide: {
        io: socket,
      },
    };
  }
});
