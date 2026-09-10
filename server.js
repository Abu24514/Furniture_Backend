import dotenv from "dotenv/config"
import app from "./src/app.js";
import connectToDb from "./src/config/db.js";

const PORT = process.env.PORT || 3000;

// Database call 
connectToDb();

app.get("/", (req, res) => res.send("Backend is live."));

app.listen(PORT, () => {
  console.log(`Server is running on ${PORT}`);
});
