//库：  放置一些内置函数的扩展（String,Array,Object）
//放一些自定义的函数，这些函数为了不与别的库冲突，定义到一个明明空间（对象）中；

(function(){
//--------------- 给window 添加了一个命名空间 --------------------------------------- 
	if(!window.yc){
		//window.yc={};
		window['yc']={};
	}
	//window.yc.$=$;
	
//	window.yc.prototype={
//		$:function(id){
//			return document.getElementById("id");
//		}
//	}
//===============================================================================


//--------------------------浏览器能力检测-------------------------------------------------
	//判断浏览器是否兼容这个库：浏览器能力检测        (===)  值和类型都要相等
	function isCompatible(  other){
		if(  other===false||  !Array.prototype.push  || !Object.hasOwnProperty  ||!document.createElement  || ! document.getElementsByTagName){
			return false;
		}
		return true;
	}
	window['yc']['isCompatible']=isCompatible;
	
	
//===============================================================================


//----------------获取 页面元素的操作  ---------------------------------------------------
	//<div id="a">   <div id="b">
	//$("ddd")   var array=$("a","b" )
	//如果参数是一个字符串，则返回一个对象
	//如果参数是多个字符串，则返回一个数组
	
	//封装id
	function $(){
		var elements=[];
		//查找作为参数提供的所有元素
		for(var i=0;i<arguments.length;i++){
			var element=arguments[i];
			if( typeof element=='string'){
				//如果这个元素是一个string，则表明这是一个id
				element=document.getElementById(element);
			}
			if(arguments.length==1){
				return element;
			}
			
			elements.push(element);
		}
		return elements;
	}
	window['yc']['$']=$;
	
	
	//封装类名
	//classname:要找的类名   tag：要找的标签
	function getElementsByClassName( className,tag,parent){
		parent=parent||document;//判断有没有父节点，没有就是整个页面
		if(!(parent=$(parent))  ){return false;}//判断传入的这个父节点是不是一个正确的id名，而不是随便乱传的
		//查看所有匹配的标签
		var allTags=(tag=="*"&&parent.all)? parent.all: parent.getElementsByTagName(tag);
		
		//创建一个正则表达式，来判断classname是否正确     ^a ||  a
		var regex=new RegExp("(^|\\s)"+className+"(\\s|$)");
		
		//查找每一个元素
		var matchingElements=[];
		for( var i=0;i<allTags.length;i++){
			var element=allTags[i];//只取到的是页面匹配的标签
				//alert(element);
			//alert(element.className);
			if( regex.test(  element.className)  ){  // regex.test(字符串) 返回真假        只要匹配到了就返回，不会往下继续执行                    element.className是得到匹配的标签名字
				matchingElements.push(element);
			}
			
		}
		return matchingElements;
	}
	window['yc']['getElementsByClassName']=getElementsByClassName;
	
//===============================================================================================	






//------------------------跨浏览器的事件对象---------------------------------------


	//注：添加事件时用的函数必须与删除时用的函数要是同一个函数
	//重复调用匿名函数其实是将函数实例化了，为两个不同的函数，而添加删除事件时必须是同一个函数，
	//移出监听事件不能使用匿名函数
	//node :节点  ("show"--id名)   type:事件类型（'click'）   listener：监听器函数(移除时不能用匿名函数，不然就删除不了这个监听事件)
	function addEvent( node,type,listener){
		if( !isCompatible()){return false;}
		if( !( node=$(node)) ){return false;}
		//w3c加事件的方法
		if( node.addEventListener  ){//ff
			node.addEventListener(type,listener,false);
			return true;
		}else if( node.attachEvent){
			//ie事件
			node['e'+type+listener]=listener;
			node[type+listener]=function(){
				node['e'+type+listener](window.event);
				//listener(window.event);
			}
			node.attachEvent('on'+type,node[type+listener]);
			return true;
			
		}
		return false;
	}
	window['yc']['addEvent']=addEvent;
	
	/*
	页面加载事件   当我有几个加载事件的时候不会覆盖之前的
	*/
	function addLoadEvent( func){
		var oldOnLoad=window.onload;
		if( typeof window.onload!='function'){
			window.onload=func;
		}else{
			window.onload=function(){
				oldOnLoad();
				func();
				
			}
		}
	}
	window['yc']['addLoadEvent']=addLoadEvent;
	
	
	//移出事件
	function removeEvent( node,type,listener){
		if( !( node=$(node)) ){return false;}
		//w3c加事件的方法
		if( node.removeEventListener  ){
			node.removeEventListener(type,listener,false);
			return true;
		}else if( node.detachEvent){
			//ie事件
			node.detachEvent('on'+type,node[type+listener]);
			node[type+listener]=null;
			return true;
			
		}
		return false;
	}
	window['yc']['removeEvent']=removeEvent;
	
	
	
//================================================================================


//----------------------鼠标移动事件------------------------------------------------	
//定时移动元素
	
	function moveElement(elementId,final_x,final_y,interval){
		if(!isCompatible()){return false;}
		if(!(elementId=$(elementId))){return false;}
		var elem=$(elementId);
		
		if(elem.movement){
			clearTimeout(elem.movement);
		}
		var xpos=parseInt(elem.style.left);//10px->10;
		var ypos=parseInt(elem.style.top);
		var dist=0;
		//计算移动后的位置是否越界,并设置新的位置
		if(xpos==final_x&& ypos==final_y){return true;}
		if( xpos<final_x){
			//xpos++;
			dist=(final_x-xpos)/10;
			xpos=xpos+dist;
		}
		if(xpos>final_x){
			//xpos--;
			dist=(xpos-final_x)/10;
			xpos=xpos-dist;
		}
		if(ypos<final_y){
			//ypos++;
			dist=(final_y-ypos)/10;
			ypos=ypos+dist;
		}
		if(ypos>final_y){
			//ypos--;
			dist=(ypos-final_y)/10;
			ypos=ypos-dist;
		}
		
		elem.style.left=xpos+"px";
		elem.style.top=ypos+"px";
		//定时器重复执行当前的移动操作
		//setTimeout("yc.movement('elementId',100,0,10)",10)
		var repeat="yc.moveElement('"+elementId+"',"+final_x+","+final_y+","+interval+")";
		elem.movement=setTimeout(repeat,interval);
		
	}

	window['yc']['moveElement']=moveElement;




//----------------------DOM中的节点操作补充-------------------------------------
	
	//给参考节点后面加入一个节点,
	//node ：要插入的节点     referenceNode：参考节点
	function insertAfter(  node,  referenceNode){
		if(  !(node=$(node)) ){return false;}
		if(  !(referenceNode=$(referenceNode)) ){return false;}
		var parent=referenceNode.parentNode;	//参考节点的父节点
		if( parent.lastChild==referenceNode){ //判断当前节点referenceNode是最后一个节点
			parent.appendChild( node);
		}else{
			parent.insertBefore(  node,referenceNode.nextSibling);
		}
	}
	
	window['yc']['insertAfter']=insertAfter;
	
	//删除节点下的所有子节点
	
	function removeChildren(parent){
		if( !( parent=$(parent)) ){return false;}
		while( parent.firstChild){
			parent.removeChild(  parent.firstChild);
		}
		//返回父元素，以实现连缀
		return parent;
	}
	window['yc']['removeChildren']=removeChildren;
	
	
	//在一个父节点的第一个子节点前面添加一个新节点
	function prependChild( parent, newChild){
		if( !(parent=$( parent)) ){return false;}
		if( !( newChild=$(newChild)) ){ return false;}
		if(parent.firstChild){//查看parent节点下是否有子节点，如果有一个子节点，就在子节点前面添加
			parent.insertBefore( newChild, parent.firstChild);
		}else{
			//如果没有子节点就直接添加
			parent.appendChild( newChild);
		}
		return parent;
	}
	window['yc']['prependChild']=prependChild;
	
	
//==================================================================================


//--------------------界面显示效果操作----------------------------------------------
	//封装开关显示隐藏效果
	//node:节点id号      value:block/none
	function toggleDisplay( node ,value){
		if(  !(node=$(node)) ){return false; }
		if( node.style.display !='none'){
			node.style.display='none';
		}else{
			node.style.display=value || '';
		}
		return true;
	}
	
	window['yc']['toggleDisplay']=toggleDisplay;
	
	
	
//==================================================================================
	
	
	
	//模板替换     str:模板文字中包含{属性名}
	//  o:是对象  ，格式{属性名：值}
	//以o对象中对象的属性名的值来替换str模板
	function supplant(  str,o){
		
		return str.replace(/{([a-z]*)}/g,
						//alert(a+"\t"+b);  //a:{border}
						function (a,b){
							var r=o[b];
							return r;
						}
		)
						
	}
	window['yc']['supplant']=supplant;
	
	
/*=======================================================================================*/	
	//升级版的eval
	function parseJSON( str,filter ){
		var result=eval( "("+str+")" );
		if( filter!=null&& typeof( filter )=='function' ){
			for ( var i in result) {
				result[i]=filter( i,result[i] );
			}
		}
		return result;
	}
	window['yc']['parseJSON']=parseJSON;
	
/*====================================================================================*/	
	//把一个对象转为json字符串
	/*扩展全局的     window.Object,prototype=xxx
	 * 需求：给Object类的prototype添加一个功能	toJSAONString()将属性的值以JSON格式输出
	 *return ;返回json字符串*/
	function toJSONStringStu(obj){
		var result='"{';
		for(var key in obj){
			if(typeof obj[key]!='function'){
				result+='"'+key+'":"'+obj[key]+'",';
			}
		}
		return result.substring(0,result.length-1)+'}"';//substring 截取字符串中介于两个指定下标之间的字符。
	}
	window['yc']['toJSONStringStu']=toJSONStringStu;
	
//===================================================================================

/*/////////////////////////////////////////////////////////////////////////
--------------样式操作表.1--设置样式规则（设置行内样式）-----------------------
////////////////////////////////////////////////////////////////////////////
*/
//将word-word转换为 wordWord
	function camelize(  s){//  正则匹配得到的结果是[-w,w]  strMatch=-w   p1=w
		return s.replace( /-(\w)/g,function( strMatch,p1){
			return p1.toUpperCase();//toUpperCase()变成大写字母
		});
	}
	window['yc']['camelize']=camelize;
	
//将wordWord转换为word-word
	function uncamelize( s,sep){ // 正则匹配得到的结果是[dW,d,W]  match=dW   p1=d   p2=W
		sep=sep||'-';
		return s.replace( /([a-z])([A-Z])/g,function( match,p1,p2){
													return p1+sep+p2.toLowerCase();
		});									//toLowerCase()变成小写字母
	}
	window['yc']['uncamelize']=uncamelize;
	
	
	

//通过id修改单个元素的样式
	function setStyleById( element,styles){
		if(!(element=$(element))){return false;}
		
		//遍历styles对象的属性，并应用每个属性    property相当于attribute 
		for( property in styles){
			if( !styles.hasOwnProperty(property)){//hasOwnProperty()判断一个对象中是否有这个属性,如果没有这个属性则跳过下面的操作进行下一轮循环
				continue;
			}
			if( element.style.setProperty){
				//setProperty("background-color" )
				//DOM2样式规范       null表示索引		setProperty("color","red",null)		
				element.style.setProperty(uncamelize(property,'-'),styles[property],null);
			}else{
				//备用方法 element.style.backgroudColor="red"
				element.style[ camelize( property) ]=styles[property];
			}
		}
		return true;
	}
	window['yc']['setStyle']=setStyleById;
	window['yc']['setStyleById']=setStyleById;
	
//根据标签名来设置样式
	/*
	 tagname:标签名
	 styles：样式对象  {"color":"red"}
	 parent：父标签的id （可写可不写，不写的话就是页面中所有的这个标签名设置）
	 */
	function setStylesByTagName( tagname,  styles, parent){
		parent=$(parent)||document;
		var elements=parent.getElementsByTagName(tagname);
		for(var i=0;i<elements.length;i++){
			setStyleById(  elements[i], styles);
		}
	}
	
	window['yc']['setStylesByTagName']=setStylesByTagName;
	
//通过类名修改多个元素的样式
/*
	 tag:标签名
	 styles：样式对象  {"color":"red"}
	 parent：父标签的id 
	 className:标签上的类名
	 */
	function setStylesByClassName( parent, tag,className,styles){
		if(!(parent=$(parent))){return false;}
		var elements=getElementsByClassName(className,tag,parent)
		for(var i=0;i<elements.length;i++){
			setStyleById(elements[i],styles);
		}
		return true;
	}
	window['yc']['setStylesByClassName']=setStylesByClassName;
	

/*/////////////////////////////////////////////////////////////////////////
--------------样式操作表.2--基于className切换样式-------------------------------
////////////////////////////////////////////////////////////////////////////
*/
//取得元素中类名是数组
	function getClassNames(element){
		if(!(element=$(element))){return false;}
		//用一个空格替换多个空格，split(' ')是在每个空格字符处进行分割  this is=>this,is
		return element.className.replace(/\s+/,' ').split(' ');
	}
	window['yc']['getClassNames']=getClassNames;
	
//检查元素中是否存在某个类	
	function hasClassName( element,className){
		if(!(element=$(element))){return false;}
		var classes=getClassNames(element);
		for(var i=0;i<classes.length;i++){
			if(classes[i]===className){
				return true;
			}
		}
		return false;
	}
	window['yc']['hasClassName']=hasClassName;
	
//为元素添加类

	function addClassName( element,className){
		if(!(element=$(element))){return false;}
		var space=element.className?' ':'';
		element.className+=space+className;
		return true;
		
	}
	window['yc']['addClassName']=addClassName;
	
//从元素中删除类
	function removeClassName( element,className){
		if(!(element=$(element))){return false;}
		//先获取所有的类
		var classes=getClassNames(element);
		//循环遍历数组删除匹配的项
		//因为从数组中删除项会使数组变短，所有要反向删除
		var length=classes.length
		var a=0;
		for(var i=length-1 ; i>=0;i--){
			if( classes[i]===className){
				delete(classes[i]);
				a++;
			}
		}
		element.className=classes.join(' ');
		//判断删除是否成功
		return ( a>0? true:false );
	}
	window['yc']['removeClassName']=removeClassName;
	
	
/*/////////////////////////////////////////////////////////////////////////
--------------样式操作表.3--更大范围更改，切换样式表-------------------------------
////////////////////////////////////////////////////////////////////////////
*/
/*
 	通过URL取得包含在所有样式表中的数组
	样式表的url就是href   media：
	目标设备类型 screen/print.
*/
	function getStyleSheets(url,media){
		var sheets=[];
		for ( var i=0;i<document.styleSheets.length;i++) {
			
			if ( document.styleSheets[i].href ){
				continue;
			}
			if ( url && document.styleSheets[i].href.indexOf(url)==-1 ) {
				continue;
			}
			if ( media ) {
				//规范化meida字符串
				media=media.replace(/,\s/,',');//把空格去掉
				var sheetMedia;
				if ( document.styleSheets[i].media.mediaText ) {
					//dom
					sheetMedia=document.styleSheets[i].media.mediaText.repeat(/,\s*/,',');
					//safari会增加额外的逗号和空格
					sheetMedia=document.styleSheets[i].media.replace(/,\s*/,'');
				}else{
					//ie
					sheetMedia=document.styleSheets[i].media.replace(/,\s/,',');
				}
				//如果media不匹配，则跳过
				if( media!=sheetMedia ){
					continue;
				}
			}
			sheets.push( document.styleSheets[i] );
		}
		return sheets;
	}
	window['yc']['getStyleSheets']=getStyleSheets;

	
	//添加样式表   但是不会立马起作用，会有一个时间缓冲
	function addStyleSheet(url,media){
		media=media||'screen';
		var link=document.createElement("link");
		link.rel="stylesheet";
		link.type="text/css";
		link.href=url;
		link.media=media;
		
		document.getElementsByTagName("head")[0].appendChild(link);
		
	}
	window['yc']['addStyleSheet']=addStyleSheet;

	//移除样式表
	
	function removeStyleSheet(url,media){
		var styles=getStyleSheets(url,media);
		for(var i=0;i<styles.length;i++){
			//获得link或style节点  ie用styleSheet. owningElement   W3C用styleSheet.ownerNode
			var node=styles[i].ownerNode||styles[i].owningElement;
			//禁用样式表
			styles[i].disabled=true;
			//移除节点
			node.parentNode.removeChild( node);
			
		}
	}

	window['yc']['removeStyleSheet']=removeStyleSheet;



/*/////////////////////////////////////////////////////////////////////////
--------------样式操作表.4--添加样式规则-------------------------------
////////////////////////////////////////////////////////////////////////////
*/
/*
 添加样式规则	
*/

	function addCSSRule( selector,styles,index,url,media){
		var declaration='';
		//根据styles参数（样式对象）构建声明字符串
		for( property in styles){
			if(!styles.hasOwnProperty(property)){
				continue;
			}				//属性                    属性值
			declaration+=property+":"+styles[property]+";" ;
		}
		//根据url和media获取样式表
		var styleSheets=getStyleSheets(url,media);
		var newIndex;
		//循环所有满足条件的样式表，并添加样式规则
		for( var i=0;i<styleSheets.length;i++){
			//添加样式规则
			if(styleSheets[i].insertRule){//w3c  ->cssRules
				//计算规则添加的索引位置  w3c默认它的长度为最后一个位置
				newIndex=(index>=0? index:styleSheets[i].cssRules.length);
				//DOM样式规则添加的方法  insertRule(rule,index);
				styleSheets[i].insertRule( selector+"{"+declaration+"}",newIndex);
			}else if( styleSheets[i].addRule){//ie中认为规则列表最后一项为-1； 
				newIndex=(index>=0? index:-1)
				//ie样式规则添加的方法  addRule(selector,style[,index]);
				styleSheets[i].addRule(selector,declaration,newIndex);
				
			}
		}
	}

	window['yc']['addCSSRule']=addCSSRule;


/*
 编辑修改样式规则  yc.editCSSRule('.test',{'font-size':12px});
 */
	function editCSSRule( selector,styles,url,media){
		var styleSheets=getStyleSheets(url,media);
		
		for(var i=0;i<styleSheets.length;i++){
			var rules=styleSheets[i].cssRules||styleSheets[i].rules;
			if(!rules){
				continue;
			}
			//ie默认选择器使用大写故转换为大写的形式，
			selector=selector.toUpperCase();
			for( var j=0;j<rules.length;j++){
				//判断取到的选择器转换为大写与传入的选择器转换为大写是否相等
				if( rules[j].selectorText.toUpperCase()==selector){
					for(property in styles){
						if( !styles.hasOwnProperty(property)){
							continue;
						}
						//将这条规则设为新样式
						//DOM中   添加规则属性要转换为大写       style.backgroundColor="red";
						rules[j].style[camelize(property)]=styles[property];
					}
					
				}
			}
		}
	}

	window['yc']['editCSSRule']=editCSSRule;
/*
取得一个元素的最终计算样式(比如这个标签有行内样式，内部样式，外部样式，看最终实用的是那个计算样式)
 */
	function getStyle(element,property){
		if(!(element=$(element))||!property){return false;}
		var value=element.style[camelize(property)];
		if(!value){
			if(document.defaultView && document.defaultView.getComputedStyle){//w3c
				var css=document.defaultView.getComputedStyle(element,null);//取出element这个元素的所有计算样式
				value=css?css.getPropertyCSSValue( property):null;
			}else if( element.currentStyle){//ie
				value=element.currentStyle[camelize(property)];
			}
		}
		return value='auto'?'':value;
	}
	window['yc']['getStyle']=getStyle;
	window['yc']['getStyleById']=getStyle;

//------------------------------xml操作----------------------------------------
	//从xml文档中按xpath规则提取要求的节点    /students/student
	function selectXMLNodes(xmlDoc,xpath){
		if('\v'=='\v'){
			//ie
			xmlDoc.setProperty("SelectionLanguage","XPath");//将当前的xml文档的查找方式改为xpath
			return xmlDoc.documentElement.selectNodes(xpath);
		}else{
			//w3c
			var evaluator=new XPathEvaluator();
			//按节点顺序解析
			var resultSet=evaluator.evaluate(xpath,xmlDoc,null,XPathResult.ORDERED_NODE_ITERATOR_TYPE,null);
			//通过xpath解析的结果是一个集合
			var finalArray=[];
			if(resultSet){
				var el=resultSet.iterateNext();//循环解到的结果
				while(el){
					finalArray.push(el);
					el=resultSet.iterateNext();
				}
				return finalArray;
			}
		}
	}
	window['yc']['selectXMLNodes']=selectXMLNodes;

//在xml dom中不能使用getElementById方法，所以这里自己实现一个相似功能的函数来获取xml中的id
	function getElementByIdXML(rootnode,id){
		//先获取根节点下面的所有元素
		nodeTags=rootnode.getElementsByTagName('*');
		for(var i=0;i<nodeTags.length;i++){
			if( nodeTags[i].hasAttribute('id') ){//判断元素中时候有这个id属性
				if( (nodeTags[i].getAttribute('id')==id)){
					return nodeTags[i];
				}
			}
		}
	}
	window['yc']['getElementByIdXML']=getElementByIdXML;
	
//将xml的字符串反序列化转为xml dom节点对象  ，以便于使用getElementsByTagName()等函数来操作
	function parseTextToXmlDomObject(str) {
		if ('\v' == 'v') {
			//Internet Explorer
			var xmlNames = ["Msxml2.DOMDocument.6.0", "Msxml2.DOMDocument.4.0", "Msxml2.DOMDocument.3.0", "Msxml2.DOMDocument", "Microsoft.XMLDOM", "Microsoft.XmlDom"];
			for (var i = 0; i < xmlNames.length; i++) {
				try {
					var xmlDoc = new ActiveXObject(xmlNames[i]);
					break;
				} catch(e) {
					
				}
			}
			xmlDoc.async = false;
			xmlDoc.loadXML(str);
		} else {
			try  {
				//Firefox, Mozilla, Opera, Webkit.
				var parser = new DOMParser();
				var xmlDoc = parser.parseFromString(str,"text/xml");
			} catch(x) {
				alert(x.message);
				return;
			}
		}
		return xmlDoc;
	}
	window['yc']['parseTextToXmlDomObject']=parseTextToXmlDomObject;
	
	//将  xml Dom对象 序列化转为  xml 字符串,
	function parseXmlDomObjetToText( xmlDom ){
		if (xmlDOM.xml) {
			return xmlDOM.xml;    //  xml文件内容
		} else {
			var serializer  = new XMLSerializer();
			return serializer.serializeToString(xmlDOM, "text/xml");
		}
	}
	window['yc']['parseXmlDomObjetToText']=parseXmlDomObjetToText;
	



//------------------------------------ajax封装-----------------------------------
	//对参数字符串编码  针对get请求  person.action?name=%xxx%xxx&age=20
	function addUrlParam(url,name,value){
		url+=(url.indexOf("?")==-1?"?":"&");
		url+=encodeURIComponent(name)+"="+encodeURIComponent(value);
		return url;
	}
//序列化表单  name=csy&password=a
	function serialize(form){
		var parts=[];
		var field=null;
		//form.elements  表单中所有的元素
		for(var i=0,len=form.elements.length;i<len;i++){
			field=form.elements[i];//取出每一个元素
			//判断form表单中的类型  
			switch(field.type){
				case "select-one":  //select   options
				case "select-multiple":
				//判断如果是选择多个或者单个就进行下面的循环
				for(var j=0,optlen=field.options.length;j<optlen;j++){
					var option=field.options[j];//取出每一个select中的每一个option
					//判断option是否被选中了
					if(option.selected){
						var optValue="";
						if(option.hasAttribute){//判断value这个属性存不存在，如果存在就取option中value的值，如果不存在就取option中的文本值
							//w3c
							optValue=(option.hasAttribute("value") ? option.value:option.text);
						}else{//ie
							optValue=(option.attributes["value"].specified ? option.value:option.text);
						}
						parts.push(encodeURIComponent(field.name)+"="+encodeURIComponent(optValue));
					}
				}
				break;
				case undefined:  //fieldset
				case "file":	// file input
				case "submit":	//submit input
				case "button":	//custom input
				break;
				//单选和多选
				case "radio":
				case "checkbox":
					if(!field.checked){break;}
				default:
					parts.push(encodeURIComponent(field.name)+"="+encodeURIComponent(field.value));
			}
		}
		return parts.join("&");
	}
	window['yc']['serialize']=serialize;
	
	/*
	 通用的获取  xmlHttpRequest对象的函数
	 * */
	
	function getRequestObject(url,options){
		// 初始化请求对象
		var req=false;
		if(window.XMLHttpRequest){
			var req=new window.XMLHttpRequest();
		}else if(window.ActiveXObject){//ie7一下的浏览器
			var req=new window.ActiveXObject('Microsoft.XMLHTTP');
		}
		if(!req){return false;}//如果无法创建   request对象  ，则返回
		//定义默认选项
		options=options ||{};
		options.method=options.method  ||'POST';
		//get方式请求服务器时，参数直接放在链接中    true代表异步发送方式
		//get方式请求服务器时，参数直接放在send中    
		options.send=options.send||null; //req.open("POST,url,true);    req.send(null);
		
		//定义请求的不同状态是回调的函数
		req.onreadystatechange=function(){
			switch (req.readyState){
				case 1:
				//请求初始化
					if(options.loadListener){
						options.loadListener.apply(req,arguments);//apply/call->this作用域
					}
					break;
				case 2:
					if(options.loadedListener){
						options.loadedListener.apply(req,arguments);
					}
					break;
				case 3:
					if(options.inecractiveListener){
						options.inecractiveListener.apply(req,arguments);
					}
					break;
				case 4:
					try{
						if(req.status  && req.status==200){
							var contentType=req.getResponseHeader("Content-Type");
							var mimeType=contentType.match(/ \S*([^;]+)\s*(;|$)/i)[1];
							switch( mimeType){
								case 'text/javascript':
								case 'application/javascript':
									if(options.jsResponseListener){
										options.jsResponseListener.call( req,req,responseText);
									}
									break;
								case 'text/plain':
								case 'application/json':
									if(options.jsResponseListener){
										try{
											var json=parseJSON( req.responseText);//取出json格式的字符串，以为以防其中有恶意代码，用parseJSON处理下将其转为json对象
										}catch(e){
											var json=false;
										}
										options.jsResponseListener.call( req,json);
										//等价于req.onreadystatechange(json);
									}
									break;
								case 'text/xml':
								case 'application/xml':
								case 'application/xhml+xml':
									if(options.xmlResponseListener){
										options.xmlResponseListener.call( req,req,responseXML);
									}
									break;
								case 'text/html':
									if(options.htmlResponseListener){
										options.htmlResponseListener.call( req,req,responseXML);
									}
									break;
							}
							
							//完成后的监听器
							if(options.completeListener){
								options.completeListener.call( req,req.responseText);
							}
							
						}else{
							if(options.errorListener){
								options.errorListener.call( req,req.responseText);
							}
							
						}
						
					}catch(e){
						alert(e);
					}
					break;
				
			}
		}
		req.open(options.method,url,true);
		req.setRequestHeader('X-yc-Ajax-Request','AjaxRequest');
		return req;
	}
	//打开请求
	
	window['yc']['getRequestObject']=getRequestObject;
	
	
	
	/*
	 发送ajax请求XMLHttpRequest
	 option对象的结构：{
	 	'method':"GET/POST",
	 	'send':发送的参数,
	 	'loadListener':初始化回调  readyState=1
	 	'loadedListener':加载完成回调   readyState=2
	 	'inecractiveListener':交互时回调	readyState=3
	 	
	 	以下是readyState=4的处理
	 	'jsResponseListener':结果是一个javascript代码时的回调处理函数
	 	'jsonResponseListener':结果是一个json时的回调处理
	 	'xmlResponseListener':结果是一个xml时的回调函数
	 	'htmlResponseListener':结果是一个hxml时的回调处理函数
	 	'completeListener':处理完成后的回调
	 	
	 	statu==500
	 	'errorListener':响应码不为200时
	 }
	 * */
	function ajaxRequest(url,options){
		var req=getRequestObject(url,options);
		req.setRequestHeader("Content-Type","application/x-www-form-urlencoded");
		return req.send(options.send);
	}
	
	window['yc']['ajaxRequest']=ajaxRequest;
	
	
	
	/*
	 parseJSON(string,filter)
	 	string:要转换的字符串
	 	filter:用于过滤和转换结果的可选参数
	 * */
	function parseJSON(s,filter){
		var j;
		//递归函数    k为键   v为值
		function walk(k,v){
			var i;
			if( v && typeof v==='object'){
				for(i in v){
					if( v.hasOwnProperty(i)){
						v[i]=walk(i,v[i]);
					}
				}
			}
			return filter(k,v);//回调过滤函数，完成过滤操作
		}
		/*
		 转换分为三个阶段，
		 
		 第一阶段：通过正则表达式检测json文本，查找非json字符，其中特别是()，new，因为它们会引起语句的调用，还有=，会导致赋值，为了安全，这里拒绝所有的不希望出现的字符，josn中不包含回车换行符
		 “|”  代表或   将双斜杠看成单斜杠，就是用来转义
		 先分解"(\\.|[^"\\\n\r])*?"
		 [,:{}\[\]0-9.\-+EaefInr-u \n\r\t]
		 匹配一个单个字符，这个字符可以是, ; { } [  ] 数字  除了\n之外的任何单个字符  - + E a e f l n r-u
之间的字符，回车，换行，制表符
* * */
		if(/ ^("(\\.|[^"\\\n\r])*?"|[,:{}\[\]0-9.\-+EaefInr-u \n\r\t])+?$/.test(s)){
			//第二阶段，将json字符串转换为js结构
			try{
				j=eval('('+s+')');
				
			}catch(e){
				throw new SyntaxError("eval perseJSON");
			}
		}else{
			throw new SyntaxError("perseJSON");
		}
		//第三阶段，递归遍历了新生成的结构，将每个键值对传递给一个过滤函数
		if(typeof filter==='function'){
			j=walk("",j);
		}
		return j;
	}
	window['yc']['parseJSON']=parseJSON;
//=====================================================================================	
})();


//----------------------------------------用于全局的------------------------------------

//基于全局对象原型的继承
Object.prototype.toJSONStringTea=function(){
	var jsonstr=[];
	for (var i in this) {
		if ( this.hasOwnProperty(i) ) {
			jsonstr.push('\"'+i+'\":\"'+this[i]+'\"');
		}
		
	}
	var r=jsonstr.join(',\n');
	r="{"+r+"}";
	return r;
}

Array.prototype.toJSONStringTea=function(){
	var arr=[];
	for ( var i=0;i<this.length;i++) {
		arr[i]=( this[i]!=null )? this[i].toJSONStringTea():"null";
	}
	return '['+arr.join(",")+']';
}
Boolean.prototype.toJSONStringTea=function(){return this}
Function.prototype.toJSONStringTea=function(){return this}
Number.prototype.toJSONStringTea=function(){return this}
RegExp.prototype.toJSONStringTea=function(){return this}