'use client'
import { IVehicle } from '@/models/vehicle.model'
import React, { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { ImagePlus, IndianRupee } from 'lucide-react'
import { img } from 'motion/react-client'
import axios from 'axios'

type PropsType = {
    open: boolean,
    onClose: (a: boolean) => void
    onSave?: () => void
    data: IVehicle | null
}
function PricingModel({ open, onClose, onSave, data }: PropsType) {
    const [image, setImage] = useState<File | null>()
    const [preview, setPreview] = useState<string | null>(null)
    const [baseFare, setBaseFare] = useState("")
    const [pricePerKm, setPricePerKm] = useState("")
    const [waitingCharge, setWaitingCharge] = useState("")
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        if (data) {
            setPreview(data?.imageUrl || null)
            setBaseFare(data.baseFare?.toString() || "")
            setPricePerKm(data.pricePerKm?.toString() || "")
            setWaitingCharge(data.waitingCharge?.toString() || "")
        }
    }, [data])

    const handleSubmit = async () => {
        try {
            setLoading(true)
            const formData = new FormData()
            formData.append("baseFare", baseFare)
            formData.append("pricePerKm", pricePerKm)
            formData.append("waitingCharge", waitingCharge)
            if (image) {
                formData.append("image", image)
            }
            const res = await axios.post('/api/partner/onboarding/pricing', formData)
            if (res.status == 200) {
                onSave?.()
                onClose(false)
            }
        } catch (error) {
            console.log(error)
        } finally {
            setLoading(false)
        }
    }

    return (
        <AnimatePresence>
            {open && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className='fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 px-4'
                >
                    <motion.div
                        initial={{ scale: 0.8 }}
                        animate={{ scale: 1 }}
                        exit={{ scale: 0.8 }}
                        className="bg-white rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden"
                    >
                        <div className='p-6 border-b'>
                            <h2 className=' text-xl font-bold'>
                                Pricing and Vehicle Image
                            </h2>
                        </div>

                        <div className='p-6 space-y-6'>
                            <label htmlFor='imageLabel' className='relative h-44 border-2 border-dashed rounded-2xl flex items-center justify-center cursor-pointer overflow-hidden'>
                                {!preview ? (
                                    <ImagePlus size={28} />) : (
                                    <img src={preview} alt="preview" className='absolute inset-0 w-full h-full object-cover rounded-2xl ' />
                                )}
                                <input id='imageLabel' type="file" accept="image/*" hidden onChange={(e) => {
                                    if (e.target.files?.[0]) {
                                        setImage(e.target.files?.[0])
                                        setPreview(URL.createObjectURL(e.target.files[0]))
                                    }
                                }} />
                            </label>
                            <div>
                                <p className='text-sm font-semibold mb-1'>Base Fase</p>
                                <div className='flex items-center gap-2 border rounded-xl px-4 py-3 bg-white'>
                                    <IndianRupee size={18} />
                                    <input type="text" placeholder="Base Fase" value={baseFare} onChange={(e) => setBaseFare(e.target.value)} className='w-full outline-none' />
                                </div>
                            </div>
                            <div>
                                <p className='text-sm font-semibold mb-1'>Per KM Rate</p>
                                <div className='flex items-center gap-2 border rounded-xl px-4 py-3 bg-white'>
                                    <IndianRupee size={18} />
                                    <input type="text" placeholder="Per KM Rate" value={pricePerKm} onChange={(e) => setPricePerKm(e.target.value)} className='w-full outline-none' />
                                </div>
                            </div>
                            <div>
                                <p className='text-sm font-semibold mb-1'>Waiting Charge (Per Minute)</p>
                                <div className='flex items-center gap-2 border rounded-xl px-4 py-3 bg-white'>
                                    <IndianRupee size={18} />
                                    <input type="text" placeholder="Waiting Charge" value={waitingCharge} onChange={(e) => setWaitingCharge(e.target.value)} className='w-full outline-none' />
                                </div>
                            </div>
                        </div>
                        <div className='p-6 border-t flex gap-3'>
                            <button className='flex-1 border rounded-xl py-2 text-gray-900 hover:bg-gray-50 transition' onClick={() => onClose(false)} disabled={loading}>Cancel</button>
                            <button className='flex-1 bg-black text-white rounded-xl py-2 hover:bg-gray-800 transition' onClick={handleSubmit} disabled={loading}>{loading ? "Saving..." : "Save"}</button>
                        </div>
                    </motion.div>

                </motion.div>
            )}
        </AnimatePresence>
    )
}

export default PricingModel