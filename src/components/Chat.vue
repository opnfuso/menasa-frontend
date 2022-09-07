<template>
  <div
    v-if="!loading"
    class="flex-1 p:2 sm:p-6 justify-between flex flex-col h-screen"
  >
    <div
      id="messages"
      class="flex flex-col space-y-4 p-3 overflow-y-auto scrollbar-thumb-blue scrollbar-thumb-rounded scrollbar-track-blue-lighter scrollbar-w-2 scrolling-touch"
    >
      <div v-for="(message, index) in messages" :key="index" name="message">
        <div class="chat-message" v-if="message.userId === id">
          <div class="flex items-end justify-end">
            <div
              class="flex flex-col space-y-2 text-xs max-w-xs mx-2 order-1 items-end"
            >
              <div>
                <a
                  v-if="message.isImage"
                  v-bind:href="message.content"
                  target="_blank"
                >
                  <img
                    @load="scrollToBottom()"
                    v-bind:src="message.content"
                    alt="Photo"
                  />
                </a>
                <span
                  v-else
                  class="px-4 py-2 rounded-lg inline-block rounded-br-none bg-blue-600 text-white"
                  >{{ message.content }}</span
                >
              </div>
            </div>
            <!-- <img
              v-bind:src="message.user.photoURL"
              alt="foto"
              class="w-6 h-6 rounded-full order-2"
            /> -->
          </div>
        </div>
        <div class="chat-message" v-else>
          <div class="flex items-end">
            <div
              class="flex flex-col space-y-2 text-xs max-w-xs mx-2 order-2 items-start"
            >
              <div>
                <a v-if="message.isImage" v-bind:href="message.content">
                  <img v-bind:src="message.content" alt="Photo" />
                </a>
                <div
                  v-else
                  class="px-4 py-2 rounded-lg inline-block rounded-br-none bg-gray-300 text-gray-600"
                >
                  <b>{{ message.user.displayName }}</b>
                  <br />
                  <span>
                    {{ message.content }}
                  </span>
                </div>
              </div>
            </div>
            <!-- <img
              v-bind:src="message.user.photoURL"
              alt="My profile"
              class="w-6 h-6 rounded-full order-1"
            /> -->
          </div>
        </div>
      </div>
    </div>
    <div class="border-t-2 border-gray-200 px-4 pt-4 mb-2 sm:mb-0">
      <div @keypress="(callback) => keypress(callback)" class="relative flex">
        <input
          v-if="message.isImage"
          type="text"
          placeholder="Escribe un mensaje"
          class="w-full focus:outline-none focus:placeholder-gray-400 text-gray-600 placeholder-gray-600 pl-3 bg-gray-200 rounded-md py-3"
        />
        <input
          v-else
          type="text"
          v-model="message.content"
          placeholder="Escribe un mensaje"
          class="w-full focus:outline-none focus:placeholder-gray-400 text-gray-600 placeholder-gray-600 pl-3 bg-gray-200 rounded-md py-3"
        />
        <div class="absolute right-0 items-center inset-y-0 hidden sm:flex">
          <button
            @click="sendImage()"
            type="button"
            class="inline-flex items-center justify-center rounded-full h-10 w-10 transition duration-500 ease-in-out text-gray-500 hover:bg-gray-300 focus:outline-none"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              class="h-6 w-6 text-gray-600"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"
              ></path>
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"
              ></path>
            </svg>
          </button>
          <button
            @click="sendMessage()"
            type="button"
            class="inline-flex items-center justify-center rounded-lg px-4 py-3 transition duration-500 ease-in-out text-white bg-blue-500 hover:bg-blue-400 focus:outline-none"
          >
            <span class="font-bold">Enviar</span>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
              class="h-6 w-6 ml-2 transform rotate-90"
            >
              <path
                d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z"
              ></path>
            </svg>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { getApp, type FirebaseApp } from "firebase/app";
import { getDownloadURL, getStorage, ref, uploadBytes } from "firebase/storage";
import type { ReceiveMessage, SendMessage } from "@/interfaces/chat.interface";
import { getAuth, type Auth, type User } from "firebase/auth";
import { io, type Socket } from "socket.io-client";
import { getMessages } from "@/services/chat.service";

export default defineComponent({
  name: "chat",
  data() {
    return {
      auth: {} as Auth,
      id: "",
      token: "",
      messages: [] as ReceiveMessage[],
      message: {} as SendMessage,
      loading: true,
      socket: {} as Socket,
      app: {} as FirebaseApp,
      usersIds: [] as string[],
    };
  },
  async mounted() {
    const auth = getAuth();
    this.app = getApp();

    new Promise<User>((resolve, reject) => {
      const unsubscribe = auth.onAuthStateChanged(
        (user) => {
          if (user) {
            unsubscribe();
            resolve(user);
          } else {
            unsubscribe();
            reject();
          }
        },
        (error) => {
          unsubscribe();
          reject(error);
        }
      );
    })
      .then(async (user) => {
        this.auth = auth;
        this.id = user.uid;
        this.token = await user.getIdToken();

        await this.loadMessages();

        this.socket = io(import.meta.env.VITE_API_URL);
        this.socket.connect();
        this.socket.on("exception", (data) => {
          console.error(data);
        });

        this.socket.on("broadcast", async (data: ReceiveMessage) => {
          this.messages.push(data);
          const messages = document.getElementById("messages");
          messages.scrollTop = messages?.scrollHeight;

          console.log("Mensaje owo");
        });

        this.loading = false;
      })
      .catch((error) => {
        if (error) {
          console.error(error);
        } else {
          this.$router.push("/login");
        }
      });
  },
  methods: {
    sendMessage() {
      try {
        this.message.isImage = false;
        this.message.token = this.token;

        this.socket.emit("message", this.message);

        this.message.content = "";
      } catch (error) {
        console.error(error);
      }
    },
    sendImage() {
      const storage = getStorage(this.app);
      let file: File;

      const input = document.createElement("input");
      input.type = "file";
      input.name = "img";
      input.accept = "image/png, image/jpeg";
      input.onchange = (_this) => {
        file = input.files[0];
        const storageRef = ref(
          storage,
          import.meta.env.VITE_REF_STORAGE + file.name
        );

        uploadBytes(storageRef, file).then((snapshot) => {
          getDownloadURL(snapshot.ref).then((downloadURL) => {
            this.message = {
              content: downloadURL,
              isImage: true,
              token: this.token,
            };

            this.socket.emit("message", this.message);
            this.message.content = "";
          });
        });
      };
      input.click();
    },
    async loadMessages() {
      try {
        const token = await this.auth.currentUser?.getIdToken();
        const config = {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        };
        const response = await getMessages(config);
        this.messages = response.data;
      } catch (error) {
        console.error(error);
      }
    },
    scrollToBottom() {
      const messages = document.getElementById("messages");
      messages.scrollTop = messages?.scrollHeight;
    },
    keypress(event: KeyboardEvent) {
      if (event.key === "Enter") {
        this.sendMessage();
      }
    },
  },
});
</script>

<style>
.scrollbar-w-2::-webkit-scrollbar {
  width: 0.5rem;
  height: 0.5rem;
}

.scrollbar-track-blue-lighter::-webkit-scrollbar-track {
  --bg-opacity: 1;
  background-color: #f7fafc;
  background-color: rgba(247, 250, 252, var(--bg-opacity));
}

.scrollbar-thumb-blue::-webkit-scrollbar-thumb {
  --bg-opacity: 1;
  background-color: #edf2f7;
  background-color: rgba(237, 242, 247, var(--bg-opacity));
}

.scrollbar-thumb-rounded::-webkit-scrollbar-thumb {
  border-radius: 0.25rem;
}
</style>
