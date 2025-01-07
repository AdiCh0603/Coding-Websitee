const express = require('express');
const fs = require('fs');
const { type } = require('os');
const app = express();
const port=3000;
//Hello Wolrd
let problems = [];
try {
  const data = fs.readFileSync('cses_problems.json', 'utf8');//To read the JSON file
  problems = JSON.parse(data);
} catch (err) {
  console.error('Error reading problems file:', err);
}
//console.log(problems);
// Group problems by type
const problemsByType = problems.reduce((acc, problem) => {
  const type = problem.type;
  if (!acc[type]) acc[type] = [];
  acc[type].push(problem);
  return acc;
}, {});


let selectedTypes = [];
let selectedProblems = {};
let displayedProblems = {};

// Function to shuffle array
function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));//To select a random number
    [array[i], array[j]] = [array[j], array[i]];//Swap
  }
}

// Select two random types and 5 unique problems from each
function selectRandomTypesAndProblems() {
  const types = Object.keys(problemsByType);
  
  // Select 2 random types
  shuffleArray(types);//To mix the array and select the 2 types by slicing
  selectedTypes = types.slice(0, 2);

  selectedProblems = {};
  selectedTypes.forEach(type => {
    let availableProblems = problemsByType[type].filter(problem => {
      return !displayedProblems[problem.problem];
    });

    // Shuffle and select 5 problems
    shuffleArray(availableProblems);
    selectedProblems[type] = availableProblems.slice(0, 5);

    // Mark selected problems as displayed
    selectedProblems[type].forEach(problem => {
      displayedProblems[problem.problem] = type;
    });
  });
}

// Select initial types and problems and set interval for 10-second refresh
selectRandomTypesAndProblems();
setInterval(selectRandomTypesAndProblems, 24*60*60 * 1000);

app.set('view engine', 'ejs');
app.use(express.static('public'));

app.get('/', (req, res) => {
  res.render('index', { selectedTypes, selectedProblems });
});

app.listen(port, () => {
  console.log("Server running on port 3000");
});
