const EXPIRES = 8;
class Session {
	#name;
	#token;
	#role;
	constructor() {
		this.#name = $.cookie('name');
		this.#role = $.cookie('role');
		this.#token = $.cookie('token');
	}

	set name(name) {
		this.#name = name;
		$.cookie('name', name, { expires: EXPIRES, path: '/' });
	}

	set role(role) {
		this.#role = role;
		$.cookie('role', role, { expires: EXPIRES, path: '/' });
	}

	set token(token) {
		this.#token = token;
		$.cookie('token', token, { expires: EXPIRES, path: '/' });
	}

	get token() {
		return this.#token;
	}
	get name() {
		return this.#name;
	}
	get role() {
		return this.#role;
	}

	logout() {
		this.#name = undefined;
		this.#role = undefined;
		this.#token = undefined;
		$.removeCookie('name');
		$.removeCookie('role');
		$.removeCookie('token');
		axios.defaults.headers.common['Authorization'] = '';
		location.href = '/pages/loginPage/index.html';
	}

	Init() {
		if (this.token != undefined) {
			axios.defaults.headers.common['Authorization'] = 'Bearer ' + this.token;
		} else {
			location.href = '/pages/loginPage/index.html';
		}
	}
}

export default new Session();
