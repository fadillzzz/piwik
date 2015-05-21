<?php
/**
 * Piwik - free/libre analytics platform
 *
 * @link http://piwik.org
 * @license http://www.gnu.org/licenses/gpl-3.0.html GPL v3 or later
 *
 */
namespace Piwik\Plugins\Goals\Widgets;

use Piwik\Widget\WidgetConfig;

class WidgetGoalsOverview extends \Piwik\Widget\Widget
{
    public static function configure(WidgetConfig $config)
    {
        $config->setCategory('Goals_Goals');
        $config->setSubCategory('General_Overview');
        $config->setName('Goals_GoalsOverview');
        $config->disable();
    }
}
