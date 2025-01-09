const { HttpsProxyAgent } = require("https-proxy-agent");
const API_URL = require("../apis");
const TwoCaptcha = require("../libs/TwoCaptcha");
const axios = require('axios')

class ByPassCaptcha {
  puzzleId = null;
  puzzleImage = null;
  answer = null;

  constructor(appId, proxy) {
    this.appId = appId;
		this.proxy = proxy;
    this.agent = new HttpsProxyAgent(proxy);
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
      const res = await axios.get(
        API_URL.getPuzzle.replace("{app_id}", this.appId),
        {
          headers: {
            "User-Agent":
              "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36",
            "Content-Type": "application/json",
            Accept:
              "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8",
          },
					httpAgent: this.agent,
					httpsAgent: this.agent,
        }
      );

      if (!res.data?.success) throw new Error("Could not get puzzle id");

      this.puzzleId = res.data.puzzle_id;
    } catch (error) {
      console.error("getPuzzleAsync::", error);
    }
  }

  async #getPuzzleImageAsync() {
    try {
      const res = await axios.get(
        API_URL.getPuzzleImage
          .replace("{puzzle_id}", this.puzzleId)
          .replace("{app_id}", this.appId),
        {
          headers: {
            "User-Agent":
              "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36",
            "Content-Type": "application/json",
						Accept:
              "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8",
          },
          httpAgent: this.agent,
					httpsAgent: this.agent,
        }
      );

      if (!res.data?.success) throw new Error("Could not get puzzle image");

      this.puzzleImage = res.data.imgBase64;
    } catch (error) {
      console.error("getPuzzleImageAsync::", error.message);
    }
  }

  async #solveCaptchaAsync() {
    try {
      let isReady = false;

      const twoCaptcha = new TwoCaptcha(this.proxy);
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
