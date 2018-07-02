
var masterChartVariable={ };
var currentAjax;
var availableTraces=[];
var availableTracesNames=[];
var firstSmooth=1;

var globalSelect;

function round(number,decimal){
	var rounded=0;

	rounded=Math.floor(number*Math.pow(10,decimal));

	return rounded/Math.pow(10,decimal);
}

function onlyUnique(value, index, self) { 
    return self.indexOf(value) === index;
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


//Will need to get runs from database must make an ajax call but for now assume runs have been retrieved

var latestRun=0;
var latestStage=0;
var activeSomething=0
var activeRow=''; //Will be a jquery object

function organizeRuns(){
	for (var i=0; i<runs.length; i++){
		//Adds one line per run to work on later
	}
}

//Functions for adding new run/stage

function newLine(type){
	if(type=='Run'){
		latestRun=latestRun+1;
		latestStage=1;
		var startDateRun=new Date();
		var startDateRunUTC=convertUTC(startDateRun);
		var formData= new FormData();
		formData.append('run',latestRun);
		formData.append('stage',latestStage);
		formData.append('start',startDateRun.getTime());
		formData.append('end',startDateRun.getTime());
		formData.append('description','');
		formData.append('remarks','{"comments":""}');
		formData.append('typeInsert','0');
		formData.append('runType','Beam');
		$.ajax({
			url: 'insertRun.php',  //Server script to process data
			type: 'POST',
			processData: false,
			contentType: false,
			data: formData,
			dataType: "json",
			success: function(returned){
				if(returned.error==0){
					$("#errorDiv").empty();
					var line={
						'More'           : '<a class="button icon arrowup unprocessedLess"></a>',
						'Run'            : latestRun,
						'Stage'          : latestStage,
						'Type'           : '<select class="runType" value="0"><option value="Beam">Beam</option><option value="GCR">GCR</option><option value="Neutral">Neutral</option><option value="Cleaning">Cleaning</option></select>',
						'Description'    : '<input type="text" class="description" name="description" placeholder="Describe the run"></input>',
						'Start time'     : '<input type="text" class="startDate" name="daterange"></input>',
						'End time'       : '<span class="endTime">'+(startDateRun.getUTCFullYear())+'/'+(startDateRun.getUTCMonth()+1)+'/'+startDateRun.getUTCDate()+' '+(startDateRun.getUTCHours())+':'+startDateRun.getUTCMinutes()+':'+startDateRun.getUTCSeconds()+'</span>',//'<input type="text" class="endDate" name="daterange"></input>',
						'Edit'           : '',
						'Info'           : '<input hidden type="text" class="isActive" name="isActive" value="1"></input><input type="number" class="originalRun" hidden value="'+latestRun+'"></input><input type="number" class="originalStage" hidden value="'+latestStage+'"></input>'
					};
					var newRow=runTable.row.add(line).draw(false);
					var newRowJQ=$(runTable.row(newRow).node());
					var timeNow = new Date();
					var tr = newRowJQ.find(".unprocessedLess").closest('tr');
					var row = runTable.row( tr );
					var remarksObjDefault=JSON.parse(defaultPars);
					var stringAdd='<p>';
					for (var key in remarksObjDefault) {
						if(key!='comments'){
							stringAdd=stringAdd+key+': <input type="text" class="'+key+'Remarks" name="'+key+'" value=""></input>';
						}
					}
					var stringAdd=stringAdd+'</p>';
					row.child('<textarea class="commentsRemarks" name="comments" style="width:500px;height:60px" placeholder="Use this area to provide comments for this run/stage"></textarea>'+stringAdd).show();
					a=new Date();
					$(newRowJQ).find(".startDate").datetimepicker({timeFormat: 'HH:mm:ss'});
					$(newRowJQ).find(".startDate").datetimepicker("setDate", (new Date(a.getTime()+a.getTimezoneOffset()*60000)));
					//$(newRowJQ).find(".endDate").datetimepicker({timeFormat: 'HH:mm:ss'});
					//$(newRowJQ).find(".endDate").datetimepicker("setDate", new Date());
					activeRow=newRowJQ;
					activeSomething=1;
					toggleActiveSet();
					setMoreButtons();
				}
				else{
					$("#errorDiv").empty();
					$("#errorDiv").append('<span style="color:red">'+returned.errorStr+'  -  '+returned.errorMsg+'</span>');
				}
			}
		});
	}
	else if(type=='Stage'){
		latestStage=latestStage+1;
		var startDateRun=new Date();
		var startDateRunUTC=convertUTC(startDateRun);
		var formData= new FormData();
		formData.append('run',latestRun);
		formData.append('stage',latestStage);
		formData.append('start',startDateRunUTC.utc*1000);
		formData.append('end',startDateRunUTC.utc*1000);
		formData.append('description','');
		formData.append('remarks','{"comments":""}');
		formData.append('typeInsert','0');
		formData.append('runType','Beam');
		$.ajax({
			url: 'insertRun.php',  //Server script to process data
			type: 'POST',
			processData: false,
			contentType: false,
			data: formData,
			dataType: "json",
			success: function(returned){
				if(returned.error==0){
					$("#errorDiv").empty();
					var line={
						'More'           : '<a class="button icon arrowup unprocessedLess"></a>',
						'Run'            : latestRun,
						'Stage'          : latestStage,
						'Description'    : '<input type="text" class="description" name="description" placeholder="Describe the run"></input>',
						'Type'           : '<select class="runType" value="0"><option value="Beam">Beam</option><option value="GCR">GCR</option><option value="Neutral">Neutral</option><option value="Cleaning">Cleaning</option></select>',
						'Start time'     : '<input type="text" class="startDate" name="daterange"></input>',
						'End time'       : '<span class="endTime">'+(startDateRun.getUTCFullYear())+'/'+(startDateRun.getUTCMonth()+1)+'/'+startDateRun.getUTCDate()+' '+(startDateRun.getUTCHours())+':'+startDateRun.getUTCMinutes()+':'+startDateRun.getUTCSeconds()+'</span>',//'<input type="text" class="endDate" name="daterange"></input>',
						'Edit'           : '',
						'Info'           : '<input hidden type="text" class="isActive" name="isActive" value="1"></input><input type="number" class="originalRun" hidden value="'+latestRun+'"></input><input type="number" class="originalStage" hidden value="'+latestStage+'"></input>'
					};
					var newRow=runTable.row.add(line).draw(false);
					var newRowJQ=$(runTable.row(newRow).node());
					var timeNow = new Date();
					var tr = newRowJQ.find(".unprocessedLess").closest('tr');
					var row = runTable.row( tr );
					var remarksObjDefault=JSON.parse(defaultPars);
					var stringAdd='<p>';
					for (var key in remarksObjDefault) {
						if(key!='comments'){
							stringAdd=stringAdd+key+': <input type="text" class="'+key+'Remarks" name="'+key+'" value=""></input>';
						}
					}
					var stringAdd=stringAdd+'</p>';
					row.child('<textarea class="commentsRemarks" name="comments" style="width:500px;height:60px" placeholder="Use this area to provide comments for this run/stage"></textarea>'+stringAdd).show();
					var timeNow = new Date();
					a=new Date();
					$(newRowJQ).find(".startDate").datetimepicker({timeFormat: 'HH:mm:ss'});
					$(newRowJQ).find(".startDate").datetimepicker("setDate", (new Date(a.getTime()+a.getTimezoneOffset()*60000)));
					//$(newRowJQ).find(".endDate").datetimepicker({timeFormat: 'HH:mm:ss'});
					//$(newRowJQ).find(".endDate").datetimepicker("setDate", new Date());
					activeRow=newRowJQ;
					activeSomething=1;
					toggleActiveSet();
					setMoreButtons();
				}
				else{
					$("#errorDiv").empty();
					$("#errorDiv").append('<span style="color:red">'+returned.errorStr+'  -  '+returned.errorMsg+'</span>');
				}
			}
		});
	}
	else{
		alert('wut?');
	}
}

function toggleActiveSet(){
	if(activeSomething==1){
		$("#options").empty();
		$("#options").append('<button style="display:inline-block" onclick="endRunStage()">End Run/Stage ('+latestRun+'.'+latestStage+')</button>');
	}
	else{
		$("#options").empty();
		$("#options").append('<div style="display:inline-block;width:33%" id="runDiv"><button onclick="newLine(\'Run\')">New run ('+(latestRun+1)+'.'+0+')</button></div><div style="display:inline-block;width:33%">OR</div><div style="display:inline-block;width:33%" id="stageDiv"><button onclick="newLine(\'Stage\')">New Stage ('+latestRun+'.'+(latestStage+1)+')</button></div>');
	}
}

function endRunStage(){
	var timeStart=activeRow.find(".startDate").val();
	var goodTimeStart=convertUTC(timeStart);
	activeRow.find(".endDate").datetimepicker("setDate", new Date());
	var timeEnd2=activeRow.find(".endTime").html();
	var timeEnd=new Date();//activeRow.find(".endTime").html();
	var goodTimeEnd=convertUTC(timeEnd2);
	var descript=activeRow.find(".description").val();
	var runType=activeRow.find(".runType").val();
	timeEndObj=new Date();
	timeEndUTC=timeEndObj.getTime();
	//if(goodTimeEnd.utc>goodTimeStart.utc){
		var test=confirm('Are you sure you want to end this run/stage?');
		if(test==true){
			activeSomething=0;
			if(descript==''){
				descript='No Description';
			}
			var newRemarks='{';
			activeRow.next('tr').find("[class$='Remarks']").each(function(){
				newRemarks=newRemarks+'&quot;'+$(this).attr('name')+'&quot;:&quot;'+$(this).val().replace('"',"&quot")+'&quot;,';
			});
			newRemarks=newRemarks.substr(0,newRemarks.length-1)+'}';
			var formData= new FormData();
			formData.append('run',latestRun);
			formData.append('stage',latestStage);
			formData.append('start',goodTimeStart.utc*1000);
			formData.append('end',timeEnd.getTime());
			formData.append('description',descript);
			formData.append('remarks',newRemarks);
			formData.append('typeInsert','1');
			formData.append('runType',runType);
			$.ajax({
				url: 'insertRun.php',  //Server script to process data
				type: 'POST',
				processData: false,
				contentType: false,
				data: formData,
				dataType: "json",
				success: function(returned){
					if(returned.error==0){
						$("#errorDiv").empty();
						var line={
							'More'           : '<a class="button icon arrowdown unprocessedMore"></a>',
							'Run'            : latestRun,
							'Stage'          : latestStage,
							'Description'    : descript,
							'Type'           : runType,
							'Start time'     : goodTimeStart.string+'<input hidden type="text" name="timeStart" value="'+goodTimeStart.utc+'"></input>',
							'End time'       : (timeEnd.getUTCFullYear())+'/'+(timeEnd.getUTCMonth()+1)+'/'+timeEnd.getUTCDate()+' '+(timeEnd.getUTCHours())+':'+timeEnd.getUTCMinutes()+':'+timeEnd.getUTCSeconds()+'</span>'+'<input hidden type="text" name="timeEnd" value="'+timeEnd.getTime()/1000+'"></input>',
							'Edit'           : '<a class="button icon edit unprocessedEdit">Edit</a>',
							'Info'           : '<input type="text" hidden class="remarks" value="'+newRemarks+'"></input><input hidden type="text" class="isActive" name="isActive" value="0"></input><input type="number" class="originalRun" hidden value="'+latestRun+'"></input><input type="number" class="originalStage" hidden value="'+latestStage+'"></input>'
						};
						runTable.row(activeRow[0]).data(line).draw(false);
						runTable.row(activeRow[0]).child.hide();
						toggleActiveSet();
						setEditButtons();
						setMoreButtons();
					}
					else{
						$("#errorDiv").empty();
						$("#errorDiv").append('<span style="color:red">'+returned.errorStr+'  -  '+returned.errorMsg+'</span>');
					}
				}
			});
		}
	//}
	//else{
	//	alert('Start date cannot be larger than end date');
	//}
}

function updateRowTime(row){
	if(activeSomething==1){
		console.log($(row));
	}
}

function setEditButtons(){
	runTable.rows().every(function(value,index){
		var theRow=$(runTable.row(value).node());
		theRow.find(".unprocessedEdit").click(function(){
			var thisRow=$(this).parent().parent();
			var remarks=thisRow.find(".remarks").val();
			var runType=$(thisRow.children()[3]).html();
			line={
				'More'           : '',
				'Run'            : '<input type="number" class="run" name="run" min="0" value="'+Number($(thisRow.children()[1]).html())+'"></input>',
				'Stage'          : '<input type="number" class="stage" name="stage" min="0" value="'+Number($(thisRow.children()[2]).html())+'"></input>',
				'Description'    : '<input type="text" class="description" name="description" value="'+$(thisRow.children()[4]).html()+'"></input>',
				'Type'           : '<select class="runType" value="'+$(thisRow.children()[3]).html()+'"><option value="Beam">Beam</option><option value="GCR">GCR</option><option value="Neutral">Neutral</option><option value="Cleaning">Cleaning</option></select>',
				'Start time'     : '<input type="text" class="startDate" name="daterange"></input>',
				'End time'       : '<input type="text" class="endDate" name="daterange"></input>',
				'Edit'           : '<a class="button icon approve unprocessedAccept">Accept</a>',
				'Info'           : '<input type="text" hidden class="remarks" value="'+remarks+'"></input></input><input hidden type="text" class="isActive" name="isActive" value="0"></input><input type="number" class="originalRun" hidden value="'+Number($(thisRow.children()[1]).html())+'"></input><input type="number" class="originalStage" hidden value="'+Number($(thisRow.children()[2]).html())+'"></input>'
			};
			console.log($(thisRow.children()[3]));
			console.log($(thisRow.children()[4]).find('.runType'));
			console.log($($(thisRow.children()[4]).find('.runType').context).find('.runType'));
			console.log($(thisRow.children()[4]).find('.runType').val());
			console.log(runType);
			$(thisRow.children()[4]).find('.runType').val('"'+runType+'"');
			console.log($(thisRow.children()[4]).find('.runType').val());
			remarks=remarks.replace(/&quot;/g,'"');
			var thisStartTime=moment($(thisRow.children()[5]).html(),'YYYY/M/D h:m:s');
			var thisEndTime=moment($(thisRow.children()[6]).html(),'YYYY/M/D h:m:s');
			var editRow=runTable.row(thisRow[0]).data(line).draw('page');
			var editRowJQ=$(runTable.row(editRow).node());
			var tr = thisRow.find(".unprocessedAccept").closest('tr');
			var row = runTable.row( tr );
			if(Object.keys(JSON.parse(remarks)).length>1){
				var remarksObj=JSON.parse(remarks);
				var stringAdd='<p>';
				for (var key in remarksObj) {
					if(key!='comments'){
						stringAdd=stringAdd+key+': <input type="text" class="'+key+'Remarks" name="'+key+'" value="'+remarksObj[key].replace(/["]/g, '&quot;')+'"></input>';
					}
				}
				var stringAdd=stringAdd+'</p>';
				row.child('<textarea class="commentsRemarks" name="comments" style="width:500px;height:75px" placeholder="Use this area to provide comments for this run/stage">'+remarksObj.comments+'</textarea>'+stringAdd).show();
			}
			else{
				var remarksObjDefault=JSON.parse(defaultPars);
				var remarksObj=JSON.parse(remarks);
				var stringAdd='<p>';
				for (var key in remarksObjDefault) {
					if(key!='comments'){
						stringAdd=stringAdd+key+': <input type="text" class="'+key+'Remarks" name="'+key+'" value=""></input>';
					}
				}
				var stringAdd=stringAdd+'</p>';
				row.child('<textarea class="commentsRemarks" name="comments" style="width:500px;height:60px" placeholder="Use this area to provide comments for this run/stage">'+remarksObj.comments.replace(/&quot;/g,'"')+'</textarea>'+stringAdd).show();
			}
			$(editRowJQ).find(".startDate").datetimepicker({timeFormat: 'HH:mm:ss'});
			$(editRowJQ).find(".startDate").datetimepicker("setDate", thisStartTime._d);
			$(editRowJQ).find(".endDate").datetimepicker({timeFormat: 'HH:mm:ss'});
			$(editRowJQ).find(".endDate").datetimepicker("setDate",thisEndTime._d);
			$(editRowJQ).find(".runType").val(runType);
			setAcceptButtons();
		});
		theRow.find(".unprocessedEdit").attr('class','button icon edit processedEdit');
	});
}

function setMoreButtons(){
	runTable.rows().every(function(rowIdx, tableLoop, rowLoop){
		var theRow=$(runTable.row(rowIdx).node());
		theRow.find(".unprocessedMore").click(function(){
			var tr = $(this).closest('tr');
			var row = runTable.row( tr );
			var remarks=theRow.find(".remarks").val();
			row.child(remarks).show();
			$(this).attr('class','button icon arrowup unprocessedLess');
			$(this).unbind('click');
			setLessButtons();
		});
		theRow.find(".unprocessedMore").attr('class','button icon arrowdown processedMore');
	});
}

function setLessButtons(){
	runTable.rows().every(function(rowIdx, tableLoop, rowLoop){
		var theRow=$(runTable.row(rowIdx).node());
		theRow.find(".unprocessedLess").click(function(){
			var tr = $(this).closest('tr');
			var row = runTable.row( tr );
			row.child().hide();
			$(this).attr('class','button icon arrowdown unprocessedMore');
			$(this).unbind('click');
			setMoreButtons();
		});
		theRow.find(".unprocessedLess").attr('class','button icon arrowup processedLess');
	});
}

function setAcceptButtons(){
	runTable.rows().every(function(value,index){
		var theRow=$(runTable.row(value).node());
		theRow.find(".unprocessedAccept").click(function(){
			var thisRow=$(this).parent().parent();
			var timeStart=thisRow.find(".startDate").val();
			var goodTimeStart=convertUTC(timeStart);
			var timeEnd=thisRow.find(".endDate").val();
			var goodTimeEnd=convertUTC(timeEnd);
			var descript=thisRow.find(".description").val();
			var thisRun=thisRow.find(".run").val();
			var thisStage=thisRow.find(".stage").val();
			var thisOriginalRun=thisRow.find(".originalRun").val();
			var thisOriginalStage=thisRow.find(".originalStage").val();
			var remarks=thisRow.find(".remarks").val();
			var thisRunType=thisRow.find(".runType").val();
			var newRemarks='{';
			thisRow.next('tr').find("[class$='Remarks']").each(function(){
				newRemarks=newRemarks+'&quot;'+$(this).attr('name')+'&quot;:&quot;'+$(this).val().replace(/["]/g, '\\&quot;')+'&quot;,';
			});
			newRemarks=newRemarks.substr(0,newRemarks.length-1)+'}';
			if(goodTimeEnd.utc>goodTimeStart.utc){
				var formData=new FormData();
				formData.append('run',thisRun);
				formData.append('stage',thisStage);
				formData.append('originalRun',thisOriginalRun);
				formData.append('originalStage',thisOriginalStage);
				formData.append('start',goodTimeStart.utc*1000);
				formData.append('end',goodTimeEnd.utc*1000);
				formData.append('description',descript);
				formData.append('remarks',newRemarks);
				formData.append('typeInsert','2');
				formData.append('runType',thisRunType);
				$.ajax({
					url: 'insertRun.php',
					type: 'POST',
					processData: false,
					contentType: false,
					data: formData,
					dataType: "json",
					success: function(returned){
						if(returned.error==0){
							$("#errorDiv").empty();
							var line={
								'More'           : '<a class="button icon arrowdown unprocessedMore"></a>',
								'Run'            : thisRun,
								'Stage'          : thisStage,
								'Description'    : descript,
								'Type'           : thisRunType,
								'Start time'     : goodTimeStart.string+'<input hidden type="text" name="timeStart" value="'+goodTimeStart.utc+'"></input>',
								'End time'       : goodTimeEnd.string+'<input hidden type="text" name="timeEnd" value="'+goodTimeEnd.utc+'"></input>',
								'Edit'           : '<a class="button icon edit unprocessedEdit">Edit</a>',
								'Info'           : '<input type="text" hidden class="remarks" value="'+newRemarks+'"></input><input hidden type="text" class="isActive" name="isActive" value="0"></input><input type="number" class="originalRun" hidden value="'+thisRun+'"></input><input type="number" class="originalStage" hidden value="'+thisStage+'"></input>'
							};
							var editedRow=runTable.row(thisRow[0]).data(line).draw(false);
							var tr = thisRow.find(".unprocessedEdit").closest('tr');
							var row = runTable.row( tr );
							row.child().hide();
							setEditButtons();
							setMoreButtons();
							$.ajax({
								url: 'getRuns.php',
								type: 'POST',
								dataType: "json",
								success: function(returned){
									if(returned.error==0){
										latestRun=returned.runs[returned.runs.length-1].run;
										latestStage=returned.runs[returned.runs.length-1].stage;
										toggleActiveSet();
									}
								}
							});
						}
						else{
							$("#errorDiv").empty();
							$("#errorDiv").append('<span style="color:red">'+returned.errorStr+'  -  '+returned.errorMsg+'</span>');
						}
					}
				});
			}
			else{
				alert('Start date cannot be larger than end date');
			}
		});
		theRow.find(".unprocessedAccept").attr('class','button icon approve processedAccept');
	});
}

function convertUTC(dateStr){
	var wrongDate=new Date(dateStr);
	var correctDateUTC=math.floor(wrongDate.getTime()/1000)-wrongDate.getTimezoneOffset()*60;
	var correctDate= new Date(correctDateUTC*1000);
	var correctString=(correctDate.getUTCFullYear())+'/'+(correctDate.getUTCMonth()+1)+'/'+correctDate.getUTCDate()+' '+(correctDate.getUTCHours())+':'+correctDate.getUTCMinutes()+':'+correctDate.getUTCSeconds();

	var returned={string:correctString,utc:correctDateUTC};

	return returned;
}
