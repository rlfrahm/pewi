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

.constant('backgrounds', ["Background_Drought.png",
    "Background_Normal.png",
    "Background_Flood.png"])

.value('pewiData', {
  1: null,
  2: null,
  3: null,
  precipitation: null
})

.controller('MainCtrl', ['$scope','$http','$location', 'selectedLandcover', 'precipitation', 'backgrounds',
  function($scope, $http, $location, selectedLandcover, precipitation, backgrounds) {
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

    $scope.background = function() {
      return backgrounds[precipitation.getSeed($scope.year)];
    }
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
)

.directive('appBackground', ['backgrounds', 'precipitation',
  function(backgrounds, precipitation) {
    return {
      link: function(scope,element,attrs) {
        element.css({
          'background-image': 'url(images/backgrounds/'+backgrounds[precipitation.getSeed(scope.year)]+')'
        });
      }
    }
  }
])

.service('precipitation', [
    function() {
      var precipitation = [0,0,0,0];
      var seed = [0,0,0,0];
      var precip = [24.58, 28.18, 30.39, 32.16, 34.34, 36.47, 45.10];

      this.setPrecipitation = function(year, value) {
        if(!value) {
          // Set precipitation for all years
          var r = Math.floor(Math.random() * precip.length);
          precipitation[year] = precip[r];

          if (r === 0 || r === 1) {
            seed[year] = 0;
          } else if (r === 2 || r === 3 || r === 4) {
            seed[year] = 1;
          } else {
            seed[year] = 2;
          }
        } else {

        }
      };

      this.getPrecipitation = function(year) {
        if(year) {
          return precipitation[year];
        } else {
          return precipitation;
        }
      };

      this.getSeed = function(year) {
        if(year) {
          return seed[year];
        } else {
          return seed;
        }
      };

      for(var i=0; i<4; i++) {
        this.setPrecipitation(i);
      }
    }
  ]
);

function setPrecipitation(year, overrideValue) {
  var precip = [24.58, 28.18, 30.39, 32.16, 34.34, 36.47, 45.10];
  if (overrideValue) {
    global.data.precipitation[year] = overrideValue;

    if (global.data.precipitation[year] < 28.19) {
      global.data.r[year] = 0;
    } else if (global.data.precipitation[year] < 36.47) {
      global.data.r[year] = 1;
    } else {
      global.data.r[year] = 2;
    }
  } else {
    var r = Math.floor(Math.random() * precip.length);
    global.data.precipitation[year] = precip[r];

    if (r === 0 || r === 1) {
      global.data.r[year] = 0;
    } else if (r === 2 || r === 3 || r === 4) {
      global.data.r[year] = 1;
    } else {
      global.data.r[year] = 2;
    }
  }
  if(global.data[year] != 0 && global.data[year] != undefined) {
    flagUpdateToTrue(year);
  }
}

function getPrecipitationValue(index) {
  var precip = [24.58, 28.18, 30.39, 32.16, 34.34, 36.47, 45.10];
  return precip[index];
}