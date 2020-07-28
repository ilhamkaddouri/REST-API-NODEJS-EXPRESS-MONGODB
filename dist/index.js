"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const mongoose_1 = __importDefault(require("mongoose"));
const book_model_1 = __importDefault(require("./model/book.model"));
const body_parser_1 = __importDefault(require("body-parser"));
const app = express_1.default();
app.use(body_parser_1.default.json());
const uri = "mongodb://localhost:27017/Biblio";
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
app.get("/books", (req, resp) => {
    book_model_1.default.find((err, books) => {
        if (err)
            resp.status(500).send(err);
        else
            resp.send(books);
    });
});
app.get("/books/:id", (req, resp) => {
    book_model_1.default.findById(req.params.id, (err, book) => {
        if (err)
            resp.status(500).send(err);
        else
            resp.send(book);
    });
});
//get http://localhost:8085/pbooks?page=1&size=5
app.get("/pbooks", (req, resp) => {
    let p = parseInt(req.query.page || 1);
    let s = parseInt(req.query.size || 5);
    book_model_1.default.paginate({}, { page: p, limit: s }, (err, books) => {
        if (err)
            resp.status(500).send(err);
        else
            resp.send(books);
    });
});
//get http://localhost:8085/search-book?kw=page=1&size=5
app.get("/search-book", (req, resp) => {
    let p = parseInt(req.query.page || 1);
    let s = parseInt(req.query.size || 5);
    let kw = req.query.kw || "";
    book_model_1.default.paginate({ title: { $regex: ".*(?i)" + kw + ".*(?i)" } }, { page: p, limit: s }, (err, books) => {
        if (err)
            resp.status(500).send(err);
        else
            resp.send(books);
    });
});
app.post("/books", (req, resp) => {
    let book = new book_model_1.default(req.body);
    book.save(err => {
        if (err)
            resp.status(500).send(err);
        else
            resp.send(book);
    });
});
app.put("/books/:id", (req, resp) => {
    book_model_1.default.findByIdAndUpdate(req.params.id, req.body, (err, book) => {
        if (err)
            resp.status(500).send(err);
        else
            resp.send("Update succesfull");
    });
});
app.delete("/books/:id", (req, resp) => {
    book_model_1.default.findByIdAndDelete(req.params.id, req.body, (err, book) => {
        if (err)
            resp.status(500).send(err);
        else
            resp.send("Delete succesfull");
    });
});
app.listen(8085, () => {
    console.log('started');
});
