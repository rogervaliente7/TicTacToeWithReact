import './App.css';
import Board from "./Board";
import Square from "./Square";
import { useState, useEffect } from 'react';

const defaultSquares = () => (new Array(9)).fill(null);

const lines = [
  [0, 1, 2], [3, 4, 5], [6, 7, 8],
  [0, 3, 6], [1, 4, 7], [2, 5, 8],
  [0, 4, 8], [2, 4, 6],
];

function App() {
  const [squares, setSquares] = useState(defaultSquares());
  const [winner, setWinner] = useState(null);
  const [hasStarted, setHasStarted] = useState(false); // Nuevo estado
  const [isDraw, setIsDraw] = useState(false); // Nuevo estado para empate

  useEffect(() => {
    const isComputerTurn = squares.filter(square => square !== null).length % 2 === 1;
    const linesThatAre = (a, b, c) => {
      return lines.filter(squareIndexes => {
        const squareValues = squareIndexes.map(index => squares[index]);
        return JSON.stringify([a, b, c].sort()) === JSON.stringify(squareValues.sort());
      });
    };

    const emptyIndexes = squares
      .map((square, index) => square === null ? index : null)
      .filter(val => val !== null);

    const playerWon = linesThatAre('x', 'x', 'x').length > 0;
    const computerWon = linesThatAre('o', 'o', 'o').length > 0;

    if (playerWon) {
      setWinner('x');
      setIsDraw(false); // Reinicia el estado de empate
      return;
    }
    if (computerWon) {
      setWinner('o');
      setIsDraw(false); // Reinicia el estado de empate
      return;
    }

    // Si no hay espacios vacíos y nadie ganó, es empate
    if (emptyIndexes.length === 0) {
      setIsDraw(true);
      setWinner(null); // No hay ganador
      return;
    }

    const putComputerAt = index => {
      let newSquares = [...squares];
      newSquares[index] = 'o';
      setSquares(newSquares);
    };

    if (isComputerTurn && !winner) {
      const winningLines = linesThatAre('o', 'o', null);
      if (winningLines.length > 0) {
        const winIndex = winningLines[0].find(index => squares[index] === null);
        putComputerAt(winIndex);
        return;
      }

      const linesToBlock = linesThatAre('x', 'x', null);
      if (linesToBlock.length > 0) {
        const blockIndex = linesToBlock[0].find(index => squares[index] === null);
        putComputerAt(blockIndex);
        return;
      }

      const linesToContinue = linesThatAre('o', null, null);
      if (linesToContinue.length > 0) {
        const continueIndex = linesToContinue[0].find(index => squares[index] === null);
        putComputerAt(continueIndex);
        return;
      }

      const randomIndex = emptyIndexes[Math.floor(Math.random() * emptyIndexes.length)];
      putComputerAt(randomIndex);
    }
  }, [squares, winner]);

  function handleSquareClick(index) {
    if (squares[index] !== null || winner || isDraw) return;

    if (!hasStarted) setHasStarted(true); // Marca que el juego ha iniciado

    const isPlayerTurn = squares.filter(square => square !== null).length % 2 === 0;
    if (isPlayerTurn) {
      let newSquares = [...squares];
      newSquares[index] = 'x';
      setSquares(newSquares);
    }
  }

  function restartGame() {
    setSquares(defaultSquares());
    setWinner(null);
    setHasStarted(false); // Resetea el estado
    setIsDraw(false); // Resetea el estado de empate
  }

  return (
    <main>
      <h1 className="title">TIC TAC TOE WITH REACT</h1>
      <Board>
        {squares.map((square, index) => (
          <Square
            key={index}
            x={square === 'x' ? 1 : 0}
            o={square === 'o' ? 1 : 0}
            onClick={() => handleSquareClick(index)}
          />
        ))}
      </Board>
      {!!winner && winner === 'x' && (
        <div className="result green">You WON!</div>
      )}
      {!!winner && winner === 'o' && (
        <div className="result red">You LOST!</div>
      )}
      {isDraw && (
        <div className="result yellow">It's a DRAW!</div>
      )}
      {hasStarted && (
        <button className="restart-button" onClick={restartGame}>
          Restart Game
        </button>
      )}
    </main>
  );
}

export default App;
