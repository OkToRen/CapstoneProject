import { useState } from "react";
import "./App.css";

type SquareValue = "X" | "O" | null;

interface WinnerInfo {
  winner: SquareValue;
  line: number[];
}

interface SquareProps {
  value: SquareValue;
  onSquareClick: () => void;
  isWinningSquare: boolean;
}

function Square({ value, onSquareClick, isWinningSquare }: SquareProps) {
  const className = `square ${value ? (value === "X" ? "x" : "o") : ""} ${
    isWinningSquare ? "winner" : ""
  }`;
  return (
    <button className={className} onClick={onSquareClick}>
      {value}
    </button>
  );
}

interface BoardProps {
  xIsNext: boolean;
  squares: SquareValue[];
  onPlay: (nextSquares: SquareValue[]) => void;
  winningLine: number[];
}

function Board({ xIsNext, squares, onPlay, winningLine }: BoardProps) {
  function handleClick(i: number) {
    if (squares[i] || calculateWinner(squares)) {
      return;
    }

    const nextSquares = squares.slice();
    nextSquares[i] = xIsNext ? "X" : "O";
    onPlay(nextSquares);
  }

  const winnerInfo = calculateWinner(squares);
  let status;
  if (winnerInfo) {
    status = <span className="winner">Winner: {winnerInfo.winner}</span>;
  } else if (squares.every(Boolean)) {
    status = "It's a Draw!";
  } else {
    status = "Next player: " + (xIsNext ? "X" : "O");
  }

  return (
    <>
      <div className="status">{status}</div>
      {[0, 1, 2].map((row) => (
        <div className="board-row" key={row}>
          {[0, 1, 2].map((col) => {
            const index = row * 3 + col;
            return (
              <Square
                key={index}
                value={squares[index]}
                onSquareClick={() => handleClick(index)}
                isWinningSquare={winningLine.includes(index)}
              />
            );
          })}
        </div>
      ))}
    </>
  );
}

export default function App() {
  const [history, setHistory] = useState<SquareValue[][]>([
    Array(9).fill(null),
  ]);
  const [currentMove, setCurrentMove] = useState(0);
  const xIsNext = currentMove % 2 === 0;
  const currentSquares = history[currentMove];

  function handlePlay(nextSquares: SquareValue[]) {
    const nextHistory = [...history.slice(0, currentMove + 1), nextSquares];
    setHistory(nextHistory);
    setCurrentMove(nextHistory.length - 1);
  }

  function restartGame() {
    setHistory([Array(9).fill(null)]);
    setCurrentMove(0);
  }

  const winnerInfo = calculateWinner(currentSquares);
  const winningLine = winnerInfo ? winnerInfo.line : [];

  return (
    <div className="game">
      <h1 className="game-title">Capstic tac toe </h1>
      <div className="game-board">
        <Board
          xIsNext={xIsNext}
          squares={currentSquares}
          onPlay={handlePlay}
          winningLine={winningLine}
        />
      </div>
      <button className="restart-button" onClick={restartGame}>
        Restart Game
      </button>
    </div>
  );
}

function calculateWinner(squares: SquareValue[]): WinnerInfo | null {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return { winner: squares[a], line: [a, b, c] };
    }
  }
  return null;
}
