import { Heart, Phone, Mail, MapPin, ArrowRight, ShieldCheck, Crown, Sparkles } from 'lucide-react'

// lucide-react v1 removed all brand/logo icons (Instagram, Facebook, Twitter, etc.)
// due to trademark concerns, so these are small inline replacements.
const InstagramIcon = (props) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" {...props}>
        <rect x="2" y="2" width="20" height="20" rx="5" />
        <circle cx="12" cy="12" r="4" />
        <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
    </svg>
)

const FacebookIcon = (props) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" {...props}>
        <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
    </svg>
)

const TwitterIcon = (props) => (
    <svg viewBox="0 0 24 24" fill="currentColor" stroke="none" {...props}>
        <path d="M18 3h3l-7.5 8.6L22 21h-6.6l-5.2-6.8L4 21H1l8-9.2L2 3h6.8l4.7 6.2L18 3zm-1.2 16h1.7L7.3 5H5.5l11.3 14z" />
    </svg>
)

const YoutubeIcon = (props) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" {...props}>
        <rect x="2" y="5" width="20" height="14" rx="4" />
        <path d="M10 9.5v5l4.5-2.5z" fill="currentColor" stroke="none" />
    </svg>
)

const Footer = () => {
    return (
        <footer className="bg-white border-t border-pink-100">
            <div className="max-w-6xl mx-auto px-6 pt-16 pb-8">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-10">

                    {/* Brand column */}
                    <div>
                        <div className="flex items-center gap-2 mb-4">
                                
                            <span className="text-lg font-bold text-gray-900">Shaadi.com</span>
                        </div>
                        <p className="text-sm text-gray-500 leading-relaxed mb-4">
                            India's most trusted matrimonial platform. We've helped over 5,000 couples find their perfect life partner across 50+ countries.
                        </p>

                        <div className="flex flex-wrap gap-2 mb-4">
                            <span className="text-xs font-semibold text-pink-600 bg-pink-50 border border-pink-100 rounded-full px-3 py-1">
                                10,000+ Profiles
                            </span>
                            <span className="text-xs font-semibold text-pink-600 bg-pink-50 border border-pink-100 rounded-full px-3 py-1">
                                5,000+ Marriages
                            </span>
                            <span className="text-xs font-semibold text-pink-600 bg-pink-50 border border-pink-100 rounded-full px-3 py-1">
                                98% Satisfaction
                            </span>
                        </div>

                        <div className="flex gap-3">
                            {[InstagramIcon, FacebookIcon, TwitterIcon, YoutubeIcon].map((Icon, i) => (
                                <a
                                    key={i}
                                    href="#"
                                    className="w-9 h-9 rounded-lg bg-pink-50 border border-pink-100 flex items-center justify-center text-pink-600 hover:bg-pink-100 transition-colors"
                                >
                                    <Icon className="w-4 h-4" />
                                </a>
                            ))}
                        </div>
                    </div>

                    {/* Company */}
                    <div>
                        <h3 className="text-xs font-bold text-gray-900 tracking-wide mb-4">COMPANY</h3>
                        <ul className="space-y-3 text-sm">
                            {['About Us', 'How It Works', 'Success Stories', 'Blog & Advice', 'Careers', 'Press'].map((item) => (
                                <li key={item}>
                                    <a href="#" className="text-gray-500 hover:text-pink-600 transition-colors">{item}</a>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Services */}
                    <div>
                        <h3 className="text-xs font-bold text-gray-900 tracking-wide mb-4">SERVICES</h3>
                        <ul className="space-y-3 text-sm">
                            {['Browse Profiles', 'Premium Plans', 'Verified Profiles', 'Matchmaking Experts', 'Membership Plans'].map((item) => (
                                <li key={item}>
                                    <a href="#" className="text-gray-500 hover:text-pink-600 transition-colors">{item}</a>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Support */}
                    <div>
                        <h3 className="text-xs font-bold text-gray-900 tracking-wide mb-4">SUPPORT</h3>
                        <ul className="space-y-3 text-sm">
                            {['Help Center', 'Safety Tips', 'Privacy Policy', 'Terms of Service', 'Cookie Policy', 'Contact Us'].map((item) => (
                                <li key={item}>
                                    <a href="#" className="text-gray-500 hover:text-pink-600 transition-colors">{item}</a>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>

                {/* Stay in touch */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mt-10 pt-10 border-t border-pink-100">
                    <div className="md:col-start-4">
                        <h3 className="text-xs font-bold text-gray-900 tracking-wide mb-3">STAY IN TOUCH</h3>
                        <p className="text-sm text-gray-500 mb-4">Get match suggestions and wedding tips in your inbox.</p>
                        <form className="flex gap-2 mb-5">
                            <input
                                type="email"
                                placeholder="your@email.com"
                                className="flex-1 min-w-0 border border-pink-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-pink-400 transition-colors"
                            />
                            <button
                                type="submit"
                                className="flex items-center gap-1 bg-pink-600 hover:bg-pink-700 text-white text-sm font-semibold px-4 py-2 rounded-lg transition-colors flex-shrink-0"
                            >
                                Subscribe <ArrowRight className="w-3.5 h-3.5" />
                            </button>
                        </form>

                        <ul className="space-y-2.5 text-sm text-gray-500">
                            <li className="flex items-center gap-2">
                                <Phone className="w-4 h-4 text-pink-500 flex-shrink-0" />
                                1800-123-4567 (Toll Free)
                            </li>
                            <li className="flex items-center gap-2">
                                <Mail className="w-4 h-4 text-pink-500 flex-shrink-0" />
                                hello@shaadi.com
                            </li>
                            <li className="flex items-start gap-2">
                                <MapPin className="w-4 h-4 text-pink-500 flex-shrink-0 mt-0.5" />
                                Mumbai, Delhi, Bangalore, Chennai
                            </li>
                        </ul>
                    </div>
                </div>

                {/* Highlighted service cards */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-10 pt-10 border-t border-pink-100">
                    {[
                        { icon: ShieldCheck, title: 'Verified Profiles', subtitle: '100% ID-verified members' },
                        { icon: Crown, title: 'Premium Membership', subtitle: 'Unlock advanced matching' },
                        { icon: Sparkles, title: 'Success Stories', subtitle: '5,000+ happy couples' },
                    ].map(({ icon: Icon, title, subtitle }) => (
                        <a
                            key={title}
                            href="#"
                            className="flex items-center justify-between gap-3 bg-pink-50 hover:bg-pink-100 border border-pink-100 rounded-xl px-4 py-3 transition-colors"
                        >
                            <div className="flex items-center gap-3">
                                <div className="w-9 h-9 rounded-lg bg-white border border-pink-200 flex items-center justify-center flex-shrink-0">
                                    <Icon className="w-4 h-4 text-pink-600" />
                                </div>
                                <div>
                                    <p className="text-sm font-bold text-gray-900">{title}</p>
                                    <p className="text-xs text-gray-500">{subtitle}</p>
                                </div>
                            </div>
                            <ArrowRight className="w-4 h-4 text-pink-400 flex-shrink-0" />
                        </a>    
                    ))}
                </div>

                {/* Bottom bar */}
                <div className="flex flex-col sm:flex-row items-center justify-between gap-3 mt-10 pt-6 border-t border-pink-100 text-xs text-gray-400">
                    <p>&copy; {new Date().getFullYear()} Shaadi.com Matrimonials Pvt. Ltd. All rights reserved.</p>
                    <div className="flex items-center gap-4">
                        <a href="#" className="hover:text-pink-600 transition-colors">Privacy Policy</a>
                        <a href="#" className="hover:text-pink-600 transition-colors">Terms of Service</a>
                        <a href="#" className="hover:text-pink-600 transition-colors">Cookie Policy</a>
                        <a href="#" className="hover:text-pink-600 transition-colors">Sitemap</a>
                    </div>
                    <p className="flex items-center gap-1">
                        Made with <Heart className="w-3 h-3 text-pink-500 fill-pink-500" /> in India
                    </p>
                </div>
            </div>
        </footer>
    )
}

export default Footer
