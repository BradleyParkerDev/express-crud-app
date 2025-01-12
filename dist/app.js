"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const morgan_1 = __importDefault(require("morgan"));
const cors_1 = __importDefault(require("cors"));
const http_errors_1 = __importDefault(require("http-errors"));
const index_1 = __importDefault(require("./routes/index"));
const auth_1 = __importDefault(require("./routes/auth"));
const images_1 = __importDefault(require("./routes/images"));
const user_1 = __importDefault(require("./routes/user"));
const auth_2 = require("./lib/auth");
// App Creation
const app = (0, express_1.default)();
// Handle expired user sessions
auth_2.auth.handleExpiredUserSessionsCron();
// Middleware
app.use((0, cors_1.default)({
    origin: 'http://localhost:3000', // React app's URL
    credentials: true, // Allow cookies and other credentials
}));
app.use((0, morgan_1.default)('dev'));
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: false }));
app.use((0, cookie_parser_1.default)());
app.use(auth_2.auth.handleSessionCookies); // Authorization Middleware
// Routes
app.use('/', index_1.default);
app.use('/api/auth', auth_1.default);
app.use('/api/images', images_1.default);
app.use('/api/user', user_1.default);
// Catch 404 and forward to error handler
app.use((req, res, next) => {
    next((0, http_errors_1.default)(404));
});
// Error handler
app.use((err, req, res) => {
    res.status(err.status || 500);
    res.json({
        message: err.message,
        error: req.app.get('env') === 'development' ? err : {}
    });
});
exports.default = app;
