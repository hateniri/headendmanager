import React from 'react'
import { motion } from 'framer-motion'

const StoreHeader = () => {
  return (
    <header className="fixed top-0 left-0 right-0 bg-black/80 backdrop-blur-md border-b border-white/10 z-40">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        <motion.a
          href="/"
          className="text-2xl font-light text-glow hover:opacity-80 transition-opacity"
          whileHover={{ scale: 1.05 }}
        >
          MomentVault
        </motion.a>
        
        <nav className="flex items-center gap-8">
          <a href="/" className="text-gray-400 hover:text-white transition-colors">
            ホーム
          </a>
          <a href="/store" className="text-white">
            ストア
          </a>
          <button className="px-6 py-2 border border-neon-blue/50 text-neon-blue rounded-full hover:bg-neon-blue/10 transition-all">
            ウォレット接続
          </button>
        </nav>
      </div>
    </header>
  )
}

export default StoreHeader