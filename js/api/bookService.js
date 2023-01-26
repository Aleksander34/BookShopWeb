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
		let formData = new FormData(); // формат дата мы отправляем файлы иксель
		formData.append('input', file);

		const config = {
			//заголовок форм даты
			headers: {
				'Content-Type': 'multipart/form-data',
			},
		};

		let result = null;
		await axios
			.post(this.url + '/AddBooks', formData, config) // конфиг засовываем сюда
			.then(function (response) {
				result = response.data;
				console.log(result);
			})
			.catch(function (error) {
				console.log(error);
			});
		return result;
	}

	async previewBooks(file) {
		let formData = new FormData();
		formData.append('input', file);

		const config = {
			headers: {
				'Content-Type': 'multipart/form-data',
			},
		};

		let result = null;
		await axios
			.post(this.url + '/PreviewBooks', formData, config)
			.then(function (response) {
				result = response.data;
				console.log(result);
			})
			.catch(function (error) {
				console.log(error);
			});
		return result;
	}

	async remove(id) {
		console.log(id);
		await axios
			.post(this.url + '/Remove?id=' + id)
			.then(function (response) {
				result = response;
				console.log(result);
			})
			.catch(function (error) {
				console.log(error);
			});
	}

	async update(input) {
		await axios
			.post(this.url + '/Update', input)
			.then(function (response) {
				result = response;
				console.log(result);
			})
			.catch(function (error) {
				console.log(error);
			});
	}

	async get(id) {
		console.log(id);
		let result = null;
		await axios
			.get(this.url + '/Get?id=' + id)
			.then(function (response) {
				result = response.data;
				console.log(result);
			})
			.catch(function (error) {
				console.log(error);
			});
		return result;
	}

	async GetBookOnDate(input) {
		let result = null;
		await axios
			.get(this.url + '/GetBookOnDate?input=' + input) // если гет запрос и у контроллера есть входной параметр то пишем /GetBookOnDate?input=' + input
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
export default new BookService(); // экспорт для подключения в других файлах
