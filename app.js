angular.module('pewi', [])

.value('selectedLandcover', null)

.constant('cellImgs', [
    "",
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
    "Landcover_Mixed_Fruit_and_Vegetable.png"]
)

.controller('MainCtrl', ['$scope','$http','$location', 'selectedLandcover',
  function($scope, $http, $location, selectedLandcover) {
    $http.get($location.absUrl() + 'data/data.json').success(
      function(response) {
        $scope.data = response.data;
      }
    );
    $scope.selectedLandcover = null;
    $scope.sidenav = true;
    $scope.toggleSidenav = function() {
      $scope.sidenav = !$scope.sidenav;
    };

    $scope.year = null;
    $scope.setYear = function(year) {
      $scope.year = year;
    };
    $scope.yearIs = function(year) {
      return ($scope.year == year);
    };

    $scope.modalDialogTemplate = null;
  }
])

.controller('LandCoverSelectCtrl', ['$scope', '$http', '$location', 'selectedLandcover',
  function($scope, $http, $location, selectedLandcover) {
    $http.get($location.absUrl() + 'data/landcovers.json').success(
      function(response) {
        $scope.landcovers = response;
      }
    );
    $scope.setSelectedLandcover = function(lid) {
      $scope.$parent.selectedLandcover = lid;
    };
    $scope.landcoverIsSelected = function(lid) {
      return ($scope.$parent.selectedLandcover == lid);
    };
  }
])

.controller('FeaturesSelectCtrl', ['$scope', '$http', '$location',
  function($scope, $http, $location) {
    $http.get($location.absUrl() + 'data/features.json').success(
      function(response) {
        $scope.features = response;
      }
    )
  }
])

.directive('appWatershed', ['selectedLandcover', 'cellImgs',
    function(selectedLandcover, cellImgs) {
      return {
        scope: false,
        link: function(scope, element, attrs) {
          //console.log(typeof cellImgs[scope.landcover]);
          scope.src = (typeof cellImgs[scope.landcover] == 'object') ? cellImgs[scope.landcover][Math.floor(Math.random() * 2)] : cellImgs[scope.landcover];
          scope.setLandcover = function(rid, landcover) {
            console.log(scope);
            scope.landcover = landcover;
            console.log(landcover);
            scope.src = (typeof cellImgs[scope.landcover] == 'object') ? cellImgs[scope.landcover][Math.floor(Math.random() * 2)] : cellImgs[scope.landcover];
          };
        }
      }
    }
  ]
)

.directive('appModal', ['$compile',
    function($compile) {
      return {
        //scope: '=',
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
