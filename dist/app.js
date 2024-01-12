"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config");
const http_errors_1 = __importDefault(require("http-errors"));
const express_1 = __importDefault(require("express"));
const path_1 = __importDefault(require("path"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const morgan_1 = __importDefault(require("morgan"));
const index_route_1 = __importDefault(require("./routes/index.route"));
const books_route_1 = __importDefault(require("./routes/books.route"));
const users_route_1 = __importDefault(require("./routes/users.route"));
const mongoose_1 = __importDefault(require("mongoose"));
const express_session_1 = __importDefault(require("express-session"));
const mongoURI = process.env.DATABASE_URL;
mongoose_1.default.connect(mongoURI)
    .then(() => {
    console.log('Connected to MongoDB');
})
    .catch((error) => {
    console.error('MongoDB connection error:', error.message);
});
const app = (0, express_1.default)();
app.set('views', path_1.default.join(__dirname, '..', 'views'));
app.set('view engine', 'ejs');
app.use((0, morgan_1.default)('dev'));
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: false }));
app.use((0, cookie_parser_1.default)());
app.use(express_1.default.static(path_1.default.join(__dirname, '..', 'public')));
app.use((0, express_session_1.default)({
    secret: `${process.env.secret}`,
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false },
}));
app.use((req, res, next) => {
    res.setHeader('Cache-Control', 'no-store, must-revalidate');
    next();
});
app.use('/', index_route_1.default);
console.log("here");
app.use('/books', books_route_1.default);
app.use('/users', users_route_1.default);
app.use((_req, _res, next) => {
    next((0, http_errors_1.default)(404));
});
app.use((err, req, res, next) => {
    console.log(err);
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};
    res.status(err.status || 500);
    res.render('error');
});
exports.default = app;
