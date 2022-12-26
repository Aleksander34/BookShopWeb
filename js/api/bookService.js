class BookService {
	constructor() {
		this.url = 'https://localhost:7160/api/Book';
	}

	async getAll(input) {
		let result = null;
		await axios
			.post(this.url + '/GetAll', input)
			.then(function (response) {
				result = response.data;
				console.log(response);
			})
			.catch(function (error) {
				console.log(error);
			});
		return result;
	}

	async getCategories() {
		// метод GetCategories на сервере выбирает категории книг(distinсt отсеивает повторяющиеся значения)
		let result = null;
		await axios
			.get(this.url + '/GetCategories')
			.then(function (response) {
				result = response.data;
				console.log(response);
			})
			.catch(function (error) {
				console.log(error);
			});
		return result;
	}

	async addBooks(file) {
		let formData = new FormData();
		formData.append('input', file);

		const config = {
			headers: {
				'Content-Type': 'multipart/form-data',
			},
		};

		let result = null;
		await axios
			.post(this.url + '/AddBooks', formData, config)
			.then(function (response) {
				result = response.data;
				console.log(result);
			})
			.catch(function (error) {
				console.log(error);
			});
		return result;
	}
}
export default new BookService();
