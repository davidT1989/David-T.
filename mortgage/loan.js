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
	}

	else if (months <=0 || parseInt(months) != months){
		document.getElementById("alert_months").innerHTML ="Please enter a valid number of months.";
		document.loan_form.months.value = "";
	}

	else if(rate <= 0 || isNaN(Number(rate))){
		document.getElementById("alert_rate").innerHTML = "Please enter a valid interest rate.";
		document.loan_form.rate.value = ""
	}

	else if(extra <= 0 || isNaN(Number(extra))){
		document.getElementById("alert_extra").innerHTML = "Please enter a valid extra payment.";
		document.loan_form.extra.value = "0";
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
	info += "<table class='table'>";
	info += "<thead><tr><th>Loan Amount:</th>";
	info += "<td align='right'>"+loan_amt+"</td></tr>";

	info += "<tr><td>Number of Months:</td>";
	info += "<td align='right'>"+months+"</td></tr>";

	info += "<tr><td>Interest Rate:</td>";
	info += "<td align='right'>"+rate+"</td></tr>";

	info += "<tr><td>Monthly Payment:</td>";
	info += "<td align='right'>"+monthly_payment+"</td></tr>";

	info += "<tr><td>Extra:</td>";
	info += "<td align='right'>"+extra+"</td></tr>";

	info += "<tr><td>Total Payment:</td>";
	info += "<td align='right'>"+total+"</td></tr>";

	info += "</thead></table>";

	document.getElementById("loan_info").innerHTML = info;

	var amortization ="";
	amortization += "<table class='table'>";

	amortization += "<tr>";
	amortization += "<td width='30'>0</td>";
	amortization += "<td width='60'>&nbsp;</td>";
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
		var curbal = (Number(current_balance)/1000).toFixed(2);
		var tobal = Number(towards_balance).toFixed(2);
		var tointer = Number(towards_interest).toFixed(2);
		var totalinter = Number(total_interest).toFixed(2);
		amortization += "<tr>";
		amortization += "<td>"+payment_counter+"</td>";
		amortization += "<td>"+pay+"</td>";
		amortization += "<td>"+tobal+"</td>";
		amortization += "<td>"+tointer+"</td>";
		amortization += "<td>"+totalinter+"</td>";
		amortization +="<td>"+curbal+"</td>";
		amortization +="</tr>";

		payment_counterArr.push(payment_counter);
		data[0].push(parseInt(pay));
		data[1].push(parseInt(tointer));
		data[2].push(parseInt(totalinter));
		data[3].push(parseInt(totalinter));
		data[4].push(parseInt(curbal));

		payment_counter++;
	}

	var seriesData = [];
	var nameArr = ["pay", "tobal", "tointer", "totalinter", "curbal"];
	var typeArr = ["spline", "column","column","column","spline"];
	for(var i = 0; i < 5; i++){
		var tmpData = {name: nameArr[i], data: data[i], type: typeArr[i]};
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
	    subtitle: {
	        text: 'Source: DavidTan.com'
	    },
	    legend: {
            layout: "horizontal",
            verticalAlign: "top",
        },

	    xAxis: {
	        categories: payment_counterArr
	    },
	    yAxis: {
	        title: {
	            text: 'Currency($)'
	        },
	        
	    },
	    plotOptions: {
	        line: {
	            dataLabels: {
	                enabled: true
	            },
	            enableMouseTracking: true
	        },
	       
	    },
	    series: seriesData
	});

	
}

