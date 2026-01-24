import React, { useState, createContext, useContext } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation, useParams, useNavigate } from 'react-router-dom';
import { 
  Search, MapPin, Briefcase, User, Bell, LayoutDashboard, 
  FileText, Settings, CreditCard, ChevronRight, Filter,
  Home as HomeIcon, LogOut, CheckCircle, TrendingUp, Wallet, Clock,
  Facebook, Twitter, Linkedin, Instagram, Mail, Phone
} from 'lucide-react';

// Global State Management
const AppContext = createContext();
const useAppContext = () => useContext(AppContext);

// --- STYLES & CONFIG ---
// In a real app, you would import 'Inter' or 'Plus Jakarta Sans' from Google Fonts.
// For now, we use standard sans-serif with refined Tailwind classes.

// Demo Login Credentials
const COMPANY_CREDENTIALS = {
  email: 'company@workzone.com',
  password: 'company123',
  companyName: 'Creative Pixel Studios',
  companyId: 'company1'
};

const INITIAL_JOBS = [
  // Retail & Customer Service Jobs
  { id: 1, title: 'Cashier - City Center Book Shop', company: 'City Center Book Store', location: 'Colombo 07', rate: 'LKR 1,500/hr', amount: 30000, type: 'Part-Time', tags: ['Retail', 'Customer Service', 'Cash Handling'], logoColor: 'bg-blue-500', description: 'Handle customer transactions at our busy bookshop in City Center. Manage point-of-sale systems, process payments accurately, and provide excellent customer service. Flexible hours perfect for campus students. No experience necessary - full training provided. Benefits include employee discount on books and magazines.', postedBy: 'company1' },
  
  { id: 2, title: 'Cashier & Retail Associate - Food City Supermarket', company: 'Food City Supermarket', location: 'Colombo 03', rate: 'LKR 1,200/hr', amount: 24000, type: 'Part-Time', tags: ['Retail', 'Cashier', 'Supermarket'], logoColor: 'bg-green-600', description: 'Work as a cashier and retail assistant at Food City. Responsibilities include operating checkout systems, scanning items, handling payments, and assisting customers with their shopping. Evening and weekend shifts available. Competitive pay with performance bonuses. Employee discounts on groceries and household items.', postedBy: 'company2' },

  // Promotions & Marketing
  { id: 3, title: 'Leaflet Promotions - MultiCare Pharmaceuticals', company: 'MultiCare Pharmaceuticals', location: 'Colombo 04', rate: 'LKR 1,800/hr', amount: 36000, type: 'Part-Time', tags: ['Marketing', 'Promotions', 'Outreach'], logoColor: 'bg-red-500', description: 'Distribute promotional leaflets for MultiCare Pharmaceuticals across busy commercial areas in Colombo. Engage with potential customers, answer basic questions about health products, and collect feedback. Flexible 4-6 hour shifts. Weather protection and materials provided. Great way to earn while improving communication skills.', postedBy: 'company3' },

  { id: 4, title: 'Brand Ambassador - Mobile Phone Distribution', company: 'Digital Tek Solutions', location: 'Colombo 09', rate: 'LKR 2,000/hr', amount: 40000, type: 'Part-Time', tags: ['Marketing', 'Promotions', 'Sales'], logoColor: 'bg-purple-600', description: 'Promote latest mobile phones and plans from Digital Tek Solutions at malls and commercial hubs. Demonstrate products, engage customers, and achieve daily targets. Commissions based on successful promotions. Flexible weekend schedules. No sales experience needed - comprehensive training provided.', postedBy: 'company4' },

  { id: 5, title: 'Event Promoter - Fashion & Lifestyle', company: 'StyleZone Marketing', location: 'Kandy', rate: 'LKR 2,200/hr', amount: 44000, type: 'Part-Time', tags: ['Marketing', 'Events', 'Promotions'], logoColor: 'bg-pink-500', description: 'Promote fashion and lifestyle brands at shopping malls and commercial events. Hand out samples, explain product features, and engage with customers. Perfect for students interested in marketing. Event-based work with flexible scheduling. Free branded merchandise and performance bonuses.', postedBy: 'company5' },

  // Stock & Inventory Management
  { id: 6, title: 'Stock Counting & Inventory Helper - Colombo Warehouse', company: 'Global Logistics Sri Lanka', location: 'Colombo 14', rate: 'LKR 1,600/hr', amount: 32000, type: 'Part-Time', tags: ['Warehouse', 'Inventory', 'Organization'], logoColor: 'bg-orange-600', description: 'Assist with stock counting and inventory management at our Colombo warehouse. Responsibilities include counting items, organizing shelves, scanning barcodes, and maintaining records. Physical work in a climate-controlled environment. Flexible evening and weekend shifts. Great for students who prefer hands-on work.', postedBy: 'company6' },

  { id: 7, title: 'Store Stock Assistant - Supermarket Chain', company: 'Smart Shopping Stores', location: 'Galle', rate: 'LKR 1,400/hr', amount: 28000, type: 'Part-Time', tags: ['Retail', 'Stock Management', 'Warehouse'], logoColor: 'bg-cyan-600', description: 'Help stock shelves and manage inventory at Smart Shopping stores. Unpack deliveries, organize products by category, maintain shelf appearance, and handle stock audits. Physical work in a clean, organized environment. Flexible scheduling around your campus timetable. Opportunities for advancement.', postedBy: 'company7' },

  { id: 8, title: 'Vehicle Count & Inventory - Transport Company', company: 'Island Wide Transport Services', location: 'Colombo 02', rate: 'LKR 2,500/hr', amount: 50000, type: 'Part-Time', tags: ['Logistics', 'Inventory', 'Counting'], logoColor: 'bg-yellow-600', description: 'Count and track vehicles in our large fleet for Island Wide Transport Services. Record vehicle locations, maintenance status, and prepare inventory reports. Use company systems and software. Regular 4-hour shifts available. Work in a professional logistics environment. No prior experience necessary.', postedBy: 'company8' },

  // Hotel & Hospitality
  { id: 9, title: 'Hotel Housekeeping - 4-Star Hotel', company: 'Royal Palm Hotel Colombo', location: 'Colombo 03', rate: 'LKR 1,900/hr', amount: 38000, type: 'Part-Time', tags: ['Hospitality', 'Housekeeping', 'Hotel'], logoColor: 'bg-amber-600', description: 'Join our housekeeping team at Royal Palm Hotel Colombo. Responsibilities include cleaning guest rooms, maintaining common areas, changing linens, and ensuring high cleanliness standards. Professional uniform provided. Flexible shifts including mornings and afternoons. Excellent training and supportive team environment.', postedBy: 'company9' },

  { id: 10, title: 'Hotel Restaurant Attendant - City Center', company: 'Grand Hotel & Restaurant', location: 'Colombo 07', rate: 'LKR 1,700/hr', amount: 34000, type: 'Part-Time', tags: ['Hospitality', 'Food Service', 'Customer Service'], logoColor: 'bg-red-600', description: 'Work as a restaurant attendant at Grand Hotel. Clear tables, serve customers, arrange place settings, and maintain dining area cleanliness. Professional attire provided. Training in customer service standards. Flexible evening and weekend shifts. Interact with diverse clientele and build hospitality experience.', postedBy: 'company10' },

  { id: 11, title: 'Front Desk Reception - Boutique Hotel', company: 'Paradise Bay Hotel', location: 'Negombo', rate: 'LKR 2,100/hr', amount: 42000, type: 'Part-Time', tags: ['Hospitality', 'Reception', 'Customer Service'], logoColor: 'bg-blue-600', description: 'Welcome guests and manage front desk operations at Paradise Bay Hotel. Handle check-ins/check-outs, answer inquiries, maintain guest records, and provide exceptional service. English fluency required. Professional environment with career growth opportunities. Flexible scheduling for students.', postedBy: 'company11' },

  { id: 12, title: 'Kitchen Helper & Food Prep - Restaurant', company: 'Taste of Colombo Restaurant', location: 'Colombo 05', rate: 'LKR 1,350/hr', amount: 27000, type: 'Part-Time', tags: ['Hospitality', 'Food Service', 'Kitchen'], logoColor: 'bg-orange-500', description: 'Assist kitchen staff with food preparation, washing dishes, and maintaining kitchen cleanliness. Learn basic cooking techniques and food safety standards. Supportive, fast-paced environment. Flexible shifts around your studies. Staff meals provided. Great stepping stone to culinary career.', postedBy: 'company12' },

  // Flower & Decoration
  { id: 13, title: 'Floral Arranger & Decorator - Event Company', company: 'Bloom Designs Event Decor', location: 'Colombo 06', rate: 'LKR 2,300/hr', amount: 46000, type: 'Part-Time', tags: ['Decoration', 'Events', 'Florals', 'Creative'], logoColor: 'bg-pink-600', description: 'Create beautiful floral arrangements and designs for weddings, corporate events, and celebrations. Learn floral design techniques while earning. Arrange flowers, prepare centerpieces, and deliver decorations to event venues. Creative work with flexible scheduling. Perfect for artistic students. No experience needed - full training provided.', postedBy: 'company13' },

  { id: 14, title: 'Event Decorator - Balloons & Props', company: 'Party Perfect Celebrations', location: 'Kandy', rate: 'LKR 2,000/hr', amount: 40000, type: 'Part-Time', tags: ['Decoration', 'Events', 'Setup'], logoColor: 'bg-purple-500', description: 'Decorate event spaces for birthdays, weddings, and corporate functions. Set up balloons, hang decorations, arrange furniture, and create festive atmospheres. Physical work requiring attention to detail. Flexible event-based scheduling. Evening and weekend work. Fun, creative, and rewarding!', postedBy: 'company14' },

  { id: 15, title: 'Wedding & Events Setup - Decoration Team', company: 'Elegant Events Sri Lanka', location: 'Colombo 04', rate: 'LKR 2,400/hr', amount: 48000, type: 'Part-Time', tags: ['Events', 'Decoration', 'Setup'], logoColor: 'bg-rose-600', description: 'Set up and decorate wedding venues, banquet halls, and event spaces for Elegant Events. Install tables, chairs, decorations, lighting, and floral arrangements. Work with professional event teams on various occasions. Physical work with flexible scheduling. Great for students who enjoy creative and dynamic environments.', postedBy: 'company15' },

  // Original Jobs (Kept)
  { id: 16, title: 'Graphic Designer - Digital Branding', company: 'Creative Pixel Studios', location: 'Colombo', rate: 'LKR 3,500/hr', amount: 87500, type: 'Freelance', tags: ['Design', 'Branding'], logoColor: 'bg-orange-500', description: 'Create stunning visual designs for local and international marketing campaigns. Work with modern design tools and deliver high-quality branding assets for growing businesses.', postedBy: 'company1' },
  
  { id: 17, title: 'UX/UI Designer - Mobile Apps', company: 'TechFlow Asia', location: 'Colombo, Western Province', rate: 'LKR 8,000/hr', amount: 200000, type: 'Full-Time', tags: ['UI/UX', 'Figma', 'Mobile'], logoColor: 'bg-blue-600', description: 'Design user-friendly interfaces for mobile applications targeting the Asian market. Collaborate with development teams to create seamless user experiences.', postedBy: 'company2' },
  
  { id: 18, title: 'English Tutor for O/L & A/L Students', company: 'EduLearn Sri Lanka', location: 'Kandy', rate: 'LKR 2,000/hr', amount: 50000, type: 'Part-Time', tags: ['Teaching', 'English', 'Exam Prep'], logoColor: 'bg-green-500', description: 'Teach English language and literature to O/L and A/L students. Help students prepare for national exams with proven teaching methodologies.', postedBy: 'company1' },
  
  { id: 19, title: 'Social Media Manager - Sinhala & English', company: 'Local Buzz Marketing', location: 'Galle', rate: 'LKR 3,000/hr', amount: 75000, type: 'Contract', tags: ['Marketing', 'Social Media', 'Content'], logoColor: 'bg-pink-500', description: 'Manage social media accounts for local SMEs and startups. Create engaging content in Sinhala and English, manage community engagement, and track analytics.', postedBy: 'company1' },

  // Additional Professional Jobs
  { id: 20, title: 'Data Entry Specialist', company: 'BPO Solutions Sri Lanka', location: 'Colombo 01', rate: 'LKR 2,800/hr', amount: 56000, type: 'Part-Time', tags: ['Data Entry', 'Administrative', 'Office'], logoColor: 'bg-indigo-600', description: 'Enter and manage data for our BPO operations. Accuracy and attention to detail required. Work in a professional office environment. Flexible shifts available including evenings. No experience necessary with basic typing skills.', postedBy: 'company16' },

  { id: 21, title: 'Call Center Executive - English & Sinhala', company: 'Global Customer Support', location: 'Colombo 05', rate: 'LKR 2,500/hr', amount: 50000, type: 'Part-Time', tags: ['Customer Service', 'Call Center', 'Communication'], logoColor: 'bg-teal-600', description: 'Handle customer service calls for international clients. Fluency in English and Sinhala required. Professional training provided. Work in a team environment with modern communication tools. Flexible shifts with performance incentives.', postedBy: 'company17' },

  { id: 22, title: 'Online Tutor - Mathematics & Science', company: 'Virtual Academy Sri Lanka', location: 'Remote', rate: 'LKR 2,200/hr', amount: 44000, type: 'Freelance', tags: ['Teaching', 'Online', 'Education'], logoColor: 'bg-lime-600', description: 'Teach mathematics and science to students online from anywhere. Create lessons, conduct one-on-one sessions, and track student progress. Flexible scheduling perfect for campus life. Work from home with flexible hours. Competitive compensation.', postedBy: 'company18' },

  { id: 23, title: 'Content Writer - Sinhala & English', company: 'Digital Content Hub', location: 'Colombo 06', rate: 'LKR 3,000/hr', amount: 60000, type: 'Freelance', tags: ['Writing', 'Content', 'Marketing'], logoColor: 'bg-fuchsia-600', description: 'Write engaging content for blogs, websites, and social media in Sinhala and English. Create SEO-optimized articles, product descriptions, and marketing copy. Work from home with flexible deadlines. Perfect for students with writing skills.', postedBy: 'company19' },

  { id: 24, title: 'Delivery Assistant - Food & Packages', company: 'Express Couriers Sri Lanka', location: 'Colombo 09', rate: 'LKR 1,800/hr', amount: 36000, type: 'Part-Time', tags: ['Delivery', 'Logistics', 'Transportation'], logoColor: 'bg-amber-500', description: 'Deliver food orders and courier packages in Colombo area. Use company vehicle or own transportation (with allowance). Meet customers, handle payments, and provide excellent service. Flexible scheduling with incentives for peak hours.', postedBy: 'company20' },
];

// --- COMPONENTS ---

const Navbar = () => {
  const { isLoggedIn, isCompany, currentUser, logout } = useAppContext();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="bg-white border-b border-gray-100 px-6 py-4 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <div className="flex items-center gap-2">
          <img src="/logo.jpeg" alt="WorkZone" className="h-24" />
        </div>
        
        <div className="hidden md:flex gap-8 text-sm font-semibold text-gray-500">
          <Link to="/" className="hover:text-purple-600 transition-colors">Home</Link>
          <Link to="/about" className="hover:text-purple-600 transition-colors">About Us</Link>
          <Link to="/contact" className="hover:text-purple-600 transition-colors">Contact Us</Link>
          <Link to="/feedback" className="hover:text-purple-600 transition-colors">Feedback</Link>
          <Link to="/terms" className="hover:text-purple-600 transition-colors">Terms & Policies</Link>
          {isCompany && <Link to="/company-dashboard" className="hover:text-purple-600 transition-colors">Company Dashboard</Link>}
          {isLoggedIn && !isCompany && <Link to="/user-dashboard" className="hover:text-purple-600 transition-colors">My Dashboard</Link>}
        </div>

        <div className="flex items-center gap-4">
          {isLoggedIn ? (
            <>
              <span className="text-sm font-semibold text-gray-700">Hi, {currentUser}</span>
              <button
                onClick={handleLogout}
                className="bg-red-500 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-red-600 transition-colors"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="text-purple-600 font-semibold text-sm hover:underline">Login</Link>
              <Link to="/signup" className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-6 py-2.5 rounded-xl font-semibold shadow-sm hover:shadow-lg transition-all">Sign Up</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

const JobCard = ({ job }) => (
  <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-xl hover:border-purple-100 transition-all duration-300 group">
    <div className="flex justify-between items-start mb-4">
      <div className={`w-12 h-12 ${job.logoColor} rounded-xl flex items-center justify-center text-white font-bold text-lg shadow-sm`}>
        {job.company.charAt(0)}
      </div>
      <span className="bg-gradient-to-r from-purple-50 to-blue-50 text-purple-700 text-xs px-3 py-1 rounded-full font-bold uppercase tracking-wide">
        {job.type}
      </span>
    </div>
    
    <h3 className="font-bold text-lg text-gray-900 mb-1 group-hover:text-purple-600 transition-colors">{job.title}</h3>
    <p className="text-sm text-gray-500 mb-4">{job.company}</p>
    
    <div className="flex items-center gap-4 text-sm text-gray-500 mb-6 border-b border-gray-50 pb-4">
      <div className="flex items-center gap-1"><MapPin size={14} className="text-gray-400" /> {job.location}</div>
      <div className="flex items-center gap-1"><Briefcase size={14} className="text-gray-400" /> {job.rate}</div>
    </div>

    <Link to={`/job/${job.id}`} className="block w-full bg-white border border-purple-600 text-purple-600 py-2.5 rounded-xl text-center font-semibold hover:bg-purple-600 hover:text-white transition-all">
      View Details
    </Link>
  </div>
);

// --- PAGES ---

const Home = () => {
  const { jobs } = useAppContext();
  
  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      <Navbar />
      
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-purple-700 to-blue-600 pt-24 pb-32 px-6 relative overflow-hidden">
        {/* Decorative Background Elements */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-5 rounded-full -mr-16 -mt-16 pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-white opacity-5 rounded-full -ml-20 -mb-20 pointer-events-none"></div>

        <div className="max-w-4xl mx-auto text-center relative z-10">
          <h1 className="text-4xl md:text-6xl font-extrabold text-white mb-2 leading-tight">
            WorkZone
          </h1>
          <p className="text-2xl md:text-3xl font-bold text-blue-100 mb-8">Turn Spare Time into Income</p>
          <p className="text-blue-50 text-lg mb-10 max-w-2xl mx-auto">
            The smartest way for students to find part-time jobs and freelance projects. Earn money while you study, on your own schedule.
          </p>
        </div>
      </div>

      {/* Floating Search Bar */}
      <div className="px-6 -mt-10 relative z-20">
        <div className="bg-white p-3 rounded-2xl shadow-2xl max-w-4xl mx-auto flex flex-col md:flex-row gap-2 border border-gray-100">
          <div className="flex-1 flex items-center bg-gray-50 rounded-xl px-4 py-3 border border-transparent focus-within:border-purple-300 focus-within:bg-white transition-all">
            <Search className="text-gray-400 mr-3" size={20} />
            <input type="text" placeholder="Job title or keywords" className="bg-transparent w-full outline-none text-gray-700 placeholder-gray-400 font-medium" />
          </div>
          <div className="flex-1 flex items-center bg-gray-50 rounded-xl px-4 py-3 border border-transparent focus-within:border-purple-300 focus-within:bg-white transition-all">
            <MapPin className="text-gray-400 mr-3" size={20} />
            <input type="text" placeholder="City or Zip code" className="bg-transparent w-full outline-none text-gray-700 placeholder-gray-400 font-medium" />
          </div>
          <button className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-8 py-3 rounded-xl font-bold hover:shadow-lg shadow-lg shadow-purple-200 transition-all">
            Search
          </button>
        </div>
      </div>

      {/* Recent Jobs */}
      <div className="max-w-7xl mx-auto px-6 py-20">
        <div className="flex justify-between items-end mb-10">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Latest Opportunities</h2>
            <p className="text-gray-500 mt-1">Fresh jobs posted just for you</p>
          </div>
          <Link to="/jobs" className="text-purple-600 font-semibold flex items-center hover:underline">View All <ChevronRight size={16}/></Link>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {jobs.map(job => <JobCard key={job.id} job={job} />)}
        </div>
      </div>
      
      {/* Professional Black Footer */}
      <footer className="bg-black text-gray-300 pt-16 pb-8 mt-20">
        <div className="max-w-7xl mx-auto px-6">
          {/* Footer Content Grid */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
            {/* Column 1: Brand */}
            <div>
              <h3 className="text-white font-bold text-lg mb-4">WorkZone</h3>
              <p className="text-gray-400 text-sm mb-4">Turn spare time into income. The smartest platform for students to find part-time opportunities.</p>
              <div className="flex gap-3">
                <a href="#" className="w-10 h-10 bg-gray-800 hover:bg-purple-600 rounded-full flex items-center justify-center transition-colors text-white">
                  <Facebook size={18} />
                </a>
                <a href="#" className="w-10 h-10 bg-gray-800 hover:bg-purple-600 rounded-full flex items-center justify-center transition-colors text-white">
                  <Twitter size={18} />
                </a>
                <a href="#" className="w-10 h-10 bg-gray-800 hover:bg-purple-600 rounded-full flex items-center justify-center transition-colors text-white">
                  <Linkedin size={18} />
                </a>
                <a href="#" className="w-10 h-10 bg-gray-800 hover:bg-purple-600 rounded-full flex items-center justify-center transition-colors text-white">
                  <Instagram size={18} />
                </a>
              </div>
            </div>

            {/* Column 2: Quick Links */}
            <div>
              <h4 className="text-white font-bold text-sm uppercase tracking-wider mb-4">Quick Links</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><Link to="/" className="hover:text-purple-400 transition-colors">Browse Jobs</Link></li>
                <li><Link to="/about" className="hover:text-purple-400 transition-colors">About Us</Link></li>
                <li><Link to="/" className="hover:text-purple-400 transition-colors">How It Works</Link></li>
                <li><Link to="/" className="hover:text-purple-400 transition-colors">FAQs</Link></li>
              </ul>
            </div>

            {/* Column 3: Resources */}
            <div>
              <h4 className="text-white font-bold text-sm uppercase tracking-wider mb-4">Resources</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><Link to="/login" className="hover:text-purple-400 transition-colors">Sign In</Link></li>
                <li><Link to="/register" className="hover:text-purple-400 transition-colors">Register</Link></li>
                <li><Link to="/contact" className="hover:text-purple-400 transition-colors">Safety Tips</Link></li>
                <li><Link to="/" className="hover:text-purple-400 transition-colors">Blog</Link></li>
              </ul>
            </div>

            {/* Column 4: Contact & Info */}
            <div>
              <h4 className="text-white font-bold text-sm uppercase tracking-wider mb-4">Contact</h4>
              <ul className="space-y-3 text-sm text-gray-400">
                <li className="flex items-start gap-2">
                  <Mail size={16} className="text-purple-400 mt-0.5 flex-shrink-0" />
                  <a href="mailto:support@workzone.lk" className="hover:text-purple-400 transition-colors">support@workzone.lk</a>
                </li>
                <li className="flex items-start gap-2">
                  <Phone size={16} className="text-purple-400 mt-0.5 flex-shrink-0" />
                  <a href="tel:+94701234567" className="hover:text-purple-400 transition-colors">+94 (0) 701 234 567</a>
                </li>
                <li className="flex items-start gap-2">
                  <MapPin size={16} className="text-purple-400 mt-0.5 flex-shrink-0" />
                  <span>Colombo, Sri Lanka</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Divider */}
          <div className="border-t border-gray-800 py-8">
            {/* Bottom Links */}
            <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-6">
              <div className="flex flex-wrap gap-6 text-sm">
                <Link to="/terms" className="hover:text-purple-400 transition-colors">Terms & Policies</Link>
                <Link to="/contact" className="hover:text-purple-400 transition-colors">Contact Us</Link>
                <Link to="/feedback" className="hover:text-purple-400 transition-colors">Feedback</Link>
                <a href="#" className="hover:text-purple-400 transition-colors">Privacy Policy</a>
              </div>
            </div>

            {/* Copyright */}
            <div className="text-center text-gray-500 text-xs">
              <p>&copy; 2026 WorkZone. All rights reserved. | Built for Students, by Students</p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

const Dashboard = () => {
  // Sidebar Item Component
  const NavItem = ({ icon: Icon, label, active }) => (
    <div className={`flex items-center gap-3 px-4 py-3.5 rounded-xl cursor-pointer transition-all font-medium text-sm
      ${active 
        ? 'bg-purple-50 text-purple-700 shadow-sm' 
        : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900'
      }`}>
      <Icon size={18} />
      {label}
    </div>
  );

  return (
    <div className="flex h-screen bg-gray-50 font-sans">
      {/* Sidebar */}
      <aside className="w-72 bg-white border-r border-gray-100 hidden lg:flex flex-col p-6">
        <div className="flex items-center gap-2 mb-10 px-2">
          <img src="/logo.jpeg" alt="WorkZone" className="h-20" />
        </div>
        
        <div className="space-y-1 flex-1">
          <p className="px-4 text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Menu</p>
          <NavItem icon={LayoutDashboard} label="Dashboard" active />
          <NavItem icon={Briefcase} label="My Jobs" />
          <NavItem icon={FileText} label="Applications" />
          <NavItem icon={CreditCard} label="Payments" />
          <div className="pt-6 pb-2">
             <p className="px-4 text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">General</p>
          </div>
          <NavItem icon={User} label="My Profile" />
          <NavItem icon={Settings} label="Settings" />
        </div>
        
        <div className="mt-auto pt-6 border-t border-gray-100">
           <NavItem icon={LogOut} label="Log Out" />
        </div>
      </aside>

      {/* Main Area */}
      <main className="flex-1 overflow-y-auto">
        <header className="bg-white/80 backdrop-blur-md sticky top-0 z-40 border-b border-gray-100 px-8 py-4 flex justify-between items-center">
          <h2 className="text-xl font-bold text-gray-800">Overview</h2>
          <div className="flex items-center gap-6">
            <Bell size={20} className="text-gray-400 hover:text-gray-600 cursor-pointer" />
            <Link to="/post-job" className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium">
              Post New Job
            </Link>
            <div className="flex items-center gap-3 border-l pl-6 border-gray-200">
               <div className="text-right hidden md:block">
                 <p className="text-sm font-bold text-gray-800">Martin Gornan</p>
                 <p className="text-xs text-gray-500">Student Account</p>
               </div>
               <div className="w-10 h-10 bg-gray-200 rounded-full overflow-hidden border-2 border-white shadow-sm">
                 {/* Placeholder Avatar */}
                 <div className="w-full h-full bg-purple-100 flex items-center justify-center text-purple-600 font-bold">MG</div>
               </div>
            </div>
          </div>
        </header>

        <div className="p-8 max-w-7xl mx-auto space-y-8">
          
          {/* Stats Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
             {[
               { label: 'Total Users', val: '193', color: 'bg-purple-100 text-purple-600', icon: User },
               { label: 'Active Jobs', val: '12', color: 'bg-green-100 text-green-600', icon: Briefcase },
               { label: 'Pending', val: '3', color: 'bg-orange-100 text-orange-600', icon: CheckCircle },
               { label: 'Revenue', val: '$1,200', color: 'bg-blue-100 text-blue-600', icon: TrendingUp },
             ].map((stat, i) => (
               <div key={i} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center justify-between">
                 <div>
                   <p className="text-gray-500 text-sm font-medium">{stat.label}</p>
                   <h3 className="text-2xl font-bold text-gray-900 mt-1">{stat.val}</h3>
                 </div>
                 <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${stat.color}`}>
                    <stat.icon size={24} />
                 </div>
               </div>
             ))}
          </div>

          {/* Graph Section (Custom SVG for cleaner look) */}
          <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
            <div className="flex justify-between items-center mb-6">
               <h3 className="font-bold text-gray-800">Website Traffic</h3>
               <button className="text-sm border border-gray-200 rounded-lg px-3 py-1 text-gray-500 hover:bg-gray-50 flex items-center gap-2">
                 Last 7 Days <Filter size={14}/>
               </button>
            </div>
            <div className="h-64 w-full relative">
               {/* Grid Lines */}
               <div className="absolute inset-0 flex flex-col justify-between text-xs text-gray-300">
                  <div className="border-b border-dashed border-gray-100 w-full h-full"></div>
                  <div className="border-b border-dashed border-gray-100 w-full h-full"></div>
                  <div className="border-b border-dashed border-gray-100 w-full h-full"></div>
                  <div className="border-b border-dashed border-gray-100 w-full h-full"></div>
               </div>
               
               {/* The Curve */}
               <svg className="absolute inset-0 w-full h-full" preserveAspectRatio="none">
                 <defs>
                   <linearGradient id="gradient" x1="0" x2="0" y1="0" y2="1">
                     <stop offset="0%" stopColor="#a855f7" stopOpacity="0.4" />
                     <stop offset="100%" stopColor="#a855f7" stopOpacity="0" />
                   </linearGradient>
                 </defs>
                 <path d="M0,200 C150,200 150,100 300,100 C450,100 450,180 600,150 C750,120 750,50 900,50 L900,256 L0,256 Z" fill="url(#gradient)" />
                 <path d="M0,200 C150,200 150,100 300,100 C450,100 450,180 600,150 C750,120 750,50 900,50" fill="none" stroke="#a855f7" strokeWidth="3" strokeLinecap="round" />
               </svg>
            </div>
            <div className="flex justify-between text-xs text-gray-400 mt-4 px-2">
              <span>Mon</span><span>Tue</span><span>Wed</span><span>Thu</span><span>Fri</span><span>Sat</span><span>Sun</span>
            </div>
          </div>

          {/* Table */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="px-8 py-6 border-b border-gray-100 flex justify-between items-center">
              <h3 className="font-bold text-gray-800">Pending Requests</h3>
              <Link to="#" className="text-purple-600 text-sm font-semibold hover:underline">View All</Link>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-gray-50 text-gray-500 text-xs uppercase tracking-wider">
                  <tr>
                    <th className="px-8 py-4 font-semibold">User</th>
                    <th className="px-8 py-4 font-semibold">Action</th>
                    <th className="px-8 py-4 font-semibold">Date</th>
                    <th className="px-8 py-4 font-semibold text-right">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {[1, 2, 3, 4].map((i) => (
                    <tr key={i} className="hover:bg-gray-50/50 transition-colors">
                      <td className="px-8 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-gray-200"></div>
                          <div>
                            <p className="font-semibold text-gray-800 text-sm">John Doe</p>
                            <p className="text-xs text-gray-400">john@example.com</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-8 py-4 text-sm text-gray-600">Updated profile picture</td>
                      <td className="px-8 py-4 text-sm text-gray-500">Oct 24, 2023</td>
                      <td className="px-8 py-4 text-right">
                        <span className="inline-block px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-bold">Complete</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

const JobDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { jobs, applications, addApplication, isLoggedIn } = useAppContext();
  const job = jobs.find(j => j.id === parseInt(id)) || jobs[0];
  
  const userApplication = applications.find(app => app.jobId === job.id);
  const hasApplied = !!userApplication;
  const isApproved = userApplication?.status === 'approved';

  const handleApply = () => {
    // Check if user is logged in
    if (!isLoggedIn) {
      navigate('/login');
      return;
    }

    const newApp = {
      id: Date.now(),
      jobId: job.id,
      jobTitle: job.title,
      company: job.company,
      userName: 'Current User',
      userEmail: 'user@example.com',
      date: new Date().toLocaleDateString(),
      status: 'pending'
    };
    addApplication(newApp);
  };

  return (
    <div className="bg-gray-50 min-h-screen font-sans">
      <Navbar />
      {/* Header with Background */}
      <div className="bg-gradient-to-r from-purple-900 to-blue-700 h-64 w-full relative">
        <div className="absolute inset-0 bg-gradient-to-r from-purple-900 to-purple-900 opacity-90"></div>
      </div>
      
      <div className="max-w-5xl mx-auto px-6 -mt-32 relative z-10 pb-20">
        
        {/* Back Button */}
        <button
          onClick={() => navigate(-1)}
          className="mb-4 flex items-center gap-2 text-white hover:text-blue-200 transition-colors font-semibold"
        >
          <ChevronRight size={20} className="rotate-180" />
          Back
        </button>
        
        {/* Main Job Card Header */}
        <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100 mb-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-6">
            <div className="flex items-center gap-6">
               <div className={`w-20 h-20 ${job.logoColor} rounded-2xl flex items-center justify-center text-white text-3xl font-bold shadow-md`}>
                 {job.company.charAt(0)}
               </div>
               <div>
                  <h1 className="text-3xl font-bold text-gray-900 mb-1">{job.title}</h1>
                  <div className="flex items-center gap-2 text-gray-500 font-medium">
                    <span className="text-purple-600">{job.company}</span>
                    <span>•</span>
                    <span>Posted 2 days ago</span>
                  </div>
               </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-4">
            <button
              onClick={handleApply}
              disabled={hasApplied}
              className="flex-1 bg-gradient-to-r from-purple-600 to-blue-600 text-white px-8 py-3 rounded-xl font-bold hover:shadow-lg shadow-lg shadow-purple-200 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {hasApplied ? 'Already Applied' : isLoggedIn ? 'Apply Now' : 'Login to Apply'}
            </button>
            
            {isApproved ? (
              <Link
                to={`/participate/${job.id}`}
                className="flex-1 bg-green-500 text-white px-8 py-3 rounded-xl font-bold text-center hover:bg-green-600 transition-all"
              >
                Participate
              </Link>
            ) : (
              <button
                disabled
                className="flex-1 bg-gray-200 text-gray-400 px-8 py-3 rounded-xl font-bold cursor-not-allowed"
              >
                Pending
              </button>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Content */}
          <div className="lg:col-span-2 space-y-8">
             <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
                <h3 className="text-xl font-bold text-gray-900 mb-4">Job Description</h3>
                <p className="text-gray-600 leading-relaxed mb-6">
                  {job.description}
                </p>
                
                <h3 className="text-xl font-bold text-gray-900 mb-4">Key Responsibilities</h3>
                <ul className="space-y-3 mb-6">
                  {['Develop unique creative concepts', 'Work with marketing team', 'Ensure final graphics are visually appealing'].map((item, i) => (
                    <li key={i} className="flex items-start gap-3 text-gray-600">
                      <div className="mt-1.5 w-1.5 h-1.5 rounded-full bg-purple-500 shrink-0"></div>
                      {item}
                    </li>
                  ))}
                </ul>

                <h3 className="text-xl font-bold text-gray-900 mb-4">Requirements</h3>
                <ul className="space-y-3">
                  {['Proficiency in Adobe Suite', 'Strong portfolio of illustrations', 'Excellent communication skills'].map((item, i) => (
                    <li key={i} className="flex items-start gap-3 text-gray-600">
                      <div className="mt-1.5 w-1.5 h-1.5 rounded-full bg-purple-500 shrink-0"></div>
                      {item}
                    </li>
                  ))}
                </ul>
             </div>
          </div>

          {/* Right Sidebar */}
          <div className="space-y-6">
             <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                <h4 className="font-bold text-gray-900 mb-6">Job Overview</h4>
                
                <div className="space-y-5">
                   {[
                     { label: 'Salary', val: job.rate, icon: CreditCard },
                     { label: 'Payout Schedule', val: 'Daily payout (processed every 24h)', icon: Wallet },
                     { label: 'Location', val: job.location, icon: MapPin },
                     { label: 'Job Type', val: job.type, icon: Briefcase },
                   ].map((item, i) => (
                     <div key={i} className="flex items-center gap-4">
                       <div className="w-10 h-10 rounded-full bg-purple-50 flex items-center justify-center text-purple-600">
                         <item.icon size={18} />
                       </div>
                       <div>
                         <p className="text-xs text-gray-400 font-bold uppercase tracking-wide">{item.label}</p>
                         <p className="font-semibold text-gray-800">{item.val}</p>
                       </div>
                     </div>
                   ))}
                </div>
             </div>

             <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                <h4 className="font-bold text-gray-900 mb-4">About the Company</h4>
                <p className="text-sm text-gray-500 leading-relaxed mb-4">
                  {job.company} is a leading company helping startups build their brand identity.
                </p>
                <Link to="#" className="text-purple-600 font-semibold text-sm hover:underline">View Company Profile</Link>
             </div>
          </div>
        </div>

      </div>
    </div>
  );
};

// --- AUTH PAGES ---

const Signup = () => {
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [idFront, setIdFront] = useState(null);
  const [idBack, setIdBack] = useState(null);
  const [status, setStatus] = useState('idle'); // idle | success | error
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleFile = (setter) => (e) => {
    setter(e.target.files?.[0] || null);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setStatus('idle');
    setError('');

    if (!form.name || !form.email || !form.password || !idFront || !idBack) {
      setError('Please complete all fields and upload both ID card photos.');
      setStatus('error');
      return;
    }

    // Simulate signup success
    setStatus('success');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50 flex items-center justify-center px-4 py-12">
      <div className="bg-white rounded-2xl shadow-xl border border-gray-100 w-full max-w-2xl p-10">
        <div className="flex items-center gap-3 mb-8">
          <img src="/logo.jpeg" alt="WorkZone" className="h-16" />
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Create your WorkZone account</h1>
            <p className="text-sm text-gray-500">Turn Spare Time into Income</p>
          </div>
        </div>

        <form className="space-y-6" onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Full Name</label>
              <input
                name="name"
                value={form.name}
                onChange={handleChange}
                type="text"
                className="w-full rounded-xl border border-gray-200 p-3 focus:outline-none focus:ring-2 focus:ring-purple-200"
                placeholder="Jane Doe"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Email</label>
              <input
                name="email"
                value={form.email}
                onChange={handleChange}
                type="email"
                className="w-full rounded-xl border border-gray-200 p-3 focus:outline-none focus:ring-2 focus:ring-purple-200"
                placeholder="you@example.com"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Password</label>
            <input
              name="password"
              value={form.password}
              onChange={handleChange}
              type="password"
              className="w-full rounded-xl border border-gray-200 p-3 focus:outline-none focus:ring-2 focus:ring-purple-200"
              placeholder="••••••••"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">ID Card - Front</label>
              <input
                type="file"
                accept="image/*"
                onChange={handleFile(setIdFront)}
                className="w-full text-sm"
              />
              {idFront && <p className="text-xs text-gray-500 mt-1">Selected: {idFront.name}</p>}
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">ID Card - Back</label>
              <input
                type="file"
                accept="image/*"
                onChange={handleFile(setIdBack)}
                className="w-full text-sm"
              />
              {idBack && <p className="text-xs text-gray-500 mt-1">Selected: {idBack.name}</p>}
            </div>
          </div>

          {error && <div className="text-sm text-red-600 bg-red-50 border border-red-100 rounded-lg p-3">{error}</div>}
          {status === 'success' && <div className="text-sm text-green-600 bg-green-50 border border-green-100 rounded-lg p-3">Signed up! You can now log in.</div>}

          <button
            type="submit"
            className="w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white py-3 rounded-xl font-bold shadow-lg shadow-purple-200 hover:shadow-xl transition-all disabled:opacity-70"
          >
            Create Account
          </button>
        </form>

        <p className="text-sm text-gray-500 mt-6 text-center">
          Already have an account? <Link to="/login" className="text-purple-600 font-semibold hover:underline">Log in</Link>
        </p>
      </div>
    </div>
  );
};

const LoginPage = () => {
  const navigate = useNavigate();
  const { login } = useAppContext();
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [status, setStatus] = useState('idle');

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    setStatus('idle');

    if (!form.email || !form.password) {
      setError('Please enter email and password.');
      setStatus('error');
      return;
    }

    // Check if company credentials
    if (form.email === COMPANY_CREDENTIALS.email && form.password === COMPANY_CREDENTIALS.password) {
      login(COMPANY_CREDENTIALS.companyName, true, COMPANY_CREDENTIALS.companyId);
      setStatus('success');
      setTimeout(() => {
        console.log('Redirecting company to /company-dashboard');
        navigate('/company-dashboard');
      }, 1000);
    } else {
      // Regular user login (simplified for demo)
      login(form.email, false, 'user1');
      setStatus('success');
      setTimeout(() => {
        console.log('Redirecting user to home page /');
        navigate('/');
      }, 1000);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4 py-12">
      <div className="bg-white rounded-2xl shadow-xl border border-gray-100 w-full max-w-md p-8">
        <div className="flex items-center gap-3 mb-6">
          <img src="/logo.jpeg" alt="WorkZone" className="h-14" />
          <div>
            <h1 className="text-xl font-bold text-gray-900">Welcome back</h1>
            <p className="text-sm text-gray-500">Log in to continue</p>
          </div>
        </div>

        <form className="space-y-5" onSubmit={handleSubmit}>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Email</label>
            <input
              name="email"
              value={form.email}
              onChange={handleChange}
              type="email"
              className="w-full rounded-xl border border-gray-200 p-3 focus:outline-none focus:ring-2 focus:ring-purple-200"
              placeholder="you@example.com"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Password</label>
            <input
              name="password"
              value={form.password}
              onChange={handleChange}
              type="password"
              className="w-full rounded-xl border border-gray-200 p-3 focus:outline-none focus:ring-2 focus:ring-purple-200"
              placeholder="••••••••"
            />
          </div>

          {error && <div className="text-sm text-red-600 bg-red-50 border border-red-100 rounded-lg p-3">{error}</div>}
          {status === 'success' && <div className="text-sm text-green-600 bg-green-50 border border-green-100 rounded-lg p-3">Logged in! (demo state)</div>}

          <button
            type="submit"
            className="w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white py-3 rounded-xl font-bold shadow-lg shadow-purple-200 hover:shadow-xl transition-all"
          >
            Log In
          </button>
        </form>

        <p className="text-sm text-gray-500 mt-6 text-center">
          New to WorkZone? <Link to="/signup" className="text-purple-600 font-semibold hover:underline">Create an account</Link>
        </p>
      </div>
    </div>
  );
};

// --- APP ROUTER WITH STATE MANAGEMENT ---

function AppProvider({ children }) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isCompany, setIsCompany] = useState(false);
  const [currentUser, setCurrentUser] = useState('');
  const [currentUserId, setCurrentUserId] = useState('');
  
  const [jobs, setJobs] = useState(INITIAL_JOBS);
  const [applications, setApplications] = useState([]);
  const [pendingPayments, setPendingPayments] = useState([]);
  const [completedTransactions, setCompletedTransactions] = useState([]);
  const [userWallet, setUserWallet] = useState(0);
  const [companyWallet, setCompanyWallet] = useState(10000);
  const [pendingMoney, setPendingMoney] = useState(0);

  const login = (userName, isCompanyUser, userId) => {
    setIsLoggedIn(true);
    setIsCompany(isCompanyUser);
    setCurrentUser(userName);
    setCurrentUserId(userId);
  };

  const logout = () => {
    setIsLoggedIn(false);
    setIsCompany(false);
    setCurrentUser('');
    setCurrentUserId('');
  };

  const postJob = (jobData) => {
    const newJob = {
      ...jobData,
      id: Date.now(),
      postedBy: currentUserId,
      logoColor: ['bg-orange-500', 'bg-blue-600', 'bg-green-500', 'bg-pink-500', 'bg-purple-500'][Math.floor(Math.random() * 5)]
    };
    setJobs(prev => [...prev, newJob]);
    return newJob;
  };

  const addApplication = (app) => {
    setApplications(prev => [...prev, app]);
  };

  const approveApplication = (appId) => {
    setApplications(prev =>
      prev.map(app => app.id === appId ? { ...app, status: 'approved' } : app)
    );
  };

  const addPendingPayment = (payment) => {
    setPendingPayments(prev => [...prev, payment]);
    setPendingMoney(prev => prev + payment.amount);
  };

  const transferPayment = (paymentId) => {
    const payment = pendingPayments.find(p => p.id === paymentId);
    if (payment) {
      // Remove from pending
      setPendingPayments(prev => prev.filter(p => p.id !== paymentId));
      setPendingMoney(prev => prev - payment.amount);
      // Add to user wallet
      setUserWallet(prev => prev + payment.amount);
      // Deduct from company wallet
      setCompanyWallet(prev => prev - payment.amount);
      // Add to completed transactions
      setCompletedTransactions(prev => [{
        ...payment,
        completedAt: new Date().toLocaleDateString(),
        transactionId: Date.now()
      }, ...prev]);
    }
  };

  const value = {
    isLoggedIn,
    isCompany,
    currentUser,
    currentUserId,
    login,
    logout,
    jobs,
    postJob,
    applications,
    pendingPayments,
    completedTransactions,
    userWallet,
    companyWallet,
    pendingMoney,
    addApplication,
    approveApplication,
    addPendingPayment,
    transferPayment
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

// Participate Page
const ParticipatePage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { jobs } = useAppContext();
  const job = jobs.find(j => j.id === parseInt(id));
  const [done, setDone] = useState(false);

  const handleDone = () => {
    setDone(true);
    setTimeout(() => navigate(`/card-details/${id}`), 500);
  };

  if (!job) return <div>Job not found</div>;

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-3xl mx-auto">
        {/* Back Button */}
        <button
          onClick={() => navigate(-1)}
          className="mb-4 flex items-center gap-2 text-gray-600 hover:text-purple-600 transition-colors font-semibold"
        >
          <ChevronRight size={20} className="rotate-180" />
          Back
        </button>
        
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-10">
          <div className="text-center mb-8">
            <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Work Receipt</h1>
            <p className="text-gray-500">Complete your work and submit</p>
          </div>

          <div className="space-y-6 mb-8">
            <div className="bg-purple-50 border border-purple-100 rounded-xl p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-2">{job.title}</h2>
              <p className="text-gray-600">{job.company}</p>
            </div>

            <div>
              <h3 className="font-bold text-gray-900 mb-3">Job Description</h3>
              <p className="text-gray-600 leading-relaxed">{job.description}</p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="bg-gray-50 rounded-lg p-4">
                <p className="text-xs text-gray-400 uppercase font-bold mb-1">Rate</p>
                <p className="text-lg font-bold text-gray-900">{job.rate}</p>
              </div>
              <div className="bg-gray-50 rounded-lg p-4">
                <p className="text-xs text-gray-400 uppercase font-bold mb-1">Payout Schedule</p>
                <p className="text-sm font-semibold text-green-600">Daily payout (processed every 24h)</p>
              </div>
            </div>
          </div>

          <button
            onClick={handleDone}
            disabled={done}
            className="w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white py-4 rounded-xl font-bold shadow-lg hover:shadow-xl transition-all disabled:opacity-50"
          >
            {done ? 'Proceeding...' : 'Mark as Done'}
          </button>
        </div>
      </div>
    </div>
  );
};

// Card Details Page
const CardDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { jobs, addPendingPayment } = useAppContext();
  const [cardDetails, setCardDetails] = useState({
    cardNumber: '',
    cardName: '',
    expiry: '',
    cvv: ''
  });
  const [showPopup, setShowPopup] = useState(false);

  const job = jobs.find(j => j.id === parseInt(id));

  const handleChange = (e) => {
    setCardDetails({ ...cardDetails, [e.target.name]: e.target.value });
  };

  const handleRequestMoney = () => {
    if (!cardDetails.cardNumber || !cardDetails.cardName || !cardDetails.expiry || !cardDetails.cvv) {
      alert('Please fill all card details');
      return;
    }

    const newPayment = {
      id: Date.now(),
      jobId: parseInt(id),
      jobTitle: job.title,
      userName: 'Current User',
      userEmail: 'user@example.com',
      amount: job.amount,
      cardDetails: cardDetails,
      status: 'pending'
    };

    addPendingPayment(newPayment);
    setShowPopup(true);

    setTimeout(() => {
      navigate('/user-dashboard');
    }, 2500);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Back Button */}
        <button
          onClick={() => navigate(-1)}
          className="mb-4 flex items-center gap-2 text-gray-600 hover:text-purple-600 transition-colors font-semibold"
        >
          <ChevronRight size={20} className="rotate-180" />
          Back
        </button>
        
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-10">
          <div className="flex items-center gap-3 mb-8">
            <CreditCard className="w-8 h-8 text-purple-600" />
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Payment Details</h1>
              <p className="text-sm text-gray-500">Add your card details for payment</p>
            </div>
          </div>

          <div className="bg-purple-50 rounded-xl p-4 mb-8">
            <p className="text-sm text-gray-600 mb-1">Payout Schedule</p>
            <p className="text-base font-semibold text-purple-600">Payments are processed daily once work submissions are approved.</p>
          </div>

          <div className="space-y-5 mb-8">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Card Number</label>
              <input
                name="cardNumber"
                value={cardDetails.cardNumber}
                onChange={handleChange}
                type="text"
                maxLength="16"
                placeholder="1234 5678 9012 3456"
                className="w-full rounded-xl border border-gray-200 p-3 focus:outline-none focus:ring-2 focus:ring-purple-200"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Cardholder Name</label>
              <input
                name="cardName"
                value={cardDetails.cardName}
                onChange={handleChange}
                type="text"
                placeholder="John Doe"
                className="w-full rounded-xl border border-gray-200 p-3 focus:outline-none focus:ring-2 focus:ring-purple-200"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Expiry Date</label>
                <input
                  name="expiry"
                  value={cardDetails.expiry}
                  onChange={handleChange}
                  type="text"
                  placeholder="MM/YY"
                  maxLength="5"
                  className="w-full rounded-xl border border-gray-200 p-3 focus:outline-none focus:ring-2 focus:ring-purple-200"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">CVV</label>
                <input
                  name="cvv"
                  value={cardDetails.cvv}
                  onChange={handleChange}
                  type="text"
                  maxLength="3"
                  placeholder="123"
                  className="w-full rounded-xl border border-gray-200 p-3 focus:outline-none focus:ring-2 focus:ring-purple-200"
                />
              </div>
            </div>
          </div>

          <button
            onClick={handleRequestMoney}
            className="w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white py-4 rounded-xl font-bold shadow-lg hover:shadow-xl transition-all"
          >
            Request Money
          </button>
        </div>
      </div>

      {showPopup && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-8 max-w-md mx-4 text-center">
            <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Request Submitted!</h2>
            <p className="text-gray-600">Your money will be returned soon</p>
          </div>
        </div>
      )}
    </div>
  );
};

// Company Dashboard
const CompanyDashboard = () => {
  const navigate = useNavigate();
  const {
    isLoggedIn,
    isCompany,
    currentUserId,
    jobs,
    applications,
    pendingPayments,
    completedTransactions,
    companyWallet,
    approveApplication,
    transferPayment,
    postJob
  } = useAppContext();

  // Guard: only company users
  if (!isLoggedIn || !isCompany) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="bg-white rounded-2xl shadow-lg p-8 text-center max-w-md">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Access Denied</h2>
          <p className="text-gray-600 mb-6">You must be logged in as a company to access this page.</p>
          <button
            onClick={() => navigate('/login')}
            className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-6 py-3 rounded-xl font-bold"
          >
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  const [activePanel, setActivePanel] = useState('requests'); // post | current | pending | requests | history | profile
  const [jobForm, setJobForm] = useState({
    title: '',
    company: '',
    location: '',
    rate: '',
    amount: '',
    type: 'Full-Time',
    tags: '',
    description: ''
  });
  const [profileForm, setProfileForm] = useState({
    companyName: 'Creative Pixel Studios',
    contactEmail: 'company@workzone.com',
    about: ''
  });
  const [pwdForm, setPwdForm] = useState({ current: '', next: '', confirm: '' });
  const [pwdError, setPwdError] = useState('');
  const companyJobs = jobs.filter(job => job.postedBy === currentUserId);

  const modules = [
    { key: 'post', label: 'Post New Job', icon: Briefcase, color: 'from-purple-600 to-blue-600' },
    { key: 'current', label: 'Current Jobs', icon: LayoutDashboard, color: 'from-blue-600 to-cyan-500' },
    { key: 'pending', label: 'Pending Transactions', icon: CreditCard, color: 'from-orange-500 to-red-500' },
    { key: 'requests', label: 'Job Requests', icon: FileText, color: 'from-green-600 to-emerald-500' },
    { key: 'history', label: 'Transaction History', icon: Wallet, color: 'from-slate-600 to-gray-800' },
    { key: 'profile', label: 'Profile Settings', icon: Settings, color: 'from-pink-600 to-fuchsia-600' },
  ];

  const handleJobFormChange = (e) => {
    setJobForm({ ...jobForm, [e.target.name]: e.target.value });
  };

  const handlePostJob = (e) => {
    e.preventDefault();
    if (!jobForm.title || !jobForm.company || !jobForm.location || !jobForm.rate || !jobForm.amount || !jobForm.description) {
      alert('Please fill all required fields');
      return;
    }
    postJob({
      ...jobForm,
      amount: parseFloat(jobForm.amount),
      tags: jobForm.tags.split(',').map(t => t.trim()).filter(Boolean)
    });
    setJobForm({ title: '', company: '', location: '', rate: '', amount: '', type: 'Full-Time', tags: '', description: '' });
    setActivePanel('current');
    alert('Job posted successfully!');
  };

  const handleProfileSubmit = (e) => {
    e.preventDefault();
    setPwdError('');
    // Basic profile validation
    if (!profileForm.companyName || !profileForm.contactEmail) {
      setPwdError('Please fill company name and contact email.');
      return;
    }
    // If any password field is filled, require all and validate
    const anyPwd = pwdForm.current || pwdForm.next || pwdForm.confirm;
    if (anyPwd) {
      if (!pwdForm.current || !pwdForm.next || !pwdForm.confirm) {
        setPwdError('Please fill all password fields.');
        return;
      }
      if (pwdForm.next.length < 6) {
        setPwdError('New password must be at least 6 characters.');
        return;
      }
      if (pwdForm.next !== pwdForm.confirm) {
        setPwdError('New password and confirm password do not match.');
        return;
      }
    }
    // Demo-only: in a real app, call backend to save changes and update password if provided.
    alert('Changes saved successfully!');
    if (anyPwd) setPwdForm({ current: '', next: '', confirm: '' });
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Back Button */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-gray-600 hover:text-purple-600 transition-colors font-semibold"
        >
          <ChevronRight size={20} className="rotate-180" />
          Back to Home
        </button>
        
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Company Dashboard</h1>
            <p className="text-gray-500">Manage applications, jobs, and payments</p>
          </div>
          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
            <p className="text-xs text-gray-400 uppercase font-bold mb-1">Wallet Balance</p>
            <p className="text-2xl font-bold text-gray-900 flex items-center gap-2">
              <Wallet className="w-5 h-5 text-purple-600" />
              ${companyWallet}
            </p>
          </div>
        </div>

        {/* Module Tiles */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {modules.map(m => (
            <button
              key={m.key}
              onClick={() => setActivePanel(m.key)}
              className={`group text-left bg-white border border-gray-100 rounded-2xl p-6 shadow-sm hover:shadow-lg transition-all ${activePanel === m.key ? 'ring-2 ring-purple-300' : ''}`}
            >
              <div className={`w-12 h-12 rounded-xl bg-gradient-to-r ${m.color} text-white flex items-center justify-center mb-4 shadow-sm`}>
                <m.icon size={22} />
              </div>
              <h3 className="font-bold text-gray-900 mb-2">{m.label}</h3>
              <p className="text-sm text-gray-500">Click to view</p>
            </button>
          ))}
        </div>

        {/* Active Panel Content */}
        {activePanel === 'post' && (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="px-8 py-6 border-b border-gray-100">
              <h3 className="font-bold text-gray-800 text-lg">Post New Job</h3>
            </div>
            <form onSubmit={handlePostJob} className="px-8 py-6 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Job Title *</label>
                  <input name="title" value={jobForm.title} onChange={handleJobFormChange} className="w-full rounded-xl border border-gray-200 p-3 focus:outline-none focus:ring-2 focus:ring-purple-200" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Company Name *</label>
                  <input name="company" value={jobForm.company} onChange={handleJobFormChange} className="w-full rounded-xl border border-gray-200 p-3 focus:outline-none focus:ring-2 focus:ring-purple-200" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Location *</label>
                  <input name="location" value={jobForm.location} onChange={handleJobFormChange} className="w-full rounded-xl border border-gray-200 p-3 focus:outline-none focus:ring-2 focus:ring-purple-200" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Rate *</label>
                  <input name="rate" value={jobForm.rate} onChange={handleJobFormChange} className="w-full rounded-xl border border-gray-200 p-3 focus:outline-none focus:ring-2 focus:ring-purple-200" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Payout Schedule *</label>
                  <input
                    name="amount"
                    value={jobForm.amount}
                    onChange={handleJobFormChange}
                    type="text"
                    placeholder="Daily payout (processed every 24h)"
                    className="w-full rounded-xl border border-gray-200 p-3 focus:outline-none focus:ring-2 focus:ring-purple-200"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Job Type</label>
                  <select name="type" value={jobForm.type} onChange={handleJobFormChange} className="w-full rounded-xl border border-gray-200 p-3 focus:outline-none focus:ring-2 focus:ring-purple-200">
                    <option>Full-Time</option>
                    <option>Part-Time</option>
                    <option>Contract</option>
                    <option>Freelance</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Tags (comma separated)</label>
                <input name="tags" value={jobForm.tags} onChange={handleJobFormChange} className="w-full rounded-xl border border-gray-200 p-3 focus:outline-none focus:ring-2 focus:ring-purple-200" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Description *</label>
                <textarea name="description" value={jobForm.description} onChange={handleJobFormChange} rows="4" className="w-full rounded-xl border border-gray-200 p-3 focus:outline-none focus:ring-2 focus:ring-purple-200" />
              </div>
              <button type="submit" className="w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white py-3 rounded-xl font-bold shadow-lg hover:shadow-xl transition-all">Post Job</button>
            </form>
          </div>
        )}

        {activePanel === 'current' && (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="px-8 py-6 border-b border-gray-100">
              <h3 className="font-bold text-gray-800 text-lg">Current Jobs ({companyJobs.length})</h3>
            </div>
            <div className="p-6">
              {companyJobs.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {companyJobs.map(job => (
                    <div key={job.id} className="border border-gray-200 rounded-xl p-4 hover:border-purple-300 transition-all">
                      <h4 className="font-bold text-gray-900 mb-2">{job.title}</h4>
                      <p className="text-sm text-gray-600 mb-3">{job.location}</p>
                      <div className="flex flex-col text-sm text-gray-600">
                        <span>{job.rate}</span>
                        <span className="font-semibold text-green-600">Daily payout (processed every 24h)</span>
                      </div>
                      <div className="mt-3 pt-3 border-t border-gray-100">
                        <span className="text-xs bg-purple-100 text-purple-700 px-2 py-1 rounded-full font-semibold">{job.type}</span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 text-gray-400">No jobs posted yet</div>
              )}
            </div>
          </div>
        )}

        {activePanel === 'requests' && (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="px-8 py-6 border-b border-gray-100">
              <h3 className="font-bold text-gray-800 text-lg">Job Requests</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-gray-50 text-gray-500 text-xs uppercase">
                  <tr>
                    <th className="px-8 py-4">User</th>
                    <th className="px-8 py-4">Job Title</th>
                    <th className="px-8 py-4">Date</th>
                    <th className="px-8 py-4 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {applications.filter(a => a.status === 'pending').map(app => (
                    <tr key={app.id}>
                      <td className="px-8 py-4">
                        <p className="font-semibold">{app.userName}</p>
                        <p className="text-xs text-gray-400">{app.userEmail}</p>
                      </td>
                      <td className="px-8 py-4">{app.jobTitle}</td>
                      <td className="px-8 py-4 text-sm text-gray-500">{app.date}</td>
                      <td className="px-8 py-4 text-right">
                        <button onClick={() => approveApplication(app.id)} className="bg-green-500 text-white px-4 py-2 rounded-lg font-semibold hover:bg-green-600">Approve</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {applications.filter(a => a.status === 'pending').length === 0 && (
                <div className="text-center py-12 text-gray-400">No pending requests</div>
              )}
            </div>
          </div>
        )}

        {activePanel === 'pending' && (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="px-8 py-6 border-b border-gray-100">
              <h3 className="font-bold text-gray-800 text-lg">Pending Transactions</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-gray-50 text-gray-500 text-xs uppercase">
                  <tr>
                    <th className="px-8 py-4">User</th>
                    <th className="px-8 py-4">Job</th>
                    <th className="px-8 py-4">Payout Schedule</th>
                    <th className="px-8 py-4 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {pendingPayments.map(payment => (
                    <tr key={payment.id}>
                      <td className="px-8 py-4">
                        <p className="font-semibold">{payment.userName}</p>
                        <p className="text-xs text-gray-400">{payment.userEmail}</p>
                      </td>
                      <td className="px-8 py-4">{payment.jobTitle}</td>
                      <td className="px-8 py-4"><span className="text-sm font-semibold text-gray-600">Daily payout schedule</span></td>
                      <td className="px-8 py-4 text-right">
                        <button onClick={() => transferPayment(payment.id)} className="bg-purple-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-purple-700">Transfer</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {pendingPayments.length === 0 && (
                <div className="text-center py-12 text-gray-400">No pending transactions</div>
              )}
            </div>
          </div>
        )}

        {activePanel === 'history' && (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="px-8 py-6 border-b border-gray-100">
              <h3 className="font-bold text-gray-800 text-lg">Previous Transactions</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-gray-50 text-gray-500 text-xs uppercase">
                  <tr>
                    <th className="px-8 py-4">User</th>
                    <th className="px-8 py-4">Job</th>
                    <th className="px-8 py-4">Amount</th>
                    <th className="px-8 py-4">Date</th>
                    <th className="px-8 py-4 text-right">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {completedTransactions.map(transaction => (
                    <tr key={transaction.transactionId}>
                      <td className="px-8 py-4">
                        <p className="font-semibold">{transaction.userName}</p>
                        <p className="text-xs text-gray-400">{transaction.userEmail}</p>
                      </td>
                      <td className="px-8 py-4">{transaction.jobTitle}</td>
                      <td className="px-8 py-4"><span className="text-lg font-bold text-gray-700">${transaction.amount}</span></td>
                      <td className="px-8 py-4 text-sm text-gray-500">{transaction.completedAt}</td>
                      <td className="px-8 py-4 text-right">
                        <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-bold">Completed</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {completedTransactions.length === 0 && (
                <div className="text-center py-12 text-gray-400">No previous transactions</div>
              )}
            </div>
          </div>
        )}

        {activePanel === 'profile' && (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="px-8 py-6 border-b border-gray-100">
              <h3 className="font-bold text-gray-800 text-lg">Profile Settings</h3>
            </div>
            <form onSubmit={handleProfileSubmit} className="px-8 py-6 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Company Name</label>
                  <input
                    value={profileForm.companyName}
                    onChange={(e) => setProfileForm({ ...profileForm, companyName: e.target.value })}
                    className="w-full rounded-xl border border-gray-200 p-3 focus:outline-none focus:ring-2 focus:ring-purple-200"
                    placeholder="Your company name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Contact Email</label>
                  <input
                    value={profileForm.contactEmail}
                    onChange={(e) => setProfileForm({ ...profileForm, contactEmail: e.target.value })}
                    className="w-full rounded-xl border border-gray-200 p-3 focus:outline-none focus:ring-2 focus:ring-purple-200"
                    placeholder="company@domain.com"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">About</label>
                <textarea
                  rows="4"
                  value={profileForm.about}
                  onChange={(e) => setProfileForm({ ...profileForm, about: e.target.value })}
                  placeholder="Short description about your company"
                  className="w-full rounded-xl border border-gray-200 p-3 focus:outline-none focus:ring-2 focus:ring-purple-200"
                />
              </div>

              <div className="pt-6 border-t border-gray-100">
                <h4 className="font-bold text-gray-900 mb-4">Change Password (optional)</h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Current Password</label>
                    <input
                      type="password"
                      value={pwdForm.current}
                      onChange={(e) => setPwdForm({ ...pwdForm, current: e.target.value })}
                      className="w-full rounded-xl border border-gray-200 p-3 focus:outline-none focus:ring-2 focus:ring-purple-200"
                      placeholder="••••••••"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">New Password</label>
                    <input
                      type="password"
                      value={pwdForm.next}
                      onChange={(e) => setPwdForm({ ...pwdForm, next: e.target.value })}
                      className="w-full rounded-xl border border-gray-200 p-3 focus:outline-none focus:ring-2 focus:ring-purple-200"
                      placeholder="••••••••"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Confirm New Password</label>
                    <input
                      type="password"
                      value={pwdForm.confirm}
                      onChange={(e) => setPwdForm({ ...pwdForm, confirm: e.target.value })}
                      className="w-full rounded-xl border border-gray-200 p-3 focus:outline-none focus:ring-2 focus:ring-purple-200"
                      placeholder="••••••••"
                    />
                  </div>
                </div>
                {pwdError && (
                  <div className="text-sm text-red-600 bg-red-50 border border-red-100 rounded-lg p-3 mt-3">{pwdError}</div>
                )}
              </div>

              <button type="submit" className="w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white px-6 py-3 rounded-xl font-bold">Save Changes</button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};

// User Dashboard
const UserDashboard = () => {
  const { applications, userWallet, pendingMoney } = useAppContext();
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Back Button */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-gray-600 hover:text-purple-600 transition-colors font-semibold"
        >
          <ChevronRight size={20} className="rotate-180" />
          Back to Home
        </button>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-gradient-to-br from-purple-600 to-blue-600 rounded-2xl p-6 text-white shadow-lg">
            <div className="flex items-center gap-3 mb-4">
              <Wallet className="w-8 h-8" />
              <h3 className="text-lg font-bold">My Wallet</h3>
            </div>
            <p className="text-4xl font-bold">${userWallet}</p>
            <p className="text-sm opacity-80 mt-2">Available Balance</p>
          </div>

          <div className="bg-white rounded-2xl p-6 border shadow-sm">
            <div className="flex items-center gap-3 mb-4">
              <Clock className="w-8 h-8 text-orange-500" />
              <h3 className="text-lg font-bold text-gray-900">Pending Money</h3>
            </div>
            <p className="text-4xl font-bold text-orange-500">${pendingMoney}</p>
            <p className="text-sm text-gray-500 mt-2">Awaiting Transfer</p>
          </div>

          <div className="bg-white rounded-2xl p-6 border shadow-sm">
            <div className="flex items-center gap-3 mb-4">
              <Briefcase className="w-8 h-8 text-green-500" />
              <h3 className="text-lg font-bold text-gray-900">Active Jobs</h3>
            </div>
            <p className="text-4xl font-bold text-green-500">{applications.filter(a => a.status === 'approved').length}</p>
            <p className="text-sm text-gray-500 mt-2">Currently Working</p>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border overflow-hidden">
          <div className="px-8 py-6 border-b">
            <h3 className="font-bold text-gray-800 text-lg">My Applications</h3>
          </div>
          <table className="w-full text-left">
            <thead className="bg-gray-50 text-gray-500 text-xs uppercase">
              <tr>
                <th className="px-8 py-4">Job</th>
                <th className="px-8 py-4">Company</th>
                <th className="px-8 py-4">Status</th>
                <th className="px-8 py-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {applications.map(app => (
                <tr key={app.id}>
                  <td className="px-8 py-4 font-semibold">{app.jobTitle}</td>
                  <td className="px-8 py-4 text-gray-600">{app.company}</td>
                  <td className="px-8 py-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                      app.status === 'approved' ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-orange-700'
                    }`}>
                      {app.status}
                    </span>
                  </td>
                  <td className="px-8 py-4 text-right">
                    {app.status === 'approved' && (
                      <Link
                        to={`/participate/${app.jobId}`}
                        className="bg-purple-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-purple-700 inline-block"
                      >
                        Participate
                      </Link>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

// About Us Page
const AboutUs = () => {
  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-2xl shadow-sm border p-8 md:p-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">About WorkZone</h1>
          
          <div className="prose prose-lg max-w-none space-y-6 text-gray-700">
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Our Mission</h2>
              <p>
                WorkZone is dedicated to turning spare time into income. We believe that everyone has valuable skills 
                and time to share. Our platform connects talented freelancers, part-time workers, and professionals with 
                companies seeking their expertise, creating flexible work opportunities across Sri Lanka.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Why Choose WorkZone?</h2>
              <ul className="space-y-3 list-disc list-inside">
                <li>🎯 <strong>Flexible Opportunities:</strong> Work on your own schedule, from graphic design to tutoring</li>
                <li>💰 <strong>Fair Compensation:</strong> Competitive rates in LKR with transparent pricing</li>
                <li>🛡️ <strong>Secure Transactions:</strong> Safe payment processing and transaction tracking</li>
                <li>👥 <strong>Local Focus:</strong> Supporting Sri Lankan businesses and workers</li>
                <li>🚀 <strong>Growth:</strong> Build your professional network and portfolio</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Our Story</h2>
              <p>
                Founded in 2024, WorkZone emerged from a simple idea: make freelance and part-time work accessible to everyone. 
                We started with a small group of professionals across Sri Lanka who wanted to showcase their talents while maintaining 
                flexibility. Today, we're proud to serve hundreds of workers and dozens of companies across the island.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Our Values</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-gradient-to-br from-purple-50 to-blue-50 p-6 rounded-xl">
                  <h3 className="font-bold text-purple-900 mb-2">Transparency</h3>
                  <p className="text-sm text-gray-700">Clear terms, no hidden fees, honest communication</p>
                </div>
                <div className="bg-gradient-to-br from-blue-50 to-green-50 p-6 rounded-xl">
                  <h3 className="font-bold text-blue-900 mb-2">Reliability</h3>
                  <p className="text-sm text-gray-700">Secure payments, trusted platform, consistent service</p>
                </div>
                <div className="bg-gradient-to-br from-green-50 to-pink-50 p-6 rounded-xl">
                  <h3 className="font-bold text-green-900 mb-2">Empowerment</h3>
                  <p className="text-sm text-gray-700">Enable talent, support growth, create opportunities</p>
                </div>
                <div className="bg-gradient-to-br from-pink-50 to-purple-50 p-6 rounded-xl">
                  <h3 className="font-bold text-pink-900 mb-2">Community</h3>
                  <p className="text-sm text-gray-700">Local first, connected, collaborative ecosystem</p>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Contact Us</h2>
              <p className="mb-4">
                Have questions about WorkZone? We'd love to hear from you!
              </p>
              <Link 
                to="/contact"
                className="inline-block bg-gradient-to-r from-purple-600 to-blue-600 text-white px-8 py-3 rounded-xl font-bold hover:shadow-lg transition-all"
              >
                Get In Touch
              </Link>
            </section>
          </div>
        </div>
      </div>
    </div>
    </>
  );
};

// Contact Us Page
const ContactUs = () => {
  const [formData, setFormData] = useState({ name: '', email: '', subject: '', message: '' });
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 3000);
    setFormData({ name: '', email: '', subject: '', message: '' });
  };

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-2 text-center">Contact Us</h1>
        <p className="text-center text-gray-600 mb-12">We're here to help. Reach out with any questions or concerns.</p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          <div className="bg-white rounded-2xl shadow-sm border p-6 text-center">
            <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <FileText className="text-purple-600" size={24} />
            </div>
            <h3 className="font-bold text-gray-900 mb-2">Email</h3>
            <p className="text-gray-600">support@workzone.lk</p>
            <p className="text-sm text-gray-500 mt-2">We respond within 24 hours</p>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border p-6 text-center">
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Briefcase className="text-blue-600" size={24} />
            </div>
            <h3 className="font-bold text-gray-900 mb-2">Office</h3>
            <p className="text-gray-600">Colombo, Sri Lanka</p>
            <p className="text-sm text-gray-500 mt-2">Central island location</p>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border p-6 text-center">
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Bell className="text-green-600" size={24} />
            </div>
            <h3 className="font-bold text-gray-900 mb-2">Phone</h3>
            <p className="text-gray-600">+94 (0) 701 234 567</p>
            <p className="text-sm text-gray-500 mt-2">Monday to Friday, 9 AM to 6 PM</p>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border p-8 md:p-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Send us a Message</h2>
          
          {submitted && (
            <div className="bg-green-50 border border-green-200 text-green-800 px-6 py-4 rounded-lg mb-6 flex items-center gap-2">
              <CheckCircle size={20} />
              <span>Thank you! We'll get back to you soon.</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-bold text-gray-900 mb-2">Name</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:border-purple-600"
                  placeholder="Your name"
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-900 mb-2">Email</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:border-purple-600"
                  placeholder="your@email.com"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-900 mb-2">Subject</label>
              <input
                type="text"
                name="subject"
                value={formData.subject}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:border-purple-600"
                placeholder="How can we help?"
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-900 mb-2">Message</label>
              <textarea
                name="message"
                value={formData.message}
                onChange={handleChange}
                required
                rows="6"
                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:border-purple-600 resize-none"
                placeholder="Tell us what's on your mind..."
              />
            </div>

            <button
              type="submit"
              className="w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white px-6 py-3 rounded-xl font-bold hover:shadow-lg transition-all"
            >
              Send Message
            </button>
          </form>
        </div>
      </div>
    </div>
    </>
  );
};

// Feedback Page
const FeedbackPage = () => {
  const [feedbackData, setFeedbackData] = useState({ rating: 5, category: 'general', feedback: '' });
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFeedbackData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 3000);
    setFeedbackData({ rating: 5, category: 'general', feedback: '' });
  };

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-2 text-center">Your Feedback Matters</h1>
        <p className="text-center text-gray-600 mb-12">Help us improve WorkZone by sharing your thoughts and experiences</p>

        <div className="bg-white rounded-2xl shadow-sm border p-8 md:p-12">
          {submitted && (
            <div className="bg-green-50 border border-green-200 text-green-800 px-6 py-4 rounded-lg mb-6 flex items-center gap-2">
              <CheckCircle size={20} />
              <span>Thank you for your valuable feedback!</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-bold text-gray-900 mb-4">How would you rate your experience?</label>
              <div className="flex gap-2">
                {[1, 2, 3, 4, 5].map(num => (
                  <button
                    key={num}
                    type="button"
                    onClick={() => setFeedbackData(prev => ({ ...prev, rating: num }))}
                    className={`w-12 h-12 rounded-lg font-bold text-lg transition-all ${
                      feedbackData.rating === num
                        ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    {num}
                  </button>
                ))}
              </div>
              <p className="text-xs text-gray-500 mt-2">1 = Poor, 5 = Excellent</p>
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-900 mb-2">Category</label>
              <select
                name="category"
                value={feedbackData.category}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:border-purple-600"
              >
                <option value="general">General Feedback</option>
                <option value="features">Feature Request</option>
                <option value="bug">Bug Report</option>
                <option value="payment">Payment & Wallet</option>
                <option value="support">Customer Support</option>
                <option value="other">Other</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-900 mb-2">Your Feedback</label>
              <textarea
                name="feedback"
                value={feedbackData.feedback}
                onChange={handleChange}
                required
                rows="6"
                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:border-purple-600 resize-none"
                placeholder="Tell us what you think... What could we improve?"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white px-6 py-3 rounded-xl font-bold hover:shadow-lg transition-all"
            >
              Submit Feedback
            </button>
          </form>

          <div className="mt-12 pt-8 border-t">
            <h3 className="font-bold text-gray-900 mb-4">Why Your Feedback Matters</h3>
            <ul className="space-y-3 text-gray-700">
              <li className="flex items-start gap-3">
                <CheckCircle size={20} className="text-green-600 mt-0.5 flex-shrink-0" />
                <span>We use your feedback to make continuous improvements</span>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle size={20} className="text-green-600 mt-0.5 flex-shrink-0" />
                <span>Your voice helps shape the future of WorkZone</span>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle size={20} className="text-green-600 mt-0.5 flex-shrink-0" />
                <span>We respond to feature requests and bug reports promptly</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
    </>
  );
};

// Terms & Policies Page
const TermsAndPolicies = () => {
  const [expandedSection, setExpandedSection] = useState(null);

  const sections = [
    {
      title: 'Terms of Service',
      content: 'By using WorkZone, you agree to comply with our Terms of Service. WorkZone provides a platform for freelancers and companies to connect and collaborate. Users must be at least 18 years old or have parental consent. All transactions are final, and disputes are handled through our resolution process. Users agree not to engage in fraudulent, illegal, or harmful activities on the platform.'
    },
    {
      title: 'Privacy Policy',
      content: 'Your privacy is important to us. WorkZone collects personal information including name, email, and ID documents for verification purposes. We use this information to provide services, prevent fraud, and improve our platform. We do not share your information with third parties without your consent, except as required by law. You have the right to access, modify, or delete your personal data at any time.'
    },
    {
      title: 'Payment Policy',
      content: 'WorkZone processes payments in Sri Lankan Rupees (LKR). Payments are held securely in user wallets and transferred after job completion and approval. A small platform fee may apply to transactions. Refunds are provided only in cases of job cancellation or company breach of agreement. All payment transactions are final once transferred to the user\'s wallet.'
    },
    {
      title: 'Dispute Resolution',
      content: 'In case of disputes between users and companies, WorkZone provides a resolution process. Users or companies can report issues through the platform within 7 days of the incident. Our team will review the case and make a fair decision. Decisions are final, and further escalation is handled by arbitration if necessary. We aim to resolve disputes within 14 days.'
    },
    {
      title: 'Job Posting Guidelines',
      content: 'Companies posting jobs must provide accurate job descriptions, fair compensation, and clear deliverables. Jobs must be legal and ethical. WorkZone reserves the right to remove jobs that violate our guidelines. Spam or misleading job postings will result in account suspension. Companies must honor agreements with freelancers or face account restrictions.'
    },
    {
      title: 'Freelancer Responsibilities',
      content: 'Freelancers must deliver work as agreed and maintain professional communication with companies. Submitting false credentials, IDs, or qualifications will result in immediate account suspension. Freelancers are responsible for maintaining confidentiality of client information. Work must be completed within agreed timelines and meet quality standards.'
    },
    {
      title: 'Platform Code of Conduct',
      content: 'All users must maintain professional behavior on WorkZone. Harassment, discrimination, or abusive language will not be tolerated. Users must not spam, post misleading information, or attempt to circumvent platform security. Violation of the code of conduct may result in warning, suspension, or permanent ban from the platform.'
    },
    {
      title: 'Limitation of Liability',
      content: 'WorkZone is provided "as is" without warranties. We are not liable for indirect, incidental, or consequential damages. Our liability is limited to the amount paid by the user in the past 12 months. Users agree to indemnify WorkZone from any claims arising from their use of the platform. We do not guarantee availability, security, or results from using our platform.'
    }
  ];

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-2 text-center">Terms & Policies</h1>
        <p className="text-center text-gray-600 mb-12">Last updated: January 2026 | Version 1.0</p>

        <div className="space-y-4">
          {sections.map((section, idx) => (
            <div key={idx} className="bg-white rounded-2xl shadow-sm border overflow-hidden">
              <button
                onClick={() => setExpandedSection(expandedSection === idx ? null : idx)}
                className="w-full px-8 py-6 flex justify-between items-center hover:bg-gray-50 transition-colors"
              >
                <h3 className="font-bold text-gray-900 text-lg text-left">{section.title}</h3>
                <ChevronRight 
                  size={24} 
                  className={`text-purple-600 transition-transform ${expandedSection === idx ? 'rotate-90' : ''}`}
                />
              </button>

              {expandedSection === idx && (
                <div className="px-8 py-6 border-t bg-gray-50">
                  <p className="text-gray-700 leading-relaxed">{section.content}</p>
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="mt-12 bg-white rounded-2xl shadow-sm border p-8">
          <h2 className="font-bold text-gray-900 mb-4">Questions About Our Policies?</h2>
          <p className="text-gray-600 mb-6">If you have any questions or concerns about our terms and policies, please don't hesitate to contact us.</p>
          <Link
            to="/contact"
            className="inline-block bg-gradient-to-r from-purple-600 to-blue-600 text-white px-8 py-3 rounded-xl font-bold hover:shadow-lg transition-all"
          >
            Contact Support
          </Link>
        </div>
      </div>
    </div>
    </>
  );
};

export default function App() {
  return (
    <Router>
      <AppProvider>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/job/:id" element={<JobDetails />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/participate/:id" element={<ParticipatePage />} />
          <Route path="/card-details/:id" element={<CardDetailsPage />} />
          <Route path="/company-dashboard" element={<CompanyDashboard />} />
          <Route path="/user-dashboard" element={<UserDashboard />} />
          <Route path="/about" element={<AboutUs />} />
          <Route path="/contact" element={<ContactUs />} />
          <Route path="/feedback" element={<FeedbackPage />} />
          <Route path="/terms" element={<TermsAndPolicies />} />
          <Route path="*" element={<Home />} />
        </Routes>
      </AppProvider>
    </Router>
  );
}