// This file is specifically made to go with the
// file dice-util.html
$(document).ready(function() {
	$('#num-dice').val(1);
	$('#num-sides').val(6);
	$('#die-modifier').val(0);
});

$('#btn-roll').click(function() {
	// Get values from form
	var numDice = parseInt($('#num-dice').val(), 10);

	var numSides = parseInt($('#num-sides').val(), 10);
	var modifier = parseInt($('#die-modifier').val(), 10);

	// Must have at least one die!
	if(isNaN(numDice)) {
		numDice = 1;
		$('#num-dice').val(1);
	}

	// If modifier isn't defined, it should be zero
	if(isNaN(modifier)) {
		modifier = 0;
		$('#die-modifier').val(0);
	}

	// Variables for output
	var detailStr = numDice.toString() + ' d' + numSides.toString() + ' + ' + modifier.toString();
	var total = 0;
	var thisDie = 0;

	for(i = 0; i < numDice; i++) {
		thisDie = Math.round(Math.random() * (numSides - 1)) + 1;
		total += thisDie;
		detailStr += '<br>1 d' + numSides.toString() + ' = ' + thisDie.toString();
	}

	total += modifier;
	console.log(total.toString());

	$('#details').html(detailStr);
	$('#dice-result').text(total.toString());
});

