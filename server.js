const express = require("express");
const cors = require("cors");
const Auth = require("./services/auth");
const File = require("./libs/File");
const Imap = require("./libs/Imap");
require("dotenv").config();

const app = express();
app.use(cors());
const PORT = process.env.PORT || 8080;

app.use("/", async (req, res) => {
  const file = new File();
  const user1 = new Auth(process.env.APP_ID, "http://motl5s9n:mOTL5s9N@103.57.129.76:53286");
  const login = await user1.loginAsync("bull1000@veer.vn", "Rtn@2024");

	if(!login) {
		res.json({
			status: 400,
			success: false,
			message: "",
		})

	}

  const data = {
    userId: login.user_id,
    email: login.email,
    token: login.token,
    referralCode: login.referralCode,
  };
  console.log("data: ", data);

  file.writeAsync(data);

  // const register = await user.registerAsync(
  // 	"bullz200@touzy.us",
  // 	"bull1",
  // 	"Rtn@2024"
  // );

  // const veerImap = new Imap("mail.veer.vn", "bull1000@veer.vn", "Rtn@2024");

  // await veerImap.getMailBoxOpenAsync();

  res.json({
    data: data,
    status: 200,
    success: true,
    message: "",
  });
});

app.listen(PORT, () => {
  console.log("Server is running on port " + PORT);
});
