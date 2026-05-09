const express = require("express");
const jwt = require("jsonwebtoken");
const {authMiddleware} = require("./middleware");
const cookieParser = require('cookie-parser');
const {userModel, organizationModel} = require("./models.js")

// let USERS_ID=1;
// let ORGANIZATIONS_ID=1;
// let ISSUES_ID=1;
// let BOARD_ID=1;

// const USERS=[];
// const ORGANIZATIONS=[];
// const BOARDS = [];
// const ISSUES = [];

const app = express();
app.use(express.json());
app.use(cookieParser());
 
app.post("/signup",async (req,res)=>{
    const username=req.body.username;
    const password=req.body.password;

    const userExists = await userModel.findOne({
        username:username
    })
    if(userExists){
        res.status(411).json({
            message:"User with this username already exists"
        })
        return;
    }

    const newUser = await userModel.create({
        username:username,
        password:password
    });
    res.json({
        id:mongoose,
        message:"You have signed up successfully"
    })
})

app.post("/signin",async (req, res) => {
    const username = req.body.username;
    const password = req.body.password;

    const userExists = await userModel.findOne({
        username:username
    });
    if (!userExists) {
        res.status(403).json({
            message: "User with this username does not exist"
        });
        return;
    }
    
    let token = jwt.sign({
        userId: userExists._id
    }, "sriram");

    res.cookie('authToken', token);

    res.json({
        "token": token
    });
});


app.post("/organization",authMiddleware,async (req,res)=>{
    const userId = req.userId;
    const orgCreate=await organizationModel.create({
        title:req.body.title,
        description:req.body.description,
        admin:userId,
        members:[]
    })
    res.json({
        message:"Org created",
        id:orgCreate._id
    })
})

app.post("/add-member-to-organization",authMiddleware,async (req,res)=>{
    const userId=req.userId;
    const orgName=req.body.orgName;
    const memberUsername=req.body.memberUsername;

    const organization = await organizationModel.findOne({
        title:orgName
    });

    if(!organization||organization.admin.toString()!==userId){
        res.status(411).json({
            message:"Either this org doesn't exist or you are not an admin of this org"
        })
        return;
    }

    const memberUser=await userModel.findOne({
        username:memberUsername
    });
    
    if(!memberUser){
        res.status(411).json({
            message:"No user with this useranme exists in our db"
        })
        return
    }
    await organizationModel.updateOne({
        title: orgName
    }, {
        "$push": {
            members: memberUser._id
        }
    });

    res.json({
        message:"New member added!"
    })
})

app.post("/board",authMiddleware,(req,res)=>{
    
})

app.post("/issue",(req,res)=>{

})

app.get("/organization",authMiddleware,async (req,res)=>{
    const userId=req.userId;
    const organizationId=req.query.organizationId;

    const organization = await organizationModel.findOne({
        _id:organizationId
    });

    if(!organization||organization.admin.tostring()!==userId){
        res.status(411).json({
            message:"Either this org doesn't exist or you are not an admin of this org"
        })
        return;
    }

    res.json({
        organization:organization
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

app.delete("/members",authMiddleware,async (req,res)=>{
    const userId=req.userId;
    const orgName=req.body.orgName;
    const memberUsername=req.body.memberUsername;

    const organization = await organizationModel.findOne({
        title:orgName
    });

    if(!organization||organization.admin.toString()!==userId){
        res.status(411).json({
            message:"Either this org doesn't exist or you are not an admin of this org"
        })
        return;
    }

    const memberUser=await userModel.findOne({
        username:memberUsername
    });
    
    if(!memberUser){
        res.status(411).json({
            message:"No user with this useranme exists in our db"
        })
        return
    }

    await organizationModel.updateOne(
        {title:orgName},
        {"$pull":{members:memberUser._id}}
    )

    res.json({
        message:"Member removed!"
    })
})
app.listen(3000);