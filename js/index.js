//импорт сервисов
import bookService from './api/bookService.js';
import reviewService from './api/reviewService.js';
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

	//airdate Picker включение и его свойства
	new AirDatepicker('#publishedDate', {
		range: true,
		multipleDatesSeparator: ' - ',
		onSelect: function ({ date, formattedDate, datepicker }) {
			//определяем начальную и конечную дату берем их как элементы массива. Так они лежат согласно документации air date picker
			filters.publishedDateStart = formattedDate[0]; //объект начальная дата равен нулевому элементу массива
			filters.publishedDateEnd = formattedDate[1] ? formattedDate[1] : null; //объект конечная дата равна первому элементу массива
		},
	});

	//переменная фильтров. Сюда указываем начальные значения фильтров.
	let filters = {
		bookTitle: '',
		authorName: '',
		publishedDateStart: '',
		publishedDateEnd: '',
		priceStart: null,
		priceEnd: null,
		category: '',
	};

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
			let priceStart = $('#priceStart').val(); //входный данные фильтров
			let priceEnd = $('#priceEnd').val(); //входный данные фильтров
			if (priceStart) {
				// если пустое условие тогда проверяет он не нулл, он есть и заполнен
				filters.priceStart = priceStart;
			}
			if (priceEnd) {
				// если пустое условие тогда проверяет он не нулл, он есть и заполнен
				filters.priceEnd = priceEnd;
			}
			filters.category = $('#category').val();
			filters.countOnPage = data.length; //входный данные фильтров
			filters.skipCount = data.start; //входный данные фильтров
			filters.bookTitle = $('#bookTitle').val(); //входный данные фильтров
			filters.authorName = $('#authorName').val(); //входный данные фильтров
			let result = await bookService.getAll(filters);
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

	//обработка клика открытия таблицы просмотров в книге
	$(document).on('click', '.btn-openReview', function () {
		let id = $(this).data('id');
		$('#reviewBookId').val(id);
		reviewTable.ajax.reload();
		$('#reviewModal').modal('show');
		// reviewTable.columns.adjust(); "это может надо добавить чтобы развернуть таблицу документация DATA TABLE"
		// $.fn.dataTable.tables({ visible: true, api: true }).columns.adjust();
	});

	// функция чтения названий категорий в выпадающий список
	async function initCategories() {
		let categories = await bookService.getCategories();
		categories.forEach((x, y) => {
			$('#category').append(`<option>${x}</option>`);
		});
	}

	await initCategories();

	// добавляе применение установленных фильтров после нажатия кнопки применить фильтр
	$('#btnFilterApply').click(function () {
		books.ajax.reload();
	});
});
