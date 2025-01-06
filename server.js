const express = require("express");
const cors = require("cors");
const ByPassCaptcha = require("./services/byPassCaptcha");
const Auth = require("./services/auth");
const File = require("./libs/File");
require("dotenv").config();

const app = express();
app.use(cors());
const PORT = process.env.PORT || 8080;

app.use("/", async (req, res) => {
	const file = new File();
	const user = new Auth(process.env.APP_ID);
	// const login = await user.loginAsync("bull600@veer.vn", "Rtn@2024");

	// const data = {
	// 	userId: login.user_id,
	// 	email: login.email,
	// 	token: login.token,
	// 	referralCode: login.referralCode,
	// };
	// console.log("data: ", data);

	// file.writeAsync(data);

	const register = await user.registerAsync(
		"bullz200@touzy.us",
		"bull1",
		"Rtn@2024"
	);

	res.json({
		data: register,
		status: 200,
		success: true,
		message: "",
	});
});

app.listen(PORT, () => {
	console.log("Server is running on port " + PORT);
});
