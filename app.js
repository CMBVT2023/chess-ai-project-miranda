// Imports the various functions from the modules in the JS folder.
import { computerVsComputer } from "./js/ComputerVsComputer.js";
import { playerVsComputer } from "./js/PlayerVsComputer.js";


class ChessSelection {
    constructor() {
        // Initializes various attributes and declares them with the elements on the webpage.

        // // Elements involved with the Game Mode Selection.
        this.gameOptions = document.getElementById('mode-type');
        [this.playerVsNPC, this.NPCVsNPC] = this.gameOptions.querySelectorAll('input')
        
        // // Elements involved with the Game Mode Options.
        this.npcModeForm = document.getElementById('player-mode-options');
        this.multiNPCModeForm = document.getElementById('npc-mode-options');
        
        // // Display elements for the various Computer Players.
        this.mainNPCDisplay = document.getElementById('player-vs-npc-info');
        this.multiNPCDisplay = document.getElementById('npc-vs-npc-info');
        
        // // Interactive button elements.
        this.reloadButton = document.getElementById('reload-button');
        this.npcVsNPCButtons = document.getElementById('npc-vs-npc-buttons');
        
        // // Main game board container
        this.gameDiv = document.getElementById('mainBoard');

        // // Various Display elements
        this.numberSpanElements = document.querySelectorAll('span');
        this.currentTurnStatus = document.getElementById('current-turn');
        this.currentGameStatus = document.getElementById('game-status');

        this.loadEventListeners();
    }
    
    // Initializes a method to reload the current chess game.
    reloadGame() {
        // The main board is cleared and its hidden class is toggled.
        this.gameDiv.classList.toggle('hidden');
        this.gameDiv.innerHTML = ``;
    
        // The various game mode selections are displayed on screen and their respective button elements 
        // become interactive again.
        this.gameOptions.classList.toggle('hidden');
        this.playerVsNPC.disabled = false;
        this.NPCVsNPC.disabled = false;
    
        // Checks which info display had its hidden class previously removed, and appends said class back to hide it once again.
        if (this.mainNPCDisplay.classList.contains('hidden')) {
            this.multiNPCDisplay.classList.toggle('hidden')
        } else if (this.multiNPCDisplay.classList.contains('hidden')) {
            this.mainNPCDisplay.classList.toggle('hidden')
        }
    
        // Hides the reload button from the page and if necessary, the extra buttons used for the Computer Vs Computer Game Mode.
        this.reloadButton.classList.toggle('hidden');
        if (!this.npcVsNPCButtons.classList.contains('hidden')) {
            this.npcVsNPCButtons.classList.toggle('hidden');
        }
        
        // Selects all span elements on the page and sets their innerHTML to '0', their original value.
        this.numberSpanElements.forEach(span => span.innerHTML = '0');
    
        // Selects all game info elements and sets their innerHTML to their original values.
        this.currentTurnStatus.innerHTML = 'White';
        this.currentGameStatus.innerHTML = 'Not Started';
    }

    // Initializes a method to load the Computer Vs Computer Game Mode and display its various options.
    loadComputerVsComputer() {
        // Reveals the options for the Computer Vs Computer Game Mode.
        this.multiNPCModeForm.classList.toggle('hidden');

        // Initializes an eventListener on the Computer Vs Computer Game Mode Form that will trigger once the 'submit' event occurs, and the once option is added within this eventListener
        // to only allow the submit event to trigger once.
        this.multiNPCModeForm.addEventListener('submit', (e) => {
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
            this.multiNPCModeForm.classList.toggle('hidden');
            this.gameOptions.classList.toggle('hidden');

            // Reveals these web page elements necessary for the game to commence.
            this.multiNPCDisplay.classList.toggle('hidden')
            this.reloadButton.classList.toggle('hidden');
            this.gameDiv.classList.toggle('hidden');
            this.npcVsNPCButtons.classList.toggle('hidden');

            // Initialize two variables to store the respective displays for Computer Player one and Computer Player Two.
            // The display elements are first selected and stored in a node list before being deconstructed and stored in the two variables.
            const [npcOneDisplay, npcTwoDisplay] = this.multiNPCDisplay.querySelectorAll('div');

            // Calls the computerVsComputer function, found in its same named module, with the necessary arguments.
            // // Argument one is the delay in the Computer Players moves,
            // // the second and third are the npc modes,
            // // and the last two arguments are used to pass in the NPC display elements.
            computerVsComputer(250, npcOneType, npcTwoType, npcOneDisplay, npcTwoDisplay);
        }, {once:true})

        // Disables or reenabled the button interaction for the opposing game mode based said button's current disabled status.
        this.playerVsNPC.disabled ? this.playerVsNPC.disabled = false : this.playerVsNPC.disabled = true;
    }

    // Initializes a method to load the Player Vs Computer Game Mode and display its various options.
    loadPlayerVsComputer() {
        // Reveals the options for the Player Vs Computer Game Mode.
        this.npcModeForm.classList.toggle('hidden');
        
        // Initializes an eventListener on the Player Vs Computer Game Mode Form that will trigger once the 'submit' event occurs, and the once option is added within this eventListener
        // to only allow the submit event to trigger once.
        this.npcModeForm.addEventListener('submit', (e) => {
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
            this.gameOptions.classList.toggle('hidden');
            this.npcModeForm.classList.toggle('hidden');
            
            // Reveals these web page elements necessary for the game to commence.
            this.gameDiv.classList.toggle('hidden');
            this.reloadButton.classList.toggle('hidden');
            this.mainNPCDisplay.classList.toggle('hidden');
            
            // Calls the playerVsComputer function, found in its same named module, with the necessary arguments.
            // // Argument one is the delay in the Computer Players moves,
            // // the second is the Computer Player's mode,
            // // and the third is the Computer Player's Display element passed in.
            playerVsComputer(250, npcType, this.mainNPCDisplay);
        }, {once:true})
        
        // Disables or reenabled the button interaction for the opposing game mode based said button's current disabled status.
        this.NPCVsNPC.disabled ? this.NPCVsNPC.disabled = false : this.NPCVsNPC.disabled = true;
    }

    // Initializes a method to load the default eventListeners for the page.
    loadEventListeners() {
        // Loads an eventListener on each game mode button that will trigger upon a 'click' event and will call each button's respective loading function.
        this.playerVsNPC.addEventListener('click', this.loadPlayerVsComputer.bind(this));
        this.NPCVsNPC.addEventListener('click', this.loadComputerVsComputer.bind(this));

        // Loads an eventListener for the reload button that will trigger upon a 'click' event and will call the reloadGame event.
        this.reloadButton.addEventListener('click', this.reloadGame.bind(this));
    }
}

let initialChessSelection = new ChessSelection();