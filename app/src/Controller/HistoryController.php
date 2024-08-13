<?php

namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;
use App\Service\ApiPhoenix;

class HistoryController extends AbstractController
{
    private $apiPhoenix;

    public function __construct(ApiPhoenix $apiPhoenix)
    {
        $this->apiPhoenix = $apiPhoenix;
    }

    #[Route('/history', name: 'app_history')]
    public function index(): Response
    {
        $this->denyAccessUnlessGranted('ROLE_USER');

        try {
            $ins = $this->apiPhoenix->listPaymentsIn(array("all" => true));
            $outs = $this->apiPhoenix->listPaymentsOut(array("all" => true));
        } catch (\Exception $e) {
            return new Response('Erreur: ' . $e->getMessage());
        }

        return $this->render('history/index.html.twig', [
            'controller_name' => 'HistoryController',
            'payments_in' => $ins,
            'payments_out' => $outs,
        ]);
    }
}
