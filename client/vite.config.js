// import { defineConfig } from 'vite'
// import react from '@vitejs/plugin-react-swc'

// // https://vite.dev/config/
// export default defineConfig({
//   plugins: [react()],
// })

import { defineConfig } from 'vite'
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react-swc'
export default defineConfig({
   server:{
    port:7153,
    // proxy:{
    //   '/api':{
    //     target:'http://localhost:3000',
    //     secure:false
    //   }
    // }
  },
  plugins: [
    tailwindcss(),
    react()
  ],
 
})