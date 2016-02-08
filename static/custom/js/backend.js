function backend($q,$timeout, $window)
	{

	this.get_items = function()
		{

		var deffered = $q.defer();

		 var items = [];
		 var num_items = 1000;
		 for (var i=0;i<=num_items;i=i+1)
		 	{
			 var country  = chance.country({ full: true });
			 country = country.length>16?country.slice(0,16):country;
			 items.push(
			 	[
	    		/*"title": */country,
	    		/*"price": */chance.floating({min: 0, max: 100, fixed: 2}), 
	    		/*"images":*/ ["http://lorempixel.com/350/250/food/"+i%10, "http://lorempixel.com/350/250/food/"+(i%10+1), "http://lorempixel.com/350/250/food/"+(i%10+2)],
				
				/*id*/       i+'_'+Date.now()]
				)
			}

		$timeout(function(){deffered.resolve(items)},1000);
		return deffered.promise;
		}



	this.get_user = function()
		{

		var deffered = $q.defer();


		var user = {};
		user['credits'] = 2000;
		user['name'] = 'Test';

		$timeout(function(){deffered.resolve(user)},1000);
		return deffered.promise;
		}



	this.add_to_basket = function(item)
		{
		var it = JSON.parse($window.localStorage.getItem(item[3]));
		it = it===null?item:it;
		it[4] = it[4]===undefined?1:it[4]+1;

		$window.localStorage.setItem(item[3],angular.toJson(it));

		}

	this.remove_item_from_basket = function(idx)
		{
		var it = JSON.parse($window.localStorage.getItem(idx));
		var k = it[4]-1;
		if (k<=0)
			{
			this.remove_entire_from_basket(idx);	
			}
		else
			{
			it[4] = it[4]-1;
			$window.localStorage.setItem(idx,angular.toJson(it));				
			}


		}


	this.remove_entire_from_basket = function(idx)
		{
		$window.localStorage.removeItem(idx);
		}


	this.get_basket = function()
		{
		var l = window.localStorage.length;
		var d = {};
		for (var i=0;i<l;i=i+1)
			{
			var key = $window.localStorage.key(i);
			d[key] = JSON.parse($window.localStorage.getItem(key));
			}
		return d;

		}

	}