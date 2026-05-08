import React from 'react'

function ActionCard({ icon, title, desc, actionLabel, onAction }: any) {
    return (
        <div className='bg-white rounded-2xl md:rounded-3xl p-5 sm:p-6 md:p-8 border shadow-lg flex flex-col sm:flex-row justify-between itmes-start sm:items-center gap-5'>
            <div className='flex items-center gap-4'>
                <div className='bg-black text-white p-3 md:p-4 rounded-xl shrink-0'>{icon}</div>
                <div className='flex flex-col'>
                    <div className='text-base sm:text-lg md:text-xl font-semibold'>{title}</div>
                    <div className='text-xs sm:text-sm text-gray-500'>{desc}</div>
                </div>
            </div>
            <button className='w-full sm:w-auto bg-black text-white px-6 py-2.5 rounded-xl text-sm sm:text-base font-medium hover:bg-gray-800' onClick={onAction}>
                {actionLabel}
            </button>
        </div>
    )
}

export default ActionCard