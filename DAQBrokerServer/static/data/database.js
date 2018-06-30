var masterChartVariable={ };
var currentAjax;
var availableTraces=[];
var availableTracesNames=[];
var firstSmooth=1;

function secondEl(arr){
	return arr[1];
}

function round(number,decimal){
	var rounded=0;

	rounded=Math.floor(number*Math.pow(10,decimal));

	return rounded/Math.pow(10,decimal);
}

function onlyUnique(value, index, self) { 
    return self.indexOf(value) === index;
}

Array.prototype.getUnique = function(){
   var u = {}, a = [];
   for(var i = 0, l = this.length; i < l; ++i){
	  if(u.hasOwnProperty(this[i])) {
		 continue;
	  }
	  a.push(this[i]);
	  u[this[i]] = 1;
   }
   return a;
}

function getGet() {
	var search=window.location.search;
	var pattEq=/=/g;
	var pattQ=/\?/g;
	var pattAmp=/\&/g;
	var index=0;
	var vars={};
	vars.Names=[];
	vars.Values=[];
	var matchQ;
	var matchEq;
	var matchAmp;
	var matchEqIdx=[];
	var matchAmpIdx=[];
	while((matchEq=pattEq.exec(window.location.search))!=null){
		matchEqIdx[index]=matchEq.index;
		index=index+1;
	}
	index=0;
	while((matchAmp=pattAmp.exec(window.location.search))!=null){
		matchAmpIdx[index]=matchAmp.index;
		index=index+1;
	}
	for (var i=0; i<matchEqIdx.length; i++){
		if(i==0){
			vars.Names[i]=search.slice(1,matchEqIdx[i]);
		}
		else{
			vars.Names[i]=search.slice(matchAmpIdx[i-1]+1,matchEqIdx[i]);
		}
		if(i<matchEqIdx.length-1){
			vars.Values[i]=search.slice(matchEqIdx[i]+1,matchAmpIdx[i]);
		}
		else{
			vars.Values[i]=search.slice(matchEqIdx[i]+1,search.length);
		}
	}
	return vars;
}

function goBack(url){
	var database = location.search.split("=")[1];
	window.location.replace(url+'?dbname_select='+database);
}

var ajaxes=[];
var workers=[];
var theLoop=false;
var settingUp=false;
var reqID=false;

function userAborted(xhr) {
	return !xhr.getAllResponseHeaders();
}

function plotThePlot(objc,startTime,endTime){
	objc['reqID']=uniqueId();
	/* if(!('reqID' in objc)){
	}
	else{
		$.ajax({
			url: '/data/getDataAbortStreamRequest',
			type: 'POST',
			dataType: "json",
			contentType: "application/json",
			data : JSON.stringify({'id':objc['reqID']})
		});
		objc['reqID']=uniqueId();
	} */
	if(workers.length>0){
		workersToDestroy=[];
		for (var j=0; j<workers.length; j++){
			workersToDestroy.push(workers[j].id);
		}
		$.ajax({
			url: '/data/getDataAbortStream',
			type: 'POST',
			dataType: "json",
			contentType: "application/json",
			data : JSON.stringify(workersToDestroy)
		});
		workers=[];
	}
	var size=175;
	objc['channelData']=[];
	objc['binChannelData']=[];
	objc['dataChannelData']=[];
	if(Number(objc.visionType)==0){//Single plots, new or old
		$('#'+objc.plotDiv).prepend('<img class="loading" src="/static/loading.gif" style="zindex:10000;margin:auto;text-align:center;position:absolute;top:30%;left:50%" width="'+(size/2)+'" height="'+(size/2)+'"></img>');
		$('#'+objc.plotDiv).find('.plot-container').css({'opacity':0.5});
		objc['startTime']=startTime;
		objc['endTime']=endTime;
		if(settingUp){
			settingUp.abort();
		}
		if(theLoop){
			console.log("loopgone");
			clearTimeout(theLoop);
		}
		
		ajaxes=[];
		workers=[];
		var firstPlot=false;
		if(!('plotOptions' in objc)){
			objc['plotOptions']={};
			objc.plotOptions['channelOptions']=[];
			objc.plotOptions['showRuns']=false;
			objc.plotOptions['multiAxis']=false;
			objc.plotOptions['plotTitle']='Single Plot';
			firstPlot=true;
		}
		else{
			if(!('channelOptions' in objc.plotOptions)){
				objc.plotOptions['channelOptions']=[];
				firstPlot=true;
			}
			else{
				if(objc.plotOptions.channelOptions.length<objc.channels.length){//Unexpected error
					objc.plotOptions['channelOptions']=[];
					firstPlot=true;
				}
			}
		}
		var theDiv=$(objc.plotDiv);
		var returns=[];
		if(objc.plotType==0){//Timeseries
			objc.plotOptions['plotType']=objc.plotType;
			var postData=[]
			for (var j=0; j<objc.channels.length; j++){
				objc.channelData.push({});
				if(firstPlot){
					objc.plotOptions.channelOptions.push({'fullResolution':'0'});
				}
				var postDataOne={
					'startTime'      :  startTime,
					'endTime'        :  endTime,
					'channelid'      :  0,
					'screenSize'     :  screen.width,
					'dbname'         :  dbname,
					'fullResolution' :  objc.plotOptions.channelOptions[j].fullResolution,
					'type'           :  'data'
				};
				if(typeof objc.channels[j]==='object'){
					postDataOne['channelid']=objc.channels[j].channelid;
					postDataOne['channelName']=objc.channels[j].name;
				}
				else{
					postDataOne['channelid']=Number(objc.channels[j]);
				}
				postData.push(postDataOne);
			}
			if('customTraces' in objc){
				for (var j=0; j<objc.customTraces.length; j++){
					var postDataCustom={
						'startTime'      :  startTime,
						'endTime'        :  endTime,
						'expression'     :  objc.customTraces[j].expression,
						'expressionName' :  objc.customTraces[j].name,
						'expressionIdx'  :  j,
						'screenSize'     :  screen.width,
						'dbname'         :  dbname,
						'type'           :  'expression'
					};
					postData.push(postDataCustom);
					if(firstPlot){
						objc.plotOptions.channelOptions.push({'fullResolution':'0'});
					}
				}
			}
			var streamPort=false;
			settingUp=$.ajax({
				url: '/data/getDataStream',
				type: 'POST',
				dataType: "json",
				contentType: "application/json",
				data : JSON.stringify({'jobRequests':postData,'database':dbname,'reqID':objc['reqID']}),
				success: function(returned){
					workers=returned;
					var ongoing=false;
					theLoop=setInterval(function(){
						if(!ongoing){
							ongoing=true;
							ajaxes=[];
							returns=[];
							var workersToDestroy=[]
							//for (var j=0; j<workers.length; j++){
							ajaxes.push(
								$.ajax({
									url: '/data/getDataCheckStream',
									type: 'POST',
									dataType: "json",
									contentType: "application/json",
									data : JSON.stringify({'jobs':workers,'database':dbname}),
									success: function(returned){
										var allDone=true;
										var errorChanns=[];
										var emptyChanns=[];
										var foundError=false;
										var foundEmpty=false;
										for (var i=0; i<returned.length; i++){
											console.log(typeof returned[i].data);
											if(returned[i].status==-1){//Error in process
												if(returned[i].type.type=="data"){
													errorChanns.push(returned[i].type.channelName);
													for (var j=0; j<objc.channels.length; j++){
														if(typeof objc.channels[j]==='object'){
															var thisChannelid=objc.channels[j].channelid;
														}
														else{
															var thisChannelid=Number(objc.channels[j]);
														}
														if(thisChannelid==Number(returned[i].type.channelid)){
															objc.channelData[j]=false;
														}
													}
												}
												else if(returned[i].type=="expression"){
													errorChanns.push(returned[i].type.expressionName);
													for (var j=0; j<objc.customTraces.length; j++){
														if(j==returned[i].type.expressionIdx){
															var actualIndex=objc.channels.length+j;
															objc.channelData[actualIndex]=false;
														}
													}
												}
												foundError=true;
												foundEl=workers.findIndex(function(el){return el.id==returned[i].jobid});
												if(foundEl>=0){
													workersToDestroy.push(workers[foundEl].id);
													workers.splice(foundEl,1)
												}
											}
											else if(returned[i].status==1 || (typeof returned[i].data)==='object' ){//Success
												if(returned[i].data==-1){
													if(returned[i].type=="data"){
														errorChanns.push(returned[i].type.channelName);
														for (var j=0; j<objc.channels.length; j++){
															if(typeof objc.channels[j]==='object'){
																var thisChannelid=objc.channels[j].channelid;
															}
															else{
																var thisChannelid=Number(objc.channels[j]);
															}
															if(thisChannelid==Number(returned[i].type.channelid)){
																objc.channelData[j]=false;
															}
														}
													}
													else if(returned[i].type=="expression"){
														errorChanns.push(returned[i].type.expressionName);
														for (var j=0; j<objc.customTraces.length; j++){
															if(j==returned[i].type.expressionIdx){
																var actualIndex=objc.channels.length+j;
																objc.channelData[actualIndex]=false;
															}
														}
													}
													foundError=true;
													foundEl=workers.findIndex(function(el){return el.id==returned[i].jobid});
													if(foundEl>=0){
														workersToDestroy.push(workers[foundEl].id);
														workers.splice(foundEl,1)
													}
												}
												else if('data' in returned[i].data){
													console.log(returned[i].data.data);
													if(returned[i].data.data.length<=0){
														emptyChanns.push({
															'name':returned[i].name,
															'iname':returned[i].iname
														});
														foundError=true;
													}
													else{
														if(returned[i].type=="data"){
															for (var j=0; j<objc.channels.length; j++){
																if(typeof objc.channels[j]==='object'){
																	var thisChannelid=objc.channels[j].channelid;
																}
																else{
																	var thisChannelid=Number(objc.channels[j]);
																}
																if(thisChannelid==Number(returned[i].data.channelID)){
																	objc.channelData[j]=returned[i].data;
																	if(firstPlot){
																		objc.plotOptions.channelOptions[j]={
																			'color'    : defaultColors[j],
																			'smoothing' : 0,
																			'logscale' : false,
																			'comments' : false,
																		}
																	}
																	else{
																		if(Number(objc.plotOptions.channelOptions[j].smoothing)>0 && objc.channelData[j].data.length>0){
																			objc.channelData[j]['smoothedData']=smootheArray(objc.channelData[j].data,objc.plotOptions.channelOptions[j].smoothing);
																			objc.channelData[j].name=objc.channelData[j].name+ ' (MF '+objc.plotOptions.channelOptions[j].smoothing+'%)';
																		}
																	}
																	break
																}
															}
														}
														else if("customTraces" in objc && returned[i].type=='expression'){
															for (var j=0; j<objc.customTraces.length; j++){
																if(j==returned[i].type.expressionIdx){
																	var actualIndex=objc.channels.length+j;
																	objc.channelData[actualIndex]=returned[i].data;
																	objc.channelData[actualIndex]["name"]=objc.customTraces[j].name;
																	objc.channelData[actualIndex]["iname"]='exp';
																	if(firstPlot || ((typeof objc.plotOptions.channelOptions[actualIndex])==="undefined")){
																		objc.plotOptions.channelOptions[actualIndex]={
																			'color'    : defaultColors[actualIndex],
																			'smoothing' : 0,
																			'logscale' : false,
																			'comments' : false,
																		}
																	}
																	else{
																		if(Number(objc.plotOptions.channelOptions[actualIndex].smoothing)>0 && objc.channelData[actualIndex].data.length>0){
																			objc.channelData[actualIndex]['smoothedData']=smootheArray(objc.channelData[actualIndex].data,objc.plotOptions.channelOptions[actualIndex].smoothing);
																			objc.channelData[actualIndex].name=objc.channelData[actualIndex].name+ ' (MF '+objc.plotOptions.channelOptions[actualIndex].smoothing+'%)';
																		}
																	}
																	
																	break;
																}
															}
														}
													}
													foundEl=workers.findIndex(function(el){return el.id==returned[i].jobid});
													if(foundEl>=0){
														workers.splice(foundEl,1)
													}
												}
												//Should there be an 'else' clause here? let's hope not
												foundEl=workers.findIndex(function(el){return el.id==returned[i].jobid});
												if(foundEl>=0){
													workersToDestroy.push(workers[foundEl].id);
													workers.splice(foundEl,1)
												}
											}
											else if(returned[i].status==0){//Ongoing
												allDone=false;
												break
											}
										}
										if(allDone){
											$.ajax({
												url: '/data/getDataAbortStream',
												type: 'POST',
												dataType: "json",
												contentType: "application/json",
												data : JSON.stringify(workersToDestroy)
											});
											if(errorChanns.length>0){
												var n=new Noty({
													text      :  "There was an error collecting data from certain channels "+JSON.stringify(errorChanns),
													theme     :  'relax',
													type      :  'error',
													timeout   :  '10000'
												}).show();
											}
											if(emptyChanns.length>0){
												var n=new Noty({
													text      :  "Some channels did not have data in the requested time interval "+JSON.stringify(emptyChanns),
													theme     :  'relax',
													type      :  'warning',
													timeout   :  '10000'
												}).show();
											}
											$('#'+objc.plotDiv).find('.plot-container').css({'zIndex':1});
											$('#'+objc.plotDiv).find('.plot-container').css({'opacity':1});
											$('#'+objc.plotDiv).find('.loading').remove();
											objc.plotOptions.channelOptions=objc.plotOptions.channelOptions.filter(function(el){return objc.channelData[objc.plotOptions.channelOptions.indexOf(el)]!=false});
											objc.channelData=objc.channelData.filter(function(el){return el!=false});
											drawPlot(objc.plotDiv,objc.channelData,objc.plotOptions,startTime,endTime,objc);
											clearTimeout(theLoop);
										}
										ongoing=false;
									},
									error: function(returned){
										ongoing=false;
										var n=new Noty({
											text      :  "There was a problem reviewing the collected data, trying again | " + JSON.stringify(returned),
											theme     :  'relax',
											type      :  'error',
											timeout   :  '1000'
										}).show();
									}
								})
							);
						}
					},1000);
				},
				error: function(jqXHR, textStatus, errorThrown){
					if (userAborted(jqXHR)) {
						return;
					}
					var n=new Noty({
						text      :  "There was an error starting the data collector",
						theme     :  'relax',
						type      :  'warning',
					}).show();
				}
			});
		}
		if(objc.plotType==1){//Surface
			objc.plotOptions['plotType']=objc.plotType;
			objc.plotOptions['surfaceType']=objc.surfaceType;
			/*for (var j=0; j<objc.dataChannels.length; j++){
				objc.dataChannelData.push({});
				if(firstPlot){
					objc.plotOptions.channelOptions.push({});
				}
				var postData={
					'startTime'   :  startTime,
					'endTime'     :  endTime,
					'channelid'   :  0,
					'screenSize'  :  screen.width,
					'dbname'      : dbname
				};
				if(typeof objc.dataChannels[j]==='object'){
					postData['channelid']=objc.dataChannels[j].channelid;
				}
				else{
					postData['channelid']=Number(objc.dataChannels[j]);
				}
				ajaxes.push(
					$.ajax({
						url: '/data/getData',
						type: 'POST',
						dataType: "json",
						data : postData,
						success: function(returned){
							returns.push(returned);
						}
					})
				);
			}*/
			var postData=[]
			var postDataBins=[]
			for (var j=0; j<objc.channels.length; j++){
				objc.channelData.push({});
				if(firstPlot){
					objc.plotOptions.channelOptions.push({'fullResolution':false});
				}
				var postDataOne={
					'startTime'      :  startTime,
					'endTime'        :  endTime,
					'channelid'      :  0,
					'screenSize'     :  screen.width,
					'dbname'         :  dbname,
					'fullResolution' :  objc.plotOptions.channelOptions[j].fullResolution,
					'type'           :  'data'
				};
				if(typeof objc.channels[j]==='object'){
					postDataOne['channelid']=objc.channels[j].channelid;
					postDataOne['channelName']=objc.channels[j].name;
				}
				else{
					postDataOne['channelid']=Number(objc.channels[j]);
				}
				postData.push(postDataOne);
			}
			if(objc.surfaceType==1){
				for (var j=0; j<objc.binChannels.length; j++){
					objc.binChannelData.push({});
					if(firstPlot){
						objc.plotOptions.channelOptions.push({'fullResolution':false});
					}
					var postDataOne={
						'startTime'      :  startTime,
						'endTime'        :  endTime,
						'channelid'      :  0,
						'screenSize'     :  screen.width,
						'dbname'         :  dbname,
						'fullResolution' :  objc.plotOptions.channelOptions[j].fullResolution,
						'type'           :  'data'
					};
					if(typeof objc.binChannels[j]==='object'){
						postDataOne['channelid']=objc.binChannels[j].channelid;
						postDataOne['channelName']=objc.binChannels[j].name;
					}
					else{
						postDataOne['channelid']=Number(objc.binChannels[j]);
					}
					postData.push(postDataOne);
				}
			}
			var streamPort=false;
			settingUp=$.ajax({
				url: '/data/getDataStream',
				type: 'POST',
				dataType: "json",
				contentType: "application/json",
				data : JSON.stringify({'jobRequests':postData,'database':dbname,'reqID':objc['reqID']}),
				success: function(returned){
					workers=returned;
					var ongoing=false;
					theLoop=setInterval(function(){
						if(!ongoing){
							ongoing=true;
							ajaxes=[];
							returns=[];
							var workersToDestroy=[]
							//for (var j=0; j<workers.length; j++){
							ajaxes.push(
								$.ajax({
									url: '/data/getDataCheckStream',
									type: 'POST',
									dataType: "json",
									contentType: "application/json",
									data : JSON.stringify({'jobs':workers,'database':dbname}),
									success: function(returned){
										var allDone=true;
										var errorChanns=[];
										var emptyChanns=[];
										var foundError=false;
										var foundEmpty=false;
										for (var i=0; i<returned.length; i++){
											console.log(typeof returned[i].data);
											if(returned[i].status==-1){//Error in process
												if(returned[i].type.type=="data"){
													errorChanns.push(returned[i].type.channelName);
													for (var j=0; j<objc.dataChannels.length; j++){
														if(typeof objc.channels[j]==='object'){
															var thisChannelid=objc.channels[j].channelid;
														}
														else{
															var thisChannelid=Number(objc.dataChannels[j]);
														}
														if(thisChannelid==Number(returned[i].type.dataChannelid)){
															objc.channelData[j]=false;
														}
													}
													for (var j=0; j<objc.binChannels.length; j++){
														if(typeof objc.channels[j]==='object'){
															var thisChannelid=objc.binChannels[j].channelid;
														}
														else{
															var thisChannelid=Number(objc.binChannels[j]);
														}
														if(thisChannelid==Number(returned[i].type.channelid)){
															objc.binChannelData[j]=false;
														}
													}
												}
												foundError=true;
												foundEl=workers.findIndex(function(el){return el.id==returned[i].jobid});
												if(foundEl>=0){
													workersToDestroy.push(workers[foundEl].id);
													workers.splice(foundEl,1)
												}
											}
											else if(returned[i].status==1 || (typeof returned[i].data)==='object' ){//Success
												if(returned[i].data==-1){
													if(returned[i].type=="data"){
														errorChanns.push(returned[i].type.channelName);
														for (var j=0; j<objc.dataChannels.length; j++){
															if(typeof objc.dataChannels[j]==='object'){
																var thisChannelid=objc.dataChannels[j].channelid;
															}
															else{
																var thisChannelid=Number(objc.dataChannels[j]);
															}
															if(thisChannelid==Number(returned[i].type.channelid)){
																objc.channelData[j]=false;
															}
														}
														for (var j=0; j<objc.binChannels.length; j++){
															if(typeof objc.binChannels[j]==='object'){
																var thisChannelid=objc.binChannels[j].channelid;
															}
															else{
																var thisChannelid=Number(objc.binChannels[j]);
															}
															if(thisChannelid==Number(returned[i].type.channelid)){
																objc.binChannelData[j]=false;
															}
														}
													}
													foundError=true;
													foundEl=workers.findIndex(function(el){return el.id==returned[i].jobid});
													if(foundEl>=0){
														workersToDestroy.push(workers[foundEl].id);
														workers.splice(foundEl,1)
													}
												}
												else if('data' in returned[i].data){
													if(returned[i].data.data.length<=0){
														emptyChanns.push({
															'name':returned[i].name,
															'iname':returned[i].iname
														});
														foundError=true;
													}
													else{
														if(returned[i].type=="data"){
															for (var j=0; j<objc.dataChannels.length; j++){
																if(typeof objc.dataChannels[j]==='object'){
																	var thisChannelid=objc.dataChannels[j].channelid;
																}
																else{
																	var thisChannelid=Number(objc.dataChannels[j]);
																}
																if(thisChannelid==Number(returned[i].data.channelID)){
																	objc.channelData[j]=returned[i].data;
																	if(firstPlot){
																		objc.plotOptions.channelOptions[j]={
																			'color'    : defaultColors[j],
																			'smoothing' : 0,
																			'logscale' : false,
																			'comments' : false,
																		}
																	}
																	else{
																		if(Number(objc.plotOptions.channelOptions[j].smoothing)>0 && objc.channelData[j].data.length>0){
																			objc.channelData[j]['smoothedData']=smootheArray(objc.channelData[j].data,objc.plotOptions.channelOptions[j].smoothing);
																			objc.channelData[j].name=objc.channelData[j].name+ ' (MF '+objc.plotOptions.channelOptions[j].smoothing+'%)';
																		}
																	}
																	break
																}
															}
															for (var j=0; j<objc.binChannels.length; j++){
																if(typeof objc.binChannels[j]==='object'){
																	var thisChannelid=objc.binChannels[j].channelid;
																}
																else{
																	var thisChannelid=Number(objc.binChannels[j]);
																}
																if(thisChannelid==Number(returned[i].data.channelID)){
																	objc.binChannelData[j]=returned[i].data;
																}
															}
														}
													}
													foundEl=workers.findIndex(function(el){return el.id==returned[i].jobid});
													if(foundEl>=0){
														workers.splice(foundEl,1)
													}
												}
												//Should there be an 'else' clause here? let's hope not
												foundEl=workers.findIndex(function(el){return el.id==returned[i].jobid});
												if(foundEl>=0){
													workersToDestroy.push(workers[foundEl].id);
													workers.splice(foundEl,1)
												}
											}
											else if(returned[i].status==0){//Ongoing
												allDone=false;
												break
											}
										}
										if(allDone){
											$.ajax({
												url: '/data/getDataAbortStream',
												type: 'POST',
												dataType: "json",
												contentType: "application/json",
												data : JSON.stringify(workersToDestroy)
											});
											if(errorChanns.length>0){
												var n=new Noty({
													text      :  "There was an error collecting data from certain channels "+JSON.stringify(errorChanns),
													theme     :  'relax',
													type      :  'error',
													timeout   :  '10000'
												}).show();
											}
											else if(emptyChanns.length>0){
												var n=new Noty({
													text      :  "Some channels did not have data in the requested time interval "+JSON.stringify(emptyChanns),
													theme     :  'relax',
													type      :  'warning',
													timeout   :  '10000'
												}).show();
											}
											else{
												$('#'+objc.plotDiv).find('.plot-container').css({'zIndex':1});
												$('#'+objc.plotDiv).find('.plot-container').css({'opacity':1});
												$('#'+objc.plotDiv).find('.loading').remove();
												objc.plotOptions.channelOptions=objc.plotOptions.channelOptions.filter(function(el){return objc.channelData[objc.plotOptions.channelOptions.indexOf(el)]!=false});
												objc.channelData=objc.channelData.filter(function(el){return el!=false});
												drawPlot(objc.plotDiv,objc.channelData,objc.plotOptions,startTime,endTime,objc);
												clearTimeout(theLoop);
											}
										}
										ongoing=false;
									},
									error: function(returned){
										ongoing=false;
										var n=new Noty({
											text      :  "There was a problem reviewing the collected data, trying again | " + JSON.stringify(returned),
											theme     :  'relax',
											type      :  'error',
											timeout   :  '1000'
										}).show();
									}
								})
							);
						}
					},1000);
				},
				error: function(jqXHR, textStatus, errorThrown){
					if (userAborted(jqXHR)) {
						return;
					}
					var n=new Noty({
						text      :  "There was an error starting the data collector",
						theme     :  'relax',
						type      :  'warning',
					}).show();
				}
			});
		}
		if(objc.plotType==2){//Bar
			console.log(objc.dataChannels);
			objc.plotOptions['plotType']=objc.plotType;
			objc.plotOptions['barType']=objc.barType;
			if(objc.plotOptions['barType']==1){//Data channel categories
				for (var j=0; j<objc.dataChannels.length; j++){
					if(firstPlot){
						objc.plotOptions.channelOptions.push({});
					}
					objc.dataChannelData.push({});
					var postData={
						'startTime'   :  startTime,
						'endTime'     :  endTime,
						'channelid'   :  0,
						'screenSize'  :  screen.width,
						'dbname'      : dbname
					};
					if(typeof objc.dataChannels[j]==='object'){
						postData['channelid']=objc.dataChannels[j].channelid;
					}
					else{
						postData['channelid']=Number(objc.dataChannels[j]);
					}
					ajaxes.push(
						$.ajax({
							url: '/data/getData',
							type: 'POST',
							dataType: "json",
							data : postData,
							success: function(returned){
								returns.push(returned);
							}
						})
					);
				}
				for (var j=0; j<objc.catChannels.length; j++){
					objc.binChannelData.push({});
					if(typeof objc.dataChannels[j]==='object'){
						postData['channelid']=objc.catChannels[j].channelid;
					}
					else{
						postData['channelid']=Number(objc.catChannels[j]);
					}
					ajaxes.push(
						$.ajax({
							url: '/data/getData',
							type: 'POST',
							dataType: "json",
							data : postData,
							success: function(returned){
								returns.push(returned);
							}
						})
					);
				}
			}
			else if(objc.plotOptions['barType']==2){//User defined channel categories
				for (var j=0; j<objc.dataChannels.length; j++){
					if(firstPlot){
						objc.plotOptions.channelOptions.push([]);
					}
					objc.dataChannelData.push([]);
					for (var o=0; o<objc.dataChannels[j].length; o++){
						if(firstPlot){
							objc.plotOptions.channelOptions[j].push({});
							/*for (var j=0; j<objc.dataChannels.length; j++){
								
								
							}*/
						}
						objc.dataChannelData[j].push({});
						var postData={
							'startTime'   :  startTime,
							'endTime'     :  endTime,
							'channelid'   :  0,
							'screenSize'  :  screen.width,
							'dbname'      : dbname
						};
						if(typeof objc.dataChannels[j]==='object'){
							postData['channelid']=objc.dataChannels[j][o].channelid;
						}
						else{
							postData['channelid']=Number(objc.dataChannels[j][o]);
						}
						ajaxes.push(
							$.ajax({
								url: '/data/getData',
								type: 'POST',
								dataType: "json",
								data : postData,
								success: function(returned){
									returns.push(returned);
									if(returned.data.length<=0){
										var n=new Noty({
											text      :  'Error collecting local information <a onclick="location.reload()">Click here</a> to reload',
											theme     :  'relax',
											type      :  'alert'
										});
									}
								},
								error: function(returned){
									var n=new Noty({
										text      :  'Error collecting local information <a onclick="location.reload()">Click here</a> to reload',
										theme     :  'relax',
										type      :  'error'
									});
								}
							})
						);
					}
				}
			}
			var defer=$.when.apply($, ajaxes);
			defer.done(function(args){
				var theDataLists=[];
				if(objc.plotOptions['barType']==1){//Data channel categories
					for (var i=0; i<returns.length; i++){
						console.log(returns[i].channelID);
						var foundThisData=false;
						for (var j=0; j<objc.dataChannels.length; j++){
							var thisChannelid=objc.dataChannels[j].channelid;
							if(thisChannelid==Number(returns[i].channelID)){
								objc.dataChannelData[j]=returns[i];
								theDataLists.push({'objct':returns[i],'type':'regular'});
								foundThisData=true;
								if(firstPlot){
									objc.plotOptions.channelOptions[j]={
										'color'     : defaultColors[j],
										'smoothing' : 0,
										'colType'   : 0
									}
								}
								else{
									if(Number(objc.plotOptions.channelOptions[j].smoothing)>0){
										objc.dataChannelData[j]['smoothedData']=smootheArray(objc.dataChannelData[j].data,objc.plotOptions.channelOptions[j].smoothing);
										objc.dataChannelData[j].name=objc.dataChannelData[j].name+ ' (MF : '+objc.plotOptions.channelOptions[j].smoothing+'%)';
									}
								}
								break;
							}
						}
						for (var j=0; j<objc.catChannels.length; j++){
							var thisChannelid=objc.catChannels[j].channelid;
							if(thisChannelid==Number(returns[i].channelID)){
								objc.binChannelData[j]=returns[i];
								theDataLists.push({'objct':returns[i],'type':'stair'});
								break;
							}
						}
					}
					interpolatedData=interpolateArrays(theDataLists);
					for (var i=0; i<interpolatedData.length; i++){
						for (var j=0; j<objc.binChannelData.length; j++){
							if(interpolatedData[i].channelID==objc.binChannelData[j].channelID){
								objc.binChannelData[j].data=interpolatedData[i].data;
								//objc.channelData[j]=objc.binChannelData[j];
							}
						}
						for (var j=0; j<objc.dataChannelData.length; j++){
							if(interpolatedData[i].channelID==objc.dataChannelData[j].channelID){
								objc.dataChannelData[j].data=interpolatedData[i].data;
								objc.channelData[j]=objc.dataChannelData[j];
							}
						}
					}
				}
				else if(objc.plotOptions['barType']==2){//User defined channel categories
					for (var i=0; i<returns.length; i++){
						console.log(returns[i].channelID);
						var foundThisData=false;
						for (var j=0; j<objc.dataChannels.length; j++){
							for (var o=0; o<objc.dataChannels[j].length; o++){
								var thisChannelid=objc.dataChannels[j][o].channelid;
								/*else{
									var thisChannelid=Number(objc.channels[j]);
								}*/
								if(thisChannelid==Number(returns[i].channelID)){
									objc.dataChannelData[j][o]=returns[i];
									theDataLists.push({'objct':returns[i],'type':'regular'});
									foundThisData=true;
									if(firstPlot){
										objc.plotOptions.channelOptions[j][o]={
											'color'     : defaultColors[j],
											'smoothing' : 0,
											'colType'   : 0,
											'name'      : 'trace '+j
										}
									}
									else{
										var channOptKeys=Object.keys(objc.plotOptions.channelOptions[j][o]);
										if(channOptKeys.length<1){
											objc.plotOptions.channelOptions[j][o]={
												'color'     : defaultColors[j],
												'smoothing' : 0,
												'colType'   : 0
											}
										}
										if(Number(objc.plotOptions.channelOptions[j][o].smoothing)>0){
											objc.dataChannelData[j][o]['smoothedData']=smootheArray(objc.dataChannelData[j][o].data,objc.plotOptions.channelOptions[j][o].smoothing);
											objc.dataChannelData[j][o].name=objc.dataChannelData[j][o].name+ ' (MF : '+objc.plotOptions.channelOptions[j][o].smoothing+'%)';
										}
									}
									break;
								}
							}
						}
					}
					interpolatedData=interpolateArrays(theDataLists);
					for (var j=0; j<objc.dataChannelData.length; j++){
						objc.channelData.push([]);
						for (var o=0; o<objc.dataChannelData[j].length; o++){
							for (var i=0; i<interpolatedData.length; i++){
								if(interpolatedData[i].channelID==objc.dataChannelData[j][o].channelID){
									objc.channelData[j].push({});
									objc.dataChannelData[j][o].data=interpolatedData[i].data;
									objc.channelData[j][o]=objc.dataChannelData[j][o];
									break
								}
							}
						}
					}
				}
				objc.plotOptions['catChannels']=objc['catChannels'];
				objc.plotOptions['binChannelData']=objc['binChannelData'];
				objc.plotOptions['binChannels']=objc['binChannels'];
				drawPlot(objc.plotDiv,objc.channelData,objc.plotOptions,startTime,endTime,objc);
			});
		}
		if(objc.plotType==3){//External Request
			var postData={
				'source'     :  objc.source,
				'timeStart'  :  startTime,
				'timeEnd'    :  endTime,
				'extra'      :  objc.extra,
				'sourceType' :  objc.sourceType,
				'width'      :  $('#'+objc.plotDiv).width(),
				'height'     :  $('#'+objc.plotDiv).height()
			};
			console.log($('#'+objc.plotDiv).height());
			$.ajax({
				url: 'externalSource.php',
				type: 'POST',
				dataType: "json",
				data : postData,
				success: function(returned){
					$('#'+objc.plotDiv).empty();
					if(Number(objc.sourceType)==1){//Bitmap
						if($('#'+objc.plotDiv).height()==0){
							$('#'+objc.plotDiv).height(500);
						}
						if('errorMsg' in returned){
							$('#'+objc.plotDiv).append('<img width="'+$('#'+objc.plotDiv).width()+'px" height="'+$('#'+objc.plotDiv).height()+'px" title="'+returned.code+' - '+returned.errorMsg+'" src=data:image/png;base64,'+returned.result+'></img>');
						}
						else{
							$('#'+objc.plotDiv).append('<img width="'+$('#'+objc.plotDiv).width()+'px" height="'+$('#'+objc.plotDiv).height()+'px" src=data:image/png;base64,'+returned.result+'></img>');
						}
					}
					else if(Number(objc.sourceType)==0){//SVG
						if('errorMsg' in returned){
							$('#'+objc.plotDiv).append('<img width="'+$('#'+objc.plotDiv).width()+'px" height="'+$('#'+objc.plotDiv).height()+'px" title="'+returned.code+' - '+returned.errorMsg+'" src=data:image/png;base64,'+returned.result+'></img>');
						}
						else{
							$('#'+objc.plotDiv).append(returned.result);
						}
					}
					var contextFunction=function(event,ui){
						if(ui.cmd=='plot'){
							$(".lightboxable").empty();
							$('.lightboxable').find('.downloadPlotDiv').remove();
							$('.lightboxable').append('<div class="downloadPlotDiv" style="text-align:center;align:center"><h3>Download Plot Image</h3><p>File name:<input value="plot" class="downloadPlotInput fileName"></input></p></div>');//<p>File Format: <select class="downloadPlotInput fileFormat"><option value="svg">SVG</option><option value="png">PNG</option></select></p></div>');
							$('.lightboxable').find('.downloadPlotInput').change(function(){
								var fileName=$('.lightboxable').find('.fileName').val();
								//var fileFormat=$('.lightboxable').find('.fileFormat').val();
								if(Number(objc.sourceType)==0){//SVG
									var fileFormat='svg';
								}
								else if(Number(objc.sourceType)==1){//PNG
									var fileFormat='png';
								}
								savePlot(fileName,fileFormat,objc.plotDiv);
								$.colorbox.resize();
							});
							$('.lightboxable').find('.fileName').trigger('change');
							$.colorbox.resize();
							$.colorbox({
								inline:true,
								href:$(".lightboxable"),
								onOpen:function(){
									$(".lightboxable-outer").show();
								},
								onCleanup:function(){
									$(".lightboxable-outer").hide();
								},
								width:"75%",
								maxWidth: "1000px",
								closeButton	:false
							});
						}
					}
					var menuContext=[
						{title: "Save", cmd: "save", uiIcon: "ui-icon-save",children:[
							{title: "Figure", cmd: "plot"},
						]}
					];
						
					$("#"+objc.plotDiv).contextmenu({
						delegate: "svg",
						menu: menuContext,
						select: contextFunction
					});
				}
			})
		}
		buildURL(objc);
	}
	if(Number(objc.visionType)==1){//Layouts
		if('plotid' in objc){
			$('#'+objc.plotDiv).prepend('<img class="loading" src="/static/loading.gif" style="position:absolute;zindex:10000;margin:auto;text-align:center" width="'+(size/2)+'" height="'+(size/2)+'"></img>');
			$('#'+objc.plotDiv).find('.plot-container').css({'opacity':0.5});
		}
		else{
			$('#'+objc.plotDiv).remove();
		}
		globalObject['startTime']=startTime;
		globalObject['endTime']=endTime;
		if(Object.keys(objc).length>=0){
			if(Number(objc.plotType)==0 || Number(objc.plottype)==0){
				if('ajaxes' in objc){
					for (var k=0; k<objc.ajaxes.length; k++){
						if(!(typeof objc.ajaxes[k].abort==='undefined')){
							objc.ajaxes[k].abort();
						}
					}
				}
				objc.ajaxes=[];
				if('remarks' in objc){
					objc['plotOptions']=objc.remarks.options;
				}
				else{
					objc['plotOptions']={};
				}
				objc.plotOptions=objc.plotOptions;
				objc.plotOptions.plotTitle=objc.plotname;
				if('channelids' in objc){
					objc['channels']=objc.channelids;
				}
				else{
					objc['channels']=[];
				}
				objc['channelData']=[];
				objc['returns']=[];
				var postData={
					'startTime'   :  startTime,
					'endTime'     :  endTime,
					'channelid'   :  0,
					'screenSize'  :  screen.width,
					'dbname'      : dbname
				};
				for (var k=0; k<objc.channels.length; k++){
					objc['channelData'].push({});
					postData.channelid=Number(objc.channels[k].channelid);
					postData['fullResolution']=objc.plotOptions.channelOptions[k].fullResolution;
					objc.ajaxes.push(
						$.ajax({
							url: '/data/getData',
							type: 'POST',
							dataType: "json",
							data : postData,
							success: function(returned){
								objc.returns.push(returned);
							}
						})
					);
				}
				var defer=$.when.apply($, objc.ajaxes);
				defer.done(function(args){
					var allChannels=0;
					for (var i=0; i<objc.returns.length; i++){
						for (var j=0; j<objc.channels.length; j++){
							if(Number(objc.channels[j].channelid)==Number(objc.returns[i].channelID)){
								allChannels=allChannels+1;
								objc.channelData[j]=objc.returns[i];
								if(objc.plotOptions.channelOptions[j].smoothing>0){
									objc.channelData[j]['smoothedData']=smootheArray(objc.channelData[j].data,objc.plotOptions.channelOptions[j].smoothing);
									if(!objc.channelData[j].name.includes('(MF '+objc.plotOptions.channelOptions[j].smoothing+'%)')){
										objc.channelData[j].name=objc.channelData[j].name+ ' (MF '+objc.plotOptions.channelOptions[j].smoothing+'%)';
									}
								}
								break;
							}
						}
					}
					if(allChannels==objc.channels.length){
						drawPlot(objc.plotDiv,objc.channelData,objc.plotOptions,startTime,endTime,objc);
						$('#'+objc.plotDiv).find('.plot-container').css({'zIndex':'1'});
						$('#'+objc.plotDiv).find('.plot-container').css({'opacity':1});
						$('#'+objc.plotDiv).find('.loading').remove();
					}
				});
				if(objc.channels.length<1){
					$('#'+objc.plotDiv).empty();
					$('#'+objc.plotDiv).append('No plot selected');
				}
			}
			if(Number(objc.plotType)==1 || Number(objc.plottype)==1){
				if('ajaxes' in objc){
					for (var k=0; k<objc.ajaxes.length; k++){
						if(!(typeof objc.ajaxes[k].abort==='undefined')){
							objc.ajaxes[k].abort();
						}
					}
				}
				objc.ajaxes=[];
				if('remarks' in objc){
					objc['plotOptions']=JSON.parse(objc.remarks).options;
					var surfaceStuff=JSON.parse(objc.remarks).surfaceStuff;
					objc['surfaceType']=surfaceStuff.surfaceType;
					objc['binChannels']=surfaceStuff.binChannels;
					if(Number(objc['surfaceType']==2)){
						objc['fixedType']=surfaceStuff.fixedType;
						if(Number(objc['fixedType']==2)){
							objc['noBins']=surfaceStuff.noBins;
							objc['start']=surfaceStuff.start;
							objc['end']=surfaceStuff.end;
							objc['spacing']=surfaceStuff.fixedType;
						}
					}
				}
				else{
					objc['plotOptions']={};
				}
				objc.plotOptions=validateBooleansVar(objc.plotOptions);
				objc.plotOptions.plotTitle=objc.plotname;
				objc.plotOptions.channelOptions=[];
				if('channelids' in objc){
					objc['dataChannels']=JSON.parse(objc.channelids);
				}
				else{
					objc['dataChannels']=[];
				}
				objc['channelData']=[];
				objc['returns']=[];
				var postData={
					'startTime'   :  startTime,
					'endTime'     :  endTime,
					'channelid'   :  0,
					'screenSize'  :  screen.width,
					'dbname'      : dbname
				};
				objc['channels']=[];
				for (var k=0; k<objc.dataChannels.length; k++){
					if((typeof objc.plotOptions.channelOptions[k])==="undefined"){
						objc.plotOptions.channelOptions.push({});
					}
					objc['channels'].push(objc.dataChannels[k]);
				}
				if(Number(objc['surfaceType'])==1){
					for (var k=0; k<objc.binChannels.length; k++){
						if((typeof objc.plotOptions.channelOptions[objc.binChannels.length+k])==="undefined"){
							objc.plotOptions.channelOptions.push({});
						}
						objc['channels'].push(objc.binChannels[k]);
					}
				}
				objc['dataChannelData']=[];
				objc['binChannelData']=[];
				for (var k=0; k<objc.channels.length; k++){
					postData.channelid=Number(objc.channels[k].channelid);
					objc.ajaxes.push(
						$.ajax({
							url: '/data/getData',
							type: 'POST',
							dataType: "json",
							data : postData,
							success: function(returned){
								objc.returns.push(returned);
							}
						})
					);
				}
				var defer=$.when.apply($, objc.ajaxes);
				defer.done(function(args){
					var allChannels=0;
					var theDataLists=[];
					for (var i=0; i<objc.returns.length; i++){
						var foundThisData=false;
						for (var j=0; j<objc.dataChannels.length; j++){
							var thisChannelid=objc.dataChannels[j].channelid;
							if(thisChannelid==Number(objc.returns[i].channelID)){
								objc.dataChannelData[j]=objc.returns[i];
								theDataLists.push({'objct':objc.returns[i],'type':'regular'});
								foundThisData=true;
								break;
							}
						}
					}
					if(objc.surfaceType==1){
						for (var i=0; i<objc.returns.length; i++){
							for (var j=0; j<objc.binChannels.length; j++){
								var thisChannelid=objc.binChannels[j].channelid;
								if(thisChannelid==Number(objc.returns[i].channelID)){
									objc.binChannelData[j]=objc.returns[i];
									theDataLists.push({'objct':objc.returns[i],'type':'stair'});
									break;
								}
							}
						}
					}
					interpolatedData=interpolateArrays(theDataLists);
					var lengths=[];
					for (var i=0; i<interpolatedData.length; i++){
						lengths.push(interpolatedData[i].data.length);
					}
					var maxLength=Math.max.apply(null, lengths);
					for (var j=0; j<objc.dataChannelData.length; j++){
						objc.channelData.push({});
					}
					for (var i=0; i<interpolatedData.length; i++){
						for (var j=0; j<objc.dataChannelData.length; j++){
							if(interpolatedData[i].channelID==objc.dataChannelData[j].channelID){
								objc.dataChannelData[j].data=interpolatedData[i].data;
								objc.channelData[j]=objc.dataChannelData[j];
							}
						}
						if(objc.surfaceType==1){
							for (var j=0; j<objc.binChannelData.length; j++){
								if(interpolatedData[i].channelID==objc.binChannelData[j].channelID){
									objc.binChannelData[j].data=interpolatedData[i].data;
									//objc.channelData[j]=objc.binChannelData[j];
								}
							}
						}
					}
					if(Number(objc.plotOptions.smoothing)>0){
						for (var j=0; j<objc.dataChannelData.length; j++){
							for (var i=0; i<objc.channelData.length; i++){
								if(objc.dataChannelData[j].channelID==objc.channelData[i].channelID){
									objc.channelData[i]['smoothedData']=smootheArray(objc.channelData[j].data,objc.plotOptions.smoothing);
								}
							}
						}
					}
					objc.plotOptions['binChannelData']=objc['binChannelData'];
					objc.plotOptions['binChannels']=objc['binChannels'];
					drawPlot(objc.plotDiv,objc.channelData,objc.plotOptions,startTime,endTime,objc);
					$('#'+objc.plotDiv).find('.plot-container').css({'zIndex':1});
					$('#'+objc.plotDiv).find('.plot-container').css({'opacity':1});
					$('#'+objc.plotDiv).find('.loading').remove();
				});
			}
			if(Number(objc.plotType)==2 || Number(objc.plottype)==2){
				if('ajaxes' in objc){
					for (var k=0; k<objc.ajaxes.length; k++){
						if(!(typeof objc.ajaxes[k].abort==='undefined')){
							objc.ajaxes[k].abort();
						}
					}
				}
				objc.ajaxes=[];
				if('remarks' in objc){
					objc['plotOptions']=JSON.parse(objc.remarks).options;
					var barStuff=JSON.parse(objc.remarks).barStuff;
					objc['barType']=barStuff.barType;
					objc['catChannels']=barStuff.catChannels;
					objc.plotOptions=validateBooleansVar(objc.plotOptions);
					objc.plotOptions.plotTitle=objc.plotname;
				}
				if('channelids' in objc){
					objc['dataChannels']=JSON.parse(objc.channelids);
				}
				else{
					objc['dataChannels']=[];
				}
				objc['channelData']=[];
				objc['returns']=[];
				console.log(objc.dataChannels);
				var postData={
					'startTime'   :  startTime,
					'endTime'     :  endTime,
					'channelid'   :  0,
					'screenSize'  :  screen.width,
					'dbname'      : dbname
				};
				objc['binChannelData']=[];
				if(objc['barType']==1){
					objc['dataChannelData']=[];
					for (var k=0; k<objc.dataChannels.length; k++){
						postData.channelid=Number(objc.dataChannels[k].channelid);
						objc.ajaxes.push(
							$.ajax({
								url: '/data/getData',
								type: 'POST',
								dataType: "json",
								data : postData,
								success: function(returned){
									objc.returns.push(returned);
								}
							})
						);
					}
					for (var k=0; k<objc.catChannels.length; k++){
						postData.channelid=Number(objc.catChannels[k].channelid);
						objc.ajaxes.push(
							$.ajax({
								url: '/data/getData',
								type: 'POST',
								dataType: "json",
								data : postData,
								success: function(returned){
									objc.returns.push(returned);
								}
							})
						);
					}
				}
				else if(objc['barType']==2){
					objc['dataChannelData']=[];
					for (var j=0; j<objc.dataChannels.length; j++){
						for (var k=0; k<objc.dataChannels[j].length; k++){
							postData.channelid=Number(objc.dataChannels[j][k].channelid);
							objc.ajaxes.push(
								$.ajax({
									url: '/data/getData',
									type: 'POST',
									dataType: "json",
									data : postData,
									success: function(returned){
										objc.returns.push(returned);
									}
								})
							);
						}
					}
				}
				var defer=$.when.apply($, objc.ajaxes);
				defer.done(function(args){
					var theDataLists=[];
					if(objc.plotOptions['barType']==1){//Data channel categories
						for (var i=0; i<objc.returns.length; i++){
							var foundThisData=false;
							for (var j=0; j<objc.dataChannels.length; j++){
								var thisChannelid=objc.dataChannels[j].channelid;
								/*else{
									var thisChannelid=Number(objc.channels[j]);
								}*/
								if(thisChannelid==Number(objc.returns[i].channelID)){
									objc.dataChannelData[j]=objc.returns[i];
									theDataLists.push({'objct':objc.returns[i],'type':'regular'});
									foundThisData=true;
									if(firstPlot){
										objc.plotOptions.channelOptions[j]={
											'color'     : defaultColors[j],
											'smoothing' : 0,
											'colType'   : 0
										}
									}
									else{
										if(Number(objc.plotOptions.channelOptions[j].smoothing)>0){
											objc.dataChannelData[j]['smoothedData']=smootheArray(objc.dataChannelData[j].data,objc.plotOptions.channelOptions[j].smoothing);
											objc.dataChannelData[j].name=objc.dataChannelData[j].name+ ' (MF : '+objc.plotOptions.channelOptions[j].smoothing+'%)';
										}
									}
									break;
								}
							}
							for (var j=0; j<objc.catChannels.length; j++){
								var thisChannelid=Number(objc.catChannels[j].channelid);
								console.log(thisChannelid);
								console.log(Number(objc.returns[i].channelID));
								if(thisChannelid==Number(objc.returns[i].channelID)){
									console.log('found it');
									objc.binChannelData[j]=objc.returns[i];
									theDataLists.push({'objct':objc.returns[i],'type':'stair'});
									break;
								}
							}
						}
						interpolatedData=interpolateArrays(theDataLists);
						for (var i=0; i<interpolatedData.length; i++){
							for (var j=0; j<objc.binChannelData.length; j++){
								if(interpolatedData[i].channelID==objc.binChannelData[j].channelID){
									objc.binChannelData[j].data=interpolatedData[i].data;
									//objc.channelData[j]=objc.binChannelData[j];
								}
							}
							for (var j=0; j<objc.dataChannelData.length; j++){
								if(interpolatedData[i].channelID==objc.dataChannelData[j].channelID){
									objc.dataChannelData[j].data=interpolatedData[i].data;
									objc.channelData[j]=objc.dataChannelData[j];
								}
							}
						}
					}
					else if(objc.plotOptions['barType']==2){//User defined channel categories
						for (var j=0; j<objc.dataChannels.length; j++){
							objc['dataChannelData'].push([]);
							for (var o=0; o<objc.dataChannels[j].length; o++){
							objc['dataChannelData'][j].push({});
							}
						}
						for (var i=0; i<objc.returns.length; i++){
							console.log(objc.returns[i].channelID);
							var foundThisData=false;
							for (var j=0; j<objc.dataChannels.length; j++){
								for (var o=0; o<objc.dataChannels[j].length; o++){
									var thisChannelid=objc.dataChannels[j][o].channelid;
									/*else{
										var thisChannelid=Number(objc.channels[j]);
									}*/
									if(thisChannelid==Number(objc.returns[i].channelID)){
										objc.dataChannelData[j][o]=objc.returns[i];
										theDataLists.push({'objct':objc.returns[i],'type':'regular'});
										foundThisData=true;
										if(firstPlot){
											objc.plotOptions.channelOptions[j][o]={
												'color'     : defaultColors[j],
												'smoothing' : 0,
												'colType'   : 0,
												'name'      : 'trace '+j
											}
										}
										else{
											var channOptKeys=Object.keys(objc.plotOptions.channelOptions[j][o]);
											if(channOptKeys.length<1){
												objc.plotOptions.channelOptions[j][o]={
													'color'     : defaultColors[j],
													'smoothing' : 0,
													'colType'   : 0
												}
											}
											if(Number(objc.plotOptions.channelOptions[j][o].smoothing)>0){
												objc.dataChannelData[j][o]['smoothedData']=smootheArray(objc.dataChannelData[j][o].data,objc.plotOptions.channelOptions[j][o].smoothing);
												objc.dataChannelData[j][o].name=objc.dataChannelData[j][o].name+ ' (MF : '+objc.plotOptions.channelOptions[j][o].smoothing+'%)';
											}
										}
										break;
									}
								}
							}
						}
						interpolatedData=interpolateArrays(theDataLists);
						for (var j=0; j<objc.dataChannelData.length; j++){
							objc.channelData.push([]);
							for (var o=0; o<objc.dataChannelData[j].length; o++){
								for (var i=0; i<interpolatedData.length; i++){
									if(interpolatedData[i].channelID==objc.dataChannelData[j][o].channelID){
										objc.channelData[j].push({});
										objc.dataChannelData[j][o].data=interpolatedData[i].data;
										objc.channelData[j][o]=objc.dataChannelData[j][o];
										break
									}
								}
							}
						}
					}
					objc.plotOptions['catChannels']=objc['catChannels'];
					objc.plotOptions['binChannelData']=objc['binChannelData'];
					drawPlot(objc.plotDiv,objc.channelData,objc.plotOptions,startTime,endTime,objc);
					$('#'+objc.plotDiv).find('.plot-container').css({'zIndex':1});
					$('#'+objc.plotDiv).find('.plot-container').css({'opacity':1});
					$('#'+objc.plotDiv).find('.loading').remove();
				});
			}
			if(Number(objc.plotType)==3 || Number(objc.plottype)==3){
				var theRemarks=JSON.parse(objc.remarks);
				objc['source']=theRemarks.source;
				objc['sourceType']=theRemarks.sourceType;
				objc['extra']=theRemarks.source;
				var postData={
					'source'     :  objc.source,
					'timeStart'  :  startTime,
					'timeEnd'    :  endTime,
					'extra'      :  objc.extra,
					'sourceType' :  objc.sourceType,
					'width'      :  $('#'+objc.plotDiv).width(),
					'height'     :  $('#'+objc.plotDiv).height()
				};
				$.ajax({
					url: 'externalSource.php',
					type: 'POST',
					dataType: "json",
					data : postData,
					success: function(returned){
						$('#'+objc.plotDiv).empty();
						if(Number(objc.sourceType)==1){//Raster
							if('errorMsg' in returned){
								$('#'+objc.plotDiv).append('<span style="display:inline-block;height:100%;vertical-align:bottom"><div style="margin:auto;text-align:center;font-size:120%">'+objc.plotname+'</div><img title="'+returned.code+' - '+returned.errorMsg+'" src=data:image/png;base64,'+returned.result+'></img></span>');
							}
							else{
								$('#'+objc.plotDiv).append('<span style="display:inline-block;height:100%;vertical-align:bottom"><div style="margin:auto;text-align:center;font-size:120%">'+objc.plotname+'</div><img src=data:image/png;base64,'+returned.result+'></img></span');
							}
						}
						else if(Number(objc.sourceType)==0){//SVG
							if('errorMsg' in returned){
								$('#'+objc.plotDiv).append('<span style="display:inline-block;height:100%;vertical-align:bottom"><div style="margin:auto;text-align:center;font-size:120%">'+objc.plotname+'</div><img title="'+returned.code+' - '+returned.errorMsg+'" src=data:image/png;base64,'+returned.result+'></img></span>');
							}
							else{
								$('#'+objc.plotDiv).append('<span style="display:inline-block;height:100%;vertical-align:bottom"><div style="margin:auto;text-align:center;font-size:120%">'+objc.plotname+'</div>'+returned.result+'</span>');
							}
						}
					}
				});
				$('#'+objc.plotDiv).find('.plot-container').css({'zIndex':1});
				$('#'+objc.plotDiv).find('.plot-container').css({'opacity':1});
				$('#'+objc.plotDiv).find('.loading').remove();
			}
		}
		var firstPlot=false;
		buildURL(globalObject);
	}
}

function interpolateArrays(lists){
	console.log(lists);
	var result=[];
	var mins=[];
	var absMin=0;
	var needsInterp=[];
	var resultLists=[];
	for (var i=0; i<lists.length; i++){
		mins.push(Number(lists[i].objct.minTime));
	}
	absMin=Math.min.apply(null, mins);
	//Checking which lists need interpolating
	for (var i=0; i<lists.length; i++){
		var good=true;
		if(Number(lists[i].objct.minTime/absMin>100)){
			good=confirm("DAQBroker uses data interpolation to provide the best resolution possible to users making surface plots. While for most cases this is enitrely feasible in most electronic devices, it seems that channel "+ lists[i].iname +" : "+lists[i].name+" presents a resolution over 100 times that of the smallest resolution channel, this will most likely cause preformance issues on your device when trying to visualize the data as is. Please consider remaking the plot and exclude the offending channel. Are you sure you want to continue?");
		}
		if(good){
			resultLists.push(interpolate(lists[i].objct.data,absMin,lists[i].type));
		}
		else{
			return 0
			//$(".back").trigger('click');
		}
	}
	for (var i=0; i<lists.length; i++){
		var finished={};
		var listKeys=Object.keys(lists[i].objct);
		for(var j=0; j<listKeys.length; j++){
			if(listKeys[j]!='data'){
				finished[listKeys[j]]=lists[i].objct[listKeys[j]];
			}
		}
		finished['data']=resultLists[i];
		result.push(finished);
	}
	return result
}

function interpolate(list,resolution,type){
	var newList=[];
	for (var i=0; i<(list.length-1); i++){
		if(Math.floor((Number(list[i+1][0])-Number(list[i][0]))/Number(resolution))>=2){//Must create array with necessary length
			var goal=Math.floor((Number(list[i+1][0])-Number(list[i][0]))/Number(resolution));
			for (var j=0; j<goal; j++){
				if(type=='regular'){
					var toSplice=[Number(list[i][0])+j*Number(resolution),Number(list[i][1])+j*(Number(list[i+1][1])-Number(list[i][1]))/goal];
				}
				else if(type=='stair'){
					var toSplice=[Number(list[i][0])+j*Number(resolution),Number(list[i][1])];
				}
				newList.push(toSplice);
			}
		}
		newList.push(list[i]);
	}
	newList.push(list[list.length-1]);
	return newList
}

function startDownload(object){
	object.ajaxes=[];
	object.returns=[];
	var postData=[]
	var reqID = uniqueId();
	for (var j=0; j<object.channels.length; j++){
		
		var obj={
			'startTime'      :  object.startTime,
			'endTime'        :  object.endTime,
			'channelid'      :  0,
			'screenSize'     :  10000000,
			'dbname'         : dbname,
			'fullResolution' : true,
			'type'           : 'data'
		};
		if(typeof object.channels[j]==='object'){
			obj['channelid']=object.channels[j].channelid;
		}
		else{
			obj['channelid']=Number(object.channels[j]);
		}
		postData.push(obj);
	}
	$.ajax({
		url: '/data/getDataStream',
		type: 'POST',
		contentType: "application/json",
		dataType: "json",
		data : JSON.stringify({'reqID':reqID,'jobRequests':postData}),
		success: function(returned){
			var jobs = returned.map(function(obj){
				newObj = obj;
				obj['found']=false;
				return newObj
			});
			var tries = 0;
			var ongoing = false;
			
			$(".lightboxable").empty();
			$('.lightboxable').find('.downloadDataDiv').remove();
			$('.lightboxable').append('<div class="downloadDataDiv" style="text-align:center;align:center"><h3>Download Plot Data</h3><p>While your data is being downloaded, customize your output file, you can check the progress below</p><p>File name:<input value="data.txt" class="downloadDataInput fileName"></input></p><p>Time Format: <select class="downloadDataInput timeFormat"><option value="unixm">Unix Milliseconds</option><option value="igor">Labview/Igor</option><option value="matlab">Matlab</option><option value="string">Time string</option></select></p></div><div class="downloadFile" style="margin:auto;align:center;text-align:center;display:table"><h3>Progress. . .</h3><div class="progressBar" style="display:table-row;width:100%;background-color:#ddd"><span class="nothing">0%</span><div class="actualProgress" style="width:0%;background-color: #4CAF50;text-align: center;"></div></div></div>');
			var fileName=$('.lightboxable').find('.fileName').val();
			var timeFormat=$('.lightboxable').find('.timeFormat').val();
			theRepeat = setInterval(function(){
				if(!ongoing){
					ongoing = true;
					$.ajax({
						url: '/data/getDataCheckStream',
						type: 'POST',
						contentType: "application/json",
						dataType: "json",
						data : JSON.stringify({'reqID':reqID,'jobs':jobs.filter(function(el){return !el['done']})}),
						success: function(returned){
							tries = tries +1;
							ongoing = false;
							for (var j=0; j<returned.length; j++){
								var theJob = jobs.filter(function(el){return el.id == returned[j].id}); //There must only be one
								if(theJob.length > 0){
									console.log(jobs.indexOf(theJob[0]));
									jobs[jobs.indexOf(theJob[0])]['done']=true
									object.returns.push(returned[j].data);
								}
							}
							$(".lightboxable").find('.progressBar').find('.actualProgress').css({'width':(100*object.returns.length/postData.length)+'%'});
							$(".lightboxable").find('.progressBar').find('.actualProgress').empty();
							$(".lightboxable").find('.progressBar').find('.nothing').remove();
							$(".lightboxable").find('.progressBar').find('.actualProgress').append((Math.floor(100*object.returns.length/postData.length))+'%');
						},
						error: function(){
							tries = tries +1;
							ongoing = false;
							console.log("checkBad");
						}
					});
				}
				if(object.returns.length == postData.length){
					filename=$('.lightboxable').find('.fileName').val();
					timeFormat=$('.lightboxable').find('.timeFormat').val();
					getPlotData(object.returns,filename,timeFormat);
					clearInterval(theRepeat);
				}
				if(tries >20){
					if(object.returns.length > 0){
						clearInterval(theRepeat);
						notyExpression=new Noty({
							text      :  "Data collecting session has timed out. Not all of your dataset was collected, please make sure the missing channels are correct and contact your network administrator.",
							theme     :  'relax',
							type      :  'warning'
						}).show();
						getPlotData(object.returns,filename,timeFormat);
					}
					else{
						clearInterval(theRepeat);
						notyExpression=new Noty({
							text      :  "Data collecting session has timed out. Your requested dataset is empty, please make sure you are requesting correct channels and contact your network administrator to solve this problem.",
							theme     :  'relax',
							type      :  'warning'
						}).show();
					}
				}
			}, 1000);
			$('.lightboxable').find('.downloadDataInput').change(function(){
				$.colorbox.resize();
				filename=$('.lightboxable').find('.fileName').val();
				timeFormat=$('.lightboxable').find('.timeFormat').val();
				if(object.returns.length == postData.length){
					getPlotData(object.returns,filename,timeFormat);
				}
			});
			$.colorbox({
				inline:true,
				href:$(".lightboxable"),
				onOpen:function(){
					$(".lightboxable-outer").show();
				},
				onCleanup:function(){
					$(".lightboxable-outer").hide();
				},
				width:"75%",
				maxWidth: "1000px",
				closeButton	:false
			});
		},
		error:function(returned){
			notyExpression=new Noty({
				text      :  "There was an setting up your data collection, contact your network administrator | "+JSON.stringify(returned),
				theme     :  'relax',
				type      :  'error'
			}).show();
		}
	});
}

function getPlotData(object,filename,timeFormat){
	var sizes=[];
	var header='';
	//var storeArray=[];
	var storeArray='';
	for (var j=0; j<object.length; j++){
		sizes.push(object[j].data.length);
		header=header+',time,'+object[j].iname+' : '+object[j].name;
	}
	//storeArray.push(header.substring(1)+'\n');
	storeArray=storeArray+header.substring(1)+'\n';
	var maxMax=Math.max.apply(Math,sizes);
	for (var i=0; i<maxMax; i++){
		var line='';
		for (var j=0; j<object.length; j++){
			if(i<object[j].data.length){
				if(timeFormat=="unixm"){
					var time=Number(object[j].data[i][0]);
				}
				if(timeFormat=='matlab'){
					var time=Number(object[j].data[i][0])/86400000 + 719529;;
				}
				if(timeFormat=='igor'){
					var time=(Number(object[j].data[i][0])-moment.utc("01-01-1904", "MM-DD-YYYY").valueOf())/1000;
				}
				if(timeFormat=='string'){
					var time=moment.utc(Number(object[j].data[i][0])).format('DD/MM/YYYY HH:mm:ss');
				}
				line=line+','+time+','+object[j].data[i][1];
			}
			else{
				line=line+',N/A,N/A';
			}
		}
		//storeArray.push(line.substring(1)+'\n');
		storeArray=storeArray+line.substring(1)+'\n';
	}
	var file = new File([storeArray], filename, {
	  type: "text/plain",
	});
	var fileURL=URL.createObjectURL(file);
	$('.lightboxable').find('.downloadFile').remove();
	$('.lightboxable').find('.downloadDataDiv').append('<a href='+fileURL+' download="'+filename+'" class="button pill downloadFile" style="font-size:150%">Save to file</a>');
	$.colorbox.resize();
}

function savePlot(filename,fileFormat,div){
	var code='';
	var attrs={};
	var preamble='';
	var fullSVG=[];
	preamble='<svg';
	console.log(div);
	//console.log($('.'div));
	//console.log(div.find('svg'));
	if($('.'+div).find('.main-svg').length<1){//Not a plotly plot
		code=$($('.'+div).find('svg')[0]).html()
		var theAttributesMain=$('.'+div).find('svg')[0];
		var theAttributes=theAttributesMain.attributes;
		for(var j=0;j<theAttributes.length;j++){
			attrs[theAttributes[j].name]=theAttributes[j].value;
		}
		attrsKeys=Object.keys(attrs);
		for(var j=0;j<attrsKeys.length;j++){
			preamble=preamble+' '+attrsKeys[j]+'="'+attrs[attrsKeys[j]]+'" ';
		}
	}
	else{
		var theAttributesMain=$('.'+div).find('.main-svg')[0];
		var theAttributes=theAttributesMain.attributes;
		$('.'+div).find('.main-svg').each(function(){
			code=code+$(this).html();
		});
		for(var j=0;j<theAttributes.length;j++){
			attrs[theAttributes[j].name]=theAttributes[j].value;
		}
		attrsKeys=Object.keys(attrs);
		for(var j=0;j<attrsKeys.length;j++){
			preamble=preamble+' '+attrsKeys[j]+'="'+attrs[attrsKeys[j]]+'" ';
		}
	}
	preamble=preamble+'>';
	fullSVG.push(preamble+code+'</svg>');
	if(fileFormat=='svg'){
		var file = new File(fullSVG, filename+'.'+fileFormat, {
		  type: "text/plain"
		});
		var fileURL=URL.createObjectURL(file);
		$('.lightboxable').find('.downloadPlotDiv').find('.downloadPlot').remove();
		$('.lightboxable').find('.downloadPlotDiv').find('.theRasterCanvas').remove();
		$('.lightboxable').find('.downloadPlotDiv').find('.title').remove();
		$('.lightboxable').find('.downloadPlotDiv').append('<a href='+fileURL+' download="'+filename+'.'+fileFormat+'" class="button pill downloadPlot" style="font-size:150%">Download</a>');
	}
	else if(fileFormat=='png'){
		$('.lightboxable').find('.downloadPlotDiv').find('.downloadPlot').remove();
		$('.lightboxable').find('.downloadPlotDiv').find('.theRasterCanvas').remove();
		$('.lightboxable').find('.downloadPlotDiv').append('<canvas hidden width="'+$('.'+div).width()+'" height="'+$('.'+div).height()+'" class="theRasterCanvas"></canvas>');
		var theCanvas=$('.lightboxable').find('.theRasterCanvas')[0];
		importSVG(fullSVG[0],theCanvas,filename,fileFormat);
		//$('.lightboxable').find('.theRasterCanvas').show();
	}
	$.colorbox.resize();
}

function importSVG(sourceSVG, targetCanvas,filename,fileFormat) {
	// https://developer.mozilla.org/en/XMLSerializer
	//svg_xml = (new XMLSerializer()).serializeToString(sourceSVG);
	svg_xml = sourceSVG;
	var ctx = targetCanvas.getContext('2d');

	// this is just a JavaScript (HTML) image
	var img = new Image();
	// http://en.wikipedia.org/wiki/SVG#Native_support
	// https://developer.mozilla.org/en/DOM/window.btoa
	img.src = "data:image/svg+xml;base64," + btoa(svg_xml);

	img.onload = function() {
		// after this, Canvas’ origin-clean is DIRTY
		ctx.drawImage(img, 0, 0);
		//var theCanvasURL=theCanvas.toDataURL("image/png");
		//window.open(targetCanvas.toDataURL('image/png'));
		$('.lightboxable').find('.downloadPlotDiv').append('<a href='+targetCanvas.toDataURL('image/png')+' download="'+filename+'.'+fileFormat+'" class="button pill downloadPlot" style="font-size:150%">Download</a>');
		$.colorbox.resize();
	}
}

function smootheArray(theArray,smoothing){
	var returned=[];
	var lenList=theArray.length;
	var medWindow=Math.floor(lenList/20*(Number(smoothing)/100));
	if(medWindow==0){
		medWindow=1;
	}
	for(var j=0;j<Math.floor(lenList/medWindow);j++){
		var tempList=theArray.slice(j*medWindow, (j+1)*medWindow);
		var theMedian=median(tempList);
		for(var i=0;i<tempList.length;i++){
			returned.push([tempList[i][0],theMedian]);
		}
	}
	if(returned.length<theArray.length){
		var lastBit=theArray.slice(returned.length, theArray.length);
		var theMedian=median(lastBit);
		for(var i=0;i<lastBit.length;i++){
			returned.push([lastBit[i][0],theMedian]);
		}
	}
	return returned;
}

function median(array){
	var temp=[];
	for(var k=0;k<array.length;k++){
		temp.push(Number(array[k][1]));
	}
	temp.sort( function(a,b) {return a - b;} );
	var half = Math.floor(array.length/2);
	if(temp.length % 2)
		return temp[half];
	else
		return (temp[half-1] + temp[half]) / 2.0;
}

function createComment(toSend){
	$('.lightboxable').find('.errorCommentDiv').remove();
	$.ajax({
		url: 'saveComment.php',
		type: 'POST',
		dataType: "json",
		data : toSend,
		success: function(returned){
			if(returned.error=='0'){
				//location.reload();
			}
			else{
				$('.lightboxable').append('<div class="errorCommentDiv" style="color:#a94442;background-color:#f2dede">'+returned.errorStr+' | '+returned.errorMsg+'</div>');
			}
			$.colorbox.resize();
		},
		error: function(returned){
			$('.lightboxable').append('<div class="errorCommentDiv" style="color:#a94442;background-color:#f2dede">There was an error inserting the comment, refresh the page and try again</div>');
			$.colorbox.resize();
		}
	});
}