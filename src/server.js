const express =  require('express');
const cors = require('cors');
const app = express();

app.use(express.json());
app.use(cors());

const route = require('./routes');

app.use(route);


app.listen(3333);