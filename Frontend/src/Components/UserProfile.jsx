import { useState, useEffect } from 'react'
import axios from 'axios'
import toast from 'react-hot-toast'
import { Camera, Pencil, CheckCircle2 } from 'lucide-react'
import ImageCropperModal from './ImageCropperModal'
import { useAuth } from '../context/AuthContext'
import { Link } from 'react-router-dom'

const UserProfile = () => {
  const { user } = useAuth()

  const [profile, setProfile] = useState({
    name: '',
    age: '',
    dateOfBirth: '',
    caste: '',
    education: '',
    occupation: '',
    income: '',
    maritalStatus: '',
    address: '',
    city: '',
    state: '',
    height: '',
    about: '',
    profileImage: '',
  })

  const [isSubmitted, setIsSubmitted] = useState(false)
  const [isExistingProfile, setIsExistingProfile] = useState(false)
  const [imagePreview, setImagePreview] = useState('')
  const [imageFile, setImageFile] = useState(null)
  const [isSaving, setIsSaving] = useState(false)
  const [rawImageSrc, setRawImageSrc] = useState('')
  const [showCropper, setShowCropper] = useState(false)
  const [pendingFileName, setPendingFileName] = useState('')

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (!token) return

    axios
      .get('http://localhost:3000/profiles/me', {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        setProfile({
          ...res.data,
          dateOfBirth: res.data.dateOfBirth ? res.data.dateOfBirth.slice(0, 10) : '',
        })
        setIsSubmitted(true)
        setIsExistingProfile(true)
        if (res.data.profileImage) {
          setImagePreview(`http://localhost:3000/uploads/${res.data.profileImage}`)
        }
      })
      .catch((error) => {
        if (error.response?.status !== 404) {
          console.error('Unable to load profile:', error.response?.data)
        }
      })
  }, [])

  // When age changes, auto-fill the birth year (keeps whatever month/day was
  // already set, or defaults to Jan 1 if none was set yet). The person can
  // still adjust the exact date afterward — this just gives a sane starting point.
  const handleAgeChange = (event) => {
    const age = event.target.value
    setProfile((prev) => {
      const birthYear = age ? new Date().getFullYear() - Number(age) : ''
      let dateOfBirth = prev.dateOfBirth
      if (birthYear) {
        const [, month, day] = prev.dateOfBirth ? prev.dateOfBirth.split('-') : [null, '01', '01']
        dateOfBirth = `${birthYear}-${month}-${day}`
      }
      return { ...prev, age, dateOfBirth }
    })
  }

  const ninput = (event) => {
    const { name, value, files } = event.target

    setProfile((currentProfile) => ({
      ...currentProfile,
      [name]: files ? files[0]?.name ?? '' : value,
    }))
  }

  // opens the cropper instead of using the raw file directly
  const handleImageChange = (event) => {
    const file = event.target.files?.[0]
    if (!file) return
    setPendingFileName(file.name)
    setRawImageSrc(URL.createObjectURL(file))
    setShowCropper(true)
    event.target.value = '' // allows re-selecting the same file later if they cancel/redo
  }

  const handleCropDone = (blob) => {
    const croppedFile = new File([blob], pendingFileName || 'profile.jpg', { type: 'image/jpeg' })
    setImageFile(croppedFile)
    setImagePreview(URL.createObjectURL(croppedFile))
    setProfile((prev) => ({ ...prev, profileImage: croppedFile.name }))
    setShowCropper(false)
    setRawImageSrc('')
  }

  const handleCropCancel = () => {
    setShowCropper(false)
    setRawImageSrc('')
  }

  const submitProfile = async (event) => {
    event.preventDefault()

    if (!isExistingProfile && !imageFile) {
      toast.error('Please add a profile photo')
      return
    }

    setIsSaving(true)

    try {
      const formData = new FormData()
      const excludedKeys = ['profileImage', '_id', '__v', 'id', 'UserId', 'createdAt', 'updatedAt', 'gender', 'religion']
      Object.entries(profile).forEach(([key, value]) => {
        if (!excludedKeys.includes(key)) formData.append(key, value)
      })
      // gender/religion come from the account (set once at Sign Up), never
      // from this form, so they're appended directly rather than tracked in `profile`
      formData.append('gender', user?.gender || '')
      formData.append('religion', user?.religion || '')
      if (imageFile) formData.append('profileImage', imageFile)

      const token = localStorage.getItem('token')
      const url = isExistingProfile
        ? 'http://localhost:3000/profiles/me'
        : 'http://localhost:3000/profiles'
      const method = isExistingProfile ? 'put' : 'post'

      await axios({
        method,
        url,
        data: formData,
        headers: { Authorization: `Bearer ${token}` },
      })
      toast.success('Profile saved successfully')
      setIsSubmitted(true)
      setIsExistingProfile(true)
    } catch (error) {
      console.error('Unable to save profile:', error.response?.data)
      toast.error(error.response?.data?.message || 'Unable to save profile')
    } finally {
      setIsSaving(false)
    }
  }

  const resetProfile = () => {
    setProfile({
      name: '',
      age: '',
      dateOfBirth: '',
      caste: '',
      education: '',
      occupation: '',
      income: '',
      maritalStatus: '',
      address: '',
      city: '',
      state: '',
      height: '',
      about: '',
      profileImage: '',
    })
    setImagePreview('')
    setImageFile(null)
    setIsSubmitted(false)
    setIsExistingProfile(false)
    setShowCropper(false)
    setRawImageSrc('')
  }

  const fieldLabel = 'text-xs font-medium text-rose-500 mb-1'
  const fieldBox =
    'bg-rose-50 border border-rose-100 rounded-lg px-3 py-2 focus-within:border-rose-400 transition-colors'
  const fieldInput =
    'w-full bg-transparent outline-none text-sm font-semibold text-gray-800 placeholder-gray-400'

  return (
    <div className="min-h-screen bg-rose-50/40">
      
      <div className="max-w-2xl mx-auto mb-0 ml-74 pt-5">
                <Link to="/home" className="text-sm text-rose-600 font-semibold hover:underline">
                    ← Back to Home
                </Link>
            </div>
      <form
        onSubmit={submitProfile}
        className="w-full max-w-4xl mx-auto bg-white min-h-screen"
      >
        <div className="p-6 flex gap-5 items-start">
          <label className="relative flex-shrink-0 w-28 h-28 rounded-xl bg-rose-100 border-2 border-dashed border-rose-300 flex flex-col items-center justify-center overflow-hidden cursor-pointer hover:bg-rose-100/70 transition-colors">
            {imagePreview ? (
              <img src={imagePreview} alt="Profile preview" className="w-full h-full object-cover" />
            ) : (
              <>
                <Camera className="w-6 h-6 text-rose-400 mb-1" />
                <span className="text-xs text-rose-400 font-medium text-center px-2">Add Photo</span>
              </>
            )}
            <input
              type="file"
              id="profileImage"
              name="profileImage"
              onChange={handleImageChange}
              accept="image/*"
              className="sr-only"
              disabled={isSubmitted}
            />
          </label>

          <div className="flex-1 min-w-0">
            {isSubmitted ? (
              <div className="flex items-center gap-2 mb-1">
                <h1 className="text-xl font-bold text-gray-900 truncate">{profile.name}</h1>
                <CheckCircle2 className="w-5 h-5 text-rose-500 flex-shrink-0" />
              </div>
            ) : (
              <input
                type="text"
                id="name"
                name="name"
                value={profile.name}
                onChange={ninput}
                required
                placeholder="Profile Name"
                className="text-xl font-bold text-gray-900 placeholder-gray-300 outline-none border-b-2 border-rose-100 focus:border-rose-400 w-full pb-1 mb-3 transition-colors"
              />
            )}

            <div className="grid grid-cols-2 gap-x-6 gap-y-3">
              <div>
                <p className={fieldLabel}>Age</p>
                {isSubmitted ? (
                  <p className="text-sm font-semibold text-gray-800">{profile.age} years</p>
                ) : (
                  <input
                    type="number"
                    id="age"
                    name="age"
                    min="18"
                    value={profile.age}
                    onChange={handleAgeChange}
                    required
                    placeholder="e.g. 24"
                    className="w-full bg-transparent outline-none text-sm font-semibold text-gray-800 placeholder-gray-400 border-b border-rose-200 focus:border-rose-400 pb-0.5"
                  />
                )}
              </div>
              <div>
                <p className={fieldLabel}>Height</p>
                {isSubmitted ? (
                  <p className="text-sm font-semibold text-gray-800">{profile.height} cm</p>
                ) : (
                  <input
                    type="number"
                    id="height"
                    name="height"
                    value={profile.height}
                    onChange={ninput}
                    required
                    placeholder="in cm"
                    className="w-full bg-transparent outline-none text-sm font-semibold text-gray-800 placeholder-gray-400 border-b border-rose-200 focus:border-rose-400 pb-0.5"
                  />
                )}
              </div>
              <div>
                <p className={fieldLabel}>Location</p>
                {isSubmitted ? (
                  <p className="text-sm font-semibold text-gray-800">
                    {profile.city}, {profile.state}
                  </p>
                ) : (
                  <div className="flex gap-2">
                    <input
                      type="text"
                      id="city"
                      name="city"
                      value={profile.city}
                      onChange={ninput}
                      required
                      placeholder="City"
                      className="w-1/2 bg-transparent outline-none text-sm font-semibold text-gray-800 placeholder-gray-400 border-b border-rose-200 focus:border-rose-400 pb-0.5"
                    />
                    <input
                      type="text"
                      id="state"
                      name="state"
                      value={profile.state}
                      onChange={ninput}
                      required
                      placeholder="State"
                      className="w-1/2 bg-transparent outline-none text-sm font-semibold text-gray-800 placeholder-gray-400 border-b border-rose-200 focus:border-rose-400 pb-0.5"
                    />
                  </div>
                )}
              </div>
              <div>
                <p className={fieldLabel}>Education</p>
                {isSubmitted ? (
                  <p className="text-sm font-semibold text-gray-800">{profile.education}</p>
                ) : (
                  <input
                    type="text"
                    id="education"
                    name="education"
                    value={profile.education}
                    onChange={ninput}
                    required
                    placeholder="e.g. Masters Degree"
                    className="w-full bg-transparent outline-none text-sm font-semibold text-gray-800 placeholder-gray-400 border-b border-rose-200 focus:border-rose-400 pb-0.5"
                  />
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="px-6 py-4 border-t border-b border-rose-100 flex gap-3">
          {isSubmitted ? (
            <button
              type="button"
              onClick={(e) => {
                e.preventDefault()
                setIsSubmitted(false)
              }}
              className="w-full flex items-center justify-center gap-2 bg-rose-600 text-white text-sm font-semibold py-2.5 rounded-lg hover:opacity-90 transition-opacity"
            >
              <Pencil className="w-4 h-4" />
              Edit Profile
            </button>
          ) : (
            <>
              <button
                type="submit"
                disabled={isSaving}
                className="flex-1 bg-rose-600 text-white text-sm font-semibold py-2.5 rounded-lg hover:opacity-90 transition-opacity disabled:opacity-60"
              >
                {isSaving ? 'Saving...' : 'Save Profile'}
              </button>
              <button
                type="button"
                onClick={resetProfile}
                className="border-2 border-rose-200 text-rose-600 text-sm font-semibold py-2.5 px-4 rounded-lg hover:bg-rose-50 transition-colors"
              >
                Reset
              </button>
            </>
          )}
        </div>

        <div className="p-6 space-y-6">
          <section>
            <h2 className="text-rose-600 font-bold mb-3">About</h2>
            {isSubmitted ? (
              <p className="bg-rose-50 border border-rose-100 rounded-lg p-4 text-sm text-gray-700 whitespace-pre-wrap">
                {profile.about || 'No bio provided.'}
              </p>
            ) : (
              <textarea
                id="about"
                name="about"
                value={profile.about}
                onChange={ninput}
                required
                rows={3}
                placeholder="Tell us about yourself..."
                className="w-full bg-rose-50 border border-rose-100 rounded-lg p-4 text-sm text-gray-800 placeholder-gray-400 outline-none focus:border-rose-400 transition-colors resize-none"
              />
            )}
          </section>

          <section>
            <h2 className="text-rose-600 font-bold mb-3">Basic Details</h2>
            <div className="grid grid-cols-2 gap-3">
              <div className={fieldBox}>
                <p className={fieldLabel}>Religion</p>
                <p className="text-sm font-semibold text-gray-800">{user?.religion || '—'}</p>
              </div>
              <div className={fieldBox}>
                <p className={fieldLabel}>Caste</p>
                {isSubmitted ? (
                  <p className="text-sm font-semibold text-gray-800">{profile.caste}</p>
                ) : (
                  <input
                    type="text"
                    id="caste"
                    name="caste"
                    value={profile.caste}
                    onChange={ninput}
                    required
                    placeholder="Caste"
                    className={fieldInput}
                  />
                )}
              </div>
              <div className={fieldBox}>
                <p className={fieldLabel}>Gender</p>
                <p className="text-sm font-semibold text-gray-800">{user?.gender || '—'}</p>
              </div>
              <div className={fieldBox}>
                <p className={fieldLabel}>Marital Status</p>
                {isSubmitted ? (
                  <p className="text-sm font-semibold text-gray-800">{profile.maritalStatus}</p>
                ) : (
                  <select
                    id="maritalStatus"
                    name="maritalStatus"
                    value={profile.maritalStatus}
                    onChange={ninput}
                    required
                    className={fieldInput}
                  >
                    <option value="" disabled>Select</option>
                    <option value="Never Married">Never Married</option>
                    <option value="Divorced">Divorced</option>
                    <option value="Widowed">Widowed</option>
                    <option value="Separated">Separated</option>
                  </select>
                )}
              </div>
              <div className={`${fieldBox} col-span-2`}>
                <p className={fieldLabel}>Date of Birth</p>
                {isSubmitted ? (
                  <p className="text-sm font-semibold text-gray-800">{profile.dateOfBirth}</p>
                ) : (
                  <input
                    type="date"
                    id="dateOfBirth"
                    name="dateOfBirth"
                    value={profile.dateOfBirth}
                    onChange={ninput}
                    required
                    className={fieldInput}
                  />
                )}
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-rose-600 font-bold mb-3">Professional Details</h2>
            <div className="grid grid-cols-2 gap-3">
              <div className={fieldBox}>
                <p className={fieldLabel}>Occupation</p>
                {isSubmitted ? (
                  <p className="text-sm font-semibold text-gray-800">{profile.occupation}</p>
                ) : (
                  <input
                    type="text"
                    id="occupation"
                    name="occupation"
                    value={profile.occupation}
                    onChange={ninput}
                    required
                    placeholder="e.g. Software Engineer"
                    className={fieldInput}
                  />
                )}
              </div>
              <div className={fieldBox}>
                <p className={fieldLabel}>Annual Income</p>
                {isSubmitted ? (
                  <p className="text-sm font-semibold text-gray-800">₹{profile.income}</p>
                ) : (
                  <input
                    type="number"
                    id="income"
                    name="income"
                    value={profile.income}
                    onChange={ninput}
                    required
                    placeholder="in ₹"
                    className={fieldInput}
                  />
                )}
              </div>
              <div className={`${fieldBox} col-span-2`}>
                <p className={fieldLabel}>Work Location / Address</p>
                {isSubmitted ? (
                  <p className="text-sm font-semibold text-gray-800">{profile.address}</p>
                ) : (
                  <input
                    type="text"
                    id="address"
                    name="address"
                    value={profile.address}
                    onChange={ninput}
                    required
                    placeholder="Full address"
                    className={fieldInput}
                  />
                )}
              </div>
            </div>
          </section>
        </div>
      </form>

      {showCropper && (
        <ImageCropperModal imageSrc={rawImageSrc} onCancel={handleCropCancel} onCropDone={handleCropDone} />
      )}
    </div>
  )
}

export default UserProfile
