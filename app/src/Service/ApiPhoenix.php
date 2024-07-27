<?php

namespace App\Service;

use Symfony\Component\HttpClient\HttpClient;
use Symfony\Contracts\HttpClient\HttpClientInterface;

class ApiPhoenix
{
    private $client;
    private $username;
    private $password;
    private $host;

    public function __construct($host, $username, $password)
    {
        $this->client = HttpClient::create();
        $this->username = $username;
        $this->password = $password;
        $this->host = $host;
    }

    private function makeRequest($endpoint, $method = 'GET', $data = null, $query = [])
    {
        $url = $this->host . $endpoint;

        if (!empty($query)) {
            $url .= '?' . http_build_query($query);
        }

        $options = [
            'auth_basic' => [$this->username, $this->password],
            'headers' => [
                'Content-Type' => 'application/json',
            ],
        ];

        if ($method === 'POST' && $data) {
            $options['body'] = $data;
        }

        $response = $this->client->request($method, $url, $options);
        return $response;
    }

    public function getNodeInfo()
    {
        return $this->makeRequest('/getinfo');
    }

    public function createInvoice($amount, $description)
    {
        $data = [
            'amountSat' => $amount,
            'description' => $description
        ];
        return $this->makeRequest('/createinvoice', 'POST', $data)->toArray();
    }

    public function getOffer()
    {
        return $this->makeRequest('/getoffer')->getContent();
    }

    public function getBalance()
    {
        return $this->makeRequest('/getbalance')->toArray();
    }

    public function listPaymentsIn($query = [])
    {
        return $this->makeRequest('/payments/incoming', 'GET', null, $query);
    }

    public function listPaymentsOut($query = [])
    {
        return $this->makeRequest('/payments/outgoing', 'GET', null, $query);
    }

    public function listChannels()
    {
        return $this->makeRequest('/listchannels')->toArray();
    }

    public function payInvoice($invoice)
    {
        $data = [
            'invoice' => $invoice
        ];
        return $this->makeRequest('/payinvoice', 'POST', $data);
    }

    public function payOffer($amount, $offer, $message)
    {
        $data = [
            'amountSat' => $amount,
            'offer' => $offer,
            'message' => $message
        ];
        return $this->makeRequest('/payoffer', 'POST', $data);
    }

    // Ajoutez d'autres méthodes selon vos besoins
}
