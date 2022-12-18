class ReviewService {
	constructor() {
		this.url = 'https://localhost:7160/api/Review';
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
}
export default new ReviewService();