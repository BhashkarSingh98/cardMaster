import { defineStore } from 'pinia'

interface Card {
  id: string
  name: string
  bankName: string
  cardType: 'Credit' | 'Debit'
  cardNumber: string
  validTill: string
  cvv: string
  isDefault: boolean
  isGPay: boolean
  isLocked: boolean
  isArchived: boolean
}

export const useCardStore = defineStore('card', {
  state: () => ({
    cards: [] as Card[],
    activeCardId: null as string | null
  }),

  getters: {
    creditCards: (state) => state.cards.filter(card => card.cardType === 'Credit' && !card.isArchived),
    debitCards: (state) => state.cards.filter(card => card.cardType === 'Debit' && !card.isArchived),
    archivedCards: (state) => state.cards.filter(card => card.isArchived),
    defaultCreditCard: (state) => state.cards.find(card => card.cardType === 'Credit' && card.isDefault),
    defaultDebitCard: (state) => state.cards.find(card => card.cardType === 'Debit' && card.isDefault)
  },

  actions: {
    addCard(card: Omit<Card, 'id'>) {
      const newCard = {
        ...card,
        id: crypto.randomUUID()
      }
      this.cards.push(newCard)
    },

    toggleLock(cardId: string) {
      const card = this.cards.find(c => c.id === cardId)
      if (card) {
        card.isLocked = !card.isLocked
      }
    },

    toggleArchive(cardId: string) {
      const card = this.cards.find(c => c.id === cardId)
      if (card) {
        card.isArchived = !card.isArchived
      }
    },

    setDefault(cardId: string) {
      const card = this.cards.find(c => c.id === cardId)
      if (card) {
        // Remove default from other cards of same type
        this.cards
          .filter(c => c.cardType === card.cardType)
          .forEach(c => c.isDefault = false)
        card.isDefault = true
      }
    },

    toggleGPay(cardId: string) {
      const card = this.cards.find(c => c.id === cardId)
      if (card) {
        card.isGPay = !card.isGPay
      }
    },

    setActiveCard(cardId: string) {
      this.activeCardId = cardId
    }
  }
}) 