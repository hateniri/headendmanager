import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useInView } from 'framer-motion'
import { useRef } from 'react'

const FAQItem = ({ question, answer, delay }) => {
  const [isOpen, setIsOpen] = useState(false)
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-50px" })
  
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
      transition={{ duration: 0.6, delay }}
      className="border border-white/10 rounded-2xl overflow-hidden hover:border-neon-blue/30 transition-all duration-300"
    >
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-8 py-6 flex items-center justify-between text-left hover:bg-white/5 transition-colors duration-300"
      >
        <span className="text-xl font-light text-gray-200">{question}</span>
        <motion.span
          animate={{ rotate: isOpen ? 45 : 0 }}
          transition={{ duration: 0.3 }}
          className="text-2xl text-neon-blue"
        >
          +
        </motion.span>
      </button>
      
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="px-8 pb-6 overflow-hidden"
          >
            <p className="text-gray-400 leading-relaxed">{answer}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

const FAQ = () => {
  const faqs = [
    {
      question: "複製はできますか？",
      answer: "はい、できます。購入者は自由にコンテンツを複製・配布することができます。ただし、オリジナルの所有権はNFTまたは暗号ハッシュによって証明され、真の所有者は世界で一人だけです。"
    },
    {
      question: "再販はありますか？",
      answer: "ありません。一点限りの作品として販売され、同じ作品が再度販売されることはありません。各作品は世界で唯一無二の存在です。"
    },
    {
      question: "NFTは必須ですか？",
      answer: "いいえ、必須ではありません。NFTを使用することもできますが、暗号ハッシュ署名だけでも所有権を証明できます。お客様の好みに応じて選択いただけます。"
    }
  ]
  
  return (
    <section className="relative py-32 px-6">
      <div className="max-w-3xl mx-auto">
        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-5xl md:text-6xl font-extralight text-center mb-16 text-glow"
        >
          よくある質問
        </motion.h2>
        
        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <FAQItem
              key={index}
              question={faq.question}
              answer={faq.answer}
              delay={index * 0.1}
            />
          ))}
        </div>
      </div>
    </section>
  )
}

export default FAQ