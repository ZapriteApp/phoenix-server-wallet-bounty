<?php

namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;
use App\Service\ApiPhoenix;

class HistoryController extends AbstractController
{
    #[Route('/history', name: 'app_history')]
    public function index(): Response
    {
        $phoenix = new ApiPhoenix(
          "http://phoenix:9740",
          "phoenix",
          "c7a44e42995dde3d997b2093b2024cc1339f8cf8b71cbb78bfd5024e5b8f80f4",
        );

        try {
            $ins = $phoenix->listPaymentsIn(array("all" => true));
            $outs = $phoenix->listPaymentsOut(array("all" => true));
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
