const fs = require("fs");
const fsPromise =require("fs").promises
const readline = require('readline');

class File {
	constructor() {}

	async writeJsonAsync(data, filename = "accounts.json", path = "./data") {
		try {
			await this.createDirectoryIfNotExists(path);

			const filePath = path.concat("/", filename);

			await fsPromise.writeFile(filePath, JSON.stringify(data, null, 2), "utf8");
			console.log("File has been written.");
		} catch (error) {
			console.error("Error writing file:", error);
		}
	}

	async writeTxtAsync(data, filename = "accounts_stats.txt", path = "./data") {
		try {
			const isDirExist = this.fileExistAsync(path)
			if(!isDirExist)
				await this.createDirectoryIfNotExists(path);
			const filePath = path.concat("/", filename);
			// const stream = fs.createWriteStream(filePath, { flags: 'a', encoding: 'utf8' });
			// stream.write(data + '\n');
			// stream.end();
			// console.log("123")
			await fsPromise.appendFile(filePath, data + '\n', 'utf8');
		} catch (error) {
			console.error("Error writing file:", error);
		}
	}

	async createDirectoryIfNotExists(dir) {
		try {
			await fsPromise.mkdir(dir, { recursive: true });
			console.log("Directory created:", dir);
		} catch (err) {
			if (err.code === "EEXIST") {
				console.log("Directory already exists:", dir);
			} else {
				console.error("Error creating directory:", err);
			}
		}
	}

	async readTxtAsync(filename = "accounts.txt", path = "./configs") {
		const data = []
		try {
			const filePath = path.concat("/", filename);
			const isFileExist = await this.fileExistAsync(filePath)

			if(!isFileExist) {
				console.error('File does not exist.')
				return;
			}

			const readInterface = readline.createInterface({
					input: fs.createReadStream(filePath),
					output: null,
					console: false,
			});
		
			for await (const line of readInterface) {
        data.push(line); // Lưu từng dòng vào mảng
    }

		
			readInterface.on('close', () => {
					console.log('File reading completed.');
			});

			
			return data;

		} catch (error) {
			console.error('Error reading file:', error.message);
		}
	}

	async fileExistAsync(dir) {
		try {
			await fsPromise.access(dir); // Kiểm tra file có tồn tại
			return true;
		} catch {
				return false;
		}
	}
}

module.exports = File;
