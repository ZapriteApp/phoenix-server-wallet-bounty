<?php

namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;
use Doctrine\ORM\EntityManagerInterface;
use App\Entity\ApiKey;
use App\Form\ApiKeyType;
use Symfony\Component\HttpFoundation\Request;

class SettingsController extends AbstractController
{

    public function __construct(EntityManagerInterface $entityManager)
    {
        $this->entityManager = $entityManager;
    }

    #[Route('/settings', name: 'app_settings')]
    public function index(Request $request): Response
    {
        $this->denyAccessUnlessGranted('ROLE_USER');

        $api_key = new ApiKey();
        $form = $this->createForm(ApiKeyType::class);

        $form->handleRequest($request);
        if ($form->isSubmitted() && $form->isValid()) {
            $api_key->setUser($this->getUser());
            $api_key->setApikey("123");
            $api_key->setRoles("ROLE_USER");
            $this->entityManager->persist($api_key);
            $this->entityManager->flush();

            return $this->redirectToRoute('app_settings');
        }

        $api_keys = $this->entityManager
                   ->getRepository(ApiKey::class)
                   ->findAll();

        return $this->render('settings/index.html.twig', [
            'form' => $form->createView(),
            'api_keys' => $api_keys
        ]);
    }

    #[Route('/settings/api-key/delete/{id}', name: 'settings_api_keys_delete', methods: ['POST'])]
    public function deleteApiKey(int $id): Response
    {
        $this->denyAccessUnlessGranted('ROLE_USER');

        $api_key = $this->entityManager
                   ->getRepository(ApiKey::class)
                   ->find($id);
        if ($api_key) {
            $this->entityManager->remove($api_key);
            $this->entityManager->flush();
        }

        return $this->redirectToRoute('app_settings');
    }
}
