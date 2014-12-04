angular.module('plunker', [
	'ui.bootstrap.datetimepicker'
	])

var DateTimePickerDemoCtrl = function ($scope, $timeout) {
	$scope.dateTimeNow = function() {
		$scope.date = new Date();
	};
//	$scope.dateTimeNow();

	$scope.toggleMinDate = function() {
		$scope.minDate = $scope.minDate ? null : new Date();
	};

	$scope.maxDate = new Date('2014-06-22');
	$scope.toggleMinDate();
	$scope.disabled = false;

	$scope.dateOptions = {
		startingDay: 1,
		showWeeks: false
	};

	$scope.disable = function() {
		$scope.disabled = !$scope.disabled;
	};

	// Disable weekend selection
	$scope.disableWeekend = function(calendarDate, mode) {
		return mode === 'day' && ( calendarDate.getDay() === 0 || calendarDate.getDay() === 6 );
	};

	$scope.hourStep = 2;
	$scope.minuteStep = 15;

	$scope.timeOptions = {
		hourStep: [1, 2, 3],
		minuteStep: [1, 5, 10, 15, 25, 30]
	};

	$scope.showMeridian = true;
	$scope.showWeeks = true;
	$scope.timeToggleMode = function() {
		$scope.showMeridian = !$scope.showMeridian;
	};
};