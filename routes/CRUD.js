const express = require('express');

const router = express.Router();
const pg = require('pg');
router .use(express.json()); 

const pool = new pg.Pool({
  connectionString: process.env.DATABASE_URL,
});

/* Show */
router.get("/all", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM recipe");
    res.json(result.rows);
  } 
  catch (error) {
    console.error("Fetch from DB Error:", error);
    res.status(500).json({ error: "Failed to load recipe from DB" });
  }
});
/* Insert */
router.post("/save", async (req, res) => {
  const { title, image, instructions, ingredients, readyin } = req.body;

  try {
    const result = await pool.query(
      `INSERT INTO recipe (title, image, instructions, ingredients, readyin)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING *`,
      [title, image, instructions, ingredients, readyin]
    );

    res.status(201).json({ message: "Recipe saved to DB", data: result.rows[0] });
  } 
  catch (error) {
    console.error("DB Save Error:", error);
    res.status(500).json({ error: error.message }); 
  }
});
/* Delete */
router.delete("/delete/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const result = await pool.query("DELETE FROM recipe WHERE id = $1", [id]);
    res.json({ message: "Recipe deleted" });
  } 
  catch (error) {
    console.error("Delete error:", error);
    res.status(500).json({ error: "Failed to delete recipe" });
  }
});
/* Update */
router.put("/update/:id", async (req, res) => {
  const { id } = req.params;
  const { instructions, ingredients } = req.body;
  console.log(req.body)

  try {
    // console.log("Request Body:", req.body);
    // console.log("Recipe ID:", id);
    await pool.query(
      `UPDATE recipe SET instructions = $1, ingredients = $2 WHERE id = $3
      RETURNING * `,
      [instructions, JSON.stringify(ingredients), id]
    );
    res.status(200).send('Updated successfully');
  } 
  catch (err) {
    console.error('🔥 Error in DB update:', err); 
    res.status(500).send({ err: err.message });
  }
});

module.exports = router;