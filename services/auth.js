const API_URL = require("../apis");
const ByPassCaptcha = require("./byPassCaptcha");
const { HttpsProxyAgent } = require("https-proxy-agent");
const axios = require('axios')

class Auth {
  constructor(appId, proxy) {
    this.appId = appId;
		this.proxy = proxy;
    this.agent = new HttpsProxyAgent(proxy);
  }

  async loginAsync(username, password) {
    try {
      const bypassCaptcha = new ByPassCaptcha(
        this.appId,
        this.proxy
      );
      await bypassCaptcha.start();

      const res = await axios.post(API_URL.login.replace("{app_id}", this.appId),
			{
				username: username,
				password: password,
				logindata: {
					_v: {
						version: "1.1.2",
						datetime: new Date().toDateString(),
					},
				},
				puzzle_id: bypassCaptcha.getPuzzleId(),
				ans: bypassCaptcha.getAnswer(),
			},
			{
        headers: {
          "User-Agent":
            "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36",
          "Content-Type": "application/json",
        },
				httpAgent: this.agent,
				httpsAgent: this.agent,
      });

			console.log("res::", res.data)

      if (!res.data?.status) throw new Error("Could not login");

      return res.data.data;
    } catch (error) {
      console.error("loginAsync::", error.message);
    }
  }

  async registerAsync(email, username, password, referralCode = "") {
    try {
      const bypassCaptcha = new ByPassCaptcha(this.appId);
      await bypassCaptcha.start();

      const res = await axios.post(
        API_URL.register.replace("{app_id}", this.appId),
				{
					ans: bypassCaptcha.getAnswer(),
					browserName: "Chrome",
					country: "+91",
					email: email,
					firstname: username,
					ismarketing: true,
					lastname: username,
					mobile: "",
					password: password,
					puzzle_id: bypassCaptcha.getPuzzleId(),
					referralCode: referralCode,
				},
        {
          headers: {
            "User-Agent":
              "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36",
            "Content-Type": "application/json",
          },
					httpAgent: this.agent,
					httpsAgent: this.agent,
        }
      );

      return res.data;
    } catch (error) {
      console.error("registerAsync::", error.message);
    }
  }

  async getPointAsync(email, token) {
    console.log(`Account::${email}::${this.proxy}::Start get point...`)
    try {
      const res = await axios.get(API_URL.getPoint.replace("{app_id}", this.appId), {
        headers: {
          "Authorization": "Berear".concat(" ", token),
          "User-Agent":
              "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36",
            "Content-Type": "application/json",
        },
        httpAgent: this.agent,
				httpsAgent: this.agent,
        timeout: 30000
      })

      if(!res.data?.data) {
        console.error(`Account::${email}::Get point fail!`)
        console.error(res.data)
        return;
      }

      const points = {
        commission: res.data?.data?.referralPoint?.commission ?? 0,
        points: res.data?.data?.rewardPoint?.points ?? 0,
        registerpoints: res.data?.data?.rewardPoint?.registerpoints ?? 0,
        signinpoints: res.data?.data?.rewardPoint?.signinpoints ?? 0,
        twitter_x_id_points: res.data?.data?.rewardPoint?.twitter_x_id_points ?? 0,
        discordid_points: res.data?.data?.rewardPoint?.discordid_points ?? 0,
        telegramid_points: res.data?.data?.rewardPoint?.telegramid_points ?? 0,
        bonus_points: res.data?.data?.rewardPoint?.bonus_points ?? 0,
        epoch01: res.data?.data?.rewardPoint?.epoch01 ?? 0,
      }

      const totalPoints = Object.values(points).reduce((total, currentPoint) => {
        return total += currentPoint
      }, 0)

      console.log(`Account::${email}::get point success!`)
      return {
        status: 200,
        email: res.data?.data?.rewardPoint?.userId ?? email,
        points,
        totalPoints
      }
    } catch (error) {
      console.error(`Account::${email}::Get point error!`)
      console.error("getPointAsync::", error?.response?.status);
      return {
        status: error?.response?.status,
        email: email,
        points: null,
        totalPoints: null
      }
    }
  }
}

module.exports = Auth;
