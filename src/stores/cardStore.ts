import { defineStore } from 'pinia'
import { ref, computed, watch } from 'vue'

export interface Card {
  id: string
  name: string
  bankName: string
  cardNumber: string
  validTill: string
  cvv: string
  cardType: 'Credit' | 'Debit'
  isLocked: boolean
  isArchived: boolean
  isDefault: boolean
  isGPay: boolean
}

export const useCardStore = defineStore('cardStore', () => {
  const cards = ref<Card[]>([])

  // Load cards from localStorage on initialization
  const loadCards = () => {
    const savedCards = localStorage.getItem('cards')
    if (savedCards) {
      cards.value = JSON.parse(savedCards)
    }
  }

  // Save cards to localStorage whenever they change
  watch(
    cards,
    (newCards) => {
      localStorage.setItem('cards', JSON.stringify(newCards))
    },
    { deep: true }
  )

  // Load cards when store is created
  loadCards()

  const creditCards = computed(() => 
    cards.value.filter(card => card.cardType === 'Credit' && !card.isArchived)
  )
  
  const debitCards = computed(() => 
    cards.value.filter(card => card.cardType === 'Debit' && !card.isArchived)
  )
  
  const defaultCreditCard = computed(() => 
    creditCards.value.find(card => card.isDefault)
  )
  
  const defaultDebitCard = computed(() => 
    debitCards.value.find(card => card.isDefault)
  )

  const addCard = (cardData: Omit<Card, 'id' | 'isLocked' | 'isArchived'>) => {
    const newCard: Card = {
      ...cardData,
      id: crypto.randomUUID(),
      isLocked: false,
      isArchived: false
    }

    // If this card is set as default, remove default from other cards of same type
    if (newCard.isDefault) {
      cards.value.forEach(card => {
        if (card.cardType === newCard.cardType) {
          card.isDefault = false
        }
      })
    }

    cards.value.push(newCard)
  }

  const toggleLock = (cardId: string) => {
    const card = findCard(cardId)
    if (card) {
      card.isLocked = !card.isLocked
    }
  }

  const toggleArchive = (cardId: string) => {
    const card = findCard(cardId)
    if (card) {
      card.isArchived = !card.isArchived
      // If archived card was default, remove default status
      if (card.isArchived && card.isDefault) {
        card.isDefault = false
      }
    }
  }

  const setDefault = (cardId: string) => {
    const card = findCard(cardId)
    if (!card || card.isArchived) return

    // Remove default status from other cards of same type
    cards.value.forEach(c => {
      if (c.cardType === card.cardType) {
        c.isDefault = false
      }
    })
    
    card.isDefault = true
  }

  const toggleGPay = (cardId: string) => {
    const card = findCard(cardId)
    if (card) {
      card.isGPay = !card.isGPay
    }
  }

  const findCard = (cardId: string) => {
    return cards.value.find(card => card.id === cardId)
  }

  const deleteCard = (cardId: string) => {
    cards.value = cards.value.filter(card => card.id !== cardId)
  }

  return {
    cards,
    creditCards,
    debitCards,
    defaultCreditCard,
    defaultDebitCard,
    addCard,
    toggleLock,
    toggleArchive,
    setDefault,
    toggleGPay,
    deleteCard,
    findCard
  }
}) 