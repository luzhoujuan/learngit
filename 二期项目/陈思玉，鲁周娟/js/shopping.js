
//查看购物车
function operate(){
	function lookCart(){
		var showop={
			"completeListener":function(){
				var jsonobj=this.responseJSON;
				if(this.responseJSON.code==1){
				var obj=this.responseJSON.obj;
				var cont=document.getElementById("content");;
				//showMoney(obj);
				for(var property in obj ){
					if( obj.hasOwnProperty ( property ) ){
						var str=obj[property];
						var tr=document.createElement("tr");
						tr.id="food_"+property;
						var td0=tr.insertCell(0);	
						td0.id="allsel";
						var inp0=document.createElement("input");
						inp0.type="checkbox";
						td0.appendChild(inp0);
					
						var td1=tr.insertCell(1);
						var img1=document.createElement("img");	
						img1.id="fphoto"; //
						img1.src="http://218.196.14.220:8080/res/images/"+str.food.fphoto;
						var span1=document.createElement("span");
						span1.id="fname";
						span1.innerHTML="菜名："+str.food.fname;
						td1.appendChild(img1);
						td1.appendChild(span1);
					
						var td2=tr.insertCell(2);
						td2.id="realprice";
						var span2=document.createElement("span");
						td2.innerHTML="&yen;";
						span2.innerHTML=str.food.realprice;
						td2.appendChild(span2);
					
						var td3=tr.insertCell(3);
						td3.id="num";
						var span3=document.createElement("span");
						span3.innerHTML=str.num;
						td3.appendChild(span3);

						var td4=tr.insertCell(4);
						td4.id="smallCount";
						var span4=document.createElement("span");
						span4.innerHTML=str.smallCount;
					
						td4.innerHTML="&yen;";
						td4.appendChild(span4);
					
						var td5=tr.insertCell(5);
						td5.id="operate";
						var spanadd=document.createElement("span");//增加
						var spandel=document.createElement("span");//删除
						var spanred=document.createElement("span");//减少
						spanadd.id="add_"+property;
						spandel.id="delete_"+property;
						spanred.id="reduce_"+property;
					
						spanadd.innerHTML="增加";
						spandel.innerHTML="删除";
						spanred.innerHTML="减少";
						td5.appendChild(spanadd);
						td5.appendChild(spandel);
						td5.appendChild(spanred);
					
						tr.appendChild(td0);
						tr.appendChild(td1);
						tr.appendChild(td2);
						tr.appendChild(td3);
						tr.appendChild(td4);
						tr.appendChild(td5);
		
						cont.appendChild(tr);
					
						function showMoney( obj ){
							var price=0;
							for(var i in obj){
								if( obj.hasOwnProperty( i ) ){
									var trs=document.getElementById("content").getElementsByTagName("tr");
									var fcount=yc.$("fcount");	
									fcount=fcount.childNodes[1];
									var smallc=obj[i].smallCount;
									price+=smallc;
									fcount.innerHTML=price;
								}
							}
						}
						showMoney(obj);
						
						//删除
						(function(property){
							yc.addEvent( yc.$("delete_"+property),"click",function(){
								var options={
									"completeListener":function(){
										console.log(this.responseJSON);
										if( this.responseJSON.code==1){
											yc.removeChildren("content");	
											lookCart();
										}	
									}	
								};
								yc.xssRequest( "http://218.196.14.220:8080/res/resorder.action?op=delorder&fid="+property,options);
								});
						})(str.food.fid);
						
						//增加
						(function(property){
							yc.addEvent( yc.$("add_"+property),"click",function(){
								var urls="http://218.196.14.220:8080/res/resorder.action?op=orderJson&num=1&fid="+property;
								var options={
									"completeListener":function(){
										if( this.responseJSON.code==1){
											yc.removeChildren("content");	
											//加载显示购物车的信息
											lookCart();
										}	
									}	
								};
								yc.xssRequest( urls,options);
								});
						})(str.food.fid);
						
						
						//减少
						(function(property){
							yc.addEvent( yc.$("reduce_"+property),"click",function(){
								var urls="http://218.196.14.220:8080/res/resorder.action?op=orderJson&num=-1&fid="+property;
								var options={
									"completeListener":function(){
										if( this.responseJSON.code==1){
											yc.removeChildren("content");	
											//加载显示购物车的信息
											lookCart();
										}	
									}	
								};
								yc.xssRequest( urls,options);
								});
						})(str.food.fid);
				
				}
				}
				}
			}
		};
		yc.xssRequest("http://218.196.14.220:8080/res/resorder.action?op=getCartInfo",showop);
	}	
	lookCart();
}

operate();
	
		function showSelect(){
			var sele=yc.$("content");
			var length1=sele.getElementsByTagName("tr").length;
			console.log( length1);
			var fselect=yc.$("fselect");
			fselect=fselect.childNodes[1];
			fselect.innerHTML=length1;	
		};
		yc.addLoadEvent(showSelect);
		
		
	//合计  价钱
	
	
	//下单响应
