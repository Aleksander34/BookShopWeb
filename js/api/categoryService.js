class CategoryService {
	constructor() {
		this.url = 'https://localhost:7160/api/Category';
	}

	async getCategoryChart() {
		let result = null;
		await axios
			.get(this.url + '/GetCategoryChart')
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
export default new CategoryService();
