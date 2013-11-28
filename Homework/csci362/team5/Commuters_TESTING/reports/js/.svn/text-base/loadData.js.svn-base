$(document).ready(function() {
	loadData();
});

function randomImage(){
	var src = 'images/team5LogoTrans_'
	if (Math.random() > .5){
		src += 'nsx';
	} else{
		src += 'wrx';
	}
	src += '.png';
	$('#logo').attr('src',src);
}

function loadData() {
	 randomImage();
	$('#cat').jqCreator({
		jsonobject: getData(),
		visible_cols: ["Test ID", "Requirement", "Expected Output", "Input", "Output", "Result"],
		width: $('#tablediv').width() * .9,
		options: {
			grouping: true,
			groupingView: {
				groupField: ['Component', 'Method'],
				groupColumnShow: [false, false],
				groupText: ['<b>{0}</b>'],
				groupCollapse: false,
				groupOrder: ['asc', 'asc'],
				groupSummary: [false, false]
			}
		}
	})



	$(window).bind('resize', function() {
		positionStuff();
	}).trigger('resize');

	colorData();

	$('.ui-jqgrid-sortable').click(function() {
		setTimeout(function() {
			colorData()
		}, 10)
	});


	positionStuff();

}

function colorData() {
	var temp;
	$('tr.jqgrow').each(function() {
		temp = $('#cat').jqGrid('getRowData', this.id);
		if (temp !== undefined && temp.Result !== undefined && temp.Result.toUpperCase() === "TRUE") {
			$(this).addClass('pass');
		} else {
			$(this).addClass('fail');
		}
		
		// console.log(this);
	});
}

function positionStuff() {

	if ($('body').width() < 700) {
		$('#centerdiv').css({
			'top': 0,
			'left': 0,
			'right': 0,
			'width': '100%'
		})

	} else {
		$('#centerdiv').width();
		$('#centerdiv').css({
			'top': 15,
			'width': min($('body').width() * .9, 981)
		})
	}

	$('#cat').setGridWidth($('#centerdiv').width() * .9)
	var gridWidth = $($('#tablediv').children()[0]).width();
	var delta = ($('#centerdiv').width() - gridWidth) / 2;

	$('#tablediv').css({
		'padding-left': delta,
		'padding-top': delta / 2,
		'padding-bottom': delta / 2
	});

	$('#logo').width(min($('#centerdiv').width() / 2, 500));
	$('#logo').height($('#logo').width()/3.107594936708861);
	$('#headerleft').width($('#logo').width());
	$('#header').height(max($('#logo').height(),128));

	$('#headerright').css({
		'top':($('#headerright').parent().height()  - $('#headerright').height()) / 2
	});

	$('#headerleft').css({
		'top':($('#headerleft').parent().height()  - $('#headerleft').height()) / 2
	});
}


function max(input1, input2) {
	return input1 > input2 ? input1 : input2;
}

function min(input1, input2) {
	return input1 < input2 ? input1 : input2;
}