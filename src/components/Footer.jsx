import React from 'react'
import { motion } from 'framer-motion'

const Footer = () => {
  return (
    <footer className="relative border-t border-white/10 bg-black/50 backdrop-blur-sm">
      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h3 className="text-2xl font-light mb-4 text-glow">株式会社時間停止</h3>
            <p className="text-gray-400 leading-relaxed">
              時間と空間を超えた<br />
              新しい体験価値の創造
            </p>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <h4 className="text-lg font-medium mb-4 text-gray-300">サービス</h4>
            <ul className="space-y-3">
              <li>
                <a href="#" className="text-gray-400 hover:text-neon-blue transition-colors duration-300">
                  Frozen TimeSpace
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-neon-blue transition-colors duration-300">
                  The Moment
                </a>
              </li>
            </ul>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <h4 className="text-lg font-medium mb-4 text-gray-300">コンタクト</h4>
            <ul className="space-y-3">
              <li>
                <a href="#" className="text-gray-400 hover:text-neon-blue transition-colors duration-300">
                  お問い合わせ
                </a>
              </li>
              <li className="flex gap-4">
                <a href="#" className="text-gray-400 hover:text-neon-blue transition-colors duration-300">
                  X
                </a>
                <a href="#" className="text-gray-400 hover:text-neon-blue transition-colors duration-300">
                  Instagram
                </a>
              </li>
            </ul>
          </motion.div>
        </div>
        
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="pt-8 border-t border-white/10 text-center"
        >
          <p className="text-gray-500 text-sm">
            © 2024 株式会社時間停止. All rights reserved.
          </p>
        </motion.div>
      </div>
    </footer>
  )
}

export default Footer