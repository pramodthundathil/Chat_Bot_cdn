<?php
/**
 * Plugin Name: WP AI Chatbot
 * Plugin URI:  https://yourwebsite.com/
 * Description: A chatbot plugin that integrates AI chatbot using a CDN.
 * Version: 1.0
 * Author: Your Name
 */

if (!defined('ABSPATH')) {
    exit; // Exit if accessed directly
}

// Include settings page
require_once plugin_dir_path(__FILE__) . 'admin/settings-page.php';

// Enqueue chatbot script dynamically
function wp_ai_chatbot_enqueue_script() {
    $api_key = get_option('wp_ai_chatbot_api_key', '');
    if (!$api_key) {
        return; // Do not load the script if API key is missing
    }

    echo '<script src="https://cdn.jsdelivr.net/gh/pramodthundathil/Chat_Bot_cdn@main/chatbot.js" data-api-key="' . esc_attr($api_key) . '"></script>';
}
add_action('wp_footer', 'wp_ai_chatbot_enqueue_script');
