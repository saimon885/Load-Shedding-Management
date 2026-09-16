import { app } from "./app";
import config from "./config";
import { transporter } from "./lib/nodemailer";
import { prisma } from "./lib/prisma";
import { redisClient } from "./lib/redis";
import { initScheduleCronJob } from "./lib/sheduleCron";
import {
  seedAdmin,
  seedCustomer,
  seedOperator,
  seedTechnician,
  seedZoneManager,
} from "./utility/seed";

const main = async () => {
  try {
    await prisma.$connect();
    console.log("Connected to the database");
    await redisClient.connect();
    console.log("connected to redis ");
    await initScheduleCronJob();
    console.log("Automated Schedule Cron Job initialized!");
    await seedAdmin();
    console.log("connected to admin ");

    await seedCustomer();
    console.log("connected to customer ");

    await seedOperator();
    console.log("connected to operator ");
    await seedTechnician();
    console.log("connected to technician ");
    await seedZoneManager();
    console.log("connected to zoneManager ");
    await transporter.verify();
    console.log("nodemailer connected successfully");

    app.listen(config.port, () => {
      console.log(`Example app listening on port 
        ${config.port}`);
    });
  } catch (error) {
    console.log("Disconnected from the database");
    console.error("Error starting the server:", error);
  }
};
main();
