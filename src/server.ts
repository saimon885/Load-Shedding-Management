import { app } from "./app";
import config from "./config";
import { transporter } from "./lib/nodemailer";
import { prisma } from "./lib/prisma";
import { redisClient } from "./lib/redis";

const main = async () => {
	try {
		await prisma.$connect();
		console.log("Connected to the database");
		await redisClient.connect();
		console.log("connected to redis ");

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
