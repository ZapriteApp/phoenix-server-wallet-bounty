<?php

namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\HttpFoundation\JsonResponse;
use App\Service\ApiPhoenix;
use App\Form\CreateInvoiceType;
use App\Form\PayInvoiceType;
use App\Form\PayOfferType;

class PaymentController extends AbstractController
{

    private $apiPhoenix;

    public function __construct(ApiPhoenix $apiPhoenix)
    {
        $this->apiPhoenix = $apiPhoenix;
    }

    /**
     * @Route("/create_invoice", name="create_invoice")
     */
    public function create_invoice(Request $request): Response
    {
        $this->denyAccessUnlessGranted('ROLE_USER');

        try {
            $offer = $this->apiPhoenix->getOffer();
        } catch (\Exception $e) {
            return new Response('Erreur: ' . $e->getMessage());
        }

        $form = $this->createForm(CreateInvoiceType::class);
        $form->handleRequest($request);

        if ($form->isSubmitted() && $form->isValid()) {
            $data = $form->getData();
            $response = null;

            try {
                $response = $this->apiPhoenix->createInvoice($data['amount'], $data['description']);
            } catch (\Exception $e) {
                return new Response('Erreur: ' . $e->getMessage());
            }

            return $this->render('payment/index.html.twig', [
              'form' => $form->createView(),
              'payment_result' => $response,
              'offer' => $offer,
            ]);
        }

        return $this->render('payment/index.html.twig', [
            'form' => $form->createView(),
            'offer' => $offer,
        ]);
    }

    /**
     * @Route("/pay_invoice", name="pay_invoice")
     */
    public function pay_invoice(Request $request): Response
    {
        $this->denyAccessUnlessGranted('ROLE_USER');

        $form11 = $this->createForm(PayInvoiceType::class);
        $form11->handleRequest($request);

        if ($form11->isSubmitted() && $form11->isValid()) {
            $data = $form11->getData();
            $response = null;

            try {
                $response = $this->apiPhoenix->payInvoice($data['invoice']);
            } catch (\Exception $e) {
                return new Response('Erreur: ' . $e->getMessage());
            }

            return $this->render('payment/pay_result.html.twig', [
                'response' => $response,
            ]);
        }

        $form12 = $this->createForm(PayOfferType::class);
        $form12->handleRequest($request);

        if ($form12->isSubmitted() && $form12->isValid()) {
            $data = $form12->getData();
            $response = null;

            try {
                $response = $this->apiPhoenix->payOffer($data['amount'], $data['offer'], $data['message']);
            } catch (\Exception $e) {
                return new Response('Erreur: ' . $e->getMessage());
            }

            return $this->render('payment/pay_result.html.twig', [
                'response' => $response,
            ]);
        }

        return $this->render('payment/pay_invoice.html.twig', [
            'form11' => $form11->createView(),
            'form12' => $form12->createView(),
        ]);
    }
}
