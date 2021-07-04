require('dotenv').config()
const express = require("express");
const app = express()
const path = require("path")
const hbs = require("hbs")
const bycript = require("bcryptjs")
const jwt = require("jsonwebtoken")
require("./db/connect")
const Student = require("./models/register")
const port = process.env.PORT || 3000;

app.use(express.json())
app.use(express.urlencoded({extended: false}))
app.use(express.static(path.join(__dirname,"../public")))

app.set("view engine","hbs")
app.set("views" , path.join(__dirname,"../tamplate/views"))
hbs.registerPartials(path.join(__dirname , "../tamplate/partials"))


app.get("",(req,res)=> {
    res.render("index")
})

app.post("/register" , async (req,res) => {
    try {
        const passwrod = req.body.password;
        const reTypePass = req.body.retypePass;
        if(passwrod === reTypePass){
            const studentData = new Student({
                name: req.body.name,
                email: req.body.email,
                phone: req.body.phone,
                gender: req.body.gender,
                password:req.body.password,
                // confrimPass:req.body.password
            })

            // const token = await studentData.genarateAuthToken()
            // console.log(token);

            const genrateToken = await studentData.tryThisToken()
            console.log(genrateToken);

            const saveData = await studentData.save();
            res.status(201).render("index")
            
        }else{
            res.send("password are not match")
        }
    } catch (error) {
        res.send(error)
    }

})

app.get("/register" , (req,res) => {
    res.render("register")
})

app.post("/login" , async (req,res) => {
    try {
        
        const email = req.body.email;
        const password = req.body.password
        
        const CheckUser = await Student.findOne({email:email});
        const isTrue = await bycript.compare(password,CheckUser.password)

        const genrateToken = await CheckUser.tryThisToken()
        console.log(genrateToken);
        if(isTrue){
            res.status(200).render("index")    
        }else{
            res.send("invalid password")
        }
    } catch (error) {
        res.status(400).send("invalid Login Details")
    }
})
app.get("/login" , (req,res) => {
    res.render("login")
})

app.get("/data" , async (req,res) => {
    const studentData = await Student.find()
    console.log(studentData);
    res.send(studentData)
})

app.listen(port , () => {
    console.log("lisent from "+port);
})



