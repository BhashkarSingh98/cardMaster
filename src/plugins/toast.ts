import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'

const vuetify = createVuetify({
  components,
  directives,
  theme: {
    defaultTheme: 'light'
  }
})

export const showToast = (message: string, type: 'success' | 'error' = 'success') => {
  const snackbar = document.createElement('div')
  snackbar.className = `v-snackbar v-snackbar--${type}`
  snackbar.textContent = message
  document.body.appendChild(snackbar)

  setTimeout(() => {
    document.body.removeChild(snackbar)
  }, 3000)
}

export default vuetify 