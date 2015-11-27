(function($)
{
		/*
		jQuery scroll事件实现监控滚动条分页示例
		http://www.jb51.net/article/48714.htm
		
		scroll事件适用于window对象，但也可滚动iframe框架与CSS overflow属性设置为scroll的元素。
			复制代码 代码如下:

			$(document).ready(function () { //本人习惯这样写了
				$(window).scroll(function () {
					//$(window).scrollTop()这个方法是当前滚动条滚动的距离
					//$(window).height()获取当前窗体的高度
					//$(document).height()获取当前文档的高度
					var bot = 50; //bot是底部距离的高度
					if ((bot + $(window).scrollTop()) >= ($(document).height() - $(window).height())) {
					   //当底部基本距离+滚动的高度〉=文档的高度-窗体的高度时；
						//我们需要去异步加载数据了
						$.getJSON("url", { page: "2" }, function (str) { alert(str); });
					}
				});
			});

			注意：(window).height()和(document).height()的区别

			jQuery(window).height()代表了当前可见区域的大小，而jQuery(document).height()则代表了整个文档的高度，可视具体情况使用.

			注意当浏览器窗口大小改变时(如最大化或拉大窗口后) jQuery(window).height() 随之改变，但是jQuery(document).height()是不变的。
			复制代码 代码如下:

			$(document).scrollTop() 获取垂直滚动的距离  即当前滚动的地方的窗口顶端到整个页面顶端的距离
			$(document).scrollLeft() 这是获取水平滚动条的距离

			要获取顶端 只需要获取到scrollTop()==0的时候  就是顶端了

			要获取底端 只要获取scrollTop()>=$(document).height()-$(window).height()  就可以知道已经滚动到底端了
			复制代码 代码如下:

			$(document).height()  //是获取整个页面的高度
			$(window).height()  //是获取当前 也就是你浏览器所能看到的页面的那部分的高度  这个大小在你缩放浏览器窗口大小时 会改变 与document是不一样的  根据英文应该也能理解吧

			自己做个实验就知道了
			复制代码 代码如下:

			$(document).scroll(function(){
				$("#lb").text($(document).scrollTop());
			})
			<span id="lb" style="top:100px;left:100px;position:fixed;"></span><!--一个固定的span标记 滚动时方便查看-->
			
			
			思路:
			滚动到底部的判断方法：滚动高度=文档高度-窗口高度（文档高度会随着内容的添加而改变）
			如果要在到达底部之前就加载的方法：滚动
		*/
		
		var  defaultoptions = {
			  selector      : this.selector
		};
		var plugname="qinfinite";
		
		$.fn[plugname]=function()
		{
			var isMethodCall=arguments.length>0 && typeof arguments[0] === "string";
			if(isMethodCall)
			{
				//
				var methodname=arguments[0];
				var args = Array.prototype.slice.call(arguments,1);
				this.each(function() {
					var instance = $.data( this,plugname);
					if(instance && $.isFunction( instance[methodname] ))
					{
						var method=instance[methodname];
						method.apply(instance,args);
					}
				});
			}else{
				var inputoptions = arguments;
				$(this).each(
						function ()
						{
							var optionsnew = $.extend( {}, defaultoptions);
							if(inputoptions.length>0)
							{
									optionsnew=$.extend(optionsnew,inputoptions[0]);
							}
							var instance=$(this).data(plugname);
							if(instance)
							{
								instance.init(optionsnew);
							}else
							{
								var target=$(this);
								instance=new PluginObject(target);
								instance.init(optionsnew);
								$(this).data(plugname,instance);
							}
						}
					);
					return this;
			};
		}
		
		
		var i=1;//起始排序数字
		function PluginObject(target)
		{
				this.loadData=function()
				{
					$(body).append("<div>aaaaa</div>");
				};
				
				this.init=function(initoptions)
				{
					
					target.on("scroll",
						$.proxy(function()
						{
							var bot = 50; //bot是底部距离的高度
							if ($(target).scrollTop()>= ($(target).height() - $(target).height()-bot))
							{
							   //当底部基本距离+滚动的高度〉=文档的高度-窗体的高度时；
								//我们需要去异步加载数据了
								this.loadData();
							};
						},this)
					);
					
				};
				
		}
		
}
)(jQuery)