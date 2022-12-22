//импорт сервисов
import bookService from './api/bookService.js';
import reviewService from './api/reviewService.js';
$(function () {
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
	//переменная фильтров. Сюда указываем начальные значения фильтров.
	let filters = {
		bookTitle: '',
		authorName: '',
		publishedDateStart: null,
		publishedDateEnd: null,
		priceStart: null,
		priceEnd: null,
	};

	//airdate Picker включение и его свойства
	new AirDatepicker('#publishedDate', {
		range: true,
		multipleDatesSeparator: ' - ',
		onSelect: function ({ date, formattedDate, datepicker }) {
			//определяем начальную и конечную дату берем их как элементы массива. Так они лежат согласно документации air date picker
			filters.publishedDateStart = getdate(formattedDate[0]); //объект начальная дата равен нулевому элементу массива
			//filters.publishedDateEnd = date[1] ? date[1].toDateString() : null;    //объект конечная дата равна первому элементу массива
		},
	});

	//Функция правит один день ошибки air datepicker
	function getdate(date) {
		let data = date.split('.');
		return new Date(+data[2], data[1] - 1, +data[0]);
	}

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
		buttons: [{ name: 'refresh', text: '<i class="fa-solid fa-rotate"></i>', action: () => console.log('refresh') }],
		language: language,
		ajax: async (data, success, failure) => {
			filters.countOnPage = data.length; //входный данные фильтров
			filters.skipCount = data.start; //входный данные фильтров
			filters.bookTitle = $('#bookTitle').val(); //входный данные фильтров
			filters.authorName = $('#authorName').val(); //входный данные фильтров
			filter.priceStart = $('#priceStart').val(); //входный данные фильтров
			filter.priceEnd = $('#priceEnd').val(); //входный данные фильтров

			let result = await bookService.getAll(filters);
			console.log(result);
			success(result);
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
				data: 'title',
				render: (data, type, row) => {
					return `${data}
				<button type="button" data-id="${row.id}" class="btn btn-primary ms-2 btn-openReview">
					FeedBack
					<span class="badge bg-secondary">${row.avgStars} stars</span>
				</button>`;
				},
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

	//Таблица отображения просмотров
	let reviewTable = $('#reviewTable').DataTable({
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
		buttons: [{ name: 'refresh', text: '<i class="fa-solid fa-rotate"></i>', action: () => console.log('refresh') }],
		language: language,
		ajax: async (data, success, failure) => {
			let filter = {};
			filter.countOnPage = data.length;
			filter.bookId = $('#reviewBookId').val();
			filter.skipCount = data.start;
			let result = await reviewService.getAll(filter);
			success(result);
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
			{ data: 'userName' },
			{ data: 'comment' },
			{ data: 'numStars' },
		],
	});

	$(document).on('click', '.btn-openReview', function () {
		let id = $(this).data('id');
		$('#reviewBookId').val(id);
		reviewTable.ajax.reload();
		$('#reviewModal').modal('show');
		// reviewTable.columns.adjust(); "это может надо добавить чтобы развернуть таблицу документация DATA TABLE"
		// $.fn.dataTable.tables({ visible: true, api: true }).columns.adjust();
	});

	// добавляе применение установленных фильтров после нажатия кнопки применить фильтр
	$('#btnFilterApply').click(function () {
		books.ajax.reload();
	});
});
