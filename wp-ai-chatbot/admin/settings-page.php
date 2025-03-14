<?php
if (!defined('ABSPATH')) {
    exit;
}

// Add menu item for settings
function wp_ai_chatbot_menu() {
    add_menu_page(
        'WP AI Chatbot Settings',
        'AI Chatbot',
        'manage_options',
        'wp-ai-chatbot',
        'wp_ai_chatbot_settings_page',
        'dashicons-format-chat',
        100
    );
}
add_action('admin_menu', 'wp_ai_chatbot_menu');

// Display settings page
function wp_ai_chatbot_settings_page() {
    ?>
    <div class="wrap">
        <h1>WP AI Chatbot Settings</h1>
        <form method="post" action="options.php">
            <?php
            settings_fields('wp_ai_chatbot_options');
            do_settings_sections('wp-ai-chatbot');
            submit_button();
            ?>
        </form>
    </div>
    <?php
}

// Register settings
function wp_ai_chatbot_settings_init() {
    register_setting('wp_ai_chatbot_options', 'wp_ai_chatbot_api_key');

    add_settings_section(
        'wp_ai_chatbot_section',
        'Chatbot API Settings',
        null,
        'wp-ai-chatbot'
    );

    add_settings_field(
        'wp_ai_chatbot_api_key',
        'Enter API Key',
        'wp_ai_chatbot_api_key_callback',
        'wp-ai-chatbot',
        'wp_ai_chatbot_section'
    );
}
add_action('admin_init', 'wp_ai_chatbot_settings_init');

// API Key input field
function wp_ai_chatbot_api_key_callback() {
    $api_key = get_option('wp_ai_chatbot_api_key', '');
    echo '<input type="text" name="wp_ai_chatbot_api_key" value="' . esc_attr($api_key) . '" class="regular-text">';
}
?>