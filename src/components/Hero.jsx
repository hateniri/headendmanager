import React from 'react'
import { motion } from 'framer-motion'

const Hero = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center px-6 py-20">
      <div className="absolute inset-0 bg-gradient-radial from-glow-blue/20 via-transparent to-transparent" />
      
      <div className="relative max-w-6xl mx-auto text-center">
        <motion.h1 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="text-6xl md:text-8xl font-extralight tracking-wider mb-8 leading-tight"
        >
          <span className="text-glow-strong">その瞬間を、</span>
          <br />
          <span className="text-glow">永遠に保存する</span>
        </motion.h1>
        
        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
          className="text-xl md:text-2xl font-light text-gray-400 mb-16 max-w-3xl mx-auto leading-relaxed"
        >
          あなたが最初に手にした、世界で一つだけの4D体験
        </motion.p>
        
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }}
          className="flex flex-col sm:flex-row gap-6 justify-center"
        >
          <a href="#service" className="px-10 py-5 border border-neon-blue/50 text-neon-blue rounded-full text-lg font-medium hover:bg-neon-blue/10 hover:border-neon-blue transition-all duration-300 border-glow inline-block">
            The Momentとは
          </a>
          <a href="/store" className="px-10 py-5 bg-gradient-to-r from-glow-blue to-neon-blue text-black rounded-full text-lg font-medium hover:opacity-90 transition-opacity duration-300 animate-glow inline-block">
            Storeへ
          </a>
        </motion.div>
      </div>
      
      <motion.div 
        animate={{ y: [0, -10, 0] }}
        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        className="absolute bottom-10 left-1/2 transform -translate-x-1/2"
      >
        <div className="w-6 h-10 border border-neon-blue/50 rounded-full flex justify-center">
          <div className="w-1 h-3 bg-neon-blue rounded-full mt-2 animate-bounce" />
        </div>
      </motion.div>
    </section>
  )
}

export default Hero