class TwoCaptcha {
	#BASE_URL = "https://api.2captcha.com";

	constructor(proxy) {
		this.proxy = proxy;
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

			const data = await res.text();
			console.log("data: ", data);

			return;

			if (!data?.taskId) throw new Error("Couldn't find captcha");

			this.#getCaptchaResultAsync(data.taskId);
		} catch (error) {
			console.error("Error solving captcha:", error);
		}
	}

	async #getCaptchaResultAsync(taskId) {
		try {
			const res = await fetch(this.#BASE_URL.concat("/getTaskResult"), {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					clientKey: process.env.TWO_CAPTCHA_KEY,
					taskid: taskId,
				}),
				// proxy: this.proxy,
			});

			const data = await res.json();
			console.log("getCaptchaResultAsync: ", data);

			return data;
		} catch (error) {
			console.error("Error getting captcha result:", error);
		}
	}
}

module.exports = TwoCaptcha;
