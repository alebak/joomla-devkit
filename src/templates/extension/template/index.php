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
use Joomla\CMS\HTML\HTMLHelper;
use Joomla\CMS\Language\Text;
use Joomla\CMS\Uri\Uri;

/** @var Joomla\CMS\Document\HtmlDocument $this */

$app   = Factory::getApplication();
$wa    = $this->getWebAssetManager();
$sitename = htmlspecialchars($app->get('sitename'), ENT_QUOTES, 'UTF-8');
$logo = $this->params->get('logoFile');
$siteTitle = $this->params->get('siteTitle', $sitename);
$siteDescription = $this->params->get('siteDescription', '');
$fluidContainer = $this->params->get('fluidContainer', 0);
$containerClass = $fluidContainer ? 'container-fluid' : 'container';
$stickyHeader = $this->params->get('stickyHeader', 0);
$backTop = $this->params->get('backTop', 1);

// Detecting Active Variables
$option   = $app->input->getCmd('option', '');
$view     = $app->input->getCmd('view', '');
$layout   = $app->input->getCmd('layout', '');
$task     = $app->input->getCmd('task', '');
$itemid   = $app->input->getCmd('Itemid', '');
$menu     = $app->getMenu();
$active   = $menu->getActive();
$pageclass = $active !== null ? $active->getParams()->get('pageclass_sfx', '') : '';

// Template path
$templatePath = 'templates/' . $this->template;

// Load template assets
$wa->useStyle('template.{{TEMPLATE_NAME}}')
   ->useScript('template.{{TEMPLATE_NAME}}');

// Load Bootstrap 5
$wa->useStyle('bootstrap.css')
   ->useScript('bootstrap.bundle.min');

// Enable assets
$wa->useStyle('fontawesome')
   ->useScript('keepalive')
   ->useScript('form.validate');

// Logo
if (!$logo) {
    $logo = $templatePath . '/images/logo.svg';
}

// Browser Check
$browser = $app->client;
$browserClass = $browser->mobile ? 'mobile' : 'desktop';

?>
<!DOCTYPE html>
<html lang="<?php echo $this->language; ?>" dir="<?php echo $this->direction; ?>">
<head>
    <jdoc:include type="metas" />
    <jdoc:include type="styles" />
    <jdoc:include type="scripts" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <?php if ($siteDescription) : ?>
        <meta name="description" content="<?php echo htmlspecialchars($siteDescription, ENT_QUOTES, 'UTF-8'); ?>">
    <?php endif; ?>
</head>

<body class="<?php echo $option . ' view-' . $view . ($layout ? ' layout-' . $layout : ' no-layout') . ($task ? ' task-' . $task : ' no-task') . ' itemid-' . $itemid . ' ' . $pageclass . ' ' . $browserClass; ?>">

    <!-- Header -->
    <header class="header<?php echo $stickyHeader ? ' sticky-top' : ''; ?>">
        <nav class="navbar navbar-expand-lg navbar-light bg-light">
            <div class="<?php echo $containerClass; ?>">
                <!-- Logo -->
                <a class="navbar-brand" href="<?php echo Uri::root(); ?>">
                    <?php if ($logo) : ?>
                        <img src="<?php echo Uri::root() . $logo; ?>" alt="<?php echo $siteTitle; ?>" class="logo">
                    <?php else : ?>
                        <span class="site-title"><?php echo $siteTitle; ?></span>
                    <?php endif; ?>
                </a>

                <!-- Mobile menu toggle -->
                <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbar-menu" aria-controls="navbar-menu" aria-expanded="false" aria-label="<?php echo Text::_('TPL_{{TEMPLATE_UPPER}}_TOGGLE_MENU'); ?>">
                    <span class="navbar-toggler-icon"></span>
                </button>

                <!-- Navigation -->
                <div class="collapse navbar-collapse" id="navbar-menu">
                    <jdoc:include type="modules" name="menu" style="none" />
                </div>
            </div>
        </nav>

        <!-- Top positions -->
        <?php if ($this->countModules('top-a') || $this->countModules('top-b')) : ?>
            <div class="top-section">
                <div class="<?php echo $containerClass; ?>">
                    <div class="row">
                        <?php if ($this->countModules('top-a')) : ?>
                            <div class="col-md-6">
                                <jdoc:include type="modules" name="top-a" style="html5" />
                            </div>
                        <?php endif; ?>
                        <?php if ($this->countModules('top-b')) : ?>
                            <div class="col-md-6">
                                <jdoc:include type="modules" name="top-b" style="html5" />
                            </div>
                        <?php endif; ?>
                    </div>
                </div>
            </div>
        <?php endif; ?>

        <!-- Breadcrumbs -->
        <?php if ($this->countModules('breadcrumbs')) : ?>
            <div class="breadcrumbs-section">
                <div class="<?php echo $containerClass; ?>">
                    <jdoc:include type="modules" name="breadcrumbs" style="none" />
                </div>
            </div>
        <?php endif; ?>
    </header>

    <!-- Main Content -->
    <main class="main-content">
        <div class="<?php echo $containerClass; ?>">
            <?php if ($this->countModules('main-top')) : ?>
                <div class="main-top">
                    <jdoc:include type="modules" name="main-top" style="html5" />
                </div>
            <?php endif; ?>

            <div class="row">
                <!-- Sidebar Left -->
                <?php if ($this->countModules('sidebar-left')) : ?>
                    <aside class="col-lg-3 sidebar-left">
                        <jdoc:include type="modules" name="sidebar-left" style="html5" />
                    </aside>
                <?php endif; ?>

                <!-- Content -->
                <div class="<?php echo $this->countModules('sidebar-left') || $this->countModules('sidebar-right') ? 'col-lg-6' : 'col-lg-12'; ?>">
                    <!-- Messages -->
                    <jdoc:include type="message" />

                    <!-- Component -->
                    <jdoc:include type="component" />
                </div>

                <!-- Sidebar Right -->
                <?php if ($this->countModules('sidebar-right')) : ?>
                    <aside class="col-lg-3 sidebar-right">
                        <jdoc:include type="modules" name="sidebar-right" style="html5" />
                    </aside>
                <?php endif; ?>
            </div>

            <?php if ($this->countModules('main-bottom')) : ?>
                <div class="main-bottom">
                    <jdoc:include type="modules" name="main-bottom" style="html5" />
                </div>
            <?php endif; ?>
        </div>
    </main>

    <!-- Footer -->
    <footer class="footer">
        <div class="<?php echo $containerClass; ?>">
            <?php if ($this->countModules('footer')) : ?>
                <jdoc:include type="modules" name="footer" style="html5" />
            <?php endif; ?>

            <div class="footer-info text-center">
                <p>&copy; <?php echo date('Y'); ?> <?php echo $siteTitle; ?>. <?php echo Text::_('TPL_{{TEMPLATE_UPPER}}_ALL_RIGHTS_RESERVED'); ?></p>
            </div>
        </div>
    </footer>

    <!-- Back to top -->
    <?php if ($backTop) : ?>
        <a href="#top" id="back-top" class="back-to-top" aria-label="<?php echo Text::_('TPL_{{TEMPLATE_UPPER}}_BACK_TO_TOP'); ?>">
            <span class="icon-arrow-up" aria-hidden="true"></span>
        </a>
    <?php endif; ?>

    <!-- Debug -->
    <jdoc:include type="modules" name="debug" style="none" />

</body>
</html>
