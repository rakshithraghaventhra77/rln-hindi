import express, { Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { createClient } from '@supabase/supabase-js';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


// Load environment variables
dotenv.config();

const app = express();
const port = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Initialize Supabase client
const supabaseUrl = process.env.SUPABASE_URL || '';
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY || '';

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('SUPABASE_URL and SUPABASE_ANON_KEY must be provided in .env');
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Generic function to handle validation and insertion
const handleSubmission = async (
  req: Request,
  res: Response,
  table: string,
  requiredFields: string[]
) => {
  const data = req.body;

  // Basic validation
  for (const field of requiredFields) {
    if (!data[field]) {
      return res.status(400).json({
        success: false,
        message: `${field.charAt(0).toUpperCase() + field.slice(1)} is required.`
      });
    }
  }

  // Insert into Supabase
  const { error } = await supabase.from(table).insert([data]);

  if (error) {
    console.error(`Error inserting into ${table}:`, error);
    return res.status(500).json({
      success: false,
      message: 'Failed to submit form. Please try again later.',
      error: error.message
    });
  }

  return res.json({
    success: true,
    message: 'Form submitted successfully!'
  });
};

// API Endpoints
app.post('/api/enroll', (req: Request, res: Response) => {
  handleSubmission(req, res, 'enrollments', ['name', 'email', 'phone', 'selected_course']);
});

app.post('/api/demo', (req: Request, res: Response) => {
  handleSubmission(req, res, 'demo_requests', ['name', 'email', 'phone']);
});

app.post('/api/corporate', (req: Request, res: Response) => {
  handleSubmission(req, res, 'corporate_requests', ['company_name', 'contact_person', 'email', 'phone', 'requirement']);
});

app.post('/api/book', (req: Request, res: Response) => {
  handleSubmission(req, res, 'book_requests', ['name', 'email', 'phone', 'address']);
});

app.post('/api/contact', (req: Request, res: Response) => {
  handleSubmission(req, res, 'contact_messages', ['name', 'email', 'phone', 'message']);
});

// Serve static files from the Vite build directory
// Adjust path because we are now in the api/ folder
app.use(express.static(path.join(__dirname, '..', 'dist')));

// Catch-all route to serve the React app for any non-API routes
app.get('*', (req: Request, res: Response) => {
  res.sendFile(path.join(__dirname, '..', 'dist', 'index.html'));
});


// Start server only if not running as a serverless function (Vercel)
if (process.env.NODE_ENV !== 'production' || !process.env.VERCEL) {
  app.listen(port, () => {
    console.log(`Backend server running on http://localhost:${port}`);
  });
}

export default app;
