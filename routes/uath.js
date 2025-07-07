const express = require('express');
const jwt =require('jsonwebtoken');
const bcrypt =require ('bcrypt');

const routers = express.Router();
const pg = require('pg');

const RouteGuard = require('../middleware/verifyToken');

const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL });

/* Test The RouteGuard */
// routers.get("/secret", RouteGuard, async (req, res) => {
//     res.send("Welcome to the protected route");
// });

routers.post("/register", async (req, res) => {
    const { username, email, password } = req.body;

    try {
        const hashpass = await bcrypt.hash(password,10);
        const result = await pool.query(      
            "INSERT INTO users (username, email, password) VALUES ($1, $2, $3) RETURNING id, username",
            [username, email, hashpass]
        );
        res.status(201).json(result.rows[0]);
    } 
    catch (error) {
        if(error.code === '23505'){
            res.status(409).send("The username already exists");
        }
        res.status(500).send("Error");
    }
});

routers.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const userResult = await pool.query(      
      "SELECT * FROM users WHERE email = $1",
      [email]
    );

    const user = userResult.rows[0];

    if (!user) {
      return res.status(401).json({ message: "User with that email does not exist" });
    }

    const isCompare = await bcrypt.compare(password, user.password);
    if (!isCompare) {
      return res.status(401).json({ message: "Incorrect password" });
    }

    const token = jwt.sign(
      { id: user.id, username: user.username, email: user.email },
      process.env.SECRET_KEY,
      { expiresIn: "30d" } // 1 month
    );

    res.status(200).json({ token });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

module.exports = routers;