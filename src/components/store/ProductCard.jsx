import React from 'react'
import { motion } from 'framer-motion'
import CountdownTimer from './CountdownTimer'

const ProductCard = ({ product, onClick, isRecommended }) => {
  const isSold = product.status === 'sold'
  const hasResaleOffers = product.resaleOffers && product.resaleOffers.length > 0
  
  return (
    <motion.div
      whileHover={{ scale: isSold ? 1 : 1.02, rotateY: 5 }}
      transition={{ duration: 0.3 }}
      onClick={onClick}
      className={`relative group cursor-pointer ${isSold ? 'opacity-60' : ''}`}
      style={{ perspective: '1000px' }}
    >
      {/* タイムカプセルエフェクト */}
      <div className="absolute inset-0 bg-gradient-to-br from-neon-blue/20 via-transparent to-purple-500/20 rounded-[30px] opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-2xl" />
      
      {/* カプセルコンテナ */}
      <div className="relative bg-gradient-to-b from-white/5 to-white/10 backdrop-blur-md border border-white/20 rounded-[30px] overflow-hidden hover:border-neon-blue/50 transition-all duration-500 transform-gpu" 
           style={{ 
             boxShadow: 'inset 0 0 30px rgba(255,255,255,0.1), 0 20px 40px rgba(0,0,0,0.3)',
             background: 'linear-gradient(135deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.05) 50%, rgba(0,217,255,0.1) 100%)'
           }}>
        
        {/* 推薦バッジ */}
        {isRecommended && !isSold && (
          <div className="absolute top-4 left-4 bg-gradient-to-r from-purple-500 to-pink-500 px-3 py-1 rounded-full z-10">
            <span className="text-xs font-medium flex items-center gap-1">
              <span>✨</span> おすすめ
            </span>
          </div>
        )}
        
        <div className="aspect-[4/5] relative overflow-hidden">
          {/* ホログラフィック風グラデーション */}
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/80" />
          <div className="absolute inset-0 bg-gradient-radial from-neon-blue/10 via-transparent to-transparent" />
          
          {/* コンテンツアイコン */}
          <div className="absolute inset-0 flex items-center justify-center">
            <motion.div 
              className="relative"
              animate={{ 
                rotateY: [0, 360],
                scale: [1, 1.1, 1]
              }}
              transition={{ 
                duration: 20,
                repeat: Infinity,
                ease: "linear"
              }}
            >
              <div className="text-7xl filter blur-sm opacity-50">💎</div>
              <div className="absolute inset-0 flex items-center justify-center text-6xl">🎭</div>
            </motion.div>
          </div>
          
          {isSold && (
            <div className="absolute top-4 right-4 bg-red-500/90 backdrop-blur-sm px-4 py-2 rounded-full">
              <span className="text-sm font-medium">SOLD OUT</span>
            </div>
          )}
          
          {!isSold && product.endTime && (
            <div className="absolute top-4 left-4">
              <CountdownTimer endTime={product.endTime} />
            </div>
          )}
          
          {hasResaleOffers && (
            <div className="absolute bottom-4 left-4 bg-green-500/90 backdrop-blur-sm px-3 py-1 rounded-full">
              <span className="text-xs font-medium">リセール可能</span>
            </div>
          )}
        </div>
        
        <div className="p-6">
          <h3 className="text-xl font-light mb-2 text-glow line-clamp-2">
            {product.title}
          </h3>
          
          <p className="text-gray-400 text-sm mb-4 line-clamp-2">
            {product.description}
          </p>
          
          <div className="flex items-end justify-between">
            <div>
              <p className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-neon-blue to-glow-blue">
                ¥{product.price.toLocaleString()}
              </p>
              {isSold && product.soldAt && (
                <p className="text-xs text-gray-500 mt-1">
                  {new Date(product.soldAt).toLocaleDateString('ja-JP')}に販売終了
                </p>
              )}
            </div>
            
            {isSold && product.owner && (
              <div className="text-right">
                <p className="text-xs text-gray-500">所有者</p>
                <p className="text-sm text-neon-blue/80 font-mono truncate max-w-[120px]">
                  {product.owner.slice(0, 6)}...{product.owner.slice(-4)}
                </p>
              </div>
            )}
          </div>
          
          {hasResaleOffers && (
            <div className="mt-4 pt-4 border-t border-white/10">
              <p className="text-xs text-gray-400 mb-2">リセールオファー</p>
              <div className="flex items-center justify-between">
                <span className="text-sm text-green-400">
                  最高額: ¥{Math.max(...product.resaleOffers.map(o => o.amount)).toLocaleString()}
                </span>
                <span className="text-xs text-gray-500">
                  {product.resaleOffers.length}件
                </span>
              </div>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  )
}

export default ProductCard