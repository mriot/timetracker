<?php
header("Content-Type: json");
header("Access-Control-Allow-Origin: *");

if (!isset($_GET['apikey']) || !isset($_GET['url'])) {
    http_response_code(400); // Bad Request
    echo json_encode(['error' => 'Missing required parameters (apikey, url)']);
    exit;
}

$apikey = $_GET['apikey'];
$url = $_GET['url'];
$filters = $_GET['filters'];

$ch = curl_init($url . "?" . http_build_query(['filters' => $filters]));

curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_HEADER, true);
curl_setopt($ch, CURLOPT_NOBODY, false);
curl_setopt($ch, CURLOPT_HTTPHEADER, [
    "Authorization: Basic " . base64_encode("apikey:$apikey")
]);

$response = curl_exec($ch);

$responseHeaderSize = curl_getinfo($ch, CURLINFO_HEADER_SIZE);
$responseHeaders = substr($response, 0, $responseHeaderSize);
$responseCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
$responseBody = substr($response, $responseHeaderSize);

http_response_code($responseCode);

echo $responseBody;

curl_close($ch);
?>
