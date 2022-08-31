// Database
function Database() {
    return [
        {
            "species": "Triceratops",
            "weight": 13000,
            "height": 114,
            "diet": "herbavor",
            "where": "North America",
            "when": "Late Cretaceous",
            "fact": "First discovered in 1889 by Othniel Charles Marsh"
        },
        {
            "species": "Tyrannosaurus Rex",
            "weight": 11905,
            "height": 144,
            "diet": "carnivor",
            "where": "North America",
            "when": "Late Cretaceous",
            "fact": "The largest known skull measures in at 5 feet long."
        },
        {
            "species": "Anklyosaurus",
            "weight": 10500,
            "height": 55,
            "diet": "herbavor",
            "where": "North America",
            "when": "Late Cretaceous",
            "fact": "Anklyosaurus survived for approximately 135 million years."
        },
        {
            "species": "Brachiosaurus",
            "weight": 70000,
            "height": "372",
            "diet": "herbavor",
            "where": "North America",
            "when": "Late Jurasic",
            "fact": "An asteroid was named 9954 Brachiosaurus in 1991."
        },
        {
            "species": "Stegosaurus",
            "weight": 11600,
            "height": 79,
            "diet": "herbavor",
            "where": "North America, Europe, Asia",
            "when": "Late Jurasic to Early Cretaceous",
            "fact": "The Stegosaurus had between 17 and 22 seperate places and flat spines."
        },
        {
            "species": "Elasmosaurus",
            "weight": 16000,
            "height": 59,
            "diet": "carnivor",
            "where": "North America",
            "when": "Late Cretaceous",
            "fact": "Elasmosaurus was a marine reptile first discovered in Kansas."
        },
        {
            "species": "Pteranodon",
            "weight": 44,
            "height": 20,
            "diet": "carnivor",
            "where": "North America",
            "when": "Late Cretaceous",
            "fact": "Actually a flying reptile, the Pteranodon is not a dinosaur."
        },
        {
            "species": "Pigeon",
            "weight": 0.5,
            "height": 9,
            "diet": "herbavor",
            "where": "World Wide",
            "when": "Holocene",
            "fact": "All birds are living dinosaurs."
        }
    ]
}

// Global constants
const Errors = {
    INVALID_DATA: -1,
    VALUE_OUT_OF_RANGE: -2
};

const UnitSystems = {
    METRIC: "metric",
    IMPERIAL: "imperial"
}

const ConversionUtils = {
    ToMetricHeight: function (height) {
        if (height) {
            console.debug(`Converting to metric length from ${height}`);
            return Math.round(height * 2.54);
        } else {
            console.error(`Invalid value for length: ${height}`);
            return Errors.INVALID_DATA;
        }

    },
    ToMetricWeight: function (weight) {
        if (weight) {
            console.debug(`Converting to metric weight from ${weight}`);
            return Math.round(weight / 2.21);
        } else {
            console.error(`Invalid value for weight: ${weight}`);
            return Errors.INVALID_DATA;
        }
    }
};

/**
 * 
 * @param {object} element The DOM element that has an error
 * @param {*} message Custom message to displayed for the user
 */
function FormValidationError(element, message) {
    this.element = element;
    this.message = message;
}

/**
 * FormManager - Handles form validation and data exttaction
 */
let formManager = (function () {
    let name, weight, totalLength;
    let errors = []; // list of all form validation errors
    let unitSystem = UnitSystems.METRIC;  // default value

    function evaluateName() {
        errors = [];
        nameValue = document.getElementById("name").value;
        if (!nameValue || nameValue.length < 1) {
            errors.push(new FormValidationError("name", "name field is required"));
            return;
        }

        name = nameValue;
    }

    function evaluateWeight() {
        let weightValue = 0;
        if (unitSystem) {
            weightValue = Number(document.getElementById('metric_weight').value);
        } else {
            weightValue = Number(document.getElementById('imperial_weight').value);
        }

        if (!weightValue || weightValue < 1) {
            errors.push(new FormValidationError("weight", "weight field cannot be zero or negative"));
            return;
        }
        weight = weightValue;
    };

    function evaluateHeight() {
        if (unitSystem === UnitSystems.METRIC) {
            const metersValue = Number(document.getElementById('meters').value);
            const cmValue = Number(document.getElementById("cm").value);
            if (metersValue < 0) {
                errors.push(new FormValidationError("meters", 'length value cannot be negative'));
            }
            if (cmValue < 0) {
                errors.push(new FormValidationError('cm', 'length value cannot be negative'));
            }

            if (errors && errors.length > 0) return;

            height = metersValue * 100 + cmValue;       // total in cm
        } else {
            const feetValue = Number(document.getElementById('feet').value);
            const inchesValue = Number(document.getElementById("inches").value);
            if (feetValue < 0) {
                errors.push(new FormValidationError("feet", 'length value cannot be negative'));
            }
            if (inchesValue < 0) {
                errors.push(new FormValidationError('inches', 'length value cannot be negative'));
            }

            if (errors && errors.length > 0) return;

            height = feetValue * 12 + inchesValue;  // total in inches
        }
        totalLength = height;
    }

    function RaiseFormValidationError() {
        let messages = '';
        if (errors && errors.length > 0) {
            // we have errors in the form

            errors.forEach(err => {
                const msg = `${err.element}: ${err.message}`;
                messages += msg + "\n";
            });
        }
        if (messages) {
            let documentValidationElement = document.getElementById("formValidationErrors");
            if (documentValidationElement) {
                documentValidationElement.style.display = 'block';
                documentValidationElement.innerText = messages;
            }
        }
    }

    function evaluateForm() {
        evaluateName();
        evaluateWeight();
        evaluateHeight();

        if (errors && errors.length > 0) {
            RaiseFormValidationError();
            return false;
        }

        return true;
    }

    function getDiet() {
        return document.getElementById('diet').value;
    }
    function getName() { return name; }
    function getWeight() { return weight; }
    function getHeight() { return totalLength; }
    function updateUnitSystem() {

        const isMetricSystem = document.getElementById("metric");

        if (isMetricSystem.checked) {
            document.getElementById("metricFormat").style.display = 'block';
            document.getElementById("imperialFormat").style.display = 'none';
            unitSystem = UnitSystems.METRIC;
        } else {
            document.getElementById("metricFormat").style.display = 'none';
            document.getElementById("imperialFormat").style.display = 'block';
            unitSystem = UnitSystems.IMPERIAL;
        }

    }
    function getUnitSystem() { return unitSystem; }

    return {
        evaluateForm: evaluateForm,
        getName: getName,
        getHeight: getHeight,
        getWeight: getWeight,
        getDiet: getDiet,
        updateUnitSystem: updateUnitSystem,
        getUnitSystem: getUnitSystem,
    }
})();

// Global functions and helpers
function ApplicationException(errorcode, message) {
    this.ErrorCode = errorcode;
    this.Message = message;
}

/**
 * Base class for all game actors (animals, human)
 */
const BaseGameActor = {

    compareWeight: function (weight) {
        if (isNaN(weight)) {
            throw new ApplicationException(Errors.INVALID_DATA, 'Could not compare weights due to invalid input data for weight');
        }

        let comparisonResult = '';
        if (this.weight > weight) {
            comparisonResult = 'I am heavier than you!'
        } else if (this.weight < weight) {
            comparisonResult = 'You are heavier me!'
        } 
        return comparisonResult;
    },

    compareHeight: function (height, unitSystem) {
        // compares heights, values are assumed to be in cm or inches
        if (isNaN(height)) {
            throw new ApplicationException(Errors.INVALID_DATA, 'Could not compare heights due to invalid input data for height');
        }

        // we need to consider the metric unit setup
        // data from the database is always inches and pounds
        let comparisonResult = '';

        if (this.height > height) {
            comparisonResult = 'I am taller than you!'
        } else if (this.weight < height) {
            comparisonResult = 'You are taller me!'
        } 
        return comparisonResult;
    },

    compareDiet: function (humanDiet) {
        if (!humanDiet) {
            throw new ApplicationException(Errors.INVALID_DATA, 'Could not compare diets due to invalid input data for diet');
        }
        let comparisonResult = '';
        if (humanDiet.toLowerCase() === this.diet.toLowerCase()) {
            comparisonResult = `You are ${humanDiet} and ${this.species} was too!`;
        } else {
            comparisonResult = `You are ${humanDiet}, but ${this.species} was a ${this.diet}.`;
        }
        return comparisonResult;
    }
};

/**
 * @param {object} dinoData Dinosaour object containing facts and properties.
 * @param {string} units Measurements units ('imperial' or 'metric') for weight and hight
 */
function Dino(dinoData, units) {
    if (!dinoData) {
        throw new ApplicationException(Errors.INVALID_DATA, `Unable to create dino object. Invalid data for dinoData: ${dinoData}`);
    }

    this.species = dinoData.species;
    this.diet = dinoData.diet;
    this.where = dinoData.where;
    this.when = dinoData.when;
    this.fact = dinoData.fact;
    // The defautlt units are metrics, unless otherwise specified
    if (units === UnitSystems.METRIC) {
        this.weight = ConversionUtils.ToMetricWeight(dinoData.weight);
        this.height = ConversionUtils.ToMetricHeight(dinoData.height);
    } else {
        this.weight = dinoData.weight;
        this.height = dinoData.height;
    }
}

Dino.prototype = BaseGameActor;

function Human(name, weight, height, diet, units) {
    if (!name) {
        throw new ApplicationException(Errors.INVALID_DATA, `Unable to create human object due to invalid data for human name`);
    }

    this.name = name;
    this.diet = diet;
    // apply species attribute, will later be used to fetch the image from the assets
    this.species = 'human';
    // The defautlt units are metrics, unless otherwise specified
    if (units === UnitSystems.METRIC) {
        this.weight = ConversionUtils.ToMetricWeight(weight);
        this.height = ConversionUtils.ToMetricHeight(height);
    } else {
        this.weight = weight;
        this.height = height;
    }
}

Human.prototype = BaseGameActor;

/**
 * The game engine
 */
let gameEngine = function() {

    let dinoList = [];
    let humanPlayer = {};

    function generateDinoList() { 
        const rawData = Database();
        const DinoList = [];
        const units = formManager.getUnitSystem();
    
        rawData.forEach(dino => {
            const newDino = new Dino(dino, units);
            DinoList.push(newDino);
        });
        return DinoList;
    }

    function generateGameUI(dinoList, human) {
        if (!dinoList || !human) {
            throw ApplicationException(Errors.INVALID_DATA, "Dino list or human data is missing");
        }
    
        let gameBoard = document.getElementById("grid");
    
        // Hide Form from UI
        document.getElementById("dino-compare").style.display = "none";
    
        const middle = Math.round(dinoList.length / 2);
        const gameCards = dinoList;
        // add the human player to the middle of the array
        gameCards.splice(middle, 0, human);
    
        // generate the game board tiles for each element
        gameCards.forEach( function(card) {
            let tile = GetGridTile(card);

            gameBoard.appendChild(tile);
        });
    }
    
    function GetGridTile(gameActor) {
        let gridTile = document.createElement("div");
        gridTile.className = "grid-item";
    
        // add species
        let speciesDiv = document.createElement("h3");
        speciesDiv.innerText = gameActor.species;
        gridTile.appendChild(speciesDiv);
    
        // add image
        let imageDiv = document.createElement("img");
        const imageSource =  `images/${(gameActor.species.toLowerCase())}.png`;
        imageDiv.src = imageSource;
        gridTile.appendChild(imageDiv);
    
        gameActor.fact = getFact(gameActor);
        // fact section
        if (gameActor.fact) {
            let factDiv = document.createElement("p");
            factDiv.innerText = gameActor.fact;
            gridTile.appendChild(factDiv);
        }

        return gridTile;
    }
    
    function getFact(gameActor) {
        if (gameActor.species === 'human') return humanPlayer.name;
        
        let fact = '';
        const randomNumber = gameActor.species === 'Pigeon' ? 0 : Math.round(Math.random() * 5);
        switch (randomNumber) {
            case 0:
                fact = gameActor.fact;
                break;
            case 1:
                fact = gameActor.compareWeight(humanPlayer.weight);
                break;
            case 2:
                fact = gameActor.compareDiet(humanPlayer.diet);
                break;
            case 3:
                fact = gameActor.compareHeight(humanPlayer.height);
                break;
            case 4:
                fact = `${gameActor.species} lived in ${gameActor.where}.`;
                break;
            case 5:
                fact = `${gameActor.species} lived in the ${gameActor.when} time period.`;
                break;
        }
    
        return fact;
    }

    /** Method to shuffle a given array using Fisher–Yates algorithem
     * @param Array The array to be shuffled
     */
    // Ref: https://en.wikipedia.org/wiki/Fisher%E2%80%93Yates_shuffle
    // Ref: https://stackoverflow.com/questions/2450954/how-to-randomize-shuffle-a-javascript-array
    function shuffle(array) {
        let currentIndex = array.length,  randomIndex;
      
        // While there remain elements to shuffle.
        while (currentIndex != 0) {
      
          // Pick a remaining element.
          randomIndex = Math.floor(Math.random() * currentIndex);
          currentIndex--;
      
          // And swap it with the current element.
          [array[currentIndex], array[randomIndex]] = [
            array[randomIndex], array[currentIndex]];
        }
      
        return array;
      }
      
    // public methods
    function setPlayer(player) {
        if (player) {
            humanPlayer = player;
        } else {
            throw new ApplicationException(Errors.INVALID_DATA, 'Invalid human player object');
        }
    }

    function initialize() {
        dinoList = generateDinoList();
        shuffle(dinoList);
    }

    function startGame() {
        generateGameUI(dinoList, humanPlayer);
    }

    return {
        Initiaze: initialize,
        SetPlayer: setPlayer,
        Start: startGame
    }
};

// Event Handlers
function OnCompare(event) {
    // Ref: https://developer.mozilla.org/en-US/docs/Web/API/Event/preventDefault
    // Do not reload the page on submit
    event.preventDefault();

    const Human = BuildHumanFromForm();
    if (Human) {
        // Generate the dino list from the database
        let game = gameEngine();
        game.Initiaze();
        game.SetPlayer(Human);
        game.Start();
    }
}

function BuildHumanFromForm() {
    let name, height, weight, diet;

    let appFormMananger = formManager;
    let isFormValid = appFormMananger.evaluateForm();
    if (isFormValid) {
        name = appFormMananger.getName();
        height = appFormMananger.getHeight();
        weight = appFormMananger.getWeight();
        diet = appFormMananger.getDiet();

        const human = new Human(name, weight, height, diet);

        return human;
    } else {
        return null;
    }
};

function updateUnitsPreference() {
    const appFormMananger = formManager;
    appFormMananger.updateUnitSystem();
}

// On button click, prepare and display infographic
(function () {
    // Initial form state
    document.getElementById("metric").checked = true;
    document.getElementById("imperialFormat").style.display = 'none';

    document.getElementById("btn").addEventListener('click', OnCompare);
})();