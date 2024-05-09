<script setup>

</script>


<template>
    <div class="popup">
        <div class="popup-content">
            <slot></slot>
        </div>
    </div>

</template>


<style scoped>

    .popup {
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

    .popup-content {
        width: 40%;
        height: 40%;
        background-color: white;
        padding: 20px;
        border-radius: 5px;
    }

</style>