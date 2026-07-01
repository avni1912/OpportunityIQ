const express = require("express");
const cors = require("cors");
const db = require("./db/connection");

const app = express();

app.use(cors());
app.use(express.json());


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

app.post("/save", (req, res) => {

    const { opportunity_id } = req.body;

    const user_id = 1;

    const sql =
        "INSERT INTO saved_opportunities (user_id, opportunity_id) VALUES (?, ?)";

    db.query(sql, [user_id, opportunity_id], (err, result) => {

        if (err) {
            return res.status(500).json({
                error: err
            });
        }

        res.json({
            message: "Opportunity saved successfully!"
        });

    });

});

app.get("/saved", (req, res) => {

    const user_id = 1;

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

app.delete("/saved/:id", (req, res) => {

    const opportunity_id = req.params.id;
    const user_id = 1;

    const sql =
        "DELETE FROM saved_opportunities WHERE user_id = ? AND opportunity_id = ?";

    db.query(sql, [user_id, opportunity_id], (err, result) => {

        if (err) {
            console.log(err);

            return res.status(500).json({
                error: err
            });
        }

        res.json({
            message: "Removed successfully!"
        });

    });

});

app.listen(5000, () => {
    console.log("Server running on port 5000");
});