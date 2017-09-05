

/**
 * Created by sanjay on 3/28/15.
 */
App.controller('listUserController', function ($scope, $http, $route, $state, $cookies, $cookieStore, MY_CONSTANT, $timeout, ngDialog, responseCode) {
    'use strict';
    //$scope.showloader=true;
    $('#password_dialog').hide();
    $scope.delete_user_id = '';
    $scope.driver = {};
    $scope.currentPage = 0;
    $scope.flag = 0;
    $scope.displaymsg = '';
    $scope.driverpass = {};
    $scope.showloader = true;
    $scope.maxSize = 5;
    $scope.itemsPerPage = 25;
    console.log($cookieStore.get('obj').accesstoken);
    //=====================================Data table view for all users===========================================
    $('#datatable2').on('click', '.edit', function (e) {
        $state.go('app.editUser', {user_id: e.currentTarget.id});
    });
    $('#datatable2').on('click', '.block', function (e) {
        $scope.blockunblockuser_popup(1, e.currentTarget.id);
    });
    $('#datatable2').on('click', '.unblock', function (e) {
        $scope.blockunblockuser_popup(0, e.currentTarget.id);
    });
    $('#datatable2').on('click', '.delete', function (e) {
        $scope.deleteuser_popup(e.currentTarget.id);
    });
    $('#datatable2').on('click', '.changepassword', function (e) {
        $scope.openPasswordDialog(e.currentTarget.id);
    });
    $('#datatable2').on('click', '.ViewDetails', function (e) {
        console.log(e.currentTarget.id)
        $state.go('app.viewUserDetails',{user_id: e.currentTarget.id});
    });
    /*--------------------------------------------------------------------------
     ------------ end of function to export data according to filters ----------
     --------------------------------------------------------------------------*/
    $scope.loadData = function () {
        if ($.fn.DataTable.isDataTable("#datatable2")) {
            $('#datatable2').DataTable().clear().destroy();
        }
        if (!$.fn.dataTable) return;
        $scope.dtInstance = $('#datatable2').dataTable({
            'paging': true,  // Table pagination
            'ordering': true,  // Column ordering
            'info': true,  // Bottom left status text,
            "order": [[0, "desc"]],
            // Text translation options
            // Note the required keywords between underscores (e.g _MENU_)
            "bServerSide": true,
            sAjaxSource: MY_CONSTANT.url + "/get_all_user_data?access_token=" + $cookieStore.get('obj').accesstoken,
            oLanguage: {
                sSearch: 'Search all columns:',
                sLengthMenu: '_MENU_ records per page',
                info: 'Showing page _PAGE_ of _PAGES_',
                zeroRecords: 'Nothing found - sorry',
                infoEmpty: 'No records available',
                infoFiltered: '(filtered from _MAX_ total records)'
            }
        });
        $scope.showloader = false;
        var inputSearchClass = 'datatable_input_col_search';
        var columnInputs = $('tfoot .' + inputSearchClass);
        // On input keyup trigger filtering
        columnInputs
            .keyup(function () {
                $scope.dtInstance.fnFilter(this.value, columnInputs.index(this));
            });
        var oTable = document.getElementById('datatable2');
//gets rows of table
        var rowLength = oTable.rows.length;
//loops through rows
        for (var i = 0; i < rowLength - 1; i++) {
            //gets cells of current row
            var oCells = oTable.rows.item(i).cells;
            //gets amount of cells of current row
            var cellLength = oCells.length;
            //loops through each cell in current row
            for (var j = 0; j < cellLength; j++) {
                /* get your cell info here */
                var cellVal = oCells.item(j).innerHTML;
            }
        }
    };
    $scope.loadData();
    // When scope is destroyed we unload all DT instances
    // Also ColVis requires special attention since it attaches
    // elements to body and will not be removed after unload DT
    $scope.$on('$destroy', function () {
        $scope.dtInstance.fnDestroy();
        $('[class*=ColVis]').remove();
    });

    /*--------------------------------------------------------------------------
     * ------------- funtion to open modal for delete user ----------------
     --------------------------------------------------------------------------*/
    $scope.deleteuser_popup = function (delete_user_id) {
        console.log("gdagdahg", delete_user_id);
        $scope.delete_user_id = delete_user_id;
        ngDialog.open({
            template: 'delete_user_modalDialog',
            className: 'ngdialog-theme-default',
            scope: $scope,
            closeByEscape: false,
            closeByDocument:false
        });
    };
    /*--------------------------------------------------------------------------
     * -------------------------funtion to delete user --------------------------
     --------------------------------------------------------------------------*/
    $scope.delete_user = function (delete_user_id) {
        ngDialog.close();
        $.post(MY_CONSTANT.url + '/delete_user', {
            access_token: $cookieStore.get('obj').accesstoken,
            user_id: delete_user_id
        }, function (data) {
            
            $scope.displaymsg = '';
            if (data.status == responseCode.SUCCESS) {
                $scope.displaymsg = "User is deleted successfully.";
            }
            else if (data.status == responseCode.INVALID_ACCESS_TOKEN) {
                $state.go('page.login');
            }
            else {
                $scope.displaymsg = data.message.toString();
            }
            $scope.$apply();
            ngDialog.open({
                template: 'display_msg_modalDialog',
                className: 'ngdialog-theme-default',
                scope: $scope,
                closeByEscape: false,
                closeByDocument:false
            });
        });
    };
//    /*--------------------------------------------------------------------------
//     * --------- funtion to open dialog for block or unblock user ------------
//     --------------------------------------------------------------------------*/
    $scope.blockunblockuser_popup = function (is_blocked, user_id) {
        $scope.blockunblockmsg = '';
        $scope.blockunblockid = user_id;
        $scope.is_blocked = is_blocked;
        if (is_blocked == 1) {
            $scope.blockunblockmsg = "Are you sure you want to block this user?";
        } else {
            $scope.blockunblockmsg = "Are you sure you want to unblock this user?";
        }
        ngDialog.open({
            template: 'block_unblock_user_modalDialog',
            className: 'ngdialog-theme-default',
            showClose: false,
            scope: $scope,
            closeByEscape: false,
            closeByDocument:false
        });
    };
    /*--------------------------------------------------------------------------
     * ------------------ funtion to block or unblock user -------------------
     --------------------------------------------------------------------------*/
    $scope.do_block_unblock_user = function (is_blocked, blockunblockid) {
        $.post(MY_CONSTANT.url + '/block_unblock_user',
            {
                access_token: $cookieStore.get('obj').accesstoken,
                "user_id": blockunblockid,
                "block_status": is_blocked
            }, function (data) {
               
                if (data.status == responseCode.SUCCESS) {
                    if (is_blocked == 1) {
                        $scope.displaymsg = "users is blocked successfully.";
                    } else {
                        $scope.displaymsg = "users is unblocked successfully.";
                    }
                }
                else if (data.status == responseCode.INVALID_ACCESS_TOKEN) {
                    $state.go('page.login');
                }
                else {
                    $scope.displaymsg = data.message.toString();
                }
                $scope.$apply();
                ngDialog.close();
                ngDialog.open({
                    template: 'display_msg_modalDialog',
                    className: 'ngdialog-theme-default',
                    showClose: false,
                    scope: $scope,
                    closeByEscape: false,
                    closeByDocument:false
                });
            });
    };
    //==============================================================================================================================
//==========================================================password dialog-====================================================
//==============================================================================================================================
    $scope.openPasswordDialog = function (id) {
        $scope.driver_pass_id = id;
        $('#table11').toggle('slide', 'Right', 1000);
        $('#password_dialog').toggle('slide', 'Left', 1000);
        // ngDialog.open({
        //     template: 'password_dialog',
        //     className: 'ngdialog-theme-default',
        //     showClose: false,
        //     scope: $scope
        // });
    };
//    ==============================================================================================================================
//==========================================================password dialog-====================================================
//==============================================================================================================================
    $scope.changeDriverPass = function (driver) {
        if (driver == null || driver == undefined || driver == "") {
            $scope.driverpass.errorMsg = "Please enter password";
            $timeout(function () {
                $scope.driverpass.errorMsg = "";
            }, 3000);
            return;
        }
        else if (driver.confirmPassword == '' || driver.confirmPassword == undefined || driver.confirmPassword == null) {
            $scope.driverpass.errorMsg = "Please enter confirm password";
            $timeout(function () {
                $scope.driverpass.errorMsg = "";
            }, 3000);
            return;
        }
        else if (driver.password != driver.confirmPassword) {
            $scope.driverpass.errorMsg = "Both the password should match";
            $timeout(function () {
                $scope.driverpass.errorMsg = "";
            }, 3000);
            return;
        }
        else {
            $.post(MY_CONSTANT.url + '/update_users_password',
                {
                    access_token: $cookieStore.get('obj').accesstoken,
                    user_id: $scope.driver_pass_id,
                    password: driver.password
                }, function (data) {
                    
                    if (data.status == responseCode.SUCCESS) {
                        $scope.driverpass.successMsg = data.message;
                        $scope.$apply();
                        setTimeout(function () {
                            $scope.driverpass.successMsg = "";
                            $scope.$apply();
                        }, 3000);
                        setTimeout(function () {
                            $scope.close();
                        }, 3000);
                    }
                    else if (data.status == responseCode.INVALID_ACCESS_TOKEN) {
                        $state.go('page.login');
                    }
                    else {
                        $scope.driverpass.errorMsg = data.message;
                        $scope.$apply();
                        setTimeout(function () {
                            $scope.driverpass.errorMsg = "";
                            $scope.$apply();
                        }, 3000);
                        setTimeout(function () {
                            $scope.close();
                        }, 3000);
                    }
                });
        }

    };
    /*--------------------------------------------------------------------------
     * --------- funtion to refresh page ---------------------------------------
     --------------------------------------------------------------------------*/
    $scope.refreshPage = function () {
        $state.reload();
        ngDialog.close();
    };
    $scope.close = function () {
        $scope.driver.password='';
        $scope.driver.confirmPassword='';
        $('#password_dialog').toggle('slide', 'Right', 1000);
        $('#table11').toggle('slide', 'Left', 1000);
    }
});
