import { computerVsComputer } from "./js/ComputerVsComputer.js";
import { playerVsComputer } from "./js/PlayerVsComputer.js";

const gameOptions = document.getElementById('mode-type');
const [playerVsNPC, NPCVsNPC] = gameOptions.querySelectorAll('input')
const npcModeForm = document.getElementById('player-mode-options');
const multiNPCModeForm = document.getElementById('npc-mode-options');
const reloadButton = document.getElementById('reload-button');
const gameDiv = document.getElementById('mainBoard');
const mainNPCDisplay = document.getElementById('player-vs-npc-info');
const multiNPCDisplay = document.getElementById('npc-vs-npc-info');

const npcVsNPCButtons = document.getElementById('npc-vs-npc-buttons');

function reloadGame() {
    gameDiv.classList.toggle('hidden');
    gameDiv.innerHTML = ``;

    gameOptions.classList.toggle('hidden');
    reloadButton.classList.toggle('hidden');
    playerVsNPC.disabled = false;
    NPCVsNPC.disabled = false;
    if (mainNPCDisplay.classList.contains('hidden')) {
        multiNPCDisplay.classList.toggle('hidden')
    } else if (multiNPCDisplay.classList.contains('hidden')) {
        mainNPCDisplay.classList.toggle('hidden')
    }

    let numberSpanElements = document.querySelectorAll('span');
    numberSpanElements.forEach(span => span.innerHTML = '0');

    const currentTurnStatus = document.getElementById('current-turn');
    const currentGameStatus = document.getElementById('game-status');
    currentTurnStatus.innerHTML = 'White';
    currentGameStatus.innerHTML = 'Not Started';
    if (!npcVsNPCButtons.classList.contains('hidden')) {
        npcVsNPCButtons.classList.toggle('hidden');
    }
}

function loadComputerVsComputer() {
    multiNPCModeForm.classList.toggle('hidden');

    multiNPCModeForm.addEventListener('submit', (e) => {
        e.preventDefault();

        let npcOneType;
        let npcTwoType;

        for (const item of document.getElementsByClassName('npc-one-mode')) {
            if (item.checked) {
                npcOneType = item.value;
                break;
            }
        }

        for (const item of document.getElementsByClassName('npc-two-mode')) {
            if (item.checked) {
                npcTwoType = item.value;
                break;
            }
        }

        multiNPCModeForm.classList.toggle('hidden');
        gameOptions.classList.toggle('hidden');
        reloadButton.classList.toggle('hidden');
        multiNPCDisplay.classList.toggle('hidden')
        const [npcOneDisplay, npcTwoDisplay] = multiNPCDisplay.querySelectorAll('div');

        gameDiv.classList.toggle('hidden');
        npcVsNPCButtons.classList.toggle('hidden');
        computerVsComputer(250, npcOneType, npcTwoType, npcOneDisplay, npcTwoDisplay);
    }, {once:true})

    playerVsNPC.disabled ? playerVsNPC.disabled = false : playerVsNPC.disabled = true;
}

function loadPlayerVsComputer() {
    npcModeForm.classList.toggle('hidden');

    npcModeForm.addEventListener('submit', (e) => {
        e.preventDefault();

        let npcType;

        for (const item of document.getElementsByClassName('npc-mode')) {
            if (item.checked) {
                npcType = item.value;
                break;
            }
        }

        npcModeForm.classList.toggle('hidden');
        gameOptions.classList.toggle('hidden');
        reloadButton.classList.toggle('hidden');
        mainNPCDisplay.classList.toggle('hidden');

        gameDiv.classList.toggle('hidden');
        playerVsComputer(250, npcType, mainNPCDisplay);
    }, {once:true})

    NPCVsNPC.disabled ? NPCVsNPC.disabled = false : NPCVsNPC.disabled = true;
}

function loadEventListeners() {
    playerVsNPC.addEventListener('click', () => {
        loadPlayerVsComputer();
    })
    NPCVsNPC.addEventListener('click', () => {
        loadComputerVsComputer();
    })
    reloadButton.addEventListener('click', reloadGame);
}

loadEventListeners()