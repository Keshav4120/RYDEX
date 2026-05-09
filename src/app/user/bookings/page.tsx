'use client'
import React, { useEffect, useState } from 'react'
import { motion } from 'motion/react'
import { 
  Clock, 
  MapPin, 
  Navigation, 
  ChevronRight, 
  ArrowLeft,
  Calendar,
  IndianRupee,
  CheckCircle2,
  XCircle,
  Search
} from 'lucide-react'
import { useRouter } from 'next/navigation'
import axios from 'axios'
import Nav from '@/components/Nav'
import Footer from '@/components/Footer'

export default function MyBookingsPage() {
  const [bookings, setBookings] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    fetchBookings()
  }, [])

  const fetchBookings = async () => {
    try {
      const { data } = await axios.get('/api/user/bookings')
      if (data.success) {
        setBookings(data.bookings)
      }
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'text-green-500 bg-green-50'
      case 'cancelled': return 'text-red-500 bg-red-50'
      case 'accepted':
      case 'in_progress': return 'text-blue-500 bg-blue-50'
      default: return 'text-neutral-400 bg-neutral-50'
    }
  }

  return (
    <div className="min-h-screen bg-neutral-50 font-sans">
      <Nav />
      
      <div className="pt-32 pb-20 px-6 max-w-5xl mx-auto">
        <div className="flex items-center justify-between mb-12">
          <div className="flex items-center gap-6">
            <button 
              onClick={() => router.back()}
              className="w-12 h-12 bg-white rounded-2xl shadow-sm border border-neutral-100 flex items-center justify-center text-neutral-900 hover:scale-105 transition-transform"
            >
              <ArrowLeft size={20} />
            </button>
            <div>
              <h1 className="text-4xl font-black text-neutral-900 tracking-tighter">My Rides</h1>
              <p className="text-neutral-400 text-xs font-bold uppercase tracking-widest mt-1">Activity History</p>
            </div>
          </div>
          
          <div className="hidden md:flex items-center gap-3 bg-white px-6 py-3 rounded-2xl shadow-sm border border-neutral-100">
             <Search size={18} className="text-neutral-300" />
             <input type="text" placeholder="Search rides..." className="bg-transparent border-none outline-none text-sm font-bold text-neutral-900 placeholder:text-neutral-300" />
          </div>
        </div>

        {loading ? (
          <div className="grid gap-6">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-48 w-full bg-white rounded-[40px] animate-pulse border border-neutral-100" />
            ))}
          </div>
        ) : bookings.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-[48px] border border-neutral-100 shadow-sm">
            <div className="w-20 h-20 bg-neutral-50 rounded-full flex items-center justify-center mx-auto mb-6">
              <Clock size={32} className="text-neutral-300" />
            </div>
            <h2 className="text-2xl font-black text-neutral-900 mb-2">No rides yet</h2>
            <p className="text-neutral-400 max-w-xs mx-auto mb-8 font-medium">Your ride history will appear here once you complete your first journey.</p>
            <button 
              onClick={() => router.push('/')}
              className="px-10 py-4 bg-black text-white rounded-2xl font-black uppercase tracking-widest text-xs"
            >
              Book a Ride
            </button>
          </div>
        ) : (
          <div className="grid gap-6">
            {bookings.map((booking, idx) => (
              <motion.div
                key={booking._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.05 }}
                onClick={() => router.push(`/user/booking/${booking._id}`)}
                className="group bg-white rounded-[40px] p-8 border border-neutral-100 shadow-sm hover:shadow-2xl hover:-translate-y-1 transition-all duration-500 cursor-pointer relative overflow-hidden"
              >
                <div className="flex flex-col md:flex-row justify-between gap-8 relative z-10">
                  <div className="space-y-6 flex-1">
                    <div className="flex items-center gap-4">
                      <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest ${getStatusColor(booking.status)}`}>
                        {booking.status.replace('_', ' ')}
                      </span>
                      <div className="flex items-center gap-2 text-neutral-400 text-[10px] font-black uppercase tracking-widest">
                        <Calendar size={12} />
                        {new Date(booking.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div className="flex gap-4 items-start">
                        <div className="w-8 h-8 rounded-xl bg-neutral-50 flex items-center justify-center text-neutral-400 shrink-0">
                          <MapPin size={16} />
                        </div>
                        <p className="text-sm font-bold text-neutral-900 line-clamp-1">{booking.pickup.address}</p>
                      </div>
                      <div className="flex gap-4 items-start">
                        <div className="w-8 h-8 rounded-xl bg-black text-white flex items-center justify-center shrink-0">
                          <Navigation size={16} />
                        </div>
                        <p className="text-sm font-bold text-neutral-900 line-clamp-1">{booking.drop.address}</p>
                      </div>
                    </div>
                  </div>

                  <div className="flex md:flex-col justify-between items-end gap-4">
                     <div className="text-right">
                        <p className="text-[10px] font-black text-neutral-400 uppercase tracking-widest mb-1">Total Fare</p>
                        <p className="text-3xl font-black text-neutral-900 flex items-center gap-1">
                           <IndianRupee size={24} /> {booking.fare}
                        </p>
                     </div>
                     <div className="w-12 h-12 bg-neutral-50 rounded-2xl flex items-center justify-center group-hover:bg-black group-hover:text-white transition-colors">
                        <ChevronRight size={20} />
                     </div>
                  </div>
                </div>
                
                {/* Visual Accent */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-neutral-50 to-transparent -z-0 opacity-50" />
              </motion.div>
            ))}
          </div>
        )}
      </div>

      <Footer />
    </div>
  )
}
