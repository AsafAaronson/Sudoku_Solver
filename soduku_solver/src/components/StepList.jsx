import React from 'react'

//props: steps, currentStep, handleStepButton, usedBacktracking 
export const StepList = (props) => {

    let average
    props.steps.forEach((step)=>{
        if (step.step > 0){
            average += (step.bcc+1)
        }
    })
    average = average/(props.steps.length-1)

    let lastStep
    if (props.steps.length !== 0) {
        lastStep = (
            <div>
                <div className='mt-1 badge badge-pill badge-secondary'>
                    {(props.usedBacktracking) ? "Backtracking was used here to finish the board" : "Backtracking was not used"}
                </div>
                <br />
                <button className={`btn btn-${(props.currentStep >= props.steps.length - 1) ? 'danger' : 'outline-light'}`} onClick={() => props.handleStepButton(props.steps.length - 1)} >
                    Final Result
            </button>
            <div className='mt-1 badge badge-secondary'>
                Average tries per step: {average}
            </div>
            </div>
            
        )
    } else {
        lastStep = "No Steps yet"
    }

    return (
        <div className='m-2'>
            {props.steps.slice(0, props.steps.length - 1).map((step, index) => {
                return (

                    <button onClick={() => props.handleStepButton(index)} className={`mt-1 ml-1 btn btn-${(index == props.currentStep) ? 'danger' : 'outline-light'}`}>
                        {step.step}
                    </button>

                )
            })}
            {lastStep}
        </div>
    )
}