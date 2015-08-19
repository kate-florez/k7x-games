var deflang =  "en";
(function($) {	
	$.fn.synchysis = function(options) {
		var obj=this;
		$.fn.synchysis.defaults = {
			container: obj.selector,
			element:"",
			width:"",
			height:"",
			particular:{},
			bottom:10,
		};
		var opts = $.extend({}, $.fn.synchysis.defaults, options);		

		var container_width=$(opts.container).width();
		var maxColumn=0;
		var lists=[];
		var elementIndex={};
		var elementLen=0;
		obj.init=function(){				
			lists=[];
			elementIndex={};
			elementLen=$(opts.element).length;
			container_width=$(opts.container).width();
			maxColumn=obj.computeMaxColumn();
			$(opts.element).each(function(index, element) {
				coordinates=obj.coordinate(index,element);				
				$(element).css({position:'absolute',top:coordinates.top,left:coordinates.left});
			});
			$(opts.container).css({height:lists.length*opts.height+opts.bottom});
		}
		obj.coordinate=function(index,element){
			var elementName=$(element).attr("data-type");
			if(elementName==undefined || elementName==''){elementName="base";}
			var compare=[1,1];
			if(elementName!="base"){
				compare=opts.particular[elementName];
			}		
			if(elementIndex[elementName]===undefined){elementIndex[elementName]=0;}
			if(index>elementIndex[elementName]){index=elementIndex[elementName];}
			do{
				elementIndex[elementName]=index;
				indexRow=Math.floor(index/maxColumn);
				indexColumn=index%maxColumn;
				index++;
			}while(!obj.detection([indexRow,indexColumn],compare))
			obj.setlists([indexRow,indexColumn],compare);
			return {top:indexRow*opts.width,left:indexColumn*opts.height}		
		}

		obj.detection=function(n,c){			
			for(var i=0;i<c[1];i++){
				if(lists[n[0]+i]===undefined){lists[n[0]+i]=[];}
				for(var j=0;j<c[0];j++){
					if(n[1]+j>=maxColumn  &&　j<maxColumn || lists[n[0]+i][n[1]+j] !==undefined && lists[n[0]+i][n[1]+j]!==0){	
						return false;
					}
				}
			}
			return true;
		}
		obj.setlists=function(n,c){
			for(var i=0;i<c[1];i++){
				if(lists[n[0]+i]===undefined){lists[n[0]+i]=[];}
				for(var j=0;j<c[0];j++){
					lists[n[0]+i][n[1]+j]=1;
				}
			}
			return true;
		}

		obj.computeMaxColumn=function(){
			return  Math.floor(container_width/opts.width);
		}	
		obj.init();
		return obj;
	}
})(jQuery);

/*contact us*/
var contactArr = {'contact':"Contact Us",'tos':"Terms of Use",'priv':"Privacy Policy"};
function showDiv1(str){
	$("#poptop1").show(800);
}
function showDiv2(str){
	$("#poptop2").show(800);
}
function showDiv3(str){
	$("#poptop3").show(800);
}
function colse_pop(){
	$("#poptop").fadeOut(200);
}
function colse_pop(){
	$("#poptop1").fadeOut(200);
	$("#poptop2").fadeOut(200);
	$("#poptop3").fadeOut(200);
}
		//AJax  load page
			var total = 15;//total page num
			var error_falg = false;
			$(function() {
				resetWidth();
				bigSmaimg();
				$("#page_nav").val(2);
				resizeInit();
				$(window).scroll(function() {
					ajax_pinterest();
				});				
			});
			$(window).resize(function() {
				resizeInit();
			});
			var cookielang = getcookie("langtype");
			if(cookielang == undefined || cookielang == '' || cookielang == deflang){
				cookielang = '';
			} else{
				cookielang = '/'+cookielang;
			}
			function ajax_pinterest(is_async) {
				var loading = $("#loading");
				var page_nav = $("#page_nav");
				var cat_now = "";
				var tag = "";
				var w_heigth = $(window).height();
				var d_heigth = $(document).height();
				var d_scrolltop = $(document).scrollTop();
				if (d_scrolltop + w_heigth > d_heigth - 3) {
					if (loading.val() == "on") return false;
					loading.val("on");
					var nextNum = parseInt(page_nav.val());
					if(cat_now !=''){
						var ajaxHref = cookielang+"/cat/"+cat_now+"/page/"+nextNum;
					}else if(tag != ''){
						var ajaxHref = cookielang+"/tag/"+tag+"/page/"+nextNum;
					}else{
						var ajaxHref = cookielang+"/page/"+nextNum;
					}
					if (is_async == undefined) is_async = true;
					if (nextNum <= total) {
						$.ajax({
							url: ajaxHref,
							type: 'GET',
							async: is_async,
							dataType: 'json',
							success: function(renData) {
								if (renData != 0) {
									$("#container").append(Waterfall(renData));
									changeHref();
									page_nav.val(nextNum + 1);
									loading.val("off");
									showloading("infscr");
									bigSmaimg();
								} else {
									loading.val("off");
									showloading("end");
								}
							},
							error: function(XMLHttpRequest, textStatus, errorThrown) {
								error_falg = true;
								loading.val("off");
								showloading("error");
							}
						});
					} else {
						loading.val("off");
						showloading("end");
					}
				}
			}
			function showloading(result) {
				$("#infscr-loading").stop(true, true).hide();
				$("#error-loading").stop(true, true).hide();
				$("#end-loading").stop(true, true).hide();
				if (result == undefined) result = 'infscr';
				$('#' + result + "-loading").fadeIn();
				$('#' + result + "-loading").fadeOut(3000);
			}

			function resizeInit() {
				var nextNum = parseInt($("#page_nav").val());;
				var w_heigth = $(window).height();
				var d_heigth = $(document).height();
				while (d_heigth <= w_heigth && nextNum < total && error_falg === false) {
					ajax_pinterest(false);
					beforeNum = nextNum;
					nextNum = parseInt($("#page_nav").val());
					if (beforeNum == nextNum) break;
				}
			}
			

					// 			var isopen = getcookie('isOpen');
					// $(function(){
					// 	changeHref();
					// });
					// function changeHref() {
					// 	if (isopen == 1) {
					// 		$('.changeUrl').each(function (n) {
					// 			$(this).attr('href',$(this).attr('href').replace(/game/,"detail"));
					// 		});
					// 		$('.changeCon').html($('.changeUrl').html().replace(/game/,"detail"));
					// 	}else{
					// 		$('.changeUrl').each(function (n) {
					// 			$(this).attr('href',$(this).attr('href').replace(/detail/,"game"));
					// 		});
					// 		$('.changeCon').html($('.changeUrl').html().replace(/detail/,"game"));
					// 	}
					// }


			//menu
			$(document).ready(function () {
				$(".navbar-toggle").on("click", function () {
					$(this).toggleClass("active");
				});
			});
