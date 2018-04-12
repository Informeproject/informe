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
		consumers: [],
		producers: [],
		kWhvalue: [],
		prodValue: [],
		prodlist: [],
		materiallist: [],
		modalValue: [],
		heatingpowervalues: [],
		eConsumption: [{ value: 0 }, { value: 0 }, { value: 0 }, { value: 0 }, { value: 0 }, { value: 0 }, { value: 0 }, { value: 0 }, { value: 0 }, { value: 0 }, { value: 0 }, { value: 0 }],
		heating: [{ value: 0 }, { value: 0 }, { value: 0 }, { value: 0 }, { value: 0 }, { value: 0 }, { value: 0 }, { value: 0 }, { value: 0 }, { value: 0 }, { value: 0 }, { value: 0 }],
		avgHeating: 0,
		result: 0,
		HCTS: 0,
		eResult: 0,
		message1: 'Asuinrakennus',
		message2: 'Muu rakennus',
		message3: 'Tuotantorakennus',
		message4: 'Kuivuri',
		houseCounter: 0,
		communityCounter: 0,
		productionCounter: 0,
		holidayCounter: 0,
		catMessage: '',
		showDisclaimer: true,
		showSelected: false,
		buildingcategory: 0,
		prodstep: -1,
		selectHeating: false,
		selectElectricity: false,
		selectElecheating: false,
		prodchoices: [],
		prodresult: '',
		finalpage: [],
		motimiinus: false,
		neededFuel: 0,
		heatresult: 0,
		electrresult: 0,
		heatingkwvalue: 0,
		electrpowerkwvalue: 0,
		heatingmaximum: 5000,
		heatingovermaximum: false,
		heatingpowersize: 0, // power size rounded up from heatingkwvalue
		prodmodalvalue: [],
		prodmodalCat: 0,
		IEDetection: false,
		heatValueForProd: [{ value: 0 }, { value: 0 }, { value: 0 }, { value: 0 }, { value: 0 }, { value: 0 }, { value: 0 }, { value: 0 }, { value: 0 }, { value: 0 }, { value: 0 }, { value: 0 }],
		biogasproducers: [],
		usingIE: false,
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

		// i: function () {
		// 	return this.buildings[this.checkedid.length];
		// },
		// j: function () {
		// 	return 0;
		// },
		final: function () {
			if (this.buildingcategory === 3) {
				return true;
			} else {
				return false;
			}
		},
		first: function () {
			if (this.buildingcategory === 0) {
				return true;
			} else {
				return false;
			}
		},
		firstselected: function () {
			if (this.checkedid.length === 0) {
				return false;
			} else {
				return true;
			}
		},
		progressCurrent: function () {
			return this.buildingcategory + 1;
		},
		progressTotal: function () {
			return 4;
		},
		progressPercentage: function () {
			if (this.buildingcategory === 0) {
				this.catMessage = 'Asuinrakennus';
			}
			if (this.buildingcategory === 1) {
				this.catMessage = 'Muu rakennus';
			}
			if (this.buildingcategory === 2) {
				this.catMessage = 'Tuotantorakennus';
			}
			if (this.buildingcategory === 3) {
				this.catMessage = 'Kuivuri';
			}

			return (((this.buildingcategory + 1) / 4) * 100);
		},

	},
	watch: {
		 /* heatingovermaximum: {
		 	handler: function (val, oldVal) {
		 		if (this.heatingovermaximum) document.getElementById("calcbtn").disabled = true;
		 		else document.getElementById("calcbtn").disabled = false;
		 	},
			deep: true
		}, */
		heatingkwvalue: {
			handler: function (val, oldVal) {
				if(val > this.heatingmaximum) {	this.heatingovermaximum = true;	}	 
				else { this.heatingovermaximum = false; } 
			},
			deep: true
		},
		consumers: {
			handler: function (val, oldVal) {
				console.log('consumer');
				this.prodresults();
			},
			deep: true
		},
		producers: {
			handler: function (val, oldVal) {
				this.result = Math.round(this.producers[0].heating_kwh / this.consumers[0].heating_kwh) + 100 + "%";
			},
			deep: true
		},
		heating: {
			handler: function (val, oldVal) {
				var yearlyTotal = 0;
				for (var i = 0; i < val.length; i++) {
					yearlyTotal += Math.floor(val[i].value);
				}
				this.heatValueForProd = val;
				var resultPlaceholder = parseInt(Math.round(yearlyTotal)).toLocaleString();
				resultPlaceholder = resultPlaceholder.replace(/,/g," ");
				this.result = resultPlaceholder;
				this.heatresult = parseFloat(yearlyTotal).toFixed(2);
				
				this.avgHeating = parseInt(Math.round(yearlyTotal / 12)).toLocaleString();
				var eConsumptionValue = this.eConsumption;
				var eyearlyTotal = 0;
				for (var f = 0; f < val.length; f++) {
					eyearlyTotal += Math.floor(eConsumptionValue[f].value);
				}
				var eResultPlaceholder = parseInt(Math.round(eyearlyTotal)).toLocaleString();
				eResultPlaceholder = eResultPlaceholder.replace(/,/g," ");
				this.eResult = eResultPlaceholder;
				
				
				this.electrresult = parseFloat(eyearlyTotal).toFixed(2);	
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
						colors: ['#C52F03', '#328FB2']
					};

					var chart = new google.visualization.ColumnChart(document.getElementById('resultchart'));
					chart.draw(data, options);
				}
			},
			deep: true
		},
		modalValue: { //tämä tarvitaan
			handler: function (val, oldVal) {
				console.log("Modal Graph Active");
				console.log(val);

				this.$http.get('http://niisku.lamk.fi/~informe/informeapi/public/consumers/' + val.id + '/energy').then(function (response) {
					console.log(response.data);
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
							['Loka', Number(val.october), Number(eValue.october)],none
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
				console.log("val: " + val);
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
				
				console.log(this.heatProdSum);
				
				if (this.prodmodalCat === 1){
					console.log("Modal Graph Active");
					console.log(val);
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
							height: 500
						};
						
						

						var chart = new google.visualization.ColumnChart(document.getElementById('prodmodalchart'));

						chart.draw(data, options);
					}
				}
				else{
					console.log("Modal Graph Active");
					console.log(val);
					var eConsumptionValue = this.eConsumption;
					var eyearlyTotal = 0;
					for (var f = 0; f < val.length; f++) {
						eyearlyTotal += Math.floor(eConsumptionValue[f].value);
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
							height: 500
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
			console.log("Disclaimer accepted")
		},
		heatingresults: function (event) {
			var values = [];
			for (var i = 0; i < this.checkedid.length; i++) {
				this.$http.get('http://niisku.lamk.fi/~informe/informeapi/public/consumers/' + this.checkedid[i] + '/heating', { params: {} }).then(
					function (response) {
						// this.heatingkwvalue += parseInt(response.data.consumer.heatingkw);
						months = ['january', 'february', 'march', 'april', 'may', 'june', 'july', 'august', 'september', 'october', 'november', 'december'];

						for (var j = 0; j <= 11; j++) {
							this.heating[j].value += Math.floor(response.data[months[j]]);
						}
						this.kWhvalue.push(response.data);  //adds the received object to kWhvalue			

					}, function (error) {
						// handle error
					});
			}
		},
		econsumptionresult: function (event) {
			for (var val = 0; val < this.checkedid.length; val++) {
				this.$http.get('http://niisku.lamk.fi/~informe/informeapi/public/consumers/' + this.checkedid[val] + '/energy', { params: {} }).then(
					function (response) {
						months = ['january', 'february', 'march', 'april', 'may', 'june', 'july', 'august', 'september', 'october', 'november', 'december'];

						for (var j = 0; j <= 11; j++) {
							this.eConsumption[j].value += Math.floor(response.data[months[j]]);
						}
					}, function (error) {
						// handle error
					});
			}
		},
		modali: function (id) {
			$("#resultmodal").modal()
			this.$http.get('http://niisku.lamk.fi/~informe/informeapi/public/consumers/' + id + '/heating').then(function (response) {
				console.log(response.data);
				this.modalValue = response.data;
			});
		},
		// next: function () {
		// 	this.buildingcategory++;
		// },
		// back: function () {
		// 	this.buildingcategory--;
		// },
		select: function (event) {
			var cons = this.consumerlist[0];

			for (i=0; i < cons.length; i++){
				if (cons[i].id == event.currentTarget.id) {
					this.heatingkwvalue += parseInt(cons[i].heatingkw);
					this.electrpowerkwvalue += parseInt(cons[i].electrkw);
				}
			}
	
			this.checkedid.push(event.currentTarget.id);
		},
		unselect: function (event) {
			var cons = this.consumerlist[0];
			
			for (i=0; i < cons.length; i++){
				if (cons[i].id == event.currentTarget.id) {
					this.heatingkwvalue -= parseInt(cons[i].heatingkw);
					this.electrpowerkwvalue -= parseInt(cons[i].electrkw);
				}
			}

			this.checkedid.splice(this.checkedid.indexOf(event.currentTarget.id), 1);
		},
		countchecked: function (itemid) {
			var checked = 0;

			this.checkedid.forEach(function(item, index) {
				//console.log(item, index);
				if (itemid == item) {
					checked++;
				}
				
			});

			return checked;
		},
		calculate: function () {
			var radios = document.getElementsByName('radio');

			for (var i = 0, length = radios.length; i < length; i++) {
				if (radios[i].checked) {
					// do whatever you want with the checked radio
					this.checkedid.push(radios[i].value);
					// only one radio can be logically checked, don't check the rest
					break;
				}
			}
			this.econsumptionresult();
			this.heatingresults();
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

					Vue.set(this.volumelist, 0, vollist[3]);
					Vue.set(this.volumelist, 1, vollist[2]);
					Vue.set(this.volumelist, 2, vollist[0]);
					Vue.set(this.volumelist, 3, vollist[1]);		
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
		heatingCatTextSelect: function (HeatCatTextSelect){
			var x = HeatCatTextSelect;
			console.log(x);
				if(x == 1){	
					this.HCTS = "Alla olevissa kuvakkeissa näet valitsemiesi kohteiden lämmitystarvetta vastaavan polttoaineen määrän vuodessa. Klikkaamalla kuvaketta voit tarkastella soveltuvia tekniikoita ja lämmöntuotannon jakautumista kuukausitasolla.";
				} else if (x == 2) {
					this.HCTS = "Alla olevissa kuvakkeissa näet valitsemiesi kohteiden lämmitystarvetta vastaavan polttoaineen määrän vuodessa. Klikkaamalla kuvaketta voit tarkastella soveltuvia tekniikoita ja lämmöntuotannon jakautumista kuukausitasolla.";
				} else if (x == 3) {
					this.HCTS = "Alla olevissa kuvakkeissa näet valitsemiesi kohteiden lämmitystarvetta vastaavan biokaasun syötteen määrän vuodessa. Klikkaamalla kuvaketta voi tarkastella soveltuvia tekniikoita ja eri kokoisia biokaasulaitoksia.";					
				} else if (x == 4){
					this.HCTS = "Alla olevissa kuvakkeissa näet valitsemiesi kohteiden tehon tarvetta vastaavan maa- tai vesilämpöputkiston pituuden. Klikkaamalla kuvaketta voit tarkastella soveltuvia tekniikoita ja lämmöntuotannon jakautumista kuukausitasolla";
				} else {
					this.HCTS = null;
				}
			console.log(this.HCTS);
		},
		heatingprods: function (energycat, materialcat) {
			console.log("Energy category: "+energycat+", Material category: "+materialcat);

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
			
			console.log("nextproductionscale r: "+r);

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
			
			console.log("lastproductionscale r: "+r);

			return r;
		},
		electrprods: function (energycat, materialcat, kwsize, panelang, paneldir) {
			console.log(energycat, materialcat, kwsize, panelang, paneldir)
			this.finalpage = [];
			var producers = this.producerlist[0];
			for (i=0; i<producers.length; i++) {
				if (producers[i].energycategory == energycat &&
					producers[i].materialcategory == materialcat &&
					producers[i].electrpowerkw == kwsize &&
					producers[i].panelangle == panelang &&
					producers[i].paneldirection == paneldir
					) {
						Vue.set(this.finalpage, 0, producers[i]);
						this.prodstep = 3;
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

			console.log(energycat, materialcat, powersize, electrpowersize);

			if (energycat == 2) {
				for (i=0; i<allproducers.length; i++) {
					this.prodmodalCat = 2;
					if (allproducers[i].energycategory == energycat &&
						allproducers[i].materialcategory == materialcat &&
						allproducers[i].electrpowerkw == electrpowersize &&
						allproducers[i].panelangle == panelang &&
						allproducers[i].paneldirection == paneldir
						) {
							console.log(allproducers[i].materialcategory);
							this.prodmodalvalue = allproducers[i];
						}
				}
				
			} else {
				for (i=0; i<allproducers.length; i++) {
					this.prodmodalCat = 1;
					if (allproducers[i].energycategory == energycat &&
						allproducers[i].materialcategory == materialcat &&
						allproducers[i].energysource == energysrc &&
						allproducers[i].heatingpowerkw == powersize) {
							console.log(allproducers[i].materialcategory);
							this.prodmodalvalue = allproducers[i];
						}
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
			console.log(energycat, materialcat, energysource, heatingpowerkw)
			var producers = this.producerlist[0];

			for (i=0, j=0; i<producers.length; i++) {
				if (producers[i].energycategory == energycat
					&& producers[i].materialcategory == materialcat
					&& producers[i].energysource == energysource
					&& producers[i].heatingpowerkw == heatingpowerkw) {
						Vue.set(this.finalpage, j, producers[i]);
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
					console.log("Category "+allcategories[z].materialcatname+" added to availablecategories.")
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
				console.log("IE detected");
				return true;
			}
			else {
				return false;
			}
		},
	}
});