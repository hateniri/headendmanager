import React from 'react'
import Hero from '../components/Hero'
import ServiceOverview from '../components/ServiceOverview'
import OwnershipFeatures from '../components/OwnershipFeatures'
import PurchaseFlow from '../components/PurchaseFlow'
import CreatorRevenue from '../components/CreatorRevenue'
import FAQ from '../components/FAQ'
import Footer from '../components/Footer'

const HomePage = () => {
  return (
    <div className="min-h-screen bg-black overflow-x-hidden">
      <div className="fixed inset-0 bg-grid opacity-20 pointer-events-none" />
      <div className="relative z-10">
        <Hero />
        <ServiceOverview />
        <OwnershipFeatures />
        <PurchaseFlow />
        <CreatorRevenue />
        <FAQ />
        <Footer />
      </div>
    </div>
  )
}

export default HomePage