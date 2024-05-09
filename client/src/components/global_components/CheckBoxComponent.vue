<template>
    <label>
        <input class="checkbox" 
               type="checkbox" 
               name="" 
               @change="$emit('getValue', $event.target.checked)">
        {{ labelText }}
    </label>
</template>

<script setup>
    defineEmits([
        'getValue'
    ])

    defineProps({
        labelText: {
            type: String
        },
        fontSize: {
            type: String
        }
    })

</script>

<style scoped>
    label {
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 0.3rem;
        font-size: calc(v-bind(fontSize) / 1.2);
    }
    .checkbox {
        width: v-bind(fontSize);
        height: v-bind(fontSize);
    }
</style>