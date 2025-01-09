const axios = require('axios')
const { HttpsProxyAgent } = require("https-proxy-agent");

class TwoCaptcha {
	#BASE_URL = process.env.TWO_CAPTCHA_API_URL;
	taskId = null;

	constructor(proxy) {
		this.agent = new HttpsProxyAgent(proxy);
	}

	getTaskId() {
		return this.taskId;
	}

	async solveCaptcha(base64) {
		try {
			const res = await axios.post(this.#BASE_URL.concat("/createTask"), {
				clientKey: process.env.TWO_CAPTCHA_KEY,
				softId: 4706,
				task: {
					type: "ImageToTextTask",
					body: base64,
					phrase: false,
					case: true,
					numeric: 4,
					math: false,
					minLength: 6,
					maxLength: 6,
					comment: "enter the text you see on the image",
				},
			}, {
				headers: {
					"Content-Type": "application/json",
				},
				httpAgent: this.agent,
				httpsAgent: this.agent
			});

			if (!res.data?.taskId) throw new Error("Couldn't find captcha");

			this.taskId = res.data.taskId;

			return await this.getCaptchaResultAsync();
		} catch (error) {
			console.error("Error solving captcha:", error);
		}
	}

	async getCaptchaResultAsync() {
		try {
			const res = await axios.post(this.#BASE_URL.concat("/getTaskResult"),{
				clientKey: process.env.TWO_CAPTCHA_KEY,
				taskId: this.taskId,
			}, {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				httpAgent: this.agent,
				httpsAgent: this.agent
			});

			return res.data;
		} catch (error) {
			console.error("Error getting captcha result:", error);
		}
	}

	async getBalanceAsync() {
		try {
			const twoCaptchaKey = process.env.TWO_CAPTCHA_KEY
			const res = await axios.post(this.#BASE_URL.concat("/getBalance"),{
				clientKey: twoCaptchaKey,
			}, {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				httpAgent: this.agent,
				httpsAgent: this.agent
			});

			return res.data;
		} catch (error) {
			console.error("Error getting balance:", error);
		}
	}
}

module.exports = TwoCaptcha;
