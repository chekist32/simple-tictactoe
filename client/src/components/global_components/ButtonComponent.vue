<template>
    <button class="btn"><span>{{ buttonText }}</span></button>
</template>

<script setup>
    defineProps({
        buttonText: {
            type: String
        },
        
        minHeight: {
            type: String,
            default: '3.7em'
        },
        minWidth: {
            type: String,
            default: '10em'
        },
        fontSize: {
            type: String,
            default: '1.8em'
        }
    })
</script>

<style scoped>
    .btn {
        background-color: white;
        min-height: v-bind(minHeight);
        min-width: v-bind(minWidth);
        border-radius: 5px;
        box-shadow: 1px 1px 1px gray;
        text-align: center;
    }
    span {
        font-size: v-bind(fontSize);
    }
</style>