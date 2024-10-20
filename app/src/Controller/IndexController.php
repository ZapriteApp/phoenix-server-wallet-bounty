<?php

namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\IsGranted;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;
use App\Service\ApiPhoenix;

class IndexController extends AbstractController
{

    private $apiPhoenix;

    public function __construct(ApiPhoenix $apiPhoenix)
    {
        $this->apiPhoenix = $apiPhoenix;
    }

    #[Route('/index', name: 'app_index')]
    public function index(): Response
    {
        $this->denyAccessUnlessGranted('ROLE_USER');

        try {
            $nodeInfo = $this->apiPhoenix->getNodeInfo();
            $channels = $this->apiPhoenix->listChannels();
            $balance = $this->apiPhoenix->getBalance();
            $offer = $this->apiPhoenix->getOffer();
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
