//импорт сервисов
import bookService from '../api/bookService.js';
import reviewService from '../api/reviewService.js';
$(async function () {
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

	//Таблица отображения загрузки книг
	// let books = $('#loadTable').DataTable({
	// 	processing: true,
	// 	serverSide: true,
	// 	paging: true,
	// 	ordering: false,
	// 	searching: false,
	// 	dom: [
	// 		"<'row'<'col-md-12'f>>",
	// 		"<'row'<'col-md-12't>>",
	// 		"<'row mt-2'",
	// 		"<'col-lg-1 col-xs-12'<'float-left text-center data-tables-refresh'B>>",
	// 		"<'col-lg-3 col-xs-12'<'float-left text-center'i>>",
	// 		"<'col-lg-3 col-xs-12'<'text-center'l>>",
	// 		"<'col-lg-5 col-xs-12'<'float-right'p>>",
	// 		'>',
	// 	].join(''),
	// 	buttons: [{ name: 'refresh', text: '<i class="fa-solid fa-rotate"></i>', action: () => console.log('refresh') }],
	// 	language: language,
	// 	ajax: async (data, success, failure) => {},
	// 	columns: [
	// 		{
	// 			searchable: false,
	// 			orderable: false,
	// 			targets: 0,
	// 			data: null,
	// 			render: function (data, type, row, meta) {
	// 				return meta.row + meta.settings._iDisplayStart + 1;
	// 			},
	// 		},
	// 		{
	// 			data: 'title',
	// 			render: (data, type, row) => {
	// 				return `${data}
	// 			<button type="button" data-id="${row.id}" class="btn btn-primary ms-2 btn-openReview">
	// 				FeedBack
	// 				<span class="badge bg-secondary">${row.avgStars} stars</span>
	// 			</button>`;
	// 			},
	// 		},
	// 		{ data: 'description' },
	// 		{ data: 'publishedOn' },
	// 		{ data: 'category' },
	// 		{ data: 'imageUrl' },
	// 		{ data: 'authors' },
	// 		{ data: 'price' },
	// 		{ data: 'property.color' },
	// 		{ data: 'property.bindingType' },
	// 		{ data: 'property.condition' },
	// 	],
	// });

	let file = null;
	$('#file').change(async function () {
		if ($(this).get(0).files.length > 0) {
			let fileName = $(this).get(0).files[0].name;
			if (!fileName.match(/.*\.(xlsx|xls|xlsb)/)) {
				// toastr['warning']('Допустимые форматы: .xlsx .xls .xlsb', 'Не верный формат файла');
				// $('#requestPreviewInfo').addClass('d-none');
				return;
			}
			file = $(this).get(0).files[0];
		}
	});
	$('#load').click(async function () {
		await bookService.addBooks(file);
	});
});
