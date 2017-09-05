
App.controller('LoginController', function ($scope, $http, $cookies,$cookieStore, MY_CONSTANT,$state,$rootScope,$modal,$timeout) {
    'use strict';
    $scope.account = {};
    $scope.authMsg = '';
    $scope.account.remember=false;
    $scope.error="";
    $scope.successMsg="";



    if($cookieStore.get("rememberEmail")){
        $scope.account.email = $cookieStore.get("rememberEmail");
        $scope.account.remember=true;

    }

    /**======================================================================================
     * ============= Function to Login Admin =============
     ========================================================================================*/
   
    $scope.loginAdmin = function ()
    {
        $scope.authMsg = '';
        if($scope.account.password==undefined || $scope.account.password=="")
        {
            $scope.authMsg = "Password length should be atleast 5 characters long";
            setTimeout(function () {
                $scope.authMsg = "";
                $scope.$apply();
            }, 3000);
        }
        else
        {
            $http({

                // url: MY_CONSTANT.url + '/api/v1/admin/loginThroughCredentials',
                // method: "PUT",
                url: MY_CONSTANT.url + '/api/admin/login',
                method: "POST",
                data:
                {
                    email: $scope.account.email,
                    password: $scope.account.password
                }
            })
                .then(function(response) {
                    console.log(response)
                    var data=response.data.data;
                    if(data)
                        {     
                               if ( $scope.account.remember==true) {
                            $cookieStore.put("rememberEmail",$scope.account.email , { expires: 365 });

                        }
                       else{
                            $cookieStore.remove('rememberEmail');
                            $scope.account.email= '';
                            $scope.account.password= '';
                        }

                        var someSessionObj = {'accesstoken': data.access_token,"type":data.type,"username":data.username};
                        $cookieStore.put('obj', someSessionObj);
                        $state.go('app.home');
                    }
                    else
                    {
                        console.log(response.data.output.payload.message)
                     $scope.authMsg = response.data.output.payload.message;
                        setTimeout(function () {
                            $scope.authMsg = "";
                            $scope.$apply();
                        }, 3000);

                    }
                },
                    function(response) { // optional
                        console.log(response+"error");
                        // failed
                        $scope.authMsg = response.data.output.payload.message;
                        setTimeout(function () {
                            $scope.authMsg = "";
                            $scope.$apply();
                        }, 5000);
                    });
        }

    };

    $scope.recover = function () {

        $http({
            url: MY_CONSTANT.url + '/api/admin/getResetPasswordToken',
            method: "GET",
            params: {
                email: $scope.account.email
            }
        })
            .success(function (data) {
                console.log(data);
                if(data.status==200 && data.status)
                {
                $scope.successMsg = "link for password reset has been send to your registered email ";
                $timeout(function()
                {
                    $scope.successMsg='';
                    $state.go('page.login');
                },8000)
            }
            else if(data.output.payload.statusCode==400){
                $scope.successMsg = data.output.payload.message +" email is not registered with detox";
                $timeout(function()
                {
                    $scope.successMsg='';
                    $state.go('page.login');
                },8000)
            }
            })
            .error(function (error) {
                $scope.errorMsg = error.message;
                $timeout(function()
                {
                    $scope.errorMsg='';
                },3000);

                if(error.statusCode== 401)
                {
                    $state.go('page.login');
                }
            });
    };

    $scope.openModal=function()
    {
        console.log("logout");
        $scope.modalInstance = $modal
            .open({
                templateUrl : 'app/views/dialog.html',
                scope: $scope
            });

        $scope.modalInstance.result.then(function(returnResult) {
        $scope.returnResult = returnResult;
        })
    };

    $scope.closeModal = function(){
        $scope.modalInstance.close();
    };

    /**======================================================================================
     * ============= Function to Logout Admin =============
     ========================================================================================*/
    $scope.logout = function () {
        $.ajax({
           method: "PUT",
           url: MY_CONSTANT.url+"/api/admin/logout",
           headers: {'authorization': $cookieStore.get('obj').accesstoken},
           success: function(data) {
               $cookieStore.remove('obj');
               $state.go('page.login');
           },
           error: function(data) {
               if(data.status== 401)
               {
                   $scope.modalInstance.close();
                   $state.go('page.login');
               }
               else
                   console.log(data);
           }});
    };

    // $scope.openModal2=function()
    // {
    //     $scope.pass={};
    //     ngDialog.openConfirm({
    //         template: 'modalDialogId1',
    //         className: 'ngdialog-theme-default',
    //         scope: $scope
    //     })
    // };

    // $scope.resetPassword=function(pass)
    // {
    //     if(pass.oldPassword==undefined)
    //     {
    //         $scope.authMsg="Please enter your old password";
    //         $timeout(function()
    //         {
    //             $scope.authMsg='';
    //         },2000)
    //     }
    //     else if(pass.newPassword==undefined)
    //     {
    //         $scope.authMsg="Please enter your new password";
    //         $timeout(function()
    //         {
    //             $scope.authMsg='';
    //         },2000)
    //     }
    //     else if(pass.confirmPassword==undefined)
    //     {
    //         $scope.authMsg="Please enter confirm password";
    //         $timeout(function()
    //         {
    //             $scope.authMsg='';
    //         },2000)
    //     }
    //     else if(pass.newPassword == pass.confirmPassword)
    //     {
    //         // $.ajax({
    //         //     method: "PUT",
    //         //     url: MY_CONSTANT.url+"/api/admin/getResetPasswordToken",
    //         //     headers: {'authorization': "bearer " + $cookieStore.get('obj').accesstoken},
    //         //     data:{
    //         //         "oldPassword":pass.oldPassword,
    //         //         "newPassword": pass.newPassword
    //         //     },
    //         //     success: function(data)
    //         //     {
    //         //         $scope.successMsg="Password successfully changed.";
    //         //         $scope.$apply();
    //         //         $timeout(function()
    //         //         {
    //         //             ngDialog.close();
    //         //             $cookieStore.remove('obj');
    //         //             $state.go('page.login');
    //         //         },3000)
    //         //     },
    //         //     error: function(data) {
    //         //         console.log(data.responseJSON.message);
    //         //         $scope.errorMsg=data.responseJSON.message;
    //         //         $scope.$apply();
    //         //         console.log($scope.errorMsg);
    //         //         $timeout(function()
    //         //         {
    //         //             $scope.errorMsg='';
    //         //         },2000)
    //         //
    //         //     }});
    //     }
    //     else
    //     {
    //         $scope.authMsg="Passwords do not match";
    //         $timeout(function()
    //         {
    //             $scope.authMsg='';
    //         },2000)
    //     }
    // }

});