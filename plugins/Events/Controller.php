<?php
/**
 * Piwik - free/libre analytics platform
 *
 * @link http://piwik.org
 * @license http://www.gnu.org/licenses/gpl-3.0.html GPL v3 or later
 *
 */
namespace Piwik\Plugins\Events;

use Piwik\View;

/**
 * Events controller
 *
 */
class Controller extends \Piwik\Plugin\Controller
{
    public function indexCategory()
    {
        return $this->indexEvent(__FUNCTION__);
    }

    public function indexAction()
    {
        return $this->indexEvent(__FUNCTION__);
    }

    public function indexName()
    {
        return $this->indexEvent(__FUNCTION__);
    }

    public function getActionFromCategoryId()
    {
        return $this->renderReport(__FUNCTION__);
    }

    public function getNameFromCategoryId()
    {
        return $this->renderReport(__FUNCTION__);
    }

    public function getCategoryFromActionId()
    {
        return $this->renderReport(__FUNCTION__);
    }

    public function getNameFromActionId()
    {
        return $this->renderReport(__FUNCTION__);
    }

    public function getActionFromNameId()
    {
        return $this->renderReport(__FUNCTION__);
    }

    public function getCategoryFromNameId()
    {
        return $this->renderReport(__FUNCTION__);
    }

    protected function indexEvent($controllerMethod)
    {
        $count = 1;
        $apiMethod = str_replace('index', 'get', $controllerMethod, $count);
        $events = new Events;
        $title = $events->getReportTitleTranslation($apiMethod);

        if (method_exists($this, $apiMethod)) {
            $content = $this->$apiMethod();
        } else {
            $content = $this->renderReport($apiMethod);
        }

        return View::singleReport(
            $title,
            $content
        );
    }
}
