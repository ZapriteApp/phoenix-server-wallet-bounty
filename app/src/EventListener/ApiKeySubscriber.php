<?php

namespace App\EventListener;

use Symfony\Component\HttpKernel\Event\RequestEvent;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpKernel\Exception\AccessDeniedHttpException;
use Symfony\Component\EventDispatcher\EventSubscriberInterface;
use Symfony\Component\HttpKernel\KernelEvents;
use Doctrine\ORM\EntityManagerInterface;
use App\Entity\ApiKey;

class ApiKeySubscriber implements EventSubscriberInterface
{

    public function __construct(EntityManagerInterface $entityManager)
    {
        $this->entityManager = $entityManager;
    }

    public function onKernelRequest(RequestEvent $event)
    {
        $request = $event->getRequest();
        if (strpos($request->getPathInfo(), '/api/') !== 0) {
            return;
        }

        $providedApiKey = $request->headers->get('X-API-KEY');
        $api_key = $this->entityManager
                   ->getRepository(ApiKey::class)
                   ->findOneBy(array('apikey' => $providedApiKey));
        if (!$providedApiKey || !$api_key) {
            throw new AccessDeniedHttpException('Invalid API Key');
        }
    }

    public static function getSubscribedEvents()
    {
        return [
            KernelEvents::REQUEST => 'onKernelRequest',
        ];
    }
}
