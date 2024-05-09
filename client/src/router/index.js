import { createRouter, createWebHistory, onBeforeRouteLeave } from "vue-router"

import HomeView from "@/views/HomeView.vue"
import LobbyBrowserView from "@/views/LobbyBrowserView.vue"
import CreateLobbyView from "@/views/CreateLobbyView.vue"
import Join from '@/views/Join.vue'
import TicTacToeView from '@/views/TicTacToeView.vue'




const router = createRouter({
    history: createWebHistory(),
    routes: [
        {
            path: '/',
            name: 'home',
            component: HomeView
        },
        {
            path: '/join',
            name: 'join',
            component: LobbyBrowserView
        },
        {
            path: '/join/:id',
            name: 'joinId',
            component: Join,
            children: [
                {
                    path: 'tictactoe',
                    name: 'tictactoe',
                    component: TicTacToeView
                }
            ]
        }, 
        {
            path: '/createLobby',
            name: 'createLobby',
            component: CreateLobbyView 
        },
        {
            path: '/test',
            name: 'test',
            component: HomeView
        }
    ]
})

export default router;