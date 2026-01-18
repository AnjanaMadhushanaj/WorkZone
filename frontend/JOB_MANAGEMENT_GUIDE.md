# WorkZone Job Management Guide

## 📋 Current Jobs Overview

Your WorkZone platform now has **24 comprehensive part-time jobs** perfect for Sri Lankan campus students, organized by category:

### Job Categories & Companies:

#### 🏪 **Retail & Customer Service** (2 jobs)
- **Cashier - City Center Book Shop** - City Center Book Store
- **Cashier & Retail Associate - Food City Supermarket** - Food City Supermarket

#### 📢 **Promotions & Marketing** (3 jobs)
- **Leaflet Promotions** - MultiCare Pharmaceuticals
- **Brand Ambassador - Mobile Phone Distribution** - Digital Tek Solutions
- **Event Promoter - Fashion & Lifestyle** - StyleZone Marketing

#### 📦 **Stock & Inventory Management** (3 jobs)
- **Stock Counting & Inventory Helper** - Global Logistics Sri Lanka
- **Store Stock Assistant** - Smart Shopping Stores
- **Vehicle Count & Inventory** - Island Wide Transport Services

#### 🏨 **Hotel & Hospitality** (4 jobs)
- **Hotel Housekeeping** - Royal Palm Hotel Colombo
- **Hotel Restaurant Attendant** - Grand Hotel & Restaurant
- **Front Desk Reception** - Paradise Bay Hotel
- **Kitchen Helper & Food Prep** - Taste of Colombo Restaurant

#### 💐 **Flower & Decoration** (3 jobs)
- **Floral Arranger & Decorator** - Bloom Designs Event Decor
- **Event Decorator - Balloons & Props** - Party Perfect Celebrations
- **Wedding & Events Setup** - Elegant Events Sri Lanka

#### 💻 **Professional & Freelance** (9 jobs)
- **Graphic Designer** - Creative Pixel Studios
- **UX/UI Designer** - TechFlow Asia
- **English Tutor** - EduLearn Sri Lanka
- **Social Media Manager** - Local Buzz Marketing
- **Data Entry Specialist** - BPO Solutions Sri Lanka
- **Call Center Executive** - Global Customer Support
- **Online Tutor - Mathematics & Science** - Virtual Academy Sri Lanka
- **Content Writer** - Digital Content Hub
- **Delivery Assistant** - Express Couriers Sri Lanka

---

## 🚀 How to Add More Jobs

### Step 1: Edit the INITIAL_JOBS Array
**File Location:** `src/App.jsx` (Lines 17-115)

### Step 2: Job Object Structure
```javascript
{
  id: 25,                              // Unique ID (increment from last)
  title: 'Job Title - Company Detail', // Clear, descriptive title
  company: 'Company Name',             // Actual Sri Lankan company
  location: 'City, Area',              // Specific location in Sri Lanka
  rate: 'LKR X,XXX/hr',              // Hourly rate in LKR
  amount: XXXXX,                       // Total amount (e.g., 30000)
  type: 'Part-Time',                   // 'Part-Time', 'Full-Time', 'Freelance', 'Contract'
  tags: ['Tag1', 'Tag2', 'Tag3'],     // 3-4 relevant tags
  logoColor: 'bg-blue-500',            // Tailwind color class
  description: 'Detailed job description...', // 3-4 sentences
  postedBy: 'company21'                // Company ID (increment)
}
```

### Step 3: Guidelines for Writing Descriptions

#### ✅ Good Description Example:
```
"Deliver food orders and courier packages in Colombo area. Use company vehicle 
or own transportation (with allowance). Meet customers, handle payments, and 
provide excellent service. Flexible scheduling with incentives for peak hours."
```

**Key Elements:**
- Start with main responsibility
- List 2-3 key duties
- Mention flexibility/benefits
- Keep to 50-80 words
- Include training availability if applicable

#### More Examples by Category:

**Retail/Customer Service Pattern:**
- Mention POS systems/transactions
- Highlight customer interaction
- Note flexibility for students
- Include benefits/discounts
- State training availability

**Promotions Pattern:**
- Describe target activities
- Mention customer engagement
- Note schedule flexibility
- Include incentives/commissions
- State required skills level

**Hospitality Pattern:**
- List cleaning/service duties
- Mention professional standards
- Note shift flexibility
- Include uniform/training
- Highlight team environment

**Decoration Pattern:**
- Describe creative work
- List setup responsibilities
- Note event-based scheduling
- Mention learning opportunities
- Include flexibility

---

## 🎨 Tailwind Color Classes for Logo

### Available Colors:
```
bg-blue-500       bg-blue-600        bg-green-500      bg-green-600
bg-red-500        bg-red-600         bg-orange-500     bg-orange-600
bg-yellow-600     bg-pink-500        bg-pink-600       bg-purple-500
bg-purple-600     bg-cyan-600        bg-indigo-600     bg-teal-600
bg-lime-600       bg-fuchsia-600     bg-amber-500      bg-amber-600
bg-rose-600
```

---

## 📝 Job Title Best Practices

### ✅ Good Titles:
- "Cashier - City Center Book Shop"
- "Hotel Housekeeping - 4-Star Hotel"
- "Leaflet Promotions - MultiCare Pharmaceuticals"
- "Stock Counting & Inventory Helper - Colombo Warehouse"

### ❌ Avoid:
- Generic titles like "Job" or "Work"
- Overly long titles
- Special characters (except hyphens)

---

## 🏢 Sri Lankan Companies to Add

### Potential Companies by Sector:

**Retail & Supermarkets:**
- Keells Super Center
- Makro
- Arpico Group
- Abans
- Gamma Byte
- Spar

**Hospitality:**
- Hilton Colombo
- Mount Lavinia Hotel
- Lakshmi's Hotel
- Cinnamon Hotels
- Taj Hotels
- Pan Asian Hotels

**Banks & Finance:**
- Commercial Bank
- Seylan Bank
- DFCC Bank
- People's Bank
- BOC

**Telecommunications:**
- Dialog Axiata
- Mobitel
- Hutch (now Axiata)
- SLT Mobitel

**Food & Beverage:**
- San Francisco Coffee Company
- Lakshmi's Restaurant
- Sizzler
- Pepper Mill
- Island Grill

**Logistics & Transport:**
- Colombo Port Authority
- Speedway Services
- Trans Asia Logistics
- DHL Sri Lanka
- FedEx Sri Lanka

**Manufacturing:**
- Piramal Glass
- Unilever Sri Lanka
- Nestle Sri Lanka
- Ceylon Tea
- Cargills Food City

---

## 💡 More Job Ideas for Campus Students

### High-Demand Jobs to Add:

#### 1. **Security & Safety**
- Security Guard - Mall/Store
- Campus Patrol Assistant
- Event Security Personnel

#### 2. **Education & Tutoring**
- Subject Tutor (Math, Science, English)
- Early Childhood Care Assistant
- Online Teaching Assistant
- School Tour Guide

#### 3. **Tech & IT**
- Web Developer - Freelance
- Mobile App Testing
- IT Support Assistant
- Social Media Content Creator

#### 4. **Healthcare**
- Healthcare Assistant - Clinic
- Home Care Attendant
- Pharmacy Assistant
- Health Educator

#### 5. **Media & Entertainment**
- Event Photographer
- Video Editor
- Podcast Producer
- Radio Station Assistant

#### 6. **Agriculture & Environment**
- Nursery Helper
- Gardening Assistant
- Environmental Officer
- Agricultural Surveyor

#### 7. **Transportation**
- Bus Conductor
- Taxi Driver
- Parcel Delivery
- Uber/Grab Driver

#### 8. **Manual Labor**
- Construction Helper
- Painting Assistant
- Carpentry Assistant
- General Labor

#### 9. **Services**
- Personal Assistant
- Dog Walking & Pet Care
- Car Washing Service
- House Cleaning Service

#### 10. **Data & Analysis**
- Data Entry Operator
- Survey Conductor
- Research Assistant
- QA Tester

---

## 🔧 How to Update on Home Page

The home page automatically displays jobs from the `INITIAL_JOBS` array. Currently showing 4 jobs in a grid layout.

### To Show More Jobs:
1. All 24 jobs are in the array (auto-shows in grid)
2. Mobile: 1 column
3. Tablet: 2 columns
4. Desktop: 4 columns
5. Scroll or pagination coming soon

### Recommended Additions:
- Add 6-12 more jobs to reach 30-36 (shows nicely in grids)
- Keep variety across categories
- Maintain realistic Sri Lankan salaries
- Update monthly with new opportunities

---

## 📊 Salary Guidelines (LKR/hour)

### Entry-Level (No Experience):
- LKR 1,200 - 1,500/hr
- Examples: Basic cashier, stock helper, leaflet distribution

### Intermediate (Some Skills):
- LKR 1,600 - 2,200/hr
- Examples: Hotel work, retail supervisor, basic promotion

### Skilled (Experience/Qualification):
- LKR 2,300 - 3,500/hr
- Examples: Design, tutoring, content creation, specialized roles

### Professional (Degree/Expertise):
- LKR 3,500 - 8,000+/hr
- Examples: UX/UI design, programming, consulting

---

## ✨ Sample New Job Template

Copy this template for adding new jobs:

```javascript
{ 
  id: 25, 
  title: 'Job Title - Location/Company Detail', 
  company: 'Company Name Sri Lanka', 
  location: 'City/Area', 
  rate: 'LKR X,XXX/hr', 
  amount: XXXXX, 
  type: 'Part-Time', 
  tags: ['Tag1', 'Tag2', 'Tag3', 'Tag4'], 
  logoColor: 'bg-color-500', 
  description: 'Main responsibility here. List key duties with specific details. Mention flexibility and benefits. Keep it 50-80 words with realistic compensation.', 
  postedBy: 'company21' 
},
```

---

## 🎯 Next Steps

1. ✅ 24 jobs currently live
2. ⏳ Add 10-15 more jobs from the suggestions above
3. ⏳ Update descriptions weekly with real opportunities
4. ⏳ Add company logos/images for visual appeal
5. ⏳ Implement job search/filter functionality
6. ⏳ Add job application tracking dashboard
7. ⏳ Create company dashboard for job posting

---

## 📞 Support

For questions about job structure or requirements, refer to:
- Job Details Component (Lines 700-900 in App.jsx)
- JobCard Component (Lines 100-130 in App.jsx)
- INITIAL_JOBS Array (Lines 17-115 in App.jsx)

---

**Last Updated:** January 2026
**Total Jobs:** 24 (Ready for expansion to 36+)
