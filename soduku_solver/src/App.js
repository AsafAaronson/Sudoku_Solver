import './App.css';
import React, { useState } from 'react'
import { BrowserRouter as Router, Route, Switch, Link } from "react-router-dom";
import { InputTable } from './components/InputTable'
import { ResultTable } from './components/ResultTable'
import { StepList } from './components/StepList'
import { StepNav } from './components/StepNav';

const axios = require('axios')

function App() {

  const empty_board = []
  for (let i = 0; i < 9; i++) {
    empty_board[i] = []
    for (let j = 0; j < 9; j++) {
      empty_board[i][j] = 0
    }
  }
  const input_board_1 = [[7, 0, 0, 1, 0, 0, 3, 0, 0], [0, 0, 0, 0, 0, 0, 0, 0, 5], [0, 2, 0, 7, 3, 0, 4, 0, 0], [0, 0, 0, 0, 0, 9, 7, 0, 1], [6, 9, 0, 0, 0, 0, 0, 3, 8], [1, 0, 8, 2, 0, 0, 0, 0, 0], [0, 0, 4, 0, 9, 5, 0, 2, 0], [2, 0, 0, 0, 0, 0, 0, 0, 0], [0, 0, 5, 0, 0, 7, 0, 0, 6]]
  const input_board_2 = [[0, 0, 0, 9, 0, 6, 5, 3, 0], [0, 4, 6, 0, 0, 0, 0, 8, 2], [0, 0, 0, 0, 0, 0, 9, 4, 0], [0, 5, 8, 0, 6, 1, 0, 0, 0], [6, 2, 0, 5, 0, 4, 0, 1, 7], [0, 0, 0, 8, 3, 0, 4, 6, 0], [0, 3, 4, 0, 0, 0, 0, 0, 0], [8, 6, 0, 0, 0, 0, 1, 5, 0], [0, 7, 2, 4, 0, 5, 0, 0, 0]]


  //State:
  const [input, setInput] = useState(empty_board)
  const [steps, setSteps] = useState([])
  const [usedBacktracking, setUsedBacktracking] = useState(false)
  const [result, setResult] = useState(empty_board)
  const [currentStep, setCurrentStep] = useState(81)

  const handleInputChange = e => {
    let newInput = [...input]
    const j = e.target.name % 10
    const i = (e.target.name - j) / 10
    let newValue = parseInt(e.target.value)
    newInput[i][j] = isNaN(newValue) ? 0 : newValue
    setInput(newInput)
  }

  const handleRunSolver = async () => {
    const data = await axios.post('http://localhost:3001/', { board: input })
    console.log(data)
    if (data.status!==200) {
      throw new Error(`HTTP error! status: ${data.status}`);
    } else {
      setCurrentStep(data.data.steps.length - 1)
      setSteps( data.data.steps)
      setUsedBacktracking(data.data.used_backtracking)
      setResult(data.data.result)
    }
  }

  const handleStepButton = (n) => {
    console.log('State should change to ', n)
    setCurrentStep(n)
  }


  return (
    <div className="App App-body">
      <div className="container justify-content-start m-4">
        <h1 id='input'>Input</h1>
        <div className='row justify-content-'>

          <div className='col-lg-3'>
            <button className='btn btn-outline-danger m-2' onClick={() => setInput(empty_board)}> Clear Input Board</button>
            <button className='btn btn-outline-warning m-2' onClick={() => setInput(input_board_1)}>Set Example Board 1</button>
            <button className='btn btn-outline-warning m-2' onClick={() => setInput(input_board_2)}>Set Example Board 2</button>
          </div>
          <div className='col-lg-6 col-12'>
            <InputTable board={input} handleChange={handleInputChange} />
            <a href='#solver'><button className='btn btn-dark mt-4' onClick={handleRunSolver}><h2>Get Result</h2></button></a>
          </div>
        </div>
      </div>

      <br />
      <br />
      <br />

      <div className="container justify content-start m-4">
        <h1 id='solver'>Solver</h1>
        <a href='#input'><button className='btn btn-dark' onClick={() => { setSteps([]); setResult(empty_board) }}>Back to Input</button></a>
        <div className='row justify-content-start'>
          <div className='col'>
            <div className='mb-5'>
              Step Navigator:
              <StepNav usedBacktracking={usedBacktracking} steps={steps} currentStep={currentStep} handleStepButton={handleStepButton} />
              <StepList usedBacktracking={usedBacktracking} steps={steps} currentStep={currentStep} handleStepButton={handleStepButton} />

            </div>
          </div>
          <div className='col-lg-7 col-12'>
            Final Result:
            <ResultTable finalBoard={result} initialBoard={input} steps={steps} currentStep={currentStep} />
          </div>
        </div>
      </div>


    </div>
  );
}

export default App;
