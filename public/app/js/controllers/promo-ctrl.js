
App.controller('promoController', function ($scope, $http, $cookies, $cookieStore, $stateParams, MY_CONSTANT, $timeout, $window, $state, ngDialog) {

    $scope.isDisabled = false;
    /**=========================================================
     * ===============Code for custom pagination=============
     =========================================================*/
    var limitVal = 10;
    var offsetVal = 0;
    $scope.bigCurrentPage = 1;
    $scope.records = 10;
    $scope.itemsPage = $scope.records;
    $scope.maxSize = 5;
    $scope.skip = 0;
    $scope.footerInfo = $scope.itemsPage;


    $scope.val = '';
    //$timeout(function() {

        
      
    $scope.recordsPerPageVal = function () {
        limitVal = $scope.records;
        offsetVal = ($scope.bigCurrentPage - 1) * $scope.records;
        console.log('LimitVal', $scope.records, limitVal);
        console.log('OffsetVal', offsetVal);
        console.log($scope.bigCurrentPage);
        $scope.skip = ($scope.bigCurrentPage - 1) * $scope.records;
        if ($scope.records * $scope.bigCurrentPage > $scope.val) {
            $scope.footerInfo = $scope.val;
        }
        else {
            $scope.footerInfo = $scope.records * $scope.bigCurrentPage;
        }
        $scope.getFleetOwnerList();
    };
    //},200);


    $scope.pageChanged = function () {
        
        $scope.skip = ($scope.bigCurrentPage - 1) * $scope.records;
        if ($scope.records * $scope.bigCurrentPage > $scope.val) {
            $scope.footerInfo = $scope.val;
        }
        else {
            $scope.footerInfo = $scope.records * $scope.bigCurrentPage;
        }
        console.log('Items', $scope.itemsPage);
        $scope.recordsPerPageVal();
    };

    $scope.count = "";

    /**==============================================================
     * ================= Get list of all Fleet Owners =================
     ============================================================*/
    $scope.getFleetOwnerList = function () {
        console.log(limitVal, offsetVal);
        $scope.loading = true;

        $scope.itemsPage = $scope.records;

        $http({
            url: MY_CONSTANT.url + '/api/admin/getAllPromoCode?limit=' + limitVal + '&skip=' + offsetVal,
            method: "GET",
            headers: {
                'authorization': $cookieStore.get('obj').accesstoken
            }
            // params: {
            //     "limit": limitVal,
            //     "skip": offsetVal
            // }

        }).success(function (response) {
            console.log(response)
            $scope.count = response.data.listCount;
            $scope.val = $scope.count;
            $scope.bigTotalItems = $scope.count;
            $scope.setPage = function (pageNo) {
                $scope.bigCurrentPage = pageNo;
                console.log('Page changed to: ' + $scope.bigCurrentPage);
            };
            if ($scope.records * $scope.bigCurrentPage > $scope.val) {
                $scope.footerInfo = $scope.val;
            }
            else {
                $scope.footerInfo = $scope.records * $scope.bigCurrentPage;
            }
            // if ($.fn.DataTable.isDataTable("#datatable2")) {
            //     $('#datatable2').DataTable().clear().destroy();
            // }

            /**=============== Exracting data using forEach =============*/
            if (response.data) {
                var dataArray = [];
                var excelArray = [];
                var promoCodeList = response.data.promoCodeList;
                promoCodeList.forEach(function (column) {

                    var d = {};
                    /**=============== Promo Code Details =============*/
                    d._id = column._id;
                    d.name = column.name;
                    d.description = column.description;
                    d.maxDiscountAmt = column.value;
                    d.promoType = column.valueType;
                    d.frequency = column.globalUsageLimit;
                    d.startTime = column.startDate;
                    d.endTime = column.expiryDate;

                    dataArray.push(d);
                });

                $scope.list = dataArray;
                //console.log("List", $scope.excelList);
                createtable();

            }
            else {
                alert("Something went wrong, please try again later.");
                return false;
            }
        }).error(function (data) {
            $scope.loading = false;
            if (data.statusCode == 401) {
                $scope.errorMsg = "Session Expired. Please Login Again.";
                setTimeout(function () {
                    $cookieStore.remove('obj');
                    $state.go('page.login');
                }, 1000);
            }
            else {
                $scope.errorMsg = data.message;
                setTimeout(function () {
                    $scope.errorMsg = false;
                }, 2000);
            }
        })
    };

    
    // delete promocode function
    
    $scope.openConfirm = function (data_get) {
        $scope.visible = true;
        ngDialog.openConfirm({
            template: 'modalDialogId2',
            className: 'ngdialog-theme-default',
            scope: $scope
        }).then(function (value) {
        }, function (reason) {
        });
        $scope.id = data_get;
        $('#ngdialog1').find('div.ngdialog-content').attr('ng-show', 'visible');
    };

    $scope.deleteOffer = function (promoId) {
        console.log('mamta', promoId);
        $.ajax({
            type: "DELETE",
            url:MY_CONSTANT.url + '/api/admin/deletePromoCode?promoId='+promoId,
            headers:{
                'authorization':$cookieStore.get('obj').accesstoken
            },
            success: function(data){
                $state.reload();
                ngDialog.close();
            },
            error: function(error) {
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
            }
        });
    };


        $scope.EditPromoDialog = function(data){
            $scope.min_date = new Date();
            console.log(data);

                jQuery('#start_date').datetimepicker();
               jQuery('#end_date').datetimepicker();  
        $scope.add = angular.copy(data);
        ngDialog.open({
            template: 'editPromoDialog',
            className: 'ngdialog-theme-default myDialog',
            showClose: true,
            scope: $scope,
            closeByDocument: false,
            closeByEscape: false
        });
        $scope.$on('ngDialog.opened',function(){
            $scope.add.startTime=data.startTime;
            $scope.add.endTime=data.endTime;
            $scope.add.frequency_per_user=data.frequency;
            $scope.add.name=data.name;
            $scope.add.maxDiscountAmt=data.maxDiscountAmt;
            $scope.add.valueType=data.promoType;
            $scope.add.description=data.description;



        $scope.EditPromo = function (dataa) {
            console.log(dataa,"dataa");
            $scope.add.startTime=data.startTime;
            $scope.add.endTime=dataa.endTime;
            $scope.add.frequency_per_user=dataa.frequency;
            $scope.add.name=dataa.name;
            $scope.add.maxDiscountAmt=dataa.maxDiscountAmt;
            $scope.add.valueType=dataa.promoType;
            $scope.add.description=dataa.description;
            
           
             
        if( $scope.add.startTime==null || $scope.add.startTime==undefined || $scope.add.startTime=="")
        {
            $scope.errorMsg_1 = 'Please enter start Time';
           
            setTimeout(function () {
                $scope.errorMsg_1 = "";
               
            }, 3000);
            return;
        }
        else if($scope.add.endTime==null || $scope.add.endTime==undefined || $scope.add.endTime=="")
        {
            $scope.errorMsg_1 = 'Please enter end Date';
         
            setTimeout(function () {
                $scope.errorMsg_1= "";
        
            }, 3000);
            return;
        }
         else {
       
       $http({
                url: MY_CONSTANT.url + '/api/admin/edit_promo',
                method: "POST",
                headers: {
                'authorization': $cookieStore.get('obj').accesstoken,
                'type': $cookieStore.get('obj').type,
                'username': $cookieStore.get('obj').username
                },
                data:dataa
            })
                .then(function(response) {
                    console.log(response)
                    if(response.data)
                    {     
                   var data = response.data;
                   if (data.status == 200) {
                    $scope.successMsg_1= "Promo Code Edited Successfully.";
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

        })
    }
    
    /**===============Create Table============*/
    var createtable = function () {
        //console.log("CreateTable");
        var dtInstance;
        setTimeout(function () {
            $scope.loading = false;
            if (!$.fn.dataTable) return;
            dtInstance = $('#datatable2').dataTable({
                'paging': false, // Table pagination
                'ordering': true, // Column ordering
                'info': false, // Bottom left status text
                'bDestroy': true,
                "aoColumnDefs": [{
                    "bSortable": false,
                    "aTargets": [5,6]
                }],
                'bStateSave': true,
                oLanguage: {
                    sSearch: 'Search all columns:   ',
                    sLengthMenu: '_MENU_ records per page',
                    info: 'Showing page ​_PAGE_​ of ​_PAGES_​',
                    zeroRecords: 'Nothing found - sorry',
                    infoEmpty: 'No records available',
                    infoFiltered: '(filtered from ​_MAX_​ total records)'
                }
                //"pageLength": 100
            });
            var inputSearchClass = 'datatable_input_col_search';
            var columnInputs = $('tfoot .' + inputSearchClass);

            // On input keyup trigger filtering
            columnInputs
                .keyup(function () {
                    dtInstance.fnFilter(this.value, columnInputs.index(this));
                });


        });
        // When scope is destroyed we unload all DT instances
        // Also ColVis requires special attention since it attaches
        // elements to body and will not be removed after unload DT
        $scope.$on('$destroy', function () {
            dtInstance.fnDestroy();
            $('[class*=ColVis]').remove();
        });
        // $scope.loading = false;
    };

    $scope.getFleetOwnerList();


});