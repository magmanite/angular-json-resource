/**
 * Angular Json Resource - AngularJS directive to pre-load JSON resource.
 *
 * @version v1.0.0
 * @link http://github.com/magmanite/angular-json-resource
 * @author Hendri Kurniawan <hendri@magmanite.com>
 * @license MIT
 */
;(function(angular) {
    'use strict';

    angular.module('json-resource', [])
        .factory('jsonResourceCache', ['$cacheFactory', function($cacheFactory) {
            return $cacheFactory('jsonResourceCache');
        }])
        .factory('resourceCacheHttpFactoryInterceptor', ['jsonResourceCache', function(jsonResourceCache) {
            return {
                request: function(config) {
                    if (!config.cache && jsonResourceCache.get(config.url)) {
                        config.cache = jsonResourceCache;
                    }
                    return config;
                }
            };
        }])
        .config(['$httpProvider', function($httpProvider) {
            $httpProvider.interceptors.push('resourceCacheHttpFactoryInterceptor');
        }])
        .directive('jsonResource', ['$log', 'jsonResourceCache', function($log, jsonResourceCache) {
            return {
                link: function(scope, element, attrs) {
                    if (attrs.jsonResource) {
                        jsonResourceCache.put(attrs.jsonResource, element.html());
                    } else if (attrs.resource) {
                        jsonResourceCache.put(attrs.resource, element.html());
                    } else {
                        $log.error('Cannot find resource URL, please specify resource attribute.');
                    }
                }
            };
        }]);
})(angular);
