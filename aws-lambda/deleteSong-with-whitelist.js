/**
 * Lambda function to delete a song from DynamoDB
 * WITH ORIGIN WHITELISTING
 */

import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, DeleteCommand } from "@aws-sdk/lib-dynamodb";

const client = new DynamoDBClient({ region: "us-east-1" });
const docClient = DynamoDBDocumentClient.from(client);

// Whitelist of allowed origins
const ALLOWED_ORIGINS = [
  'http://localhost:5173',           // Vite dev server
  'http://localhost:4173',           // Vite preview
  'https://your-app.netlify.app'     // Replace with your actual Netlify URL
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
    'Access-Control-Allow-Methods': 'DELETE, OPTIONS',
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
    // Get userId and songId from path parameters
    const userId = event.pathParameters?.userId;
    const songId = event.pathParameters?.songId;
    
    if (!userId || !songId) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ 
          error: 'Missing required parameters: userId, songId' 
        })
      };
    }
    
    // Delete from DynamoDB
    const command = new DeleteCommand({
      TableName: 'songs',
      Key: {
        userId: userId,
        songId: songId
      }
    });
    
    await docClient.send(command);
    
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ 
        message: 'Song deleted successfully'
      })
    };
    
  } catch (error) {
    console.error('Error:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ 
        error: 'Failed to delete song',
        details: error.message 
      })
    };
  }
};

