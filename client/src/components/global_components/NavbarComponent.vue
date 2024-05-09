<script setup>
import { RouterLink } from 'vue-router';
import { useUserStore } from '@/store/user.js'
import UserSettingsComponent from '@/components/global_components/UserSettingsComponent.vue'

const userStore = useUserStore();

</script>

<template>
    <div class="navbar">

        <div class="navbar-leftside">
            <RouterLink :to="{ name: 'home' }" class="router-link">
            <div class="navbar-header">
                <img src="../../../favicon.ico" style="width: 20%;" alt="">
                <h2>Vite App</h2>
            </div>
            </RouterLink>
            
            <div class="navbar-menu">
            <RouterLink :to="{ name: 'createLobby' }" class="router-link">
                    Create Lobby
            </RouterLink>

            <RouterLink :to="{ name: 'join' }" class="router-link">
                    Lobby Browser
            </RouterLink>
            </div>
        </div>

        <div class="navbar-rightside">
            <div class="navbar-userinfo">
                <UserSettingsComponent>
                    <div class="navbar-userinfo-username">
                        {{ userStore.username }}
                    </div>
                </UserSettingsComponent>
                
            </div>
        </div>

    </div>
</template>

<style scoped>
    .router-link {
        text-decoration: none;
        color: black;
    }

    .navbar {
        height: 5%;
        background-color: white;
        display: flex;
        justify-content: center;
        align-items: center;
        padding: 0 10px 0 10px;
    }

    .navbar-leftside {
        display: flex;
        flex-grow: 1;
        align-items: center;
    }

    .navbar-header {
        display: flex;
        align-items: center;
        gap: 5px;
    }

    .navbar-menu {
        display: flex;
        align-items: center;
        gap: 10px;
        font-size: 1.5em;
        
    }

    .navbar-menu .router-link:hover {
        text-decoration: underline;
    }

    .navbar-rightside {
        display: flex;
        flex-grow: 1;
        justify-content: end;
        padding-right: 15px;
    }

    .navbar-userinfo-username {
        font-size: 1.3em;
    }

    .navbar-userinfo-username:hover {
        text-decoration: underline;
        cursor: pointer;
    }
</style>