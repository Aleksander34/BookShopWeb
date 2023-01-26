//импорт сервисов
import bookService from '../api/bookService.js';
import reviewService from '../api/reviewService.js';
import Session from '../Session.js';
$(async function () {
	Session.Init();
	//Локализация таблицы
	let language = {
		emptyTable: 'нет данных',
		info: 'показано c: _START_ по: _END_ из: _TOTAL_',
		infoEmpty: 'нет данных',
		lengthMenu: 'элементов _MENU_ на странице',
		paginate: {
			first: 'первая страница',
			last: 'последняя страница',
			next: '>>',
			previous: '<<',
		},
	};

	let file = null; // переменная файла который загружают

	$('#file').change(async function () {
		// событие которое происходит при загрузке файла.
		if ($(this).get(0).files.length > 0) {
			// проверяем что был выбран файл
			let fileName = $(this).get(0).files[0].name;
			if (!fileName.match(/.*\.(xlsx|xls|xlsb)/)) {
				// проверяем нужный формат у файла
				// toastr['warning']('Допустимые форматы: .xlsx .xls .xlsb', 'Не верный формат файла');
				// $('#requestPreviewInfo').addClass('d-none');
				return;
			}
			file = $(this).get(0).files[0]; // в переменную кладем выбранный файл
			books.ajax.reload().draw(false); // обновляем таблицу книг
		}
	});

	$('#load').click(async function () {
		// срабатывает при нажатии на кнопку загрузить файл
		await bookService.addBooks(file);
	});

	//Таблица отображения загрузки книг
	let books = $('#loadTable').DataTable({
		processing: true,
		serverSide: true,
		paging: true,
		ordering: false,
		searching: false,
		dom: [
			"<'row'<'col-md-12'f>>",
			"<'row'<'col-md-12't>>",
			"<'row mt-2'",
			"<'col-lg-1 col-xs-12'<'float-left text-center data-tables-refresh'B>>",
			"<'col-lg-3 col-xs-12'<'float-left text-center'i>>",
			"<'col-lg-3 col-xs-12'<'text-center'l>>",
			"<'col-lg-5 col-xs-12'<'float-right'p>>",
			'>',
		].join(''),
		buttons: [{ name: 'refresh', text: '<i class="fa-solid fa-rotate"></i>', action: () => books.ajax.reload().draw(false) }], // дополнительные кнопки обновления ,  обновляем таблицу книг
		language: language,
		ajax: async (data, success, failure) => {
			//получение данных с сервера
			let result = await bookService.previewBooks(file); //данные файла берем с сервера на основе файла
			success(result); // отдаем ДТО таблицы. Таблица получив ДТО, понимает в какие колонки их засунуть см код на 74-85 строке
		},
		columns: [
			{
				searchable: false,
				orderable: false,
				targets: 0,
				data: null,
				render: function (data, type, row, meta) {
					return meta.row + meta.settings._iDisplayStart + 1;
				},
			},
			{
				data: 'title', // тащим данные с сервера в таблицу в "поля ДТО"
			},
			{ data: 'description' },
			{ data: 'publishedOn' },
			{ data: 'category' },
			{ data: 'imageUrl' },
			{ data: 'authors' },
			{ data: 'price' },
			{ data: 'property.color' },
			{ data: 'property.bindingType' },
			{ data: 'property.condition' },
		],
	});
});
