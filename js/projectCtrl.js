var app = angular.module('projectApp', []);

app.controller('infoCtrl', ['$scope', '$http',
    function($scope, $http) {
        var js = {
            proj_id: '1'
        };

        $http({
            url: '/info',
            method: 'POST',
            data: JSON.stringify(js),
            headers: {'Content-Type': 'application/json'}
        }).then(function success(response) {
            console.log(response.data);
            var data = response.data;
            if (data.status === 'success') {
                $scope.name = data.name;
                $scope.email = data.email;
                $scope.users_of = data.users_of;
                $scope.resumo = data.resumo;
                $scope.p_name = data.p_name;
                $scope.need = data.need;
            } else
                alert('Failed! Reason: ' + data.errmsg);
        }, function error(response) {
            alert('Error!');
        });
    }]);
