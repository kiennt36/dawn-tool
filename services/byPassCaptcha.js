const API_URL = require("../apis");
const TwoCaptcha = require("../libs/TwoCaptcha");

class ByPassCaptcha {
	puzzleId = null;
	puzzleImage = null;
	answer = null;

	constructor(appId) {
		this.appId = appId;
	}

	getPuzzleId() {
		return this.puzzleId;
	}

	getPuzzleImage() {
		return this.puzzleImage;
	}

	getAnswer() {
		return this.answer;
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
			let isReady = false;

			const twoCaptcha = new TwoCaptcha();
			const balance = await twoCaptcha.getBalanceAsync();
			console.log("balance: ", balance);
			const solved = await twoCaptcha.solveCaptcha(this.puzzleImage);

			console.log(solved.status);

			while (!isReady) {
				const result = await twoCaptcha.getCaptchaResultAsync();

				if (result?.errorId === 0 && result?.status === "ready") {
					this.answer = result.solution.text;
					console.log("answer: ", this.answer);
					isReady = true;
				}
			}
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
