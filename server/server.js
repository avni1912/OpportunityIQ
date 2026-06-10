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

    const sql = "SELECT * FROM opportunities";

    db.query(sql, (err, result) => {

        if (err) {
            res.status(500).json({
                error: err
            });
            return;
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

        res.json(result);

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


app.listen(5000, () => {
    console.log("Server running on port 5000");
});