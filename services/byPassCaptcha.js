const API_URL = require("../apis");
const TwoCaptcha = require("../libs/TwoCaptcha");

class ByPassCaptcha {
	puzzleId = null;
	puzzleImage = null;

	constructor(appId) {
		this.appId = appId;
	}

	getPuzzleId() {
		return this.puzzleId;
	}

	getPuzzleImage() {
		return this.puzzleImage;
	}

	async #getPuzzleAsync() {
		try {
			const res = await fetch(
				API_URL.getPuzzle.replace("{app_id}", this.appId),
				{
					method: "GET",
					headers: {
						"User-Agent":
							"Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36",
						"Content-Type": "application/json",
					},
				}
			);
			const data = await res.json();

			if (!data?.success) throw new Error("Could not get puzzle id");

			this.puzzleId = data.puzzle_id;
		} catch (error) {
			console.error("getPuzzleAsync::", error.message);
		}
	}

	async #getPuzzleImageAsync() {
		try {
			const res = await fetch(
				API_URL.getPuzzleImage
					.replace("{puzzle_id}", this.puzzleId)
					.replace("{app_id}", this.appId),
				{
					method: "GET",
					headers: {
						"User-Agent":
							"Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36",
						"Content-Type": "application/json",
					},
				}
			);
			const data = await res.json();

			if (!data?.success) throw new Error("Could not get puzzle image");

			this.puzzleImage = data.imgBase64;
		} catch (error) {
			console.error("getPuzzleImageAsync::", error.message);
		}
	}

	async #solveCaptchaAsync() {
		try {
			const twoCaptcha = new TwoCaptcha();
			await twoCaptcha.solveCaptcha(this.puzzleImage);
		} catch (error) {
			console.error("solveCaptchaAsync::", error.message);
		}
	}

	async start() {
		console.info("Captcha bypass started!");
		await this.#getPuzzleAsync();
		await this.#getPuzzleImageAsync();
		await this.#solveCaptchaAsync();
		console.info("Captcha bypass completed!");
	}
}

module.exports = ByPassCaptcha;
