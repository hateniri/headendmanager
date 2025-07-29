const express = require('express')
const path = require('path')

const app = express()
const PORT = 5173

// Serve static files from the current directory
app.use(express.static('.'))

// Serve index.html for all routes (SPA support)
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'))
})

app.listen(PORT, () => {
  console.log(`✨ MomentVault server running at http://localhost:${PORT}`)
  console.log(`📦 Time capsules ready to be discovered...`)
})