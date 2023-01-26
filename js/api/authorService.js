class AuthorService {
	constructor() {
		this.url = 'https://localhost:7160/api/Author'; // подключаем адрес до контроллера на сервере смотрим в свагер
	}

	async getAll() {
		// метод контроллера
		let result = null;
		await axios
			.get(this.url + '/GetAll')
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
export default new AuthorService();
