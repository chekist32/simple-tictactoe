import { defineStore } from "pinia";

import axios from 'axios';

import { config } from "../config/config";


export const useUserStore = defineStore('user', {
    state: () => ({
        username: null,
        socket: null,
        lobbyId: null,
        userId: null
    }),
    actions: {
        async getUserData() {
            const res = await axios.get(config.dev.BASE_API_URL + "/api/user", {
                withCredentials: true
            });
            const data = await res.data;
            this.username = await data.username;
            this.userId = await data.userId;
        },
        async initSocket() {
            if (!this.socket) {
                this.socket = new WebSocket("ws://localhost:8081");
            }

        },
        removeSocket() {
            this.socket = null;
        },
        async initUserStore() {
            await this.getUserData();
            await this.initSocket();
        }
    }
});