import React from 'react'

//props: board [[...]*9] , handleChange()
export const InputTable = (props) => {

    let grid = []
    for (let i = 0; i < 9; i++) {
        grid[i] = []
        for (let j = 0; j < 9; j++) {
            grid[i][j] = [i, j, (i * 10 + j)]
        }
    }

    return (
        <div>
            <form>
                {grid.map((row, i) => {
                    return (
                        <div className='form-row mb-2 justify-content-center' key={i}>
                            {row.map(field => {
                                let i, j, fieldNum
                                [i, j, fieldNum] = field
                                return (
                                    <div className={`col-sm-1 col-1 ${([2, 5].includes(i)) ? 'mb-3' : ''} ${([2, 5].includes(j)) ? 'mr-3' : ''}`}>
                                        <input
                                            className='form-control inp'
                                            type="text"
                                            maxLength="1"
                                            name={fieldNum.toString()}
                                            key={fieldNum}
                                            value={(props.board[i][j] === 0) ? "" : props.board[i][j]}
                                            onChange={e => props.handleChange(e)}
                                            size="4"
                                        />
                                    </div>
                                )
                            })}
                        </div>
                    )
                })}
            </form>
        </div>
    );
};