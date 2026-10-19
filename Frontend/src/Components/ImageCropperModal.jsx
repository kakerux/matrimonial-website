import { useState, useCallback } from 'react'
import Cropper from 'react-easy-crop'

const createImage = (url) =>
    new Promise((resolve, reject) => {
        const image = new Image()
        image.addEventListener('load', () => resolve(image))
        image.addEventListener('error', reject)
        image.setAttribute('crossOrigin', 'anonymous')
        image.src = url
    })

// draws just the selected crop region onto an offscreen canvas and returns
// it as a real image file (blob), instead of the full uncropped original
const getCroppedImageBlob = async (imageSrc, croppedAreaPixels) => {
    const image = await createImage(imageSrc)
    const canvas = document.createElement('canvas')
    canvas.width = croppedAreaPixels.width
    canvas.height = croppedAreaPixels.height
    const ctx = canvas.getContext('2d')

    ctx.drawImage(
        image,
        croppedAreaPixels.x,
        croppedAreaPixels.y,
        croppedAreaPixels.width,
        croppedAreaPixels.height,
        0,
        0,
        croppedAreaPixels.width,
        croppedAreaPixels.height
    )

    return new Promise((resolve) => canvas.toBlob((blob) => resolve(blob), 'image/jpeg', 0.9))
}

const ImageCropperModal = ({ imageSrc, onCancel, onCropDone }) => {
    const [crop, setCrop] = useState({ x: 0, y: 0 })
    const [zoom, setZoom] = useState(1)
    const [croppedAreaPixels, setCroppedAreaPixels] = useState(null)

    const onCropComplete = useCallback((_, pixels) => {
        setCroppedAreaPixels(pixels)
    }, [])

    const handleConfirm = async () => {
        if (!croppedAreaPixels) return
        const blob = await getCroppedImageBlob(imageSrc, croppedAreaPixels)
        onCropDone(blob)
    }

    return (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl overflow-hidden w-full max-w-md">
                <div className="relative w-full h-80 bg-gray-900">
                    <Cropper
                        image={imageSrc}
                        crop={crop}
                        zoom={zoom}
                        aspect={1}
                        cropShape="round"
                        showGrid={false}
                        onCropChange={setCrop}
                        onZoomChange={setZoom}
                        onCropComplete={onCropComplete}
                    />
                </div>

                <div className="p-4 space-y-4">
                    <div>
                        <label className="text-xs font-medium text-gray-500 mb-1 block">Zoom</label>
                        <input
                            type="range"
                            min={1}
                            max={3}
                            step={0.1}
                            value={zoom}
                            onChange={(e) => setZoom(Number(e.target.value))}
                            className="w-full accent-rose-500"
                        />
                    </div>
                    <p className="text-xs text-gray-400">Drag the photo to reposition it inside the circle.</p>

                    <div className="flex gap-3">
                        <button
                            type="button"
                            onClick={onCancel}
                            className="flex-1 border-2 border-rose-200 text-rose-600 font-semibold py-2 rounded-lg hover:bg-rose-50 transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            type="button"
                            onClick={handleConfirm}
                            className="flex-1 bg-gradient-to-r from-rose-600 to-purple-600 text-white font-semibold py-2 rounded-lg hover:opacity-90 transition-opacity"
                        >
                            Use Photo
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ImageCropperModal
