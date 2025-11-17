<?php
/**
 * @package     {{PACKAGE_NAME}}
 * @subpackage  {{MODULE_NAME}}
 *
 * @copyright   {{COPYRIGHT}}
 * @license     {{LICENSE}}
 */

defined('_JEXEC') or die;

use Joomla\CMS\HTML\HTMLHelper;
use Joomla\CMS\Language\Text;

/**
 * @var Joomla\CMS\WebAsset\WebAssetManager $wa
 * @var array $data Module data
 * @var Joomla\Registry\Registry $params Module parameters
 * @var stdClass $module Module object
 */

// Load assets
$wa = $app->getDocument()->getWebAssetManager();
$wa->registerAndUseStyle('{{MODULE_NAME}}', 'media/{{MODULE_NAME}}/css/{{MODULE_NAME}}.css');
$wa->registerAndUseScript('{{MODULE_NAME}}', 'media/{{MODULE_NAME}}/js/{{MODULE_NAME}}.js', [], ['defer' => true], ['core']);

?>

<div class="{{MODULE_NAME}} <?php echo $params->get('moduleclass_sfx'); ?>">
    <div class="{{MODULE_NAME}}-header">
        <h3><?php echo Text::_('MOD_{{MODULE_UPPER}}_TITLE'); ?></h3>
    </div>

    <div class="{{MODULE_NAME}}-content">
        <?php if (!empty($data['example_text'])) : ?>
            <p><?php echo htmlspecialchars($data['example_text'], ENT_QUOTES, 'UTF-8'); ?></p>
        <?php endif; ?>

        <p class="{{MODULE_NAME}}-date">
            <small><?php echo Text::sprintf('MOD_{{MODULE_UPPER}}_CURRENT_DATE', $data['current_date']); ?></small>
        </p>

        <?php if (!empty($data['items'])) : ?>
            <ul class="{{MODULE_NAME}}-list">
                <?php foreach ($data['items'] as $item) : ?>
                    <li><?php echo htmlspecialchars($item->title ?? '', ENT_QUOTES, 'UTF-8'); ?></li>
                <?php endforeach; ?>
            </ul>
        <?php endif; ?>
    </div>
</div>
