import accountService from '../api/accountService.js';
$(function () {
	$('#loginButton').click(async function () {
		let userDto = $('#LoginForm').serializeJSON();
		let token = await accountService.login(userDto);

		if (token != null) {
			location.href = '/pages/tablePage/index.html'; //меняем путь после входа
		}
	});

	$('#registrationBtn').click(async function () {
		let userDto = $('#RegitrationForm').serializeJSON();
		userDto.Role = +userDto.Role;
		let token = await accountService.registration(userDto);
		if (token != null) {
			location.href = '/pages/tablePage/index.html'; //меняем путь после входа
		}
	});
});
