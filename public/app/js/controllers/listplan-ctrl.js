/**
 * Created by sanjay on 3/28/15.
 */
App.controller('planDatabaseController', function ($scope, $http, $route, $state, $cookies, $cookieStore, MY_CONSTANT, $timeout, ngDialog, responseCode) {
    'use strict';
    //$scope.showloader=true;
    $('#password_dialog').hide();
    $scope.delete_plan_id = '';
    $scope.driver = {};
    $scope.currentPage = 0;
    $scope.flag = 0;
    $scope.displaymsg = '';
    $scope.showloader = true;
    $scope.maxSize = 5;
    $scope.itemsPerPage = 25;
    console.log($cookieStore.get('obj').accesstoken);
    //=====================================Data table view for all plan===========================================

    $('#datatable2').on('click', '.delete', function (e) {
        $scope.deleteplan_popup(e.currentTarget.id);
    });
    $('#datatable2').on('click', '.edit', function (e) {
        $scope.editplan_popup(e.currentTarget.id);
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
            sAjaxSource: MY_CONSTANT.url + "/get_all_plan_data?access_token=" + $cookieStore.get('obj').accesstoken,
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
        console.log(oTable,"  otable")
//gets rows of table
        var rowLength = oTable.rows.length;
//loops through rows
        for (var i = 0; i < rowLength - 1; i++) {
            //gets cells of current row
            var oCells = oTable.rows.item(i).cells;
            //gets amount of cells of current row
            var cellLength = oCells.length;
             console.log(i," cell  ",oCells)
            //loops through each cell in current row
            for (var j = 0; j < cellLength; j++) {
                /* get your cell info here */
                var cellVal = oCells.item(j).innerHTML;
                console.log(j," cell  ",cellVal)
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
     * ------------- funtion to open modal for delete plan ----------------
     --------------------------------------------------------------------------*/
    $scope.deleteplan_popup = function (delete_plan_id) {
        console.log("gdagdahg", delete_plan_id);
        $scope.delete_plan_id = delete_plan_id;
        ngDialog.open({
            template: 'delete_plan_modalDialog',
            className: 'ngdialog-theme-default',
            scope: $scope,
            closeByEscape: false,
            closeByDocument:false
        });
    };
     
    /*--------------------------------------------------------------------------
     * -------------------------funtion to delete plan --------------------------
     --------------------------------------------------------------------------*/
    $scope.delete_plan = function (delete_plan_id) {
        ngDialog.close();
        $.post(MY_CONSTANT.url + '/delete_plan', {
            access_token: $cookieStore.get('obj').accesstoken,
            plan_id: delete_plan_id
        }, function (data) {
            
            $scope.displaymsg = '';
            if (data.status == responseCode.SUCCESS) {
                $scope.displaymsg = "Plan is deleted successfully.";
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

   $scope.editplan_popup = function (dataa) {
        console.log("gdagdahg", dataa);
        
        ngDialog.open({
            template: 'edit_plan_modalDialog',
            className: 'ngdialog-theme-default',
            scope: $scope,
            closeByEscape: false,
            closeByDocument:false
        });


   $scope.EditPlan = function(data){
           data.id=dataa;
            
            console.log(data);

       
       $http({
                url: MY_CONSTANT.url + '/api/admin/edit_plan',
                method: "POST",
                headers: {
                'authorization': $cookieStore.get('obj').accesstoken,
                'type': $cookieStore.get('obj').type,
                'username': $cookieStore.get('obj').username
                },
                data:data
            })
                .then(function(response) {
                    console.log(response.data)
                    if(response.data)
                    {     
                        console.log(response)
                   var data = response.data;
                   if (response.status == 200) {
                    $scope.successMsg_1= "Plan  Edited Successfully.";
                    setTimeout(function () {
                         $state.reload();
                        ngDialog.close();
                        $scope.successMsg_1="";
                        console.log("hello");
                        $scope.$apply();
                    }, 1500);
                    }
                    }
                    else
                    {
                    $scope.errorMsg_1= data.message;
                    setTimeout(function () {
                        $scope.errorMsg_1= "";;
                    }, 3000);

                    }
                },
                    function(response) { // optional
                        console.log(response+"error");
                    $scope.errorMsg_1 = data.message;
                    setTimeout(function () {
                        $scope.errorMsg_1= "";;
                    }, 3000);
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
