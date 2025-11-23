<?php
/**
 * @package     {{PACKAGE_NAME}}
 * @subpackage  Script
 * @copyright   {{COPYRIGHT}}
 * @license     {{LICENSE}}
 */

defined('_JEXEC') or die;

use Joomla\CMS\Installer\InstallerScript;
use Joomla\CMS\Language\Text;
use Joomla\CMS\Log\Log;

/**
 * Installation script for {{PACKAGE_NAME}} package
 *
 * @since  {{VERSION}}
 */
class {{SCRIPT_CLASS}}InstallerScript extends InstallerScript
{
    /**
     * Minimum Joomla version required to install this extension
     *
     * @var    string
     * @since  {{VERSION}}
     */
    protected $minimumJoomla = '{{JOOMLA_VERSION}}';

    /**
     * Minimum PHP version required to install this extension
     *
     * @var    string
     * @since  {{VERSION}}
     */
    protected $minimumPhp = '8.1.0';

    /**
     * Method to run before an install/update/uninstall method
     *
     * @param   string  $type    The type of change (install, update or discover_install)
     * @param   object  $parent  The parent object
     *
     * @return  boolean  True on success
     *
     * @since   {{VERSION}}
     */
    public function preflight($type, $parent)
    {
        // Check minimum Joomla version
        if (!parent::preflight($type, $parent)) {
            return false;
        }

        return true;
    }

    /**
     * Method to run after an install/update/uninstall method
     *
     * @param   string  $type    The type of change (install, update or discover_install)
     * @param   object  $parent  The parent object
     *
     * @return  void
     *
     * @since   {{VERSION}}
     */
    public function postflight($type, $parent)
    {
        if ($type === 'install') {
            echo '<h3>' . Text::_('{{PACKAGE_NAME}} Installation') . '</h3>';
            echo '<p>' . Text::_('{{PACKAGE_NAME}} has been installed successfully!') . '</p>';
        } elseif ($type === 'update') {
            echo '<h3>' . Text::_('{{PACKAGE_NAME}} Update') . '</h3>';
            echo '<p>' . Text::_('{{PACKAGE_NAME}} has been updated successfully!') . '</p>';
        }
    }

    /**
     * Method to run on uninstall
     *
     * @param   object  $parent  The parent object
     *
     * @return  void
     *
     * @since   {{VERSION}}
     */
    public function uninstall($parent)
    {
        echo '<h3>' . Text::_('{{PACKAGE_NAME}} Uninstallation') . '</h3>';
        echo '<p>' . Text::_('{{PACKAGE_NAME}} has been uninstalled.') . '</p>';
    }
}
