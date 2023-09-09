// /** @type {import('next').NextConfig} */

// const withPWA = require('next-pwa')({
//   dest: 'public'
// })

// module.exports = withPWA({
//   // next.js config
//   reactStrictMode: true,

// })

// next.config.js

/** @type {import('next').NextConfig} */

const runtimeCaching = require("next-pwa/cache");
const withPWA = require('next-pwa')({
 dest: 'public', 
 register: true,
 skipWaiting: true,
 runtimeCaching
})

module.exports = withPWA({
 // other congigs
 reactStrictMode: false
})