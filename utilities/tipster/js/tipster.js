
document.getElementById('cmdCalc').addEventListener('click', function (event) {
    event.preventDefault();
    
    let meal = parseFloat(document.getElementById('txtSubTotal').value);
    let diners = parseFloat(document.getElementById('txtNumDiners').value);
    let percent = parseFloat(document.getElementById('txtTipPercent').value);

    if (diners < 1)
        diners = 1;

    // Calculate the values
    let tip = meal * (percent / 100);
    let totalMeal = meal + tip;
    let perDiner = totalMeal / diners;

    // Round values off to two decimal places
    tip = tip.toFixed(2);
    totalMeal = totalMeal.toFixed(2);
    perDiner = perDiner.toFixed(2);

    // Put the numbers into the form.
    document.getElementById('txtTipAmount').value = tip;
    document.getElementById('txtTotal').value = totalMeal;
    document.getElementById('txtPerDiner').value = perDiner;
});

document.getElementById('cmdClear').addEventListener('click', function (event) {
    initForm();
});

function initForm() {
  let diners = document.getElementById("txtNumDiners");
  diners.value = '1';
  diners.focus();
  diners.setSelectionRange(0, 1);
  document.getElementById("txtSubTotal").value = 0;
  document.getElementById("txtTipPercent").value = 10;
  document.getElementById("txtTipAmount").value = 0;
  document.getElementById("txtTotal").value = 0;
  document.getElementById("txtPerDiner").val = 0;
}

initForm();
