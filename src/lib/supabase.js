import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Database types
export const TABLES = {
  PRODUCTS: 'products',
  USERS: 'users',
  TRANSACTIONS: 'transactions',
  RESALE_OFFERS: 'resale_offers',
  VIEW_HISTORY: 'view_history'
}

// Helper functions
export const auth = {
  // Sign in with wallet address
  signInWithWallet: async (walletAddress) => {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'ethereum',
      options: {
        address: walletAddress
      }
    })
    return { data, error }
  },
  
  // Get current user
  getCurrentUser: async () => {
    const { data: { user } } = await supabase.auth.getUser()
    return user
  },
  
  // Sign out
  signOut: async () => {
    const { error } = await supabase.auth.signOut()
    return { error }
  }
}

export const products = {
  // Get all products with location data
  getAllWithLocations: async () => {
    const { data, error } = await supabase
      .from(TABLES.PRODUCTS)
      .select(`
        *,
        location:locations(*)
      `)
      .order('created_at', { ascending: false })
    
    return { data, error }
  },
  
  // Get single product
  getById: async (id) => {
    const { data, error } = await supabase
      .from(TABLES.PRODUCTS)
      .select(`
        *,
        location:locations(*),
        resale_offers:resale_offers(*)
      `)
      .eq('id', id)
      .single()
    
    return { data, error }
  },
  
  // Update product status
  updateStatus: async (id, status) => {
    const { data, error } = await supabase
      .from(TABLES.PRODUCTS)
      .update({ status })
      .eq('id', id)
    
    return { data, error }
  }
}

export const offers = {
  // Create new resale offer
  create: async (productId, amount, fromAddress) => {
    const { data, error } = await supabase
      .from(TABLES.RESALE_OFFERS)
      .insert({
        product_id: productId,
        amount,
        from_address: fromAddress,
        status: 'pending'
      })
    
    return { data, error }
  },
  
  // Get offers for a product
  getByProduct: async (productId) => {
    const { data, error } = await supabase
      .from(TABLES.RESALE_OFFERS)
      .select('*')
      .eq('product_id', productId)
      .order('amount', { ascending: false })
    
    return { data, error }
  }
}

export const tracking = {
  // Track product view
  trackView: async (productId, userId) => {
    const { data, error } = await supabase
      .from(TABLES.VIEW_HISTORY)
      .insert({
        product_id: productId,
        user_id: userId,
        viewed_at: new Date().toISOString()
      })
    
    return { data, error }
  },
  
  // Get user's view history
  getUserHistory: async (userId) => {
    const { data, error } = await supabase
      .from(TABLES.VIEW_HISTORY)
      .select(`
        *,
        product:products(*)
      `)
      .eq('user_id', userId)
      .order('viewed_at', { ascending: false })
      .limit(50)
    
    return { data, error }
  }
}

// Real-time subscriptions
export const subscriptions = {
  // Subscribe to new offers
  subscribeToOffers: (productId, callback) => {
    return supabase
      .channel(`offers:${productId}`)
      .on('postgres_changes', 
        { 
          event: 'INSERT', 
          schema: 'public', 
          table: TABLES.RESALE_OFFERS,
          filter: `product_id=eq.${productId}`
        }, 
        callback
      )
      .subscribe()
  },
  
  // Subscribe to product status changes
  subscribeToProductStatus: (productId, callback) => {
    return supabase
      .channel(`product:${productId}`)
      .on('postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: TABLES.PRODUCTS,
          filter: `id=eq.${productId}`
        },
        callback
      )
      .subscribe()
  }
}