const express = require("express");
const cors = require("cors");
const ByPassCaptcha = require("./services/byPassCaptcha");
require("dotenv").config();

const app = express();
app.use(cors());
const PORT = process.env.PORT || 8080;

app.use("/", async (req, res) => {
	const app = new ByPassCaptcha(process.env.APP_ID);
	await app.start();

	const puzzle = app.getPuzzleId();
	const puzzleImage = app.getPuzzleImage();

	res.json({
		puzzleId: puzzle,
		puzzleImage: puzzleImage,
		success: true,
		message: "Puzzle fetched successfully",
	});
});

app.listen(PORT, () => {
	console.log("Server is running on port " + PORT);
});
