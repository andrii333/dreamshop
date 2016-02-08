function StoreController($scope, $http, backend)
	{



	$scope.items = [];
	$scope.config = {'head':[]};

	$scope.myspinner=false;

	$scope.myspinner=true;
	backend.get_items().then(
		function (data)
			{
			$scope.myspinner = false;
			$scope.items = data;
			$scope.config = {};
			$scope.config['head'] = [{'name':'title','sort':"str"},
									{'name':'price','sort':"int"},
									{'name':'images','sort':"str"},
									{'name':'id','sort':"int"}]

			},function(err)
				{
				alert('Problem to obtain data from server');
				});

	$scope.interval = 5000; //interval for images slider




	}

