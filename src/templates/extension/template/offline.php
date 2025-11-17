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
use Joomla\CMS\Helper\AuthenticationHelper;
use Joomla\CMS\Language\Text;
use Joomla\CMS\Router\Route;
use Joomla\CMS\Uri\Uri;

/** @var Joomla\CMS\Document\HtmlDocument $this */

$app = Factory::getApplication();
$wa  = $this->getWebAssetManager();
$sitename = htmlspecialchars($app->get('sitename'), ENT_QUOTES, 'UTF-8');
$logo = $this->params->get('logoFile');
$templatePath = 'templates/' . $this->template;

if (!$logo) {
    $logo = $templatePath . '/images/logo.svg';
}

// Load template assets
$wa->useStyle('template.{{TEMPLATE_NAME}}')
   ->useScript('template.{{TEMPLATE_NAME}}');

// Load form validation
$wa->useScript('form.validate');

// Two Factor Authentication
$twoFactorMethods = AuthenticationHelper::getTwoFactorMethods();

?>
<!DOCTYPE html>
<html lang="<?php echo $this->language; ?>" dir="<?php echo $this->direction; ?>">
<head>
    <jdoc:include type="metas" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <jdoc:include type="styles" />
    <jdoc:include type="scripts" />
</head>
<body class="offline-page">
    <div class="offline-container">
        <div class="offline-content">
            <!-- Logo -->
            <div class="offline-logo">
                <?php if ($logo) : ?>
                    <img src="<?php echo Uri::root() . $logo; ?>" alt="<?php echo $sitename; ?>">
                <?php else : ?>
                    <h1><?php echo $sitename; ?></h1>
                <?php endif; ?>
            </div>

            <!-- Message -->
            <div class="offline-message">
                <h2><?php echo Text::_('JOFFLINE_MESSAGE'); ?></h2>
                <?php if ($app->get('offline_message')) : ?>
                    <p><?php echo $app->get('offline_message'); ?></p>
                <?php endif; ?>
            </div>

            <!-- Login Form -->
            <?php if ($app->get('offline_login')) : ?>
                <div class="offline-login">
                    <form action="<?php echo Route::_('index.php', true); ?>" method="post" id="form-login">
                        <fieldset>
                            <legend><?php echo Text::_('TPL_{{TEMPLATE_UPPER}}_OFFLINE_LOGIN'); ?></legend>

                            <div class="mb-3">
                                <label for="username" class="form-label">
                                    <?php echo Text::_('JGLOBAL_USERNAME'); ?>
                                </label>
                                <input name="username" id="username" type="text" class="form-control" required>
                            </div>

                            <div class="mb-3">
                                <label for="password" class="form-label">
                                    <?php echo Text::_('JGLOBAL_PASSWORD'); ?>
                                </label>
                                <input name="password" id="password" type="password" class="form-control" required>
                            </div>

                            <?php if (count($twoFactorMethods) > 1) : ?>
                                <div class="mb-3">
                                    <label for="secretkey" class="form-label">
                                        <?php echo Text::_('JGLOBAL_SECRETKEY'); ?>
                                    </label>
                                    <input name="secretkey" id="secretkey" type="text" class="form-control">
                                </div>
                            <?php endif; ?>

                            <div class="mb-3">
                                <button type="submit" class="btn btn-primary w-100">
                                    <?php echo Text::_('JLOGIN'); ?>
                                </button>
                            </div>

                            <input type="hidden" name="option" value="com_users">
                            <input type="hidden" name="task" value="user.login">
                            <input type="hidden" name="return" value="<?php echo base64_encode(Uri::base()); ?>">
                            <?php echo HTMLHelper::_('form.token'); ?>
                        </fieldset>
                    </form>
                </div>
            <?php endif; ?>
        </div>
    </div>
</body>
</html>
