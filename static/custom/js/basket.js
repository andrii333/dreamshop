function BasketController($scope, $http, backend)
	{



	$scope.$watch('$parent.basket',function()	
		{
		$scope.basket_arr = [];
		for (var each in $scope.$parent.basket)
			{
			obj = $scope.$parent.basket[each];
			var obj_ar = [];
			obj_ar.push(obj[0]);  //name
			console.log(obj[0]);
			obj_ar.push(obj[1]);  //price
			obj_ar.push(obj[4]);  //qt
			obj_ar.push(parseInt(obj[1]*obj[4]*100)/100);  //price
			obj_ar.push(each);  //id
			$scope.basket_arr.push(obj_ar)

			};
		$scope.config = {};
		$scope.config['head'] = [{'name':'Name','sort':"str"},
								{'name':'price','sort':"int"},
								{'name':'Kolvo','sort':"int"},
								{'name':'Total','sort':"int"}]


		},true)


	}