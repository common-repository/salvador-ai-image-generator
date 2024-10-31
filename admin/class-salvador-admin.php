<?php

/**
 * The admin-specific functionality of the plugin.
 *
 * @link       https://getsalvador.com
 * @since      1.0.0
 *
 * @package    Salvador
 * @subpackage Salvador/admin
 */

/**
 * The admin-specific functionality of the plugin.
 *
 * Defines the plugin name, version, and two examples hooks for how to
 * enqueue the admin-specific stylesheet and JavaScript.
 *
 * @package    Salvador
 * @subpackage Salvador/admin
 * @author     Your Name <email@example.com>
 */
class Salvador_Admin {

	/**
	 * The ID of this plugin.
	 *
	 * @since    1.0.0
	 * @access   private
	 * @var      string    $salvador    The ID of this plugin.
	 */
	private $salvador;

	/**
	 * The version of this plugin.
	 *
	 * @since    1.0.0
	 * @access   private
	 * @var      string    $version    The current version of this plugin.
	 */
	private $version;

	/**
	 * Initialize the class and set its properties.
	 *
	 * @since    1.0.0
	 * @param      string    $salvador       The name of this plugin.
	 * @param      string    $version    The version of this plugin.
	 */
	public function __construct( $salvador, $version ) {

		$this->salvador = $salvador;
		$this->version = $version;

	}

	/**
	 * Register the stylesheets for the admin area.
	 *
	 * @since    1.0.0
	 */
	public function enqueue_styles() {

		/**
		 * This function is provided for demonstration purposes only.
		 *
		 * An instance of this class should be passed to the run() function
		 * defined in Salvador_Loader as all of the hooks are defined
		 * in that particular class.
		 *
		 * The Salvador_Loader will then create the relationship
		 * between the defined hooks and the functions defined in this
		 * class.
		 */

		wp_enqueue_style( $this->salvador, plugin_dir_url( __FILE__ ) . 'css/salvador-admin.css', array(), $this->version, 'all' );

	}

	/**
	 * Register the JavaScript for the admin area.
	 *
	 * @since    1.0.0
	 */
	public function enqueue_scripts() {

		/**
		 * This function is provided for demonstration purposes only.
		 *
		 * An instance of this class should be passed to the run() function
		 * defined in Salvador_Loader as all of the hooks are defined
		 * in that particular class.
		 *
		 * The Salvador_Loader will then create the relationship
		 * between the defined hooks and the functions defined in this
		 * class.
		 */

		wp_enqueue_script( $this->salvador.'-js', plugin_dir_url( __FILE__ ) . 'js/salvador-admin.js', array( 'jquery' ), $this->version, false );
		wp_enqueue_script( $this->salvador.'-php', plugin_dir_url( __FILE__ ) . '?salvador_admin_js=1', [$this->salvador.'-js'], $this->version, false );

		wp_localize_script($this->salvador.'-js', 'WPURLS', array( 'siteurl' => get_option('siteurl') ));

	}

}
