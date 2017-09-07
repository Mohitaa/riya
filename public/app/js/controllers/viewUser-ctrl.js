
App.controller('viewUserController', function ($scope, $http, $cookies,$cookieStore,$stateParams, MY_CONSTANT,$state,$rootScope,$modal,$timeout,ngDialog) {
    $scope.approveuser = {};
    $scope.minDate = new Date();
    $scope.user_image_sent = 0;
    $scope.insurance_image_sent = 0;
    $scope.user_image_flag = 0;
    $scope.showloader = true;
console.log($stateParams);
    /*--------------------------------------------------------------------------
     * ---------------- get driver's data by using driver id -------------------
     --------------------------------------------------------------------------*/
    $.post(MY_CONSTANT.url + '/user_detail', {
            access_token: $cookieStore.get('obj').accesstoken,
            user_id: $stateParams.user_id
        },
        function (data) {
            
            console.log('user details', data);
            $scope.showloader = false;
            var unapprovedlist = data.data[1][0];
            console.log(unapprovedlist)
            
            $scope.approveuser.user_name = unapprovedlist.name;
            $scope.approveuser.user_email = unapprovedlist.email;
            $scope.approveuser.phn_no = unapprovedlist.phoneNo;
            $scope.approveuser.address = unapprovedlist.address;
            $scope.approveuser.age = unapprovedlist.pinCode;
            $scope.approveuser.alcohol = unapprovedlist.userType;
            $scope.approveuser.consultant = unapprovedlist.consultantId.name;
            $scope.approveuser.ids = unapprovedlist.consultantId.AdminNumericId;
            $scope.approveuser.typeOfGender = unapprovedlist.sex;
            $scope.user_image = unapprovedlist.profilePicURL.original;
 
            $scope.$apply();

            //handle image
            if ($scope.user_image == null || $scope.user_image == '' || $scope.user_image == undefined) {
                $scope.user_image = "app/img/noimg.png"
            }
            if ($scope.insurance_image == null || $scope.insurance_image == '' || $scope.insurance_image == undefined) {
                $scope.insurance_image = "app/img/noimg.png"
            }
            else if (data.status == responseCode.INVALID_ACCESS_TOKEN) {
                $state.go('page.login');
            }

        });
    /*===========================================================================
     *============================getting img file================================
     *===========================================================================*/

    $scope.file_to_upload = function (files, id) {
        if (id == 0) { //user PROFILE IMAGE
            $scope.user_image = files[0];
            $scope.user_image_sent = 1;
            $scope.user_image_flag = 1;

            $scope.user_image_name = files[0].name;
            var file = files[0];
            var imageType = /image.*/;
            if (!file.type.match(imageType)) {

            }
            var img = document.getElementById("user_image");
            img.file = file;
            var reader = new FileReader();
            reader.onload = (function (aImg) {
                return function (e) {
                    aImg.src = e.target.result;
                };
            })(img);
            reader.readAsDataURL(file);
        }
        if (id == 1) { //user PROFILE IMAGE
            $scope.insurance_image = files[0];
            $scope.insurance_image_sent = 1;
            $scope.insurance_image_flag = 1;

            $scope.cinsurance_image_name = files[0].name;
            var file = files[0];
            var imageType = /image.*/;
            if (!file.type.match(imageType)) {

            }
            var img = document.getElementById("insurance_image");
            img.file = file;
            var reader = new FileReader();
            reader.onload = (function (aImg) {
                return function (e) {
                    aImg.src = e.target.result;
                };
            })(img);
            reader.readAsDataURL(file);
        }
        $scope.$apply();
    };

    //    ===============================view and download images======================
    $scope.openIframe = function (data, val) {
        if (val == 1) {
            $scope.image_large = data;
            $scope.Title = 'View user Image';
            $scope.showServiceImage = true;
            $scope.showInsuarnceImage1 = false;
        }
        if (val == 2) {
            $scope.insurance_large = data;
            $scope.Title = 'View Health Insurance Image';
            $scope.showServiceImage = false;
            $scope.showInsuarnceImage1 = true;
        }
        $scope.pdfLoader = true;
        $timeout(function () {
            $scope.pdfLoader = false;
        }, 2000);
        if (data == 'app/img/noimg.png') {

        }
        else {
            $timeout(function () {
                ngDialog.open({
                    template: 'pdf_large_dialog',
                    className: 'ngdialog-theme-default',
                    showClose: false,
                    scope: $scope,
                    closeByDocument: false,
                    closeByEscape: false
                });
            }, 500);

        }

    };


    /*--------------------------------------------------------------------------
     * ---------------- function to edit user -----------------------------
     --------------------------------------------------------------------------*/
    $scope.approveuserFunction = function (data) {
        console.log('inside the function', data);
        if (data == "" || data == undefined || data == null || data.user_name == "" || data.user_name == undefined || data.user_name == null) {
            $scope.errorMsg = "Please enter user name.";
            $scope.TimeOutError();
            return false;
        }
        else if (data.user_email == "" || data.user_email == undefined || data.user_email == null) {
            $scope.errorMsg = "Please enter user email.";
            $scope.TimeOutError();
            return false;
        }
        else if (data.phn_no == "" || data.phn_no == undefined || data.phn_no == null) {
            $scope.errorMsg = "Please enter user phone number.";
            $scope.TimeOutError();
            return false;
        }
        else if (
            $scope.user_image == 'app/img/noimg.png' || $scope.user_image == 'http://taximust.s3.amazonaws.com/user_profile/user.png') {
            $scope.errorMsg = "Please upload user image.";
            $scope.TimeOutError();
            return false;
        }
        else if ($scope.showInsuarnceImage==true && $scope.insurance_image == 'app/img/noimg.png' || $scope.insurance_image == 'http://taximust.s3.amazonaws.com/user_profile/user.png') {
            $scope.errorMsg = "Please upload Health Insurance Image.";
            $scope.TimeOutError();
            return false;
        }
            // else if()

        else {
            $scope.showloader=true;
            var formData = new FormData();

            if($scope.showInsuarnceImage==true || $scope.insurance_image_sent==1 )
            {
                formData.append('health_insurance', $scope.insurance_image);
            }

            formData.append('access_token', $cookieStore.get('obj').accesstoken);
            formData.append('user_name', data.user_name);
            formData.append('image_flag', $scope.user_image_flag);
            formData.append('image', $scope.user_image);
            formData.append('user_id', $stateParams.user_id);
            formData.append('age', data.age);
            formData.append('sex', data.typeOfGender);
            formData.append('height', data.height);
            formData.append('weight', data.weight);
            formData.append('blood_group', data.blood);
            formData.append('allergies', data.Alergies);
            formData.append('medical_conditions', data.medical_condition);
            formData.append('smoker', data.smoker);
            formData.append('alcohol', data.alcohol);
            formData.append('occupation', data.Occupation);
            formData.append('address', data.address);
            formData.append('insurance', data.insurance);

            $timeout(function()

            {
                $scope.showloader=false;
                $.ajax({
                type: 'POST',
                url: MY_CONSTANT.url + '/edit_user_profile',
                dataType: "json",
                data: formData,
                async: false,
                processData: false,
                contentType: false,
                success: function (data) {
                    $scope.displaymsg = "Consultant Information Updated Successfully";
                    ngDialog.open({
                        template: 'display_msg_modalDialog',
                        className: 'ngdialog-theme-default',
                        showClose: false,
                        scope: $scope,
                        closeByEscape: false,
                        closeByDocument: false
                    });

                }
            });

            })


        }
    };

    /*--------------------------------------------------------------------------
     * --------- funtion to refresh page ---------------------------------------
     --------------------------------------------------------------------------*/
    $scope.refreshPage = function () {
        $state.go('app.listconsultant');
        ngDialog.close({
            template: 'display_msg_modalDialog',
            className: 'ngdialog-theme-default',
            scope: $scope,
            closeByEscape: false,
            closeByDocument: false
        });

    };

    /*--------------------------------------------------------------------------
     * ---------------- Timeout function -----------------------------------
     --------------------------------------------------------------------------*/
    $scope.TimeOutError = function () {
        setTimeout(function () {
            $scope.errorMsg = "";
            $scope.$apply();
        }, 3000);

    }
});