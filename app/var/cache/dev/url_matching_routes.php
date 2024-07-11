<?php

/**
 * This file has been auto-generated
 * by the Symfony Routing Component.
 */

return [
    false, // $matchHost
    [ // $staticRoutes
        '/history' => [
            [['_route' => 'app_history', '_controller' => 'App\\Controller\\HistoryController::index'], null, null, null, false, false, null],
            [['_route' => 'history', '_controller' => 'App\\Controller\\HistoryController::history'], null, null, null, false, false, null],
        ],
        '/index' => [[['_route' => 'app_index', '_controller' => 'App\\Controller\\IndexController::index'], null, null, null, false, false, null]],
        '/create_invoice' => [[['_route' => 'create_invoice', '_controller' => 'App\\Controller\\PaymentController::create_invoice'], null, null, null, false, false, null]],
        '/pay_invoice' => [[['_route' => 'pay_invoice', '_controller' => 'App\\Controller\\PaymentController::pay_invoice'], null, null, null, false, false, null]],
        '/' => [[['_route' => 'index', '_controller' => 'App\\Controller\\IndexController::index'], null, null, null, false, false, null]],
    ],
    [ // $regexpList
        0 => '{^(?'
                .'|/_error/(\\d+)(?:\\.([^/]++))?(*:35)'
            .')/?$}sDu',
    ],
    [ // $dynamicRoutes
        35 => [
            [['_route' => '_preview_error', '_controller' => 'error_controller::preview', '_format' => 'html'], ['code', '_format'], null, null, false, true, null],
            [null, null, null, null, false, false, 0],
        ],
    ],
    null, // $checkCondition
];
