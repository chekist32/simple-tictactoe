<template>
        <label :for="inputId" v-if="hasLabel"> 
            {{ labelText }}
        </label>
        <input class="input" 
               :id="inputId" 
               :placeholder="placeholderText"
               :type="inputType" :maxlength="maxLength" min="1" max="16"
               :value="value"
               @input="$emit('getValue', $event.target.value)"
               @keydown.enter="$emit('keyDownEnter', $event)">
</template>

<script setup>
    defineEmits([
        'getValue',
        'keyDownEnter'
    ])

    defineProps({
        value: {
            type: String,
            default: ''
        },
        inputId: {
            type: String
        },
        placeholderText: {
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
        inputType: {
            type: String,
            default: 'text'
        },
        maxLength: {
            type: String,
            default: '64'
        }
    })

</script>

<style scoped>
    .input {
        width: 100%;
        height: v-bind(height);
        padding-left: 15px;
        padding-right: 15px;
        border-radius: 5px;
        font-weight: 500;
        font-size: 1em;
    }
    .input::placeholder {
        font-weight: 500;
        font-size: 1.15em;
    }
</style>