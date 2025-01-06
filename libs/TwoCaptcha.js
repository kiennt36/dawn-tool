class TwoCaptcha {
	#BASE_URL = process.env.TWO_CAPTCHA_API_URL;
	taskId = null;

	constructor(proxy) {
		this.proxy = proxy;
	}

	getTaskId() {
		return this.taskId;
	}

	async solveCaptcha(base64) {
		try {
			const res = await fetch(this.#BASE_URL.concat("/createTask"), {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
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
				}),
				// proxy: this.proxy,
			});

			const data = await res.json();

			if (!data?.taskId) throw new Error("Couldn't find captcha");

			this.taskId = data.taskId;

			return await this.getCaptchaResultAsync();
		} catch (error) {
			console.error("Error solving captcha:", error);
		}
	}

	async getCaptchaResultAsync() {
		try {
			const res = await fetch(this.#BASE_URL.concat("/getTaskResult"), {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					clientKey: process.env.TWO_CAPTCHA_KEY,
					taskId: this.taskId,
				}),
				// proxy: this.proxy,
			});

			const data = await res.json();

			return data;
		} catch (error) {
			console.error("Error getting captcha result:", error);
		}
	}

	async getBalanceAsync() {
		try {
			const res = await fetch(this.#BASE_URL.concat("/getBalance"), {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					clientKey: process.env.TWO_CAPTCHA_KEY,
				}),
				// proxy: this.proxy,
			});

			const data = await res.json();

			return data;
		} catch (error) {
			console.error("Error getting balance:", error);
		}
	}
}

module.exports = TwoCaptcha;
