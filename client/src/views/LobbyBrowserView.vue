<script setup>
import ButtonComponent from "@/components/global_components/ButtonComponent.vue";
import InputComponent from "@/components/global_components/InputComponent.vue";
import CheckBoxComponent from "@/components/global_components/CheckBoxComponent.vue";
import PopupComponent from "../components/global_components/PopupComponent.vue";

import { computed, onBeforeMount, onBeforeUnmount, onMounted } from 'vue'
import { ref } from "vue";

import { useRoute } from "vue-router";
import { useRouter } from "vue-router";
import { RouterLink } from "vue-router";

import { useUserStore } from "@/store/user.js";


const searchBar = {
    inputId: 'search-bar-input',
    placeholderText: 'Search',
}

const userStore = useUserStore();

const hideFull = ref(false);
const hideLocked = ref(false);
const searchValue = ref('');

const route = useRoute();
const router = useRouter();

const lobbyMap = ref(new Map());
const filteredLobbyList = computed(() => {
    let lobbyList = Array.from(lobbyMap.value.values());

    if (hideLocked.value) {
        lobbyList = lobbyList.filter(lobby => lobby.isLocked === false);
    }

    if (hideFull.value) {
        lobbyList = lobbyList.filter(lobby => 
            parseInt(lobby.players.split('/')[0]) !== parseInt(lobby.players.split('/')[1])
        );
    }

    if (searchValue.value) {
        lobbyList = lobbyList.filter(lobby => 
            lobby.lobbyName.trim().toLowerCase().startsWith(searchValue.value.trim().toLowerCase()))
    }


    return lobbyList;
});

const socket = ref(null);



onBeforeMount(() => {

    socket.value = userStore.socket;
  
    (() => {
        const msg = {
        object: 'lobbyBrowser',
        type: 'getAllLobbies'
        }
    socket.value.send(JSON.stringify(msg));
    })();



    socket.value.onmessage = (msg) => {
        const parsedMsg = JSON.parse(msg.data);
        if (parsedMsg.object === "lobbyBrowser") {
            
            const lobbyData = parsedMsg.payload.lobbyData;

            switch (parsedMsg.type) {
                case 'getAllLobbies':
                    lobbyData.forEach(lobby => {
                        lobbyMap.value.set(lobby.lobbyId, lobby);                        
                    });
                    break;

                case 'createLobby':
                    lobbyMap.value.set(lobbyData.lobbyId, lobbyData);
                    break;

                case 'updateLobby':
                    lobbyMap.value.set(lobbyData.lobbyId, lobbyData);
                    break;

                case 'deleteLobby': 
                    lobbyMap.value.delete(lobbyData.lobbyId);
                    break;

                default:
                    break;
            }
        }
    };

    window.addEventListener('keydown', keyDownHandler);
})




const activeTrElement = ref(null);

function setActiveClickHandler(event) {
    if (!activeTrElement.value) {
        activeTrElement.value = event.target.parentElement;
        event.target.parentElement.classList.add('active');
        return;
    }

    activeTrElement.value.classList.remove('active');
    activeTrElement.value = event.target.parentElement;
    event.target.parentElement.classList.add('active');
}
function keyDownHandler(event) {
    switch (event.code) {
        case 'ArrowUp':
           if(!activeTrElement.value) {
                document.querySelector('.lobby-list-table-item').classList.add('active');
                activeTrElement.value = document.querySelector('.lobby-list-table-item');
                return;
            }  

            if (!activeTrElement.value.previousElementSibling ||
                !activeTrElement.value.previousElementSibling.classList.contains('lobby-list-table-item')) return;
                
                activeTrElement.value.classList.remove('active');
                activeTrElement.value = activeTrElement.value.previousElementSibling;
                activeTrElement.value.classList.add('active');
                break;
        
            case 'ArrowDown':
                if(!activeTrElement.value) {
                    document.querySelector('.lobby-list-table-item').classList.add('active');
                    activeTrElement.value = document.querySelector('.lobby-list-table-item');
                    return;
                }  

                if (!activeTrElement.value.nextElementSibling ||
                    !activeTrElement.value.nextElementSibling.classList.contains('lobby-list-table-item')) return;
                
                activeTrElement.value.classList.remove('active');
                activeTrElement.value = activeTrElement.value.nextElementSibling;
                activeTrElement.value.classList.add('active');
                break;

            case 'Enter':
                connect();
                break;
            default:
                break;
        }
    return;
}

const challengeRequired = ref(false);
const pass = ref('');


function connect() {
    if (activeTrElement.value) {
        if (activeTrElement.value.querySelector('.is-locked-column').innerText) {
            challengeRequired.value = true;
        }
        else router.push(route.path+'/'+activeTrElement.value.id);
    }
}

function formatChosenGameStr(str) {
    const arr = str.split('_');

    for (let i = 0; i < arr.length; i++)
        arr[i] = arr[i].charAt(0).toUpperCase() + arr[i].slice(1);

    return arr.join(" ");
}


onBeforeUnmount(()=> {
    window.removeEventListener('keydown', keyDownHandler);
    socket.value.onmessage = null;
});

</script>


<template>
    <div class="main">
        <div class="lobby-list-container">
            <div class="lobby-list">
                <div class="lobby-list-header">
                    <div class="lobby-list-header-title">
                        Lobby Browser
                    </div>
                <div class="input-container search-bar">
                     <InputComponent v-bind="searchBar" @get-value="(value) => searchValue = value"/>
                </div>
            </div>

            <div class="lobby-list-main">
                <table class="lobby-list-table">
                    <tr>
                        <th class="is-locked-column" style="">&#x1F6E1</th>
                        <th class="lobby-name-column">Lobby Name</th>
                        <th class="game-column">Game</th>
                        <th class="players-column">Players</th>
                    </tr>
                    <tr class="lobby-list-table-item" v-for="lobby in filteredLobbyList" 
                                                       :key="lobby.lobbyId" 
                                                       @click="setActiveClickHandler"
                                                       :id="lobby.lobbyId">
                        <td class="is-locked-column">{{ lobby.isLocked ? '&#x1F6E1' : '' }}</td>
                        <td class="lobby-name-column">{{ lobby.lobbyName }}</td>
                        <td class="game-column">{{ formatChosenGameStr(lobby.chosenGame) }}</td>
                        <td class="players-column">{{ lobby.players }}</td>
                    </tr>
                </table>
            </div>

            <div class="lobby-list-footer">
                <div class="lobby-list-footer-filters">
                    <CheckBoxComponent id="hide-full-checkbox" 
                                       font-size="1.5rem" 
                                       label-text="Hide full" 
                                       @get-value="(value) => hideFull = value"/>
                    <CheckBoxComponent id="hide-locked-checkbox" 
                                       font-size="1.5rem" 
                                       label-text="Hide locked" 
                                       @get-value="(value) => hideLocked = value"/>
                </div>
                <div class="lobby-list-footer-connectBtn">
                    <ButtonComponent @click="connect" button-text="Connect" id="connectBtn"/>
                </div>
            </div>
            <PopupComponent v-if="challengeRequired">
                <div class="password-window">
                    <InputComponent :has-label=true 
                                    label-text="Password" 
                                    placeholder-text="Password"
                                    @get-value="(value) => pass = value"/>
                    <div class="password-window-buttons">
                        <ButtonComponent button-text="Back" @click="challengeRequired=false" />
                     <RouterLink :to="{ name: 'joinId', params: { id: activeTrElement.id }, query: { pass: pass } }">
                        <ButtonComponent id="enterBtn" button-text="Enter" />
                    </RouterLink>
                    </div>
                </div>
            </PopupComponent>
            </div>
        </div>
    </div>
</template>


<style scoped>
    * {
        --lobby-list-container-height: 80%;
        --active-element-color: gray;
    }
    .main {
        display: flex;
        align-items: center;
        justify-content: center;
    }

    .lobby-list-container {
        height: var(--lobby-list-container-height);
        width: calc(3/4 * var(--lobby-list-container-height));
        display: flex;
        background-color: #ebebeb;
        border-radius: 10px;
    }
    .lobby-list {
        display: flex;
        flex-direction: column;
        flex-grow: 1;
    }
    .lobby-list-header {
        flex-grow: 1;
        display: flex;
    }
    .lobby-list-header-title {
        flex-grow: 3;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 1.3rem;
        min-width: fit-content;
    }
    .search-bar {
        flex-grow: 6;
        display: flex;
        align-items: center;
        justify-content: center;
        padding-right: 1rem;
    }
    .lobby-list-main {
        flex-grow: 19;
        overflow-y: auto;
        background-color: white;
    }

    table {
        width: 100%;
        table-layout: fixed;
        border-collapse: collapse;
        font-size: 20px;
    }

    .active {
        background-color: var(--active-element-color);
    }

    tr {
        cursor: pointer;
    }
    .lobby-list-table-item:hover {
        background-color: var(--active-element-color);
    }

    th {
        border-left: 1px black solid;
        height: 1.5em;
        text-align: center;
        min-width: fit-content;
    }

    th:hover {
        color: #3879d9;
    }

    td {
        text-align: center;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
    }

    .lobby-list-table-item {
        margin: 2px;
        border-top: 1px solid black;
        border-bottom: 1px solid black;
        height: 2.5em;
    }
    .is-locked-column {
        border: none;
        width: 7%;

    }

    .lobby-name-column {
        width: 40%;
    }

    .players-column {
        max-width: fit-content;
    }

    .lobby-list-footer {
        flex-grow: 1;
        display: flex;
    }
    .lobby-list-footer-filters {
        display: flex;
        align-items: center;
        gap: 1rem;
        padding-left: 1.3rem;
        flex-grow: 1;
    }

    .lobby-list-footer-filters .checkbox {
        width: 1.4rem;
        height: 1.4rem;
    }

    .lobby-list-footer-connectBtn {
        flex-grow: 3;
        display: flex;
        align-self: center;
        justify-content: end;
        padding-right: 3.5em;
    }

    .password-window {
        height: 100%;
        display: flex;
        align-items: center;
        flex-direction: column;
        justify-content: center;
        gap: 10px;
    }

   .password-window-buttons {
        display: flex;
        align-items: center;
   }



@media screen and (max-width: 780px) {

    .lobby-list-container {
        width: 90%;
        height: 90%;
    }

    .lobby-list-footer {
        padding: 0.5rem 0 0.5rem 0;
    }

    .lobby-list-header {
        padding: 0.5rem 0 0.5rem 0.7rem;
        gap: 0.7rem;
    }
    .lobby-list-footer-filters {
        flex-direction: column;
        align-items: start;
        justify-content: center;
    }

    .lobby-list-footer-connectBtn {
        padding: 0;
        display: flex;
        align-items: center;
        justify-content: center;
    }
}

</style>