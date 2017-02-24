
//--------------------------------------------------------------------------------------------------------------------------------------------//
//--------------------------------------------------------Clock count codes are here----------------------------------------------------------//
//--------------------------------------------------------------------------------------------------------------------------------------------//





var	clsStopwatch = function() {
		// Private vars
		var	startAt	= 0;	// Time of last start / resume. (0 if not running)
		var	lapTime	= 0;	// Time on the clock when last stopped in milliseconds
		
		var elapsed_h = 0;
		var elapsed_m = 0;
		var elapsed_s = 0;
		var elapsed_ms = 0;
		var n_t;
		
		
		var	now	= function() {
				return (new Date()).getTime(); 
			}; 
 
		// Public methods
		// Start or resume
		this.start = function() {
				startAt	= startAt ? startAt : now();
			};

		// Stop or pause
		this.stop = function() {
				// If running, update elapsed time otherwise keep it
				lapTime	= startAt ? lapTime + now() - startAt : lapTime;
				startAt	= 0; // Paused
			};

		// Reset
		this.reset = function() {
				lapTime = startAt = 0;
			};

		// Duration
		this.time = function() {
				return lapTime + (startAt ? now() - startAt : 0); 
			};
	};

var x = new clsStopwatch();
var $time;
var clocktimer;

function pad(num, size) {
	var s = "0000" + num;
	return s.substr(s.length - size);
}

function formatTime(time) {
	var h = m = s = ms = 0;
	var newTime = '';

	h = Math.floor( time / (60 * 60 * 1000) );
	time = time % (60 * 60 * 1000);
	m = Math.floor( time / (60 * 1000) );
	time = time % (60 * 1000);
	s = Math.floor( time / 1000 );
	ms = time % 1000;

	//newTime = pad(h, 2) + ':' + pad(m, 2) + ':' + pad(s, 2) + ':' + pad(ms, 3);
	newTime = pad(h, 2) + ':' + pad(m, 2) + ':' + pad(s, 2);
	
	elapsed_h = pad(h, 2);
	elapsed_m = pad(m, 2);
	elapsed_s = pad(s, 2);
	elapsed_ms = pad(ms, 2);
	n_t = newTime;
	
	return newTime;
}

function show() {
	$time = document.getElementById('time');
	update();
}

function update() {
	$time.innerHTML = formatTime(x.time());
}

function start() {
	clocktimer = setInterval("update()", 1);
	x.start();
}

function stop() {
	//alert(elapsed_h + ':' + elapsed_m + ':' + elapsed_s);
	document.getElementById('elapsed_t').innerHTML = elapsed_h + ':' + elapsed_m + ':' + elapsed_s;
	x.stop();
	clearInterval(clocktimer);
	stopVideoCall();
}

function reset() {
	stop();
	x.reset();
	update();
}









//--------------------------------------------------------------------------------------------------------------------------------------------//
//-------------------------------------------------------AZstack Codes are here---------------------------------------------------------------//
//--------------------------------------------------------------------------------------------------------------------------------------------//
var currentMsgId = Math.floor(Date.now() / 1000);
var call_mode = '';

            $(document).ready(function () {
				




                //az delegate --------------------------------------------- -->
                //server test
                var azAppID = "4bba19d6888ae9c33345cc95daaa0986";
                var publicKey = 'MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAp1cRbBiOrxYUBStEm1ub7jfdUFCkU3WLsv96qe8FkHvXA0/hZn+kODZBots1GEPbJIjHA0HcvGSSRf+M5JiVa1ZSCGcgPBZfpgMvoSfljgp51uFtNRuLyotK/oCD73gliorxnBtLhmEvEZ5EBFj0iyBuTNO6GPZgKl7YFOH9/Qw54a8D1WwAvWJvfeWmcg4ACzshOwRngk1UJ82ryhVcolcLJ8sAwvZiDx71ll6jdp3VrSZWy7EamjTY3eZ6xs2RpsINufCWiitFn3bazLwjfgdZNqeoxXZVNgD0f2CoTA566tT4yXUtXiySpUxvp//b1zQB4wdWG5V5AKPDy++BYwIDAQAB';
                var azStackUserId = '1032';
                var fullname = 'Jit Singfow';
                var userCredentials = 'eb95ca721829554ecb577d4b9c149cd6';
                var namespace = '';
                

                azstack.logLevel = 'DEBUG';
				

                azstack.onAuthenticationCompleted = function (code, authenticatedUser, msg) {
                    azstack.log('INFO', 'onAuthenticationCompleted code: ' + code + ', msg: ' + msg + ', authenticatedUser');
                    azstack.log('INFO', authenticatedUser);
					document.getElementById('before_auth').style.display = 'none';
					document.getElementById('after_auth').style.display = 'block';
					
				
				
				
				azstack.onInviteVideoCall = function(packet){
				alert('incoming call');
                 console.log(packet);
                callId = packet.callId;
				var vid = packet.hasVideo;
				console.log(vid);
				var ringtone = "<audio loop autoplay>\
  										<source src=\"media/ring_tone.mp3\" type=\"audio/mpeg\">\
										</audio>"
				document.getElementById('ring_tone').innerHTML = ringtone;
				if(vid == false){
					alert('audio call');
				}
				else{
					//alert('video call');
					document.getElementById('incoming_vcall').style.display = 'block';
					document.getElementById('before_call').style.display = 'none';
				}
				
            }
				
				azstack.onVideoCallConnecting = function(packet){
					//alert('connecting');
				}
				
				azstack.onVideoCallRinging  = function(packet){
					//azstack.azWebRTC.toggleAudioState();
					document.getElementById('before_call').style.display = 'none';
					document.getElementById('on_dialing').style.display= 'block';
					var dial_tone = "<audio loop autoplay>\
  										<source src=\"media/dial_tone.mp3\" type=\"audio/mpeg\">\
										</audio>";
					document.getElementById('dial_tone').innerHTML = dial_tone;
					
				}
				
				
				azstack.onVideoCallBusy = function(packet){
					console.log('User Busy');
				}
				

				
				azstack.onVideoCallStop = function(packet){
					
					
					document.getElementById('on_call').style.display='none';
					document.getElementById('on_audio').style.display = 'none';
					document.getElementById('after_call').style.display = 'block';
					
					
					
				}
				
				azstack.onVideoCallRejected = function(packet){
					alert('video call rejected');
				}
				
				azstack.onVideoCallAnswered = function(packet){
					console.log(packet);
					
					document.getElementById('on_dialing').innerHTML= '';
					document.getElementById('on_dialing').style.display='none';
					
					if(call_mode == 'video'){
						document.getElementById('before_call').style.display='none';
						document.getElementById('on_call').style.display='block';
						
					}
					if(call_mode == 'audio'){
						document.getElementById('before_call').style.display = 'none';
						document.getElementById('on_audio').style.display = 'block';
						document.getElementById('on_call').style.display='none';
						
					}
					
				}


				azstack.onVideoCallBusy = function(packet){
				}

				azstack.onVideoCallNotAnswered = function(packet){
				}


				azstack.onVideoCallError = function(packet){
					alert('Call Error');
				}
				azstack.onVideoCallLocalVideoLoaded = function(){
					console.log('Local Video Loaded');
				}
				azstack.onVideoCallRemoteVideoLoaded = function(){
					console.log('Remote Video Loaded');
					show();
					start();
				}
//-------------------------------------------------------------------------------------------------------------------------------------------//
//----------------------------------------------MESSEGING------------------------------------------------------------------------------------//
//-------------------------------------------------------------------------------------------------------------------------------------------//

azstack.onMessageReceived = function (user, msg) {
					
					/*azstack.log('INFO', 'onMessageReceived');
					azstack.log('INFO', user);
					azstack.log('INFO', msg);
					
					$msgDiv.append('onMessageReceived from: ' + '<br />');
					$msgDiv.append(JSON.stringify(user) + '<br />');
					$msgDiv.append('Msg: ' + '<br />');
					$msgDiv.append(JSON.stringify(msg) + '<br />');
					$msgDiv.append(msg.msg + '<br />');
					console.log(msg.msg);
					*/
					var old_content_r = document.getElementById('chat_box').innerHTML;
					//alert(msg.msg);
					
					var new_content_r="<li class=\"right clearfix\">\
                                    <span class=\"chat-img pull-right\">\
                                        <img class=\"img-circle\" width=\"50px\" height=\"50px\" alt=\"User Avatar\" src=\"img/doctor.png\">\
                                    </span>\
                                    <div class=\"chat-body clearfix\">\
                                        <div class=\"chat-body clearfix\">\
                                        <div>\
                                            <small class=\" text-muted\">\
                                                <i class=\"fa fa-clock-o fa-fw\"></i></small>few seconds ago\
                                            <strong class=\"pull-right primary-font\">Dr. Roy</strong>\
                                        </div>\
                                        <p>"+
                                           msg.msg
										   +
                                        "</p>\
                                    </div>\
                                </li>";
						document.getElementById('chat_box').innerHTML = old_content_r + new_content_r;
					
					
				}
				azstack.onMessagesDelivered = function (packet) {
					azstack.log('INFO', 'onMessagesDelivered');
					azstack.log('INFO', packet);
				}
				azstack.onMessagesSent = function (packet) {
					//azstack.log('INFO', 'onMessagesSent');
					//azstack.log('INFO', packet);
					console.log('heeee msg sent');
					console.log(packet);
					 var m_sent = document.getElementById('msg_c').value;
					 if(m_sent != '')
					 {
						 
					 document.getElementById('msg_c').value='';
					var old_content = document.getElementById('chat_box').innerHTML;
					//alert(old_content);
					
					var new_content="<li class=\"left clearfix\">\
                                    <span class=\"chat-img pull-left\">\
                                        <img class=\"img-circle pull-right\" width=\"50px\" height=\"50px\" alt=\"User Avatar\" src=\"img/patient.jpg\">\
                                    </span>\
                                    <div class=\"chat-body clearfix\">\
                                        <div>\
                                            <strong class=\"primary-font\">Ms. Aishwarya</strong>\
                                            <small class=\"pull-right text-muted\">\
                                                <i class=\"fa fa-clock-o fa-fw\"></i> \
                                            </small>\
                                        </div>\
                                        <p>"
                                            +m_sent+
                                        "</p>\
                                    </div>\
                                </li>";
					document.getElementById('chat_box').innerHTML = old_content + new_content;
				}
				else{
					console.log('file message');
				}
				}
				azstack.onMessageFromMe = function (packet) {//msg from me (from other device)
					azstack.log('INFO', 'onMessageFromMe');
					azstack.log('INFO', packet);
				}
				
//-----------------------------------------------------------------------------------------------------------------------------------------------//				
				
				//------------------------file Sharing-----------------------------------//
				//////////////////////////////////////////////////////////////////////////
				
				var file_name = '';
            $('#photoimg').on('change', function(){ 
			           $("#preview").html('');
			    $("#preview").html('<img src="loader.gif" alt="Uploading...."/>');
			$("#imageform").ajaxForm({
						dataType:'json',
						//target: '#preview',
						success:function(data){
							console.log(data);
						file_name = data.filename;
						console.log('this is the file:'+file_name);
						//document.getElementById('preview').innerHTML = 'Hurray';
						var ext = data.ext;
						var msgType;
						var file_url = 'localhost/tjay/Remote_consulting/uploads/'+file_name;
						var file_size = data.file_size/1024;
						if(ext == 'png' || ext == 'jpg' || ext == 'gif' || ext == 'jpeg')
						{
							msgType = 1;
							azstack.azSendMessageFileUrl(file_url, file_name, msgType, '1093', currentMsgId++, file_size,0,0,0);
						}
						if(ext = 'pdf')
						{
							console.log('pdf file');
							mggType = 8;
							azstack.azSendMessageFileUrl(file_url, file_name, msgType, '1093', currentMsgId++, file_size,0,0,0);
						}
						
						/*azstack.azSendMessageFileUrl('http://img.v3.news.zdn.vn/w660/Uploaded/SotnTJ/2015_12_15/HLV_Miura_zing.jpg', 'img.jpg', 1, '1093', currentMsgId++, 77895, 660, 500, 0);*/


						}
						
		}).submit();
					
		
			});
			
			////////////////////////////////////////////////////////////////////////////////
				

				
				
				}
                //authentication --------------------------------------------------- <---

                azstack.connect(azAppID, publicKey, azStackUserId, userCredentials, fullname, namespace);//ket noi den AZStack server
            });
// Video Call
            var callId = null;
            function testCreateVideoCall(){
                callId = currentMsgId ++;
                azstack.azStartVideoCall(173004, callId, 'local', 'remote', true);
				call_mode = 'video';
            }
			function testAcceptVideoCall(){
								
                azstack.azAcceptVideoCall(173004, callId, 'local', 'remote', true);
				document.getElementById('on_call').style.display = 'block';
				document.getElementById('incoming_vcall').style.display = 'none';
				document.getElementById('ring_tone').innerHTML = '';
				
            }
			function testRejectVideoCall(){
                azstack.azRejectVideoCall(173004, callId);
            }
            function stopVideoCall(){
				azstack.azStopVideoCall(173004, callId);
				document.getElementById('on_call').style.display='none';
				document.getElementById('on_audio').style.display = 'none';
				document.getElementById('after_call').style.display = 'block';
				

            }
            function emitNotAnsweredVideoCall(){
                azstack.azNotAnsweredVideoCall(173004, callId);
            }
			
			
            function toggleVideo(){
                azstack.azWebRTC.toggleVideoState();
            }
            function toggleAudio(){
                azstack.azWebRTC.toggleAudioState();
            }
			
			
			
			
//Audio Call

			function testCreateAudioCall(){
                callId = currentMsgId ++;
                azstack.azStartVideoCall(173004, callId, 'local', 'remote', false);
				call_mode = 'audio';
				
				
            }
			
//Send Message

			function send_msg(){
				
                var m_value = document.getElementById('msg_c').value; 
				//alert(m_value);
				if(m_value !=''){
					azstack.azSendMessage(m_value,'1093', currentMsgId++);
				}
            }
			
			function full_screen(){
				//document.getElementById('loaded_video').style.width = '100%';
				//document.getElementById('loaded_video').style.height= '100%';
				//document.getElementById('loaded_video').style.position = 'absolute';
				var elem = document.getElementById("loaded_video");
				 //var elem = document.getElementById('fullscreen');
				 if(document.mozFullscreenElement) {
					 document.mozCancelFullscreen();
				 }
				 else {
					 elem.mozRequestFullScreen();
				};
				
				
				if(document.webkitFullscreenElement) {
					document.webkitCancelFullScreen();
				}
				else {
					elem.webkitRequestFullScreen();
					
				};
  			
				
				
				
				
				
				
				
				}
				
				
				function enter_send(e) {
					if (e.keyCode == 13) {
						send_msg();
   						 }
				}
			
			
			