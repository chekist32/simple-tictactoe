<script setup>
    import ButtonComponent from "@/components/global_components/ButtonComponent.vue"
    import UserSettingsComponent from "@/components/global_components/UserSettingsComponent.vue"
    
    import { RouterLink } from "vue-router";

</script>


<template>
    <div class="main">
        <div class="menu">
            <div class="header">
                <h2>Vite App</h2>
            </div>
            <RouterLink to="/createLobby">
                <ButtonComponent buttonText="Create" />
            </RouterLink>
            
            <RouterLink to="/join">
                <ButtonComponent buttonText="Join" />
            </RouterLink>

            <div class="user-settings">
                <UserSettingsComponent>
                    <i class="fa fa-cog" id="icon" style="font-size: 2em;"></i>
                </UserSettingsComponent>
            </div>
        </div>
    </div>


</template>


<style scoped>

    .main {
        display: flex;
        align-items: center;
        justify-content: center;
        flex-direction: column;
    }
    .menu {
        padding: 15px;
        background-color: white;
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 10px;
    }

    .user-settings {
        max-width: fit-content;
    }

</style>