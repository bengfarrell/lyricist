/**
 * Lambda function to delete a song from DynamoDB
 */

import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, DeleteCommand } from "@aws-sdk/lib-dynamodb";

const client = new DynamoDBClient({ region: "us-east-1" });
const docClient = DynamoDBDocumentClient.from(client);

export const handler = async (event) => {
  console.log('Event:', JSON.stringify(event, null, 2));
  
  try {
    // Get userId and songId from path parameters
    const userId = event.pathParameters?.userId;
    const songId = event.pathParameters?.songId;
    
    if (!userId || !songId) {
      return {
        statusCode: 400,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Headers': 'Content-Type',
          'Access-Control-Allow-Methods': 'DELETE, OPTIONS'
        },
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
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'DELETE, OPTIONS'
      },
      body: JSON.stringify({ 
        message: 'Song deleted successfully'
      })
    };
    
  } catch (error) {
    console.error('Error:', error);
    return {
      statusCode: 500,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'DELETE, OPTIONS'
      },
      body: JSON.stringify({ 
        error: 'Failed to delete song',
        details: error.message 
      })
    };
  }
};

