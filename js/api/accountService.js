
class AccountService {
	constructor() {
		this.url = 'https://localhost:7160/api/Account';
	}

	async login(input) {
		let result = null;
		await axios
			.post(this.url + '/Login', input)
			.then(function (response) {
				result = response.data;
				console.log(response);
			})
			.catch(function (error) {
				console.log(error);
			});
		return result;
	}

	async registration(input) {
		let result = null;
		await axios
			.post(this.url + '/Registration', input)
			.then(function (response) {
				result = response.data;
				console.log(response);
			})
			.catch(function (error) {
				console.log(error);
			});
		return result;
	}
}
export default new AccountService();
