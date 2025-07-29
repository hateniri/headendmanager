import React from 'react'
import { motion } from 'framer-motion'
import { useInView } from 'framer-motion'
import { useRef } from 'react'

const FeatureCard = ({ icon, title, delay }) => {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-50px" })
  
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, scale: 0.8 }}
      animate={isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.8 }}
      transition={{ duration: 0.6, delay, ease: "easeOut" }}
      className="relative group"
    >
      <div className="absolute inset-0 bg-gradient-to-br from-neon-blue/20 to-transparent rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-xl" />
      <div className="relative bg-black/30 backdrop-blur-sm border border-white/10 rounded-xl p-8 text-center hover:border-neon-blue/50 transition-all duration-500 h-full">
        <div className="text-5xl mb-6 animate-float">{icon}</div>
        <p className="text-lg font-light text-gray-300">{title}</p>
      </div>
    </motion.div>
  )
}

const OwnershipFeatures = () => {
  const features = [
    { icon: "🌐", title: "P2P配布自由" },
    { icon: "💰", title: "所有者に30%報酬" },
    { icon: "👤", title: "複製しても本物は一人" },
    { icon: "🔐", title: "NFT署名または暗号ハッシュによる証明" }
  ]
  
  return (
    <section className="relative py-32 px-6">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-glow-blue/5 to-transparent" />
      
      <div className="relative max-w-6xl mx-auto">
        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-5xl md:text-6xl font-extralight text-center mb-20 text-glow"
        >
          所有と自由
        </motion.h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <FeatureCard
              key={index}
              icon={feature.icon}
              title={feature.title}
              delay={index * 0.1}
            />
          ))}
        </div>
      </div>
    </section>
  )
}

export default OwnershipFeatures