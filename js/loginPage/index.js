import accountService from '../api/accountService.js';
$(function () {
	$('#loginButton').click(async function () {
		let userDto = $('#LoginForm').serializeJSON();
		let token = await accountService.login(userDto);

		if (token != null) {
			window.location.href = 'http://127.0.0.1:5500/pages/tablePage/index.html'; //меняем путь после входа
		}
	});

	$('#registrationBtn').click(async function () {
		let userDto = $('#RegitrationForm').serializeJSON();
		userDto.Role=+userDto.Role;
		let token = await accountService.registration(userDto);
		if (token != null) {
			window.location.href = 'http://127.0.0.1:5500/pages/tablePage/index.html'; //меняем путь после входа
		}
	});
});
