<?php
/**
 * @package     {{PACKAGE_NAME}}
 * @subpackage  lib_{{LIBRARY_NAME}}
 *
 * @copyright   {{COPYRIGHT}}
 * @license     {{LICENSE}}
 */

namespace {{NAMESPACE}}\Helper;

defined('_JEXEC') or die;

use Joomla\CMS\Factory;
use Joomla\CMS\Language\Text;

/**
 * Helper class for {{LIB_NAME}}
 *
 * @since  {{VERSION}}
 */
class Helper
{
    /**
     * Format a string
     *
     * @param   string  $string  The string to format
     *
     * @return  string  The formatted string
     *
     * @since   {{VERSION}}
     */
    public static function formatString(string $string): string
    {
        return ucfirst(trim($string));
    }

    /**
     * Sanitize input data
     *
     * @param   mixed  $data  The data to sanitize
     *
     * @return  mixed  The sanitized data
     *
     * @since   {{VERSION}}
     */
    public static function sanitize($data)
    {
        if (is_string($data)) {
            return htmlspecialchars($data, ENT_QUOTES, 'UTF-8');
        }

        if (is_array($data)) {
            return array_map([self::class, 'sanitize'], $data);
        }

        return $data;
    }

    /**
     * Get current date/time
     *
     * @param   string  $format  The date format (default: 'Y-m-d H:i:s')
     *
     * @return  string  The formatted date
     *
     * @since   {{VERSION}}
     */
    public static function getCurrentDate(string $format = 'Y-m-d H:i:s'): string
    {
        return Factory::getDate()->format($format);
    }

    /**
     * Translate a language string
     *
     * @param   string  $key      The language key
     * @param   mixed   ...$args  Optional arguments for sprintf
     *
     * @return  string  The translated string
     *
     * @since   {{VERSION}}
     */
    public static function translate(string $key, ...$args): string
    {
        $translation = Text::_($key);

        if (!empty($args)) {
            return sprintf($translation, ...$args);
        }

        return $translation;
    }

    /**
     * Debug helper - log a message
     *
     * @param   mixed   $data      The data to log
     * @param   string  $category  The log category (default: 'library')
     *
     * @return  void
     *
     * @since   {{VERSION}}
     */
    public static function log($data, string $category = 'library'): void
    {
        if (JDEBUG) {
            $message = is_string($data) ? $data : print_r($data, true);
            Factory::getApplication()->enqueueMessage('[{{LIBRARY_NAME}}] ' . $message, 'info');
        }
    }

    /**
     * Check if user has permission
     *
     * @param   string  $action  The action to check (e.g., 'core.edit')
     * @param   string  $asset   The asset name (default: 'com_content')
     *
     * @return  boolean  True if user has permission, false otherwise
     *
     * @since   {{VERSION}}
     */
    public static function checkPermission(string $action, string $asset = 'com_content'): bool
    {
        $user = Factory::getUser();

        return $user->authorise($action, $asset);
    }

    /**
     * Generate a random string
     *
     * @param   integer  $length  The length of the string (default: 32)
     *
     * @return  string  The random string
     *
     * @since   {{VERSION}}
     */
    public static function generateRandomString(int $length = 32): string
    {
        $characters = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
        $charactersLength = strlen($characters);
        $randomString = '';

        for ($i = 0; $i < $length; $i++) {
            $randomString .= $characters[rand(0, $charactersLength - 1)];
        }

        return $randomString;
    }
}
