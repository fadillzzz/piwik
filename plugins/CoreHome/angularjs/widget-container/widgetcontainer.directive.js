/*!
 * Piwik - free/libre analytics platform
 *
 * @link http://piwik.org
 * @license http://www.gnu.org/licenses/gpl-3.0.html GPL v3 or later
 */

/**
 * Example:
 * <div piwik-widget-container container="widget"></div>
 */
(function () {
    angular.module('piwikApp').directive('piwikWidgetContainer', piwikWidgetContainer);

    piwikWidgetContainer.$inject = ['piwik', '$location'];

    function piwikWidgetContainer(piwik, $location){
        return {
            restrict: 'A',
            scope: {
                container: '='
            },
            templateUrl: 'plugins/CoreHome/angularjs/widget-container/widgetcontainer.directive.html?cb=' + piwik.cacheBuster,
            compile: function (element, attrs) {

                return function (scope, element, attrs, ngModel) {

                    function getFullWidgetUrl(widget) {
                        var params_vals = widget.widget_url.substr(1).split("&");

                        // available in global scope
                        var currentHashStr = $location.path();

                        if (currentHashStr.length != 0) {
                            for (var i = 0; i < params_vals.length; i++) {
                                currentHashStr = piwik.broadcast.updateParamValue(params_vals[i], currentHashStr);
                            }
                        }

                        return '?' + currentHashStr.substr(1);
                    }

                    angular.forEach(scope.container.widgets, function (widget) {
                        widget.html_url = getFullWidgetUrl(widget);
                    });
                };
            }
        };
    }
})();