<template>
  <v-app>
    <!-- Navigation Drawer -->
    <v-navigation-drawer
      v-model="drawer"
      :permanent="$vuetify.display.lgAndUp"
      :temporary="$vuetify.display.mdAndDown"
      elevation="6"
      class="drawer-bg"
    >
      <v-list>
        <div class="d-flex align-center pa-4">
            
            <v-img src="https://www.girirajdigital.com/media/suzddirc/favicon.svg" width="60" height="60">
            </v-img>
            <h3 class="white-text">GIRIRAJ</h3> <span class="white-text ml-1" style="font-weight: 100; font-size: 1rem;">DIGITAL</span>
        </div>
        <div class="pa-4 pt-1  d-flex justify-center align-center flex-column">
            <h5 class="white-text">
                Software & Web Development
            </h5>
            <h5 class="white-text">
                Company - Umbraco Gold Partner
            </h5>
        </div>
      </v-list>

      <v-divider></v-divider>

      <v-list density="compact" nav class="pa-6">
        <template v-for="(item, index) in items" :key="item.title">
          <v-list-item
            :value="item.title"
            :to="item.to"
            @click="handleItemClick(item)"
            class="nav-item white-text"
          >
            <template v-slot:default="{ isActive }">
              <div style="display: flex; justify-content: space-between; align-items: center;">
                <div style="display: flex; align-items: center;">
                  <v-icon :style="{ color: isActive ? '#1877F2' : 'white' }" style="margin-right: 5px;">{{ item.icon }}</v-icon>
                  <span :style="{ color: isActive ? '#1877F2' : 'white' }">{{ item.title }}</span>
                </div>
                <v-icon v-if="isActive" right style="color: #1877F2;">mdi-arrow-right</v-icon>
              </div>
              <v-divider style="margin-top: 10px; color: white; height: 2px !important;" ></v-divider>
            </template>
          </v-list-item>
        </template>
      </v-list>

      <template v-slot:append>
        <div class="pa-6 text-white cursor-pointer">
              <v-icon class="mr-1" icon="mdi-logout"></v-icon>
            Logout
        </div>
      </template>
    </v-navigation-drawer>

    <!-- App Bar -->
    <v-app-bar color="white" elevation="1">
      <v-app-bar-nav-icon 
        class="text-primary"
        @click="drawer = !drawer"
      ></v-app-bar-nav-icon>
      <v-app-bar-title class="text-primary" ><span style="font-weight: 600 !important;">{{ title }}</span></v-app-bar-title>
      <v-spacer></v-spacer>
      <v-btn icon round class="mr-3 text-primary">  
        <v-icon>mdi-account-outline</v-icon>
        <v-icon>mdi-chevron-down</v-icon>
    </v-btn>
      
    </v-app-bar>

    <!-- Main Content -->
    <v-main class="bg-grey-lighten-4" style="width: 94vw;">
      <v-container fluid class="pa-0 ma-0 " style="align-items: start; text-align: start; flex-direction: column;">
        <RouterView />
      </v-container>
    </v-main>

    <!-- Footer -->
    <!-- <v-footer class="d-flex flex-column bg-white">
      <div class="w-100 text-center">
        {{ new Date().getFullYear() }} — <strong>My Card Manager</strong>
      </div>
    </v-footer> -->
  </v-app>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { RouterView } from 'vue-router'


const drawer = ref(true)
const activeTab = ref('Home')

// Set the title based on the clicked item
const title = ref('Home'); // Default title

const items = [
  { title: 'Home', icon: 'mdi-home', to: '/' },
  { title: 'Cards', icon: 'mdi-credit-card', to: '/cards' },
  { title: 'Transition', icon: 'mdi-transition', to: '/transition' },
  { title: 'Settings', icon: 'mdi-cog', to: '/settings' }
]

const handleItemClick = (item) => {
  activeTab.value = item.title;
  title.value = item.title; // Update title based on clicked item
  console.log("Active Tab:", activeTab.value);
}
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Nunito:wght@400;700&display=swap');

.v-navigation-drawer {
  height: 100vh !important;
}

.v-main {
  min-height: calc(100vh - 64px);
  transition: padding-left 0.2s ease;
  background-color: var(--app-background);
}

.v-container {
  height: 100%;
  max-width: 1440px;
  margin: 0 auto;
}

/* Ensure cards take full width of their columns */
.v-card {
  width: 100%;
}

.nav-item {
  position: relative;
  background-color: transparent !important;
}

/* Remove ALL background colors and transitions */
:deep(.v-list-item--active),
:deep(.v-list-item--active:hover),
:deep(.v-list-item:hover),
.nav-item:hover,
.nav-item.v-list-item--active {
  background-color: transparent !important;
  color: inherit !important;
  transition: none !important;
}

/* Remove ripple effect */
:deep(.v-ripple__container) {
  display: none !important;
}

.drawer-bg {
  background-color: #034069	 !important;
}

.white-text {
  color: white !important;
  font-family: 'Nunito', sans-serif;
}

/* Add this new rule at the end to remove active tab background */
:deep(.v-list-item__overlay) {
  background-color: transparent !important;
  opacity: 0 !important;
  border: none !important;
}
</style> 