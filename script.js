function Gameboard() {
    let board;
    const cols = 3;
    const rows = 3;

    const generateBoard = function() {
        board = Array();
        for (let row=0; row<rows; row++) {
            board.push([...Array(cols)])
        }
        console.log(`We generate the board ${board}`)
    }

    const checkPosition = function(pos_c, pos_r) {
        if (pos_c >= 0 && pos_c < cols && pos_r >= 0 && pos_r < rows) {
            return board[pos_r][pos_c] == null;
        }
    }

    const updateBoard = function(pos_c, pos_r, mark) {
        console.log(`We want to place ${mark} at ${pos_r}x${pos_c}`)
        if (checkPosition(pos_c, pos_r)) {
            board[pos_r][pos_c] = mark;
            console.log(`We can place it`);
            console.log(`${board[0]}`);
            console.log(`${board[1]}`);
            console.log(`${board[2]}`);
            return true;
        }
        else {
            console.log(`Can't place it here !!!2`);
            return false;
        }
    }

    const showBoard = () => board;

    return  {showBoard, generateBoard, updateBoard};
}

function Player(name_val, marker_val) {
    let name = name_val;
    let marker = marker_val;
    let result;
    console.log(`We generate Player ${name} using marker ${marker}`)

    const increaseResult = () => result++;

    return {name, marker, increaseResult}
}

function gameController(player1, player2, Board) {

    let round;
    let last_player;

    const showPlayer = () => last_player;

    const updateLastPlayer = function() {
        const players = [player1, player2];
        if (round == 0) {
            last_player = players.filter(function(elem) {return elem.marker == "x"})[0];
        }
        else {
            last_player = players.filter(function(elem) {return elem.marker != last_player.marker})[0];
        }
    }

    const resetGame = function() {
            round = 0;
            updateLastPlayer();
            Board.generateBoard();
    }

    
    const endGame = function() {
        if (round > 4 && checkResult(last_player.marker)) {
            last_player.increaseResult();
            console.log(`player: ${last_player.name} WIN !!!`);
            resetGame();
            return true;
        }
        else if (round == 9) {
            console.log(`No Player WIN !!!`);
            resetGame();
            return true;
        }
        else {
            console.log(`Round ${round}\n`);
            return false
        }
    }

    const playRound = function(pos_c, pos_r) {
        updateLastPlayer();
        round += 1;
        console.log(`Round: ${round}`);
        console.log(`player: ${last_player.name}`);
        const play = Board.updateBoard(pos_c, pos_r, last_player.marker);
        if (!(play)) {
            round -= 1;
            updateLastPlayer();
        }
        return play; 
    }

    const compareArray = (x, y) => JSON.stringify(x) === JSON.stringify(y);

    const checkDiagonals = function(board_actual, marker) {
        const result1 = [board_actual[0][0], board_actual[1][1], board_actual[2][2]];
        const result2 = [board_actual[0][2], board_actual[1][1], board_actual[2][0]];
        return (compareArray(result1, [marker, marker, marker]) || compareArray(result2, [marker, marker, marker]));
    }

    const checkRows = function(board_actual, marker) {
        const rows = 3;
        for (let row=0; row<rows; row++) {
            const boardRow = board_actual[row];
            if (compareArray(boardRow, [marker, marker, marker])) {
                return true;
            }
        }
        return false;
    }

    const checkColumns = function(board_actual, marker) {
        const cols = 3;
        for (let col=0;col<cols;col++) {
            const boardCol = board_actual.map(x => x[col]);
            if (compareArray(boardCol, [marker, marker, marker])) {
                return true;
            }
        }
        return false;
    }

    const checkResult = function(marker) {
        const board_actual = Board.showBoard();

        return (checkColumns(board_actual, marker) || checkRows(board_actual, marker) || checkDiagonals(board_actual, marker));
    }

    return {resetGame, endGame, playRound, showPlayer};
}


const player1 = Player("test1", "x");
const player2 = Player("test2", "o");

const Board = Gameboard();

const game = gameController(player1, player2, Board);
game.resetGame();

while(!(game.endGame())) {
    const player = game.showPlayer();
    let pos_r = parseInt(prompt(`Please choose row ${player.name}` , "0,1 or 2"));
    let pos_c = parseInt(prompt(`Please choose column ${player.name}` , "0,1 or 2"));

    game.playRound(pos_c, pos_r);

}