

// CAPSULEFOR <angularjs_base;OPEN>

/*
app = angular.module("app",['ui.bootstrap'])




app.controller("testController",function($scope,$http)
	{

	$scope.config = [];
	$scope.data = [];


	$http.get('./get/1000').then(function(res)
		{
		var tmp = res.data;  //temporary array ness to prevent drawing table before head cutting
		$scope.head = tmp.splice(0,1)[0];
		$scope.data = tmp;
		//put head in config
		$scope.config = {};
		$scope.config['head'] = $scope.head;
		},function(err)
		{
		alert('Problem to obtain data from server'+res.data);		
		})
	
	})




*/


//general bunch if methods for handling data (from json)
angular.module('app')
	.directive('tableData',function()
	{
	return {
		transclude:true,
		scope:{
			tsource: "=srcBody",
			tconf: "=tableConfig"
			},
		templateUrl:"table.html",
		link:function(scope,element,attr,ctrl,transcludeFn)
			{

			//compile current set for page (if paging is active - compiling, another - =tbody)
			scope.create_page = function()
				{
				if (scope.paging_flag==true)
					{
					scope.create_page_paging();
					}
				else
					{
					scope.page=scope.tbody;
					}
				}

			//watch for data changed - MAIN REFRESH & INIT
			scope.$watch('tbody',function()
				{
				scope.create_page(); 
				if (scope.paging_flag!=undefined&&scope.tbody!=undefined)
					{
					scope.init_paging(); 	//init pagination (number of pages etc)
					}
				},true)



			//watcher for source data, if changes - create copy tdata for internal interaction
			scope.$watch('tsource',function(newVal,oldVal)
				{
				if (scope.tsource===undefined||Object.keys(scope.tconf).length==0)
					{
					return false;
					}
				scope.tbody = scope.tsource.slice();

				//init pagination if paging_flag=true. Flag setting in paging directive
				if (scope.paging_flag!=undefined)
					{
					scope.init_paging(); 	//init pagination (number of pages etc)
					}
				scope.create_page();  
				scope.sort_init();   //init sorting (dictionary for marking which titles have been sorted)
				},true);


			//LOGIC FOR SORTING
			//initializing sort dict, which will remain col number and sort type (asc, desc) to mark column titles
			scope.sort_init = function()
				{
				scope.sort_dict = {};
				var kolvo = scope.tconf['head'].length;
				for (var i=0;i<kolvo;i=i+1)
					{
					scope.sort_dict[i] = false;
					}

				}

			//sorting pattern for chosing int, str, desc, asc
			scope.sort_pattern = function(a,b)
				{
				a = a[scope.pass_col_to_sort];
				b = b[scope.pass_col_to_sort];
			
				if (scope.pass_kind_to_sort=='int')
					{

					a = parseFloat(a);
					b = parseFloat(b);
					}
				else
					{
					a = a.toString();
					b = b.toString();
					}

				if (scope.sort_dict[scope.pass_col_to_sort]=='asc')  //sort as string
					{
					return a < b ? -1 : (a > b ? 1 : 0);				
					}
				else    //sort as integer
					{
					return a < b ? 1 : (a > b ? -1 : 0);				
					}

				}
			scope.sort_rows = function(num_col,kind)
				{
				//passing variables to sort pattern
				scope.pass_col_to_sort = num_col;
				scope.pass_kind_to_sort = kind;
				//determine acs or desc
				var tmp = scope.sort_dict[num_col];
				scope.sort_init();  //drop all previous sorting
				scope.sort_dict[num_col] = tmp==undefined?'asc':(tmp=='asc'?'desc':'asc');
				scope.tbody.sort(scope.sort_pattern);
				scope.create_page()  //refresh page

				}


			//END LOGIC FOR SORTING

			
			}
		}

	})


//ONLY to draw paggination directive from ui-bootstrap
angular.module('app')
	.directive('paging',function()
	{
	return {
		link:function(scope,element,attrs)
			{

			//set main flag
			scope.paging_flag=true;

			//set paging configuration
			scope.init_paging = function()
				{
				scope.bigTotalItems = scope.tbody.length;
				scope.bigCurrentPage = 1;  //start page
				scope.maxSize = 5  //number pages in a row
				scope.itPerPage = scope.itPerPage==undefined?'50':scope.itPerPage;

				scope.create_page();

				};
		
			//watcher for page changing	
			scope.$watchGroup(['bigCurrentPage','itPerPage'],function(newValue,oldValues)
				{
				scope.create_page();
				})

			//compile current set for page
			scope.create_page_paging = function()
				{
				if (scope.bigCurrentPage!=undefined&&scope.tbody.length>0)
					{
					var st = (scope.bigCurrentPage-1)*scope.itPerPage;
					var end = (scope.bigCurrentPage)*scope.itPerPage;

					end = end>scope.tbody.length?scope.tbody.length+1:end;

					scope.page = scope.tbody.slice(st,end);
					}	
				else
					{
					scope.page = [];
					}
				}



			},
		template:function()
			{
			/*`

			<uib-pagination ng-show="tbody.length>0" total-items="bigTotalItems" 
					ng-model="bigCurrentPage" 
					max-size="maxSize" 
					items-per-page="itPerPage"
					class="pagination-sm" 
					rotate="false" 
					boundary-links="true"> 
			</uib-pagination>



			`*/
			}.toString().split('/*`')[1].split('`*/')[0]

		}

	})

//directive to provide sorting (included icons,set click events), container tags with listenners
angular.module('app')
	.directive('sortable',function()
	{
	return {
		scope:true,
		link:function(scope,element,attrs)
			{
			var j = JSON.parse(attrs['setSort'])
			var num_row = j['num_col'];
			var type = j['type'];
			
			scope.num_row = num_row;	
			scope.type = type;	

			//set click event
			$(element[0]).parent().bind('click',function()
				{
				scope.sort_rows(parseInt(scope.num_row),scope.type);
				scope.$apply();   //ness because jquery click is not handled by angularjs


				});

			//set styles for TITLE
			$(element[0]).parent().css({'cursor':'pointer'});   //pointer
			$(element[0]).parent().css({'padding-right':'18px'});   //to place sort icons
			$(element[0]).parent().css({'position':'relative'});   //to positioned to right sort icons
			
			//set stiles for ICON
			$(element[0]).css({'position':'absolute'});   
			$(element[0]).css({'color':'gray'});  
			$(element[0]).css({'right':'2px'}); 
			$(element[0]).css({'top':'8px'}); //8px - it is padding for th in bootstrap table
	


			},
		template:function()
			{
			/*`

			<span ng-show="$parent.sort_dict[num_row]==false" style="color:rgb(223, 223, 223);" class="glyphicon glyphicon-sort"></span>
			

			<!--ICONS FOR TYPE INT-->
			<span ng-show="$parent.sort_dict[num_row]=='asc'&&type=='int'" class="glyphicon glyphicon-sort-by-attributes"></span>
			<span ng-show="$parent.sort_dict[num_row]=='desc'&&type=='int'" class="glyphicon glyphicon-sort-by-attributes-alt"></span>

			<!--ICONS FOR TYPE STR-->
			<span ng-show="$parent.sort_dict[num_row]=='asc'&&type=='str'" class="glyphicon glyphicon-sort-by-alphabet"></span>
			<span ng-show="$parent.sort_dict[num_row]=='desc'&&type=='str'" class="glyphicon glyphicon-sort-by-alphabet-alt"></span>



			`*/
			}.toString().split('/*`')[1].split('`*/')[0]

		}

	})



angular.module('app')
	.directive('numItems',function()
	{
	return {
		link:function(scope,element,attrs)
			{
			$(element[0]).css({'width':'130px'}); //set width
			},
		transclude:true,
		replace:true,
		template:function()
			{
			/*`

			<form class="form-horizontal" ng-show="tbody.length!=0&&tbody!=undefined">
				<div class="form-group">
					<label class="col-sm-4 control-label">Items</label>
					<div class="col-sm-8">
						<select class="form-control input-sm" type="number" ng-model="itPerPage">
							<option value=10>10</option>
							<option value=20>20</option>
							<option value=50>50</option>
							<option value=100>100</option>
						</select>
					</div>
				</div>
			</form>

			`*/
			}.toString().split('/*`')[1].split('`*/')[0]

		}


	})


angular.module('app')
	.directive('filterable',function()
	{
	return {
		scope:false,
		transclude:true,
		replace:true,
		link:function(scope,element,attrs)
			{
			
			scope.$parent.show_filters = true;  //it is requiering for filters not inside the table
			scope.show_filters = false;  //using for show-hide filters
	
			var para = JSON.parse(attrs['setOpt']);
			scope.$parent.filters = scope.$parent.filters===undefined?{}:scope.$parent.filters;
			scope.num_col = para['num_col'];
			scope.$parent.filters[scope.num_col] = '';

			//main filter watcher
			scope.$watch('$parent.filters',function(new_val,old_val)
				{
				if (scope.tsource.length==0)
					{
					return false;
					}
				scope.filter();
				},true);

			//core of filter
			scope.filter = function()
				{
				scope.t = scope.tsource.slice();  //reset all data, because the rest filters must be hanled
			
				var row_l = scope.t.length;
				var fil_l = Object.keys(scope.filters).length; //get kolvo filters, if no - tbody save

				var one_row = [];
				var smp_str = '';
				var fin_list = []; 
				for (var i=0;i<row_l;i=i+1)
					{
					one_row = scope.t[i];
					var flag = true;
					for (var each in scope.filters)
						{
						smp_str = one_row[each].toString();
						var filt = scope.filters[each];

						//scope.check_row - it is different checkers depends on filter condition
						if (scope.check_row(smp_str,filt)!=true)
							{
							flag = false;	
							}	
						}
					if (flag==true)
						{
						fin_list.push(one_row);
						}
					}
			
				//if filters = no and fin-list = no - take entire tsource
				if (fil_l==0&&fin_list.length==0)
					{
					fin_list = scope.t;
					}

				//end core filter, change tbody
				scope.$parent.tbody = fin_list;
				scope.resort();
				}
		
			//filtring conditions place HERE	
			scope.check_row = function(smp_str,filt)
				{
				//if filter is empty
				if (filt==''){return true};
	
				//exact in filter
				if (filt.search('=')==0)
					{
					if (filt.replace('=','')==smp_str)
						{
						return true;
						}
					else
						{
						return false;
						}
					}

				//exact not in filter
				if (filt.search('!=')==0)
					{
					if (filt.replace('!=','')==smp_str)
						{
						return false;
						}
					else
						{
						return true;
						}
					}


				//lt || gt filter
				if (filt.search('<')==0)
					{
					var a = parseFloat(filt.replace('<',''));
					var b = parseFloat(smp_str);

					return a>b?true:false;
					}

				//lt || gt filter
				if (filt.search('>')==0)
					{
					var a = parseFloat(filt.replace('>',''));
					var b = parseFloat(smp_str);

					return a<b?true:false;
					}


				//fuzzy filter
				if (smp_str.search(filt)>-1)
					{
					return true;
					}
				else
					{
					return false;
					}

				}
			
			//resort after filtring
			scope.resort = function()
				{
				loop1:
				for (var each in scope.sort_dict)
					{
					if (scope.sort_dict[each]!=false)
						{
						scope.sort_rows(each,scope.sort_dict[each]);
						break loop1;	
						}
					}

				}
	

			},
		template:function()
			{
			/*`
			<input id="{{num_col}}" ng-show="$parent.show_filters" class="form-control input-sm" 
				ng-click="$event.stopPropagation()"
				ng-model="$parent.filters[num_col]"				
				ng-model-options="{debounce:400}"
				placeholder="=,!=,><"
				data-toggle="tooltip"
				data-placement="right"
				title="Default behavior - 'in'"
				>

			`*/
			}.toString().split('/*`')[1].split('`*/')[0]



		}


	})



angular.module('app')
	.directive('stat',function()
	{
	return {
		transclude:true,
		replace:true,
		template:function()
			{
			/*`
			<span ng-show="tbody.length!=0&&tbody!=undefined" ><small><em>Selected <strong>{{tbody.length}}</strong> rows from <strong>{{tsource.length}}</strong></em></small></span>	

			`*/

			}.toString().split('/*`')[1].split('`*/')[0]



		}


	})




angular.module('app')
	.directive('toggleFilter',function()
	{
	return {
		scope:false,
		transclude:true,
		replace:true,
		link:function(scope)
			{
			scope.show_filters = false;
			},
		template:function()
			{
			/*`
			<div ng-show="tbody.length>0">		
				<button ng-show="!show_filters" ng-click="show_filters=true" class="btn btn-link">Show filters</button>
				<button ng-show="show_filters" ng-click="show_filters=false" class="btn btn-link">Hide filters</button>
			</div>
			`*/
			}.toString().split('/*`')[1].split('`*/')[0]


		}

	})



angular.module('app')
	.directive('add',function(backend)
		{
		return {
			link: function(scope,element,attrs)
				{
				scope.add_item = function(obj)
					{
					var new_obj = obj.slice(obj);
					backend.add_to_basket(new_obj);	

					}

				scope.remove_item = function(idx)
					{
					backend.remove_item_from_basket(idx)

					}
				scope.remove_entire = function(idx)
					{
					backend.remove_entire_from_basket(idx)

					}


				}


		}

		})


