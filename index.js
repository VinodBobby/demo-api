const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
var xml = require('xml');
var axios = require('axios');

const app = express();
const port = 5000;
const basePath = 'http://localhost:' + port;

app.use(cors());

function delay(time) {
    return new Promise(resolve => setTimeout(resolve, time));
  }

app.get('/', (req, res) => {
    res.send({alive:true});
});

//sends a employee subset after 1 sec delay
app.get('/api1', (req, res) => {
    let employees = [{
        id: 1001,
        firstName: 'John',
        lastName: 'Doe',
    },
    {
        id: 2021,
        firstName: 'Jane',
        lastName: 'Doe',
    },
    {
        id: 2022,
        firstName: 'Mary',
        lastName: 'Doe',
    },];
    delay(1000).then(() => res.send(employees));
});

//sends a employee subset in XML after 5 sec delay
app.get('/api2', (req, res) => {
    let employees = [{
        id: 1002,
        firstName: 'Andy',
        lastName: 'Jones',
    },
    {
        id: 1003,
        firstName: 'Sally',
        lastName: 'Field',
    }];
    // res.set('Content-Type', 'text/xml');
    delay(5000).then(() => res.send(employees));
});

app.get('/employes', (req, res) => {
    let employes = [];
    axios.all([
        axios.get(basePath + '/api1'),
        axios.get(basePath + '/api2')
      ]).then(axios.spread((response1, response2) => {
        employes.push(...response1.data,...response2.data);
        res.send(employes.sort((a, b) => (a.id > b.id) ? 1 : -1));
      })).catch(error => {
        console.log(error);
      });
});

app.listen(port, () => console.log(`Demo app listening on port ${port}!`))

