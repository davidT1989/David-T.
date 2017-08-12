function startOver(){
	document.loan_form.loan_amt.value = "";
	document.loan_form.months.value = "";
	document.loan_form.rate.value = "";
	document.loan_form.extra.value = "0";

	document.getElementById("loan_info").innerHTML = "";
	document.getElementById("table").innerHTML = "";
	document.getElementById("alert_amount").innerHTML = "";
	document.getElementById("alert_months").innerHTML = "";
	document.getElementById("alert_rate").innerHTML = "";
	document.getElementById("alert_extra").innerHTML = "";

}

function validate(){
	
	var loan_amt = document.loan_form.loan_amt.value;
	var months = document.loan_form.months.value;
	var rate = document.loan_form.rate.value;
	var extra = document.loan_form.extra.value;

	if ( loan_amt <= 0 || isNaN(Number(loan_amt)) ){
		document.getElementById("alert_amount").innerHTML = "Please enter a valid loan amount.";
		document.loan_form.loan_amt.value = "";
		modal.style.display = "none";
	}

	else if (months <=0 || parseInt(months) != months){
		document.getElementById("alert_months").innerHTML ="Please enter a valid number of months.";
		document.loan_form.months.value = "";
		modal.style.display = "none";
	}

	else if(rate <= 0 || isNaN(Number(rate))){
		document.getElementById("alert_rate").innerHTML = "Please enter a valid interest rate.";
		document.loan_form.rate.value = "";
		modal.style.display = "none";
	}

	else if(extra <= 0 || isNaN(Number(extra))){
		document.getElementById("alert_extra").innerHTML = "Please enter a valid extra payment.";
		document.loan_form.extra.value = "0";
		modal.style.display = "none";
	}
	else{

		calculate(parseFloat(loan_amt), parseInt(months), parseFloat(rate), parseFloat(extra));
	}
}

function calculate(loan_amt, months, rate, extra){

	i = rate/1200;
	var monthly_payment = (loan_amt*i/(1 - (Math.pow(1/(1 + i), months)))).toFixed(2)
	var info="";
	var total = Number(monthly_payment) + Number(extra);
	info += "<table class='table table-responsive' cellspacing='0' cellpadding='1'>";
	
	info += "<tr><td align='center' width='25%'>"+months+"</td>";
	info += "<td align='center' width='25%'>"+monthly_payment+"</td>";
	info += "<td align='center' width='25%'>"+extra+"</td>";
	info += "<td align='center' width='25%'>"+total+"</td></tr>";
	info += "<tr><td align='center' width='25%'>Number of Months</td>";
	info += "<td align='center' width='25%'>Monthly Payment</td>";
	info += "<td align='center' width='25%'>Extra</td>";
	info += "<td align='center' width='25%'>Total Payment</td></tr>";
	info += "</table>";

	document.getElementById("loan_info").innerHTML = info;

	var amortization ="";
	amortization += "<table class='table' cellspacing='0' cellpadding='1' style='max-width:100%;'>";

	amortization += "<tr>";
	amortization += "<td width='30'>0</td>";
	
	amortization += "<td width='60'>&nbsp;</td>";
	amortization += "<td width='60'>&nbsp;</td>";
	amortization += "<td width='85'>&nbsp;</td>";
	amortization += "<td width='70'>"+loan_amt+"</td></tr>";

	var current_balance = loan_amt;
	var payment_counter = 1;
	var total_interest = 0;
	var data = [], payment_counterArr = [];
	for(var k = 0; k < 5; k++){
		var tmp = [];
		data.push(tmp);
	}


	while(current_balance > 0) {
		//create rows
		monthly_payment = monthly_payment + extra;
		towards_interest = i*current_balance;

		if (monthly_payment > current_balance){
			monthly_payment = current_balance + towards_interest;
		}
		towards_balance = monthly_payment - towards_interest;
		total_interest = total_interest + towards_interest;
		current_balance = current_balance - towards_balance;

		//display row
		var pay = Number(monthly_payment).toFixed(2);
		var curbal = Number(current_balance).toFixed(2);
		var tobal = Number(towards_balance).toFixed(2);
		var tointer = Number(towards_interest).toFixed(2);
		var totalinter = Number(total_interest).toFixed(2);
		amortization += "<tr>";
		amortization += "<td>"+payment_counter+"</td>";
		amortization += "<td>"+tobal+"</td>";
		amortization += "<td>"+tointer+"</td>";
		amortization += "<td>"+totalinter+"</td>";
		amortization +="<td>"+curbal+"</td>";
		amortization +="</tr>";

		payment_counterArr.push(payment_counter);
		data[0].push(parseInt(tobal));
		data[1].push(parseInt(tointer));
		data[2].push(parseInt(totalinter));
		data[3].push(parseInt(curbal));

		payment_counter++;
	}

	var seriesData = [];
	var nameArr = [ "tobal", "tointer", "totalinter", "curbal"];
	var typeArr = [ "column","column","column","spline"];
	var yAxisArr = [0,0,0,1];
	for(var i = 0; i < 4; i++){
		var tmpData = {name: nameArr[i], data: data[i], type: typeArr[i], yAxis: yAxisArr[i]};
		seriesData.push(tmpData);
	}
	

	amortization += "</table>";

	document.getElementById("table").innerHTML = amortization;


	Highcharts.chart('graph', {
	    chart: {
	        type: 'column'
	    },
	    title: {
	        text: 'Mortgage Calculator'
	    },
	    yAxis: [{
	        min: 0,
	        title: {
	            text: 'Towards Balance, Towards Interest, Total Interest'
	        }
	    }, {
	        title: {
	            text: 'Current Balance($)'
	        },
	        opposite: true
	    }],
	   
	    plotOptions: {
	        line: {
	            dataLabels: {
	                enabled: true
	            },
	            enableMouseTracking: true
	        }
	    },
	    series: seriesData
	});
}



