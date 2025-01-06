const API_URL = require("../apis");
const ByPassCaptcha = require("./byPassCaptcha");

class Auth {
	constructor(appId) {
		this.appId = appId;
	}

	async loginAsync(username, password) {
		try {
			const bypassCaptcha = new ByPassCaptcha(this.appId);
			await bypassCaptcha.start();

			const res = await fetch(
				API_URL.login.replace("{app_id}", this.appId),
				{
					method: "POST",
					headers: {
						"User-Agent":
							"Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36",
						"Content-Type": "application/json",
					},
					body: JSON.stringify({
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
					}),
				}
			);
			const data = await res.json();

			if (!data?.status) throw new Error("Could not login");

			return data.data;
		} catch (error) {
			console.error("loginAsync::", error.message);
		}
	}

	async registerAsync(email, username, password, referralCode = "") {
		try {
			const bypassCaptcha = new ByPassCaptcha(this.appId);
			await bypassCaptcha.start();

			const res = await fetch(
				API_URL.register.replace("{app_id}", this.appId),
				{
					method: "POST",
					headers: {
						"User-Agent":
							"Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36",
						"Content-Type": "application/json",
					},
					body: JSON.stringify({
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
					}),
				}
			);

			const data = await res.json();
			console.log("data: ", data);

			return data;
		} catch (error) {
			console.error("registerAsync::", error.message);
		}
	}
}

module.exports = Auth;
