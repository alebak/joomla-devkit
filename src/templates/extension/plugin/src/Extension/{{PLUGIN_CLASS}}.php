<?php
/**
 * @package     {{PACKAGE_NAME}}
 * @subpackage  plg_{{PLUGIN_GROUP}}_{{PLUGIN_NAME}}
 *
 * @copyright   {{COPYRIGHT}}
 * @license     {{LICENSE}}
 */

namespace {{NAMESPACE}}\Plugin\{{PLUGIN_GROUP_CLASS}}\{{PLUGIN_CLASS}}\Extension;

defined('_JEXEC') or die;

use Joomla\CMS\Plugin\CMSPlugin;
use Joomla\Event\SubscriberInterface;

/**
 * {{PLG_NAME}} Plugin
 *
 * @since  {{VERSION}}
 */
final class {{PLUGIN_CLASS}} extends CMSPlugin implements SubscriberInterface
{
    /**
     * Load the language file on instantiation.
     *
     * @var    boolean
     * @since  {{VERSION}}
     */
    protected $autoloadLanguage = true;

    /**
     * Returns an array of events this subscriber will listen to.
     *
     * @return  array
     *
     * @since   {{VERSION}}
     */
    public static function getSubscribedEvents(): array
    {
        return [
            // Add your event subscriptions here
            // 'onContentPrepare' => 'onContentPrepare',
            // 'onContentAfterDisplay' => 'onContentAfterDisplay',
        ];
    }

    /**
     * Example event handler
     *
     * @param   object  $context  The context
     * @param   object  $article  The article
     * @param   object  $params   The parameters
     * @param   integer $page     The page number
     *
     * @return  void
     *
     * @since   {{VERSION}}
     */
    public function onContentPrepare($context, &$article, &$params, $page = 0)
    {
        // Your plugin logic here

        // Example: Get plugin parameter
        $exampleParam = $this->params->get('example_param', '');

        // Example: Log something
        // $this->getApplication()->enqueueMessage('{{PLG_NAME}} plugin executed', 'info');
    }
}
