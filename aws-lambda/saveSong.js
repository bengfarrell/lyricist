/**
 * Lambda function to save or update a song in DynamoDB
 */

import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, PutCommand } from "@aws-sdk/lib-dynamodb";

const client = new DynamoDBClient({ region: "us-east-1" });
const docClient = DynamoDBDocumentClient.from(client);

export const handler = async (event) => {
  console.log('Event:', JSON.stringify(event, null, 2));
  
  try {
    // Parse the request body
    const song = JSON.parse(event.body);
    
    // Validate required fields
    if (!song.userId || !song.songId || !song.name) {
      return {
        statusCode: 400,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Headers': 'Content-Type',
          'Access-Control-Allow-Methods': 'POST, OPTIONS'
        },
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
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'POST, OPTIONS'
      },
      body: JSON.stringify({ 
        message: 'Song saved successfully',
        song: song
      })
    };
    
  } catch (error) {
    console.error('Error:', error);
    return {
      statusCode: 500,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'POST, OPTIONS'
      },
      body: JSON.stringify({ 
        error: 'Failed to save song',
        details: error.message 
      })
    };
  }
};



