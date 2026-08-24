// utils/school-list-service.ts
// Service Métier pour la gestion des demandes de listes scolaires (SchoolListRequest)

export type ConfidenceLevel = 'Élevée' | 'Moyenne' | 'Vérification recommandée';
export type MatchType = 'exact' | 'equivalent' | 'sourcing';
export type SourcingStatus = 'pending' | 'in_review' | 'sourced' | 'partially_sourced' | 'completed';

export interface ExtractedItem {
  id: string;
  rawText: string;
  normalizedName: string;
  quantity: number;
  confidenceScore: number; // 0 à 100 en interne
  confidenceLevel: ConfidenceLevel; // 'Élevée' | 'Moyenne' | 'Vérification recommandée'
  matchType: MatchType;
  matchedProductId?: string;
  matchedProductName?: string;
  matchedProductPrice?: number;
  matchedProductImage?: string;
  isEquivalent?: boolean;
}

export interface SchoolListRequest {
  id: string; // ex: SLR-2026-0001
  createdAt: string;
  originalImage: string; // Base64 ou URL
  overallConfidenceScore: number;
  overallConfidenceLevel: ConfidenceLevel;
  extractedItems: ExtractedItem[];
  exactMatchesCount: number;
  equivalentMatchesCount: number;
  sourcingItemsCount: number;
  availableTotal: number;

  // Champs préparés pour l'architecture V2
  sourcingStatus: SourcingStatus;
  complementaryAmount?: number;
  complementaryPaymentUrl?: string;
  supplierLogs?: Array<{ date: string; note: string; author: string }>;
  internalNotes?: string;

  customerName?: string;
  customerPhone?: string;
  orderRef?: string;
}

/**
 * Convertit un score numérique (0-100) en niveau de confiance qualitatif pour l'utilisateur
 */
export function getConfidenceLevel(score: number): ConfidenceLevel {
  if (score >= 85) return 'Élevée';
  if (score >= 65) return 'Moyenne';
  return 'Vérification recommandée';
}

/**
 * Génère une référence unique structurée SLR-YYYY-XXXX
 */
export function generateSchoolListRef(): string {
  const year = new Date().getFullYear();
  const counterKey = `slr_counter_${year}`;
  let count = 1;

  if (typeof window !== 'undefined' && window.localStorage) {
    const saved = localStorage.getItem(counterKey);
    if (saved) {
      count = parseInt(saved, 10) + 1;
    }
    localStorage.setItem(counterKey, count.toString());
  } else {
    count = Math.floor(Math.random() * 9000) + 1000;
  }

  const paddedCount = String(count).padStart(4, '0');
  return `SLR-${year}-${paddedCount}`;
}

/**
 * Sauvegarde une SchoolListRequest dans le localStorage local
 */
export function saveSchoolListRequest(request: SchoolListRequest): void {
  if (typeof window === 'undefined' || !window.localStorage) return;
  try {
    const existingStr = localStorage.getItem('school_list_requests') || '[]';
    const requests: SchoolListRequest[] = JSON.parse(existingStr);
    const index = requests.findIndex((r) => r.id === request.id);
    if (index >= 0) {
      requests[index] = request;
    } else {
      requests.unshift(request);
    }
    localStorage.setItem('school_list_requests', JSON.stringify(requests.slice(0, 50)));
    localStorage.setItem('active_school_list_request', JSON.stringify(request));
  } catch (err) {
    console.error('Erreur sauvegarde SchoolListRequest:', err);
  }
}

/**
 * Récupère la dernière SchoolListRequest active
 */
export function getActiveSchoolListRequest(): SchoolListRequest | null {
  if (typeof window === 'undefined' || !window.localStorage) return null;
  try {
    const data = localStorage.getItem('active_school_list_request');
    return data ? JSON.parse(data) : null;
  } catch {
    return null;
  }
}
