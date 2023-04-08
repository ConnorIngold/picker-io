"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.respondError422 = exports.errorHandler = exports.notFound = void 0;
const notFound = (req, res, next) => {
    res.status(404);
    const error = new Error('Not Found - ' + req.originalUrl);
    next(error);
};
exports.notFound = notFound;
const errorHandler = (err, req, res) => {
    res.status(res.statusCode || 500);
    res.json({
        message: err.message,
        stack: err.stack,
    });
};
exports.errorHandler = errorHandler;
const respondError422 = (res, next) => {
    res.status(422);
    const error = new Error('Unable to login.');
    next(error);
};
exports.respondError422 = respondError422;
//# sourceMappingURL=index.js.map