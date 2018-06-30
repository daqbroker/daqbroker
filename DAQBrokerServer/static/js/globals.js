function addNewPath(type){
	$('.lightboxable').empty();
	$('.lightboxable').append('<h3 style="text-align:center;margin:auto">Add new server path</h3><hr style="text-align:center;margin:auto;width:25%"><div class="newServerDiv"><p>Path : <input class="serverStuff serverPath"></input></p></div><div class="buttonDiv" style="margin:auto;text-align:center"></div>');
	$('.lightboxable').find('.serverStuff').on('input',function(){
		var foundEmpty=false;
		$('.lightboxable').find('.serverStuff').each(function(){
			if($(this).val()==''){
				foundEmpty=true;
			}
		});
		if(foundEmpty){
			$('.lightboxable').find('.buttonDiv').empty();
			$('.lightboxable').find('.buttonDiv').append('<span style="background-color:#f2dede">Fill out all inputs!<span>');
		}
		else{
			$('.lightboxable').find('.buttonDiv').empty();
			$('.lightboxable').find('.buttonDiv').append('<button class="sendNewServerStuff button pill" style="font-size:150%">Submit</button>');
			$('.lightboxable').find('.buttonDiv').find('.sendNewServerStuff').click(function(){
				var theNewPath={
					'addFolder'      :  $('.lightboxable').find('.serverPath').val(),
					'folderChange'   :  type,
					'clock'          :  globalSettings.clock,
					'_csrf_token'    :  $('body').find('.sessionToken').val()
				};
				$('.lightboxable').find('.buttonDiv').find('.insertError').remove();
				$('.lightboxable').find('.buttonDiv').append('<p class="insertError"><img src="../images/loading.gif" width="25px" height="25px"> </img></p>');
				$.ajax({
					method: "POST",
					url:"/daqbroker/checkFolders",
					data:theNewPath,
					dataType: "json",
					success: function(returned) {
						$('.lightboxable').find('.buttonDiv').find('.insertError').remove();
						if('warning' in returned){
							populateMisc();
							$('.lightboxable').find('.buttonDiv').append('<p class="insertError"><span class="ntpError" style="background-color:#fcf8e3">'+returned.warning+'</span></p>');
							$('.ntpError').fadeOut(2000, function() {
								$('.ntpError').empty();
								$.colorbox.close();
							});
						}
						else{
							$.colorbox.close();
							var warning='You must restart the server application for your changes to take effect';
							populateMisc(warning);
						}
					},
					error:function(returned){
						$('.lightboxable').find('.buttonDiv').find('.insertError').remove();
						$('.lightboxable').find('.buttonDiv').append('<p class="insertError"><span class="ntpError" style="background-color:#f2dede">'+returned.errorStr+'</span></p>');
						if('errorMsg' in returned){
							$('.lightboxable').find('.buttonDiv').find('.insertError').append('|'+returned.errorMsg);
						}
						$.colorbox.resize();
					}
				});
				$.colorbox.resize();
			});
		}
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
			globalUpdateOngoing=false;
		},
		width:"75%",
		maxWidth: "1000px",
		closeButton	:false
	});
}

function addNewNTPServer(){
	$('.lightboxable').empty();
	$('.lightboxable').append('<h3 style="text-align:center;margin:auto">Add new NTP server</h3><hr style="text-align:center;margin:auto;width:25%"><div class="newServerDiv"><p>Server name <input class="serverStuff serverName"></input></p><p>Server port <input type="number" placeholder="123" class="serverStuff serverPort"></input></p></div><div class="buttonDiv" style="margin:auto;text-align:center"></div>');
	$('.lightboxable').find('.serverStuff').on('input',function(){
		var foundEmpty=false;
		$('.lightboxable').find('.serverStuff').each(function(){
			if($(this).val()==''){
				foundEmpty=true;
			}
		});
		if(foundEmpty){
			$('.lightboxable').find('.buttonDiv').empty();
			$('.lightboxable').find('.buttonDiv').append('<span style="background-color:#f2dede">Fill out all inputs!<span>');
		}
		else{
			$('.lightboxable').find('.buttonDiv').empty();
			$('.lightboxable').find('.buttonDiv').append('<button class="sendNewServerStuff button pill" style="font-size:150%">Submit</button>');
			$('.lightboxable').find('.buttonDiv').find('.sendNewServerStuff').click(function(){
				var theNewServer={
					'addServer'   :  $('.lightboxable').find('.serverName').val(),
					'port'        :  $('.lightboxable').find('.serverPort').val(),
					'clock'       :  globalSettings.clock,
					'_csrf_token' :  $('body').find('.sessionToken').val(),
				};
				$('.lightboxable').find('.buttonDiv').find('.insertError').remove();
				$('.lightboxable').find('.buttonDiv').append('<p class="insertError"><img src="../images/loading.gif" width="25px" height="25px"> </img></p>');
				$.ajax({
					method: "POST",
					url:"/daqbroker/checkNTPServers",
					data:theNewServer,
					dataType: "json",
					success: function(returned) {
						$('.lightboxable').find('.buttonDiv').find('.insertError').remove();
						populateMisc();
						$.colorbox.close();
					},
					error:function(){
						$('.lightboxable').find('.buttonDiv').find('.insertError').remove();
						$('.lightboxable').find('.buttonDiv').append('<p class="insertError"><span class="ntpError" style="background-color:#f2dede">'+returned.errorStr+'</span></p>');
						if('errorMsg' in returned){
							$('.lightboxable').find('.buttonDiv').find('.insertError').append('|'+error.errorMsg);
						}
						$.colorbox.resize();
					}
				});
				$.colorbox.resize();
			});
		}
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
			globalUpdateOngoing=false;
		},
		width:"75%",
		maxWidth: "1000px",
		closeButton	:false
	});
}

function checkSettings(callback,callback2){
	$.ajax({
		method: "POST",
		url:"/daqbroker/discoverSettings",
		data:{'_csrf_token':$('body').find('.sessionToken').val()},
		dataType: "json",
		success: function(returned) {
			var serverSettigns=returned;
			var test=JSON.parse(sessionStorage.getItem('daqbroker'));
			if(test){
				console.log(test.server,$("#daqbroker_server").val(),test.engine,$("#daqbroker_engine").val());
				if(test.server == $("#daqbroker_server").val() && test.engine == $("#daqbroker_engine").val()){
					if('dbname' in test){
						dbname=test['dbname'];
					}
				}
				else{
					var toPush={'server':$("#daqbroker_server").val(),'engine':$("#daqbroker_engine").val()};
					sessionStorage.setItem('daqbroker',JSON.stringify(toPush));
				}
			}
			else{
				var toPush={'server':$("#daqbroker_server").val(),'engine':$("#daqbroker_engine").val()};
				sessionStorage.setItem('daqbroker',JSON.stringify(toPush));
			}
			if(localStorage.getItem('newTab')){
				dbname=localStorage.getItem('newTab');
				localStorage.removeItem('newTab');
			}
			if(returned.settingsExist){
				if(!returned.adminExist){
					$.confirm({
						title    :  'No admin account created',
						content  :  '<p>No record of an administrator account is present in this server, for this database engine.</p> <p> <span style="color: #8a6d3b;background-color: #fcf8e3;border-color: #faebcc;">You will not be able to create instruments with the current available accounts or preform active instrument monitoring in this server, for this database </span></p> <p> You can still browse instruments and their data.</p> <p>Press \'Okay\' to continiue or click \'Logout\' to go back to the login page and login with a different account</p>',
						type     :  'orange',
						buttons  :  {
							yes : {
								text   :  "Okay",
								btnClass: 'btn-blue',
								action : function () {
									if(serverSettigns.monActive){ 
										$('.theSettings').find('#adminMonitor').find('.status').html('Active');
										$('.theSettings').find('#adminMonitor').find('.status').attr('title','The monitoring process is currently running');
										$('.theSettings').find('#adminMonitor').find('.status').css({'color':'#4F8A10'});
									}
									else{
										$('.theSettings').find('#adminMonitor').find('.status').html('Inactive');
										$('.theSettings').find('#adminMonitor').find('.status').attr('title','The monitoring process has been stopped or has crashed');
										$('.theSettings').find('#adminMonitor').find('.status').css({'color':'#D8000C'});
									}
									$(".hamburger").prepend('<span style="font-size:20px;padding-right:5px">'+returned.username+'</span>');
									if(!((typeof callback2)==='undefined')){
										if(callback){
											checkDatabase(callback,callback2);
										}
										else{
											callback2();
										}
									}
									else{
										if(callback){
											checkDatabase(callback);
										}
									}
								}
							},
							no:  {
								text    :  'Logout',
								btnClass: 'btn-red',
								action  :  function(){
									document.location.href='../logout';
								}
							}
						}
					});
				}
				else{
					if(serverSettigns.monActive){ 
						$('.theSettings').find('#adminMonitor').find('.status').html('Active');
						$('.theSettings').find('#adminMonitor').find('.status').attr('title','The monitoring process is currently running');
						$('.theSettings').find('#adminMonitor').find('.status').css({'color':'#4F8A10'});
					}
					else{
						$('.theSettings').find('#adminMonitor').find('.status').html('Inactive');
						$('.theSettings').find('#adminMonitor').find('.status').attr('title','The monitoring process has been stopped or has crashed');
						$('.theSettings').find('#adminMonitor').find('.status').css({'color':'#D8000C'});
					}
					$(".hamburger").prepend('<span style="font-size:20px;padding-right:5px">'+returned.username+'</span>');
					if(!((typeof callback2)==='undefined')){
						if(callback){
							checkDatabase(callback,callback2);
						}
						else{
							callback2();
						}
					}
					else{
						if(callback){
							checkDatabase(callback);
						}
					}
				}
			}
			else{
				$.confirm({
					title    :  'No settings found',
					content  :  'We could not find DAQBroker settings on this server, would you like to create new settings?<p><span style="color: #8a6d3b;background-color: #fcf8e3;border-color: #faebcc;">NOTE: This user must have permissions to create database tables, please consult your network administrator if you are unsure of this procedure</span></p>',
					type     :  'orange',
					buttons  :  {
						yes : {
							text   :  "Create Settings",
							btnClass: 'btn-blue',
							action : function () {
								$.ajax({
									method: "POST",
									url:"/admin/setupSettings",
									dataType: "json",
									success: function(returned){
										$.confirm({
											title: 'Success!',
											content: 'Settings successfully created, you will be redirected to the main page in 10 seconds to start using DAQbroker!',
											autoClose: 'logoutUser|10000',
											type: 'green',
											buttons: {
												logoutUser: {
													text: 'Go now',
													btnClass: 'btn-green',
													action: function () {
														document.location.href='/daqbroker';
													}
												}
											}
										});
									},
									error:function(returned){
										$.confirm({
											title: 'Error',
											content: 'There was a problem creating the new settings, you will be redirected to the login page in 10 seconds. Make sure you are using the correct server and credentials and contact your network administrator for more details',
											autoClose: 'logoutUser|10000',
											type: 'red',
											buttons: {
												logoutUser: {
													text: 'Go now',
													btnClass: 'btn-red',
													action: function () {
														document.location.href='../logout';
													}
												}
											}
										});
									}
								});
								
							}
						},
						no:  {
							text    :  'Cancel',
							btnClass: 'btn-red',
							action  :  function(){
								$.confirm({
									title: 'Error',
									content: 'With no settings in place, DAQBroker cannot continue properly, you will be redirected to the login page in 10 seconds, please contact your network administrator to ensure your server and/or credentials are supported',
									autoClose: 'logoutUser|10000',
									type: 'red',
									buttons: {
										logoutUser: {
											text: 'Go now',
											btnClass: 'btn-red',
											action: function () {
												document.location.href='../logout';
											}
										}
									}
								});
							}
						}
					}
				});
			}
		},
		error:function(returned){
			$.confirm({
				title: 'Error',
				content: 'There was an error collecting database info, please make sure you are connecting with a valid user. You will be redirected to the login page in 10 seconds',
				autoClose: 'logoutUser|10000',
				type: 'red',
				buttons: {
					logoutUser: {
						text: 'Go now',
						btnClass: 'btn-red',
						action: function () {
							document.location.href='../logout';
						}
					}
				}
			});
		}
	});
}

function uniqueId() {
	return Math.random().toString(36).substr(2, 16);
}

function checkDatabase(callback,callback2){
	//Must get database info
	$(".lightboxable-outer").hide();
	$.ajax({
		url: '/daqbroker/checkDatabases',
		type: 'POST',
		dataType: "json",
		data:{'_csrf_token':$('body').find('.sessionToken').val()},
		success: function(returned){
			var databases=returned;
			for (var i=0; i<databases.length; i++){
				$('.settingsList').find('.dbSelector').append('<option value="'+i+'">'+databases[i].dbname+'</option>');
			}
			$('.settingsList').find('.dbSelector').change(function(){
				var test=JSON.parse(sessionStorage.getItem('daqbroker'));
				var dbnameNew=databases[Number($(this).val())].dbname;
				var url=window.location.href.split('?')[0];
				globalObject={'dbname':dbnameNew,'server':$("#daqbroker_server").val(),'engine':$("#daqbroker_engine").val()};
				sessionStorage.setItem('daqbroker',JSON.stringify(globalObject));
				location.reload();
			});
			
			if(typeof dbname==='undefined'){
				if(returned.length<1){
					$.confirm({
						title: 'No databases found!',
						content: 'You must have at least one active database to start monitoring instruments. <br> You can click the button below to go to the database administrator menu and create a new database. <br> If you already have databases created in this server you can try again later or contact your network administrator to check your credentials.',
						//autoClose: 'logout|0',
						type: 'orange',
						buttons: {
							admin: {
								text: 'Create new database',
								btnClass: 'btn-blue',
								action: function () {
									var test=JSON.parse(sessionStorage.getItem('daqbroker'));
									if(test){
										test['adminSelect']=2;
									}
									else{
										test={};
										test['adminSelect']=2;
									}
									sessionStorage.setItem('daqbroker',JSON.stringify(test));
									document.location.href='/admin/db';
								}
							},
							logout:{
								text: 'Logout',
								btnClass: 'btn-red',
								action: function () {
									document.location.href='../logout';
								}
							}
						}
					});
				}
				else{
					$.dialog({
						title    :  'Choose database',
						content  :  '<div>It seems you have not selected a database, please select one to continue</div><div><select class="dbSelector"><option selected disabled>--- SELECT ONE ---</option></select></div>',
						onContentReady: function(){
							for (var i=0; i<databases.length; i++){
								this.$content.find('.dbSelector').append('<option value="'+i+'">'+databases[i].dbname+'</option>');
							}
							this.$content.find('.dbSelector').change(function(){
								var test=JSON.parse(sessionStorage.getItem('daqbroker'));
								var dbnameNew=databases[Number($(this).val())].dbname;
								var url=window.location.href.split('?')[0];
								globalObject={'dbname':dbnameNew,'server':$("#daqbroker_server").val(),'engine':$("#daqbroker_engine").val()};
								sessionStorage.setItem('daqbroker',JSON.stringify(globalObject));
								location.reload();
							});
						}
					});
				}
			}
			else{
				var foundDB=false;
				for (var i=0; i<returned.length; i++){
					if(dbname==returned[i].dbname){
						theDBidx=i;
						foundDB=true;
						break
					}
				}
				if(!foundDB){
					$.confirm({
						title: 'No databases found!',
						content: 'You must have at least one active database to start monitoring instruments. <br> You can click the button below to go to the database administrator menu and create a new database. <br> If you already have databases created in this server you can try again later or contact your network administrator to check your credentials.',
						//autoClose: 'logout|0',
						type: 'orange',
						buttons: {
							admin: {
								text: 'Create new database',
								btnClass: 'btn-blue',
								action: function () {
									var test=JSON.parse(sessionStorage.getItem('daqbroker'));
									if(test){
										test['adminSelect']=2;
									}
									else{
										test={};
										test['adminSelect']=2;
									}
									sessionStorage.setItem('daqbroker',JSON.stringify(test));
									document.location.href='/admin/db';
								}
							},
							logout:{
								text: 'Logout',
								btnClass: 'btn-red',
								action: function () {
									document.location.href='../logout';
								}
							}
						}
					});
				}
				$('.dbSelector').val(theDBidx);
				callback();
				if(!((typeof callback2)==='undefined')){
					callback2();
				}
			}
		},
		error: function(returned){
			new Noty({
				text    :  'Error collecting local information <a onclick="location.reload()">Click here</a> to reload',
				theme   :  'relax',
				type    :  'error'
			}).show();
		}
	});
}

window.onbeforeunload = function(event){
	var foundStuff=JSON.parse(sessionStorage.getItem('daqbroker'));
	if(foundStuff){
		if('dbname' in foundStuff){
			if(!((typeof dbname)==='undefined')){
				foundStuff['dbname']=dbname;
			}
			sessionStorage.setItem('daqbroker',JSON.stringify(foundStuff));
		}
	}
	else if(!((typeof dbname)==='undefined')){
		if(dbname){
			var localObj={'dbname':dbname};
			sessionStorage.setItem('daqbroker',JSON.stringify(localObj));
		}
	}
}

function changePage(pageName,clicker){
	var foundStuff=JSON.parse(sessionStorage.getItem('daqbroker'));
	if(clicker==2){
		if(!((typeof dbname)==='undefined')){
			localStorage.setItem('newTab', dbname);
		}
	}
}

function setupSubscribe(){
	$('.subscribeButton').click(function(){
		$('.lightboxable').empty();
		$('.lightboxable').append('<h3 style="text-align:center;margin:auto">Database Information</h3><hr style="width:25%"><p>Provide an email address to recieve information on updates to this database.</p><p>Database to be subscribed: '+dbname+'</p><p>Email <input class="subscribeEmail"></input></p><span class="error" style="color:#a94442;background-color:#f2dede"></span><span class="done" style="background-color:#dff0d8"></span><div style="margin:auto;text-align:center" class="subButtonDiv"></div>');
		$('.lightboxable').find('.subscribeEmail').on('input',function(){
			var thisVal=$(this).val();
			var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
			$('.lightboxable').find('.error').empty();
			$('.lightboxable').find('.subButtonDiv').empty();
			if (re.test(thisVal)){
				$('.lightboxable').find('.subButtonDiv').append('<button class="subButton button pill" style="font-size:150%">Subscribe</button>');
				$('.lightboxable').find('.subButton').click(function(){
					$('.lightboxable').find('.error').empty();
					var toSend={'email':thisVal,'dbname':dbname,'_csrf_token':$('body').find('.sessionToken').val()};
					$('.lightboxable').find('.subButton').prop('disabled',true);
					$('.lightboxable').find('.subButton').after('<img src="../images/loading.gif" class="loading" height="75" width="75"></img>')
					$.ajax({
						url: '../insertSubscriber.php',
						type: 'POST',
						dataType: "json",
						data : toSend,
						success: function(returned){
							if(returned.error=="0"){
								$('.lightboxable').find('.done').append('You are now subscribed. You will recieve an email soon informing you.');
								window.setTimeout($.colorbox.close(), 2000);
							}
							else{
								$('.lightboxable').find('.error').append(returned.errorStr+' | '+returned.errorMsg);
							}
							$.colorbox.resize();
						},
						error: function(returned){
							$('.lightboxable').find('.error').append('An error occurred. Contact your system administrator');
							$.colorbox.resize();
						}
					});
					$.colorbox.resize();
				});
			}
			else{
				$('.lightboxable').find('.error').append('Invalid email');
			}
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

setInterval(function(){
	if(!thisIsLogin){
		$.ajax({
			method: "POST",
			url:"/daqbroker/checkProcesses",
			dataType: "json",
			success: function(returned) {
				for (var i=0; i<returned.length; i++){
					if(returned[i].name=='infinite'){
						if(returned[i].alive){
							$('.theSettings').find('#adminMonitor').find('.status').html('Active');
							$('.theSettings').find('#adminMonitor').find('.status').attr('title','The monitoring process is currently running');
							$('.theSettings').find('#adminMonitor').find('.status').css({'color':'#4F8A10'});
						}
						else{
							$('.theSettings').find('#adminMonitor').find('.status').html('Inactive');
							$('.theSettings').find('#adminMonitor').find('.status').attr('title','The monitoring process has been stopped or has crashed');
							$('.theSettings').find('#adminMonitor').find('.status').css({'color':'#D8000C'});
						}
						break
					}
				}
			},
			error: function(returned) {
				var n=new Noty({
					text      :  'Error collecting local information <a onclick="location.reload()">Click here</a> to reload',
					theme     :  'relax',
					type      :  'error',
					timeout   :  5000,
					closeWidth:  ['button'],
					buttons   : [
						Noty.button('More', 'btn btn-error', function () {
							$(n.barDom).find('.errorMsg').toggle();
							if($(n.barDom).find('.errorMsg').is(':visible')){
								n.resume();
								$(this.dom).html('Less');
							}
							else{
								n.stop();
								$(this.dom).html('More');
							}
						}),
						Noty.button('Close', 'btn btn-error', function () {
							n.close();
						})
					]
				}).show();
			}
		});
	}
},10000)

$(document).ready( function() {
	currentType=Number($("#daqbroker_usertype").val());
	globalMenu2=$("#cssmenu").hiraku({
		btn: ".homeIcon",
		fixedHeader: ".headerMenu",
		direction: "left",
		breakpoint: 5000
	});
	
	globalMenu1=$(".theSettings").hiraku({
		btn: ".hamburger",
		fixedHeader: ".headerMenu",
		direction: "right",
		breakpoint: 5000
	});
	
	$('.pageChange').on('mouseup',function(e){
	  var theID=$(this).prop('id');
	  changePage(theID,e.which);
	});
});
	
/* $.ajax({
	method: "POST",
	url:"/daqbroker/getLocalServers",
	dataType: "json",
	data:{'_csrf_token':$('body').find('.sessionToken').val()},
	success: function(returned) {
		var databases = returned;
		for (var i=0; i<databases.length; i++){
			$('.serverSelect').find('.empty').remove();
			if(databases[i].login){
				$('.serverSelect').find('.local').append('<option value="'+i+'" style="background-color:#339933" title="logged in">'+databases[i].server+'('+databases[i].engine+')</option>');
			}
			else{
				$('.serverSelect').find('.local').append('<option value="'+i+'" style="background-color:ff5050" title="login required">'+databases[i].server+'('+databases[i].engine+')</option>');
			}
		}
		$('.serverSelect').change(function(){
			if(Number($(this).val())==-1){
				$('.newServer').append('Server name<br><input placeholder="Eg: domain.location.com" name="newServerName" class="newServerName"></input> <br> Engine <br> <select name="newServerEngine" class="newServerEngine"><option value="mysql">MySQL</option><option value="postgres">PostgreSQL</option><option value="oracle">Oracle</option><option value="mssql+pyodbc">MS SQL Server</option></select>');
				//<option value="sqlite">SQLite</option>
				$('.newServer').show();
			}
			else{
				$('.newServer').empty();
				$('.newServer').append('<input hidden name="serverName" value="'+databases[Number($(this).val())].server+'"></input>');
				$('.newServer').append('<input hidden name="serverEngine" value="'+databases[Number($(this).val())].engine+'"></input>');
			}
		});
	},
	error: function(returned){
		new Noty({
			text    :  'Error collecting local information <a onclick="location.reload()">Click here</a> to reload',
			theme   :  'relax',
			type    :  'error',
			timeout :  3000
		}).show();
	}
}); */

$(document).ready( function() {
	if(location.pathname=="/login"){
		thisIsLogin=true;
	}
	else{
		thisIsLogin=false;
	}
	function checkServers(){
		$.ajax({
			method: "POST",
			url:"/daqbroker/getLocalServers",
			dataType: "json",
			data:{'_csrf_token':$('body').find('.sessionToken').val()},
			success: function(returned) {
				var databases = returned;
				if(!thisIsLogin){
					$('.serverSelect').empty();
					for (var i=0; i<databases.length; i++){
						$('.serverSelect').find('.empty').remove();
						if(databases[i].login){
							$('.serverSelect').append('<option value="'+i+'" style="background-color:#339933" title="logged in">'+databases[i].server+'('+databases[i].engine+')</option>');
						}
						else{
							$('.serverSelect').append('<option value="'+i+'" style="background-color:ff5050" title="login required">'+databases[i].server+'('+databases[i].engine+')</option>');
						}
					}
				}
				else{
					if(databases.length>0){
						$('.serverSelect').find(".local").empty();
					}
					for (var i=0; i<databases.length; i++){
						if(databases[i].login){
							$('.serverSelect').find('.local').append('<option value="'+i+'" style="background-color:#339933" title="logged in">'+databases[i].server+'('+databases[i].engine+')</option>');
						}
						else{
							$('.serverSelect').find('.local').append('<option value="'+i+'" style="background-color:ff5050" title="login required">'+databases[i].server+'('+databases[i].engine+')</option>');
						}
					}
				}
				$('.serverSelect').unbind('change');
				$('.serverSelect').change(function(){
					if(thisIsLogin){
						if(Number($(this).val())==-1){
							$('.newServer').append('Server name<br><input placeholder="Eg: domain.location.com" name="newServerName" class="newServerName"></input> <br> Engine <br> <select name="newServerEngine" class="newServerEngine"><option value="mysql">MySQL</option><option value="postgres">PostgreSQL</option><option value="oracle">Oracle</option><option value="mssql+pyodbc">MS SQL Server</option></select>');
							//<option value="sqlite">SQLite</option>
							$('.newServer').show();
						}
						else{
							$('.newServer').empty();
							$('.newServer').append('<input hidden name="serverName" value="'+databases[Number($(this).val())].server+'"></input>');
							$('.newServer').append('<input hidden name="serverEngine" value="'+databases[Number($(this).val())].engine+'"></input>');
						}
					}
				});
			},
			error: function(returned){
				new Noty({
					text    :  'Error collecting local information <a onclick="location.reload()">Click here</a> to reload',
					theme   :  'relax',
					type    :  'error',
					timeout :  3000
				}).show();
			}
		});
	}
	doneThisThing=false;
	if(!doneThisThing){
		doneThisThing=true;
		checkServers();
		setInterval(checkServers(),10000);
	}
});