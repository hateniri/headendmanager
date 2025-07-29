import React from 'react'
import { motion } from 'framer-motion'
import { useInView } from 'framer-motion'
import { useRef } from 'react'

const ServiceCard = ({ title, subtitle, description, delay }) => {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-100px" })
  
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 50 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
      transition={{ duration: 0.8, delay, ease: "easeOut" }}
      className="relative group"
    >
      <div className="absolute inset-0 bg-gradient-to-br from-glow-blue/10 to-transparent rounded-2xl blur-xl group-hover:from-glow-blue/20 transition-all duration-500" />
      <div className="relative bg-black/50 backdrop-blur-sm border border-white/10 rounded-2xl p-8 md:p-12 hover:border-neon-blue/30 transition-all duration-500">
        <h3 className="text-3xl md:text-4xl font-light mb-4 text-glow">{title}</h3>
        <p className="text-lg text-neon-blue/80 mb-6 font-medium">{subtitle}</p>
        <p className="text-gray-400 leading-relaxed text-lg">{description}</p>
      </div>
    </motion.div>
  )
}

const ServiceOverview = () => {
  return (
    <section id="service" className="relative py-32 px-6">
      <div className="max-w-7xl mx-auto">
        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-5xl md:text-6xl font-extralight text-center mb-20 text-glow"
        >
          サービス概要
        </motion.h2>
        
        <div className="grid md:grid-cols-2 gap-8 md:gap-12">
          <ServiceCard
            title="Frozen TimeSpace"
            subtitle="サブスク型のXRコンテンツ体験"
            description="推しを自室に召喚するような臨場感。毎月更新される新しい4D体験を、専用のViewerで楽しめます。空間と時間を超えた、新しいエンターテインメント。"
            delay={0}
          />
          <ServiceCard
            title="The Moment"
            subtitle="世界に1人だけが購入できる一点モノの4D体験"
            description="拡散しても、隠しても自由。あなたの瞬間。その瞬間の所有権は完全にあなたのもの。NFTまたは暗号ハッシュで真正性を証明。"
            delay={0.2}
          />
        </div>
      </div>
    </section>
  )
}

export default ServiceOverview