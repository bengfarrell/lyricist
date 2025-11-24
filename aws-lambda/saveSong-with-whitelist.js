/**
 * Lambda function to save or update a song in DynamoDB
 * WITH ORIGIN WHITELISTING
 */

import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, PutCommand } from "@aws-sdk/lib-dynamodb";

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
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
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
    // Parse the request body
    const song = JSON.parse(event.body);
    
    // Validate required fields
    if (!song.userId || !song.songId || !song.name) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ 
          error: 'Missing required fields: userId, songId, name' 
        })
      };
    }
    
    // Save to DynamoDB
    const command = new PutCommand({
      TableName: 'songs',
      Item: {
        userId: song.userId,
        songId: song.songId,
        name: song.name,
        items: song.items || [],
        wordLadderSets: song.wordLadderSets || [],
        lastModified: song.lastModified || new Date().toISOString(),
        exportedAt: song.exportedAt
      }
    });
    
    await docClient.send(command);
    
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ 
        message: 'Song saved successfully',
        song: song
      })
    };
    
  } catch (error) {
    console.error('Error:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ 
        error: 'Failed to save song',
        details: error.message 
      })
    };
  }
};

