import React from 'react'

//props: steps, currentStep, handleStepButton, usedBacktracking 
export const StepNav = (props) => {

    const stepsNo = props.steps.length - 1

    let navigator = (
        <div className='container'>
            <div className='form-inline row badge badge-secondary'>
                <h3>
                    {/* <input
                        className='form-control col-5'
                        type="text"
                        maxLength='2'
                        size='1'
                        value={props.currentStep + 1}
                        onChange={(e) => props.handleStepButton(parseInt(e.target.value))}
                    /> */}
                    {props.currentStep + 1} / {stepsNo + 1}</h3>
            </div>
            <div>
                <button
                    onClick={() => props.handleStepButton(-1)}
                    className='btn btn-light m-1'>Initial Board</button>
                <button
                    onClick={() => {
                        if (props.currentStep > -1) {
                            props.handleStepButton(props.currentStep - 1)
                        }
                    }
                    }
                    className='btn btn-light m-1'> - </button>

                <button
                    onClick={() => {
                        if (props.currentStep < stepsNo) {
                            props.handleStepButton(props.currentStep + 1)
                        }
                    }
                    }
                    className='btn btn-light m-1'> + </button>
                <button
                    onClick={() => props.handleStepButton(stepsNo)}
                    className='btn btn-light m-1'>Final Result</button>
            </div>
        </div>
    )

    return (
        <div>
            {(props.steps.length !== 0) ? navigator : ""}
        </div>
    )
}