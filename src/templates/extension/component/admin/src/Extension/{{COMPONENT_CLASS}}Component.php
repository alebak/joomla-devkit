<?php
/**
 * @package     {{PACKAGE_NAME}}
 * @subpackage  {{COMPONENT_NAME}}
 *
 * @copyright   {{COPYRIGHT}}
 * @license     {{LICENSE}}
 */

namespace {{NAMESPACE}}\Administrator\Extension;

defined('_JEXEC') or die;

use Joomla\CMS\Extension\BootableExtensionInterface;
use Joomla\CMS\Extension\MVCComponent;
use Psr\Container\ContainerInterface;

/**
 * Component class for {{COM_NAME}}
 *
 * @since  {{VERSION}}
 */
class {{COMPONENT_CLASS}}Component extends MVCComponent implements BootableExtensionInterface
{
    /**
     * Booting the extension. This is the function to set up the environment of the extension like
     * registering new class loaders, etc.
     *
     * If required, some initial set up can be done from services of the container, eg.
     * registering HTML services.
     *
     * @param   ContainerInterface  $container  The container
     *
     * @return  void
     *
     * @since   {{VERSION}}
     */
    public function boot(ContainerInterface $container)
    {
        // Perform any required initialization here
    }
}
