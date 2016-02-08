angular
    .module('app',['ui.bootstrap','ui.router'])
    .service('backend',backend)
    .config(app_config)
    .controller('StoreController',StoreController)
    .controller('BasketController',BasketController)
    .controller('MainController',MainController)



function app_config($stateProvider, $urlRouterProvider)
    {
    $urlRouterProvider.otherwise('/store');


    $stateProvider
        .state('store',
            {
            templateUrl:'./static/views/store.html',
            controller:'StoreController',
            url:'/store'
            })
        .state('basket',
            {
            templateUrl:'./static/views/basket.html',
            controller:'BasketController',
            url:'/basket'
            })

    }

