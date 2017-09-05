
App.controller('addPromoController', function ($scope, $http, $cookies, $cookieStore, MY_CONSTANT, $window,ngDialog,$state) {

    'use strict';
    $scope.choice = '';
    $scope.min_date = new Date();
    $scope.show = 0;
    /**======================================================================================
     * ============= Only One Datepicker will display at a time =============
     ========================================================================================*/

    jQuery('#start_date').datetimepicker();
    jQuery('#end_date').datetimepicker();
    
    
    //$scope.datepicker = {
    //    dt: false,
    //    dt2: false
    //};
    //$scope.openDt1 = function ($event) {
    //    $event.preventDefault();
    //    $event.stopPropagation();
    //
    //    $scope.datepicker.dt2 = false;
    //    $scope.datepicker.dt1 = true;
    //};
    //
    //$scope.openDt2 = function ($event) {
    //    $event.preventDefault();
    //    $event.stopPropagation();
    //
    //    $scope.datepicker.dt1 = false;
    //    $scope.datepicker.dt2 = true;
    //};
   
    /**======================================================================================
     * ============= Function to Add Promo Code Call =============
     ========================================================================================*/
    
    $scope.status = function (val) {
        $scope.show = val;
    };
    
    $scope.addPromo = function (add) {
        $scope.loc = {};
        $scope.successMsg = '';
        $scope.errorMsg = '';
    
        var startDate = moment(add.startTime).format('YYYY-MM-DD HH:mm');
        var endDate = moment(add.endTime).format('YYYY-MM-DD HH:mm');
        var result = (moment(endDate).isAfter(startDate));
    
        if(add.checkbox==true || add.checkbox==1)
        {
            $scope.isChecked=true;
        }
        else
        {
            $scope.isChecked=false;
        }
       
        /**======================================================================================
         * ============= Validations On datePicker =============
         ========================================================================================*/
       
        var startTime = add.startTime;
        var endTime = add.end_date;
        var days = endTime - startTime;
        if (add.startTime == '' || add.startTime == undefined || add.startTime == null) {
            $scope.errorMsg = "Please select start date";
            setTimeout(function () {
                $scope.errorMsg = "";
                $scope.$apply();
            }, 3000);
            return false;
        }
        else if (add.endTime == '' || add.endTime == undefined || add.endTime == null) {
            $scope.errorMsg = "Please select end date";
            setTimeout(function () {
                $scope.errorMsg = "";
                $scope.$apply();
            }, 3000);
            return false;
        }
        else if (!result) {
            $scope.errorMsg = "Start date must be less than end date";
            setTimeout(function () {
                $scope.errorMsg = "";
                $scope.$apply();
            }, 3000);
            return false;
        }
        else {
            startTime = $("#start_date").val();
            endTime = $("#end_date").val();
        }
        $scope.y ={};
        $scope.y.startDate = '';
        $scope.y.endDate = '';
    
        $scope.y.startDate=new Date(startTime);
        $scope.y.endDate =new Date(endTime);
    
    
        if(add.discount==0)
        {
            $scope.errorMsg = "Discount cannot be 0";
            setTimeout(function () {
                $scope.errorMsg = "";
                $scope.$apply();
            }, 3000);
            return false;
        }
    
        $http({
            url: MY_CONSTANT.url + '/api/admin/promo',
            method: "POST",
            headers: {
                'authorization': $cookieStore.get('obj').accesstoken
            },
            data:
            {
                "name": add.name,
                "valueType": add.valueType,
                "value": add.maxDiscountAmt,
                "globalUsageLimit": add.frequency_per_user,
                "expiryDate": moment($scope.y.endDate).format('YYYY-MM-DD'),
                "startDate": moment($scope.y.startDate).format('YYYY-MM-DD'),
                "description":add.description
            }
        })
            .success(function (response, status) {
                if(response.status && response.status==200)
                $state.go('app.promo');
                else{
                    $scope.errorMsg = response.output.payload.message;
                    console.log($scope.errorMsg);
                        setTimeout(function () {
                            $scope.errorMsg = "";
                            $scope.$apply();
                        }, 3000);

                }
            })
            .error(function (error) {
                console.log(error);
                        $scope.errorMsg = error.message;
                        console.log($scope.errorMsg);
                        setTimeout(function () {
                            $scope.errorMsg = "";
                            $scope.$apply();
                        }, 3000);
                if(error.statusCode== 401)
                {
                    $state.go('page.login');
                }
            });
    };
});