
App.controller('addPlanController',function ($scope, $http, $cookies,$cookieStore, MY_CONSTANT,$state,$rootScope,$modal,$timeout,ngDialog) {

    $scope.addAdmin = {};
    $scope.showloader=true;
    $scope.addAdmin.name = '';
    $scope.addAdmin.services = '';
    $scope.addAdmin.price = '';
    $scope.addAdmin.duration = '';
    $scope.addAdmin.category = '';

console.log("i m heare");
      $scope.submit = function (addAdmin) {
                $scope.name=addAdmin.name;
                $scope.services= addAdmin.services;
                $scope.price = addAdmin.price;
                $scope.duration =addAdmin.duration;
                $scope.category="silver";
            console.log(addAdmin.category);
        if( $scope.name==null || $scope.name==undefined || $scope.name=="")
        {
            $scope.addAdmin.errorMsg = 'Please enter name';
           
            setTimeout(function () {
                $scope.addAdmin.errorMsg = "";
               
            }, 3000);
            return;
        }
        else if(addAdmin.price==null || addAdmin.price==undefined || addAdmin.price=="")
        {
            $scope.addAdmin.errorMsg = 'Please enter price';
         
            setTimeout(function () {
                $scope.addAdmin.errorMsg = "";
        
            }, 3000);
            return;
        }
        else if(addAdmin.duration==null || addAdmin.duration==undefined || addAdmin.duration=="")
        {
            $scope.addAdmin.errorMsg = 'Please select duration';
          
            setTimeout(function () {
                $scope.addAdmin.errorMsg = "";
              
            }, 3000);
            return;
        }
                else if(addAdmin.services==null || addAdmin.services==undefined || addAdmin.services=="")
        {
            $scope.addAdmin.errorMsg = 'Please select services';
          
            setTimeout(function () {
                $scope.addAdmin.errorMsg = "";
              
            }, 3000);
            return;
        }
        else {
       
       $http({
                url: MY_CONSTANT.url + '/api/admin/add_plan',
                method: "POST",
                headers: {
                'authorization': $cookieStore.get('obj').accesstoken,
                'type': $cookieStore.get('obj').type,
                'username': $cookieStore.get('obj').username
                },
                data:
                {
                name: addAdmin.name,
                price: addAdmin.price,
                duration:addAdmin.duration,
                category:addAdmin.category,
                services:addAdmin.services
                }
            })
                .then(function(response) {
                    console.log(response)
                    if(response.data)
                    {     
                   var data = response.data;
                   if (data.status == 200) {
                    $scope.addAdmin.successMsg = "Plan Added Successfully.";
                    setTimeout(function () {
                        console.log("hello");
                        $scope.addAdmin.successMsg = "";
                        addAdmin.name="";
                        addAdmin.services= "";
                        addAdmin.price = "";
                        addAdmin.duration ="";
                        addAdmin.category="";
                        $scope.$apply();
                    }, 3000);
                    }
                    }
                    else
                    {
                    $scope.addAdmin.errorMsg = data.message;
                    setTimeout(function () {
                        $scope.addAdmin.errorMsg = "";;
                    }, 3000);

                    }
                },
                    function(response) { // optional
                        console.log(response+"error");
                    $scope.addAdmin.errorMsg = data.message;
                    setTimeout(function () {
                        $scope.addAdmin.errorMsg = "";;
                    }, 3000);
                    });
        }
    };
    
});


 