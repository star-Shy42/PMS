# Patient Management System (PMS)

A comprehensive, AI-powered medical patient management system built with Next.js 15, featuring voice-enabled prescription creation, semantic search, and professional medical workflows.

## Features

### Core Functionality

- **Patient Management**: Complete patient records with medical history
- **Appointment Scheduling**: Efficient appointment management system
- **Medical Records**: Digital storage of patient medical records
- **Billing & Invoices**: Integrated billing and payment tracking
- **Reports & Analytics**: Comprehensive practice analytics

### AI-Powered Features

- **Voice-Enabled Prescriptions**: Dictate prescriptions with speech-to-text
- **Multilingual Support**: English and Bengali voice recognition
- **Semantic Search**: Find prescriptions using natural language queries
- **AI Symptom Checker**: Intelligent symptom analysis and suggestions
- **Predictive Alerts**: AI-driven health monitoring and alerts

### Prescription Management

- **Smart Prescription Forms**: Voice input for all prescription fields
- **Vector Search**: Semantic search through prescription database
- **Professional Printing**: Clean, medical-grade prescription output
- **Template System**: Standardized prescription formats

## Tech Stack

- **Frontend**: Next.js 15, React 19, TypeScript, Tailwind CSS
- **Backend**: Next.js API Routes, Prisma ORM
- **Database**: PostgreSQL with vector embeddings
- **AI/ML**: Hugging Face Transformers, Google Gemini AI
- **Authentication**: JWT-based user authentication
- **Deployment**: Vercel-ready architecture

## Installation

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd medical-pms
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Set up environment variables**
   Create a `.env.local` file:

   ```env
   DATABASE_URL="postgresql://username:password@localhost:5432/pms"
   JWT_SECRET="your-jwt-secret"
   GEMINI_API_KEY="your-gemini-api-key"
   ```

4. **Set up the database**

   ```bash
   npx prisma migrate dev
   npx prisma generate
   ```

5. **Run the development server**

   ```bash
   npm run dev
   ```

6. **Open [http://localhost:3000](http://localhost:3000)**

## Usage

### For Doctors

1. **Login** to access the dashboard
2. **Create Prescriptions** using voice input (English or Bengali)
3. **Search Prescriptions** semantically ("find fever medications")
4. **View Patient Records** and medical history
5. **Schedule Appointments** and manage calendar

### Voice Input Features

- Click the 🎤 microphone button next to any text field
- Toggle between English and Bengali using the language button
- Speak naturally - the system transcribes your voice to text
- Works for doctor info, patient details, medical notes, and prescriptions

### Semantic Search

- Use natural language queries like "antibiotics for children"
- The system understands medical context and finds relevant prescriptions
- Powered by AI embeddings for accurate, contextual results

## Project Structure

```
src/
├── app/                    # Next.js App Router
│   ├── api/               # API routes
│   │   ├── prescriptions/ # Prescription management
│   │   ├── patients/      # Patient management
│   │   └── ai/           # AI-powered features
│   ├── prescriptions/    # Prescription pages
│   ├── patients/         # Patient management pages
│   └── dashboard/        # Main dashboard
├── components/           # Reusable React components
│   ├── MedicalPrescriptionForm.tsx
│   └── Sidebar.tsx
├── lib/                  # Utility libraries
│   ├── prisma.ts        # Database client
│   └── gemini.ts        # AI integration
└── services/            # API service layer
    └── api.ts           # Centralized API calls
```

## API Endpoints

### Prescriptions

- `GET /api/prescriptions` - List all prescriptions
- `POST /api/prescriptions` - Create new prescription
- `GET /api/prescriptions/[id]` - Get specific prescription
- `GET /api/prescriptions/search?q=query` - Semantic search

### Patients

- `GET /api/patients` - List patients
- `POST /api/patients` - Create patient
- `GET /api/patients/[id]` - Get patient details

### AI Features

- `POST /api/ai/symptom-checker` - Analyze symptoms
- `POST /api/ai/prescription-assistance` - Get prescription suggestions
- `POST /api/ai/predictive-alerts` - Generate health alerts

## AI Integration

### Hugging Face Transformers

- Used for text feature extraction and embeddings
- Powers semantic search functionality
- Model: `Xenova/all-MiniLM-L6-v2`

### Google Gemini AI

- Symptom analysis and medical suggestions
- Predictive health alerts
- Natural language processing for medical queries

## UI/UX Features

- **Responsive Design**: Works on desktop, tablet, and mobile
- **Dark/Light Theme**: Automatic theme switching
- **Voice Controls**: Hands-free operation for doctors
- **Print Optimization**: Professional medical document printing
- **Accessibility**: WCAG compliant with keyboard navigation

## Security

- **JWT Authentication**: Secure user sessions
- **Role-based Access**: Doctor and assistant permissions
- **Data Encryption**: Sensitive medical data protection
- **API Security**: Rate limiting and input validation

## Deployment

### Vercel (Recommended)

1. Connect your GitHub repository to Vercel
2. Add environment variables in Vercel dashboard
3. Deploy automatically on git push

### Manual Deployment

```bash
npm run build
npm start
```

## Database Schema

Key models include:

- **User**: Doctors and medical staff
- **Patient**: Patient information and medical history
- **Prescription**: Medical prescriptions with vector embeddings
- **Appointment**: Scheduled appointments
- **MedicalRecord**: Patient medical records
- **Invoice**: Billing and payment records

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the JUST License.

## Acknowledgments

- [Next.js](https://nextjs.org/) - The React framework
- [Hugging Face](https://huggingface.co/) - AI model hosting
- [Google Gemini](https://ai.google.dev/) - AI capabilities
- [Prisma](https://prisma.io/) - Database ORM
- [Tailwind CSS](https://tailwindcss.com/) - Utility-first CSS

**Built with ❤️ for healthcare professionals worldwide**
