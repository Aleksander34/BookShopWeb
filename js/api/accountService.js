import Session from '../Session.js'; //импорт session.js
class AccountService {
	constructor() {
		this.url = 'https://localhost:7160/api/Account'; // указывает на путь до контроллера с сервера
	}

	async login(input) {
		// методы контроллера
		let result = null;
		await axios
			.post(this.url + '/Login', input)
			.then(function (response) {
				result = response.data;
				console.log(response);
				Session.name = result.name;
				Session.token = result.token;
				Session.role = result.role;
			})
			.catch(function (error) {
				console.log(error);
			});
		return result;
	}

	async registration(input) {
		// методы контроллера
		let result = null;
		await axios
			.post(this.url + '/Registration', input)
			.then(function (response) {
				result = response.data;
				Session.name = result.name;
				Session.token = result.token;
				Session.role = result.role;
				console.log(response);
			})
			.catch(function (error) {
				console.log(error);
			});
		return result;
	}
}
export default new AccountService(); // отдаем объект данного сервиса чтобы можно с ним работать в других файлах
