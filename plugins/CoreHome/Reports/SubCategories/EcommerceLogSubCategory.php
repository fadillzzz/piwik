<?php
/**
 * Piwik - free/libre analytics platform
 *
 * @link http://piwik.org
 * @license http://www.gnu.org/licenses/gpl-3.0.html GPL v3 or later
 *
 */
namespace Piwik\Plugins\CoreHome\Reports\SubCategories;

use Piwik\Plugin\SubCategory;

class EcommerceLogSubCategory extends SubCategory
{
    protected $category = 'Goals_Ecommerce';
    protected $name = 'Goals_EcommerceLog';
    protected $order = 5;

}
