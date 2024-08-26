import { computerVsComputer } from "./js/ComputerVsComputer.js";
import { playerVsComputer } from "./js/PlayerVsComputer.js";

const gameOptions = document.getElementById('mode-type');
const npcModeForm = document.getElementById('player-mode-options');
const multiNPCModeForm = document.getElementById('npc-mode-options');
const reloadButton = document.getElementById('reload-button');

function reloadGame() {
    const gameDiv = document.getElementById('mainBoard')
    gameDiv.innerHTML = ``;

    gameOptions.classList.toggle('hidden');
    reloadButton.classList.toggle('hidden');
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
        computerVsComputer(250, npcOneType, npcTwoType);
    }, {once:true})
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
        playerVsComputer(250, npcType);
    }, {once:true})
}

function loadEventListeners() {
    gameOptions.querySelectorAll('input').forEach(button => {
        button.addEventListener('click', (e) => {
            if (e.target.value == "Computer Vs Computer") {
                loadComputerVsComputer();
            } else {
                loadPlayerVsComputer();
            };
        })
    })
    reloadButton.addEventListener('click', reloadGame);
}

loadEventListeners()