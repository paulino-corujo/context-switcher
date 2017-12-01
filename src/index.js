var moduleName = 'contextSwitcher',
    module = angular.module(moduleName, []);

console.log('TEST1');
module.directive('contextSwitcherTest', ['$log', function($log) {
    console.log('TEST2');
    return function() {
        console.log($log);
    };
}]);
