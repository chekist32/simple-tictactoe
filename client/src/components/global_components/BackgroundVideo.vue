<script setup>
    import { computed } from "vue";


    const props = defineProps({
        id: {
            type: String,
            default: 'background'
        },
        poster: {
            type: String,
            default: 'https://cdn.cloudflare.steamstatic.com/steamcommunity/public/images/items/1239690/3ed6a1549b0271615403cf70ce9177fae756711f.jpg'
        },
        source: {
            type: String,
            default: 'https://cdn.cloudflare.steamstatic.com/steamcommunity/public/images/items/1239690/3c552e43ee0609dd66b25c72e1e8db97e3aa2ffe.mp4'
        }
    })

    const videoType = computed(() => {
        const format = props.source.slice(props.source.lastIndexOf('.')+1, props.source.length) 
        return 'video/' + format;
    })


</script>


<template>
        <video :id="id" class="background-video" autoplay loop muted :poster="poster">
            <source :src="source" :type="videoType">
        </video>
</template>


<style scoped>
    .background-video {
        width: 100vw;
        height: 100vh;
        position: fixed;
        object-fit: cover;
        filter: blur(1px); 
        z-index: -1;
    }
</style>


