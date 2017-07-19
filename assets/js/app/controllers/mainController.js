function mainController($scope,$stateParams,$http,$location){
    if($stateParams.shortUrl){
        $http({
            method: 'GET',
            url: `/api/shortUrl/${$stateParams.shortUrl}`,
        }).then(
            function successCallback(response) {
                window.location = response.data;
            },
            function errorCallback(response) {});
    }

    $scope.submitUrl = () => {

        $scope.fullURLError = false;
        $scope.shortURLError = false;
        $scope.successMsg = false;
        $scope.errorMsg = false;


        let exp = /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/;
        let expLetters = /^[A-zА-яЁё]{1,20}$/;

        if(!$scope.fullUrl){
            $scope.fullURLError = true;
            return;
        }
        if($scope.fullUrl.match(exp) === null){
            $scope.fullURLError = true;
            return;
        }
        if($scope.shortUrl && $scope.shortUrl.match(expLetters) === null){
            $scope.shortURLError = true;
            return;
        }

        $http({
            method: 'POST',
            url: `/api/shortUrl`,
            data: {
                fullUrl:$scope.fullUrl,
                shortUrl:$scope.shortUrl
            }
        }).then(
            function successCallback(response) {
                $scope.successMsg = response.data.successMsg;
                $scope.resUrl = $location.$$host + '/' + response.data.shortUrl;
            },
            function errorCallback(response) {
                console.log('resp',response);
                $scope.errorMsg = response.data;
            });

    };
}

angular.module('urlShortn.controllers').controller('mainController',['$scope','$stateParams','$http','$location',mainController]);