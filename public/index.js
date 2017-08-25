$(function(){
				var socket = io.connect();
				var $message = $("#message");
				var $chatData = $("#chatroom");
				var $messageForm = $("#messagebox");
				var $userlogin = $("#userlogin");
				var $username = $("#username"); 
				var $error = $("#error");
				var wtf;
  				var height;
				$userlogin.submit(function(e){
					e.preventDefault();
					
					socket.emit("newUser",$username.val(),function callbock(x){
						if(x==false){
							$error.html("!!Username already exist.<br> Please try any other name");
						}
						else{
							$userlogin.css("display","none");
							$("#mainwrapper").css("display","block");
						}
					});	
					$username.val('');		
				});
				socket.on("username",function(data){
					var userlist = "";
					for(var i = 0;i<data.length;i++)
					{
						console.log(data[i]);
						userlist += ("<p>"+(i+1)+". "+data[i]+"</p>");
						
					}
					$("#activenow").html("Total users active now: "+data.length);
					$("#users").html(userlist);
				});
				$messageForm.submit(function(e){
					e.preventDefault()
					socket.emit("messageRequest",$message.val());
					$message.val('');
					wtf    = $('#chatroom');
  					height = wtf[0].scrollHeight;
  					wtf.scrollTop(height);
				});
				socket.on("newMessage",function(data){
					$chatData.append("<strong>"+data.user+"</strong>:"+data.message+"<br>");				
				});			
			});
