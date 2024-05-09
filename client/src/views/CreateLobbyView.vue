<script setup>
    import InputComponent from "@/components/global_components/InputComponent.vue"
    import ButtonComponent from "@/components/global_components/ButtonComponent.vue"
    import SelectComponent from "../components/global_components/SelectComponent.vue";

    import { ref, onMounted } from 'vue';

    import { useRouter } from "vue-router";
    import axios from "axios";

    const router = useRouter();

    const lobbyName = ref('');
    const pass = ref('');
    const chosenGame = ref('tic_tac_toe');

    async function createLobby() {
        try {
            const res = await axios.post('http://localhost:8081/api/lobby/createLobby', {
                lobbyName: lobbyName.value,
                pass: pass.value,
                chosenGame: chosenGame.value,
            }, {withCredentials: true});
            router.push({name: 'joinId', params: {id: res.data.lobbyId}, query: {pass: pass.value}});
        } catch (err) {
            return err;
        }
    }


    onMounted(() => {
        const creationMenuForm = document.querySelector('#creation-menu-form');

        creationMenuForm.onsubmit = (e) => e.preventDefault();
    })


</script>

<template>
    <div class="main">
        <div class="creation-menu-container">
            <form id="creation-menu-form">
                <div class="creation-menu">
                    <h2>Lobby Creation</h2>
                    <div class="lobby-name-container input-container">
                        <InputComponent input-id="lobby-name-input" 
                                        placeholder-text="Lobby name" 
                                        label-text="Lobby name"
                                        :has-label=true 
                                        @get-value="(value) => lobbyName = value"/>
                    </div>


                    <div class="lobby-pass-container input-container">
                        <InputComponent input-id="lobby-pass-input" 
                                        placeholder-text="Lobby pass" 
                                        label-text="Lobby pass"
                                        :has-label=true 
                                        input-type="password"
                                        @get-value="(value) => pass = value "/>
                    </div>

                    <div class="lobby-chooseGame-container input-container">
                        <SelectComponent select-id="chosen-game" @get-value="value => chosenGame = value">
                            <option value="tic_tac_toe">Tic Tac Toe</option>
                        </SelectComponent>  
                    </div>

                    <ButtonComponent id="createBtn" button-text="Create" @click="createLobby"/>
                </div>
            </form>
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

    .creation-menu-container {
        width: 80%;
        height: 80%;
        background-color: white;
        display: flex;
        justify-content: center;
        border-radius: 10px;
    }

    .creation-menu {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        min-width: 80%;
        max-width: 90%;
        gap: 15px;
    }

    .input-container {
        width: 100%;
    }

</style>