//Finisher Move always in end
//Combined Move (Movement + Basic attack) = Backflip Kick
//Opening: x*BASIC_ATTACKS || COMBINED_MOVE + x*BASIC_ATTACKS
//Elbow cant come after knee
//FINISHER_MOVES always after CROWD_CONTROL
//Minimum 6 Moves for FINISHER_MOVE
//Minimum 8 Moves for DEFENSIVE_MOVE
//Elbow not 4 Times back to back
const BASIC_ATTACKS = ["Kick","Punch","Knee","Elbow"];
const HEAVY_ATTACKS = ["Heavy Kick","Headbutt","Heavy Punch"];
const DEFENSIVE = ["Block","Dodge","Take Distance","Parry","Push"];
const CROWD_CONTROL = ["Throw","Leg Sweep","Eye Poke"];
const MOVEMENT = ["Backflip","Frontflip","Slide","Spin","Jump","Wallrun","Dash","Drop"];
const FINISHER_MOVES = ["Neck Slap","Falcon Punch","Back Break","Downward Kick","Karate Chop"];

const CATEGORIES = [BASIC_ATTACKS,HEAVY_ATTACKS,DEFENSIVE,CROWD_CONTROL,MOVEMENT,FINISHER_MOVES];
const CATEGORY_NAMES = ["Basic Attacks","Heavy Attacks","Defensive Attacks","Crowd Control","Movement","Finisher Move"]
let amountMoves = 4; //Minimum is 4
let finalCombo = [];
const AMOUNT_MOVES = document.getElementById("amount_moves");
const MOVE_SLIDER = document.getElementById("move_slider");
AMOUNT_MOVES.innerText = MOVE_SLIDER.value;
MOVE_SLIDER.oninput = function() {
    amountMoves = this.value;
    AMOUNT_MOVES.innerHTML = this.value;
}

function onLoad(){
    let moveOverviewContainer = document.getElementById("moves");
    for (let i = 0;i<CATEGORIES.length;i++){
        let currentCategory = CATEGORIES[i];
        let categoryContainer = document.createElement("div");
        categoryContainer.id = `category_${CATEGORY_NAMES[i]}`;
        categoryContainer.classList.add("category_container");
        categoryContainer.classList.add("centered");
        for (let j = 0;j<currentCategory.length;j++){
            let moveLabel = document.createElement("label");
            let move = `${currentCategory[j]}`;
            moveLabel.id = `move_${move}`
            moveLabel.innerText = `${move}`;
            moveLabel.classList.add("move_label");
            moveLabel.addEventListener("click",function () {
                toggleMove(currentCategory,move,moveLabel)
            });
            categoryContainer.append(moveLabel);
        }
        moveOverviewContainer.append(categoryContainer);
    }
}

function toggleMove(category,move,moveLabel){
    const index = category.indexOf(move);
    if (index !== -1){
        moveLabel.classList.add("opacity");
        category.splice(index, 1);
        if (category.length===0){
            CATEGORY_NAMES.splice(CATEGORIES.indexOf(category));
            CATEGORIES.splice(CATEGORIES.indexOf(category));
        }
    }else {
        moveLabel.classList.remove("opacity");
        category.push(move);
    }
}

//Only for the generating a combo!!

function createCombo(){
    let moves = amountMoves;
    finalCombo = [];
    if (Math.random() >= 0.5 && MOVEMENT.length>0){
        finalCombo.push(randomCombinedMove());
        moves--;
    }
    if (BASIC_ATTACKS.length===0){
        document.getElementById("final_combo").innerText = "Pls add a Basic Attack";
        return;
    }
    if (amountMoves<6){
        for (let i = 0;i<moves;i++){
            finalCombo.push(generateBasicAttackMove());
        }
    }
    if (amountMoves >= 6 && amountMoves < 8){
        for (let i = 0;i<moves-1;i++){
            finalCombo.push(generateBasicAttackMove());
        }
        finalCombo.push(generateLastHit());
    }
    if (amountMoves >= 8){
        for (let i = 0;i<moves-1;i++){
            if (Math.random()<0.3){
                let ran = randomIntFromInterval(0,CATEGORIES.length-1);
                if (ran === CATEGORIES.length-1){
                    finalCombo.push(randomCombinedMove());
                }else {
                    let category = CATEGORIES[ran];
                    finalCombo.push(category[randomIntFromInterval(0,category.length-1)]);
                }
            }else {
                finalCombo.push(generateBasicAttackMove());
            }
        }
        finalCombo.push(generateLastHit());
    }
    showCombo();
}
function checkForbiddenMove(move){ //true if forbidden
    if (finalCombo.length === 0){
        return false;
    }
    let previousMove = finalCombo[finalCombo.length-1];
    if (previousMove === undefined || previousMove.includes("Knee") && (move === "Elbow" || move === "Knee")){
        return true;
    }
    //Test for Maximum Amount of Knee Moves (Every 4 moves one Knee
    if (move === "Knee" && (finalCombo.filter(x => x.includes("Knee")).length === Math.floor(amountMoves / 4))){
        return true;
    }
    return false;
}
function showCombo(){
    let string = "";
    for (let i = 0;i<finalCombo.length-1;i++){
        string += finalCombo[i] + ", ";
    }
    string += finalCombo[finalCombo.length-1];
    document.getElementById("final_combo").innerText = string;
    document.getElementById("final_combo").classList.remove("opacity");
}
function randomCombinedMove(){
    return "" + MOVEMENT[randomIntFromInterval(0,MOVEMENT.length-1)] + " " + BASIC_ATTACKS[randomIntFromInterval(0,BASIC_ATTACKS.length-1)];
}
function randomIntFromInterval(min, max) { // min and max included
    return Math.floor(Math.random() * (max - min + 1) + min)
}
const generateBasicAttackMove = () => {
    let move;
    do {
        move = BASIC_ATTACKS[randomIntFromInterval(0,BASIC_ATTACKS.length-1)];
    }while (checkForbiddenMove(move));
    return move;
}
const generateLastHit = () => {
    let lasthit = Math.random();
    if (lasthit <= 0.33) {
        return generateBasicAttackMove();
    } else if (lasthit <= 0.66) {
        //Heavy Attack Finisher
        return HEAVY_ATTACKS[randomIntFromInterval(0, HEAVY_ATTACKS.length - 1)];
    } else {
        //Finisher
        return FINISHER_MOVES[randomIntFromInterval(0, FINISHER_MOVES.length - 1)];
    }
}

onLoad();