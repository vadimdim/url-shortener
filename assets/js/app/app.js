'use strict';

angular.module('urlShortn.controllers',[]);

var urlShortnConfig = ['$stateProvider','$locationProvider','$urlRouterProvider','cfpLoadingBarProvider','$httpProvider', function($stateProvider,$locationProvider,$urlRouterProvider,cfpLoadingBarProvider,$httpProvider){
    $locationProvider.html5Mode(true);
    $urlRouterProvider.otherwise('/');
    cfpLoadingBarProvider.includeSpinner = true;

    $stateProvider.state("home", {

        url: '/',
        views: {
            "section": {
                controller: "mainController",
                templateUrl: 'views/index.html'
            }
        }

    });
    /*$stateProvider.state("redirect", {

        url: '/:shortUrl',
        views: {
            "section": {
                controller: "mainController",
                templateUrl: 'views/redirect.html'
            }
        }

    });*/
}];

var app = angular.module('urlShortn', [
    'urlShortn.controllers',
    'ui.router',
    'angular-loading-bar',
    'ng',
    'ngAnimate',
    'ngSanitize',
    'ngRoute'
]).config(urlShortnConfig);

app.run();