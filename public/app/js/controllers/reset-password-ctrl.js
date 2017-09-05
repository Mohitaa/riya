/**
 * Created by sanjay on 3/25/15.
 */
App.controller('RestPasswordController', function ($scope, $http,$state, $cookies,$location ,$routeParams, $cookieStore, $stateParams,MY_CONSTANT,responseCode) {
    //initially set those objects to null to avoid undefined error
    // place the message if something goes wrong
    $scope.resetPass = {};
    $scope.text = "";
    $scope.show_reset=0;
    $scope.show_err=0;
    $scope.errorMsg='';
    $scope.successMsg='';
    var email = $stateParams.email;
    var user = $stateParams.user;
    var token = $stateParams.token;
    console.log(token)
    // email = email.replace(' ', '+');
    //=================================================
    //                  VERIFY TOKEN
    //=================================================
 $scope.resetPassword = function () {
        $scope.errorMsg = '';
        if($scope.password != $scope.confirmpass){
            $scope.errorMsg = "Both Passwords do not match.";

            setTimeout(function () {
                $scope.errorMsg = "";
                $scope.$apply();
            }, 1000);
        }
        else{
            console.log('userType', user);
            $http({
                url: MY_CONSTANT.url + '/api/'+user+'/resetPassword',
                method: "PUT",
                data:{
                    "email":email,
                    "passwordResetToken": token,
                    "newPassword": $scope.password
                                }
            })
                .success(function (data) {
                    console.log(data)

                   if(data.status == responseCode.SUCCESS) {
                        $scope.successMsg = "Password reset successfully.";
                        $cookieStore.put('rememberEmail', email);
                        $scope.$apply();
                        setTimeout(function () {
                            $scope.successMsg = "";
                            $state.go('page.login');
                            
                        }, 3000);
                    }
                    else {
                        $scope.errorMsg = data.output.payload.message;
                       
                        setTimeout(function () {
                            $scope.errorMsg = "";
                             $state.go('page.login');
                            $scope.$apply();
                        }, 3000);
                    }

                });
        }

    };





});

