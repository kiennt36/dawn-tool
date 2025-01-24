const express = require("express");
const cors = require("cors");
const Auth = require("./services/auth");
const File = require("./libs/File");
const Imap = require("./libs/Imap");
require("dotenv").config();

// const app = express();
// app.use(cors());
// const PORT = process.env.PORT || 8080;

// app.use("/", async (req, res) => {
//   // const file = new File();
//   // const user1 = new Auth(process.env.APP_ID, "http://motl5s9n:mOTL5s9N@103.57.129.76:53286");
//   // const login = await user1.loginAsync("bull1000@veer.vn", "Rtn@2024");

// 	// if(!login) {
// 	// 	res.json({
// 	// 		status: 400,
// 	// 		success: false,
// 	// 		message: "",
// 	// 	})

// 	// }

//   // const data = {
//   //   userId: login.user_id,
//   //   email: login.email,
//   //   token: login.token,
//   //   referralCode: login.referralCode,
//   // };
//   // console.log("data: ", data);

//   // file.writeAsync(data);

//   // // const register = await user.registerAsync(
//   // // 	"bullz200@touzy.us",
//   // // 	"bull1",
//   // // 	"Rtn@2024"
//   // // );

//   const veerImap = new Imap("mail.veer.vn", "bull14199@veer.vn", "Rtn@2024");

//   await veerImap.getMailBoxOpenAsync("INBOX", {
// 		from: "hello@dawninternet.com",
// 		subject: "Email verification",
// 	});

//   res.json({
//     // data: data,
//     status: 200,
//     success: true,
//     message: "",
//   });
// });

// app.listen(PORT, () => {
//   console.log("Server is running on port " + PORT);
// });


async function report() {
  console.log("Report:: Starting...")

  try {
    const file = new File()
    const accountLines = await file.readTxtAsync("accounts.txt", "./configs")
    const accounts = accountLines.map(line => {
      const [email, token] = line.split(":")
      return ({
        email,
        token
      })
    })
    const proxyLines = await file.readTxtAsync("proxies.txt", "./configs")
    
    for ({email, token} of accounts) {
      const proxyIndex = Math.floor(Math.random() * proxyLines.length)
      const proxy = `http://${proxyLines[proxyIndex]}`
      const user1 = new Auth(process.env.APP_ID, proxy);
      user1.getPointAsync(email, token).then((userPoints) => {
        let line = ""
        if(!userPoints?.status !== 200) {
          console.error(`Report::${userPoints?.email}::Fail!`);
          line = [userPoints.email, 0,0,0,0,0,0,0,0,0,0].join(",")
        }else {
          // email,commission,points,registerpoints,signinpoints,twitter_x_id_points,discordid_points,telegramid_points,bonus_points,epoch01,totalPoints
          line = [userPoints.email,Object.values(userPoints.points), userPoints.totalPoints].join(",")
        }
        file.writeTxtAsync(line, "accounts_stats.txt", "./data")
      })
    }

    console.log("Report:: Success!")
  } catch (error) {
    console.error("Report:: error!");
    console.error("Report:: ", error.message)
  }

}

async function run() {
  console.log("run app!")
  report()
}

run()