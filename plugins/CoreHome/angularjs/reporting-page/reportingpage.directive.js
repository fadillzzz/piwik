/*!
 * Piwik - free/libre analytics platform
 *
 * @link http://piwik.org
 * @license http://www.gnu.org/licenses/gpl-3.0.html GPL v3 or later
 */

/**
 * Example:
 * <div piwik-reporting-menu></div>
 */
(function () {
    angular.module('piwikApp').directive('piwikReportingPage', piwikReportingPage);

    piwikReportingPage.$inject = ['$document', 'piwik', '$filter', 'piwikApi', '$rootScope', '$location'];

    function piwikReportingPage($document, piwik, $filter, piwikApi, $rootScope, $location){
        return {
            restrict: 'A',
            scope: {
            },
            templateUrl: 'plugins/CoreHome/angularjs/reporting-page/reportingpage.directive.html?cb=' + piwik.cacheBuster,
            compile: function (element, attrs) {

                return function (scope, element, attrs, ngModel) {

                    scope.renderPage = function (init) {
                        scope.widgets = [];
                        scope.pageContentUrl  = '';
                        scope.evolutionReport = '';
                        scope.sparklineReport = '';

                        // all this should be done via ng routes, url depends otherwise on translated category/subcategory which is no good
                        // this might also fix related reports?!? we need to generate module/action for category/subcategory!
                        var category = piwik.broadcast.getValueFromHash('category');
                        var subcategory = piwik.broadcast.getValueFromHash('subcategory');

                        if ((!category || !subcategory) && init) {
                            var path = $location.path();
                            if (-1 === path.indexOf('module=CoreHome&action=index')) {
                                // eg if dashboard url is given in hash
                                scope.pageContentUrl = '?' + $location.path().substr(1);
                            }

                            return;
                        }

                        // todo also check for module & action
                        if (!category || !subcategory) {
                            // load old fashioned way
                            scope.pageContentUrl = '?' + $location.path().substr(1);
                            return;
                        }

                        // todo we actually have this data already from reporting menu, we should use angular routes
                        // here for even faster performance
                        // could also extract it in service could solve it as well
                        piwikApi.fetch({
                            method: 'API.getPageMetadata',
                            categoryId: category,
                            subcategoryId: subcategory
                        }).then(function (response) {
                            var widgets = [];
                            angular.forEach(response.widgets, function (widget) {
                                if (widget.viewDataTable && widget.viewDataTable === 'graphEvolution') {
                                    scope.evolutionReport = widget;
                                } else if (widget.viewDataTable && widget.viewDataTable === 'sparklines') {
                                    widget.sparklineReport = widget;
                                } else {
                                    widgets.push(widget);
                                }
                            });

                            widgets = $filter('orderBy')(widgets, 'order');

                            var groupedWidgets = [];

                            if (widgets.length === 1) {
                                // if there is only one widget, we always display it full width
                                groupedWidgets = widgets;
                            } else {
                                for (var i = 0; i < widgets.length; i++) {
                                    var widget = widgets[i];

                                    if (widget.isContainer) {
                                        groupedWidgets.push(widget);
                                    } else {
                                        var group = [widget];
                                        // we move widgets into groups of 2 (the last one before a container can only contain 1)
                                        if (widgets[i+1] && !widgets[i+1].isContainer) {
                                            i++;
                                            group.push(widgets[i]);
                                        }

                                        groupedWidgets.push({group: group});
                                    }
                                }
                            }

                            scope.widgets = groupedWidgets;
                        });
                    }

                    scope.renderPage(true);

                    $rootScope.$on('$locationChangeSuccess', function () {

                        scope.renderPage();
                    });

                };
            }
        };
    }
})();