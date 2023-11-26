import React, { useState, useEffect } from 'react';

const CandyCrush = () => {
    const [gameHistory, setGameHistory] = useState([]);
    const numRows = 10;
    const numCols = 10;
    const maxMoves = 10; // Define the maximum number of moves
    const targetScore = 100; // Define the target score to win
    const [gameState, setGameState] = useState({
        gamesPlayed: 0,
        gamesWon: 0,
        gamesLost: 0,
        score: 0,
        movesLeft: maxMoves, // Track the remaining moves
    });
    const [grid, setGrid] = useState([]);

    useEffect(() => {
        initializeGrid();
    }, []);

    const initializeGrid = () => {
        const newGrid = [];
        for (let i = 0; i < numRows; i++) {
            newGrid[i] = [];
            for (let j = 0; j < numCols; j++) {
                newGrid[i][j] = Math.floor(Math.random() * 3);
            }
        }
        setGrid(newGrid);
    };

    const burstConnectedCandies = (row, col, color, visited) => {
        const directions = [
            [0, 1], // Right
            [0, -1], // Left
            [1, 0], // Down
            [-1, 0] // Up
        ];

        visited[row][col] = true;

        directions.forEach(([dx, dy]) => {
            const newRow = row + dx;
            const newCol = col + dy;

            if (
                newRow >= 0 &&
                newRow < numRows &&
                newCol >= 0 &&
                newCol < numCols &&
                grid[newRow][newCol] === color &&
                !visited[newRow][newCol]
            ) {
                burstConnectedCandies(newRow, newCol, color, visited);
            }
        });
    };

    const handleClick = (row, col) => {
        const color = grid[row][col];
        let updatedGrid = [...grid];
        let visited = Array.from({ length: numRows }, () => Array(numCols).fill(false));
        let count = 0;

        burstConnectedCandies(row, col, color, visited);

        visited.forEach((row, r) => {
            row.forEach((isVisited, c) => {
                if (isVisited) {
                    updatedGrid[r][c] = -1; // Mark candies to be removed
                    count++;
                }
            });
        });

        if (count >= 3) {
            const newScore = gameState.score + count;
            const movesLeft = gameState.movesLeft - 1; // Decrease moves left

            setGameState(prevState => ({
                ...prevState,
                score: newScore,
                movesLeft: movesLeft,
            }));

            setGrid(updatedGrid.map(row => row.map(val => (val === -1 ? Math.floor(Math.random() * 3) : val))));

            checkGameOutcome(newScore, movesLeft); // Check if the game is won or lost
        }
    };
    const checkGameOutcome = (score, movesLeft) => {
        if (score >= targetScore) {
            handleGameWon();
        } else if (movesLeft === 0) {
            handleGameLost();
        }
    };

    const handleGameWon = () => {
        //  actions for the game won scenario

        alert('Congratulations! You won the game!');
        resetGame();
    };

    const handleGameLost = () => {
        //  actions for the game lost scenario

        alert('Oops! Game over. You lost.');
        resetGame();
    };
    const resetGame = () => {
        // Reset the game state here
        const gameOutcome = {
            score: gameState.score,
            outcome:
                gameState.score >= targetScore
                    ? 'Win'
                    : gameState.movesLeft === 0
                        ? 'Loss'
                        : 'Incomplete',
        };

        setGameHistory(prevHistory => [...prevHistory, gameOutcome]);

        setGameState(prevState => ({
            gamesPlayed: prevState.gamesPlayed + 1,
            gamesWon:
                prevState.score >= targetScore
                    ? prevState.gamesWon + 1
                    : prevState.gamesWon,
            gamesLost:
                prevState.movesLeft === 0 && prevState.score < targetScore
                    ? prevState.gamesLost + 1
                    : prevState.gamesLost,
            score: 0,
            movesLeft: maxMoves,
        }));
        initializeGrid();
    };

    return (
        <div className="candy">
            <div>Games Played: {gameState.gamesPlayed}</div>
            <div>Games Won: {gameState.gamesWon}</div>
            <div>Games Lost: {gameState.gamesLost}</div>
            <div><h2>Score: {gameState.score}</h2></div>
            <div className="grid">
                {grid.map((row, rowIndex) => (
                    <div key={rowIndex} className="row">
                        {row.map((cell, colIndex) => (
                            <div
                                key={`${rowIndex}-${colIndex}`}
                                className={`cell color-${cell}`}
                                onClick={() => handleClick(rowIndex, colIndex)}
                            />
                        ))}
                    </div>
                ))}
            </div>
            <div className="history">
                <h3>Game History:</h3>
                <ul>
                    {gameHistory.map((game, index) => (
                        <li key={index}>
                            Game {index + 1}: Score - {game.score}, Outcome -{' '}
                            {game.outcome}
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
};

export default CandyCrush;
