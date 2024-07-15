<?php

namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Attribute\Route;
use App\Service\ApiPhoenix;
use Symfony\Component\HttpFoundation\JsonResponse;

class APIController extends AbstractController
{
    #[Route('/api/index', name: 'api_index', methods: ['GET'])]
    public function getConfig(ApiPhoenix $apiPhoenix): JsonResponse
    {
        $config = $apiPhoenix->getConfig();
        return new JsonResponse(['config' => $config], Response::HTTP_OK);
    }
}
