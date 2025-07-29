import React from 'react'
import { motion } from 'framer-motion'
import { useInView } from 'framer-motion'
import { useRef } from 'react'

const StepCard = ({ number, title, description, delay }) => {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-100px" })
  
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, x: -50 }}
      animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -50 }}
      transition={{ duration: 0.8, delay, ease: "easeOut" }}
      className="relative"
    >
      <div className="flex items-start gap-6">
        <div className="flex-shrink-0 w-16 h-16 bg-gradient-to-br from-neon-blue to-glow-blue rounded-full flex items-center justify-center text-black font-bold text-xl animate-pulse-slow">
          {number}
        </div>
        <div className="flex-1">
          <h3 className="text-2xl font-light mb-2 text-glow">{title}</h3>
          <p className="text-gray-400 leading-relaxed">{description}</p>
        </div>
      </div>
      {number < 4 && (
        <div className="ml-8 mt-4 mb-4 h-16 w-0.5 bg-gradient-to-b from-neon-blue/50 to-transparent" />
      )}
    </motion.div>
  )
}

const PurchaseFlow = () => {
  const steps = [
    {
      number: 1,
      title: "スタジオで推しを撮影",
      description: "最新の4D撮影技術で、あらゆる角度から推しの瞬間を記録します。"
    },
    {
      number: 2,
      title: "4DGSで再構成された作品が販売開始",
      description: "高精度な4D Gaussian Splattingで、リアルな空間体験として再構築。"
    },
    {
      number: 3,
      title: "一人だけが購入可能（限定1点）",
      description: "世界でたった一人だけが所有できる、唯一無二の作品として販売。"
    },
    {
      number: 4,
      title: "Viewerで鑑賞。P2Pで自由に拡散OK",
      description: "専用Viewerで没入体験。所有者の判断で自由に共有も可能です。"
    }
  ]
  
  return (
    <section className="relative py-32 px-6">
      <div className="max-w-4xl mx-auto">
        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-5xl md:text-6xl font-extralight text-center mb-20 text-glow"
        >
          購入の流れ
        </motion.h2>
        
        <div className="space-y-4">
          {steps.map((step, index) => (
            <StepCard
              key={index}
              number={step.number}
              title={step.title}
              description={step.description}
              delay={index * 0.2}
            />
          ))}
        </div>
      </div>
    </section>
  )
}

export default PurchaseFlow