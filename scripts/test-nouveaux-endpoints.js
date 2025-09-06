#!/usr/bin/env node

/**
 * Script pour tester les nouveaux endpoints créés
 */

const fetch = require('node-fetch');

const BASE_URL = 'https://fournitures-scolaire.vercel.app';

async function testNewEndpoints() {
  console.log('🧪 TEST DES NOUVEAUX ENDPOINTS');
  console.log('='.repeat(50));
  
  // Test 1: Récupérer une commande spécifique (inexistante)
  console.log('\n1. Test GET /api/orders/[orderRef] (commande inexistante)');
  try {
    const response = await fetch(`${BASE_URL}/api/orders/CMD_TEST_123`);
    console.log(`Status: ${response.status}`);
    const data = await response.json();
    console.log('Réponse:', JSON.stringify(data, null, 2));
  } catch (error) {
    console.error('Erreur:', error.message);
  }
  
  // Test 2: Récupérer toutes les commandes
  console.log('\n2. Test GET /api/orders (liste des commandes)');
  try {
    const response = await fetch(`${BASE_URL}/api/orders?limit=5`);
    console.log(`Status: ${response.status}`);
    const data = await response.json();
    console.log('Nombre de commandes:', data.orders?.length || 0);
    if (data.orders && data.orders.length > 0) {
      console.log('Première commande:', data.orders[0].orderRef);
    }
  } catch (error) {
    console.error('Erreur:', error.message);
  }
  
  // Test 3: Récupérer commandes par email (email inexistant)
  console.log('\n3. Test GET /api/orders/by-email (email inexistant)');
  try {
    const response = await fetch(`${BASE_URL}/api/orders/by-email?email=test@inexistant.com`);
    console.log(`Status: ${response.status}`);
    const data = await response.json();
    console.log('Réponse:', JSON.stringify(data, null, 2));
  } catch (error) {
    console.error('Erreur:', error.message);
  }
  
  // Test 4: Test webhook PayTech (données minimales)
  console.log('\n4. Test POST /api/paytech/webhook-new (données minimales)');
  try {
    const response = await fetch(`${BASE_URL}/api/paytech/webhook-new`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        type_event: 'sale_complete',
        ref_command: 'TEST_WEBHOOK_123',
        item_price: 5000,
        payment_method: 'paytech',
        client_phone: '221777777777'
      })
    });
    console.log(`Status: ${response.status}`);
    const data = await response.json();
    console.log('Réponse:', JSON.stringify(data, null, 2));
  } catch (error) {
    console.error('Erreur:', error.message);
  }
  
  console.log('\n' + '='.repeat(50));
  console.log('✅ Tests terminés');
}

testNewEndpoints().catch(console.error);
