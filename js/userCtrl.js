var app = angular.module('userApp', []);

app.controller('u_infoCtrl', ['$scope', '$http',
    function($scope, $http) {
        var js = {
            user: localStorage.username
        };

        $http({
            url: '/u_info',
            method: 'POST',
            data: JSON.stringify(js),
            headers: {'Content-Type': 'application/json'}
        }).then(function success(response) {
            console.log(response.data);
            var data = response.data;
            if (data.status === 'success') {
                $scope.name = data.name;
                $scope.projects = data.projects;
            } else
                alert('Failed! Reason: ' + data.errmsg);
        }, function error(response) {
            alert('Error!');
        });
    }]);
