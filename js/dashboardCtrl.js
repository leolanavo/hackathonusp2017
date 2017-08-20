var app = angular.module('indexApp', []);

app.controller('registerCtrl', ['$scope', '$http', 
    function($scope, $http) {
        $scope.register = function() {
            var js = {
                fullname: $scope.fullname,
                username: $scope.username,
                email: $scope.email,
                password: $scope.password
            };
            console.log('teste');
            $http({
                url: '/register',
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
app.controller('loginCtrl', ['$scope', '$http', 
    function($scope, $http) {
        $scope.login = function() {
            var js = {
                username: $scope.username,
                password: $scope.password
            };
            console.log('teste');
            $http({
                url: '/login',
                method: 'POST',
                data: JSON.stringify(js),
                headers: {'Content-Type': 'application/json'}
            }).then(function success(response) {
                console.log(response.data);
                var data = response.data;
                if (data.status === 'success'){
                    localStorage.username = $scope.username;
                } else
                    alert('Failed! Reason: ' + data.errmsg);
            }, function error(response) {
                alert('Error!');
            });
        };
    }]);
