const jwt = require("jsonwebtoken")
const express = require("express")
const app = express()
const cookieParser = require('cookie-parser');
app.use(cookieParser());

function authMiddleware(req, res, next) {
    // Get token from cookie (since you're using cookies)
    const token = req.cookies.authToken;
    
    // Check if token exists
    if (!token) {
        return res.status(401).json({
            success: false,
            message: "No token provided. Please sign in first."
        });
    }
    
    try {
        // Verify the token
        const decoded = jwt.verify(token, "sriram");
        const userId = decoded.userId;
        
        // Check if userId exists in decoded token
        if (!userId) {
            return res.status(403).json({
                success: false,
                message: "Invalid token format"
            });
        }
        
        // Attach userId to request object for use in routes
        req.userId = userId;
        
        // Optional: Also attach the full decoded token if needed
        req.user = decoded;
        
        // Continue to the next middleware/route handler
        next();
        
    } catch (error) {
        // Handle specific JWT errors
        if (error.name === 'JsonWebTokenError') {
            return res.status(403).json({
                success: false,
                message: "Invalid token"
            });
        }
        
        if (error.name === 'TokenExpiredError') {
            return res.status(403).json({
                success: false,
                message: "Token has expired. Please sign in again."
            });
        }
        
        // Generic error
        return res.status(500).json({
            success: false,
            message: "Authentication error",
            error: error.message
        });
    }
}

module.exports={authMiddleware}