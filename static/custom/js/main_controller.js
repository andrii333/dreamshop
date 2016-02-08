function MainController($scope,backend)
	{



	

	backend.get_user().then(
		function (data)
			{
			$scope.user = data;
			},function(err)
				{
				alert('Problem to obtain data from server');
				});

	$scope.calc_basket = function()
		{
		$scope.basket = backend.get_basket();
		var total = 0;
		for (var each in $scope.basket)
			{
			var r = $scope.basket[each][4]*$scope.basket[each][1]
			total = total+r;
			total = parseInt(total*100)/100;
			}
		return total;
		}
		
	}