<template>
    <label :for="selectId" v-if="hasLabel"> 
        {{ labelText }}
    </label>
    <select class="select" 
           :id="selectId" 
           @change="$emit('getValue', $event.target.value)"
           required>
           <slot></slot>
    </select>
</template>

<script setup>

    defineEmits([
        'getValue'
    ])

    defineProps({
        value: {
            type: String,
            default: ''
        },
        selectId: {
            type: String
        },
        labelText: {
            type: String
        },
        hasLabel: {
            type: Boolean,
            default: false
        },
        height: {
            type: String,
            default: '2.4em'
        },
    })

</script>

<style scoped>
    .select {
        width: 100%;
        height: v-bind(height);
        padding-left: 15px;
        padding-right: 15px;
        border-radius: 5px;
        font-weight: 500;
        font-size: 1em;
    }
    option {
        font-weight: 500;
        font-size: 1.15em;
    }
</style>