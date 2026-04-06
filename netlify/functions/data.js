// Netlify serverless function — acts as data store using Netlify Blobs
// Endpoint: GET/POST /.netlify/functions/data
// No CORS issues — same origin as the HTML file

const { getStore } = require('@netlify/blobs');

const BLOB_KEY = 'homebase-data';

exports.handler = async (event) => {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Content-Type': 'application/json',
  };

  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers, body: '' };
  }

  try {
    const store = getStore('homebase');

    if (event.httpMethod === 'GET') {
      const data = await store.get(BLOB_KEY, { type: 'json' });
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify(data || null),
      };
    }

    if (event.httpMethod === 'POST') {
      const body = JSON.parse(event.body);
      await store.setJSON(BLOB_KEY, body);
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({ ok: true }),
      };
    }

    return { statusCode: 405, headers, body: JSON.stringify({ error: 'Method not allowed' }) };

  } catch (err) {
    console.error('HomeBase function error:', err);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: err.message }),
    };
  }
};
