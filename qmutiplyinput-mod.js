define(["jquery/qmutiplyinput/1.0.0/jquery.qmutiplyinput.css"], 
function(require, exports) {
	
	(function($)
			{
					var  defaultoptions = {
						  selector      : this.selector
					};
					var plugname="qmutiplyinput";
					
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
					
					
					var TemplateEngine = function(html, options) {
						if(options==null)
						{
							return html;
						}
						//   /<%([^%>]+)?%>/g    /\{\$([^%>]+)?\}/g       re3 = /[^\[]+(?=\])/;BTW：JS正则方法论已非常完备，为什么还要画蛇添足？
						var re = /[^\{]+(?=\})/g , reExp = /(^( )?(if|for|else|switch|case|break|{|}))(.*)?/g, code = 'var r=[];\n', cursor = 0;
						var add = function(line, js) {
							if(line)
							{
								js? (code += line.match(reExp) ? line + '\n' : 'r.push(' + line + ');\n') :
								(code += line != '' ? 'r.push("' + line.replace(/"/g, '\\"') + '");\n' : '');
							}else{
								console.log(js);
							}
							return add;
						}
						while(match = re.exec(html)) {
							add(html.slice(cursor, match.index))(match[1], true);
							cursor = match.index + match[0].length;
						}
						add(html.substr(cursor, html.length - cursor));
						code += 'return r.join("");';
						console.log(code);
						return new Function(code.replace(/[\r\t\n]/g, '')).apply(options);
					};


					function renderTpl(tpl, op) {
									    return tpl.replace(/\{(\w+)\}/g, function(e1, e2) {   
									       return op[e2] != null ? op[e2]:"";   
									    });
					};
							
							
					var i=1;//起始排序数字
					function PluginObject(target)
					{
							this.options;
							this.inputs;
							this.tplHtml;
							this.render=function(value)
							{
								if(value!=null)
								{
									var  inputstrarray=value.split(",");
									this.change(inputstrarray.length);
									var itemsarray=target.find(".iteminput");
									$.each(inputstrarray,
										function(index,obj)
										{
											$(itemsarray.get(index)).val(obj);
										}
									);
									this.putValue();
								}
							};
							this.addfirst=function(data)
							{
								if(data!=null||this.options.tplData!=null)
								{
									data=$.extend(data||this.options.tplData,{index:i});
								}
								var  itemwrap=$(renderTpl(this.tplHtml,data)).addClass("itemwrap");
								var  input=itemwrap.find("input");
								input.addClass("iteminput").attr("id",input.attr("name")+i);
								i++;
								itemwrap.show();
								target.prepend(itemwrap);
								this.putValue();
								if(typeof this.options.onAdd == "function")
								{
									this.options.onAdd.apply(this,[input])
								}
							};
							this.addlast=function(data)
							{
								if(data!=null||this.options.tplData!=null)
								{
									data=$.extend(data||this.options.tplData,{index:i});
								}
								var  itemwrap=$(renderTpl(this.tplHtml,data)).addClass("itemwrap");
								var  input=itemwrap.find("input").addClass("iteminput");
								input.addClass("iteminput").attr("id",input.attr("name")+i);
								i++;
								itemwrap.show();
								target.append(itemwrap);
								this.putValue();
								if(typeof this.options.onAdd == "function")
								{
									this.options.onAdd.apply(this,[input])
								}
							};
							this.removefirst=function()
							{
								var itemwrap=target.find(".itemwrap:first");
								var input=itemwrap.find(".iteminput");
								itemwrap.remove();
								i--;
								this.putValue();
								if(typeof this.options.onRemove == "function")
								{
									this.options.onRemove.apply(this,[input])
								}
							};
							this.removelast=function()
							{
								var itemwrap=target.find(".itemwrap:last");
								var input=itemwrap.find(".iteminput");
								itemwrap.remove();
								i--;
								this.putValue();
								if(typeof this.options.onRemove=="function")
								{
									this.options.onRemove.apply(this,[input])
								}
							};
							this.putValue=function()
							{
								if(this.options.resultele!=null)
								{
									this.options.resultele.val(this.getValue());
								}
							};
							this.getValue=function()
							{
									var result = target.find(".iteminput").map(function() {
										if(this.value != null && this.value!='')
										{
											return this.value;
										}
									}).get().join(",");
									return result;
							};
							this.change=function(count)
							{
								var total=target.find(".itemwrap").size();
								if(count>total)
								{
									//增加input
									var addcount=count-total;
									for(var i=0;i<addcount;i++)
									{
										this.addlast();
									}
								}
								else if(count<total && count>=0)
								{
									for(var i=count;i<total;i++)
									{
										//减少input
										this.removelast();
									}
								}
							};
							this.init=function(initoptions)
							{
								this.options=initoptions;
								this.tplHtml=this.options.tpl.get(0).outerHTML;
								
								this.render(this.options.value);
								target.on("change",".item",
									$.proxy(function()
									{
										this.putValue();
									},this)
								);
								
							};
					}
					
			}
			)(jQuery)
			
			
	return jQuery;
}
);