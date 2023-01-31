//импорт сервисов
import bookService from '../api/bookService.js';
import reviewService from '../api/reviewService.js';
import authorService from '../api/authorService.js';
import categoryService from '../api/categoryService.js';
import Session from '../Session.js';

axios.defaults.headers.common['Authorization'] = 'Bearer ' + Session.token; // из сессии берем токен и устанавливаем заголовок для axios/ Сервер предоставить данные только если токен передан

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

	//airdate Picker включение и его свойства для модального окна редактирования
	new AirDatepicker('#editDate');

	//переменная фильтров. Сюда указываем начальные значения фильтров.
	let filters = {
		bookTitle: '',
		authorName: '',
		publishedDateStart: '',
		publishedDateEnd: '',
		priceStart: null,
		priceEnd: null,
		category: '',
		search: '',
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
		buttons: [{ name: 'refresh', text: '<i class="fa-solid fa-rotate"></i>', action: () => books.ajax.reload().draw(false) }],
		language: language,
		ajax: async (data, success, failure) => {
			// берем значение с поля ввода, если оно установлено то оставлеем его или устанавливаем null(если значение не установлено)
			filters.priceStart = $('#priceStart').val() || null;
			// берем значение с поля ввода, если оно установлено то оставлеем его или устанавливаем null(если значение не установлено)
			filters.priceEnd = $('#priceEnd').val() || null;

			filters.search = $('#searchQuerry').val();
			filters.category = $('#category').val();
			filters.countOnPage = data.length; //входный данные фильтров
			filters.skipCount = data.start; //входный данные фильтров
			filters.bookTitle = $('#bookTitle').val(); //входный данные фильтров
			filters.authorName = $('#authorName').val(); //входный данные фильтров
			if ($('#publishedDate').val() == '') {
				filters.publishedDateStart = null;
				filters.publishedDateEnd = null;
			}
			console.log(filters);
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
			{
				searchable: false,
				orderable: false,
				data: null,
				defaultContent: '',
				render: function (data, type, row, meta) {
					//рендер уникальное отображение html в ячейку
					return `<div class="d-flex"><button data-id="${row.id}" class=" delete btn btn-sm bg-danger me-2">delete</button> <button data-id="${row.id}" class="edit btn btn-sm bg-secondary" data-bs-toggle="modal" data-bs-target="#editModal">edit</button></div>`;
				},
			},
		],
	});

	$(document).on('click', '.delete', function () {
		// не доделано
		Swal.fire({
			title: 'Are you sure?',
			text: "You won't be able to revert this!",
			icon: 'warning',
			showCancelButton: true,
			confirmButtonColor: '#3085d6',
			cancelButtonColor: '#d33',
			confirmButtonText: 'Yes, delete it!',
		}).then((result) => {
			if (result.isConfirmed) {
				// удаление
				let bookId = $(this).data('id');
				bookService.remove(bookId).then(function () {
					books.ajax.reload(); // обновление
					Swal.fire('Deleted!', 'Your file has been deleted.', 'success');
				});
			}
		});
	});

	$(document).on('click', '.edit', async function () {
		// редактирование
		let bookId = $(this).data('id');
		let book = await bookService.get(bookId);
		$('#title').val(book.title);
		$('#description').val(book.description);
		$('#editDate').val(book.publishedOn);
		$('#imageUrl').val(book.imageUrl);
		$('#editPrice').val('₽' + book.price);
		$('#color').val(book.property.color);
		$('#bindingType').val(book.property.bindingType);
		$('#condition').val(book.property.condition);

		if ($('#editCategory').find("option[value='" + book.category + "']").length) {
			$('#editCategory').val(book.category).trigger('change');
		} else {
			// Create a DOM Option and pre-select by default
			var newOption = new Option(book.category, book.category, true, true);
			// Append it to the select
			$('#editCategory').append(newOption).trigger('change');
		}

		$('#id').val(bookId);

		let authors = book.authors.split(',');
		for (let author of authors) {
			if ($('#editAuthors').find("option[value='" + author + "']").length) {
				$('#editAuthors').val(author).trigger('change');
			} else {
				// Create a DOM Option and pre-select by default
				var newOption = new Option(author, author, true, true);
				// Append it to the select
				$('#editAuthors').append(newOption).trigger('change');
			}
		}
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
		if (categories == null) {
			return;
		}
		categories.forEach((x, y) => {
			$('#category').append(`<option>${x}</option>`);
		});
	}

	await initCategories();

	// добавляе применение установленных фильтров после нажатия кнопки применить фильтр
	$('#btnFilterApply').click(function () {
		books.ajax.reload();
	});
	$('#search').click(function () {
		books.ajax.reload();
	});

	$('#editCategory').select2({
		tags: true,
		width: '100%',
		placeholder: 'Select a state',
		allowClear: true,
		ajax: {
			transport: function (params, success, failure) {
				bookService.getCategories().then(function (result) {
					console.log(result);
					success({
						results: result.map((x) => {
							return { text: x, id: x };
						}),
					});
				});
			},
		},
		createTag: function (params) {
			var term = $.trim(params.term);

			if (term === '') {
				return null;
			}

			return {
				id: term,
				text: term,
			};
		},
		templateResult: (data) => data.text,
		templateSelection: (data) => data.text,
		dropdownParent: $('#editModal'),
	});

	$('#editAuthors').select2({
		tags: true,
		width: '100%',
		placeholder: 'Select a state',
		allowClear: true,
		ajax: {
			transport: function (params, success, failure) {
				authorService.getAll().then(function (result) {
					console.log(result);
					success({
						results: result.map((x) => {
							return { text: x.name, id: x.name };
						}),
					});
				});
			},
		},
		createTag: function (params) {
			var term = $.trim(params.term);

			if (term === '') {
				return null;
			}

			return {
				id: term,
				text: term,
			};
		},
		templateResult: (data) => data.text,
		templateSelection: (data) => data.text,
		dropdownParent: $('#editModal'),
	});

	let cleave = new Cleave('#editPrice', {
		numeral: true,
		numeralPositiveOnly: true,
		prefix: '₽',
		numeralThousandsGroupStyle: 'thousand',
	});

	$('#currencyChoise').change(function () {
		let value = $(this).val();
		console.log(cleave);
		switch (value) {
			case 'rub':
				cleave.destroy();
				cleave = new Cleave('#editPrice', {
					numeral: true,
					numeralPositiveOnly: true,
					prefix: '₽',
					numeralThousandsGroupStyle: 'thousand',
				});
				break;
			case 'usd':
				cleave.destroy();
				cleave = new Cleave('#editPrice', {
					numeral: true,
					numeralPositiveOnly: true,
					prefix: '$',
					numeralThousandsGroupStyle: 'thousand',
				});
				break;
			case 'eur':
				cleave.destroy();
				cleave = new Cleave('#editPrice', {
					numeral: true,
					numeralPositiveOnly: true,
					prefix: '€',
					numeralThousandsGroupStyle: 'thousand',
				});
				break;
		}
	});

	$('#saveBtn').click(async function () {
		let bookDto = $('#editForm').serializeJSON();
		bookDto.Property = $('#editProperty').serializeJSON();
		bookDto.Authors = $('#editAuthors').val().join(',');
		bookDto.Price = +bookDto.Price.substring(1).replace(',', ''); //+numerable
		console.log(bookDto);
		await bookService.update(bookDto);
		$('#editModal').modal('hide');
		books.ajax.reload();
	});

	const ctx = document.getElementById('myChart');
	categoryService.getCategoryChart().then(function (result) {
		let categories = result.map((x) => x.category);
		let counts = result.map((x) => x.count);
		new Chart(ctx, {
			type: 'bar',
			data: {
				labels: categories,
				datasets: [
					{
						label: 'книги по категориям',
						data: counts,
						borderWidth: 1,
						backgroundColor: ['rgba(255, 99, 132, 0.2)', 'rgba(255, 159, 64, 0.2)'],
						borderColor: ['rgb(255, 99, 132)', 'rgb(255, 159, 64)'],
					},
				],
			},
			options: {
				scales: {
					y: {
						beginAtZero: true,
					},
				},
			},
		});
	});

	const ctx2 = document.getElementById('myChart2');
	let chart2;
	bookService.GetBookOnDate(0).then(function (result) {
		if (result == null) {
			return;
		}
		let published = result.map((x) => x.published);
		let counts = result.map((x) => x.count);
		chart2 = new Chart(ctx2, {
			type: 'line',
			data: {
				labels: published,
				datasets: [
					{
						label: 'книги по ДАТАМ',
						data: counts,
						borderWidth: 1,
						backgroundColor: ['rgba(255, 99, 132, 0.2)'],
						borderColor: ['rgb(255, 99, 132)'],
					},
				],
			},
			options: {
				scales: {
					y: {
						beginAtZero: true,
					},
				},
				plugins: {
					zoom: {
						pan: {
							enabled: true,
							mode: 'xy',
							threshold: 5,
						},
						zoom: {
							wheel: {
								enabled: true,
							},
							pinch: {
								enabled: true,
							},
							mode: 'xy',
						},
					},
				},
			},
		});
	});

	$('#chartSelectRange').change(function () {
		let value = $(this).val();
		bookService.GetBookOnDate(+value).then(function (result) {
			let published = result.map((x) => x.published);
			let counts = result.map((x) => x.count);
			chart2.data.labels = published;
			chart2.data.datasets[0].data = counts;
			chart2.update();
		});
	});
	$('#chartFull').click(function () {
		$(this).parent().toggleClass('full');
	});

	$('#exit').click(function () {
		Session.logout();
	});

	$('#userName').text(Session.name);
	$('#userRole').text(Session.role);

	if (Session.role == 'Customer') {
		$('#loadBooks').addClass('d-none');
		// $('#colAction').addClass('d-none');
	}

	$('#columnHide').change(function () {
		// Get the column API object
		var column = books.column('11');
		// Toggle the visibility
		column.visible(!column.visible());
	});
});
