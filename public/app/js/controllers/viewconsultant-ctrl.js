
App.controller('viewConsultant', function ($scope, $http, $cookies,$cookieStore,$stateParams, MY_CONSTANT,$state,$rootScope,$modal,$timeout,ngDialog) {
    $scope.approveconsultant = {};
    $scope.minDate = new Date();
    $scope.consultant_image_sent = 0;
    $scope.insurance_image_sent = 0;
    $scope.consultant_image_flag = 0;
    $scope.insurance_image_flag = 0;
    $scope.showloader = true;
console.log($stateParams);
    /*--------------------------------------------------------------------------
     * ---------------- get driver's data by using driver id -------------------
     --------------------------------------------------------------------------*/
    $.post(MY_CONSTANT.url + '/user_details', {
            access_token: $cookieStore.get('obj').accesstoken,
            user_id: $stateParams.consultant_id
        },
        function (data) {
            
            console.log('user details', data);
            $scope.showloader = false;
            var unapprovedlist = data.data[0];
            $scope.user=data.user;
            console.log("details",data.user)
            $scope.approveconsultant.user_name = unapprovedlist.name;
            $scope.approveconsultant.user_email = unapprovedlist.email;
            $scope.approveconsultant.phn_no = unapprovedlist.phoneNo;
            $scope.approveconsultant.address = unapprovedlist.address;
            $scope.approveconsultant.age = unapprovedlist.pinCode;
            $scope.approveconsultant.alcohol = unapprovedlist.ConsultantType;
            $scope.approveconsultant.Occupation = unapprovedlist.workExperience.companyName;
            $scope.approveconsultant.typeOfGender = unapprovedlist.sex;
            $scope.approveconsultant.user = data.user;
            $scope.consultant_image = unapprovedlist.profilePicURL.original;
            if(unapprovedlist.health_insurance)
            {
                if(unapprovedlist.health_insurance=='http://taximust.s3.amazonaws.com/user_profile/user.png')
                {
                    $scope.showInsuarnceImage=false;
                    $scope.approveconsultant.insurance = 'No';
                }
               else {
                    $scope.showInsuarnceImage=true;
                    $scope.insurance_image = unapprovedlist.health_insurance;
                    $scope.approveconsultant.insurance = 'Yes';
                }


            }
            else {
                $scope.showInsuarnceImage=false;
                $scope.approveconsultant.insurance = 'No';
            }

            $scope.$apply();

            //handle image
            if ($scope.consultant_image == null || $scope.consultant_image == '' || $scope.consultant_image == undefined) {
                $scope.consultant_image = "app/img/noimg.png"
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
        if (id == 0) { //consultant PROFILE IMAGE
            $scope.consultant_image = files[0];
            $scope.consultant_image_sent = 1;
            $scope.consultant_image_flag = 1;

            $scope.consultant_image_name = files[0].name;
            var file = files[0];
            var imageType = /image.*/;
            if (!file.type.match(imageType)) {

            }
            var img = document.getElementById("consultant_image");
            img.file = file;
            var reader = new FileReader();
            reader.onload = (function (aImg) {
                return function (e) {
                    aImg.src = e.target.result;
                };
            })(img);
            reader.readAsDataURL(file);
        }
        if (id == 1) { //consultant PROFILE IMAGE
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
            $scope.Title = 'View consultant Image';
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


    $scope.typeOfGender = [{id: 0, name: 'Male'}, {id: 1, name: 'Female'}, {id: 2, name: 'Others'}];
    $scope.smoker = [{id: 0, name: 'Yes'}, {id: 1, name: 'No'}];
    $scope.alcohol = [{id: 0, name: 'Yes'}, {id: 1, name: 'No'}];
    $scope.insurance = [{id: 0, name: 'Yes'}, {id: 1, name: 'No'}];
    $scope.blood = [{id: 0, name: 'O+'}, {id: 1, name: 'O-'}, {id: 2, name: 'A+'}, {id: 3, name: 'A-'}, {
        id: 4,
        name: 'B+'
    }, {id: 5, name: 'B-'}, {id: 6, name: 'AB+'}, {id: 2, name: 'AB-'}];
    $scope.Alergies = [{id: 0, name: 'Insect'}, {id: 1, name: 'Pet Eye'}, {id: 2, name: 'Allergic Rhintis'}, {
        id: 3,
        name: 'Latex'
    }, {id: 4, name: 'Mold'}];
    $scope.Occupation = [{id: 0, name: 'Private Services'}, {id: 1, name: 'Public Services'}, {
        id: 2,
        name: 'Unemployed'
    }, {id: 3, name: 'Self Employed'}];


    $scope.Health=function(val)
    {
        if(val=='Yes')
        {
            $scope.showInsuarnceImage=true;
        }
        else
        {
            $scope.showInsuarnceImage=false;
        }
    };


    /*--------------------------------------------------------------------------
     * ---------------- function to edit consultant -----------------------------
     --------------------------------------------------------------------------*/
    $scope.approveconsultantFunction = function (data) {
        console.log('inside the function', data);
        if (data == "" || data == undefined || data == null || data.user_name == "" || data.user_name == undefined || data.user_name == null) {
            $scope.errorMsg = "Please enter consultant name.";
            $scope.TimeOutError();
            return false;
        }
        else if (data.user_email == "" || data.user_email == undefined || data.user_email == null) {
            $scope.errorMsg = "Please enter consultant email.";
            $scope.TimeOutError();
            return false;
        }
        else if (data.phn_no == "" || data.phn_no == undefined || data.phn_no == null) {
            $scope.errorMsg = "Please enter consultant phone number.";
            $scope.TimeOutError();
            return false;
        }
        else if (
            $scope.consultant_image == 'app/img/noimg.png' || $scope.consultant_image == 'http://taximust.s3.amazonaws.com/user_profile/user.png') {
            $scope.errorMsg = "Please upload consultant image.";
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
            formData.append('image_flag', $scope.consultant_image_flag);
            formData.append('image', $scope.consultant_image);
            formData.append('user_id', $stateParams.consultant_id);
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
                url: MY_CONSTANT.url + '/edit_consultant_profile',
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
        $state.go('app.listuser');
        ngDialog.close({
            template: 'display_msg_modalDialog',
            className: 'ngdialog-theme-default',
            scope: $scope,
            closeByEscape: false,
            closeByDocument: false
        });

    };
    $scope.removeuser = function(data){
        console.log(data);
            $.post(MY_CONSTANT.url + '/remove_align_user', {
            access_token: $cookieStore.get('obj').accesstoken,
            "username":data,
            'user_id': $stateParams.consultant_id
        },
        function (data) {
            
            console.log('user removed', data);
            $scope.showloader = false;  
             $scope.displaymsg = "align Customer remove Successfully";
            console.log($scope.displaymsg);
             setTimeout(function () {
            $scope.displaymsg = "";
                            $scope.$apply();
                            $scope.refreshPage();
                        }, 2000);                      
       


        });

        
    }

       $scope.refreshPage = function () {
        $state.reload();
       
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