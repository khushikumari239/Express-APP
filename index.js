const express = require('express');
const JWT_SECRET = "khushiisalwayshappy"
const jwt = require('jsonwebtoken');

const app = express();
app.use(express.json());

const users = [];

// -------------------------------------------------------------------------------

//should return a random long string
// function generateToken() {
//     let options = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z', 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z', '0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];

//     let token = "";
//     for (let i = 0; i < 32; i++) {
//         // use a simple function here
//         token += options[Math.floor(Math.random() * options.length)];
//     }
//     return token;
// }

// ---------------------------------------------------------------------------------

app.post("/signup", function (req, res) {
    // res.json ({
    //     message:"you have signed up"
    // })

    const username = req.body.username;
    const password = req.body.password;

    users.push({
        username: username,
        password: password
    })

    res.json({
        message: "You are signed in "
    })

})

console.log(users)

app.post("/signin", function (req, res) {
    const username = req.body.username;
    const password = req.body.password;
    // Find user
    const foundUser = users.find(function (u) {
        return u.username === username && u.password === password;
    });


    //  Function signature of jwt.sign , it's takes two arguments 1. what you want encode or encrypt (username) , 2.what is your secret that u r using to sign the specific token or create specific tokens  
    if (foundUser) {
        const token = jwt.sign({
            username: username
        }, JWT_SECRET);

        // foundUser.token = token; // no need to store it in the memory anymore 

        res.json({
            message: "Sign in successful",
            token: token
        });
    } else {
        res.status(403).json({
            message: "Invalid Username or Password"

        });
    }
    console.log(users)

});

// Creating and authenticated endpoint 

app.get("/me", function (req, res) {

    const token = req.headers.token // now they will send me a JWT 

    // How i will find this user in a global database...👇
    const decodeInformation = jwt.verify (token , JWT_SECRET); // return a json with {username: "khushiii"}
    const username = decodeInformation.username

// since we have to return the user with the password also ... we still have to find the user in the global variable... but rather that finding them on the token we will find them on the username 

    let foundUser = null;

    for (let i = 0; i < users.length; i++) {
        if (users[i].username == username) {
            foundUser = users[i]
        }
    }

    if (foundUser) {
        res.json({
            message: foundUser.username,
            password: foundUser.password
        })
    } else {
        res.json({
            message: "token invalid"
        })
    }

})

app.listen(3000); // that the http server is listening the port 3000