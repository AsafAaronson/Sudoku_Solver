const express = require('express')
const cors = require('cors')
const app = express()
const port = 3001
const cp = require('child_process')



app.use(express.json());
app.use(cors({origin: 'http://localhost:3000'}));

app.get('/', (req, res) => {
    res.send('Hello World')
})

app.post('/', async (req, res) => {
    inputBoard = req.body.board //list of lists with 0 for empty slots
    // Getting Data from Python file
    const pythonChild = cp.spawn('python', ['Main.py', inputBoard])
    pythonChild.stdout.on('data', (data) => {
        data = JSON.parse(data.toString())
        res.send(data)
    })

    pythonChild.stderr.on('data', (err) => {
        console.error(err.toString())
    });

    pythonChild.on('close', (code) => {
        console.log(`child process exited with code ${code}`);
    });


})


app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
})