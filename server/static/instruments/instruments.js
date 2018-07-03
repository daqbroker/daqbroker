//Stuff for old instruments

var filesOnRecord=[];
var currentInstrument={};

function updateInstTable(type){
	$.ajax({
		method: "POST",
		url:"queryInstruments",
		dataType: "json",
		data: {"database":dbname},
		success: function(returned,status,derp) {
			$("#infoBoxes").hide();
			$("#instRequestCreds").hide();
			$("#requestedInst-outer").hide();
			var instruments=returned;
			var rows=instrumentsTable.rows().data();
			if(returned.length<1){
				instrumentsTable.settings()[0]["oLanguage"]["sEmptyTable"]="No instruments found, make one!";
				instrumentsTable.draw();
			}
			for(var i=0; i<instruments.length; i++){
				var found=false;
				for(var l=0; l<rows.length; l++){
					var instid=Number(rows[l]['Instrument ID']);
					if(instid==Number(instruments[i].instid)){
						found=true;
					}
				}
				if(!found){//Gonna create a new index
					var line={
						'Name'           :       '<a class="button big pill showInstData" id="cred'+i+'" href="#credForm'+i+'" onclick="displayInstData('+instruments[i].instid+','+i+')">'+instruments[i].Name+'</a>',
						'Instrument ID'  :       instruments[i].instid,
						'Data Entires'   :       instruments[i].clockCounts,
						'Status'         :       '<font color="green"> Active </font>'
					}
					if(instruments[i].active!="1"){
						line.Status='<font color="red"> Inactive </font>';
					}
					var newRow=instrumentsTable.row.add(line).draw();
					var thisRow=$(instrumentsTable.row(newRow).node());
					var thisId=instruments[i].instid;
					var thisEl=i;
				}
				else{
					var line={
						'Name'           :       '<a class="button big pill showInstData" id="cred'+i+'" href="#credForm'+i+'" onclick="displayInstData('+instruments[i].instid+','+i+')">'+instruments[i].Name+'</a>',
						'Instrument ID'  :       instruments[i].instid,
						'Data Entires'   :       instruments[i].clockCounts,
						'Status'         :       '<font color="green"> Active </font>'
					}
					if(instruments[i].active!="1"){
						line.Status='<font color="red"> Inactive </font>';
					}
					instrumentsTable.row(i).data(line)
				}
			}
			/*if(instruments.length<1){
				searchResults.context[0].oLanguage.sEmptyTable = "No instruments found, make one!";
			}*/
			instrumentsTable.draw();
			$("#instTable").find("tr").find("a").each(function(){
				$(this).css('font-size','130%');
			});
		},
		error:function(returned){
			var n=new Noty({
				text      :  "There was an error collecting instrument information",
				theme     :  'relax',
				type      :  'error',
				timeout   :  '10000'
			}).show();
		}
	});
}

setInterval(function(){
	updateInstTable(1);
},30000)

function displayInstData(instid,el){
	$.ajax({
		method: "POST",
		url:"queryInstDetails",
		dataType: "json",
		data: {"database":dbname,"instid":instid},
		success: function(returned,status,derp) {
			$.colorbox.resize();
			var theInstrument=returned;
			$('#channInfo'+el).DataTable().destroy();
			$('#channInfo'+el).remove();
			$("#instRequestCreds").find("#credFormLog"+el+"-outer").remove();
			$("#instRequestCreds").find("#credFormAdmin"+el+"-outer").remove();
			$("#instRequestCreds").find("#credForm"+el+"-outer").remove();
			$("#instRequestCreds").find("#credFormParse"+el+"-outer").remove();
			$("#instRequestCreds").append('<div id="credForm'+el+'-outer"><div id="credForm'+el+'"><h2 align="center">'+theInstrument.Name+' - Basic Info</h2><div style="width:80%;margin:auto;text-align:center;align:center;padding-bottom:10px;" class="buttons"><button style="font-size:80%;" class="info'+el+' button pill huge icon home" disabled>Info</button><button style="font-size:80%" class="log'+el+' button pill huge icon log">Logbook</button><button style="font-size:90%" class="admin'+el+' button pill huge icon user">Admin</button></div><p><h3 >Description</h3> <span style="font-size:120%">'+theInstrument.description+'</span></p><p><h3>Contact</h3> <span style="font-size:120%">'+theInstrument.email+'</span></p><div style="text-align:right"><h4 style="display:inline">Monitoring</h4> : <label class="active" ><label class="switch"><input class="instActive" type="checkbox"><div class="slider round"></div></label></label></div><div class="tableDiv"></div><form style="marign:auto;text-align:center;align:center;width:100%" class="credForm" method="post" action=""  enctype="multipart/form-data"></form></div></div><div id="credFormLog'+el+'-outer"><div id="credFormLog'+el+'"></div></div><div id="credFormAdmin'+el+'-outer"><div id="credFormAdmin'+el+'"></div></div><div id="credFormParse'+el+'-outer"><div id="credFormParse'+el+'"></div></div>');
			$("#instRequestCreds").find('.log'+el).unbind('click');
			/* if(theInstrument.active){
				var activeText ='<span class="displayText" style="color:green">Active</span>';
			}
			else{
				var activeText ='<span class="displayText" style="color:red">Inactive</span>';
			}
			$("#credForm"+el).find(".active").before(activeText); */
			$("#credForm"+el).find(".instActive").prop("checked",theInstrument.active);
			$("#credForm"+el).find(".instActive").click(function(e){
				e.preventDefault();
				var theButton=$(this);
				$.ajax({
					url: 'setActiveInstrument',
					'button':theButton,
					type: 'POST',
					dataType: "json",
					data: {'instid':theInstrument.instid},
					success: function(returned){
						theInstrument.active=returned;
						theButton.prop("checked",returned);
						/* $($(theButton.parent()).parent()).find('.displayText').remove()
						if(returned){
							var activeText ='<span class="displayText" style="color:green">Active</span>';
						}
						else{
							var activeText ='<span class="displayText" style="color:red">Inactive</span>';
						}
						$($(theButton.parent()).parent()).find('.active').before(activeText); */
					},
					error: function(returned){
						new Noty({
							text    :  'Error collecting local information <a onclick="location.reload()">Click here</a> to reload',
							theme   :  'relax',
							type    :  'error'
						}).show();
					}
				});
			})
			$("#credForm"+el).find('.log'+el).click(function(){
				var localEl=el;
				var localID=instid;
				displayInstLog(localID,localEl);
			});
			/* $("#credForm"+el).find('.parse'+el).click(function(){
				var localEl=el;
				var localID=instid;
				displayInstParse(localID,localEl);
				<button style="font-size:80%" class="parse'+el+' button pill huge icon calendar">Parsing</button>
			}); */
			$("#credForm"+el).find('.log'+el).click(function(){
				var localEl=el;
				var localID=instid;
				displayInstLog(localID,localEl);
			});
			$("#credForm"+el).find('.admin'+el).click(function(){
				var localEl=el;
				var localID=instid;
				displayAdmin(localID,localEl);
			});
			$("#instRequestCreds").find("#credForm"+el).find(".tableDiv").append('<hr style="width:25%;margin:auto"><h3>Data Sources</h3><div style="margin:auto;padding-bottom:10px;"><p style="text-align:center;"><select class="instDataSources"><option class="empty" value="-1">No sources found</option></select></p><div class="sourceInfo"></div></div><hr style="width:25%;margin:auto"><h4 style="text-align:center">Data Channels</h4><table cellspacing="0" width="100%" class="display" id="channInfo'+el+'"></table>');
			//<thead><tr><th>Name</th><th>Description</th><th>Units</th><th>Channelid</th><th>Earliest Entry</th><th>Latest Entry</th><th>Chart</th></tr></thead>
			var channelInfoTable=$('#channInfo'+el).DataTable({
				"order": [[ 3, "asc" ]],
				"columns": [
					{"data":"Name","name":"Name","title":"Name","width":"10px"},
					{"data":"Description","name":"Description","title":"Description","width":"10px"},
					{"data":"Units","name":"Units","title":"Units","width":"10px"},
					{"data":"Channel ID","name":"Channel ID","title":"Channel ID","width":"10px"},
					{"data":"Earliest Entry","name":"Earliest Entry","title":"Earliest Entry","width":"10px"},
					{"data":"Latest Entry","name":"Latest Entry","title":"Latest Entry","width":"10px"},
					{"data":"Chart","name":"Chart","title":"Chart","width":"10px"}
				],
				"responsive":true,
				"oLanguage": {
					"sEmptyTable":     "No data chanels found!"
				},
				"columnDefs": [
					{"className": "dt-center", "targets": "_all"}
				],
				'pageLength': 5,
				"lengthMenu": [5 , 10, 25, 50, 100 ]
			});
			for(var l=0; l<theInstrument.files.length; l++){
				$("#instRequestCreds").find("#credForm"+el).find(".tableDiv").find('.instDataSources').find('.empty').remove();
				$("#instRequestCreds").find("#credForm"+el).find(".tableDiv").find('.instDataSources').append('<option value="'+l+'">'+theInstrument.files[l].name+'</option>');
				$("#instRequestCreds").find("#credForm"+el).find(".tableDiv").find('.instDataSources').val(l)
				$("#instRequestCreds").find("#credForm"+el).find(".tableDiv").find('.instDataSources').change(function(){
					$("#instRequestCreds").find("#credForm"+el).find(".tableDiv").find('.sourceInfo').empty();
					if(Number($(this).val())>=0){
						lines=[];
						var file=theInstrument.files[Number($(this).val())];
						type="N/A";
						extra="N/A";
						if(file.type==0){
							type="Data files";
							extra='<b>Source Path</b> - '+file.remarks.path+' | <b>Pattern</b> - '+file.remarks.pattern+' | <b>Extension</b> - '+file.remarks.extension+' | <b>Refresh</b> - '+file.remarks.parseInterval+' seconds';
						}
						$("#instRequestCreds").find("#credForm"+el).find(".tableDiv").find('.sourceInfo').append("<p><b>Type</b> - "+type+" | "+extra+'</p><h4>Actions</h4><div class="sourceActions" style="text-align:center"><img class="outcome" src="/static/loading.gif" height="25" width="25"></img></div>');
						for(var k=0; k<file.channels.length; k++){
							var url="bah";
							lines.push({
								'Name'        : file.channels[k].Name,
								'Channel ID'  : file.channels[k].channelid,
								'Description' : file.channels[k].description,
								'Units'       : file.channels[k].units,
								'Chart'       : "<a href=\""+url+"\" target=\"_blank\"><img src=\"/static/graph.ico\" width=\"25\" height=\"25\"></img></a>"
							});
							if(Number(file.channels[k].lastclock)>0){
								var latestEntryStr=moment.utc(Number(file.channels[k].lastclock)).format('YYYY/MM/DD HH:mm:ss');
							}
							else{
								var latestEntryStr='NEVER';
							}
							if(Number(file.channels[k].firstClock)<10000000000000){
								var earlyestEntryStr=moment.utc(Number(file.channels[k].firstClock)).format('YYYY/MM/DD HH:mm:ss');
							}
							else{
								var earlyestEntryStr='NEVER';
							}
							lines[lines.length-1]["Latest Entry"]=latestEntryStr;
							lines[lines.length-1]["Earliest Entry"]=earlyestEntryStr;
						}
						channelInfoTable.clear()
						channelInfoTable.rows.add(lines);
						channelInfoTable.draw()
					}
				});
			}
			$("#instRequestCreds").find("#credForm"+el).find(".tableDiv").find('.instDataSources').trigger('change');
			$('#channInfo'+el).trigger('click');
			$.colorbox({
				inline:true,
				href:$("#credForm"+el),
				onOpen:function(){
					$("#credForm"+el+"-outer").show();
				},
				onCleanup:function(){
					$("#credForm"+el+"-outer").hide();
					updateInstTable(type);
				},
				width:"75%",
				maxWidth: "1000px",
				closeButton	:false
			});
			var instid=theInstrument.instid;
			$.ajax({
				method: "POST",
				url:"queryInstCreds",
				dataType: "json",
				data: {"database":dbname,"instid":instid},
				success: function(returned) {
					var credForm=$("#credForm"+el).find('.credForm');
					if(returned.type>1){
						credForm.empty();
						$("#credForm"+el).find('.buttons').after('<p style="text-align:center"><span style="background-color:#dff0d8;font-size:120%"> Instrument operator user found</span></p>');
						credForm.append('</p><input type="number" hidden class="instid" name="instid" value="'+instid+'"></input><p align="center"><span class="errorFormCred"></span><button type="submit" style="font-size:120%" class="button pill icon edit" >Edit</button><button style="font-size:120%" class="button pill icon trash danger">Delete</button></p>');
						$("#credForm"+el).find(".tableDiv").find('.sourceInfo').find('.sourceActions').empty();
						$("#credForm"+el).find(".tableDiv").find('.sourceInfo').find('.sourceActions').append('Reset up to <select sourceResetTime><option value="3600"> last hour </option><option value="3600"> last day </option><option value="3600"> last week </option><option value="3600"> last month </option><option value="3600"> last year </option></select> <button name="Go"> Go </button> | <button class="button pill huge icon remove danger">Delete Source</button>');
					}
					else if(returned.type==1){
						var credForm=$("#credForm"+el).find('.credForm');
						credForm.empty();
						$("#credForm"+el).find('.buttons').after('<p style="text-align:center"><span style="background-color:#dff0d8;font-size:120%"> Administrator credentials found</span></p>');
						credForm.append('</p><input type="number" hidden class="instid" name="instid" value="'+instid+'"></input><p align="center"><span class="errorFormCred"></span><button type="submit" class="button pill icon edit" style="font-size:120%">Edit</button><button style="font-size:120%" class="button pill icon trash danger">Delete</button></p>');
						$("#credForm"+el).find(".tableDiv").find('.sourceInfo').find('.sourceActions').empty();
						$("#credForm"+el).find(".tableDiv").find('.sourceInfo').find('.sourceActions').append('Reset <select class="sourceResetTime"><option value="3600"> last hour </option><option value="86400"> last day </option><option value="604800"> last week </option><option value="2592000"> last month </option><option value="31104000"> last year </option><option value="-1"> all time </option></select> <button class="button pill huge icon reload resetParse" name="Go"> Go </button> | <button class="button pill huge icon remove danger removeParse">Delete Source</button>');
					}
					else if(returned.type<0){
						$("#credForm"+el).find('.buttons').after('<p style="width:100%;margin:auto;align:center;text-align:center;background-color:#fcf8e3;font-size:120%"> You are not the instrument operator</p>');
					}
					$("#credForm"+el).find('.resetParse').unbind('click');
					$("#credForm"+el).find('.resetParse').click(function(e){
						r=confirm('This action resets all parsing data, restarting data collection from the supplied time. This could significantly delay the collection of new instrument data. Are you sure you want to continue?');
						if(r){
							$.ajax({
								method: "POST",
								url:"editParsing",
								dataType: "json",
								data: {"instid":theInstrument.instid,"metaid":theInstrument.files[Number($("#credForm"+el).find(".tableDiv").find('.sourceInfo').val())].metaid,"database":dbname,"operation":'reset','sourceResetTime':Number($(".sourceResetTime").val())},
								success: function(returned,status,derp) {
									alert('Reset successfull');
								},
								error:function(returned){
									alert('There was an error handling your request');
								}
							});
						}
					});
					$("#credForm"+el).find('.removeParse').unbind('click');
					$("#credForm"+el).find('.removeParse').click(function(e){
						r=confirm('This action removes this directive, all created channels and instrument data associated with it. Are you sure you want to continue?');
						if(r){
							$.ajax({
								method: "POST",
								url:"editParsing",
								dataType: "json",
								data: {"instid":instid,"metaid":theInstrument.files[Number($("#credForm"+el).find(".tableDiv").find('.sourceInfo').val())].metaid,"database":dbname,"operation":'remove'},
								success: function(returned,status,derp) {
									displayInstData(instid,el)
								},
								error:function(returned){
									alert('There was an error handling your request');
									displayInstData(instid,el)
								}
							});
						}
					});
					credForm.submit(function(event) {
						event.preventDefault();
					});
					credForm.find('.trash').click(function(){
						console.log(instid);
						deleteInstrument(instid);
					});
					$.colorbox.resize();
					credForm.find('.edit').click(function() {
						credForm.find(".errorFormCred").empty();
						$("#requestedInst").empty();
						for(var l=0; l<existingInstruments.length; l++){
							if(Number(instid)==Number(existingInstruments[l].instid)){
								currentInstrument=existingInstruments[l];
								$.ajax({
									method: "POST",
									url:"queryInstDetails",
									dataType: "json",
									data: {"database":dbname,"instid":currentInstrument.instid},
									success: function(returned,status,derp) {
										$.colorbox.resize();
										currentInstrument=returned;
										//currentInstrumentOld=returned;
										//currentInstrumentOld = Object.assign({}, returned);
										currentInstrumentOld = $.extend(true,{}, returned);
										if('files' in currentInstrument){
											for(var l=0; l<currentInstrument.files.length; l++){
												if('channels' in currentInstrument.files[l]){
													for(var i=0; i<currentInstrument.files[l].channels.length; i++){
														var channelObj=currentInstrument.files[l].channels[i];
														channelObj['oldName']=channelObj.Name;
														channelObj['channeltypeOld']=channelObj.channeltype;
														channelObj['activeOld']=channelObj.active;
														channelObj['descriptionOld']=channelObj.description;
														channelObj['unitsOld']=channelObj.units;
														channelObj['fileorderOld']=channelObj.fileorder;
													}
												}
											}
										}
										newInst('step1',currentInstrument);
										$.colorbox({
											inline:true,
											href:$("#requestedInst"),
											onOpen:function(){
												$("#requestedInst-outer").show();
											},
											onCleanup:function(){
												$.ajax({
													method: "POST",
													url:"queryInstruments",
													dataType: "json",
													data: {"dbname":dbname},
													success: function(returned,status,derp) {
														existingInstruments=returned;
													}
												});
												$("#requestedInst-outer").hide();
											},
											width:"75%",
											maxWidth: "1000px",
											closeButton:false
										});
										credForm.find(":input").attr('disabled',false);
									},
									error: function(returned,status,derp) {
										alert('There was an error collecting the instrument details')
									}
								});
								$.colorbox({
									inline:true,
									href:$("#requestedInst"),
									onOpen:function(){
										$("#requestedInst-outer").show();
									},
									onCleanup:function(){
										$.ajax({
											method: "POST",
											url:"queryInstruments",
											dataType: "json",
											data: {"database":dbname},
											success: function(returned,status,derp) {
												existingInstruments=returned;
											}
										});
										$("#requestedInst-outer").hide();
									},
									width:"75%",
									maxWidth: "1000px",
									closeButton:false
								});
								break;
							}
						}
					});
				},
				error:function(returned){
					var credForm=$("#credForm"+el).find('.credForm');
					credForm.empty();
					credForm.append('<p><span style="background-color:#fcf8e3;font-size:120%"> There was a problem with your request</span></p>');
					$.colorbox.resize();
				}
			});
		}
	});
}

function displayInstLog(instid,el){
	$.ajax({
		method: "POST",
		url:"queryInstDetails",
		dataType: "json",
		data: {"database":dbname,"instid":instid},
		success: function(returned,status,derp) {
			var theInstrument=returned;
			$('#channInfo'+el).DataTable().destroy();
			$('#channInfo'+el).remove();
			$("#instRequestCreds").find("#credFormLog"+el+"-outer").remove();
			$("#instRequestCreds").find("#credFormAdmin"+el+"-outer").remove();
			$("#instRequestCreds").find("#credForm"+el+"-outer").remove();
			$("#instRequestCreds").find("#credFormParse"+el+"-outer").remove();
			$("#instRequestCreds").append('<div id="credFormLog'+el+'-outer"><div id="credFormLog'+el+'"><h2 align="center">'+theInstrument.Name+' - Logbook</h2><div style="width:100%;margin:auto;text-align:center;align:center;" class="buttons"><button class="info'+el+' button pill icon home">Info</button><button class="log'+el+' button pill icon log" disabled>Logbook</button><button class="admin'+el+' button pill icon user">Admin</button></div><hr style="width:25%"><div class="instLogShow-outer"><div class="instLogShow"></div><div class="dlButton" style="margin:auto;text-align:center"></div></div><div class="instLogInsert"></div><div class="submitDiv" style="maring:auto;width:100%;text-align:center;align:center;"></div></div></div><div id="credForm'+el+'-outer"><div id="credForm'+el+'"></div></div><div id="credFormAdmin'+el+'-outer"><div id="credFormAdmin'+el+'"></div></div><div id="credFormParse'+el+'-outer"><div id="credFormParse'+el+'"></div></div>');
			$("#credFormLog"+el).find('.info'+el).unbind('click');
			$("#credFormLog"+el).find('.info'+el).click(function(){
				var localEl=el;
				var localID=instid;
				displayInstData(localID,localEl);
			});
			$("#credFormLog"+el).find('.admin'+el).click(function(){
				var localEl=el;
				var localID=instid;
				displayAdmin(localID,localEl);
			});
			/* $("#credFormLog"+el).find('.parse'+el).click(function(){
				var localEl=el;
				var localID=instid;
				displayInstParse(localID,localEl);
				<button class="parse'+el+' button pill icon calendar">Parsing</button>
			}); */
			if(theInstrument.log=='' || theInstrument.log==null || theInstrument.log=='NULL'){
				theInstrument.log='[]';
			}
			log=theInstrument.log;
			if((typeof log)==='string'){
				log=JSON.parse(log);
			}
			$("#instRequestCreds").find("#credFormLog"+el).find('.instLogShow').append('<h3 style="margin:auto;text-align:center;align:center;width:100%;">Instrument Log</h3><ul class="theLog"></ul>');
			$("#instRequestCreds").find("#credFormLog"+el).find('.instLogShow').css({'height':'200px','overflow':'auto'});
			for(var l=0; l<log.length; l++){
				var logDate=moment.utc(Number(log[l].date)).format('YYYY/MM/DD HH:mm:ss');
				$("#instRequestCreds").find("#credFormLog"+el).find('.instLogShow').find('.theLog').append('<li style="padding:5px 5px 5px 5px;white-space: pre-line"><b>'+logDate+' ('+log[l].author+') : </b><span style="float:right"><button class="button pill icon edit '+l+' '+el+' '+instid+'"><button class="button pill danger icon trash '+l+' '+el+' '+instid+'"></button></span>\n<span style="display:inline">'+log[l].entry+'</span></il>');
			}
			for(var l=0; l<log.length; l++){
					$("#instRequestCreds").find("#credFormLog"+el).find('.edit.'+l).unbind('click');
				$("#instRequestCreds").find("#credFormLog"+el).find('.edit.'+l).click(function(){
					var localIdx=Number($(this).prop('class').split(' ')[4]);
					var localEl=Number($(this).prop('class').split(' ')[5]);
					var instid=Number($(this).prop('class').split(' ')[6]);
					editEntry(log[localIdx],'edit',localEl,instid);
				});
				$("#instRequestCreds").find("#credFormLog"+el).find('.trash.'+l).unbind('click');
				$("#instRequestCreds").find("#credFormLog"+el).find('.trash.'+l).click(function(){
					var localIdx=Number($(this).prop('class').split(' ')[5]);
					var localEl=Number($(this).prop('class').split(' ')[6]);
					var instid=Number($(this).prop('class').split(' ')[7]);
					editEntry(log[localIdx],'remove',localEl,instid);
				});
			}
			if(log.length==0){
				$("#instRequestCreds").find("#credFormLog"+el).find('.instLogShow').append('<br><span style="margin:auto;text-align:center;align:center;width:100%">No log entries found</span>');
				$("#instRequestCreds").find("#credFormLog"+el).find('.instLogShow').css({'height':'100px','overflow':'auto','margin':'auto','text-align':'center','align':'center'});
				$("#instRequestCreds").find("#credFormLog"+el).find('.instLogShow').css({'height':'100px','overflow':'auto','margin':'auto','text-align':'center','align':'center'});
			}
			else{
				//Only if there are entries does he get to download
				$("#instRequestCreds").find("#credFormLog"+el).find('.dlButton').append('<button style="font-size:120%" class="button pill dlLog" onclick="setupDownloadLog('+instid+','+el+')">Download Log</button>');
			}
			if(Number(theInstrument.active)==1){
				var type="entryDateActive";
			}
			else{
				var type="entryDate";
			}
			$.ajax({
				method: "POST",
				url:"queryInstCreds",
				dataType: "json",
				data: {"database":dbname,"instid":instid},
				success: function(returned) {
					if(returned.error=="0"){
						if(returned.type=="2" || returned.type=="3"){
							$("#instRequestCreds").find("#credFormLog"+el).find('.instLogInsert').append('<hr style="width:25%"><span style="width:100%;margin:auto;align:center;text-align:center;background-color:#dff0d8">Instrument Operator found</span>');
						}
						else if(returned.type=="1"){
							$("#instRequestCreds").find("#credFormLog"+el).find('.instLogInsert').append('<hr style="width:25%"><span style="width:100%;margin:auto;align:center;text-align:center;background-color:#dff0d8">Administrator credentials found</span>');
						}
						$("#instRequestCreds").find("#credFormLog"+el).find('.instLogInsert').append('<h3 class="newEntryTitle" style="margin:auto;text-align:center;align:center;width:100%">New Entry</h3><p>Date : <input class="logEntryTime '+type+'"></input></p><p>Author : <input class="entryAuthor"></input></p><p>Entry : <textarea class="entry" style="width:50%;height:100px"></textarea></p>');
						$("#instRequestCreds").find("#credFormLog"+el).find('.instLogInsert').find('input').on('input',function(){
							var foundEmpty=false
							$("#credFormLog"+el).find('.instLogInsert').find('input').each(function(){
								console.log($(this).val());
								if($(this).val()==''){
									foundEmpty=true;
								}
								if($(this).attr('class').split(' ').indexOf('entryDateActive')>=0){
									var classList=$(this).attr('class').split(' ');
									classList.splice(classList.indexOf('entryDateActive'),1);
									$(this).attr('class',classList.join(' '));
								}
							});
							if($("#credFormLog"+el).find('.instLogInsert').find('.entry').val()==''){
								foundEmpty=true;
							}
							if(foundEmpty){
								$("#credFormLog"+el).find('.submitDiv').empty();
								$("#credFormLog"+el).find('.submitDiv').append('<span style="background-color:#f2dede">Please fill out all inputs</span>');
							}
							else{
								$("#credFormLog"+el).find('.submitDiv').empty();
								$("#credFormLog"+el).find('.submitDiv').append('<button class="submitEntry button pill approve" style="font-size:150%">Submit</button>');
							}
							$.colorbox.resize();
						});
						$("#instRequestCreds").find("#credFormLog"+el).find('.instLogInsert').find('.entry').on('input',function(){
							var foundEmpty=false
							$("#credFormLog"+el).find('.instLogInsert').find('input').each(function(){
								if($(this).val()==''){
									foundEmpty=true;
								}
								if($(this).attr('class').split(' ').indexOf('entryDateActive')>=0){
									var classList=$(this).attr('class').split(' ');
									classList.splice(classList.indexOf('entryDateActive'),1);
									$(this).attr('class',classList.join(' '));
								}
							});
							if($("#credFormLog"+el).find('.instLogInsert').find('.entry').val()==''){
								foundEmpty=true;
							}
							if(foundEmpty){
								$("#credFormLog"+el).find('.submitDiv').empty();
								$("#credFormLog"+el).find('.submitDiv').append('<span style="background-color:#f2dede">Please fill out all inputs</span>');
							}
							else{
								$("#credFormLog"+el).find('.submitDiv').empty();
								$("#credFormLog"+el).find('.submitDiv').append('<button class="submitEntry button pill approve" style="font-size:150%">Submit</button>');
								$("#credFormLog"+el).find('.submitDiv').find('.submitEntry').click(function(){
									var date=moment.utc($("#credFormLog"+el).find('.instLogInsert').find('.logEntryTime').val(),'DD/MM/YYYY HH:mm:ss').valueOf();
									var author=$("#credFormLog"+el).find('.instLogInsert').find('.entryAuthor').val();
									var entry=$("#credFormLog"+el).find('.instLogInsert').find('.entry').val();
									$.ajax({
										method: "POST",
										url:"insertLogComment",
										dataType: "json",
										data: {"database":dbname,"instid":instid,'date':date,'author':author,'entry':entry},
										success: function(returned,status,derp){
											displayInstLog(instid,el);
										},
										error: function(returned,status,derp){
											alert('Could not insert log entry');
										}
									});
								});
							}
							$.colorbox.resize();
						});
						$("#instRequestCreds").find("#credFormLog"+el).find('.instLogInsert').find('.'+type).flatpickr({
							enableTime: true,
							enableSeconds: true,
							time_24hr: true,
							dateFormat: 'd/m/Y H:i:S',
							minuteIncrement: 1,
							allowInput:true
						});
					}
					else{
						$("#instRequestCreds").find("#credFormLog"+el).find('.instLogInsert').append('<hr style="width:25%"><span style="width:100%;margin:auto;align:center;text-align:center;background-color:#fcf8e3;font-size:120%"> You are not the instrument operator</span>');$("#instRequestCreds").find("#credFormLog"+el).find('.instLogInsert').append('<div><')
					}
					$.colorbox({
						inline:true,
						href:$("#credFormLog"+el),
						onOpen:function(){
							$("#credFormLog"+el+"-outer").show();
						},
						onCleanup:function(){
							$("#credFormLog"+el+"-outer").hide();
						},
						width:"75%",
						maxWidth: "1000px",
						closeButton	:false
					});
				},
				error:function(returned){
					alert('Error obtaining user information, relog and try again');
				}
			});
		}
	});
}

function editEntry(entry,operation,el,instid){
	console.log(entry,operation,el,instid);
	var logDate=moment.utc(Number(entry.date)).format('YYYY/MM/DD HH:mm:ss');
	entry['oldEntry']=entry['entry']
	entry['oldDate']=entry['date']
	entry['oldAuthor']=entry['author']
	if(operation=='edit'){
		$("#credFormLog"+el).find('.instLogInsert').find('.newEntryTitle').html('Edit entry');
		$("#credFormLog"+el).find('.instLogInsert').find('.entryAuthor').val(entry.author);
		$("#credFormLog"+el).find('.instLogInsert').find('.entry').html(entry.entry);
		var wasActive=false;
		var timeClass=$("#credFormLog"+el).find('.instLogInsert').find('.logEntryTime').prop('class');
		var timeClassLocal=timeClass.split(' ')
		if(timeClassLocal.indexOf('entryDateActive')>=0){
			wasActive=true;
			timeClassLocal.splice(timeClassLocal.indexOf('entryDateActive'),1);
			$("#credFormLog"+el).find('.instLogInsert').find('.logEntryTime').prop('class',timeClassLocal.join(' '));
		}
		$("#credFormLog"+el).find('.instLogInsert').find('.logEntryTime')[0]._flatpickr.setDate(Number(entry.date));
		$("#credFormLog"+el).find('.instLogInsert').find(':input').on('input',function(){
			var isEmpty=false;
			$("#credFormLog"+el).find('.instLogInsert').find(':input').each(function(){
				if($(this).val()=='' && $(this).html()==''){
					isEmpty=true;
					return false
				}
				if($(this).attr('class').split(' ').indexOf('entry')>=0){
					entry['entry']=$(this).val();
				}
				if($(this).attr('class').split(' ').indexOf('entryAuthor')>=0){
					entry['author']=$(this).val();
				}
				if($(this).attr('class').split(' ').indexOf('logEntryTime')>=0){
					entry['date']=moment($(this).val(),'DD/MM/YYYY HH:mm:ss').valueOf();
				}
			});
			$("#credFormLog"+el).find('.submitDiv').empty();
			if(isEmpty){
				$("#credFormLog"+el).find('.submitDiv').append('<span style="background-color:#f2dede">Please fill out all inputs</span>');
			}
			else{
				$("#credFormLog"+el).find('.submitDiv').append('<button class="submitEditedEntry button pill approve" style="font-size:150%">Submit</button>');
				$("#credFormLog"+el).find('.submitDiv').find('.submitEditedEntry').click(function(){
					$.ajax({
						method: "POST",
						url:"editLogEntry",
						dataType: "json",
						contentType: "application/json; charset=UTF-8",
						data: JSON.stringify({"database":dbname,"instid":instid,'entry':entry,'operation':operation}),
						success: function(returned,status,derp){
							displayInstLog(instid,el);
						},
						error: function(returned,status,derp){
							alert('Could not save log entry');
						}
					});
				});
				$.colorbox.resize();
			}
		});
		$("#credFormLog"+el).find('.submitDiv').empty();
		$("#credFormLog"+el).find('.submitDiv').append('<button class="submitEditedEntry button pill approve" style="font-size:150%">Submit</button>');
		$("#credFormLog"+el).find('.submitDiv').find('.submitEditedEntry').click(function(){
			$.ajax({
				method: "POST",
				url:"editLogEntry",
				dataType: "json",
				contentType: "application/json; charset=UTF-8",
				data: JSON.stringify({"database":dbname,"instid":instid,'entry':entry,'operation':operation}),
				success: function(returned,status,derp){
					displayInstLog(instid,el);
				},
				error: function(returned,status,derp){
					alert('Could not save log entry');
				}
			});
		});
		$.colorbox.resize();
	}
	else if(operation=='remove'){
		r=confirm('Are you sure you want to remove the entry taken at '+logDate);
		if(r){
			$.ajax({
				method: "POST",
				url:"editLogEntry",
				dataType: "json",
				contentType: "application/json; charset=UTF-8",
				data: JSON.stringify({"database":dbname,"instid":instid,'entry':entry,'operation':operation}),
				success: function(returned,status,derp){
					displayInstLog(instid,el);
				},
				error: function(returned,status,derp){
					alert('Could not delete log entry');
				}
			});
		}
	}
}

function setupDownloadLog(theInstid,el){
	$.ajax({
		method: "POST",
		url:"queryInstDetails",
		dataType: "json",
		data: {"database":dbname,"instid":theInstid},
		success: function(returned,status,derp) {
			var theInstrument=returned;
			var theLog=theInstrument.log;
			$("#instRequestCreds").find("#credFormLog"+el+"-outer").remove();
			$("#instRequestCreds").find("#credFormAdmin"+el+"-outer").remove();
			$("#instRequestCreds").find("#credFormParse"+el+"-outer").remove();
			$("#instRequestCreds").find("#credForm"+el+"-outer").remove();
			$("#instRequestCreds").append('<div id="credFormLog'+el+'-outer"><div id="credFormLog'+el+'"><h2 align="center">Download '+theInstrument.Name+'\'s - Logbook</h2><hr style="width:25%"><div class="downloadOptions"></div></div></div>');
			$("#credFormLog"+el).find('.downloadOptions').append('<p style="padding:5px 0 5px 0">File name : <input class="filename inputdl" value="logbook.txt" placeholder="runlist.txt"></input></p>');
			$("#credFormLog"+el).find('.downloadOptions').append('<p style="padding:5px 0 5px 0">Separator <select class="separator inputdl"><option selected value="tab">Tab</option><option value="colon">Colon</option><option value="comma">Comma</option></select></p>');
			$("#credFormLog"+el).find('.downloadOptions').append('<p style="padding:5px 0 5px 0">Time format <select class="timeFormat inputdl"><option selected value="unix">Unix Timestamp</option><option  value="matlab">Matlab</option><option  value="igor">Igor</option><option value="string">Time String</option></select></p>');
			//$(".lightboxable").find('.downloadOptions').append('<p style="padding:15px 0 15px 0">Time format (<a href="https://momentjs.com/docs/#/displaying/">Reference</a>): <input class="timeFormat inputdl"></input><span class="timeError" style="background-color:#f2dede"></span></p>');
			$("#credFormLog"+el).find('.downloadOptions').append('<div class="buttonDiv" style="margin:auto;text-align:center"><button class="button pill danger" onclick="displayInstLog('+theInstid+','+el+')" style="font-size:120%">Back</button></div>');
			$("#credFormLog"+el).find('.inputdl').change(function(){
				parsedLog=theInstrument.log;
				var theSeparator=$("#credFormLog"+el).find('.downloadOptions').find('.separator').val();
				var tFormat=$("#credFormLog"+el).find('.downloadOptions').find('.timeFormat').val();
				var filename=$("#credFormLog"+el).find('.downloadOptions').find('.filename').val();
				if(theSeparator=='tab'){
					var actualSep='\t';
				}
				if(theSeparator=='comma'){
					var actualSep=',';
				}
				if(theSeparator=='colon'){
					var actualSep=';';
				}
				$("#credFormLog"+el).find('.downloadList').remove();
				var theList='date'+actualSep+'author'+actualSep+'entry\n';
				for(var l=0; l<parsedLog.length; l++){
					if(tFormat=='unix'){
						var theDate=Number(parsedLog[l].date);
					}
					if(tFormat=='matlab'){
						var theDate=Number(parsedLog[l].date)/86400000 + 719529;
					}
					if(tFormat=='igor'){
						var theDate=(Number(parsedLog[l].date)-moment.utc("01-01-1904", "MM-DD-YYYY").valueOf())/1000;
					}
					if(tFormat=='string'){
						var theDate=moment.utc(Number(parsedLog[l].date)).format('DD/MM/YYYY HH:mm:ss');
					}
					theList=theList+theDate+actualSep+parsedLog[l].author+actualSep+parsedLog[l].entry.split('\n').join(' ').split(actualSep).join(' ')+'\n';
				}
				var file = new File([theList], filename, {type: "text/plain"});
				var fileURL=URL.createObjectURL(file);
				$("#credFormLog"+el).find('.buttonDiv').append('<a href='+fileURL+' download="'+filename+'" class="button pill downloadList" style="font-size:150%">Download</a>');
				$("#credFormLog"+el).find('.downloadList').click(function(){
					displayInstLog(theInstid,el);
					$.colorbox.resize();
				});
				$.colorbox.resize();
			});
			$($("#credFormLog"+el).find('.inputdl')[0]).trigger('change');
			$.colorbox({
				inline:true,
				href:$("#credFormLog"+el),
				onOpen:function(){
					$("#credFormLog"+el+"-outer").show();
				},
				onCleanup:function(){
					$("#credFormLog"+el+"-outer").hide();
				},
				width:"75%",
				maxWidth: "1000px",
				closeButton	:false
			});
		}
	});
}

function displayAdmin(instid,el){
	$.ajax({
		method: "POST",
		url:"queryInstCreds",
		dataType: "json",
		data:{'database':dbname,'instid':instid},
		success: function(returned) {
			if(returned.type=="1"){
				$.ajax({
					method: "POST",
					url:"queryInstDetails",
					dataType: "json",
					data: {"database":dbname,"instid":instid},
					success: function(returned,status,derp) {
						var theInstrument=returned;
						$.colorbox.resize();
						$('#channInfo'+el).DataTable().destroy();
						$('#channInfo'+el).remove();
						$("#instRequestCreds").find("#credFormLog"+el+"-outer").remove();
						$("#instRequestCreds").find("#credFormAdmin"+el+"-outer").remove();
						$("#instRequestCreds").find("#credForm"+el+"-outer").remove();
						$("#instRequestCreds").find("#credFormParse"+el+"-outer").remove();
						$("#instRequestCreds").append('<div id="credFormAdmin'+el+'-outer"><div id="credFormAdmin'+el+'"><h2 align="center">'+theInstrument.Name+' - Admin site</h2><div style="width:100%;margin:auto;text-align:center;align:center;" class="buttons"><button class="info'+el+' button pill icon home">Info</button><button class="log'+el+' button pill icon log">Logbook</button><button class="admin'+el+' button pill icon user" disabled>Admin</button></div><hr style="width:25%"><div class="instLogShow"></div><div class="instLogInsert"></div><div class="submitDiv" style="maring:auto;width:100%;text-align:center;align:center;"></div></div></div><div id="credForm'+el+'-outer"><div id="credForm'+el+'"></div></div><div id="credFormLog'+el+'-outer"><div id="credFormLog'+el+'"></div></div><div id="credFormParse'+el+'-outer"><div id="credFormParse'+el+'"></div></div>');
						$("#credFormAdmin"+el).append('<div>This instrument is currently asigned to this user: <span style="font-weight:bold" class="userName">'+theInstrument.username+'</span> <button class="change button pill icon settings"></button></div>');
						$("#credFormAdmin"+el).find('.change').click(function(){
							$("#credFormAdmin"+el).find('.changeUserDiv').remove();
							$("#credFormAdmin"+el).append('<div class="changeUserDiv"><p></p><p></p>Select a user to change : <select class="changeUser"><option selected disabled value="null">--- SELECT ONE ---</optioN></select></div>');
							$.ajax({
								method: "POST",
								url:"/admin/queryUsers",
								dataType: "json",
								data:{'dbname':dbname},
								success: function(returned) {
									var users=returned;
									for(var l=0; l<users.length; l++){
										if(theInstrument.username!=users[l].username){
											$("#credFormAdmin"+el).find('.changeUser').append('<option value="'+users[l].username+'">'+users[l].username+'</option>');
										}
									}
								}
							});
							$("#credFormAdmin"+el).find('.changeUser').change(function(){
								$("#credFormAdmin"+el).find('.changeUserDiv').find('.submitDiv').remove()
								$("#credFormAdmin"+el).find('.changeUserDiv').append('<div class="submitDiv" style="margin:auto;text-align:center"><button style="font-size:150%" class="submit button pill">Change</button></div>');
								$("#credFormAdmin"+el).find('.changeUserDiv').find('.submit').click(function(){
									var newUserName=$("#credFormAdmin"+el).find('.changeUser').val();
									$.ajax({
										method: "POST",
										url:"changeInstOp",
										dataType: "json",
										data:{'instid':instid,'database':dbname,'newUsername':newUserName},
										success: function(returned) {
											displayAdmin(instid,el);
										},
										error: function(returned){
											alert('An error occurred '+ returned);
											displayAdmin(instid,el);
										}
									});
								});
								$.colorbox.resize();
							});
							$.colorbox.resize();
						});
						$("#credFormAdmin"+el).find('.info'+el).unbind('click');
						$("#credFormAdmin"+el).find('.info'+el).click(function(){
							var localEl=el;
							var localID=instid;
							displayInstData(localID,localEl);
						});
						$("#credFormAdmin"+el).find('.log'+el).click(function(){
							var localEl=el;
							var localID=instid;
							displayInstLog(localID,localEl);
						});
						/* $("#credFormAdmin"+el).find('.parse'+el).click(function(){
							var localEl=el;
							var localID=instid;
							displayInstParse(localID,localEl);
							<button class="parse'+el+' button pill icon calendar">Parsing</button>
						}); */
						$.colorbox({
							inline:true,
							href:$("#credFormAdmin"+el),
							onOpen:function(){
								$("#credFormAdmin"+el+"-outer").show();
							},
							onCleanup:function(){
								$("#credFormAdmin"+el+"-outer").hide();
								updateInstTable(1);
							},
							width:"75%",
							maxWidth: "1000px",
							closeButton	:false
						});
					}
				});
			}
			else{
				alert("A problem occurred or you don't have the credentials to access this section");
			}
		}
	});
}

/* function displayInstParse(instid,el){
	$.ajax({
		method: "POST",
		url:"queryInstCreds",
		dataType: "json",
		data:{'instid':instid,'database':dbname},
		success: function(returned) {
			if(returned.type=="1" || returned.error=="0"){
				$.ajax({
					method: "POST",
					url:"queryInstDetails",
					dataType: "json",
					data: {"database":dbname,"instid":instid},
					success: function(returned,status,derp) {
						var theInstrument=returned;
						$('#channInfo'+el).DataTable().destroy();
						$('#channInfo'+el).remove();
						$("#instRequestCreds").find("#credFormLog"+el+"-outer").remove();
						$("#instRequestCreds").find("#credFormAdmin"+el+"-outer").remove();
						$("#instRequestCreds").find("#credForm"+el+"-outer").remove();
						$("#instRequestCreds").find("#credFormParse"+el+"-outer").remove();
						$("#instRequestCreds").append('<div id="credFormParse'+el+'-outer"><div id="credFormParse'+el+'"><h2 align="center">'+theInstrument.Name+' - Parsing</h2><div style="width:100%;margin:auto;text-align:center;align:center;" class="buttons"><button class="info'+el+' button pill icon home">Info</button><button class="log'+el+' button pill icon log">Logbook</button><button class="parse'+el+' button pill icon calendar" disabled>Parsing</button><button class="admin'+el+' button pill icon user">Admin</button></div><hr style="width:25%"><div class="instLogShow-outer"><div class="instLogShow"></div><div class="dlButton" style="margin:auto;text-align:center"></div></div><div class="instLogInsert"></div><div class="submitDiv" style="maring:auto;width:100%;text-align:center;align:center;"></div></div></div><div id="credForm'+el+'-outer"><div id="credForm'+el+'"></div></div><div id="credFormAdmin'+el+'-outer"><div id="credFormAdmin'+el+'"></div></div><div id="credFormLog'+el+'-outer"><div id="credFormLog'+el+'"></div></div>');
						$("#credFormParse"+el).append('<p>Here you can view/stop/restart the parsing of your instrument</p><div class="metadataDiv"><table id="nodeInstruments" class="display" cellspacing="0" width="100%"></table></div>');
						nodeInstTableVar=$("#credFormParse"+el).find('#nodeInstruments').DataTable({
							columns: [
								{"data":"metaid","name":"metaid","title":"Meta ID","width":"10px"},
								{"data":"type","name":"type","title":"Type"},
								{"data":"details","name":"details","title":"Details"},
								{"data":"last","name":"last","title":"Last Change"},
								{"data":"statusB","name":"statusB","title":"Backup Lock"},
								{"data":"statusP","name":"statusP","title":"Parse Lock"},
								{"data":"active","name":"active","title":"Active"},
								{"data":"parseReset","name":"parseReset","title":"Actions"}
							],
							"oLanguage": {
								"sEmptyTable":     "Instrument contains no active backup/parsing directives"
							},
							responsive:true
						});
						for(var l=0; l<theInstrument.files.length; l++){
							var theType='';
							var parsingBButton='';
							var parsingPButton='';
							if(theInstrument.files[l].type=='0'){//File parsing details
								theType='File Parsing';
								var theDetails='<p>Extension : '+theInstrument.files[l].remarks.extension+'</p><p>Path : '+theInstrument.files[l].remarks.path+'</p><p>Pattern : '+theInstrument.files[l].remarks.pattern+'</p>';
								if(theInstrument.files[l].remarks.toParse=="true" || theInstrument.files[l].remarks.toParse=="1"){
									theDetails=theDetails+'<p>Header Lines: '+theInstrument.files[l].remarks.parsingInfo.headerLines+'</p><p>Separator : '+theInstrument.files[l].remarks.parsingInfo.separator+'</p>';
								}
								if(theInstrument.files[l].lockSync=='true' || theInstrument.files[l].lockSync=='1' || theInstrument.files[l].lockSync==1){
									var parsingBButton='<div><label class="lockP" ><label class="switch"><input class="thelockBButton" type="checkbox" checked><div class="slider round"></div></label></label></div>';
								}
								else{
									var parsingBButton='<div><label class="lockP" ><label class="switch"><input class="thelockBButton" type="checkbox"><div class="slider round"></div></label></label></div>';
								}
								theDetails=theDetails+'<p>No parsing set</p>';
								if(theInstrument.files[l].parsing.forcelock=='true' || theInstrument.files[l].parsing.forcelock=='1' || theInstrument.files[l].parsing.forcelock==1){
									var parsingPButton='<div><label class="lockP" ><label class="switch"><input checked class="thelockPButton" type="checkbox"><div class="slider round"></div></label></label></div>';
								}
								else{
									var parsingPButton='<div><label class="lockP" ><label class="switch"><input class="thelockPButton" type="checkbox"><div class="slider round"></div></label></label></div>';
								}
								var line={
									'metaid'     :   theInstrument.files[l].metaid,
									'type'       :   theType,
									'details'    :   theDetails,
									'last'       :   moment.utc(Number(theInstrument.files[l].clock)).format('YYYY/MM/DD HH:mm:ss'),
									'statusB'    :   parsingBButton,
									'statusP'    :   parsingPButton,
									'active'     :   '<span style="color:green" title="This directive has been enforced">Yes</span>',
									'parseReset' :   '<button title="Reset all parsing data" class="resetParse button pill icon reload danger"></button><button title="Remove all parsed information for this directive" class="removeParse button pill icon remove danger"></button>',
								}
								var theRow=nodeInstTableVar.row.add(line).draw(true);
							}
							if(Number(theInstrument.files[l].type)>100){
								$.ajax({
									method: "POST",
									url:"admin/checkAddons.php",
									data:{},
									dataType: "json",
									'theInst':theInstrument,
									'theIndex':l,
									success: function(returned){
										$($(".step5").find(".parseInfo").find(".exampleFile").parent()).hide();
										for (var i=0; i<returned.length; i++){
											if((Number(returned[i].id)+100)==Number(this.theInst.type) || (Number(returned[i].id)+100)==Number(this.theInst.insttype)){
												var filename=returned[i].filename;
												$.ajax({
													method: "POST",
													url:"admin/scanAddons.php",
													data:{'filename':returned[i].filename},
													dataType: "json",
													'thisIndex':i,
													'theInst':this.theInst,
													'theIndex':this.theIndex,
													'checkedAddon':returned[i].name,
													'lastClock':returned[i].clock,
													success: function(returned,status,derp) {
														var theElement=this.metaElement;
														if(returned.type=='fileParser'){
															theType='File Parsing';
															var theInstrument=this.theInst;
															var l=this.theIndex;
															var remarks=JSON.parse(theInstrument.meta[l].remarks);
															console.log(theInstrument);
															var theDetails='<p>Extension : '+remarks.extension+'</p><p>Path : '+remarks.path+'</p><p>Pattern : '+remarks.pattern+'</p>';
															if(remarks.toParse=="true" || remarks.toParse=="1"){
																theDetails=theDetails+'<p>Header Lines: '+remarks.parsingInfo.headerLines+'</p><p>Separator : '+remarks.parsingInfo.separator+'</p>';
															}
															if(theInstrument.meta[l].lockSync=='true' || theInstrument.meta[l].lockSync=='1'){
																var parsingBButton='<div><label class="lockP" ><label class="switch"><input class="thelockBButton" type="checkbox" checked><div class="slider round"></div></label></label></div>';
															}
															else{
																var parsingBButton='<div><label class="lockP" ><label class="switch"><input class="thelockBButton" type="checkbox"><div class="slider round"></div></label></label></div>';
															}
															theDetails=theDetails+'<p>No parsing set</p>';
															var foundActive=false;
															for(var i=0; i<theInstrument.parsing.length; i++){
																if(theInstrument.meta[l].metaid==theInstrument.parsing[i].metaid){
																	if(theInstrument.parsing[i].forcelock=='true' || theInstrument.parsing[i].forcelock=='1'){
																		var parsingPButton='<div><label class="lockP" ><label class="switch"><input checked class="thelockPButton" type="checkbox"><div class="slider round"></div></label></label></div>';
																	}
																	else{
																		var parsingPButton='<div><label class="lockP" ><label class="switch"><input class="thelockPButton" type="checkbox"><div class="slider round"></div></label></label></div>';
																	}
																	var line={
																		'metaid'     :   theInstrument.meta[l].metaid,
																		'type'       :   theType,
																		'details'    :   theDetails,
																		'last'       :   moment.utc(Number(theInstrument.meta[l].clock)).format('YYYY/MM/DD HH:mm:ss'),
																		'statusB'    :   parsingBButton,
																		'statusP'    :   parsingPButton,
																		'active'     :   '<span style="color:green" title="This directive has been enforced">Yes</span>',
																		'parseReset' :   '<button title="Reset all parsing data" class="resetParse button pill icon reload danger"></button><button title="Remove all parsed information for this directive" class="removeParse button pill icon remove danger"></button>',
																	}
																	foundActive=true;
																	var theRow=nodeInstTableVar.row.add(line).draw(true);
																	break
																}
															}
															if(!foundActive){
																var line={
																	'metaid'     :   theInstrument.meta[l].metaid,
																	'type'       :   theType,
																	'details'    :   theDetails,
																	'last'       :   'NEVER',
																	'statusB'    :   'N/A',
																	'statusP'    :   'N/A',
																	'active'     :   '<span style="color:red" title="Could not find a record of directive enforcment">No</span>',
																	'parseReset' :   '</button><button title="Remove all parsed information for this directive" class="removeParse button pill icon remove danger"></button>',
																}
																var theRow=nodeInstTableVar.row.add(line).draw(true);
															}
														}
														nodeInstTableVar.rows().every( function ( rowIdx, tableLoop, rowLoop ) {
															//this.node();
															var data = this.data();
															var node = this.node();
															var metaID=data['metaid'];
															//Find buttons for locking
															for(var l=0; l<theInstrument.meta.length; l++){
																if(metaID==theInstrument.meta[l].metaid){
																	$(node).find('.resetParse').unbind('click');
																	$(node).find('.resetParse').click(function(e){
																		r=confirm('This action resets all parsing data, starting collection of data from the beggining. This could significantly delay the collection of new instrument data. Are you sure you want to continue?');
																		if(r){
																			$.ajax({
																				method: "POST",
																				url:"editParsing",
																				dataType: "json",
																				data: {"instid":instid,"metaid":metaID,"database":dbname,"operation":'reset'},
																				success: function(returned,status,derp) {
																					if(returned.error=='0'){
																						alert('Reset successfull');
																						displayInstParse(instid,el)
																					}
																					else{
																						alert(returned.errorStr+' | '+returned.errorMsg);
																						displayInstParse(instid,el)
																					}
																				},
																				error:function(returned){
																					alert('There was an error handling your request');
																				}
																			});
																		}
																	});
																	$(node).find('.removeParse').unbind('click');
																	$(node).find('.removeParse').click(function(e){
																		r=confirm('This action removes this directive, all created channels and instrument data associated with it. Are you sure you want to continue?');
																		if(r){
																			$.ajax({
																				method: "POST",
																				url:"editParsing",
																				dataType: "json",
																				data: {"instid":instid,"metaid":metaID,"database":dbname,"operation":'remove'},
																				success: function(returned,status,derp) {
																					displayInstParse(instid,el)
																				},
																				error:function(returned){
																					alert('There was an error handling your request');
																					displayInstParse(instid,el)
																				}
																			});
																		}
																	});
																	$(node).find('.thelockBButton').unbind('click');
																	$(node).find('.thelockBButton').click(function(e){
																		e.preventDefault();
																		var theButton=$(this);
																		$.ajax({
																			method: "POST",
																			url:"editParsing",
																			dataType: "json",
																			data: {"instid":instid,"metaid":metaID,"database":dbname,"operation":'lockB'},
																			thisButton:theButton,
																			success: function(returned,status,derp) {
																				displayInstParse(instid,el)
																			},
																			error: function(returned){
																				alert('There was an error handling your request');
																				displayInstParse(instid,el)
																			}
																		});
																	});
																	$(node).find('.thelockPButton').unbind('click');
																	$(node).find('.thelockPButton').click(function(e){
																		e.preventDefault();
																		var theButton=$(this);
																		$.ajax({
																			method: "POST",
																			url:"editParsing",
																			dataType: "json",
																			data: {"instid":instid,"metaid":metaID,"database":dbname,"operation":'lockP'},
																			thisButton:theButton,
																			success: function(returned,status,derp) {
																				displayInstParse(instid,el)
																			},
																			error: function(returned){
																				alert('There was an error handling your request');
																				displayInstParse(instid,el)
																			}
																		});
																	});
																}
															}
														} );
														$.colorbox.resize();
													}
												});
											}
										}
									}
								});
							}
						}
						nodeInstTableVar.rows().every( function ( rowIdx, tableLoop, rowLoop ) {
							//this.node();
							var data = this.data();
							var node = this.node();
							var metaID=data['metaid'];
							//Find buttons for locking
							for(var l=0; l<theInstrument.files.length; l++){
								if(metaID==theInstrument.files[l].metaid){
									$(node).find('.thelockBButton').click(function(e){
										e.preventDefault();
										var theButton=$(this);
										$.ajax({
											method: "POST",
											url:"editParsing",
											dataType: "json",
											data: {"instid":instid,"metaid":metaID,"database":dbname,"operation":'lockB'},
											thisButton:theButton,
											success: function(returned,status,derp) {
												displayInstParse(instid,el);
											},
											error: function(returned){
												alert('There was an error handling your request');
												displayInstParse(instid,el);
											}
										});
									});
									$(node).find('.removeParse').unbind('click');
									$(node).find('.removeParse').click(function(e){
										r=confirm('This action removes this directive, all created channels and instrument data associated with it. Are you sure you want to continue?');
										if(r){
											$.ajax({
												method: "POST",
												url:"editParsing",
												dataType: "json",
												data: {"instid":instid,"metaid":metaID,"database":dbname,"operation":'remove'},
												success: function(returned,status,derp) {
													displayInstParse(instid,el);
												},
												error:function(returned){
													alert('There was an error handling your request');
													displayInstParse(instid,el);
												}
											});
										}
									});
									$(node).find('.resetParse').click(function(e){
										r=confirm('This action resets all parsing data, starting collection of data from the beggining. This could significantly delay the collection of new instrument data. Are you sure you want to continue?');
										if(r){
											$.ajax({
												method: "POST",
												url:"editParsing",
												dataType: "json",
												data: {"instid":instid,"metaid":metaID,"database":dbname,"operation":'reset'},
												success: function(returned,status,derp) {
													alert('Reset successfull');
													displayInstParse(instid,el);
												},
												error:function(returned){
													alert('There was an error handling your request');
													displayInstParse(instid,el);
												}
											});
										}
									});
									$(node).find('.thelockPButton').click(function(e){
										e.preventDefault();
										var theButton=$(this);
										$.ajax({
											method: "POST",
											url:"editParsing",
											dataType: "json",
											data: {"instid":instid,"metaid":metaID,"database":dbname,"operation":'lockP'},
											thisButton:theButton,
											success: function(returned,status,derp) {
												displayInstParse(instid,el);
											},
											error: function(returned){
												alert('There was an error handling your request');
												displayInstParse(instid,el);
											}
										});
									});
								}
							}
						} );
						$("#credFormParse"+el).find('.info'+el).click(function(){
							var localEl=el;
							var localID=instid;
							displayInstData(localID,localEl);
						});
						$("#credFormParse"+el).find('.admin'+el).click(function(){
							console.log('HERE!');
							var localEl=el;
							var localID=instid;
							displayAdmin(localID,localEl);
						});
						$("#credFormParse"+el).find('.log'+el).click(function(){
							var localEl=el;
							var localID=instid;
							displayInstLog(localID,localEl);
						});
						$.colorbox({
							inline:true,
							href:$("#credFormParse"+el),
							onOpen:function(){
								$("#credFormParse"+el+"-outer").show();
							},
							onCleanup:function(){
								$("#credFormParse"+el+"-outer").hide();
								updateInstTable(1);
							},
							width:"75%",
							maxWidth: "1000px",
							closeButton	:false
						});
					}
				});
			}
			else{
				alert("A problem occurred or you don't have the credentials to access this section");
			}
		}
	});
} */

window.setInterval(function(){
	if(!document.hidden){
		var update=new Date();
		if(document.querySelector('.entryDateActive')!=null){
			//document.querySelector('.entryDateActive')._flatpickr.setDate(update.getTime()+update.getTimezoneOffset()*1000*60);
			$('.entryDateActive').each(function(){
				this._flatpickr.setDate(update.getTime()+update.getTimezoneOffset()*1000*60);
			});
		}
	}
},1000);

var globalTester;
var channelTable;
var tableInit=0;
var globalTable=[];
var editingOver=1;
var fileEditing=-1;

function deleteInstrument(iid){
	question=confirm("Are you sure you want to delete this instrument? All data will be deleted!");
	console.log(iid);
	if(question){
		$.ajax({
			url:"deleteInstrument",
			dataType: "json",
			data: {"instid":iid,"database":dbname},
			type: 'POST',
			success: function(returned){
				$.ajax({
					method: "POST",
					url:"queryInstruments",
					dataType: "json",
					data: {"database":dbname},
					success: function(returned,status,derp) {
						existingInstruments=returned;
						var rows=instrumentsTable.rows().data();
						for(var l=0; l<rows.length; l++){
							var found=false;
							for(var i=0; i<existingInstruments.length; i++){
								if(rows[l]["Instrument ID"]==existingInstruments[i].instid){
									found=true;
								}
							}
							if(!found){
								instrumentsTable.row(l).remove().draw();
							}
						}
						$.colorbox.close();
						if(returned.length<1){
							instrumentsTable.settings()[0]["oLanguage"]["sEmptyTable"]="No instruments found, make one!";
							instrumentsTable.draw();
						}
					}
				});
			},
			error: function(returned){
				alert('There was an error processing your request');
			}
		});
	}
}

var globalRemark;

var originalClose=$.colorbox.close;
$.colorbox.close=function(){
	var response;
	if(!beforeCloseTest){
		response = confirm('You have unsaved changes on your instrument, are you sure you want to close this window?');
		if(!response){
			return;
		}
	}
	beforeCloseTest=true;
	$("#instRequestCreds").hide();
	currentInstrument={};
	originalClose();
};
var beforeCloseTest=true;

function setupStepInputs(localRoutine,stepArgument){
	if(Number($("#requestedInst").find('.step2').find('.routinePicker').val())>=0){
		localRoutine['remarks']=currentInstrument.files[Number($("#requestedInst").find('.step2').find('.routinePicker').val())]['remarks'];
		for (var prop in localRoutine['remarks']) {
			if($("#requestedInst").find('.step2').find('.secondStep').find('.'+prop).prop('type')=='checkbox'){
				$("#requestedInst").find('.step2').find('.secondStep').find('.'+prop).prop('checked',!(localRoutine['remarks'][prop]==true));
				$("#requestedInst").find('.step2').find('.secondStep').find('.'+prop).trigger("click");
			}
			else{
				$("#requestedInst").find('.step2').find('.secondStep').find('.'+prop).val(localRoutine['remarks'][prop]);
			}
			//if($("#requestedInst").find('.step2').find('.secondStep').find('.'+prop))
		}
	}
	else{
		localRoutine['remarks']={
			'toBackup' : true,
			'toParse'  : false
		};
	}
	$(".step2").find('.secondStep').find(":input").each(function(){
		//var empty=false;
		if($(this).prop('type')=='checkbox'){
			$(this).click(function(){
				localRoutine['remarks'][$(this).prop('class').split(' ')[0]]=$(this).prop('checked');
				var noFilled=0;
				$(".step2").find('.secondStep').find(":input").each(function(){
					$this=$(this);
					if($this.val()!='' && $this.is(":visible")){
						noFilled=noFilled+1;
					}
				});
				$(".step2").find(".notePar").find('.more').remove();
				if(noFilled==$(".step2").find('.secondStep').find(":input:visible").length){
					if('metaid' in localRoutine){
						$(".step2").find(".notePar").append('<input type="button" value="Submit Changes" class="more button pill" style="float: center;font-size:110%">');
						$(".step2").find(".more").click(function(){
							currentInstrument.files[Number($("#requestedInst").find('.step2').find('.routinePicker').val())]=localRoutine;
							newInst('step2');
						});
					}
					else{
						$(".step2").find(".notePar").append('<input type="button" value="More routines" class="more button pill" style="float: center;font-size:110%">');
						$(".step2").find(".more").click(function(){
							currentInstrument.files.push(localRoutine);
							newInst('step2');
						});
					}
				}
				if(Object.keys(currentInstrument).length > 0 && currentInstrument.constructor === Object){
					var localRemembered=JSON.parse(sessionStorage.getItem('daqbroker'));
					localRemembered['instrument']=currentInstrument;
					if('interfaceStep' in localRemembered.instrument){
						localRemembered.instrument.interfaceStep[stepArgument]=true;
					}
					else{
						localRemembered.instrument.interfaceStep={};
						localRemembered.instrument.interfaceStep[stepArgument]=true;
					}
					for(var prop in localRemembered.instrument.interfaceStep){
						if(prop!=stepArgument){
							localRemembered.instrument.interfaceStep[prop]=false;
						}
					}
					//localRemembered.instrument['interfaceStep']=arguments[0];
					if(!(currentInstrument.instid>=0)){
						sessionStorage.setItem('daqbroker', JSON.stringify(localRemembered));
					}
					else{
						delete localRemembered.instrument
						sessionStorage.setItem('daqbroker', JSON.stringify(localRemembered));
					}
				}
			});
		}
		else{
			$(this).on('input',function(){
				console.log($(this));
				localRoutine['remarks'][$(this).prop('class').split(' ')[0]]=$(this).val();
				var noFilled=0;
				$(".step2").find('.secondStep').find(":input").each(function(){
					$this=$(this);
					if($this.val()!='' && $this.is(":visible")){
						noFilled=noFilled+1;
					}
				});
				$(".step2").find(".notePar").find('.more').remove();
				if(noFilled==$(".step2").find('.secondStep').find(":input:visible").length){
					if('metaid' in localRoutine){
						$(".step2").find(".notePar").append('<input type="button" value="Submit Changes" class="more button pill" style="float: center;font-size:110%">');
						$(".step2").find(".more").click(function(){
							currentInstrument.files[Number($("#requestedInst").find('.step2').find('.routinePicker').val())]=localRoutine;
							newInst('step2');
						});
					}
					else{
						$(".step2").find(".notePar").append('<input type="button" value="More routines" class="more button pill" style="float: center;font-size:110%">');
						$(".step2").find(".more").click(function(){
							currentInstrument.files.push(localRoutine);
							newInst('step2');
						});
					}
				}
				if(Object.keys(currentInstrument).length > 0 && currentInstrument.constructor === Object){
					var localRemembered=JSON.parse(sessionStorage.getItem('daqbroker'));
					localRemembered['instrument']=currentInstrument;
					if('interfaceStep' in localRemembered.instrument){
						localRemembered.instrument.interfaceStep[stepArgument]=true;
					}
					else{
						localRemembered.instrument.interfaceStep={};
						localRemembered.instrument.interfaceStep[stepArgument]=true;
					}
					for(var prop in localRemembered.instrument.interfaceStep){
						if(prop!=stepArgument){
							localRemembered.instrument.interfaceStep[prop]=false;
						}
					}
					//localRemembered.instrument['interfaceStep']=arguments[0];
					if(!(currentInstrument.instid>=0)){
						sessionStorage.setItem('daqbroker', JSON.stringify(localRemembered));
					}
					else{
						delete localRemembered.instrument
						sessionStorage.setItem('daqbroker', JSON.stringify(localRemembered));
					}
				}
			});
		}
	});
}

function newInst(){
	var localData = JSON.parse(localStorage.getItem('daqbroker'))
	var functionArguments=arguments;
	if('privateKey' in localData){
		dataToSend = {'privateKey':localData.privateKey};
	}
	else{
		dataToSend = {};
	}
	$.ajax({
		url:"/admin/testAdminOneTime",
		dataType: "json",
		data: dataToSend,
		type: 'POST',
		success: function(returned){
			var thereAreErrors=false;
			$("#requestedInst").find(".nextFinish").remove();
			if('instid' in currentInstrument){
				if(currentInstrument.instid>=0){
					currentInstrument['interfaceStep']={
						'step1' : true,
						'step2' : false,
						'step3' : false,
						'step4' : false
					};
				}
			}
			if(functionArguments.length<1){
				var localRemembered=JSON.parse(sessionStorage.getItem('daqbroker'));
				if('instrument' in localRemembered){
					var stupidName=$.confirm({
						title    : 'Existing Data',
						backgroundDismiss: true,
						content:'It looks like you were working on an instrument but never submitted your changes, would you like to load this instrument? (selecting no will discard this instrument)',
						buttons:{
							Yes:{
								btnClass: 'btn-blue',
								action: function(){
									currentInstrument=localRemembered['instrument'];
									var step='step1';
									for(var prop in localRemembered.instrument.interfaceStep){
										if(localRemembered.instrument.interfaceStep[prop] && prop!="[object Object]"){
											var step=prop;
											break
										}
										else{
											var step="step1";
										}
									}
									newInst(step);
									self.close();
									$.colorbox({
										inline:true,
										href:$("#requestedInst"),
										onOpen:function(){
											$("#requestedInst-outer").show();
										},
										onCleanup:function(){
											$("#requestedInst-outer").hide();
										},
										width:"75%",
										maxWidth: "1000px",
										closeButton	:false
									});
								}
							},
							No:{
								btnClass: 'btn-red',
								action: function(){
									delete localRemembered['instrument'];
									sessionStorage.setItem('daqbroker', JSON.stringify(localRemembered));
									newInst();
									self.close();
									$.colorbox({
										inline:true,
										href:$("#requestedInst"),
										onOpen:function(){
											$("#requestedInst-outer").show();
										},
										onCleanup:function(){
											$("#requestedInst-outer").hide();
										},
										width:"75%",
										maxWidth: "1000px",
										closeButton	:false
									});
								}
							}
						}
					});
				}
				else{
					$("#requestedInst").empty();
					$("#requestedInst").append('<form id="requestedInstForm" hidden><input name="isNewInstrument" class="isNewInstrument" value="1"></input></form><div class="welcome"><p>Welcome to the instrument creator, following these steps will help you create a new instrument on the DAQBroker database.</p><p><input type="button" value="Next" class="next button pill" style="float: right;font-size:110%"></p></div>');
					currentInstrument.isNewInstrument=1;
					$("#requestedInst").find(".next").click(function(){
						$this=$(this);
						currentInstrument.files=[];
						$(".welcome").fadeOut(300,function(){$(".welcome").remove();newInst('step1');});
					});
					$.colorbox({
						inline:true,
						href:$("#requestedInst"),
						onOpen:function(){
							$("#requestedInst-outer").show();
						},
						onCleanup:function(){
							$("#requestedInst-outer").hide();
						},
						width:"75%",
						maxWidth: "1000px",
						closeButton	:false
					});
				}
			}
			else{
				$("#requestedInst").find(".buttons").remove();
				$("#requestedInst").prepend('<div class="buttons" style="text-align:center;"><hr></div>');
				if('interfaceStep' in currentInstrument){
					if('step4' in currentInstrument.interfaceStep){
						$("#requestedInst").find(".buttons").prepend('<button class="step4Button" disabled>Finalize</button>');
					}
					if('step3' in currentInstrument.interfaceStep){
						$("#requestedInst").find(".buttons").prepend('<button class="step3Button" disabled>Step 3</button>');
					}
					if('step2' in currentInstrument.interfaceStep){
						$("#requestedInst").find(".buttons").prepend('<button class="step2Button" disabled>Step 2</button>');
					}
					if('step1' in currentInstrument.interfaceStep){
						$("#requestedInst").find(".buttons").prepend('<button class="step1Button" disabled>Step 1</button>');
					}
				}
				var stepArgument=functionArguments[0];
				if(functionArguments[0]=='step1'){
					beforeCloseTest=false;
					if($("#requestedInst").find('.step1').length>0){
						$("#requestedInst").find('.step1').remove();
					}
					$("#requestedInst").find(".buttons").find(".step2Button").prop('disabled',false);
					$("#requestedInst").find(".buttons").find(".step3Button").prop('disabled',false);
					$("#requestedInst").find(".buttons").find(".step1Button").prop('disabled',true);
					$("#requestedInst").find(".buttons").find(".step4Button").prop('disabled',false);
					if($("#requestedInst").find(".buttons").find('.step1Button').length<1){
						$("#requestedInst").find(".buttons").prepend('<button class="step1Button" disabled>Step 1</button>');
					}
					$("#requestedInst").append('<div class="step1" style="font-size=36"><h2>Step 1 : Basic info</h2><p>First off, provide some basic information about the instrument</p><p>Name : <input type="text" class="Name"><span class="error" style="color:red;"></span></input></p><p>Description: <textarea required class="description"></textarea></p><p>Contact info: <textarea required class="email"></textarea></p><p><button class="next button pill" style="float:right;font-size:110%">Next</button></p></div>')
					$("#requestedInst").find(".Name").alphanum({
						allow              : '_-',
						allowUpper         : true,
						allowOtherCharSets : false,
						allowSpace         : false
					});
					for (var prop in currentInstrument) {
						$("#requestedInst").find("."+prop).val(currentInstrument[prop]);
					}
					$("#requestedInst").find(".description").on('input',function(){
						currentInstrument.description=$(this).val();
						if(Object.keys(currentInstrument).length > 0 && currentInstrument.constructor === Object){
							var localRemembered=JSON.parse(sessionStorage.getItem('daqbroker'));
							localRemembered['instrument']=currentInstrument;
							if('interfaceStep' in localRemembered.instrument){
								localRemembered.instrument.interfaceStep[stepArgument]=true;
							}
							else{
								localRemembered.instrument.interfaceStep={};
								localRemembered.instrument.interfaceStep[stepArgument]=true;
							}
							for(var prop in localRemembered.instrument.interfaceStep){
								if(prop!=stepArgument){
									localRemembered.instrument.interfaceStep[prop]=false;
								}
							}
							//localRemembered.instrument['interfaceStep']=arguments[0];
							if(!(currentInstrument.instid>=0)){
								sessionStorage.setItem('daqbroker', JSON.stringify(localRemembered));
							}
							else{
								delete localRemembered.instrument
								sessionStorage.setItem('daqbroker', JSON.stringify(localRemembered));
							}
						}
					});
					$("#requestedInst").find(".email").on('input',function(){
						currentInstrument.email=$(this).val();
						if(Object.keys(currentInstrument).length > 0 && currentInstrument.constructor === Object){
							var localRemembered=JSON.parse(sessionStorage.getItem('daqbroker'));
							localRemembered['instrument']=currentInstrument;
							if('interfaceStep' in localRemembered.instrument){
								localRemembered.instrument.interfaceStep[stepArgument]=true;
							}
							else{
								localRemembered.instrument.interfaceStep={};
								localRemembered.instrument.interfaceStep[stepArgument]=true;
							}
							for(var prop in localRemembered.instrument.interfaceStep){
								if(prop!=stepArgument){
									localRemembered.instrument.interfaceStep[prop]=false;
								}
							}
							//localRemembered.instrument['interfaceStep']=arguments[0];
							if(!(currentInstrument.instid>=0)){
								sessionStorage.setItem('daqbroker', JSON.stringify(localRemembered));
							}
							else{
								delete localRemembered.instrument
								sessionStorage.setItem('daqbroker', JSON.stringify(localRemembered));
							}
						}
					});
					$("#requestedInst").find(".Name").on('input',function(){
						var found=false;
						$this=$(this);
						$(".error").empty();
						for(var i=0; i<existingInstruments.length; i++){
							if($("#requestedInst").find(".Name").val()==existingInstruments[i].Name && !('instid' in currentInstrument)){
								found=true;
								break;
							}
						}
						if(found){
							$(".error").append('Unavailable, choose another');
						}
						else{
							currentInstrument.Name=$("#requestedInst").find(".Name").val();
						}
						if(Object.keys(currentInstrument).length > 0 && currentInstrument.constructor === Object){
							console.log(stepArgument);
							var localRemembered=JSON.parse(sessionStorage.getItem('daqbroker'));
							localRemembered['instrument']=currentInstrument;
							if('interfaceStep' in localRemembered.instrument){
								localRemembered.instrument.interfaceStep[stepArgument]=true;
							}
							else{
								localRemembered.instrument.interfaceStep={};
								localRemembered.instrument.interfaceStep[stepArgument]=true;
							}
							for(var prop in localRemembered.instrument.interfaceStep){
								if(prop!=stepArgument){
									localRemembered.instrument.interfaceStep[prop]=false;
								}
							}
							//localRemembered.instrument['interfaceStep']=arguments[0];
							if(!(currentInstrument.instid>=0)){
								sessionStorage.setItem('daqbroker', JSON.stringify(localRemembered));
							}
							else{
								delete localRemembered.instrument
								sessionStorage.setItem('daqbroker', JSON.stringify(localRemembered));
							}
						}
					});
					$("#requestedInst").find(".next").click(function(){
						$this=$(this);
						var found=false;
						for(var i=0; i<existingInstruments.length; i++){
							if($("#requestedInst").find(".Name").val()==existingInstruments[i].Name && !('instid' in currentInstrument)){
								found=true;
								break;
							}
						}
						$(".error").empty();
						if(found){
							$(".error").append('Unavailable, choose another');
							thereAreErrors=true;
							$(".buttons").find(":input").prop('disabled',true);
						}
						else{
							if($("#requestedInst").find(".Name").val()==''){
								$(".error").append('No name chosen');
								$(".buttons").find(":input").prop('disabled',true);
								thereAreErrors=true;
							}
							else{
								if($(".error").html().length==0){
									$(".step1").fadeOut(300,function(){
										if($("#requestedInstForm").find(".instName").length>0){
											$("#requestedInstForm").find(".instName").val($("#requestedInst").find(".Name").val());
										}
										else{
											$("#requestedInstForm").append('<input type="text" name="instName" class="instName" value="'+$("#requestedInst").find(".Name").val()+'"></input>');
										}
										currentInstrument.name=$("#requestedInst").find(".Name").val();
									});
									thereAreErrors=false;
									newInst('step2');
								}
							}
						}
					});
					$(".step1").fadeIn(300);
					$(".step2").fadeOut(300);
					$(".step3").fadeOut(300);
					$(".step4").fadeOut(300);
				}
				if(functionArguments[0]=='step2'){
					var selectedRoutine=-1;
					if(Number($("#requestedInst").find('.step2').prop('currRoutine'))>=0){
						selectedRoutine=Number($("#requestedInst").find('.step2').prop('currRoutine'));
					}
					if($("#requestedInst").find('.step2').length>0){
						$("#requestedInst").find('.step2').remove();
					}
					$("#requestedInst").find(".buttons").find(".step1Button").prop('disabled',false);
					$("#requestedInst").find(".buttons").find(".step2Button").prop('disabled',true);
					$("#requestedInst").find(".buttons").find(".step3Button").prop('disabled',false);
					$("#requestedInst").find(".buttons").find(".step4Button").prop('disabled',false);
					if($("#requestedInst").find(".buttons").find('.step2Button').length<1){
						$("#requestedInst").find(".buttons").find('.step1Button').after('<button class="step2Button" disabled>Step 2</button>');
					}
					$("#requestedInst").append('<div class="step2" style="font-size=36"><h2>Step 2 : Data sources</h2><p>Select an existing data acquisition routine or create a new one</p><p style="margin:auto;text-align: center"><select class="routinePicker"><option value="-1" selected> (+)New routine </option></select></p><hr style="width:25%"><div class="firstStep"></div><p class="notePar"><input type="button" value="Next" class="next button pill" style="float: right;font-size:110%"></p></div>');
					for(var i=0; i<currentInstrument.files.length; i++){
						$("#requestedInst").find('.step2').find('.routinePicker').append('<option value="'+i+'">'+currentInstrument.files[i].name+'</option>');
					}
					$(".step2").find(".next").click(function(){
						$(".step2").fadeOut(300);
						var count=0;
						$("#requestedInst").find('.step2').find(':input:visible').each(function(){
							if($(this).val()!=''){
								count=count+1;
							}
							else{
								return false
							}
						});
						if(Number($("#requestedInst").find('.step2').find('.routinePicker').val())<0){
							if(count==$("#requestedInst").find('.step2').find(':input:visible').length){
								if($(".step2").find(".more").length>0){
									var localVar={
										'name'    : $("#requestedInst").find('.step2').find('.name').val(),
										'node'    : $("#requestedInst").find('.step2').find('.node').val(),
										'type'    : $("#requestedInst").find('.step2').find('.type').val(),
										'remarks' : {
											'toBackup': true,
											'toParse' : false
										}
									};
									$("#requestedInst").find('.step2').find('.secondStep').find(':input').each(function(){
										localVar['remarks'][$(this).prop('class').split(' ')[0]]=$(this).val();
									});
									currentInstrument.files.push(localVar);
								}
								newInst('step3');
							}
							else{
								r=confirm("Your information has not yet been saved, are you sure you want to move on?");
								if(r){
									newInst('step3');
								}
							}
						}
						else{
							newInst('step3');
						}
					});
					$("#requestedInst").find('.step2').find('.routinePicker').change(function(){
						$("#requestedInst").find('.step2').prop('currRoutine',Number($(this).val()));
						$(".step2").find(".firstStep").empty();
						$(".step2").find(".firstStep").append('<div style="margin:auto;text-align:center"><img class="outcome" src="/static/loading.gif" height="50" width="50"></img></div>');
						$.ajax({
							url: '/monitoring/queryNodes',
							type: 'POST',
							dataType: "json",
							success: function(returned){
								$(".step2").find(".firstStep").empty();
								$("#requestedInst").find(".firstStep").append('<p class="welcome">Your instrument provides some sort of data output. Please describe each source of data (you can repeat this process multiple times)</p><p>Routine name : <input class="name selectMetaStart"></input></p><p> Node : <select class="node selectMetaStart"><option value="-9999" selected disabled>--- SELECT ONE ---</option></select></p> <p> Data type : <select class="type selectMetaStart"><option value="-9999" selected disabled hidden>--- SELECT ONE ---</option><option value="0">Data file(s)</option><option value="1" disabled title="Coming soon">Network stream (port communication)</option><option value="2" disabled title="Coming soon">Serial (COM) port</option><option value="3"  disabled title="Coming soon">Processed files</option></select></p><div class="secondStep"></div>');
								var nodes=returned;
								for(var i=0; i<nodes.length; i++){
									var activeText='No';
									if(nodes[i].active == 1){
										var activeText='Yes';
									}
									$("#requestedInst").find('.step2').find('.node').append('<option title="Address:'+nodes[i].address+'&#013;Active : '+activeText+'&#013;Last contact : '+moment.utc(nodes[i].lastActive*1000).format('DD/MM/YYYY HH:mm:ss')+'" value="'+nodes[i].node+'">'+nodes[i].name+'</option>');
								}
								if(Number($("#requestedInst").find('.step2').find('.routinePicker').val())>=0){
									var localRoutine=currentInstrument.files[Number($("#requestedInst").find('.step2').find('.routinePicker').val())];
									for (var prop in localRoutine) {
										$("#requestedInst").find('.step2').find('.firstStep').find('.'+prop).val(localRoutine[prop]);
									}
								}
								else{
									var localRoutine={};
								}
								$("#requestedInst").find('.step2').find('.selectMetaStart').unbind("change");
								$("#requestedInst").find('.step2').find('.selectMetaStart').change(function(){
									var foundBad=false;
									localRoutine[$(this).prop('class').split(' ')[0]]=$(this).val();
									$("#requestedInst").find('.step2').find('.selectMetaStart').each(function(){
										if($(this).val()==null || $(this).val()==''){
											foundBad=true;
											return false
										}
									});
									$("#requestedInst").find('.step2').find('.secondStep').empty();
									//localRoutine["remarks"]={}; //DO I DO THIS?!
									if(!('remarks' in localRoutine)){
										localRoutine["remarks"]={};
										localRoutine["remarks"]["command"]="";
										localRoutine["remarks"]["commandRequired"]=false;
									}
									if(!foundBad){
										if(Number($("#requestedInst").find('.step2').find('.type').val())==0){
											$("#requestedInst").find('.step2').find('.secondStep').append('<hr style="width:25%;margin:auto"><p>So, your instrument outputs data files, please provide more information about those files</p></p><p>Absolute file path : <input type="text" class="path"></input> </p> <p>Search also nested folders : <input type="checkbox" value="alisjdaopsidjas" class="getNested"></p> <p>Unique file identifier : <input type="text" class="pattern"></intput</p><p>File extension : <input type="text" class="extension"></input> </p><p>Check files every <input type="number" min="0.0" step="0.5" class="parseInterval"></input> second(s)</p>');
											setupStepInputs(localRoutine,stepArgument);
										}
										if(Number($("#requestedInst").find('.step2').find('.type').val())==1){
											$("#requestedInst").find('.step2').find('.secondStep').append('<hr style="width:25%;margin:auto"><p>So, your instrument outputs a network stream, please provide more information</p></p><p>Port number : <input type="number" min="1" max="65535" class="port"></input> </p> <p>Command required : <input type="checkbox" value="alisjdaopsidjas" class="commandRequired"> <input style="display:none" class="command" value="" placeholder="type the command"></input></p> <p>Collect data every <input type="number" min="0.5" step="0.5" class="parseInterval"></input> second(s)</p>');
											$("#requestedInst").find(".commandRequired").click(function(){
												if($(this).prop("checked")){
													$("#requestedInst").find(".command").show();
													if($("#requestedInst").find(".command").val()!=''){
														$("#requestedInst").find(".command").trigger('input');
													}
												}
												else{
													localRoutine['remarks']["command"]='';
													$("#requestedInst").find(".command").hide()
												}
											});
											setupStepInputs(localRoutine,stepArgument);
										}
										if(Number($("#requestedInst").find('.step2').find('.type').val())==2){
											$("#requestedInst").find('.step2').find('.secondStep').append('<hr style="width:25%;margin:auto"><p>So, your instrument outputs from a serial port, </p></p><p>Serial port : <div class="comportlist"><img src="/static/loading.gif" height="25" width="25"></img> </div> <p>Command required : <input type="checkbox" value="alisjdaopsidjas" class="commandRequired"> <input style="display:none" class="command" value="" placeholder="type the command"></input></p> <p>Collect data every <input type="number" min="0.5" step="0.5" class="parseInterval"></input> second(s)</p>');
											$("#requestedInst").find(".commandRequired").click(function(){
												if($(this).prop("checked")){
													$("#requestedInst").find(".command").show();
													if($("#requestedInst").find(".command").val()!=''){
														$("#requestedInst").find(".command").trigger('input');
													}
												}
												else{
													localRoutine['remarks']["command"]='';
													$("#requestedInst").find(".command").hide()
												}
											});
											var stupidVar=localRoutine;
											stupidVar["order"]="getPorts";
											$.ajax({
												url: 'gatherNodeData',
												type: 'POST',
												dataType: "json",
												contentType: "application/json; charset=UTF-8",
												data: JSON.stringify(stupidVar),
												success: function(returned){
													theJob=returned.id;
													//GOT A JOB REFERENCE, GOTTA START PINGING TO SEE WHAT HAPPENED TO THE JOB
													//getDataCheck
													var requesting=setInterval(function(){
														var requestTerminated=false;
														var requestResult={};
														var theAjax=$.ajax({
															url: 'getDataCheck',
															type: 'POST',
															dataType: "json",
															data:{'id':theJob},
															success: function(returned){
																if(returned){//Finished regardless of problems
																	requestTerminated=true;
																	requestResult=returned;
																}
															},
															error: function(returned){
																requestTerminated=true;
																requestResult=-1;
															}
														});
														theAjax.always(function(){
															if(requestTerminated){//Got some developments
																var dataBits=[5,6,7,8,9];
																var parity=[{'value':'N','name':'None'},{'value':'O','name':'Odd'},{'value':'E','name':'Even'},{'value':'M','name':'Mark'},{'value':'S','name':'Space'}];
																var stopBits=[{'value':0,'name':'1'},{'value':1,'name':'1.5'},{'value':2,'name':'2'}]
																var theAjax2=$.ajax({
																	url: 'getDataAbort',
																	type: 'POST',
																	dataType: "json",
																	data:{'id':theJob}
																});
																$("#requestedInst").find('.step2').find('.secondStep').find('.comportlist').empty();
																if(requestResult.length>0){
																	$("#requestedInst").find('.step2').find('.secondStep').find('.comportlist').append('<p> Device : <select class="device"></select></p><p>Baud rate : <input class="baudRates" value="9600" type="number" min="30" step="1"></input></p><p>Data bits : <select class="dataBits"></select></p><p>Parity : <select class="parity"></select></p><p>Stop bits : <select class="stopBits"></select></p>');
																	for(var i=0; i<requestResult.length; i++){
																		$("#requestedInst").find('.step2').find('.secondStep').find('.comportlist').find(".device").append('<option value="'+requestResult[i].device+'">'+requestResult[i].device+' - '+requestResult[i].info+'</option>');
																	}
																	for(var i=0; i<dataBits.length; i++){
																		$("#requestedInst").find('.step2').find('.secondStep').find('.comportlist').find(".dataBits").append('<option value="'+dataBits[i]+'">'+dataBits[i]+'</option>');
																	}
																	for(var i=0; i<parity.length; i++){
																		$("#requestedInst").find('.step2').find('.secondStep').find('.comportlist').find(".parity").append('<option value="'+parity[i].value+'">'+parity[i].name+'</option>');
																	}
																	for(var i=0; i<stopBits.length; i++){
																		$("#requestedInst").find('.step2').find('.secondStep').find('.comportlist').find(".stopBits").append('<option value="'+stopBits[i].value+'">'+stopBits[i].name+'</option>');
																	}
																}
																
																else if(requestResult==-1){
																	$("#requestedInst").find('.step2').find('.secondStep').find('.comportlist').append('There was an error processing your request.');
																}
																else{
																	$("#requestedInst").find('.step2').find('.secondStep').find('.comportlist').append('No Serial ports found, make sure you are targeting the correct node and try again.')
																}
																clearTimeout(requesting);
																$.colorbox.resize();
																setupStepInputs(localRoutine,stepArgument);
															}
														});
													},1000);
												}
											});
										}
									}
									$.colorbox.resize();
								//</p><p>Absolute file path : <input type="text" class="path"></input> </p> <p>Search also nested folders : <input type="checkbox" class="getNested"></p> <p>Unique file identifier : <input type="text" class="pattern"></intput</p><p>File extension : <input type="text" class="extension"></input> </p><p>Check files every <input type="number" min="0.0" step="0.5" class="parseInterval"></input> second(s)</p><div class="filesOnRecord"></div><p class="notePar">NOTE: You can repeat this process as many times as you want if your instrument outputs more than one type of file</p></div>');
								});
								$($("#requestedInst").find('.step2').find('.selectMetaStart')[0]).trigger('change');
								$.colorbox.resize();
							}
						});
					});
					if(selectedRoutine>=0){
						$("#requestedInst").find('.step2').find('.routinePicker').val(selectedRoutine);
					}
					$("#requestedInst").find('.step2').find('.routinePicker').trigger('change');
					$(".step1").fadeOut(300);
					$(".step2").fadeIn(300);
					$(".step3").fadeOut(300);
					$(".step4").fadeOut(300);
					$.colorbox.resize();
				}
				if(functionArguments[0]=='step3'){
					var selectedRoutine=-1;
					if(Number($("#requestedInst").find('.step3').prop('currRoutine'))>=0){
						selectedRoutine=Number($("#requestedInst").find('.step3').prop('currRoutine'));
					}
					if($("#requestedInst").find('.step3').length>0){
						$("#requestedInst").find('.step3').remove();
					}
					$("#requestedInst").find(".buttons").find(".step1Button").prop('disabled',false);
					$("#requestedInst").find(".buttons").find(".step2Button").prop('disabled',false);
					$("#requestedInst").find(".buttons").find(".step3Button").prop('disabled',true);
					$("#requestedInst").find(".buttons").find(".step4Button").prop('disabled',false);
					if($("#requestedInst").find(".buttons").find('.step3Button').length<1){
						$("#requestedInst").find(".buttons").find('.step2Button').after('<button class="step3Button" disabled>Step 3</button>');
					}
					if(currentInstrument.files.length>0){
						$("#requestedInst").append('<div class="step3" style="font-size=36"><h2>Step 3 : Data handling</h2><p>Select an existing data acquisition routine</p><p style="margin:auto;text-align: center"><select class="routinePicker"><option value="-1" selected disabled> --- SELECT ONE --- </option></select></p><hr style="width:25%"><div class="firstStep"></div><div style="margin:auto;text-align:center" class="notePar"><hr style="width:25%"><button class="next button pill" style="font-size:110%">Finalize</button></div></div>');
					}
					else{
						$("#requestedInst").append('<div class="step3" style="font-size=36"><h2>Step 3 : Data handling</h2><p style="margin:auto;text-algin:center"><span style="color:#8a6d3b;background-color:#fcf8e3;border-color:#faebcc">There are no data acquisition routines to choose from. The instrument as is is not very helpfull</span></p><div style="margin:auto;text-align:center" class="notePar"><hr style="width:25%"><button class="next button pill" style="font-size:110%">Finalize</button></div></div>');
					}
					for(var i=0; i<currentInstrument.files.length; i++){
						$("#requestedInst").find('.routinePicker').append('<option value="'+i+'">'+currentInstrument.files[i].name+'</option>');
					}
					$(".step3").find(".next").click(function(){
						if($("#requestedInst").find('.step3').find('.channels').find('.channelEdit').find(':input').length>0){
							r=confirm('You are currently editing a data channel, any changes you have made are not going to be made, are you sure you want to continue?');
							if(r){
								newInst('step4');
							}
						}
						else{
							newInst('step4');
						}
					});
					$("#requestedInst").find('.step3').find('.routinePicker').change(function(){
						var currentFile=currentInstrument.files[Number($(this).val())];
						var fileIdx=Number($("#requestedInst").find('.step3').find('.routinePicker').val());
						$("#requestedInst").find('.step3').prop('currRoutine',Number($(this).val()));
						if(currentFile.type==0){
							$("#requestedInst").find('.step3').find('.firstStep').empty();
							$("#requestedInst").find('.step3').find('.firstStep').append('<p>Select what you want to do with this data :</p><p style="margin:auto;text-align: center">Backup : <input class="toBackup whatdo" type="checkbox" value="asfafaf"></input> | Parse : <input type="checkbox" class="toParse whatdo" value="asfafaf"></input></p><div class="secondStep"></div>');
							$("#requestedInst").find('.step3').find('.firstStep').find('.toBackup').prop('checked',currentFile.remarks.toBackup);
							$("#requestedInst").find('.step3').find('.firstStep').find('.toParse').prop('checked',currentFile.remarks.toParse);
							$("#requestedInst").find('.step3').find('.firstStep').find('.whatdo').change(function(){
								currentInstrument.files[fileIdx].remarks[$(this).prop('class').split(' ')[0]]=$(this).prop('checked');
								if($(this).prop('class').split(' ')[0]=='toParse'){
									$("#requestedInst").find('.step3').find('.secondStep').empty();
									if(!('parsingInfo' in currentInstrument.files[fileIdx].remarks)){
										if(currentInstrument.files[fileIdx].type==0){
											currentInstrument.files[fileIdx].remarks['parsingInfo']={
												'timeFormat'  : 'NOFORMAT',
												'separator'   : 'tab',
												'dataType'    : 0,
												'headerLines' : 0
											}
										}
									}
									if(currentInstrument.files[fileIdx].remarks.toParse){
										$("#requestedInst").find('.step3').find('.secondStep').append('<hr style="width:25%">');
										$("#requestedInst").find('.step3').find('.secondStep').append('<p>Data Type : <select class="dataType"><option value="0">Regular columns</option><option value="1">Horizntal columns</option></select></p><div class="colSizeDiv" style="padding-bottom:5px"></div>');
										$("#requestedInst").find('.step3').find('.secondStep').append('<p>Separator : <select class="separator"><option value="tab">Tab</option><option value="comma">Comma</option><option value="space">Space</option><option value="colon">Colon</option></select></p>');
										$("#requestedInst").find('.step3').find('.secondStep').append('<p><span class="stupidAmbiguousText">Header Lines</span> : <input type="number" min="0" class="headerLines" value="'+currentInstrument.files[fileIdx].remarks.parsingInfo.headerLines+'"></input></p>');
										$("#requestedInst").find('.step3').find('.secondStep').append('<p>Time Format (<a href="#format" class="showTheTable">Ref.</a>) : <input class="timeFormat" value="'+currentInstrument.files[fileIdx].remarks.parsingInfo.timeFormat+'"></input></p>');
										$("#requestedInst").find('.step3').find('.secondStep').append('<p style="magin:auto;text-align:center"><button style="font-size:90%" class="example button pill icon log">Provide example file</button></p>');
										$("#requestedInst").find('.step3').find(".dataType").change(function(){
											if($(this).val()=="1"){
												if(!("colSize" in currentInstrument.files[fileIdx].remarks.parsingInfo)){
													currentInstrument.files[fileIdx].remarks.parsingInfo["colSize"]=1;
												}
												$("#requestedInst").find('.step3').find(".colSizeDiv").append('Column size : <input class="colSize" type="number" min="1"></input>');
												$("#requestedInst").find('.step3').find(".colSizeDiv").find(".colSize").change(function(){
													currentInstrument.files[fileIdx].remarks.parsingInfo["colSize"]=Number($(this).val());
												});
												$("#requestedInst").find('.step3').find(".colSizeDiv").find(".colSize").val(currentInstrument.files[fileIdx].remarks.parsingInfo["colSize"]);
												$("#requestedInst").find('.step3').find('.stupidAmbiguousText').html("Data position");
											}
											else{
												if(!((typeof currentInstrument.files[fileIdx].remarks.parsingInfo["colSize"])==="undefined")){
													delete currentInstrument.files[fileIdx].remarks.parsingInfo["colSize"]
												}
												$("#requestedInst").find('.step3').find(".colSizeDiv").empty()
												$("#requestedInst").find('.step3').find('.stupidAmbiguousText').html("Header Lines");
											}
											$.colorbox.resize();
										});
										$("#requestedInst").find('.step3').find('.secondStep').find('.separator').val(currentInstrument.files[fileIdx].remarks.parsingInfo.separator);
										$("#requestedInst").find('.step3').find('.secondStep').find('.dataType').val(currentInstrument.files[fileIdx].remarks.parsingInfo.dataType);
										$("#requestedInst").find('.step3').find(".dataType").trigger('change');
										$("#requestedInst").find('.step3').find('.secondStep').find('.showTheTable').click(function(){
											showFormatTable('step3');
										});
										$("#requestedInst").find('.step3').find('.secondStep').find(':input').change(function(){
											var fileIdx=Number($("#requestedInst").find('.step3').find('.routinePicker').val());
											currentInstrument.files[fileIdx].remarks.parsingInfo[$(this).prop('class').split(' ')[0]]=$(this).val();
											if(Object.keys(currentInstrument).length > 0 && currentInstrument.constructor === Object){
												var localRemembered=JSON.parse(sessionStorage.getItem('daqbroker'));
												localRemembered['instrument']=currentInstrument;
												if('interfaceStep' in localRemembered.instrument){
													localRemembered.instrument.interfaceStep[stepArgument]=true;
												}
												else{
													localRemembered.instrument.interfaceStep={};
													localRemembered.instrument.interfaceStep[stepArgument]=true;
												}
												for(var prop in localRemembered.instrument.interfaceStep){
													if(prop!=stepArgument){
														localRemembered.instrument.interfaceStep[prop]=false;
													}
												}
												//localRemembered.instrument['interfaceStep']=arguments[0];
												if(!(currentInstrument.instid>=0)){
													sessionStorage.setItem('daqbroker', JSON.stringify(localRemembered));
												}
												else{
													delete localRemembered.instrument
													sessionStorage.setItem('daqbroker', JSON.stringify(localRemembered));
												}
											}
										});
										$("#requestedInst").find('.step3').find('.secondStep').find('.example').click(function(){
											exampleFileChannels(currentInstrument.files[fileIdx].remarks.parsingInfo,currentInstrument.files[fileIdx]);
										});
									}
								}
								if($("#requestedInst").find('.step3').find('.channels').length>0){
									if(!((typeof channelTable)==='undefined')){
										channelTable.destroy();
									}
									$("#requestedInst").find('.step3').find('.channels').remove();
								}
								if(currentFile.remarks.toParse){
									$("#requestedInst").find('.notePar').before('<div class="channels"><hr style="width:25%"><table id="channelsTable"></table><hr style="width:25%"><div class="channelEdit"></div></div>');
								}
								var linesTable=[];
								if('channels' in currentFile){
									for(var i=0; i<currentFile.channels.length; i++){
										if(Number(currentFile.channels[i].channeltype)==1){
											typeStr='Number';
										}
										else if(Number(currentFile.channels[i].channeltype)==2){
											typeStr='Character(s)';
										}
										else if(Number(currentFile.channels[i].channeltype)==3){
											typeStr='Composite';
										}
										if(Number(currentFile.channels[i].active)==0){
											activeStr='<span style="color:#a94442;background-color:#ebcccc;border-color:#ebcccc">No</span>';
										}
										else if(Number(currentFile.channels[i].active)==1){
											activeStr='<span style="color:#3c763d;background-color:#dff0d8;border-color:#d0e9c6">Yes</span>';
										}
										linesTable.push({
											'Name'          :   currentFile.channels[i].Name,
											'description'   :   currentFile.channels[i].description,
											'type'          :   typeStr,
											'units'         :   currentFile.channels[i].units,
											'active'        :   activeStr,
											'order'         :   (Number(currentFile.channels[i].fileorder)+1),
											'edit'         :   '<button class="'+i+' button pill icon edit"></button><button class="'+i+' button pill icon trash danger"></button>',
										});
									}
								}
								$("#requestedInst").find('.step3').find('.channels').find('#channelsTable').after('<p class="channelsButtons" style="margin:auto;text-align:center"><button style="font-size:90%" class="singleAdd button pill icon add">New channel</button><button style="font-size:90%" class="clearAll button pill icon remove danger">Remove all</button></p>');
								channelTable=$("#requestedInst").find('.step3').find('.channels').find('#channelsTable').DataTable({
									columns: [
										{data:'Name',"name":'Name',"title":'Name'},
										{data:'description',"name":'description',"title":'Description'},
										{data:'type',"name":'type',"title":'Type'},
										{data:'units',"name":'units',"title":'Units'},
										{data:'active',"name":'active',"title":'Active'},
										{data:'order',"name":'order',"title":'Order'},
										{data:'edit',"name":'edit',"title":''}
									],
									"oLanguage": {
										"sEmptyTable":     "There are no data channels for this routine!"
									},
									'data':linesTable
								});
								$("#requestedInst").find('.step3').find('.channels').find('.channelsButtons').find('.singleAdd').click(function(){
									var maxOrder=0;
									var localChannel={};
									localChannel["remarks"]={};
									$("#requestedInst").find('.step3').find('.channels').find('.channelEdit').empty();
									$("#requestedInst").find('.step3').find('.channels').find('.channelEdit').append('<h3>New Channel</h3><p>Name: <input class="Name" value=""></input> | Description: <input class="description" value="NONE"></input></p><p> Units: <input class="units" value="NONE"></input> Type: <select class="channeltype"><option value="1" selected>Number</option><option value="2">Character(s)</option><option value="3">Compound</option></select> |</p><p> Active: <select class="active"><option selected value="0">No</option><option value="1">Yes</option></select><span class="fileorderDiv"> Order: <select class="fileorder"></select></span>|</p>');
									$("#requestedInst").find('.step3').find('.channels').find('.channelEdit').append('<p><button class="button pill icon approve"></button><button class="button pill icon remove danger"></button></p>');
									$("#requestedInst").find('.step3').find('.channels').find('.channelEdit').find('.approve').focus();
									if('channels' in currentFile){
										for(var i=0; i<currentFile.channels.length; i++){
											if(Number(currentFile.channels[i].fileorder)>maxOrder){
												maxOrder=Number(currentFile.channels[i].fileorder);
											}
										}
									}
									else{
										currentFile.channels=[];
									}
									for(var i=0; i<=maxOrder+1; i++){
										$("#requestedInst").find('.step3').find('.channels').find('.channelEdit').find('.fileorder').append('<option value="'+i+'">'+(i+1)+'</option>');
									}
									$("#requestedInst").find('.step3').find('.channels').find('.channelEdit').find('.channeltype').change(function(){
										//fileorderDiv
										$("#requestedInst").find('.step3').find('.channels').find('.channelEdit').find('.fileorderDiv').empty();
										if(Number($(this).val())!=3){
											$("#requestedInst").find('.step3').find('.channels').find('.channelEdit').find('.fileorderDiv').append(' Order: <select class="fileorder"></select>');
											for(var i=0; i<=maxOrder+1; i++){
												$("#requestedInst").find('.step3').find('.channels').find('.channelEdit').find('.fileorder').append('<option value="'+i+'">'+(i+1)+'</option>');
											}
											$("#requestedInst").find('.step3').find('.channels').find('.channelEdit').find('.fileorder').val(maxOrder+1);
										}
										else{
											$("#requestedInst").find('.step3').find('.channels').find('.channelEdit').find('.fileorderDiv').append(' Custom expression (<a>Ref</a>): <textarea style="width:300px;height:50px" class="customExpression"></textarea>');
											$("#requestedInst").find('.step3').find('.channels').find('.channelEdit').find('.customExpression').change(function(){
												var theElement=$(this);
												$($(this).parent()).find(".outcome").remove();
												$(this).after('<img class="outcome" src="/static/loading.gif" height="25" width="25"></img>');
												if(!((typeof notyExpression)==="undefined")){
													notyExpression.close();
												}
												$.ajax({
													url: '/daqbroker/checkExpression',
													type: 'POST',
													dataType: "json",
													'theElement':theElement,
													contentType: "application/json; charset=UTF-8",
													data: JSON.stringify({'expression':theElement.val()}),
													async: false,
													success: function(returned){
														$(theElement.parent()).find(".outcome").prop('src','/static/ok.png');
														$(theElement.parent()).find(".outcome").prop('title','This is a valid expression');
														//currentFile.channels=currentFile.channels.filter(function(el){
														
													},
													error: function(returned){
														notyExpression=new Noty({
															text      :  "There was an error parsing the provided expression | "+JSON.stringify(returned),
															theme     :  'relax',
															type      :  'error'
														}).show();
														$(theElement.parent()).find(".outcome").prop('src','/static/no.png');
													}
												});
											});
											
										}
									});
									$("#requestedInst").find('.step3').find('.channels').find('.channelEdit').find('.channeltype').trigger("change");
									$("#requestedInst").find('.step3').find('.channels').find('.channelEdit').find('.fileorder').val(maxOrder+1);
									$("#requestedInst").find('.step3').find('.channels').find('.channelEdit').find('.approve').click(function(){
										var channIdx=Number($("#requestedInst").find('.step3').find('.channels').find('.channelEdit').find('.channIdx').val());
										var foundEmpty=false;
										$("#requestedInst").find('.step3').find('.channels').find('.channelEdit').find(':input').each(function(){
											if($(this).prop('type')!='submit'){
												if($(this).val()!=''){
													$(this).css({'color': '','background-color': '','border-color': ''});
													$(this).prop('title','');
													if(isNaN($(this).val())){
														if($(this).prop('class')=='customExpression'){//Put here all the stuff that goes into the remarks make an 'or' statment
															localChannel['remarks'][$(this).prop('class')]=$(this).val();
														}
														else{
															localChannel[$(this).prop('class')]=$(this).val();
														}
													}
													else{
														localChannel[$(this).prop('class')]=Number($(this).val());
													}
												}
												else{
													foundEmpty=true;
													$(this).css({'color': '#a94442','background-color': '#f2dede','border-color': '#ebccd1'});
													$(this).prop('title','Please fill out this information');
												}
											}
										});
										if(!foundEmpty){
											if(!('fileorder' in localChannel)){
												localChannel['fileorder']=-1
											}
											localChannel['channelid']=-1;
											localChannel['alias']=localChannel['Name'];
											currentFile.channels.push(localChannel);
											newInst('step3');
										}
									});
									$("#requestedInst").find('.step3').find('.channels').find('.channelEdit').find('.remove').click(function(){
										newInst('step3');
									});
								});
								$("#requestedInst").find('.step3').find('.channels').find('.channelsButtons').find('.clearAll').click(function(){
									var foundChannelID=false
									var auxList=[];
									$("#requestedInst").find('.step3').find('.channels').find('.channelsButtons').find('.clearAll').html('Please wait...');
									if('channels' in currentFile){
										for(var i=0; i<currentFile.channels.length; i++){
											auxList.push($.extend(true,{}, currentFile.channels[i]));
											if(Number(currentFile.channels[i].channelid)>=0){
												foundChannelID=true;
											}
										}
										if(foundChannelID){
											var r=confirm('Previusly submitted channels were found that could contain data values. Proceeding with this action will PERMANENTLY DELTE ALL DATA from the aforementioned channels, are you sure you want to continue?');
										}
										else{
											var r=true;
										}
										setTimeout(function(){
											if(r){
												var errorsFoundDelete=false;
												for(var i=0; i<auxList.length; i++){
													if(Number(auxList[i].channelid)>=0){
														$.ajax({
															url: 'deleteChannel',
															type: 'POST',
															dataType: "json",
															'theElement':auxList[i],
															data:{'channelid':Number(auxList[i].channelid)},
															async: false,
															success: function(returned){
																var theElement=this['theElement'];
																//currentFile.channels=currentFile.channels.filter(function(el){
																currentInstrument.files[Number($("#requestedInst").find('.step3').find('.routinePicker').val())].channels=currentFile.channels.filter(function(el){
																	return el.Name!=theElement.Name
																});
															},
															error: function(returned){
																errorsFoundDelete=true;
															}
														});
													}
													else{
														currentFile.channels=currentFile.channels.filter(function(el){
															return el.Name!=auxList[i].Name
														});
													}
												}
												if(errorsFoundDelete){
													alert('Errors were found attempting to clear the channel list');
												}
												newInst('step3');
											}
										},0);
									}
								});
								channelTable.rows().every( function ( rowIdx, tableLoop, rowLoop ) {
									var data = this.data();
									$(this.node()).find('.edit').click(function(){
										var channIdx=Number($(this).prop('class').split(' ')[0]);
										var maxOrder=0;
										$("#requestedInst").find('.step3').find('.channels').find('.channelEdit').empty();
										$("#requestedInst").find('.step3').find('.channels').find('.channelEdit').append('<h3>Channel Edit</h3><p><input hidden class="channIdx" value="'+channIdx+'"></input>Name: <input class="Name" value="'+currentFile.channels[channIdx].Name+'"></input> | Description: <input class="description" value="'+currentFile.channels[channIdx].description+'"></input></p><p> Units: <input class="units" value="'+currentFile.channels[channIdx].units+'"></input> Type: <select class="channeltype"><option value="1">Number</option><option value="2">Character(s)</option><option value="3">Compound</option></select> |</p><p> Active: <select class="active"><option value="0">No</option><option value="1">Yes</option></select> <span class="fileorderDiv"> Order: <select class="fileorder"></select></span> |</p>');
										$("#requestedInst").find('.step3').find('.channels').find('.channelEdit').append('<p><button class="button pill icon approve"></button><button class="button pill icon remove danger"></button></p>');
										$("#requestedInst").find('.step3').find('.channels').find('.channelEdit').find('.channeltype').val(currentFile.channels[channIdx].channeltype);
										$("#requestedInst").find('.step3').find('.channels').find('.channelEdit').find('.active').val(currentFile.channels[channIdx].active);
										$("#requestedInst").find('.step3').find('.channels').find('.channelEdit').find('.approve').focus();
										for(var i=0; i<currentFile.channels.length; i++){
											if(Number(currentFile.channels[i].fileorder)>maxOrder){
												maxOrder=Number(currentFile.channels[i].fileorder);
											}
										}
										for(var i=0; i<maxOrder; i++){
											$("#requestedInst").find('.step3').find('.channels').find('.channelEdit').find('.fileorderDiv').append('<option value="'+i+'">'+(i+1)+'</option>');
										}
										$("#requestedInst").find('.step3').find('.channels').find('.channelEdit').find('.channeltype').change(function(){
											$("#requestedInst").find('.step3').find('.channels').find('.channelEdit').find('.fileorderDiv').empty();
											console.log(Number($(this).val())!=3);
											if(Number($(this).val())!=3){
												$("#requestedInst").find('.step3').find('.channels').find('.channelEdit').find('.fileorderDiv').append(' Order: <select class="fileorder"></select>');
												for(var i=0; i<=maxOrder+1; i++){
													$("#requestedInst").find('.step3').find('.channels').find('.channelEdit').find('.fileorder').append('<option value="'+i+'">'+(i+1)+'</option>');
												}
												$("#requestedInst").find('.step3').find('.channels').find('.channelEdit').find('.fileorder').val(maxOrder+1);
											}
											else{
												$("#requestedInst").find('.step3').find('.channels').find('.channelEdit').find('.fileorderDiv').append(' Custom expression (<a>Ref</a>): <textarea style="width:300px;height:50px" class="customExpression"></textarea>');
												$("#requestedInst").find('.step3').find('.channels').find('.channelEdit').find('.customExpression').change(function(){
													var theElement=$(this);
													$($(this).parent()).find(".outcome").remove();
													$(this).after('<img class="outcome" src="/static/loading.gif" height="25" width="25"></img>');
													if(!((typeof notyExpression)==="undefined")){
														notyExpression.close();
													}
													$.ajax({
														url: '/daqbroker/checkExpression',
														type: 'POST',
														dataType: "json",
														'theElement':theElement,
														contentType: "application/json; charset=UTF-8",
														data: JSON.stringify({'expression':theElement.val()}),
														async: false,
														success: function(returned){
															$(theElement.parent()).find(".outcome").prop('src','/static/ok.png');
															$(theElement.parent()).find(".outcome").prop('title','This is a valid expression');
															//currentFile.channels=currentFile.channels.filter(function(el){
															
														},
														error: function(returned){
															notyExpression=new Noty({
																text      :  "There was an error parsing the provided expression | "+JSON.stringify(returned),
																theme     :  'relax',
																type      :  'error'
															}).show();
															$(theElement.parent()).find(".outcome").prop('src','/static/no.png');
														}
													});
												})
												if(currentFile.channels[channIdx].remarks){
													$("#requestedInst").find('.step3').find('.channels').find('.channelEdit').find('.customExpression').append(currentFile.channels[channIdx].remarks.customExpression).trigger('change');
												}
											}
										});
										$("#requestedInst").find('.step3').find('.channels').find('.channelEdit').find('.channeltype').trigger("change");
										$("#requestedInst").find('.step3').find('.channels').find('.channelEdit').find('.fileorder').val(currentFile.channels[channIdx].fileorder);
										$("#requestedInst").find('.step3').find('.channels').find('.channelEdit').find('.approve').click(function(){
											var channIdx=Number($("#requestedInst").find('.step3').find('.channels').find('.channelEdit').find('.channIdx').val());
											var foundEmpty=false;
											$("#requestedInst").find('.step3').find('.channels').find('.channelEdit').find(':input').each(function(){
												if($(this).prop('type')!='submit'){
													if($(this).val()!=''){
														$(this).css({'color': '','background-color': '','border-color': ''});
														$(this).prop('title','');
														if(isNaN($(this).val())){
															if($(this).prop('class')=='customExpression'){//Put here all the stuff that goes into the remarks make an 'or' statment
																currentFile.channels[channIdx]['remarks'][$(this).prop('class')]=$(this).val();
															}
															else{
																currentFile.channels[channIdx][$(this).prop('class')]=$(this).val();
															}
														}
														else{
															//localChannel[$(this).prop('class')]=Number($(this).val());
															currentFile.channels[channIdx][$(this).prop('class')]=Number($(this).val());
														}
													}
													else{
														foundEmpty=true;
														$(this).css({'color': '#a94442','background-color': '#f2dede','border-color': '#ebccd1'});
														$(this).prop('title','Please fill out this information');
													}
												}
												if(!foundEmpty){
													newInst('step3');
												}
											});
										});
										$("#requestedInst").find('.step3').find('.channels').find('.channelEdit').find('.remove').click(function(){
											newInst('step3');
										});
									});
									$(this.node()).find('.trash').click(function(){
										var channIdx=Number($(this).prop('class').split(' ')[0]);
										$("#requestedInst").find('.step3').find('.channels').find('.channelEdit').empty();
										if(currentFile.channels[channIdx].channelid>=0){
											r=confirm('Deleting an existing data channel will cause PERMANENT loss of ALL DATA on this channel, are you sure you want to continue? (Consider making this channel inactive)');
											if(r){
												$.ajax({
													url: 'deleteChannel',
													type: 'POST',
													dataType: "json",
													data:{'channelid':currentFile.channels[channIdx].channelid},
													success: function(returned){
														currentFile.channels.splice(channIdx,1);
														newInst('step3');
													},
													error: function(returned){
														alert('There was a problem deleting your channel');
													}
												});
											}
										}
										else{
											currentFile.channels.splice(channIdx,1);
											//$("#requestedInst").find('.step3').find('.routinePicker').trigger('change');
											newInst('step3');
										}
									});
								} );
								$.colorbox.resize();
							});
							$("#requestedInst").find('.step3').find('.firstStep').find('.toParse').trigger('change');
						}
						else if(currentFile.type==1){
							console.log("AMINOTFUCKINGHERE?!");
							$("#requestedInst").find('.step3').find('.firstStep').empty();
							$("#requestedInst").find('.step3').find('.firstStep').append('Gathering some data . . . <img class="outcome" src="/static/loading.gif" height="50" width="50"></img>');
							$.ajax({
								url: 'gatherNodeData',
								type: 'POST',
								dataType: "json",
								contentType: "application/json; charset=UTF-8",
								data: JSON.stringify(currentFile),
								success: function(returned){
									theJob=returned.id;
									//GOT A JOB REFERENCE, GOTTA START PINGING TO SEE WHAT HAPPENED TO THE JOB
									//getDataCheck
									var requesting=setInterval(function(){
										var requestTerminated=false;
										var requestResult={};
										var theAjax=$.ajax({
											url: 'getDataCheck',
											type: 'POST',
											dataType: "json",
											data:{'id':theJob},
											success: function(returned){
												if(returned){//Finished regardless of problems
													requestTerminated=true;
													requestResult=returned;
												}
											},
											error: function(returned){
												requestTerminated=true;
												requestResult=-1;
											}
										});
										theAjax.always(function(){
											if(requestTerminated){//Got some developments
												var theAjax2=$.ajax({
													url: 'getDataAbort',
													type: 'POST',
													dataType: "json",
													data:{'id':theJob}
												});
												if(requestResult.status==0){
													$("#requestedInst").find('.step3').find('.firstStep').empty();
													$("#requestedInst").find('.step3').find('.firstStep').append('<div style="text-align:center;margin:auto;"></p><button style="float:right" class="button pill icon loop"></button></div><hr style="text-align:center;margin:auto;width:25%"><div>How should this be handled?</div><div class="parseInfo"><p>Separator character: <input class="separator"></input></p><p>Time provided <input type="checkbox" class="timeProvided"></input> <span class="timeformatSpan" style="display:none"><input placeholder="format string" class="timeFormat"></input>(<a class="showTheTable">Ref</a>)</span></p><hr style="width:25%;margin:auto;text-align:center"><div class="processedReply"></div></div>');
													$("#requestedInst").find('.step3').find('.firstStep').find('.showTheTable').click(function(){
														showFormatTable('step3');
													});
													$("#requestedInst").find('.step3').find('.firstStep').find('.timeProvided').click(function(){
														if($(this).prop("checked")){
															$("#requestedInst").find('.step3').find('.firstStep').find(".timeformatSpan").show()
														}
														else{
															currentFile["remarks"]["timeFormat"]=false;
															$("#requestedInst").find('.step3').find('.firstStep').find(".timeformatSpan").hide()
														}
													});
													$("#requestedInst").find('.step3').find('.firstStep').find('.loop').click(function(){
														$("#requestedInst").find('.step3').find('.routinePicker').trigger("change");
													});
													if(!('parsingInfo' in currentInstrument.files[fileIdx].remarks)){
														if(currentInstrument.files[fileIdx].type==1){
															currentFile.remarks['parsingInfo']={
																'separator'   : ',',
																'timeProvided': false,
																'timeFormat'  : false
															}
															currentFile["channels"]=[];
														}
													}
													else{
														$("#requestedInst").find('.step3').find('.firstStep').find(":input").each(function(){
															if($(this).prop("type")=="checkbox"){
																$(this).prop("checked",!currentFile["remarks"]["parsingInfo"][$(this).prop("class").split(" ")[0]]);
																$(this).trigger("click");
															}
															else{
																$(this).val(currentFile["remarks"]["parsingInfo"][$(this).prop("class").split(" ")[0]]);
															}
														});
													}
													$("#requestedInst").find('.step3').find('.firstStep').find(":input:visible").on("click input",function(e){
														if($(this).prop("type")=="checkbox"){
															currentFile["remarks"]["parsingInfo"][$(this).prop("class").split(" ")[0]]=$(this).prop("checked");
														}
														else{
															currentFile["remarks"]["parsingInfo"][$(this).prop("class").split(" ")[0]]=$(this).val();
														}
														var parseResult=pseudoParse(requestResult.reply.split('\n'),"0",currentFile["remarks"]["parsingInfo"]["separator"],currentFile["remarks"]["timeFormat"],requestResult.reply.split('\n'),0,0);
														console.log(parseResult)
														$("#requestedInst").find('.step3').find('.firstStep').find(".processedReply").empty();
														$("#requestedInst").find('.step3').find('.firstStep').find(".processedReply").append('<p style="margin:auto;text-align:center"><b>Gathered this data</b></p>');
														var potentialChannels=[];
														for(var i=0; i<parseResult.headerCandidates[0].length; i++){
															if(isNaN(Number(parseResult.headerCandidates[0][i]))){
																var channeltype=2;
															}
															else{
																var channeltype=1;
															}
															potentialChannels.push({
																"channeltype"   :   channeltype,
																"Name"          :   'Channel '+(i+1),
																"remarks"       :   {'min':0,'max':parseResult.headerCandidates[0][i].length-1}
															});
															$("#requestedInst").find('.step3').find('.firstStep').find(".processedReply").append('<p>Start : <input class="limit minEl '+i+'" style="width:40px" type="number" min="0" max="'+(parseResult.headerCandidates[0][i].length-2)+'" step="1" value="0"></input> | End : <input class="limit maxEl '+i+'" style="width:40px" type="number" value="'+(parseResult.headerCandidates[0][i].length-1)+'" min="1" max="'+(parseResult.headerCandidates[0][i].length-1)+'"> | </input> <input placeholder="Channel Name" class="channName '+i+'" value="Channel '+(i+1)+'"></input> :<b class="channelValue '+i+'"> '+parseResult.headerCandidates[0][i]+'</b></p>');
														}
														$("#requestedInst").find('.step3').find('.firstStep').find(".processedReply").find(".limit").change(function(){
															var idx=Number($(this).prop('class').split(' ')[2]);
															var theValueMin=Number($("#requestedInst").find('.step3').find('.firstStep').find(".processedReply").find('.minEl.'+idx).val());
															var theValueMax=Number($("#requestedInst").find('.step3').find('.firstStep').find(".processedReply").find('.maxEl.'+idx).val());
															$("#requestedInst").find('.step3').find('.firstStep').find(".processedReply").find('.maxEl.'+idx).prop("min",theValueMin+1);
															$("#requestedInst").find('.step3').find('.firstStep').find(".processedReply").find('.minEl.'+idx).prop("max",theValueMax-1);
															potentialChannels[idx].remarks.min=theValueMin;
															potentialChannels[idx].remarks.max=theValueMax;
															var channelValue=parseResult.headerCandidates[0][idx].substring(potentialChannels[idx].remarks.min,potentialChannels[idx].remarks.max);
															console.log(channelValue);
															console.log(Number(channelValue));
															if(isNaN(Number(channelValue))){
																potentialChannels[idx].channeltype=1;
																channelValue=channelValue+" (not a number)";
															}
															else{
																potentialChannels[idx].channeltype=0;
															}
															console.log(channelValue);
															$("#requestedInst").find('.step3').find('.firstStep').find(".processedReply").find(".channelValue."+idx).html(channelValue);
														});
														$("#requestedInst").find('.step3').find('.firstStep').find(".processedReply").find(".channName").change(function(){
															var idx=Number($(this).prop('class').split(' ')[1]);
															var theValue=Number($(this).val());
															potentialChannels[idx].Name=theValue;
														});
														$("#requestedInst").find('.step3').find('.firstStep').find(".processedReply").find(".limit").trigger("change");
														$("#requestedInst").find('.step3').find('.firstStep').find(".processedReply").append('<p style="margin:auto;text-align:center"><button class="channelsUse">Use channels</button></p>');
														$("#requestedInst").find('.step3').find('.firstStep').find(".processedReply").find('.channelsUse').click(function(){
															var channelsWithData=false;
															for(var i=0; i<currentFile.channels.length; i++){
																if(currentFile.channels[i].channelid>=0){
																	channelsWithData=true;
																	break
																}
															}
															if(channelsWithData){
																var stupidName=$.confirm({
																	title    : 'Eliminate existing channels',
																	backgroundDismiss: true,
																	content:'Channels in this instrument which may already have data will be deleted. Are you sure you want to continue with this action?',
																	buttons:{
																		Yes:{
																			btnClass: 'btn-blue',
																			action: function(){
																				var channelids=[]
																				var auxList=[]
																				var therewasanerror=false;
																				for(var i=0; i<currentFile.channels.length; i++){
																					if(currentFile.channels.channelid>=0){
																						auxList.push($.extend(true,{}, currentFile.channels[i]));
																					}
																				}
																				setTimeout(function(){
																					for(var i=0; i<auxList.length; i++){
																						$.ajax({
																							url: 'deleteChannel',
																							type: 'POST',
																							dataType: "json",
																							async: false,
																							"theElement": auxList[i],
																							data:{'channelid':auxList[i].channelid},
																							success: function(returned){
																								var theElement=this['theElement'];
																								currentInstrument.files[Number($("#requestedInst").find('.step3').find('.routinePicker').val())].channels=currentFile.channels.filter(function(el){
																									return el.Name!=theElement.Name
																								});
																							},
																							error: function(returned){
																								alert('There was a problem deleting your channel');
																								therewasanerror=true;
																							}
																						});
																						if(therewasanerror){
																							break
																						}
																					}
																					for(var i=0; i<parseResult.headerCandidates[0].length; i++){
																						currentFile.channels.push({
																							'Name'          :   $('.channName.'+i).val(),
																							'description'   :   'None',
																							'channeltype'   :   potentialChannels[i].channeltype,
																							'units'         :   'None',
																							'active'        :   1,
																							'fileorder'     :   i,
																							'channelid'     :   -1,
																							'alias'         :   $('.channName.'+i).val(),
																							'remarks'       :   potentialChannels[i].remarks
																						});
																					}
																					newInst('step3');
																				},0);
																			}
																		},
																		No:{
																			btnClass: 'btn-red',
																			action: function(){
																				self.close();
																				newInst('step3');
																			}
																		}
																	}
																});
															}
															else{
																for(var i=0; i<parseResult.headerCandidates[0].length; i++){
																	currentFile.channels.push({
																		'Name'          :   $('.channName.'+i).val(),
																		'description'   :   'None',
																		'channeltype'   :   potentialChannels[i].channeltype,
																		'units'         :   'None',
																		'active'        :   1,
																		'fileorder'     :   i,
																		'channelid'     :   -1,
																		'alias'         :   $('.channName.'+i).val(),
																		'remarks'       :   potentialChannels[i].remarks
																	});
																}
																newInst('step3');
															}
														});
													});
													var linesTable=[];
													for(var i=0; i<currentFile.channels.length; i++){
														if(Number(currentFile.channels[i].channeltype)==1){
															typeStr='Number';
														}
														else if(Number(currentFile.channels[i].channeltype)==2){
															typeStr='Character(s)';
														}
														else if(Number(currentFile.channels[i].channeltype)==3){
															typeStr='Composite';
														}
														if(Number(currentFile.channels[i].active)==0){
															activeStr='<span style="color:#a94442;background-color:#ebcccc;border-color:#ebcccc">No</span>';
														}
														else if(Number(currentFile.channels[i].active)==1){
															activeStr='<span style="color:#3c763d;background-color:#dff0d8;border-color:#d0e9c6">Yes</span>';
														}
														linesTable.push({
															'Name'          :   currentFile.channels[i].Name,
															'description'   :   currentFile.channels[i].description,
															'type'          :   typeStr,
															'units'         :   currentFile.channels[i].units,
															'active'        :   activeStr,
															'order'         :   (Number(currentFile.channels[i].fileorder)+1),
															'edit'         :   '<button class="'+i+' button pill icon edit"></button><button class="'+i+' button pill icon trash danger"></button>',
														});
													}
													$("#requestedInst").find('.step3').find('.firstStep').append('<div class="channels"><hr style="width:25%"><table id="channelsTable"></table><hr style="width:25%"><div class="channelEdit"></div></div>');
													channelTable=$("#requestedInst").find('.step3').find('.channels').find('#channelsTable').DataTable({
														columns: [
															{data:'Name',"name":'Name',"title":'Name'},
															{data:'description',"name":'description',"title":'Description'},
															{data:'type',"name":'type',"title":'Type'},
															{data:'units',"name":'units',"title":'Units'},
															{data:'active',"name":'active',"title":'Active'},
															{data:'order',"name":'order',"title":'Order'},
															{data:'edit',"name":'edit',"title":''}
														],
														"oLanguage": {
															"sEmptyTable":     "There are no data channels for this routine!"
														},
														'data':linesTable
													});
													$.colorbox.resize();
												}
												else if(requestResult==-1){
													$("#requestedInst").find('.step3').find('.firstStep').empty();
													$("#requestedInst").find('.step3').find('.firstStep').append('<span style="color:#a94442;background-color:#f2dede,border-color:#ebccd1" >An error occurred, please make sure you are attempting to access the correct port in the correct node and try again</span><button style="float:right" class="button pill icon loop"></button>');
													$("#requestedInst").find('.step3').find('.firstStep').find('.loop').click(function(){
														$("#requestedInst").find('.step3').find('.routinePicker').trigger("change");
													});
												}
												clearTimeout(requesting);
											}
										});
									},1000);
								}
							});
						}
						else if(currentFile.type==2){
							var stupidVar=currentFile;
							stupidVar["order"]="getPortData";
							$("#requestedInst").find('.step3').find('.firstStep').empty();
							$("#requestedInst").find('.step3').find('.firstStep').append('Gathering some data . . . <img class="outcome" src="/static/loading.gif" height="50" width="50"></img>');
							$.ajax({
								url: 'gatherNodeData',
								type: 'POST',
								dataType: "json",
								contentType: "application/json; charset=UTF-8",
								data: JSON.stringify(currentFile),
								success: function(returned){
									var ongoing=false;
									theJob=returned.id;
									//GOT A JOB REFERENCE, GOTTA START PINGING TO SEE WHAT HAPPENED TO THE JOB
									//getDataCheck
									var requesting=setInterval(function(){
										var requestTerminated=false;
										var requestResult={};
										if(!ongoing){
											ongoing=true;
											var theAjax=$.ajax({
												url: 'getDataCheck',
												type: 'POST',
												dataType: "json",
												data:{'id':theJob},
												success: function(returned){
													if(returned){//Finished regardless of problems
														requestTerminated=true;
														requestResult=returned;
													}
												},
												error: function(returned){
													requestTerminated=true;
													requestResult=-1;
												}
											});
											theAjax.always(function(){
												if(requestTerminated){//Got some developments
													var theAjax2=$.ajax({
														url: 'getDataAbort',
														type: 'POST',
														dataType: "json",
														data:{'id':theJob}
													});
													if(requestResult.status==0){
														$("#requestedInst").find('.step3').find('.firstStep').empty();
														$("#requestedInst").find('.step3').find('.firstStep').append('<div style="text-align:center;margin:auto;"></p><button style="float:right" class="button pill icon loop"></button></div><hr style="text-align:center;margin:auto;width:25%"><div>How should this be handled?</div><div class="parseInfo"><p>Separator character: <input class="separator"></input></p><p>Terminator character: <input class="terminator"></input></p><p>Time provided <input type="checkbox" class="timeProvided"></input> <span class="timeformatSpan" style="display:none"><input placeholder="format string" class="timeFormat"></input>(<a class="showTheTable">Ref</a>)</span></p><hr style="width:25%;margin:auto;text-align:center"><div class="processedReply"></div></div>');
														$("#requestedInst").find('.step3').find('.firstStep').find('.showTheTable').click(function(){
															showFormatTable('step3');
														});
														$("#requestedInst").find('.step3').find('.firstStep').find('.timeProvided').click(function(){
															if($(this).prop("checked")){
																$("#requestedInst").find('.step3').find('.firstStep').find(".timeformatSpan").show()
															}
															else{
																currentFile["remarks"]["timeFormat"]=false;
																$("#requestedInst").find('.step3').find('.firstStep').find(".timeformatSpan").hide()
															}
														});
														$("#requestedInst").find('.step3').find('.firstStep').find('.loop').click(function(){
															$("#requestedInst").find('.step3').find('.routinePicker').trigger("change");
														});
														console.log(currentInstrument.files[fileIdx].remarks);
														if(!('parsingInfo' in currentInstrument.files[fileIdx].remarks)){
															if(currentInstrument.files[fileIdx].type==2){
																currentFile.remarks['parsingInfo']={
																	'separator'   : ',',
																	'terminator'   : '\n',
																	'timeProvided': false,
																	'timeFormat'  : ''
																}
																currentFile["channels"]=[];
															}
														}
														else{
															$("#requestedInst").find('.step3').find('.firstStep').find(":input").each(function(){
																if($(this).prop("type")=="checkbox"){
																	$(this).prop("checked",!currentFile["remarks"]["parsingInfo"][$(this).prop("class").split(" ")[0]]);
																	$(this).trigger("click");
																}
																else{
																	$(this).val(currentFile["remarks"]["parsingInfo"][$(this).prop("class").split(" ")[0]]);
																}
															});
														}
														for (var prop in currentFile.remarks.parsingInfo) {
															console.log(prop);
															console.log($("#requestedInst").find('.step3').find('.firstStep').find(".parseInfo").find('.'+prop));
															if($("#requestedInst").find('.step3').find('.firstStep').find(".parseInfo").find('.'+prop).prop('type')=='checkbox'){
																$("#requestedInst").find('.step3').find('.firstStep').find(".parseInfo").find('.'+prop).prop('checked',!(currentFile.remarks.parsingInfo[prop]==true));
																$("#requestedInst").find('.step3').find('.firstStep').find(".parseInfo").find('.'+prop).trigger("click");
															}
															else{
																$("#requestedInst").find('.step3').find('.firstStep').find(".parseInfo").find('.'+prop).val(currentFile.remarks.parsingInfo[prop].replace(/\\/g,'////'));
															}
															//if($("#requestedInst").find('.step2').find('.secondStep').find('.'+prop))
														}
														$("#requestedInst").find('.step3').find('.firstStep').find(":input:visible").on("click input",function(e){
															if($(this).prop("type")=="checkbox"){
																currentFile["remarks"]["parsingInfo"][$(this).prop("class").split(" ")[0]]=$(this).prop("checked");
															}
															else{
																currentFile["remarks"]["parsingInfo"][$(this).prop("class").split(" ")[0]]=$(this).val();
															}
															if(currentFile["remarks"]["parsingInfo"]["terminator"]==''){
																currentFile["remarks"]["parsingInfo"]["terminator"]='\n';
															}
															var parseResult=pseudoParse(requestResult.reply.split(currentFile["remarks"]["parsingInfo"]["terminator"]),"0",currentFile["remarks"]["parsingInfo"]["separator"],currentFile["remarks"]["timeFormat"],requestResult.reply.split(currentFile["remarks"]["parsingInfo"]["terminator"]),0,0);
															console.log(parseResult);
															$("#requestedInst").find('.step3').find('.firstStep').find(".processedReply").empty();
															$("#requestedInst").find('.step3').find('.firstStep').find(".processedReply").append('<p style="margin:auto;text-align:center"><b>Gathered this data</b></p>');
															var potentialChannels=[];
															for(var i=0; i<parseResult.headerCandidates[0].length; i++){
																if(isNaN(Number(parseResult.headerCandidates[0][i]))){
																	var channeltype=2;
																}
																else{
																	var channeltype=1;
																}
																potentialChannels.push({
																	"channeltype"   :   channeltype,
																	"Name"          :   'Channel '+(i+1),
																	"remarks"       :   {'min':0,'max':parseResult.headerCandidates[0][i].length-1}
																});
																$("#requestedInst").find('.step3').find('.firstStep').find(".processedReply").append('<p>Start : <input class="limit minEl '+i+'" style="width:40px" type="number" min="0" max="'+(parseResult.headerCandidates[0][i].length-2)+'" step="1" value="0"></input> | End : <input class="limit maxEl '+i+'" style="width:40px" type="number" value="'+(parseResult.headerCandidates[0][i].length-1)+'" min="1" max="'+(parseResult.headerCandidates[0][i].length-1)+'"> | </input> <input placeholder="Channel Name" class="channName '+i+'" value="Channel '+(i+1)+'"></input> :<b class="channelValue '+i+'"> '+parseResult.headerCandidates[0][i]+'</b></p>');
															}
															$("#requestedInst").find('.step3').find('.firstStep').find(".processedReply").find(".limit").change(function(){
																var idx=Number($(this).prop('class').split(' ')[2]);
																var theValueMin=Number($("#requestedInst").find('.step3').find('.firstStep').find(".processedReply").find('.minEl.'+idx).val());
																var theValueMax=Number($("#requestedInst").find('.step3').find('.firstStep').find(".processedReply").find('.maxEl.'+idx).val());
																$("#requestedInst").find('.step3').find('.firstStep').find(".processedReply").find('.maxEl.'+idx).prop("min",theValueMin+1);
																$("#requestedInst").find('.step3').find('.firstStep').find(".processedReply").find('.minEl.'+idx).prop("max",theValueMax-1);
																potentialChannels[idx].remarks.min=theValueMin;
																potentialChannels[idx].remarks.max=theValueMax;
																var channelValue=parseResult.headerCandidates[0][idx].substring(potentialChannels[idx].remarks.min,potentialChannels[idx].remarks.max);
																if(isNaN(Number(channelValue))){
																	potentialChannels[idx].channeltype=2;
																	channelValue=channelValue+" (not a number)";
																}
																else{
																	potentialChannels[idx].channeltype=1;
																}
																$("#requestedInst").find('.step3').find('.firstStep').find(".processedReply").find(".channelValue."+idx).html(channelValue);
															});
															$("#requestedInst").find('.step3').find('.firstStep').find(".processedReply").find(".channName").change(function(){
																var idx=Number($(this).prop('class').split(' ')[1]);
																var theValue=Number($(this).val());
																potentialChannels[idx].Name=theValue;
															});
															$("#requestedInst").find('.step3').find('.firstStep').find(".processedReply").find(".limit").trigger("change");
															$("#requestedInst").find('.step3').find('.firstStep').find(".processedReply").append('<p style="margin:auto;text-align:center"><button class="channelsUse">Use channels</button></p>');
															$("#requestedInst").find('.step3').find('.firstStep').find(".processedReply").find('.channelsUse').click(function(){
																var channelsWithData=false;
																for(var i=0; i<currentFile.channels.length; i++){
																	if(currentFile.channels[i].channelid>=0){
																		channelsWithData=true;
																		break
																	}
																}
																if(channelsWithData){
																	var stupidName=$.confirm({
																		title    : 'Eliminate existing channels',
																		backgroundDismiss: true,
																		content:'Channels in this instrument which may already have data will be deleted. Are you sure you want to continue with this action?',
																		buttons:{
																			Yes:{
																				btnClass: 'btn-blue',
																				action: function(){
																					var channelids=[]
																					var auxList=[]
																					var therewasanerror=false;
																					for(var i=0; i<currentFile.channels.length; i++){
																						if(currentFile.channels.channelid>=0){
																							auxList.push($.extend(true,{}, currentFile.channels[i]));
																						}
																					}
																					setTimeout(function(){
																						for(var i=0; i<auxList.length; i++){
																							$.ajax({
																								url: 'deleteChannel',
																								type: 'POST',
																								dataType: "json",
																								async: false,
																								"theElement": auxList[i],
																								data:{'channelid':auxList[i].channelid},
																								success: function(returned){
																									var theElement=this['theElement'];
																									currentInstrument.files[Number($("#requestedInst").find('.step3').find('.routinePicker').val())].channels=currentFile.channels.filter(function(el){
																										return el.Name!=theElement.Name
																									});
																								},
																								error: function(returned){
																									alert('There was a problem deleting your channel');
																									therewasanerror=true;
																								}
																							});
																							if(therewasanerror){
																								break
																							}
																						}
																						for(var i=0; i<parseResult.headerCandidates[0].length; i++){
																							currentFile.channels.push({
																								'Name'          :   $('.channName.'+i).val(),
																								'description'   :   'None',
																								'channeltype'   :   potentialChannels[i].channeltype,
																								'units'         :   'None',
																								'active'        :   1,
																								'fileorder'     :   i,
																								'channelid'     :   -1,
																								'alias'         :   $('.channName.'+i).val(),
																								'remarks'       :   potentialChannels[i].remarks
																							});
																						}
																						newInst('step3');
																					},0);
																				}
																			},
																			No:{
																				btnClass: 'btn-red',
																				action: function(){
																					self.close();
																					newInst('step3');
																				}
																			}
																		}
																	});
																}
																else{
																	for(var i=0; i<parseResult.headerCandidates[0].length; i++){
																		currentFile.channels.push({
																			'Name'          :   $('.channName.'+i).val(),
																			'description'   :   'None',
																			'channeltype'   :   potentialChannels[i].channeltype,
																			'units'         :   'None',
																			'active'        :   1,
																			'fileorder'     :   i,
																			'channelid'     :   -1,
																			'alias'         :   $('.channName.'+i).val(),
																			'remarks'       :   potentialChannels[i].remarks
																		});
																	}
																	newInst('step3');
																}
															});
														});
														var linesTable=[];
														for(var i=0; i<currentFile.channels.length; i++){
															if(Number(currentFile.channels[i].channeltype)==1){
																typeStr='Number';
															}
															else if(Number(currentFile.channels[i].channeltype)==2){
																typeStr='Character(s)';
															}
															else if(Number(currentFile.channels[i].channeltype)==3){
																typeStr='Composite';
															}
															if(Number(currentFile.channels[i].active)==0){
																activeStr='<span style="color:#a94442;background-color:#ebcccc;border-color:#ebcccc">No</span>';
															}
															else if(Number(currentFile.channels[i].active)==1){
																activeStr='<span style="color:#3c763d;background-color:#dff0d8;border-color:#d0e9c6">Yes</span>';
															}
															linesTable.push({
																'Name'          :   currentFile.channels[i].Name,
																'description'   :   currentFile.channels[i].description,
																'type'          :   typeStr,
																'units'         :   currentFile.channels[i].units,
																'active'        :   activeStr,
																'order'         :   (Number(currentFile.channels[i].fileorder)+1),
																'edit'         :   '<button class="'+i+' button pill icon edit"></button><button class="'+i+' button pill icon trash danger"></button>',
															});
														}
														$("#requestedInst").find('.step3').find('.firstStep').append('<div class="channels"><hr style="width:25%"><table id="channelsTable"></table><hr style="width:25%"><div class="channelEdit"></div></div>');
														channelTable=$("#requestedInst").find('.step3').find('.channels').find('#channelsTable').DataTable({
															columns: [
																{data:'Name',"name":'Name',"title":'Name'},
																{data:'description',"name":'description',"title":'Description'},
																{data:'type',"name":'type',"title":'Type'},
																{data:'units',"name":'units',"title":'Units'},
																{data:'active',"name":'active',"title":'Active'},
																{data:'order',"name":'order',"title":'Order'},
																{data:'edit',"name":'edit',"title":''}
															],
															"oLanguage": {
																"sEmptyTable":     "There are no data channels for this routine!"
															},
															'data':linesTable
														});
														$.colorbox.resize();
														
													}
													else if(requestResult==-1){
														$("#requestedInst").find('.step3').find('.firstStep').empty();
														$("#requestedInst").find('.step3').find('.firstStep').append('<span style="color:#a94442;background-color:#f2dede,border-color:#ebccd1" >An error occurred, please make sure you are attempting to access the correct port in the correct node and try again</span><button style="float:right" class="button pill icon loop"></button>');
														$("#requestedInst").find('.step3').find('.firstStep').find('.loop').click(function(){
															$("#requestedInst").find('.step3').find('.routinePicker').trigger("change");
														});
													}
													clearTimeout(requesting);
												}
												ongoing=false;
											});
										}
									},1000);
								}
							});
						}
						var repeatedOthers=[];
						var repeatedSame=[];
						for(var i=0; i<currentInstrument.files.length; i++){
							if(i!=Number($(this).val())){
								if(('channels' in currentInstrument.files[i]) && ('channels' in currentFile)){
									repeatedOthers=currentInstrument.files[i].channels.filter(function(val){
										return currentFile.channels.find(function(el){
											return el.Name==val.Name;
										});
									});
									if(repeatedOthers.length>0){
										repeatedOthers[0]['metaName']=currentInstrument.files[i].name;
									}
								}
							}
							else{
								var test={};
								if('channels' in currentFile){
									repeatedSame=currentFile.channels.filter(function(x){
										if (!(x.Name in test)){
											test[x.Name] = true;
											return false
										}
										return true;
									});
								}
							}
						}
						if($(".step3").find(".next").length<1){
							$(".step3").find(".notePar").append('<button class="next button pill" style="font-size:110%">Finalize</button>');
							$(".step3").find(".next").click(function(){
								if($("#requestedInst").find('.step3').find('.channels').find('.channelEdit').find(':input').length>0){
									r=confirm('You are currently editing a data channel, any changes you have made are not going to be saved, are you sure you want to continue?');
									if(r){
										newInst('step4');
									}
								}
								else{
									newInst('step4');
								}
							}).focus();
						}
						if(repeatedSame.length>0){
							$(".step3").find(".next").remove();
							$(".step3").find(".errorRepeatSame").remove();
							$(".step3").find(".notePar").append('<span class="errorRepeatSame" style="color:#a94442;background-color:#ebcccc;border-color:#ebcccc">This routine has multiple channels named \'<b>'+repeatedSame[0].Name+'</b>\', please fix this before continuing</span>').focus();
						}
						else if(repeatedOthers.length>0){
							$(".step3").find(".next").remove();
							$(".step3").find(".errorRepeatOthers").remove();
							$(".step3").find(".notePar").append('<span class="errorRepeatOthers" style="color:#a94442;background-color:#ebcccc;border-color:#ebcccc">Routine \'<b>'+repeatedOthers[0]['metaName']+'</b>\' already has a  channels named \'<b>'+repeatedOthers[0].Name+'</b>\', please fix this before continuing</span>').focus();
						}
						$.colorbox.resize();
					});
					if(selectedRoutine>=0){
						$("#requestedInst").find('.step3').find('.routinePicker').val(selectedRoutine).trigger('change');
					}
					$(".step1").fadeOut(300);
					$(".step2").fadeOut(300);
					$(".step4").fadeOut(300);
					$(".step3").fadeIn(300);
					$.colorbox.resize();
				}
				if(functionArguments[0]=='step4'){
					if(Number($("#requestedInst").find('.step3').prop('currRoutine'))>=0){
						selectedRoutine=Number($("#requestedInst").find('.step3').prop('currRoutine'));
					}
					if($("#requestedInst").find('.step4').length>0){
						$("#requestedInst").find('.step4').remove();
					}
					$("#requestedInst").find(".buttons").find(".step1Button").prop('disabled',false);
					$("#requestedInst").find(".buttons").find(".step2Button").prop('disabled',false);
					$("#requestedInst").find(".buttons").find(".step3Button").prop('disabled',false);
					$("#requestedInst").find(".buttons").find(".step4Button").prop('disabled',true);
					if($("#requestedInst").find(".buttons").find('.step4Button').length<1){
						$("#requestedInst").find(".buttons").find('.step3Button').after('<button class="step4Button" disabled>Confirm</button>');
					}
					$("#requestedInst").append('<div class="step4" style="font-size=36"><fieldset><legend>Instrument Details : </legend><div class="instrumentData"></div></fieldset><div class="finishDiv" style="margin:auto;text-align:center"><hr style="width:25%"><button style="font-size:110%" class="finish button pill">Submit</button></div></div>');
					$("#requestedInst").find('.step4').find('.instrumentData').append('<p >Name : <span style="font-weight:bold" class="nameI">'+currentInstrument.Name+'</span></p>');
					if('instid' in currentInstrument){
						if(currentInstrument.Name!=currentInstrumentOld.Name){
							$("#requestedInst").find('.step4').find('.instrumentData').find('.nameI').prop('title',"This entry has changed, was previously '"+currentInstrumentOld.Name+"'");
							$("#requestedInst").find('.step4').find('.instrumentData').find('.nameI').css({'color': '#31708f','background-color': '#d9edf7','border-color': '#bce8f1','cursor':'help'});
						}
					}
					$("#requestedInst").find('.step4').find('.instrumentData').append('<p >Description : <span style="font-weight:bold" class="descriptI">'+currentInstrument.description+'</span></p>');
					if('instid' in currentInstrument){
						if(currentInstrument.description!=currentInstrumentOld.description){
							$("#requestedInst").find('.step4').find('.instrumentData').find('.descriptI').prop('title',"This entry has changed, was previously '"+currentInstrumentOld.description+"'");
							$("#requestedInst").find('.step4').find('.instrumentData').find('.descriptI').css({'color': '#31708f','background-color': '#d9edf7','border-color': '#bce8f1','cursor':'help'});
						}
					}
					$("#requestedInst").find('.step4').find('.instrumentData').append('<p>Contact : <span style="font-weight:bold" class="contactI">'+currentInstrument.email+'</span></p>');
					if('instid' in currentInstrument){
						if(currentInstrument.email!=currentInstrumentOld.email){
							$("#requestedInst").find('.step4').find('.instrumentData').find('.contactI').prop('title',"This entry has changed, was previously '"+currentInstrumentOld.email+"'");
							$("#requestedInst").find('.step4').find('.instrumentData').find('.contactI').css({'color': '#31708f','background-color': '#d9edf7','border-color': '#bce8f1','cursor':'help'});
						}
					}
					$("#requestedInst").find('.step4').find('.instrumentData').append('<div class="routines"></div>');
					if(currentInstrument.files.length>0){
						$("#requestedInst").find('.step4').find('.instrumentData').find('.routines').append('Select a routine to view its details<p style="margin:auto;text-align:center"><select class="routineSelector"><option value=-9999>--- SELECT ONE ---</option></select></p>');
						for(var i=0; i<currentInstrument.files.length; i++){
							$("#requestedInst").find('.step4').find('.instrumentData').find('.routines').find('.routineSelector').append('<option value="'+i+'">'+currentInstrument.files[i].name+'</option>');
						}
						$("#requestedInst").find('.step4').find('.instrumentData').find('.routines').find('.routineSelector').change(function(){
							var selectedFile=currentInstrument.files[Number($(this).val())];
							var fileIdx=Number($(this).val());
							if($("#requestedInst").find('.step4').find('.instrumentData').find('.routines').find('.routineDetails').length>0){
								$("#requestedInst").find('.step4').find('.instrumentData').find('.routines').find('.routineDetails').remove();
							}
							$("#requestedInst").find('.step4').find('.instrumentData').find('.routines').append('<div class="routineDetails"><hr style=""><h3>Details for <span class="metaName">'+selectedFile.name+'</span></h3></div>');
							if('metaid' in selectedFile){
								if(selectedFile.name!=currentInstrumentOld.files[fileIdx].name){
									$("#requestedInst").find('.step4').find('.instrumentData').find('.routines').find('.routineDetails').find('.metaName').prop('title',"This entry has changed");
									$("#requestedInst").find('.step4').find('.instrumentData').find('.routines').find('.routineDetails').find('.metaName').css({'color': '#31708f','background-color': '#d9edf7','border-color': '#bce8f1','cursor':'help'});
								}
							}
							if(Number(selectedFile.type)==0){//Details for file parsing routine
								$("#requestedInst").find('.step4').find('.instrumentData').find('.routines').find('.routineDetails').append('<p class="file'+fileIdx+'"> Data source : <span style="font-weight:bold">Files</span></p>');
								if('metaid' in selectedFile){
									if(Number(selectedFile.type)!=Number(currentInstrumentOld.files[fileIdx].type)){
										$("#requestedInst").find('.step4').find('.instrumentData').find('.routines').find('.routineDetails').find('.file'+fileIdx).prop('title',"This entry has changed");
										$("#requestedInst").find('.step4').find('.instrumentData').find('.routines').find('.routineDetails').find('.file'+fileIdx).css({'color': '#31708f','background-color': '#d9edf7','border-color': '#bce8f1','cursor':'help'});
									}
								}
								$("#requestedInst").find('.step4').find('.instrumentData').find('.routines').find('.routineDetails').append('<p class="node'+fileIdx+'""> Node : <span class="node"></span></p>');
								if('metaid' in selectedFile){
									if(selectedFile.node!=currentInstrumentOld.files[fileIdx].node){
										$("#requestedInst").find('.step4').find('.instrumentData').find('.routines').find('.routineDetails').find('.node'+fileIdx).prop('title',"This entry has changed, was previously '"+currentInstrumentOld.files[fileIdx].node+"'");
										$("#requestedInst").find('.step4').find('.instrumentData').find('.routines').find('.routineDetails').find('.node'+fileIdx).css({'color': '#31708f','background-color': '#d9edf7','border-color': '#bce8f1','cursor':'help'});
									}
								}
								$.ajax({
									url: '/monitoring/queryNodes',
									type: 'POST',
									dataType: "json",
									success: function(returned){
										var found=returned.filter(function(el){
											return el.node==selectedFile.node;
										});
										if(found.length==1){
											$("#requestedInst").find('.step4').find('.instrumentData').find('.routines').find('.routineDetails').find('.node').append(found[0].name+' - '+found[0].address)
											$("#requestedInst").find('.step4').find('.instrumentData').find('.routines').find('.routineDetails').find('.node').css({'color': '#3c763d','background-color': '#dff0d8','border-color': '#d6e9c6','cursor':'help'});
											$("#requestedInst").find('.step4').find('.instrumentData').find('.routines').find('.routineDetails').find('.node').prop('title','This node is operational!');
										}
										else if(found.length>1){
											$("#requestedInst").find('.step4').find('.instrumentData').find('.routines').find('.routineDetails').find('.node').append(found[0].name+' - '+found[0].address);
											$("#requestedInst").find('.step4').find('.instrumentData').find('.routines').find('.routineDetails').find('.node').css({'color': '#8a6d3b','background-color': '#fcf8e3','border-color': '#faebcc','cursor':'help'});
											$("#requestedInst").find('.step4').find('.instrumentData').find('.routines').find('.routineDetails').find('.node').prop('title','There seems to be an address conflict with this node - contact your network administrator');
										}
										else{
											$("#requestedInst").find('.step4').find('.instrumentData').find('.routines').find('.routineDetails').find('.node').append(selectedFile.node+' - N/A');
											$("#requestedInst").find('.step4').find('.instrumentData').find('.routines').find('.routineDetails').find('.node').css({'color': '#a94442','background-color': '#f2dede','border-color': '#ebccd1','cursor':'help'});
											$("#requestedInst").find('.step4').find('.instrumentData').find('.routines').find('.routineDetails').find('.node').prop('title','This node was not found - contact your network administrator');
										}
									},
									error: function(returned){
										alert('There was a problem retrieving node information - contact your network administrator');
									}
								});
								$("#requestedInst").find('.step4').find('.instrumentData').find('.routines').find('.routineDetails').append('<p> Extension : <span class="extension'+fileIdx+'" style="font-weight:bold">'+selectedFile.remarks.extension+'</span></p>');
								if('metaid' in selectedFile){
									if(selectedFile.remarks.extension!=currentInstrumentOld.files[fileIdx].remarks.extension){
										$("#requestedInst").find('.step4').find('.instrumentData').find('.routines').find('.routineDetails').find('.extension'+fileIdx).prop('title',"This entry has changed, was previously '"+currentInstrumentOld.files[fileIdx].remarks.extension+"'");
										$("#requestedInst").find('.step4').find('.instrumentData').find('.routines').find('.routineDetails').find('.extension'+fileIdx).css({'color': '#31708f','background-color': '#d9edf7','border-color': '#bce8f1','cursor':'help'});
									}
								}
								$("#requestedInst").find('.step4').find('.instrumentData').find('.routines').find('.routineDetails').append('<p> Parsing Interval : <span class="interval'+fileIdx+'" style="font-weight:bold">'+selectedFile.remarks.parseInterval+'</span></p>');
								if('metaid' in selectedFile){
									if(Number(selectedFile.remarks.parseInterval)!=Number(currentInstrumentOld.files[fileIdx].remarks.parseInterval)){
										$("#requestedInst").find('.step4').find('.instrumentData').find('.routines').find('.routineDetails').find('.interval'+fileIdx).prop('title',"This entry has changed, was previously '"+currentInstrumentOld.files[fileIdx].remarks.parseInterval+"'");
										$("#requestedInst").find('.step4').find('.instrumentData').find('.routines').find('.routineDetails').find('.interval'+fileIdx).css({'color': '#31708f','background-color': '#d9edf7','border-color': '#bce8f1','cursor':'help'});
									}
								}
								$("#requestedInst").find('.step4').find('.instrumentData').find('.routines').find('.routineDetails').append('<p> Path : <span class="path'+fileIdx+'" style="font-weight:bold">'+selectedFile.remarks.path+'</span></p>');
								if('metaid' in selectedFile){
									if(selectedFile.remarks.path!=currentInstrumentOld.files[fileIdx].remarks.path){
										$("#requestedInst").find('.step4').find('.instrumentData').find('.routines').find('.routineDetails').find('.path'+fileIdx).prop('title',"This entry has changed, was previously '"+currentInstrumentOld.files[fileIdx].remarks.path+"'");
										$("#requestedInst").find('.step4').find('.instrumentData').find('.routines').find('.routineDetails').find('.path'+fileIdx).css({'color': '#31708f','background-color': '#d9edf7','border-color': '#bce8f1','cursor':'help'});
									}
								}
								$("#requestedInst").find('.step4').find('.instrumentData').find('.routines').find('.routineDetails').append('<p> Pattern : <span style="font-weight:bold">'+selectedFile.remarks.pattern+'</span></p>');
								if('metaid' in selectedFile){
									if(selectedFile.remarks.pattern!=currentInstrumentOld.files[fileIdx].remarks.pattern){
										$("#requestedInst").find('.step4').find('.instrumentData').find('.routines').find('.routineDetails').find('.path'+fileIdx).prop('title',"This entry has changed, was previously '"+currentInstrumentOld.files[fileIdx].remarks.pattern+"'");
										$("#requestedInst").find('.step4').find('.instrumentData').find('.routines').find('.routineDetails').find('.path'+fileIdx).css({'color': '#31708f','background-color': '#d9edf7','border-color': '#bce8f1','cursor':'help'});
									}
								}
								if(selectedFile.remarks.toBackup){
									$("#requestedInst").find('.step4').find('.instrumentData').find('.routines').find('.routineDetails').append('<p> Backup files : <span class="toBack'+fileIdx+'" style="font-weight:bold">Yes</span></p>');
								}
								else{
									$("#requestedInst").find('.step4').find('.instrumentData').find('.routines').find('.routineDetails').append('<p> Backup files : <span class="toBack'+fileIdx+'" style="font-weight:bold">No</span></p>');
								}
								if('metaid' in selectedFile){
									if(selectedFile.remarks.toBackup!=currentInstrumentOld.files[fileIdx].remarks.toBackup){
										$("#requestedInst").find('.step4').find('.instrumentData').find('.routines').find('.routineDetails').find('.toBack'+fileIdx).prop('title',"This entry has changed, was previously '"+currentInstrumentOld.files[fileIdx].remarks.toBackup+"'");
										$("#requestedInst").find('.step4').find('.instrumentData').find('.routines').find('.routineDetails').find('.toBack'+fileIdx).css({'color': '#31708f','background-color': '#d9edf7','border-color': '#bce8f1','cursor':'help'});
									}
								}
								var allNew=false;
								if('metaid' in selectedFile){
									if(selectedFile.remarks.toParse!=currentInstrumentOld.files[fileIdx].remarks.toParse){
										allNew=true
									}
								}
								if(selectedFile.remarks.toParse){
									if(('parsingInfo' in selectedFile.remarks) && ('channels' in selectedFile)){
										if(selectedFile.channels.length>0){
											if(!((typeof channelTableFinal)==='undefined')){
												channelTableFinal.destroy();
											}
											$("#requestedInst").find('.step4').find('.instrumentData').find('.routines').find('.routineDetails').append('<hr style="width:25%;"><h4> <span class="channelsIntro">Parsing Details</span></h4>');
											if(allNew){
												$("#requestedInst").find('.step4').find('.instrumentData').find('.routines').find('.routineDetails').find('.channelsIntro').css({'color': '#3c763d','background-color': '#dff0d8','border-color': '#d6e9c6','cursor':'help'});
												$("#requestedInst").find('.step4').find('.instrumentData').find('.routines').find('.routineDetails').find('.channelsIntro').prop('title','Brand new parsing information');
											}
											if(Number(selectedFile.remarks.parsingInfo.dataType)==0){
												var typeStr='Regular columns';
											}
											else if(Number(selectedFile.remarks.parsingInfo.dataType)==1){
												var typeStr='Horizontal columns';
											}
											$("#requestedInst").find('.step4').find('.instrumentData').find('.routines').find('.routineDetails').append('<p> File data type : <span class="typeParse">'+typeStr+'</span></p>');
											if('metaid' in selectedFile && !allNew){
												if(Number(selectedFile.remarks.parsingInfo.dataType)!=Number(currentInstrumentOld.files[fileIdx].remarks.parsingInfo.dataType)){
													$("#requestedInst").find('.step4').find('.instrumentData').find('.routines').find('.routineDetails').find('.typeParse').css({'color': '#31708f','background-color': '#d9edf7','border-color': '#bce8f1','cursor':'help'});
													$("#requestedInst").find('.step4').find('.instrumentData').find('.routines').find('.routineDetails').find('.typeParse').prop('title','This entry has changed');
												}
											}
											if(Number(selectedFile.remarks.parsingInfo.dataType)==1){
												$("#requestedInst").find('.step4').find('.instrumentData').find('.routines').find('.routineDetails').append('<p> Column size : <span class="colSize">'+selectedFile.remarks.parsingInfo.colSize+'</span></p>');
												if('metaid' in selectedFile && !allNew){
													if(Number(selectedFile.remarks.parsingInfo.colSize)!=Number(currentInstrumentOld.files[fileIdx].remarks.parsingInfo.colSize)){
														$("#requestedInst").find('.step4').find('.instrumentData').find('.routines').find('.routineDetails').find('.colSize').css({'color': '#31708f','background-color': '#d9edf7','border-color': '#bce8f1','cursor':'help'});
														$("#requestedInst").find('.step4').find('.instrumentData').find('.routines').find('.routineDetails').find('.colSize').prop('title',"This entry has changed, was previously '"+currentInstrumentOld.files[fileIdx].remarks.parsingInfo.colSize+"'");
													}
												}
											}
											$("#requestedInst").find('.step4').find('.instrumentData').find('.routines').find('.routineDetails').append('<p> Header lines : <b><span class="headerLines">'+selectedFile.remarks.parsingInfo.headerLines+'</span></b></p>');
											if('metaid' in selectedFile && !allNew){
												if(Number(selectedFile.remarks.parsingInfo.headerLines)!=Number(currentInstrumentOld.files[fileIdx].remarks.parsingInfo.headerLines)){
													$("#requestedInst").find('.step4').find('.instrumentData').find('.routines').find('.routineDetails').find('.headerLines').css({'color': '#31708f','background-color': '#d9edf7','border-color': '#bce8f1','cursor':'help'});
													$("#requestedInst").find('.step4').find('.instrumentData').find('.routines').find('.routineDetails').find('.headerLines').prop('title',"This entry has changed, was previously '"+currentInstrumentOld.files[fileIdx].remarks.parsingInfo.headerLines+"'");
												}
											}
											$("#requestedInst").find('.step4').find('.instrumentData').find('.routines').find('.routineDetails').append('<p> Separator : <b><span class="separator">'+selectedFile.remarks.parsingInfo.separator+'</span></b></p>');
											if('metaid' in selectedFile && !allNew){
												if(selectedFile.remarks.parsingInfo.separator!=currentInstrumentOld.files[fileIdx].remarks.parsingInfo.separator){
													$("#requestedInst").find('.step4').find('.instrumentData').find('.routines').find('.routineDetails').find('.separator').css({'color': '#31708f','background-color': '#d9edf7','border-color': '#bce8f1','cursor':'help'});
													$("#requestedInst").find('.step4').find('.instrumentData').find('.routines').find('.routineDetails').find('.separator').prop('title',"This entry has changed, was previously '"+currentInstrumentOld.files[fileIdx].remarks.parsingInfo.separator+"'");
												}
											}
											$("#requestedInst").find('.step4').find('.instrumentData').find('.routines').find('.routineDetails').append('<p> Time format : <b><span class="timeFormat">'+selectedFile.remarks.parsingInfo.timeFormat+'</b></p>');
											if('metaid' in selectedFile && !allNew){
												if(selectedFile.remarks.parsingInfo.timeFormat!=currentInstrumentOld.files[fileIdx].remarks.parsingInfo.timeFormat){
													$("#requestedInst").find('.step4').find('.instrumentData').find('.routines').find('.routineDetails').find('.timeFormat').css({'color': '#31708f','background-color': '#d9edf7','border-color': '#bce8f1','cursor':'help'});
													$("#requestedInst").find('.step4').find('.instrumentData').find('.routines').find('.routineDetails').find('.timeFormat').prop('title',"This entry has changed, was previously '"+currentInstrumentOld.files[fileIdx].remarks.parsingInfo.timeFormat+"'");
												}
											}
											$("#requestedInst").find('.step4').find('.instrumentData').find('.routines').find('.routineDetails').append('<hr style="width:25%;"><h4>Data channels</h4>');
											$("#requestedInst").find('.step4').find('.instrumentData').find('.routines').find('.routineDetails').append('<table id="displayFinalChannels"></table>');
											var channelsDisplay=[];
											for(var i=0; i<selectedFile.channels.length; i++){
												var isNewChannel=false;
												if((typeof currentInstrumentOld.files[fileIdx].channels[i])==='undefined'){
													isNewChannel=true;
												}
												if(Number(selectedFile.channels[i].channeltype)==1){
													typeStr='Number';
												}
												else if(Number(selectedFile.channels[i].channeltype)==2){
													typeStr='Character(s)';
												}
												else if(Number(selectedFile.channels[i].channeltype)==3){
													typeStr='Composite';
												}
												if(Number(selectedFile.channels[i].active)==0){
													activeStr='<span style="color:#a94442;background-color:#ebcccc;border-color:#ebcccc">No</span>';
												}
												else if(Number(selectedFile.channels[i].active)==1){
													activeStr='<span style="color:#3c763d;background-color:#dff0d8;border-color:#d0e9c6">Yes</span>';
												}
												//Name
												if('metaid' in selectedFile && !allNew && !isNewChannel){
													if(selectedFile.channels[i].Name!=currentInstrumentOld.files[fileIdx].channels[i].Name){
														var nameSpan='<span style="color:#31708f;background-color:#d9edf7;border-color:#bce8f1;cursor:help" title="This entry has changed, was previously \''+currentInstrumentOld.files[fileIdx].channels[i].Name+'\'">'+selectedFile.channels[i].Name+'</span>';
													}
													else{
														var nameSpan='<span>'+selectedFile.channels[i].Name+'</span>';
													}
												}
												else{
													var nameSpan='<span>'+selectedFile.channels[i].Name+'</span>';
												}
												//description
												if('metaid' in selectedFile && !allNew && !isNewChannel){
													if(selectedFile.channels[i].description!=currentInstrumentOld.files[fileIdx].channels[i].description){
														var descriptionSpan='<span style="color:#31708f;background-color:#d9edf7;border-color:#bce8f1;cursor:help" title="This entry has changed, was previously \''+currentInstrumentOld.files[fileIdx].channels[i].description+'\'">'+selectedFile.channels[i].description+'</span>';
													}
													else{
														var descriptionSpan='<span>'+selectedFile.channels[i].description+'</span>';
													}
												}
												else{
													var descriptionSpan='<span>'+selectedFile.channels[i].description+'</span>';
												}
												//channeltype
												if('metaid' in selectedFile && !allNew && !isNewChannel){
													if(selectedFile.channels[i].channeltype!=currentInstrumentOld.files[fileIdx].channels[i].channeltype){
														var channeltypeSpan='<span style="color:#31708f;background-color:#d9edf7;border-color:#bce8f1;cursor:help" title="This entry has changed, was previously \''+currentInstrumentOld.files[fileIdx].channels[i].channeltype+'\'">'+typeStr+'</span>';
													}
													else{
														var channeltypeSpan='<span>'+typeStr+'</span>';
													}
												}
												else{
													var channeltypeSpan='<span>'+typeStr+'</span>';
												}
												//units
												if('metaid' in selectedFile && !allNew && !isNewChannel){
													if(selectedFile.channels[i].units!=currentInstrumentOld.files[fileIdx].channels[i].units){
														var unitsSpan='<span style="color:#31708f;background-color:#d9edf7;border-color:#bce8f1;cursor:help" title="This entry has changed, was previously \''+currentInstrumentOld.files[fileIdx].channels[i].units+'\'">'+selectedFile.channels[i].units+'</span>';
													}
													else{
														var unitsSpan='<span>'+selectedFile.channels[i].units+'</span>';
													}
												}
												else{
													var unitsSpan='<span>'+selectedFile.channels[i].units+'</span>';
												}
												//active
												if('metaid' in selectedFile && !allNew && !isNewChannel){
													if(selectedFile.channels[i].active!=currentInstrumentOld.files[fileIdx].channels[i].active){
														var activeSpan='<span style="color:#31708f;background-color:#d9edf7;border-color:#bce8f1;cursor:help" title="This entry has changed, was previously \''+currentInstrumentOld.files[fileIdx].channels[i].active+'\'">'+activeStr+'</span>';
													}
													else{
														var activeSpan='<span>'+activeStr+'</span>';
													}
												}
												else{
													var activeSpan='<span>'+activeStr+'</span>';
												}
												//order
												if('metaid' in selectedFile && !allNew && !isNewChannel){
													if(selectedFile.channels[i].fileorder!=currentInstrumentOld.files[fileIdx].channels[i].fileorder){
														var orderSpan='<span style="color:#31708f;background-color:#d9edf7;border-color:#bce8f1;cursor:help" title="This entry has changed, was previously \''+(Number(currentInstrumentOld.files[fileIdx].channels[i].fileorder)+1)+'\'">'+Number(selectedFile.channels[i].fileorder)+1+'</span>';
													}
													else{
														var orderSpan='<span>'+(Number(selectedFile.channels[i].fileorder)+1)+'</span>';
													}
												}
												else{
													var orderSpan='<span>'+(Number(selectedFile.channels[i].fileorder)+1)+'</span>';
												}
												channelsDisplay.push({
													'Name'          :   nameSpan,
													'description'   :   descriptionSpan,
													'channeltype'   :   channeltypeSpan,
													'units'         :   unitsSpan,
													'active'        :   activeSpan,
													'order'         :   orderSpan,
												});
											}
											channelTableFinal=$("#requestedInst").find('.step4').find('.instrumentData').find('.routines').find('.routineDetails').find('#displayFinalChannels').DataTable({
												columns: [
													{data:'Name',"name":'Name',"title":'Name'},
													{data:'description',"name":'description',"title":'Description'},
													{data:'channeltype',"name":'channeltype',"title":'Type'},
													{data:'units',"name":'units',"title":'Units'},
													{data:'active',"name":'active',"title":'Active'},
													{data:'order',"name":'order',"title":'Order'}
												],
												"oLanguage": {
													"sEmptyTable":     "There are no data channels for this routine!"
												},
												'data':channelsDisplay
											});
										}
										else{
											$("#requestedInst").find('.step4').find('.instrumentData').find('.routines').find('.routineDetails').append('<hr style="width:25;"><span style="color:#8a6d3b;background-color:#fcf8e3;border-color:#faebcc">No data channels found for this instrument</span>');
										}
									}
									else{
										$("#requestedInst").find('.step4').find('.instrumentData').find('.routines').find('.routineDetails').append('<hr style="width:25;"><span style="color:#8a6d3b;background-color:#fcf8e3;border-color:#faebcc">No parsing info found on this instrument</span>');
									}
								}
								else{
									$("#requestedInst").find('.step4').find('.instrumentData').find('.routines').find('.routineDetails').append('<p> Parse files : <span style="font-weight:bold">No</span></p>');
								}
							}
							//MUST ADD HERE FOR OTHERS : NETWORK PORT & SERIAL PORT
							$.colorbox.resize();
						});
					}
					else{
						$("#requestedInst").find('.step4').find('.instrumentData').find('.routines').append('<span style="margin:auto;text-align:center;color: #8a6d3b;background-color: #fcf8e3;border-color: #faebcc;">This instrument has no routines set</span>');
					}
					$("#requestedInst").find('.step4').find('.finishDiv').find('.finish').click(function(){
						var theButton=$(this);
						$(this).prop('disabled',true);
						$(this).html('Please wait...');
						for(var i=0; i<currentInstrument.files.length; i++){
							currentInstrument.files[i]['clock']=Date.now();
						}
						delete currentInstrument['interfaceStep']
						currentInstrument["privateKey"]=localData.privateKey;
						currentInstrument["database"]=dbname;
						$.ajax({
							url: 'insertInstrument',
							'button':theButton,
							type: 'POST',
							dataType: "json",
							contentType: "application/json; charset=UTF-8",
							data: JSON.stringify(currentInstrument),
							success: function(returned){
								$.ajax({
									method: "POST",
									'button':this['button'],
									url:"queryInstruments",
									dataType: "json",
									data: {"database":dbname},
									success: function(returned,status,derp) {
										existingInstruments=returned;
										this['button'].prop('disabled',false);
										this['button'].html('Submit');
										beforeCloseTest=true;
										currentInstrument={};
										$.colorbox.close();
										updateInstTable();
									},
									error: function(returned){
										alert('There was an error getting the instrument list');
										location.reload();
									}
								});
							},
							error: function(returned){
								this['button'].prop('disabled',false);
								this['button'].html('Submit');
								$(this['button'].parent()).find('.errorPar').remove();
								this['button'].after('<p class="errorPar"><span style="color:#a94442;background-color:#f2dede;border-color:#ebccd1">'+returned.responseJSON.message+'</span></p>');
								$(this['button'].parent()).find('.errorPar').focus();
								$.colorbox.resize();
							}
						});
					});
					$(".step1").fadeOut(300);
					$(".step2").fadeOut(300);
					$(".step4").fadeIn(300);
					$(".step3").fadeOut(300);
					$.colorbox.resize();
				}
				if(typeof theInstrument==="undefined"){
					$(".step1Button").unbind('click');
					$(".step1Button").click(function(){
						newInst("step1");
					});
					$(".step2Button").unbind('click');
					$(".step2Button").click(function(){
						newInst("step2");
					});
					$(".step3Button").unbind('click');
					$(".step3Button").click(function(){
						newInst("step3");
					});
					$(".step4Button").unbind('click');
					$(".step4Button").click(function(){
						newInst("step4");
					});
				}
				if(functionArguments[2] !==undefined){
					currentInstrument=functionArguments[2];
				}
				if(Object.keys(currentInstrument).length > 0 && currentInstrument.constructor === Object){
					var localRemembered=JSON.parse(sessionStorage.getItem('daqbroker'));
					localRemembered['instrument']=currentInstrument;
					if('interfaceStep' in localRemembered.instrument){
						localRemembered.instrument.interfaceStep[stepArgument]=true;
					}
					else{
						localRemembered.instrument.interfaceStep={};
						localRemembered.instrument.interfaceStep[stepArgument]=true;
					}
					for(var prop in localRemembered.instrument.interfaceStep){
						if(prop!=stepArgument){
							localRemembered.instrument.interfaceStep[prop]=false;
						}
					}
					//localRemembered.instrument['interfaceStep']=arguments[0];
					if(!(currentInstrument.instid>=0)){
						sessionStorage.setItem('daqbroker', JSON.stringify(localRemembered));
					}
					else{
						delete localRemembered.instrument
						sessionStorage.setItem('daqbroker', JSON.stringify(localRemembered));
					}
				}
			}
			setTimeout(function() { $.colorbox.resize(); }, 350);
		},
		error: function(returned){
			var n=new Noty({
				text      :  "There was an error setting up instrument creation - '"+returned.responseJSON.message+"'",
				theme     :  'relax',
				type      :  'error',
				timeout   :  '10000'
			}).show();
			/* var newConfirm = $.confirm({
				title: 'Improper credentials',
				content: '<div><p>No special credentials found for instrument creation. You must either be logged in as an administrator or posess an administrator-supplied authentication file.</p> <p> You can supply the file here if you have it or contact your administrator to get one.<p><input type="file" id="privateKeyFile"></input><span id="privateFileSupplyError"></span></p></div> ',
				//autoClose: 'logout|0',
				type: 'orange',
				buttons: {
					Cancel:{
						text: 'Cancel',
						btnClass: 'btn-red',
					}
				},
				onContentReady: function () {
					console.log($(newConfirm.content).find("#privateKeyFile"));
					$("#privateKeyFile").change(function(){
						input = this;
						file = input.files[0];
						fr = new FileReader();
						fr.onload = function(){
							dataToSend = {'privateKey':fr.result};
							$.ajax({
								url:"/admin/testAdminOneTime",
								dataType: "json",
								data: dataToSend,
								type: 'POST',
								success: function(returned){
									localStorage.setItem("daqbroker", JSON.stringify({'privateKey':fr.result}));
									newConfirm.close();
								},
								error: function(returned){
									$("#privateKeyFile").empty();
									$("#privateKeyFile").append("error");
								}
							});
						};
						fr.readAsText(file);
					});
				}
			});
			console.log(newConfirm.$content);
			console.log(newConfirm.content);
			console.log($(newConfirm.content).find("#privateKeyFile")); */
		}
	});
}

function receivedText() {
	showResult(fr, "Text");

	fr = new FileReader();
	fr.onload = receivedBinary;
	fr.readAsBinaryString(file);
}

function receivedBinary() {
	showResult(fr, "Binary");
}

function showFormatTable(){
	console.log(arguments);
	currentInstrument["interfaceStep"]["step3"]=true;
	$("#requestedInst").find('.step3').fadeOut(300);
	$("#requestedInst").find('.step3Aux').fadeOut(300);
	if($("#requestedInst").find('.step3Aux2').length>0){
		$("#requestedInst").find('.step3Aux2').remove();
	}
	$("#requestedInst").append('<div class="step3Aux2"><h2>Time format string</h2><input hidden class="calledFrom" value="'+arguments[0]+'"></input><input hidden class="calledFromData"></input><p style="margin:auto;text-align:center"><button style="font-size:110%" class="back">Back</button></p><p>Credit to <a href="https://momentjs.com/">moment.js</a> and <a href="http://arrow.readthedocs.io/en/latest/">Arrow</a></p><body><table border="1" class="table table-striped table-bordered"><tbody><tr><th></th><th>Token</th><th>Output</th></tr><tr><td><b>Month</b></td><td>M</td><td>1 2 ... 11 12</td></tr><tr><td></td><td>Mo</td><td>1st 2nd ... 11th 12th</td></tr><tr><td></td><td>MM</td><td>01 02 ... 11 12</td></tr><tr><td></td><td>MMM</td><td>Jan Feb ... Nov Dec</td></tr><tr><td></td><td>MMMM</td><td>January February ... November December</td></tr><tr><td><b>Quarter</b></td><td>Q</td><td>1 2 3 4</td></tr><tr><td></td><td>Qo</td><td>1st 2nd 3rd 4th</td></tr><tr><td><b>Day of Month</b></td><td>D</td><td>1 2 ... 30 31</td></tr><tr><td></td><td>Do</td><td>1st 2nd ... 30th 31st</td></tr><tr><td></td><td>DD</td><td>01 02 ... 30 31</td></tr><tr><td><b>Day of Year</b></td><td>DDD</td><td>1 2 ... 364 365</td></tr><tr><td></td><td>DDDo</td><td>1st 2nd ... 364th 365th</td></tr><tr><td></td><td>DDDD</td><td>001 002 ... 364 365</td></tr><tr><td><b>Day of Week</b></td><td>d</td><td>0 1 ... 5 6</td></tr><tr><td></td><td>do</td><td>0th 1st ... 5th 6th</td></tr><tr><td></td><td>dd</td><td>Su Mo ... Fr Sa</td></tr><tr><td></td><td>ddd</td><td>Sun Mon ... Fri Sat</td></tr><tr><td></td><td>dddd</td><td>Sunday Monday ... Friday Saturday</td></tr><tr><td><b>Day of Week (Locale)</b></td><td>e</td><td>0 1 ... 5 6</td></tr><tr><td><b>Day of Week (ISO)</b></td><td>E</td><td>1 2 ... 6 7</td></tr><tr><td><b>Week of Year</b></td><td>w</td><td>1 2 ... 52 53</td></tr><tr><td></td><td>wo</td><td>1st 2nd ... 52nd 53rd</td></tr><tr><td></td><td>ww</td><td>01 02 ... 52 53</td></tr><tr><td><b>Week of Year (ISO)</b></td><td>W</td><td>1 2 ... 52 53</td></tr><tr><td></td><td>Wo</td><td>1st 2nd ... 52nd 53rd</td></tr><tr><td></td><td>WW</td><td>01 02 ... 52 53</td></tr><tr><td><b>Year</b></td><td>YY</td><td>70 71 ... 29 30</td></tr><tr><td></td><td>YYYY</td><td>1970 1971 ... 2029 2030</td></tr><tr><td></td><td>Y</td><td>1970 1971 ... 9999 +10000 +10001<br><b>Note:</b> This complies with the ISO 8601 standard for dates past the year 9999</td></tr><tr><td><b>Week Year</b></td><td>gg</td><td>70 71 ... 29 30</td></tr><tr><td></td><td>gggg</td><td>1970 1971 ... 2029 2030</td></tr><tr><td><b>Week Year (ISO)</b></td><td>GG</td><td>70 71 ... 29 30</td></tr><tr><td></td><td>GGGG</td><td>1970 1971 ... 2029 2030</td></tr><tr><td><b>AM/PM</b></td><td>A</td><td>AM PM</td></tr><tr><td></td><td>a</td><td>am pm</td></tr><tr><td><b>Hour</b></td><td>H</td><td>0 1 ... 22 23</td></tr><tr><td></td><td>HH</td><td>00 01 ... 22 23</td></tr><tr><td></td><td>h</td><td>1 2 ... 11 12</td></tr><tr><td></td><td>hh</td><td>01 02 ... 11 12</td></tr><tr><td></td><td>k</td><td>1 2 ... 23 24</td></tr><tr><td></td><td>kk</td><td>01 02 ... 23 24</td></tr><tr><td><b>Minute</b></td><td>m</td><td>0 1 ... 58 59</td></tr><tr><td></td><td>mm</td><td>00 01 ... 58 59</td></tr><tr><td><b>Second</b></td><td>s</td><td>0 1 ... 58 59</td></tr><tr><td></td><td>ss</td><td>00 01 ... 58 59</td></tr><tr><td><b>Fractional Second</b></td><td>S</td><td>0 1 ... 8 9</td></tr><tr><td></td><td>SS</td><td>00 01 ... 98 99</td></tr><tr><td></td><td>SSS</td><td>000 001 ... 998 999</td></tr><tr><td></td><td>SSSS ... SSSSSSSSS</td><td>000[0..] 001[0..] ... 998[0..] 999[0..]</td></tr><tr><td><b>Time Zone</b></td><td>z or zz</td><td>EST CST ... MST PST<br><b>Note:</b> as of <b>1.6.0</b>, the z/zz format tokens have been deprecated from plain moment objects. <a href="https://github.com/moment/moment/issues/162">Read more about it here.</a>However, they <em>do</em> work if you are using a specific time zone with the moment-timezone addon.</td></tr><tr><td></td><td>Z</td><td>-07:00 -06:00 ... +06:00 +07:00</td></tr><tr><td></td><td>ZZ</td><td>-0700 -0600 ... +0600 +0700</td></tr><tr><td><b>Unix Timestamp</b></td><td>NOFORMAT</td><td>1360013296</td></tr><tr><td><b>Unix Millisecond Timestamp</b></td><td>MILLISECOND</td><td>1360013296123</td></tr></tbody></table><p style="margin:auto;text-align:center"><button style="font-size:110%" class="back">Back</button></p></div>');
	$("#requestedInst").find('.step3Aux2').find('.calledFromData').data('parsingInfo',arguments[1]);
	$("#requestedInst").find('.step3Aux2').find('.calledFromData').data('currentFile',arguments[2]);
	$("#requestedInst").find('.step3Aux2').find('.back').click(function(){
		
		$("#requestedInst").find('.step3Aux2').fadeOut(300);
		var calledFrom=$("#requestedInst").find('.step3Aux2').find('.calledFrom').val();
		if(calledFrom=='step3'){
			newInst('step3');
		}
		else if(calledFrom=='step3Aux'){
			var calledFromData=$("#requestedInst").find('.step3Aux2').find('.calledFromData').data('parsingInfo');
			var calledFromData2=$("#requestedInst").find('.step3Aux2').find('.calledFromData').data('currentFile');
			exampleFileChannels(calledFromData,calledFromData2);
		}
	});
	$.colorbox.resize();
}

function exampleFileChannels(parsingInfo,currentFile){
	$("#requestedInst").find('.step3').fadeOut(300);
	if($("#requestedInst").find('.step3Aux').length>0){
		$("#requestedInst").find('.step3Aux').remove();
	}
	console.log(parsingInfo);
	$("#requestedInst").append('<div class="step3Aux"><h2>Step 3 : Channels from file</h2></div>');
	$("#requestedInst").find('.step3Aux').append('<p>Data Type : <select class="dataType"><option value="0">Regular columns</option><option value="1">Horizntal columns</option></select></p><div class="colSizeDiv"></div>');
	$("#requestedInst").find('.step3Aux').append('<p>Separator : <select class="separator"><option value="tab">Tab</option><option value="comma">Comma</option><option value="space">Space</option><option value="colon">Colon</option></select></p>');
	$("#requestedInst").find('.step3Aux').append('<p><span class="stupidAmbiguousText">Header Lines</span> : <input type="number" min="0" class="headerLines" value="'+parsingInfo.headerLines+'"></input></p>');
	$("#requestedInst").find('.step3Aux').append('<p>Time Format (<a href="#format" class="showTheTable">Ref.</a>) : <input class="timeFormat" value="'+parsingInfo.timeFormat+'"></input></p>');
	$("#requestedInst").find('.step3Aux').find(".dataType").change(function(){
		if($(this).val()=="1"){
			if(!("colSize" in parsingInfo)){
				parsingInfo["colSize"]=1;
			}
			$("#requestedInst").find('.step3Aux').find(".colSizeDiv").append('Column size : <input class="colSize" type="number" min="1"></input>');
			$("#requestedInst").find('.step3Aux').find(".colSizeDiv").find(".colSize").change(function(){
				parsingInfo["colSize"]=Number($(this).val());
			});
			$("#requestedInst").find('.step3Aux').find(".colSizeDiv").find(".colSize").val(parsingInfo["colSize"]);
			$("#requestedInst").find('.step3Aux').find('.stupidAmbiguousText').html("Data position");
		}
		else{
			delete parsingInfo["colSize"]
			$("#requestedInst").find('.step3Aux').find(".colSizeDiv").empty()
			$("#requestedInst").find('.step3Aux').find('.stupidAmbiguousText').html("Header Lines");
		}
	});
	$("#requestedInst").find('.step3Aux').find('.separator').val(parsingInfo.separator);
	$("#requestedInst").find('.step3Aux').find('.dataType').val(parsingInfo.dataType);
	$("#requestedInst").find('.step3Aux').find(".dataType").trigger('change');
	$("#requestedInst").find('.step3Aux').find('.showTheTable').click(function(){
		showFormatTable('step3Aux',parsingInfo,currentFile);
	});
	$("#requestedInst").find('.step3Aux').find(':input').change(function(){
		parsingInfo[$(this).prop('class').split(' ')[0]]=$(this).val();
	});
	$("#requestedInst").find('.step3Aux').append('<p>File : <input type="file" class="importedFile"><span class="errorImportFile" style="color:red;"></span></input></p>');
	$("#requestedInst").find('.step3Aux').find(':input').change(function(){
		var file=$("#requestedInst").find('.step3Aux').find('.importedFile')[0].files[0];
		var reader= new FileReader();
		reader['thisTry']=0;

		reader.onloadend = function(e){
			if(e.target.readyState == FileReader.DONE){
				console.log('Done reading');
				var fileText=e.target.result;
				var lines=fileText.split(/\n/);
				var headerLines=parsingInfo.headerLines;

				if(lines.length<headerLines){
					reader['thisTry']=reader['thisTry']+1;
					var blob=file.slice(0,10000*reader['thisTry']);
					this.readAsText(blob);
				}
				else{
					var textHeaderLines=lines.slice(0,headerLines);
					if(lines.length>10+headerLines && parsingInfo.dataType==0){
						var lines=lines.slice(headerLines+1,11+headerLines);
					}
					var separator=parsingInfo.separator;
					var timeFormat=parsingInfo.timeFormat;
					var colSize=parsingInfo.colSize;
					
					if(separator=='tab'){
						separator='\t';
					}
					else if(separator=='comma'){
						separator=',';
					}
					else if(separator=='semicolon'){
						separator=';';
					}
					else if(separator=='colon'){
						separator=':';
					}
					else if(separator=='space'){
						separator=' ';
					}
					//console.log(parsedResult);
					$("#requestedInst").find('.step3Aux').find('.showResults').empty();
					$("#requestedInst").find('.step3Aux').find('.showResults').append('<hr style="width:25%"><h3>Pseudo-parse result</h3><p>The following potential channels were found in the provided file:</p><p>Header options : <select class="headerCandidates"></select></p><table id="foundChannelsTable"></table><span class="error" style="color:#a94442;background-color:#f2dede;border-color:#ebccd1"></span>');
					if(Number(parsingInfo.dataType)==0){
						var parsedResult=pseudoParse(lines,parsingInfo.dataType,separator,timeFormat,textHeaderLines,colSize,headerLines);
						for(var i=0; i<parsedResult.headerCandidates.length; i++){
							$("#requestedInst").find('.step3Aux').find('.headerCandidates').append('<option value="'+i+'">Option '+(i+1)+'</option>');
						}
						$("#requestedInst").find('.step3Aux').find('.headerCandidates').change(function(){
							var candidateIdx=Number($("#requestedInst").find('.step3Aux').find('.headerCandidates').val());
							var linesTable=[];
							if((typeof channelTableExample)!='undefined'){
								channelTableExample.destroy();
							}
							var checkNumber=[];
							for(var i=0; i<parsedResult.lines.length; i++){
								for(var j=0; j<parsedResult.lines[i].length; j++){
									if((typeof checkNumber[j])==='undefined'){
										checkNumber.push(0)
									}
									if(j<parsedResult.headerCandidates[candidateIdx].length){
										if(isNaN(parsedResult.lines[i][j])){
											checkNumber[j]=checkNumber[j]-1
										}
										else{
											checkNumber[j]=checkNumber[j]+1
										}
									}
								}
							}
							console.log(checkNumber);
							$("#requestedInst").find('.step3Aux').find('.error').empty();
							if(!((typeof parsedResult.headerCandidates[candidateIdx])==='undefined')){
								for(var i=0; i<parsedResult.headerCandidates[candidateIdx].length; i++){
									if(checkNumber[i]>=parsedResult.lines.length/10){//Biased percentage of values are numbers
										linesTable.push({
											'Name'         :  '<input value="'+parsedResult.headerCandidates[candidateIdx][i]+'" class="Name"></input>',
											'Description'  :  '<input class="description" value="NONE"></input>',
											'Type'         :  '<select class="channeltype"><option value="1" selected>Number</option><option value="2">Character</option></select>',
											'Units'        :  '<input class="units" value="NONE"></input>',
											'Active'       :  '<select class="active"><option value="0" selected>No</option><option value="1" selected>Yes</option></select>',
											'Order'        :  (i+1)+'<input type="number" class="fileorder" hidden value="'+i+'"></input><input class="alias" hidden value="'+parsedResult.headerCandidates[candidateIdx][i]+'"></input>'
										});
									}
									else if(checkNumber[i]<=-parsedResult.lines.length/10){//Biased percentage of values are strings
										linesTable.push({
											'Name'         :  '<input value="'+parsedResult.headerCandidates[candidateIdx][i]+'" class="Name"></input>',
											'Description'  :  '<input class="description" value="NONE"></input>',
											'Type'         :  '<select class="channeltype"><option value="1">Number</option><option selected value="2">Character</option></select>',
											'Units'        :  '<input class="units" value="NONE"></input>',
											'Active'       :  '<select class="active"><option value="0" selected>No</option><option value="1" selected>Yes</option></select>',
											'Order'        :  (i+1)+'<input type="number" class="fileorder" hidden value="'+i+'"></input><input class="alias" hidden value="'+parsedResult.headerCandidates[candidateIdx][i]+'"></input>'
										});
									}
									else{//Can't say for sure, will assume number
										linesTable.push({
											'Name'         :  '<input value="'+parsedResult.headerCandidates[candidateIdx][i]+'" class="Name"></input>',
											'Description'  :  '<input class="description" value="NONE"></input>',
											'Type'         :  '<select class="channeltype"><option value="1" selected>Number</option><option value="2">Character</option></select>',
											'Units'        :  '<input class="units" value="NONE"></input>',
											'Active'       :  '<select class="active"><option value="0" selected>No</option><option value="1" selected>Yes</option></select>',
											'Order'        :  (i+1)+'<input type="number" class="fileorder" hidden value="'+i+'"></input><input class="alias" hidden value="'+parsedResult.headerCandidates[candidateIdx][i]+'"></input>'
										});
									}
								}
								channelTableExample=$("#requestedInst").find('.step3Aux').find('#foundChannelsTable').DataTable({
									columns: [
										{data:'Name',"name":'Name',"title":'Name'},
										{data:'Description',"name":'Description',"title":'Description'},
										{data:'Type',"name":'Type',"title":'Type'},
										{data:'Units',"name":'Units',"title":'Units'},
										{data:'Active',"name":'Active',"title":'Active'},
										{data:'Order',"name":'Order',"title":'Order'}
									],
									"oLanguage": {
										"sEmptyTable":     "No channels were found"
									},
									'data':linesTable
								});
								if(linesTable.length>0){
									$("#requestedInst").find('.step3Aux').find('.finalOptions').find('.end').remove();
									$("#requestedInst").find('.step3Aux').find('.finalOptions').append('<button class="end button pill" style="font-size:120%">Use channels</button>');
									$("#requestedInst").find('.step3Aux').find('.finalOptions').find('.end').click(function(){
										if(!('channels' in currentFile)){
											currentFile['channels']=[];
										}
										channelTableExample.rows().every( function ( rowIdx, tableLoop, rowLoop ) {
											var data = this.data();
											var toPush={};
											$(this.node()).find(':input').each(function(){
												toPush[$(this).prop('class')]=$(this).val();
											});
											toPush['channelid']=-1;
											currentFile['channels'].push(toPush);
										} );
										$("#requestedInst").find('.step3Aux').fadeOut(300);
										newInst('step3');
									});
								}
							}
							else{
								$("#requestedInst").find('.step3Aux').find('.error').append('This option contains no valid header candidates');
							}
						});
						$("#requestedInst").find('.step3Aux').find('.headerCandidates').trigger('change');
					}
					else if(Number(parsingInfo.dataType)==1){
						var parsedResult=pseudoParse(lines,parsingInfo.dataType,separator,timeFormat,textHeaderLines,colSize,0);
						//$(".step5").find(".parseInfo").find("#importData").append('<hr style="width:25%"><h4 style="margin:auto;text-align:center">File Pseudo-Parsing</h4><p>Select a candidate header </p><p><select class="optionHeader"></select></p>');
						//$(".step5").find(".parseInfo").find("#importData").append('<p>This is the data I think these files have:</p> <div><table class="channelsData"><thead><tr class="channelsHeader"></tr></thead><tbody class="channelsLines"></tbody></table></div>');
						//PUT MORE PARSING RELATED DATA HERE
						dataKeys=Object.keys(parsedResult.data);
						console.log(dataKeys);
						for(var j=0; j<dataKeys.length; j++){
							$("#requestedInst").find('.step3Aux').find('.headerCandidates').append('<option value="'+j+'">'+dataKeys[j]+'</option>');
						}
						$("#requestedInst").find('.step3Aux').find('.headerCandidates').change(function(){
							$("#requestedInst").find('.step3Aux').find('.valueOption').parent().remove();
							$("#requestedInst").find('.step3Aux').find('.headerCandidates').parent().after('<p>Value candidates: <select class="valueOption"></select></p>');
							var idx=Number($(this).val());
							var theInnerKeys=Object.keys(parsedResult.data[dataKeys[idx]]);
							valueOptions=[];
							for(var i=0; i<theInnerKeys.length; i++){
								for(var k=0; k<parsedResult.data[dataKeys[idx]][theInnerKeys[i]].length; k++){
									valOptions=Object.keys(parsedResult.data[dataKeys[idx]][theInnerKeys[i]][k]);
									for(var q=0; q<valOptions.length; q++){
										if(valueOptions.indexOf(valOptions[q])<0 && valOptions[q]!='time'){
											valueOptions.push(valOptions[q]);
										}
									}
								}
								//$(".step5").find(".parseInfo").find("#importData").find('.channelsHeader').append('<th>'+theInnerKeys[i]+'</th>');
							}
							for(var i=0; i<valueOptions.length; i++){
								$("#requestedInst").find('.step3Aux').find('.valueOption').append('<option value="'+i+'">'+valueOptions[i]+'</option>');
							}
							$("#requestedInst").find('.step3Aux').find('.valueOption').change(function(){
								var linesTable=[];
								var idx=Number($("#requestedInst").find('.step3Aux').find(".headerCandidates").val());
								var theInnerKeys=Object.keys(parsedResult.data[dataKeys[idx]]);
								var thisEl=valueOptions[Number($(this).val())];
								$("#requestedInst").find('.step3Aux').find('.channelsHeader').empty();
								if((typeof channelTableExample)!='undefined'){
									channelTableExample.destroy();
								}
								$("#requestedInst").find('.step3Aux').find('.error').empty();
								if(!((typeof theInnerKeys)==='undefined')){
									for(var i=0; i<theInnerKeys.length; i++){
										linesTable.push({
											'Name'         :  '<input value="'+theInnerKeys[i]+'" class="Name"></input>',
											'Description'  :  '<input class="description" value="NONE"></input>',
											'Type'         :  '<select class="channeltype"><option value="1" selected>Number</option><option value="2">Character</option></select>',
											'Units'        :  '<input class="units" value="NONE"></input>',
											'Active'       :  '<select class="active"><option value="0" selected>No</option><option value="1" selected>Yes</option></select>',
											'Order'        :  (i+1)+'<input type="number" class="fileorder" hidden value="'+i+'"></input><input class="alias" hidden value="'+theInnerKeys[i]+'"></input>'
										});
									}
									channelTableExample=$("#requestedInst").find('.step3Aux').find('#foundChannelsTable').DataTable({
										columns: [
											{data:'Name',"name":'Name',"title":'Name'},
											{data:'Description',"name":'Description',"title":'Description'},
											{data:'Type',"name":'Type',"title":'Type'},
											{data:'Units',"name":'Units',"title":'Units'},
											{data:'Active',"name":'Active',"title":'Active'},
											{data:'Order',"name":'Order',"title":'Order'}
										],
										"oLanguage": {
											"sEmptyTable":     "No channels were found"
										},
										'data':linesTable
									});
									if(linesTable.length>0){
										$("#requestedInst").find('.step3Aux').find('.finalOptions').find('.end').remove();
										$("#requestedInst").find('.step3Aux').find('.finalOptions').append('<button class="end button pill" style="font-size:120%">Use channels</button>');
										$("#requestedInst").find('.step3Aux').find('.finalOptions').find('.end').click(function(){
											if(!('channels' in currentFile)){
												currentFile['channels']=[];
											}
											channelTableExample.rows().every( function ( rowIdx, tableLoop, rowLoop ) {
												var data = this.data();
												var toPush={};
												$(this.node()).find(':input').each(function(){
													toPush[$(this).prop('class')]=$(this).val();
												});
												toPush['channelid']=-1;
												currentFile['channels'].push(toPush);
											} );
											$("#requestedInst").find('.step3Aux').fadeOut(300);
											
											newInst('step3');
										});
									}
								}
								else{
									$("#requestedInst").find('.step3Aux').find('.error').append('This option contains no valid header candidates');
								}
								$.colorbox.resize();
								parsingInfo["valuePosition"]=parsedResult['valPos'][thisEl];
							});
							$("#requestedInst").find('.step3Aux').find('.valueOption').trigger('change');
							$.colorbox.resize();
							parsingInfo["headerPosition"]=parsedResult['headPos'][dataKeys[Number($(this).val())]];
						});
						$("#requestedInst").find('.step3Aux').find('.headerCandidates').trigger('change');
					}
					$.colorbox.resize();
				}
			}
		}

		if(parsingInfo.dataType==0){
			var blob=file.slice(0,50000000000);
		}
		else if(parsingInfo.dataType=="1"){
			var blob=file.slice(0,file.size);
		}

		reader.readAsText(blob);
	});
	$("#requestedInst").find('.step3Aux').append('<div class="showResults"></div><p style="margin:auto;text-align: center" class="finalOptions"></p>');
	$("#requestedInst").find('.step3Aux').find('.finalOptions').append('<hr style="width:25%"><button class="back button pill" style="font-size:120%">Back</button>');
	$("#requestedInst").find('.back').click(function(){
		$("#requestedInst").find('.step3Aux').fadeOut(300);
		newInst('step3');
	});
	setTimeout(function() { $.colorbox.resize(); }, 350);
	if(Object.keys(currentInstrument).length > 0 && currentInstrument.constructor === Object){
		var localRemembered=JSON.parse(sessionStorage.getItem('daqbroker'));
		localRemembered['instrument']=currentInstrument;
		if('interfaceStep' in localRemembered.instrument){
			localRemembered.instrument.interfaceStep[arguments[0]]=true;
		}
		else{
			localRemembered.instrument.interfaceStep={};
			localRemembered.instrument.interfaceStep[arguments[0]]=true;
		}
		for(var prop in localRemembered.instrument.interfaceStep){
			if(prop!=arguments[0]){
				localRemembered.instrument.interfaceStep[prop]=false;
			}
		}
		//localRemembered.instrument['interfaceStep']=arguments[0];
		sessionStorage.setItem('daqbroker', JSON.stringify(localRemembered));
	}
}

function pseudoParse(lines,type,separator,timeFormat,headerLines,colSize,headerLinesNum){
	var linesResult=[];
	var linesErrors=[];
	var numElements=[];
	var result={};
	var headerCandidates=[];
	//Find where the time is - maybe do something about it? Python to Javascript timespec conversion?
	var linesWithTime=[];
	var timeStringGen='Time - ';
	if(timeFormat){
		if(timeFormat.search('@')>=0){//Time not in first line, could be in several lines, not necessarily concurrent ones
			splitFormat=timeFormat.split('@');
			for(var j=0; j<splitFormat.length; j++){
				if(splitFormat[j].length>0){
					linesWithTime.push(j);
				}
				if(timeFormat.search('NOFORMAT')>=0){
					timeStringGen='Unix Times (seconds)';
				}
				else if(timeFormat.search('MILLISECOND')>=0){
					timeStringGen='Unix Times (milliseconds)';
				}
				else{
					timeStringGen=timeStringGen+' '+splitFormat[j];
				}
			}
		}
		else{
			linesWithTime=[0];
			if(timeFormat.search('NOFORMAT')>=0){
				timeStringGen='Unix Time (seconds)';
			}
			else if(timeFormat.search('MILLISECOND')>=0){
				timeStringGen='Unix Time (milliseconds)';
			}
			else{
				timeStringGen='Time - '+timeFormat;
			}
		}
	}
	else{
		linesWithTime=[];
	}

	result['time']=[];
	result['lines']=[];
	result['lineGood']=[];
	result['errorMsgs']=[];
	result['headerCandidates']=[];

	if(type=="0"){
		for(var j=0; j<lines.length; j++){
			nonTimeStuff=[];
			//Split lines using separator
			if(separator==''){
				lineElements=[lines[j]]
			}
			else{
				lineElements=lines[j].split(separator)
			}

			if(Math.max.apply(null, linesWithTime)>lineElements.length-1){
				linesResult.push(false);
				linesErrors.push('Couldn\t find time elements: too little elements/too many time elements');
				continue;
			}

			numElements.push(lineElements.length);

			var timeStr='';
			if(linesWithTime.length>0){
				if(linesWithTime.length>1){
					for(var i=0; i<linesWithTime.length; i++){
						timeStr=timeStr+' '+lineElements[linesWithTime[i]];
					}
				}
				else{
					timeStr=lineElements[linesWithTime[0]];
				}
			}
			else{
				timeStr='No time provided';
			}
			
			nonTimeStuff=lineElements.filter(function(el){
				var indexEl=lineElements.indexOf(el);
				return linesWithTime.indexOf(indexEl)<0;
			});

			linesResult.push(true);
			linesErrors.push('');

			result['lines'].push(nonTimeStuff);
			result['time'].push(timeStr);

		}

		for(var j=0; j<headerLines.length; j++){
			if(separator==''){
				headerLineElements=[headerLines[j]];
			}
			else{
				headerLineElements=headerLines[j].split(separator);
			}
			headerLineElements=headerLineElements.filter(function(el){
				var indexEl=headerLineElements.indexOf(el);
				return linesWithTime.indexOf(indexEl)<0;
			});
			result['headerCandidates'].push(headerLineElements);
			//}
		}

		result['lineGood']=linesResult;
		result['errorMsgs']=linesErrors;
		result['timeStringGen']=timeStringGen;
	}
	if(type=="1"){
		var jump=0;
		var theSlice=[];
		var lineElements=[];
		var theNewLine='';
		var timeStr='';
		var headerOptions={};
		var headerOptionsKeys=[];
		var valPos={};
		var headerPos={};
		for(var j=0; j<Math.floor((lines.length-headerLinesNum)/colSize); j++){
			if(j>=headerLinesNum){
				theSlice=lines.slice(j*colSize,(j+1)*(colSize));
				theNewLine=theSlice.join(separator);
				lineElements=theNewLine.split(separator);
				timeStr='';
				for(var i=0; i<linesWithTime.length; i++){
					timeStr=timeStr+' '+lineElements[linesWithTime[i]];
				}
				var idx=0;
				for(var i=0; i<lineElements.length; i++){
					if(linesWithTime.indexOf(i)<0){
						idx=idx+1;
						var elName='Header Option '+idx;
						if(!(elName in headerOptions)){
							headerOptions[elName]={};
						}
						if(!(lineElements[i] in headerOptions[elName])){
							headerOptions[elName][lineElements[i]]=[];
						}
						var toAppend={'time':timeStr};
						var idx2=0;
						for(var k=0; k<lineElements.length; k++){
							if(k!=i && linesWithTime.indexOf(k)<0){
								idx2=idx2+1;
								var valOptionEl='Option '+idx2;
								toAppend[valOptionEl]=lineElements[k];
								if(!(valOptionEl in valPos)){
									valPos[valOptionEl]=k;
								}
							}
						}
						if(!(elName in headerPos)){
							headerPos[elName]=i;
						}
						headerOptions[elName][lineElements[i]].push(toAppend);
					}
				}
				//console.log("line");
			}
		}
		result['valPos']=valPos;
		result['headPos']=headerPos;
		result['data']=headerOptions;
	}
	

	return result;
}
