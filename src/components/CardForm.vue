<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { useCardStore } from '@/stores/cardStore'

const cardStore = useCardStore()
const showErrors = ref(false)

const form = ref({
  name: '',
  bankName: 'HDFC',
  cardType: '',
  cardNumber: '',
  validTill: '',
  cvv: '',
  isDefault: false,
  isGPay: false
})

// Separate validation for card number
const cardNumberError = computed(() => {
  if (!form.value.cardNumber) return ''
  return !/^[0-9]{16}$/.test(form.value.cardNumber) ? 'Card number must be 16 digits' : ''
})

// Validation rules
const errors = computed(() => {
  if (!showErrors.value) return {
    name: '',
    bankName: '',
    cardType: '',
    cardNumber: cardNumberError.value, // Show card number error immediately
    validTill: '',
    cvv: ''
  }

  return {
    name: !form.value.name ? 'Name is required' : '',
    bankName: !form.value.bankName ? 'Bank name is required' : '',
    cardType: !form.value.cardType ? 'Card type is required' : '',
    cardNumber: !form.value.cardNumber ? 'Card number is required' : cardNumberError.value,
    validTill: !form.value.validTill 
      ? 'Valid till is required' 
      : !/^(0[1-9]|1[0-2])\/20[2-9][0-9]$/.test(form.value.validTill) 
      ? 'Invalid date format (MM/YYYY)' 
      : '',
    cvv: !form.value.cvv 
      ? 'CVV is required' 
      : !/^[0-9]{3,4}$/.test(form.value.cvv) 
      ? 'CVV must be 3 or 4 digits' 
      : ''
  }
})

// Function to check if form is valid
const isFormValid = computed(() => {
  const errorValues = Object.values({
    name: !form.value.name,
    bankName: !form.value.bankName,
    cardType: !form.value.cardType,
    cardNumber: !form.value.cardNumber || !/^[0-9]{16}$/.test(form.value.cardNumber),
    validTill: !form.value.validTill || !/^(0[1-9]|1[0-2])\/20[2-9][0-9]$/.test(form.value.validTill),
    cvv: !form.value.cvv || !/^[0-9]{3,4}$/.test(form.value.cvv)
  })
  return !errorValues.some(hasError => hasError)
})

const submit = () => {
  showErrors.value = true
  
  if (!isFormValid.value) {
    return
  }

  if (form.value.isDefault) {
    const hasDefault = form.value.cardType === 'Credit' 
      ? cardStore.defaultCreditCard 
      : cardStore.defaultDebitCard
    
    if (hasDefault) {
      // Show error toast
      return
    }
  }

  cardStore.addCard({
    ...form.value,
    isLocked: false,
    isArchived: false
  })
  dialog.value = false
  showErrors.value = false // Reset error state when form is successfully submitted
}

const dialog = ref(false)

// Reset error state when dialog is closed
watch(dialog, (newValue) => {
  if (!newValue) {
    showErrors.value = false
  }
})
</script>

<template>
  <div>
    <v-btn color="primary" @click="dialog = true">
      <v-icon>mdi-plus</v-icon> Add Card
    </v-btn>

    <v-dialog v-model="dialog" max-width="500px">
      <v-card>
        <div class="align-center justify-space-between" style="border-radius: 0px;">
          <v-card style="border-radius: 0px;">
            <h2 class="text-primary ma-2">New Card</h2>
            <v-btn
              icon
              variant="text"
              size="20px"
              class="mr-2 text-primary"
              @click="dialog = false"
              style="position: absolute; right: 5px; top: 13px;"
            >
              <v-icon>mdi-close</v-icon>
            </v-btn>
          </v-card>
        </div>
        <v-card-text>
          <v-form @submit.prevent="submit">
            <!-- Name Input -->
            <div class="text-subtitle-2">Name</div>
            <v-text-field
              v-model="form.name"
              variant="outlined"
              density="compact"
              :error-messages="errors.name"
              class=""
            ></v-text-field>

            <!-- Bank Name Dropdown -->
            <div class="text-subtitle-2">Bank Name</div>
            <v-select
              v-model="form.bankName"
              :items="['HDFC']"
              variant="outlined"
              density="compact"
              :error-messages="errors.bankName"
              class=""
            ></v-select>

            <!-- Card Type Select -->
            <div class="text-subtitle-2">Card Type</div>
            <v-select
              v-model="form.cardType"
              :items="['Credit', 'Debit']"
              variant="outlined"
              density="compact"
              :error-messages="errors.cardType"
              class=""
            ></v-select>

            <!-- Card Number -->
            <div class="text-subtitle-2">Card Number</div>
            <v-text-field
              v-model="form.cardNumber"
              variant="outlined"
              density="compact"
              :error-messages="errors.cardNumber"
              class=""
              maxlength="16"
              @input="form.cardNumber = form.cardNumber.replace(/\D/g, '')"
            ></v-text-field>

            <!-- Valid Till and CVV Row -->
            <v-row>
              <v-col cols="6">
                <div class="text-subtitle-2">Valid Till (MM/YYYY)</div>
                <v-text-field
                  v-model="form.validTill"
                  variant="outlined"
                  density="compact"
                  :error-messages="errors.validTill"
                  placeholder="--/----"
                  maxlength="7"
                ></v-text-field>
              </v-col>
              <v-col cols="6">
                <div class="text-subtitle-2">CVV</div>
                <v-text-field
                  v-model="form.cvv"
                  type="password"
                  variant="outlined"
                  density="compact"
                  :error-messages="errors.cvv"
                  placeholder="---"
                  maxlength="3"
                  hide-details
                  @input="form.cvv = form.cvv.replace(/\D/g, '')"
                ></v-text-field>
              </v-col>
            </v-row>

            <!-- Checkboxes -->
            <v-checkbox
              v-model="form.isDefault"
              label="Set as Default Card"
              density="compact"
              hide-details
              class="mt-4 mb-2"
            ></v-checkbox>

            <v-checkbox
              v-model="form.isGPay"
              label="Add this card to GPay?"
              density="compact"
              hide-details
              class="mb-2"
            ></v-checkbox>

            <v-divider class="my-4" style="width: 150%; margin-left: -60px;"></v-divider>

            <!-- Action Buttons -->
            <div class="d-flex justify-end">
              <v-btn 
                @click="dialog = false" 
                class="mr-2" 
                style="background-color: lightskyblue; color: white;"
              >
                Cancel
              </v-btn>
              <v-btn 
                color="primary" 
                @click="submit" 
                :disabled="!isFormValid"
                style="background-color: darkblue; color: white;"
              >
                Submit
              </v-btn>
            </div>
          </v-form>
        </v-card-text>
      </v-card>
    </v-dialog>
  </div>
</template>

<style scoped>
.v-card-text {
  overflow-y: auto;
  max-height: 100vh;
  scrollbar-width: none; /* Firefox */
  -ms-overflow-style: none; /* Internet Explorer and Edge */
}

.v-card-text::-webkit-scrollbar {
  display: none; /* Chrome, Safari, and Opera */
}

/* Optional: adjust dialog padding to look cleaner */
.v-card {
  overflow: hidden;
}
</style> 