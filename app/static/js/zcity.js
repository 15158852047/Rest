/****************************************
* name:zcityData
* tips:城市数据
****************************************/
var zcityData = {
"0":["Delphi","Python","游戏"],
"0_0":["Delphi","Com通讯","GPIB通讯","UDP打洞"],
"0_1":["Python","Python web","机器学习","深度学习"],
"0_2":["流放之路","梦幻西游","英雄联盟"],
};
/****************************************
* name:zcity
* tips:城市联动
****************************************/
function zcity(id){
	var cityIni='';
	var cityRange='';
	var zcityItem='.zcityItem';
	var itemLevel='item-level';
	var zcityItemHead='.zcityItem-head';
	var zcityItemMain='.zcityItem-main';
	var currentValue='.currentValue';
	var citylist='.citylist';
	var cityitem='.cityitem';
	var cityTips='.cityTips'
	var cityDefaultTips='请选择';//默认提示
	/****************************************
	* name:cityIni
	* tips:初始化
	****************************************/
	if($(id).attr('city-range')!=null && $(id).attr('city-range')!=undefined && $(id).attr('city-range')!=''){
		cityRange=strToJson($(id).attr('city-range'));
		var leavelStart=parseInt(cityRange.level_start,10);
		var leavelEnd=parseInt(cityRange.level_end,10);
		if(leavelEnd<leavelStart){
			alertTips('warning','城市区间配置最大值不能小于最小值！');
			return;
		}else{
			$(id).html('');
			if($(id).attr('city-ini')!=null && $(id).attr('city-ini')!=undefined && $(id).attr('city-ini')!=''){
				//有初始值
				cityIni=$(id).attr('city-ini').split(",");
				for(var i=0;i<=leavelEnd-leavelStart;i++){
					var currCityIni=cityIni[i];
					var name = String(i);
					alert(name);
					if(currCityIni==undefined){
						currCityIni='';
					}
					$(id).append(addItemHtml(i+leavelStart,currCityIni,name));
					if(i==0){
						iniLevel(i+leavelStart);//插入层级数据	
					}else{
						iniNameIndexVal(i+leavelStart,cityIni[i],name);
					}													
				}
			}else{
				//没有初始值
				for(var i=0;i<=leavelEnd-leavelStart;i++){
					$(id).append(addItemHtml(i+leavelStart,''));
					if(i==0){
						iniLevel(i+leavelStart);//插入层级数据		
					}else{

					}
				}
			}
		}
	}
 	/***************************************
	* name: clickTargetOut
	* tips: 点击DIV之外隐藏Target
	****************************************/
	$(document).on('click',function(e){
		if($(e.target).parents(id).length == 0){
			$(id+' '+zcityItem).removeClass('on');
        }
	});	
	/****************************************
	* name:zcityItemHead
	* tips:点击头部
	****************************************/
	$(document).on('click',id+' '+zcityItemHead,function(){
		if($(this).parents(zcityItem).hasClass('on')){
			$(this).parents(zcityItem).removeClass('on');
		}else{
			$(id+' '+zcityItem).removeClass('on');
			$(this).parents(zcityItem).addClass('on');
		}
		setPosition(this);
	});
	/****************************************
	* name:setPosition
	* tips:设置下拉位置
	****************************************/
	function setPosition(target){
		var diffBottomH=50;//与底部相差高度
		var drapDownMainMinWidth=70;//下拉内容的最小宽度
		var windowH=$(window).height();
		var windowT=$(window).scrollTop();
		var headH=$(target).outerHeight();
		var headW=$(target).outerWidth();
		var mainH=$(target).siblings('.zcityItem-main').outerHeight();
		var mainW=0;
		//监听主区域滚动
		$(window).on('scroll',function(){
			$('.zcityGroup .zcityItem').removeClass('on');
		});
		$(window).resize(function(){
			$('.zcityGroup .zcityItem').removeClass('on');
		});	
		if(headW<drapDownMainMinWidth){
			$(target).siblings('.zcityItem-main').css({'width':drapDownMainMinWidth});
			mainW=drapDownMainMinWidth;
		}else{
			$(target).siblings('.zcityItem-main').css({'width':headW});
			mainW=headW;
		}
		var showTop=$(target).offset().top;
		var showLeft=$(target).offset().left;
		var bodyScrollTop=$('body').scrollTop();
		if(windowH+windowT>showTop+mainH+diffBottomH){//判断向上还是向下
			$(target).siblings('.zcityItem-main').css({'left':showLeft-(mainW-headW),'top':showTop+headH-bodyScrollTop});
		}else{
			$(target).siblings('.zcityItem-main').css({'left':showLeft-(mainW-headW),'top':showTop-mainH-bodyScrollTop});
		}
	}
	/****************************************
	* name:iniLevel
	* tips:初始化层级数据
	****************************************/
	function iniLevel(level){
		$(id).find(zcityItem+'['+itemLevel+'="'+level+'"]'+' '+citylist).html('');//清空
		/****************************************
		* name:each
		* tips:遍历数据 - 获得对应层级数据
		****************************************/
		var curLength=0;
		var curItemLi='';
		$.each(zcityData,function(name,value){
			//console.log(name);
			//console.log(value);
			if(strAppearNumber('_',name)==level-1){
				curLength=value.length;
				for(var u=0;u<curLength;u++){
					curItemLi=curItemLi+'<li class="cityitem" values="'+value[u]+'">'+value[u]+'</li>';
				}
			}
		});
		$(id).find(zcityItem+'['+itemLevel+'="'+level+'"]'+' '+citylist).html(curItemLi);//重新赋值
	}
	/****************************************
	* name:iniNameIndexVal
	* tips:初始化名称索引对应数组值
	****************************************/
	function iniNameIndexVal(level,cityName){
		var nameIndex=0;
		$(id).find(zcityItem+'['+itemLevel+'="'+level+'"]'+' '+citylist).html('');//清空
		/****************************************
		* name:each
		* tips:遍历数据 - 获得对应层级数据
		****************************************/
		$.each(zcityData,function(name,value){
			//console.log(name);
			//console.log(value);
			if(strAppearNumber('_',name)==level-1){
				curLength=value.length;
				for(var u=0;u<curLength;u++){
					if(value[u]==cityName){
						nameIndex=name;
						return;
					}
				}
			}
		});
		var curItemLi='';
		var curLength=zcityData[nameIndex].length;
		for(var k=0;k<curLength;k++){
			curItemLi=curItemLi+'<li class="cityitem" values="'+zcityData[nameIndex][k]+'">'+zcityData[nameIndex][k]+'</li>';
		}
		$(id).find(zcityItem+'['+itemLevel+'="'+level+'"]'+' '+citylist).html(curItemLi);//重新赋值
	}
	/****************************************
	* name:iniSonLeavel
	* tips:初始化子级数组值
	****************************************/
	function iniSonLeavel(level,cityName){
		var sonLevel=parseInt(level,10)+1;
		var nameIndex=0;
		$(id).find(zcityItem+'['+itemLevel+'="'+level+1+'"]'+' '+citylist).html('');//清空
		/****************************************
		* name:each
		* tips:遍历数据 - 获得对应层级数据
		****************************************/
		$.each(zcityData,function(name,value){
			//console.log(name);
			//console.log(value);
			if(strAppearNumber('_',name)==level-1){
				curLength=value.length;
				for(var u=0;u<curLength;u++){
					if(value[u]==cityName){
						nameIndex=name+'_'+u;
						return;
					}
				}
			}
		});
		var curItemLi='';
		var curLength=zcityData[nameIndex].length;
		for(var k=0;k<curLength;k++){
			curItemLi=curItemLi+'<li class="cityitem" values="'+zcityData[nameIndex][k]+'">'+zcityData[nameIndex][k]+'</li>';
		}
		$(id).find(zcityItem+'['+itemLevel+'="'+sonLevel+'"]'+' '+citylist).html(curItemLi);//重新赋值
	}
	/****************************************
	* name:addItemHtml
	* tips:动态添加ITEMHTML
	****************************************/
	function addItemHtml(itemLevel,iniVal){
		var curHtml='<div class="zcityItem" item-level="'+itemLevel+'">'+
						'<div class="zcityItem-head">'+
						     '<input type="text" class="currentValue" readonly value="'+iniVal+'" placeholder="请选择">'+
						'</div>'+
						'<div class="zcityItem-main">'+
						     '<div class="cityContainer">'+
								  '<div class="cityTips">'+cityDefaultTips+'</div>'+
								  '<ul class="citylist"></ul>'+
						     '</div>'+
						'</div>'+
				    '</div>';
		return curHtml;
	}
	/****************************************
	* name:cityitem
	* tips:点击值
	****************************************/
	$(document).on('click',cityitem,function(){
		var curCityItemValue=$(this).attr('values');
		$(this).parents(zcityItem).removeClass('on');
		$(this).parents(zcityItem).find(currentValue).val(curCityItemValue);
		if($(this).parents(id).attr('city-range')==undefined||$(this).parents(id).attr('city-range')==null||$(this).parents(id).attr('city-range')==''){
			return;
		}
		var curCityRange=strToJson($(this).parents(id).attr('city-range'));
		var curLeavelStart=parseInt(curCityRange.level_start,10);
		var curLeavelEnd=parseInt(curCityRange.level_end,10);
		var curItemLeavel=parseInt($(this).parents(zcityItem).attr(itemLevel),10);
		if(curItemLeavel<curLeavelEnd){
			//清空所有子级赋值
			for(var p=curItemLeavel;p<curLeavelEnd;p++){
				$(id).find(zcityItem+'['+itemLevel+'="'+(p+1)+'"]').find(currentValue).val('');//清空
				$(id).find(zcityItem+'['+itemLevel+'="'+(p+1)+'"]'+' '+citylist).html('');//清空
			}
			//重新赋值相邻子级
			iniSonLeavel(curItemLeavel,curCityItemValue);
		}
	});
	/****************************************
	* name:cityTips
	* tips:点击默认提示
	****************************************/
	$(document).on('click',cityTips,function(){
		$(this).parents(zcityItem).find(currentValue).val('');
		$(this).parents(zcityItem).removeClass('on');
	});
	/****************************************
	* name:strAppearNumber
	* tips:字符串出现次数
	****************************************/
	function strAppearNumber(findStr,sourceStr){
		findStr=eval("/"+findStr+"/ig");
		if(sourceStr.match(findStr)==null||sourceStr.match(findStr)==undefined){
			return 0;
		}else{
			return sourceStr.match(findStr).length;
		}
	}
	/***************************************
	* name: strToJson
	* tips: 字符串转Json
	****************************************/
	function strToJson(str){ 
		var json = eval('(' + str + ')'); 
		return json; 
	} 
}
/****************************************
* name:zcityrun
* tips:城市联动运行
****************************************/
function zcityrun(id){
	var size=$(id).size();
	for(var i=0;i<size;i++){
		var curZcityId=$(id).eq(i).attr('zcity-id','zcity'+i);
	}
	for(var u=0;u<size;u++){
		zcity(id+'[zcity-id="zcity'+u+'"]');
	}
}

