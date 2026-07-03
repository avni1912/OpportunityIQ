const express = require("express");
const cors = require("cors");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const JWT_SECRET = "opportunityiq_secret_key";
const db = require("./db/connection");

const app = express();

app.use(cors());
app.use(express.json());

const verifyToken = (req, res, next) => {

    const authHeader = req.headers.authorization;

    if (!authHeader) {
        return res.status(401).json({
            message: "Access Denied"
        });
    }

    const token = authHeader.split(" ")[1];

    try {

        const verified = jwt.verify(token, JWT_SECRET);

        req.user = verified;

        next();

    } catch (err) {

        return res.status(401).json({
            message: "Invalid Token"
        });

    }

};


app.get("/", (req, res) => {
    res.send("OpportunityIQ Backend Running");
});


app.get("/opportunities", (req, res) => {

    const category = req.query.category;
    const sort = req.query.sort;

    let sql = "SELECT * FROM opportunities";
    let values = [];

    if (category) {
        sql += " WHERE category = ?";
        values.push(category);
    }

    if (sort === "deadline") {
        sql += " ORDER BY deadline ASC";
    }

    db.query(sql, values, (err, result) => {

        if (err) {
            return res.status(500).json({
                error: err
            });
        }

        res.json(result);

    });

});

app.get("/opportunities/:id", (req, res) => {

    const id = req.params.id;

    const sql = "SELECT * FROM opportunities WHERE id = ?";

    db.query(sql, [id], (err, result) => {

        if (err) {
            res.status(500).json({
                error: err
            });
            return;
        }

        res.json(result[0]);

    });

});


app.get("/search", (req, res) => {

    const search = req.query.q;

    const sql = `
        SELECT * FROM opportunities
        WHERE title LIKE ?
        OR organization LIKE ?
        OR skills_required LIKE ?
    `;

    const value = `%${search}%`;

    db.query(sql, [value, value, value], (err, result) => {

        if (err) {
            res.status(500).json({
                error: err
            });
            return;
        }

        res.json(result);

    });

});

app.post("/save", verifyToken, (req, res) => {

    const { opportunity_id } = req.body;
    const user_id = req.user.id;

    console.log("User ID:", user_id);
console.log("Opportunity ID:", opportunity_id);

    const checkSql =
        "SELECT * FROM saved_opportunities WHERE user_id = ? AND opportunity_id = ?";

    db.query(checkSql, [user_id, opportunity_id], (err, result) => {

        console.log("Existing records:", result);

        if (err) {
            return res.status(500).json({ error: err });
        }

        if (result.length > 0) {
            return res.json({
                message: "Opportunity already saved!"
            });
        }

        const insertSql =
            "INSERT INTO saved_opportunities (user_id, opportunity_id) VALUES (?, ?)";

        db.query(insertSql, [user_id, opportunity_id], (err) => {

            if (err) {
                return res.status(500).json({ error: err });
            }

            res.json({
                message: "Opportunity saved successfully!"
            });

        });

    });

});

app.get("/saved", verifyToken, (req, res) => {

    const user_id = req.user.id;

    const sql = `
        SELECT opportunities.*
        FROM saved_opportunities
        JOIN opportunities
        ON saved_opportunities.opportunity_id = opportunities.id
        WHERE saved_opportunities.user_id = ?
    `;

    db.query(sql, [user_id], (err, result) => {

        if (err) {
            console.log(err);

            return res.status(500).json({
                error: err
            });
        }

        res.json(result);

    });

});

app.delete("/saved/:id", verifyToken, (req, res) => {

    const opportunity_id = req.params.id;
    const user_id = req.user.id;
    const sql =
        "DELETE FROM saved_opportunities WHERE user_id = ? AND opportunity_id = ?";

    db.query(sql, [user_id, opportunity_id], (err, result) => {

        if (err) {
            console.log(err);

            return res.status(500).json({
                error: err
            });
        }

        if (result.affectedRows === 0) {
            return res.status(404).json({
                message: "Saved opportunity not found."
            });
        }

        res.json({
            message: "Removed successfully!"
        });

    });

});

app.post("/signup", async (req, res) => {

    const { name, email, password, branch, year, skills } = req.body;

    try {

        const hashedPassword = await bcrypt.hash(password, 10);

        const sql = `
            INSERT INTO users
            (name, email, password, branch, year, skills)
            VALUES (?, ?, ?, ?, ?, ?)
        `;

        db.query(
            sql,
            [name, email, hashedPassword, branch, year, skills],
            (err, result) => {

                if (err) {
                    console.log(err);

                    return res.status(500).json({
                        error: err
                    });
                }

                res.json({
                    message: "User registered successfully!"
                });

            }
        );

    } catch (error) {

        console.log(error);

        res.status(500).json({
            error: error
        });

    }

});

app.post("/login", (req, res) => {

    const { email, password } = req.body;

    const sql = "SELECT * FROM users WHERE email = ?";

    db.query(sql, [email], async (err, result) => {

        if (err) {
            return res.status(500).json({
                error: err
            });
        }

        if (result.length === 0) {
            return res.status(404).json({
                message: "User not found"
            });
        }

        const user = result[0];

        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.status(401).json({
                message: "Invalid password"
            });
        }

        const token = jwt.sign(
            {
                id: user.id,
                email: user.email
            },
            JWT_SECRET,
            {
                expiresIn: "1d"
            }
        );

        res.json({
            message: "Login successful",
            token
        });

    });

});

app.listen(5000, () => {
    console.log("Server running on port 5000");
});