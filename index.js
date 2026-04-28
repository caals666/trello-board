const express = require("express");
const jwt = require("jsonwebtoken");
const {authMiddleware} = require("./middleware");
const cookieParser = require('cookie-parser');

let USERS_ID=1;
let ORGANIZATIONS_ID=1;
let ISSUES_ID=1;
let BOARD_ID=1;

const USERS=[];
const ORGANIZATIONS=[];
const BOARDS = [];
const ISSUES = [];

const app = express();
app.use(express.json());
app.use(cookieParser());
 
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

app.post("/signin", (req, res) => {
    const username = req.body.username;
    const password = req.body.password;

    const userExists = USERS.find(u => u.username === username);
    if (!userExists) {
        res.status(403).json({
            message: "User with this username does not exist"
        });
        return;
    }
    
    let token = jwt.sign({
        userId: userExists.id
    }, "sriram");

    res.cookie('authToken', token);

    res.json({
        "token": token
    });
});


app.post("/organization",authMiddleware,(req,res)=>{
    const userId = req.userId;
    ORGANIZATIONS.push({
        id:ORGANIZATIONS_ID++,
        title:req.body.title,
        description:req.body.description,
        admin:userId,
        members:[]
    })
    res.json({
        message:"Org created",
        id:ORGANIZATIONS_ID-1
    })
})

app.post("/add-member-to-organization",(req,res)=>{
    const userId=req.userId;
    const organizationId=req.body.organizationId;
    const memberUsername=req.body.organizationId;

    const organization = ORGANIZATIONS.find(o=>o.organizationId==organizationId);

    if(!organization||organization.admin!==userId){
        res.status(411).json({
            message:"Either this org doesn't exist or you are not an admin of this org"
        })
        return;
    }

    const memberUser=USERS.find(u=>u.username===memberUsername);
    
    if(!memberUser){
        res.status(411).json({
            message:"No user with this useranme exists in our db"
        })
        return
    }

    organization.members.push(memberUser)

    res.json({
        message:"New member added!"
    })
})

app.post("/board",(req,res)=>{
    
})

app.post("/issue",(req,res)=>{

})

app.get("/organization",authMiddleware,(req,res)=>{
    const userId=req.userId;
    const organizationId=req.query.organizationId;

    const organization = ORGANIZATIONS.find(o=>o.organizationId==organizationId);

    if(!organization||organization.admin!==userId){
        res.status(411).json({
            message:"Either this org doesn't exist or you are not an admin of this org"
        })
        return;
    }

    res.json({
        organization:{
            ...organization,
            members: organization.members.map(memberId=>{
                const user = USERS.find(users=>user.id===memberId);
                return{
                    id:user.id,
                    username: user.username
                }
            })
        }
    })
})

app.get("/boards",(req,res)=>{

})

app.get("/issues",(req,res)=>{

})

app.get("/members",(req,res)=>{

})

app.put("/issues",(req,res)=>{

})

app.delete("/members",authMiddleware,(req,res)=>{
    const userId=req.userId;
    const organizationId=req.body.organizationId;
    const memberUsername=req.body.organizationId;

    const organization = ORGANIZATIONS.find(o=>o.organizationId==organizationId);

    if(!organization||organization.admin!==userId){
        res.status(411).json({
            message:"Either this org doesn't exist or you are not an admin of this org"
        })
        return;
    }

    const memberUser=USERS.find(u=>u.username===memberUsername);
    
    if(!memberUser){
        res.status(411).json({
            message:"No user with this useranme exists in our db"
        })
        return
    }

    organization.members=organization.members.filter(u=>u.id!==memberUsername)

    res.json({
        message:"New member added!"
    })
})
app.listen(3000);