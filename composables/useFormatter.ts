export const useFormatter = () => {
  /**
   * Formate un prix en francs CFA
   */
  const formatCurrency = (price: number): string => {
    if (typeof price !== 'number' || isNaN(price)) {
      return '0 CFA'
    }
    
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'XOF',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(price).replace('XOF', 'CFA')
  }

function formatPrice(price: number): string {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'XOF'
    }).format(price)
  }

 
  /**
   * Formate un prix simple sans devise
   */
  const formatNumber = (number: number): string => {
    if (typeof number !== 'number' || isNaN(number)) {
      return '0'
    }
    
    return new Intl.NumberFormat('fr-FR').format(number)
  }

  /**
   * Formate une date en français
   */
  const formatDate = (date: Date | string, format: 'short' | 'medium' | 'long' = 'medium'): string => {
    const dateObj = new Date(date)
    
    if (isNaN(dateObj.getTime())) {
      return 'Date invalide'
    }

    const options: Intl.DateTimeFormatOptions = {
      day: 'numeric',
      month: format === 'short' ? 'numeric' : 'long',
      year: 'numeric'
    }

    if (format === 'long') {
      options.weekday = 'long'
    }

    return new Intl.DateTimeFormat('fr-FR', options).format(dateObj)
  }

  return {
    formatPrice,
    formatCurrency,
    formatNumber,
    formatDate,
  }
}
