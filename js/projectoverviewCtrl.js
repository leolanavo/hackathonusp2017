var app = angular.module('projectoverviewApp', []);

app.controller('listCtrl', ['$scope', '$http', 
    function($scope, $http) {
        $scope.ask = function(category) {
            var js = {
                category: category
            };

            $http({
                url: '/listp',
                method: 'POST',
                data: JSON.stringify(js),
                headers: {'Content-Type': 'application/json'}
            }).then(function success(response) {
                console.log(response.data);
                var data = response.data;
                if (data.status === 'success')
                    $scope.projects = data.projects;
                else
                    alert('Failed! Reason: ' + data.errmsg);
            }, function error(response) {
                alert('Error!');
            });
        };
        $scope.subscribe = function(id_h) {
            var username = localStorage.username;
            console.log(username);
            var js = {
                help : id_h,
                usr : username
            };
            $http({
                url: '/subscribe',
                method: 'POST',
                data: JSON.stringify(js),
                headers: {'Content-Type': 'application/json'}
            }).then(function success(response) {
                var data = response.data;
                if (data.status === 'success')
                    alert("Inscrito com sucesso");
                else
                    alert('Failed! Reason: ' + data.errmsg);
            }, function error(response) {
                alert('Error!');
            });
        };
        $scope.ask('estatistica');
    }]);
