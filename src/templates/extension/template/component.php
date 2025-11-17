<?php
/**
 * @package     {{PACKAGE_NAME}}
 * @subpackage  {{TEMPLATE_NAME}}
 *
 * @copyright   {{COPYRIGHT}}
 * @license     {{LICENSE}}
 */

defined('_JEXEC') or die;

use Joomla\CMS\Factory;

/** @var Joomla\CMS\Document\HtmlDocument $this */

$app = Factory::getApplication();
$wa  = $this->getWebAssetManager();

// Load template assets
$wa->useStyle('template.{{TEMPLATE_NAME}}')
   ->useScript('template.{{TEMPLATE_NAME}}');

?>
<!DOCTYPE html>
<html lang="<?php echo $this->language; ?>" dir="<?php echo $this->direction; ?>">
<head>
    <jdoc:include type="metas" />
    <jdoc:include type="styles" />
    <jdoc:include type="scripts" />
</head>
<body class="contentpane">
    <jdoc:include type="message" />
    <jdoc:include type="component" />
</body>
</html>
