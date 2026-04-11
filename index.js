const express = require("express");
const jwt = require("jsonwebtoken");

let USERS_ID=1;
let ORGANIZATIONS_ID=1;
let ISSUES_ID=1;
let BOARD_ID=1;

const USERS=[];
const ORGANIZATIONS=[{
    id:1,
    title:"100xdevs",
    description:"Learning coding platform",
    admin:"1",
    members:[2]
},{
    id: 2,
    title: "ramans org",
    description: "Experimenting",
    admin: 1,
    members: []
}];
const BOARDS = [{
    id: 1,
    title: "100xschool website (frontend",
    organizationId: 1
}];
const ISSUES = [{
    id: 1,
    title: "Add dark mode",
    boardId: 1,
    state: "IN_PROGRESS"
}, {
    id: 2,
    title: "Allow admins to create more courses",
    boardId: 1,
    state:"DONE"
}];

const app = express();
app.use(express.json());
app.post("/signup",(req,res)=>{
    const username=req.body.username;
    const password=req.body.password;

    const userExists = USERS.find(u=>u.username===username);
    if(userExists){
        res.status(411).json({
            message:"User with this username already exists"
        })
        return;
    }

    USERS.push({
        username,
        password,
        id:USERS_ID++
    })
    res.json({
        message:"You have signed up successfully"
    })
})

app.post("/signin",(req,res)=>{
    const username=req.body.username;
    const password=req.body.password;

    const userExists = USERS.find(u=>u.username===username);
    if(!userExists){
        res.status(403).json({
            message:"User with this username does not exist"
        })
        return;
    }
    let token=jwt.sign({
        userId:userExists.id
    },"sriram")

    res.json({
        "token":token
    })
})

app.post("/organization",(req,res)=>{
    
})

app.post("/add-member-to-organization",(req,res)=>{

})
app.listen(3000);