angular.module('ui.bootstrap.datetimepicker', [
	"ui.bootstrap"
])

.directive('datetimepicker', [
	function () {
		if (angular.version.full < '1.1.4') {
			return {
				restrict: 'EA',
				template: "<div class=\"alert alert-danger\">Angular 1.1.4 or above is required for datetimepicker to work correctly</div>"
			};
		}
		return {
			restrict: 'EA',
			require: 'ngModel',
			scope: {
				ngModel: '=',
				dayFormat: "=",
				monthFormat: "=",
				yearFormat: "=",
				dayHeaderFormat: "=",
				dayTitleFormat: "=",
				monthTitleFormat: "=",
				showWeeks: "=",
				startingDay: "=",
				yearRange: "=",
				dateFormat: "=",
				ngDisabled: '=',
				minDate: "=",
				maxDate: "=",
				dateOptions: "=",
				dateDisabled: "&",
				ngChange: '&',
				changeDelay: '=',
				hourStep: "=",
				minuteStep: "=",
				showMeridian: "=",
				meridians: "=",
				mousewheel: "=",
				readonlyTime: "@"
			},
			template: function (elem, attrs) {

				var showTime = angular.isDefined(attrs['showTime']) || false;

				function dashCase(name, separator) {
					return name.replace(/[A-Z]/g, function (letter, pos) {
						return (pos ? '-' : '') + letter.toLowerCase();
					});
				}

				function createAttr(innerAttr, dateTimeAttrOpt) {
					var dateTimeAttr = angular.isDefined(dateTimeAttrOpt) ? dateTimeAttrOpt : innerAttr;
					if (attrs[dateTimeAttr]) {
						return dashCase(innerAttr) + "=\"" + dateTimeAttr + "\" ";
					} else {
						return '';
					}
				}

				function createFuncAttr(innerAttr, funcArgs, dateTimeAttrOpt) {
					var dateTimeAttr = angular.isDefined(dateTimeAttrOpt) ? dateTimeAttrOpt : innerAttr;
					if (attrs[dateTimeAttr]) {
						return dashCase(innerAttr) + "=\"" + dateTimeAttr + "({" + funcArgs + "})\" ";
					} else {
						return '';
					}
				}

				function createEvalAttr(innerAttr, dateTimeAttrOpt) {
					var dateTimeAttr = angular.isDefined(dateTimeAttrOpt) ? dateTimeAttrOpt : innerAttr;
					if (attrs[dateTimeAttr]) {
						return dashCase(innerAttr) + "=\"" + attrs[dateTimeAttr] + "\" ";
					} else {
						return dashCase(innerAttr);
					}
				}

				function createAttrConcat(previousAttrs, attr) {
					return previousAttrs + createAttr.apply(null, attr)
				}
				var tmpl = "<div class=\"datetimepicker-wrapper\">" +
					"<input class=\"form-control\" ng-change='date_change()' type=\"text\" ng-click=\"open($event)\" is-open=\"opened\" ng-model=\"ngModel\" " + [
					["minDate"],
					["ngDisabled"],
					["maxDate"],
					["dayFormat"],
					["monthFormat"],
					["yearFormat"],
					["dayHeaderFormat"],
					["dayTitleFormat"],
					["monthTitleFormat"],
					["startingDay"],
					["yearRange"],
					["datepickerOptions", "dateOptions"]
				].reduce(createAttrConcat, '') +
					createFuncAttr("dateDisabled", "date: date, mode: mode") +
					createEvalAttr("datepickerPopup", "dateFormat") +
					createEvalAttr('currentText') +
					createEvalAttr('closeText') +
					createEvalAttr('clearText') +
					"/>\n" +
//					"<span class=\"input-group-btn\">" +
//						"<button type=\"button\" class=\"btn btn-default\" ng-click=\"open($event)\"><i class=\"glyphicon glyphicon-calendar\"></i></button>" +
//					"</span>" +
					"</div>\n";

				if(showTime) {
					tmpl +=
						"<div class=\"datetimepicker-wrapper\" ng-model=\"time\" ng-change=\"time_change()\" style=\"display:inline-block\">\n" +
						"<timepicker hour-step='ngDisabled ? 0 : (hourStep ? hourStep : 1)' minute-step='ngDisabled ? 0 : (minuteStep ? minuteStep : 1)' " + [
						["showMeridian"],
						["meridians"],
						["mousewheel"]
					].reduce(createAttrConcat, '') +
						createEvalAttr("readonlyInput", "readonlyTime") +
						"></timepicker>\n" +
						"</div>";
				}
				return tmpl;
			},
			controller: ['$scope', '$attrs', '$timeout', function ($scope, $attrs, $timeout) {

				var delay = $scope.changeDelay;
				var timer = false;
				if (!angular.isDefined(delay)) {
					delay = 0;
				}
				var publishChange = function () {
					if (timer) {
						$timeout.cancel(timer);
					}
					timer = $timeout(function () {
						if (angular.isDefined($scope.ngChange)) {
							$scope.ngChange();
							timer = false;
						}
					}, delay);
				};
				$scope.date_change = function () {
					publishChange();
				};
				$scope.time_change = function () {
					if (!$scope.ngDisabled && angular.isDefined($scope.ngModel) && angular.isDefined($scope.time)) {
						$scope.ngModel.setHours($scope.time.getHours(), $scope.time.getMinutes());
						publishChange();
					}
				};
				/*$scope.resetTime = function() {
					console.log("placeholder");
				};*/

				$scope.open = function ($event) {
					$event.preventDefault();
					$event.stopPropagation();
					if (!$scope.ngDisabled) {
						$scope.opened = true;
					}
				};
			}],
			link: function (scope) {
				scope.$watch(function () {
					return scope.ngModel;
				}, function (ngModel) {
					scope.time = ngModel;
				});
			}
		}
	}
]);
