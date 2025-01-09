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
}

module.exports = Auth;
