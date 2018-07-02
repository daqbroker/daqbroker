var global_dates;
var whatthefuck;
function start_slider(start_date,end_date){
	//Excpects you to have created a div called "slider" on your HTML main page
	var start_slider=new Date(start_date);
	var end_slider=new Date(end_date);
	var start_slider_time_default;
	var end_slider_time_default;
	if(typeof startTime !== 'undefined'){
		start_slider_time_default=startTime;
	}
	else{
		start_slider_time_default=(end_slider.getTime()+start_slider.getTime())/2 - (end_slider.getTime()-start_slider.getTime())/20;
	}
	if(typeof endTime !== 'undefined'){
		end_slider_time_default=endTime;
	}
	else{
		end_slider_time_default=(end_slider.getTime()+start_slider.getTime())/2 + (end_slider.getTime()-start_slider.getTime())/20;
	}
	var start_slider_default=new Date(Number(start_slider_time_default));
	var end_slider_default=new Date(Number(end_slider_time_default));
	var data_return;
	if('startTime' in globalObject){
		var defaultDateMin=new Date(Number(globalObject.startTime));
	}
	else{
		var defaultDateMin=start_slider_default;
	}
	if('endTime' in globalObject){
		var defaultDateMax=new Date(Number(globalObject.endTime));
	}
	else{
		var defaultDateMax=end_slider_default;
	}
	if(defaultDateMax.getTime()-defaultDateMin.getTime()>7*3610000){
		r=confirm('You are requesting a large ammount of time! This will most likely take long. Are you sure you want to continue? (Otherwise we just put this at one hour)');
		if(!r){
			defaultDateMax=new Date(defaultDateMin.getTime()+3610000);
		}
	}
	$("#slider").dateRangeSlider({
	bounds:{
		min: new Date(start_slider.getFullYear(),start_slider.getMonth(),start_slider.getDate(),start_slider.getHours(),start_slider.getMinutes(),start_slider.getSeconds()),
		max: new Date(end_slider.getFullYear(),end_slider.getMonth(),end_slider.getDate(),end_slider.getHours(),end_slider.getMinutes(),end_slider.getSeconds())},
	defaultValues:{
		min: defaultDateMin,
		max: defaultDateMax
	},
	formatter:function(val){
		var days = val.getUTCDate();
		if(Number(days)<10){
			days='0'+days;
		}
		var month = val.getUTCMonth() + 1;
		if(Number(month)<10){
			month='0'+month;
		}
		var year = val.getUTCFullYear();
		var hours = val.getUTCHours();
		if(Number(hours)<10){
			hours='0'+hours;
		}
		var minutes = val.getUTCMinutes();
		if(Number(minutes)<10){
			minutes='0'+minutes;
		}
		var seconds = val.getUTCSeconds();
		if(Number(seconds)<10){
			seconds='0'+seconds;
		}
		return days + "/" + month + "/" + year + "\n" + hours + ":" + minutes + ":" + seconds ;
	}
	});

	if(globalObject.visionType=='0'){
		plotThePlot(globalObject,defaultDateMin.getTime(),defaultDateMax.getTime());
	}
	if(globalObject.visionType=='1'){
		for (var i=0; i<globalObject.plots.length; i++){
			plotThePlot(globalObject.plotObjects[i],defaultDateMin.getTime(),defaultDateMax.getTime());
		}
	}
	$("#slider").on("valuesChanged", function(e, limits){
		globalObject['autoUpdate']=$("#onlinePlot").prop('checked');
		var dataMin=limits.values.min.getTime();//-limits.values.min.getTimezoneOffset()*60;
		var dataMax=limits.values.max.getTime();//-limits.values.max.getTimezoneOffset()*60;
		if(dataMax-dataMin>3610000){
			$("#onlinePlot").prop("checked",false);
			onlinePlot=0;
		}
		//data_return=query_database_instrument(masterChartVariable.channels,dataMin,dataMax,sortOrder);
		if(globalObject.visionType=='0'){
			plotThePlot(globalObject,dataMin,dataMax);
		}
		if(globalObject.visionType=='1'){
			for (var i=0; i<globalObject.plots.length; i++){
				plotThePlot(globalObject.plotObjects[i],dataMin,dataMax);
			}
		}
		var variable=0;
		$("#slider").find(".ui-rangeSlider-label-value").each(function(){
			var textSlider=$(this).html().replace('\n',' ');
			if(variable==0){
				var positioning='left';
				var startOrEnd='start';
			}
			else if(variable==1){
				var positioning='right';
				var startOrEnd='end';
			}
			$(this).unbind('click');
			if($(this).attr('class').search('tooltipstered')>0){
				$(this).tooltipster('destroy');
				$(this).attr('title','');
			}
			$(this).click(function(){
				$(this).tooltipster({
					content         :  $('<input type="text" style="width:20px" class="daterange'+startOrEnd+'" closedBySelect="false" name="daterange" value="'+textSlider+'"></a>'),
					position        :  positioning,
					trigger         :  'click',
					autoClose       :  false,
					interactive     :  true,
					functionReady   :  function(origin,tooltip){
						var dateMoment=moment(textSlider,'D/M/YYYY H:m:s');
						tooltip.find('.daterange'+startOrEnd).datetimepicker({
							closedBySelect:false,
							timeFormat  : 'H:m:s',
							dateFormat  : 'd/m/yy',
							onSelect    : function (date, options) {
								$(this).attr('closedBySelect','true');
							},
							onClose     : function(selectedDate){
								if($(this).attr('closedBySelect') == "true"){
									var newDateMoment=moment.utc(selectedDate,'D/M/YYYY H:m:s');
									if($(this).attr('class').search('daterangeend')>=0){
										$("#slider").dateRangeSlider('max',newDateMoment._d);
									}
									else if($(this).attr('class').search('daterangestart')>=0){
										$("#slider").dateRangeSlider('min',newDateMoment._d);
									}
								}
								else{
									origin.tooltipster('hide');
								}
							}
						});
						tooltip.find('.daterange'+startOrEnd).datetimepicker("setDate", dateMoment._d);
						tooltip.find('.daterange'+startOrEnd).datetimepicker("show");
					}
				});
			});
		});
		variable=variable+1;
		clearInterval(setTimerFunction)
		setTimerFunction=setInterval(checkUpdate, 30000);
	});
	
	$("#slider").on("userValuesChanged", function(e, limits){
		if(Number($("#intervalSlider").val())!=0){
			$("#intervalSlider").val('NULL');
		}
		//console.log(limits);
	});
	
	var variable=0;
	$("#slider").find(".ui-rangeSlider-label-value").each(function(){
		var textSlider=$(this).html().replace('\n',' ');
		if(variable==0){
			var positioning='left';
			var startOrEnd='start';
		}
		else if(variable==1){
			var positioning='right';
			var startOrEnd='end';
		}
		$(this).unbind('click');
		if($(this).attr('class').search('tooltipstered')>0){
			$(this).tooltipster('destroy');
			$(this).attr('title','');
		}
		$(this).click(function(){
			$(this).tooltipster({
				content         :  $('<input type="text" style="width:20px" class="daterange'+startOrEnd+'" closedBySelect="false" name="daterange" value="'+textSlider+'"></a>'),
				position        :  positioning,
				trigger         :  'click',
				autoClose       :  false,
				interactive     :  true,
				functionReady   :  function(origin,tooltip){
					var dateMoment=moment(textSlider,'D/M/YYYY H:m:s');
					tooltip.find('.daterange'+startOrEnd).datetimepicker({
						closedBySelect:false,
						timeFormat  : 'H:m:s',
						dateFormat  : 'd/m/yy',
						onSelect    : function (date, options) {
							$(this).attr('closedBySelect','true');
						},
						onClose     : function(selectedDate){
							if($(this).attr('closedBySelect') == "true"){
								var newDateMoment=moment.utc(selectedDate,'D/M/YYYY H:m:s');
								if($(this).attr('class').search('daterangeend')>=0){
									$("#slider").dateRangeSlider('max',newDateMoment._d);
								}
								else if($(this).attr('class').search('daterangestart')>=0){
									$("#slider").dateRangeSlider('min',newDateMoment._d);
								}
							}
							else{
								origin.tooltipster('hide');
							}
						}
					});
					tooltip.find('.daterange'+startOrEnd).datetimepicker("setDate", dateMoment._d);
					tooltip.find('.daterange'+startOrEnd).datetimepicker("show");
				}
			});
		});
//			.datetimepicker("setDate", new Date());
		variable=variable+1;
	});
}

function changeSliderVals(type,ammount){
	if(type=='dateSelector'){
		var startDate=$("#daterange").data('daterangepicker').startDate._d;
		var endDate=$("#daterange").data('daterangepicker').endDate._d;
		if(manualDate){
			$("#slider").dateRangeSlider("values", startDate, endDate);
			manualDate=0;
		}
		else{
			alert('Date not set!');
		}
	}
	if(type=='runSelector'){
		if(!isNaN($("#endRunTime")[0].value)){
			if($("#fromStartOrEnd")[0].value==0){
				var startDate=runs[$("#startRunTime")[0].value].start;
			}
			else{
				var startDate=runs[$("#startRunTime")[0].value].end;
			}
			if($("#toStartOrEnd")[0].value==0){
				var endDate=runs[$("#endRunTime")[0].value].start;
			}
			else{
				var endDate=runs[$("#endRunTime")[0].value].end;
			}
			var bounds= $("#slider").dateRangeSlider("bounds");
			//console.log(endDate);
			//console.log(startDate);
			//console.log(bounds.min.getTime());
			if(Number(endDate)>bounds.min.getTime()){
				$("#slider").dateRangeSlider("values", new Date(Number(startDate-10000)), new Date(Number(endDate+10000))); //add 10s of time to the timeframe so you see the runs starting and ending 
				$.fancybox.close();
			}
			else{
				alert('Chosen limits are below the time where there is data in the plot!')
			}
		}
		else{
			alert('Date not set!');
		}
	}
	if(type=='interval'){
		var startTime=$("#slider").dateRangeSlider("min").getTime();
		var endTime=$("#slider").dateRangeSlider("max").getTime();
		var limitMin=$("#slider").dateRangeSlider("bounds").min.getTime();
		var limitMax=$("#slider").dateRangeSlider("bounds").max.getTime();
		var interval=Number($(".selectTimeMiddle").val());
		var middle=(endTime+startTime)/2;
		if(middle+interval/2>limitMax){
			$("#slider").dateRangeSlider("values",new Date((middle-interval/2-(middle+interval/2-limitMax))),new Date((limitMax)));
		}
		else if(middle-interval/2<limitMin){
			$("#slider").dateRangeSlider("values",new Date(limitMin),new Date((middle+interval/2-(middle-interval/2-limitMin))));
		}
		else{
			$("#slider").dateRangeSlider("values",new Date((middle-interval/2)),new Date((middle+interval/2)));
		}
	}
	if(type=='buttonLeft'){
		console.log($("#slider").dateRangeSlider("min"));
		var startTime=$("#slider").dateRangeSlider("min").getTime();
		var endTime=$("#slider").dateRangeSlider("max").getTime();
		var limitMin=$("#slider").dateRangeSlider("bounds").min.getTime();
		var limitMax=$("#slider").dateRangeSlider("bounds").max.getTime();
		var interval=Number($(".selectTimeLeft").val());
		if(startTime-interval<limitMin){
				$("#slider").dateRangeSlider("values",new Date((limitMin)),new Date((limitMin+(endTime-startTime))));
		}
		else{
			$("#slider").dateRangeSlider("values",new Date((startTime-interval)),new Date((endTime-interval)));
		}
	}
	if(type=='buttonRight'){
		var startTime=$("#slider").dateRangeSlider("min").getTime();
		var endTime=$("#slider").dateRangeSlider("max").getTime();
		var limitMin=$("#slider").dateRangeSlider("bounds").min.getTime();
		var limitMax=$("#slider").dateRangeSlider("bounds").max.getTime();
		var interval=Number($(".selectTimeRight").val());
		if(endTime+interval>limitMax){
				$("#slider").dateRangeSlider("values",new Date((limitMax-(endTime-startTime))),new Date((limitMax)));
		}
		else{
			$("#slider").dateRangeSlider("values",new Date((startTime+interval)),new Date((endTime+interval)));
		}
	}
	if(type=='buttonRightResponsive'){
		var startTime=$("#slider").dateRangeSlider("min").getTime();
		var endTime=$("#slider").dateRangeSlider("max").getTime();
		var limitMin=$("#slider").dateRangeSlider("bounds").min.getTime();
		var limitMax=$("#slider").dateRangeSlider("bounds").max.getTime();
		var interval=ammount;
		if(endTime+interval>limitMax){
				$("#slider").dateRangeSlider("values",new Date((limitMax-(endTime-startTime))),new Date((limitMax)));
		}
		else{
			$("#slider").dateRangeSlider("values",new Date((startTime+interval)),new Date((endTime+interval)));
		}
		globalSelectedforResponsiveRight=ammount;
	}
	if(type=='buttonLeftResponsive'){
		var startTime=$("#slider").dateRangeSlider("min").getTime();
		var endTime=$("#slider").dateRangeSlider("max").getTime();
		var limitMin=$("#slider").dateRangeSlider("bounds").min.getTime();
		var limitMax=$("#slider").dateRangeSlider("bounds").max.getTime();
		var interval=ammount;
		if(startTime-interval<limitMin){
				$("#slider").dateRangeSlider("values",new Date((limitMin)),new Date((limitMin+(endTime-startTime))));
		}
		else{
			$("#slider").dateRangeSlider("values",new Date((startTime-interval)),new Date((endTime-interval)));
		}
		globalSelectedforResponsiveLeft=ammount
		isDefaultHiddenLeft=false;
	}
}

function setTimeDivisions(startTime,endTime){
	var difference=endTime-startTime;
	var lookingFor=['year(s)','month(s)','week(s)','day(s)','hour(s)','minute(s)','second(s)'];
	var timeLength=[3600000*24*365,3600000*24*30,3600000*24*7,3600000*24,3600000,60000,1000];
	var result={};
	for (var i=0; i<lookingFor.length; i++){
		while(difference>timeLength[i]){
			difference=difference/2;
			if(lookingFor[i] in result){
				if(result[lookingFor[i]].length==2){
					continue
				}
				else{
					if(Math.floor(difference/timeLength[i])>=1){
						result[lookingFor[i]].push({'actual':difference,'reality':Math.floor(difference/timeLength[i])*timeLength[i],'number':Math.floor(difference/timeLength[i])});
					}
				}
			}
			else{
				result[lookingFor[i]]=[];
				if(Math.floor(difference/timeLength[i])>=1){
					result[lookingFor[i]].push({'actual':difference,'reality':Math.floor(difference/timeLength[i])*timeLength[i],'number':Math.floor(difference/timeLength[i])});
				}
			}
		}
	}
	return result;
}
