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
    angular.module('piwikApp').directive('piwikReportingMenu', piwikReportingMenu);

    piwikReportingMenu.$inject = ['$document', 'piwik', '$filter', 'piwikApi', '$location', '$timeout'];

    function piwikReportingMenu($document, piwik, $filter, piwikApi, $location, $timeout){

        return {
            restrict: 'A',
            scope: {
            },
            templateUrl: 'plugins/CoreHome/angularjs/reporting-menu/reportingmenu.directive.html?cb=' + piwik.cacheBuster,
            compile: function (element, attrs) {

                return function (scope, element, attrs, ngModel) {
                    scope.menu = {};

                    var timeoutPromise = null;
                    scope.enterCategory = function (category) {
                        if (timeoutPromise) {
                            $timeout.cancel(timeoutPromise);
                        }
                        angular.forEach(scope.menu, function (cat) {
                            cat.hover = false;
                        });
                        category.hover = true;
                    };
                    scope.leaveCategory = function (category) {

                        if (timeoutPromise) {
                            $timeout.cancel(timeoutPromise);
                        }

                        angular.forEach(scope.menu, function (cat) {
                            if (!cat.active) {
                                cat.hover = false;
                            }
                        });

                        timeoutPromise = $timeout(function () {
                            angular.forEach(scope.menu, function (cat) {
                                if (cat.active) {
                                    cat.hover = true;
                                }
                            });
                        }, 2000);
                    };

                    scope.loadSubcategory = function (category, subcategory) {
                        angular.forEach(scope.menu, function (cat) {
                            cat.active = false;
                            cat.hover = false;
                            angular.forEach(cat.subcategories, function (subcat) {
                                subcat.active = false;
                            });
                        });

                        category.active = true;
                        category.hover = true;
                        subcategory.active = true;

                        // TODO this is a hack to make the dashboard widget go away, need to handle this in a route or so
                        $('.top_controls .dashboard-manager').hide();
                        $('#dashboardWidgetsArea').dashboard('destroy');

                        var idSite = broadcast.getValueFromHash('idSite');
                        if (!idSite) {
                            idSite = broadcast.getValueFromUrl('idSite');
                        }
                        var period = broadcast.getValueFromHash('period');
                        if (!period) {
                            period = broadcast.getValueFromUrl('period');
                        }
                        var date   = broadcast.getValueFromHash('date');
                        if (!date) {
                            date = broadcast.getValueFromUrl('date');
                        }

                        var url = 'idSite=' + idSite + '&period=' + period + '&date=' + date + '&';
                        var rand = parseInt(Math.random()* 100000, 10);
                        url += 'random=' + rand+ '&';
                        url += subcategory.html_url;

                        $location.path(url);
                    };

                    var url = $location.path();
                    var activeCategory = piwik.broadcast.getParamValue('category', url);
                    var activeSubCategory = piwik.broadcast.getParamValue('subcategory', url);

                    piwikApi.bulkFetch([
                        {method: 'API.getPagesMetadata'},
                        {method: 'Dashboard.getDashboards'}
                    ]).then(function (response) {
                        var menu = [];

                        var categoriesHandled = {};
                        angular.forEach(response[0], function (page, key) {
                            var category   = page.category;
                            var categoryId = category.id;

                            if (categoriesHandled[categoryId]) {
                                return;
                            }

                            categoriesHandled[categoryId] = true;

                            if (activeCategory && category.id === activeCategory) {
                                category.active = true;
                                category.hover  = true;
                            }

                            category.subcategories = [];

                            angular.forEach(response[0], function (page, key) {
                                if (page.category.id === categoryId) {
                                    var subcategory = page.subcategory;

                                    if (subcategory.id === activeSubCategory) {
                                        subcategory.active = true;
                                    }

                                    subcategory.html_url = 'module=CoreHome&action=index&category=' + categoryId + '&subcategory='+ subcategory.id;
                                    category.subcategories.push(subcategory);
                                }
                            });

                            category.subcategories = $filter('orderBy')(category.subcategories, 'order');

                            menu.push(category);
                        });

                        var dashboards = {
                            name: 'Dashboards',  // TODO use translation
                            order: 1,
                            subcategories: []
                        }

                        angular.forEach(response[1], function (dashboard, key) {
                            var subcategory = dashboard.name;

                            if (!activeCategory) {
                                dashboards.active = true;
                                dashboards.hover  = true;
                            }

                            dashboard.order = key;
                            dashboard.html_url = 'module=Dashboard&action=embeddedIndex&idDashboard=' + dashboard.id;

                            dashboards.subcategories.push(dashboard);
                        });
                        menu.push(dashboards);

                        scope.menu = $filter('orderBy')(menu, 'order');

                        if (!piwik.broadcast.isHashExists()) {
                            scope.loadSubcategory(scope.menu[0], scope.menu[0].subcategories[0]);
                        }
                    });


                };
            }
        };
    }
})();