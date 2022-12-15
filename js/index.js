import bookService from "./api/bookService.js";
$(function () {
	let t = $('#loadTable').DataTable({
		processing: true,
		serverSide: true,
		paging: true,
		ajax: 
			 async (data, success, failure) => {

					let filter = {};
					filter.countOnPage = data.length;
					filter.skipCount = data.start;
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
				data: "id",
			},
			{ data: 'title' },
			{ data: 'description' },
			{ data: 'publishedOn' },
			{ data: 'category' },
			{ data: 'imageUrl' },
			{ data: 'price' },
		],
	});

	t.on('order.dt search.dt', function () {
		let i = 1;

		t.cells(null, 0, { search: 'applied', order: 'applied' }).every(function (cell) {
			this.data(i++);
		});
	}).draw();
});
