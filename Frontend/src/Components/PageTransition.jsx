import { motion } from 'framer-motion'

// Wrap each page's top-level element with this in App.jsx so route changes
// fade/slide instead of snapping instantly.
const PageTransition = ({ children }) => (
    <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -12 }}
        transition={{ duration: 0.25, ease: 'easeInOut' }}
    >
        {children}
    </motion.div>
)

export default PageTransition
