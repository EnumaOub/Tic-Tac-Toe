const tictactoe = (function() {

    const Gameboard = function() {
        let board;
        const cols = 3;
        const rows = 3;
    
        const generateBoard = function() {
            board = Array();
            const container = document.getElementsByClassName("grid")[0];
            [...document.getElementsByClassName("grid_elem")].map(n => n && n.remove());
            for (let row=0; row<rows; row++) {
                board.push([...Array(cols)])
                for (let col=0; col<cols; col++) {
                    const grid_elem = document.createElement("div");
                    grid_elem.className = "grid_elem"
                    grid_elem.id = `r_${row}_c_${col}`
                    container.appendChild(grid_elem);
                }
            }
            console.log(`We generate the board ${board}`)
            container.onclick = function(event) {
                let target = event.target;
                if (target.className != "grid_elem") return
                let value = target.id.match(/\d+/g);
                GetOp(value);
            }
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
    
    const Player = function(name_val, marker_val) {
        let name = name_val;
        let marker = marker_val;
        let result;
        console.log(`We generate Player ${name} using marker ${marker}`)
    
        const increaseResult = () => result++;
    
        return {name, marker, increaseResult}
    }
    
    const gameController = function(player1, player2, Board) {
    
        let round;
        let last_player;
    
        const showPlayer = () => last_player;
    
        const updateLastPlayer = function() {
            const players = [player1, player2];
            if (round == 0) {
                last_player = players.filter(function(elem) {return elem.marker == "X"})[0];
            }
            else {
                last_player = players.filter(function(elem) {return elem.marker != last_player.marker})[0];
            }
        }
    
        const resetGame = function() {
                round = 0;
                updateLastPlayer();
        }
    
        
        const endGame = function() {
            const players = [player1, player2];
            const player_actual = players.filter(function(elem) {return elem.marker != last_player.marker})[0];
            if (round > 4 && checkResult(player_actual.marker)) {
                player_actual.increaseResult();
                console.log(`player: ${player_actual.name} WIN !!!`);
                return true;
            }
            else if (round == 9) {
                console.log(`No Player WIN !!!`);
                return true;
            }
            else {
                console.log(`Round ${round}\n`);
                return false
            }
        }
    
        const playRound = function(pos_c, pos_r) {
            
            round += 1;
            console.log(`Round: ${round}`);
            console.log(`player: ${last_player.name}`);
            const play = Board.updateBoard(pos_c, pos_r, last_player.marker);
            if (!(play)) {
                round -= 1;
            }
            else {
                updateLastPlayer();
            }
            return play; 
        }

        const showColorRes = function(row, col){
            for (let i=0; i<row.length; i++){
                const id = `r_${row[i]}_c_${col[i]}`
                const grid_elem = document.getElementById(id);
                grid_elem.classList.add("won");
            }
        }
    
        const compareArray = (x, y) => JSON.stringify(x) === JSON.stringify(y);
    
        const checkDiagonals = function(board_actual, marker) {
            const result1 = [board_actual[0][0], board_actual[1][1], board_actual[2][2]];
            const result2 = [board_actual[0][2], board_actual[1][1], board_actual[2][0]];
            if (compareArray(result1, [marker, marker, marker])) {
                showColorRes([0,1,2], [0,1,2]);
                return true;
            }
            else if (compareArray(result2, [marker, marker, marker])) {
                showColorRes([0,1,2], [2,1,0])
                return true;
            }
            else {
                return false
            }
            
        }
    
        const checkRows = function(board_actual, marker) {
            const rows = 3;
            for (let row=0; row<rows; row++) {
                const boardRow = board_actual[row];
                if (compareArray(boardRow, [marker, marker, marker])) {
                    showColorRes(Array(3).fill(row), [0,1,2])
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
                    showColorRes([0,1,2], Array(3).fill(col))
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

    const displayController = function(){

        let player1;
        let player2;
        const Board = Gameboard();
        let game;
        let round = 1;
    
        const initDialog = function() {
            const dialog = document.getElementById("restart-game");
            dialog.close();
    
            const Restart_btn = document.getElementById("restart");
            Restart_btn.addEventListener("click", function(event){
                initGame();
            });
    
        }
    
        const initGetPlayer = function() {
            const p1_input = document.getElementById("player1");
            const p2_input = document.getElementById("player2");
    
            if (p1_input.value.length === 0) {
                p1_input.value = "Joe";
            }
            if (p2_input.value.length === 0) {
                p2_input.value = "Ana";
            }
    
            player1 = Player(p1_input.value, "X");
            player2 = Player(p2_input.value, "O");
        }
    
        const getGridElem = function(event) {
            const player = game.showPlayer();
            let target = event.target;
            if (target.className != "grid_elem") return
            let [pos_r, pos_c] = target.id.match(/\d+/g);
            if (playGame(parseInt(pos_c), parseInt(pos_r))) {
                round +=1;
                target.textContent = player.marker
            }
        }
    
        const showPlayerActual = function() {
            const player = game.showPlayer();
            const p1_div = document.getElementsByClassName("player1")[0];
            const p2_div = document.getElementsByClassName("player2")[0];
            if (player.marker == "X") {
                p1_div.classList.add("active");
                p2_div.classList.remove("active");
            }
            else {
                p2_div.classList.add("active")
                p1_div.classList.remove("active");
            }
        }
        
        const initGame = function() {
            const grid = document.getElementsByClassName("grid")[0];
            round = 1;
            initGetPlayer();
            initDialog();
            Board.generateBoard();
            game = gameController(player1, player2, Board);
            game.resetGame();
            showPlayerActual();
            
            grid.onclick = function(event) {
                getGridElem(event);
                showPlayerActual();
            }
        }
    
        // Generate the final result
        const genResult = function() {
            const last_player = game.showPlayer();
            const players = [player1, player2];
            const player_actual = players.filter(function(elem) {return elem.marker != last_player.marker})[0];
            
            const result_div = document.getElementById("result-game");
            if (round == 9) {
                result_div.textContent = `Its a tie. Do you want to restart a game ?`
            }
            else {
                result_div.textContent = `Congratulation ${player_actual.name} won. Do you want to restart a game ?`
            }
        }
    
        // Check if we have ended the game and show the message
        const checkResult = function() {
    
            if (game.endGame()) {
                const grid = document.getElementsByClassName("grid")[0];
                const dialog = document.getElementById("restart-game");
                
                genResult();
                //Reset grid event
                grid.onclick = function() {
                    return false;
                }
                // Show Modal
                dialog.showModal();
            }
        }
    
        const playGame = function(pos_c, pos_r) {
            const play = game.playRound(pos_c, pos_r);
            checkResult();
            return play;
        }
    
        return {initGame};
        
    }

    return {displayController}

})()




tictactoe.displayController().initGame()
