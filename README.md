# OAUTH And Local AuthentiCation

- Use For Authentication and 3rd party service like google,

## Error Handling middleware

function ErrorHandler(error,req,res,next){
console.log(error)
res.send("Error")
}

function middleware(req,res,next){
console.log("i am middle ware")
const error = new Error("hey there")
next(error)
}

// Golobally middleware they got call always when some one do request
//Orders of middlerware matters
app.use(middleware)
app.use(ErrorHandler)

## Session

npm i express-session

// index.js
const express = require('express');
const app = express();
const port = 3000;
const session = require("express-session");

// Middleware to parse JSON bodies
app.use(express.json());

const session = require('express-session');
const MongoStore = require('connect-mongo'); // if you're using MongoDB to store sessions

app.use(session({
// Secret used to sign the session ID cookie
secret: 'Some',

// Determines whether the session should be saved to the store even if it was never modified during the request.
// Setting it to `true` is recommended to ensure the session is always saved, but `false` might be suitable depending on use case.
resave: false,

// Forces a session to be saved to the store on every request, even if the session is unmodified.
// Setting it to `true` can help prevent losing session data.
saveUninitialized: true,

// Store where the session will be saved. This example uses MongoDB with connect-mongo.
store: MongoStore.create({
mongoUrl: 'mongodb://localhost:27017/session_db', // replace with your MongoDB connection string
collectionName: 'sessions' // replace with your desired collection name
}),

// Options for the session cookie
cookie: {
// Specifies that the cookie is only accessible through the HTTP protocol (not JavaScript).
httpOnly: true,

    // Specifies the maximum age of the session cookie in milliseconds. After this time, the cookie will expire.
    maxAge: 24 * 60 * 60 * 1000 // 24 hours, for example

}
}));

// Basic route
app.get('/', (req, res) => {
//get session
console.log(req.session)
res.send('Hello World!');
});

// Start the server
app.listen(port, () => {
console.log(`Server running at http://localhost:${port}`);
});

## GoggleLogin

import { OAuth2Client } from 'google-auth-library';
import { User } from './models/User'; // Import your User model
import mongoose from 'mongoose';

const client = new OAuth2Client(CLIENT_ID); // Replace CLIENT_ID with your Google client ID

// Function to verify Google ID Token
async function verifyGoogleToken(idToken) {
const ticket = await client.verifyIdToken({
idToken,
audience: CLIENT_ID, // Specify the CLIENT_ID from the Google API Console
});
return ticket.getPayload(); // Returns the decoded Google user data
}

app.post('/auth/google', async (req, res) => {
const { idToken } = req.body;
try {
// Verify the Google ID Token
const googleUser = await verifyGoogleToken(idToken);

    // Extract Google user information
    const { email, name, picture } = googleUser;

    // Check if the user exists in the database by email
    let user = await User.findOne({ email });

    // If the user doesn't exist, create a new user
    if (!user) {
      user = new User({
        username: name,  // You can use Google's name as the username
        email: email,
        password: "",  // Password not required for Google login
        profilePicture: picture,  // Use Google profile picture
      });
      await user.save();
    }

    // Send back user data (you can also generate a JWT token here if needed)
    res.json({ success: true, user });

} catch (error) {
console.error(error);
res.status(401).json({ success: false, message: 'Invalid token' });
}
});

## Project Satatus Code

401 - Unauthorised
400 - Empety field
