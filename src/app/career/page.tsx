import { motion } from 'framer-motion';
import CareerPage from '@/components/CareerPage';

export default function Page() {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <CareerPage />
    </motion.div>
  );
}
