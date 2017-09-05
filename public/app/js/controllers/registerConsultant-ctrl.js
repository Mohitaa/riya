/**
 * Created by cl-macmini-139 on 10/24/16.
 */
App.controller('addconsultantController', function ($scope, $http, $cookies, multipartForm,$cookieStore, MY_CONSTANT, $window,ngDialog,$state)  {

    $scope.successMsg = '';
    $scope.errorMsg   = '';
   $scope.user={};
    $scope.consultant={
        'name':'',
        'phone': '',
        'email': '',
        'password': '',
        'confirmPassword': '',
        'ConsultantType': '',
        'address': '',
        'profile': ''
    };
    /**======================================================================================
     * ============= Function to upload image script =============
     ========================================================================================*/
    $scope.file_to_upload = function (files) {
        $scope.user.profile = files[0];
        $scope.$apply();
        $scope.flag=1;
        var file = files[0];
        var imageType = /image.*/;
        if (!file.type.match(imageType)) {

        }
        console.log( $scope.user.profile)
        // var img = document.getElementById("profile_pic");
        // img.file = file;
        // var reader = new FileReader();
        // reader.onload = (function (aImg) {
        //     return function (e) {
        //         aImg.src = e.target.result;
        //     };
        // })(img);
        // reader.readAsDataURL(file);
    };
    
    /**======================================================================================
     * ============= Function to get Consultant Type =============
     ========================================================================================*/

        $scope.serviceList = [
            {"name":"dietitian"},
            {"name":"physiotherapist"},
            {"name":"psychotherapist"},
                        
        ]
 


    $scope.addconsultant = function (consultant) {
        console.log($scope.consultant);

        var UploadUrl=MY_CONSTANT.url + '/api/admin/add_consultant';
        multipartForm.post(UploadUrl,$cookieStore.get('obj').accesstoken,$scope.consultant)
        var testEmail = /^[A-Z0-9._%+-]+@([A-Z0-9-]+\.)+[A-Z]{2,4}$/i;
        var emailValue = consultant.email;
        var ConsultantType = [];
         console.log( $scope.user.profile.name+"post")
        ConsultantType.push(consultant.ConsultantType);
        var countryData = $("#phone").intlTelInput("getSelectedCountryData");
        var countryCode = countryData.dialCode;
        consultant.countryCode = '+' + countryCode;
        consultant.phone = $('#phone').val();
        if (!(testEmail.test(emailValue))) {
            console.log("email");
            $scope.loading=false;
            $("html, body").animate({scrollTop: 0});
            $scope.errorMsg = 'Please enter a valid email address.';
            setTimeout(function () {
                $scope.errorMsg = "";
                $scope.$apply();
            }, 1500);
            return false;
        }
        if (consultant.password != consultant.confirmPassword) {
            console.log("pass");
            $scope.loading=false;
             $("html, body").animate({scrollTop: 0});
            $scope.errorMsg = 'password and confirm password donot match';
           
            setTimeout(function () {
                $scope.errorMsg = "";
                $scope.$apply();
            }, 1500);
            return false;
        }
        else if(consultant.ConsultantType==null || consultant.ConsultantType==undefined || consultant.ConsultantType=="")
        {
            $scope.loading=false;
            $scope.errorMsg = 'Please select a role';
            console.log("role");
            $("html, body").animate({scrollTop: 0});
            
            setTimeout(function () {
                $scope.errorMsg = "";
                $scope.$apply();
            }, 3000);
            return false;
        }

    
        $http({
            method : "POST",
            url: MY_CONSTANT.url + '/api/admin/add_consultant',
            transformRequest:angular.identity ,
            headers: {
                'authorization': $cookieStore.get('obj').accesstoken,
                'Content-Type':undefined,'Process-Data':false
             },
            data: {
                'firstName':consultant.fname,
                'lastName':consultant.lname,
                'email':consultant.email,
                'password':consultant.password,
                'countryCode':consultant.countryCode,
                'phoneNo':consultant.phone,
                'ConsultantType':JSON.stringify(consultant.ConsultantType),
                'detail':consultant.description,
                'address':consultant.address,
                'city':consultant.city,
                'state':consultant.state,
                'pinCode':consultant.pinCode,
                'profilePic':$scope.user.profile,
                'company':consultant.company,
                'position': consultant.position,
                'fromdate':consultant.fromdate,
                'todate':consultant.todate,
                'duration':consultant.duration,
                'company1':consultant.company1,
                'position1': consultant.position1,
                'fromdate1':consultant.fromdate1,
                'todate1':consultant.todate1,
                'duration1':consultant.duration1,
                'company2':consultant.company2,
                'position2': consultant.position2,
                'fromdate2':consultant.fromdate2,
                'todate2':consultant.todate2,
                'duration2':consultant.duration2,
                'userType':1
            }
        })
            .success(function (response) {
                $("html, body").animate({scrollTop: 0});
                $scope.successMsg = "response.message";
                console.log("message",response);
                setTimeout(function () {
                    $scope.successMsg = "";
                    $state.go('app.registerConsultant');
                    $scope.$apply();
                }, 1500);
            })
            .error(function (error) {
                $scope.loading=false;
                $("html, body").animate({scrollTop: 0});
                if (error.statusCode == 401) {
                    $scope.errorMsg = "Session Expired. Please Login Again.";
                    setTimeout(function () {
                        $cookieStore.remove('obj');
                        $state.go('page.login');
                    }, 1500);
                }
                else {
                    $scope.errorMsg = error.message;
                    setTimeout(function () {
                        $scope.errorMsg = "";
                        $scope.$apply();
                    }, 1500);
                }
            });

    }
});

