import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import ProductCard from '../components/store/ProductCard'
import ProductModal from '../components/store/ProductModal'
import StoreHeader from '../components/store/StoreHeader'
import { products } from '../data/products'
import { useUserPreferences } from '../hooks/useUserPreferences'

const Store = () => {
  const [selectedProduct, setSelectedProduct] = useState(null)
  const [filter, setFilter] = useState('all') // all, active, sold
  const [sortBy, setSortBy] = useState('recommended') // recommended, newest, price, ending
  const { addToHistory, sortByRecommendation } = useUserPreferences()
  
  const filteredProducts = products.filter(product => {
    if (filter === 'active') return product.status === 'active'
    if (filter === 'sold') return product.status === 'sold'
    return true
  })
  
  const sortedProducts = sortBy === 'recommended' 
    ? sortByRecommendation(filteredProducts)
    : [...filteredProducts].sort((a, b) => {
        if (sortBy === 'newest') return new Date(b.listedAt) - new Date(a.listedAt)
        if (sortBy === 'price') return b.price - a.price
        if (sortBy === 'ending') {
          if (a.status === 'sold' && b.status === 'sold') return 0
          if (a.status === 'sold') return 1
          if (b.status === 'sold') return -1
          return new Date(a.endTime) - new Date(b.endTime)
        }
        return 0
      })
  
  const handleProductClick = (product) => {
    setSelectedProduct(product)
    addToHistory(product)
  }
  
  return (
    <div className="min-h-screen bg-black">
      <div className="fixed inset-0 bg-grid opacity-20 pointer-events-none" />
      
      <div className="relative z-10">
        <StoreHeader />
        
        <main className="max-w-7xl mx-auto px-6 py-24">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-12"
          >
            <h1 className="text-5xl md:text-6xl font-extralight mb-6 text-glow">
              The Moment Store
            </h1>
            <p className="text-xl text-gray-400">
              世界でたった一人だけが所有できる、4DGS作品の限定販売
            </p>
          </motion.div>
          
          <div className="flex flex-col md:flex-row gap-6 mb-12">
            <div className="flex gap-2">
              <button
                onClick={() => setFilter('all')}
                className={`px-6 py-2 rounded-full border transition-all duration-300 ${
                  filter === 'all' 
                    ? 'bg-neon-blue/20 border-neon-blue text-neon-blue' 
                    : 'border-white/20 text-gray-400 hover:border-white/40'
                }`}
              >
                すべて
              </button>
              <button
                onClick={() => setFilter('active')}
                className={`px-6 py-2 rounded-full border transition-all duration-300 ${
                  filter === 'active' 
                    ? 'bg-neon-blue/20 border-neon-blue text-neon-blue' 
                    : 'border-white/20 text-gray-400 hover:border-white/40'
                }`}
              >
                販売中
              </button>
              <button
                onClick={() => setFilter('sold')}
                className={`px-6 py-2 rounded-full border transition-all duration-300 ${
                  filter === 'sold' 
                    ? 'bg-neon-blue/20 border-neon-blue text-neon-blue' 
                    : 'border-white/20 text-gray-400 hover:border-white/40'
                }`}
              >
                販売終了
              </button>
            </div>
            
            <div className="md:ml-auto">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-6 py-2 bg-black/50 border border-white/20 rounded-full text-gray-300 focus:border-neon-blue focus:outline-none"
              >
                <option value="recommended">おすすめ順</option>
                <option value="newest">新着順</option>
                <option value="price">価格順</option>
                <option value="ending">終了時間順</option>
              </select>
            </div>
          </div>
          
          <motion.div 
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            {sortedProducts.map((product, index) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <ProductCard 
                  product={product} 
                  onClick={() => handleProductClick(product)}
                  isRecommended={sortBy === 'recommended' && index < 3}
                />
              </motion.div>
            ))}
          </motion.div>
          
          {sortedProducts.length === 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6 }}
              className="text-center py-20"
            >
              <p className="text-2xl text-gray-500">該当する作品がありません</p>
            </motion.div>
          )}
        </main>
      </div>
      
      {selectedProduct && (
        <ProductModal 
          product={selectedProduct} 
          onClose={() => setSelectedProduct(null)}
        />
      )}
    </div>
  )
}

export default Store