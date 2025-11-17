<?php
/**
 * @package     {{PACKAGE_NAME}}
 * @subpackage  {{COMPONENT_NAME}}
 *
 * @copyright   {{COPYRIGHT}}
 * @license     {{LICENSE}}
 */

namespace {{NAMESPACE}}\Administrator\Controller;

defined('_JEXEC') or die;

use Joomla\CMS\MVC\Controller\BaseController;

/**
 * {{COM_NAME}} master display controller.
 *
 * @since  {{VERSION}}
 */
class DisplayController extends BaseController
{
    /**
     * The default view.
     *
     * @var    string
     * @since  {{VERSION}}
     */
    protected $default_view = '{{DEFAULT_VIEW}}';

    /**
     * Method to display a view.
     *
     * @param   boolean  $cachable   If true, the view output will be cached
     * @param   array    $urlparams  An array of safe URL parameters and their variable types, for valid values see {@link InputFilter::clean()}.
     *
     * @return  static|boolean  This object to support chaining or false on failure.
     *
     * @since   {{VERSION}}
     */
    public function display($cachable = false, $urlparams = [])
    {
        return parent::display($cachable, $urlparams);
    }
}
