// Imports the various functions from the modules in the JS folder.
import { computerVsComputer } from "./js/ComputerVsComputer.js";
import { playerVsComputer } from "./js/PlayerVsComputer.js";

// Initializes various variables and declares them with the elements on the webpage.

// // Elements involved with the Game Mode Selection.
const gameOptions = document.getElementById('mode-type');
const [playerVsNPC, NPCVsNPC] = gameOptions.querySelectorAll('input')

// // Elements involved with the Game Mode Options.
const npcModeForm = document.getElementById('player-mode-options');
const multiNPCModeForm = document.getElementById('npc-mode-options');

// // Display elements for the various Computer Players.
const mainNPCDisplay = document.getElementById('player-vs-npc-info');
const multiNPCDisplay = document.getElementById('npc-vs-npc-info');

// // Interactive button elements.
const reloadButton = document.getElementById('reload-button');
const npcVsNPCButtons = document.getElementById('npc-vs-npc-buttons');

// // Main game board container
const gameDiv = document.getElementById('mainBoard');

// Initializes a function to reload the current chess game.
function reloadGame() {
    // The main board is cleared and its hidden class is toggled.
    gameDiv.classList.toggle('hidden');
    gameDiv.innerHTML = ``;

    // The various game mode selections are displayed on screen and their respective button elements 
    // become interactive again.
    gameOptions.classList.toggle('hidden');
    playerVsNPC.disabled = false;
    NPCVsNPC.disabled = false;

    // Checks which info display had its hidden class previously removed, and appends said class back to hide it once again.
    if (mainNPCDisplay.classList.contains('hidden')) {
        multiNPCDisplay.classList.toggle('hidden')
    } else if (multiNPCDisplay.classList.contains('hidden')) {
        mainNPCDisplay.classList.toggle('hidden')
    }

    // Hides the reload button from the page and if necessary, the extra buttons used for the Computer Vs Computer Game Mode.
    reloadButton.classList.toggle('hidden');
    if (!npcVsNPCButtons.classList.contains('hidden')) {
        npcVsNPCButtons.classList.toggle('hidden');
    }
    
    // Selects all span elements on the page and sets their innerHTML to '0', their original value.
    let numberSpanElements = document.querySelectorAll('span');
    numberSpanElements.forEach(span => span.innerHTML = '0');

    // Selects all game info elements and sets their innerHTML to their original values.
    const currentTurnStatus = document.getElementById('current-turn');
    const currentGameStatus = document.getElementById('game-status');
    currentTurnStatus.innerHTML = 'White';
    currentGameStatus.innerHTML = 'Not Started';
}

// Initializes a function to load the Computer Vs Computer Game Mode and display its various options.
function loadComputerVsComputer() {
    // Reveals the options for the Computer Vs Computer Game Mode.
    multiNPCModeForm.classList.toggle('hidden');

    // Initializes an eventListener on the Computer Vs Computer Game Mode Form that will trigger once the 'submit' event occurs, and the once option is added within this eventListener
    // to only allow the submit event to trigger once.
    multiNPCModeForm.addEventListener('submit', (e) => {
        // Prevents the page from reloading.
        e.preventDefault();

        // Initializes two variables to store the mode for each Computer Player.
        let npcOneType;
        let npcTwoType;

        // Both for loops iterate through the various mode options for the Computer Players and sets the the selected type equal to the npc's type variable,
        // the first for loop is for npcOne and the second is for npcTwo.
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

        // Hides the web page elements that are no longer needed.
        multiNPCModeForm.classList.toggle('hidden');
        gameOptions.classList.toggle('hidden');

        // Reveals these web page elements necessary for the game to commence.
        multiNPCDisplay.classList.toggle('hidden')
        reloadButton.classList.toggle('hidden');
        gameDiv.classList.toggle('hidden');
        npcVsNPCButtons.classList.toggle('hidden');

        // Initialize two variables to store the respective displays for Computer Player one and Computer Player Two.
        // The display elements are first selected and stored in a node list before being deconstructed and stored in the two variables.
        const [npcOneDisplay, npcTwoDisplay] = multiNPCDisplay.querySelectorAll('div');

        // Calls the computerVsComputer function, found in its same named module, with the necessary arguments.
        // // Argument one is the delay in the Computer Players moves,
        // // the second and third are the npc modes,
        // // and the last two arguments are used to pass in the NPC display elements.
        computerVsComputer(250, npcOneType, npcTwoType, npcOneDisplay, npcTwoDisplay);
    }, {once:true})

    // Disables or reenabled the button interaction for the opposing game mode based said button's current disabled status.
    playerVsNPC.disabled ? playerVsNPC.disabled = false : playerVsNPC.disabled = true;
}

// Initializes a function to load the Player Vs Computer Game Mode and display its various options.
function loadPlayerVsComputer() {
    // Reveals the options for the Player Vs Computer Game Mode.
    npcModeForm.classList.toggle('hidden');
    
    // Initializes an eventListener on the Player Vs Computer Game Mode Form that will trigger once the 'submit' event occurs, and the once option is added within this eventListener
    // to only allow the submit event to trigger once.
    npcModeForm.addEventListener('submit', (e) => {
        // Prevents the page from reloading.
        e.preventDefault();
        
        // Initializes a variable to store the mode for the Computer Player.
        let npcType;
        
        // Iterates through the various npc modes and sets the selected one equal to the Computer Player's mode variable.
        for (const item of document.getElementsByClassName('npc-mode')) {
            if (item.checked) {
                npcType = item.value;
                break;
            }
        }
        
        // Hides the web page elements that are no longer needed.
        gameOptions.classList.toggle('hidden');
        npcModeForm.classList.toggle('hidden');
        
        // Reveals these web page elements necessary for the game to commence.
        gameDiv.classList.toggle('hidden');
        reloadButton.classList.toggle('hidden');
        mainNPCDisplay.classList.toggle('hidden');
        
        // Calls the playerVsComputer function, found in its same named module, with the necessary arguments.
        // // Argument one is the delay in the Computer Players moves,
        // // the second is the Computer Player's mode,
        // // and the third is the Computer Player's Display element passed in.
        playerVsComputer(250, npcType, mainNPCDisplay);
    }, {once:true})
    
    // Disables or reenabled the button interaction for the opposing game mode based said button's current disabled status.
    NPCVsNPC.disabled ? NPCVsNPC.disabled = false : NPCVsNPC.disabled = true;
}

// Initializes a function to load the default eventListeners for the page.
function loadEventListeners() {
    // Loads an eventListener on each game mode button that will trigger upon a 'click' event and will call each button's respective loading function.
    playerVsNPC.addEventListener('click', loadPlayerVsComputer);
    NPCVsNPC.addEventListener('click', loadComputerVsComputer);

    // Loads an eventListener for the reload button that will trigger upon a 'click' event and will call the reloadGame event.
    reloadButton.addEventListener('click', reloadGame);
}

// Calls the function to load the default eventListeners.
loadEventListeners()