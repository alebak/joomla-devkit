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
use Joomla\CMS\Language\Text;
use Joomla\CMS\Uri\Uri;

/** @var Joomla\CMS\Document\ErrorDocument $this */

$app = Factory::getApplication();
$wa  = $this->getWebAssetManager();
$sitename = htmlspecialchars($app->get('sitename'), ENT_QUOTES, 'UTF-8');

// Load template assets
$wa->useStyle('template.{{TEMPLATE_NAME}}')
   ->useScript('template.{{TEMPLATE_NAME}}');

?>
<!DOCTYPE html>
<html lang="<?php echo $this->language; ?>" dir="<?php echo $this->direction; ?>">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title><?php echo $this->error->getCode(); ?> - <?php echo htmlspecialchars($this->error->getMessage(), ENT_QUOTES, 'UTF-8'); ?></title>
    <jdoc:include type="styles" />
    <jdoc:include type="scripts" />
</head>
<body class="error-page error-<?php echo $this->error->getCode(); ?>">
    <div class="container">
        <div class="error-container">
            <div class="error-code">
                <?php echo $this->error->getCode(); ?>
            </div>

            <div class="error-message">
                <h1><?php echo Text::_('JERROR_LAYOUT_ERROR_HAS_OCCURRED_WHILE_PROCESSING_YOUR_REQUEST'); ?></h1>
                <p class="lead"><?php echo htmlspecialchars($this->error->getMessage(), ENT_QUOTES, 'UTF-8'); ?></p>
            </div>

            <?php if ($this->debug) : ?>
                <div class="error-debug">
                    <h3><?php echo Text::_('JERROR_LAYOUT_DEBUG_INFO'); ?>:</h3>
                    <pre><?php echo $this->renderBacktrace(); ?></pre>
                </div>
            <?php endif; ?>

            <div class="error-actions">
                <a href="<?php echo Uri::root(); ?>" class="btn btn-primary">
                    <?php echo Text::_('JERROR_LAYOUT_GO_TO_THE_HOME_PAGE'); ?>
                </a>
                <a href="javascript:history.go(-1)" class="btn btn-secondary">
                    <?php echo Text::_('JERROR_LAYOUT_PREVIOUS_PAGE'); ?>
                </a>
            </div>
        </div>
    </div>
</body>
</html>
