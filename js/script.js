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
		prodParams: [],
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
	},
	created: function () {

		// Check disclaimer cookie
		var disclaimercookie = getCookie("disclaimeraccepted");
		if (disclaimercookie == "true") {
			this.showDisclaimer = false;
		}

		function getCookie(cname) {
			var name = cname + "=";
			var decodedCookie = decodeURIComponent(document.cookie);
			var ca = decodedCookie.split(';');
			for (var i = 0; i < ca.length; i++) {
				var c = ca[i];
				while (c.charAt(0) == ' ') {
					c = c.substring(1);
				}
				if (c.indexOf(name) == 0) {
					return c.substring(name.length, c.length);
				}
			}

			return "";
		}

		this.populate();

	},
	
		browerdetection: function () {
		var ua = window.navigator.userAgent;

		  var msie = ua.indexOf('MSIE ');
		  if (msie > 0) {
			// IE 10 or older => return version number
			this.IEdetection = true;
			return parseInt(ua.substring(msie + 5, ua.indexOf('.', msie)), 10); //returns the version number
		  }

		  var trident = ua.indexOf('Trident/');
		  if (trident > 0) {
			// IE 11 => return version number
			var rv = ua.indexOf('rv:');
			this.IEdetection = true;
			return parseInt(ua.substring(rv + 3, ua.indexOf('.', rv)), 10);
		  }

		  var edge = ua.indexOf('Edge/');
		  if (edge > 0) {
			// Edge (IE 12+) => return version number
			this.IEdetection = true;
			return parseInt(ua.substring(edge + 5, ua.indexOf('.', edge)), 10);
		  }

		  // other browser
		  return false;
		
	},
	
	computed: {

		i: function () {
			return this.buildings[this.checkedid.length];
		},
		j: function () {
			return 0;
		},
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
		heatingovermaximum: {
						handler: function (val, oldVal) {
				if (this.heatingovermaximum) document.getElementById("calcbtn").disabled = true;
				else document.getElementById("calcbtn").disabled = false;
			},
			deep: true
		},
		heatingkwvalue: {
			handler: function (val, oldVal) {
				if (val > this.heatingmaximum) this.heatingovermaximum = true;
				else this.heatingovermaximum = false;
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
						vAxis: { format: 'decimal' },
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
							['Loka', Number(val.october), Number(eValue.october)],
							['Marras', Number(val.november), Number(eValue.november)],
							['Joulu', Number(val.december), Number(eValue.december)],
						]);

						var options = {
							title: 'Lämmitysenergian ja laitesähkön kulutus kohteelle (kWh / kk): ' + val.consumer.use,
							legend: { position: 'bottom' },
							bars: 'vertical',
							vAxis: { format: 'decimal' },
							colors: ['#C52F03', '#328FB2']
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
				console.log(val);
			},
			deep: true
		},
		prodmodalvalue: { 
			handler: function (val, oldVal) {
				if (this.prodmodalCat == 1){
					console.log("Modal Graph Active");
					console.log(val);
					var heatVal = this.heatValueForProd;
					google.charts.load('current', { 'packages': ['corechart'] });
					google.charts.setOnLoadCallback(drawChart);
					function drawChart() {
						var data = google.visualization.arrayToDataTable([
							['Kuukausi', 'Tuotettu Lämpö' , 'Lämmön Tarve'],
							['Tammi', Number(parseInt(val.heatjanuary)), heatVal[0].value],
							['Helmi', Number(parseInt(val.heatfebruary)), heatVal[1].value],
							['Maalis', Number(parseInt(val.heatmarch)), heatVal[2].value],
							['Huhti', Number(parseInt(val.heatapril)), heatVal[3].value],
							['Touko', Number(parseInt(val.heatmay)), heatVal[4].value],
							['Kesä', Number(parseInt(val.heatjune)), heatVal[5].value],
							['Heinä', Number(parseInt(val.heatjuly)), heatVal[6].value],
							['Elo', Number(parseInt(val.heataugust)), heatVal[7].value],
							['Syys', Number(parseInt(val.heatseptember)), heatVal[8].value],
							['Loka', Number(parseInt(val.heatoctober)), heatVal[9].value],
							['Marras', Number(parseInt(val.heatnovember)), heatVal[10].value],
							['Joulu', Number(parseInt(val.heatdecember)), heatVal[11].value],
						]);

						var options = {
							title: 'Arvioitu lämmitysenergian tuotanto ja tarve (kWh / kk)',
							legend: { 'position': 'right'},
							bars: 'vertical',
							vAxis: { format: 'decimal' },
							colors: ['#FE7621', '#C52F03'],
							height: 550,
							width: 850
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
							legend: { 'position': 'right'},
							bars: 'vertical',
							vAxis: { format: 'decimal' },
							colors: ['#328FB2', '#085978'],
							height: 550,
							width: 850
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
		next: function () {
			this.buildingcategory++;
		},
		back: function () {
			this.buildingcategory--;
		},
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

					Vue.set(this.volumelist, 0, vollist[3]);	// NUMEROT SEKASIN!
					Vue.set(this.volumelist, 1, vollist[2]);
					Vue.set(this.volumelist, 2, vollist[0]);
					Vue.set(this.volumelist, 3, vollist[1]);	// NUMEROT SEKASIN!			
				}, function (error) {
					// handle error
				});		

			// // Asuinrakennukset
			// this.$http.get('http://niisku.lamk.fi/~informe/informeapi/public/consumers?id=true&type=Asuinrakennus', { params: {} }).then(
			// 	function (response) {
			// 		Vue.set(this.volumelist, 0, response.data);
			// 	}, function (error) {
			// 		// handle error
			// 	});

			// // Muut rakennukset
			// this.$http.get('http://niisku.lamk.fi/~informe/informeapi/public/consumers?id=true&type=muurakennus', { params: {} }).then(
			// 	function (response) {
			// 		Vue.set(this.volumelist, 1, response.data);
			// 	}, function (error) {
			// 		// handle error
			// 	});

			// // Tuotantorakennukset
			// this.$http.get('http://niisku.lamk.fi/~informe/informeapi/public/consumers?id=true&type=tuotantorakennus', { params: {} }).then(
			// 	function (response) {
			// 		Vue.set(this.volumelist, 2, response.data);
			// 	}, function (error) {
			// 		// handle error
			// 	});

			// // Kuivurit
			// this.$http.get('http://niisku.lamk.fi/~informe/informeapi/public/consumers?id=true&type=kuivuri', { params: {} }).then(
			// 	function (response) {
			// 		Vue.set(this.volumelist, 3, response.data);
			// 	}, function (error) {
			// 		// handle error
			// 	});

			// Kaikki tuotantopuolen rakennukset
			this.$http.get('http://niisku.lamk.fi/~informe/informeapi/public/productions', { params: {} }).then(
				function (response) {
					Vue.set(this.producerlist, 0, response.data);
				}, function (error) {
					// handle error
				});

			// Energycategory 1 
			this.$http.get('http://niisku.lamk.fi/~informe/informeapi/public/productions?energycategory=1', { params: {} }).then(
				function (response) {
					Vue.set(this.prodlist, 0, response.data);
				}, function (error) {
					// handle error
				});

			// Energycategory 2
			this.$http.get('http://niisku.lamk.fi/~informe/informeapi/public/productions?energycategory=2', { params: {} }).then(
				function (response) {
					Vue.set(this.prodlist, 1, response.data);
				}, function (error) {
					// handle error
				});

			// Energycategory 3
			this.$http.get('http://niisku.lamk.fi/~informe/informeapi/public/productions?energycategory=3', { params: {} }).then(
				function (response) {
					Vue.set(this.prodlist, 2, response.data);
				}, function (error) {
					// handle error
				});
			
			// Materialcategory 1
			this.$http.get('http://niisku.lamk.fi/~informe/informeapi/public/productions?materialcategory=1', { params: {} }).then(
				function (response) {
					Vue.set(this.materiallist, 0, response.data);
				}, function (error) {
					// handle error
				});
			
			// Materialcategory 2
			this.$http.get('http://niisku.lamk.fi/~informe/informeapi/public/productions?materialcategory=2', { params: {} }).then(
				function (response) {
					Vue.set(this.materiallist, 1, response.data);
				}, function (error) {
					// handle error
				});
			
			// Materialcategory 3
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
		},

		//clears after results
		clearresults: function () {		
				this.yearlyTotal = 0;
				this.result = 0;
				this.HCTS = NULL;
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
			console.log(energycat, materialcat);
			var r = 0;
			r = this.roundtonearest(energycat, materialcat);
			console.log("heatingprods r: "+r);
			this.heatingpowersize = r;
			this.$http.get('http://niisku.lamk.fi/~informe/informeapi/public/productions?energycategory='+energycat+'&materialcategory='+materialcat+'&heatingpowerkw='+r, {params:  {}} ).then(
				function (response) {
					Vue.set(this.finalpage, 0, response.data);
					this.prodstep = 3;
				}, function (error) {
					//handle error
			});
		},
		electrprods: function (energycat, materialcat, kwsize, panelang, paneldir) {
			console.log(energycat, materialcat, kwsize, panelang, paneldir)
			this.$http.get('http://niisku.lamk.fi/~informe/informeapi/public/productions?energycategory='+energycat+'&materialcategory='+materialcat+'&electrpowerkw='+kwsize+'&panelangle='+panelang+'&paneldirection='+paneldir, {params:  {}} ).then(
				function (response) {
					Vue.set(this.finalpage, 0, response.data);
					this.prodstep = 3;		
				}, function (error) {
					//handle error
			});
			this.prodstep = 3;
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
		roundtonearest: function (energycat, materialcat) {
			console.log("roundtonearestt"+energycat, materialcat);
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
			
			console.log("roundtonearest r: "+r);

			return r;
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
		}
	}
});

vm.populate();  