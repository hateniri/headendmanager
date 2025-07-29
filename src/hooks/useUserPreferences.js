import { useState, useEffect } from 'react'

export const useUserPreferences = () => {
  const [userHistory, setUserHistory] = useState(() => {
    const saved = localStorage.getItem('userHistory')
    return saved ? JSON.parse(saved) : []
  })
  
  const [categoryScores, setCategoryScores] = useState(() => {
    const saved = localStorage.getItem('categoryScores')
    return saved ? JSON.parse(saved) : {}
  })
  
  // 商品を閲覧したときに履歴を更新
  const addToHistory = (product) => {
    const newHistory = [
      { productId: product.id, timestamp: Date.now(), categories: product.categories },
      ...userHistory.filter(h => h.productId !== product.id)
    ].slice(0, 50) // 最新50件を保持
    
    setUserHistory(newHistory)
    localStorage.setItem('userHistory', JSON.stringify(newHistory))
    
    // カテゴリスコアを更新
    const newScores = { ...categoryScores }
    product.categories.forEach(category => {
      newScores[category] = (newScores[category] || 0) + 1
    })
    setCategoryScores(newScores)
    localStorage.setItem('categoryScores', JSON.stringify(newScores))
  }
  
  // 商品にスコアを付ける
  const getProductScore = (product) => {
    let score = 0
    
    // カテゴリマッチング
    product.categories.forEach(category => {
      score += (categoryScores[category] || 0) * 10
    })
    
    // 最近の閲覧履歴との関連性
    const recentViews = userHistory.slice(0, 10)
    recentViews.forEach((view, index) => {
      const commonCategories = product.categories.filter(c => 
        view.categories.includes(c)
      )
      score += commonCategories.length * (10 - index) // 新しい履歴ほど重み付け
    })
    
    // 人気度も考慮
    score += Math.log(product.viewCount || 1)
    
    return score
  }
  
  // 商品をスコア順にソート
  const sortByRecommendation = (products) => {
    return [...products].sort((a, b) => {
      const scoreA = getProductScore(a)
      const scoreB = getProductScore(b)
      return scoreB - scoreA
    })
  }
  
  return {
    userHistory,
    categoryScores,
    addToHistory,
    sortByRecommendation
  }
}