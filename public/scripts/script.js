const socket = io();
const chess = new Chess();
const boardElement = document.querySelector(".chessboard");
const heading= document.querySelector(".heading");
let draggedPiece = null;
let sourceSquare = null;
let playerRole = null;

heading.innerHTML=`${playerRole}`;
const renderBoard = () => {
  const board = chess.board();
  boardElement.innerHTML = "";
  board.forEach((row, rowIndex) => {
    row.forEach((square, colIndex) => {
      const squareElement = document.createElement("div");
      squareElement.classList.add(
        "square",
        (rowIndex + colIndex) % 2 === 0 ? "light" : "dark"
      );
      squareElement.setAttribute("data-row", rowIndex);
      squareElement.setAttribute("data-col", colIndex);
      if (square) {
        const pieceElement = document.createElement("div");
        pieceElement.classList.add(
          "peice",
          square.color === "w" ? "white" : "black"
        );
        pieceElement.innerText = getPieceUnicode(square);
        pieceElement.draggable = playerRole === square.color;
        pieceElement.addEventListener("dragstart", (e) => {
          if (pieceElement.draggable) {
            draggedPiece = pieceElement;
            sourceSquare = { row: rowIndex, column: colIndex };
            e.dataTransfer.setData("text/plain", "");
          }
        });
        pieceElement.addEventListener("dragend", () => {
          draggedPiece = null;
          sourceSquare = null;
        });
        squareElement.appendChild(pieceElement);
      }
      squareElement.addEventListener("dragover", (e) => {
        e.preventDefault();
      });
      squareElement.addEventListener("drop", () => {
        if (draggedPiece) {
          const targetSquare = {
            row: parseInt(squareElement.dataset.row),
            column: parseInt(squareElement.dataset.col),
          };
          handleMove(sourceSquare, targetSquare);
        }
      });
      boardElement.append(squareElement);
    });
  });
};

const handleMove = (source, target) => {
  const move = {
    from: `${String.fromCharCode(97 + source.column)}${8 - source.row}`,
    to: `${String.fromCharCode(97 + target.column)}${8 - target.row}`,
    promotion: "q", // Assuming promotion to queen for simplicity
  };
  socket.emit("move", move);
};

const getPieceUnicode = (piece) => {
  const pieces = {
    K: "\u2654", // White King
    Q: "\u2655", // White Queen
    R: "\u2656", // White Rook
    B: "\u2657", // White Bishop
    N: "\u2658", // White Knight
    P: "\u2659", // White Pawn
    k: "\u265A", // Black King
    q: "\u265B", // Black Queen
    r: "\u265C", // Black Rook
    b: "\u265D", // Black Bishop
    n: "\u265E", // Black Knight
    p: "\u265F", // Black Pawn
  };
  return pieces[piece.type] || "";
};

renderBoard();

socket.on("playerRole", (role) => {
  playerRole = role;
  heading.innerHTML=`${playerRole}`;
  renderBoard();
});

socket.on("spectatorRole", () => {
  playerRole = null;
  renderBoard();
});

socket.on("boardState", (fen) => {
  chess.load(fen);
  renderBoard();
});

socket.on("move", (move) => {
  chess.move(move);
  renderBoard();
});
