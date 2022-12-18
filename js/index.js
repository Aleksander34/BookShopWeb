import bookService from "./api/bookService.js";
import reviewService from "./api/reviewService.js";
$(function () {
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
	$('#loadTable').DataTable({
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
		ajax: 
			 async (data, success, failure) => {

					let filter = {};
					filter.countOnPage = data.length;
					filter.skipCount = data.start;
					filter.bookTitle = $("#bookTitle").val();
					console.log(data);
					let result = await bookService.getAll(filter);
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
			} 
			},
			{ data: 'title', 
			render: (data, type, row)=>{
				return`${data}
				<button type="button" data-id="${row.id}" class="btn btn-primary ms-2 btn-openReview">
					FeedBack
					<span class="badge bg-secondary">${row.avgStars} stars</span>
				</button>`
			} },
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
		ajax: 
			 async (data, success, failure) => {

					let filter = {};
					filter.countOnPage = data.length;
					filter.bookId=$("#reviewBookId").val();
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
			} 
			},
			{ data: 'name' },
			{ data: 'comment' },
			{ data: 'numStars' },
		],
	});

	$(document).on("click",".btn-openReview", function(){
		let id=$(this).data("id")
		$("#reviewBookId").val(id);
		reviewTable.ajax.reload();
		$("#reviewModal").modal("show")
		// reviewTable.columns.adjust();
		// $.fn.dataTable.tables({ visible: true, api: true }).columns.adjust();  
	})
	
});
