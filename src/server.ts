import { app } from "./app";
import { prisma } from "./lib/prisma";

const main = async () => {
  try {
    await prisma.$connect();
    console.log("Connected to the database");
    app.listen(5000, () => {
      console.log(`Example app listening on port 5000`);
    });
  } catch (error) {
    console.log("Disconnected from the database");
    console.error("Error starting the server:", error);
  }
};
main();
