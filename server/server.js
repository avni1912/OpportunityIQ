require("dotenv").config();
const express = require("express");
const cors = require("cors");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const JWT_SECRET = process.env.JWT_SECRET;
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

    const search = req.query.search || "";
    const category = req.query.category || "";

    let sql = "SELECT * FROM opportunities WHERE 1=1";
    const values = [];

    if (search) {

        sql += `
            AND (
                title LIKE ?
                OR organization LIKE ?
                OR category LIKE ?
            )
        `;

        const searchValue = `%${search}%`;

        values.push(searchValue, searchValue, searchValue);

    }

    if (category) {

        sql += " AND category = ?";

        values.push(category);

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

function verifyAdmin(req, res, next) {

    if (req.user.role !== "admin") {
        return res.status(403).json({
            message: "Admin access only"
        });
    }

    next();

}

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
                email: user.email,
                role: user.role
            },
            JWT_SECRET,
            {
                expiresIn: "1h"
            }
        );

        res.json({
            message: "Login successful",
            token,
            role: user.role
        });

    });

});

app.put("/users/skills", verifyToken, (req, res) => {

    const { skills } = req.body;

    const sql = `
        UPDATE users
        SET skills = ?
        WHERE id = ?
    `;

    db.query(
        sql,
        [skills, req.user.id],
        (err) => {

            if (err) {
                return res.status(500).json(err);
            }

            res.json({
                message: "Skills updated successfully!"
            });

        }
    );

});

app.post("/opportunities", verifyToken, verifyAdmin, (req, res) => {

    const {
        title,
        organization,
        category,
        description,
        deadline,
        skills_required,
        eligible_years,
        eligible_branches,
        apply_link
    } = req.body;

    const sql = `
        INSERT INTO opportunities
        (title, organization, category, description, deadline,
        skills_required, eligible_years, eligible_branches, apply_link)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    db.query(
        sql,
        [
            title,
            organization,
            category,
            description,
            deadline,
            skills_required,
            eligible_years,
            eligible_branches,
            apply_link
        ],
        (err, result) => {

            if (err) {
                return res.status(500).json(err);
            }

            res.json({
                message: "Opportunity added successfully!"
            });

        }
    );

});

app.delete("/opportunities/:id", verifyToken, verifyAdmin, (req, res) => {

    const id = req.params.id;

    const sql = "DELETE FROM opportunities WHERE id = ?";

    db.query(sql, [id], (err, result) => {

        if (err) {
            return res.status(500).json(err);
        }

        res.json({
            message: "Opportunity deleted successfully!"
        });

    });

});

app.put("/opportunities/:id", verifyToken, verifyAdmin, (req, res) => {

    const id = req.params.id;

    const {
        title,
        organization,
        category,
        description,
        deadline,
        skills_required,
        eligible_years,
        eligible_branches,
        apply_link
    } = req.body;

    const sql = `
        UPDATE opportunities
        SET
        title=?,
        organization=?,
        category=?,
        description=?,
        deadline=?,
        skills_required=?,
        eligible_years=?,
        eligible_branches=?,
        apply_link=?
        WHERE id=?
    `;

    db.query(
        sql,
        [
            title,
            organization,
            category,
            description,
            deadline,
            skills_required,
            eligible_years,
            eligible_branches,
            apply_link,
            id
        ],
        (err) => {

            if (err) {
                return res.status(500).json(err);
            }

            res.json({
                message: "Opportunity updated successfully!"
            });

        }
    );

});

app.listen(process.env.PORT, () => {
    console.log("Server running on port 5000");
});