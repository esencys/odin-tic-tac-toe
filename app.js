const Player = (name, gameBoard, isAI) => {
  // handles player info and things players can do
  const playerName = name;
  let GameBoard = gameBoard;
  let playerMoves;

  const initPlayerMoves = () => {
    playerMoves = {
      rows: [],
      cols: [],
      diag: 0,
      antiDiag: 0
    };
  }
  const getPlayerName = () => playerName;
  const getPlayerMoves = () => playerMoves;
  const addPlayerMove = (row, col) => {
    const [_, numCols] = GameBoard.getBoardSize();
    (playerMoves.rows[row] !== undefined) ? playerMoves.rows[row]++ : playerMoves.rows[row] = 1;
    (playerMoves.cols[col] !== undefined) ? playerMoves.cols[col]++ : playerMoves.cols[col] = 1;
    if (row == col) playerMoves.diag++;
    if (row + col == numCols - 1) playerMoves.antiDiag++;
  };
  const getRandomIndex = (maxArrLen) => {
    return Math.floor(Math.random()*maxArrLen);
  };
  const getListAvailableMoves = () => {
    const board = GameBoard.getBoard();
    const cellIndexPair = board.map((cell, index) => {
      return [cell, index];
    });
    const listAvailableCellIndexPair = cellIndexPair.filter(([cell, index]) => {
      if (cell === "") {
        return [cell, index];
      } 
    });
    const listAvailableMovesIndex = listAvailableCellIndexPair.map(([_, index]) => {
      return index;
    });
    return listAvailableMovesIndex;
  };
  const calcMove = (isAI) ? () => {
    // based on gameboard, return AI's move in row, col
    const listAvailableMoves = getListAvailableMoves();
    const index = getRandomIndex(listAvailableMoves.length);
    const moveIndex = listAvailableMoves[index];
    return GameBoard.indexToRowCol(moveIndex); 
  } : undefined;

  const resetPlayerMoves = () => {
    initPlayerMoves();
  };

  initPlayerMoves();

  let playerReturnMethods = { getPlayerName, addPlayerMove, getPlayerMoves, resetPlayerMoves };
  return (isAI) ? {...playerReturnMethods, calcMove} :
    playerReturnMethods;
};

const GameBoard = (num) => {
  let numBoardRows = num;
  let numBoardCols = num;
  let board;

  const initBoard = () => {
    let output = [];

    for (let i = 0; i < (numBoardRows * numBoardCols); i++) {
      output.push("");
    };

    board = output; 
  };
  const setBoardSize = (num) => {
    numBoardRows = num;
    numBoardCols = num;
  };
  const getBoard = () => board;
  const getBoardSize = () => [numBoardRows, numBoardCols];
  const addPlayerInputToGameBoard = (index, marker) => {
    board[index] = marker;
  };
  const rowColToIndex = (row, col) => {
    return (row * numBoardCols) + col;
  };
  const indexToRowCol = (index) => {
    const row = Math.floor(index / numBoardRows);
    const col = Math.floor(index % numBoardCols);  

    return [row, col];
  };

  const resetBoardState = () => {
    initBoard();
  };
  
  initBoard();

  return {initBoard, setBoardSize, resetBoardState, rowColToIndex, getBoardSize, getBoard, indexToRowCol, addPlayerInputToGameBoard};
};

const DisplayController = (gameBoard, gameController, hasAI) => {
  // handles DOM related things in app div
  const appElement = document.getElementById("app");
  let GameBoard = gameBoard; 
  let GameController = gameController;
  let gameHasAI = hasAI;

  const renderGame = (board, boardSize, shouldReload = false) => {
    const boardContainer = createBoardContainer(boardSize);
    const boardElement = createBoardElement(board, boardSize);
    const restartButtonContainer = createRestartButtonContainer()
    const restartButtonElement = createRestartButtonElement();
    const resultContainer = createResultContainer();
    const resultElement = createResultElement();
    const menuButtonContainer = createMenuButtonContainer();
    const menuButtonElement = createMenuButtonElement();

    if (shouldReload) clearChildren(boardContainer);

    menuButtonContainer.appendChild(menuButtonElement);
    restartButtonContainer.appendChild(restartButtonElement);
    resultContainer.appendChild(resultElement);
    resultContainer.appendChild(restartButtonContainer);
    resultContainer.appendChild(menuButtonContainer);
    boardContainer.appendChild(boardElement);
    boardContainer.appendChild(resultContainer);
    appElement.appendChild(boardContainer);
  };

  const createResultContainer = () => {
    const resultContainer = document.createElement("div");
    resultContainer.id = "result-container";
    resultContainer.classList.add("result-container");
    resultContainer.style.display = "none";

    return resultContainer;
  };

  const createMenuButtonContainer = () => {
    const menuButtonContainer = document.createElement("div");
    menuButtonContainer.id = "result-menu-button-container";
    menuButtonContainer.classList.add("result-menu-button-container");

    return menuButtonContainer;
  }

  const createMenuButtonElement = () => {
    const menuButtonElement = document.createElement("button");
    menuButtonElement.id = "result-menu-button";
    menuButtonElement.classList.add("result-menu-button");
    menuButtonElement.innerText = "Open Menu";
    menuButtonElement.addEventListener('click', (e) => handleOpenMenuClick(e));

    return menuButtonElement;
  }

  const handleOpenMenuClick = (e) => {
    e.stopPropagation();

    const menuContainer = document.getElementById("menu-container");
    toggleElementDisplay(menuContainer, "flex");

    GameBoard.resetBoardState();
    GameController.restartGame();
  };

  const createResultElement = () => {
    const resultElement = document.createElement("div");
    resultElement.id = "result";
    resultElement.classList.add("result");

    return resultElement;
  };

  const createBoardContainer = ([numRows, _]) => {
    const boardContainer = document.createElement("div");
    boardContainer.id = "boardContainer";
    boardContainer.classList.add("board-container");
    boardContainer.style["grid-template-columns"] = "1fr";
    boardContainer.style["grid-template-rows"] = `repeat(${numRows}, 1fr)`;

    return boardContainer;
  };

  const createBoardElement = (board, [numRows, numCols]) => {
    const boardElement = document.createElement("div");
    boardElement.id = "board";
    boardElement.classList.add("board-element");
    boardElement.style["grid-template-columns"] = `repeat(${numCols}, 1fr)`;
    boardElement.style["grid-template-rows"] = `repeat(${numRows}, 1fr)`;

    board.forEach((cell, index) => {
      const cellContainer = createCellContainer(index);
      const cellElement = createCellElement(cell, index);

      cellContainer.appendChild(cellElement);
      boardElement.appendChild(cellContainer);
    });
    
    return boardElement;
  };

  const createCellContainer = (index) => {
    const cellContainer = document.createElement("div");

    cellContainer.classList.add("cell-container");
    cellContainer.addEventListener('click', (e) => handleCellClick(e));
    cellContainer.setAttribute("data-id", `${index}`);
    
    return cellContainer;
  };

  const createCellElement = (cell, index) => {
    const cellElement = document.createElement("div");

    cellElement.textContent = cell;
    cellElement.id = `${index}`;
    cellElement.classList.add("cell-element");
    cellElement.setAttribute("data-id", `${index}`);

    return cellElement;
  };

  const createRestartButtonContainer = () => {
    const restartButtonContainer = document.createElement("div");
    restartButtonContainer.id = "restart-button-container";
    restartButtonContainer.classList.add("restart-button-container");

    return restartButtonContainer;
  }

  const createRestartButtonElement = () => {
    const restartButtonElement = document.createElement("button");
    restartButtonElement.id = "restart-button";
    restartButtonElement.classList.add("restart-button");
    restartButtonElement.innerText = "Restart";
    restartButtonElement.addEventListener('click', (e) => handleRestartButtonClick(e));

    return restartButtonElement;
  }
  
  const handleCellClick = (e) => {
    e.stopPropagation();
   
    let dataId = e.target.dataset.id;
    let cell = document.getElementById(dataId);
    let index = parseInt(dataId);
    let isValidMove = GameController.getIsValidMove(index);
    
    if (isValidMove) {
      GameController.incrementNumTurns();
      let [row, col] = GameBoard.indexToRowCol(index);
      GameController.getCurrentPlayer().addPlayerMove(row, col); 

      let marker = GameController.getPlayerMarker();
      addMarkerToCellElement(marker, cell);
      GameBoard.addPlayerInputToGameBoard(index, marker);

      let [isGameTied, hasPlayerWon] = checkGameOver();
      if (isGameTied | hasPlayerWon) displayGameOver(isGameTied, hasPlayerWon);

      GameController.changePlayerTurn();

      if (gameHasAI & !(isGameTied | hasPlayerWon)) {
        let [row, col] = GameController.getCurrentPlayer().calcMove();
        let index = GameBoard.rowColToIndex(row, col);
        let isValidMove = GameController.getIsValidMove(index);
        
        if (isValidMove) {
          GameController.incrementNumTurns();
          let dataId = `${index}`;
          let cell = document.getElementById(dataId);
        
          let marker = GameController.getPlayerMarker();
          GameController.getCurrentPlayer().addPlayerMove(row, col);
          addMarkerToCellElement(marker, cell);
          GameBoard.addPlayerInputToGameBoard(index, marker);
        
          let [isGameTied, hasPlayerWon] = checkGameOver();
          if (hasPlayerWon | isGameTied) displayGameOver(isGameTied, hasPlayerWon);

          GameController.changePlayerTurn();
        };
      };
    };
  };

  const handleRestartButtonClick = (e) => {
    e.stopPropagation();

    resetDisplay();
    GameBoard.resetBoardState();
    GameController.restartGame();
  };

  const resetDisplay = () => {
    const resultContainer = document.getElementById("result-container");
    const listCellElements = getListCellElements();

    emptyTextOfCellElements(listCellElements); 
    toggleElementDisplay(resultContainer, "grid");
  };

  const getListCellElements = () => {
    let listCellElements = []; 
    const [numRows, numCols] = GameBoard.getBoardSize();
    const maxCellElements = numRows * numCols;

    for (let i = 0; i < maxCellElements; i++) {
      const cellElement = document.getElementById(`${i}`);
      listCellElements.push(cellElement);
    }

    return listCellElements;
  };

  const emptyTextOfCellElements = (listCellElements) => {
    listCellElements.forEach((cellElement) => {
      cellElement.textContent = "";
    });
  };

  const checkGameOver = () => {
    const hasPlayerWon = GameController.getHasCurrentPlayerWon() ? true : false;
    const isGameTied = GameController.getIsGameTied() ? true : false;
    return [isGameTied, hasPlayerWon];
  };

  const displayGameOver = (isGameTied, hasPlayerWon) => {
    const isGameOver = hasPlayerWon | isGameTied;

    if (isGameOver) {
      if (hasPlayerWon) {
        const currentPlayerName = GameController.getCurrentPlayer().getPlayerName();
        showResultElement(currentPlayerName);
      } 
      else {
        showResultElement();
      }
    }
  };

  const showGameMenuContainer = () => {
    const menuContainer = document.getElementById("menu-container");

    toggleElementDisplay(menuContainer, "grid");
  };

  const showResultElement = (currentPlayerName=null) => {
    const resultContainer = document.getElementById("result-container");
    const resultElement = document.getElementById("result");
    toggleElementDisplay(resultContainer, "grid");
    currentPlayerName ? resultElement.textContent = `${currentPlayerName} won!` :
      resultElement.textContent = `Draw! No one won...`;
  };

  const toggleElementDisplay = (element, displaySetting) => {
    (element.style.display === "none") ? element.style.display = displaySetting : element.style.display = "none";
  };

  const addMarkerToCellElement = (marker, cell) => {
    cell.textContent = marker; 
  };

  const clearChildren = (parentContainer) => {
      while (parentContainer.childElementCount > 0) {
        parentContainer.children[0].remove();
      }
  };

  return {renderGame, addMarkerToCellElement};
};

const GameController = (playerOne, playerTwo, gameBoard) => {
  // handles tic tac toe game mechanics
  let player1Turn = true;
  let numTurns = 0;
  const GameBoard = gameBoard;
  const player1 = playerOne;
  const player2 = playerTwo;

  const incrementNumTurns = () => numTurns++;
  const getCurrentPlayer = () => (player1Turn) ? player1 : player2;
  const changePlayerTurn = () => player1Turn = !player1Turn;
  const getPlayer1Turn = () => player1Turn;
  const getPlayerMarker = () => (player1Turn) ? "x" : "o";
  const getHasCurrentPlayerWon = () => {
    const currentPlayer = getCurrentPlayer();
    const currentPlayerMoves = currentPlayer.getPlayerMoves(); 
    const [numRows, numCols] = GameBoard.getBoardSize();

    let hasPlayerWon = false;

    if (wonBy(currentPlayerMoves.rows, numRows)) hasPlayerWon = true; 
    else if (wonBy(currentPlayerMoves.cols, numCols)) hasPlayerWon = true; 
    else if (currentPlayerMoves.diag === numRows) hasPlayerWon = true;
    else if (currentPlayerMoves.antiDiag === numRows) hasPlayerWon = true;

    return hasPlayerWon;
  };

  const wonBy = (arrRowOrCol, numRowsOrCols) => {
    const arrWon = arrRowOrCol.filter((rowOrCol) => rowOrCol === numRowsOrCols);
    return arrWon.length > 0;  
  };

  const getIsGameTied = () => {
    const [numRows, numCols] = GameBoard.getBoardSize();
    return (numTurns === numRows * numCols) ? true : false;
  };

  const getIsValidMove = (index) => {
    const board = GameBoard.getBoard();
    return (board[index] === "") ? true : false;
  };

  const restartGame = () => {
    playerOne.resetPlayerMoves();
    playerTwo.resetPlayerMoves();
    player1Turn = true;
    numTurns = 0;
  };

  return {getPlayerMarker, restartGame, incrementNumTurns, getHasCurrentPlayerWon, getPlayer1Turn, changePlayerTurn, getCurrentPlayer, getIsValidMove, getIsGameTied};
};

const GameMenu = () => {
  const createMenuContainer = () => {
    const menuContainer = document.createElement("div");
    menuContainer.id = "menu-container";
    menuContainer.classList.add("menu-container");
    menuContainer.style.display = "flex";

    return menuContainer;
  };

  const createMenuElement = () => {
    const menuElement = document.createElement("div");

    const hasAIInputContainer = createCheckboxInputContainer("has-ai-input");
    const player1NameInputContainer = createInputContainer("player-1-name-input");
    const player2NameInputContainer = createInputContainer("player-2-name-input");
    const boardSizeInputContainer = createInputContainer("board-size-input");
    const startGameButtonElement = createStartGameButtonElement();

    menuElement.id = "menu";
    menuElement.classList.add("menu");

    menuElement.appendChild(boardSizeInputContainer);
    menuElement.appendChild(hasAIInputContainer);
    menuElement.appendChild(player1NameInputContainer);
    menuElement.appendChild(player2NameInputContainer);
    menuElement.appendChild(startGameButtonElement);

    return menuElement;
  };

  const createCheckboxInputContainer = (inputName) => {

    const inputContainer = document.createElement("div");
    inputContainer.classList.add(`${inputName}-container`);

    const inputLabel = document.createElement("label");
    inputLabel.htmlFor = inputName;
    inputLabel.innerText = inputName;

    const inputElement = document.createElement("input");
    inputElement.id = inputName;
    inputElement.type = "checkbox";
    inputElement.classList.add(`${inputName}`);

    inputContainer.appendChild(inputLabel);
    inputContainer.appendChild(inputElement);

    return inputContainer;
  };

  const createInputContainer = (inputName) => {
    const inputContainer = document.createElement("div");
    inputContainer.classList.add(`${inputName}-container`);

    const inputLabel = document.createElement("label");
    inputLabel.htmlFor = inputName;
    inputLabel.innerText = inputName;

    const inputElement = document.createElement("input");
    inputElement.id = inputName;
    inputElement.classList.add(`${inputName}`);

    inputContainer.appendChild(inputLabel);
    inputContainer.appendChild(inputElement);

    return inputContainer;
  };

  const createStartGameButtonElement = () => {
    const startGameButtonElement = document.createElement("button");
    startGameButtonElement.id = "start-game-button";
    startGameButtonElement.innerText = "Start Game";
    startGameButtonElement.addEventListener('click', (e) => startGame(e))

    return startGameButtonElement;
  };

  const startGame = (e) => {
    const appElement = document.getElementById("app");

    const menuContainer = document.getElementById("menu-container");
    const player1NameInputElement = document.getElementById("player-1-name-input");
    const player2NameInputElement = document.getElementById("player-2-name-input");
    const hasAIInputElement = document.getElementById("has-ai-input");
    const boardSizeInputElement = document.getElementById("board-size-input");

    if (appElement.childElementCount >= 2) appElement.removeChild(appElement.childNodes[1]);

    const boardSizeInput = parseInt(boardSizeInputElement.value);
    const boardSize = isNaN(boardSizeInput) ? 3 : boardSizeInput;

    const player1Name = player1NameInputElement.value  === "" ? "player 1" : player1NameInputElement.value;
    const player2Name = player2NameInputElement.value  === "" ? "player 2" : player2NameInputElement.value;

    toggleElementDisplay(menuContainer, "grid");

    gameLoop(
      boardSize
      , hasAIInputElement.checked
      , player1Name
      , player2Name
    );
  };

  const toggleElementDisplay = (element, displaySetting) => {
    (element.style.display === "none") ? element.style.display = displaySetting : element.style.display = "none";
  };

  const init = () => {
    const appElement = document.getElementById("app");
    const menuContainer = createMenuContainer();
    const menuElement = createMenuElement();

    menuContainer.appendChild(menuElement);

    appElement.appendChild(menuContainer);
  };

  return {init};
};

self.GameBoard = GameBoard;
self.Player = Player;
self.GameController = GameController;
self.DisplayController = DisplayController;
self.GameMenu = GameMenu;

const gameLoop = (boardSize=3, hasAI=false, player1="player 1", player2="player 2") => {
  const gameBoard = GameBoard(boardSize);
  const playerOne = Player(player1, gameBoard);
  const playerTwo = (!hasAI) ? Player(player2, gameBoard) : Player("AI", gameBoard, hasAI);
  const gameController = GameController(playerOne, playerTwo, gameBoard);
  const displayController = DisplayController(gameBoard, gameController, hasAI); 
  displayController.renderGame(gameBoard.getBoard(), gameBoard.getBoardSize(), true);
};

const main = () => {
  const gameMenu = GameMenu();
  gameMenu.init();
}

main()

