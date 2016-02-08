angular.module('app')
	.directive('ngAnimShow',function($timeout)
	{
	return {
		link:function(scope,element,attr)
			{


			//parse all parametrs
			var main_str = attr['ngAnimShow']
			while(main_str.indexOf("'")!=-1){main_str = main_str.replace("'","")}  //replace all '
			while(main_str.indexOf('"')!=-1){main_str = main_str.replace('"','')}  //replace all "
			main_str = main_str.split('|');

			var var_name = main_str[0];
			var on_show_class=main_str[1];
			var on_hide_class=main_str[2];
			var duration = main_str[3];


			//default properties for transition. Transition always setting, to overcover existed if it is.
			// Also set 0s duration means no animations despite some transitions maybe by mistakes included in css file
			var t = {};
			t['prop'] = 'all';
			t['duration'] = '0s';
			t['effect'] = 'ease';
			t['delay'] = '0s';

			function set_transition()
				{
				$(element[0]).css('transition', t.prop+' '+ t.duration+' '+t.effect+' '+ t.delay);
				$(element[0]).css('-webkit-transition', t.prop+' '+ t.duration+' '+t.effect+' '+ t.delay);
				$(element[0]).css('-moz-transition', t.prop+' '+ t.duration+' '+t.effect+' '+ t.delay);
				$(element[0]).css('-o-transition', t.prop+' '+ t.duration+' '+t.effect+' '+ t.delay);
				$(element[0]).css('-ms-transition', t.prop+' '+ t.duration+' '+t.effect+' '+ t.delay);
				$(element[0]).css('-khtml-transition', t.prop+' '+ t.duration+' '+t.effect+' '+ t.delay);
				}
			//set duration
			if (on_show_class.indexOf('transitioned')!=-1&&on_hide_class.indexOf('transitioned')!=-1)
				{
				t.duration = duration;
				}
			else
				{
				$(element[0]).css('animation-duration',duration);
				$(element[0]).css('-webkit-animation-duration',duration);
				$(element[0]).css('-moz-animation-duration',duration);
				$(element[0]).css('-o-animation-duration',duration);
				$(element[0]).css('-ms-animation-duration',duration);
				$(element[0]).css('-khtml-animation-duration',duration);
				}

			set_transition();  //set ransition for safe case


			scope.$watch(var_name,function(new_val,old_val)
				{
				//when nothing changing. so element hidden or not
				if (new_val==true&&old_val==true)
					{
					$(element[0]).css({'display':'block'});
					}
				if (new_val==false&&old_val==false)
					{
					$(element[0]).css({'display':'none'});
					}

				//when switch occuring
				if (new_val==true&&old_val==false)
					{
					$(element[0]).css({'display':'block'});
					$timeout(function(){$(element[0]).removeClass(on_hide_class).addClass(on_show_class)},0);
					}
				if (new_val==false&&old_val==true)
					{
					$timeout(function(){$(element[0]).css({'display':'none'})},parseInt(duration)*1000);
					$timeout(function(){$(element[0]).removeClass(on_show_class).addClass(on_hide_class)},0);
					}
				})
			}
	}


	})
