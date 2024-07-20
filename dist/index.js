"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
require("dotenv/config");
const databaseConnection_1 = __importDefault(require("./db/databaseConnection"));
const globalHandlerError_1 = __importDefault(require("./middlerware/globalHandlerError"));
const userRoutes_1 = __importDefault(require("./controllers/userRoutes"));
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.use((0, cors_1.default)());
app.use("/userRoutes", userRoutes_1.default);
app.use(globalHandlerError_1.default);
// Connect to database and start server
(0, databaseConnection_1.default)().then(() => {
    const PORT = process.env.PORT;
    app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
    });
});
