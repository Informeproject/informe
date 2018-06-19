// register modal component
Vue.component('modal', {
	template: '#modal-template'
});

var vm = new Vue({
	el: '#container',
	data: {
		buildings: [],
		volumelist: [],
		consumerlist: [],
		producerlist: [],
		checkedid: [],
		kWhvalue: [],
		prodValue: [],
		prodlist: [],
		materiallist: [],
		modalValue: [],
		heatingpowervalues: [],
		eConsumption: [{ value: 0 }, { value: 0 }, { value: 0 }, { value: 0 }, { value: 0 }, { value: 0 }, { value: 0 }, { value: 0 }, { value: 0 }, { value: 0 }, { value: 0 }, { value: 0 }],
		heating: [{ value: 0 }, { value: 0 }, { value: 0 }, { value: 0 }, { value: 0 }, { value: 0 }, { value: 0 }, { value: 0 }, { value: 0 }, { value: 0 }, { value: 0 }, { value: 0 }],
		monthlyElecConsumption: [{ value: 0 }, { value: 0 }, { value: 0 }, { value: 0 }, { value: 0 }, { value: 0 }, { value: 0 }, { value: 0 }, { value: 0 }, { value: 0 }, { value: 0 }, { value: 0 }],
		monthlyHeatConsumption: [{ value: 0 }, { value: 0 }, { value: 0 }, { value: 0 }, { value: 0 }, { value: 0 }, { value: 0 }, { value: 0 }, { value: 0 }, { value: 0 }, { value: 0 }, { value: 0 }],
		yearlyHeatConsumption: 0,
		yearlyElecConsumption: 0,
		result: 0,
		HCTS: 0,
		eResult: 0,
		showDisclaimer: true,
		showSelected: false,
		buildingcategory: 0,
		prodstep: -1,
		selectHeating: false,
		selectElectricity: false,
		selectElecheating: false,
		prodchoices: [],
		finalpage: [],
		heatresult: 0,
		electrresult: 0,
		heatingkwvalue: 0,
		electrpowerkwvalue: 0,
		heatingpowersize: 0, // power size rounded up from heatingkwvalue
		prodmodalvalue: [],
		prodmodalCat: 0,
		heatValueForProd: [{ value: 0 }, { value: 0 }, { value: 0 }, { value: 0 }, { value: 0 }, { value: 0 }, { value: 0 }, { value: 0 }, { value: 0 }, { value: 0 }, { value: 0 }, { value: 0 }],
		biogasproducers: [],
		monthlyHeat:[],
		heatProdSum:0
	},
	created: function () {

		// Check disclaimer cookie
		var disclaimercookie = getCookie("disclaimeraccepted");
		if (disclaimercookie === "true") {
			this.showDisclaimer = false;
		}

		function getCookie(cname) {
			var name = cname + "=";
			var decodedCookie = decodeURIComponent(document.cookie);
			var ca = decodedCookie.split(';');
			for (var i = 0; i < ca.length; i++) {
				var c = ca[i];
				while (c.charAt(0) === ' ') {
					c = c.substring(1);
				}
				if (c.indexOf(name) === 0) {
					return c.substring(name.length, c.length);
				}
			}

			return "";
		}

		this.populate();

	},	
	computed: {
		firstselected: function () {
			if (this.checkedid.length === 0) {
				return false;
			} else {
				return true;
			}
		},
	},
	watch: {
		heating: {
			handler: function (val, oldVal) {
				var yearlyTotal = 0;

				for (var i = 0; i < val.length; i++) {
					yearlyTotal += val[i].value;
				}

				this.heatValueForProd = val;
				var resultPlaceholder = yearlyTotal.toLocaleString();
				resultPlaceholder = resultPlaceholder.replace(/,/g," ");
				this.result = resultPlaceholder;
				this.heatresult = yearlyTotal.toFixed(2);

				var eConsumptionValue = this.eConsumption;
				var eyearlyTotal = 0;

				for (var f = 0; f < val.length; f++) {
					eyearlyTotal += eConsumptionValue[f].value;
				}
				
				this.eResult = eyearlyTotal.toLocaleString().replace(/,/g," ");
				this.electrresult = eyearlyTotal;

				google.charts.load('current', { 'packages': ['corechart'] });
				google.charts.setOnLoadCallback(drawChart);

				function drawChart() {
					
					var data = google.visualization.arrayToDataTable([
						['Kuukausi', 'Lämmitysenergian kulutus', 'Laitesähkön kulutus'],
						['Tammi', val[0].value, eConsumptionValue[0].value],
						['Helmi', val[1].value, eConsumptionValue[1].value],
						['Maalis', val[2].value, eConsumptionValue[2].value],
						['Huhti', val[3].value, eConsumptionValue[3].value],
						['Touko', val[4].value, eConsumptionValue[4].value],
						['Kesä', val[5].value, eConsumptionValue[5].value],
						['Heinä', val[6].value, eConsumptionValue[6].value],
						['Elo', val[7].value, eConsumptionValue[7].value],
						['Syys', val[8].value, eConsumptionValue[8].value],
						['Loka', val[9].value, eConsumptionValue[9].value],
						['Marras', val[10].value, eConsumptionValue[10].value],
						['Joulu', val[11].value, eConsumptionValue[11].value],
					]);

					var options = {
						backgroundColor: '#f5f5f5',
						title: 'kWh / kk',
						legend: { position: 'bottom' },
						bars: 'vertical',
						vAxis: { format: '' },
						colors: ['#C52F03', '#328FB2'],
						backgroundColor: '#fff'
					};

					var chart = new google.visualization.ColumnChart(document.getElementById('resultchart'));
					chart.draw(data, options);
				}
			},
			deep: true
		},
		modalValue: { //tämä tarvitaan
			handler: function (val, oldVal) {

				this.$http.get('http://niisku.lamk.fi/~informe/informeapi/public/consumers/' + val.id + '/energy').then(function (response) {

					var eValue = response.data;

					document.getElementById('resultmodaltext').innerHTML = val.consumer.use;

					google.charts.load('current', { 'packages': ['corechart'] });
					google.charts.setOnLoadCallback(drawChart);

					function drawChart() {
						var data = google.visualization.arrayToDataTable([
							['Kuukausi', 'Lämmitysenergian kulutus', 'Laitesähkön kulutus'],
							['Tammi', Number(val.january), Number(eValue.january)],
							['Helmi', Number(val.february), Number(eValue.february)],
							['Maalis', Number(val.march), Number(eValue.march)],
							['Huhti', Number(val.april), Number(eValue.april)],
							['Touko', Number(val.may), Number(eValue.may)],
							['Kesä', Number(val.june), Number(eValue.june)],
							['Heinä', Number(val.july), Number(eValue.july)],
							['Elo', Number(val.august), Number(eValue.august)],
							['Syys', Number(val.september), Number(eValue.september)],
							['Loka', Number(val.october), Number(eValue.october)],
							['Marras', Number(val.november), Number(eValue.november)],
							['Joulu', Number(val.december), Number(eValue.december)],
						]);

						var options = {
							title: 'Lämmitysenergian ja laitesähkön kulutus kohteelle (kWh / kk): ' + val.consumer.use,
							legend: { position: 'bottom' },
							bars: 'vertical',
							vAxis: { format: '' },
							colors: ['#C52F03', '#328FB2'],
							height: 500,
							backgroundColor: '#fff'
						};

						var chart = new google.visualization.ColumnChart(document.getElementById('resultmodalchart'));

						chart.draw(data, options);

					}
				});
			},
			deep: true
		},
		result: {
			handler: function (val, oldVal) {
			},
			deep: true
		},
		prodmodalvalue: { 
			handler: function (val, oldVal) {
				var power

				if (val.materialcategory == 3){
					power = 1;
				}
				else {
					power = this.heatingkwvalue;
				}

				var jan = (parseInt(power)) * parseInt(val.heatjanuary);
				var feb = (parseInt(power)) * parseInt(val.heatfebruary);
				var mar = (parseInt(power)) * parseInt(val.heatmarch);
				var apr = (parseInt(power)) * parseInt(val.heatapril);
				var may = (parseInt(power)) * parseInt(val.heatmay);
				var jun = (parseInt(power)) * parseInt(val.heatjune);
				var jul = (parseInt(power)) * parseInt(val.heatjuly);
				var aug = (parseInt(power)) * parseInt(val.heataugust);
				var oct = (parseInt(power)) * parseInt(val.heatoctober);
				var nov = (parseInt(power)) * parseInt(val.heatnovember);
				var dec = (parseInt(power)) * parseInt(val.heatdecember);
				var sep = (parseInt(power)) * parseInt(val.heatseptember);
				
				function add(a,b){
					return a+b;
				}
				
				this.monthlyHeat = [jan,feb,mar,apr,may,jun,jul,aug,sep,oct,nov,dec];
				
				this.heatProdSum = this.monthlyHeat.reduce(add,0).toLocaleString().replace(/,/g," ");
				
				if (this.prodmodalCat === 1){

					var heatVal = this.heatValueForProd;

					google.charts.load('current', { 'packages': ['corechart'], 'language':'us' });
					google.charts.setOnLoadCallback(drawChart);

					function drawChart() {
						
						var data = google.visualization.arrayToDataTable([
							['Kuukausi', 'Tuotettu Lämpö' , 'Lämmön Tarve'],
							['Tammi', Number(jan), heatVal[0].value],
							['Helmi', Number(feb), heatVal[1].value],
							['Maalis', Number(mar), heatVal[2].value],
							['Huhti', Number(apr), heatVal[3].value],
							['Touko', Number(may), heatVal[4].value],
							['Kesä', Number(jun), heatVal[5].value],
							['Heinä', Number(jul), heatVal[6].value],
							['Elo', Number(aug), heatVal[7].value],
							['Syys', Number(sep), heatVal[8].value],
							['Loka', Number(oct), heatVal[9].value],
							['Marras', Number(nov), heatVal[10].value],
							['Joulu', Number(dec), heatVal[11].value],
						]);
						
						//var formatter = new google.visualization.NumberFormat({prefix: '$',  decimalSymbol: ' ', groupingSymbol: ' ' });
    					//formatter.format(data, 0);
						
						var options = {
							title: 'Arvioitu lämmitysenergian tuotanto ja tarve (kWh / kk)',
							legend: { 'position': 'bottom'},
							bars: 'vertical',
							vAxis: {format: ''},
							colors: ['#FE7621', '#C52F03'],
							height: 500,
							backgroundColor: '#fff'
						};
						
						

						var chart = new google.visualization.ColumnChart(document.getElementById('prodmodalchart'));

						chart.draw(data, options);
					}
				}
				else {
					var eConsumptionValue = this.eConsumption;
					var eyearlyTotal = 0;

					for (var f = 0; f < val.length; f++) {
						eyearlyTotal += eConsumptionValue[f].value;
					}

					google.charts.load('current', { 'packages': ['corechart'] });
					google.charts.setOnLoadCallback(drawChart);

					function drawChart() {
						var data = google.visualization.arrayToDataTable([
						['Kuukausi', 'Tuotettu Sähkö' , 'Sähkön tarve'],
						['Tammi', Number(val.electjanuary), eConsumptionValue[0].value],
						['Helmi', Number(val.electfebruary), eConsumptionValue[1].value ],
						['Maalis', Number(val.electmarch), eConsumptionValue[2].value],
						['Huhti', Number(val.electapril), eConsumptionValue[3].value],
						['Touko', Number(val.electmay), eConsumptionValue[4].value],
						['Kesä', Number(val.electjune), eConsumptionValue[5].value],
						['Heinä', Number(val.electjuly), eConsumptionValue[6].value],
						['Elo', Number(val.electaugust), eConsumptionValue[7].value],
						['Syys', Number(val.electseptember), eConsumptionValue[8].value],
						['Loka', Number(val.electoctober), eConsumptionValue[9].value],
						['Marras', Number(val.electnovember), eConsumptionValue[10].value],
						['Joulu', Number(val.electdecember), eConsumptionValue[11].value],
						]);

						var options = {
							title: 'Arvioitu laitesähkön tuotanto ja tarve (kWh / kk)',
							legend: { 'position': 'bottom'},
							bars: 'vertical',
							vAxis: { format: '' },
							colors: ['#328FB2', '#085978'],
							height: 500,
							backgroundColor: '#fff'
						};

						var chart = new google.visualization.ColumnChart(document.getElementById('prodmodalchart'));

						chart.draw(data, options);
					}
				}
			},
			deep: true
		}
	},

	methods: {
		acceptdisclaimer: function () {
			this.showDisclaimer = false;
			document.cookie = "disclaimeraccepted=true";
		},
		// heatingresults: function (event) {

		// 	for (var i = 0; i < this.checkedid.length; i++) {

		// 		this.$http.get('http://niisku.lamk.fi/~informe/informeapi/public/consumers/' + this.checkedid[i] + '/heating', { params: {} }).then(
		// 			function (response) {
		// 				months = ['january', 'february', 'march', 'april', 'may', 'june', 'july', 'august', 'september', 'october', 'november', 'december'];

		// 				for (var j = 0; j <= 11; j++) {
		// 					this.heating[j].value += parseFloat(response.data[months[j]]);
		// 				}

		// 				this.kWhvalue.push(response.data);  //adds the received object to kWhvalue			

		// 			}, function (error) {
		// 				// handle error
		// 			});
		// 	}
		// },
		// econsumptionresult: function (event) {
		// 	for (var val = 0; val < this.checkedid.length; val++) {
		// 		this.$http.get('http://niisku.lamk.fi/~informe/informeapi/public/consumers/' + this.checkedid[val] + '/energy', { params: {} }).then(
		// 			function (response) {
		// 				months = ['january', 'february', 'march', 'april', 'may', 'june', 'july', 'august', 'september', 'october', 'november', 'december'];

		// 				for (var j = 0; j <= 11; j++) {
		// 					this.eConsumption[j].value += parseFloat(response.data[months[j]]);
		// 				}
		// 			}, function (error) {
		// 				// handle error
		// 			});
		// 	}
		// },
		getConsumptions: function () {

			var months = ['january', 'february', 'march', 'april', 'may', 'june', 'july', 'august', 'september', 'october', 'november', 'december'];

			for (var i = 0; i < this.checkedid.length; i++) {
				
				this.$http.get('http://niisku.lamk.fi/~informe/informeapi/public/consumers/' + this.checkedid[i] + '/heating', { params: {} })
				.then(
					function (response) {

						for (var h = 0; h <= 11; h++) {
							this.monthlyHeatConsumption[h].value += parseFloat(response.data[months[h]]);
							this.yearlyHeatConsumption += response.data[months[h]];
						}
	
						this.kWhvalue.push(response.data);  //adds the received object to kWhvalue

					},
					function (error) {
						// handle error
					});

				this.$http.get('http://niisku.lamk.fi/~informe/informeapi/public/consumers/' + this.checkedid[i] + '/energy', { params: {} })
				.then(
					function (response) {

						for (var e = 0; e <= 11; e++) {
							this.monthlyElecConsumption[e].value += parseFloat(response.data[months[e]]);
							this.yearlyElecConsumption += response.data[months[e]];
						}
						
					},
					function (error) {
						// handle error
					});

			}

			this.drawResultChart(this.monthlyHeatConsumption, this.monthlyElecConsumption);

		},
		drawResultChart: function (heat, elec) {

			google.charts.load('current', { 'packages': ['corechart'] });
			google.charts.setOnLoadCallback(drawChart);

			function drawChart() {
				
				var data = google.visualization.arrayToDataTable([
					['Kuukausi', 'Lämmitys', 'Sähkö'],
					['Tammi', heat[0].value, elec[0].value],
					['Helmi', heat[1].value, elec[1].value],
					['Maalis', heat[2].value, elec[2].value],
					['Huhti', heat[3].value, elec[3].value],
					['Touko', heat[4].value, elec[4].value],
					['Kesä', heat[5].value, elec[5].value],
					['Heinä', heat[6].value, elec[6].value],
					['Elo', heat[7].value, elec[7].value],
					['Syys', heat[8].value, elec[8].value],
					['Loka', heat[9].value, elec[9].value],
					['Marras', heat[10].value, elec[10].value],
					['Joulu', heat[11].value, elec[11].value],
				]);

				var options = {
					backgroundColor: '#f5f5f5',
					title: 'kWh / kk',
					legend: { position: 'right' },
					bars: 'vertical',
					vAxis: { format: '' },
					colors: ['#C52F03', '#328FB2'],
					backgroundColor: '#fff',
					width: '691',
					height: '360'
				};

				var chart = new google.visualization.ColumnChart(document.getElementById('resultchart'));
				chart.draw(data, options);
			}
			
		},
		modali: function (id) {
			$("#resultmodal").modal()
			this.$http.get('http://niisku.lamk.fi/~informe/informeapi/public/consumers/' + id + '/heating').then(function (response) {
				this.modalValue = response.data;
			});
		},
		select: function (event) {
			var cons = this.consumerlist[0];

			for (i=0; i < cons.length; i++){

				if (cons[i].id == event.currentTarget.id) {
					this.heatingkwvalue += parseFloat(cons[i].heatingkw);
					this.electrpowerkwvalue += parseFloat(cons[i].electrkw);
				}
			}
	
			this.checkedid.push(event.currentTarget.id);
		},
		unselect: function (event) {
			var cons = this.consumerlist[0];
			
			for (i=0; i < cons.length; i++){

				if (cons[i].id == event.currentTarget.id) {			
					this.heatingkwvalue -= parseFloat(cons[i].heatingkw);
					this.electrpowerkwvalue -= parseFloat(cons[i].electrkw);
				}
			}

			this.checkedid.splice(this.checkedid.indexOf(event.currentTarget.id), 1);
		},
		countchecked: function (itemid) {
			var checked = 0;

			this.checkedid.forEach(function(item, index) {
				if (itemid == item) {
					checked++;
				}
				
			});

			return checked;
		},
		populate: function () {

			//All consumer buildings
			this.$http.get('http://niisku.lamk.fi/~informe/informeapi/public/consumers?id=true', { params: {} }).then(
				function (response) {
					Vue.set(this.consumerlist, 0, response.data);

					// Sort consumers by type to volumelist.
					var allconsumers = this.consumerlist;
					var consumertypes = this.noduplicates(allconsumers[0], "type");
					var vollist = [];

					for (i=0; i<consumertypes.length; i++) {
						vollist[i] = allconsumers[0].filter(function(val){
							return val.type.includes(consumertypes[i].type);
						})
					}

					Vue.set(this.volumelist, 0, vollist[2]);
					Vue.set(this.volumelist, 1, vollist[1]);
					Vue.set(this.volumelist, 2, vollist[0]);
					//Vue.set(this.volumelist, 3, vollist[1]);	
				}, function (error) {
					// handle error
				});

			// Kaikki tuotantopuolen rakennukset
			this.$http.get('http://niisku.lamk.fi/~informe/informeapi/public/productions', { params: {} }).then(
				function (response) {
					Vue.set(this.producerlist, 0, response.data);
				}, function (error) {
					// handle error
				});

			// Energycategory 1 (Lämpö)
			this.$http.get('http://niisku.lamk.fi/~informe/informeapi/public/productions?energycategory=1', { params: {} }).then(
				function (response) {
					Vue.set(this.prodlist, 0, response.data);
				}, function (error) {
					// handle error
				});

			// Energycategory 2 (Sähkö)
			this.$http.get('http://niisku.lamk.fi/~informe/informeapi/public/productions?energycategory=2', { params: {} }).then(
				function (response) {
					var responseData = response.data;

					this.sortbydirection(responseData);

					Vue.set(this.prodlist, 1, responseData);

				}, function (error) {
					// handle error
				});

			// Energycategory 3 (CHP)
			this.$http.get('http://niisku.lamk.fi/~informe/informeapi/public/productions?energycategory=3', { params: {} }).then(
				function (response) {
					Vue.set(this.prodlist, 2, response.data);
				}, function (error) {
					// handle error
				});
			
			// Materialcategory 1 (Puu)
			this.$http.get('http://niisku.lamk.fi/~informe/informeapi/public/productions?materialcategory=1', { params: {} }).then(
				function (response) {
					Vue.set(this.materiallist, 0, response.data);
				}, function (error) {
					// handle error
				});
			
			// Materialcategory 2 (Pelto)
			this.$http.get('http://niisku.lamk.fi/~informe/informeapi/public/productions?materialcategory=2', { params: {} }).then(
				function (response) {
					Vue.set(this.materiallist, 1, response.data);
				}, function (error) {
					// handle error
				});
			
			// Materialcategory 3 (Biokaasu)
			this.$http.get('http://niisku.lamk.fi/~informe/informeapi/public/productions?materialcategory=3', { params: {} }).then(
				function (response) {
					Vue.set(this.materiallist, 2, response.data);
				}, function (error) {
					// handle error
				});
		},
		clearchecked: function () {			
				this.checkedid = [];
				this.heatingkwvalue = 0;
				this.electrpowerkwvalue = 0;
		},

		clearproductionresults: function () {			
			this.finalpage = [];
			this.prodchoices = [];
		},

		//clears after results
		clearresults: function () {		
			this.yearlyTotal = 0;
			this.result = 0;
			this.HCTS = null;
			this.eResult = 0;
			this.kWhvalue = [];
			this.heating = [{ value: 0 }, { value: 0 }, { value: 0 }, { value: 0 }, { value: 0 }, { value: 0 }, { value: 0 }, { value: 0 }, { value: 0 }, { value: 0 }, { value: 0 }, { value: 0 }];
			this.eConsumption = [{ value: 0 }, { value: 0 }, { value: 0 }, { value: 0 }, { value: 0 }, { value: 0 }, { value: 0 }, { value: 0 }, { value: 0 }, { value: 0 }, { value: 0 }, { value: 0 }];
		},	
		modalClear: function () {
			this.clearproductionresults();
			this.prodstep = 0;
		},
		heatingCatTextSelect: function (HeatCatTextSelect){
			var x = HeatCatTextSelect;

			if(x == 1){	
				this.HCTS = "Alla olevissa kuvakkeissa näet valitsemiesi kohteiden lämmitystarvetta vastaavan polttoaineen määrän vuodessa. Klikkaamalla kuvaketta voit tarkastella soveltuvia tekniikoita ja lämmöntuotannon jakautumista kuukausitasolla.";
			} else if (x == 2) {
				this.HCTS = "Alla olevissa kuvakkeissa näet valitsemiesi kohteiden lämmitystarvetta vastaavan polttoaineen määrän vuodessa. Klikkaamalla kuvaketta voit tarkastella soveltuvia tekniikoita ja lämmöntuotannon jakautumista kuukausitasolla.";
			} else if (x == 3) {
				this.HCTS = null;				
			} else if (x == 4){
				this.HCTS = "Alla olevissa kuvakkeissa näet valitsemiesi kohteiden tehon tarvetta vastaavan maa- tai vesilämpöputkiston pituuden. Klikkaamalla kuvaketta voit tarkastella soveltuvia tekniikoita ja lämmöntuotannon jakautumista kuukausitasolla";
			} else {
				this.HCTS = null;
			}
		},
		heatingprods: function (energycat, materialcat) {
			this.finalpage = [];

			// Material category is "biogas"
			if (materialcat == 3) {
				this.prodstep = 7;
				return;
			}
			else {
				var producers = this.producerlist[0];

				// Filter producers by min and max kwh values
				for (i=0, j=0; i<producers.length; i++) {
					if ((producers[i].energycategory == energycat && producers[i].materialcategory == materialcat)
						&& (this.heatingkwvalue >= producers[i].heatingpowermin && this.heatingkwvalue <= producers[i].heatingpowermax)) {
						Vue.set(this.finalpage, j, producers[i]);
						j++;				
					}
				}
				
				// Change view to results
				this.prodstep = 3;
			}		
		},
		nextproductionscale: function (energycat, materialcat) {
			producers = this.producerlist[0];
			var val = this.heatingkwvalue;
			var values = [];
			var r;

			for (i=0; i<producers.length; i++) {
				if(producers[i].energycategory == energycat && producers[i].materialcategory == materialcat) {
					var heatingpower = parseInt(producers[i].heatingpowerkw);
					Vue.set(values, i, heatingpower);
				}
			}
			
			values.sort(function(a, b){return a-b});

			for (i = 0; i < values.length; i++) {
				if (val <= values[i]) {
					
					r = values[i];
					break;
				}
			}

			return r;
		},
		lastproductionscale: function (energycat, materialcat) {
			producers = this.producerlist[0];
			var val = this.heatingkwvalue;
			var values = [];
			var r;

			for (i=0; i<producers.length; i++) {
				if(producers[i].energycategory == energycat && producers[i].materialcategory == materialcat) {
					var heatingpower = parseInt(producers[i].heatingpowerkw);
					Vue.set(values, i, heatingpower);
				}
			}
			
			values.sort(function(a, b){return a-b});

			for (i = 0; i < values.length; i++) {
				if (val <= values[i]) {
					
					r = values[i-1];
					break;
				}
			}

			return r;
		},
		electrprods: function (energycat, materialcat, kwsize, panelang, paneldir) {
			this.finalpage = [];
			var producers = this.producerlist[0];
			for (i=0; i<producers.length; i++) {
				if (producers[i].energycategory == energycat &&
					producers[i].materialcategory == materialcat &&
					producers[i].electrpowerkw == kwsize &&
					producers[i].panelangle == panelang &&
					producers[i].paneldirection == paneldir
					) {
						this.prodmodalCat = 2;
						this.prodmodalvalue = producers[i];
					}
			}
		},
		noduplicates: function (obj, key) {
			var uniques = [];
			var checklist = [];
			$.each(obj, function(i, val){
				if($.inArray(val[key], checklist) === -1) {
					uniques.push(val);
					checklist.push(val[key]);
				}
			});
			return uniques;
		},
		getproducer: function (energycat, materialcat, energysrc, powersize, electrpowersize, panelang, paneldir) {
			var allproducers = this.producerlist[0];

			for (i = 0; i < allproducers.length; i++) {
				this.prodmodalCat = 1;
				if (allproducers[i].energycategory == energycat &&
					allproducers[i].materialcategory == materialcat &&
					allproducers[i].energysource == energysrc &&
					allproducers[i].heatingpowerkw == powersize) {
						this.prodmodalvalue = allproducers[i];
					}
			}			
		},
		sortbypowerkw: function (items) {
			items.sort(function (a, b) {
				return a.electrpowerkw - b.electrpowerkw;
				});
		},
		sortbyangle: function (items) {
			items.sort(function (a, b) {
				return a.panelangle - b.panelangle;
				});
		},
		sortbydirection: function (items) {
			items.sort(function (a, b) {
				if(a.paneldirection < b.paneldirection) {
					return -1;
				}
				if(a.paneldirection > b.paneldirection) {
					return 1;
				}

				return 0;
			});
		},
		biogasresults: function (energycat, materialcat, energysource, heatingpowerkw) {
			var producers = this.producerlist[0];

			for (i=0, j=0; i<producers.length; i++) {
				if (producers[i].energycategory == energycat
					&& producers[i].materialcategory == materialcat
					&& producers[i].energysource == energysource
					&& producers[i].heatingpowerkw == heatingpowerkw) {
						this.prodmodalCat = 1;
						this.prodmodalvalue = producers[i];
						j++;
				}
			}
			this.prodstep = 3;
		},
		preparematerialcategories: function () {
			var allcategories = this.noduplicates(this.prodlist[0], 'materialcategory');
			var cat = [];
			var availablecategories = [];

			for (z=0; z<allcategories.length; z++) {

				// Biogas category is displayed ignoring heatingpowermin and max values.
				if (allcategories[z].materialcategory == 3) availablecategories.push(allcategories[z]);
				
				cat = this.filterbyattrvalue(this.prodlist[0], 'materialcategory', allcategories[z].materialcategory);
				var max = Math.max.apply(Math,cat.map(function(o){return o.heatingpowermax;}));
				var min = Math.min.apply(Math,cat.map(function(o){return o.heatingpowermin;}));

				if (this.heatingkwvalue > min && this.heatingkwvalue < max) {
					availablecategories.push(allcategories[z]);
				}
			}
			
			return availablecategories;
		},
		filterbyattrvalue: function (arr, attr, val) {
			var filtered = [];
			
			for (i=0; i<arr.length; i++) {
				if (arr[i][attr] == val) {
					filtered.push(arr[i]);
				}
			}

			return filtered;
		},
		detectIE: function () {
			var ba = ["MSIE", "Trident"];
			var b, ua = navigator.userAgent;
			for (var i = 0; i < ba.length; i++) {
				if (ua.indexOf(ba[i]) > -1) {
					b = ba[i];
					break;
				}
			}
			if (b == "MSIE" || b == "Trident") {
				return true;
			}
			else {
				return false;
			}
		},
		printResultContent: function () {
			var DocumentContainer = document.getElementById('resulttab');
			var WindowObject = window.open("", "PrintWindow",
			"width=750,height=650,top=50,left=50,toolbars=no,scrollbars=yes,status=no,resizable=yes");
			WindowObject.document.writeln(DocumentContainer.innerHTML);
			WindowObject.document.close();
			WindowObject.print();
		},
		printModalContent: function () {
			var DocumentContainer = document.getElementById('prodresultmodal');
			var WindowObject = window.open("", "PrintWindow",
			"width=750,height=650,top=50,left=50,toolbars=no,scrollbars=yes,status=no,resizable=yes");
			WindowObject.document.writeln(DocumentContainer.innerHTML);
			WindowObject.document.close();
			WindowObject.print();
		},
	}
});