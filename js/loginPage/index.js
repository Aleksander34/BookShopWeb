import accountService from '../api/accountService.js';
import Session from '../Session.js';
Session.checkAutentificate();
$(function () {
	$('#loginButton').click(async function () {
		//событие срабатывающее при нажатии на кнопку войти
		let userDto = $('#LoginForm').serializeJSON(); // форму превращаем в ДТО. Библиотека JquerrySerializer
		let accountInfo = await accountService.login(userDto);

		if (accountInfo != null) {
			Session.isRemember = $('#isRemember').val();
			location.href = '/pages/tablePage/index.html'; //меняем путь после входа
		}
	});

	$('#registrationBtn').click(async function () {
		//событие клика по регистрации
		let userDto = $('#RegitrationForm').serializeJSON();
		userDto.Role = +userDto.Role; //роль на сервере в енум и передаем на сервер в виде числа чтобы сервер сопоставил с енум
		let accountInfo = await accountService.registration(userDto);
		if (accountInfo != null) {
			location.href = '/pages/tablePage/index.html'; //меняем путь после входа
		}
	});
});
