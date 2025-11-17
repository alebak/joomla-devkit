<?php
/**
 * @package     {{PACKAGE_NAME}}
 * @subpackage  {{COMPONENT_NAME}}
 *
 * @copyright   {{COPYRIGHT}}
 * @license     {{LICENSE}}
 */

defined('_JEXEC') or die;

use Joomla\CMS\Extension\ComponentInterface;
use Joomla\CMS\Extension\Service\Provider\ComponentDispatcherFactory;
use Joomla\CMS\Extension\Service\Provider\MVCFactory;
use Joomla\CMS\HTML\Registry;
use Joomla\CMS\MVC\Factory\MVCFactoryInterface;
use Joomla\DI\Container;
use Joomla\DI\ServiceProviderInterface;
use {{NAMESPACE}}\Administrator\Extension\{{COMPONENT_CLASS}}Component;

/**
 * The {{COMPONENT_NAME}} service provider.
 *
 * @since  {{VERSION}}
 */
return new class implements ServiceProviderInterface
{
    /**
     * Registers the service provider with a DI container.
     *
     * @param   Container  $container  The DI container.
     *
     * @return  void
     *
     * @since   {{VERSION}}
     */
    public function register(Container $container)
    {
        $container->registerServiceProvider(new MVCFactory('\\{{NAMESPACE}}'));
        $container->registerServiceProvider(new ComponentDispatcherFactory('\\{{NAMESPACE}}'));

        $container->set(
            ComponentInterface::class,
            function (Container $container) {
                $component = new {{COMPONENT_CLASS}}Component($container->get(ComponentDispatcherFactoryInterface::class));
                $component->setRegistry($container->get(Registry::class));
                $component->setMVCFactory($container->get(MVCFactoryInterface::class));

                return $component;
            }
        );
    }
};
