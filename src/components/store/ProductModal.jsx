import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import CountdownTimer from './CountdownTimer'

const ProductModal = ({ product, onClose }) => {
  const [offerAmount, setOfferAmount] = useState('')
  const [showOfferForm, setShowOfferForm] = useState(false)
  const isSold = product.status === 'sold'
  
  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/90 backdrop-blur-md z-50 flex items-center justify-center p-6"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="bg-black/80 border border-white/20 rounded-3xl max-w-4xl w-full max-h-[90vh] overflow-y-auto"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="relative">
            <button
              onClick={onClose}
              className="absolute top-6 right-6 text-gray-400 hover:text-white transition-colors z-10"
            >
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            
            <div className="grid md:grid-cols-2 gap-8">
              <div className="relative aspect-square bg-gradient-to-br from-glow-blue/20 to-transparent rounded-t-3xl md:rounded-l-3xl md:rounded-tr-none overflow-hidden">
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-8xl animate-float">🎭</div>
                </div>
                {isSold && (
                  <div className="absolute top-6 left-6 bg-red-500/90 backdrop-blur-sm px-6 py-3 rounded-full">
                    <span className="text-lg font-medium">SOLD OUT</span>
                  </div>
                )}
              </div>
              
              <div className="p-8 md:p-12">
                <h2 className="text-3xl md:text-4xl font-light mb-4 text-glow">
                  {product.title}
                </h2>
                
                <p className="text-gray-400 mb-6 leading-relaxed">
                  {product.description}
                </p>
                
                <div className="space-y-4 mb-8">
                  <div>
                    <p className="text-sm text-gray-500 mb-1">価格</p>
                    <p className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-neon-blue to-glow-blue">
                      ¥{product.price.toLocaleString()}
                    </p>
                  </div>
                  
                  {!isSold && product.endTime && (
                    <div>
                      <p className="text-sm text-gray-500 mb-2">残り時間</p>
                      <CountdownTimer endTime={product.endTime} />
                    </div>
                  )}
                  
                  {isSold && product.owner && (
                    <>
                      <div>
                        <p className="text-sm text-gray-500 mb-1">現在の所有者</p>
                        <p className="text-lg text-neon-blue font-mono">
                          {product.owner}
                        </p>
                      </div>
                      
                      <div>
                        <p className="text-sm text-gray-500 mb-1">ブロックチェーン証明</p>
                        <div className="flex items-center gap-2">
                          <span className="text-green-400">✓ 検証済み</span>
                          <a href="#" className="text-neon-blue hover:underline text-sm">
                            Etherscanで確認
                          </a>
                        </div>
                      </div>
                    </>
                  )}
                </div>
                
                <div className="space-y-4">
                  {!isSold && (
                    <button className="w-full px-8 py-4 bg-gradient-to-r from-glow-blue to-neon-blue text-black rounded-full text-lg font-medium hover:opacity-90 transition-opacity animate-glow">
                      今すぐ購入
                    </button>
                  )}
                  
                  {isSold && (
                    <>
                      <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
                        <h3 className="text-lg font-medium mb-4">リセールオファー</h3>
                        
                        {product.resaleOffers && product.resaleOffers.length > 0 ? (
                          <div className="space-y-3 mb-4">
                            {product.resaleOffers.map((offer, index) => (
                              <div key={index} className="flex justify-between items-center">
                                <span className="text-gray-400 font-mono text-sm">
                                  {offer.from.slice(0, 8)}...
                                </span>
                                <span className="text-green-400 font-medium">
                                  ¥{offer.amount.toLocaleString()}
                                </span>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <p className="text-gray-500 mb-4">まだオファーはありません</p>
                        )}
                        
                        {!showOfferForm ? (
                          <button
                            onClick={() => setShowOfferForm(true)}
                            className="w-full px-6 py-3 border border-neon-blue/50 text-neon-blue rounded-full hover:bg-neon-blue/10 transition-all"
                          >
                            オファーを送る
                          </button>
                        ) : (
                          <div className="space-y-3">
                            <input
                              type="number"
                              placeholder="オファー金額（円）"
                              value={offerAmount}
                              onChange={(e) => setOfferAmount(e.target.value)}
                              className="w-full px-4 py-3 bg-black/50 border border-white/20 rounded-xl text-white focus:border-neon-blue focus:outline-none"
                            />
                            <div className="flex gap-3">
                              <button
                                onClick={() => {
                                  // Handle offer submission
                                  console.log('Offer:', offerAmount)
                                  setShowOfferForm(false)
                                  setOfferAmount('')
                                }}
                                className="flex-1 px-6 py-3 bg-neon-blue text-black rounded-full font-medium hover:opacity-90 transition-opacity"
                              >
                                送信
                              </button>
                              <button
                                onClick={() => {
                                  setShowOfferForm(false)
                                  setOfferAmount('')
                                }}
                                className="flex-1 px-6 py-3 border border-white/20 text-gray-400 rounded-full hover:border-white/40 transition-all"
                              >
                                キャンセル
                              </button>
                            </div>
                          </div>
                        )}
                      </div>
                      
                      <p className="text-sm text-gray-500 text-center">
                        所有者がオファーを承認した場合、データのコピーを受け取ることができます。
                        ただし、ブロックチェーン上の所有権は元の購入者のままです。
                      </p>
                    </>
                  )}
                </div>
                
                <div className="mt-8 pt-8 border-t border-white/10">
                  <h3 className="text-lg font-medium mb-4">作品詳細</h3>
                  <dl className="space-y-3 text-sm">
                    <div className="flex justify-between">
                      <dt className="text-gray-500">フォーマット</dt>
                      <dd>4D Gaussian Splatting</dd>
                    </div>
                    <div className="flex justify-between">
                      <dt className="text-gray-500">収録時間</dt>
                      <dd>{product.duration || '15秒'}</dd>
                    </div>
                    <div className="flex justify-between">
                      <dt className="text-gray-500">解像度</dt>
                      <dd>{product.resolution || '8K相当'}</dd>
                    </div>
                    <div className="flex justify-between">
                      <dt className="text-gray-500">ファイルサイズ</dt>
                      <dd>{product.fileSize || '2.3GB'}</dd>
                    </div>
                  </dl>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}

export default ProductModal