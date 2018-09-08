(function() {
  var app = angular.module('myApp', ['ui.router']);
  app.factory('AuthenticationService',
    ['$rootScope', '$timeout',
      function ($rootScope, $timeout) {
        var service = {};

        service.SetCredentials = function (username, password, remember) {
          //var authdata = btoa(username + ':' + password);

          $rootScope.globals = {
            currentUser: {
              username: username,
              password: password
            }
          };

          console.log($rootScope.globals);
          if(remember)
            localStorage.setItem("globals",JSON.stringify($rootScope.globals));
          else
            sessionStorage.setItem("globals", JSON.stringify($rootScope.globals));
        };

        service.ClearCredentials = function () {
          $rootScope.globals = {};
          localStorage.removeItem('globals');
          sessionStorage.removeItem('globals');
        };

        return service;
      }])
    app.run(function($rootScope, $location, $state, LoginService) {
      $rootScope.$on('$stateChangeStart',
        function(event, toState, toParams, fromState, fromParams){
            console.log('Changed state to: ' + toState);
        });
        if (localStorage.globals) {
          var globals = JSON.parse(localStorage.globals);
          var currentUser = globals.currentUser;

          LoginService.login(currentUser.username, currentUser.password);
        } else if (sessionStorage.globals) {
          var globals = JSON.parse(sessionStorage.globals);
          var currentUser = globals.currentUser;

          LoginService.login(currentUser.username, currentUser.password);
        }

        if(!LoginService.isAuthenticated()) {
          $state.transitionTo('login');
        }
    });

  app.config(['$stateProvider', '$urlRouterProvider', function($stateProvider, $urlRouterProvider) {
    $urlRouterProvider.otherwise('/home');
    
    $stateProvider
      .state('login', {
        url : '/login',
        templateUrl : 'login.html',
        controller : 'LoginController'
      })
      .state('home', {
        url : '/home',
        templateUrl : 'home.html',
        controller : 'HomeController'
      });
  }]);

  app.controller('LoginController', function ($scope, $rootScope, $stateParams, $state, LoginService, AuthenticationService ) {
    AuthenticationService.ClearCredentials();

    $rootScope.title = "AngularJS Login Sample";

    //Pagination
  //  $scope.currentPage=0;
	//  $scope.pageSize=2;
  //   app.filter('startFrom', function () {
  //     return function (input, start) {
  //       start = +start; //parse to int
  //       return input.slice(start);
  //     }
  //   });

    $scope.formSubmit = function() {
      if(LoginService.login($scope.username, $scope.password, $scope.remember)) {
        $scope.error = '';
        $scope.username = '';
        $scope.password = '';
        $state.transitionTo('home');
      } else {
        $scope.error = "Incorrect username or password !";
      }   
    };
    
  });
  app.controller('HomeController', function($scope, $rootScope, $http) {
    $rootScope.title = "AngularJS Login Sample";
    $http.get("http://dummy.restapiexample.com/api/v1/employees")
      .then(function (response) {
        $scope.employeeList =response.data;
      });
  });
  
  app.factory('LoginService', ['AuthenticationService', function (AuthenticationService) {
    var admin = 'admin';
    var pass = 'password';
    var isAuthenticated = false;
    return {
      login : function(username, password, remember) {
        console.log("ritesh remeber",remember)
        isAuthenticated = username === admin && password === pass;
        if(true){
          AuthenticationService.SetCredentials(username, password, remember);
        }
        return isAuthenticated;
      },
      isAuthenticated : function() {
        return isAuthenticated;
      }
    };
    
  }]);

})();
