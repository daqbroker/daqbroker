//All possible colors for many ammounts of instruments
var defaultColors=["#000000","#8FB0FF","#1CE6FF","#FF34FF","#FF4A46","#008941","#006FA6","#A30059","#FFDBE5","#7A4900","#0000A6","#63FFAC","#B79762","#004D43","#FFFF00","#8FB0FF","#997D87","#5A0007","#809693","#FEFFE6","#1B4400","#4FC601","#3B5DFF","#4A3B53","#FF2F80","#61615A","#BA0900","#6B7900","#00C2A0","#FFAA92","#FF90C9","#B903AA","#D16100","#DDEFFF","#000035","#7B4F4B","#A1C299","#300018","#0AA6D8","#013349","#00846F","#372101","#FFB500","#C2FFED","#A079BF","#CC0744","#C0B9B2","#C2FF99","#001E09","#00489C","#6F0062","#0CBD66","#EEC3FF","#456D75","#B77B68","#7A87A1","#788D66","#885578","#FAD09F","#FF8A9A","#D157A0","#BEC459","#456648","#0086ED","#886F4C","#34362D","#B4A8BD","#00A6AA","#452C2C","#636375","#A3C8C9","#FF913F","#938A81","#575329","#00FECF","#B05B6F","#8CD0FF","#3B9700","#04F757","#C8A1A1","#1E6E00","#7900D7","#A77500","#6367A9","#A05837","#6B002C","#772600","#D790FF","#9B9700","#549E79","#FFF69F","#201625","#72418F","#BC23FF","#99ADC0","#3A2465","#922329","#5B4534","#FDE8DC","#404E55","#0089A3","#CB7E98","#A4E804","#324E72","#6A3A4C","#83AB58","#001C1E","#D1F7CE","#004B28","#C8D0F6","#A3A489","#806C66","#222800","#BF5650","#E83000","#66796D","#DA007C","#FF1A59","#8ADBB4","#1E0200","#5B4E51","#C895C5","#320033","#FF6832","#66E1D3","#CFCDAC","#D0AC94","#7ED379","#012C58","#7A7BFF","#D68E01","#353339","#78AFA1","#FEB2C6","#75797C","#837393","#943A4D","#B5F4FF","#D2DCD5","#9556BD","#6A714A","#001325","#02525F","#0AA3F7","#E98176","#DBD5DD","#5EBCD1","#3D4F44","#7E6405","#02684E","#962B75","#8D8546","#9695C5","#E773CE","#D86A78","#3E89BE","#CA834E","#518A87","#5B113C","#55813B","#E704C4","#00005F","#A97399","#4B8160","#59738A","#FF5DA7","#F7C9BF","#643127","#513A01","#6B94AA","#51A058","#A45B02","#1D1702","#E20027","#E7AB63","#4C6001","#9C6966","#64547B","#97979E","#006A66","#391406","#F4D749","#0045D2","#006C31","#DDB6D0","#7C6571","#9FB2A4","#00D891","#15A08A","#BC65E9","#FFFFFE","#C6DC99","#203B3C","#671190","#6B3A64","#F5E1FF","#FFA0F2","#CCAA35","#374527","#8BB400","#797868","#C6005A","#3B000A","#C86240","#29607C","#402334","#7D5A44","#CCB87C","#B88183","#AA5199","#B5D6C3","#A38469","#9F94F0","#A74571","#B894A6","#71BB8C","#00B433","#789EC9","#6D80BA","#953F00","#5EFF03","#E4FFFC","#1BE177","#BCB1E5","#76912F","#003109","#0060CD","#D20096","#895563","#29201D","#5B3213","#A76F42","#89412E","#1A3A2A","#494B5A","#A88C85","#F4ABAA","#A3F3AB","#00C6C8","#EA8B66","#958A9F","#BDC9D2","#9FA064","#BE4700","#658188","#83A485","#453C23","#47675D","#3A3F00","#061203","#DFFB71","#868E7E","#98D058","#6C8F7D","#D7BFC2","#3C3E6E","#D83D66","#2F5D9B","#6C5E46","#D25B88","#5B656C","#00B57F","#545C46","#866097","#365D25","#252F99","#00CCFF","#674E60","#FC009C","#92896B"];

function isOdd(num) { return num % 2;}

function add(a, b) {
	return Number(a) + Number(b);
}

function invertColor(hex) {
	if (hex.indexOf('#') === 0) {
		hex = hex.slice(1);
	}
	// convert 3-digit hex to 6-digits.
	if (hex.length === 3) {
		hex = hex[0] + hex[0] + hex[1] + hex[1] + hex[2] + hex[2];
	}
	if (hex.length !== 6) {
		throw new Error('Invalid HEX color.');
	}
	// invert color components
	var r = (255 - parseInt(hex.slice(0, 2), 16)).toString(16),
		g = (255 - parseInt(hex.slice(2, 4), 16)).toString(16),
		b = (255 - parseInt(hex.slice(4, 6), 16)).toString(16);
	// pad each with zeros and return
	if(r=="ff" && g=="ff" && b=="ff"){
		r="c3";
		g="c3";
		b="c3";
	}
	return '#' + padZero(r) + padZero(g) + padZero(b);
}

function padZero(str, len) {
	len = len || 2;
	var zeros = new Array(len).join('0');
	return (zeros + str).slice(-len);
}

function drawPlot(div,data,options,start,end,theParent){
	var thisData=[];
	Plotly.purge(div);
	$("#"+div).empty();
	if(options.plotType==0){
		
		var testAllLog=0;
		var layout={};
		var shapes=[];
		var selectedRuns=[];
		var annotations=[];
		var commentImages=[];

		if(options.showRuns){
			var warned=false;
			for(i=0;i<globalRunlist.length;i++){
				var date=new Date(Number(globalRunlist[i].start));
				if(globalRunlist[i].start>start & globalRunlist[i].start<end){
					shapes.push({line:{color:'#737373',width:3,dash:'dashdot'},type: 'line',xref:'x',yref:'paper',x0: Number(globalRunlist[i].start)+(date.getTimezoneOffset()*60*1000),x1:Number(globalRunlist[i].start)+(date.getTimezoneOffset()*60*1000),y0:0,y1:1});
					selectedRuns.push(globalRunlist[i]);
					var hoverText='Run:<b>'+globalRunlist[i]['run']+'</b><br>';
					var runKeys=Object.keys(globalRunlist[i]);
					for(j=0;j<runKeys.length;j++){
						if(runKeys[j]=='end'){
							hoverText=hoverText+runKeys[j]+':<b>'+moment.utc(Number(globalRunlist[i][runKeys[j]])).format('M/D/YYYY H:m:s')+'</b><br>';
						}
						else if(runKeys[j]=='start'){
							hoverText=hoverText+runKeys[j]+':<b>'+moment.utc(Number(globalRunlist[i][runKeys[j]])).format('M/D/YYYY H:m:s')+'</b>  |  ';
						}
						else if(runKeys[j]!='comments' && runKeys[j]!='run' && runKeys[j]!='active'){
							if(j%4==0){
								hoverText=hoverText+runKeys[j]+':<b>'+globalRunlist[i][runKeys[j]]+'</b><br>';
							}
							else{
								hoverText=hoverText+runKeys[j]+':<b>'+globalRunlist[i][runKeys[j]]+'</b>  |  ';
							}
						}
					}
					annotations.push({x:Number(globalRunlist[i].start)+(date.getTimezoneOffset()*60*1000),y:1,xref:'x',yref:'paper',yanchor:'top',text:globalRunlist[i].run,showarrow:true,arrowhead:7,ax:0,ay:-20,'hovertext':hoverText});
					if(options.showRunComments){
						try {
							var runComments=JSON.parse(globalRunlist[i].comments);
						}
						catch(err) {
							if(!warned){
								alert('Could not get some run comments : '+err.message);
							}
							var runComments=[];
						}
						if(runComments!=null){
							for(k=0;k<runComments.length;k++){
								//var theDistance=1-(k%10)/10;
								var theDistance=0.95;
								shapes.push({line:{color:'#737373',width:1,dash:'dashdot'},type: 'line',xref:'x',yref:'paper',x0: Number(runComments[k].time)+(date.getTimezoneOffset()*60*1000),x1:Number(runComments[k].time)+(date.getTimezoneOffset()*60*1000),y0:0,y1:1});
								annotations.push({x:Number(runComments[k].time)+(date.getTimezoneOffset()*60*1000),y:theDistance,xref:'x',yref:'paper','text':'c','hovertext':'<b>Date</b>:'+moment.utc(Number(runComments[k].time)).format('YYYY/MM/DD HH:mm:SS')+' <br> <b>Author</b>: '+runComments[k].author+' <br> <b>Comment</b>:'+runComments[k].comment,arrowhead:7,ax:0,ay:-20,'font':{'color':'#000000'},'hoverlabel':{'font':{'color':'#000000'},'bordercolor':'#D3D3D3','bgcolor':'#D3D3D3'}});
							}
						}
					}
				}
			}
		}
		
		for(i=0;i<data.length;i++){
			var date=new Date();
			if(options.channelOptions[i].comments){
				for(k=0;k<globalComments.length;k++){
					if(globalComments[k].channelid==data[i].channelID){//This is a comment that belongs to this data channel 
						var commentRemarks=JSON.parse(globalComments[k].remarks);
						console.log(Number(commentRemarks.x));
						if(Number(commentRemarks.x)>start && Number(commentRemarks.x)<end){
							if(!options.multiAxis || options.multiAxis=='false'){
								annotations.push({'x':Number(commentRemarks.x)+(date.getTimezoneOffset()*60*1000),'y':Number(commentRemarks.y),'xref':'x','yref':'y','text':globalComments[k].author,'hovertext':'<b>Date</b>:'+moment.utc(Number(globalComments[k].clock)).format('YYYY/MM/DD HH:mm:SS')+' <br> <b>Author</b>: '+globalComments[k].author+' <br> <b>Comment</b>:'+globalComments[k].comment,'ax':-50,'ay':-50,'arrowcolor':invertColor(options.channelOptions[i].color),'bgcolor':invertColor(options.channelOptions[i].color),'hoverlabel':{'bordercolor':options.channelOptions[i].color}});
							}
							else{
								if(i==0){
									annotations.push({'x':Number(commentRemarks.x)+(date.getTimezoneOffset()*60*1000),'y':Number(commentRemarks.y),'xref':'x','yref':'y','text':'<b>'+globalComments[k].author+'</b>','hovertext':'<b>Date</b>:'+moment.utc(Number(globalComments[k].clock)).format('YYYY/MM/DD HH:mm:SS')+' <br> <b>Author</b>: '+globalComments[k].author+' <br> <b>Comment</b>:'+globalComments[k].comment,'ax':-50,'ay':-50,'arrowcolor':invertColor(options.channelOptions[i].color),'bgcolor':invertColor(options.channelOptions[i].color),'hoverlabel':{'bordercolor':options.channelOptions[i].color}});
								}
								else{
									annotations.push({'x':Number(commentRemarks.x)+(date.getTimezoneOffset()*60*1000),'y':Number(commentRemarks.y),'xref':'x','yref':'y'+(i+1),'text':'<b>'+globalComments[k].author+'</b>','hovertext':'<b>Date</b>:'+moment.utc(Number(globalComments[k].clock)).format('YYYY/MM/DD HH:mm:SS')+' <br> <b>Author</b>: '+globalComments[k].author+' <br> <b>Comment</b>:'+globalComments[k].comment,'ax':-50,'ay':-50,'arrowcolor':invertColor(options.channelOptions[i].color),'bgcolor':invertColor(options.channelOptions[i].color),'font':{'color':options.channelOptions[i].color},'hoverlabel':{'bordercolor':options.channelOptions[i].color}});
								}
							}
						}
					}
				}
				if(Number(data[i].type)>0){
					var channRemarks=JSON.parse(data[i].remarks);
					var moreStuff={};
					if(Number(data[i].type)==1){
						instSearch=globalImport.Raw;
					}
					if(Number(data[i].type)==2){
						instSearch=globalImport.Processed;
					}
					if(Number(data[i].type)==3){
						instSearch=globalImport.Finalized;
					}
					if(Number(data[i].type)==4){
						instSearch=globalImport.Other;
					}
					for(k=0;k<instSearch.files.length;k++){
						if(instSearch.files[k].metaid==data[i].metaid){
							moreStuff['datasetAuthor']=instSearch.files[i].datasetAuthor;
							moreStuff['clock']=instSearch.files[i].clock;
						}
					}
					for(k=0;k<channRemarks.length;k++){
						for(j=0;j<globalRunlist.length;j++){
							if(globalRunlist[j]['run']==channRemarks[k]['run']){
								annotations.push({'x':Number(globalRunlist[j].start)+(date.getTimezoneOffset()*60*1000),'y':1,'xref':'x','yref':'paper','text':'<b>'+moreStuff['datasetAuthor']+'</b>','hovertext':'<b>Date</b>:'+moment.utc(Number(moreStuff['clock'])).format('YYYY/MM/DD HH:mm:SS')+' <br> <b>Author</b>: '+moreStuff['datasetAuthor']+' <br> <b>Comment</b>:'+channRemarks[i].reason,'ax':-50,'ay':-50,'arrowcolor':invertColor(options.channelOptions[i].color),'bgcolor':invertColor(options.channelOptions[i].color),'font':{'color':options.channelOptions[i].color},'hoverlabel':{'bordercolor':options.channelOptions[i].color}});
								break;
							}
						}
					}
				}
			}
		}

		var minY
		var maxY
		for(i=0;i<data.length;i++){
			thisData[i]={};
			thisData[i].x=[];
			thisData[i].y=[];
			thisData[i]["connectgaps"]=true;
			if(options.channelOptions[i].smoothing>0){
				for(k=0;k<data[i].data.length;k++){
					date=new Date(Number(data[i].data[k][0]));
					thisData[i].x[k]=new Date(date.getTime()+(date.getTimezoneOffset()*60*1000));
					thisData[i].y[k]=data[i].smoothedData[k][1];
				}
			}
			else{
				for(k=0;k<data[i].data.length;k++){
					if(data[i].data[k][1]==null){
						thisData[i].x[k]=null
						thisData[i].y[k]=null
					}
					else{
						date=new Date(Number(data[i].data[k][0]));
						thisData[i].x[k]=new Date(date.getTime()+(date.getTimezoneOffset()*60*1000));
						thisData[i].y[k]=data[i].data[k][1];
					}
				}
			}
			if(!((typeof options.channelOptions[i].miny)==='undefined')){
				if((typeof minY)==='undefined'){
					minY=Number(options.channelOptions[i].miny);
				}
				else{
					if(minY>Number(options.channelOptions[i].miny)){
						minY=Number(options.channelOptions[i].miny);
					}
				}
			}
			if(!((typeof options.channelOptions[i].maxy)==='undefined')){
				if((typeof maxY)==='undefined'){
					maxY=Number(options.channelOptions[i].maxy);
				}
				else{
					if(maxY<Number(options.channelOptions[i].maxy)){
						maxY=Number(options.channelOptions[i].maxy);
					}
				}
			}
			if(options.channelOptions[i].logscale || options.channelOptions[i].logscale=='true'){
				testAllLog=testAllLog+1;
			}
			thisData[i].type='scatter';
			thisData[i].mode='lines';
			//thisData[i]['legendgroup']=data[i].iname;
			thisData[i].line= {
				color: options.channelOptions[i].color,
				width: 3,
				shape:'hv'
			}
			thisData[i].name=data[i].iname+' : '+data[i].name;
			thisData[i].text='';
			if(options.channelOptions[i].disabled){
				thisData[i]['visible']='legendonly';
			}
		}
		var dateForOffset=new Date(start);
		
		if(!options.multiAxis || options.multiAxis=='false'){
			var axisScale='';
			var thePlotTitle='Mario\'s Lazy Plot';
			if('plotTitle' in options){
				thePlotTitle=options.plotTitle;
			}
			if(testAllLog==data.length){
				axisScale='log';
			}
			layout={
				title:thePlotTitle,
				yaxis:
				{
					fixedrange : true,
					type       : axisScale,
					tickfont: {
						family: 'sans-serif',
						size:18
					}
				},
				showlegend : true,
				hovermode  : 'closest',
				legend: {
					x: 0,
					y: 0.5,
					traceorder: 'normal',
					font: {
						family: 'sans-serif',
						size: 18,
						color: '#000'
					},
					bgcolor: '#E2E2E2',
					bordercolor: '#FFFFFF',
					borderwidth: 2
				},
				margin:{
					t:25,
					b:45,
					l:50,
					r:30,
				}
			};
			if(!((typeof minY)==='undefined') && !((typeof maxY)==='undefined')){
				if(maxY!=minY){
					layout.yaxis.range=[minY,maxY];
				}
			}
			else if(((typeof minY)==='undefined') && !((typeof maxY)==='undefined')){
				layout.yaxis.range=[0,maxY];
			}
			else if(!((typeof minY)==='undefined') && ((typeof maxY)==='undefined')){
				layout.yaxis.range=[minY,0];
			}
			layout.xaxis={range: [start+dateForOffset.getTimezoneOffset()*60*1000, end+dateForOffset.getTimezoneOffset()*60*1000],tickfont:{family: 'sans-serif',size:18}}
		}
		else{
			var thePlotTitle='Mario\'s Lazy Plot';
			if('plotTitle' in options){
				thePlotTitle=options.plotTitle;
			}
			layout.showlegend=false;
			layout.title=thePlotTitle;
			layout.margin={
				t:25,
				b:45,
				l:100,
				r:100
			}
			
			var noRights=0;
			var noLefts=0;
			for(i=0;i<data.length;i++){
				var axisScale='';
				if(options.channelOptions[i].logscale || options.channelOptions[i].logscale=='true'){
					axisScale='log';
				}
				if(i==0){
					layout['yaxis']={
						title      : data[i].name,
						titlefont  : {color: options.channelOptions[i].color,family: 'sans-serif',size:15},
						tickfont   : {color: options.channelOptions[i].color,family: 'sans-serif',size:15},
						fixedrange : true,
						type       : axisScale
					};
					noLefts=noLefts+1;
					if(options.channelOptions[i].miny!=options.channelOptions[i].maxy){
						if(!((typeof options.channelOptions[i].miny)==='undefined') && ((typeof options.channelOptions[i].maxy)==='undefined')){
							if(!((typeof maxY)==='undefined')){
								layout.yaxis.range=[options.channelOptions[i].miny,maxY];
							}
							else{
								layout.yaxis.range=[options.channelOptions[i].miny,0];
							}
						}
						else if(!((typeof options.channelOptions[i].maxy)==='undefined') && ((typeof options.channelOptions[i].miny)==='undefined')){
							if(!((typeof minY)==='undefined')){
								layout.yaxis.range=[minY,options.channelOptions[i].maxy];
							}
							else{
								layout.yaxis.range=[0,options.channelOptions[i].maxy];
							}
						}
						else if(!((typeof options.channelOptions[i].maxy)==='undefined') && !((typeof options.channelOptions[i].miny)==='undefined')){
							layout.yaxis.range=[options.channelOptions[i].miny,options.channelOptions[i].maxy];
						}
						//layout.yaxis.range=[options.channelOptions[i].minY,options.channelOptions[i].maxY];
					}
				}
				else{
					thisData[i].yaxis='y'+(i+1);
					var direction='';
					var positionAxis=0;
					var anchorValue='';
					if(isOdd(i)==1){
						direction='right';
						noRights=noRights+1;
						//positionAxis=2;
						if(noRights==1){
							anchorValue='x';
							positionAxis='';
						}
						else{
							anchorValue='free';
							positionAxis=1-(noRights-1)*0.033;
						}
					}
					else{
						direction='left';
						noLefts=noLefts+1;
						positionAxis=(noLefts-1)*0.033;
						//positionAxis=1;
						anchorValue='free';
						
					}
					layout['yaxis'+(i+1)]={
						title      : data[i].name,
						titlefont  : {color: options.channelOptions[i].color,size:15},
						tickfont   : {color: options.channelOptions[i].color,size:15},
						side       : direction,
						overlaying : 'y',
						position   : positionAxis,
						anchor     : anchorValue,
						fixedrange : true,
						type       : axisScale,
					};
					if(options.channelOptions[i].miny!=options.channelOptions[i].maxy){
						if(!((typeof options.channelOptions[i].miny)==='undefined') && ((typeof options.channelOptions[i].maxy)==='undefined')){
							if(!((typeof maxY)==='undefined')){
								layout['yaxis'+(i+1)].range=[options.channelOptions[i].miny,maxY];
							}
							else{
								layout['yaxis'+(i+1)].range=[options.channelOptions[i].miny,0];
							}
						}
						else if(!((typeof options.channelOptions[i].maxy)==='undefined') && ((typeof options.channelOptions[i].miny)==='undefined')){
							if(!((typeof minY)==='undefined')){
								layout['yaxis'+(i+1)].range=[minY,options.channelOptions[i].maxy];
							}
							else{
								layout['yaxis'+(i+1)].range=[0,options.channelOptions[i].maxy];
							}
						}
						else if(!((typeof options.channelOptions[i].maxy)==='undefined') && !((typeof options.channelOptions[i].miny)==='undefined')){
							layout['yaxis'+(i+1)].range=[options.channelOptions[i].miny,options.channelOptions[i].maxy];
						}
						//layout.yaxis.range=[options.channelOptions[i].minY,options.channelOptions[i].maxY];
					}
				}
				console.log()
				layout.xaxis={range: [start+dateForOffset.getTimezoneOffset()*60*1000, end+dateForOffset.getTimezoneOffset()*60*1000],tickfont:{family: 'sans-serif',size:18},domain:[noLefts*0.036,1-noRights*0.036]}
			}
			layout.hovermode='closest';
		}
		layout.annotations=annotations;
		layout.shapes=shapes;
		layout.images=commentImages;
		if(data.multiAxis==1){
			layout.xaxis['domain']=[0.25,0.90];
		}
		Plotly.newPlot(div,thisData,layout,{displayModeBar: false});
		
		
		//Plotly events
		
		$("#"+div).unbind('plotly_relayout');
		$("#"+div).on('plotly_relayout',function(event,range){
			var date=new Date();
			currentTime=$("#slider").dateRangeSlider('values');
			event.preventDefault();
			globalData=data;
			if(typeof range['xaxis.range[1]']==='undefined'){
				range['xaxis.range[1]']=currentTime.max.getTime();
			}
			if(typeof range['xaxis.range[0]']==='undefined'){
				range['xaxis.range[0]']=currentTime.min.getTime();
			}
			var timeRange=[new Date(range['xaxis.range[0]']),new Date(range['xaxis.range[1]'])]
			$("#slider").dateRangeSlider("values", new Date(timeRange[0].getTime()-(date.getTimezoneOffset()*60*1000)), new Date(timeRange[1].getTime()-(date.getTimezoneOffset()*60*1000)));
			$("#intervalSlider").val('NULL');
		});
		
		var hoverSecond=0;
		
		var dataHover={};
		

		$("#"+div).unbind('plotly_restyle');
		$("#"+div).on('plotly_restyle',function(restyle){
			var plotChannels=$("#"+div)[0].data;
			for(i=0;i<plotChannels.length;i++){
				for(j=0;j<theParent.channels.length;j++){
					if('smoothing' in theParent.plotOptions.channelOptions[j]){
						if(theParent.plotOptions.channelOptions[j].smoothing>0){
							theName=theParent.channels[j].name+' (MF '+theParent.plotOptions.channelOptions[j].smoothing+'%)';
						}
						else{
							var theName=theParent.channels[j].name;
						}
					}
					else{
						var theName=theParent.channels[j].name;
					}
					if(plotChannels[i].name==theName){
						if(!("onRefresh" in theParent)){
							theParent["onRefresh"]={};
						}
						if(plotChannels[i].visible=='legendonly' && !theParent.plotOptions.channelOptions[j].disabled){
							//globalObject.channels[j].disabled=true;
							theParent.plotOptions.channelOptions[j].disabled=true;
							theParent["onRefresh"][theParent.channels[j].name]=true;
						}
						if(plotChannels[i].visible!='legendonly' && theParent.plotOptions.channelOptions[j].disabled){
							theParent.plotOptions.channelOptions[j].disabled=false;
							theParent["onRefresh"][theParent.channels[j].name]=false;
						}
						break;
					}
				}
				if("customTraces" in theParent){
					for(j=0;j<theParent.customTraces.length;j++){
						var actualIndex=j+theParent.channels.length;
						if('smoothing' in theParent.plotOptions.channelOptions[actualIndex]){
							if(theParent.plotOptions.channelOptions[actualIndex].smoothing>0){
								theName='exp : '+theParent.customTraces[j].name+' (MF '+theParent.plotOptions.channelOptions[actualIndex].smoothing+'%)';
							}
							else{
								var theName='exp : '+theParent.customTraces[j].name;
							}
						}
						else{
							var theName='exp : '+theParent.customTraces[j].name;
						}
						if(plotChannels[i].name==theName){
							if(!("onRefresh" in theParent)){
								theParent["onRefresh"]={};
							}
							if(plotChannels[i].visible=='legendonly' && !theParent.plotOptions.channelOptions[actualIndex].disabled){
								//globalObject.channels[j].disabled=true;
								theParent.plotOptions.channelOptions[actualIndex].disabled=true;
								theParent["onRefresh"][theParent.customTraces[j].name]=true;
							}
							if(plotChannels[i].visible!='legendonly' && theParent.plotOptions.channelOptions[actualIndex].disabled){
								theParent.plotOptions.channelOptions[actualIndex].disabled=false;
								theParent["onRefresh"][theParent.customTraces[j].name]=false;
							}
							break;
						}
					}
				}
			}
		});

		$("#"+div).unbind('plotly_unhover');
		$("#"+div).on('plotly_unhover',function(event,points){
			
			//Setup contextmenu
			var menuContext=[
				{title: "Save", cmd: "save", uiIcon: "ui-icon-save",children:[
					{title: "Figure", cmd: "plot",uiIcon: "ui-icon-image"},
					{title: "Data", cmd: "data",uiIcon: "ui-icon-document"}
				]},
				{title: "Share", cmd: "share", uiIcon: "ui-icon-link"}
			];
			theContext = $("#"+div).contextmenu({
				delegate: "div",
				menu: menuContext,
				select: contextFunction
			});
			
			/* var menuContext={
			"Save"  : {"name" : "Save", "icon" : "save"},
			"Share" : {"name" : "Share", "icon" : "share"}
			};
			
			
			$.contextMenu({
				selector : "#"+div,
				callback: function(key,options){
					console.log(key,options)
				},
				items : menuContext
			}); */
			
			//Plotly.restyle($("#"+div)[0],updateUnselected,listUnselected);
		});
		
		$("#"+div).unbind('plotly_hover');
		$("#"+div).on('plotly_hover',function(event,points){
			var menuContext=[
				{title: "Save", cmd: "save", uiIcon: "ui-icon-save",children:[
					{title: "Figure", cmd: "plot",uiIcon: "ui-icon-image"},
					{title: "Data", cmd: "data",uiIcon: "ui-icon-document"}
				]},
				{title: "Add comment", cmd: "comment", uiIcon: "ui-icon-comment"},
				{title: "Share", cmd: "share", uiIcon: "ui-icon-link"}
			];
			
			theContext = $("#"+div).contextmenu({
				delegate: "div",
				menu: menuContext,
				select: contextFunction
			});
			
			/* var menuContext={
			"Save"  : {"name" : "Save", "icon" : "save"},
			"Share" : {"name" : "Share", "icon" : "share"}
			};
			
			
			$.contextMenu({
				selector : "#"+div,
				callback: function(key,options){
					console.log(key,options)
				},
				items : menuContext
			}); */
			
		});
		
		$(".optionsContainer").on('click',function(){
		});
		
		$("#"+div).unbind('click');
		$("#"+div).on('click',function(data){
			$("#"+div).contextmenu('open',$("#"+div));
		});
		
		var contextFunction=function(event,ui){
			if(ui.cmd=='plot'){
				var updateUnselected={
						'line.width':2
					};
				var listUnselected=[];
				for(i=0;i<$("#"+div)[0].data.length;i++){
					listUnselected.push(i);
				}
				Plotly.restyle($("#"+div)[0],updateUnselected,listUnselected);
				$("#"+div).trigger('plotly_unhover');
				Plotly.Fx.unhover(div);
				$(".lightboxable").empty();
				$('.lightboxable').find('.downloadPlotDiv').remove();
				$('.lightboxable').append('<div class="downloadPlotDiv" style="text-align:center;align:center"><h3>Download Plot Image</h3><p>File name:<input value="plot" class="downloadPlotInput fileName"></input></p><p>File Format: <select class="downloadPlotInput fileFormat"><option value="svg">SVG</option><option value="png">PNG</option></select></p></div>');
				$('.lightboxable').find('.downloadPlotInput').change(function(){
					var fileName=$('.lightboxable').find('.fileName').val();
					var fileFormat=$('.lightboxable').find('.fileFormat').val();
					savePlot(fileName,fileFormat,div);
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
			else if(ui.cmd=='data'){
				var updateUnselected={
						'line.width':2
					};
				var listUnselected=[];
				for(i=0;i<$("#"+div)[0].data.length;i++){
					listUnselected.push(i);
				}
				Plotly.restyle($("#"+div)[0],updateUnselected,listUnselected);
				$("#"+div).trigger('plotly_unhover');
				$(".lightboxable").empty();
				$('.lightboxable').find('.downloadDataDiv').remove();
				$('.lightboxable').find('.downloadPlotDiv').remove();
				$('.lightboxable').append('<div class="downloadDataDiv" style="text-align:center;align:center"><h3>Download Plot Data</h3><p>File name:<input value="data.txt" class="downloadDataInput fileName"></input></p><p>Time Format: <select class="downloadDataInput timeFormat"><option value="unix" selected>Unix</option><option value="igor">Labview/Igor</option><option value="matlab">Matlab</option><option value="string">Time String</option></select></p></div>');
				$('.lightboxable').find('.downloadDataInput').change(function(){
					var fileName=$('.lightboxable').find('.fileName').val();
					var timeFormat=$('.lightboxable').find('.timeFormat').val();
					getPlotData(data,fileName,timeFormat);
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
			else if(ui.cmd=='comment'){
				$(".lightboxable").empty();
				$('.lightboxable').append('<div class="comment" style="text-align:center;align:center"><h3>Insert plot comment</h3><p>Details:<div class="commentDetails"></div>Comment text: <textarea placeholder="Insert your comment here" class="commentText commentInput"></textarea><p>Author: <input class="author commentInput"></input></div>');
				$('.lightboxable').find('.commentDetails').append('<p>Trace: <span class="emphasise">'+dataHover.points[0].data.name+'</span></p><p>X: <span class="emphasise">'+dataHover.points[0].x+'</span></p><p>Y: <span class="emphasise">'+dataHover.points[0].y+'</span></p>');
				var channelid=-1;
				for(i=0;i<data.length;i++){
					var nameCheck='';
					nameCheck=data[i].iname+ ' : ' + data[i].name;
					if(dataHover.points[0].data.name==nameCheck){
						channelid=data[i].channelID;
					}
				}
				$('.lightboxable').find('.commentDetails').find('.emphasise').css({'font-weight':'bold'});
				$('.lightboxable').find('.commentInput').on('input',function(){
					var commentText=$('.lightboxable').find('.commentText').val();
					var commentAuthor=$('.lightboxable').find('.author').val();
					$('.lightboxable').find('.insertCommentDiv').remove();
					$('.lightboxable').find('.errorCommentDiv').remove();
					if(commentText.length>0 && commentAuthor.length>0){
						$('.lightboxable').append('<div class="insertCommentDiv" style="margin:auto;text-align:center"><button class="insertComment button pill" style="font-size:150%">Insert Comment</button></div>');
						$('.lightboxable').find('.insertComment').click(function(){
							if(options.plotType==0){
								var theDate=new Date(dataHover.points[0].x);
								var remarks={
									'x'   :   theDate.getTime()-theDate.getTimezoneOffset()*60*1000,
									'y'   :   dataHover.points[0].y
								};
							}
							var toSend={
								'channelid'  : channelid,
								'plotid'     : -1,
								'comment'    : commentText,
								'author'     : commentAuthor,
								'clock'      : moment.utc().valueOf(),
								'remarks'    : remarks,
							};
							if('plotTitle' in options){
								$.ajax({
									url: 'getPlots.php',
									type: 'POST',
									dataType: "json",
									success: function(returned){
										for(i=0;i<returned.plots.length;i++){
											if(returned.plots[i].plotname==options.plotTitle){
												toSend.plotid=returned.plots[i].plotid;
											}
										}
										createComment(toSend);
									},
									error: function(returned){
										alert('error collecting plot data');
									}
								});
							}
							else{
								createComment(toSend);
							}
						});
					}
					else{
						$('.lightboxable').append('<div class="errorCommentDiv" style="color:#a94442;background-color:#f2dede">Please insert a comment and an author!</div>');
					}
					$.colorbox.resize();
				});
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
			else if(ui.cmd=='share'){
				var newObject = jQuery.extend({}, globalObject);
				delete newObject.channelData
				delete newObject.binChannelData
				delete newObject.dataChannelData
				newObject['dbname']=dbname;
				$.ajax({
					url: '/daqbroker/genLink',
					type: 'POST',
					dataType: "text",
					contentType: "application/json",
					data:JSON.stringify({'site':'data','var':newObject}),
					success: function(returned){
						var theConfirm=$.confirm({
							title: 'Share link',
							content: 'Use this link to share your visualization <div><h4>'+window.location.href.split('/')[0]+'//'+window.location.href.split('/')[2]+'/daqbroker/links/'+returned+'</h4></div>This link is valid for <b>7 days</b>.',
							autoClose: 'logoutUser|30000',
							type: 'dark',
							buttons: {
								logoutUser: {
									text: 'Close',
									btnClass: 'btn-blue',
									action: function () {
										theConfirm.close();
									}
								}
							}
						});
					},
					error: function(returned){
						var theConfirm=$.confirm({
							title: 'Error',
							content: 'There was an error generating your link, please try again <div>'+JSON.stringify(returned)+'</div>',
							autoClose: 'logoutUser|5000',
							type: 'red',
							buttons: {
								logoutUser: {
									text: 'Close',
									btnClass: 'btn-red',
									action: function () {
										theConfirm.close();
									}
								}
							}
						});
					}
				});
			}
		}
		
		var menuContext=[
			{title: "Save", cmd: "save", uiIcon: "ui-icon-save",children:[
				{title: "Figure", cmd: "plot",uiIcon: "ui-icon-image"},
				{title: "Data", cmd: "data",uiIcon: "ui-icon-document"}
			]},
			{title: "Share", cmd: "share", uiIcon: "ui-icon-link"}
		];
		
		theContext = $("#"+div).contextmenu({
			delegate: "div",
			menu: menuContext,
			select: contextFunction
		});
		
		/* var menuContext={
			"Save"  : {"name" : "Save", "icon" : "save"},
			"Share" : {"name" : "Share", "icon" : "share"}
		};
		
		
		$.contextMenu({
			selector : "#"+div,
			callback: function(key,options){
				console.log(key,options)
			},
			items : menuContext
		}); */
		
		
	}
	else if(options.plotType==1){
		
		var testAllLog=0;
		var layout={};
		
		var shapes=[];
		var selectedRuns=[];
		var annotations=[];
		var commentImages=[];

		if(options.showRuns){
			date=new Date();
			for(i=0;i<globalRunlist.length;i++){
				if(globalRunlist[i].start>start & globalRunlist[i].start<end){
					shapes.push({line:{color:'#737373',width:3,dash:'dashdot'},type: 'line',xref:'x',yref:'paper',x0: Number(globalRunlist[i].start)+(date.getTimezoneOffset()*60*1000),x1:Number(globalRunlist[i].start)+(date.getTimezoneOffset()*60*1000),y0:0,y1:1});
					selectedRuns.push(globalRunlist[i]);
					var hoverText='Run:<b>'+globalRunlist[i]['run']+'</b><br>';
					var runKeys=Object.keys(globalRunlist[i]);
					for(j=0;j<runKeys.length;j++){
						if(runKeys[j]=='end'){
							hoverText=hoverText+runKeys[j]+':<b>'+moment.utc(Number(globalRunlist[i][runKeys[j]])).format('M/D/YYYY H:m:s')+'</b><br>';
						}
						else if(runKeys[j]=='start'){
							hoverText=hoverText+runKeys[j]+':<b>'+moment.utc(Number(globalRunlist[i][runKeys[j]])).format('M/D/YYYY H:m:s')+'</b>  |  ';
						}
						else if(runKeys[j]!='comments' && runKeys[j]!='run' && runKeys[j]!='active'){
							if(j%4==0){
								hoverText=hoverText+runKeys[j]+':<b>'+globalRunlist[i][runKeys[j]]+'</b><br>';
							}
							else{
								hoverText=hoverText+runKeys[j]+':<b>'+globalRunlist[i][runKeys[j]]+'</b>  |  ';
							}
						}
					}
					annotations.push({x:Number(globalRunlist[i].start)+(date.getTimezoneOffset()*60*1000),y:1,xref:'x',yref:'paper',yanchor:'top',text:globalRunlist[i].run,showarrow:true,arrowhead:7,ax:0,ay:-20,'hovertext':hoverText});
					if(options.showRunComments){
						try {
							var runComments=JSON.parse(globalRunlist[i].comments);
						}
						catch(err) {
							alert('Could not get run comments : '+err.message);
						}
						for(k=0;k<runComments.length;k++){
							//var theDistance=1-(k%10)/10;
							var theDistance=0.95;
							shapes.push({line:{color:'#737373',width:1,dash:'dashdot'},type: 'line',xref:'x',yref:'paper',x0: Number(runComments[k].time)+(date.getTimezoneOffset()*60*1000),x1:Number(runComments[k].time)+(date.getTimezoneOffset()*60*1000),y0:0,y1:1});
							annotations.push({x:Number(runComments[k].time)+(date.getTimezoneOffset()*60*1000),y:theDistance,xref:'x',yref:'paper','text':'c','hovertext':'<b>Date</b>:'+moment.utc(Number(runComments[k].time)).format('YYYY/MM/DD HH:mm:SS')+' <br> <b>Author</b>: '+runComments[k].author+' <br> <b>Comment</b>:'+runComments[k].comment,arrowhead:7,ax:0,ay:-20,font:{'color':'#000000'},'hoverlabel':{'font':{'color':'#000000'},'bordercolor':'#D3D3D3','bgcolor':'#D3D3D3'}});
						}
					}
				}
			}
		}
		
		var commentsShown=[];
		for(i=0;i<data.length;i++){
			date=new Date();
			if(options.comments){
				for(k=0;k<globalComments.length;k++){
					if(globalComments[k].channelid==data[i].channelID ){//This is a comment that belongs to this data channel 
						var commentRemarks=JSON.parse(globalComments[k].remarks);
						if(Number(commentRemarks.x)>start && Number(commentRemarks.x)<end){
							if(commentsShown.indexOf(globalComments[k].comment)<0){//Check for text already put in;
								commentsShown.push(globalComments[k].comment);
								annotations.push({'x':Number(commentRemarks.x)+(date.getTimezoneOffset()*60*1000),'y':'1','xref':'x','yref':'paper','text':globalComments[k].author,'hovertext':'<b>Date</b>:'+moment.utc(Number(globalComments[k].clock)).format('YYYY/MM/DD HH:mm:SS')+' <br> <b>Author</b>: '+globalComments[k].author+' <br> <b>Comment</b>:'+globalComments[k].comment,'ax':-50,'ay':-50,'arrowcolor':'#D3D3D3','bgcolor':'#D3D3D3','hoverlabel':{'font':{'color':'#000000'},'bordercolor':'#D3D3D3'}});
							}
						}
					}
				}
				if(Number(data[i].type)>0){
					var channRemarks=JSON.parse(data[i].remarks);
					var moreStuff={};
					if(Number(data[i].type)==1){
						instSearch=globalImport.Raw;
					}
					if(Number(data[i].type)==2){
						instSearch=globalImport.Processed;
					}
					if(Number(data[i].type)==3){
						instSearch=globalImport.Finalized;
					}
					if(Number(data[i].type)==4){
						instSearch=globalImport.Other;
					}

					for(k=0;k<instSearch.files.length;k++){
						if(instSearch.files[k].metaid==data[i].metaid){
							moreStuff['datasetAuthor']=instSearch.files[i].datasetAuthor;
							moreStuff['clock']=instSearch.files[i].clock;
						}
					}
					for(k=0;k<channRemarks.length;k++){
						for(j=0;j<globalRunlist.length;j++){
							if(globalRunlist[j]['run']==channRemarks[k]['run']){
								if(commentsShown.indexOf(globalComments[k].comment)<0){//Check for text already put in;
									commentsShown.push(globalComments[k].comment);
									annotations.push({'x':Number(globalRunlist[j].start)+(date.getTimezoneOffset()*60*1000),'y':1,'xref':'x','yref':'paper','text':'<b>'+moreStuff['datasetAuthor']+'</b>','hovertext':'<b>Date</b>:'+moment.utc(Number(moreStuff['clock'])).format('YYYY/MM/DD HH:mm:SS')+' <br> <b>Author</b>: '+moreStuff['datasetAuthor']+' <br> <b>Comment</b>:'+channRemarks[i].reason,'ax':-50,'ay':-50,'arrowcolor':'#D3D3D3','bgcolor':'#D3D3D3','font':{'color':'#000000'},'hoverlabel':{'bordercolor':'#D3D3D3'}});
									break;
								}
							}
						}
					}
				}
			}
		}
		//Must make 3 arrays
		//x array of times, should be simple with already interpolated arrays
		//y array of bins, simple for fixed bins, more complicated for time varying bins
		//z true challenge a matrix of x.length by y.length, is simpler when considering fixed y axis but must be made after y axis is confirmed
		thisData={};
		thisData.type='heatmap';
		thisData.x=[];
		thisData.y=[];
		thisData.z=[];
		
		temp=[];
		//Building the x axis - same for all vectors due to interpolation
		for(k=0;k<data[0].data.length;k++){
			if(data[0].data[k][1]==null){
				thisData.x[k]=null
				temp
			}
			else{
				date=new Date(Number(data[0].data[k][0]));
				thisData.x[k]=new Date(date.getTime()+(date.getTimezoneOffset()*60*1000));
				temp.push(Number(data[0].data[k][0]));
				//thisData.x[k]=Number(data[0].data[k][0]);
			}
		}
		
		//Building y axis - differs between fixed and time varying axis
		var uniques=[];
		var allUniques=[];
		if(options.surfaceType==1){//Time varying bins
			for(i=0;i<options['binChannelData'].length;i++){
				uniques.push([]);
				for(k=0;k<options['binChannelData'][i].data.length;k++){
					if(options['binChannelData'][i].data[k][1]!=null){
						if(uniques[i].indexOf(roundExponential(Number(options['binChannelData'][i].data[k][1])))<0){
							uniques[i].push(roundExponential(Number(options['binChannelData'][i].data[k][1])));
						}
					}
				}
				for(q=0;q<uniques[i].length;q++){
					if(allUniques.indexOf(uniques[i][q])<0){
						allUniques.push(uniques[i][q]);
					}
				}
				thisData.y=allUniques;
			}
		}
		if(options.surfaceType==2){//Fixed bins
			thisData.y=options['binChannels'] //Easy
			uniques=thisData.y;
		}
		console.log(uniques);
		//Does sorting fix weird issue?
		thisData.y.sort(function(a,b){return a-b;});
		
		var maxZ;
		var minZ;
		//Building z axis - already have x and y axis, must build z matrix, this is simple for fixed bins but comlpicated for time varying bins
		if(options.surfaceType==1){//Time varying bins
			for(i=0;i<thisData.x.length;i++){//Go through time
				thisData.z.push([]);
				for(k=0;k<thisData.y.length;k++){//Go through bins
					thisData.z[i].push(NaN);
				}
				for(q=0;q<uniques.length;q++){
					for(k=0;k<thisData.y.length;k++){//Go through bins
						var idx=thisData.y.indexOf(roundExponential(Number(options['binChannelData'][q].data[k][1])));
						if(idx>=0){
							if((typeof maxZ)==='undefined'){
								maxZ=Number(data[q].data[i][1]);
							}
							else{
								if(Number(data[q].data[i][1])>maxZ){
									maxZ=Number(data[q].data[i][1]);
								}
							}
							if((typeof minZ)==='undefined'){
								minZ=Number(data[q].data[i][1]);
							}
							else{
								if(Number(data[q].data[i][1])>minZ){
									minZ=Number(data[q].data[i][1]);
								}
							}
							thisData.z[i][idx]=Number(data[q].data[i][1]);
						}
						else{
							console.log(idx);
						}
						//thisData.z[i].push(Number(data[k].data[i][1]));
					}
				}
			}
		}
		else if(options.surfaceType==2){//Fixed bins
			for(i=0;i<thisData.x.length;i++){//Go through time
				thisData.z.push([]);
				for(k=0;k<thisData.y.length;k++){//Go through bins
					thisData.z[i].push(Number(data[k].data[i][1]));
					if((typeof maxZ)==='undefined'){
						maxZ=Number(data[k].data[i][1]);
					}
					else{
						if(Number(data[k].data[i][1])>maxZ){
							maxZ=Number(data[k].data[i][1]);
						}
					}
					if((typeof minZ)==='undefined'){
						minZ=Number(data[k].data[i][1]);
					}
					else{
						if(Number(data[k].data[i][1])<minZ){
							minZ=Number(data[k].data[i][1]);
						}
					}
				}
			}
		}
		
		console.log(maxZ,minZ);
		
		var axisScale='';
		var thePlotTitle='Mario\'s Lazy Plot';
		if('plotTitle' in options){
			thePlotTitle=options.plotTitle;
		}
		if(options.ylogAxis){
			axisScale='log';
		}
		if(options.connectgaps){
			thisData['connectgaps']=true;
		}
		else{
			thisData['connectgaps']=false;
		}
		layout={
			title:thePlotTitle,
			yaxis:{
				fixedrange : true,
				type       : axisScale
			},
			showlegend : true,
			hovermode  : 'closest'
		};
		//Checking limits for manual
		//Y axis
		if((typeof options.maxy)==='undefined' && !((typeof options.miny)==='undefined')){
			options.maxy=0;
		}
		else if((typeof options.miny)==='undefined' && !((typeof options.maxy)==='undefined')){
			options.miny=0;
		}
		if(!((typeof options.miny)==='undefined') && !((typeof options.maxy)==='undefined')){
			if(options.miny!=options.maxy){
				console.log(options.miny,options.maxy);
				layout.yaxis.range=[options.miny,options.maxy];
			}
		}
		//Z axis
		if((typeof options.maxz)==='undefined' && !((typeof options.minz)==='undefined')){
			options.maxz=0;
		}
		else if((typeof options.minz)==='undefined' && !((typeof options.maxz)==='undefined')){
			options.minz=0;
		}
		if(!((typeof options.minz)==='undefined') && !((typeof options.maxz)==='undefined')){
			if(options.minz!=options.maxz){
				thisData['zmin']=options.minz;
				thisData['zmax']=options.maxz;
				maxZ=options.maxz;
				minZ=options.minz;
				thisData['zauto']=false;
			}
			else{
				thisData['zauto']=true;
			}
		}
		if(((typeof options.minz)==='undefined') && ((typeof options.maxz)==='undefined')){
			thisData['zauto']=true;
		}
		
		if(options.zlogAxis){
			//var logColors=["rgb(49,54,149)","rgb(69,117,180)","rgb(116,173,209)","rgb(171,217,233)","rgb(224,243,248)","rgb(254,224,144)","rgb(253,174,97)","rgb(244,109,67)","rgb(215,48,39)"];
			var logColors=["rgb(49,54,149)","rgb(69,117,180)","rgb(116,173,209)","rgb(253,174,97)","rgb(244,109,67)","rgb(215,48,39)"];
			if(minZ<0){
				minZ=0;
			}
			var difference=maxZ-minZ;
			var magnitudes=Math.log10(difference);
			thisData['colorscale']=[];
			var tickvals=[];
			console.log(magnitudes);
			console.log(logColors.length);
			for (var i=0; i<logColors.length; i++){
				if(i>0){
					thisData['colorscale'].push([roundExponential(Math.pow(10,Math.log10(minZ)+i*(Math.log10(maxZ)-Math.log10(minZ))/(logColors.length-1))/maxZ),logColors[i]]);
				}
				else{
					thisData['colorscale'].push([0,logColors[i]]);
				}
			}
			console.log(thisData['colorscale']);
			for (var i=0; i<magnitudes; i++){
				if(i>0){
					tickvals.push(Math.pow(10,i));
					//tickvals.push(2*Math.pow(10,i));
					tickvals.push(5*Math.pow(10,i));
				}
				else{
					tickvals.push(0);
					//tickvals.push(2);
					tickvals.push(5);
				}
			}
			if(Math.round(magnitudes)>magnitudes){
				tickvals.push(Math.pow(10,Math.round(magnitudes)));
			}
			
			
			thisData['colorbar']={
				'tick0': 0,
				'tickmode': 'array',
				'tickvals': tickvals
			};
		}
		else{
			thisData['colorscale']=options.colorscale;
		}
		layout.annotations=annotations;
		layout.shapes=shapes;
		dateForOffset=new Date(start);
		layout.xaxis={range: [start+dateForOffset.getTimezoneOffset()*60*1000, end+dateForOffset.getTimezoneOffset()*60*1000]}
		thisData['transpose']=true;
		
		thisData['hoverinfo']='all';
		Plotly.newPlot(div,[thisData],layout,{displayModeBar: false});
		
		$("#"+div).unbind('plotly_relayout');
		$("#"+div).on('plotly_relayout',function(event,range){
			date=new Date();
			currentTime=$("#slider").dateRangeSlider('values');
			event.preventDefault();
			globalData=data;
			if(typeof range['xaxis.range[1]']==='undefined'){
				range['xaxis.range[1]']=currentTime.max.getTime();
			}
			if(typeof range['xaxis.range[0]']==='undefined'){
				range['xaxis.range[0]']=currentTime.min.getTime();
			}
			var timeRange=[new Date(range['xaxis.range[0]']),new Date(range['xaxis.range[1]'])]
			$("#slider").dateRangeSlider("values", new Date(timeRange[0].getTime()-(date.getTimezoneOffset()*60*1000)), new Date(timeRange[1].getTime()-(date.getTimezoneOffset()*60*1000)));
			$("#intervalSlider").val('NULL');
		});
		
		var hoverSecond=0;
		
		var dataHover={};
		
		$("#"+div).unbind('plotly_unhover');
		$("#"+div).on('plotly_unhover',function(event,points){
			/*dataHover={};
			var updateUnselected={
					'line.width':2
				};
			var listUnselected=[];
			for(i=0;i<$("#"+div)[0].data.length;i++){
				listUnselected.push(i);
			}
			
			//Setup contextmenu*/
			var menuContext=[
				{title: "Save", cmd: "save", uiIcon: "ui-icon-save",children:[
					{title: "Figure", cmd: "plot",uiIcon: "ui-icon-image"},
					{title: "Data", cmd: "data",uiIcon: "ui-icon-document"}
				]}
			];
			
			$("#"+div).contextmenu({
				delegate: "svg",
				menu: menuContext,
				select: contextFunction
			});
			
			Plotly.restyle($("#"+div)[0],updateUnselected,listUnselected);
		});
		
		$("#"+div).unbind('plotly_hover');
		$("#"+div).on('plotly_hover',function(event,points){
			dataHover=points;
			/*if(hoverSecond==0){
				
				var plotData=$("#"+div)[0].data;
				
				var listSelected=[];
				var listUnselected=[];
				Plotly.moveTraces($("#"+div)[0],points.points[0].curveNumber,0);
				
				var updateSelected={};
				updateSelected['line.width']=5;
				var updateUnselected={};
				updateUnselected['line.width']=2;

				hoverSecond=1;
				
				var dateGood=moment.utc(points.points[0].x)._d.getTime();
				
				for(i=0;i<plotData.length;i++){
					if(i==points.points[0].curveNumber){
						listSelected.push(i);
					}
					else{
						listUnselected.push(i);
					}
				}
				Plotly.restyle($("#"+div)[0],updateSelected,listSelected);
				Plotly.restyle($("#"+div)[0],updateUnselected,listUnselected);
				var dateGood=moment.utc(points.points[0].x)._d.getTime();
				for(i=0;i<selectedRuns.length;i++){
					if(selectedRuns[i].start<=dateGood && selectedRuns[i].start<end){
						if(i<selectedRuns.length-1){
							if(selectedRuns[i+1].start>=dateGood){
								textTooltip='<b>'+selectedRuns[i].run+'</b> : '+selectedRuns[i].summary;
								var update={
									'hoverlabel' : textTooltip
								};
								Plotly.restyle($("#"+div)[0],update);
								break;
							}
							else{
								continue;
							}
						}
						else{
							textTooltip='<b>'+selectedRuns[i].run+'</b> : '+selectedRuns[i].summary;
							var update={
								'hoverlabel' : textTooltip
							};
							Plotly.restyle($("#"+div)[0],update);
							break;
						}
					}
					else{
						var update={
							'text' : ''
						};
						Plotly.restyle($("#"+div)[0],update);
					}
				}*/
				//setTimeout(function(){ hoverSecond=0; }, 300);//To not overload the PC with crazy ammounts of changes
			//}
			
			var menuContext=[
				{title: "Save", cmd: "save", uiIcon: "ui-icon-save",children:[
					{title: "Figure", cmd: "plot",uiIcon: "ui-icon-image"},
					{title: "Data", cmd: "data",uiIcon: "ui-icon-document"}
				]},
				{title: "Add comment", cmd: "comment", uiIcon: "ui-icon-comment"}
			];
			
			$("#"+div).contextmenu({
				delegate: "svg",
				menu: menuContext,
				select: contextFunction
			});
		});
		
		var contextFunction=function(event,ui){
			if(ui.cmd=='plot'){
				var updateUnselected={
						'line.width':2
					};
				var listUnselected=[];
				for(i=0;i<$("#"+div)[0].data.length;i++){
					listUnselected.push(i);
				}
				Plotly.restyle($("#"+div)[0],updateUnselected,listUnselected);
				$("#"+div).trigger('plotly_unhover');
				Plotly.Fx.unhover(div);
				$(".lightboxable").empty();
				$('.lightboxable').find('.downloadPlotDiv').remove();
				$('.lightboxable').append('<div class="downloadPlotDiv" style="text-align:center;align:center"><h3>Download Plot Image</h3><p>File name:<input value="plot" class="downloadPlotInput fileName"></input></p><p>File Format: <select class="downloadPlotInput fileFormat"><option value="svg">SVG</option><option value="png">PNG</option></select></p></div>');
				$('.lightboxable').find('.downloadPlotInput').change(function(){
					var fileName=$('.lightboxable').find('.fileName').val();
					var fileFormat=$('.lightboxable').find('.fileFormat').val();
					savePlot(fileName,fileFormat,div);
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
			else if(ui.cmd=='data'){
				var updateUnselected={
						'line.width':2
					};
				var listUnselected=[];
				for(i=0;i<$("#"+div)[0].data.length;i++){
					listUnselected.push(i);
				}
				Plotly.restyle($("#"+div)[0],updateUnselected,listUnselected);
				$("#"+div).trigger('plotly_unhover');
				$(".lightboxable").empty();
				$('.lightboxable').find('.downloadDataDiv').remove();
				$('.lightboxable').find('.downloadPlotDiv').remove();
				$('.lightboxable').append('<div class="downloadDataDiv" style="text-align:center;align:center"><h3>Download Plot Data</h3><p>File name:<input value="data.txt" class="downloadDataInput fileName"></input></p><p>Time Format: <select class="downloadDataInput timeFormat"><option value="unix" selected>Unix</option><option value="igor">Labview/Igor</option><option value="matlab">Matlab</option><option value="string">Time String</option></select></p></div>');
				$('.lightboxable').find('.downloadDataInput').change(function(){
					var fileName=$('.lightboxable').find('.fileName').val();
					var timeFormat=$('.lightboxable').find('.timeFormat').val();
					if(Number(options.plotType==1)){
						if(Number(options.surfaceType==1)){
							var allData=[];
							for(j=0;j<options['binChannelData'].length;j++){
								allData.push(options['binChannelData'][j]);
							}
							for(i=0;i<data.length;i++){
								allData.push(data[i]);
							}
							getPlotData(allData,fileName,timeFormat);
						}
						else{
							for(j=0;j<options['binChannels'].length;j++){
								data[j].name=data[j].name+'(Bin : '+options['binChannels'][j]+')'
							}
							getPlotData(data,fileName,timeFormat);
						}
					}
					else{
						getPlotData(data,fileName,timeFormat);
					}
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
			else if(ui.cmd=='comment'){
				$(".lightboxable").empty();
				$('.lightboxable').append('<div class="comment" style="text-align:center;align:center"><h3>Insert plot comment</h3><p>Details:<div class="commentDetails"></div>Comment text: <textarea placeholder="Insert your comment here" class="commentText commentInput"></textarea><p>Author: <input class="author commentInput"></input></div>');
				$('.lightboxable').find('.commentDetails').append('<p>Trace: <span class="emphasise">'+dataHover.points[0].data.name+'</span></p><p>X: <span class="emphasise">'+dataHover.points[0].x+'</span></p><p>Y: <span class="emphasise">'+dataHover.points[0].y+'</span></p>');
				var channelid=-1;
				for(i=0;i<data.length;i++){
					var nameCheck='';
					nameCheck=data[i].iname+ ' : ' + data[i].name;
					if(dataHover.points[0].data.name==nameCheck){
						channelid=data[i].channelID;
					}
				}
				$('.lightboxable').find('.commentDetails').find('.emphasise').css({'font-weight':'bold'});
				$('.lightboxable').find('.commentInput').on('input',function(){
					var commentText=$('.lightboxable').find('.commentText').val();
					var commentAuthor=$('.lightboxable').find('.author').val();
					$('.lightboxable').find('.insertCommentDiv').remove();
					$('.lightboxable').find('.errorCommentDiv').remove();
					if(commentText.length>0 && commentAuthor.length>0){
						$('.lightboxable').append('<div class="insertCommentDiv" style="margin:auto;text-align:center"><button class="insertComment button pill" style="font-size:150%">Insert Comment</button></div>');
						$('.lightboxable').find('.insertComment').click(function(){
							for(i=0;i<data.length;i++){
								var theDate=new Date(dataHover.points[0].x);
								var remarks={
									'x'   :   theDate.getTime()-theDate.getTimezoneOffset()*60*1000,
									'y'   :   dataHover.points[0].y
								};
								var toSend={
									'channelid'  : data[i].channelID,
									'plotid'     : -1,
									'comment'    : commentText,
									'author'     : commentAuthor,
									'clock'      : (moment.utc().valueOf()+(i*1000)),
									'remarks'    : remarks,
								};
								if('plotTitle' in options){
									$.ajax({
										url: 'getPlots.php',
										type: 'POST',
										'toSend': toSend,
										dataType: "json",
										success: function(returned){
											console.log(this);
											for(i=0;i<returned.plots.length;i++){
												if(returned.plots[i].plotname==options.plotTitle){
													this.toSend.plotid=returned.plots[i].plotid;
												}
											}
											createComment(this.toSend);
										},
										error: function(returned){
											alert('error collecting plot data');
										}
									});
								}
								else{
									createComment(toSend);
								}
							}
						});
					}
					else{
						$('.lightboxable').append('<div class="errorCommentDiv" style="color:#a94442;background-color:#f2dede">Please insert a comment and an author!</div>');
					}
					$.colorbox.resize();
				});
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
				{title: "Figure", cmd: "plot",uiIcon: "ui-icon-image"},
				{title: "Data", cmd: "data",uiIcon: "ui-icon-document"}
			]}
		];
		
		$("#"+div).contextmenu({
			delegate: "svg",
			menu: menuContext,
			select: contextFunction
		});
		
	}
	else if(Number(options.plotType)==2){
		console.log(data);
		console.log(options);
		console.log('MAKING A BAR CHART');
		thisData={};
		thisData.type='bar';
		thisData.x=[];
		thisData.y=[];
		thisData.z=[];
		
		layout={};
		layout.xaxis={};
		layout.yaxis={};
		
		//Checking limits for manual
		//Y axis
		if((typeof options.maxy)==='undefined' && !((typeof options.miny)==='undefined')){
			options.maxy=0;
		}
		else if((typeof options.miny)==='undefined' && !((typeof options.maxy)==='undefined')){
			options.miny=0;
		}
		if(!((typeof options.miny)==='undefined') && !((typeof options.maxy)==='undefined')){
			if(options.miny!=options.maxy){
				console.log(options.miny,options.maxy);
				layout.yaxis.range=[Number(options.miny),Number(options.maxy)];
			}
		}
		if(options.barType==1){
			//x axis (categories)
			//Building the x axis - go through all binChannels and remove a set of "bins"
			var uniques=[];
			var allUniques=[];
			for(i=0;i<options['binChannelData'].length;i++){
				uniques.push([]);
				for(k=0;k<options['binChannelData'][i].data.length;k++){
					if(options['binChannelData'][i].data[k][1]!=null){
						if(uniques[i].indexOf(roundExponential(Number(options['binChannelData'][i].data[k][1])))<0){
							uniques[i].push(roundExponential(Number(options['binChannelData'][i].data[k][1])));
						}
					}
				}
				for(q=0;q<uniques[i].length;q++){
					if(allUniques.indexOf(uniques[i][q])<0){
						allUniques.push(uniques[i][q]);
					}
				}
				allUniques=allUniques.sort(function(a, b){return a-b});
				thisData.x=allUniques;
			}
			//Building y axis - go through each data channel and build a trace
			var traces=[]
			for(i=0;i<data.length;i++){
				traces.push({});
				traces[i].x=allUniques;
				traces[i].y=[];
				traces[i].name=data[i].iname+' : '+data[i].name;
				traces[i].type='bar';
				traces[i].marker={'color':options.channelOptions[i].color};
				for(j=0;j<traces[i].x.length;j++){
					traces[i].y.push([]);
				}
				for(k=0;k<data[i].data.length;k++){
					for(o=0;o<options['binChannelData'].length;o++){
						//console.log(options['binChannelData'][o]);
						//console.log(options['binChannelData'][o].data[k][1]);
						if(traces[i].x.indexOf(roundExponential(Number(options['binChannelData'][o].data[k][1])))>=0){
							if(options.channelOptions[i].smoothing>0){
								traces[i].y[traces[i].x.indexOf(roundExponential(Number(options['binChannelData'][o].data[k][1])))].push(Number(data[i].smoothedData[k][1]));
							}
							else{
								traces[i].y[traces[i].x.indexOf(roundExponential(Number(options['binChannelData'][o].data[k][1])))].push(Number(data[i].data[k][1]));
							}
							//break
						}
					}
				}
			}
			//Must make here decision between average or mean
			for(i=0;i<traces.length;i++){
				for(j=0;j<traces[i].y.length;j++){
					var total=0;
					var number=0;
					for(k=0;k<traces[i].y[j].length;k++){
						total=total+traces[i].y[j][k];
						number=number+1;
					}
					traces[i].y[j]=total;
					if(options.channelOptions[i].colType==1){
						traces[i].y[j]=traces[i].y[j]/number;
					}
				}
			}
			layout.barmode='group';
			/* var maxX=Math.max.apply(Math,traces[0].x);
			var minX=Math.min.apply(Math,traces[0].x);
			layout.xaxis.range=[minX,maxX]; */
			layout.xaxis.type='category';
			if(options.ylogAxis){
				layout.yaxis['type']='log';
			}
			else{
				layout.yaxis['type']='linear';
			}
			Plotly.newPlot(div,traces,layout,{displayModeBar: false});
		}
		else if(options.barType==2){
			var traces=[];
			for(i=0;i<data.length;i++){
				traces.push({});
				traces[i].x=options.catChannels;
				traces[i].y=[];
				traces[i].name='trace '+(i+1);
				traces[i].type='bar';
				traces[i].marker={};
				traces[i].text=[];
				traces[i].marker.color=[];
				for(j=0;j<data[i].length;j++){
					var total=0;
					var number=0;
					var theText='';
					traces[i].marker.color.push(options.channelOptions[i][j].color);
					theText=theText+'Channel : <b>'+data[i][j].name+'</b><br>';
					if(options.channelOptions[i][j].smoothing>0){
						for(k=0;k<data[i][j].smoothedData.length;k++){
							total=total+Number(data[i][j].smoothedData[k][1]);
							number=number+1;
						}
					}
					else{
						for(k=0;k<data[i][j].data.length;k++){
							total=total+Number(data[i][j].data[k][1]);
							number=number+1;
						}
					}
					if(options.channelOptions[i][j].colType==1){
						theText=theText+'Collection : Average';
						traces[i].y.push(total/number);
					}
					else{
						theText=theText+'Collection : Sum';
						traces[i].y.push(total);
					}
					traces[i].text.push(theText);
					//traces[i].y.push(data[i][j].data[]);
				}
			}
			console.log(traces);
			layout.barmode='group';
			/* var maxX=Math.max.apply(Math,traces[0].x);
			var minX=Math.min.apply(Math,traces[0].x);
			layout.xaxis.range=[minX,maxX]; */ 
			layout.xaxis.type='category';
			if(options.ylogAxis){
				layout.yaxis['type']='log';
			}
			else{
				layout.yaxis['type']='linear';
			}
			console.log(traces);
			console.log(layout);
			Plotly.newPlot(div,traces,layout,{displayModeBar: false});
			
		}
		temp=[];
		
		var contextFunction=function(event,ui){
			if(ui.cmd=='plot'){
				var updateUnselected={
						'line.width':2
					};
				var listUnselected=[];
				for(i=0;i<$("#"+div)[0].data.length;i++){
					listUnselected.push(i);
				}
				Plotly.restyle($("#"+div)[0],updateUnselected,listUnselected);
				$("#"+div).trigger('plotly_unhover');
				Plotly.Fx.unhover(div);
				$(".lightboxable").empty();
				$('.lightboxable').find('.downloadPlotDiv').remove();
				$('.lightboxable').append('<div class="downloadPlotDiv" style="text-align:center;align:center"><h3>Download Plot Image</h3><p>File name:<input value="plot" class="downloadPlotInput fileName"></input></p><p>File Format: <select class="downloadPlotInput fileFormat"><option value="svg">SVG</option><option value="png">PNG</option></select></p></div>');
				$('.lightboxable').find('.downloadPlotInput').change(function(){
					var fileName=$('.lightboxable').find('.fileName').val();
					var fileFormat=$('.lightboxable').find('.fileFormat').val();
					savePlot(fileName,fileFormat,div);
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
			else if(ui.cmd=='data'){
				var updateUnselected={
						'line.width':2
					};
				var listUnselected=[];
				for(i=0;i<$("#"+div)[0].data.length;i++){
					listUnselected.push(i);
				}
				Plotly.restyle($("#"+div)[0],updateUnselected,listUnselected);
				$("#"+div).trigger('plotly_unhover');
				$(".lightboxable").empty();
				$('.lightboxable').find('.downloadDataDiv').remove();
				$('.lightboxable').find('.downloadPlotDiv').remove();
				$('.lightboxable').append('<div class="downloadDataDiv" style="text-align:center;align:center"><h3>Download Plot Data</h3><p>File name:<input value="data.txt" class="downloadDataInput fileName"></input></p><p>Time Format: <select class="downloadDataInput timeFormat"><option value="unix" selected>Unix</option><option value="igor">Labview/Igor</option><option value="matlab">Matlab</option><option value="string">Time String</option></select></p></div>');
				if(options.barType==1){
					var allData=[];
					for(i=0;i<options.binChannelData.length;i++){
						allData.push(options.binChannelData[i])
					}
					for(i=0;i<data.length;i++){
						allData.push(data[i])
					}
					$('.lightboxable').find('.downloadDataInput').change(function(){
						var fileName=$('.lightboxable').find('.fileName').val();
						var timeFormat=$('.lightboxable').find('.timeFormat').val();
						getPlotData(allData,fileName,timeFormat);
						$.colorbox.resize();
					});
				}
				else if(options.barType==2){
					var allData=[];
					for(i=0;i<data.length;i++){
						for(j=0;j<data[j].length;j++){
							allData.push(data[i][j]);
						}
					}
					$('.lightboxable').find('.downloadDataInput').change(function(){
						var fileName=$('.lightboxable').find('.fileName').val();
						var timeFormat=$('.lightboxable').find('.timeFormat').val();
						getPlotData(allData,fileName,timeFormat);
						$.colorbox.resize();
					});
				}
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
			else if(ui.cmd=='comment'){
				$(".lightboxable").empty();
				$('.lightboxable').append('<div class="comment" style="text-align:center;align:center"><h3>Insert plot comment</h3><p>Details:<div class="commentDetails"></div>Comment text: <textarea placeholder="Insert your comment here" class="commentText commentInput"></textarea><p>Author: <input class="author commentInput"></input></div>');
				$('.lightboxable').find('.commentDetails').append('<p>Trace: <span class="emphasise">'+dataHover.points[0].data.name+'</span></p><p>X: <span class="emphasise">'+dataHover.points[0].x+'</span></p><p>Y: <span class="emphasise">'+dataHover.points[0].y+'</span></p>');
				var channelid=-1;
				for(i=0;i<data.length;i++){
					var nameCheck='';
					nameCheck=data[i].iname+ ' : ' + data[i].name;
					if(dataHover.points[0].data.name==nameCheck){
						channelid=data[i].channelID;
					}
				}
				$('.lightboxable').find('.commentDetails').find('.emphasise').css({'font-weight':'bold'});
				$('.lightboxable').find('.commentInput').on('input',function(){
					var commentText=$('.lightboxable').find('.commentText').val();
					var commentAuthor=$('.lightboxable').find('.author').val();
					$('.lightboxable').find('.insertCommentDiv').remove();
					$('.lightboxable').find('.errorCommentDiv').remove();
					if(commentText.length>0 && commentAuthor.length>0){
						$('.lightboxable').append('<div class="insertCommentDiv" style="margin:auto;text-align:center"><button class="insertComment button pill" style="font-size:150%">Insert Comment</button></div>');
						$('.lightboxable').find('.insertComment').click(function(){
							if(options.plotType==0){
								var theDate=new Date(dataHover.points[0].x);
								var remarks={
									'x'   :   theDate.getTime()-theDate.getTimezoneOffset()*60*1000,
									'y'   :   dataHover.points[0].y
								};
							}
							var toSend={
								'channelid'  : channelid,
								'plotid'     : -1,
								'comment'    : commentText,
								'author'     : commentAuthor,
								'clock'      : moment.utc().valueOf(),
								'remarks'    : remarks,
							};
							if('plotTitle' in options){
								$.ajax({
									url: 'getPlots.php',
									type: 'POST',
									dataType: "json",
									success: function(returned){
										for(i=0;i<returned.plots.length;i++){
											if(returned.plots[i].plotname==options.plotTitle){
												toSend.plotid=returned.plots[i].plotid;
											}
										}
										createComment(toSend);
									},
									error: function(returned){
										alert('error collecting plot data');
									}
								});
							}
							else{
								createComment(toSend);
							}
						});
					}
					else{
						$('.lightboxable').append('<div class="errorCommentDiv" style="color:#a94442;background-color:#f2dede">Please insert a comment and an author!</div>');
					}
					$.colorbox.resize();
				});
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
				{title: "Figure", cmd: "plot",uiIcon: "ui-icon-image"},
				{title: "Data", cmd: "data",uiIcon: "ui-icon-document"}
			]}
		];
		
		$("#"+div).contextmenu({
			delegate: "svg",
			menu: menuContext,
			select: contextFunction
		});
	}
}

function roundExponential(number){
	if(number!=NaN || (!(typeof number)==='undefined')){
		var strNumber=number.toExponential();
		var theSplit=strNumber.split('e')[0];
		var theNumber=theSplit.split('.')[0];
		/*if(theSplit.length==1){
			var theExp=strNumber.split('e')[1];
			var theMatters='0';
		}
		else{
			var theExp=strNumber.split('e')[1];
			var theMatters=strNumber.split('.')[1].split('e')[0];
		}
		var roundSub=Math.floor(parseFloat('0.'+theMatters)*10)/10;
		var roundedNumber=(parseFloat(theInteger)+roundSub)+'e'+theExp;*/
		var theExp=strNumber.split('e')[1];
		if(theSplit.length==1){//No decimal numbers
			var integer=theNumber;
			var sub=0;
		}
		else{
			var integer=theNumber.split('.')[0];
			var sub=theNumber.split('.')[1];
		}
		var roundSub=Math.floor(parseFloat('0.'+sub)*100)/100;
		var roundedNumber=(parseFloat(integer)+roundSub)+'e'+theExp;
	}
	else{
		var roundedNumber=NaN;
	}
	return parseFloat(roundedNumber)
}
