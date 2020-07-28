"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const mongoose_1 = __importDefault(require("mongoose"));
const book_model_1 = __importDefault(require("../model/book.model"));
const app = express_1.default();
const uri = "mongodb://localhist:27017/Biblio";
mongoose_1.default.connect(uri, (err) => {
    if (err) {
        console.log(err);
    }
    else {
        console.log("clean");
    }
});
app.get("/", (req, resp) => {
    resp.send("hey");
});
app.get("/bookd", (req, resp) => {
    book_model_1.default.find((err, books) => {
        if (err)
            resp.status(500).send(err);
        else
            resp.send(books);
    });
});
app.listen(8085, () => {
    console.log('started');
});
