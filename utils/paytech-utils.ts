/**
 * Utilitaires PayTech - Vérification IPN et signatures
 */

import crypto from 'crypto';

export class PayTechUtils {
  /**
   * Vérifier la signature IPN PayTech
   */
  static verifyPayTechSignature(body: any): boolean {
    try {
      const secretKey = process.env.PAYTECH_SECRET_KEY;
      
      if (!secretKey) {
        console.error("❌ PAYTECH_SECRET_KEY manquante");
        return false;
      }

      // En mode sandbox/développement, accepter tous les webhooks
      if (
        process.env.PAYTECH_SANDBOX === "true" ||
        process.env.NODE_ENV === "development"
      ) {
        console.log("🧪 Mode sandbox/développement - signature IPN contournée");
        return true;
      }

      // Récupérer la signature depuis les headers ou le body
      const receivedSignature = body.signature || body.hash;
      
      if (!receivedSignature) {
        console.error("❌ Signature IPN manquante");
        return false;
      }

      // Construire la chaîne de données pour la vérification
      const dataString = this.buildPayTechDataString(body);
      
      // Calculer la signature attendue
      const expectedSignature = this.generatePayTechSignature(dataString, secretKey);
      
      // Comparer les signatures
      const isValid = expectedSignature === receivedSignature;
      
      if (isValid) {
        console.log("✅ Signature IPN PayTech valide");
      } else {
        console.error("❌ Signature IPN PayTech invalide");
        console.log("Signature reçue:", receivedSignature);
        console.log("Signature attendue:", expectedSignature);
        console.log("Données utilisées:", dataString);
      }
      
      return isValid;
    } catch (error) {
      console.error("❌ Erreur vérification signature PayTech:", error);
      return false;
    }
  }

  /**
   * Construire la chaîne de données pour la signature PayTech
   */
  private static buildPayTechDataString(body: any): string {
    // Ordre des champs selon la documentation PayTech
    const fields = [
      'type_event',
      'custom_field',
      'ref_command',
      'item_name',
      'item_price',
      'devise',
      'command_name',
      'env',
      'token',
      'api_key_sha256',
      'api_secret_sha256',
      'payment_method',
      'payment_api_responses_success_message',
      'payment_api_responses_success_url',
      'payment_api_responses_cancel_url',
      'client_phone'
    ];

    return fields
      .map(field => body[field] || '')
      .join('');
  }

  /**
   * Générer la signature PayTech
   */
  private static generatePayTechSignature(data: string, secretKey: string): string {
    // PayTech utilise généralement MD5 ou SHA256
    // Vérifiez la documentation PayTech pour le bon algorithme
    return crypto
      .createHash('sha256')
      .update(data + secretKey)
      .digest('hex');
  }

  /**
   * Valider les données PayTech
   */
  static validatePayTechData(body: any): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];

    // Vérifications de base
    if (!body.type_event) {
      errors.push("type_event manquant");
    }

    if (!body.ref_command) {
      errors.push("ref_command manquant");
    }

    if (!body.item_price && !body.final_item_price) {
      errors.push("Prix manquant (item_price ou final_item_price)");
    }

    // Vérifier les types d'événements supportés
    const supportedEvents = ['sale_complete', 'sale_cancel', 'sale_pending'];
    if (body.type_event && !supportedEvents.includes(body.type_event)) {
      errors.push(`Type d'événement non supporté: ${body.type_event}`);
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }

  /**
   * Nettoyer et formater une référence de commande
   */
  static sanitizeOrderRef(orderRef: string): string {
    if (!orderRef) return '';
    
    // Supprimer les caractères spéciaux et normaliser
    return orderRef
      .trim()
      .replace(/[^a-zA-Z0-9-_]/g, '')
      .toUpperCase();
  }

  /**
   * Formater un montant PayTech
   */
  static formatPayTechAmount(amount: number | string): number {
    const numAmount = typeof amount === 'string' ? parseFloat(amount) : amount;
    return Math.round(numAmount * 100) / 100; // 2 décimales
  }

  /**
   * Générer une référence de commande unique
   */
  static generateOrderRef(): string {
    const timestamp = Date.now().toString(36);
    const random = Math.random().toString(36).substr(2, 5);
    return `FS-${timestamp}-${random}`.toUpperCase();
  }
}
