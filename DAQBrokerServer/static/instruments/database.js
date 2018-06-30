var instrumentsGlobal;

function listCurrentInstruments(){
	$(".loading").show();
	$.ajax({
		method: "POST",
		url:"queryInstruments",
		dataType: "json",
		data: {"database":dbname},
		success: function(returned,status,derp) {
			existingInstruments=returned;
			$(".content").show();
			$(".loading").hide();
			if(existingInstruments.length<1){
				var instTableEmptyString="No instruments found, make one!";
			}
			else{
				var instTableEmptyString='<img src="/static/loading.gif" width="30px" height="30px"> </img>';
			}
			theTableHead='<thead><tr><th>Name</th><th>Instrument ID</th><th>Data Entries</th><th>Status</th>';
			theTableHead=theTableHead+'</tr></thead>';
			$("#instTable").append(theTableHead);
			$(document).ready(function(){
				instrumentsTable=$('#instTable').DataTable({
					"order": [[ 1, "asc" ]],
					"columns": [
						{'title':'Name','name':"Name",data:"Name","visible":true,"width":"40%"},
						{'title':'Instrument ID','name':"Instrument ID",data:"Instrument ID","visible":true,"width":"10%"},
						{'title':'Data Entires','name':"Data Entires",data:"Data Entires","width":"20%"},
						{'title':'Status','name':"Status",data:"Status","visible":true,"width":"20%"}
					],
					"oLanguage": {
						"sEmptyTable":     instTableEmptyString
					},
					"columnDefs": [
						{"className": "dt-center", "targets": "_all"}
					],
					responsive:true
				});
				updateInstTable(1);
			});
		},
		error:function(returned){
			var n=new Noty({
				text      :  "There was an error collecting instrument information, please refresh your page and try again",
				theme     :  'relax',
				type      :  'error',
				timeout   :  '10000'
			}).show();
		}
	});
}
//"sEmptyTable":     "No instruments found, make one!"
//{'title':'','name':"Delete",data:"Delete","visible":true,"width":"10%"}