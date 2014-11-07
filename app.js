angular.module('pewi', [])

.controller('MainCtrl', ['$scope','$http','$location',
  function($scope, $http, $location) {
    $http.get($location.absUrl() + 'data/data.json').success(
      function(response) {
        console.log(response);
        $scope.data = response.data;
      }
    );

    $scope.sidenav = true;
    $scope.toggleSidenav = function() {
      $scope.sidenav = !$scope.sidenav;
    };

    $scope.selectedLandcover = null;
    $scope.setSelectedLandcover = function(lid) {
      $scope.selectedLandcover = lid;
    };
    $scope.landcoverIsSelected = function(lid) {
      return ($scope.selectedLandcover == lid);
    };

    $scope.year = null;
    $scope.setYear = function(year) {
      $scope.year = year;
    };
    $scope.yearIs = function(year) {
      return ($scope.year == year);
    };

    $scope.modalDialogTemplate = null;

    $scope.cellImgs =  ["",
      "Landcover_Corn.png",
      "Landcover_Conservation_Corn.png",
      "Landcover_Soybean.png",
      "Landcover_Conservation_Soybean.png",
      "Landcover_Alfalfa.png",
      ["Landcover_Permanent_Pasture.png", "Landcover_Permanent_Pasture_No_Cattle.png"],
      ["Landcover_Rotational_Grazing.png", "Landcover_Rotational_Grazing_No_Cattle.png"],
      ["Landcover_Hay.png", "Landcover_Grass_Hay_No_Bales.png"],
      "Landcover_Prairie.png",
      "Landcover_Conservation_Forest.png",
      "Landcover_Conventional_Forest.png",
      "Landcover_Herbaceous_Bioenergy.png",
      "Landcover_Woody_Bioenergy.png",
      "Landcover_Wetland.png",
      "Landcover_Mixed_Fruit_and_Vegetable.png"];
  }
])

.controller('LandCoverSelectCtrl', ['$scope', '$http', '$location',
  function($scope, $http, $location) {
    $http.get($location.absUrl() + 'data/landcovers.json').success(
      function(response) {
        console.log(response);
        $scope.landcovers = response;
      }
    )
  }
])

.controller('FeaturesSelectCtrl', ['$scope', '$http', '$location',
  function($scope, $http, $location) {
    $http.get($location.absUrl() + 'data/features.json').success(
      function(response) {
        console.log(response);
        $scope.features = response;
      }
    )
  }
])

.directive('appModal', ['$compile',
    function($compile) {
      return {
        scope: '=',
        link: function(scope, element, attrs) {
          element.attr('data-toggle', 'modal');
          element.attr('data-target', '#modalDialog');

          element.on('click', function() {
            scope.$apply(scope.modalDialogTemplate = 'partials/modals/' + attrs['appModal'] + '.modal.html');
          });
        }
      };
    }
  ]
);
