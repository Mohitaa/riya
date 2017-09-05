
App.controller('viewUserController', function ($scope, $http, $cookies,$cookieStore,$stateParams, MY_CONSTANT,$state,$rootScope,$modal,$timeout,ngDialog) {
    $scope.approveuser = {};
    $scope.minDate = new Date();
    $scope.user_image_sent = 0;
    $scope.insurance_image_sent = 0;
    $scope.user_image_flag = 0;
    $scope.showloader = true;
  $scope.consultantlist=["mamta","neha"];
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
            $scope.approveuser.user_id = unapprovedlist.userId;
            $scope.approveuser.user_name = unapprovedlist.firstName;
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
 
            $scope.showloader=true;
         


            $.post(MY_CONSTANT.url + '/edit_user_profile', {
            access_token: $cookieStore.get('obj').accesstoken,
            address:data.address,
            age:data.age,
            consultant:data.consultant,
            ids:data.ids,
            listConsutant:data.listConsutant,
            phn_no:data.phn_no,
            typeOfGender:data.typeOfGender,
            user_id:data.user_id
        },
        function (data) {
            
           
                    $scope.displaymsg = "User Information Updated Successfully";
                    ngDialog.open({
                        template: 'display_msg_modalDialog',
                        className: 'ngdialog-theme-default',
                        showClose: false,
                        scope: $scope,
                        closeByEscape: false,
                        closeByDocument: false
                    });

                                
       


        });

         
    };
    getAllConsultant();
  function  getAllConsultant(){


          $.post(MY_CONSTANT.url + '/get_all_consultantname', {
            access_token: $cookieStore.get('obj').accesstoken,
            
        },
        function (data) {
            
            console.log('user details',data);
            $scope.showloader = false;
            
           $scope.listConsutant = data.aaData;
           
           console.log($scope.listConsutant);
            $scope.$apply();
              return data;
        

        });

    }

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