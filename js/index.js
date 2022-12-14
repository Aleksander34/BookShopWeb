$(function () {
	let t = $('#loadTable').DataTable({
		processing: true,
		serverSide: true,
		ajax: {
			url: 'https://localhost:7160/api/Book/GetAll',
			type: 'GET',
		},
		columns: [
			{
				searchable: false,
				orderable: false,
				targets: 0,
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
