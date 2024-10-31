
/**
 *
 * @author  AWcode.com
 * @link    https://getsavlvador.com/
 * @version 0.0.1
 */
(function($) {
    'use strict';

    /**
     * All of the code for your admin-facing JavaScript source
     * should reside in this file.
     *
     * Note: It has been assumed you will write jQuery code here, so the
     * $ function reference has been prepared for usage within the scope
     * of this function.
     *
     * This enables you to define handlers, for when the DOM is ready:
     *
     * $(function() {
     *
     * });
     *
     * When the window is loaded:
     *
     * $( window ).load(function() {
     *
     * });
     *
     * ...and/or other possibilities.
     *
     * Ideally, it is not considered best practise to attach more than a
     * single DOM-ready or window-load handler for a particular page.
     * Although scripts in the WordPress core, Plugins and Themes may be
     * practising this, we should strive to set a better example in our own work.
    */

    /**
     * SalvadorWordPressAdmin
     * 
     * @abstract
     */
    var SalvadorWordPressAdmin = (function() {

        /**
         * Properties
         * 
         */

        /**
         * __browseRouterChangeDetectionInterval
         * 
         * @access  private
         * @var     Number (default: 1500)
         */
        var __browseRouterChangeDetectionInterval = 1500;

        /**
         * __salvadorCompiledWordPressPath
         * 
         * @access  private
         * @var     String (default: '/dalle/app/static/compiled/wordPress.js')
         */
        //var __salvadorCompiledWordPressPath = '/dalle/app/static/compiled/wordPress.js';
        var __salvadorCompiledWordPressPath = '?salvador_admin_js=1';

        /**
         * __filenames
         * 
         * @access  private
         * @var     Object
         */
        var __filenames = {
            admin: 'salvador-admin.js',
            wordPressUtils: 'WordPressUtils.js.del'
        };

        /**
         * __salvadorHosts
         * 
         * @access  private
         * @var     Object
         */
        var __salvadorHosts = {
            local: WPURLS.siteurl,
            dev: WPURLS.siteurl,
            prod: WPURLS.siteurl
        };

        /**
         * __mediaFramePostBrowserRouterOverrideMethod
         * 
         * @notes   'extend' or 'overwrite'
         * @access  private
         * @var     String (default: 'overwrite')
         */
        var __mediaFramePostBrowserRouterOverrideMethod = 'overwrite';

        /**
         * __mediaFrameSelectBrowserRouterOverrideMethod
         * 
         * @notes   'extend' or 'overwrite'
         * @access  private
         * @var     String (default: 'overwrite')
         */
        var __mediaFrameSelectBrowserRouterOverrideMethod = 'overwrite';

        /**
         * __messages
         * 
         * @access  private
         * @var     Object
         */
        var __messages = {
            failed: 'Could not load Salvador. Please contact ' +
                'support@getsalvador.com for help.'
        };

        /**
         * __overrideIntervalCheckDuration
         * 
         * @access  private
         * @var     Number (default: 10)
         */
        var __overrideIntervalCheckDuration = 10;

        /**
         * __timeout
         * 
         * @access  private
         * @var     Number (default: 5000)
         */
        var __timeout = 5000;

        /**
         * Methods
         * 
         */

        /**
         * __attempt
         * 
         * @access  private
         * @param   Function closure
         * @return  mixed|null
         */
        var __attempt = function(closure) {
            try {
                var response = closure();
                return response;
            } catch (err) {
            }
            return null;
        };

        /**
         * __callbacks
         * 
         * @access  private
         * @var     Object
         */
        var __callbacks = {

            /**
             * error
             * 
             * @access  private
             * @return  Boolean
             */
            error: function() {
                var editPostPage = window.location.pathname.indexOf('wp-admin/post.php') !== -1;
                if (editPostPage === false) {
                    return false;
                }
                var msg = __messages.failed;
                alert(msg);
                return true;
            },

            /**
             * success
             * 
             * @access  private
             * @return  void
             */
            success: function() {
                window.SalvadorWordPressUtils.init($);
            }
        };

        /**
         * __extendMediaFramePostBrowseRouterClosure
         * 
         * @access  private
         * @return  void
         */
        var __extendMediaFramePostBrowseRouterClosure = function() {
            var callback = function() {
                    if (__mediaFramePostBrowseRouterProxied() === false) {
                        var originalReference = window.wp.media.view.MediaFrame.Post;
                        window.wp.media.view.MediaFrame.Post = originalReference.extend({
                            browseRouter: function(routerView) {
                                SalvadorWordPressUtils;
                                var args = arguments;
                                args = [].slice.call(args);
                                originalReference.prototype.browseRouter.apply(this, args);
                                __handleMediaFramePostBrowserRouterCallback.apply(window, args);
                            }
                        });
                    }
                },
                period = __browseRouterChangeDetectionInterval,
                reference = setInterval(callback, period);
            callback();
        };

        /**
         * __extendMediaFrameSelectBrowseRouterClosure
         * 
         * @access  private
         * @return  void
         */
        var __extendMediaFrameSelectBrowseRouterClosure = function() {
            var callback = function() {
                    if (__mediaFrameSelectBrowseRouterProxied() === false) {
                        var originalReference = window.wp.media.view.MediaFrame.Select;
                        window.wp.media.view.MediaFrame.Select = originalReference.extend({
                            browseRouter: function(routerView) {
                                SalvadorWordPressUtils;
                                var args = arguments;
                                args = [].slice.call(args);
                                originalReference.prototype.browseRouter.apply(this, args);
                                __handleMediaFrameSelectBrowserRouterCallback.apply(window, args);
                            }
                        });
                    }
                },
                period = __browseRouterChangeDetectionInterval,
                reference = setInterval(callback, period);
            callback();
        };

        /**
         * __getHost
         * 
         * @access  private
         * @return  String
         */
        var __getHost = function() {
            var role = __getRole(),
                hosts = __salvadorHosts,
                host = hosts[role];
            return host;
        };

        /**
         * __getHour
         * 
         * @access  private
         * @return  String
         */
        var __getHour = function() {
            var currentDate = new Date(),
                hour = currentDate.getDate() + '/'
                    + (currentDate.getMonth() + 1)  + '/'
                    + currentDate.getFullYear() + '@'
                    + currentDate.getHours() + ':'
                    + '00:'
                    + '00';
            return hour;
        };

        /**
         * __getLocalWordPressScriptPath
         * 
         * @access  private
         * @return  null|String
         */
        var __getLocalWordPressScriptPath = function() {
            var role = __getRole(),
                path = __attempt(__getPluginWordPressUtilsPath);
            if (path === null) {
                return null;
            }
            if (role === 'local') {
                path = __salvadorCompiledWordPressPath;
            }
            var queryString = __getQueryString();
            path = (path) + '?' + (queryString);
            return path;
        };

        /**
         * __getPluginVersion
         * 
         * @access  private
         * @return  null|String
         */
        var __getPluginVersion = function() {
            var adminFilename = __filenames.admin,
                src = $('script[src*="' + (adminFilename) + '"]').first().attr('src'),
                matches = src.match(/ver=([0-9\.]+)/);
            if (matches === null) {
                return null;
            }
            var version = matches.pop();
            return version;
        };

        /**
         * __getPluginWordPressUtilsPath
         * 
         * @access  private
         * @return  String
         */
        var __getPluginWordPressUtilsPath = function() {
            var adminFilename = __filenames.admin,
                wordPressUtilsFilename = __filenames.wordPressUtils,
                src = $('script[src*="' + (adminFilename) + '"]').first().attr('src');
            src = src.replace(adminFilename, wordPressUtilsFilename);
            var host = window.location.host;
            src = src.split(host).pop();
            return src;
        };

        /**
         * __getQueryData
         * 
         * @access  private
         * @return  Object
         */
        var __getQueryData = function() {
            var queryData = {
                hour: __getHour(),
                timezone: __getTimezone(),
                version: __getPluginVersion()
            };
            if (queryData.version === null) {
                delete queryData.version;
            }
            return queryData;
        };

        /**
         * __getQueryString
         * 
         * @access  private
         * @return  String
         */
        var __getQueryString = function() {
            var queryData = __getQueryData(),
                queryString = jQuery.param(queryData);
            return queryString;
        };

        /**
         * __getRemoteWordPressScriptURL
         * 
         * @access  private
         * @return  String
         */
        var __getRemoteWordPressScriptURL = function() {
            var host = __getHost(),
                path = __salvadorCompiledWordPressPath,
                queryString = __getQueryString(),
                url =  (host) + (path) + '?' + (queryString);
            return url;
        };

        /**
         * __getRole
         * 
         * @access  private
         * @return  String
         */
        var __getRole = function() {
            if (window.location.host === 'local.getsalvador.com') {
                var role = 'local';
                return role;
            }
            if (window.location.host === 'dev.getsalvador.com') {
                var role = 'dev';
                return role;
            }
            var role = 'prod';
            return role;
        };

        /**
         * __getTimezone
         * 
         * @see     https://stackoverflow.com/questions/1954397/detect-timezone-abbreviation-using-javascript
         * @see     https://stackoverflow.com/a/34405528/115025
         * @access  private
         * @return  String
         */
        var __getTimezone = function() {
            var currentDate = new Date(),
                lang = 'en-us',
                localeTimeString = currentDate.toLocaleTimeString(lang, {
                    timeZoneName: 'short'
                }),
                pieces = localeTimeString.split(' '),
                timezone = 'unknown';
            if (pieces.length > 2) {
                timezone = pieces[2];
            }
            return timezone;
        };

        /**
         * __handleMediaFramePostBrowserRouterCallback
         * 
         * @access  private
         * @param   Object routerView
         * @return  void
         */
        var __handleMediaFramePostBrowserRouterCallback = function(routerView) {
            SalvadorWordPressUtils.manage.browseRouter(routerView);
        };

        /**
         * __handleMediaFrameSelectBrowserRouterCallback
         * 
         * @access  private
         * @param   Object routerView
         * @return  void
         */
        var __handleMediaFrameSelectBrowserRouterCallback = function(routerView) {
            SalvadorWordPressUtils.manage.browseRouter(routerView);
        };

        /**
         * __loadLocalWordPressScript
         * 
         * @access  private
         * @param   Function error
         * @return  void
         */
        var __loadLocalWordPressScript = function(error) {
            var path = __getLocalWordPressScriptPath(),
                url = path,
                success = __callbacks.success;
            if (path === null) {
                error();
            } else {
                __loadScript(url, success, error);
            }
        };

        /**
         * __loadRemoteWordPressScript
         * 
         * @access  private
         * @param   Function error
         * @return  void
         */
        var __loadRemoteWordPressScript = function(error) {
            var url = __getRemoteWordPressScriptURL(),
                success = __callbacks.success;
            __loadScript(url, success, error);
        };

        /**
         * __loadScript
         * 
         * @see     https://api.jquery.com/jquery.getscript/
         * @access  private
         * @param   String url
         * @param   Function success
         * @param   Function error
         * @return  void
         */
        var __loadScript = function(url, success, error) {
            $.ajax({
                cache: true,
                dataType: 'script',
                error: error,
                success: success,
                timeout: __timeout,
                url: url
            });
        };

        /**
         * __loadWordPressScript
         * 
         * @access  private
         * @return  void
         */
        var __loadWordPressScript = function() {
            var error = function() {
                var error = __callbacks.error;
                __loadLocalWordPressScript(error);
            };
            __loadRemoteWordPressScript(error);
        };

        /**
         * __mediaFramePostBrowseRouterProxied
         * 
         * @access  private
         * @return  Boolean
         */
        var __mediaFramePostBrowseRouterProxied = function() {
            var callback = window.wp.media.view.MediaFrame.Post.prototype.browseRouter,
                str = callback.toString();
            if (str.match(/SalvadorWordPressUtils/) === null) {
                return false;
            }
            return true;
        };

        /**
         * __mediaFrameSelectBrowseRouterProxied
         * 
         * @access  private
         * @return  Boolean
         */
        var __mediaFrameSelectBrowseRouterProxied = function() {
            var callback = window.wp.media.view.MediaFrame.Select.prototype.browseRouter,
                str = callback.toString();
            if (str.match(/SalvadorWordPressUtils/) === null) {
                return false;
            }
            return true;
        };

        /**
         * __override
         * 
         * @access  private
         * @var     Object
         */
        var __override = {

            /**
             * mediaFramePostBrowseRouter
             * 
             * @access  private
             * @return  void
             */
            mediaFramePostBrowseRouter: function() {
                var scope = 'window.wp.media.view.MediaFrame.Post.prototype.browseRouter',
                    callback = function() {
                        __setMediaFramePostBrowseRouterChangeDetectionInterval();
                    };
                __override.reference(scope, callback);
            },

            /**
             * mediaFrameSelectBrowseRouter
             * 
             * @access  private
             * @return  void
             */
            mediaFrameSelectBrowseRouter: function() {
                var scope = 'window.wp.media.view.MediaFrame.Select.prototype.browseRouter',
                    callback = function() {
                        __setMediaFrameSelectBrowseRouterChangeDetectionInterval();
                    };
                __override.reference(scope, callback);
            },

            /**
             * modalOpen
             * 
             * @access  private
             * @return  void
             */
            modalOpen: function() {
                var scope = 'window.wp.media.view.Modal.prototype.on',
                    callback = function() {
                        var openModalCallback = function() {
                            SalvadorWordPressUtils.manage.modalOpen(this);
                        };
                        window.wp.media.view.Modal.prototype.on(
                            'open',
                            openModalCallback
                        );
                    };
                __override.reference(scope, callback);
            },

            /**
             * reference
             * 
             * @access  private
             * @param   String scope
             * @param   Function callback
             * @return  void
             */
            reference: function(scope, callback) {
                var interval,
                    check = function() {
                        if (__validReference(scope) === true) {
                            clearInterval(interval);
                            callback();
                        }
                    },
                    intervalCheckDuration = __overrideIntervalCheckDuration;
                interval = setInterval(check, intervalCheckDuration);
            }
        };

        /**
         * __overwriteMediaFramePostBrowseRouterClosure
         * 
         * @access  private
         * @return  void
         */
        var __overwriteMediaFramePostBrowseRouterClosure = function() {
            var callback = function() {
                    if (__mediaFramePostBrowseRouterProxied() === false) {
                        var originalCall = window.wp.media.view.MediaFrame.Post.prototype.browseRouter;
                        window.wp.media.view.MediaFrame.Post.prototype.browseRouter = function() {
                            SalvadorWordPressUtils;
                            var args = arguments;
                            args = [].slice.call(args);
                            originalCall.apply(window, args);
                            __handleMediaFramePostBrowserRouterCallback.apply(window, args);
                        };
                    }
                },
                period = __browseRouterChangeDetectionInterval,
                reference = setInterval(callback, period);
            callback();
        };

        /**
         * __overwriteMediaFrameSelectBrowseRouterClosure
         * 
         * @access  private
         * @return  void
         */
        var __overwriteMediaFrameSelectBrowseRouterClosure = function() {
            var callback = function() {
                    if (__mediaFrameSelectBrowseRouterProxied() === false) {
                        var originalCall = window.wp.media.view.MediaFrame.Select.prototype.browseRouter;
                        window.wp.media.view.MediaFrame.Select.prototype.browseRouter = function() {
                            SalvadorWordPressUtils;
                            var args = arguments;
                            args = [].slice.call(args);
                            originalCall.apply(window, args);
                            __handleMediaFrameSelectBrowserRouterCallback.apply(window, args);
                        };
                    }
                },
                period = __browseRouterChangeDetectionInterval,
                reference = setInterval(callback, period);
            callback();
        };

        /**
         * __setMediaFramePostBrowseRouterChangeDetectionInterval
         * 
         * @access  private
         * @return  void
         */
        var __setMediaFramePostBrowseRouterChangeDetectionInterval = function() {
            var method = __mediaFramePostBrowserRouterOverrideMethod;
            if (method === 'extend') {
                __extendMediaFramePostBrowseRouterClosure();
            }
            if (method === 'overwrite') {
                __overwriteMediaFramePostBrowseRouterClosure();
            }
        };

        /**
         * __setMediaFrameSelectBrowseRouterChangeDetectionInterval
         * 
         * This method exists because while debugging why a specific WordPress
         * website wasn't working, I found out that certain plugins may also
         * take over the browseRouter function.
         * 
         * The specific example I found was Envato Elements (v1.0.2), whereby it
         * would override the browseRouter callback I specified.
         * 
         * So to deal with this, I run an interval, and if it's found that the
         * browseRouter callback does not conclusively contain Salvador logic, I
         * create a wrapper of that new callback, and then add the
         * browseRouterCallback value I need for the Salvador WordPress Plugin to
         * work properly.
         * 
         * @access  private
         * @return  void
         */
        var __setMediaFrameSelectBrowseRouterChangeDetectionInterval = function() {
            var method = __mediaFrameSelectBrowserRouterOverrideMethod;
            if (method === 'extend') {
                __extendMediaFrameSelectBrowseRouterClosure();
            }
            if (method === 'overwrite') {
                __overwriteMediaFrameSelectBrowseRouterClosure();
            }
        };

        /**
         * _validReference
         * 
         * @access  private
         * @param   String str
         * @return  Boolean
         */
        var __validReference = function(str) {
            var pieces = str.split('.'),
                index,
                reference = window;
            for (index in pieces) {
                if (isNaN(index) === true) {
                    continue;
                }
                reference = reference[pieces[index]];
                if (reference === undefined) {
                    return false;
                }
                if (reference === null) {
                    return false;
                }
            }
            return true;
        };

        // Public
        return {

            /**
             * Methods
             * 
             */

            /**
             * init
             * 
             * @note    The override methods are required to be called in this
             *          (salvador-admin.js) file rather than the loaded
             *          WordPressUtils.js.del file because in the newest WordPress
             *          (5.0.3), the "Set featured image" in the right column
             *          of a post/page is actually instantiated before the
             *          WordPressUtils.js.del file is loaded.
             *          This means that the prototype objects/references aren't
             *          overridden at the time that specific MediaFrame view
             *          objects are made, which results in the code not properly
             *          running in time.
             * @access  public
             * @return  void
             */
            init: function() {
                // __override.mediaFramePostBrowseRouter();
                __override.mediaFrameSelectBrowseRouter();
                __override.modalOpen();
                $(document).ready(function($) {
                    __loadWordPressScript();
                });
            }
        };
    })();

    // We landed on the moon!
    SalvadorWordPressAdmin.init();
})(jQuery);


window.onmessage = function(e) {
    console.log(e)
    if(e.data.app == 'salvador') {
        jQuery.ajax({
            type: "POST",
            url: ajaxurl,
            data: { action: 'salvador_fetch_image' , url: e.data.url, alt: e.data.alt }
        }).done(function( msg ) {
            if(msg.status  == 'ok'){
                jQuery("#menu-item-browse").click();
                if(wp.media.frame.content.get()!==null){
                    wp.media.frame.content.get().collection.props.set({ignore: (+ new Date())});
                    wp.media.frame.content.get().options.selection.reset();
                }else{
                    wp.media.frame.library.props.set({ignore: (+ new Date())});
                }
                setTimeout(function(){
                    jQuery('.attachments-wrapper .attachments li[data-id='+msg.image+']').click()
                }, 600)

            }else{
                alert( "Data Saved: " + msg.status );
            }
        });

    }else if(e.data.app == 'salvador_settings') {
        jQuery.ajax({
            type: "POST",
            url: ajaxurl,
            data: { action: 'salvador_save_settings' , key: e.data.key }
        }).done(function( msg ) {

        });
    }
};

