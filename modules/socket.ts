import { Server } from "socket.io";
import { defineNuxtModule } from "@nuxt/kit";
import { ChatMessage } from "~/types";

export default defineNuxtModule({
  setup(_, nuxt) {
    console.log("Socket Read");

    nuxt.hook("listen", (server) => {
      console.log("Socket listen", server.address(), server.eventNames());
      const io = new Server(server);

      nuxt.hook("close", () => io.close());

      io.on("connection", (socket) => {
        console.log("Connection", socket.id);
      });

      const waitingRoom: any = [];

      io.on("connect", (socket: any) => {
        socket.on("getWaitingList", () => {
          socket.emit("waitingList", waitingRoom);
        });

        socket.on("userJoined", (user: any) => {
          user.id = socket.id;
          waitingRoom.push(user.id);
          socket.users ? socket.users.push(user) : (socket.users = [user]);
          socket.broadcast.emit("joined", user);
        });

        socket.on("sendMessage", function message(msj: string) {
          const data: ChatMessage = {
            id: socket.id + "chatMessage",
            message: msj,
            user: {
              id: socket.id + "user",
              name: "User",
            },
            timestamp: new Date().toISOString(),
          };
          socket.broadcast.emit("broadcastMessage", data);
        });

        socket.on("disconnecting", () => {
          console.log("disconnected", socket.id);
          const idx = waitingRoom.indexOf(socket.id);
          waitingRoom.splice(idx, 1);
          socket.broadcast.emit("message", `${socket.id} left`);
        });
      });
    });
  },
});
