const express = require("express");
const users=[{
    username:"Sriram",
    password:"123"
},{
    username:"Armaan",
    password:"hello"
}];
const organizations=[{
    id:1,
    title:"orgy",
    description:"Making girlfriends",
    admin:"1",
    members:[2]
}];
const boards=[{
    id:1,
    title:"orgy website",
    organizationId: 1
}];
const issues=[{
    id:1,
    title:"Add dark mode",
    boardId:1
},{
    id:2,
    title:"Add more girls",
    boardid:1
}];

const app = express();
app.listen(3000);