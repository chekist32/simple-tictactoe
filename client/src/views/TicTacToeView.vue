<script setup>
    import PopupComponent from '@/components/global_components/PopupComponent.vue';
    import ButtonComponent from '@/components/global_components/ButtonComponent.vue';

    import { RouterLink, useRouter } from 'vue-router';

    import { computed, onBeforeMount, onUnmounted, ref, } from 'vue';

    import { useUserStore } from '@/store/user.js'

    const userStore = useUserStore();

    const router = useRouter();

    const gameData = ref(null);

    const playerData = ref(null);

    const socket = ref(null);

    function isReadyClickHandler() {
        socket.value.send(JSON.stringify({
            object: 'tictactoe',
            type: 'changeReadyState',
            payload: {
                gameData: {
                    lobbyId: userStore.lobbyId,
                    isReady: !playerData.value.isReady
                }
            }
        }))
    }

    function startGameClickHandler() {
        if (Object.values(gameData.value.players).every(player => player.isReady)) {
            socket.value.send(JSON.stringify({
            object: 'tictactoe',
            type: 'startGame',
            payload: {
                gameData: {
                    lobbyId: userStore.lobbyId,
                }
            }
        }))
        }
    }

    function markCellClickHandler(e) {
        const splitedPositionStr = e.target.getAttribute('position').split(' ');
        const row = splitedPositionStr[0].split('-')[1]
        const column = splitedPositionStr[1].split('-')[1]

        if (gameData.value && gameData.value.turn === userStore.userId) {
            socket.value.send(JSON.stringify({
            object: 'tictactoe',
            type: 'makeMove',
            payload: {
                gameData: {
                    lobbyId: userStore.lobbyId,
                    coordinates: {
                        row: row,
                        column: column
                    }
                }
            }
        }))
        }
    }

    const undefinedPlayers = computed(() => {
        if (!gameData.value) return null;

        return Object.values(gameData.value.players).filter(player => player.chosenSide === null);
    })

    const playerX = computed(() => {
        if (!gameData.value) return null;

        return Object.values(gameData.value.players).find(player => player.chosenSide === 1);
    })
    const playerO = computed(() => {
        if (!gameData.value) return null;
        
        return Object.values(gameData.value.players).find(player => player.chosenSide === 0); 
    })

    const PlayerOBackgroundColor = computed(() => {
        if (!gameData.value) return null;

        const player = Object.values(gameData.value.players).find(player => player.chosenSide === 0)

        return player.isReady ? 'background-color: green' : 'background-color: yellow';
    })

    const PlayerXBackgroundColor = computed(() => {
        if (!gameData.value) return null;

        const player = Object.values(gameData.value.players).find(player => player.chosenSide === 1)

        return player.isReady ? 'background-color: green' : 'background-color: yellow';
    })

    onBeforeMount(() => {
        socket.value = userStore.socket;

        socket.value.send(JSON.stringify({
            object: 'tictactoe',
            type: 'initGame',
            payload: {
                gameData: {
                    lobbyId: userStore.lobbyId,
                }
            }
        }))

        socket.value.send(JSON.stringify({
            object: 'tictactoe',
            type: 'joinGame',
            payload: {
                gameData: {
                    lobbyId: userStore.lobbyId,
                }
            }
        }))


        socket.value.onmessage = (msg) => {
            const parsedMsg = JSON.parse(msg.data);
            switch (parsedMsg.type) {
                case 'updateGame':
                    if (parsedMsg.payload.gameData === null) {
                        return router.push({name: 'join'});
                    }
                    gameData.value = parsedMsg.payload.gameData;
                    playerData.value = parsedMsg.payload.gameData.players[userStore.userId];
                    break;

                default:
                    break;
            }
        };
    })

    function chooseSideClickHandler(side) {
        if (side === 1 || side === 0 || side === null) {
            socket.value.send(JSON.stringify({
            object: 'tictactoe',
            type: 'chooseSide',
            payload: {
                gameData: {
                    lobbyId: userStore.lobbyId,
                    chosenSide: side
                }
            }
        })) 
        }
    }     

    function restartClickHandler() {
        socket.value.send(JSON.stringify({
            object: 'tictactoe',
            type: 'restartGame',
            payload: {
                gameData: {
                    lobbyId: userStore.lobbyId,
                }
            }
        }));
    }

    const gameStateComputed = computed(() => {
        if (!gameData.value) return null; 

        const arr = gameData.value.gameState;

        const concatedArray = [].concat(...arr);

        return concatedArray;
    })

    function cellPositionGenerator(index) {
        if (!gameData.value) return '';

        return 'row-' + Math.floor(index/3) + ' ' + 'column-' + index%3;
    }

    onUnmounted(() => {

        socket.value.send(JSON.stringify({
            object: 'tictactoe',
            type: 'leaveGame',
            payload: {
                gameData: {
                    lobbyId: userStore.lobbyId,
                }
            }
        }));

        socket.value.send(JSON.stringify({
            object: 'lobby',
            type: 'leaveLobby',
            payload: {
                lobbyData: {
                    lobbyId: userStore.lobbyId,
                }
            }
        }));

        userStore.lobbyId = null;
    })
</script>

<template>
    <div class="main" v-if="gameData">
        <div class="game-container">

            <div class="game">
                <div class="tictactoe-table">
                    <div class="cell" 
                         :position="cellPositionGenerator(index)" 
                         v-for="(cell, index) in gameStateComputed" :key="index"
                         @click="markCellClickHandler">
                        <img src="../../assets/tictactoe/o.svg" class="o" v-if="cell === 0">
                        <img src="../../assets/tictactoe/x.svg" class="x" v-else-if="cell === 1">
                    </div>
                </div>
            </div>
            
            <div class="aside">
                <div class="turn" v-if="gameData.turn"> <h2>Turn: {{ gameData.players[gameData.turn].username }}</h2> </div>
                <div class="player-board">
                    <div class="players">
                        <div class="player-x">
                            <div class="joined-component" v-if="playerX">
                                <div class="cancel" @click="chooseSideClickHandler(null)" v-if="playerData.chosenSide === 1 && !gameData.turn">&#x1F5D9;</div>
                                <div class="username-conatiner" :style="PlayerXBackgroundColor">
                                    <p class="username">{{ playerX.username }} (&#x1F5D9;)</p>
                                    
                                </div>
                            </div>
                            
                            <div class="join-component" v-else>
                                <div class="occupy" @click="chooseSideClickHandler(1)">+</div>
                                <div class="x-side">Player &#x1F5D9;</div>
                            </div>
                        </div>
                        <div class="player-o">
                            <div class="joined-component" v-if="playerO">
                                <div class="cancel" @click="chooseSideClickHandler(null)" v-if="playerData.chosenSide === 0 && !gameData.turn">&#x1F5D9;</div>
                                <div class="username-conatiner" :style="PlayerOBackgroundColor">
                                    <p class="username">{{ playerO.username }} (O) </p>    
                                </div>
                            </div>
                            
                            <div class="join-component" v-else>
                                <div class="occupy" @click="chooseSideClickHandler(0)">+</div>
                                <div class="o-side">Player O</div>
                            </div>
                        </div>
                    </div>


                    <div class="undefined-players-container" v-if="!gameData?.turn">
                        <h5>Undefined Players</h5>
                        <div class="undefined-player" v-for="undefinedPlayer in undefinedPlayers" :key="undefinedPlayer.userId">
                            {{ undefinedPlayer.username }} 
                        </div>
                        <br>
                        <!-- </div> -->
                    </div> 
                </div>
                <div class="buttons-container" v-if="playerData">
                    
                        <ButtonComponent button-text="Ready" @click="isReadyClickHandler" v-if="!playerData.isReady && !gameData.turn"/>
                        <ButtonComponent button-text="&#x1F5D9;" 
                                         @click="isReadyClickHandler"
                                         v-if="playerData.isReady && !gameData.turn"
                                          />
                        <!-- <CheckBoxComponent label-text="Ready"
                                           font-size="1.5rem"  
                                           @get-value="isReadyClickHandler"
                                           :value="true" 
                                           v-if="!gameData.turn"/> -->

                    <ButtonComponent v-if="playerData.isAdmin && !gameData.turn" button-text="Start" @click="startGameClickHandler" />
                    <!-- <RouterLink :to="{name: 'test'}">
                        <ButtonComponent button-text="test" />
                    </RouterLink> -->
                </div>
            </div>
        </div>
        
        <PopupComponent v-if="gameData.status === 2">
            <div class="content">
                <div class="winner" v-if="gameData.winner !== 'none'">
                    <h3>The winner: {{ gameData.players[gameData.winner].username }}</h3>
                </div>
                <div class="draw" v-else-if="gameData.winner === 'none'">
                    <h4>Draw</h4>
                </div>
                <div class="popup-buttons">
                    <ButtonComponent button-text="Restart" @click="restartClickHandler" v-if="playerData.isAdmin" />
                    <RouterLink :to="{ name: 'join' }">
                        <ButtonComponent button-text="Leave" />
                    </RouterLink>
                </div>
            </div>
        </PopupComponent>
    </div>

</template>


<style scoped>
    .main {
        width: 100%;
        height: 100%;
        display: flex;
        align-items: center;
        justify-content: center;
    }
    .game-container {
        width: 70%;
        height: 70%;
        background-color: white;
        display: flex;
        border-radius: 10px;
    }

    .game {
        width: 70%;
        display: flex;
        align-items: center;
        justify-content: center;
    }
    .tictactoe-table {
        width: 90%;
        aspect-ratio: 4/3;
        max-height: 90%;
        background-color: yellow;
        display: grid;
        grid-template-rows: repeat(3, minmax(33.33%,1fr));
        grid-template-columns: repeat(3, minmax(33.33%,1fr));
        border: 1px solid black;
    }
    .cell {
        display: flex;
        justify-content: center;
        align-items: center;
        border: 1px solid black;
    }
    .cell:hover {
        cursor: pointer;
    }

    .o {
        width: 60%;
        max-height: 95%;
    }
    .x {
        width: 70%;
        max-height: 95%;
    }
    .aside {
        width: 30%;
    }

    .turn {
        text-align: center;
    }

    .player-board {
        height: 60%;
        overflow-y: auto;
        padding: 5px;
    }

    .players {
        height: 50%;
        max-width: 100%;
        display: flex;
        flex-direction: column;
        justify-content: center;
        gap: 5px;
        overflow-y: auto;
    }

    .player-x, .player-o {
        height: 20%;
    }

    .player-x:hover, .player-o:hover {
        background-color: #ebebeb;
    }

    .username-conatiner {
        font-size: 1.4em;
        flex-grow: 1;
        display: flex;
        align-items: center;
        padding-left: 5px;
    }

    .username {
        text-overflow: ellipsis;
        white-space: nowrap;
        overflow: hidden;
    }
    .cancel {
        display: flex;
        justify-content: center;
        align-items: center;
        font-size: 1.5em;
        border: 2px solid black;
        height: 100%;
        aspect-ratio: 1/1;
    }
    .cancel:hover {
        cursor: pointer;
    }

    .joined-component {
        display: flex;
        height: 100%;
    }

    .join-component {
        display: flex;
        height: 100%;
    }
    
    .occupy {
        font-size: 2.5em;
        border: 2px solid black;
        display: flex;
        align-items: center;
        justify-content: center;
        aspect-ratio: 1/1;
        margin-right: 5px;
    }

    .occupy:hover {
        cursor: pointer;
    }

    .o-side, .x-side {
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 1.7em;
    }

    .undefined-players-container {
        font-size: 1.3em;
    }

    .buttons-container {
        display: flex;
        flex-direction: column;
        padding-right: 10px;
        justify-content: center;
        align-items: center;
    }

    .content {
        display: flex;
        justify-content: center;
        align-items: center;
        flex-direction: column;
        gap: 5px;
    }

</style>