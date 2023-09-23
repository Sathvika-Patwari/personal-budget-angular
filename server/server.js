// Budget API

const express = require('express');
const cors = require('cors');
const app = express();
const port = 3000;
const BudgetDataJSON = require('./budgetData.json');

app.use('/heyo',express.static('public'));

app.use(cors());

// const budget = {
//     myBudget: [
//         {
//             title: 'Eat out',
//             budget: 25
//         },
//         {
//             title: 'Rent',
//             budget: 275
//         },
//         {
//             title: 'Grocery',
//             budget: 110
//         },
//     ]
// };


app.get('/budget', (req, res) => {
    res.json(BudgetDataJSON);
});

app.listen(port, () => {
    console.log(`API served at http://localhost:${port}`);
});