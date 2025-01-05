<script setup lang="ts">
import CardForm from '@/components/CardForm.vue'
import CardDisplay from '@/components/CardDisplay.vue'
import { ref } from 'vue'

const tab = ref(1)
const secondaryColor = '#00538C'

interface Transaction {
  id: number
  title: string
  amount: number
  date: string
  cardType: 'Credit Card' | 'Debit Card'
  cardNumber: string
}

const transactions = ref<Transaction[]>([
  {
    id: 1,
    title: 'Online Purchase',
    amount: -156.78,
    date: '2024-03-15',
    cardType: 'Credit Card',
    cardNumber: '4582'
  },
  {
    id: 2,
    title: 'Salary Deposit',
    amount: 2500.00,
    date: '2024-03-15',
    cardType: 'Debit Card',
    cardNumber: '1234'
  },
  {
    id: 3,
    title: 'Restaurant Payment',
    amount: -89.99,
    date: '2024-03-15',
    cardType: 'Credit Card',
    cardNumber: '7890'
  },
  {
    id: 4,
    title: 'Refund',
    amount: 45.50,
    date: '2024-03-15',
    cardType: 'Credit Card',
    cardNumber: '4582'
  },
  {
    id: 5,
    title: 'Grocery Shopping',
    amount: -210.35,
    date: '2024-03-15',
    cardType: 'Debit Card',
    cardNumber: '1234'
  }
])
</script>

<template>
  <v-container fluid class="home-container" style="border: 1px solid gainsboro; padding: 0px;margin-top: 10px;">
    <v-card flat>
      <v-tabs
        v-model="tab"
        align-tabs="start"
        color="primary"
      >
        <v-tab :value="1" class="text-capitalize">Saved Cards</v-tab>
        <v-tab :value="2" class="text-capitalize">GD Cards</v-tab>
        <CardForm class="flex-end" style="position: absolute; right:20px; top: 5px;" />
      </v-tabs>
      <v-divider></v-divider>

      <v-window v-model="tab">
        <!-- Saved Cards Tab -->
        <v-window-item :value="1">
          <v-container fluid>
            <v-row>
              <!-- Left Side - Transaction List -->
              <v-col cols="4">
                <v-expansion-panels class="custom-expansion-panels">
                  <!-- Card Details Panel -->
                  <v-expansion-panel class="mb-5">
                    <v-expansion-panel-title>
                      <v-row no-gutters>
                        <v-col cols="2">
                          <v-icon color="primary">mdi-credit-card-outline</v-icon>
                        </v-col>
                        <v-col cols="10" class="text-primary">
                          Card Details
                        </v-col>
                      </v-row>
                    </v-expansion-panel-title>
                    <v-expansion-panel-text>
                      <v-list>
                        <v-list-item>
                          <v-row no-gutters align="center">
                            <v-col cols="2">
                              <v-icon color="primary">mdi-arrow-up-down</v-icon>
                            </v-col>
                            <v-col cols="7">
                              <v-list-item-title>Total Cards</v-list-item-title>
                            </v-col>
                            <v-col cols="3" class="text-right">
                              <v-list-item-subtitle>5</v-list-item-subtitle>
                            </v-col>
                          </v-row>
                        </v-list-item>
                        <v-list-item>
                          <v-row no-gutters align="center">
                            <v-col cols="2">
                              <v-icon color="success">mdi-arrow-up-circle</v-icon>
                            </v-col>
                            <v-col cols="7">
                              <v-list-item-title>Active Cards</v-list-item-title>
                            </v-col>
                            <v-col cols="3" class="text-right">
                              <v-list-item-subtitle>3</v-list-item-subtitle>
                            </v-col>
                          </v-row>
                        </v-list-item>
                        <v-list-item>
                          <v-row no-gutters align="center">
                            <v-col cols="2">
                              <v-icon color="error">mdi-arrow-down-circle</v-icon>
                            </v-col>
                            <v-col cols="7">
                              <v-list-item-title>Blocked Cards</v-list-item-title>
                            </v-col>
                            <v-col cols="3" class="text-right">
                              <v-list-item-subtitle>2</v-list-item-subtitle>
                            </v-col>
                          </v-row>
                        </v-list-item>
                      </v-list>
                    </v-expansion-panel-text>
                  </v-expansion-panel>

                  <!-- Today's Transactions Panel -->
                  <v-expansion-panel>
                    <v-expansion-panel-title>
                      <v-row no-gutters>
                        <v-col cols="2">
                          <v-icon color="primary">mdi-calendar-clock</v-icon>
                        </v-col>
                        <v-col cols="10" class="text-primary">
                          Today's Transactions
                        </v-col>
                      </v-row>
                    </v-expansion-panel-title>
                    <v-expansion-panel-text>
                      <v-list>
                        <v-list-item v-for="transaction in transactions" :key="transaction.id">
                          <v-row no-gutters>
                            <v-col cols="12" class="d-flex justify-space-between align-center mb-1">
                              <div class="d-flex align-start">
                                <v-icon
                                  :color="transaction.amount > 0 ? 'primary' : 'primary'"
                                  class="mr-2"
                                >
                                  {{ transaction.amount > 0 ? 'mdi-arrow-up-circle' : 'mdi-arrow-down-circle' }}
                                </v-icon>
                                <span class="text-subtitle-2">{{ transaction.title }}</span>
                              </div>
                              <span   
                                :class="transaction.amount > 0 ? 'text-success' : 'text-error'" 
                                class="text-subtitle-2"
                              >
                                {{ transaction.amount > 0 ? '+' : '-' }}${{ Math.abs(transaction.amount).toFixed(2) }}
                              </span>
                            </v-col>
                            <v-col cols="12" class="pl-8">
                              <div class="text-caption text-grey mt-n2 pa-0">
                                {{ new Date(transaction.date).toLocaleDateString() }}
                              </div>
                              <div class="text-caption text-primary ma-0 pa-0">
                                {{ transaction.cardType }} - **** {{ transaction.cardNumber }}
                              </div>
                            </v-col>
                          </v-row>
                          <v-divider class="my-2 " v-if="transaction.id !== transactions.length"></v-divider>
                        </v-list-item>
                      </v-list>
                    </v-expansion-panel-text>
                  </v-expansion-panel>
                </v-expansion-panels>
              </v-col>

              <!-- Middle - Cards Display -->
              <v-col cols="8">
                <v-row justify="center">
                  <v-col cols="12" style="max-width: 550px;">
                    <h3 class="text-primary">Credit Cards</h3>
                    <div style="width: 90px; height: 2px; background-color: rgb(24 103 192 / 72%);"></div>
                    <CardDisplay card-type="Credit" />
                  </v-col>
                </v-row>

                <v-row justify="center">
                  <v-col cols="12" style="max-width: 550px;">
                    <h3 class="text-primary">Debit Cards</h3>
                    <div style="width: 90px; height: 2px; background-color: rgb(24 103 192 / 72%);"></div>
                    <CardDisplay card-type="Debit" />
                  </v-col>
                </v-row>
              </v-col>
            </v-row>
          </v-container>
        </v-window-item>

        <!-- GD Cards Tab -->
        <v-window-item :value="2">
          <v-container fluid>
            <v-row>
              <v-col cols="12">
                <v-card class="gd-cards-container">
                  <v-list>
                    <v-list-item v-for="i in 3" :key="i" class="gd-card-item">
                      <v-list-item-title class="text-h6">
                        GD Card #{{ i }}
                      </v-list-item-title>
                      <template v-slot:append>
                        <v-btn
                          color="primary"
                          variant="text"
                          icon="mdi-chevron-right"
                        ></v-btn>
                      </template>
                    </v-list-item>
                  </v-list>
                </v-card>
              </v-col>
            </v-row>
          </v-container>
        </v-window-item>
      </v-window>
    </v-card>
  </v-container>
</template>

<style scoped>
.home-container {
  max-width: 100%;
  padding: 20px;
}

.v-row {
  margin: 0;
  width: 100%;
  justify-content: center;
}

.card-options {
  padding: 16px;
  position: sticky;
  top: 20px;
}

.v-btn {
  margin-bottom: 8px;
}

.gd-cards-container {
  border-radius: 8px;
  background-color: #f5f5f5;
  margin-top: 20px;
}

.gd-card-item {
  border-bottom: 1px solid #e0e0e0;
  padding: 16px;
}

.gd-card-item:last-child {
  border-bottom: none;
}

.gd-card-item:hover {
  background-color: #eeeeee;
}

.v-window {
  margin-top: 20px;
}

.custom-expansion-panels {
  width: 100%;
}

.custom-expansion-panels :deep(.v-expansion-panel) {
  width: 100%;
}

/* Add margin bottom to first expansion panel */
.mb-5 {
  margin-bottom: 20px !important;
}

.card-number-display {
  font-size: 0.9rem;
  color: #666;
  margin-bottom: 8px;
  font-weight: 500;
}

.action-btn {
  height: 42px;
  font-size: 0.85rem;
}

.v-list-item {
  padding: 4px;
}

.card-options .v-row {
  padding: 8px;
}

.text-success {
  color: #4CAF50 !important;
}

.text-error {
  color: #FF5252 !important;
}

.v-list-item {
  padding: 8px 16px;
}

.pl-9 {
  padding-left: 36px !important;
}

.text-right {
  text-align: right;
}

.v-list-item-subtitle {
  font-weight: 500;
  font-size: 1.1rem;
}

/* Update the selector for card containers */
.v-col[style*="max-width: 500px"] {
  margin: 0 auto;
}
</style>
