<?php
/**
 * @package     {{PACKAGE_NAME}}
 * @subpackage  {{MODULE_NAME}}
 *
 * @copyright   {{COPYRIGHT}}
 * @license     {{LICENSE}}
 */

namespace {{NAMESPACE}}\Module\{{MODULE_CLASS}}\{{CLIENT_CLASS}}\Helper;

defined('_JEXEC') or die;

use Joomla\CMS\Factory;
use Joomla\Registry\Registry;

/**
 * Helper for {{MOD_NAME}}
 *
 * @since  {{VERSION}}
 */
class {{MODULE_CLASS}}Helper
{
    /**
     * Retrieve module data
     *
     * @param   Registry  $params  Module parameters
     *
     * @return  array  Module data
     *
     * @since   {{VERSION}}
     */
    public static function getData(Registry $params): array
    {
        $data = [];

        // Add your data retrieval logic here
        $data['example_text'] = $params->get('example_text', '');
        $data['current_date'] = Factory::getDate()->format('Y-m-d H:i:s');

        return $data;
    }

    /**
     * Get items from database (example)
     *
     * @param   Registry  $params  Module parameters
     *
     * @return  array  Items
     *
     * @since   {{VERSION}}
     */
    public static function getItems(Registry $params): array
    {
        $db = Factory::getDbo();
        $query = $db->getQuery(true);

        // Example query - modify according to your needs
        // $query->select('*')
        //     ->from($db->quoteName('#__your_table'))
        //     ->setLimit(10);

        // $db->setQuery($query);
        // $items = $db->loadObjectList();

        $items = [];

        return $items;
    }
}
