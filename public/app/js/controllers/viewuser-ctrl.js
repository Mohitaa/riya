/**
 * Created by cl-macmini127 on 17/08/16.
 */
App.controller('viewUserController', function ($scope, $http, $route, $state, $cookies, $cookieStore, MY_CONSTANT, $timeout, ngDialog, responseCode) {

    'use strict';
    $scope.hospital_id='';
    $scope.displaymsg='';
    $scope.showloader=true;

    /*=====================function to get hospital================================*/
    $.post(MY_CONSTANT.url + '/view_hospital', {
        access_token: $cookieStore.get('obj').accesstoken
    }, function (data) {

        var dataArray = [];
        var excelArray = [];
        
        // console.log('data',data);
        if (data.status == responseCode.SUCCESS) {
            $scope.showloader=false;
            var hospitalList = data.data[1];
            console.log(data.data);
            
            hospitalList.forEach(function (column) {
console.log(column.profilePicURL.original);
                //==========================================================================================================================
//============================================================ data for excel =============================================
//==========================================================================================================================
                var e={};
                e.S_NO = column._id;
                e.Hospital_name = (column.name == ""|| column.name == null|| column.name == undefined)?'--':column.name;
                if(column.profilePicURL.thumbnail == null || column.profilePicURL.thumbnail == '' ||column.profilePicURL.thumbnail==undefined){
                    e.Hospital_Image= "app/img/noimg.png"
                }
                else {
                    e.Hospital_Image = column.profilePicURL.original;
                }
                e.Registration_No = (column.pin_code == ""|| column.pin_code == null|| column.pin_code == undefined)?'--':column.reg_no;
                e.Address = (column.address == ""|| column.address == null|| column.address == undefined)?'--':column.address;
                e.City = (column.city == ""|| column.city == null|| column.city == undefined)?'--':column.city;
                e.state = (column.state == ""|| column.state == null|| column.state == undefined)?'--':column.state;
                e.Country = (column.country == ""|| column.country == null|| column.country == undefined)?'--':column.country;
               

                // e.created = column.created;
                // e.is_blocked = column.is_blocked;
                // e.is_deleted = column.is_deleted;
                // e.latitude = column.latitude;
                // e.longitude = column.longitude;

                // e.updated = column.updated;
                excelArray.push(e);
//==========================================================================================================================
//============================================================  end data for excel ========================================
//==========================================================================================================================
                var d = {};
                d.center_id = column.center_id;
                d.address = (column.address == ""|| column.address == null|| column.address == undefined)?'--':column.address;
                d.city = (column.city == ""|| column.city == null|| column.city == undefined)?'--':column.city;
                d.contacts = (column.contacts == ""|| column.contacts == null|| column.contacts == undefined)?'--':column.contacts;
                d.country = (column.country == ""|| column.country == null|| column.country == undefined)?'--':column.country;
                d.emergencies_supported = (column.emergencies_supported == ""|| column.emergencies_supported == null|| column.emergencies_supported == undefined)?'--':column.emergencies_supported;
                d.name = (column.name == ""|| column.name == null|| column.name == undefined)?'--':column.name;
                d.pin_code = (column.pin_code == ""|| column.pin_code == null|| column.pin_code == undefined)?'--':column.pin_code;
                d.reg_no = (column.reg_no == ""|| column.reg_no == null|| column.reg_no == undefined)?'--':column.reg_no;
                d.state = (column.state == ""|| column.state == null|| column.state == undefined)?'--':column.state;
                if(column.profilePicURL.original == null || column.profilePicURL.original == '' ||column.profilePicURL.original==undefined){
                    d.Hospital_Image= "app/img/noimg.png"
                }
                else {
                    d.Hospital_Image = column.profilePicURL.original;
                }
                d.closing_hours = column.closing_hours;
                d.created = column.created;

                d.is_blocked = column.is_blocked;
                d.is_deleted = column.is_deleted;
                if(column.latitude=="" || column.latitude==null ||  column.latitude==undefined || column.longitude=="" || column.longitude==undefined || column.longitude==null)
                {
                    d.show_latitude=true;
                    d.latitude = "--";
                    d.longitude = "--";
                }
                else 
                {
                    d.show_latitude=false;
                    d.latitude = column.latitude;
                    d.longitude = column.longitude;
                }
                d.opening_hours = column.opening_hours;
                d.updated = column.updated;
                d.editHospital_url= "/app/edit-hospital/" +  column.center_id;
                dataArray.push(d);
            });
            $scope.$apply(function () {
                $scope.list = dataArray;
                $scope.excelList = excelArray;
                var dtInstance;
                $timeout(function () {
                    if (!$.fn.dataTable)
                        return;
                    dtInstance = $('#datatable21').dataTable({
                        'paging': true, // Table pagination
                        'ordering': true, // Column ordering
                        'info': true, // Bottom left status text
                        // Text translation options
                        // Note the required keywords between underscores (e.g _MENU_)
                        oLanguage: {
                            sSearch: 'Search all columns:',
                            sLengthMenu: '_MENU_ records per page',
                            info: 'Showing page _PAGE_ of _PAGES_',
                            zeroRecords: 'Nothing found - sorry',
                            infoEmpty: 'No records available',
                            infoFiltered: '(filtered from _MAX_ total records)'
                        },
                        "aoColumnDefs": [
                            { 'bSortable': false, 'aTargets': [9,10] }
                        ]
                    });
                    var inputSearchClass = 'datatable_input_col_search';
                    var columnInputs = $('tfoot .' + inputSearchClass);

                    // On input keyup trigger filtering
                    columnInputs
                        .keyup(function () {
                            dtInstance.fnFilter(this.value, columnInputs.index(this));
                        });
                });
                //Destroy the datable function
                $scope.$on('$destroy', function () {
                    dtInstance.fnDestroy();
                    $('[class*=ColVis]').remove();
                });
            });
        }
        else if (data.status == responseCode.INVALID_ACCESS_TOKEN){
            $state.go('page.login');
        }
    });




    /*=====================function to refresh page================================*/
    $scope.refreshPage = function () {
        $state.reload();
        ngDialog.close();
    };



});

