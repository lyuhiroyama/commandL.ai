<?php

header('Content-Type: application/json');

require __DIR__ . '/vendor/autoload.php';

$dotenv = Dotenv\Dotenv::createImmutable(__DIR__);
$dotenv->load();

$apiKey = $_ENV['API_KEY'];

if (!$apiKey) {
    echo json_encode(['error' => 'API key not found in environment variables']);
    exit;
}

// Get raw POST data (in json format)
$input = file_get_contents('php://input');

// Decode JSON data into a PHP array
$data = json_decode($input, true); // 'true' returns an associative array.

// Initialize cURL session. Returns a cURL handle used in subsequent cURL functions.
// *cURL is a library in PHP that allows you to make HTTP requests to other servers.
// *commonly used for interacting with APIs.
$ch = curl_init();

// curl_setopt() sets configurations of a request:

// CURLOPT_URL: constant used together with the URL to specify where to send the request.
curl_setopt($ch, CURLOPT_URL, 'https://api.openai.com/v1/chat/completions');
// CURLOPT_RETURNTRANSFER: Setting 3rd arg as 'true' returns the response as a string,
//   as opposed to outputting in the browser/terminal.
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
// CURLOPT_POST: Setting 3rd arg as 'true' specifies HTTP POST method as request method.
curl_setopt($ch, CURLOPT_POST, true);
// CURLOPT_POSTFIELDS: Set POST fields for a cURL request.
curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode([
    'model' => 'gpt-4o-mini',
    'messages' => $data['messages'],
    'max_tokens' => 500
]));
// CURLOPT_HTTPHEADER: Set custom HTTP headers for the request.
curl_setopt($ch, CURLOPT_HTTPHEADER, [
    'Content-Type: application/json',
    'Authorization: Bearer ' . $apiKey
]);


// Now execute the cURL session with the configurations stored in $ch:
$response = curl_exec($ch);


if (curl_errno($ch)) {
    echo json_encode(['error' => curl_error($ch)]);
} else {
    echo json_encode(['response' => $response]);
}

curl_close($ch);





?>

