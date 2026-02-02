import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { Monitor, CreditCard, LogOut, Activity } from 'lucide-react'

export default function Portal() {
  const navigate = useNavigate()
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // 1. Check Session
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (!user) {
        navigate('/') // Kick out if not logged in
      } else {
        setUser(user)
        setLoading(false)
      }
    })
  }, [navigate])

  const handleLogout = async () => {
    await supabase.auth.signOut()
    navigate('/')
  }

  if (loading) return null // Or a loading spinner

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <nav className="bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center">
        <div className="font-bold text-xl tracking-tight">STATION / PORTAL</div>
        <div className="flex items-center gap-4">
          <span className="text-sm text-gray-500 hidden md:block">{user.email}</span>
          <button 
            onClick={handleLogout}
            className="text-sm text-gray-500 hover:text-red-600 flex items-center gap-2 transition"
          >
            <LogOut className="w-4 h-4" /> Sign Out
          </button>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-5xl mx-auto p-6 mt-8">
        <h1 className="text-3xl font-light text-gray-900 mb-8">Dashboard</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* Status Card */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-gray-100 rounded-lg">
                <Monitor className="w-6 h-6 text-gray-700" />
              </div>
              <h2 className="text-lg font-semibold text-gray-900">Workstation Status</h2>
            </div>
            <div className="flex items-center gap-2">
              <div className="h-3 w-3 rounded-full bg-yellow-400"></div>
              <span className="text-gray-600 font-medium">Pending Approval</span>
            </div>
            <p className="text-sm text-gray-400 mt-2">Your workstation is being prepared.</p>
          </div>

          {/* Credits Card */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-blue-50 rounded-lg">
                <CreditCard className="w-6 h-6 text-blue-600" />
              </div>
              <h2 className="text-lg font-semibold text-gray-900">Credits</h2>
            </div>
            <div className="text-3xl font-bold text-gray-900">0</div>
            <div className="flex items-center gap-2 text-sm text-gray-500 mt-1">
              <Activity className="w-4 h-4" /> Available Hours
            </div>
            <button className="mt-6 w-full py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition text-sm font-medium">
              Purchase Credits
            </button>
          </div>

        </div>
      </main>
    </div>
  )
}