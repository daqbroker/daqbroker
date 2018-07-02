function checkPage(){
	var step=0;
	var foundStuff=JSON.parse(sessionStorage.getItem('daqbroker'));
	getLimits();
	if(!foundStuff){
		step=0
	}
	else if(!('data' in foundStuff)){
		step=0
	}
	else{
		if('data' in foundStuff){
			if('type' in foundStuff["data"]){
				step=1;
			}
			if('downloadType' in foundStuff["data"] || 'visionType' in foundStuff){
				step=2;
			};
			if('ready' in foundStuff["data"]){
				if('plotting' in foundStuff["data"]){
					step=4;
				}
				else{
					step=3;
				}
			}
		}
	}
	globalObject=foundStuff["data"];
	if(step==4){
		startSlider(foundStuff["data"]);
	}
	else{
		step=1;
		setupPage(step,foundStuff["data"]);
	}
}

function buildURL(objct){
	var miniObjct=Object.assign({},objct);
	var foundStuff=JSON.parse(sessionStorage.getItem('daqbroker'));
	delete miniObjct['binChannelData'];
	delete miniObjct['channelData'];
	delete miniObjct['dataChannelData'];
	delete miniObjct['plotObjects'];
	delete miniObjct['returns'];
	foundStuff["data"]=miniObjct;
	foundStuff["dbname"]=dbname;
	sessionStorage.setItem('daqbroker',JSON.stringify(foundStuff));
	var getVar='';
	return getVar;
}

function setupPage(step,stuff){
	$(".content").empty();
	$(".mainEnclosure").empty();
	$(".toolTitle").empty();
	$($(".backBegining").parent()).remove();
	$(".finish").remove();
	$(".container3").remove();
	setTimeout(function(){
		if((typeof stuff)=== 'undefined'){
			stuff={};
		}
		if(step==1){
			$(".lightboxable").empty();
			$('.containerContent').find('.menu').empty();
			$('.containerContent').find('.menu2').empty();
			$('.containerContent').find('.menu').css({
				'display'               :  'grid',
				'grid-template-columns' :  'repeat(3, minmax(50px,500px))',
				'grid-auto-rows'        :  'minmax(50px,100%)',
				'grid-gap'              :  '10px',
				'width'                 :  '100%'
			});
			$('.containerContent').find('.menu').append('<div class="option one" value="0" style="grid-row:1;grid-column:1;margin:auto;text-align:center"><img src="/static/iconsFlaticon/svg/visualizations.svg"></img><div>Visualizations</div></div><div value="1" class="option two" style="grid-row:1;grid-column: 2;margin:auto;text-align:center"><img src="/static/file.png"><div>Download/Upload</div></img></div><div value="2" class="option three" style="grid-row:1;grid-column:3;margin:auto;text-align:center"><img src="/static/iconsFlaticon/svg/002-molecular.svg"></img><div>Collections</div></div>');
			$('.containerContent').find('.menu').find('.option').click(function(){
				$('.containerContent').find('.menu').find('.option').removeClass('selected');
				$(this).toggleClass('selected');
				stuff['type']=$(this).attr('value');
				globalObject=stuff;
				setupPage(2,stuff);
			});
			if(stuff["type"]=='0'){
				var toClick='one';
			}
			else if(stuff["type"]=='1'){
				var toClick='two';
			}
			else if(stuff["type"]=='2'){
				var toClick='three';
			}
			$('.menu').find('.option.'+toClick).trigger('click');
		}
		else if(step==2){
			if(stuff['type']=='0'){
				$('.containerContent').find('.menu').empty();
				$('.containerContent').find('.menu').css({
					'display'               :  'grid',
					'grid-template-columns' :  'repeat(3, minmax(50px,500px))',//'minmax(100px,33%) minmax(100px,33%) minmax(100px,33%)',
					'grid-auto-rows'        :  'minmax(50px,100%)',
					'grid-gap'              :  '10px',
					'width'                 :  '100%',
					'padding-bottom'        :  '10px'
				});
				$('.containerContent').find('.menu2').empty();
				$('.containerContent').find('.menu2').css({
					'display'               :  'grid',
					'grid-template-columns' :  'repeat(2, minmax(50px,333px))',//'minmax(100px,33%) minmax(100px,33%) minmax(100px,33%)',
					'grid-auto-rows'        :  'minmax(50px,66.66%)',
					'grid-gap'              :  '10px',
					'width'                 :  '66.66%'
				});
				$('.containerContent').find('.menu').append('<div class="option one" value="-1" style="grid-row:1;grid-column:1;margin:auto;text-align:center"><img src="/static/back.png"></img><div>Back</div></div><div value="0" class="option two" style="grid-row:1;grid-column: 2;margin:auto;text-align:center"><img src="/static/iconsFlaticon/svg/plotSingle.svg"><div>Single</div></img></div><div value="1" class="option three" style="grid-row:1;grid-column:3;margin:auto;text-align:center"><img src="/static/iconsFlaticon/svg/plotLayout.svg"></img><div>Layouts</div></div>');
				$('.containerContent').find('.menu').find('.option').click(function(){
					var theClass=$(this).prop('class');
					$('.containerContent').find('.menu').find('.option').removeClass('selected');
					$(this).toggleClass('selected');
					if($(this).attr('value')!='-1'){
						stuff['visionType']=$(this).attr('value');
					}
					globalObject=stuff;
					if($(this).attr('value')=='-1'){
						delete stuff.type;
						delete stuff.downloadType;
						delete stuff.downloadTypeRaw;
						delete stuff.visionType;
						delete stuff.visionTypeNew;
						setupPage(1,stuff);
					}
					else{
						$('.containerContent').find('.menu2').empty();
						$('.containerContent').find('.menu2').append('<div class="'+theClass+'" value="0" style="grid-row:1;grid-column:1;margin:auto;text-align:center"><img src="/static/iconsFlaticon/svg/006-add-button.svg"></img><div>New</div></div><div class="'+theClass+'" value="1" style="grid-row:1;grid-column:2;margin:auto;text-align:center"><img src="/static/iconsFlaticon/svg/005-play-button.svg"></img><div>Existing</div></div>');
						$('.containerContent').find('.menu2').find('.option').click(function(){
							$(this).toggleClass('selected');
							stuff['visionTypeNew']=$(this).attr('value');
							globalObject=stuff;
							setupPage(3,stuff);
						});
					}
					if('visionTypeNew' in stuff){
						$('.menu2').find('[value='+stuff["visionTypeNew"]+']').trigger('click');
					}
					buildURL(stuff);
				});
				if(stuff["visionType"]=='0'){
					var toClick='two';
				}
				else if(stuff["visionType"]=='1'){
					var toClick='three';
				}
				else if(stuff["visionType"]=='2'){
					var toClick='four';
				}
				$('.menu').find('.option.'+toClick).trigger('click');
				buildURL(stuff);
			}
			if(stuff['type']=='1'){
				$('.containerContent').find('.menu').empty();
				$('.containerContent').find('.menu').css({
					'display'               :  'grid',
					'grid-template-columns' :  'repeat(3, minmax(50px,500px))',//'minmax(100px,33%) minmax(100px,33%) minmax(100px,33%)',
					'grid-auto-rows'        :  'minmax(50px,100%)',
					'grid-gap'              :  '10px',
					'width'                 :  '100%',
					'padding-bottom'        :  '10px'
				});
				$('.containerContent').find('.menu2').empty();
				$('.containerContent').find('.menu2').css({
					'display'               :  '',
					'grid-template-columns' :  '',//'minmax(100px,33%) minmax(100px,33%) minmax(100px,33%)',
					'grid-auto-rows'        :  '',
					'grid-gap'              :  '',
					'width'                 :  ''
				});
				$('.containerContent').find('.menu').append('<div class="option one" value="-1" style="grid-row:1;grid-column:1;margin:auto;text-align:center"><img src="/static/back.png"></img><div>Back</div></div><div value="0" class="option two" style="grid-row:1;grid-column: 2;margin:auto;text-align:center"><img src="/static/iconsFlaticon/svg/001-file.svg"><div>Raw files</div></img></div><div value="1" class="option three" style="grid-row:1;grid-column:3;margin:auto;text-align:center"><img src="/static/iconsFlaticon/svg/chip.svg"></img><div>Channels</div></div>');
				$('.containerContent').find('.menu').find('.option').click(function(){
					var theClass=$(this).prop('class');
					$('.containerContent').find('.menu').find('.option').removeClass('selected');
					$(this).toggleClass('selected');
					if($(this).attr('value')!='-1'){
						stuff['downloadType']=$(this).attr('value');
					}
					globalObject=stuff;
					if($(this).attr('value')=='-1'){
						delete stuff.type;
						delete stuff.downloadType;
						delete stuff.downloadTypeRaw;
						delete stuff.visionType;
						delete stuff.visionTypeNew;
						setupPage(1,stuff);
					}
					else{
						$(this).toggleClass('selected');
						stuff['downloadType']=$(this).attr('value');
						stuff['downloadTypeRaw']=$(this).attr('value');
						globalObject=stuff;
						buildURL(stuff);
						setupPage(3,stuff);
					}
				});
				if(stuff["downloadType"]=='0'){
					var toClick='two';
				}
				else if(stuff["downloadType"]=='1'){
					var toClick='three';
				}
				else if(stuff["downloadType"]=='2'){
					var toClick='four';
				}
				$('.menu').find('.option.'+toClick).trigger('click');
				buildURL(stuff);
			}
			if(stuff['type']=='2'){
				var path=window.location.pathname;
				var host=window.location.host;
				buildURL(stuff);
				setupPage(3,stuff);
			}
		}
		else if(step==3){
			globalObject=stuff;
			stuff['ready']=1;
			setupOngoing=false;
			buildURL(stuff);
			buildPage(globalObject);
			return
		}
		buildURL(stuff);
	},100);
}

function buildFileSystem(objct,div,currPath,isFirst,actualFolder){
	var folders=[];
	var paths=[]
	var divName=currPath;
	var actualFolders=[];
	if(div.find('.'+divName).length<1){
		div.append('<div class="'+divName+'"></div>');
	}
	for(var key in objct){
		if(!('lchange'in objct[key] && 'size' in objct[key])){
			folders.push(objct[key]);
			paths.push(currPath+'-'+key);
			if(isFirst){
				actualFolders.push(key);
				div.find('.'+divName).append('<div style="padding-left: 4em;" class="'+currPath+'-'+key+'"></div>');
			}
			else{
				actualFolders.push(actualFolder+'/'+key);
				div.find('.'+divName).append('<div style="text-align:left;padding-left: 4.5em;padding-bottom:1em" class="'+currPath+'-'+key+'"><input type="checkbox" style="padding-right:1em;font-size:15px" class="folderCheck"></input><label style="padding-left:0.5em" class="folder"><img class="open" src="/satic/folderOpen.png" width="25px" height="25px"></img>'+key+'</label></div>');
			}
		}
		else{
			filename='/daqbroker/downloads/'+$("#daqbroker_server").val()+'/'+dbname+'/'+actualFolder+'/'+key;
			div.find('.'+divName).append('<div style="text-align:left;padding-left: 4.5em;padding-bottom:1em" class="file"><input type="checkbox" style="padding-left:0.5em" class="fileCheck"></input><a style="" download href="'+filename+'" class="file"><img src=/static/file.png width="25px" height="25px"></img>'+key+'</a> (size : '+objct[key].size.number.toFixed(1)+' '+objct[key].size.type+'; last modified : '+moment.utc(objct[key].lchange*1000).format('D/M/YYYY H:m:s')+')</div>');
		}
	}
	for (var j=0; j<folders.length; j++){
		buildFileSystem(folders[j],div.find('.'+paths[j]),paths[j],false,actualFolders[j]);
	}
}

function channelSelect(values,instruments,theInstrument,chosenChannels,channelsRepo,theDir,thisPlotType,nextFunction,keysImport,toContinue){
	var foundChann=false;
	for (var i=0; i<values.length; i++){
		for (var j=0; j<theInstrument.files.length; j++){
			for (var k=0; k<theInstrument.files[j].channels.length; k++){
				if(Number(theInstrument.files[j].channels[k].channelid)==Number(values[i])){
					var channelName=theInstrument.files[j].channels[k].Name;
					foundChann=true;
					chosenChannels.push({'name':theInstrument.Name+' : '+channelName,'channelid':values[i],'instid':theInstrument.instid});
					break;
				}
			}
		}
	}
	var instIdx=instruments.indexOf(theInstrument);
	globalObject[channelsRepo]=chosenChannels;
	if(chosenChannels.length>=1){
		theDir.empty();
		if(thisPlotType==-1){
			theDir.append('<h3>Confirm</h3><hr><div class="plotTypeConfirm">Plot type:<span class="plotTypeText emphasise"></span></div><p>Channels:</p><div style="height:200px;overflow:scroll;margin:auto;text-align:center;width:10%; min-width: 200px;" class="channelsText"></div><div><button class="startPlot button pill" style="font-size:20px" value="GO">Download</button></div>');
			theDir.find('.plotTypeText').append('Timeseries');
			for (var j=0; j<chosenChannels.length; j++){
				theDir.find('.channelsText').append('<p class="emphasise">'+chosenChannels[j].name+'</p>')
			}
		}
		if(thisPlotType==0){
			theDir.append('<h3>Confirm</h3><hr><div class="plotTypeConfirm">Plot type:<span class="plotTypeText emphasise"></span></div><p>Channels:</p><div style="height:200px;overflow:scroll;margin:auto;text-align:center;width:10%; min-width: 200px;" class="channelsText"></div><div><button class="startPlot button pill" style="font-size:20px" value="GO">PLOT</button></div>');
			theDir.find('.plotTypeText').append('Timeseries');
			for (var j=0; j<chosenChannels.length; j++){
				theDir.find('.channelsText').append('<p class="emphasise">'+chosenChannels[j].name+'</p>')
			}
		}
		if(thisPlotType==1){
			theDir.append('<h3>Review</h3><hr><div class="plotTypeConfirm">Plot type: <span class="plotTypeText emphasise"></span></div><div style="height:200px;overflow:scroll;margin:auto;text-align:center;width:10%; min-width: 200px;" class="binChannelsText"><p>Bin Channels:</p></div><div class="channelsText"><p>Channels:</p></div><button class="startPlot button pill" style="font-size:20px" value="GO">Next Step</button>');
			theDir.find('.plotTypeText').append('Surface');
			for (var j=0; j<chosenChannels.length; j++){
				theDir.find('.binChannelsText').append('<p class="emphasise">'+chosenChannels[j].name+'</p>')
			}
			if(toContinue){
				stupidName = 'dataChannels';
			}
			else{
				theDir.find('.startPlot').html('Plot')
			}
		}
		if(thisPlotType==2){
			theDir.append('<h3>Review</h3><hr><div class="plotTypeConfirm">Plot type: <span class="plotTypeText emphasise"></span></div><div style="height:200px;overflow:scroll;margin:auto;text-align:center;width:10%; min-width: 200px;" class="binChannelsText"><p>Category Channels:</p></div><div class="channelsText"><p>Channels:</p></div><button class="startPlot button pill" style="font-size:20px" value="GO">Next Step</button>');
			theDir.find('.plotTypeText').append('Bar');
			for (var j=0; j<chosenChannels.length; j++){
				theDir.find('.binChannelsText').append('<p class="emphasise">'+chosenChannels[j].name+'</p>')
			}
			if(toContinue){
				stupidName = 'dataChannels';//GOTTA FIX THIS ONE FOR A BAR CHART
			}
			
			else{
				theDir.find('.startPlot').html('Plot')
			}
		}
		theDir.find('.startPlot').click(function(){
			if(toContinue){
				setupChannelSelector(1,$('.content'),instruments,stupidName,nextFunction,thisPlotType,false);
			}
			else{
				nextFunction(thisPlotType,chosenChannels);
			}
		});
		if('plotting' in globalObject){
			theDir.find('.startPlot').trigger('click');
		}
		theDir.find('.emphasise').css({'font-weight':'bold'});
		globalObject['plotType']=thisPlotType;
		globalObject[channelsRepo]=chosenChannels;
		delete globalObject['plotting'];
		buildURL(globalObject); 
	}
	else{
		globalObject['plotType']=thisPlotType;
		delete globalObject[channelsRepo];
		buildURL(globalObject);
	}
}

function channelDeselect(values,chosenChannels,channelsRepo,theDir,thisPlotType,nextFunction,keysImport,toContinue,instruments){
	for (var i=0; i<values.length; i++){
		for (var j=0; j<chosenChannels.length; j++){
			if(Number(values[i])==Number(chosenChannels[j].channelid)){
				chosenChannels.splice(j, 1);
			}
		}
	}
	globalObject[channelsRepo]=chosenChannels;
	if(chosenChannels.length<1){
		//$('.finish').empty();
		theDir.empty();
		theDir.append('<h3>Confirm</h3><hr><img class="loadFinish" src="/static/loading.gif" height="75" width="75"></img>');
		delete globalObject[channelsRepo];
		buildURL(globalObject);
	}
	else{
		globalObject['plotType']=thisPlotType;
		globalObject[channelsRepo]=chosenChannels;
		delete globalObject['plotting'];
		buildURL(globalObject);
		theDir.empty();
		if(thisPlotType==-1){
			theDir.append('<h3>Confirm</h3><hr><div class="plotTypeConfirm">Plot type:<span class="plotTypeText emphasise"></span></div><p>Channels:</p><div style="height:200px;overflow:scroll;margin:auto;text-align:center;width:10%; min-width: 200px;" class="channelsText"></div><div><button class="startPlot button pill" style="font-size:20px" value="GO">PLOT</button></div>');
			theDir.find('.plotTypeText').append('Timeseries');
			for (var j=0; j<chosenChannels.length; j++){
				theDir.find('.channelsText').append('<p class="emphasise">'+chosenChannels[j].name+'</p>')
			}
		}
		if(thisPlotType==0){
			theDir.append('<h3>Confirm</h3><hr><div class="plotTypeConfirm">Plot type:<span class="plotTypeText emphasise"></span></div><p>Channels:</p><div style="height:200px;overflow:scroll;margin:auto;text-align:center;width:10%; min-width: 200px;" class="channelsText"></div></div><div><button class="startPlot button pill" style="font-size:20px" value="GO">PLOT</button></div>');
			theDir.find('.plotTypeText').append('Timeseries');
			for (var j=0; j<chosenChannels.length; j++){
				theDir.find('.channelsText').append('<p class="emphasise">'+chosenChannels[j].name+'</p>')
			}
		}
		if(thisPlotType==1){
			theDir.append('<h3>Review</h3><hr><div class="plotTypeConfirm">Plot type: <span class="plotTypeText emphasise"></span></div><div style="height:200px;overflow:scroll;margin:auto;text-align:center;width:10%; min-width: 200px;" class="binChannelsText"><p>Bin Channels:</p></div><div class="channelsText"><p>Channels:</p></div><button class="startPlot button pill" style="font-size:20px" value="GO">Next Step</button>');
			theDir.find('.plotTypeText').append('Surface');
			for (var j=0; j<chosenChannels.length; j++){
				theDir.find('.binChannelsText').append('<p class="emphasise">'+chosenChannels[j].name+'</p>')
			}
			if(toContinue){
				stupidName = 'dataChannels';
			}
			
			else{
				theDir.find('.startPlot').html('Plot')
			}
		}
		if(thisPlotType==2){
			theDir.append('<h3>Review</h3><hr><div class="plotTypeConfirm">Plot type: <span class="plotTypeText emphasise"></span></div><div style="height:200px;overflow:scroll;margin:auto;text-align:center;width:10%; min-width: 200px;" class="binChannelsText"><p>Category Channels:</p></div><div class="channelsText"><p>Channels:</p></div><button class="startPlot button pill" style="font-size:20px" value="GO">Next Step</button>');
			theDir.find('.plotTypeText').append('Bar');
			for (var j=0; j<chosenChannels.length; j++){
				theDir.find('.binChannelsText').append('<p class="emphasise">'+chosenChannels[j].name+'</p>')
			}
			if(toContinue){
				stupidName = 'dataChannels';//GOTTA FIX THIS ONE FOR A BAR CHART
			}
			
			else{
				theDir.find('.startPlot').html('Plot')
			}
		}
		theDir.find('.startPlot').click(function(){
			console.log()
			if(toContinue){
				setupChannelSelector(1,$('.content'),instrumentsList,stupidName,nextFunction,thisPlotType,false);
			}
			else{
				nextFunction(thisPlotType,chosenChannels);
			}
		});
		theDir.find('.emphasise').css({'font-weight':'bold'});
	}
}

function theNext1(thisPlotType,chosenChannels){
	$($(".backBegining").parent()).remove()
	globalObject['plotType']=thisPlotType;
	globalObject['channels']=chosenChannels;
	globalObject['plotting']=1;
	buildURL(globalObject);
	startSlider(globalObject);
}

function theNext2(thisPlotType,chosenChannels){
	globalObject['plotType']=thisPlotType;
	globalObject['binChannels']=chosenChannels;
	surfaceChannelsSetup(globalObject);
}

function theNext3(thisPlotType,chosenChannels){
	globalObject['plotType']=thisPlotType;
	globalObject['binChannels']=chosenChannels;
	barChannelsSetup(globalObject);
}

function theNext4(thisPlotType,chosenChannels){
	globalObject['channels']=chosenChannels;
	buildURL(globalObject);
	startDownload(globalObject);
}

function instrumentChange(instruments,theInstrument,chosenChannels,keysImport,thisPlotType,channelDiv,channelsEndPoint,theNextFunction,currentRoutine,toContinue){
	console.log(toContinue);
	channelDiv.empty();
	channelDiv.append('<h3>Data Channels</h3><hr><img class="loadingChannels" src="/static/loading.gif" height="75" width="75"></img><div class="instChannels"></div>');
	$.ajax({
		url: '/instruments/queryInstDetails',
		type: 'POST',
		dataType: "json",
		data: {'database':dbname,'instid':theInstrument.instid},
		success: function(returned){
			theInstrument=returned;
			channelDiv.find(".loadingChannels").remove();
			channelDiv.find('.instChannels').empty();
			$(".content").find('.instrumentDetailsDiv').empty();
			if(theInstrument.active==1){
				var currentStatusText='<span style="text-style:italic;color:green">Active</span>';
			}
			else{
				var currentStatusText='<span style="text-style:italic;color:red">Inactive</span>';
			}
			//<optgroup class="currInst" label="'+theInstrument.Name+'"></optgroup>
			$(channelDiv.parent()).find('.instrumentDetailsDiv').append('<p>Description: <span style="font-style:italic">'+theInstrument.description+'</span></p><p>Contact: <span style="font-style:italic">'+theInstrument.email+'</span></p><p>Current status: '+currentStatusText+'</p>');
			channelDiv.find('.instChannels').append('<div></div> <div><select multiple="multiple" class="channelSelector" style="width:50%"><optgroup class="prevSelect" label="Previously Selected"></optgroup></select></div>');
			var options=[];
			if('files' in theInstrument){
				for (var i=0; i<theInstrument.files.length; i++){
					var idx=0;
					if(i==currentRoutine){
						$('.channelSelector').append('<optgroup class="routine '+theInstrument.files[i].name+'" label="'+theInstrument.Name+'/'+theInstrument.files[i].name+'"><option class="empty" disabled>NO CHANNELS</option></optgroup>');
						if('channels' in theInstrument.files[i]){
							$('.channelSelector').find('.'+theInstrument.files[i].name).find('.empty').remove();
							var bigString='';
							for (var j=0; j<theInstrument.files[i].channels.length; j++){
								var channel=theInstrument.files[i].channels[j];
								if(Number(channel.channeltype)==1){
									bigString=bigString+'<option style="color:blue" title="Type : Number &#013;Description : '+channel.description+'" value="'+Number(channel.channelid)+'">'+channel.Name+'</option>';
									idx=idx+1;
								}
								if(Number(channel.channeltype)==2){
									bigString=bigString+'<option style="color:green" title="Type : Text &#013;Description : '+channel.description+'" value="'+Number(channel.channelid)+'">'+channel.Name+'</option>';
									idx=idx+1;
								}
								if(Number(channel.channeltype)==3){
									bigString=bigString+'<option style="color:#8A2BE2" title="Type : Composite &#013;Description : '+channel.description+'" value="'+Number(channel.channelid)+'">'+channel.Name+'</option>';
									idx=idx+1;
								}
							}
							channelDiv.find('.channelSelector').find('.'+theInstrument.files[i].name).append(bigString);
						}
					}
				}
			}
			if((typeof globalObject[channelsEndPoint])==='undefined'){
				globalObject[channelsEndPoint]=[];
			}
			channelDiv.find('.channelSelector').multiSelect({
				selectableHeader : '<div style="margin: auto;text-align: center;">Data Channels</div></div><input class="channelFilter" placeholder="type to search"></input></div>',
				selectableFooter : '<div style="margin: auto;text-align: center;">Select routine : <select class="routineSelector"></select><p><button class="button pill icon arrowright">Select All</button></p></div>',
				selectionHeader  : '<div style="margin: auto;text-align: center;">Chosen Channels</div>',
				selectionFooter  : '<div style="margin: auto;text-align: center;"><button class="button pill icon arrowleft danger">Unselect All</button></div>',
				cssClass         : 'channelSelectorSpecial',
				'thisElement'    : channelDiv.find('.channelSelector'),
				'thisGenerator'  : $(this),
				afterInit: function(ms){
					var theFirstElement=this.options.thisElement;
					var theGenerator=this.options.thisGenerator;
					var theObject=this;
					var that = this,
						$selectableSearch = that.$selectableUl.prev(),
						$selectionSearch = that.$selectionUl.prev(),
						selectableSearchString = '#'+that.$container.attr('id')+' .ms-elem-selectable:not(.ms-selected)',
						selectionSearchString = '#'+that.$container.attr('id')+' .ms-elem-selection.ms-selected';
					if('files' in theInstrument){
						for (var i=0; i<theInstrument.files.length; i++){
							ms.find('.routineSelector').append('<option value="'+i+'">'+theInstrument.files[i].name+'</option>');
						}
						ms.find('.routineSelector').val(currentRoutine);
					}
					ms.find('.arrowleft').click(function(){
						globalObject[channelsEndPoint]=[];
						chosenChannels=[];
						theFirstElement.multiSelect('deselect_all');
						//theObject.options.afterDeselect([]);
					});
					ms.find('.arrowright').click(function(){
						$('.channelSelector').multiSelect('select_all');
					});
					ms.find('.routineSelector').change(function(){
						instrumentChange(instruments,theInstrument,chosenChannels,keysImport,thisPlotType,channelDiv,channelsEndPoint,theNextFunction,Number($(this).val()));
					});
					this.qs1 = $selectableSearch.quicksearch(selectableSearchString);
				},
				afterSelect: function(values){
					this.qs1.cache();
					channelSelect(values,instruments,theInstrument,chosenChannels,channelsEndPoint,$('.finish'),thisPlotType,theNextFunction,keysImport,toContinue);
				},
				afterDeselect: function(values){
					//this.qs1.cache();
					channelDeselect(values,chosenChannels,channelsEndPoint,$('.finish'),thisPlotType,theNextFunction,keysImport,toContinue,instruments);
				}
			});
			channelDiv.find('.channelSelector').find("channelSelectorSpecial").css('width','500px');
			if(channelsEndPoint in globalObject){
				if(chosenChannels.length<1){
					for (var i=0; i<instruments.length; i++){
						if('files' in instruments[i]){
							for (var j=0; j<instruments[i].files.length; j++){
								if('channels' in instruments[i].files[j]){
									for (var k=0; k<instruments[i].files[j].channels.length; k++){
										for (var l=0; l<globalObject[channelsEndPoint].length; l++){
											if(typeof globalObject[channelsEndPoint][l]==='object'){
												if(Number(globalObject[channelsEndPoint][l].channelid)==Number(instruments[i].files[j].channels[k].channelid)){
													//$('.channelSelector').find('.prevSelect').append('<option selected value="'+Number(globalObject['channels'][l])+'">'+instruments[i].name+':'+instruments[i].files[j].parsingInfo.channels[k].name+'</option>');
													chosenChannels.push({'name':instruments[i].Name+' : '+instruments[i].files[j].channels[k].Name,'channelid':Number(globalObject[channelsEndPoint][l].channelid),'instid':instruments[i].instid});
													break;
												}
											}
											else{
												if(Number(globalObject[channelsEndPoint][l])==Number(instruments[i].files[j].channels[k].channelid)){
													//$('.channelSelector').find('.prevSelect').append('<option selected value="'+Number(globalObject['channels'][l])+'">'+instruments[i].name+':'+instruments[i].files[j].parsingInfo.channels[k].name+'</option>');
													chosenChannels.push({'name':instruments[i].Name+' : '+instruments[i].files[j].channels[k].Name,'channelid':Number(globalObject[channelsEndPoint][l]),'instid':instruments[i].instid});
													break;
												}
											}
										}
									}
								}
							}
						}
					}
				}
				if(chosenChannels.length>=1){
					$('.finish').empty();
					if(thisPlotType==-1){
						$('.finish').append('<h3>Confirm</h3><hr><div class="plotTypeConfirm">Plot type:<span class="plotTypeText emphasise"></span></div><p>Channels:</p><div style="height:200px;overflow:scroll;margin:auto;text-align:center;width:10%; min-width: 200px;" class="channelsText"></div><div><button class="startPlot button pill" style="font-size:20px" value="GO">Download</button></div>');
						$('.finish').find('.plotTypeText').append('Timeseries');
						for (var j=0; j<chosenChannels.length; j++){
							$('.finish').find('.channelsText').append('<p class="emphasise">'+chosenChannels[j].name+'</p>')
						}
					}
					if(thisPlotType==0){
						$('.finish').append('<h3>Confirm</h3><hr><div class="plotTypeConfirm">Plot type:<span class="plotTypeText emphasise"></span></div><p>Channels:</p><div style="height:200px;overflow:scroll;margin:auto;text-align:center;width:10%; min-width: 200px;" class="channelsText"></div><div><button class="startPlot button pill" style="font-size:20px" value="GO">PLOT</button></div>');
						$('.finish').find('.plotTypeText').append('Timeseries');
						for (var j=0; j<chosenChannels.length; j++){
							$('.finish').find('.channelsText').append('<p class="emphasise">'+chosenChannels[j].name+'</p>')
						}
					}
					if(thisPlotType==1){
						$('.finish').append('<h3>Review</h3><hr><div class="plotTypeConfirm">Plot type: <span class="plotTypeText emphasise"></span></div><div style="height:200px;overflow:scroll;margin:auto;text-align:center;width:10%; min-width: 200px;" class="binChannelsText"><p>Bin Channels:</p></div><div class="channelsText"><p>Channels:</p></div><button class="startPlot button pill" style="font-size:20px" value="GO">Next Step</button>');
						$('.finish').find('.plotTypeText').append('Surface');
						for (var j=0; j<chosenChannels.length; j++){
							$('.finish').find('.binChannelsText').append('<p class="emphasise">'+chosenChannels[j].name+'</p>')
						}
					}
					if(thisPlotType==2){
						$('.finish').append('<h3>Review</h3><hr><div class="plotTypeConfirm">Plot type: <span class="plotTypeText emphasise"></span></div><div style="height:200px;overflow:scroll;margin:auto;text-align:center;width:10%; min-width: 200px;" class="binChannelsText"><p>Category Channels:</p></div><div class="channelsText"><p>Channels:</p></div><button class="startPlot button pill" style="font-size:20px" value="GO">Next Step</button>');
						$('.finish').find('.plotTypeText').append('Bar');
						for (var j=0; j<chosenChannels.length; j++){
							$('.finish').find('.binChannelsText').append('<p class="emphasise">'+chosenChannels[j].name+'</p>')
						}
					}
					$('.finish').find('.startPlot').click(function(){
						theNextFunction(thisPlotType,chosenChannels);
					});
					if('plotting' in globalObject){
						$('.finish').find('.startPlot').trigger('click');
					}
					globalObject['plotType']=thisPlotType;
					globalObject[channelsEndPoint]=chosenChannels;
					buildURL(globalObject);
					$('.finish').find('.emphasise').css({'font-weight':'bold'});
				}
			}
			for (var i=0; i<chosenChannels.length; i++){
				var foundChannel=false
				if('files' in theInstrument){
					for (var k=0; k<theInstrument.files.length; k++){
						for (var j=0; j<channelDiv.find(".channelSelector").find('.'+theInstrument.files[k].name).find('option').length; j++){
							if(Number($(channelDiv.find(".channelSelector").find('.'+theInstrument.files[k].name).find('option')[j]).val())==Number(chosenChannels[i].channelid)){
								$(channelDiv.find(".channelSelector").find('option')[j]).remove();
								channelDiv.find('.channelSelector').find('.'+theInstrument.files[k].name).append('<option selected value="'+chosenChannels[i].channelid+'">'+chosenChannels[i].name+'</option>');
								foundChannel=true;
								break
							}
						}
					}
				}
				if(!foundChannel){
					channelDiv.find('.channelSelector').find('.prevSelect').append('<option selected value="'+chosenChannels[i].channelid+'">'+chosenChannels[i].name+'</option>');
				}
			}
			channelDiv.find('.channelSelector').multiSelect('refresh');
			$('.ms-container').css({
				'margin':'auto',
				'text-algin':'center'
			});
		}
	});
}

function setupChannelSelector(type,instrumentsDiv,instrumentsList,channelsEndpoint,finalCallback,thisPlotType,toContinue){
	var chosenChannels=[];
	var chosenTime=[]
	instrumentsDiv.empty();
	instrumentsDiv.css({
		 'display'               :  'grid',
		'grid-template-columns' :  'repeat(auto-fit,minmax(20%,30%)',
		'grid-gap'              :  '10px',
		//'grid-auto-column'      :  '25%',
		'width'                 :  '100%'
	});
	instrumentsDiv.append(
		`<div class="downloadInstrument" style="width:50%;margin:auto">
			<h3>Instruments</h3>
			<hr style="width:25%">
			<select class="instrumentSelect"><option selected disabled>--- CHOOSE ONE ---</option><optgroup class="instruments" label="Instruments"></optgroup><optgroup class="collections" label="Collections"></optgroup></select>
		</div>
		<div style="width:50%;margin:auto" class="channelsContainer">
			<div class="instrumentChannels">
				<h3>Channels</h3>
				<hr style="width:25%">
				<img class="loadingChannels" src="/static/loading.gif" height="75" width="75"></img>
				<div class="instChannels"></div>
			</div>
		</div>`
	);
	if(!toContinue){
		instrumentsDiv.find('.downloadInstrument').append('<p><button class="button back pill huge danger">Prev. Step</button></p>');
		instrumentsDiv.find('.downloadInstrument').find('.back').click(function(){
			delete globalObject["dataChannels"]
			delete globalObject["ready"]
			delete globalObject["start"]
			$('.plotSelector').trigger('change');
			//ALSO PUT HERE THE DELETE FOR THE BAR CHART VARIABLE
		});
	}
	if(type==0){
		instrumentsDiv.append('<div class="timeSelect"><h3>Time Period</h3><hr style="width:25%"><img class="loadTime" src="/static/loading.gif" height="75" width="75"></img></div><div class="finish"><h3>Confirm</h3><hr style="width:25%"><img class="loadFinish" src="/static/loading.gif" height="75" width="75"></img></div>');
		instrumentsDiv.find('.timeSelect').empty();
		instrumentsDiv.find('.timeSelect').append('<h3>Time Period</h3><hr style="width:25%">Time Source : <select class="timeSelector"><option value="0">Manual</option><option value="1">Runs</option></select><div class="optionResultTime"></div>');
		instrumentsDiv.find('.timeSelector').change(function(){
			instrumentsDiv.find('.optionResultTime').empty();
			if($(this).val()=="0"){//Manual Time
				var startDate=moment.utc(globalTimeLims[0]).format('D/M/YYYY H:m:s');
				var endDate=moment.utc(globalTimeLims[1]).format('D/M/YYYY H:m:s');
				instrumentsDiv.find('.optionResultTime').append('<p class="startTimePar">Start Time: <input class="startTimeInput timeInput" value="'+startDate+'"></input></p><p class="endTimePar">End Time: <input class="endTimeInput timeInput" value="'+endDate+'"></input></p>');
				instrumentsDiv.find('.optionResultTime').find('.startTimeInput').datetimepicker({
					closedBySelect:false,
					timeFormat  : 'H:m:s',
					dateFormat  : 'd/m/yy',
					onSelect    : function (date, options) {
						var newDateMoment=moment.utc(date,'D/M/YYYY H:m:s');
						chosenTime[0]=newDateMoment.valueOf();
						globalObject["startTime"]=chosenTime[0];
						if(chosenChannels.length>=1){
							globalObject['channels']=chosenChannels;
							buildURL(globalObject);
						}
					}
				});
				instrumentsDiv.find('.optionResultTime').find('.endTimeInput').datetimepicker({
					closedBySelect:false,
					timeFormat  : 'H:m:s',
					dateFormat  : 'd/m/yy',
					onSelect    : function (date, options) {
						var newDateMoment=moment.utc(date,'D/M/YYYY H:m:s');
						chosenTime[1]=newDateMoment.valueOf();
						globalObject["endTime"]=chosenTime[1];
						if(chosenChannels.length>=1){
							globalObject['channels']=chosenChannels;
							buildURL(globalObject);
						}
					}
				});
				chosenTime=globalTimeLims;
			}
			else if($(this).val()=="1"){//Runs Time
				$.ajax({
					method: "POST",
					url:"/runs/getRunList",
					dataType: "json",
					data:{'dbname':dbname},
					success: function(result){
						instrumentsDiv.find('.optionResultTime').append('<p>Start Run : <select class="startTimeSelector runselector"></select></p>');
						instrumentsDiv.find('.optionResultTime').append('<p>End Run : <select class="endTimeSelector runselector"></select></p>');
						instrumentsDiv.find('.optionResultTime').find('.runselector').change(function(){
							var thisClass=$(this).attr('class');
							var thisIdx=Number($(this).val());
							//if(thisClass.includes('startTimeSelector')){
							if(thisClass.indexOf('startTimeSelector')>=0){
								chosenTime[0]=Number(result[thisIdx].start);
							}
							//else if(thisClass.includes('endTimeSelector')){
							else if(thisClass.indexOf('endTimeSelector')>=0){
								chosenTime[1]=Number(result[thisIdx].start);
							}
							if(chosenChannels.length>=1){
								globalObject['channels']=chosenChannels;
								buildURL(globalObject);
							}
						});
						for (var i=0; i<result.length; i++){
							instrumentsDiv.find('.optionResultTime').find('.runselector').append('<option value="'+i+'">'+result[i].run+'</option>');
						}
						instrumentsDiv.find('.optionResultTime').find('.startTimeSelector').val(0);
						instrumentsDiv.find('.optionResultTime').find('.endTimeSelector').val(result.runs.length-1);
						chosenTime=[Number(result[0].start),Number(result.runs[result.length-1].start)];
					},
					error: function(result){
						notyExpression=new Noty({
							text      :  "There was an error collecting runlist data | "+JSON.stringify(returned),
							theme     :  'relax',
							type      :  'error'
						}).show();
					}
				});
			}
			globalObject["startTime"]=chosenTime[0];
			globalObject["endTime"]=chosenTime[1];
		});
		instrumentsDiv.change(function(){
			if(chosenChannels.length>0 && chosenTime[0] && chosenTime[1]){
				$('.finish').empty();
				$('.finish').append('<h3>Confirm</h3><hr style="width:25%"><div class="timeText"><p>Start time: <span class="emphasise">'+moment.utc(chosenTime[0]).format('D/M/YYYY H:m:s')+'</p><p>End Time: <span class="emphasise">'+moment.utc(chosenTime[1]).format('D/M/YYYY H:m:s')+'</span></p></div></p></div><div class="channelsText"><p>Channels:</p></div><button class="startDownload button pill" style="font-size:40px" value="GO">DOWNLOAD</button>');
				$('.finish').find('.startDownload').click(function(){
					globalObject['channels']=chosenChannels;
					globalObject['startTime']=chosenTime[0];
					globalObject['endTime']=chosenTime[1];
					buildURL(globalObject);
					if(toContinue){
						if(thisPlotType == 1){
							setupChannelSelector(type,instrumentsDiv,instrumentsList,'dataChannels',finalCallback,thisPlotType,false);
						}
						else if(thisPlotType == 2){//
							setupChannelSelector(type,instrumentsDiv,instrumentsList,'dataChannels',finalCallback,thisPlotType,false);//Gotta change for bar charts
						}
					}
					else{
						finalCallback();
					}
				});
			}
		});
		instrumentsDiv.find('.timeSelector').trigger('change');
		for (var j=0; j<chosenChannels.length; j++){
			$('.finish').find('.channelsText').append('<p class="emphasise">'+chosenChannels[j].name+'</p>')
		}
	}
	else{
		instrumentsDiv.append('<div class="finish" style="display:table-cell"><h3>Confirm</h3><hr style="width:25%"><img class="loadFinish" src="/static/loading.gif" height="75" width="75"></img></div></div>');
		for (var j=0; j<chosenChannels.length; j++){
			$('.finish').find('.channelsText').append('<p class="emphasise">'+chosenChannels[j].name+'</p>')
		}
	}
	for (var i=0; i<instrumentsList.length; i++){
		instrumentsDiv.find('.instrumentSelect').find('.instruments').append('<option value="'+i+'">'+instrumentsList[i].Name+'</option>');
	}
	instrumentsDiv.find('.instrumentSelect').change(function(){
		var instIdx=Number($(this).val());
		var thisIdx=Number($(this).val());
		var thisInstrument=instrumentsList[thisIdx];
		if('channels' in globalObject){
			if(globalObject['channels'].length<1){
				chosenChannels=[];
			}
		}
		else{
			chosenChannels=[];
		}
		currentRoutine=0;
		instrumentChange(instrumentsList,thisInstrument,chosenChannels,[],thisPlotType,instrumentsDiv.find('.instrumentChannels'),channelsEndpoint,finalCallback,0,toContinue,instrumentsDiv);
	});
}

function buildPage(objct){
	$(".containerContent").css("padding-top","100px");
	$(".content").empty();
	$(".title").empty();
	$(".finish").remove();
	$(".menu").empty();
	$(".menu2").empty();
	$('.content').show();
	//Must make one function for each feature: Single plot | Layouts | Import | Export | (Calibration later)
	if($(".backBegining").length<1){
		$(".toolTitle").before('<p class="" style="margin:auto;text-align:center"><button style="font-size:15px" class="backBegining button pill danger">Back</button></p>');
		$('.backBegining').click(function(){
			delete objct["ready"]
			delete objct["visionTypeNew"]
			delete objct["downloadType"]
			delete objct["plottting"]
			delete objct["ready"]
			if(objct["type"]=="2"){
				delete objct["type"]
			}
			setupPage(1,objct);
		});
	}
	if(objct.type=="0"){//Visualizations
		if(objct.visionType=="0"){//Single plots
			console.log("REALLY?")
			objct.plotDiv='mainContainer';
			delete objct.plotObjects;
			delete objct.plots;
			if(objct.visionTypeNew=='0'){//New single plot
				//delete objct.plotOptions
				delete objct.plotid;
				//delete objct.channels;
				$(".toolTitle").empty();
				$(".toolTitle").append('<h2 class="title" style="margin:auto;text-align:center">Single plot tool</h2>');
				$(".content").css({'width' : '100%'});
				$($(".content").parent()).find('.plotType').remove();
				$(".content").before('<div style="margin:auto;text-align:center" class="plotType"><h3>Plot Type</h3><hr style="width:25%;margin:auto;"><select class="plotSelector"><option selected disabled>--- CHOOSE ONE ---</option><option value="0">Timeseries</option><option value="1">Surface plot</option><option value="2">Bar Plot</option><option value="3">External Plot</option></select></div>');
				$($(".content").parent()).find('.plotType').find('.plotSelector').change(function(){
					var thisPlotType=Number($(this).val());
					$.ajax({
						url: '/data/collections',
						type: 'POST',
						dataType: "json",
						async:false,
						data: {'dbname':dbname},
						success:function(returned){
							globalCollections=returned;
						},
						error:function(){
							globalCollections=[];
						}
					});
					$.ajax({
						url: '/instruments/queryInstruments',
						type: 'POST',
						dataType: "json",
						data: {'database':dbname},
						success: function(returned){
							$(".content").empty();
							var keysImport=Object.keys({});
							globalInstruments=returned;
							globalImport=[];
							var instruments=returned;
							var userInput=[];
							if(thisPlotType==0){//Timeseries Plot
								delete globalObject['dataChannels'];
								delete globalObject['binChannels'];
								delete globalObject['catChannels'];
								delete globalObject['surfaceType'];
								delete globalObject['barType'];
								var chosenChannels=[];
								$('.plotType').find('.surfaceTypeSelector').remove();
								setupChannelSelector(1,$(".content"),returned,'channels',theNext1,thisPlotType);
							}
							else if(thisPlotType==1){//Surface Plot
								var chosenChannels1=[];
								delete globalObject['channels'];
								delete globalObject['catChannels']
								delete globalObject['barType']
								$('.plotType').find('.surfaceTypeSelector').remove();
								/* $(".content").find('.channelSelectorDiv').empty();
								$(".content").find('.channelSelectorDiv').append('<h3>Step 1 : Instrument</h3><hr><img class="loadingChannels" src="static/loading.gif" height="75" width="75"></img><div class="instChannels"></div>');
								$(".content").find('.instrumentSelectorDiv').empty();
								$(".content").find('.instrumentSelectorDiv').append('<h3>Step 1 : Bin Channels</h3><hr><img class="loadingChannels" src="static/loading.gif" height="75" width="75"></img><div class="instChannels"></div>'); */
								$('.plotType').append('<p><select class="surfaceTypeSelector"><option selected disabled>--- SELECT ONE ---</option><option value="1">Time variable bins</option><option value="2">Fixed bins</option></select></p>');
								$('.plotType').find('.surfaceTypeSelector').change(function(){
									var binType=Number($(this).val());
									globalObject['surfaceType']=binType;
									$(".content").find('.instrumentSelectorDiv').empty();
									if(binType==1){//Surface plot with bins as channels
										delete globalObject['start']
										delete globalObject['end']
										delete globalObject['noBins']
										delete globalObject['spacing']
										delete globalObject['fixedType']
										$(".content").empty();
										setupChannelSelector(1,$(".content"),globalInstruments,'binChannels',theNext1,thisPlotType,true);
									}
									else if(Number($(this).val()==2)){//Fixed bins{
										$(".content").empty();
										$(".content").append(`
											<div class="instrumentSelectorDiv">
												<h3>Bin definition</h3>
												<hr style="width:25%;margin:auto;">
												<select class="instrumentSelect">
													<option selected disabled>--- CHOOSE ONE ---</option>
													<option value="1">Non-sequential bins</option>
													<option value="2">Sequential bins</option>
												</select>
												<div class="binStuff">
												</div>
												<div class="finish">
												</div>
											</div>`
										);
										$(".content").find('.instrumentSelect').change(function(){
											var fixedBinType=Number($(this).val());
											objct['fixedType']=fixedBinType;
											if(fixedBinType==1){//Fixed non-sequential
												$(".content").find('.instrumentSelectorDiv').find('.binStuff').empty();
												$(".content").find('.instrumentSelectorDiv').find('.binStuff').append('<p><input class="noBins" type="number" step="1" placeholder="No of bins"></input></p><div class="binVals"></div>');
												$(".content").find('.instrumentSelectorDiv').find('.binStuff').find('.noBins').change(function(){
													var noBins=Number($(this).val());
													$(".content").find('.instrumentSelectorDiv').find('.binVals').empty();
													for (var i=0; i<(noBins); i++){
														$(".content").find('.instrumentSelectorDiv').find('.binVals').append('<p>Bin '+(i+1)+' value : <input class="bin '+i+' required" type="number" step="0.0001"></input></p>');
													}
													$(".content").find('.instrumentSelectorDiv').find('.required').change(function(){
														var allGood=true;
														objct['binChannels']=[];
														$(".content").find('.instrumentSelectorDiv').find('.required').each(function(){
															if($(this).val()==""){
																allGood=false;
															}
															else{
																objct['binChannels'].push(Number($(this).val()));
															}
														});
														if(allGood){
															$('.finish').empty();
															$('.finish').append('<h3>Review</h3><hr><div class="plotTypeConfirm">Plot type: <span class="plotTypeText emphasise">Surface</span></div><div class="binChannelsText"><p>Bin Definition:</p></div><button class="startPlot button pill" style="font-size:20px" value="GO">Next Step</button>');
															for (var i=0; i<objct['binChannels'].length; i++){
																$('.finish').find(".binChannelsText").append('<p>Bin '+i+': <span class="emphasise">'+objct['binChannels'][i]+'</span></p>');
															}
															$('.finish').find('.emphasise').css({'font-weight':'bold'});
															$('.finish').find('.startPlot').click(function(){
																//surfaceChannelsSetup(globalObject);
																setupChannelSelector(1,$(".content"),globalInstruments,'dataChannels',theNext1,thisPlotType);
															});
															buildURL(globalObject);
														}
													});
													if('binChannels' in objct){
														for (var i=0; i<objct['binChannels'].length; i++){
															var idx=0;
															$(".content").find('.instrumentSelectorDiv').find('.required').each(function(){
																if(idx==i){
																	$(this).val(objct['binChannels'][i]);
																}
																idx=idx+1;
															});
														}
														$(".content").find('.instrumentSelectorDiv').find('.required').trigger('change');
													}
												});
												if('binChannels' in objct){
													$(".content").find('.instrumentSelectorDiv').find('.binStuff').find('.noBins').val(objct['binChannels'].length);
													$(".content").find('.instrumentSelectorDiv').find('.binStuff').find('.noBins').trigger('change');
												}
											}
											else if(fixedBinType==2){//Fixed sequential
												console.log(objct['spacing']);
												$(".content").find('.instrumentSelectorDiv').find('.binStuff').empty();
												$(".content").find('.instrumentSelectorDiv').find('.binStuff').append('<p><input class="start inputBins" type="number" style="padding : 0 15px 0 15px" step="0.0001" placeholder="Start bin"></input><input class="end inputBins" style="padding : 0 15px 0 15px" type="number" step="0.0001" placeholder="End bin"></input></p><p><input style="padding : 0 15px 0 15px" class="noBins inputBins" type="number" placeholder="No of bins" step="1"></input><select style="padding : 0 15px 0 15px" class="stepping inputBins"><option value="1">Linear</option><option value="2">Logarithmic</option></select></p><div class="binVals"></div>');
												$(".content").find('.instrumentSelectorDiv').find('.inputBins').change(function(){
													var allGood=true;
													$(".content").find('.instrumentSelectorDiv').find('.inputBins').each(function(){
														if($(this).val()==''){
															allGood=false;
														}
													});
													if(allGood){
														$('.finish').empty();
														$('.finish').append('<h3>Review</h3><hr><div class="plotTypeConfirm">Plot type: <span class="plotTypeText emphasise">Surface</span></div><div class="binChannelsText"><p>Bin Definition:</p></div><button class="startPlot button pill" style="font-size:20px" value="GO">Next Step</button>');
														$('.finish').find(".binChannelsText").append('<p>Start Bin: <span class="emphasise">'+$(".content").find('.instrumentSelectorDiv').find('.binStuff').find('.start').val()+'</span></p>');
														$('.finish').find(".binChannelsText").append('<p>End Bin: <span class="emphasise">'+$(".content").find('.instrumentSelectorDiv').find('.binStuff').find('.end').val()+'</span></p>');
														$('.finish').find(".binChannelsText").append('<p>No. Bins: <span class="emphasise">'+$(".content").find('.instrumentSelectorDiv').find('.binStuff').find('.noBins').val()+'</span></p>');
														if($(".content").find('.instrumentSelectorDiv').find('.binStuff').find('.stepping').val()=="1"){
															var spacingText="Linear";
														}
														else if($(".content").find('.instrumentSelectorDiv').find('.binStuff').find('.stepping').val()=="2"){
															var spacingText="Logarithmic";
														}
														$('.finish').find(".binChannelsText").append('<p>Spacing: <span class="emphasise">'+spacingText+'</span></p>');
														$('.finish').find('.startPlot').click(function(){
															//surfaceChannelsSetup(globalObject);
															setupChannelSelector(1,$(".content"),globalInstruments,'dataChannels',theNext1,thisPlotType);
														});
														$('.finish').find('.emphasise').css({'font-weight':'bold'});
														objct['binChannels']=[];
														var noBins=Number($(".content").find('.instrumentSelectorDiv').find('.binStuff').find('.noBins').val());
														var start=Number($(".content").find('.instrumentSelectorDiv').find('.binStuff').find('.start').val());
														var end=Number($(".content").find('.instrumentSelectorDiv').find('.binStuff').find('.end').val());
														var spacing=Number($(".content").find('.instrumentSelectorDiv').find('.binStuff').find('.stepping').val());
														objct['start']=start;
														objct['end']=end;
														objct['spacing']=spacing;
														objct['noBins']=noBins;
														if($(".content").find('.instrumentSelectorDiv').find('.binStuff').find('.stepping').val()=="1"){
															for (var i=0; i<(noBins-1); i++){
																objct['binChannels'].push(start+i*(end-start)/(noBins-1));
															}
															objct['binChannels'].push(end)
														}
														else if($(".content").find('.instrumentSelectorDiv').find('.binStuff').find('.stepping').val()=="2"){
															for (var i=0; i<(noBins-1); i++){
																objct['binChannels'].push(Math.exp(Math.log(start)+i*(Math.log(end)-Math.log(start))/(noBins-1)));
															}
															objct['binChannels'].push(end)
														}
														buildURL(globalObject);
													}
												});
												if('spacing' in objct){
													console.log('here');
													console.log(objct['spacing']);
													$(".content").find('.instrumentSelectorDiv').find('.binStuff').find('.stepping').val(objct['spacing']);
													$(".content").find('.instrumentSelectorDiv').find('.binStuff').find('.stepping').trigger('change');
												}
												if('start' in objct){
													$(".content").find('.instrumentSelectorDiv').find('.binStuff').find('.start').val(objct['start']);
													$(".content").find('.instrumentSelectorDiv').find('.binStuff').find('.start').trigger('change');
												}
												if('end' in objct){
													$(".content").find('.instrumentSelectorDiv').find('.binStuff').find('.end').val(objct['end']);
													$(".content").find('.instrumentSelectorDiv').find('.binStuff').find('.end').trigger('change');
												}
												if('noBins' in objct){
													$(".content").find('.instrumentSelectorDiv').find('.binStuff').find('.noBins').val(objct['noBins']);
													$(".content").find('.instrumentSelectorDiv').find('.binStuff').find('.noBins').trigger('change');
												}
											}
											buildURL(globalObject);
										});
										if('fixedType' in objct){
											$(".content").find('.instrumentSelect').val(objct['fixedType']);
											$(".content").find('.instrumentSelect').trigger('change');
										}
										buildURL(globalObject);
									}
									if('binChannels' in objct){
										if(objct['surfaceType']==1){
											$('.instrumentSelect').val($($('.instrumentSelect').find('option')[1]).val());
											$('.instrumentSelect').trigger('change');
										}
										if('dataChannels' in objct){
											$('.startPlot').trigger('click');
										}
									}
									buildURL(globalObject);
								});
								if('surfaceType' in globalObject){
									$(".content").find('.plotType').find('.surfaceTypeSelector').val(globalObject['surfaceType']);
									$(".content").find('.plotType').find('.surfaceTypeSelector').trigger('change');
								}
							}
							else if(thisPlotType==2){//Bar Plot
								var chosenChannels1=[];
								delete globalObject['channels'];
								delete globalObject['binChannels'];
								delete globalObject['surfaceType'];
								delete globalObject['channels'];
								delete globalObject['start']
								delete globalObject['end']
								delete globalObject['noBins']
								delete globalObject['spacing']
								delete globalObject['fixedType']
								$(".content").find('.plotType').find('.surfaceTypeSelector').remove();
								$(".content").find('.channelSelectorDiv').empty();
								$(".content").find('.channelSelectorDiv').append('<h3>Step 1 : Instrument</h3><hr><img class="loadingChannels" src="static/loading.gif" height="75" width="75"></img><div class="instChannels"></div>');
								$(".content").find('.instrumentSelectorDiv').empty();
								$(".content").find('.instrumentSelectorDiv').append('<h3>Step 1 : Categories</h3><hr><img class="loadingChannels" src="static/loading.gif" height="75" width="75"></img><div class="instChannels"></div>');
								$(".content").find('.plotType').append('<p><select class="surfaceTypeSelector"><option selected disabled>--- SELECT ONE ---</option><option value="1">Data channel categories</option><option value="2">User-defined categories</option></select></p>');
								$(".content").find('.plotType').find('.surfaceTypeSelector').change(function(){
									var barType=Number($(this).val());
									$(".content").find('.instrumentSelectorDiv').empty();
									if(barType==1){//Bar plot with categories found in data channels
										if(Number(globalObject['barType'])==2){
											delete globalObject['dataChannels'];
											delete globalObject['catChannels'];
											delete globalObject['plotOptions'];
											globalObject['plotOptions']={};
											$(".finish").empty();
											$(".finish").append('<h3>Review</h3><hr><img class="loadingChannels" src="static/loading.gif" height="75" width="75"></img><div class="instChannels"></div>');
										}
										globalObject['barType']=barType;
										$(".content").find('.channelSelectorDiv').empty();
										$(".content").find('.channelSelectorDiv').append('<h3>Step 1 : Category Channels</h3><hr><img class="loadingChannels" src="static/loading.gif" height="75" width="75"></img><div class="instChannels"></div>');
										$(".content").find('.instrumentSelectorDiv').append('<h3>Step 1 : Instrument</h3><hr><select class="instrumentSelect"><option selected disabled>--- CHOOSE ONE ---</option><optgroup class="instruments" label="Instruments"></optgroup><optgroup class="collections" label="Collections"></optgroup></select><div class="instrumentDetailsDiv"></div>');
										$(".content").find('.instrumentSelect').change(function(){
											var instIdx=Number($(this).val());
											if(instIdx>=0){
												var theInstrument=instruments[instIdx];
											}
											else if(instIdx==-1){
												var theInstrument=userInput.Raw;
											}
											else if(instIdx==-2){
												var theInstrument=userInput.Processed;
											}
											else if(instIdx==-3){
												var theInstrument=userInput.Finalized;
											}
											else if(instIdx==-4){
												var theInstrument=userInput.Other;
											}
											else if(instIdx==-10000000000000){
												instIdx=0;
												var theInstrument=instruments[instIdx];
												var collectionName=$(".content").find('.instrumentSelect').find('option:selected').text()
												for (var i=0; i<globalCollections.length; i++){
													if(collectionName==globalCollections[i].Name){
														chosenChannels1=globalCollections[i].channels;
													}
												}
											}
											currentRoutine=0;
											instrumentChange(instruments,theInstrument,chosenChannels1,keysImport,thisPlotType,$(".content").find('.channelSelectorDiv'),'catChannels',theNext3,0);
										});
									}
									else if(barType==2){//Bar plot with user defined categories
										if(Number(globalObject['barType'])==1){
											delete globalObject['dataChannels'];
											delete globalObject['catChannels'];
											delete globalObject['plotOptions'];
											globalObject['plotOptions']={};
											$(".finish").empty();
											$(".finish").append('<h3>Review</h3><hr><img class="loadingChannels" src="static/loading.gif" height="75" width="75"></img><div class="instChannels"></div>');
										}
										globalObject['barType']=barType;
										$(".content").find('.channelSelectorDiv').empty();
										$(".content").find('.instrumentSelectorDiv').empty();
										$(".content").find('.instrumentSelectorDiv').append('<h3>Step 1 : Category definition</h3><hr><p>Category Number: <input class="catNoSelect" type="number" min="1" value="1"></input></p><div class="categoryStuff"></div>');
										$('.finish').empty();
										$('.finish').append('<h3>Review</h3><hr><img class="loadFinish" src="static/loading.gif" height="75" width="75"></img>');
										$(".content").find('.catNoSelect').change(function(){
											var catNo=Number($(this).val());
											globalObject['catNo']=catNo;
											var cats=[];
											$(".content").find('.categoryStuff').empty();
											for (var i=0; i<(catNo); i++){
												$(".content").find('.categoryStuff').append('<p>Category '+i+': <input class="catName '+i+'"></input></p>');
											}
											$(".content").find('.categoryStuff').find('.catName').on('input',function(){
												var categories=[];
												var foundEmpty=false;
												var main=$(this);
												var value=$(this).val();
												var mainIdx=Number($(this).attr('class').split(' ')[1]);
												$(main.parent()).find('.errSpan').remove();
												$('.finish').empty();
												$('.finish').append('<h3>Review</h3><img class="loadingChannels" src="static/loading.gif" height="75" width="75"></img>');
												$(".content").find('.categoryStuff').find('.catName').each(function(){
													var index=Number($(this).attr('class').split(' ')[1]);
													if($(this).val()==''){
														$($(this).parent()).find('.errSpan').remove();
														$($(this).parent()).append('<span class="errSpan" style="background-color:#f2dede">Emtpy</span>');
														foundEmpty=true;
													}
													else if(value==$(this).val() && mainIdx!=index){
														$($(this).parent()).find('.errSpan').remove();
														$(main.parent()).append('<span class="errSpan" style="background-color:#f2dede">Repeated</span>');
														foundEmpty=true;
													}
												});
												$('.finish').empty();
												$('.finish').append('<h3>Review</h3>');
												
												var categories=[];
												for (var i=0; i<(catNo); i++){
													categories.push($(".content").find('.categoryStuff').find('.catName.'+i).val());
													$('.finish').append('<p>Category '+i+': <span class="emphasise">'+categories[i]+'</span></p>');
												}
												globalObject['plotType']=thisPlotType;
												globalObject['catChannels']=categories;
												var path=window.location.pathname;
												var host=window.location.host;
												var url=path+buildURL(globalObject);
												window.history.pushState("", "", url);
												$('.finish').find('.emphasise').css({'font-weight':'bold'});
												if(!foundEmpty){
													$('.finish').append('<button class="nextStep button pill" style="font-size:150%">Next Step</button>');
													$('.finish').find('.nextStep').click(function(){
														globalObject['plotType']=thisPlotType;
														barChannelsSetup(globalObject);
													});
													//Something to go to next
												}
												if('dataChannels' in globalObject){
													$('.finish').find('.nextStep').trigger('click');
												}
											});
											if('catChannels' in globalObject && !((typeof globalObject['catChannels'][0])==='object')){
												for (var i=0; i<(globalObject['catChannels'].length); i++){
													$(".content").find('.categoryStuff').find('.catName.'+i).val(globalObject['catChannels'][i]);
												}
												$(".content").find('.categoryStuff').find('.catName.0').trigger('input');
											}
										});
										if('catChannels' in globalObject && !((typeof globalObject['catChannels'][0])==='object')){
											$(".content").find('.catNoSelect').val(globalObject['catChannels'].length);
											$(".content").find('.catNoSelect').trigger('change');
										}
										var path=window.location.pathname;
										var host=window.location.host;
										var url=path+buildURL(globalObject);
										window.history.pushState("", "", url);
									}
								});
								if('barType' in globalObject){
									$(".content").find('.plotType').find('.surfaceTypeSelector').val(globalObject['barType']);
									$(".content").find('.plotType').find('.surfaceTypeSelector').trigger('change');
								}
							}
							else if(thisPlotType==3){//External Plot
								$('.finish').empty();
								//$('.finish').append('<p><span style="background-color:#fcf8e3">External sources may trigger harmfull attacks on your server and/or clients. Only use trusted external sources.</span></p>');
								$('.finish').append('<h3>Confirm</h3><hr><p><span style="background-color:#fcf8e3">External sources may trigger harmfull attacks on your server and/or clients. Only use trusted external sources.</span></p><img class="loadFinish" src="static/loading.gif" height="75" width="75"></img>');
								$(".content").find('.channelSelectorDiv').empty();
								$(".content").find('.instrumentSelectorDiv').empty();
								$(".content").find('.instrumentSelectorDiv').append('<h3>Details</h3><hr><p>Source : <input class="site inputs"></input></p><p>Extra : <input class="extra inputs"></input></p><p>Type : <select class="sourceType"><option selected value="0">Vector</option><option value="1">Bitmap</option></select></p>');
								$(".content").find('.instrumentSelectorDiv').find('.inputs').on('change',function(){
									$('.finish').empty();
									if(ValidURL($(".content").find('.instrumentSelectorDiv').find('.site').val())){
										objct['source']=$(".content").find('.instrumentSelectorDiv').find('.inputs').val();
										objct['sourceType']=$(".content").find('.instrumentSelectorDiv').find('.sourceType').val();
										objct['extra']=$(".content").find('.instrumentSelectorDiv').find('.extra').val();
										$($(".content").find('.instrumentSelectorDiv').find('.errorInfo').parent()).remove();
										$('.finish').append('<h3>Confirm</h3><hr><p><span style="background-color:#fcf8e3">External sources may trigger harmfull attacks on your server and/or clients. Only use trusted external sources.</span></p><div class="plotTypeConfirm">Plot type:<span class="plotTypeText emphasise">External Source</span></div><div class="channelsText"><p>Source: <span class="emphasise">'+$(".content").find('.instrumentSelectorDiv').find('.site').val()+'</span></p><p>Type: <span class="emphasise">'+$(".content").find('.instrumentSelectorDiv').find('.sourceType').find(':selected').html()+'</span></p><p>Extra: <span class="emphasise">'+$(".content").find('.instrumentSelectorDiv').find('.extra').val()+'</span></p></div><button class="startPlot button pill" style="font-size:40px" value="GO">PLOT</button>');
										$('.finish').find('.startPlot').click(function(){
											objct['source']=$(".content").find('.instrumentSelectorDiv').find('.site').val();
											objct['sourceType']=$(".content").find('.instrumentSelectorDiv').find('.sourceType').val();
											objct['extra']=$(".content").find('.instrumentSelectorDiv').find('.extra').val();
											objct['plotting']=1;
											var path=window.location.pathname;
											var host=window.location.host;
											var url=path+buildURL(objct);
											window.history.pushState("", "", url);
											startSlider(objct);
										});
										$('.finish').find('.emphasise').css({'font-weight':'bold'});
										var path=window.location.pathname;
										var host=window.location.host;
										var url=path+buildURL(objct);
										window.history.pushState("", "", url);
									}
									else{
										if($(".content").find('.instrumentSelectorDiv').find('.errorInfo').length<1){
											$(".content").find('.instrumentSelectorDiv').append('<p><span style="background-color:#f2dede" class="errorInfo">Please insert a valid URL (http://example.com/exampleStuff)</span></p>');
											$(".content").find('.instrumentSelectorDiv').find('.errorInfo').fadeOut(2000,function(){
												$($(".content").find('.instrumentSelectorDiv').find('.errorInfo').parent()).remove();
											});
										}
										$('.finish').append('<h3>Confirm</h3><hr><p><span style="background-color:#fcf8e3">External sources may trigger harmfull attacks on your server and/or clients. Only use trusted external sources.</span></p><img class="loadFinish" src="../images/loading.gif" height="75" width="75"></img>');
									}
								});
								if('source' in objct){
									$(".content").find('.instrumentSelectorDiv').find('.site').val(objct['source']);
								}
								if('sourceType' in objct){
									$(".content").find('.instrumentSelectorDiv').find('.sourceType').val(objct['sourceType']);
								}
								if('extra' in objct){
									$(".content").find('.instrumentSelectorDiv').find('.extra').val(objct['extra']);
								}
								if(('extra' in objct) || ('source' in objct)){
									$(".content").find('.instrumentSelectorDiv').find('.site').trigger('change');
								}
							}
						},
						error: function(returned){
							$(".content").find('.errorRequest').empty();
							$(".content").find('.errorRequest').append('There was an error collecting instrument data!');
							alert('There was a problem collecting instrument data');
						}
					});
					objct['plotType']=thisPlotType;
					buildURL(objct);
				});
				if('plotType' in objct){
					$(".content").find('.plotType').find('.plotSelector').val(objct['plotType']);
					$(".content").find('.plotType').find('.plotSelector').trigger('change');
				}
			}
			else{//Existing Plot
				console.log("EXISTING");
				$.ajax({
					url: '/instruments/queryInstrumentsFull',
					type: 'POST',
					dataType: "json",
					data:{'dbname':dbname},
					success: function(returned){
						var keysImport=Object.keys([]);
						globalInstruments=returned;
						globalImport={};
						var instruments=returned;
						var currentInstruments=returned;
						var userInput={};
						$.ajax({
							url: '/data/getPlots',
							type: 'POST',
							dataType: "json",
							data:{'dbname':dbname},
							success: function(returned){
								$(".toolTitle").empty();
								$(".toolTitle").append('<h2 class="title" style="margin:auto;text-align:center">Single plot tool</h2>');
								$(".content").css({
									'display'               :  'grid',
									'grid-template-columns' :  'repeat(auto-fit,minmax(100px,300px)',
									'grid-gap'              :  '10px',
									//'grid-auto-column'      :  '25%',
									'width'                 :  '100%'
								});
								$(".content").append('<div class="plotChooserDiv"><h3>Choose a plot</h3><select class="plotChooser"><option selected hidden disabled>--- CHOOSE ONE ---</option></select></div><div class="plotDetails"><h3>Plot Details</h3><img class="loadingDetails" src="/static/loading.gif" height="75" width="75"></img></div>');
								$(".content").after('<div class="finish" style="align:center;text-align:center"></div>');
								$(".content").find('.plotChooser').change(function(){
									var plotIdx=Number($(this).val());
									var remarksParsed=returned[plotIdx].remarks;
									var uniqueInstruments=[];
									$(".content").find('.plotDetails').empty();
									$(".content").find('.plotDetails').append('<h3>Plot Details</h3><p>Plot type: <span class="emphasis">'+plotTypes[Number(returned[plotIdx].plottype)]+'</span></p><div class="uniqueInsts" style="display:table;margin:auto;text-align:center"></div>');
									objct.plotid=Number(returned[plotIdx].plotid);
									objct.plotType=returned[plotIdx].plottype;
									objct.plotOptions=remarksParsed.options;
									objct.plotOptions['plotTitle']=returned[plotIdx].plotname;
									if(Number(objct.plotType)==0){
										var channelsParsed=returned[plotIdx].channelids;
										objct.channels=channelsParsed;
											for (var i=0; i<globalObject.channels.length; i++){
											var foundInstrument=false;
											for (var j=0; j<uniqueInstruments.length; j++){
												if(uniqueInstruments[j].instid==objct.channels[i].instid){
													foundInstrument=true;
													break
												}
											}
											if(!foundInstrument){
												uniqueInstruments.push({
													'instid':Number(objct.channels[i].instid)
												});
											}
										}
										for (var i=0; i<currentInstruments.length; i++){
											for (var j=0; j<uniqueInstruments.length; j++){
												if(uniqueInstruments[j].instid==currentInstruments[i].instid){
													if(currentInstruments[i].active==1){
														var statusText='<span style="color:green">Active</span>';
													}
													else if(currentInstruments[i].active==0){
														var statusText='<span style="color:red">Inactive</span>';
													}
													$(".content").find('.uniqueInsts').append('<div class="unique '+i+'" style="display:table-cell"><h3>'+currentInstruments[i].Name+'</h3><p>Description: <span class="emphasis">'+currentInstruments[i].description+'</span></p><p>Contact: <span class="emphasis">'+currentInstruments[i].email+'</span></p><p>Current Status: '+statusText+'</p><div class="channels '+i+'">Channels:</div></div>');
													break;
												}
											}
											for (var l=0; l<objct.channels.length; l++){
												if('files' in currentInstruments[i]){
													for (var j=0; j<currentInstruments[i].files.length; j++){
														if('channels' in currentInstruments[i].files[j]){
															for (var k=0; k<currentInstruments[i].files[j].channels.length; k++){
																var channel=currentInstruments[i].files[j].channels[k];
																if(globalObject.channels[l].channelid==channel.channelid){
																	$(".content").find('.uniqueInsts').find('.unique.'+i).find('.channels').append('<p>'+channel.Name+'</p>');
																	break
																}
															}
														}
													}
												}
											}
										}
										$('.finish').empty();
										$('.finish').append('<hr><button class="button pill startPlot" style="font-size:200%">PLOT</button>');
										$('.finish').find('.startPlot').click(function(){
											$($(".backBegining").parent()).remove()
											objct['plotting']=1;
											buildURL(objct);
											startSlider(objct);
										});
										$('.content').find('.emphasis').css({
											'font-weight' : 'bold',
											'font-style ' : 'italic'
										});
										if('plotting' in objct){
											$('.finish').find('.startPlot').trigger('click');
										}
									}
									else if(Number(objct.plotType)==1){
										var channelsParsed=JSON.parse(returned.plots[plotIdx].channelids);
										objct.dataChannels=channelsParsed;
										objct.binChannels=remarksParsed.surfaceStuff.binChannels;
										objct.surfaceType=Number(remarksParsed.surfaceStuff.surfaceType);
										if(objct.surfaceType==2){
											objct.fixedType=Number(remarksParsed.surfaceStuff.fixedType);
											if(objct.fixedType==2){
												objct.noBins=Number(remarksParsed.surfaceStuff.noBins);
												objct.start=Number(remarksParsed.surfaceStuff.start);
												objct.end=Number(remarksParsed.surfaceStuff.end);
												objct.spacing=Number(remarksParsed.surfaceStuff.spacing);
											}
										}
										$(".content").find('.uniqueInsts').append('<div style="display:table-row" class="uniqueInstsInner"><div class="binData" style="display:table-cell;padding:0 15px 0 15px"><p>Bins</p></div><div class="channelData" style="display:table-cell;padding:0 15px 0 15px"><p>Data Channels</p></div></div>');
										$('.finish').empty();
										$('.finish').append('<hr><button class="button pill startPlot" style="font-size:200%">PLOT</button>');
										$('.finish').find('.startPlot').click(function(){
											$($(".backBegining").parent()).remove()
											objct['plotting']=1;
											buildURL(objct)
											startSlider(objct);
										});
										for (var j=0; j<objct['binChannels'].length; j++){
											if(typeof objct['binChannels'][j]=='object'){
												$('.content').find('.binData').append('<p class="emphasis">'+objct['binChannels'][j].name+'</p>')
											}
											else{
												$('.content').find('.binData').append('<p class="emphasis">Bin '+j+' : '+objct['binChannels'][j]+'</p>')
											}
										}
										for (var j=0; j<objct['dataChannels'].length; j++){
											$('.content').find('.channelData').append('<p class="emphasis">'+objct['dataChannels'][j].name+'</p>')
										}
										$('.content').find('.emphasis').css({
											'font-weight' : 'bold',
											'font-style ' : 'italic'
										});
										if('plotting' in objct){
											$('.finish').find('.startPlot').trigger('click');
										}
									}
									else if(Number(objct.plotType)==2){
										var channelsParsed=JSON.parse(returned.plots[plotIdx].channelids);
										objct.dataChannels=channelsParsed;
										objct.catChannels=remarksParsed.barStuff.catChannels;
										objct.barType=Number(remarksParsed.barStuff.barType);
										if(objct.barType==1){
											$(".content").find('.uniqueInsts').append('<div style="display:table-row" class="uniqueInstsInner"><div class="binData" style="display:table-cell;padding:0 15px 0 15px"><p>Categories</p></div><div class="channelData" style="display:table-cell;padding:0 15px 0 15px"><p>Data Channels</p></div></div>');
											for (var j=0; j<objct['catChannels'].length; j++){
												if(typeof objct['catChannels'][j]=='object'){
													$('.content').find('.binData').append('<p class="emphasis">'+objct['catChannels'][j].name+'</p>')
												}
												else{
													$('.content').find('.binData').append('<p class="emphasis">Category '+j+' : '+objct['binChannels'][j]+'</p>')
												}
											}
											for (var j=0; j<objct['dataChannels'].length; j++){
												$('.content').find('.channelData').append('<p class="emphasis">'+objct['dataChannels'][j].name+'</p>')
											}
											$('.content').find('.emphasis').css({
												'font-weight' : 'bold',
												'font-style ' : 'italic'
											});
										}
										else if(objct.barType==1){
											$(".content").find('.uniqueInsts').append('<div style="display:table-row" class="uniqueInstsInner"><div class="binData" style="display:table-cell;padding:0 15px 0 15px"><p>Categories</p></div><div class="channelData" style="display:table-cell;padding:0 15px 0 15px"><p>Data Channels</p></div></div>');
											for (var j=0; j<objct['catChannels'].length; j++){
												if(typeof objct['catChannels'][j]=='object'){
													$('.content').find('.binData').append('<p class="emphasis">'+objct['catChannels'][j].name+'</p>')
												}
												else{
													$('.content').find('.binData').append('<p class="emphasis">Category '+j+' : '+objct['binChannels'][j]+'</p>')
												}
											}
											for (var j=0; j<objct['dataChannels'].length; j++){
												$('.content').find('.channelData').append('<p class="emphasis">'+objct['dataChannels'][j].name+'</p>')
											}
											$('.content').find('.emphasis').css({
												'font-weight' : 'bold',
												'font-style ' : 'italic'
											});
										}
										$('.finish').empty();
										$('.finish').append('<hr><button class="button pill startPlot" style="font-size:200%">PLOT</button>');
										$('.finish').find('.startPlot').click(function(){
											$($(".backBegining").parent()).remove()
											objct['plotting']=1;
											buildURL(objct);
											startSlider(objct);
										});
										if('plotting' in objct){
											$('.finish').find('.startPlot').trigger('click');
										}
									}
									else if(Number(objct.plotType)==3){
										var channelsParsed=JSON.parse(returned.plots[plotIdx].channelids);
										objct.dataChannels=channelsParsed;
										objct.source=remarksParsed.source;
										objct.extra=remarksParsed.extra;
										objct.sourceType=remarksParsed.sourceType;
										$('.finish').empty()
										$('.finish').append('<h3>Confirm</h3><hr><p><span style="background-color:#fcf8e3">External sources may trigger harmfull attacks on your server and/or clients. Only use trusted external sources.</span></p><div class="plotTypeConfirm">Plot type:<span class="plotTypeText emphasise">External Source</span></div><div class="channelsText"><p>Source: <span class="emphasise">'+objct.source+'</span></p></div><button class="startPlot button pill" style="font-size:40px" value="GO">PLOT</button>');
										$('.finish').find('.startPlot').click(function(){
											$($(".backBegining").parent()).remove();
											objct['plotting']=1;
											buildURL(objct)
											startSlider(objct);
										});
										$('.finish').find('.emphasise').css({'font-weight':'bold'});
										if('plotting' in objct){
											$('.finish').find('.startPlot').trigger('click');
										}
									}
									buildURL(objct);
								});
								for (var i=0; i<plotTypes.length; i++){
									$(".content").find('.plotChooser').append('<optgroup class="opt '+i+'" label="'+plotTypes[i]+'"><option class="empty" disabled>EMPTY</option></optgroup>')
								}
								for (var i=0; i<returned.length; i++){
									$(".content").find('.plotChooser').find('.opt.'+returned[i].plottype).append('<option value="'+i+'">'+returned[i].plotname+'</option>');
									$(".content").find('.plotChooser').find('.opt.'+returned[i].plottype).find('.empty').remove();
								}
								if('plotid' in objct){
									for (var i=0; i<returned.length; i++){
										if(Number(returned[i].plotid)==objct.plotid){
											$(".content").find('.plotChooser').val(i);
											$(".content").find('.plotChooser').trigger('change');
											break
										}
									}
								}
							},
							error: function(returned){
								alert('There was an error collecting plot data!');
							}
						});
					},
					error: function(returned){
						alert('There was an error collecting plot data!');
					}
				});
			}
		}
		if(objct.visionType=="1"){//Layouts
			if(objct.visionTypeNew=='0'){//New layout
				if('plots' in objct){
					for (var i=0; i<objct.plots.length; i++){
						objct.plots[i]=Number(objct.plots[i]);
					}
				}
				$.ajax({
					url: '/instruments/queryInstrumentsFull',
					type: 'POST',
					dataType: "json",
					data:{'dbname':dbname},
					success: function(returned){
						$(".content").find('.errorRequest').empty();
						var currentInstruments=returned;
						globalInstruments=returned;
						globalImport={};
						$.ajax({
							url: '/data/getPlots',
							type: 'POST',
							dataType: "json",
							data:{'dbname':dbname},
							success: function(returned){
								$(".toolTitle").empty();
								//$(".toolTitle").append('<h4 class="title" style="margin:auto;text-align:center">Layout plot tool</h4>');
								//$(".content").css({'height':'90%'});
								$(".content").append('<div style="max-height:100px" class="layoutFirst">Setup your layout:<p>Number of plots: <input type="number" class="layout noPlots" min="1" value="1"></input></p></div><hr style="width:25%"><div class="layoutShow"></div>');
								$(".content").find('.layout').change(function(){
									var noPlots=Number($(".content").find('.layout.noPlots').val());
									objct['noPlots']=noPlots;
									objct['plotObjects']=[];
									if('plots' in objct){
										if(objct.plots.length!=noPlots){
											delete objct.plots;
										}
									}
									zoomOutMobile();
									$(".content").find('.layoutShow').empty();
									$(".content").find('.layoutShow').css({
										'display'               :   "grid",
										'grid-template-columns' :   "repeat(auto-fit, minmax(600px, 1500px))",
										'width'                 :   "100%",
										'height'                :   "100%",
										"justify-content"       :   "center"
									});
									for (var j=0; j<noPlots; j++){
										$(".content").find('.layoutShow').append('<div style="max-height:200px" class="layoutCell '+j+'"><select class="plotSelect noPlot'+j+'"><option selected hidden value="-1">None</option></select><div class="plotContent noPlot'+j+'"></div></div>');
									}
									for (var i=0; i<plotTypes.length; i++){
										$(".content").find('.plotSelect').append('<optgroup class="opt '+i+'" label="'+plotTypes[i]+'"><option class="empty" disabled>EMPTY</option></optgroup>')
									}
									for (var i=0; i<returned.length; i++){
										$(".content").find('.plotSelect').find('.opt.'+returned[i].plottype).append('<option value="'+i+'">'+returned[i].plotname+'</option>');
										$(".content").find('.plotSelect').find('.opt.'+returned[i].plottype).find('.empty').remove();
									}
									$(".content").find('.plotSelect').change(function(){
										var foundOnePlot=false;
										var thisClass=$(this).attr('class');
										var thisValue=Number($(this).val());
										var cell=thisClass.split(' ')[1];
										var cellNo=Number(cell.substring(6,cell.length));
										objct.plots[cellNo]=thisValue;
										$(".content").find('.plotContent.'+cell).empty();
										if(thisValue>=0){
											var newObject = jQuery.extend(true, {}, returned[thisValue]);
											objct.plotObjects[cellNo]=newObject;
											objct.plotObjects[cellNo]['plotType']=Number(returned[thisValue].plottype);
											$(".content").find('.plotContent.'+cell).append(returned[thisValue].plotname);
										}
										else{
											$(".content").find('.plotContent.'+cell).append('NONE');
										}
										objct.plotObjects[cellNo]['visionType']='1';
										buildURL(objct);
										$('.finish').empty();
										$(".content").find('.plotSelect').each(function(){
											if(Number($(this).val())>=0){
												foundOnePlot=true;
											}
										});
										if(foundOnePlot){
											$('.finish').append('<button class="startPlot button pill" style="font-size:200%">GO</button>');
											$('.finish').find('.startPlot');
											$('.finish').find('.startPlot').click(function(){     
												$($(".backBegining").parent()).remove();
												for (var i=0; i<objct.plotObjects.length; i++){
													objct.plotObjects[i]['plotDiv']='plotEnclosure'+i;
												}
												objct['plotting']=1;
												buildURL(objct);
												startSlider(objct);
											});
										}
									});
									if('plots' in objct){
										for (var i=0; i<objct.plots.length; i++){
											objct.plotObjects.push({});
											
											$(".content").find('.plotSelect.noPlot'+i).val(objct.plots[i]);
											$(".content").find('.plotSelect.noPlot'+i).trigger('change');
										}
									}
									else{
										objct['plots']=[];
										for (var i=0; i<noPlots; i++){
											objct['plots'].push(-1);
											objct.plotObjects.push({});
										}
									}
									buildURL(objct);
								});
								$(".content").after('<div class="finish" style="align:center;text-align:center"></div>');
								if('noPlots' in objct){
									$(".content").find('.layout.noPlots').val(objct.noPlots);
								}
								$(".content").find('.layout').trigger('change');
								if('plotting' in objct){
									$('.finish').find('.startPlot').trigger('click');
								}
							},
							error: function(returned){
								alert('There was an error collecting data plots');
							}
						});
					},
					error: function(returned){
						alert('There was an error collecting instrument info');
					}
				});
			}
			else{//Existing layout
				$.ajax({
					url: '/instruments/queryInstrumentsFull',
					type: 'POST',
					dataType: "json",
					data:{'dbname':dbname},
					success: function(returned){
						$(".content").find('.errorRequest').empty();
						var currentInstruments=returned;
						globalInstruments=returned;
						globalImport={};
						$.ajax({
							url: '/data/getPlots',
							type: 'POST',
							dataType: "json",
							data:{'dbname':dbname},
							success: function(returned){
								var currentPlots=returned;
								$.ajax({
									url: '/data/getLayouts',
									type: 'POST',
									dataType: "json",
									data:{'dbname':dbname},
									success: function(returned){
										$(".toolTitle").empty();
										$(".toolTitle").append('<h2 class="title" style="margin:auto;text-align:center">Layout plot tool</h2>');
										$(".content").css({'display':'table','height':'100%'});
										$(".content").empty();
										$(".content").append('Choose a layout <select class="layoutChooser"><option selected disabled>-- CHOOSE ONE ---</option></select>');
										for (var i=0; i<returned.length; i++){
											$(".content").find('.layoutChooser').append('<option value="'+i+'">'+returned[i].Name+'</option>');
										}
										$(".content").find('.layoutChooser').change(function(){
											var layoutIdx=Number($(this).val());
											var format=JSON.parse(returned[layoutIdx].format);
											objct['noPlots']=format.noPlots;
											objct['plots']=JSON.parse(returned[layoutIdx].plots);
											objct['layoutid']=returned[layoutIdx].layoutid;
											objct['Name']=returned[layoutIdx].Name;
											$(".content").append('<div style="display:table-row" class="layoutFirst">Layout setup:<p>Number of plots: <input type="number" value="'+objct.noPlots+'" class="layout noPlots" min="1" value="1"></input></div><hr style="width:25%"><div style="display:table-row;margin:auto;text-align:center;" class="layoutShowOuter"><div style="display:table;margin:auto;text-align:center;border-spacing: 10px;border-collapse: separate;width:100%;height:100%;" class="layoutShow"></div></div>');
											$(".content").find('.layout').change(function(){
												var noPlots=Number($(".content").find('.layout.noPlots').val());
												objct['noPlots']=noPlots;
												objct['plotObjects']=[];
												if('plots' in objct){
													if(objct.plots.length!=noPlots){
														delete objct.plots;
													}
												}
												$(".content").find('.layoutShow').empty();
												for (var i=0; i<noPlots; i++){
													$(".content").find('.layoutShow').append('<div style="max-height:200px" class="layoutCell '+i+'"><select class="plotSelect noPlot'+i+'"><option selected hidden value="-1">None</option></select><div class="plotContent noPlot'+i+'"></div></div>');
												}
												for (var i=0; i<plotTypes.length; i++){
													$(".content").find('.plotSelect').append('<optgroup class="opt '+i+'" label="'+plotTypes[i]+'"></optgroup>')
												}
												for (var i=0; i<currentPlots.length; i++){
													$(".content").find('.plotSelect').find('.opt.'+currentPlots[i].plottype).append('<option value="'+i+'">'+currentPlots[i].plotname+'</option>');
												}
												$(".content").find('.plotSelect').change(function(){
													var foundOnePlot=false;
													var thisClass=$(this).attr('class');
													var thisValue=Number($(this).val());
													var cell=thisClass.split(' ')[1];
													var cellNo=Number(cell.substring(6,cell.length));
													objct.plots[cellNo]=thisValue;
													$(".content").find('.plotContent.'+cell).empty();
													if(thisValue>=0){
														var newObject = jQuery.extend(true, {}, currentPlots[thisValue]);
														objct.plotObjects[cellNo]=newObject;
														$(".content").find('.plotContent.'+cell).append(currentPlots[thisValue].plotname);
													}
													else{
														$(".content").find('.plotContent.'+cell).append('NONE');
													}
													buildURL(objct);
													$('.finish').empty();
													$(".content").find('.plotSelect').each(function(){
														if(Number($(this).val())>=0){
															foundOnePlot=true;
														}
													});
													objct.plotObjects[cellNo]['visionType']='1';
													if(foundOnePlot){
														$('.finish').append('<button class="startPlot button pill" style="font-size:200%">GO</button>');
														$('.finish').find('.startPlot');
														$('.finish').find('.startPlot').click(function(){
															for (var i=0; i<objct.plotObjects.length; i++){
																objct.plotObjects[i]['plotDiv']='plotEnclosure'+i;
															}
															$($(".backBegining").parent()).remove();
															objct['plotting']=1;
															buildURL(objct);
															startSlider(objct);
														});
													}
												});
												if('plots' in objct){
													for (var i=0; i<objct.plots.length; i++){
														objct.plotObjects.push([]);
														if(objct.plots[i]>=0){
															objct.plotObjects.push(currentPlots[objct.plots[i]]);
														}
														else{
															objct.plotObjects.push({});
														}
														$(".content").find('.plotSelect.noPlot'+i).val(objct.plots[i]);
														$(".content").find('.plotSelect.noPlot'+i).trigger('change');
													}
												}
												else{
													objct['plots']=[];
													for (var i=0; i<noPlots; i++){
														objct['plots'].push(-1);
														objct.plotObjects.push({});
													}
												}
												buildURL(objct);
											});
											$(".content").find('.layout').trigger('change');
											$(".content").after('<div class="finish" style="align:center;text-align:center"></div>');
											if('noPlots' in objct){
												$(".content").find('.layout.noPlots').val(objct.noPlots);
											}
											$(".content").find('.layout').trigger('change');
											if('plotting' in objct){
												$('.finish').find('.startPlot').trigger('click');
											}
										});
										if('layoutid' in objct){
											$(".content").find('.layoutChooser').val(objct.layoutid);
											$(".content").find('.layoutChooser').trigger('change');
										}
									},
									error: function(returned){
										$(".content").find('.errorRequest').empty()
										$(".content").find('.errorRequest').append('There was an error collecting layouts data!');
									}
								});
							},
							error: function(returned){
								$(".content").find('.errorRequest').empty()
								$(".content").find('.errorRequest').append('There was an error collecting plots data!');
							}
						});
					},
					error: function(returned){
						$(".content").find('.errorRequest').empty()
						$(".content").find('.errorRequest').append('There was an error collecting instrument data!');
					}
				});
			}
		}
	}
	else if(objct.type=="1"){//Download
		$.ajax({
			url: '/data/collections',
			type: 'POST',
			dataType: "json",
			async:false,
			data: {'dbname':dbname},
			success:function(returned){
				globalCollections=returned;
			}
		});
		$.ajax({
			url: '/instruments/queryInstruments',
			type: 'POST',
			dataType: "json",
			data:{'dbname':dbname},
			success: function(returned){
				var currentInstruments=returned;
				var instruments=returned;
				var userInputInsts=returned.userImport;
				if(objct.downloadType=="0"){//Download data
					if(objct.downloadTypeRaw=="0"){//Download raw data
						$(".toolTitle").empty();
						$(".toolTitle").append('<h2 class="title" style="margin:auto;text-align:center">Raw data download</h2>');
						$(".content").append('<div class="downloadInstrument"><h3>Instruments</h3><select class="instrumentSelect"><option selected disabled>--- CHOOSE ONE ---</option><optgroup class="instruments" label="Instruments"></optgroup><optgroup class="other" label="Other"></optgroup></select><hr></div><h4 class="rawFiles filesCounter" style="margin:auto;text-align:center">Data files - None selected</h4><div class="foldersRaw"></div>');
						$(".content").find('.instrumentSelect').change(function(){
							var instIdx=Number($(this).val());
							$.ajax({
								method: "POST",
								url:"/instruments/listInstFiles",
								dataType: "json",
								'instName':instruments[instIdx].Name,
								data:{'database':dbname,'instName':instruments[instIdx].Name},
								success: function(returned) {
									$(".content").find('.foldersRaw').empty();
									$(".content").find('.foldersRaw').css({'text-align':'center'});
									buildFileSystem(returned,$(".content").find('.foldersRaw'),this.instName,true,'');
									$(".content").find('.foldersRaw').append('<div class="finalDiv"><button style="font-size:15px" class="dlAll button pill" disabled>Download Selected</button></div>');
									$(".content").find('.foldersRaw').find('.folder').css({'cursor':'pointer'});
									$(".content").find('.foldersRaw').find('.folder').click(function(){
										$($(this).parent()).find('div').toggle();
										if($(this).find('.open').length>0){
											$(this).find('.open').remove();
											$(this).prepend('<img class="closed" src="/static/folder.png" width="25px" height="25px"></img>');
										}
										else if($(this).find('.closed').length>0){
											$(this).find('.closed').remove();
											$(this).prepend('<img class="open" src="/static/folderOpen.png" width="25px" height="25px"></img>');
										}
									});
									function countCheckFiles(){
										var clickedCount=0;
										$(".content").find('.foldersRaw').find('.fileCheck').each(function(){
											if($(this).prop('checked')){
												clickedCount++;
											}
										});
										if(clickedCount>0){
											$(".content").find('.filesCounter').html('Data files - '+clickedCount+' selected');
											$(".content").find('.foldersRaw').find('.dlAll').prop('disabled',false);
										}
										else{
											$(".content").find('.filesCounter').html('Data files - None selected');
											$(".content").find('.foldersRaw').find('.dlAll').prop('disabled',true);
										}
										$(".content").find('.foldersRaw').find('.dlAll').unbind('click');
										$(".content").find('.foldersRaw').find('.dlAll').click(function(){
											$(".content").find('.foldersRaw').find('.dlAll').html($(".content").find('.foldersRaw').find('.dlAll').html() + '<img class="loadingChannels" src="/static/loading.gif" height="25" width="25"></img>')
											var theFiles=[]
											$(".content").find('.foldersRaw').find('.file').each(function(){
												if($(this).find('.fileCheck').prop('checked')){
													var filePath=$(this).find('a')[0].pathname.split('/')
													theFiles.push(filePath.slice(3,(filePath.length)).join('/'));
												}
											});
											$.ajax({
												method: "POST",
												url:"/daqbroker/multipleFileDownload",
												contentType: "application/json",
												data:JSON.stringify({'files':theFiles}),
												success: function(returned) {
													$(".content").find('.foldersRaw').find('.dlAll').html("Download Selected");
													window.open('/daqbroker/temp/'+returned);
												},
												error:function(returned){
													$(".content").find('.foldersRaw').find('.dlAll').html("Download Selected");
													notyExpression=new Noty({
														text      :  "There was an error creating your requested file bundle | "+JSON.stringify(returned),
														theme     :  'relax',
														type      :  'error'
													}).show();
												}
											});
										});
									}
									$(".content").find('.foldersRaw').find('.folderCheck').click(function(){
										if(!$(this).prop('checked')){
											$($(this).parent()).find('.folderCheck').prop('checked',false);
											$($(this).parent()).find('.fileCheck').prop('checked',false);
										}
										else{
											$($($(this).parent()).find('.folder').find('.closed').parent()).trigger('click');
											$($(this).parent()).find('.folderCheck').prop('checked',true);
											$($(this).parent()).find('.fileCheck').prop('checked',true);
										}
										countCheckFiles();
									});
									$(".content").find('.foldersRaw').find('.fileCheck').click(function(){
										countCheckFiles();
									});
									countCheckFiles();
									$(".content").find('.foldersRaw').find('.folder').trigger('click');
								},
								error: function(returned){
									$(".content").find('.foldersRaw').empty();
									$(".content").find('.foldersRaw').append('<span style="color:#a94442;background-color:#f2dede;border-color:#ebccd1">There was a problem </span>');
								}
							});
						});
						for (var i=0; i<returned.length; i++){
							$(".content").find('.instrumentSelect').find('.instruments').append('<option value="'+i+'">'+returned[i].Name+'</option>');
						}
						$(".content").find('.instrumentSelect').find('.other').append('<option value="'+-1+'">Raw imported data</option>');
						$(".content").find('.instrumentSelect').find('.other').append('<option value="'+-2+'">Processed imported data</option>');
						$(".content").find('.instrumentSelect').find('.other').append('<option value="'+-3+'">Finalized imported data</option>');
						$(".content").find('.instrumentSelect').find('.other').append('<option value="'+-4+'">Other imported data</option>');
						if('instid' in objct){
							for (var i=0; i<returned.length; i++){
								if(Number(objct['instid'])==Number(returned[i].instid)){
									$(".content").find('.instrumentSelect').val(i);
									$(".content").find('.instrumentSelect').trigger('change');
									break;
								}
							}
						}
					}
				}
				if(objct.downloadType=="1"){//Download parsed channels
					var keysImport=Object.keys({});
					var chosenChannels=[];
					var chosenTime=[];
					$(".toolTitle").empty();
					$(".toolTitle").append('<h2 class="title" style="margin:auto;text-align:center">Data channel download</h2>');
					$(".content").css({'display':'table'});
					setupChannelSelector(0,$(".content"),returned,'channels',theNext4,-1);
				}
			},
			error: function(returned){
				$(".content").find('.errorRequest').empty()
				$(".content").find('.errorRequest').append('There was an error collecting instrument data!');
			}
		});
	}
	if(objct.type=="2"){//Collections
		$(".toolTitle").empty();
		$(".toolTitle").append('<h2 class="title" style="margin:auto;text-align:center">Collection tool</h2>');
		$.ajax({
			url: 'collections.php',
			type: 'POST',
			dataType: "json",
			data: {'dbname':dbname},
			success:function(returned){
				globalCollections=returned.collections;
				$.ajax({
					url: '../query_instruments.php',
					type: 'POST',
					dataType: "json",
					data: {'dbname':dbname},
					success: function(returned){
						$(".content").find('.errorRequest').empty();
						if(returned.errors==""){
							var instruments=returned.instruments;
							var userInput=returned.userImport;
							var keysImport=Object.keys(returned.userImport);
							$(".content").empty();
							$(".content").append('<div class="inputs" style="display:table;width:100%"><div style="display:table-cell" class="collections"><h3>Collection</h3><hr style="width:25%"><select class="collectionSelector"><option selected disabled>--- CHOOSE ONE ---</option></select></div><div style="display:table-cell" class="instrumentSelectorDiv"><h3>Instrument</h3><hr style="width:25%"><img class="loadingChannels" src="../images/loading.gif" height="75" width="75"></img></div><div style="display:table-cell;margin:auto;textalign:center" class="instChannels"><h3>Channels</h3><hr style="width:25%"><img class="loadingChannels" src="../images/loading.gif" height="75" width="75"></img></div></div><div class="submit" style="margin:auto;textalign:center"><h3>Submit</h3><hr style="width:25%"><img class="loadingChannels" src="../images/loading.gif" height="75" width="75"></img></div>');
							$(".content").find('.collectionSelector').change(function(){
								if(Number($(this).val())>=0){
									chosenChannels=globalCollections[Number($(".content").find('.collectionSelector').val())].channels;
									collectionOldName=globalCollections[Number($(".content").find('.collectionSelector').val())].Name;
								}
								else{
									chosenChannels=[];
									$(".content").find('.inputs').trigger('change');
								}
								$(".content").find('.instrumentSelectorDiv').find('.loadingChannels').remove();
								$(".content").find('.instrumentSelectorDiv').empty();
								$(".content").find('.instChannels').empty();
								$(".content").find('.instChannels').append('<h3>Channels</h3><hr style="width:25%"><img class="loadingChannels" src="../images/loading.gif" height="75" width="75"></img>');
								$(".content").find('.instrumentSelectorDiv').append('<h3>Instrument</h3><hr style="width:25%"><select class="instrumentSelect"><option selected disabled>--- CHOOSE ONE ---</option></select><div class="instrumentDetailsDiv"></div>');
								$(".content").find('.instrumentSelect').change(function(){
									var instIdx=Number($(this).val());
									if(instIdx>=0){
										var theInstrument=instruments[instIdx];
									}
									else if(instIdx==-1){
										var theInstrument=userInput.Raw;
									}
									else if(instIdx==-2){
										var theInstrument=userInput.Processed;
									}
									else if(instIdx==-3){
										var theInstrument=userInput.Finalized;
									}
									else if(instIdx==-4){
										var theInstrument=userInput.Other;
									}
									$(".content").find('.instChannels').empty();
									$(".content").find('.instrumentDetailsDiv').empty();
									if(theInstrument.active==1){
										var currentStatusText='<span style="text-style:italic;color:green">Active</span>';
									}
									else{
										var currentStatusText='<span style="text-style:italic;color:red">Inactive</span>';
									}
									$(".content").find('.instrumentDetailsDiv').append('<p>Description: <span style="font-style:italic">'+theInstrument.description+'</span></p><p>Contact: <span style="font-style:italic">'+theInstrument.email+'</span></p><p>Current node: <span style="font-style:italic">'+theInstrument.node+'</span></p><p>Current status: '+currentStatusText+'</p>');
									$(".content").find('.instChannels').append('<h3>Channels</h3><hr style="width:25%"><select multiple="multiple" class="channelSelector"><optgroup class="prevSelect" label="Previously Selected"></optgroup><optgroup class="currInst" label="'+theInstrument.name+'"></optgroup></select><p style="margin:auto;textalign:center"><button class="useAllChannels button pill">Use all channels</button> <button class="removeAllChannels button pill danger">Remove all channels</button></p>');
									var bigString='';
									if('files' in instruments[instIdx]){
										for (var i=0; i<instruments[instIdx].files.length; i++){
											var idx=0;
											if('parsingInfo' in instruments[instIdx].files[i]){
												if('channels' in instruments[instIdx].files[i].parsingInfo){
													for (var j=0; j<instruments[instIdx].files[i].parsingInfo.channels.length; j++){
														var channel=instruments[instIdx].files[i].parsingInfo.channels[j];
														if(Number(channel.channeltype)==0){
															/*$('.channelSelector').multiSelect('addOption', { value: Number(channel.channelid), text: channel.name,nested:instruments[instIdx].name});
															$('.channelSelector').multiSelect('refresh');*/
															bigString=bigString+'<option value="'+Number(channel.channelid)+'">'+channel.name+'</option>'
															idx=idx+1;
														}
													}
												}
											}
										}
									}
									$(".content").find('.channelSelector').find('.currInst').append(bigString);
									$(".content").find('.channelSelector').multiSelect({
										selectableHeader : '<div style="margin: auto;text-align: center;">Channels</div>',
										selectionHeader  : '<div style="margin: auto;text-align: center;">Chosen channels</div>',
										afterSelect: function(values){
											foundChann=false;
											for (var i=0; i<values.length; i++){
												for (var j=0; j<theInstrument.files.length; j++){
													for (var k=0; k<theInstrument.files[j].parsingInfo.channels.length; k++){
														if(Number(theInstrument.files[j].parsingInfo.channels[k].channelid)==Number(values[i])){
															var channelName=theInstrument.files[j].parsingInfo.channels[k].name;
															foundChann=true;
															chosenChannels.push({'name':theInstrument.name+' : '+channelName,'channelid':values[i],'instid':theInstrument.instid});
															break;
														}
													}
												}
											}
											if(!foundChann){//Not found on current selected instrument, checking other instruments
												for (var i=0; i<values.length; i++){
													for (var h=0; h<instruments.length; h++){
														if(h!=instIdx){
															for (var j=0; j<instruments[h].files.length; j++){
																if('parsingInfo' in instruments[h].files[j]){
																	if('channels' in instruments[h].files[j].parsingInfo){
																		for (var k=0; k<instruments[h].files[j].parsingInfo.channels.length; k++){
																			if(Number(instruments[h].files[j].parsingInfo.channels[k].channelid)==Number(values[i])){
																				var channelName=instruments[h].files[j].parsingInfo.channels[k].name;
																				foundChann=true;
																				chosenChannels.push({'name':instruments[h].name+' : '+channelName,'channelid':values[i],'instid':instruments[h].instid});
																				break;
																			}
																		}
																	}
																}
															}
														}
													}
												}
											}
											if(!foundChann){//Not found on other instruments, looking on imported data
												for (var q=0; q<values.length; q++){
													for (var i=0; i<keysImport.length; i++){
														if('files' in userInput[keysImport[i]]){
															for (var j=0; j<userInput[keysImport[i]].files.length; j++){
																if('parsingInfo' in userInput[keysImport[i]].files[j]){
																	if('channels' in userInput[keysImport[i]].files[j].parsingInfo){
																		for (var k=0; k<userInput[keysImport[i]].files[j].parsingInfo.channels.length; k++){
																			if(Number(values[q])==Number(userInput[keysImport[i]].files[j].parsingInfo.channels[k].channelid)){
																				var channelName=userInput[keysImport[i]].files[j].parsingInfo.channels[k].name;
																				foundChann=true;
																				chosenChannels.push({'name':userInput[keysImport[i]].name+' : '+channelName,'channelid':values[q],'instid':userInput[keysImport[i]].instid});
																				break;
																			}
																		}
																	}
																}
															}
														}
													}
												}
											}
										},
										afterDeselect:function(values){
											for (var i=0; i<values.length; i++){
												for (var j=0; j<chosenChannels.length; j++){
													if(Number(values[i])==Number(chosenChannels[j].channelid)){
														chosenChannels.splice(j, 1);
													}
												}
											}
										}
									});
									$(".content").find('.useAllChannels').click(function(){
										if('files' in instruments[instIdx]){
											for (var i=0; i<instruments[instIdx].files.length; i++){
												var idx=0;
												if('parsingInfo' in instruments[instIdx].files[i]){
													if('channels' in instruments[instIdx].files[i].parsingInfo){
														for(var j=0; j<instruments[instIdx].files[i].parsingInfo.channels.length; j++){
															var channel=instruments[instIdx].files[i].parsingInfo.channels[j];
															var foundChannel=false;
															for (var z=0; z<chosenChannels.length; z++){
																if(chosenChannels[z].channelid==channel.channelid){
																	foundChannel=true;
																	break
																}
															}
															if(!foundChannel){
																chosenChannels.push({'name':instruments[instIdx].name+' : '+channel.name,'channelid':channel.channelid,'instid':instruments[instIdx].instid});
															}
														}
													}
												}
											}
										}
										for (var j=0; j<$(".channelSelector").find('option').length; j++){
											$($(".channelSelector").find('option')[j]).prop('selected',true);
										}
										$('.channelSelector').multiSelect('refresh');
										$(".content").find('.inputs').trigger('change');
									});
									$(".content").find('.removeAllChannels').click(function(){
										if('files' in instruments[instIdx]){
											for (var i=0; i<instruments[instIdx].files.length; i++){
												var idx=0;
												if('parsingInfo' in instruments[instIdx].files[i]){
													if('channels' in instruments[instIdx].files[i].parsingInfo){
														for(var j=0; j<instruments[instIdx].files[i].parsingInfo.channels.length; j++){
															for (var z=0; z<chosenChannels.length; z++){
																var channel=instruments[instIdx].files[i].parsingInfo.channels[j];
																var foundChannel=false;
																if(chosenChannels[z].channelid==channel.channelid){
																	for (var t=0; t<$(".channelSelector").find('option').length; t++){
																		if(Number($($(".channelSelector").find('option')[t]).val())==channel.channelid){
																			$($(".channelSelector").find('option')[t]).prop('selected',false);
																			break
																		}
																	}
																	chosenChannels.splice(z, 1);
																}
															}
														}
													}
												}
											}
										}
										$('.channelSelector').multiSelect('refresh');
										$(".content").find('.inputs').trigger('change');
									});
									var bigString='';
									var bigString2='';
									for (var i=0; i<chosenChannels.length; i++){
										var foundChannel=false
										for (var j=0; j<$(".channelSelector").find('option').length; j++){
											if(Number($($(".channelSelector").find('option')[j]).val())==Number(chosenChannels[i].channelid)){
												$($(".channelSelector").find('option')[j]).remove();
												//$('.channelSelector').find('.currInst').append('<option selected value="'+chosenChannels[i].channelid+'">'+chosenChannels[i].name+'</option>');
												bigString=bigString+'<option selected value="'+chosenChannels[i].channelid+'">'+chosenChannels[i].name+'</option>';
												foundChannel=true;
												break
											}
										}
										if(!foundChannel){
											//$('.channelSelector').find('.prevSelect').append('<option selected value="'+chosenChannels[i].channelid+'">'+chosenChannels[i].name+'</option>');
											bigString2=bigString2+'<option selected value="'+chosenChannels[i].channelid+'">'+chosenChannels[i].name+'</option>';
										}
									}
									$('.channelSelector').find('.currInst').append(bigString);
									$('.channelSelector').find('.prevSelect').append(bigString2);
									$('.channelSelector').multiSelect('refresh');
								});
								for (var i=0; i<instruments.length; i++){
									if(Number(instruments[i].active)==1){
										$(".content").find('.instrumentSelect').append('<option value="'+i+'">'+instruments[i].name+'</option>');
									}
									else{
										$(".content").find('.instrumentSelect').append('<option disabled style="color:#a94442" value="'+i+'">'+instruments[i].name+'</option>');
									}
								}
								if(Number($(this).val())>=0){
									$(".content").find('.instrumentSelect').val(0);
									$(".content").find('.instrumentSelect').trigger('change');
									setTimeout(function () {
										$(".content").find('.submit').find('.collectionDescript').val(globalCollections[Number($(".content").find('.collectionSelector').val())].remarks.description);
										$(".content").find('.submit').find('.collectionName').val(globalCollections[Number($(".content").find('.collectionSelector').val())].Name);
										$(".content").find('.submit').find('.inputToSubmit').trigger('input');
									},300);
								}
							});
							for (var i=0; i<globalCollections.length; i++){
								$(".content").find('.collectionSelector').append('<option value="'+i+'">'+globalCollections[i].Name+'</option>');
							}
							$(".content").find('.collectionSelector').append('<option value="-1">+ New collection</option>');
						}
						$(".content").find('.inputs').change(function(){
							$(".content").find('.submit').empty();
							$(".content").find('.submit').append('<h3>Submit</h3><hr style="width:25%"><img class="loadingChannels" src="../images/loading.gif" height="75" width="75"></img>');
							if($(".content").find('.submit').find('.inputToSubmit').length<1){
								if(chosenChannels.length>1){
									$(".content").find('.submit').find('.loadingChannels').remove();
									$(".content").find('.submit').append('<div><p>Collection Name : <input class="collectionName inputToSubmit"></input></p><p>Description : <textarea class="collectionDescript inputToSubmit"></textarea></p></div>');
									if(Number($(".content").find('.collectionSelector').val())>0){
										$(".content").find('.submit').find('.collectionDescript').val(globalCollections[Number($(".content").find('.collectionSelector').val())].remarks.description);
										$(".content").find('.submit').find('.collectionName').val(globalCollections[Number($(".content").find('.collectionSelector').val())].Name);
									}
									$(".content").find('.submit').find('.inputToSubmit').on('input',function(){
										var contentIsEmpty=false;
										$(".content").find('.submit').find('.inputToSubmit').each(function(){
											if($(this).val()==''){
												contentIsEmpty=true;
											}
										});
										$($(".content").find('.submit').find('.submitCollection').parent()).remove();
										if(!contentIsEmpty){
											$(".content").find('.submit').append('<p><button class="submitCollection" style="font-size:130%">Submit</button></p>');
											$(".content").find('.submit').find(".submitCollection").click(function(){
												if(Number($('.content').find('.collectionSelector').val())<0){
													var toSend={
														'newCollection':true,
														'collectionChannels':chosenChannels,
														'description':$(".content").find('.submit').find('.collectionDescript').val(),
														'collectionName':$(".content").find('.submit').find('.collectionName').val(),
														'dbname':dbname
													}
												}
												else{
													var toSend={
														'editCollection':true,
														'collectionChannels':chosenChannels,
														'description':$(".content").find('.submit').find('.collectionDescript').val(),
														'collectionName':$(".content").find('.submit').find('.collectionName').val(),
														'collectionOldName':collectionOldName,
														'dbname':dbname
													}
												}
												$.ajax({
													url: 'collections.php',
													type: 'POST',
													dataType: "json",
													data: toSend,
													success:function(returned){
														if(returned.error=="0"){
															$(".content").prepend('<div class="info" style="margin:auto;text-algin:center"><span style="background-color:#dff0d8">Successfully submitted collection data</span></div>');
															$(".content").find('.info').fadeOut(2000,function(){
																$(".content").find('.info').remove();
																location.reload();
															});
														}
														else{
															alert(returned.errorStr+' | '+returned.errorMsg);
														}
													},
													error:function(returned){
														alert('There was an error handling your request')
													}
												});
											});
										}
									});
									if(Number($(".content").find('.collectionSelector').val())>=0){
										$(".content").find('.submit').find('.collectionName').val(globalCollections[Number($(".content").find('.collectionSelector').val())].Name);
										$(".content").find('.submit').find('.inputToSubmit').trigger('input');
										$(".content").find('.submit').find('.inputToSubmit').trigger('input');
									}
								}
							}
						});
					}
				});
			}
		});
	}
}

function zoomOutMobile() {
	var viewport = document.querySelector('meta[name="viewport"]');

	if ( viewport ) {
		viewport.content = "initial-scale=0.1";
		viewport.content = "width=1200";
	}
}

var globalPlotObject={};

function setupDestroyEntry(el,file){
	el.find('.delEntry').click(function(){
		r=confirm('This action will destroy this data record, are you sure you want to continue?');
		if(r){
			var fileAndMeta={'dbname':dbname,'instMeta':file.metaid,'filename':file.filename};
			$.ajax({
				url: 'destroyEntry.php',
				type: 'POST',
				data: fileAndMeta,
				dataType:'json',
				success: function(returned){
					if(returned.error=="0"){
						location.reload();
					}
					else{
						alert(returned.errorStr+' | '+returned.errorMYSQL);
					}
				},
				error: function(returned){
					alert('There was a problem deleting the entry');
				}
			});
		}
	});
}

function barChannelsSetup(objc){
	var thisPlotType=2;
	if(objc['barType']==1){
		
		$.ajax({
			url: '../query_instruments.php',
			type: 'POST',
			dataType: "json",
			data: {'dbname':dbname},
			success: function(returned){
				$(".content").find('.errorRequest').empty();
				if(returned.errors==""){
					var instruments=returned.instruments;
					var userInput=returned.userImport;
					var keysImport=Object.keys(returned.userImport);
					/*objc['plotting']=1;
					var path=window.location.pathname;
					var host=window.location.host;
					var url=path+buildURL(globalObject);
					window.history.pushState("", "", url);
					startSlider(globalObject);*/
					var chosenChannels2=[];
					$(".finish").find('.startPlot').unbind('click');
					$(".finish").find('.startPlot').html('Back');
					$(".finish").find('.startPlot').attr('class','back button pill danger');
					$(".finish").find('.back').click(function(){
						delete objc['dataChannels'];
						buildPage(objc);
					});
					$(".content").find('.channelSelectorDiv').empty();
					$(".content").find('.instrumentSelectorDiv').empty();
					$(".content").find('.channelSelectorDiv').append('<h3>Step 2 : Trace Channels</h3><hr><img class="loadingChannels" src="../images/loading.gif" height="75" width="75"></img><div class="instChannels"></div>');
					$(".content").find('.instrumentSelectorDiv').append('<h3>Step 2 : Instrument</h3><hr><select class="instrumentSelect"><option selected disabled>--- CHOOSE ONE ---</option><optgroup class="instruments" label="Instruments"></optgroup><optgroup class="collections" label="Collections"></optgroup></select><div class="instrumentDetailsDiv"></div>');
					$(".content").find('.instrumentSelect').change(function(){
						var instIdx=Number($(this).val());
						if(instIdx>=0){
							var theInstrument=instruments[instIdx];
						}
						else if(instIdx==-1){
							var theInstrument=userInput.Raw;
						}
						else if(instIdx==-2){
							var theInstrument=userInput.Processed;
						}
						else if(instIdx==-3){
							var theInstrument=userInput.Finalized;
						}
						else if(instIdx==-4){
							var theInstrument=userInput.Other;
						}
						else if(instIdx==-10000000000000){
							instIdx=0;
							var theInstrument=instruments[instIdx];
							var collectionName=$(".content").find('.instrumentSelect').find('option:selected').text()
							for (var i=0; i<globalCollections.length; i++){
								if(collectionName==globalCollections[i].Name){
									chosenChannels1=globalCollections[i].channels;
								}
							}
						}
						$(".content").find('.channelSelectorDiv').find(".loadingChannels").remove();
						$(".content").find('.instChannels').empty();
						$(".content").find('.instrumentDetailsDiv').empty();
						if(theInstrument.active==1){
							var currentStatusText='<span style="text-style:italic;color:green">Active</span>';
						}
						else{
							var currentStatusText='<span style="text-style:italic;color:red">Inactive</span>';
						}
						$(".content").find('.instrumentDetailsDiv').append('<p>Description: <span style="font-style:italic">'+theInstrument.description+'</span></p><p>Contact: <span style="font-style:italic">'+theInstrument.email+'</span></p><p>Current node: <span style="font-style:italic">'+theInstrument.node+'</span></p><p>Current status: '+currentStatusText+'</p>');
						$(".content").find('.instChannels').append('<div></div> <div><select multiple="multiple" class="channelSelector"><optgroup class="prevSelect" label="Previously Selected"></optgroup><optgroup class="currInst" label="'+theInstrument.name+'"></optgroup></select></div>');
						var bigString='';
						if('files' in theInstrument){
							for (var i=0; i<theInstrument.files.length; i++){
								var idx=0;
								if('parsingInfo' in theInstrument.files[i]){
									if('channels' in theInstrument.files[i].parsingInfo){
										for (var j=0; j<theInstrument.files[i].parsingInfo.channels.length; j++){
											var channel=theInstrument.files[i].parsingInfo.channels[j];
											if(Number(channel.channeltype)==0){
												/*$('.channelSelector').multiSelect('addOption', { value: Number(channel.channelid), text: channel.name,nested:theInstrument.name});
												$('.channelSelector').multiSelect('refresh');*/
												bigString=bigString+'<option value="'+Number(channel.channelid)+'">'+channel.name+'</option>';
												idx=idx+1;
											}
										}
									}
								}
							}
						}
						$('.channelSelector').find('.currInst').append(bigString);
						$('.channelSelector').multiSelect({
							selectableHeader : '<div style="margin: auto;text-align: center;">Channels</div>',
							selectionHeader  : '<div style="margin: auto;text-align: center;">Chosen channels</div>',
							afterSelect: function(values){
								var foundChann=false;
								for (var i=0; i<values.length; i++){
									for (var j=0; j<theInstrument.files.length; j++){
										for (var k=0; k<theInstrument.files[j].parsingInfo.channels.length; k++){
											if(Number(theInstrument.files[j].parsingInfo.channels[k].channelid)==Number(values[i])){
												foundChann=true;
												var channelName=theInstrument.files[j].parsingInfo.channels[k].name
												chosenChannels2.push({'name':theInstrument.name+' : '+channelName,'channelid':values[i],'instid':theInstrument.instid});
												break;
											}
										}
									}
								}
								if(!foundChann){//Not found on current selected instrument, checking other instruments
									for (var i=0; i<values.length; i++){
										for (var h=0; h<instruments.length; h++){
											if(h!=instIdx){
												for (var j=0; j<instruments[h].files.length; j++){
													if('parsingInfo' in instruments[h].files[j]){
														if('channels' in instruments[h].files[j].parsingInfo){
															for (var k=0; k<instruments[h].files[j].parsingInfo.channels.length; k++){
																if(Number(instruments[h].files[j].parsingInfo.channels[k].channelid)==Number(values[i])){
																	var channelName=instruments[h].files[j].parsingInfo.channels[k].name;
																	foundChann=true;
																	chosenChannels2.push({'name':instruments[h].name+' : '+channelName,'channelid':values[i],'instid':instruments[h].instid});
																	break;
																}
															}
														}
													}
												}
											}
										}
									}
								}
								if(!foundChann){//Not found on other instruments, looking on imported data
									for (var q=0; q<values.length; q++){
										for (var i=0; i<keysImport.length; i++){
											if('files' in userInput[keysImport[i]]){
												for (var j=0; j<userInput[keysImport[i]].files.length; j++){
													if('parsingInfo' in userInput[keysImport[i]].files[j]){
														if('channels' in userInput[keysImport[i]].files[j].parsingInfo){
															for (var k=0; k<userInput[keysImport[i]].files[j].parsingInfo.channels.length; k++){
																if(Number(values[q])==Number(userInput[keysImport[i]].files[j].parsingInfo.channels[k].channelid)){
																	var channelName=userInput[keysImport[i]].files[j].parsingInfo.channels[k].name;
																	foundChann=true;
																	chosenChannels2.push({'name':userInput[keysImport[i]].name+' : '+channelName,'channelid':values[q],'instid':userInput[keysImport[i]].instid});
																	break;
																}
															}
														}
													}
												}
											}
										}
									}
								}
								objc['dataChannels']=chosenChannels2;
								if(chosenChannels2.length>=1){
									$('.finish').empty();
									$('.finish').append('<h3>Confirm</h3><hr><div class="plotTypeConfirm">Plot type: <span class="plotTypeText emphasise"></span></div><div class="els2" style="margin:auto;display:table"><div class="els" style="marign:auto;display:table-row"><div style="display:table-cell;padding-right:15px;" class="binChannelsText"><p>Category channels:</p></div><div style="display:table-cell;padding-right:15px;" class="channelsText"><p>Traces:</p></div></div></div><div class="buttons"><button class="back button pill danger" style="font-size:20px">Back</button></div>');
									$(".finish").find('.back').click(function(){
										delete objc['dataChannels'];
										buildPage(objc);
									});
									if(thisPlotType==2){
										$('.finish').find('.plotTypeText').append('Surface');
										for (var j=0; j<objc['catChannels'].length; j++){
											if(typeof globalObject['catChannels'][j]=='object'){
												$('.finish').find('.binChannelsText').append('<p class="emphasise">'+objc['catChannels'][j].name+'</p>')
											}
											else{
												$('.finish').find('.binChannelsText').append('<p class="emphasise">Category '+j+' : '+objc['catChannels'][j]+'</p>')
											}
										}
										for (var j=0; j<chosenChannels2.length; j++){
											$('.finish').find('.channelsText').append('<p class="emphasise">'+chosenChannels2[j].name+'</p>')
										}
									}
									$('.finish').find('.emphasise').css({'font-weight':'bold'});
									$('.finish').find('.buttons').append('<button class="startPlot button pill" style="font-size:20px" value="GO">PLOT</button>');
									$('.finish').find('.startPlot').click(function(){
										$($(".backBegining").parent()).remove();
										objc['plotType']=thisPlotType;
										objc['dataChannels']=chosenChannels2;
										objc['plotting']=1;
										buildURL(objc);
										startSlider(globalObject);
									});
									var path=window.location.pathname;
									var host=window.location.host;
									var url=path+buildURL(objc);
									window.history.pushState("", "", url);
								}
							},
							afterDeselect: function(values){
								for (var i=0; i<values.length; i++){
									for (var j=0; j<chosenChannels2.length; j++){
										if(Number(values[i])==Number(chosenChannels2[j].channelid)){
											chosenChannels2.splice(j, 1);
										}
									}
								}
								objc['dataChannels']=chosenChannels2;
								if(chosenChannels2.length<1){
									$('.finish').empty();
									$('.finish').append('<h3>Confirm</h3><hr><div class="plotTypeConfirm">Plot type: <span class="plotTypeText emphasise"></span></div><div class="els2" style="margin:auto;display:table"><div class="els" style="marign:auto;display:table-row"><div style="display:table-cell;padding-right:15px;" class="binChannelsText"><p>Category channels:</p></div><div style="display:table-cell;padding-right:15px;" class="channelsText"><p>Data Channels:</p></div></div></div><div class="buttons"><button class="back button pill danger" style="font-size:20px">Back</button></div>');
									$(".finish").find('.back').click(function(){
										delete objc['dataChannels'];
										buildPage(objc);
									});
									delete objc['channels'];
									var path=window.location.pathname;
									var host=window.location.host;
									var url=path+buildURL(objc);
									window.history.pushState("", "", url);
									if(thisPlotType==2){
										$('.finish').find('.plotTypeText').append('Surface');
										for (var j=0; j<objc['catChannels'].length; j++){
											if(typeof globalObject['catChannels'][j]=='object'){
												$('.finish').find('.binChannelsText').append('<p class="emphasise">'+objc['catChannels'][j].name+'</p>')
											}
											else{
												$('.finish').find('.binChannelsText').append('<p class="emphasise">Bin '+j+' : '+objc['catChannels'][j]+'</p>')
											}
										}
										for (var j=0; j<chosenChannels2.length; j++){
											$('.finish').find('.channelsText').append('<p class="emphasise">'+chosenChannels2[j].name+'</p>')
										}
									}
									$('.finish').find('.emphasise').css({'font-weight':'bold'});
								}
								else{
									objc['plotType']=thisPlotType;
									objc['dataChannels']=chosenChannels2;
									delete objc['plotting'];
									var path=window.location.pathname;
									var host=window.location.host;
									var url=path+buildURL(objc);
									window.history.pushState("", "", url);
									$('.finish').empty();
									$('.finish').append('<h3>Confirm</h3><hr><div class="plotTypeConfirm">Plot type: <span class="plotTypeText emphasise"></span></div><div class="els2" style="margin:auto;display:table"><div class="els" style="marign:auto;display:table-row"><div style="display:table-cell;padding-right:15px;" class="binChannelsText"><p>Category channels:</p></div><div style="display:table-cell;padding-right:15px;" class="channelsText"><p>Data Channels:</p></div></div></div><div class="buttons"><button class="back button pill danger" style="font-size:20px">Back</button></div>');
									$(".finish").find('.back').click(function(){
										delete objc['dataChannels'];
										buildPage(objc);
									});
									
									$('.channelSelector').multiSelect('refresh');
									$('.finish').find('.buttons').append('<button class="startPlot button pill" style="font-size:20px" value="GO">PLOT</button>');
									$('.finish').find('.startPlot').click(function(){
										$($(".backBegining").parent()).remove();
										objc['plotType']=thisPlotType;
										objc['dataChannels']=chosenChannels2;
										objc['plotting']=1;
										buildURL(objc);
										startSlider(globalObject);
									});
									if(thisPlotType==2){
										$('.finish').find('.plotTypeText').append('Surface');
										for (var j=0; j<objc['catChannels'].length; j++){
											if(typeof globalObject['catChannels'][j]=='object'){
												$('.finish').find('.binChannelsText').append('<p class="emphasise">'+objc['catChannels'][j].name+'</p>')
											}
											else{
												$('.finish').find('.binChannelsText').append('<p class="emphasise">Category '+j+' : '+objc['catChannels'][j]+'</p>')
											}
										}
										for (var j=0; j<chosenChannels2.length; j++){
											$('.finish').find('.channelsText').append('<p class="emphasise">'+chosenChannels2[j].name+'</p>')
										}
									}
									$('.finish').find('.emphasise').css({'font-weight':'bold'});
								}
							}
						});
						if('dataChannels' in objc){
							if(chosenChannels2.length<1){
								for (var i=0; i<instruments.length; i++){
									for (var j=0; j<instruments[i].files.length; j++){
										if('parsingInfo' in instruments[i].files[j]){
											if('channels' in instruments[i].files[j].parsingInfo){
												for (var k=0; k<instruments[i].files[j].parsingInfo.channels.length; k++){
													for (var l=0; l<objc['dataChannels'].length; l++){
														if(typeof objc['dataChannels'][l]==='object'){
															if(Number(objc['dataChannels'][l].channelid)==Number(instruments[i].files[j].parsingInfo.channels[k].channelid)){
																//$('.channelSelector').find('.prevSelect').append('<option selected value="'+Number(globalObject['channels'][l])+'">'+instruments[i].name+':'+instruments[i].files[j].parsingInfo.channels[k].name+'</option>');
																chosenChannels2.push({'name':instruments[i].name+' : '+instruments[i].files[j].parsingInfo.channels[k].name,'channelid':Number(objc['dataChannels'][l].channelid),'instid':instruments[i].instid});
																break;
															}
														}
														else{
															if(Number(objc['dataChannels'][l])==Number(instruments[i].files[j].parsingInfo.channels[k].channelid)){
																//$('.channelSelector').find('.prevSelect').append('<option selected value="'+Number(globalObject['channels'][l])+'">'+instruments[i].name+':'+instruments[i].files[j].parsingInfo.channels[k].name+'</option>');
																chosenChannels2.push({'name':instruments[i].name+' : '+instruments[i].files[j].parsingInfo.channels[k].name,'channelid':Number(objc['dataChannels'][l]),'instid':instruments[i].instid});
																break;
															}
														}
													}
												}
											}
										}
									}
								}
								for (var i=0; i<keysImport.length; i++){
									if('files' in userInput[keysImport[i]]){
										for (var j=0; j<userInput[keysImport[i]].files.length; j++){
											if('parsingInfo' in userInput[keysImport[i]].files[j]){
												if('channels' in userInput[keysImport[i]].files[j].parsingInfo){
													for (var k=0; k<userInput[keysImport[i]].files[j].parsingInfo.channels.length; k++){
														for (var l=0; l<objc['dataChannels'].length; l++){
															if(typeof objc['dataChannels'][l]==='object'){
																if(Number(objc['dataChannels'][l].channelid)==Number(userInput[keysImport[i]].files[j].parsingInfo.channels[k].channelid)){
																	//$('.channelSelector').find('.prevSelect').append('<option selected value="'+Number(globalObject['channels'][l])+'">'+instruments[i].name+':'+instruments[i].files[j].parsingInfo.channels[k].name+'</option>');
																	chosenChannels2.push({'name':userInput[keysImport[i]].name+' : '+userInput[keysImport[i]].files[j].parsingInfo.channels[k].name,'channelid':Number(objc['dataChannels'][l].channelid),'instid':userInput[keysImport[i]].instid});
																	break;
																}
															}
															else{
																if(Number(objc['dataChannels'][l])==Number(userInput[keysImport[i]].files[j].parsingInfo.channels[k].channelid)){
																	//$('.channelSelector').find('.prevSelect').append('<option selected value="'+Number(globalObject['channels'][l])+'">'+instruments[i].name+':'+instruments[i].files[j].parsingInfo.channels[k].name+'</option>');
																	chosenChannels2.push({'name':userInput[keysImport[i]].name+' : '+userInput[keysImport[i]].files[j].parsingInfo.channels[k].name,'channelid':Number(objc['dataChannels'][l]),'instid':userInput[keysImport[i]].instid});
																	break;
																}
															}
														}
													}
												}
											}
										}
									}
								}
							}
							if(chosenChannels2.length>=1){
								$('.finish').empty();
								$('.finish').append('<h3>Confirm</h3><hr><div class="plotTypeConfirm">Plot type: <span class="plotTypeText emphasise"></span></div><div class="els2" style="margin:auto;display:table"><div class="els" style="marign:auto;display:table-row"><div style="display:table-cell;padding-right:15px;" class="binChannelsText"><p>Categories:</p></div><div style="display:table-cell;padding-right:15px;" class="channelsText"><p>Channels:</p></div></div></div><div class="buttons"><button class="back button pill danger" style="font-size:20px">Back</button></div>');
								$(".finish").find('.back').click(function(){
									delete objc['dataChannels'];
									buildPage(objc);
								});
								$('.finish').append('<button class="startPlot button pill" style="font-size:20px" value="GO">PLOT</button>');
								$('.finish').find('.startPlot').click(function(){
									$($(".backBegining").parent()).remove();
									objc['plotType']=thisPlotType;
									objc['dataChannels']=chosenChannels2;
									objc['plotting']=1;buildURL(globalObject)
									startSlider(globalObject);
								});
								if(thisPlotType==2){
									$('.finish').find('.plotTypeText').append('Surface');
									for (var j=0; j<objc['catChannels'].length; j++){
										if(typeof globalObject['catChannels'][j]=='object'){
											$('.finish').find('.binChannelsText').append('<p class="emphasise">'+objc['catChannels'][j].name+'</p>')
										}
										else{
											$('.finish').find('.binChannelsText').append('<p class="emphasise">Category '+j+' : '+objc['catChannels'][j]+'</p>')
										}
									}
									for (var k=0; k<chosenChannels2.length; k++){
										$('.finish').find('.channelsText').append('<p class="emphasise">'+chosenChannels2[k].name+'</p>');
									}
								}
								$('.finish').find('.emphasise').css({'font-weight':'bold'});
							}
						}
						for (var i=0; i<chosenChannels2.length; i++){
							var foundChannel=false
							for (var j=0; j<$(".channelSelector").find('option').length; j++){
								if(Number($($(".channelSelector").find('option')[j]).val())==Number(chosenChannels2[i].channelid)){
									$($(".channelSelector").find('option')[j]).remove();
									$('.channelSelector').find('.currInst').append('<option selected value="'+chosenChannels2[i].channelid+'">'+chosenChannels2[i].name+'</option>');
									foundChannel=true;
									break
								}
							}
							if(!foundChannel){
								$('.channelSelector').find('.prevSelect').append('<option selected value="'+chosenChannels2[i].channelid+'">'+chosenChannels2[i].name+'</option>');
							}
						}
						$('.channelSelector').multiSelect('refresh');
						$('.ms-container').css({
							'margin':'auto',
							'text-algin':'center'
						});
						
						if('plotting' in globalObject){
							$('.finish').find('.startPlot').trigger('click');
						}
					});
					for (var i=0; i<returned.instruments.length; i++){
						if(Number(returned.instruments[i].active)==1){
							$(".content").find('.instrumentSelect').find('.instruments').append('<option value="'+i+'">'+returned.instruments[i].name+'</option>');
						}
						else{
							$(".content").find('.instrumentSelect').find('.instruments').append('<option disabled style="color:#a94442" value="'+i+'">'+returned.instruments[i].name+'</option>');
						}
					}
					for (var i=0; i<globalCollections.length; i++){
						$(".content").find('.instrumentSelect').find('.collections').append('<option value="-10000000000000">'+globalCollections[i].name+'</option>');
					}
					if('dataChannels' in objc){
						$('.instrumentSelect').val($($('.instrumentSelect').find('option')[1]).val());
						$('.instrumentSelect').trigger('change');
					}
					if('plotting' in objc){
						$('.finish').find('.startPlot').trigger('click');
					}
				}
			}
		});
	}
	else if(objc['barType']==2){
		$.ajax({
			url: '../query_instruments.php',
			type: 'POST',
			dataType: "json",
			data: {'dbname':dbname},
			success: function(returned){
				$(".content").find('.errorRequest').empty();
				if(returned.errors==""){
					var instruments=returned.instruments;
					var userInput=returned.userImport;
					var keysImport=Object.keys(returned.userImport);
					dataChannelMatrix=[];
					if('dataChannels' in objc){
						for (var l=0; l<objc['dataChannels'].length; l++){
							chosenChannels2=[];
							for (var o=0; o<objc['dataChannels'][l].length; o++){
								for (var i=0; i<instruments.length; i++){
									for (var j=0; j<instruments[i].files.length; j++){
										if('parsingInfo' in instruments[i].files[j]){
											if('channels' in instruments[i].files[j].parsingInfo){
												for (var k=0; k<instruments[i].files[j].parsingInfo.channels.length; k++){
													if(typeof objc['dataChannels'][l][o]==='object'){
														if(Number(objc['dataChannels'][l][o].channelid)==Number(instruments[i].files[j].parsingInfo.channels[k].channelid)){
															//$('.channelSelector').find('.prevSelect').append('<option selected value="'+Number(globalObject['channels'][l])+'">'+instruments[i].name+':'+instruments[i].files[j].parsingInfo.channels[k].name+'</option>');
															chosenChannels2.push({'name':instruments[i].name+' : '+instruments[i].files[j].parsingInfo.channels[k].name,'channelid':Number(objc['dataChannels'][l][o].channelid),'instid':instruments[i].instid});
															objc['dataChannels'][l][o]=chosenChannels2[chosenChannels2.length-1];
															break;
														}
													}
													else{
														if(Number(objc['dataChannels'][l][o])==Number(instruments[i].files[j].parsingInfo.channels[k].channelid)){
															//$('.channelSelector').find('.prevSelect').append('<option selected value="'+Number(globalObject['channels'][l])+'">'+instruments[i].name+':'+instruments[i].files[j].parsingInfo.channels[k].name+'</option>');
															chosenChannels2.push({'name':instruments[i].name+' : '+instruments[i].files[j].parsingInfo.channels[k].name,'channelid':Number(objc['dataChannels'][l][o]),'instid':instruments[i].instid});
															objc['dataChannels'][l][o]=chosenChannels2[chosenChannels2.length-1];
															break;
														}
													}
												}
											}
										}
									}
								}
								for (var i=0; i<keysImport.length; i++){
									if('files' in userInput[keysImport[i]]){
										for (var j=0; j<userInput[keysImport[i]].files.length; j++){
											if('parsingInfo' in userInput[keysImport[i]].files[j]){
												if('channels' in userInput[keysImport[i]].files[j].parsingInfo){
													for (var k=0; k<userInput[keysImport[i]].files[j].parsingInfo.channels.length; k++){
														if(typeof objc['dataChannels'][l][o]==='object'){
															if(Number(objc['dataChannels'][l][o].channelid)==Number(userInput[keysImport[i]].files[j].parsingInfo.channels[k].channelid)){
																//$('.channelSelector').find('.prevSelect').append('<option selected value="'+Number(globalObject['channels'][l])+'">'+instruments[i].name+':'+instruments[i].files[j].parsingInfo.channels[k].name+'</option>');
																chosenChannels2.push({'name':instruments[i].name+' : '+instruments[i].files[j].parsingInfo.channels[k].name,'channelid':Number(objc['dataChannels'][l][o].channelid),'instid':instruments[i].instid});
																objc['dataChannels'][l][o]=chosenChannels2[chosenChannels2.length-1];
																break;
															}
														}
														else{
															
															if(Number(objc['dataChannels'][l][o])==Number(userInput[keysImport[i]].files[j].parsingInfo.channels[k].channelid)){
																//$('.channelSelector').find('.prevSelect').append('<option selected value="'+Number(globalObject['channels'][l])+'">'+instruments[i].name+':'+instruments[i].files[j].parsingInfo.channels[k].name+'</option>');
																chosenChannels2.push({'name':instruments[i].name+' : '+instruments[i].files[j].parsingInfo.channels[k].name,'channelid':Number(objc['dataChannels'][l][o]),'instid':instruments[i].instid});
																objc['dataChannels'][l][o]=chosenChannels2[chosenChannels2.length-1];
																break;
															}
														}
													}
												}
											}
										}
									}
								}
							}
							//dataChannelMatrix.push(chosenChannels2);
						}
						dataChannelMatrix=objc['dataChannels'];
					}
					else{
						dataChannelMatrix.push([]);
					}
					newTraceSetup(objc,dataChannelMatrix,true);
				}
			}
		});
	}
}

function newTraceSetup(objc,traceChannels,backed){
	if(!backed){
		traceChannels.push([]);
		var chosenChannels2=[];
	}
	else{
		chosenChannels2=traceChannels[traceChannels.length-1];
		objc['dataChannels']=traceChannels;
	}
	var thisPlotType=2;
	$.ajax({
		url: '../query_instruments.php',
		type: 'POST',
		dataType: "json",
		data: {'dbname':dbname},
		success: function(returned){
			$(".content").find('.errorRequest').empty();
			if(returned.errors==""){
				var instruments=returned.instruments;
				var userInput=returned.userImport;
				var keysImport=Object.keys(returned.userImport);
				var path=window.location.pathname;
				var host=window.location.host;
				var url=path+buildURL(globalObject);
				window.history.pushState("", "", url);
				$(".finish").find('.startPlot').unbind('click');
				$(".finish").find('.startPlot').html('Back');
				$(".finish").find('.startPlot').attr('class','back button pill danger');
				$(".finish").find('.back').click(function(){
					if(traceChannels.length<=1){
						delete objc['dataChannels'];
						buildPage(objc);
					}
					else{
						traceChannels.splice(traceChannels.length-1,1);
						newTraceSetup(objc,traceChannels,true);
					}
				});
				$(".content").find('.channelSelectorDiv').empty();
				$(".content").find('.instrumentSelectorDiv').empty();
				$(".content").find('.channelSelectorDiv').append('<h3>Step 2 : Data Channels</h3><hr><img class="loadingChannels" src="../images/loading.gif" height="75" width="75"></img><div class="instChannels"></div>');
				$(".content").find('.instrumentSelectorDiv').append('<h3>Step 2 : Instrument</h3><hr><select class="instrumentSelect"><option selected disabled>--- CHOOSE ONE ---</option><optgroup class="instruments" label="Instruments"></optgroup><optgroup class="collections" label="Collections"></optgroup></select><div class="instrumentDetailsDiv"></div>');
				$(".content").find('.instrumentSelect').change(function(){
					var instIdx=Number($(this).val());
					if(instIdx>=0){
						var theInstrument=instruments[instIdx];
					}
					else if(instIdx==-1){
						var theInstrument=userInput.Raw;
					}
					else if(instIdx==-2){
						var theInstrument=userInput.Processed;
					}
					else if(instIdx==-3){
						var theInstrument=userInput.Finalized;
					}
					else if(instIdx==-4){
						var theInstrument=userInput.Other;
					}
					else if(instIdx==-10000000000000){
						instIdx=0;
						var theInstrument=instruments[instIdx];
						var collectionName=$(".content").find('.instrumentSelect').find('option:selected').text()
						for (var i=0; i<globalCollections.length; i++){
							if(collectionName==globalCollections[i].Name){
								chosenChannels2=globalCollections[i].channels;
							}
						}
					}
					$(".content").find('.channelSelectorDiv').find(".loadingChannels").remove();
					$(".content").find('.instChannels').empty();
					$(".content").find('.instrumentDetailsDiv').empty();
					if(theInstrument.active==1){
						var currentStatusText='<span style="text-style:italic;color:green">Active</span>';
					}
					else{
						var currentStatusText='<span style="text-style:italic;color:red">Inactive</span>';
					}
					$(".content").find('.instrumentDetailsDiv').append('<p>Description: <span style="font-style:italic">'+theInstrument.description+'</span></p><p>Contact: <span style="font-style:italic">'+theInstrument.email+'</span></p><p>Current node: <span style="font-style:italic">'+theInstrument.node+'</span></p><p>Current status: '+currentStatusText+'</p>');
					$(".content").find('.instChannels').append('<div></div> <div><select multiple="multiple" class="channelSelector"><optgroup class="prevSelect" label="Previously Selected"></optgroup><optgroup class="currInst" label="'+theInstrument.name+'"></optgroup></select></div>');
					var bigString='';
					if('dataChannels' in objc){
						if('files' in theInstrument){
							for (var i=0; i<theInstrument.files.length; i++){
								var idx=0;
								if('parsingInfo' in theInstrument.files[i]){
									if('channels' in theInstrument.files[i].parsingInfo){
										for (var j=0; j<theInstrument.files[i].parsingInfo.channels.length; j++){
											var channel=theInstrument.files[i].parsingInfo.channels[j];
											if(Number(channel.channeltype)==0){
												/*$('.channelSelector').multiSelect('addOption', { value: Number(channel.channelid), text: channel.name,nested:theInstrument.name});
												$('.channelSelector').multiSelect('refresh');*/
												bigString=bigString+'<option value="'+Number(channel.channelid)+'">'+channel.name+'</option>';
												idx=idx+1;
											}
										}
									}
								}
							}
						}
					}
					$('.channelSelector').find('.currInst').append(bigString);
					$('.channelSelector').multiSelect({
						selectableHeader : '<div style="margin: auto;text-align: center;">Channels</div>',
						selectionHeader  : '<div style="margin: auto;text-align: center;">Chosen channels</div>',
						afterSelect: function(values){
							foundChann=false;
							for (var i=0; i<values.length; i++){
								for (var j=0; j<theInstrument.files.length; j++){
									for (var k=0; k<theInstrument.files[j].parsingInfo.channels.length; k++){
										if(Number(theInstrument.files[j].parsingInfo.channels[k].channelid)==Number(values[i])){
											var channelName=theInstrument.files[j].parsingInfo.channels[k].name
											chosenChannels2.push({'name':theInstrument.name+' : '+channelName,'channelid':values[i],'instid':theInstrument.instid});
											traceChannels[traceChannels.length-1]=chosenChannels2;
											foundChann=true;
											break;
										}
									}
								}
							}
							if(!foundChann){//Not found on current selected instrument, checking other instruments
								for (var i=0; i<values.length; i++){
									for (var h=0; h<instruments.length; h++){
										if(h!=instIdx){
											for (var j=0; j<instruments[h].files.length; j++){
												if('parsingInfo' in instruments[h].files[j]){
													if('channels' in instruments[h].files[j].parsingInfo){
														for (var k=0; k<instruments[h].files[j].parsingInfo.channels.length; k++){
															if(Number(instruments[h].files[j].parsingInfo.channels[k].channelid)==Number(values[i])){
																var channelName=instruments[h].files[j].parsingInfo.channels[k].name;
																chosenChannels2.push({'name':theInstrument.name+' : '+channelName,'channelid':values[i],'instid':theInstrument.instid});
																traceChannels[traceChannels.length-1]=chosenChannels2;
																foundChann=true;
																break;
															}
														}
													}
												}
											}
										}
									}
								}
							}
							if(!foundChann){//Not found on other instruments, looking on imported data
								for (var q=0; q<values.length; q++){
									for (var i=0; i<keysImport.length; i++){
										if('files' in userInput[keysImport[i]]){
											for (var j=0; j<userInput[keysImport[i]].files.length; j++){
												if('parsingInfo' in userInput[keysImport[i]].files[j]){
													if('channels' in userInput[keysImport[i]].files[j].parsingInfo){
														for (var k=0; k<userInput[keysImport[i]].files[j].parsingInfo.channels.length; k++){
															if(Number(values[q])==Number(userInput[keysImport[i]].files[j].parsingInfo.channels[k].channelid)){
																var channelName=userInput[keysImport[i]].files[j].parsingInfo.channels[k].name;
																chosenChannels2.push({'name':theInstrument.name+' : '+channelName,'channelid':values[i],'instid':theInstrument.instid});
																traceChannels[traceChannels.length-1]=chosenChannels2;
																foundChann=true;
																break;
															}
														}
													}
												}
											}
										}
									}
								}
							}
							objc['dataChannels']=traceChannels;
							if(chosenChannels2.length>=1){
								$('.finish').empty();
								$('.finish').append('<h3>Confirm</h3><hr><div class="plotTypeConfirm">Plot type: <span class="plotTypeText emphasise"></span></div><div class="els2" style="margin:auto;display:table"><div class="els" style="marign:auto;display:table-row"><div style="display:table-cell;padding-right:15px;" class="binChannelsText"><p>Categories:</p></div></div></div><div class="buttons"><button class="back button pill danger" style="font-size:20px">Back</button></div>');
								$(".finish").find('.back').click(function(){
									if(traceChannels.length<=1){
										delete objc['dataChannels'];
										buildPage(objc);
									}
									else{
										traceChannels.splice(traceChannels.length-1,1);
										newTraceSetup(objc,traceChannels,true);
									}
								});
								if(chosenChannels2.length==objc['catChannels'].length){
									var options=$('.channelSelector').find('option');
									for (var i=0; i<options.length; i++){
										if(!$(options[i]).prop('selected') && !($(options[i]).prop('title')=='Channel already used as a bin')){
											$(options[i]).prop('disabled',true);
											$(options[i]).prop('title','All other bins are associated with a channel! Consider making more bins or deselect data channels');
										}
									}
									$('.channelSelector').multiSelect('refresh');
									$('.finish').find('.buttons').append('<button class="newTrace button pill" style="font-size:20px" value="GO">New Trace</button>');
									$('.finish').find('.newTrace').click(function(){
										newTraceSetup(objc,traceChannels,false);
									});
									$('.finish').find('.buttons').append('<button class="startPlot button pill" style="font-size:20px" value="GO">PLOT</button>');
									$('.finish').find('.startPlot').click(function(){
										$($(".backBegining").parent()).remove();
										objc['plotType']=thisPlotType;
										//objc['dataChannels']=chosenChannels2;
										//traceChannels[traceChannels.length-1]=chosenChannels2;
										objc['dataChannels']=traceChannels;
										objc['plotting']=1;buildURL(objc);
										startSlider(globalObject);
									});
								}
								else{
									var options=$('.channelSelector').find('option');
									for (var i=0; i<options.length; i++){
										if(!$(options[i]).prop('selected') && !($(options[i]).prop('title')=='Channel already used')){
											$(options[i]).prop('disabled',false);
											$(options[i]).prop('title','');
										}
									}
									$('.channelSelector').multiSelect('refresh');
								}
								if(thisPlotType==2){
									$('.finish').find('.plotTypeText').append('Surface');
									for (var j=0; j<objc['catChannels'].length; j++){
										if(typeof globalObject['catChannels'][j]=='object'){
											$('.finish').find('.binChannelsText').append('<p class="emphasise">'+objc['catChannels'][j].name+'</p>')
										}
										else{
											$('.finish').find('.binChannelsText').append('<p class="emphasise">Category '+j+' : '+objc['catChannels'][j]+'</p>')
										}
									}
									for (var j=0; j<traceChannels.length; j++){
										$('.finish').find('.els').append('<div style="display:table-cell;padding-right:15px;" class="catChannels '+j+'"><p>Trace '+j+':</p></div>');
										for (var k=0; k<traceChannels[j].length; k++){
											$('.finish').find('.catChannels.'+j).append('<p class="emphasise">'+traceChannels[j][k].name+'</p>');
										}
									}
								}
								$('.finish').find('.emphasise').css({'font-weight':'bold'});
								var path=window.location.pathname;
								var host=window.location.host;
								var url=path+buildURL(objc);
								window.history.pushState("", "", url);
							}
						},
						afterDeselect: function(values){
							for (var i=0; i<values.length; i++){
								for (var j=0; j<chosenChannels2.length; j++){
									if(Number(values[i])==Number(chosenChannels2[j].channelid)){
										chosenChannels2.splice(j, 1);
										traceChannels[traceChannels.length-1]=chosenChannels2;
									}
								}
							}
							//objc['dataChannels']=chosenChannels2;
							objc['dataChannels']=traceChannels;
							if(chosenChannels2.length<1){
								$('.finish').empty();
								$('.finish').append('<h3>Confirm</h3><hr><div class="plotTypeConfirm">Plot type: <span class="plotTypeText emphasise"></span></div><div class="els2" style="margin:auto;display:table"><div class="els" style="marign:auto;display:table-row"><div style="display:table-cell;padding-right:15px;" class="binChannelsText"><p>Categories:</p></div></div></div><div class="buttons"><button class="back button pill danger" style="font-size:20px">Back</button></div>');
								$(".finish").find('.back').click(function(){
									if(traceChannels.length<=1){
										delete objc['dataChannels'];
										buildPage(objc);
									}
									else{
										traceChannels.splice(traceChannels.length-1,1);
										newTraceSetup(objc,traceChannels,true);
									}
								});
								delete objc['channels'];
								var path=window.location.pathname;
								var host=window.location.host;
								var url=path+buildURL(objc);
								window.history.pushState("", "", url);
								if(thisPlotType==2){
									$('.finish').find('.plotTypeText').append('Surface');
									for (var j=0; j<objc['catChannels'].length; j++){
										if(typeof globalObject['catChannels'][j]=='object'){
											$('.finish').find('.binChannelsText').append('<p class="emphasise">'+objc['catChannels'][j].name+'</p>')
										}
										else{
											$('.finish').find('.binChannelsText').append('<p class="emphasise">Bin '+j+' : '+objc['catChannels'][j]+'</p>')
										}
									}
									for (var j=0; j<traceChannels.length; j++){
										$('.finish').find('.els').append('<div style="display:table-cell;padding-right:15px;" class="catChannels '+j+'"><p>Trace '+j+':</p></div>');
										for (var k=0; k<traceChannels[j].length; k++){
											$('.finish').find('.catChannels.'+j).append('<p class="emphasise">'+traceChannels[j][k].name+'</p>');
										}
									}
								}
								$('.finish').find('.emphasise').css({'font-weight':'bold'});
							}
							else{
								objc['plotType']=thisPlotType;
								//objc['dataChannels']=chosenChannels2;
								objc['dataChannels']=traceChannels;
								delete objc['plotting'];
								var path=window.location.pathname;
								var host=window.location.host;
								var url=path+buildURL(objc);
								window.history.pushState("", "", url);
								$('.finish').empty();
								$('.finish').append('<h3>Confirm</h3><hr><div class="plotTypeConfirm">Plot type: <span class="plotTypeText emphasise"></span></div><div class="els2" style="margin:auto;display:table"><div class="els" style="marign:auto;display:table-row"><div style="display:table-cell;padding-right:15px;" class="binChannelsText"><p>Bins:</p></div><div style="display:table-cell;padding-right:15px;" class="channelsText"><p>Channels:</p></div></div></div><div class="buttons"><button class="back button pill danger" style="font-size:20px">Back</button></div>');
								$(".finish").find('.back').click(function(){
									if(traceChannels.length<=1){
										delete objc['dataChannels'];
										buildPage(objc);
									}
									else{
										traceChannels.splice(traceChannels.length-1,1);
										newTraceSetup(objc,traceChannels,true);
									}
								});
								if(chosenChannels2.length!=objc['catChannels'].length){
									var options=$('.channelSelector').find('option');
									for (var i=0; i<options.length; i++){
										if(!$(options[i]).prop('selected') && !($(options[i]).prop('title')=='Channel already used')){
											$(options[i]).prop('disabled',false);
											$(options[i]).prop('title','');
										}
									}
									$('.channelSelector').multiSelect('refresh');
								}
								else{
									var options=$('.channelSelector').find('option');
									for (var i=0; i<options.length; i++){
										if(!$(options[i]).prop('selected') && !($(options[i]).prop('title')=='Channel already')){
											$(options[i]).prop('disabled',true);
											$(options[i]).prop('title','All categories are associated with a channel! Try making another trace');
										}
									}
									$('.channelSelector').multiSelect('refresh');
									
									$('.finish').find('.buttons').append('<button class="newTrace button pill" style="font-size:20px" value="GO">New trace</button>');
									$('.finish').find('.newTrace').click(function(){
										newTraceSetup(objc,traceChannels,false);
									});
									$('.finish').find('.buttons').append('<button class="startPlot button pill" style="font-size:20px" value="GO">PLOT</button>');
									$('.finish').find('.startPlot').click(function(){
										$($(".backBegining").parent()).remove();
										objc['plotType']=thisPlotType;
										//objc['dataChannels']=chosenChannels2;
										objc['dataChannels']=traceChannels;
										objc['plotting']=1;buildURL(objc);
										startSlider(globalObject);
									});
								}
								if(thisPlotType==2){
									$('.finish').find('.plotTypeText').append('Surface');
									for (var j=0; j<objc['catChannels'].length; j++){
										if(typeof globalObject['catChannels'][j]=='object'){
											$('.finish').find('.binChannelsText').append('<p class="emphasise">'+objc['catChannels'][j].name+'</p>')
										}
										else{
											$('.finish').find('.binChannelsText').append('<p class="emphasise">Category '+j+' : '+objc['catChannels'][j]+'</p>')
										}
									}
									for (var j=0; j<traceChannels.length; j++){
										$('.finish').find('.els').append('<div style="display:table-cell;padding-right:15px;" class="catChannels '+j+'"><p>Trace '+j+':</p></div>');
										for (var k=0; k<traceChannels[j].length; k++){
											$('.finish').find('.catChannels.'+j).append('<p class="emphasise">'+traceChannels[j][k].name+'</p>');
										}
									}
								}
								$('.finish').find('.emphasise').css({'font-weight':'bold'});
							}
						}
					});
					if('dataChannels' in objc){
						/* if(chosenChannels2.length<1){
							for (var i=0; i<instruments.length; i++){
								for (var j=0; j<instruments[i].files.length; j++){
									if('parsingInfo' in instruments[i].files[j]){
										if('channels' in instruments[i].files[j].parsingInfo){
											for (var k=0; k<instruments[i].files[j].parsingInfo.channels.length; k++){
												for (var l=0; l<objc['dataChannels'].length; l++){
													chosenChannels2=[];
													for (var o=0; o<objc['dataChannels'].length; o++){
														if(typeof objc['dataChannels'][l][0]==='object'){
															if(Number(objc['dataChannels'][l][0].channelid)==Number(instruments[i].files[j].parsingInfo.channels[k].channelid)){
																//$('.channelSelector').find('.prevSelect').append('<option selected value="'+Number(globalObject['channels'][l])+'">'+instruments[i].name+':'+instruments[i].files[j].parsingInfo.channels[k].name+'</option>');
																chosenChannels2.push({'name':instruments[i].name+' : '+instruments[i].files[j].parsingInfo.channels[k].name,'channelid':Number(objc['dataChannels'][l][0].channelid),'instid':instruments[i].instid});
																break;
															}
														}
														else{
															if(Number(objc['dataChannels'][l][0])==Number(instruments[i].files[j].parsingInfo.channels[k].channelid)){
																//$('.channelSelector').find('.prevSelect').append('<option selected value="'+Number(globalObject['channels'][l])+'">'+instruments[i].name+':'+instruments[i].files[j].parsingInfo.channels[k].name+'</option>');
																chosenChannels2.push({'name':instruments[i].name+' : '+instruments[i].files[j].parsingInfo.channels[k].name,'channelid':Number(objc['dataChannels'][l][0]),'instid':instruments[i].instid});
																break;
															}
														}
													}
													traceChannels.push(chosenChannels2);
												}
											}
										}
									}
								}
							}
							for (var i=0; i<keysImport.length; i++){
								if('files' in userInput[keysImport[i]]){
									for (var j=0; j<userInput[keysImport[i]].files.length; j++){
										if('parsingInfo' in userInput[keysImport[i]].files[j]){
											if('channels' in userInput[keysImport[i]].files[j].parsingInfo){
												for (var k=0; k<userInput[keysImport[i]].files[j].parsingInfo.channels.length; k++){
													chosenChannels2=[];
													for (var l=0; l<objc['dataChannels'][objc['dataChannels'].length-1].length; l++){
														for (var o=0; o<objc['dataChannels'][l].length; o++){
															if(typeof objc['dataChannels'][l][o]==='object'){
																if(Number(objc['dataChannels'][l][o].channelid)==Number(userInput[keysImport[i]].files[j].parsingInfo.channels[k].channelid)){
																	//$('.channelSelector').find('.prevSelect').append('<option selected value="'+Number(globalObject['channels'][l])+'">'+instruments[i].name+':'+instruments[i].files[j].parsingInfo.channels[k].name+'</option>');
																	chosenChannels2.push({'name':userInput[keysImport[i]].name+' : '+userInput[keysImport[i]].files[j].parsingInfo.channels[k].name,'channelid':Number(objc['dataChannels'][l][o].channelid),'instid':userInput[keysImport[i]].instid});
																	break;
																}
															}
															else{
																if(Number(objc['dataChannels'][l][o])==Number(userInput[keysImport[i]].files[j].parsingInfo.channels[k].channelid)){
																	//$('.channelSelector').find('.prevSelect').append('<option selected value="'+Number(globalObject['channels'][l])+'">'+instruments[i].name+':'+instruments[i].files[j].parsingInfo.channels[k].name+'</option>');
																	chosenChannels2.push({'name':userInput[keysImport[i]].name+' : '+userInput[keysImport[i]].files[j].parsingInfo.channels[k].name,'channelid':Number(objc['dataChannels'][l][o]),'instid':userInput[keysImport[i]].instid});
																	break;
																}
															}
														}
													}
													traceChannels.push(chosenChannels2);
												}
											}
										}
									}
								}
							}
						} */
						if(chosenChannels2.length>=1){
							$('.finish').empty();
							$('.finish').append('<h3>Confirm</h3><hr><div class="plotTypeConfirm">Plot type: <span class="plotTypeText emphasise"></span></div><div class="els2" style="margin:auto;display:table"><div class="els" style="marign:auto;display:table-row"><div style="display:table-cell;padding-right:15px;" class="binChannelsText"><p>Bins:</p></div><div style="display:table-cell;padding-right:15px;" class="channelsText"><p>Channels:</p></div></div></div><div class="buttons"><button class="back button pill danger" style="font-size:20px">Back</button></div>');
							$(".finish").find('.back').click(function(){
								if(traceChannels.length<=1){
									delete objc['dataChannels'];
									buildPage(objc);
								}
								else{
									traceChannels.splice(traceChannels.length-1,1);
									newTraceSetup(objc,traceChannels,true);
								}
							});
							if(chosenChannels2.length==objc['catChannels'].length){
								$('.finish').find('.buttons').append('<button class="newTrace button pill" style="font-size:20px" value="GO">New trace</button>');
								$('.finish').find('.newTrace').click(function(){
									newTraceSetup(objc,traceChannels,false);
								});
								$('.finish').append('<button class="startPlot button pill" style="font-size:20px" value="GO">PLOT</button>');
								$('.finish').find('.startPlot').click(function(){
									objc['plotType']=thisPlotType;
									//objc['dataChannels']=chosenChannels2;
									objc['plotting']=1;
									objc['dataChannels']=traceChannels;
									var path=window.location.pathname;
									var host=window.location.host;
									var url=path+buildURL(globalObject);
									window.history.pushState("", "", url);
									startSlider(globalObject);
								});
								/*if('plotting' in objc){
									$('.finish').find('.startPlot').trigger('click');
								}*/
							}
							if(thisPlotType==2){
								$('.finish').find('.plotTypeText').append('Surface');
								for (var j=0; j<objc['catChannels'].length; j++){
									if(typeof globalObject['catChannels'][j]=='object'){
										$('.finish').find('.binChannelsText').append('<p class="emphasise">'+objc['catChannels'][j].name+'</p>')
									}
									else{
										$('.finish').find('.binChannelsText').append('<p class="emphasise">Category '+j+' : '+objc['catChannels'][j]+'</p>')
									}
								}
								for (var j=0; j<traceChannels.length; j++){
									$('.finish').find('.els').append('<div style="display:table-cell;padding-right:15px;" class="catChannels '+j+'"><p>Trace '+j+':</p></div>');
									for (var k=0; k<traceChannels[j].length; k++){
										$('.finish').find('.catChannels.'+j).append('<p class="emphasise">'+traceChannels[j][k].name+'</p>');
									}
								}
							}
							$('.finish').find('.emphasise').css({'font-weight':'bold'});
						}
						else{
							$('.finish').empty();
							$('.finish').append('<h3>Confirm</h3><hr><div class="plotTypeConfirm">Plot type: <span class="plotTypeText emphasise"></span></div><div class="els2" style="margin:auto;display:table"><div class="els" style="marign:auto;display:table-row"><div style="display:table-cell;padding-right:15px;" class="binChannelsText"><p>Bins:</p></div><div style="display:table-cell;padding-right:15px;" class="channelsText"><p>Channels:</p></div></div></div><div class="buttons"><button class="back button pill danger" style="font-size:20px">Back</button></div>');
							$(".finish").find('.back').click(function(){
								if(traceChannels.length<=1){
									delete objc['dataChannels'];
									buildPage(objc);
								}
								else{
									traceChannels.splice(traceChannels.length-1,1);
									newTraceSetup(objc,traceChannels,true);
								}
							});
							if(thisPlotType==2){
								$('.finish').find('.plotTypeText').append('Surface');
								for (var j=0; j<objc['catChannels'].length; j++){
									if(typeof globalObject['catChannels'][j]=='object'){
										$('.finish').find('.binChannelsText').append('<p class="emphasise">'+objc['catChannels'][j].name+'</p>')
									}
									else{
										$('.finish').find('.binChannelsText').append('<p class="emphasise">Category '+j+' : '+objc['catChannels'][j]+'</p>')
									}
								}
								for (var j=0; j<traceChannels.length; j++){
									$('.finish').find('.els').append('<div style="display:table-cell;padding-right:15px;" class="catChannels '+j+'"><p>Trace '+j+':</p></div>');
									for (var k=0; k<traceChannels[j].length; k++){
										$('.finish').find('.catChannels.'+j).append('<p class="emphasise">'+traceChannels[j][k].name+'</p>');
									}
								}
							}
							$('.finish').find('.emphasise').css({'font-weight':'bold'});
						}
						if('plotting' in globalObject){
							$('.finish').find('.startPlot').trigger('click');
						}
					}
/* 					for (var i=0; i<objc['dataChannels'][objc['dataChannels'].length-1].length; i++){
						var foundChannel=false
						for (var j=0; j<$(".channelSelector").find('option').length; j++){
							if(Number($($(".channelSelector").find('option')[j]).val())==Number(objc['dataChannels'][objc['dataChannels'].length-1][i].channelid)){
								$($(".channelSelector").find('option')[j]).remove();
								$('.channelSelector').find('.currInst').append('<option selected value="'+objc['dataChannels'][objc['dataChannels'].length-1][i].channelid+'">'+objc['dataChannels'][objc['dataChannels'].length-1][i].name+'</option>');
								foundChannel=true;
								break
							}
						}
						if(!foundChannel){
							$('.channelSelector').find('.prevSelect').append('<option selected value="'+objc['dataChannels'][objc['dataChannels'].length-1][i].channelid+'">'+objc['dataChannels'][objc['dataChannels'].length-1][i].name+'</option>');
						}
					} */
					for (var i=0; i<chosenChannels2.length; i++){
						var foundChannel=false
						for (var j=0; j<$(".channelSelector").find('option').length; j++){
							if(Number($($(".channelSelector").find('option')[j]).val())==Number(chosenChannels2[i].channelid)){
								$($(".channelSelector").find('option')[j]).remove();
								$('.channelSelector').find('.currInst').append('<option selected value="'+chosenChannels2[i].channelid+'">'+chosenChannels2[i].name+'</option>');
								foundChannel=true;
								break
							}
						}
						if(!foundChannel){
							$('.channelSelector').find('.prevSelect').append('<option selected value="'+chosenChannels2[i].channelid+'">'+chosenChannels2[i].name+'</option>');
						}
					}
					var opts=$('.channelSelector').find('option');
					for (var q=0; q<globalObject['dataChannels'].length-1; q++){
						for (var l=0; l<globalObject['dataChannels'][q].length; l++){
							for (var j=0; j<opts.length; j++){
								if(globalObject['dataChannels'][q][l].channelid==$(opts[j]).val() && !$(opts[j]).prop('selected')){
									$(opts[j]).prop('disabled',true);
									$(opts[j]).prop('title','Channel already used');
									break
								}
							}
						}
					}
					$('.channelSelector').multiSelect('refresh');
					$('.ms-container').css({
						'margin':'auto',
						'text-algin':'center'
					});
					if(objc['dataChannels'][objc['dataChannels'].length-1].length==objc['catChannels'].length){
						/*$('.finish').append('<button class="newTrace button pill" style="font-size:20px" value="GO">New Trace</button>');
						$('.finish').find('.newTrace').click(function(){
							newTraceSetup(objc,traceChannels,false);
						});
						$('.finish').append('<button class="startPlot button pill" style="font-size:20px" value="GO">PLOT</button>');
						$('.finish').find('.startPlot').click(function(){
							objc['plotType']=thisPlotType;
							objc['dataChannels']=chosenChannels2;
							var path=window.location.pathname;
							var host=window.location.host;
							var url=path+buildURL(globalObject);
							window.history.pushState("", "", url);
							startSlider(globalObject);
						});*/
						var options=$('.channelSelector').find('option');
						for (var i=0; i<options.length; i++){
							if(!$(options[i]).prop('selected')){
								$(options[i]).prop('disabled',true);
								$(options[i]).prop('title','All other bins are associated with a channel! Consider making more bins or deselect data channels');
							}
						}
						$('.channelSelector').multiSelect('refresh');
					}
					var opts=$('.channelSelector').find('option');
					$('.channelSelector').multiSelect('refresh');
				});
				$('.finish').empty();
				$('.finish').append('<h3>Confirm</h3><hr><div class="plotTypeConfirm">Plot type: <span class="plotTypeText emphasise"></span></div><div class="els2" style="margin:auto;display:table"><div class="els" style="marign:auto;display:table-row"><div style="display:table-cell;padding-right:15px;" class="binChannelsText"><p>Categories:</p></div></div></div><div class="buttons"><button class="back button pill danger" style="font-size:20px">Back</button></div>');
				$(".finish").find('.back').click(function(){
					if(traceChannels.length<=1){
						delete objc['dataChannels'];
						buildPage(objc);
					}
					else{
						traceChannels.splice(traceChannels.length-1,1);
						newTraceSetup(objc,traceChannels,true);
					}
				});
				if(thisPlotType==2){
					$('.finish').find('.plotTypeText').append('Surface');
					for (var j=0; j<objc['catChannels'].length; j++){
						if(typeof globalObject['catChannels'][j]=='object'){
							$('.finish').find('.binChannelsText').append('<p class="emphasise">'+objc['catChannels'][j].name+'</p>')
						}
						else{
							$('.finish').find('.binChannelsText').append('<p class="emphasise">Category '+j+' : '+objc['catChannels'][j]+'</p>')
						}
					}
					for (var j=0; j<traceChannels.length; j++){
						$('.finish').find('.els').append('<div style="display:table-cell;padding-right:15px;" class="catChannels '+j+'"><p>Trace '+(j+1)+':</p></div>');
						for (var k=0; k<traceChannels[j].length; k++){
							$('.finish').find('.catChannels.'+j).append('<p class="emphasise">'+traceChannels[j][k].name+'</p>');
						}
					}
				}
				$('.finish').find('.emphasise').css({'font-weight':'bold'});
				for (var i=0; i<returned.instruments.length; i++){
					if(Number(returned.instruments[i].active)==1){
						$(".content").find('.instrumentSelect').find('.instruments').append('<option value="'+i+'">'+returned.instruments[i].name+'</option>');
					}
					else{
						$(".content").find('.instrumentSelect').find('.instruments').append('<option disabled style="color:#a94442" value="'+i+'">'+returned.instruments[i].name+'</option>');
					}
				}
				for (var i=0; i<globalCollections.length; i++){
					$(".content").find('.instrumentSelect').find('.collections').append('<option value="-10000000000000">'+globalCollections[i].Name+'</option>');
				}
				if('dataChannels' in objc){
					$('.instrumentSelect').val($($('.instrumentSelect').find('option')[1]).val());
					$('.instrumentSelect').trigger('change');
				}
				if('plotting' in objc){
					$('.finish').find('.startPlot').trigger('click');
				}
			}
		}
	});
}

function surfaceChannelsSetup(objc){
	var thisPlotType=1;
	$.ajax({
		url: '../query_instruments.php',
		type: 'POST',
		dataType: "json",
		data: {'dbname':dbname},
		success: function(returned){
			$(".content").find('.errorRequest').empty();
			if(returned.errors==""){
				var instruments=returned.instruments;
				var userInput=returned.userImport;
				var keysImport=Object.keys(returned.userImport);
				var chosenChannels2=[];
				$(".finish").find('.startPlot').unbind('click');
				$(".finish").find('.startPlot').html('Back');
				$(".finish").find('.startPlot').attr('class','back button pill danger');
				$(".finish").find('.back').click(function(){
					delete objc['dataChannels'];
					buildPage(objc);
				});
				$(".content").find('.channelSelectorDiv').empty();
				$(".content").find('.instrumentSelectorDiv').empty();
				$(".content").find('.channelSelectorDiv').append('<h3>Step 2 : Data Channels</h3><hr><img class="loadingChannels" src="../images/loading.gif" height="75" width="75"></img><div class="instChannels"></div>');
				$(".content").find('.instrumentSelectorDiv').append('<h3>Step 2 : Instrument</h3><hr><select class="instrumentSelect"><option selected disabled>--- CHOOSE ONE ---</option><optgroup class="instruments" label="Instruments"></optgroup><optgroup class="collections" label="Collections"></optgroup></select><div class="instrumentDetailsDiv"></div>');
				$(".content").find('.instrumentSelect').change(function(){
					var instIdx=Number($(this).val());
					if(instIdx>=0){
						var theInstrument=instruments[instIdx];
					}
					else if(instIdx==-1){
						var theInstrument=userInput.Raw;
					}
					else if(instIdx==-2){
						var theInstrument=userInput.Processed;
					}
					else if(instIdx==-3){
						var theInstrument=userInput.Finalized;
					}
					else if(instIdx==-4){
						var theInstrument=userInput.Other;
					}
					else if(instIdx==-10000000000000){
						instIdx=0;
						var theInstrument=instruments[instIdx];
						var collectionName=$(".content").find('.instrumentSelect').find('option:selected').text()
						for (var i=0; i<globalCollections.length; i++){
							if(collectionName==globalCollections[i].Name){
								chosenChannels2=globalCollections[i].channels;
							}
						}
					}
					$(".content").find('.channelSelectorDiv').find(".loadingChannels").remove();
					$(".content").find('.instChannels').empty();
					$(".content").find('.instrumentDetailsDiv').empty();
					if(theInstrument.active==1){
						var currentStatusText='<span style="text-style:italic;color:green">Active</span>';
					}
					else{
						var currentStatusText='<span style="text-style:italic;color:red">Inactive</span>';
					}
					$(".content").find('.instrumentDetailsDiv').append('<p>Description: <span style="font-style:italic">'+theInstrument.description+'</span></p><p>Contact: <span style="font-style:italic">'+theInstrument.email+'</span></p><p>Current node: <span style="font-style:italic">'+theInstrument.node+'</span></p><p>Current status: '+currentStatusText+'</p>');
					$(".content").find('.instChannels').append('<div></div> <div><select multiple="multiple" class="channelSelector"><optgroup class="prevSelect" label="Previously Selected"></optgroup><optgroup class="currInst" label="'+theInstrument.name+'"></optgroup></select></div>');
					var bigString=''
					if('files' in theInstrument){
						for (var i=0; i<theInstrument.files.length; i++){
							var idx=0;
							if('parsingInfo' in theInstrument.files[i]){
								if('channels' in theInstrument.files[i].parsingInfo){
									for (var j=0; j<theInstrument.files[i].parsingInfo.channels.length; j++){
										var channel=theInstrument.files[i].parsingInfo.channels[j];
										if(Number(channel.channeltype)==0){
											/*$('.channelSelector').multiSelect('addOption', { value: Number(channel.channelid), text: channel.name,nested:theInstrument.name});
											$('.channelSelector').multiSelect('refresh');*/
											bigString=bigString+'<option value="'+Number(channel.channelid)+'">'+channel.name+'</option>';
											idx=idx+1;
										}
									}
								}
							}
						}
					}
					$('.channelSelector').find('.currInst').append(bigString);
					$('.channelSelector').multiSelect({
						selectableHeader : '<div style="margin: auto;text-align: center;">Channels</div>',
						selectionHeader  : '<div style="margin: auto;text-align: center;">Chosen channels</div>',
						afterSelect: function(values){
							for (var i=0; i<values.length; i++){
								for (var j=0; j<theInstrument.files.length; j++){
									for (var k=0; k<theInstrument.files[j].parsingInfo.channels.length; k++){
										if(Number(theInstrument.files[j].parsingInfo.channels[k].channelid)==Number(values[i])){
											var channelName=theInstrument.files[j].parsingInfo.channels[k].name
											chosenChannels2.push({'name':theInstrument.name+' : '+channelName,'channelid':values[i],'instid':theInstrument.instid});
											break;
										}
									}
								}
							}
							objc['dataChannels']=chosenChannels2;
							if(chosenChannels2.length>=1){
								$('.finish').empty();
								$('.finish').append('<h3>Confirm</h3><hr><div class="plotTypeConfirm">Plot type: <span class="plotTypeText emphasise"></span></div><div class="els2" style="margin:auto;display:table"><div class="els" style="marign:auto;display:table-row"><div style="display:table-cell;padding-right:15px;" class="binChannelsText"><p>Bins:</p></div><div style="display:table-cell;padding-right:15px;" class="channelsText"><p>Channels:</p></div></div></div><div class="buttons"><button class="back button pill danger" style="font-size:20px">Back</button></div>');
								$(".finish").find('.back').click(function(){
									delete objc['dataChannels'];
									buildPage(objc);
								});
								if(chosenChannels2.length==objc['binChannels'].length){
									var options=$('.channelSelector').find('option');
									for (var i=0; i<options.length; i++){
										if(!$(options[i]).prop('selected') && !($(options[i]).prop('title')=='Channel already used as a bin')){
											$(options[i]).prop('disabled',true);
											$(options[i]).prop('title','All other bins are associated with a channel! Consider making more bins or deselect data channels');
										}
									}
									$('.channelSelector').multiSelect('refresh');
									$('.finish').find('.buttons').append('<button class="startPlot button pill" style="font-size:20px" value="GO">PLOT</button>');
									$('.finish').find('.startPlot').click(function(){
										objc['plotType']=thisPlotType;
										objc['dataChannels']=chosenChannels2;
										objc['plotting']=1;
										var path=window.location.pathname;
										var host=window.location.host;
										var url=path+buildURL(objc);
										window.history.pushState("", "", url);
										startSlider(globalObject);
									});
								}
								else{
									var options=$('.channelSelector').find('option');
									for (var i=0; i<options.length; i++){
										if(!$(options[i]).prop('selected') && !($(options[i]).prop('title')=='Channel already used as a bin')){
											$(options[i]).prop('disabled',false);
											$(options[i]).prop('title','');
										}
									}
									$('.channelSelector').multiSelect('refresh');
								}
								if(thisPlotType==1){
									$('.finish').find('.plotTypeText').append('Surface');
									for (var j=0; j<objc['binChannels'].length; j++){
										if(typeof globalObject['binChannels'][j]=='object'){
											$('.finish').find('.binChannelsText').append('<p class="emphasise">'+objc['binChannels'][j].name+'</p>')
										}
										else{
											$('.finish').find('.binChannelsText').append('<p class="emphasise">Bin '+(j+1)+' : '+objc['binChannels'][j]+'</p>')
										}
									}
									for (var j=0; j<chosenChannels2.length; j++){
										$('.finish').find('.channelsText').append('<p class="emphasise">'+chosenChannels2[j].name+'</p>')
									}
								}
								$('.finish').find('.emphasise').css({'font-weight':'bold'});
								var path=window.location.pathname;
								var host=window.location.host;
								var url=path+buildURL(objc);
								window.history.pushState("", "", url);
							}
						},
						afterDeselect: function(values){
							for (var i=0; i<values.length; i++){
								for (var j=0; j<chosenChannels2.length; j++){
									if(Number(values[i])==Number(chosenChannels2[j].channelid)){
										chosenChannels2.splice(j, 1);
									}
								}
							}
							objc['dataChannels']=chosenChannels2;
							if(chosenChannels2.length<1){
								$('.finish').empty();
								$('.finish').append('<h3>Confirm</h3><hr><div class="plotTypeConfirm">Plot type: <span class="plotTypeText emphasise"></span></div><div class="els2" style="margin:auto;display:table"><div class="els" style="marign:auto;display:table-row"><div style="display:table-cell;padding-right:15px;" class="binChannelsText"><p>Bins:</p></div><div style="display:table-cell;padding-right:15px;" class="channelsText"><p>Channels:</p></div></div></div><div class="buttons"><button class="back button pill danger" style="font-size:20px">Back</button></div>');
								$(".finish").find('.back').click(function(){
									delete objc['dataChannels'];
									buildPage(objc);
								});
								delete objc['channels'];
								var path=window.location.pathname;
								var host=window.location.host;
								var url=path+buildURL(objc);
								window.history.pushState("", "", url);
								if(thisPlotType==1){
									$('.finish').find('.plotTypeText').append('Surface');
									for (var j=0; j<objc['binChannels'].length; j++){
										if(typeof globalObject['binChannels'][j]=='object'){
											$('.finish').find('.binChannelsText').append('<p class="emphasise">'+objc['binChannels'][j].name+'</p>')
										}
										else{
											$('.finish').find('.binChannelsText').append('<p class="emphasise">Bin '+(j+1)+' : '+objc['binChannels'][j]+'</p>')
										}
									}
									for (var j=0; j<chosenChannels2.length; j++){
										$('.finish').find('.channelsText').append('<p class="emphasise">'+chosenChannels2[j].name+'</p>')
									}
								}
								$('.finish').find('.emphasise').css({'font-weight':'bold'});
							}
							else{
								objc['plotType']=thisPlotType;
								objc['dataChannels']=chosenChannels2;
								delete objc['plotting'];
								var path=window.location.pathname;
								var host=window.location.host;
								var url=path+buildURL(objc);
								window.history.pushState("", "", url);
								$('.finish').empty();
								$('.finish').append('<h3>Confirm</h3><hr><div class="plotTypeConfirm">Plot type: <span class="plotTypeText emphasise"></span></div><div class="els2" style="margin:auto;display:table"><div class="els" style="marign:auto;display:table-row"><div style="display:table-cell;padding-right:15px;" class="binChannelsText"><p>Bins:</p></div><div style="display:table-cell;padding-right:15px;" class="channelsText"><p>Channels:</p></div></div></div><div class="buttons"><button class="back button pill danger" style="font-size:20px">Back</button></div>');
								$(".finish").find('.back').click(function(){
									delete objc['dataChannels'];
									buildPage(objc);
								});
								if(chosenChannels2.length!=objc['binChannels'].length){
									var options=$('.channelSelector').find('option');
									for (var i=0; i<options.length; i++){
										if(!$(options[i]).prop('selected') && !($(options[i]).prop('title')=='Channel already used as a bin')){
											$(options[i]).prop('disabled',false);
											$(options[i]).prop('title','');
										}
									}
									$('.channelSelector').multiSelect('refresh');
								}
								else{
									var options=$('.channelSelector').find('option');
									for (var i=0; i<options.length; i++){
										if(!$(options[i]).prop('selected') && !($(options[i]).prop('title')=='Channel already used as a bin')){
											$(options[i]).prop('disabled',true);
											$(options[i]).prop('title','All other bins are associated with a channel! Consider making more bins or deselect data channels');
										}
									}
									$('.channelSelector').multiSelect('refresh');
									$('.finish').find('.buttons').append('<button class="startPlot button pill" style="font-size:20px" value="GO">PLOT</button>');
									$('.finish').find('.startPlot').click(function(){
										objc['plotType']=thisPlotType;
										objc['dataChannels']=chosenChannels2;
										objc['plotting']=1;
										var path=window.location.pathname;
										var host=window.location.host;
										var url=path+buildURL(objc);
										window.history.pushState("", "", url);
										startSlider(globalObject);
									});
								}
								if(thisPlotType==1){
									$('.finish').find('.plotTypeText').append('Surface');
									for (var j=0; j<objc['binChannels'].length; j++){
										if(typeof globalObject['binChannels'][j]=='object'){
											$('.finish').find('.binChannelsText').append('<p class="emphasise">'+objc['binChannels'][j].name+'</p>')
										}
										else{
											$('.finish').find('.binChannelsText').append('<p class="emphasise">Bin '+(j+1)+' : '+objc['binChannels'][j]+'</p>')
										}
									}
									for (var j=0; j<chosenChannels2.length; j++){
										$('.finish').find('.channelsText').append('<p class="emphasise">'+chosenChannels2[j].name+'</p>')
									}
								}
								$('.finish').find('.emphasise').css({'font-weight':'bold'});
							}
						}
					});
					if('dataChannels' in objc){
						if(chosenChannels2.length<1){
							for (var i=0; i<instruments.length; i++){
								for (var j=0; j<instruments[i].files.length; j++){
									if('parsingInfo' in instruments[i].files[j]){
										if('channels' in instruments[i].files[j].parsingInfo){
											for (var k=0; k<instruments[i].files[j].parsingInfo.channels.length; k++){
												for (var l=0; l<objc['dataChannels'].length; l++){
													if(typeof objc['dataChannels'][l]==='object'){
														if(Number(objc['dataChannels'][l].channelid)==Number(instruments[i].files[j].parsingInfo.channels[k].channelid)){
															//$('.channelSelector').find('.prevSelect').append('<option selected value="'+Number(globalObject['channels'][l])+'">'+instruments[i].name+':'+instruments[i].files[j].parsingInfo.channels[k].name+'</option>');
															chosenChannels2.push({'name':instruments[i].name+' : '+instruments[i].files[j].parsingInfo.channels[k].name,'channelid':Number(objc['dataChannels'][l].channelid),'instid':instruments[i].instid});
															break;
														}
													}
													else{
														if(Number(objc['dataChannels'][l])==Number(instruments[i].files[j].parsingInfo.channels[k].channelid)){
															//$('.channelSelector').find('.prevSelect').append('<option selected value="'+Number(globalObject['channels'][l])+'">'+instruments[i].name+':'+instruments[i].files[j].parsingInfo.channels[k].name+'</option>');
															chosenChannels2.push({'name':instruments[i].name+' : '+instruments[i].files[j].parsingInfo.channels[k].name,'channelid':Number(objc['dataChannels'][l]),'instid':instruments[i].instid});
															break;
														}
													}
												}
											}
										}
									}
								}
							}
							for (var i=0; i<keysImport.length; i++){
								if('files' in userInput[keysImport[i]]){
									for (var j=0; j<userInput[keysImport[i]].files.length; j++){
										if('parsingInfo' in userInput[keysImport[i]].files[j]){
											if('channels' in userInput[keysImport[i]].files[j].parsingInfo){
												for (var k=0; k<userInput[keysImport[i]].files[j].parsingInfo.channels.length; k++){
													for (var l=0; l<objc['dataChannels'].length; l++){
														if(typeof objc['dataChannels'][l]==='object'){
															if(Number(objc['dataChannels'][l].channelid)==Number(userInput[keysImport[i]].files[j].parsingInfo.channels[k].channelid)){
																//$('.channelSelector').find('.prevSelect').append('<option selected value="'+Number(globalObject['channels'][l])+'">'+instruments[i].name+':'+instruments[i].files[j].parsingInfo.channels[k].name+'</option>');
																chosenChannels2.push({'name':userInput[keysImport[i]].name+' : '+userInput[keysImport[i]].files[j].parsingInfo.channels[k].name,'channelid':Number(objc['dataChannels'][l].channelid),'instid':userInput[keysImport[i]].instid});
																break;
															}
														}
														else{
															if(Number(objc['dataChannels'][l])==Number(userInput[keysImport[i]].files[j].parsingInfo.channels[k].channelid)){
																//$('.channelSelector').find('.prevSelect').append('<option selected value="'+Number(globalObject['channels'][l])+'">'+instruments[i].name+':'+instruments[i].files[j].parsingInfo.channels[k].name+'</option>');
																chosenChannels2.push({'name':userInput[keysImport[i]].name+' : '+userInput[keysImport[i]].files[j].parsingInfo.channels[k].name,'channelid':Number(objc['dataChannels'][l]),'instid':userInput[keysImport[i]].instid});
																break;
															}
														}
													}
												}
											}
										}
									}
								}
							}
						}
						if(chosenChannels2.length>=1){
							$('.finish').empty();
							$('.finish').append('<h3>Confirm</h3><hr><div class="plotTypeConfirm">Plot type: <span class="plotTypeText emphasise"></span></div><div class="els2" style="margin:auto;display:table"><div class="els" style="marign:auto;display:table-row"><div style="display:table-cell;padding-right:15px;" class="binChannelsText"><p>Bins:</p></div><div style="display:table-cell;padding-right:15px;" class="channelsText"><p>Channels:</p></div></div></div><div class="buttons"><button class="back button pill danger" style="font-size:20px">Back</button></div>');
							$(".finish").find('.back').click(function(){
								delete objc['dataChannels'];
								buildPage(objc);
							});
							if(chosenChannels2.length==objc['binChannels'].length){
								$('.finish').append('<button class="startPlot button pill" style="font-size:20px" value="GO">PLOT</button>');
								$('.finish').find('.startPlot').click(function(){
									objc['plotType']=thisPlotType;
									objc['dataChannels']=chosenChannels2;
									var path=window.location.pathname;
									var host=window.location.host;
									var url=path+buildURL(globalObject);
									window.history.pushState("", "", url);
									startSlider(globalObject);
								});
								if('plotting' in objc){
									$('.finish').find('.startPlot').trigger('click');
								}
							}
							if(thisPlotType==1){
								$('.finish').find('.plotTypeText').append('Surface');
								for (var j=0; j<objc['binChannels'].length; j++){
									if(typeof globalObject['binChannels'][j]=='object'){
										$('.finish').find('.binChannelsText').append('<p class="emphasise">'+objc['binChannels'][j].name+'</p>')
									}
									else{
										$('.finish').find('.binChannelsText').append('<p class="emphasise">Bin '+(j+1)+' : '+objc['binChannels'][j]+'</p>')
									}
								}
								for (var j=0; j<chosenChannels2.length; j++){
									$('.finish').find('.channelsText').append('<p class="emphasise">'+chosenChannels2[j].name+'</p>')
								}
							}
							$('.finish').find('.emphasise').css({'font-weight':'bold'});
						}
						else{
							$('.finish').empty();
							$('.finish').append('<h3>Confirm</h3><hr><div class="plotTypeConfirm">Plot type: <span class="plotTypeText emphasise"></span></div><div class="els2" style="margin:auto;display:table"><div class="els" style="marign:auto;display:table-row"><div style="display:table-cell;padding-right:15px;" class="binChannelsText"><p>Bins:</p></div><div style="display:table-cell;padding-right:15px;" class="channelsText"><p>Channels:</p></div></div></div><div class="buttons"><button class="back button pill danger" style="font-size:20px">Back</button></div>');
							$(".finish").find('.back').click(function(){
								delete objc['dataChannels'];
								buildPage(objc);
							});
							if(thisPlotType==1){
								$('.finish').find('.plotTypeText').append('Surface');
								for (var j=0; j<objc['binChannels'].length; j++){
									if(typeof globalObject['binChannels'][j]=='object'){
										$('.finish').find('.binChannelsText').append('<p class="emphasise">'+objc['binChannels'][j].name+'</p>')
									}
									else{
										$('.finish').find('.binChannelsText').append('<p class="emphasise">Bin '+(j+1)+' : '+objc['binChannels'][j]+'</p>')
									}
								}
								for (var j=0; j<chosenChannels2.length; j++){
									$('.finish').find('.channelsText').append('<p class="emphasise">'+chosenChannels2[j].name+'</p>')
								}
							}
							$('.finish').find('.emphasise').css({'font-weight':'bold'});
						}
					}
					for (var i=0; i<chosenChannels2.length; i++){
						var foundChannel=false
						for (var j=0; j<$(".channelSelector").find('option').length; j++){
							if(Number($($(".channelSelector").find('option')[j]).val())==Number(chosenChannels2[i].channelid)){
								$($(".channelSelector").find('option')[j]).remove();
								$('.channelSelector').find('.currInst').append('<option selected value="'+chosenChannels2[i].channelid+'">'+chosenChannels2[i].name+'</option>');
								foundChannel=true;
								break
							}
						}
						if(!foundChannel){
							$('.channelSelector').find('.prevSelect').append('<option selected value="'+chosenChannels2[i].channelid+'">'+chosenChannels2[i].name+'</option>');
						}
					}
					$('.channelSelector').multiSelect('refresh');
					$('.ms-container').css({
						'margin':'auto',
						'text-algin':'center'
					});
					if(chosenChannels2.length==objc['binChannels'].length){
						var options=$('.channelSelector').find('option');
						for (var i=0; i<options.length; i++){
							if(!$(options[i]).prop('selected')){
								$(options[i]).prop('disabled',true);
								$(options[i]).prop('title','All other bins are associated with a channel! Consider making more bins or deselect data channels');
							}
						}
						$('.channelSelector').multiSelect('refresh');
					}
					var opts=$('.channelSelector').find('option');
					if(globalObject["surfaceType"]==1){
						for (var q=0; q<globalObject['binChannels'].length; q++){
							for (var j=0; j<opts.length; j++){
								if(globalObject['binChannels'][q].channelid==$(opts[j]).val() && !$(opts[j]).prop('selected')){
									$(opts[j]).prop('disabled',true);
									$(opts[j]).prop('title','Channel already used as a bin');
									break
								}
							}
						}
					}
					$('.channelSelector').multiSelect('refresh');
				});
				for (var i=0; i<returned.instruments.length; i++){
					if(Number(returned.instruments[i].active)==1){
						$(".content").find('.instrumentSelect').find('.instruments').append('<option value="'+i+'">'+returned.instruments[i].name+'</option>');
					}
					else{
						$(".content").find('.instrumentSelect').find('.instruments').append('<option disabled style="color:#a94442" value="'+i+'">'+returned.instruments[i].name+'</option>');
					}
				}
				for (var i=0; i<globalCollections.length; i++){
					$(".content").find('.instrumentSelect').find('.collections').append('<option value="-10000000000000">'+globalCollections[i].Name+'</option>');
				}
				$('.finish').empty();
				$('.finish').append('<h3>Confirm</h3><hr><div class="plotTypeConfirm">Plot type: <span class="plotTypeText emphasise"></span></div><div class="els2" style="margin:auto;display:table"><div class="els" style="marign:auto;display:table-row"><div style="display:table-cell;padding-right:15px;" class="binChannelsText"><p>Category channels:</p></div><div style="display:table-cell;padding-right:15px;" class="channelsText"><p>Data Channels:</p></div></div></div><div class="buttons"><button class="back button pill danger" style="font-size:20px">Back</button></div>');
				$(".finish").find('.back').click(function(){
					delete objc['dataChannels'];
					buildPage(objc);
				});
				if(thisPlotType==1){
					$('.finish').find('.plotTypeText').append('Surface');
					for (var j=0; j<objc['binChannels'].length; j++){
						if(typeof globalObject['binChannels'][j]=='object'){
							$('.finish').find('.binChannelsText').append('<p class="emphasise">'+objc['binChannels'][j].name+'</p>')
						}
						else{
							$('.finish').find('.binChannelsText').append('<p class="emphasise">Bin '+(j+1)+' : '+objc['binChannels'][j]+'</p>')
						}
					}
					for (var j=0; j<chosenChannels2.length; j++){
						$('.finish').find('.channelsText').append('<p class="emphasise">'+chosenChannels2[j].name+'</p>')
					}
				}
				$('.finish').find('.emphasise').css({'font-weight':'bold'});
				if('dataChannels' in objc){
					$('.instrumentSelect').val($($('.instrumentSelect').find('option')[1]).val());
					$('.instrumentSelect').trigger('change');
				}
			}
		}
	});
}

function ValidURL(str) {
	console.log(str);
	var regexp = /(ftp|http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?/
	return regexp.test(str);
}

var globalSelectedforResponsiveLeft=0;
var globalSelectedforResponsiveRight=0;
var isDefaultHiddenLeft=true;
var isDefaultHiddenRight=true;

function startSlider(objct){
	$($(".backBegining").parent()).remove();
	$('.content').hide();
	$('.finish').remove();
	$(".toolTitle").empty();
	//<div class="plotUpdate" style="float:right"><label><input type="checkbox" id="onlinePlot" class="onlinePlot"></input> Auto-Update</label></div>
	//<div class="backDiv" style="float:left" width:5%><button class="back button pill icon home danger">Back</button><button class="plotOptions button icon pill huge settings">Options</button></div>
	$('.content').after(`
		<div class="mainEnclosure" style="margin:auto;text-align:center;align:center;height:82%;width:100%">
			<div class="sliderEnclosure" style="width:83%;margin:auto;>
				<div class="slider" id="slider"></div>
				<div class="optionsContainer">
						<div class="stupidDiv1" class="left"><button class="button pill icon arrowleft"></button><select class="selectTimeLeft timeDivisions"></select></div>
						<div class="backDiv" ><button class="back button pill icon home danger">Back</button><button class="plotOptions button icon pill huge settings">Options</button></div>
						<div class="middle stupidDiv1"><select class="selectTimeMiddle timeDivisions"></select></div>
						<div class="plotUpdate"><label><input type="checkbox" id="onlinePlot" class="onlinePlot"></input> Auto-Update</label></div>
						<div class="right stupidDiv1"><select class="selectTimeRight timeDivisions"></select><button class="button pill icon arrowright"></button></div>
					</div>
				</div>
			</div>
		</div>
	`);
	$('.optionsContainer').css({
		 'display'              :  'grid',
		'grid-template-columns' :  'repeat(auto-fit,minmax(10%,19%)',
		'grid-gap'              :  '2px',
		'width'                 :  '90%',
		'justify-items'         : 'center',
		'align-items'           : 'center',
		'justify-content'       : 'space-evenly',
		'text-align'            : 'center',
		'margin'                : 'auto'
	});
	$('.mainEnclosure').append('<div id="mainContainer" class="mainContainer" style="zindex:1;min-height:50vh;min-width:50vw;width:82%;margin:auto"></div>');
	var divisions=setTimeDivisions(globalTimeLims[0],globalTimeLims[1]);
	divisions=[10000,30000,60000,300000,600000,1800000,3600000,3600000*6,3600000*12,3600000*24,3600000*24*3,3600000*24*7,3600000*24*14,3600000*24*30,3600000*24*30*3,3600000*24*30*6,3600000*24*30*9,3600000*24*365,3600000*24*365*2];
	divisionNames=['10 seconds','30 seconds','1 minute','5 minutes','10 minutes','30 minutes','1 hour','6 hours','12 hours','1 day','3 days','1 week','2 weeks','1 month (30d)','3 months (90d)','6 months (180d)','9 months (270d)','1 year (365d)','2 years (730d)'];
	if($(".optionsContainer").width()<900){
		$('.mainContainer').css({
			'width':'100%',
			'height':'60%'
		});
		$('.stupidDiv1').css({
			'width':'1%'
		});
		$('.backDiv').css({
			'width':'52%'
		});
		$('.plotUpdate').css({
			'width':'40%'
		});
		$('.timeDivisions').remove();
		$('.arrowleft').click(function(){
			if(globalSelectedforResponsiveLeft>0){
				isDefaultHiddenLeft=false;
			}
			var stupidName=$.confirm({
				title    : 'Time backwards',
				backgroundDismiss: true,
				content  : '<select class="timePicker"><option disabled selected hidden>--- SELECT ONE ---</option></select>',
				onContentReady: function () {
					var self= this;
					var content=this.$content;
					for (var i=divisions.length; i>0; i--){
						//for (var j=0; j<divisions[Object.keys(divisions)[i]].length; j++){
						if(divisions[i]<(globalTimeLims[1]-globalTimeLims[0])){
							this.$content.find('.timePicker').append('<option value="'+divisions[i]+'">'+divisionNames[i]+'</option>');
						}
					}
					if(globalSelectedforResponsiveLeft>0){
						this.$content.find('.timePicker').val(globalSelectedforResponsiveLeft);
					}
					this.$content.find('.timePicker').change(function(){
						changeSliderVals('buttonLeftResponsive',Number($(this).val()));
						globalSelectedforResponsiveLeft=Number($(this).val());
						self.close();
					});
				},
				buttons:{
					Go:{
						isHidden: isDefaultHiddenLeft, // hide the button
						action: function(){
							changeSliderVals('buttonLeftResponsive',Number(stupidName.$content.find('.timePicker').val()));
							globalSelectedforResponsiveLeft=Number(stupidName.$content.find('.timePicker').val());
							self.close();
						}
					}
				}
			});
		});
		$('.arrowright').click(function(){
			if(globalSelectedforResponsiveRight>0){
				isDefaultHiddenRight=false;
			}
			var stupidName=$.confirm({
				title    : 'Time forward',
				backgroundDismiss: true,
				content  : '<select class="timePicker"><option disabled selected hidden>--- SELECT ONE ---</option></select>',
				onContentReady: function () {
					var self= this;
					var content=this.$content;
					for (var i=divisions.length; i>0; i--){
						//for (var j=0; j<divisions[Object.keys(divisions)[i]].length; j++){
						if(divisions[i]<(globalTimeLims[1]-globalTimeLims[0])){
							this.$content.find('.timePicker').append('<option value="'+divisions[i]+'">'+divisionNames[i]+'</option>');
						}
					}
					if(globalSelectedforResponsiveRight>0){
						this.$content.find('.timePicker').val(globalSelectedforResponsiveRight);
					}
					this.$content.find('.timePicker').change(function(){
						changeSliderVals('buttonRightResponsive',Number($(this).val()));
						globalSelectedforResponsiveRight=Number($(this).val());
						self.close();
					});
				},
				buttons:{
					Go:{
						isHidden: isDefaultHiddenRight, // hide the button
						action: function(){
							changeSliderVals('buttonRightResponsive',Number(stupidName.$content.find('.timePicker').val()));
							globalSelectedforResponsiveRight=Number(stupidName.$content.find('.timePicker').val());
							self.close();
						}
					}
				}
			});
		});
	}
	else{
		$('.arrowleft').click(function(){
			changeSliderVals('buttonLeft');
		});
		$('.arrowright').click(function(){
			changeSliderVals('buttonRight');
		});
		$('.selectTimeMiddle').change(function(){
			changeSliderVals('interval');
		});
		for (var i=divisions.length; i>0; i--){
			if(divisions[i]<(globalTimeLims[1]-globalTimeLims[0])){
				$('.timeDivisions').append('<option value="'+divisions[i]+'">'+divisionNames[i]+'</option>');
			}
		}
	}
	$('.mainEnclosure').find('.back').click(function(){
		$('.mainEnclosure').remove();
		delete objct.plotting;
		delete objct.plotOptions;
		delete objct.channelData;
		buildPage(objct);
	});
	globalPlotObject={};
	if(objct.visionType=="0"){//Single Plot Options
		if('plotid' in objct){
			$.ajax({
				url: '/data/getPlots',
				type: 'POST',
				dataType: "json",
				data:{'dbname':dbname},
				success: function(returned){
					for (var j=0; j<returned.length; j++){
						if(returned[i].plotid==objct.plotid){
							objct.plotType=returned[i].plottype;
							objct.plotOptions=returned[i].remarks.options;
							objct.plotOptions['plotTitle']=returned[i].plotname;
							plotThePlot(objct,objct.startTime,objct.endTime);
							break
						}
					}
				}
			});
		}
		$('.mainEnclosure').css({
			'height':'100%'
		});
		$('.backDiv').find('.plotOptions').click(function(){
			$('.lightboxable').empty();
			$('.lightboxable').append('<div class="optionButtons" style="align:center;text-align:center"><button class="layout button pill icon edit">Layout</button><button class="runs button pill icon calendar">Runs</button><button class="custom button pill icon fork">Custom</button><button class="store button pill icon log">Save</button><hr style="width:25%"></div><div style="width:100%" class="currOption"></div>');
			$('.lightboxable').find('.layout').click(function(){
				$('.lightboxable').find(".optionButtons").find(".button").each(function(){
					if($(this).hasClass("layout")){
						$(this).prop('disabled',true);
					}
					else{
						$(this).prop('disabled',false);
					}
				});
				if(objct.plotType==0){
					$('.lightboxable').find('.currOption').empty();
					$('.lightboxable').find('.currOption').append('<div class="globalOptions"><h3>Global options</h3><p>Show runs <input type="checkbox" class="runsCheck"></input></p><p>Multiple axis: <input type="checkbox" class="multiCheck"></input></p></div><hr style="width:25%"><div class="individualOptions"><h3>Individual Channel Options</h3>Channel: <select class="channelOptionsSelector"><option selected disabled>--- CHOOSE ONE---</option></select></div>');
					$('.lightboxable').find('.currOption').find('.runsCheck').click(function(){
						var thisVal=$(this).prop('checked');
						objct.plotOptions.showRuns=thisVal;
						if(thisVal){
							$('.lightboxable').find('.currOption').find('.runsCheck').after('<p class="runCommentsPar" style="text-indent:15px;padding:5px 0 5px 0">Show Run Comments : <input class="showRunComments" type="checkbox"></input></p>');
							$('.lightboxable').find('.currOption').find('.showRunComments').click(function(){
								var thisVal=$(this).prop('checked');
								objct.plotOptions.showRunComments=thisVal;
								plotThePlot(objct,objct.startTime,objct.endTime);
							});
						}
						else{
							$('.lightboxable').find('.currOption').find('.runCommentsPar').remove();
							objct.plotOptions.showRunComments=thisVal;
							plotThePlot(objct,objct.startTime,objct.endTime);
						}
						if(!thisVal){
							objct.plotOptions.showRunComments=thisVal;
						}
						plotThePlot(objct,objct.startTime,objct.endTime);
					});
					$('.lightboxable').find('.currOption').find('.multiCheck').change(function(){
						var thisVal=$(this).prop('checked');
						objct.plotOptions.multiAxis=thisVal;
						if(thisVal){
							$('.lightboxable').find('.globalOptions').find('.logCheck-container').remove();
							$('.lightboxable').find('.globalOptions').find('.minMaxouter').remove();
							for (var i=0; i<objct.channelData.length; i++){
								$('.lightboxable').find('.individualOptions').find('.options.'+i).append('<p class="logCheck-container">Y Log Scale : <input type="checkbox" class="logCheck '+i+'"></input></p><div class="minMaxouter" style="display:table"><p><h4>Manual limits</h4> - set both limits to 0 for auto range</p><p></p><p>Max Y: <input class="maxY '+i+'" value="0" type="number"></input></p><p>Min Y: <input class="minY '+i+'" value="0" type="number"></input></p></div>');
								//$('.lightboxable').find('.individualOptions').find('.options.'+i).append('<p class="logCheck-container">Y Log Scale : <input type="checkbox" class="logCheck '+i+'"></input></p>');
								$('.lightboxable').find('.individualOptions').find('.logCheck.'+i).click(function(){
									var thisVal=$(this).prop('checked');
									var thisIdx=Number($(this).prop('class').split(' ')[1]);
									objct.plotOptions.channelOptions[thisIdx].logscale=thisVal;
									plotThePlot(objct,objct.startTime,objct.endTime);
								});
								$('.lightboxable').find('.individualOptions').find('.maxY.'+i).change(function(){
									var thisVal=$(this).val();
									var thisIdx=Number($(this).prop('class').split(' ')[1]);
									objct.plotOptions.channelOptions[thisIdx].maxy=thisVal;
									plotThePlot(objct,objct.startTime,objct.endTime);
								});
								$('.lightboxable').find('.individualOptions').find('.minY.'+i).change(function(){
									var thisVal=$(this).val();
									var thisIdx=Number($(this).prop('class').split(' ')[1]);
									objct.plotOptions.channelOptions[thisIdx].miny=thisVal;
									plotThePlot(objct,objct.startTime,objct.endTime);
								});
								$('.lightboxable').find('.individualOptions').find('.logCheck.'+i).prop('checked',objct.plotOptions.channelOptions[i].logscale);
								if(!((typeof objct.plotOptions.channelOptions[i].miny)==='undefined')){
									$('.lightboxable').find('.individualOptions').find('.minY.'+i).val(objct.plotOptions.channelOptions[i].miny);
								}
								if(!((typeof objct.plotOptions.channelOptions[i].maxy)==='undefined')){
									$('.lightboxable').find('.individualOptions').find('.maxY.'+i).val(objct.plotOptions.channelOptions[i].maxy);
								}
							}
							plotThePlot(objct,objct.startTime,objct.endTime);
						}
						else{
							$('.lightboxable').find('.individualOptions').find('.options').find('.logCheck-container').remove();
							$('.lightboxable').find('.individualOptions').find('.options').find('.minMaxouter').remove();
							$('.lightboxable').find('.globalOptions').append('<p class="logCheck-container">Y Log Scale : <input type="checkbox" class="logCheck"></input></p><div class="minMaxouter" style="display:table"><p><h4>Manual limits</h4> - set both limits to 0 for auto range</p><p></p><p>Max Y: <input class="maxY" value="0" type="number"></input></p><p>Min Y: <input class="minY" value="0" type="number"></input></p></div>');
							//$('.lightboxable').find('.globalOptions').append('<p class="logCheck-container">Y Log Scale : <input type="checkbox" class="logCheck"></input></p>');
							$('.lightboxable').find('.globalOptions').find('.logCheck').click(function(){
								var thisVal=$(this).prop('checked');
								for (var i=0; i<objct.channelData.length; i++){
									objct.plotOptions.channelOptions[i].logscale=thisVal;
								}
								plotThePlot(objct,objct.startTime,objct.endTime);
							});
							$('.lightboxable').find('.globalOptions').find('.minY').change(function(){
								var thisVal=$(this).val();
								for (var i=0; i<objct.channelData.length; i++){
									objct.plotOptions.channelOptions[i].miny=Number(thisVal);
								}
								plotThePlot(objct,objct.startTime,objct.endTime);
							});
							$('.lightboxable').find('.globalOptions').find('.maxY').change(function(){
								var thisVal=$(this).val();
								for (var i=0; i<objct.channelData.length; i++){
									objct.plotOptions.channelOptions[i].maxy=Number(thisVal);
								}
								plotThePlot(objct,objct.startTime,objct.endTime);
							});
							var allLog=0;
							var someSetMin=false;
							var someSetMax=false;
							for (var i=0; i<objct.channelData.length; i++){
								if(objct.plotOptions.channelOptions[i].logscale){
									allLog=allLog+1;
								}
								if(!((typeof objct.plotOptions.channelOptions[i].miny)==='undefined')){
									if(!someSetMin){
										someSetMin=objct.plotOptions.channelOptions[i].miny;
									}
									else{
										if(objct.plotOptions.channelOptions[i].miny<someSetMin){
											someSetMin=objct.plotOptions.channelOptions[i].miny
										}
									}
								}
								if(!((typeof objct.plotOptions.channelOptions[i].maxy)==='undefined')){
									if(!someSetMax){
										someSetMax=objct.plotOptions.channelOptions[i].maxy;
									}
									else{
										if(objct.plotOptions.channelOptions[i].maxy>someSetMax){
											someSetMax=objct.plotOptions.channelOptions[i].maxy
										}
									}
								}
							}
							if(someSetMin || someSetMin==0){
							$('.lightboxable').find('.globalOptions').find('.minY').val(someSetMin);
							}
							if(someSetMax || someSetMax==0){
								$('.lightboxable').find('.globalOptions').find('.maxY').val(someSetMax);
							}
							if(allLog==objct.channelData.length){
								$('.lightboxable').find('.currOption').find('.logCheck').prop('checked',true);
							}
						}
						$.colorbox.resize();
						plotThePlot(objct,objct.startTime,objct.endTime);
					});
					//$('.lightboxable').find('.currOption').find('.multiCheck').trigger('click');
					for (var i=0; i<objct.channelData.length; i++){
						$('.lightboxable').find('.individualOptions').append('<div style="display:none" class="options '+i+'"><p>Color:<input type="text" class="color '+i+'" /></p><p>Smoothing:<input type="range" min="0" max="100" style="width:10%" class="smoothing '+i+'"></input></p><p>Full Resolution:<input type="checkbox" class="fullResolution '+i+'" /></p><p>Show comments: <input type="checkbox" class="comments '+i+'"></input></p></div>');
						$('.lightboxable').find('.channelOptionsSelector').append('<option value="'+i+'">'+objct.channelData[i].iname+' : '+objct.channelData[i].name+'</option>');
						$('.lightboxable').find('.individualOptions').find('.color.'+i).spectrum({
							color: objct.plotOptions.channelOptions[i].color
						});
						$('.lightboxable').find('.individualOptions').find('.color.'+i).change(function(){
							var thisVal=$(this).spectrum("get").toHex();
							var thisIdx=Number($(this).prop('class').split(' ')[1]);
							objct.plotOptions.channelOptions[thisIdx].color=thisVal;
							plotThePlot(objct,objct.startTime,objct.endTime);
						});
						$('.lightboxable').find('.individualOptions').find('.smoothing.'+i).val(objct.plotOptions.channelOptions[i].smoothing);
						$('.lightboxable').find('.individualOptions').find('.smoothing.'+i).change(function(){
							var thisVal=$(this).val();
							var thisIdx=Number($(this).prop('class').split(' ')[1]);
							objct.plotOptions.channelOptions[thisIdx].smoothing=Number(thisVal);
							plotThePlot(objct,objct.startTime,objct.endTime);
						});
						if(objct.plotOptions.channelOptions[i].fullResolution=='1'){
							$('.lightboxable').find('.individualOptions').find('.fullResolution').attr('checked',true);
						}
						$('.lightboxable').find('.individualOptions').find('.fullResolution').click(function(){
							var thisVal=$(this).prop('checked');
							var thisIdx=Number($(this).prop('class').split(' ')[1]);
							if(thisVal){
								r=confirm('This option can severely increase the query time as well as slow down your machine with often no significant improvement in your visualization. Are sure you want to do this?');
								if(r){
									objct.plotOptions.channelOptions[thisIdx].fullResolution="1";
									plotThePlot(objct,objct.startTime,objct.endTime);
								}
								else{
									$(this).prop('checked',false);
								}
							}
							else{
								objct.plotOptions.channelOptions[thisIdx].fullResolution="0";
								plotThePlot(objct,objct.startTime,objct.endTime);
							}
						});
						$('.lightboxable').find('.individualOptions').find('.comments.'+i).prop('checked',objct.plotOptions.channelOptions[i].comments);
						$('.lightboxable').find('.individualOptions').find('.comments.'+i).click(function(){
							var thisVal=$(this).prop('checked');
							var thisIdx=Number($(this).prop('class').split(' ')[1]);
							objct.plotOptions.channelOptions[thisIdx].comments=thisVal;
							plotThePlot(objct,objct.startTime,objct.endTime);
						});
						
					}
					$('.lightboxable').find('.channelOptionsSelector').change(function(){
						var thisItem=Number($(this).val());
						$('.lightboxable').find('.individualOptions').find('.options').each(function(){$(this).hide()});
						$('.lightboxable').find('.individualOptions').find('.options.'+thisItem).show();
						$.colorbox.resize();
					});
					if(objct.plotOptions.multiAxis){
						$('.lightboxable').find('.globalOptions').find('.logCheck-container').remove();
						$('.lightboxable').find('.globalOptions').find('.minMaxouter').remove();
						for (var i=0; i<objct.channelData.length; i++){
							$('.lightboxable').find('.individualOptions').find('.options.'+i).append('<p class="logCheck-container">Y Log Scale : <input type="checkbox" class="logCheck '+i+'"></input></p><div class="minMaxouter" style="display:table"><p><h4>Manual limits</h4> - set both limits to 0 for auto range</p><p></p><p>Max Y: <input class="maxY '+i+'" value="0" type="number"></input></p><p>Min Y: <input class="minY '+i+'" value="0" type="number"></input></p></div>');
							$('.lightboxable').find('.individualOptions').find('.logCheck.'+i).click(function(){
								var thisVal=$(this).prop('checked');
								var thisIdx=Number($(this).prop('class').split(' ')[1]);
								objct.plotOptions.channelOptions[thisIdx].logscale=thisVal;
								plotThePlot(objct,objct.startTime,objct.endTime);
							});
							$('.lightboxable').find('.individualOptions').find('.maxY.'+i).change(function(){
								var thisVal=$(this).val();
								var thisIdx=Number($(this).prop('class').split(' ')[1]);
								objct.plotOptions.channelOptions[thisIdx].maxy=thisVal;
								plotThePlot(objct,objct.startTime,objct.endTime);
							});
							$('.lightboxable').find('.individualOptions').find('.minY.'+i).change(function(){
								var thisVal=$(this).val();
								var thisIdx=Number($(this).prop('class').split(' ')[1]);
								objct.plotOptions.channelOptions[thisIdx].miny=thisVal;
								plotThePlot(objct,objct.startTime,objct.endTime);
							});
							if(!((typeof objct.plotOptions.channelOptions[i].miny)==='undefined')){
								$('.lightboxable').find('.individualOptions').find('.minY.'+i).val(objct.plotOptions.channelOptions[i].miny);
							}
							if(!((typeof objct.plotOptions.channelOptions[i].maxy)==='undefined')){
								$('.lightboxable').find('.individualOptions').find('.maxY.'+i).val(objct.plotOptions.channelOptions[i].maxy);
							}
							$('.lightboxable').find('.individualOptions').find('.logCheck.'+i).prop('checked',objct.plotOptions.channelOptions[i].logscale);
						}
						plotThePlot(objct,objct.startTime,objct.endTime);
					}
					else{
						$('.lightboxable').find('.individualOptions').find('.options').find('.logCheck-container').remove();
						$('.lightboxable').find('.individualOptions').find('.options').find('.minMaxouter').remove();
						$('.lightboxable').find('.globalOptions').append('<p class="logCheck-container">Y Log Scale : <input type="checkbox" class="logCheck"></input></p><div class="minMaxouter" style="display:table"><p><h4>Manual limits</h4> - set both limits to 0 for auto range</p><p></p><p>Max Y: <input class="maxY" value="0" type="number"></input></p><p>Min Y: <input class="minY" value="0" type="number"></input></p></div>');
						$('.lightboxable').find('.globalOptions').find('.logCheck').click(function(){
							var thisVal=$(this).prop('checked');
							for (var i=0; i<objct.channelData.length; i++){
								objct.plotOptions.channelOptions[i].logscale=thisVal;
							}
							plotThePlot(objct,objct.startTime,objct.endTime);
						});
						$('.lightboxable').find('.globalOptions').find('.minY').change(function(){
							var thisVal=$(this).val();
							for (var i=0; i<objct.channelData.length; i++){
								objct.plotOptions.channelOptions[i].miny=Number(thisVal);
							}
							plotThePlot(objct,objct.startTime,objct.endTime);
						});
						$('.lightboxable').find('.globalOptions').find('.maxY').change(function(){
							var thisVal=$(this).val();
							for (var i=0; i<objct.channelData.length; i++){
								objct.plotOptions.channelOptions[i].maxy=Number(thisVal);
							}
							plotThePlot(objct,objct.startTime,objct.endTime);
						});
						var allLog=0;
						var someSetMin=false;
						var someSetMax=false;
						for (var i=0; i<objct.channelData.length; i++){
							if(objct.plotOptions.channelOptions[i].logscale){
								allLog=allLog+1;
							}
							if(!((typeof objct.plotOptions.channelOptions[i].miny)==='undefined')){
								if(!someSetMin){
									someSetMin=objct.plotOptions.channelOptions[i].miny;
								}
								else{
									if(objct.plotOptions.channelOptions[i].miny<someSetMin){
										someSetMin=objct.plotOptions.channelOptions[i].miny
									}
								}
							}
							if(!((typeof objct.plotOptions.channelOptions[i].maxy)==='undefined')){
								if(!someSetMax){
									someSetMax=objct.plotOptions.channelOptions[i].maxy;
								}
								else{
									if(objct.plotOptions.channelOptions[i].maxy>someSetMax){
										someSetMax=objct.plotOptions.channelOptions[i].maxy
									}
								}
							}
						}
						if(someSetMin || someSetMin==0){
							$('.lightboxable').find('.globalOptions').find('.minY').val(someSetMin);
						}
						if(someSetMax || someSetMax==0){
							$('.lightboxable').find('.globalOptions').find('.maxY').val(someSetMax);
						}
						if(allLog==objct.channelData.length){
							$('.lightboxable').find('.currOption').find('.logCheck').prop('checked',true);
						}
					}
					$('.lightboxable').find('.currOption').find('.multiCheck').prop('checked',objct.plotOptions.multiAxis);
					$('.lightboxable').find('.currOption').find('.runsCheck').prop('checked',objct.plotOptions.showRuns);
					if(objct.plotOptions.showRuns){
						$('.lightboxable').find('.currOption').find('.runsCheck').after('<p class="runCommentsPar" style="text-indent:15px;padding:5px 0 5px 0">Show Run Comments : <input class="showRunComments" type="checkbox"></input></p>');
						$('.lightboxable').find('.currOption').find('.showRunComments').click(function(){
							var thisVal=$(this).prop('checked');
							objct.plotOptions.showRunComments=thisVal;
							plotThePlot(objct,objct.startTime,objct.endTime);
						});
					}
					else{
						objct.plotOptions.showRunComments=false;
					}
					$('.lightboxable').find('.currOption').find('.showRunComments').prop('checked',objct.plotOptions.showRunComments);
					if(objct.plotOptions.multiAxis){
						for (var i=0; i<objct.channelData.length; i++){
							$('.lightboxable').find('.individualOptions').find('.logCheck.'+i).prop('checked',objct.plotOptions.channelOptions[i].logscale);
						}
					}
					else{
						var allLog=0;
						for (var i=0; i<objct.channelData.length; i++){
							if(objct.plotOptions.channelOptions[i].logscale){
								allLog=allLog+1;
							}
						}
						if(allLog==objct.channelData.length){
							$('.lightboxable').find('.currOption').find('.logCheck').prop('checked',true);
						}
					}
				}
				else if(objct.plotType==1){
					if((typeof objct.plotOptions.colorscale)==='undefined'){
						objct.plotOptions.colorscale='RdBu';
					}
					$('.lightboxable').find('.currOption').empty();
					$('.lightboxable').find('.currOption').append('<div class="globalOptions"><h3>Options</h3><p>Show runs <input type="checkbox" class="runsCheck"></input></p><p>Show comments : <input type="checkbox" class="showComments"></input></p><p>Log Y Axis: <input type="checkbox" class="ylogAxis"></input></p><p>Log Z Axis: <input type="checkbox" class="zlogAxis"></input></p><p>Connect Gaps: <input type="checkbox" class="connectGaps"></input></p><p>Colorscale : <select class="colorscale"><option style="background-image:url(blackbody.png);" value="Blackbody">Blackbody</option><option value="Electric" style="background-image:url(colorboxImgs/electric.png);">Electric</option><option value="Earth" style="background-image:url(colorboxImgs/earth.png);">Earth</option><option value="Bluered" style="background-image:url(colorboxImgs/bluered.png);">Bluered</option><option value="YIOrRd" style="background-image:url(colorboxImgs/ylord.png);">YIOrRd</option><option value="YIGnBu" style="background-image:url(colorboxImgs/ylgnbu.png);">YIGnBu</option><option value="RdBu" style="background-image:url(colorboxImgs/rdbu.png);">RdBu</option><option value="Portland" style="background-image:url(colorboxImgs/portland.png);">Portland</option><option value="Picnic" style="background-image:url(colorboxImgs/picnic.png);">Picnic</option><option value="Jet" style="background-image:url(colorboxImgs/jet.png);" title="jet">Jet</option><option value="Hot" style="background-image:url(colorboxImgs/hot.png);" title="hot">Hot</option><option value="Greys" style="background-image:url(colorboxImgs/greys.png);" title="greys">Greys</option><option value="Greens" style="background-image:url(colorboxImgs/greys.png);" title="greys">Greens</option></select></p><p>Smoothing:<input type="range" min="0" max="100" style="width:10%" value="0" class="smoothing"></input></p></div><hr style="text-align:center;margin:auto;width:25%"><div class="minMaxouter" style="display:table"><p style="text-align:center;margin:auto"><h4>Manual limits </h4>(set both min & max to 0 for auto range)</p><div class="minMax" style="display:table-row"><div class="minMaxY" style="display:table-cell;padding:0 15px 0 15px"><p>Max Y: <input class="maxY" type="number" value="0"></p><p>Min Y:</input><input class="minY" type="number" value="0"></input></p></div><div class="minMaxZ" style="display:table-cell;padding:0 15px 0 15px"><p>Max Z:<input class="maxZ" type="number" value="0"></input></p><p>Min Z:<input class="minZ" type="number" value="0"></input></p></div></div></div><hr style="width:25%">');
					$('.lightboxable').find('.currOption').find('.runsCheck').click(function(){
						var thisVal=$(this).prop('checked');
						objct.plotOptions.showRuns=thisVal;
						if(thisVal){
							$('.lightboxable').find('.currOption').find('.runsCheck').after('<p class="runCommentsPar" style="text-indent:15px;padding:5px 0 5px 0">Show Run Comments : <input class="showRunComments" type="checkbox"></input></p>');
							$('.lightboxable').find('.currOption').find('.showRunComments').click(function(){
								var thisVal=$(this).prop('checked');
								objct.plotOptions.showRunComments=thisVal;
								plotThePlot(objct,objct.startTime,objct.endTime);
							});
						}
						else{
							$('.lightboxable').find('.currOption').find('.runCommentsPar').remove();
							objct.plotOptions.showRunComments=thisVal;
							plotThePlot(objct,objct.startTime,objct.endTime);
						}
						if(!thisVal){
							objct.plotOptions.showRunComments=thisVal;
						}
						plotThePlot(objct,objct.startTime,objct.endTime);
					});
					$('.lightboxable').find('.currOption').find('.showComments').click(function(){
						var thisVal=$(this).prop('checked');
						objct.plotOptions.comments=thisVal;
						plotThePlot(objct,objct.startTime,objct.endTime);
					});
					$('.lightboxable').find('.currOption').find('.colorscale').click(function(){
						var thisVal=$(this).val();
						objct.plotOptions.colorscale=thisVal;
						plotThePlot(objct,objct.startTime,objct.endTime);
					});
					$('.lightboxable').find('.currOption').find('.ylogAxis').click(function(){
						var thisVal=$(this).prop('checked');
						objct.plotOptions.ylogAxis=thisVal;
						plotThePlot(objct,objct.startTime,objct.endTime);
					});
					$('.lightboxable').find('.currOption').find('.zlogAxis').click(function(){
						var thisVal=$(this).prop('checked');
						objct.plotOptions.zlogAxis=thisVal;
						plotThePlot(objct,objct.startTime,objct.endTime);
					});
					$('.lightboxable').find('.currOption').find('.smoothing').change(function(){
						var thisVal=$(this).val();
						objct.plotOptions.smoothing=Number(thisVal);
						plotThePlot(objct,objct.startTime,objct.endTime);
					});
					$('.lightboxable').find('.currOption').find('.maxY').change(function(){
						var thisVal=$(this).val();
						objct.plotOptions.maxy=Number(thisVal);
						plotThePlot(objct,objct.startTime,objct.endTime);
					});
					$('.lightboxable').find('.currOption').find('.minY').change(function(){
						var thisVal=$(this).val();
						objct.plotOptions.miny=Number(thisVal);
						plotThePlot(objct,objct.startTime,objct.endTime);
					});
					$('.lightboxable').find('.currOption').find('.minZ').change(function(){
						var thisVal=$(this).val();
						objct.plotOptions.minz=Number(thisVal);
						plotThePlot(objct,objct.startTime,objct.endTime);
					});
					$('.lightboxable').find('.currOption').find('.maxZ').change(function(){
						var thisVal=$(this).val();
						objct.plotOptions.maxz=Number(thisVal);
						plotThePlot(objct,objct.startTime,objct.endTime);
					});
					$('.lightboxable').find('.currOption').find('.connectGaps').click(function(e){
						var thisVal=$(this).prop('checked');
						var sure=true;
						if(thisVal){
							sure=confirm('Choosing this option will connect gaps in a surface plot which have no data, producing an overall more pleasing plot. This, however may come with a high resource utilization on your device in the case of very exotic surface plots. Are you sure you wish to proceed?');
						}
						if(sure){
							objct.plotOptions.connectgaps=thisVal;
							plotThePlot(objct,objct.startTime,objct.endTime);
						}
						else{
							$(this).prop('checked',false);
						}
					});
					$('.lightboxable').find('.currOption').find('.ylogAxis').prop('checked',objct.plotOptions.ylogAxis);
					$('.lightboxable').find('.currOption').find('.showComments').prop('checked',objct.plotOptions.comments);
					$('.lightboxable').find('.currOption').find('.colorscale').val(objct.plotOptions.colorscale);
					$('.lightboxable').find('.currOption').find('.zlogAxis').prop('checked',objct.plotOptions.zlogAxis);
					$('.lightboxable').find('.currOption').find('.connectGaps').prop('checked',objct.plotOptions.connectgaps);
					$('.lightboxable').find('.currOption').find('.runsCheck').prop('checked',objct.plotOptions.showRuns);
					if(objct.plotOptions.showRuns){
						$('.lightboxable').find('.currOption').find('.runsCheck').after('<p class="runCommentsPar" style="text-indent:15px;padding:5px 0 5px 0">Show Run Comments : <input class="showRunComments" type="checkbox"></input></p>');
						$('.lightboxable').find('.currOption').find('.showRunComments').click(function(){
							var thisVal=$(this).prop('checked');
							objct.plotOptions.showRunComments=thisVal;
							plotThePlot(objct,objct.startTime,objct.endTime);
						});
					}
					else{
						objct.plotOptions.showRunComments=false;
					}
					$('.lightboxable').find('.currOption').find('.showRunComments').prop('checked',objct.plotOptions.showRunComments);
					$('.lightboxable').find('.currOption').find('.smoothing').val(objct.plotOptions.smoothing);
					if(!((typeof objct.plotOptions.maxy)=='undefined')){
						$('.lightboxable').find('.currOption').find('.maxY').val(objct.plotOptions.maxy);
					}
					if(!((typeof objct.plotOptions.miny)=='undefined')){
						$('.lightboxable').find('.currOption').find('.minY').val(objct.plotOptions.miny);
					}
					if(!((typeof objct.plotOptions.maxz)=='undefined')){
						$('.lightboxable').find('.currOption').find('.maxZ').val(objct.plotOptions.maxz);
					}
					if(!((typeof objct.plotOptions.minz)=='undefined')){
						$('.lightboxable').find('.currOption').find('.minZ').val(objct.plotOptions.minz);
					}
				}
				else if(objct.plotType==2){
					$('.lightboxable').find('.currOption').empty();
					$('.lightboxable').find('.currOption').append('<div class="globalOptions" style="width:100%"><h3>Options</h3><p>Show runs <input type="checkbox" class="runsCheck"></input></p><p>Show comments : <input type="checkbox" class="showComments"></input></p><p>Log Y Axis: <input type="checkbox" class="ylogAxis"></input></p><div class="minMax" style="display:table-row"><div class="minMaxY" style="display:table-cell;padding:0 15px 0 15px"><p>Max Y: <input class="maxY" type="number" value="0"></p><p>Min Y:</input><input class="minY" type="number" value="0"></input></p></div></div></div><hr style="width:25%;margin:auto;text-align:center;align:center"><h3>Trace options</h3><div style="display:table;width:100%"><div style="display:table-row;margin:auto;text-align:center;" class="indButtonsDiv"></div></div>');
					$('.lightboxable').find('.currOption').find('.runsCheck').click(function(){
						var thisVal=$(this).prop('checked');
						objct.plotOptions.showRuns=thisVal;
						if(thisVal){
							$('.lightboxable').find('.currOption').find('.runsCheck').after('<p class="runCommentsPar" style="text-indent:15px;padding:5px 0 5px 0">Show Run Comments : <input class="showRunComments" type="checkbox"></input></p>');
							$('.lightboxable').find('.currOption').find('.showRunComments').click(function(){
								var thisVal=$(this).prop('checked');
								objct.plotOptions.showRunComments=thisVal;
								plotThePlot(objct,objct.startTime,objct.endTime);
							});
						}
						else{
							$('.lightboxable').find('.currOption').find('.runCommentsPar').remove();
							objct.plotOptions.showRunComments=thisVal;
							plotThePlot(objct,objct.startTime,objct.endTime);
						}
						if(!thisVal){
							objct.plotOptions.showRunComments=thisVal;
						}
						plotThePlot(objct,objct.startTime,objct.endTime);
					});
					$('.lightboxable').find('.currOption').find('.showComments').click(function(){
						var thisVal=$(this).prop('checked');
						objct.plotOptions.comments=thisVal;
						plotThePlot(objct,objct.startTime,objct.endTime);
					});
					$('.lightboxable').find('.currOption').find('.ylogAxis').click(function(){
						var thisVal=$(this).prop('checked');
						objct.plotOptions.ylogAxis=thisVal;
						plotThePlot(objct,objct.startTime,objct.endTime);
					});
					$('.lightboxable').find('.currOption').find('.maxY').change(function(){
						var thisVal=$(this).val();
						objct.plotOptions.maxy=Number(thisVal);
						plotThePlot(objct,objct.startTime,objct.endTime);
					});
					$('.lightboxable').find('.currOption').find('.minY').change(function(){
						var thisVal=$(this).val();
						objct.plotOptions.miny=Number(thisVal);
						plotThePlot(objct,objct.startTime,objct.endTime);
					});
					$('.lightboxable').find('.currOption').find('.ylogAxis').prop('checked',objct.plotOptions.ylogAxis);
					$('.lightboxable').find('.currOption').find('.showComments').prop('checked',objct.plotOptions.comments);
					$('.lightboxable').find('.currOption').find('.runsCheck').prop('checked',objct.plotOptions.showRuns);
					if(objct.plotOptions.showRuns){
						$('.lightboxable').find('.currOption').find('.runsCheck').after('<p class="runCommentsPar" style="text-indent:15px;padding:5px 0 5px 0">Show Run Comments : <input class="showRunComments" type="checkbox"></input></p>');
						$('.lightboxable').find('.currOption').find('.showRunComments').click(function(){
							var thisVal=$(this).prop('checked');
							objct.plotOptions.showRunComments=thisVal;
							plotThePlot(objct,objct.startTime,objct.endTime);
						});
					}
					else{
						objct.plotOptions.showRunComments=false;
					}
					if(!((typeof objct.plotOptions.maxy)=='undefined')){
						$('.lightboxable').find('.currOption').find('.maxY').val(objct.plotOptions.maxy);
					}
					if(!((typeof objct.plotOptions.miny)=='undefined')){
						$('.lightboxable').find('.currOption').find('.minY').val(objct.plotOptions.miny);
					}
					//$('.lightboxable').find('.currOption').find('.indButtonsDiv').css('width',$('.currOption').width()+'px');
					if(objct.barType==1){
						for (var i=0; i<objct.channelData.length; i++){
							$('.lightboxable').find('.currOption').find('.indButtonsDiv').append('<button class="edit '+i+' button pill">'+objct.channelData[i].iname+' : '+objct.channelData[i].name+'</button>');
							$('.lightboxable').find('.currOption').find('.indButtonsDiv').find('.edit.'+i).click(function(){
								var idx=Number($(this).attr('class').split(' ')[1]);
								var toShow=false;
								if($('.lightboxable').find('.currOption').find('.indButtonsDiv').find('.editDiv.'+idx).css('display')=='none'){
									toShow=true;
								}
								$('.lightboxable').find('.currOption').find('.indButtonsDiv').find('.editDiv').hide();
								if(toShow){
									$('.lightboxable').find('.currOption').find('.indButtonsDiv').find('.editDiv.'+idx).show();
								}
								$.colorbox.resize();
							});
						}
						for (var i=0; i<objct.channelData.length; i++){
							$('.lightboxable').find('.currOption').find('.indButtonsDiv').append('<div class="editDiv '+i+'" style="display:none;"></div>');
							$('.lightboxable').find('.currOption').find('.indButtonsDiv').find('.editDiv.'+i).append('<p>'+objct.channelData[i].iname+' : '+objct.channelData[i].name+'</p>');
							$('.lightboxable').find('.currOption').find('.indButtonsDiv').find('.editDiv.'+i).append('<p>Collection type : <select class="type '+i+'"><option value="0">Sum</option><option value="1">Average</option></select></p>');
							$('.lightboxable').find('.currOption').find('.indButtonsDiv').find('.editDiv.'+i).append('<p>Smoothing : <input type="range" min="0" max="100" style="width:10%;display:inline" class="smoothing '+i+'"></input></p>');
							$('.lightboxable').find('.currOption').find('.indButtonsDiv').find('.editDiv.'+i).append('<p>Color : <input type="text" class="color '+i+'" /></p>');
							$('.lightboxable').find('.currOption').find('.indButtonsDiv').find('.editDiv.'+i).find('.color.'+i).spectrum({
								color: objct.plotOptions.channelOptions[i].color
							});
							$('.lightboxable').find('.currOption').find('.indButtonsDiv').find('.editDiv.'+i).find('.smoothing.'+i).val(objct.plotOptions.channelOptions[i].smoothing);
							$('.lightboxable').find('.currOption').find('.indButtonsDiv').find('.editDiv.'+i).find('.type.'+i).val(objct.plotOptions.channelOptions[i].colType);
							$('.lightboxable').find('.currOption').find('.indButtonsDiv').find('.editDiv.'+i).find('.type.'+i).change(function(){
								var thisVal=$(this).val();
								var thisIdx=Number($(this).prop('class').split(' ')[1]);
								objct.plotOptions.channelOptions[thisIdx].colType=Number(thisVal);
								plotThePlot(objct,objct.startTime,objct.endTime);
							});
							$('.lightboxable').find('.currOption').find('.indButtonsDiv').find('.editDiv.'+i).find('.smoothing.'+i).change(function(){
								var thisVal=$(this).val();
								var thisIdx=Number($(this).prop('class').split(' ')[1]);
								objct.plotOptions.channelOptions[thisIdx].smoothing=Number(thisVal);
								plotThePlot(objct,objct.startTime,objct.endTime);
							});
							$('.lightboxable').find('.currOption').find('.indButtonsDiv').find('.editDiv.'+i).find('.color.'+i).change(function(){
								var thisVal=$(this).spectrum("get").toHex();
								var thisIdx=Number($(this).prop('class').split(' ')[1]);
								objct.plotOptions.channelOptions[thisIdx].color=thisVal;
								plotThePlot(objct,objct.startTime,objct.endTime);
							});
						}
						
					}
					else if(objct.barType==2){
						for (var i=0; i<objct.channelData.length; i++){
							$('.lightboxable').find('.currOption').find('.indButtonsDiv').append('<div style="display:table-cell;"><button class="edit '+i+' button pill">trace '+(i+1)+'</button><div class="innerOpts '+i+'" style="display:none"></div></div>');
							$('.lightboxable').find('.currOption').find('.indButtonsDiv').find('.edit.'+i).click(function(){
								var idx=Number($(this).attr('class').split(' ')[1]);
								var toShow=false;
								if($('.lightboxable').find('.currOption').find('.indButtonsDiv').find('.innerOpts.'+idx).css('display')=='none'){
									toShow=true;
								}
								$('.lightboxable').find('.currOption').find('.indButtonsDiv').find('.innerOpts').hide();
								if(toShow){
									$('.lightboxable').find('.currOption').find('.innerOpts.'+idx).find('.editDivIndiv').hide();
									$('.lightboxable').find('.currOption').find('.indButtonsDiv').find('.innerOpts.'+idx).show();
								}
								$.colorbox.resize();
							});
							for (var j=0; j<objct.channelData[i].length; j++){
								$('.lightboxable').find('.currOption').find('.indButtonsDiv').find('.innerOpts.'+i).append('<button class="editChann x'+i+' y'+j+' button pill">'+objct.channelData[i][j].iname+' : '+objct.channelData[i][j].name+'</button>');
								$('.lightboxable').find('.currOption').find('.indButtonsDiv').find('.innerOpts.'+i).find('.editChann.x'+i+'.y'+j).click(function(){
									var idx1=Number($(this).attr('class').split(' ')[1][1]);
									var idx2=Number($(this).attr('class').split(' ')[2][1]);
									var toShow=false;
									if($('.lightboxable').find('.currOption').find('.innerOpts.'+idx1).find('.editDivIndiv.x'+idx1+'.y'+idx2).css('display')=='none'){
										toShow=true;
									}
									$('.lightboxable').find('.currOption').find('.innerOpts.'+idx1).find('.editDivIndiv').hide();
									if(toShow){
										$('.lightboxable').find('.currOption').find('.innerOpts.'+idx1).find('.editDivIndiv.x'+idx1+'.y'+idx2).show();
									}
									$.colorbox.resize();
								});
							}
						}
						for (var i=0; i<objct.channelData.length; i++){
							for (var j=0; j<objct.channelData[i].length; j++){
								$('.lightboxable').find('.currOption').find('.indButtonsDiv').find('.innerOpts.'+i).append('<div class="editDivIndiv x'+i+' y'+j+'" style="display:none;">'+objct.channelData[i][j].iname+' : '+objct.channelData[i][j].name+'</div>');
								$('.lightboxable').find('.currOption').find('.indButtonsDiv').find('.innerOpts.'+i).find('.editDivIndiv.x'+i+'.y'+j).append('<p>Collection type : <select class="type x'+i+' y'+j+'"><option value="0">Sum</option><option value="1">Average</option></select></p>');
								$('.lightboxable').find('.currOption').find('.indButtonsDiv').find('.innerOpts.'+i).find('.editDivIndiv.x'+i+'.y'+j).append('<p>Smoothing : <input type="range" min="0" max="100" style="width:10%;display:inline" class="smoothing x'+i+' y'+j+'"></input></p>');
								$('.lightboxable').find('.currOption').find('.indButtonsDiv').find('.innerOpts.'+i).find('.editDivIndiv.x'+i+'.y'+j).append('<p>Color : <input type="text" class="color x'+i+' y'+j+'" /></p>');
								$('.lightboxable').find('.currOption').find('.indButtonsDiv').find('.innerOpts.'+i).find('.editDivIndiv.x'+i+'.y'+j).find('.color.x'+i+'.y'+j).spectrum({
									color: objct.plotOptions.channelOptions[i][j].color
								});
								$('.lightboxable').find('.currOption').find('.indButtonsDiv').find('.innerOpts.'+i).find('.editDivIndiv.x'+i+'.y'+j).find('.smoothing.x'+i+'.y'+j).val(objct.plotOptions.channelOptions[i][j].smoothing);
								$('.lightboxable').find('.currOption').find('.indButtonsDiv').find('.innerOpts.'+i).find('.editDivIndiv.x'+i+'.y'+j).find('.type.x'+i+'.y'+j).val(objct.plotOptions.channelOptions[i][j].colType);
								$('.lightboxable').find('.currOption').find('.indButtonsDiv').find('.innerOpts.'+i).find('.editDivIndiv.x'+i+'.y'+j).find('.color.x'+i+'.y'+j).change(function(){
									var thisVal=$(this).spectrum("get").toHex();
									var thisIdx1=Number($(this).prop('class').split(' ')[1][1]);
									var thisIdx2=Number($(this).prop('class').split(' ')[2][1]);
									objct.plotOptions.channelOptions[thisIdx1][thisIdx2].color=thisVal;
									plotThePlot(objct,objct.startTime,objct.endTime);
								});
								$('.lightboxable').find('.currOption').find('.indButtonsDiv').find('.innerOpts.'+i).find('.editDivIndiv.x'+i+'.y'+j).find('.smoothing.x'+i+'.y'+j).change(function(){
									var thisVal=$(this).val();
									var thisIdx1=Number($(this).prop('class').split(' ')[1][1]);
									var thisIdx2=Number($(this).prop('class').split(' ')[2][1]);
									objct.plotOptions.channelOptions[thisIdx1][thisIdx2].smoothing=thisVal;
									plotThePlot(objct,objct.startTime,objct.endTime);
								});
								$('.lightboxable').find('.currOption').find('.indButtonsDiv').find('.innerOpts.'+i).find('.editDivIndiv.x'+i+'.y'+j).find('.type.x'+i+'.y'+j).change(function(){
									var thisVal=$(this).val();
									var thisIdx1=Number($(this).prop('class').split(' ')[1][1]);
									var thisIdx2=Number($(this).prop('class').split(' ')[2][1]);
									objct.plotOptions.channelOptions[thisIdx1][thisIdx2].colType=thisVal;
									plotThePlot(objct,objct.startTime,objct.endTime);
								});
							}
						}
					}
				}
				else if(objct.plotType==3){
					$('.lightboxable').find('.currOption').empty();
				}
				$.colorbox.resize();
			});
			$('.lightboxable').find('.store').click(function(){
				$('.lightboxable').find(".optionButtons").find(".button").each(function(){
					if($(this).hasClass("store")){
						$(this).prop('disabled',true);
					}
					else{
						$(this).prop('disabled',false);
					}
				});
				$('.lightboxable').find('.currOption').empty();
				$('.lightboxable').find('.currOption').append('<div><h3>Save this plot</h3><p>Name <input class="savePlotName"></input></p></div>');
				$('.lightboxable').find('.currOption').find('.savePlotName').on('input',function(){
					$('.lightboxable').find('.currOption').find('.savePlot-container').remove();
					$('.lightboxable').find('.currOption').find('.error-container').remove();
					var plotExists=false;
					var savePlotName=$(this).val();
					if($(this).val()!=''){
						$.ajax({
							url: '/data/getPlots',
							type: 'POST',
							dataType: "json",
							data:{'dbname':dbname},
							success: function(returned){
								for (var j=0; j<returned.length; j++){
									if(returned[j].plotname==$('.lightboxable').find('.currOption').find('.savePlotName').val()){
										plotExists=true;
									}
								}
								if(!plotExists || 'plotid' in objct){
									$('.lightboxable').find('.currOption').append('<p style="align:center;text-align:center" class="savePlot-container"><button class="savePlot button pill" style="font-size:125%">Save Plot</button></p>');
									$('.lightboxable').find('.currOption').find('.savePlot').click(function(){
										if(globalObject.plotType==0){//Timeseries
											var toSend={
												'dbname'         : dbname,
												'plotname'       : savePlotName,
												'channelids'     : objct.channels,
												'plottype'       : objct.plotType,
												'active'         : 1,
												'remarks'        : {
													'options'        : objct.plotOptions
												},
												'visionType'     : objct.visionType,
												'plotid'         : objct.plotid,
											};
										}
										else if(globalObject.plotType==1){//Surface Plot
											if(globalObject.surfaceType==1){
												var toSend={
													'dbname'         : dbname,
													'plotname'       : savePlotName,
													'plotid'         : objct.plotid,
													'channelids'     : objct.dataChannels,
													'plottype'       : objct.plotType,
													'active'         : 1,
													'visionType'     : objct.visionType,
													'remarks'        : {
														'binChannels'    : objct.binChannels,
														'surfaceType'    : objct.surfaceType,
														'options'        : objct.plotOptions
													}
												};
											}
											else if(globalObject.surfaceType==2){
												if(globalObject.fixedType==1){
													var toSend={
														'dbname'         : dbname,
														'plotname'       : savePlotName,
														'channelids'     : objct.dataChannels,
														'plottype'       : objct.plotType,
														'visionType'     : objct.visionType,
														'active'         : 1,
														'plotid'         : objct.plotid,
														'remarks'        : {
															'binChannels'    : objct.binChannels,
															'surfaceType'    : objct.surfaceType,
															'fixedType'      : objct.fixedType,
															'options'        : objct.plotOptions
														}
													};
												}
												else if(globalObject.fixedType==2){
													var toSend={
														'dbname'         : dbname,
														'plotname'       : savePlotName,
														'channelids'     : objct.dataChannels,
														'plottype'       : objct.plotType,
														'visionType'     : objct.visionType,
														'active'         : 1,
														'plotid'         : objct.plotid,
														'remarks'        : {
															'binChannels'    : objct.binChannels,
															'surfaceType'    : objct.surfaceType,
															'fixedType'      : objct.fixedType,
															'noBins'         : objct.noBins,
															'start'          : objct.start,
															'end'            : objct.end,
															'spacing'        : objct.spacing,
															'options'        : objct.plotOptions
														}
													};
												}
											}
										}
										else if(globalObject.plotType==2){//Bar Plot
											var oldOptions=objct.plotOptions;
											delete objct.plotOptions['binChannelData']
											var toSend={
												'dbname'         : dbname,
												'plotname'       : savePlotName,
												'channelids'     : objct.dataChannels,
												'plottype'       : objct.plotType,
												'active'         : 1,
												'visionType'     : objct.visionType,
												'plotid'         : objct.plotid,
												'remarks'        : {
													'catChannels'    : objct.catChannels,
													'barType'        : objct.barType,
													'options'        : objct.plotOptions
												}
											};
											objct.plotOptions=oldOptions;
										}
										else if(globalObject.plotType==3){//External Source Plot
											var toSend={
												'dbname'         : dbname,
												'plotname'       : savePlotName,
												'channelids'     : [],
												'visionType'     : objct.visionType,
												'plotid'         : objct.plotid,
												'plottype'       : objct.plotType,
												'active'         : 1,
												'remarks'        : {
													'source'         : objct.source,
													'extra'          : objct.extra,
													'sourceType'     : objct.sourceType,
													'options'        : objct.plotOptions
												}
											};
										}
										$.ajax({
											url: '/data/saveVisualization',
											type: 'POST',
											dataType: "json",
											contentType: "application/json",
											data : JSON.stringify(toSend),
											success: function(returned){
												objct.plotid=returned;
												objct.visionTypeNew='1';
												delete objct.plotOptions;
												delete objct.plotType;
												buildURL(globalObject);
												new Noty({
													text      :  'Plot \''+toSend.plotname+'\' saved successfully',
													theme     :  'relax',
													type      :  'success',
													timeout   :  2000,
													callbacks :  {
														afterClose: function() {
															location.reload();
														}
													}
												}).show();
											},
											error: function(returned){
												new Noty({
													text    :  'There was an error inserting the plot information<br>'+JSON.stringify(returned),
													theme   :  'relax',
													type    :  'error'
												}).show();
											}
										})
									});
									
								}
								else{
									new Noty({
										text    :  'This plot already exists!',
										theme   :  'relax',
										type    :  'error'
									}).show();
								}
								$.colorbox.resize();
							},
							error: function(returned){
								new Noty({
									text    :  'There was an error collecting local plot data, please refresh the page and try again!',
									theme   :  'relax',
									type    :  'error'
								}).show();
							}
						});
						
					}
					else{
						$('.lightboxable').find('.currOption').append('<p class="error-container"><span class="error" style="color:#a94442;background-color:#f2dede">Please provide a plot name</span></p>');
					}
					$.colorbox.resize();
				});
				if('plotName' in objct.plotOptions){
					$('.lightboxable').find('.currOption').find('.savePlotName').val(objct.plotOptions.plotName);
					$('.lightboxable').find('.currOption').find('.savePlotName').trigger('input');
				}
				if('plotTitle' in objct.plotOptions){
					$('.lightboxable').find('.currOption').find('.savePlotName').val(objct.plotOptions.plotTitle);
					$('.lightboxable').find('.currOption').find('.savePlotName').trigger('input');
				}
				$.colorbox.resize();
			});
			$('.lightboxable').find('.runs').click(function(){
				$('.lightboxable').find(".optionButtons").find(".button").each(function(){
					if($(this).hasClass("runs")){
						$(this).prop('disabled',true);
					}
					else{
						$(this).prop('disabled',false);
					}
				});
				$('.lightboxable').find('.currOption').empty();
				$('.lightboxable').find('.currOption').append('<div class="runChooser"><h2 style="margin:auto;text-align:center">Choose time via runs</h2><p></p><p></p><hr style="width:25%;margin:auto"><div class="startTime"></div><div class="endTime"></div><div style="text-align:center;margin:auto" class="submitDiv"></div></div>');
				$('.lightboxable').find('.startTime').append('<h3>Time Start</h3><p>Choose run : <select class="startRunChooser startinput"><option selected disabled>--- CHOOSE ONE ---</option></select>   |   <select class="startEndChooserStart startinput"><option value="0">Start</option><option value="1">End</option></select></p>');
				for (var i=0; i<globalRunlist.length; i++){
					$('.lightboxable').find('.startRunChooser').append('<option value="'+i+'">'+globalRunlist[i].run+' - '+globalRunlist[i].summary+'</option>');
				}
				$('.lightboxable').find('.startinput').change(function(){
					var startEnd1=Number($('.lightboxable').find('.startEndChooserStart').val());
					var chosenStartRun=globalRunlist[Number($(this).val())]
					if(startEnd1==1){
						var compareTime=Number(chosenStartRun.end);
					}
					else{
						var compareTime=Number(chosenStartRun.start);
					}
					$('.lightboxable').find('.submitDiv').empty();
					$('.lightboxable').find('.endTime').empty();
					$('.lightboxable').find('.endTime').append('<h3>Time End</h3><p>Choose run : <select class="endRunChooser"><option selected disabled>--- CHOOSE ONE ---</option></select>   |   <select class="startEndChooserEnd"><option class="val0" value="0">Start</option><option class="val1" value="1">End</option></select></p>');
					for (var i=0; i<globalRunlist.length; i++){
						if(Number(globalRunlist[i].end)>compareTime){
							$('.lightboxable').find('.endRunChooser').append('<option value="'+i+'">'+globalRunlist[i].run+' - '+globalRunlist[i].summary+'</option>');
						}
					}
					$('.lightboxable').find('.endRunChooser').change(function(){
						var chosenEndRun=globalRunlist[Number($(this).val())];
						if(chosenEndRun.end==chosenStartRun.end){
							$('.lightboxable').find('.startEndChooserEnd').val("1");
							$('.lightboxable').find('.startEndChooserEnd').find('.val0').prop('disabled',true);
						}
						else{
							$('.lightboxable').find('.startEndChooserEnd').find('.val0').prop('disabled',false);
						}
						var startEnd2=Number($('.lightboxable').find('.startEndChooserEnd').val());
						if(startEnd2==1){
							var compareTime2=Number(chosenEndRun.end);
						}
						else{
							var compareTime2=Number(chosenEndRun.start);
						}
						$('.lightboxable').find('.submitDiv').empty();
						$('.lightboxable').find('.submitDiv').append('<button class="submit button pill" style="font-size:150%">GO</button>');
						$('.lightboxable').find('.submitDiv').find('.submit').click(function(){
							$("#slider").dateRangeSlider("values",compareTime-1,compareTime2);
							$.colorbox.close();
						});
						$.colorbox.resize();
					});
					$.colorbox.resize();
				});
				$.colorbox.resize();
			});
			$('.lightboxable').find('.custom').click(function(){
				var editingExpression=-1;
				$('.lightboxable').find(".optionButtons").find(".button").each(function(){
					if($(this).hasClass("custom")){
						$(this).prop('disabled',true);
					}
					else{
						$(this).prop('disabled',false);
					}
				});
				$('.lightboxable').find('.currOption').empty();
				$('.lightboxable').find('.currOption').append('<div class="customDiv"><h2 style="margin:auto;text-align:center">Custom timeseries</h2></div>');
				if(objct.plotType==0){
					if(!('customTraces' in objct)){
						objct['customTraces']=[];
					}
					if(objct['customTraces'].length>0){
						$('.lightboxable').find('.currOption').find('.customDiv').append('<h4>Existing expressions (click to edit)</h4><div class="existingExpression"></div>');
						for (var i=0; i<objct['customTraces'].length; i++){
							$('.lightboxable').find('.currOption').find('.customDiv').find('.existingExpression').append('<button class="editExpression '+i+' button pill">'+objct['customTraces'][i].name+'</button>');
						}
					}
					$('.lightboxable').find('.currOption').find('.editExpression').click(function(){
						editingExpression=Number($(this).prop('class').split(' ')[1]);
						$('.lightboxable').find('.currOption').find('.customDiv').find('.exprName').val(objct['customTraces'][editingExpression].name);
						$('.lightboxable').find('.currOption').find('.customDiv').find('.customExpression').val(objct['customTraces'][editingExpression].expression);
						$('.lightboxable').find('.currOption').find('.customDiv').find('.customExpression').trigger('change');
					});
					$('.lightboxable').find('.currOption').find('.customDiv').append('<p>Expression identifier: <input class="exprName" value="Expression '+(objct['customTraces'].length+1)+'"></input></p><p>Provide a custom expression: <textarea class="customExpression" style="width:300px;height:50px"></textarea></p><div class="channelsUsed"></div>');
					$('.lightboxable').find('.currOption').find('.customDiv').find('.customExpression').change(function(){
						$('.lightboxable').find('.currOption').find('.customDiv').find('.nextP').remove();
						$('.lightboxable').find('.currOption').find('.customDiv').find('.channelsUsed').empty();
						$('.lightboxable').find('.currOption').find('.customDiv').find('.channelsUsed').append('<h4>Channels used</h4>');
						var theElement=$(this);
						$($(this).parent()).find(".outcome").remove();
						$(this).after('<img class="outcome" src="/static/loading.gif" height="25px" width="25px"></img>');
						if(!((typeof notyExpression)==="undefined")){
							notyExpression.close();
						}
						if(theElement.val().length<1){
							if(editingExpression>=0){
								objct['customTraces'].splice(editingExpression,1);
								$('.lightboxable').find('.custom').trigger('click');
							}
							$($(this).parent()).find(".outcome").remove();
							$('.lightboxable').find('.currOption').find('.customDiv').find('.channelsUsed').empty();
						}
						else{
							$.ajax({
								url: '/data/checkExpression',
								type: 'POST',
								dataType: "json",
								'theElement':theElement,
								contentType: "application/json; charset=UTF-8",
								data: JSON.stringify({'expression':theElement.val()}),
								async: false,
								success: function(returned){
									var returnedChannels=returned;
									$(theElement.parent()).find(".outcome").prop('src','/static/ok.png');
									$(theElement.parent()).find(".outcome").prop('title','This is a valid expression');
									if(returned.length>0){
										$('.lightboxable').find('.currOption').find('.customDiv').find('.channelsUsed').empty();
										$('.lightboxable').find('.currOption').find('.customDiv').find('.channelsUsed').append('<h4>Channels used</h4>');
										for (var i=0; i<returned.length; i++){
											$('.lightboxable').find('.currOption').find('.customDiv').find('.channelsUsed').append('<p>'+returned[i].instrument+' : '+returned[i].Name+'</p>');
										}
									}
									else{
										$('.lightboxable').find('.currOption').find('.customDiv').find('.channelsUsed').empty();
										$('.lightboxable').find('.currOption').find('.customDiv').find('.channelsUsed').append('<span style="color:#a94442;background-color:#f2dede">No data channels were used in this expression</span>');
									}
									$('.lightboxable').find('.currOption').find('.customDiv').append('<p class="nextP" style="float:right"><button class="cancelTrace button pill danger">Cancel</button><button class="submitTrace button pill">Submit</button></p>');
									$('.lightboxable').find('.currOption').find('.customDiv').find('.submitTrace').click(function(){
										if(editingExpression>=0){
											objct['customTraces'][editingExpression]={'channels':returnedChannels,'name':$('.lightboxable').find('.currOption').find('.customDiv').find('.exprName').val(),'expression':$('.lightboxable').find('.currOption').find('.customDiv').find('.customExpression').val()};
										}
										else{
											objct['customTraces'].push({'channels':returnedChannels,'name':$('.lightboxable').find('.currOption').find('.customDiv').find('.exprName').val(),'expression':$('.lightboxable').find('.currOption').find('.customDiv').find('.customExpression').val()});
										}
										$('.lightboxable').find('.custom').trigger('click');
										buildURL(objct);
									});
									$('.lightboxable').find('.currOption').find('.customDiv').find('.cancelTrace').click(function(){
										$('.lightboxable').find('.custom').trigger('click');
										buildURL(objct);
									});
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
						}
					});
				}
				else{
					$('.lightboxable').find('.currOption').find('.customDiv').append('<span style="color:#a94442;background-color:#f2dede">Not available for this type of plot</span>');
				}
			});
			$('.lightboxable').find('.layout').trigger('click');
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
		});
	}
	if(objct.visionType=="1"){//Layout Plot Options
		/*var height=500*objct.plots.length;
		$('.thebody').css({'height':height+'px'});*/
		//$('.mainContainer').before('<h3 style="margin:auto;text-align:center">'+objct.Name+'</h3>');
		$('.mainContainer').css({
			'display'               :   "grid",
			'grid-template-columns' :   "repeat(auto-fit, minmax(600px, 1400px))",
			'grid-auto-rows'        :   "1fr",
			'width'                 :   "100%",
			'height'                :   "100%",
			"justify-content"       :   "center"
		});
		for (var i=0; i<objct.plots.length; i++){
			$('.mainContainer').append('<div id="plotEnclosure'+i+'"></div>');
		}
		$('.backDiv').find('.plotOptions').click(function(){
			$('.lightboxable').empty();
			$('.lightboxable').append('<div class="optionButtons" style="align:center;text-align:center"><button class="layoutEdit button pill icon edit">Layout</button><button class="runs button pill icon calendar">Runs</button><button class="store button pill icon log">Save</button><hr style="width:25%"></div><div class="currOption"></div>');
			$('.lightboxable').find('.layoutEdit').click(function(){
				$('.lightboxable').find('.layoutEdit').attr('disabled',true);
				$('.lightboxable').find('.data').attr('disabled',false);
				$('.lightboxable').find('.store').attr('disabled',false);
				$('.lightboxable').find('.runs').attr('disabled',false);
				$('.lightboxable').find('.currOption').empty()
				$('.lightboxable').find('.currOption').append('LAYOUT');
				$.colorbox.resize();
			});
			$('.lightboxable').find('.store').click(function(){
				$('.lightboxable').find('.layoutEdit').attr('disabled',false);
				$('.lightboxable').find('.data').attr('disabled',false);
				$('.lightboxable').find('.runs').attr('disabled',false);
				$('.lightboxable').find('.store').attr('disabled',true);
				$('.lightboxable').find('.currOption').empty();
				$('.lightboxable').find('.currOption').append('<div><h3>Save this layout</h3><p>Name <input class="saveLayoutName"></input></p></div>');
				$('.lightboxable').find('.currOption').find('.saveLayoutName').on('input',function(){
					$('.lightboxable').find('.currOption').find('.savelayout-container').remove();
					$('.lightboxable').find('.currOption').find('.error-container').remove();
					var layoutExists=false;
					var saveLayoutName=$(this).val();
					if($(this).val()!=''){
						$.ajax({
							url: '/data/getLayouts',
							type: 'POST',
							dataType: "json",
							data:{'dbname':dbname},
							success: function(returned){
								$('.lightboxable').find('.currOption').find('.savelayout-container').remove();
								$('.lightboxable').find('.currOption').find('.error-container').remove();
								for (var j=0; j<returned.length; j++){
									if(returned[j].plotname==$('.lightboxable').find('.currOption').find('.saveLayoutName').val()){
										layoutExists=true;
									}
								}
								if(!layoutExists || 'layoutid' in objct){
									$('.lightboxable').find('.currOption').append('<p style="align:center;text-align:center" class="savelayout-container"><button class="savelayout button pill" style="font-size:125%">Save Plot</button></p>');
									$('.lightboxable').find('.currOption').find('.savelayout').click(function(){
										var toSend={
											'layoutname'           : saveLayoutName,
											'layoutid'       : objct.layoutid,
											'plots'          : objct.plots,
											'visionTypeNew'  : objct.visionTypeNew,
											'visionType'     : objct.visionType,
											'format'         : {'noPlots':objct.noPlots},
											'dbname'         : dbname
										};
										$.ajax({
											url: '/data/saveVisualization',
											type: 'POST',
											dataType: "json",
											contentType:'application/json',
											data : JSON.stringify(toSend),
											success: function(returned){
												objct.layoutid=returned;
												console.log(returned);
												objct.visionTypeNew='1';
												delete objct.plotOptions;
												delete objct.channels;
												delete objct.plotType;
												buildURL(globalObject);
												new Noty({
													text      :  'Layout \''+toSend.Name+'\' saved successfully',
													theme     :  'relax',
													type      :  'success',
													timeout   :  2000,
													callbacks :  {
														afterClose: function() {
															location.reload();
														}
													}
												}).show();
											},
											error: function(returned){
												new Noty({
													text    :  'There was an error saving layout data',
													theme   :  'relax',
													type    :  'error'
												}).show();
											}
										})
									});
								}
								else{
									new Noty({
										text    :  'Layout \''+$('.lightboxable').find('.currOption').find('.saveLayoutName').val()+'\'already exists',
										theme   :  'relax',
										type    :  'error'
									}).show();
								}
								$.colorbox.resize();
							},
							error: function(returned){
								new Noty({
									text    :  'There was an error collecting layout data, please refresh the page and try again!',
									theme   :  'relax',
									type    :  'error'
								}).show();
								$.colorbox.resize();
							}
						});
					}
					else{
						$('.lightboxable').find('.currOption').append('<p class="error-container"><span class="error" style="color:#a94442;background-color:#f2dede">Please provide a layout name</span></p>');
					}
					$.colorbox.resize();
				});
				if('Name' in objct){
					$('.lightboxable').find('.currOption').find('.saveLayoutName').val(objct.Name);
					$('.lightboxable').find('.currOption').find('.saveLayoutName').trigger('input');
				}
				$.colorbox.resize();
			});
			$('.lightboxable').find('.runs').click(function(){
				$('.lightboxable').find('.layout').prop('disabled',false);
				$('.lightboxable').find('.runs').prop('disabled',true);
				$('.lightboxable').find('.store').prop('disabled',false);
				$('.lightboxable').find('.currOption').empty();
				$('.lightboxable').find('.currOption').append('<div class="runChooser"><h2 style="margin:auto;text-align:center">Choose time via runs</h2><p></p><p></p><hr style="width:25%;margin:auto"><div class="startTime"></div><div class="endTime"></div><div style="text-align:center;margin:auto" class="submitDiv"></div></div>');
				$('.lightboxable').find('.startTime').append('<h3>Time Start</h3><p>Choose run : <select class="startRunChooser startinput"><option selected disabled>--- CHOOSE ONE ---</option></select>   |   <select class="startEndChooserStart startinput"><option value="0">Start</option><option value="1">End</option></select></p>');
				for (var i=0; i<globalRunlist.length; i++){
					$('.lightboxable').find('.startRunChooser').append('<option value="'+i+'">'+globalRunlist[i].run+' - '+globalRunlist[i].summary+'</option>');
				}
				$('.lightboxable').find('.startinput').change(function(){
					var startEnd1=Number($('.lightboxable').find('.startEndChooserStart').val());
					var chosenStartRun=globalRunlist[Number($(this).val())]
					if(startEnd1==1){
						var compareTime=Number(chosenStartRun.end);
					}
					else{
						var compareTime=Number(chosenStartRun.start);
					}
					$('.lightboxable').find('.submitDiv').empty();
					$('.lightboxable').find('.endTime').empty();
					$('.lightboxable').find('.endTime').append('<h3>Time End</h3><p>Choose run : <select class="endRunChooser"><option selected disabled>--- CHOOSE ONE ---</option></select>   |   <select class="startEndChooserEnd"><option class="val0" value="0">Start</option><option class="val1" value="1">End</option></select></p>');
					for (var i=0; i<globalRunlist.length; i++){
						if(Number(globalRunlist[i].end)>compareTime){
							$('.lightboxable').find('.endRunChooser').append('<option value="'+i+'">'+globalRunlist[i].run+' - '+globalRunlist[i].summary+'</option>');
						}
					}
					$('.lightboxable').find('.endRunChooser').change(function(){
						var chosenEndRun=globalRunlist[Number($(this).val())];
						if(chosenEndRun.end==chosenStartRun.end){
							$('.lightboxable').find('.startEndChooserEnd').val("1");
							$('.lightboxable').find('.startEndChooserEnd').find('.val0').prop('disabled',true);
						}
						else{
							$('.lightboxable').find('.startEndChooserEnd').find('.val0').prop('disabled',false);
						}
						var startEnd2=Number($('.lightboxable').find('.startEndChooserEnd').val());
						if(startEnd2==1){
							var compareTime2=Number(chosenEndRun.end);
						}
						else{
							var compareTime2=Number(chosenEndRun.start);
						}
						$('.lightboxable').find('.submitDiv').empty();
						$('.lightboxable').find('.submitDiv').append('<button class="submit button pill" style="font-size:150%">GO</button>');
						$('.lightboxable').find('.submitDiv').find('.submit').click(function(){
							$("#slider").dateRangeSlider("values",compareTime-1,compareTime2);
							$.colorbox.close();
						});
						$.colorbox.resize();
					});
					$.colorbox.resize();
				});
				$.colorbox.resize();
			});
			$('.lightboxable').find('.data').click(function(){
				$('.lightboxable').find('.layoutEdit').attr('disabled',false);
				$('.lightboxable').find('.data').attr('disabled',true);
				$('.lightboxable').find('.store').attr('disabled',false);
				$('.lightboxable').find('.currOption').empty()
				$('.lightboxable').find('.currOption').append('DATA');
				$.colorbox.resize();
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
		});
	}
	$("#onlinePlot").click(function(){
		var $this = $(this);
		objct['autoUpdate']=$this.prop('checked');
		if ($this.prop('checked')) {
			onlinePlot=1;
			nowDate=new Date;
			values_slider=$("#slider").dateRangeSlider("values");
			interval=values_slider.max.getTime()-values_slider.min.getTime();
			if(interval>3600000){
				nowDateSooner=new Date(nowDate.getTime()-3600000);
			}
			else{
				nowDateSooner=new Date(nowDate.getTime()-interval);
			}
			sliderBounds=$("#slider").dateRangeSlider("bounds");
			$("#slider").dateRangeSlider("bounds",sliderBounds.min,nowDate);
			$("#slider").dateRangeSlider("values",nowDateSooner,nowDate.getTime());
		}else{
			onlinePlot=0;
		}
	});
	if('autoUpdate' in objct){
		if(objct['autoUpdate']=='true'){
			objct['autoUpdate']=true;
		}
		if(objct['autoUpdate']=='false'){
			objct['autoUpdate']=false;
		}
		$('.mainEnclosure').find('#onlinePlot').prop('checked',objct['autoUpdate']);
		$('.mainEnclosure').trigger('click');
	}
	start_slider(globalTimeLims[0],globalTimeLims[1]);
	$('body').css({'height':'100%'});
	$('html').css({'height':'100%'});
}

function checkUpdate(){
	if (!((typeof globalObject )==='undefined')){
		if(globalObject.type=="0"){
			//if(!document.hidden){
				getLimits();
				var nowDate=new Date;
				var values_slider=$("#slider").dateRangeSlider("values");
				var interval=values_slider.max.getTime()-values_slider.min.getTime();
				if($("#onlinePlot").prop("checked") || globalObject.autoUpdate){
					var earlierDate=new Date(nowDate.getTime()-interval);
					bounds_slider=$("#slider").dateRangeSlider("bounds");
					interval=bounds_slider.max-bounds_slider.max;
					bounds_slider=$("#slider").dateRangeSlider("bounds",bounds_slider.min,nowDate);
					bounds_slider=$("#slider").dateRangeSlider("values",earlierDate,nowDate);
				}
			//}
		}
	}
}

function periodicCheckLimits(){
	$.ajax({
		method: "POST",
		url:"/instruments/getInstLimits",
		dataType: "json",
		data:{'database':dbname},
		success: function(result){
			var localBounds=$("#slider").dateRangeSlider("bounds");
			console.log(localBounds)
			var toChange=false;
			if(result.max>localBounds.max.getTime()){
				var toChange=true;
				var boundsMax=new Date(result.max);
			}
			else{
				var boundsMax=localBounds.max;
			}
			if(result.min<localBounds.min.getTime()){
				var toChange=true;
				var boundsMin=new Date(result.min);
			}
			else{
				var boundsMin=localBounds.min;
			}
			$("#slider").dateRangeSlider("bounds", boundsMin ,boundsMax)
			//globalCommentsImage=result.image;
		}
	});
	$.ajax({
		method: "POST",
		url:"/runs/getRunList",
		dataType: "json",
		data:{'database':dbname},
		success: function(result){
			globalRuns=result.runs;
		}
	});
	$.ajax({
		method: "POST",
		url:"/data/getPlotComments",
		dataType: "json",
		data:{'database':dbname},
		success: function(result){
			globalComments=result;
			//globalCommentsImage=result.image;
		}
	});
}