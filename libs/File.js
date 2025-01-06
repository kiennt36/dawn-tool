const fs = require("fs").promises;

class File {
	constructor() {}

	async writeAsync(data, filename = "accounts.json", path = "./data") {
		try {
			await this.createDirectoryIfNotExists(path);

			const filePath = path.concat("/", filename);

			await fs.writeFile(filePath, JSON.stringify(data, null, 2), "utf8");
			console.log("File has been written.");
		} catch (error) {
			console.error("Error writing file:", error);
		}
	}

	async createDirectoryIfNotExists(dir) {
		try {
			await fs.mkdir(dir, { recursive: true });
			console.log("Directory created:", dir);
		} catch (err) {
			if (err.code === "EEXIST") {
				console.log("Directory already exists:", dir);
			} else {
				console.error("Error creating directory:", err);
			}
		}
	}
}

module.exports = File;
