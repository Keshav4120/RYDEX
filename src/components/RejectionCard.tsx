import { AlertTriangle } from 'lucide-react'
import React, { useState } from 'react'

const RejectionCard = ({ title, reason, actionLabel, onAction }: any) => {
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const handleClick = async () => {
        if (!onAction) return;
        setLoading(true)
        setError(null)
        try {
            await onAction()
        } catch (err: any) {
            setError(err?.response?.data?.error || "Something went wrong. Please try again.")
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className='bg-red-50
              border border-red-200
              rounded-2xl
              md:rounded-3xl
              p-5 sm:p-6 md:p-8
              space-y-4'>
            <div className='flex items-center gap-2 text-red-600 font-semibold text-sm sm:text-base'>
                <AlertTriangle size={18} />
                {title}
            </div>
            <div className='bg-white border rounded-xl p-4 text-sm sm:text-base'>
                {reason}
            </div>
            {error && (
                <p className='text-xs text-red-500'>{error}</p>
            )}
            {onAction && (
                <button
                    onClick={handleClick}
                    disabled={loading}
                    className='w-full sm:w-auto px-6 py-2.5 bg-black text-white rounded-xl text-sm sm:text-base font-medium hover:bg-gray-800 transition disabled:opacity-60 disabled:pointer-events-none flex items-center gap-2'
                >
                    {loading && <span className='w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin' />}
                    {loading ? 'Requesting...' : (actionLabel || "Retry")}
                </button>
            )}
        </div>
    )
}

export default RejectionCard