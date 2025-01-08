<script setup lang="ts">
import { ref, computed } from 'vue'
import { useCardStore } from '@/stores/cardStore'

const props = defineProps<{
  cardType: 'Credit' | 'Debit'
}>()

const cardStore = useCardStore()
const showCardNumbers = ref<{ [key: string]: boolean }>({})
const showAllNumbers = ref(false)
const isFlipped = ref<{ [key: string]: boolean }>({})

const cards = computed(() =>
  props.cardType === 'Credit' ? cardStore.creditCards : cardStore.debitCards,
)

const toggleCardNumber = (cardId: string) => {
  showCardNumbers.value[cardId] = !showCardNumbers.value[cardId]
}

const maskCardNumber = (cardId: string, number: string) => {
  return showAllNumbers.value || showCardNumbers.value[cardId]
    ? number
    : `**** **** **** ${number.slice(-4)}`
}

const emit = defineEmits(['card-selected'])

const handleCardClick = (card: any) => {
  if (!isFlipped.value[card.id]) {
    emit('card-selected', card)
  }
}

const toggleAllCardNumbers = () => {
  showAllNumbers.value = !showAllNumbers.value
  cards.value.forEach((card) => {
    showCardNumbers.value[card.id] = showAllNumbers.value
  })
}

const selectDot = (cardId: string, flip: boolean) => {
  isFlipped.value[cardId] = flip
}

const getCardGradient = (index: number) => {
  const creditGradients = [
    'linear-gradient(135deg, #2c3e50, #3498db)', // Blue
    'linear-gradient(135deg, #16a085, #2ecc71)', // Green
    'linear-gradient(135deg, #e74c3c, #c0392b)', // Red
    'linear-gradient(135deg, #8e44ad, #9b59b6)', // Purple
    'linear-gradient(135deg, #f39c12, #d35400)', // Orange
    'linear-gradient(135deg, #1abc9c, #16a085)', // Turquoise
  ]

  const debitGradients = [
    'linear-gradient(135deg, #004d40, #00897b)', // Teal
    'linear-gradient(135deg, #b71c1c, #d32f2f)', // Deep Red
    'linear-gradient(135deg, #1a237e, #303f9f)', // Indigo
    'linear-gradient(135deg, #33691e, #558b2f)', // Light Green
    'linear-gradient(135deg, #e65100, #f57c00)', // Dark Orange
    'linear-gradient(135deg, #4a148c, #7b1fa2)', // Deep Purple
  ]

  const gradients = props.cardType === 'Credit' ? creditGradients : debitGradients
  return gradients[index % gradients.length]
}
</script>

<template>
  <div class="cards-container">
    <div class="cards-grid" v-if="cards.length">
      <div v-for="(card, index) in cards" :key="card.id" class="card-item-container">
        <div class="card-section">
          <div class="show-card-number">
            <v-btn
              small
              class="show-number-btn text-primary"
              @click.stop="toggleCardNumber(card.id)"
            >
              <v-icon start>{{ showCardNumbers[card.id] ? 'mdi-eye-off' : 'mdi-eye' }}</v-icon>
              {{ showCardNumbers[card.id] ? 'Hide Number' : 'Show Card Number' }}
            </v-btn>
          </div>

          <div class="flip-container" :class="{ 'is-flipped': isFlipped[card.id] }">
            <div class="flipper">
              <!-- Front side -->
              <v-card
                class="card-item card-front"
                :style="{ background: getCardGradient(index) + ' !important' }"
                :class="{
                  locked: card.isLocked,
                  archived: card.isArchived,
                  default: card.isDefault
                }"
                @click="handleCardClick(card)"
              >
                <div class="card-header">
                  <v-chip color="primary" small class="default-chip">
                    <template v-if="card.isLocked">
                      <v-icon small class="text-white">mdi-lock</v-icon>
                    </template>
                    <template v-else-if="card.isGPay">
                      <!-- <v-img
                        height="16"
                        width="16"
                        src="https://static.cdnlogo.com/logos/g/93/google.svg"
                        alt="GPay"
                        class="gpay-chip-icon"
                      ></v-img> -->
                      <v-img height="30" width="30" src="https://static.cdnlogo.com/logos/g/93/google.svg" alt="GPay" class="gpay-logo"></v-img>

                    </template>
                    <template v-else-if="card.isDefault">
                      <svg  
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        width="20"
                        height="20"
                        fill="none"
                        stroke="white"
                        stroke-width="2"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                      >
                        <path d="M5 12l5 5L20 7" />
                      </svg>
                    </template>
                  </v-chip>
                  <img
                    src="/public/hdfc-bank-logo-vector-indian-260nw-2351748935 (1).webp"
                    alt="Bank Logo"
                    class="bank-logo"
                  />
                </div>

                <div class="card-body">
                  <div class="cardholder-name">
                    <span class="value text-capitalize">{{ card.name }}</span>
                  </div>

                  <div class="card-number">
                    {{ maskCardNumber(card.id, card.cardNumber) }}
                  </div>

                  <div class="card-footer">
                    <div class="valid-till">
                      <span class="label">VALID TILL:{{ card.validTill }} </span>
                      <span class="value"></span>
                    </div>
                    <div class="cvv">
                      <span class="label">CVV : {{ showCardNumbers[card.id] ? card.cvv : '***' }}</span>
                    </div>
                    <div class="cvv">
                      <img
                        style="height: 30px; position: relative; top: -20px"
                        src="https://upload.wikimedia.org/wikipedia/commons/thumb/5/5e/MasterCard_1979_logo.svg/2560px-MasterCard_1979_logo.svg.png"
                        alt="Bank Logo"
                        class="bank-logo"
                      />
                    </div>
                  </div>
                </div>
              </v-card>

              <!-- Back side -->
              <v-card 
                class="card-item card-back"
                :style="{ background: getCardGradient(index) + ' !important' }"
              >
                <div class="magnetic-strip"></div>
                <div class="signature-box">
                  <div class="signature-text">{{ card.name }}</div>
                  <div class="cvv-box">
                    <span class="cvv-label">CVV:</span>
                    <span class="cvv-number">{{ showCardNumbers[card.id] ? card.cvv : '***' }}</span>
                  </div>
                </div>
              </v-card>
            </div>
          </div>

          <div class="card-dots">
            <span 
              class="dot" 
              :class="{ active: !isFlipped[card.id] }"
              @click.stop="selectDot(card.id, false)"
            ></span>
            <span 
              class="dot" 
              :class="{ active: isFlipped[card.id] }"
              @click.stop="selectDot(card.id, true)"
            ></span>
          </div>
        </div>

        <!-- Card Options Panel -->
        <div class="card-options">
          <div class="options-row">
            <v-btn
              small
              variant="text"
              @click.stop="cardStore.toggleLock(card.id)"
              :class="{ 'option-active': card.isLocked }"
              class="action-btn"
            >
              <div class="action-content">
                <div class="icon-circle" :class="{ active: card.isLocked }">
                  <v-icon
                    class="text-white"
                    size="16"
                    style="font-size: 20px !important"
                    color="white"
                  >
                    {{ card.isLocked ? 'mdi-lock' : 'mdi-lock-outline' }}
                  </v-icon>
                </div>
                <span class="action-text">Lock</span>
              </div>
            </v-btn>

            <v-btn
              small
              variant="text"
              @click.stop="cardStore.toggleArchive(card.id)"
              :class="{ 'option-active': card.isArchived }"
              class="action-btn"
            >
              <div class="action-content">
                <div class="icon-circle" :class="{ active: card.isArchived }">
                  <v-icon
                    class="text-white"
                    size="16"
                    style="font-size: 20px !important"
                    color="white"
                  >
                    {{ card.isArchived ? 'mdi-archive' : 'mdi-archive-outline' }}
                  </v-icon>
                </div>
                <span class="action-text">Archive</span>
              </div>
            </v-btn>
          </div>

          <div class="options-row">
            <v-btn
              small
              variant="text"
              @click.stop="cardStore.setDefault(card.id)"
              :class="{ 'option-active': card.isDefault }"
              class="action-btn"
            >
              <div class="action-content">
                <div class="icon-circle" :class="{ active: card.isDefault }">
                  <v-icon
                    class="text-white"
                    size="16"
                    style="font-size: 20px !important"
                    color="white"
                  >
                    mdi-check
                  </v-icon>
                </div>
                <span class="action-text">Default</span>
              </div>
            </v-btn>

            <v-btn
              small
              variant="text"
              @click.stop="cardStore.toggleGPay(card.id)"
              :class="{ 'option-active': card.isGPay }"
              class="action-btn"
            >
              <div class="action-content">
                <div class="icon-circle1" :class="{ active: card.isGPay }">
                  <div class="gpay-wrapper">
                    <v-img height="45" width="45" src="https://static.cdnlogo.com/logos/g/93/google.svg" alt="GPay" class="gpay-logo"></v-img>
                    <div v-if="card.isGPay" class="check-overlay">
                      <v-icon color="white" size="20">mdi-check</v-icon>
                    </div>
                  </div>
                </div>
                <span class="action-text">GPay</span>
              </div>
            </v-btn>
          </div>
        </div>  
      </div>
    </div>
  </div>
</template>

<style scoped>
.cards-container {
  padding-top: 20px;
}

.cards-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(520px, 1fr));
  gap: 24px;
}

.card-item-container {
  display: flex;
  gap: 16px;
  align-items: stretch;
}

.card-item {
  flex: 1;
  color: white;
  padding: 16px;
  border-radius: 5px;
  height: 170px;
  display: flex;
  flex-direction: column;
  transition: transform 0.6s;
  cursor: pointer;
  position: relative;
  transform-style: preserve-3d;
  margin-bottom: 0;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}

.card-body {
  display: flex;
  flex-direction: column;
  flex: 1;
}

.card-number {
  font-size: 1.25rem;
  letter-spacing: 2px;
  margin-bottom: 12px;
  text-align: start;
}

.card-footer {
  display: flex;
  justify-content: space-between;
  margin-top: auto;
}

.valid-till,
.cvv {
  display: flex;
  flex-direction: column;
}

.label {
  font-size: 0.55rem;
  opacity: 0.8;
  margin-bottom: 2px;
  letter-spacing: 0.5px;
}

.value {
  font-size: 0.8rem;
  letter-spacing: 1px;
}

.bank-logo {
  height: 16px;
  object-fit: contain;
}

.default-chip {
  font-size: 0.7rem;
  height: 24px;
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 0 8px;
}

.ms-1 {
  margin-left: 4px;
}

.locked .default-chip {
  background-color: var(--v-warning-base) !important;
}

.default .default-chip {
  background-color: var(--v-primary-base) !important;
}

.card-options {
  width: 180px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  gap: 4px;
  padding: 12px;
  background: rgb(131, 191, 206);
  border-radius: 5px;
  align-self: stretch;
  height: 170px;
}

.options-row {
  display: flex;
  gap: 8px;
  width: 100%;
}

.action-btn {
  flex: 1;
  height: 70px !important;
  padding: 8px 4px !important;
  /* background: transparent !important; */
  border-radius: 8px;
  transition: all 0.3s ease;
}



.action-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 8px;
}

.action-text {
  font-size: 0.75rem;
  color: white;
  text-transform: none;
}

.action-content .v-icon {
  font-size: 28px !important;
}

.warning-outline,
.secondary-outline,
.success-outline,
.primary-outline {
  border: none !important;
}

.locked {
  opacity: 0.8;
  background: linear-gradient(135deg, #808080, #a9a9a9) !important;
  position: relative;
}

.locked::after {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(128, 128, 128, 0.1);
  pointer-events: none;
}

.archived {
  opacity: 0.7;
  background: linear-gradient(135deg, #7f8c8d, #95a5a6) !important;
}

.default {
  background: linear-gradient(135deg, #1d2162, #2742ae) !important;
}

/* Remove the hover opacity transition since buttons are always visible now */
.card-actions {
  opacity: 1;
}

.show-number-toggle {
  margin-bottom: 8px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  padding-bottom: 8px;
}

.toggle-text {
  font-size: 0.75rem;
  color: white;
  text-transform: none;
}

.show-all-btn {
  font-size: 0.875rem;
  text-transform: none;
  letter-spacing: 0.5px;
}

.card-section {
  flex: 1;
  position: relative;
}

.show-card-number {
  position: absolute;
  top: -30px;
  right: 0;
  z-index: 1;
  height: 20px;
}

.show-number-btn {
  font-size: 0.75rem;
  text-transform: none;
  height: 32px;
  letter-spacing: 0.5px;
  height: 20px !important;
  background-color: #628f93c0;
  width: 150px;
  color: rgb(25, 25, 102) !important;
}

.icon-circle {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background-color: rgba(76, 160, 228, 0.892);
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
  border: 2px solid var(--v-primary-base);
}
.icon-circle1{
    width: 40px;
  height: 40px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
  border: 2px solid var(--v-primary-base);
}

.icon-circle.active {
  /* background-color: var(--v-primary-base); */
  background-color: rgba(6, 29, 48, 0.892);

}

.gpay-chip-icon {
  filter: brightness(0) invert(1); /* Makes the GPay icon white */
}

.gpay-wrapper {
  position: relative;
  width: 60px;
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.check-overlay {
  position: absolute;   
  top: 9px;
  left: 0;
  right: 15px;
  bottom: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: rgba(0, 0, 0, 0.195);
  height: 42px;
  width: 42px;
  border-radius: 50%;
}

.icon-circle1.active {
  background-color: rgba(6, 29, 48, 0.2);
  border-color: #1a73e8;
}

.card-dots {
  display: flex;
  gap: 8px;
  justify-content: center;
  margin-top: 8px;
  padding: 4px;
}

.dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background-color: rgba(44, 62, 80, 0.5); /* Darker color to match card theme */
  cursor: pointer;
  transition: all 0.3s ease;
}

.dot.active {
  background-color: #2c3e50;
  transform: scale(1);
  border-radius: 20px;
  height: 6px;
  width: 10px;
}

.card-item {
  position: relative;
  transform-style: preserve-3d;
  transition: transform 0.6s;
}

.card-back {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(135deg, #2c3e50, #3498db) !important;
  backface-visibility: hidden;
  transform: rotateY(180deg);
  padding: 20px;
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.card-item.flipped {
  transform: rotateY(180deg);
}

.magnetic-strip {
  width: 100%;
  height: 40px;
  background-color: #2c3e50;
  margin: 20px 0;
}

.signature-box {
  background-color: #fff;
  padding: 10px;
  border-radius: 4px;
  color: #000;
}

.signature-text {
  font-family: 'Homemade Apple', cursive;
  color: #2c3e50;
  font-size: 1.2rem;
  margin-bottom: 8px;
}

.cvv-box {
  background-color: #f1f1f1;
  padding: 4px 8px;
  border-radius: 2px;
  font-size: 0.9rem;
}

.flip-container {
  perspective: 1000px;
  width: 100%;
  height: 170px;
}

.flip-container.is-flipped .flipper {
  transform: rotateY(180deg);
}

.flipper {
  transition: 0.6s;
  transform-style: preserve-3d;
  position: relative;
  width: 100%;
  height: 100%;
}

.card-front,
.card-back {
  backface-visibility: hidden;
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
}

.card-front {
  z-index: 2;
  transform: rotateY(0deg);
}

.card-back {
  transform: rotateY(180deg);
  display: flex;
  flex-direction: column;
  padding: 20px;
}

.magnetic-strip {
  width: 100%;
  height: 40px;
  background-color: #1a1a1a;
  margin: 20px 0;
}

.signature-box {
  background-color: #fff;
  padding: 12px;
  border-radius: 4px;
  margin-top: auto;
}

.signature-text {
  font-family: 'Brush Script MT', cursive;
  color: #2c3e50;
  font-size: 1.2rem;
  margin-bottom: 10px;
  border-bottom: 1px solid #eee;
  padding-bottom: 5px;
}

.cvv-box {
  display: flex;
  align-items: center;
  gap: 8px;
  background-color: #f5f5f5;
  padding: 8px;
  border-radius: 4px;
}

.cvv-label {
  font-size: 0.8rem;
  color: #666;
  text-transform: uppercase;
}

.cvv-number {
  font-family: monospace;
  font-size: 1rem;
  color: #2c3e50;
  letter-spacing: 2px;
}

.card-item {
  height: 100%;
  margin-bottom: 0;
}
</style>
