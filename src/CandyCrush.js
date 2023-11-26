import React, { useState, useEffect } from 'react';

const CandyCrush = () => {
    const numRows = 10;
    const numCols = 10;
    const [gameState, setGameState] = useState({
        gamesPlayed: 0,
        gamesWon: 0,
        gamesLost: 0,
        score: 0
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
            setGameState({
                ...gameState,
                score: gameState.score + count
            });
            setGrid(updatedGrid.map(row => row.map(val => (val === -1 ? Math.floor(Math.random() * 3) : val))));
        }
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
        </div>
    );
};

export default CandyCrush;
