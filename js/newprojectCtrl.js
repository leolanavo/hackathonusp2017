var app = angular.module('newprojectApp', []);

app.controller('addprojectCtrl', ['$scope', '$http', 
    function($scope, $http) {
        $scope.add_p = function() {
            var js = {
                p_name: $scope.p_name,
                username: localStorage.username,
                webpage: $scope.page,
                description: $scope.desci,
                category: $scope.category,
                message: $scope.msg
            };
            console.log('teste');
            $http({
                url: '/addproject',
                method: 'POST',
                data: JSON.stringify(js),
                headers: {'Content-Type': 'application/json'}
            }).then(function success(response) {
                console.log(response.data);
                var data = response.data;
                if (data.status === 'success')
                    alert('Success!');
                else
                    alert('Failed! Reason: ' + data.errmsg);
            }, function error(response) {
                alert('Error!');
            });
        };
    }]);
