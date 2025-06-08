const path = require('path');
const express = require('express');
const morgan = require('morgan');
const methodOverride = require('method-override');
const { engine } = require('express-handlebars');
const app = express();
const port = 3000;

const SortMiddleware = require('./app/middlewares/SortMiddleware');

const route = require('./routes');
const db = require('./config/db');

// Connect to DB
db.connect();

app.use(express.static(path.join(__dirname, 'public')));

app.use(express.urlencoded());
app.use(express.json());

app.use(methodOverride('_method'));

// Custom middlewares
app.use(SortMiddleware);

// HTTP logger
// app.use(morgan('combined'));

//Template engine
app.engine(
    'hbs',
    engine({
        extname: '.hbs',
        helpers: {
            sum: (a, b) => a + b,
            sortable: (field, sort) => {
                const sortType = field === sort.column ? sort.type : 'default';

                const icons = {
                    default: 'bi bi-funnel-fill',
                    asc: 'bi bi-sort-down-alt',
                    desc: 'bi bi-sort-down',
                };
                const types = {
                    default: 'desc',
                    asc: 'desc',
                    desc: 'asc',
                };

                const icon = icons[sortType];
                const type = types[sort.type];

                return `<a href="?_sort&column=${field}&type=${type}" >
                    <i class="${icon}"></i>
                </a>`;
            }
        },
    }),
);
app.set('view engine', 'hbs');
app.set('views', path.join(__dirname, 'resources', 'views'));

// Home, search, contact

// Routes init
route(app);

app.listen(port, () => console.log(`App listening on port http://localhost:${port}`));
