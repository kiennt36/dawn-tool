const API_URL = {
	getPuzzle:
		"https://www.aeropres.in/chromeapi/dawn/v1/puzzle/get-puzzle?appid={app_id}",
	getPuzzleImage:
		"https://www.aeropres.in/chromeapi/dawn/v1/puzzle/get-puzzle-image?puzzle_id={puzzle_id}&appid={app_id}",
	login: "https://www.aeropres.in/chromeapi/dawn/v1/user/login/v2?appid={app_id}",
	register:
		"https://www.aeropres.in/chromeapi/dawn/v1/puzzle/validate-register?appid={app_id}",
	reverify: "https://www.aeropres.in/chromeapi/dawn/v1/user/resendverifylink/v2?appid={app_id}",
	getPoint: "https://www.aeropres.in/api/atom/v1/userreferral/getpoint?appid={app_id}"
};

module.exports = API_URL;
