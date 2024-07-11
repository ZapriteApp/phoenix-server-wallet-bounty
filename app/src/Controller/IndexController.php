<?php

namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;
use App\Service\ApiPhoenix;

class IndexController extends AbstractController
{
    #[Route('/index', name: 'app_index')]
    public function index(): Response
    {

        $phoenix = new ApiPhoenix(
          "http://phoenix:9740",
          "phoenix",
          "c7a44e42995dde3d997b2093b2024cc1339f8cf8b71cbb78bfd5024e5b8f80f4",
        );

        try {
            $nodeInfo = $phoenix->getNodeInfo();
            $channels = $phoenix->listChannels();
            $balance = $phoenix->getBalance();
            $offer = $phoenix->getOffer();
        } catch (\Exception $e) {
            return new Response('Erreur: ' . $e->getMessage());
        }

        return $this->render('index.html.twig', [
            'nodeInfo' => $nodeInfo,
            'channels' => $channels,
            'balance' => $balance,
            'offer' => $offer,
        ]);
    }
}
