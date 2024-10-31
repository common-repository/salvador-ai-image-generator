<?php

/**
 * @wordpress-plugin
 * Plugin Name:       Salvador - AI Image Generator
 * Plugin URI:        https://getsalvador.com
 * Description:       Create AI generated images of anything, to use as featured images or post contents. Powered by Dall-e Open AI
 * Version:           1.0.11
 * Author:            AWcode & KingfisherFox
 * Contributors: 	  awcode, kingfisherfox
 * Author URI:        https://getsalvador.com/
 * Requires at least: 5.0.1
 * License:           GPL-2.0+
 * License URI:       http://www.gnu.org/licenses/gpl-2.0.txt
 * Text Domain:       salvador
 * Domain Path:       /languages
 */

// If this file is called directly, abort.
if ( ! defined( 'WPINC' ) ) {
	die;
}

/**
 * Currently plugin version.
 * Start at version 1.0.0 and use SemVer - https://semver.org
 * Rename this for your plugin and update it as you release new versions.
 */
define( 'SALVADOR_VERSION', '1.0.11' );

/**
 * The code that runs during plugin activation.
 * This action is documented in includes/class-salvador-activator.php
 */
function activate_salvador() {
	require_once plugin_dir_path( __FILE__ ) . 'includes/class-salvador-activator.php';
	Salvador_Activator::activate();
}

/**
 * The code that runs during plugin deactivation.
 * This action is documented in includes/class-salvador-deactivator.php
 */
function deactivate_salvador() {
	require_once plugin_dir_path( __FILE__ ) . 'includes/class-salvador-deactivator.php';
	Salvador_Deactivator::deactivate();
}

register_activation_hook( __FILE__, 'activate_salvador' );
register_deactivation_hook( __FILE__, 'deactivate_salvador' );

/**
 * The core plugin class that is used to define internationalization,
 * admin-specific hooks, and public-facing site hooks.
 */
require plugin_dir_path( __FILE__ ) . 'includes/class-salvador.php';

/**
 * Begins execution of the plugin.
 *
 * Since everything within the plugin is registered via hooks,
 * then kicking off the plugin from this point in the file does
 * not affect the page life cycle.
 *
 * @since    1.0.0
 */
function run_salvador() {

	$plugin = new Salvador();
	$plugin->run();

}
run_salvador();


add_action('wp_ajax_salvador_fetch_image', 'salvador_fetch_image_action_function');

function salvador_fetch_image_action_function(){

	$response = array();
	if ( ! empty($_POST['url'] ) ) {
		$image = media_sideload_image( $_POST['url'], null, $_POST['alt'], 'id' );
		$response['status'] = "ok";
		$response['image'] = $image;
	} else {
		$response['status'] = "You didn't send the param";
	}

	header( "Content-Type: application/json" );
	echo json_encode($response);

	// Don't forget to always exit in the ajax function.
	exit();

}

add_action('wp_ajax_salvador_save_settings', 'salvador_save_settings_action_function');

function salvador_save_settings_action_function()
{
	update_option('salvador_dalle_key', $_POST['key']);

	header( "Content-Type: application/json" );
	echo json_encode(['ok']);
	exit();
}

add_action('parse_request', 'salvador_admin_js_function');
function salvador_admin_js_function()
{
	if($_GET["salvador_admin_js"] ) {
		include('admin/js/salvador-admin-js.php');
		die();
	}
}