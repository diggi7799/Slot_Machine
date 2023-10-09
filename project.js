//1. Deposit some money
//2. Determine the line on whch you wanna bet
//3. Collect the bet amount
//4. Spin the slot machines and transpose the cols into rows of a reels
//5. Check if the user won
//6. Give the winnings to use
//7. Play again

const prompt = require("prompt-sync")();

const ROWS = 3;
const COLS = 3;

const SYMBOLS_COUNT = {
    A: 2,
    B: 3,
    C: 6,
    D: 8
};

const SYMBOLS_VALUES = {
    A: 5,
    B: 4,
    C: 3,
    D: 2
};

const deposit = () => {
    while(true){
        const depositAmount = prompt("Enter a desposit amount: ");
        const numberDepositAmount = parseFloat(depositAmount);

        if(isNaN(numberDepositAmount) || numberDepositAmount <= 0){
            console.log("This is a invalid depsoit number, Try again");
        }else{
            return numberDepositAmount;
        }
    }
};

const getNumberofLines = () => {
    while(true){
        const lines = prompt("Enter the number of lines to bet on(1-3): ");
        const numberofLines = parseFloat(lines);

        if(isNaN(numberofLines) || 0 >= numberofLines || numberofLines > 3){
            console.log("This is a invalid number of lines, Try again");
        }else{
            return numberofLines;
        }
    }
};

const getBet = (balance, lines) => {
    while(true){
        const bet = prompt("Enter the bet per line: ");
        const numberBet = parseFloat(bet);

        if(isNaN(numberBet) || 0 >= numberBet || numberBet > balance / lines){
            console.log("Invalid Bet, Try again");
        }else{
            return numberBet;
        }
    }
};

const spin = () => {
    const symbols = [];
    for(const [symbol, count] of Object.entries(SYMBOLS_COUNT)){
        for(let i=0; i<count; i++){
            symbols.push(symbol);
        }
    }

    const reels = [];
    for(let i=0; i<COLS; i++){
        reels.push([]);
        const reelsymbols = [...symbols];
        for(let j=0; j<ROWS; j++){
            const randomIndex = Math.floor(Math.random() * reelsymbols.length);
            const selectedIndex = reelsymbols[randomIndex];
            reels[i].push(selectedIndex);
            reelsymbols.splice(randomIndex, 1);
        }
    }

    return reels;
};

const transpose = (reels) =>{
    const rows = [];
    for(let i=0; i<ROWS; i++){
        rows.push([]);
        for(let j=0; j<ROWS; j++){
            rows[i].push(reels[j][i]);
        }
    }

    return rows;
};

const printRows = (rows) =>{
    for(const row of rows){
        let rowString = "";
        for(const [i,symbol] of row.entries()){
            rowString += symbol
            if(i != row.length - 1){
                rowString += " | "
            }
        }
        console.log(rowString)
    }
};

const getWinings = (rows, bet, lines) =>{
    let winnings = 0;

    for(let row=0; row<lines; row++){
        const symbols = rows[row];
        let allSame = true;

        for(const symbol of symbols){
            if(symbol != symbols[0]){
                allSame = false;
                break;
            }
        }

        if(allSame){
            winnings += bet * SYMBOLS_VALUES[symbols[0]];
        }
    }

    return winnings;
};

const game = () => {
    let balance = deposit();

    while(true){
        console.log("You have a balance of, $" + balance);
        const numberofLines = getNumberofLines();
        const bet = getBet(balance, numberofLines);
        balance -= bet * numberofLines;
        const reels = spin();
        const rows = transpose(reels);
        printRows(rows);
        const winnings = getWinings(rows, bet, numberofLines);
        balance += winnings;
        console.log("You won, $" + winnings.toString());

        if(balance <= 0){
            console.log("You are out of money!");
        }

        const playAgain = prompt("Do you want to play again (y/n)? ");
        if(playAgain != "y") break;
    }
}

game();