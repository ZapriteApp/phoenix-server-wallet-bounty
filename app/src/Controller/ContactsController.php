<?php

namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;

class ContactsController extends AbstractController
{
    #[Route('/contacts', name: 'app_contacts')]
    public function index(): Response
    {
        return $this->render('contacts/index.html.twig', [
            'controller_name' => 'ContactsController',
        ]);
    }
}
