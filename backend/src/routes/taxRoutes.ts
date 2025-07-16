
import { Router } from 'express';
import multer from 'multer';
import { 
    getTaxData,
    addIncomeRecord,
    deleteIncomeRecord,
    uploadInvoices,
    deleteInvoice
} from '../controllers/taxController';
import { protect } from '../middleware/auth';

const router = Router();
const upload = multer({ storage: multer.memoryStorage() });

// All routes here are protected
router.use(protect);

router.get('/', getTaxData);

router.post('/incomes', addIncomeRecord);
router.delete('/incomes/:id', deleteIncomeRecord);

router.post('/expenses', upload.array('invoices', 10), uploadInvoices);
router.delete('/expenses/:id', deleteInvoice);


export default router;