import "dotenv/config";
import app from "./src/app.js";
import connectToDb from "./src/config/db.js";

const PORT = process.env.PORT || 5000;

async function startServer() {
  // Connect to DB FIRST — server should not start accepting requests
  // until the database is actually available.
  await connectToDb();

  const server = app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });

  // Safety net: if any async error escapes without being caught,
  // shut down cleanly instead of continuing in a broken state.
  process.on("unhandledRejection", (err) => {
    console.error("Unhandled Rejection:", err);
    server.close(() => process.exit(1));
  });
}

startServer();