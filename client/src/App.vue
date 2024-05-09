<script setup>
    import { RouterView } from 'vue-router';
    
    import BackgroundVideo from "@/components/global_components/BackgroundVideo.vue";
    import NavbarComponent from "@/components/global_components/NavbarComponent.vue";
    // import ServerUnreachable from './views/ServerUnreachable.vue';
    
    import { onBeforeMount, ref } from 'vue';
    import { useUserStore } from '@/store/user'

    import axios from 'axios'

    const userStore = useUserStore();

    const socket = ref(null);

    const render = ref(false);
    
    const isError = ref(false);

    async function getErrorPage() {
        const res  = await axios.get('@/public/error_page/error_page.html');
        const data = await res.data;
    }

    onBeforeMount(async () => {

        try {
            await userStore.getUserData();
            await userStore.initSocket();
        } catch (err) {
            isError.value = true;
            render.value = false;
        }



        socket.value = userStore.socket;

        socket.value.onopen = () => {
            render.value = true;
            isError.value = false;
        }
 
        socket.value.onerror = (err) => {
            isError.value = true;
            render.value = false;
        }
        socket.value.onclose = () => {
            userStore.removeSocket();
            isError.value = true;
            render.value = false;
        } 
    })

</script>


<template>
    <BackgroundVideo v-if="render"/>  
    <NavbarComponent v-if="render"/>

    <RouterView v-if="render" id="mounted-content"/>

    <div id="error-page" v-if="isError">
        <img src="/error.gif" alt="">
    </div>

</template>

<style scoped>
    #mounted-content {
        height: 95%;
    }
    #error-page {
        display: flex;
        align-items: center;
        justify-content: center;
    }
</style>