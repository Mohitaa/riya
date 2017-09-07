// To run this code, edit file
// index.html or index.jade and change
// html data-ng-app attribute from
// angle to myAppName
// -----------------------------------

var App = angular.module('AppName', ['angle', 'uiGmapgoogle-maps', 'ckeditor']);

App.config(['uiGmapGoogleMapApiProvider', function (GoogleMapApi) {
    GoogleMapApi.configure({
//    key: 'your api key',
        v: '3.17',
        libraries: 'weather,geometry,visualization'
    });
}]);


App.run(["$log", function ($log) {

    $log.log('I\'m a line from custom.js');

}]);

App.constant("MY_CONSTANT", {
    "url": "http://localhost:3001" //live
    // "url": "http://35.161.2.107:3002" //test
    // "url": "http://35.161.2.107:3001" //dev
});
// App.constant("MY_CONSTANT1", {
//     "url": "http://maps.googleapis.com/maps/api/geocode/json"
// });
App.constant("responseCode", {
    "SUCCESS": 200
});
App.config(['$stateProvider', '$locationProvider', '$urlRouterProvider', 'RouteHelpersProvider',
    function ($stateProvider, $locationProvider, $urlRouterProvider, helper) {
        'use strict';

        // Set the following to true to enable the HTML5 Mode
        // You may have to set <base> tag in index and a routing configuration in your server
        $locationProvider.html5Mode(false);

        // default route
       /* $urlRouterProvider.otherwise('/app/rewardBrands');*/
        $urlRouterProvider.otherwise('page/login');
        $urlRouterProvider.when('/app/trucker','/app/trucker/manageTrucker');
        $urlRouterProvider.when('/app/fleetOwner','/app/fleetOwner/manageFleetOwner');
        //
        // Application Routes
        // -----------------------------------
        $stateProvider
            //
            // Single Page Routes
            // -----------------------------------
            .state('page', {
                url: '/page',
                templateUrl: 'app/pages/page.html',
                resolve: helper.resolveFor('modernizr', 'icons', 'parsley'),
                controller: ["$rootScope", function ($rootScope) {
                    $rootScope.app.layout.isBoxed = false;
                }]
            })
            .state('page.login', {
                url: '/login',
                title: "Login",
                templateUrl: 'app/pages/login.html',
                resolve: helper.resolveFor('ngDialog')
            })
            .state('page.register', {
                url: '/register',
                title: "Register",
                templateUrl: 'app/pages/register.html'
            })
            .state('page.recover', {
                url: '/recover',
                title: "Recover",
                templateUrl: 'app/pages/recover.html'
            })
            .state('page.terms', {
                url: '/terms',
                title: "Terms & Conditions",
                templateUrl: 'app/pages/terms.html'
            })
            .state('page.404', {
                url: '/404',
                title: "Not Found",
                templateUrl: 'app/pages/404.html'
            })
            .state('page.resetPassword', {
                url: '/resetPassword/{token}/{email}/{user}',
                title: "Reset Password",
                templateUrl: 'app/pages/resetPassword.html'
            })

            //App routes
            .state('app', {
                url: '/app',
                abstract: true,
                templateUrl: helper.basepath('app.html'),
                controller: 'AppController',
                resolve: helper.resolveFor('modernizr', 'icons', 'screenfull','ngDialog')
            })
            .state('app.home', {
                url: '/home',
                title: 'Home',
                templateUrl: helper.basepath('home.html'),
                resolve: helper.resolveFor('datatables', 'datatables-pugins', 'ngDialog','parsley')
            })
            .state('app.consultant', {
                url: '/consultant',
                title: 'Consultant info',
                templateUrl: helper.basepath('consultant.html'),
                resolve: helper.resolveFor('datatables', 'datatables-pugins', 'ngDialog','parsley')
            })
            .state('app.addplan', {
                url: '/add_plan',
                title: 'Add Plan',
                templateUrl: helper.basepath('addPlan.html'),
                resolve: helper.resolveFor('datatables', 'datatables-pugins', 'ngDialog','parsley')
            })
            .state('app.listplan', {
                url: '/listplan',
                templateUrl: helper.basepath('listPlan.html'),
                resolve: helper.resolveFor('datatables', 'datatables-pugins', 'ngDialog','whirl','parsley')
            })
            .state('app.registerConsultant', {
                url: '/registerConsultant',
                title: 'Register Consultant',
                templateUrl: helper.basepath('registerConsultant.html'),
                resolve: helper.resolveFor('parsley','datatables', 'datatables-pugins')
            })
            .state('app.listconsultant', {
                url: '/listconsultant',
                title: 'List Consultant',
                templateUrl: helper.basepath('listConsultant.html'),
                resolve: helper.resolveFor('datatables', 'datatables-pugins', 'ngDialog','whirl','parsley')
            })
            .state('app.viewConsultantDetails', {
                url: '/ViewConsultant/:consultant_id',
                title: 'Consultant Profile',
                templateUrl: helper.basepath('consultantProfile.html'),
                resolve: helper.resolveFor('datatables', 'datatables-pugins', 'ngDialog','whirl','parsley')
            })
            .state('app.editConsultant', {
                url: '/editConsultant/:consultant_id',
                templateUrl: helper.basepath('editConsultant.html'),
                resolve: helper.resolveFor('datatables', 'datatables-pugins', 'ngDialog','whirl','parsley')
            })
            .state('app.user', {
                url: '/user',
                title: 'Owner',
                templateUrl: helper.basepath('viewuser.html'),
                resolve: helper.resolveFor('datatables', 'datatables-pugins', 'ngDialog','parsley')
            })
            .state('app.promo', {
                url: '/promo',
                title: 'Active Promo Code',
                templateUrl: helper.basepath('promo.html'),
                // resolve: helper.resolveFor('parsley')
            })
            .state('app.addpromo', {
                url: '/add_promo',
                title: 'Add Promo Code',
                templateUrl: helper.basepath('addPromo.html'),
                resolve: helper.resolveFor('datatables', 'datatables-pugins', 'ngDialog','parsley')
            })
            .state('app.listuser', {
                url: '/listuser',
                title: 'List User',
                templateUrl: helper.basepath('listUser.html'),
                resolve: helper.resolveFor('datatables', 'datatables-pugins', 'ngDialog','parsley')
            })
            .state('app.viewUserDetails', {
                url: '/viewUserDetails/:user_id',
                title: 'View User Details',
                templateUrl: helper.basepath('viewUser.html'),
                resolve: helper.resolveFor('datatables', 'datatables-pugins', 'ngDialog','parsley')
            })
            .state('app.editUser', {
                url: '/editUser:user_id',
                title: 'Edit User',
                templateUrl: helper.basepath('editUser.html'),
                resolve: helper.resolveFor('datatables', 'datatables-pugins', 'ngDialog','parsley')
            })
            .state('app.chat', {
                url: '/chat',
                title: 'Chat',
                templateUrl: helper.basepath('chat.html'),
                resolve: helper.resolveFor('modernizr', 'icons', 'screenfull','ngDialog')
            })
            .state('app.bookings.upcoming', {
                url: '/upcoming',
                title: 'Bookings',
                templateUrl: helper.basepath('bookingsUpcoming.html'),
                resolve: helper.resolveFor('datatables', 'datatables-pugins', 'ngDialog','parsley')
            })
            .state('app.bookings.past', {
                url: '/past',
                title: 'Bookings',
                templateUrl: helper.basepath('bookingsPast.html'),
                resolve: helper.resolveFor('datatables', 'datatables-pugins', 'ngDialog','parsley')
            })
            .state('app.bookings.ongoing', {
                url: '/ongoing',
                title: 'Bookings',
                templateUrl: helper.basepath('bookingsOngoing.html'),
                resolve: helper.resolveFor('datatables', 'datatables-pugins', 'ngDialog','parsley')
            })
              .state('app.reviews', {
                url: '/reviews',
                title: 'Reviews',
                templateUrl: helper.basepath('reviews.html'),
                resolve: helper.resolveFor('parsley','datatables', 'datatables-pugins')
            })
    }]);

App.factory('convertdatetime', function () {
    return {

        convertDate: function (DateTime) {
            var _utc = new Date(DateTime);
            var mnth_var_date = parseInt(_utc.getMonth()) + 1;
            var mnth_var = mnth_var_date.toString();
            if (mnth_var.length == 1) {
                var month = "0" + mnth_var;
            } else {
                month = mnth_var;
            }
            if (_utc.getDate().toString().length == 1) {
                var day = "0" + (parseInt(_utc.getDate()));
            } else {
                day = parseInt(_utc.getDate());
            }
            var _utc = _utc.getFullYear() + "-" + month + "-" + day;
            return _utc;
        },

        convertToLocal: function (data) {
            var date = ConvertUTCTimeToLocalTime(data);
            var date_time = new Date((date + 'UTC').replace(/-/g, "/"));
            var date_converted = date_time.toString().replace(/GMT.*/g, "");
            return date_converted;

            function ConvertUTCTimeToLocalTime(UTCDateString) {
                var convertdLocalTime = new Date(UTCDateString);

                var hourOffset = convertdLocalTime.getTimezoneOffset() / 60;

                convertdLocalTime.setHours(convertdLocalTime.getHours() + hourOffset);

                return convertdLocalTime;
            }
        }

    };
});
App.directive('clock', ['dateFilter', '$timeout', function(dateFilter, $timeout){
    return {
        restrict: 'E',
        scope: {
            format: '@'
        },
        link: function(scope, element, attrs){
            var updateTime = function(){
                var now = Date.now();

                element.html(dateFilter(now, scope.format));
                $timeout(updateTime, now % 1000);
            };

            updateTime();
        }
    };
}]);
App.directive('numbersOnly', function () {
    return {
        require: 'ngModel',
        link: function (scope, element, attr, ngModelCtrl) {
            function fromUser(text) {
                if (text) {
                    var transformedInput = text.replace(/[^0-9]/g, '');

                    if (transformedInput !== text) {
                        ngModelCtrl.$setViewValue(transformedInput);
                        ngModelCtrl.$render();
                    }
                    return transformedInput;
                }
                return undefined;
            }
            ngModelCtrl.$parsers.push(fromUser);
        }
    };
});
App.directive('googleplace', function() {
    return {
        require: 'ngModel',
        link: function(scope, element, attrs, model) {
            var options = {
                types: [],
                componentRestrictions: {}
            };
            scope.gPlace = new google.maps.places.Autocomplete(element[0], options);

            google.maps.event.addListener(scope.gPlace, 'place_changed', function() {
                scope.$apply(function() {
                    model.$setViewValue(element.val());
                });
            });
        }
    };
});
