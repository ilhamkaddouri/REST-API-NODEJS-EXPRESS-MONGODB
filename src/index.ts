import express from "express"
import mongoose from "mongoose"
import Book from './model/book.model'
import {Request,Response} from 'express'
import bodyParser from 'body-parser'
import cors from "cors"
const app = express();
app.use(bodyParser.json());
app.use(cors());
const uri="mongodb://localhost:27017/Biblio";
mongoose.connect(uri,(err)=>{
    if(err){
        console.log(err)
    }else{
        console.log("clean")
    }
})

app.get("/",(req:Request,resp:Response)=>{
    resp.send("hey");
});

app.get("/books",(req:Request,resp:Response)=>{
    Book.find((err,books)=>{
        if(err) resp.status(500).send(err)
        else resp.send(books);
    })
});

app.get("/books/:id",(req:Request,resp:Response)=>{
    Book.findById(req.params.id,(err,book)=>{
        if(err) resp.status(500).send(err)
        else resp.send(book);
    })
});
//get http://localhost:8085/pbooks?page=1&size=5
app.get("/pbooks",(req:Request,resp:Response)=>{
    let p:number = parseInt(req.query.page || 1);
    let s:number = parseInt(req.query.size || 5)
    
    Book.paginate({},{page:p,limit:s},(err,books)=>{
        if(err) resp.status(500).send(err)
        else resp.send(books);
    })
});

//get http://localhost:8085/search-book?kw=page=1&size=5
app.get("/search-book",(req:Request,resp:Response)=>{
    let p:number = parseInt(req.query.page || 1);
    let s:number = parseInt(req.query.size || 5)
    let kw:number = req.query.kw || ""
    Book.paginate({title:{$regex:".*(?i)"+kw+".*(?i)"}},{page:p,limit:s},(err,books)=>{
        if(err) resp.status(500).send(err)
        else resp.send(books);
    })
});

app.post("/books",(req:Request,resp:Response)=>{
    let book = new Book(req.body);
    book.save(err=>{
        if(err) resp.status(500).send(err);
        else resp.send(book);
    })
});

app.put("/books/:id",(req:Request,resp:Response)=>{
    Book.findByIdAndUpdate(req.params.id,req.body,(err,book)=>{
        if(err) resp.status(500).send(err);
        else resp.send("Update succesfull")
    })
});

app.delete("/books/:id",(req:Request,resp:Response)=>{
    Book.findByIdAndDelete(req.params.id,req.body,(err,book)=>{
        if(err) resp.status(500).send(err);
        else resp.send("Delete succesfull")
    })
});

app.listen(8085,()=>{
    console.log('started')
})
