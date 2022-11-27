const mongoSanitize = require("express-mongo-sanitize");
const express = require("express");
const path = require("path");
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");
const app = express();
const cors = require("cors");
const dotenv = require("dotenv");
const api = require("./src/api");
const swaggerUI = require("swagger-ui-express");
const swaggerDocument = require("./doc/API/swagger.json");
const cloudinary = require("cloudinary").v2;
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
dotenv.config();

cloudinary.config({
	cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
	api_key: process.env.CLOUDINARY_API_KEY,
	api_secret: process.env.CLOUDINARY_API_SECRET,
});

passport.use(new GoogleStrategy());

app.use(cookieParser());
app.use(express.json());

const corsConfig = {
	credentials: true,
	origin: [process.env.clientI, process.env.clientII],
};

app.use(cors(corsConfig));
app.use(express.urlencoded({ extended: true }));

// Data sanitization against NoSQL query injection
app.use(mongoSanitize());

const DB = process.env.DATABASE.replace(
	"<USERNAME>",
	process.env.DATABASE_USERNAME
)
	.replace("<PASSWORD>", process.env.DATABASE_PASSWORD)
	.replace("<DB_NAME>", process.env.DATABASE_NAME);
mongoose
	.connect(DB, { useUnifiedTopology: true, useNewUrlParser: true })
	.then(() => console.log("DB connection successful!"))
	.catch((err) => console.log(err));

app.use("/api", api);
app.use("/doc", swaggerUI.serve, swaggerUI.setup(swaggerDocument));

app.listen(3000, () => {
	console.log("App listening on port 3000");
});

app.use((req, res) => {
	res.status(404).sendFile(path.join(__dirname, "/public/404.html"));
});

app.use((error, req, res, next) => {
	let { statusCode, message } = error;

	statusCode = statusCode ? statusCode : 500;

	res.status(statusCode).json({
		statusCode,
		message,
	});
});
