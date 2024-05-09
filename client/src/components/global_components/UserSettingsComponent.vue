<script setup>
    import { onBeforeMount, onBeforeUnmount, ref } from "vue";

    import ButtonComponent from "@/components/global_components/ButtonComponent.vue";
    import InputComponent from '@/components/global_components/InputComponent.vue'

    import { useUserStore } from "@/store/user";
    import axios from "axios";

    import { config } from "../../config/config";
    
    const isPopupOpened = ref(false);

    const userStore = useUserStore();

    const username = ref('');

    const errorMsg = ref('');

    const success = ref(false)

    onBeforeMount(async () => {
        await userStore.getUserData();
        username.value = userStore.username;
    })


    async function saveBtnClickHandler() {
        try {
            errorMsg.value = '';
            success.value = false;
            
            const res = await axios.put(config.dev.BASE_API_URL+'/api/user/updateUsername', 
            { username: username.value }, 
            { withCredentials: true })

            const data = await res.data;

            userStore.username = data.username;
            success.value = true;
        } catch (err) {
            errorMsg.value = err.response.data;
        }

    }

    function openUserSettings() {
        isPopupOpened.value = true;
    }

</script>


<template>
    <div class="activator" @click="openUserSettings">
        <slot></slot>
    </div>
    <div v-if="isPopupOpened" class="user-settings-popup">
        <div class="user-settings-popup-content">
            <div class="header">
                <h2>User Settings</h2>
            </div> 
            <div class="main">
                <div class="username">
                    <span>username:</span> <InputComponent :value="userStore.username" 
                                                           @get-value="(value) => username = value" 
                                                           height = "1.7em"
                                                           max-length="24"/>
                </div>

                <div class="user-id">
                    <span>user-id: {{ userStore.userId }}</span> 
                </div>
                <div class="response">
                    <div class="error" v-if="errorMsg">
                        <h4>{{ errorMsg }}</h4>
                    </div>
                    <div class="success" v-if="success">
                        <h4>Username updated</h4>
                    </div>
                </div>

                
            </div>

            <div class="buttons-container">
                <ButtonComponent @click="() => {
                                            isPopupOpened = false;
                                            success = false;
                                            errorMsg = '';
                                            }" 
                                 id="saveBtn" 
                                 button-text="Back" 
                                 font-size="1.2em" 
                                 min-height="2.4em" />
                
                <ButtonComponent @click="saveBtnClickHandler" 
                                 id="saveBtn" 
                                 button-text="Save Changes" 
                                 font-size="1.2em" 
                                 min-height="2.4em" />
            </div>
        </div>            
    </div>

 

</template>

<style scoped>

    .activator {
        cursor: pointer;
    }
    .user-settings-popup {
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        z-index: 99;
        display: flex;
        align-items: center;
        justify-content: center;
        background-color: rgb(0, 0, 0, 0.2);
    }

    .user-settings-popup-content {
        width: 40%;
        height: 40%;
        background-color: white;
        display: flex;
        align-items: center;
        flex-direction: column;
        padding: 20px;
        border-radius: 5px;
    }

    .header {
        flex-grow: 1;
    }

    .main {
        flex-grow: 5;
        display: flex;
        flex-direction: column;
        gap: 20px;
    }

    .username {
        display: flex;
        gap: 5px;
        align-items: center;
    }
    .buttons-container {
        flex-grow: 1;
        align-items: center;
        justify-content: center;
    }


    .response {
        display: flex;
        justify-content: center;
        align-items: center;
    }
    .error {
        color: red;
    }

    .success {
        color: green
    }
</style>