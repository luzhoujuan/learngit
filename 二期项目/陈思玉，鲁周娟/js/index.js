//跳转购物车
function shop(){
	yc.addEvent("label_2","click",goCart);
			function goCart(){
				window.location.href="../html/shopping.html";
			}
}
yc.addLoadEvent(shop);

//加入购物车
function add(){
	for(var i=0;i<12;i++){
		yc.$("add"+(i+1)).onclick=function(){
			
			var options={
				"completeListener":function(){
					this.responseJSON.code;
					alert("亲，您的美食已经加入购物车了哦!");
				}
			};
			yc.xssRequest("http://218.196.14.220:8080/res/resorder.action?num=1&op=order&fid="+this.id.substr(3,2),options);

		}
	}	
}
yc.addLoadEvent(add);


//获取菜单列表
function dish(){
	var req1=yc.ajaxRequest("http://218.196.14.220:8080/res/resfood.action",{
		'method':'POST',
		'send':'op=findAllFoods',
		'jsonResponseListener':listener1
	});		
	function listener1(json){
		 var length=12; 
	    if(   json.obj.length<length){
	    	length=json.obj.length;
	    }
	    if(json.code!=1){return false;}
		for(var i=0;i<length;i++){
			var obj1=json.obj[i]
			var imgs="img"+(i+1);
			var dishnames="dishname"+(i+1);
			var img=yc.$(imgs);
			var dishname=yc.$(dishnames);
			//img.src="http://218.196.14.220:8080/res/images/"+obj1.fphoto;
			dishname.innerHTML=obj1.fname;
		}
	}
	
}

dish();



//显示登录界面
function denglu(){
	yc.$("label_1").onclick=function(){
			yc.toggleDisplay(yc.$("enter"),"block");
	}
}
yc.addLoadEvent(denglu);



//进行登录请求
function logon(){
		yc.$("butt").onclick=function(){
			var username=yc.$("uname");
			var pwd=yc.$("pass");
			var login1=yc.$("login1");
			var options={
				"completeListener":function(){
					if(this.responseJSON.code==1){
						
						login1.innerHTML="尊敬的会员"+username.value+"欢迎你"+"&nbsp;&nbsp;|&nbsp;&nbsp;"+"<span id='exit'  onclick='exits()'>退出</span>";
						
					}
				}
			}
			yc.xssRequest("http://218.196.14.220:8080/res/resuser.action?op=login&username="+username.value+"&pwd="+pwd.value,options);
			yc.toggleDisplay(yc.$("enter"),"none");
	}
		
		
	
}
yc.addLoadEvent(logon);
//用户登录检测
function jiance(){
	var option1={
		    "completeListener":function(){
				if(this.responseJSON.code==1){
					login1.innerHTML="尊敬的会员"+this.responseJSON.obj.username+"欢迎你"+"&nbsp;&nbsp;|&nbsp;&nbsp;"+"<span id='exit' onclick='exits()'>退出</span>";
					
		    	}
			}
	}
	yc.xssRequest("http://218.196.14.220:8080/res/resuser.action?op=checkLogin",option1);

}
yc.addLoadEvent(jiance);



//设置退出
function exits(){
	var option1={
		    "completeListener":function(){
				if(this.responseJSON.code==1){
					alert("亲爱的顾客，记得再来哦？");
					login1.innerHTML="";
					
		    	}
			}
	}
	yc.xssRequest("http://218.196.14.220:8080/res/resuser.action?op=logout",option1);

}



//隐藏登录按钮
function udenglu(){
	yc.$("ubutt").onclick=function(){
		
		yc.toggleDisplay(yc.$("enter"),"none");
	}
}
yc.addLoadEvent(udenglu);



//加载历史记录
function history1(){
	var history=yc.$("history");
	var optiones={
		"completeListener":function(){
		//alert(this.responseJSON.obj.length);
			var json= this.responseJSON.obj;
			for(var j=0;j<json.length;j++){
				var dspan=document.createElement("span");
				dspan.innerHTML=json[j].fname+"<br/>";
				dspan.style.cssText="display: inline-block;width: 100%;border-bottom: 1px solid peachpuff ;font-size: 16px;height: 30px;line-height: 30px;text-indent: 50px;";
				history.appendChild(dspan);
				}
			}
			
		}
	
		yc.xssRequest("http://218.196.14.220:8080/res/resfood.action?op=findAllSelectedFoods",optiones);
		
}
yc.addLoadEvent(history1);

//查看菜单和历史记录同步
function look(){
	for(var i=0;i<12;i++){
		yc.$("look"+(i+1)).onclick=function(){
			
			yc.toggleDisplay(yc.$("detail"),"block");
			yc.toggleDisplay(yc.$("detai2"),"block");
			var options={
				"completeListener":function(){
					var obj1=this.responseJSON.obj;	
					yc.$("detaiimg").src="http://218.196.14.220:8080/res/images/"+obj1.fphoto;
					yc.$("dishnamep").innerHTML="菜名:"+obj1.fname;
					yc.$("oldpricep").innerHTML="原价:"+obj1.normprice;
					yc.$("nowpricep").innerHTML="现价:"+obj1.realprice;
					yc.$("describle").innerHTML="描述详情:"+obj1.detail;
					
					var optiones={
						"completeListener":function(){
						//alert(this.responseJSON.obj.length);
							var json=this.responseJSON.obj;
							var history=yc.$("history");
							history.innerHTML="";
							for(var j=0;j<json.length;j++){
								var dspan=document.createElement("span");
								dspan.innerHTML=json[j].fname+"<br/>";
								dspan.style.cssText="display: inline-block;width: 100%;border-bottom: 1px solid peachpuff ;font-size: 16px;height: 30px;line-height: 30px;text-indent: 50px;";
								history.appendChild(dspan);
								
								}
							}
						
							
						}
					
						yc.xssRequest("http://218.196.14.220:8080/res/resfood.action?op=findAllSelectedFoods",optiones);
				}
			}
			yc.xssRequest("http://218.196.14.220:8080/res/resfood.action?op=findFood&fid="+this.id.substr(4,2),options);
			
		}
	}
		
}
yc.addLoadEvent(look);



//取消查看详情
function shanchu(){
	yc.$("shanchu").onclick=function(){
			yc.toggleDisplay(yc.$("detail"),"none");
			yc.toggleDisplay(yc.$("detai2"),"none");
		}
}
yc.addLoadEvent(shanchu);


function one(){
	yc.$("label_3").onclick=function(){
		yc.toggleDisplay(yc.$("menu1"),"block");
		yc.toggleDisplay(yc.$("menu2"),"none")
	}
	yc.$("label_4").onclick=function(){
		yc.toggleDisplay(yc.$("menu1"),"none");
		yc.toggleDisplay(yc.$("menu2"),"block")
	}
}

yc.addLoadEvent(one);
