const GameController = (() => {
  // handles tic tac toe game mechanics
  let board = ["x","o","x","o","x","o","x","o","x"]; 
  let player1Turn = true;

  const getBoard = () => board;
  const changePlayerTurn = () => player1Turn = !player1Turn;
  const getPlayer1Turn = () => console.log(player1Turn);
  const addPlayerClick = (cellId) => {
    console.log(cellId);
    DisplayController.test();
  };

  return {addPlayerClick, getPlayer1Turn, getBoard, changePlayerTurn};
})();

const DisplayController = (() => {
  // handles DOM related things in app div
  const appElement = document.getElementById("app");

  const test = () => console.log('hi');

  const renderGameBoard = (board) => {
    const boardContainer = createBoardContainer();
    const boardElement = createBoardElement(board);

    reload(boardContainer, boardElement);
    reload(appElement, boardContainer);
  };

  const createBoardContainer = () => {
    const boardContainer = document.createElement("div");
    boardContainer.id = "boardContainer";

    return boardContainer;
  };

  const createBoardElement = (board) => {
    const boardElement = document.createElement("div");
    boardElement.id = "board";

    board.forEach((cell, index) => {
      const cellElement = document.createElement("div");
      cellElement.textContent = cell;
      cellElement.setAttribute("data-id", `${index}`);
      cellElement.addEventListener('click', (e) => handleCellClick(e));

      boardElement.appendChild(cellElement);
    });
    
    return boardElement;
  };

  const handleCellClick = (e) => {
    e.stopPropagation();

    GameController.addPlayerClick(e.target.dataset.id);
  };

  const reload = (parentContainer, childNode) => {
    while (parentContainer.childElementCount > 0) {
      parentContainer.children[0].remove();
    }

    parentContainer.appendChild(childNode);
  };

  return {renderGameBoard, test};
})();

const Player = (name) => {
  // handles player info and things players can do
  let playerName = name;

  const getPlayerName = () => console.log(playerName);

  return {getPlayerName};
};

const peter = Player("Peter");
const fred = Player("Fred");
DisplayController.renderGameBoard(GameController.getBoard());

