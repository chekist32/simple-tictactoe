<script setup>
    import axios from 'axios';
    import { onMounted, ref } from 'vue';

    import { RouterLink, RouterView, useRoute } from 'vue-router';

    import { useUserStore } from '@/store/user.js';

    import ButtonComponent from '@/components/global_components/ButtonComponent.vue';
    import PopupComponent from '@/components/global_components/PopupComponent.vue';
    import InputComponent from '../components/global_components/InputComponent.vue';
    
    import { config } from '../config/config';
    import router from '../router';

    const userStore = useUserStore();
    

    async function joinLobby(lobbyPass) {
        try {
            isError.value = false;
            
            const res = await axios.put(config.dev.BASE_API_URL+"/api/lobby/join/" + route.params.id, 
                { pass: lobbyPass }, 
                { withCredentials: true });
                render.value = true;

            userStore.lobbyId = route.params.id;
            
            return router.push({name: 'tictactoe'});
            
        } catch (err) {
            if (err.response.status === 401) {
                challengeRequired.value = true;
            }

            const error = {
                status: err.response.status,
                message: err.response.data
            }

            isError.value = true;
            return error;
        }
    }

    const route = useRoute();

    const res = ref({
        status: '',
        message: ''
    });

    const challengeRequired = ref(false);

    const pass = ref('');

    const isError = ref(false);
    const render = ref(false);

    onMounted(async () => {
        if (route.query.pass) {
            pass.value = route.query.pass;
        }
        
        res.value = await joinLobby(pass.value);

        pass.value = '';
    })



</script>

<template>
    <div class="main">
        <PopupComponent v-if="isError">
                <div class="content">
                    <div class="popup-maincontent">
                        <div class="message-container">{{ res.message }}</div>
                        <InputComponent v-if="challengeRequired" 
                                        placeholder-text="Password"
                                        @get-value="(value) => pass = value"
                                        height="1.7em"
                                        @keyup.enter="joinLobby(pass)" />
                    </div>
                    <div class="popup-buttons">
                        <RouterLink to="/join">
                            <ButtonComponent min-height="3em" min-width="7.5em" button-text="Back" />
                        </RouterLink>
                        <ButtonComponent min-height="3em" min-width="7.5em" button-text="Retry" @click="joinLobby(pass)"/>
                    </div>
                </div>
        </PopupComponent>
        <RouterView v-if="render" />
    </div>
</template>

<style scoped>
    .main {
        display: flex;
        align-items: center;
        justify-content: center;
    }
    .content {
        height: 100%;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        gap: 10px;
    }
    .popup-maincontent {
        font-size: 1.3em;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
    }
    .else{ 
        height: 40%;
        width: 40%;
        background-color: white;
        display: flex;
        align-items: center;
        justify-content: center;
    }

</style>