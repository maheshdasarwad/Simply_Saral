const data=[{
  title: "Right to Education (RTE) Act, 2009",
  description: "A landmark legislation enacted by the Government of India to provide free and compulsory education to children aged 6-14 years. It mandates that no child shall be denied education and ensures equal learning opportunities for all, with a special focus on disadvantaged groups.",
  importantLinks: [
    { name: "Official RTE Portal", url: "https://education.gov.in/rte" },
    { name: "Ministry of Education", url: "https://www.education.gov.in" },
    { name: "State RTE Portals", url: "https://education.gov.in/stateSchemes" },
    { name: "RTE Guidelines PDF", url: "https://education.gov.in/rte-guidelines.pdf" }
  ],
  applicationProcess: {
    online: "Register at RTE Admission Portal. Choose state and district, fill child's details, upload documents, and submit application.",
    offline: "Visit nearest government or private school, fill RTE Admission Form, submit documents. School forwards application to State Education Department."
  },
  eligibilityCriteria: {
    ageLimit: "6 to 14 years",
    domicile: "Must be a resident of India",
    incomeLimit: "Below ₹2-3 lakh per annum for EWS & disadvantaged groups",
    categories: [
      "Children from Economically Weaker Sections (EWS)",
      "Scheduled Caste (SC)",
      "Scheduled Tribe (ST)",
      "Other Backward Classes (OBC)",
      "Disabled children",
      "Orphans"
    ],
    schoolType: "Applies to government and private unaided schools (25% reservation in private schools)"
  },
  benefits: {
    freeEducation: true,
    privateSchoolReservation: 25,
    infrastructureDevelopment: true,
    teacherTraining: true,
    nonDiscrimination: true
  },
  requiredDocuments: [
    { type: "Identity Proof", description: "Aadhaar Card, Birth Certificate, or Passport" },
    { type: "Address Proof", description: "Ration Card, Utility Bill, or Domicile Certificate" },
    { type: "Income Certificate", description: "Issued by Tehsildar or Competent Authority" },
    { type: "Caste Certificate", description: "For SC/ST/OBC candidates (if applicable)" },
    { type: "Disability Certificate", description: "If applicable" }
  ],
  admissionRenewal: {
    annualProcess: true,
    renewalUntil: "Class 8"
  },
  specialProvisions: {
    disabledStudents: true,
    girlStudents: true,
    ruralTribalSupport: true
  },
  tracking: {
    admissionStatus: "https://education.gov.in/status",
    grievanceRedressal: "https://education.gov.in/grievance",
    fundDisbursement: "https://education.gov.in/disbursement"
  },
  contact: {
    helpline: "011-23382391",
    ministryContact: "011-23765605",
    emailSupport: "helpdesk@education.gov.in",
    stateContacts: "https://education.gov.in/contact"
  },
  image: " ", // No image was provided in the original document
  createdAt: new Date()
},
{
  title: "Pradhan Mantri Schools for Rising India (PM SHRI Schools)",
  description: "A centrally sponsored initiative launched by the Government of India to develop quality model schools across the country. These schools will serve as exemplary institutions, focusing on innovative pedagogy, smart classrooms, skill development, and sustainability.",
  importantLinks: [
    { name: "Official PM SHRI Schools Portal", url: "https://pmshrischools.education.gov.in" },
    { name: "Ministry of Education", url: "https://www.education.gov.in" },
    { name: "State PM SHRI Implementation Details", url: "https://pmshrischools.education.gov.in/stateSchemes" },
    { name: "Scheme Guidelines PDF", url: "https://pmshrischools.education.gov.in/guidelines.pdf" }
  ],
  applicationProcess: {
    online: "Register at PM SHRI Schools Portal. Fill out School Nomination Form with details of infrastructure, teachers, and academic performance. Upload required documents and track application status.",
    offline: "Apply through District/State Education Department. Submit School Development Plan as per PM SHRI guidelines. State authorities verify and nominate schools for final selection."
  },
  eligibilityCriteria: {
    ageLimit: null,
    domicile: null,
    incomeLimit: null,
    categories: [
      "Existing Kendriya Vidyalayas (KVs)",
      "Jawahar Navodaya Vidyalayas (JNVs)",
      "State Government Schools"
    ],
    schoolType: "Schools meeting infrastructure, academic, and sustainability requirements"
  },
  benefits: {
    freeEducation: false,
    privateSchoolReservation: 0,
    infrastructureDevelopment: true,
    teacherTraining: true,
    nonDiscrimination: true
  },
  requiredDocuments: [
    { type: "School Recognition Certificate", description: "Issued by State Education Department" },
    { type: "Infrastructure Report", description: "Details of classrooms, labs, and amenities" },
    { type: "Teacher Qualification Records", description: "Details of faculty and their certifications" },
    { type: "Sustainability Plan", description: "School's roadmap for eco-friendly and digital transformation" }
  ],
  admissionRenewal: {
    annualProcess: true,
    renewalUntil: "Continuous, subject to annual performance review"
  },
  specialProvisions: {
    disabledStudents: true,
    girlStudents: true,
    ruralTribalSupport: true
  },
  tracking: {
    admissionStatus: "https://pmshrischools.education.gov.in/status",
    grievanceRedressal: "https://pmshrischools.education.gov.in/grievance",
    fundDisbursement: "https://pmshrischools.education.gov.in/disbursement"
  },
  contact: {
    helpline: "011-23382391",
    ministryContact: "011-23765605",
    emailSupport: "helpdesk@pmshrischools.gov.in",
    stateContacts: "https://pmshrischools.education.gov.in/contact"
  },
  image: null,
  createdAt: new Date()
},
{
  title: "Digital Infrastructure for Knowledge Sharing (DIKSHA)",
  description: "A national e-learning platform launched by the Government of India to provide free digital education resources for students, teachers, and educational institutions. It offers interactive textbooks, video lessons, teacher training materials, and assessments aligned with the National Education Policy (NEP) 2020.",
  importantLinks: [
    { name: "Official DIKSHA Portal", url: "https://diksha.gov.in" },
    { name: "Ministry of Education", url: "https://www.education.gov.in" },
    { name: "NCERT Digital Learning Resources", url: "https://ncert.nic.in/digital_learning.php" },
    { name: "DIKSHA Guidelines PDF", url: "https://diksha.gov.in/guidelines.pdf" }
  ],
  applicationProcess: {
    online: "Visit DIKSHA Portal, select role (Student/Teacher/Parent), choose language, browse free textbooks, video lessons, and quizzes. Alternatively, download DIKSHA Mobile App and sign up.",
    offline: "Access through school computer labs, download content for offline use in rural areas"
  },
  eligibilityCriteria: {
    ageLimit: "Class 1 to 12",
    domicile: "All students in government and private schools in India",
    incomeLimit: null,
    categories: [
      "Students (Class 1-12)",
      "Government and private school teachers",
      "Educational institutions"
    ],
    schoolType: "Applicable to government and private schools"
  },
  benefits: {
    freeEducation: true,
    privateSchoolReservation: 0,
    infrastructureDevelopment: false,
    teacherTraining: true,
    nonDiscrimination: true
  },
  requiredDocuments: [
    { type: "Teacher ID Proof", description: "Aadhaar Card, Employee ID, or School Certification" },
    { type: "Institution Details", description: "School recognition certificate" },
    { type: "Student Credentials", description: "Optional for tracking individual learning progress" }
  ],
  admissionRenewal: {
    annualProcess: true,
    renewalUntil: "Continuous learning platform"
  },
  specialProvisions: {
    disabledStudents: true,
    girlStudents: true,
    ruralTribalSupport: true
  },
  tracking: {
    admissionStatus: "https://diksha.gov.in/status",
    grievanceRedressal: "https://diksha.gov.in/grievance",
    fundDisbursement: "https://diksha.gov.in/disbursement"
  },
  contact: {
    helpline: "011-23382391",
    ministryContact: "011-23765605",
    emailSupport: "helpdesk@diksha.gov.in",
    stateContacts: "https://diksha.gov.in/contact"
  },
  image: null,
  createdAt: new Date()
}
]

  module.exports={data:data};
