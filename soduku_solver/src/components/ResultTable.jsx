import React, { useState, useEffect } from 'react'

//props: finalBoard [[...]*9] , initialBoard [[...]*9], currentStep, steps
export const ResultTable = (props) => {

    let currentBoard
    if (props.currentStep >= props.steps.length - 1) {
        currentBoard = props.finalBoard
    } else if (props.currentStep < 0) {
        currentBoard = props.initialBoard
    } else {
        let tempBoard = JSON.parse(JSON.stringify(props.initialBoard))
        props.steps.slice(0, props.currentStep + 1).forEach((step) => {
            tempBoard[step.slot[0]][step.slot[1]] = step.digit
        })
        currentBoard = tempBoard
    }

    const renderCell = (i, j) => {
        let badgeType
        if (props.initialBoard[i][j] != 0) {
            badgeType = 'secondary'
        } else {
            badgeType = 'light'
        }
        if (props.currentStep < props.steps.length - 1 && props.currentStep >= 0) {
            let [step_i, step_j] = props.steps[props.currentStep]["slot"]
            if (step_i == i && step_j == j) {
                badgeType = 'success'
            }
        }

        return (

            <span className={`badge badge-${badgeType} m-1 p-2 ${([2, 5].includes(i)) ? 'mb-3' : ''} ${([2, 5].includes(j)) ? 'mr-4' : 'mr-2'}`}>
                <span style={{ "font-size": "24px", "color": ((currentBoard[i][j] == 0) ? "white" : "") }}>
                    {(currentBoard[i][j] == 0) ? "#" : currentBoard[i][j]}
                </span>
            </span>
        )
    }

    let grid = []
    for (let i = 0; i < 9; i++) {
        grid[i] = []
        for (let j = 0; j < 9; j++) {
            grid[i][j] = [i, j]
        }
    }


    return (
        <div className=''>
            {grid.map(row => {
                return (
                    <div>
                        {row.map(slot => {
                            let i, j
                            [i, j] = slot
                            return renderCell(i, j)
                        })}
                    </div>)
            })}
        </div>

    );
};