class AuthorService {
	constructor() {
		this.url = 'https://localhost:7160/api/Author';
	}

	async getAll() {
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
