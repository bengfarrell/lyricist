/**
 * Lambda function to get all songs for a user from DynamoDB
 * WITH ORIGIN WHITELISTING
 */

import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, QueryCommand } from "@aws-sdk/lib-dynamodb";

const client = new DynamoDBClient({ region: "us-east-1" });
const docClient = DynamoDBDocumentClient.from(client);

// Whitelist of allowed origins
const ALLOWED_ORIGINS = [
  'http://localhost:5173',
  'http://localhost:4173',
  'http://localhost:3000',
  'http://localhost:3001',
  'http://localhost:3002',
  'https://tweedytornado.netlify.app'
];

/**
 * Get CORS headers with origin whitelisting
 */
function getCorsHeaders(event) {
  const origin = event.headers?.origin || event.headers?.Origin;
  const allowedOrigin = ALLOWED_ORIGINS.includes(origin) ? origin : ALLOWED_ORIGINS[0];

  return {
    'Access-Control-Allow-Origin': allowedOrigin,
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'GET, OPTIONS',
    'Access-Control-Allow-Credentials': 'true'
  };
}

export const handler = async (event) => {
  console.log('Event:', JSON.stringify(event, null, 2));

  const headers = getCorsHeaders(event);

  // Handle preflight OPTIONS request
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers,
      body: ''
    };
  }

  try {
    // Get userId from query parameters
    const userId = event.queryStringParameters?.userId;

    if (!userId) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({
          error: 'Missing required parameter: userId'
        })
      };
    }

    // Query DynamoDB for all songs by this user
    const command = new QueryCommand({
      TableName: 'songs',
      KeyConditionExpression: 'userId = :userId',
      ExpressionAttributeValues: {
        ':userId': userId
      }
    });

    const response = await docClient.send(command);

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        songs: response.Items || []
      })
    };

  } catch (error) {
    console.error('Error:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({
        error: 'Failed to retrieve songs',
        details: error.message
      })
    };
  }
};


