/**
 * Created by cl-macmini127 on 17/08/16.
 */
App.controller('addHospitalController', function ($scope, $http, $cookies, $cookieStore, MY_CONSTANT, $state, ngDialog, $timeout, responseCode, $stateParams) {

    $scope.hospital={};
    $scope.successMsg='';
    $scope.errorMsg='';
    $scope.pic_sent=0;
    $scope.hide=true;
    $scope.hospital.pic="app/img/noimg.png";

    //========================obtain list of specialisations========================
    // $scope.special=[{
    //     id:1,
    //     hosName: 'Cardiac'
    // },
    //     {
    //         id:2, hosName: 'Trauma'
    //     }
    //     ,
    //     {
    //         id:3, hosName: 'Burns'
    //     }
    //     ,
    //     {
    //         id:4, hosName: 'Injury'
    //     },
    //     {
    //         id:5, hosName:'Others'
    //     }
    // ];
    // //======================for add/remove contact===================================
    // $scope.contacts = [{mobile: ''}];
    // $scope.addNewContact = function() {
    //     $scope.contacts.push({mobile:''});
    // };
    // $scope.removeContact = function() {
    //     var lastItem = $scope.contacts.length-1;
    //     $scope.contacts.splice(lastItem);
    // };

    /*===========================================================================
     *============================getting img file================================
     *===========================================================================*/

    $scope.file_to_upload = function (files) {
        $scope.hospital.pic = files[0];
        $scope.pic_sent = 1;
        $scope.pic_name = files[0].name;
        var file = files[0];
        var imageType = /image.*/;
        if (!file.type.match(imageType)) {

        }
        // var img = document.getElementById("hospitalPic");
        // img.file = file;
        // var reader = new FileReader();
        // reader.onload = (function (aImg) {
        //     return function (e) {
        //         aImg.src = e.target.result;
        //     };
        // })(img);
        // reader.readAsDataURL(file);
        // $scope.$apply();
    };

    //======================function for autofill address===================================
    var placeSearch, autocomplete;
    var componentForm = {
        street_number: 'short_name',
        route: 'long_name',
        locality: 'long_name',
        administrative_area_level_1: 'long_name',
        country: 'long_name',
        postal_code: 'short_name'
    };

    function initAutocomplete() {
        autocomplete = new google.maps.places.Autocomplete((document.getElementById('autocomplete')),
            {
                // types: ['geocode']
            });
        autocomplete.addListener('place_changed', fillInAddress);
    }
    initAutocomplete();
    function fillInAddress() {
        var place = autocomplete.getPlace();
        // console.log("place++++++++++++++",place);
        // console.log("place==",place.address_components);
        $scope.latitude=place.geometry.location.lat();
        $scope.longitude=place.geometry.location.lng();
        for (var i = 0; i < place.address_components.length; i++) {
            var addressType = place.address_components[i].types[0];
            // console.log('ghr',addressType);
            if (componentForm[addressType]) {
                var val = place.address_components[i][componentForm[addressType]];
                if(addressType=='locality')
                {
                    document.getElementById(addressType).value = val;
                }
                else if(addressType=='administrative_area_level_1')
                {
                    document.getElementById(addressType).value = val;
                }
                else if(addressType=='country')
                {
                    document.getElementById(addressType).value = val;
                }
                else if(addressType=='postal_code')
                {
                    document.getElementById(addressType).value = val;
                }
            }
        }
    }
    /*--------------------------------------------------------------------------
     * ---------------- function to Add Hospital -----------------------------
     --------------------------------------------------------------------------*/
    $scope.specialization=[];
    $scope.contactNumber=[];
    $scope.add_hospital_function = function (data) {
      console.log('data',data);
        //===========specialization==============================
        //for(var i=0;i< data.hosName.length;i++)
        // {

        //     $scope.specialization.push(data.hosName[i].hosName);
        // }
        //===========contacts===================================
        // for(var j=0;j< $scope.contacts.length;j++)
        // {
        //     // console.log('contact length',$scope.contacts[j],$scope.contacts[j].mobile,$scope.contacts[j].mobile.length);

        //     var mobile=$scope.contacts[j].mobile.split('');

        //     if(mobile[0]==0){
        //         $scope.hospital.errorMsg = 'Invalid Contact number';
        //         setTimeout(function () {
        //             $scope.hospital.errorMsg = "";
        //             $scope.$apply();
        //         }, 3000);
        //         return;
        //     }
        //     if($scope.contacts[j].mobile== "0000000000")
        //     {
        //         $scope.hospital.errorMsg = 'Invalid Contact number';
        //         setTimeout(function () {
        //             $scope.hospital.errorMsg = "";
        //             $scope.$apply();
        //         }, 3000);
        //         return;
        //     }
        //     $scope.contactNumber.push($scope.contacts[j].mobile);
        // }
        //=============Address==================================
        $scope.address=$('#autocomplete').val();
        $scope.city=$('#locality').val();
        $scope.state=$('#administrative_area_level_1').val();
        $scope.country=$('#country').val();
        $scope.pin=$('#postal_code').val();

        //===========check on start date and end date==================
        // var s=data.shift_start.split(':');
        // var e=data.shift_end.split(':');
        // var start=parseInt(s[0])*60+parseInt(s[1]);
        // var end=parseInt(e[0])*60+parseInt(e[1]);
        // var start1=parseInt(s[0])+(parseInt(s[1])/60);
        // var end1=parseInt(e[0])+(parseInt(e[1])/60);

        // if($scope.hospital.hosName==null || $scope.hospital.hosName ==undefined || $scope.hospital.hosName=="")
        // {
        //     $scope.hospital.errorMsg = 'Please select the specialisations';
        //     $scope.TimeOutError();
        //     return false;
        // }
       // else if(start>end){
       //      $scope.hospital.errorMsg = "Start date must be less than end date";
       //      $timeout(function(){
       //          $scope.hospital.errorMsg = "";
       //      },3000);
       //      return;
       //  }
         if($scope.hospital.pic==null || $scope.hospital.pic =="" || $scope.hospital.pic ==undefined || $scope.hospital.pic=="app/img/noimg.png")
        {
            $scope.hospital.errorMsg = 'Please upload hospital image.';
            
            $scope.TimeOutError();
            return false;
        }

      else {
            var formData = new FormData();
            formData.append('access_token', $cookieStore.get('obj').accesstoken);
            formData.append('name',data.name);
            // formData.append('reg_no',data.reg);
            formData.append('address',  $scope.address);
            formData.append('city', $scope.city);
            formData.append('state', $scope.state);
            formData.append('country', $scope.country);
            formData.append('pin_code', $scope.pin);
            // formData.append('latitude', $scope.latitude);
            // formData.append('longitude', $scope.longitude);
            formData.append('profilePic',$scope.hospital.pic);
            // formData.append('opening_hours',data.shift_start);
            // formData.append('closing_hours',data.shift_end);
            // formData.append('emergencies_supported',$scope.specialization.toString());
            // formData.append('contacts',$scope.contactNumber.toString());
                $.ajax({
                    type: 'POST',
                    url: MY_CONSTANT.url + '/add_hospital',
                    data: formData,
                    processData: false,
                    contentType: false,
                    success: function (data) {
                        console.log(data);
                         $scope.displaymsg = "Hospital's details added successfully.";
                        if (data) {
                            $scope.displaymsg = "Hospital's details added successfully.";
                        }
                        else if (data.status == responseCode.INVALID_ACCESS_TOKEN) {
                            $state.go('page.login');
                        }
                        else if (data.status == responseCode.SHOW_ERROR_MESSAGE) {
                            $scope.hospital.errorMsg = data.message;
                            $scope.$apply();
                            setTimeout(function () {
                                $scope.hospital.errorMsg = "";
                                $scope.$apply();
                            }, 3000);
                            return;
                        }
                        else {
                            $scope.hospital.errorMsg = "Something went wrong !";
                            $scope.$apply();
                            setTimeout(function () {
                                $scope.hospital.errorMsg = "";
                                $scope.$apply();
                            }, 3000);
                            return;
                        }
                        ngDialog.open({
                            template: 'display_msg_modalDialog',
                            className: 'ngdialog-theme-default',
                            showClose: false,
                            scope: $scope,
                            closeByEscape: false,
                            closeByDocument:false
                        });
                    }
                });
        }
    };

    //===================refresh page =============
    $scope.refreshPage = function () {
        $state.go('app.consultant');
        ngDialog.close();

    };
    /*--------------------------------------------------------------------------
     * ---------------- Timeout function -----------------------------------
     --------------------------------------------------------------------------*/
    $scope.TimeOutError = function () {
        setTimeout(function () {
            $scope.errorMsg = "";
            $scope.hospital.errorMsg = "";
            $scope.$apply();
        }, 3000);
    };
    /*--------------------------------------------------------------------------
     * ---------------- Timepicker -----------------------------------
     --------------------------------------------------------------------------*/
    // $('#timepickerstart').timepicker();

    $('#timepickerstart').timepicker({
        showMeridian:false,
        showSeconds:true,
        defaultTime:'0:0:0',
        icons: {
            up: "fa fa-arrow-up",
            down: "fa fa-arrow-down"
        }
    });
    $('#timepickerend').timepicker({
        showMeridian:false,
        showSeconds:true,
        defaultTime:'0:0:0',
        icons: {
            up: "fa fa-arrow-up",
            down: "fa fa-arrow-down"
        }
    });
});

