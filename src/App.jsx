import { useState, useEffect } from 'react'
import './App.css'
import emailjs from '@emailjs/browser'
import {
  auth,
  db,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  sendPasswordResetEmail,
  deleteUser,
  collection,
  addDoc,
  serverTimestamp,
  query,
  where,
  getDocs,
  doc,
  updateDoc,
  deleteDoc,
} from './firebase'

const EMAILJS_SERVICE_ID = 'service_4jvccxa'
const EMAILJS_TEMPLATE_ID = 'template_fney8hc'
const EMAILJS_PUBLIC_KEY = 'lSxqFPVHZNjayS9op'

function App() {
  const [language, setLanguage] = useState('ar')
  const [screen, setScreen] = useState('welcome')
  const [specialtySearch, setSpecialtySearch] = useState('')
  const [selectedCategory, setSelectedCategory] = useState(null)
  const [selectedExpert, setSelectedExpert] = useState(null)

  const [realExperts, setRealExperts] = useState([])
  const [loadingExperts, setLoadingExperts] = useState(false)

  // 🆕 تقييمات
  const [expertRatingsMap, setExpertRatingsMap] = useState({}) // { expertName: { avg, count } }
  const [expertReviews, setExpertReviews] = useState([])
  const [loadingReviews, setLoadingReviews] = useState(false)
  const [ratingBookingId, setRatingBookingId] = useState(null)
  const [ratingValue, setRatingValue] = useState(0)
  const [ratingCommentInput, setRatingCommentInput] = useState('')
  const [submittingRating, setSubmittingRating] = useState(false)

  const [studentData, setStudentData] = useState({
    name: '',
    university: '',
    major: '',
    gradYear: '',
    email: '',
    password: '',
  })
  const [expertData, setExpertData] = useState({
    name: '',
    company: '',
    jobTitle: '',
    experience: '',
    field: '',
    bio: '',
    email: '',
    password: '',
  })
  const [loginEmail, setLoginEmail] = useState('')
  const [loginPassword, setLoginPassword] = useState('')
  const [showBookingForm, setShowBookingForm] = useState(false)
  const [bookingDate, setBookingDate] = useState('')
  const [bookingTime, setBookingTime] = useState('')
  const [bookingNote, setBookingNote] = useState('')
  const [bookingSubmitted, setBookingSubmitted] = useState(false)
  const [timeDropdownOpen, setTimeDropdownOpen] = useState(false)
  const [myBookings, setMyBookings] = useState([])
  const [loadingBookings, setLoadingBookings] = useState(false)
  const [bookedSlotsForDate, setBookedSlotsForDate] = useState([])
  const [expertBookings, setExpertBookings] = useState([])
  const [loadingExpertBookings, setLoadingExpertBookings] = useState(false)

  const [confirmingBookingId, setConfirmingBookingId] = useState(null)
  const [meetingLinkInput, setMeetingLinkInput] = useState('')
  const [sendingConfirmation, setSendingConfirmation] = useState(false)

  const [hasMaterial, setHasMaterial] = useState(null)
  const [materialComment, setMaterialComment] = useState('')

  const [profileData, setProfileData] = useState(null)
  const [profileType, setProfileType] = useState(null)
  const [loadingProfile, setLoadingProfile] = useState(false)

  const [editingField, setEditingField] = useState(null)
  const [editValue, setEditValue] = useState('')
  const [savingField, setSavingField] = useState(false)

  const text = {
    ar: {
      appName: 'وجهني',
      tagline: 'تواصل مع خبراء مجالك',
      heroTitle: 'اسأل من سبقك، وخذ خطوتك بثقة',
      heroDescription: 'تواصل مع خبراء حقيقيين في مجالك، واستفد من خبرتهم في الوظائف والمقابلات وتطوير مسارك المهني.',
      findExpert: 'ابحث عن خبير',
      joinAsExpert: 'انضم كخبير',
      haveAccount: 'لديك حساب؟',
      trust1: 'خبراء موثّقون',
      trust2: 'حجز سهل وآمن',
      trust3: 'جلسات أونلاين مرنة',
      login: 'تسجيل الدخول',
      loginSubtitle: 'أدخل بريدك وكلمة المرور لتسجيل الدخول',
      signup: 'إنشاء حساب',
      chooseType: 'اختر نوع حسابك',
      seeker: 'باحث عن فرصة',
      expert: 'خبير',
      back: 'رجوع',
      seekerFormTitle: 'بيانات باحث عن فرصة',
      expertFormTitle: 'بيانات الخبير',
      name: 'الاسم الكامل',
      university: 'الجامعة',
      major: 'التخصص / مجال العمل',
      gradYear: 'سنة التخرج',
      uploadCV: 'رفع السيرة الذاتية (اختياري)',
      chooseFile: 'اختر ملف',
      continue: 'متابعة',
      company: 'الشركة',
      jobTitle: 'المسمى الوظيفي',
      experience: 'سنوات الخبرة',
      field: 'المجال',
      bio: 'نبذة عنك',
      uploadProof: 'إثبات العمل (شهادة، هوية عمل، إلخ)',
      reviewNote: 'حسابك بيتراجع من الإدارة قبل ما يصير فعّال للجمهور',
      pendingTitle: 'حسابك تحت المراجعة',
      pendingMessage: 'شكراً لتسجيلك! فريقنا يراجع بياناتك الحين، بيوصلك إشعار بالموافقة خلال 24-48 ساعة.',
      backHome: 'رجوع للرئيسية',
      email: 'البريد الإلكتروني',
      emailPlaceholder: 'example@email.com',
      password: 'كلمة المرور',
      passwordHint: '6 أحرف على الأقل',
      invalidEmailFormat: 'صيغة البريد الإلكتروني غير صحيحة',
      signupErrorEmailInUse: 'هذا البريد مسجل مسبقاً، جرب تسجيل الدخول بدل',
      signupErrorWeakPassword: 'كلمة المرور ضعيفة، لازم تكون 6 أحرف على الأقل',
      loginErrorMessage: 'البريد أو كلمة المرور غير صحيحة',
      genericAuthError: 'صار خطأ، حاول مرة ثانية',
      registeredSuccess: 'سجلت حسابك بنجاح!',
      topExperts: 'أفضل الخبراء',
      specialties: 'التخصصات',
      sessions: 'جلسة',
      viewAll: 'عرض الكل',
      allSpecialties: 'كل الأقسام',
      searchSpecialty: 'ابحث عن قسم أو تخصص...',
      noResults: 'ما فيه نتائج مطابقة',
      expertsIn: 'الخبراء في',
      bookSession: 'احجز جلسة',
      noExpertsYet: 'ما فيه خبراء مسجلين بهذا المجال بعد',
      requiredFieldsMissing: 'الرجاء تعبئة الحقول المطلوبة',
      reviewsTitle: 'تقييمات سابقة',
      viewProfile: 'عرض الملف',
      selectDateTime: 'اختر التاريخ والوقت',
      date: 'التاريخ',
      time: 'الوقت',
      selectTimePlaceholder: 'اختر الوقت',
      note: 'ملاحظة (اختياري)',
      notePlaceholder: 'أي شي تحب توضحه للخبير قبل الجلسة...',
      confirmBooking: 'تأكيد الحجز',
      cancelBooking: 'إلغاء',
      bookingSuccessTitle: 'تم إرسال طلب الحجز!',
      bookingSuccessMessage: 'ننتظر تأكيد الخبير، بيوصلك إشعار لما يوافق على الموعد.',
      loginRequiredForBooking: 'لازم تسجل دخول أول عشان تقدر تحجز جلسة',
      myBookings: 'حجوزاتي',
      myBookingsEmpty: 'ما عندك حجوزات لسه',
      bookingStatusPending: 'قيد الانتظار',
      bookingStatusConfirmed: 'مؤكد',
      loadingText: 'جاري التحميل...',
      slotTakenMessage: 'هذا الموعد محجوز مسبقاً، اختر تاريخ أو وقت ثاني',
      expertDashboardTitle: 'طلبات الحجز',
      acceptBooking: 'قبول',
      rejectBooking: 'رفض',
      bookingStatusCancelled: 'ملغي',
      noBookingsForExpert: 'ما فيه طلبات حجز حالياً',
      requesterLabel: 'من:',
      meetingLinkLabel: 'رابط المقابلة (Zoom / Google Meet)',
      meetingLinkPlaceholder: 'https://meet.google.com/xxx-xxxx-xxx',
      sendConfirmation: 'تأكيد وإرسال الإشعار',
      sendingConfirmationText: 'جاري الإرسال...',
      missingMeetingLink: 'الرجاء إدخال رابط المقابلة قبل التأكيد',
      joinMeeting: 'رابط المقابلة',
      cancelConfirm: 'تراجع',
      forgotPassword: 'نسيت كلمة المرور؟',
      forgotPasswordSent: 'أرسلنا لك رابط إعادة تعيين كلمة المرور على بريدك الإلكتروني',
      forgotPasswordNeedEmail: 'اكتب بريدك الإلكتروني بالخانة فوق أول، وبعدين اضغط "نسيت كلمة المرور؟"',
      deleteAccount: 'حذف الحساب',
      deleteAccountConfirm: 'هل أنت متأكد إنك تبي تحذف حسابك؟ هذا الإجراء لا يمكن التراجع عنه.',
      accountDeletedSuccess: 'تم حذف حسابك بنجاح',
      reauthRequired: 'لأمان حسابك، لازم تسجل خروج وتدخل مرة ثانية قبل ما تقدر تحذف الحساب',
      hasMaterialQuestion: 'هل عندك المادة العلمية اللي تبي تناقشها بالجلسة؟',
      materialYes: 'نعم',
      materialNo: 'لا',
      materialCommentLabel: 'وش الأشياء اللي تحتاجها؟',
      materialCommentPlaceholder: 'اكتب هنا وش تحتاج من الخبير يجهزه أو يساعدك فيه...',
      materialRequiredMissing: 'الرجاء تحديد إذا عندك المادة العلمية أو لا',
      myProfile: 'الملف الشخصي',
      profileNoData: 'ما قدرنا نجيب بيانات حسابك',
      accountType: 'نوع الحساب',
      save: 'حفظ',
      emailEditNote: 'ملاحظة: تعديل الإيميل هنا يغيّر بس الإيميل المعروض بملفك، ما يغيّر إيميل تسجيل الدخول.',
      rateSession: 'قيّم الجلسة',
      yourRatingLabel: 'تقييمك',
      ratingCommentLabel: 'تعليق (اختياري)',
      ratingCommentPlaceholder: 'شاركنا رأيك بالجلسة...',
      submitRating: 'إرسال التقييم',
      yourRatingSubmittedLabel: 'تقييمك:',
      noReviewsYet: 'لا توجد تقييمات بعد',
      ratingRequiredMissing: 'الرجاء اختيار عدد النجوم قبل الإرسال',
      anonymousReviewer: 'مستخدم',
      reviewsCount: 'تقييم',
    },
    en: {
      appName: 'Wajehni',
      tagline: 'Connect with experts in your field',
      heroTitle: 'Learn from those who came before you, and take your next step with confidence',
      heroDescription: 'Connect with real experts in your field and benefit from their experience in jobs, interviews, and career growth.',
      findExpert: 'Find an Expert',
      joinAsExpert: 'Join as an Expert',
      haveAccount: 'Already have an account?',
      trust1: 'Verified Experts',
      trust2: 'Easy & Secure Booking',
      trust3: 'Flexible Online Sessions',
      login: 'Login',
      loginSubtitle: 'Enter your email and password to sign in',
      signup: 'Sign Up',
      chooseType: 'Choose your account type',
      seeker: 'Opportunity Seeker',
      expert: 'Expert',
      back: 'Back',
      seekerFormTitle: 'Opportunity Seeker Information',
      expertFormTitle: 'Expert Information',
      name: 'Full Name',
      university: 'University',
      major: 'Major / Field of Work',
      gradYear: 'Graduation Year',
      uploadCV: 'Upload CV (optional)',
      chooseFile: 'Choose file',
      continue: 'Continue',
      company: 'Company',
      jobTitle: 'Job Title',
      experience: 'Years of Experience',
      field: 'Field',
      bio: 'About You',
      uploadProof: 'Proof of employment (certificate, work ID, etc.)',
      reviewNote: 'Your account will be reviewed by the admin before going live',
      pendingTitle: 'Your account is under review',
      pendingMessage: 'Thanks for signing up! Our team is reviewing your details. You will be notified within 24-48 hours.',
      backHome: 'Back to home',
      email: 'Email',
      emailPlaceholder: 'example@email.com',
      password: 'Password',
      passwordHint: 'At least 6 characters',
      invalidEmailFormat: 'Invalid email format',
      signupErrorEmailInUse: 'This email is already registered, try logging in instead',
      signupErrorWeakPassword: 'Weak password, must be at least 6 characters',
      loginErrorMessage: 'Incorrect email or password',
      genericAuthError: 'Something went wrong, please try again',
      registeredSuccess: 'Account created successfully!',
      topExperts: 'Top Experts',
      specialties: 'Specialties',
      sessions: 'sessions',
      viewAll: 'View all',
      allSpecialties: 'All Categories',
      searchSpecialty: 'Search a category or specialty...',
      noResults: 'No matching results',
      expertsIn: 'Experts in',
      bookSession: 'Book a session',
      noExpertsYet: 'No experts registered in this field yet',
      requiredFieldsMissing: 'Please fill in the required fields',
      reviewsTitle: 'Previous Reviews',
      viewProfile: 'View Profile',
      selectDateTime: 'Select Date & Time',
      date: 'Date',
      time: 'Time',
      selectTimePlaceholder: 'Select a time',
      note: 'Note (optional)',
      notePlaceholder: 'Anything you want the expert to know before the session...',
      confirmBooking: 'Confirm Booking',
      cancelBooking: 'Cancel',
      bookingSuccessTitle: 'Booking request sent!',
      bookingSuccessMessage: "We're waiting for the expert's confirmation, you'll be notified once approved.",
      loginRequiredForBooking: 'You need to log in first to book a session',
      myBookings: 'My Bookings',
      myBookingsEmpty: "You don't have any bookings yet",
      bookingStatusPending: 'Pending',
      bookingStatusConfirmed: 'Confirmed',
      loadingText: 'Loading...',
      slotTakenMessage: 'This slot is already booked, please choose another date or time',
      expertDashboardTitle: 'Booking Requests',
      acceptBooking: 'Accept',
      rejectBooking: 'Reject',
      bookingStatusCancelled: 'Cancelled',
      noBookingsForExpert: 'No booking requests yet',
      requesterLabel: 'From:',
      meetingLinkLabel: 'Meeting Link (Zoom / Google Meet)',
      meetingLinkPlaceholder: 'https://meet.google.com/xxx-xxxx-xxx',
      sendConfirmation: 'Confirm & Send Notification',
      sendingConfirmationText: 'Sending...',
      missingMeetingLink: 'Please enter the meeting link before confirming',
      joinMeeting: 'Meeting link',
      cancelConfirm: 'Cancel',
      forgotPassword: 'Forgot password?',
      forgotPasswordSent: 'We sent a password reset link to your email',
      forgotPasswordNeedEmail: 'Enter your email above first, then click "Forgot password?"',
      deleteAccount: 'Delete Account',
      deleteAccountConfirm: 'Are you sure you want to delete your account? This action cannot be undone.',
      accountDeletedSuccess: 'Your account was deleted successfully',
      reauthRequired: 'For your security, please sign out and log in again before deleting your account',
      hasMaterialQuestion: 'Do you have the study material you want to discuss in the session?',
      materialYes: 'Yes',
      materialNo: 'No',
      materialCommentLabel: 'What do you need?',
      materialCommentPlaceholder: 'Write what you need the expert to prepare or help you with...',
      materialRequiredMissing: 'Please specify whether you have the study material or not',
      myProfile: 'My Profile',
      profileNoData: "We couldn't fetch your account data",
      accountType: 'Account Type',
      save: 'Save',
      emailEditNote: 'Note: editing email here only changes the email shown on your profile, not your login email.',
      rateSession: 'Rate Session',
      yourRatingLabel: 'Your Rating',
      ratingCommentLabel: 'Comment (optional)',
      ratingCommentPlaceholder: 'Share your thoughts about the session...',
      submitRating: 'Submit Rating',
      yourRatingSubmittedLabel: 'Your rating:',
      noReviewsYet: 'No reviews yet',
      ratingRequiredMissing: 'Please select a star rating before submitting',
      anonymousReviewer: 'User',
      reviewsCount: 'reviews',
    },
  }

  const t = text[language]

  const categories = [
    { icon: 'ti-report-money', name: language === 'ar' ? 'قطاع المالية' : 'Finance Sector' },
    { icon: 'ti-device-laptop', name: language === 'ar' ? 'قطاع تقنية المعلومات' : 'IT Sector' },
    { icon: 'ti-clipboard-list', name: language === 'ar' ? 'إدارة المشاريع' : 'Project Management' },
    { icon: 'ti-target-arrow', name: language === 'ar' ? 'إدارة الاستراتيجية والأداء' : 'Strategy & Performance Management' },
    { icon: 'ti-speakerphone', name: language === 'ar' ? 'إدارة التسويق' : 'Marketing Management' },
    { icon: 'ti-shopping-cart', name: language === 'ar' ? 'إدارة المشتريات والعقود' : 'Procurement & Contracts Management' },
    { icon: 'ti-award', name: language === 'ar' ? 'إدارة الجودة والتميز المؤسسي' : 'Quality & Institutional Excellence' },
    { icon: 'ti-shield-check', name: language === 'ar' ? 'إدارة المخاطر والالتزام والحوكمة' : 'Risk, Compliance & Governance' },
    { icon: 'ti-scale', name: language === 'ar' ? 'الإدارة القانونية' : 'Legal Management' },
    { icon: 'ti-trending-up', name: language === 'ar' ? 'إدارة تطوير الأعمال' : 'Business Development Management' },
    { icon: 'ti-users-group', name: language === 'ar' ? 'إدارة الموارد البشرية' : 'Human Resources Management' },
    { icon: 'ti-tags', name: language === 'ar' ? 'إدارة المبيعات' : 'Sales Management' },
    { icon: 'ti-bulb', name: language === 'ar' ? 'ريادة الأعمال' : 'Entrepreneurship' },
    { icon: 'ti-chart-dots', name: language === 'ar' ? 'تحليل البيانات وذكاء الأعمال' : 'Data Analytics & BI' },
  ]

  const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)

  const timeSlots = [
    '09:00', '10:00', '11:00', '12:00', '13:00', '14:00',
    '15:00', '16:00', '17:00', '18:00', '19:00', '20:00', '21:00', '22:00',
  ]

  const formatTimeLabel = (time24) => {
    const hour = parseInt(time24.split(':')[0], 10)
    const period = hour < 12 ? 'AM' : 'PM'
    const hour12 = hour % 12 === 0 ? 12 : hour % 12
    return `${hour12}:00 ${period}`
  }

  const filteredCategories = categories.filter((cat) =>
    cat.name.toLowerCase().includes(specialtySearch.toLowerCase())
  )

  const expertsForCategory = selectedCategory
    ? realExperts.filter(
        (exp) => exp.field && exp.field.trim().toLowerCase().includes(selectedCategory.name.toLowerCase())
      )
    : []

  const handleStudentChange = (field, value) => {
    setStudentData({ ...studentData, [field]: value })
  }

  const handleExpertChange = (field, value) => {
    setExpertData({ ...expertData, [field]: value })
  }

  const handleAuthError = (err) => {
    console.error(err)
    if (err.code === 'auth/email-already-in-use') {
      alert(t.signupErrorEmailInUse)
    } else if (err.code === 'auth/weak-password') {
      alert(t.signupErrorWeakPassword)
    } else if (err.code === 'auth/invalid-email') {
      alert(t.invalidEmailFormat)
    } else {
      alert(t.genericAuthError)
    }
  }

  const handleStudentContinue = async () => {
    if (!studentData.name.trim() || !studentData.university.trim() || !studentData.major.trim()) {
      alert(t.requiredFieldsMissing)
      return
    }
    if (!isValidEmail(studentData.email)) {
      alert(t.invalidEmailFormat)
      return
    }
    if (studentData.password.length < 6) {
      alert(t.signupErrorWeakPassword)
      return
    }
    try {
      const cred = await createUserWithEmailAndPassword(auth, studentData.email, studentData.password)
      await addDoc(collection(db, 'seekers'), {
        name: studentData.name,
        university: studentData.university,
        major: studentData.major,
        gradYear: studentData.gradYear,
        email: studentData.email,
        uid: cred.user.uid,
        createdAt: serverTimestamp(),
      })
      setScreen('home')
    } catch (err) {
      handleAuthError(err)
    }
  }

  const handleExpertContinue = async () => {
    if (!expertData.name.trim() || !expertData.company.trim() || !expertData.jobTitle.trim()) {
      alert(t.requiredFieldsMissing)
      return
    }
    if (!isValidEmail(expertData.email)) {
      alert(t.invalidEmailFormat)
      return
    }
    if (expertData.password.length < 6) {
      alert(t.signupErrorWeakPassword)
      return
    }
    try {
      const cred = await createUserWithEmailAndPassword(auth, expertData.email, expertData.password)
      await addDoc(collection(db, 'experts'), {
        name: expertData.name,
        company: expertData.company,
        jobTitle: expertData.jobTitle,
        experience: expertData.experience,
        field: expertData.field,
        bio: expertData.bio,
        email: expertData.email,
        uid: cred.user.uid,
        status: 'pending',
        createdAt: serverTimestamp(),
      })
      setScreen('pending')
    } catch (err) {
      handleAuthError(err)
    }
  }

  const handleLogin = async () => {
    if (!isValidEmail(loginEmail)) {
      alert(t.invalidEmailFormat)
      return
    }
    if (!loginPassword) {
      alert(t.requiredFieldsMissing)
      return
    }
    try {
      const cred = await signInWithEmailAndPassword(auth, loginEmail, loginPassword)
      const expertQuery = query(collection(db, 'experts'), where('uid', '==', cred.user.uid))
      const expertSnap = await getDocs(expertQuery)
      if (!expertSnap.empty) {
        const expertProfile = expertSnap.docs[0].data()
        setScreen('expertDashboard')
        fetchExpertBookings(expertProfile.name)
      } else {
        setScreen('home')
      }
    } catch (err) {
      console.error(err)
      alert(t.loginErrorMessage)
    }
  }

  const handleForgotPassword = async () => {
    if (!isValidEmail(loginEmail)) {
      alert(t.forgotPasswordNeedEmail)
      return
    }
    try {
      await sendPasswordResetEmail(auth, loginEmail)
      alert(t.forgotPasswordSent)
    } catch (err) {
      console.error(err)
      alert(t.genericAuthError)
    }
  }

  const handleDeleteAccount = async () => {
    if (!auth.currentUser) return
    const confirmed = window.confirm(t.deleteAccountConfirm)
    if (!confirmed) return

    try {
      const uid = auth.currentUser.uid

      const seekerQ = query(collection(db, 'seekers'), where('uid', '==', uid))
      const seekerSnap = await getDocs(seekerQ)
      for (const d of seekerSnap.docs) {
        await deleteDoc(doc(db, 'seekers', d.id))
      }

      const expertQ = query(collection(db, 'experts'), where('uid', '==', uid))
      const expertSnap = await getDocs(expertQ)
      for (const d of expertSnap.docs) {
        await deleteDoc(doc(db, 'experts', d.id))
      }

      await deleteUser(auth.currentUser)
      alert(t.accountDeletedSuccess)
      setScreen('welcome')
    } catch (err) {
      console.error(err)
      if (err.code === 'auth/requires-recent-login') {
        alert(t.reauthRequired)
      } else {
        alert(t.genericAuthError)
      }
    }
  }

  const fetchProfile = async () => {
    if (!auth.currentUser) {
      setScreen('login')
      return
    }
    setLoadingProfile(true)
    setProfileData(null)
    setProfileType(null)
    try {
      const uid = auth.currentUser.uid

      const seekerQ = query(collection(db, 'seekers'), where('uid', '==', uid))
      const seekerSnap = await getDocs(seekerQ)
      if (!seekerSnap.empty) {
        setProfileData({ ...seekerSnap.docs[0].data(), _docId: seekerSnap.docs[0].id })
        setProfileType('seeker')
        return
      }

      const expertQ = query(collection(db, 'experts'), where('uid', '==', uid))
      const expertSnap = await getDocs(expertQ)
      if (!expertSnap.empty) {
        setProfileData({ ...expertSnap.docs[0].data(), _docId: expertSnap.docs[0].id })
        setProfileType('expert')
      }
    } catch (err) {
      console.error(err)
    } finally {
      setLoadingProfile(false)
    }
  }

  const startEditField = (field, currentValue) => {
    setEditingField(field)
    setEditValue(currentValue || '')
  }

  const cancelEditField = () => {
    setEditingField(null)
    setEditValue('')
  }

  const saveEditField = async (field) => {
    if (!profileData || !profileData._docId || !profileType) return
    setSavingField(true)
    try {
      const collectionName = profileType === 'seeker' ? 'seekers' : 'experts'
      await updateDoc(doc(db, collectionName, profileData._docId), { [field]: editValue })
      setProfileData((prev) => ({ ...prev, [field]: editValue }))
      setEditingField(null)
      setEditValue('')
    } catch (err) {
      console.error(err)
      alert(t.genericAuthError)
    } finally {
      setSavingField(false)
    }
  }

  const fetchApprovedExperts = async () => {
    setLoadingExperts(true)
    try {
      const q = query(collection(db, 'experts'), where('status', '==', 'approved'))
      const snap = await getDocs(q)
      const list = snap.docs.map((d) => ({ id: d.id, ...d.data() }))
      setRealExperts(list)
    } catch (err) {
      console.error(err)
    } finally {
      setLoadingExperts(false)
    }
  }

  // 🆕 يجيب كل الحجوزات المقيّمة ويحسب متوسط كل خبير
  const fetchAllRatings = async () => {
    try {
      const q = query(collection(db, 'bookings'), where('rating', '>', 0))
      const snap = await getDocs(q)
      const map = {}
      snap.docs.forEach((d) => {
        const data = d.data()
        if (!map[data.expertName]) {
          map[data.expertName] = { total: 0, count: 0 }
        }
        map[data.expertName].total += data.rating
        map[data.expertName].count += 1
      })
      const finalMap = {}
      Object.keys(map).forEach((name) => {
        finalMap[name] = {
          avg: (map[name].total / map[name].count).toFixed(1),
          count: map[name].count,
        }
      })
      setExpertRatingsMap(finalMap)
    } catch (err) {
      console.error(err)
    }
  }

  useEffect(() => {
    fetchApprovedExperts()
    fetchAllRatings()
  }, [])

  // 🆕 يجيب تقييمات خبير معين لعرضها بصفحة تفاصيله
  const fetchExpertReviews = async (expertName) => {
    setLoadingReviews(true)
    setExpertReviews([])
    try {
      const q = query(collection(db, 'bookings'), where('expertName', '==', expertName))
      const snap = await getDocs(q)
      const list = snap.docs
        .map((d) => d.data())
        .filter((d) => d.rating)
        .sort((a, b) => (b.ratedAt?.seconds || 0) - (a.ratedAt?.seconds || 0))
      setExpertReviews(list)
    } catch (err) {
      console.error(err)
    } finally {
      setLoadingReviews(false)
    }
  }

  const fetchExpertBookings = async (expertName) => {
    setLoadingExpertBookings(true)
    try {
      const q = query(collection(db, 'bookings'), where('expertName', '==', expertName))
      const snap = await getDocs(q)
      const list = snap.docs.map((d) => ({ id: d.id, ...d.data() }))
      setExpertBookings(list)
    } catch (err) {
      console.error(err)
    } finally {
      setLoadingExpertBookings(false)
    }
  }

  const handleUpdateBookingStatus = async (bookingId, newStatus) => {
    try {
      await updateDoc(doc(db, 'bookings', bookingId), { status: newStatus })
      setExpertBookings((prev) =>
        prev.map((b) => (b.id === bookingId ? { ...b, status: newStatus } : b))
      )
    } catch (err) {
      console.error(err)
      alert(t.genericAuthError)
    }
  }

  const handleStartAccept = (bookingId) => {
    setConfirmingBookingId(bookingId)
    setMeetingLinkInput('')
  }

  const handleCancelAccept = () => {
    setConfirmingBookingId(null)
    setMeetingLinkInput('')
  }

  const handleConfirmWithLink = async (booking) => {
    if (!meetingLinkInput.trim()) {
      alert(t.missingMeetingLink)
      return
    }
    setSendingConfirmation(true)
    try {
      await updateDoc(doc(db, 'bookings', booking.id), {
        status: 'confirmed',
        meetingLink: meetingLinkInput.trim(),
      })
      setExpertBookings((prev) =>
        prev.map((b) =>
          b.id === booking.id
            ? { ...b, status: 'confirmed', meetingLink: meetingLinkInput.trim() }
            : b
        )
      )

      await emailjs.send(
        EMAILJS_SERVICE_ID,
        EMAILJS_TEMPLATE_ID,
        {
          to_email: booking.requesterEmail,
          expert_name: booking.expertName,
          booking_date: booking.date,
          booking_time: formatTimeLabel(booking.time),
          meeting_link: meetingLinkInput.trim(),
        },
        EMAILJS_PUBLIC_KEY
      )

      setConfirmingBookingId(null)
      setMeetingLinkInput('')
    } catch (err) {
      console.error(err)
      alert(t.genericAuthError)
    } finally {
      setSendingConfirmation(false)
    }
  }

  const handleBookingSubmit = async () => {
    if (!auth.currentUser) {
      alert(t.loginRequiredForBooking)
      setScreen('login')
      return
    }
    if (!bookingDate || !bookingTime) {
      alert(t.requiredFieldsMissing)
      return
    }
    if (!hasMaterial) {
      alert(t.materialRequiredMissing)
      return
    }
    try {
      const conflictQuery = query(
        collection(db, 'bookings'),
        where('expertName', '==', selectedExpert.name),
        where('date', '==', bookingDate),
        where('time', '==', bookingTime)
      )
      const conflictSnap = await getDocs(conflictQuery)
      const hasConflict = conflictSnap.docs.some((d) => d.data().status !== 'cancelled')
      if (hasConflict) {
        alert(t.slotTakenMessage)
        return
      }

      await addDoc(collection(db, 'bookings'), {
        expertName: selectedExpert.name,
        expertField: selectedExpert.field,
        date: bookingDate,
        time: bookingTime,
        note: bookingNote,
        hasMaterial: hasMaterial,
        materialComment: hasMaterial === 'no' ? materialComment : '',
        requesterEmail: auth.currentUser.email,
        requesterUid: auth.currentUser.uid,
        status: 'pending',
        createdAt: serverTimestamp(),
      })
      setBookingSubmitted(true)
    } catch (err) {
      console.error(err)
      alert(t.genericAuthError)
    }
  }

  const fetchBookedSlots = async (date) => {
    if (!date || !selectedExpert) return
    try {
      const q = query(
        collection(db, 'bookings'),
        where('expertName', '==', selectedExpert.name),
        where('date', '==', date)
      )
      const snap = await getDocs(q)
      const taken = snap.docs
        .filter((d) => d.data().status !== 'cancelled')
        .map((d) => d.data().time)
      setBookedSlotsForDate(taken)
    } catch (err) {
      console.error(err)
    }
  }
  const fetchMyBookings = async () => {
    if (!auth.currentUser) {
      setScreen('login')
      return
    }
    setLoadingBookings(true)
    try {
      const q = query(collection(db, 'bookings'), where('requesterUid', '==', auth.currentUser.uid))
      const snap = await getDocs(q)
      const list = snap.docs.map((d) => ({ id: d.id, ...d.data() }))
      setMyBookings(list)
    } catch (err) {
      console.error(err)
      alert(t.genericAuthError)
    } finally {
      setLoadingBookings(false)
    }
  }

  // 🆕 يبدأ عملية تقييم حجز معين
  const startRating = (bookingId) => {
    setRatingBookingId(bookingId)
    setRatingValue(0)
    setRatingCommentInput('')
  }

  const cancelRating = () => {
    setRatingBookingId(null)
    setRatingValue(0)
    setRatingCommentInput('')
  }

  // 🆕 يحفظ التقييم بالحجز نفسه
  const submitRating = async (booking) => {
    if (ratingValue === 0) {
      alert(t.ratingRequiredMissing)
      return
    }
    setSubmittingRating(true)
    try {
      await updateDoc(doc(db, 'bookings', booking.id), {
        rating: ratingValue,
        ratingComment: ratingCommentInput.trim(),
        ratedAt: serverTimestamp(),
      })
      setMyBookings((prev) =>
        prev.map((b) =>
          b.id === booking.id
            ? { ...b, rating: ratingValue, ratingComment: ratingCommentInput.trim() }
            : b
        )
      )
      setRatingBookingId(null)
      setRatingValue(0)
      setRatingCommentInput('')
      fetchAllRatings()
    } catch (err) {
      console.error(err)
      alert(t.genericAuthError)
    } finally {
      setSubmittingRating(false)
    }
  }

  const renderEditableField = (label, field, value, note) => (
    <div className="review-card" key={field}>
      <div className="review-header">
        <span className="review-name">{label}</span>
        {editingField !== field && (
          <i
            className="ti ti-pencil"
            style={{ cursor: 'pointer', color: '#8a5bff', fontSize: '17px' }}
            onClick={() => startEditField(field, value)}
          ></i>
        )}
      </div>

      {editingField === field ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginTop: '8px' }}>
          <input
            type="text"
            value={editValue}
            onChange={(e) => setEditValue(e.target.value)}
            style={{
              width: '100%',
              padding: '10px 12px',
              borderRadius: '8px',
              border: '1px solid rgba(255,255,255,0.15)',
              background: 'rgba(255,255,255,0.05)',
              color: 'white',
              fontSize: '14px',
              outline: 'none',
              fontFamily: 'inherit',
            }}
          />
          {note && <p className="otp-hint" style={{ margin: 0 }}>{note}</p>}
          <div className="booking-actions" style={{ marginTop: 0 }}>
            <button className="btn-secondary" onClick={cancelEditField} disabled={savingField}>
              {t.cancelConfirm}
            </button>
            <button className="btn-primary" onClick={() => saveEditField(field)} disabled={savingField}>
              {t.save}
            </button>
          </div>
        </div>
      ) : (
        <p className="review-comment">{value || '—'}</p>
      )}
    </div>
  )

  // 🆕 صفوف النجوم القابلة للضغط
const renderStarPicker = () => (
    <div style={{ display: 'flex', gap: '8px', fontSize: '34px', direction: 'ltr' }}>
      {[1, 2, 3, 4, 5].map((star) => (
        <span
          key={star}
          style={{
            color: star <= ratingValue ? '#ffb800' : '#555',
            cursor: 'pointer',
            transition: '0.15s',
            lineHeight: 1,
            display: 'inline-block',
          }}
          onClick={() => setRatingValue(star)}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'scale(1.15)'
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'scale(1)'
          }}
        >
          ★
        </span>
      ))}
    </div>
  )

  const renderExpertCard = (exp) => {
    const ratingInfo = expertRatingsMap[exp.name]
    return (
      <div
        className="expert-card"
        key={exp.id}
        onClick={() => {
          setSelectedExpert(exp)
          setScreen('expertDetail')
          fetchExpertReviews(exp.name)
        }}
        style={{ cursor: 'pointer' }}
      >
        <div className="expert-avatar">
          <i className="ti ti-user"></i>
        </div>
        <h4>{exp.name}</h4>
        <p className="expert-field">{exp.jobTitle || exp.field}</p>
        <div className="expert-meta">
          {ratingInfo && (
            <span>
              ★ {ratingInfo.avg} ({ratingInfo.count})
            </span>
          )}
          {exp.company && (
            <span>
              <i className="ti ti-building"></i> {exp.company}
            </span>
          )}
        </div>
      </div>
    )
  }

  return (
    <div className="app-container" dir={language === 'ar' ? 'rtl' : 'ltr'}>
      <div className="language-switch">
        <button
          className={language === 'ar' ? 'active' : ''}
          onClick={() => setLanguage('ar')}
        >
          عربي
        </button>
        <button
          className={language === 'en' ? 'active' : ''}
          onClick={() => setLanguage('en')}
        >
          English
        </button>
      </div>

      {screen === 'welcome' && (
        <div className="hero-screen">
          <div className="hero-top">
            <span className="hero-login-link" onClick={() => setScreen('login')}>
              {t.haveAccount} <b>{t.login}</b>
            </span>
          </div>

          <div className="hero-content">
            <div className="hero-text">
              <div className="hero-logo-row">
                <div className="logo-circle small">
                  <i className="ti ti-compass"></i>
                </div>
                <span className="hero-brand">{t.appName}</span>
              </div>

              <h1 className="hero-title">{t.heroTitle}</h1>
              <p className="hero-description">{t.heroDescription}</p>

              <div className="hero-buttons">
                <button className="btn-primary" onClick={() => setScreen('studentForm')}>
                  {t.findExpert}
                </button>
                <button className="btn-secondary" onClick={() => setScreen('expertForm')}>
                  {t.joinAsExpert}
                </button>
              </div>

              <div className="hero-trust">
                <span><i className="ti ti-shield-check"></i> {t.trust1}</span>
                <span><i className="ti ti-lock"></i> {t.trust2}</span>
                <span><i className="ti ti-calendar-time"></i> {t.trust3}</span>
              </div>
            </div>

            <div className="hero-illustration">
              <div className="hero-blob"></div>
              <div className="hero-bubble center">
                <i className="ti ti-message-2"></i>
              </div>
              <div className="hero-bubble top-left">
                <i className="ti ti-user"></i>
              </div>
              <div className="hero-bubble bottom-right">
                <i className="ti ti-user-star"></i>
              </div>
              <div className="hero-dot dot-1"></div>
              <div className="hero-dot dot-2"></div>
              <div className="hero-dot dot-3"></div>
            </div>
          </div>
        </div>
      )}

      {screen === 'studentForm' && (
        <div className="form-screen">
          <button className="back-btn" onClick={() => setScreen('welcome')}>
            <i className="ti ti-arrow-right"></i> {t.back}
          </button>

          <h2>{t.seekerFormTitle}</h2>

          <div className="form-fields">
            <div className="form-group">
              <label>{t.name}</label>
              <input
                type="text"
                value={studentData.name}
                onChange={(e) => handleStudentChange('name', e.target.value)}
              />
            </div>

            <div className="form-group">
              <label>{t.university}</label>
              <input
                type="text"
                value={studentData.university}
                onChange={(e) => handleStudentChange('university', e.target.value)}
              />
            </div>

            <div className="form-group">
              <label>{t.major}</label>
              <input
                type="text"
                value={studentData.major}
                onChange={(e) => handleStudentChange('major', e.target.value)}
              />
            </div>

            <div className="form-group">
              <label>{t.gradYear}</label>
              <input
                type="text"
                value={studentData.gradYear}
                onChange={(e) => handleStudentChange('gradYear', e.target.value)}
              />
            </div>

            <div className="form-group">
              <label>{t.email}</label>
              <input
                type="email"
                dir="ltr"
                placeholder={t.emailPlaceholder}
                value={studentData.email}
                onChange={(e) => handleStudentChange('email', e.target.value)}
              />
            </div>

            <div className="form-group">
              <label>{t.password}</label>
              <input
                type="password"
                dir="ltr"
                value={studentData.password}
                onChange={(e) => handleStudentChange('password', e.target.value)}
              />
              <p className="otp-hint">{t.passwordHint}</p>
            </div>

            <div className="form-group">
              <label>{t.uploadCV}</label>
              <label className="file-upload">
                <i className="ti ti-upload"></i> {t.chooseFile}
                <input type="file" hidden />
              </label>
            </div>

            <button className="btn-primary full-width" onClick={handleStudentContinue}>
              {t.continue}
            </button>
          </div>
        </div>
      )}

      {screen === 'expertForm' && (
        <div className="form-screen">
          <button className="back-btn" onClick={() => setScreen('welcome')}>
            <i className="ti ti-arrow-right"></i> {t.back}
          </button>

          <h2>{t.expertFormTitle}</h2>

          <div className="form-fields">
            <div className="form-group">
              <label>{t.name}</label>
              <input
                type="text"
                value={expertData.name}
                onChange={(e) => handleExpertChange('name', e.target.value)}
              />
            </div>

            <div className="form-group">
              <label>{t.company}</label>
              <input
                type="text"
                value={expertData.company}
                onChange={(e) => handleExpertChange('company', e.target.value)}
              />
            </div>

            <div className="form-group">
              <label>{t.jobTitle}</label>
              <input
                type="text"
                value={expertData.jobTitle}
                onChange={(e) => handleExpertChange('jobTitle', e.target.value)}
              />
            </div>

            <div className="form-group">
              <label>{t.experience}</label>
              <input
                type="text"
                value={expertData.experience}
                onChange={(e) => handleExpertChange('experience', e.target.value)}
              />
            </div>

            <div className="form-group">
              <label>{t.field}</label>
              <select
                value={expertData.field}
                onChange={(e) => handleExpertChange('field', e.target.value)}
              >
                <option value="">{language === 'ar' ? 'اختر القسم' : 'Select category'}</option>
                {categories.map((cat, i) => (
                  <option key={i} value={cat.name}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label>{t.bio}</label>
              <textarea
                value={expertData.bio}
                onChange={(e) => handleExpertChange('bio', e.target.value)}
                rows="4"
              ></textarea>
            </div>

            <div className="form-group">
              <label>{t.email}</label>
              <input
                type="email"
                dir="ltr"
                placeholder={t.emailPlaceholder}
                value={expertData.email}
                onChange={(e) => handleExpertChange('email', e.target.value)}
              />
            </div>

            <div className="form-group">
              <label>{t.password}</label>
              <input
                type="password"
                dir="ltr"
                value={expertData.password}
                onChange={(e) => handleExpertChange('password', e.target.value)}
              />
              <p className="otp-hint">{t.passwordHint}</p>
            </div>

            <div className="form-group">
              <label>{t.uploadProof}</label>
              <label className="file-upload">
                <i className="ti ti-upload"></i> {t.chooseFile}
                <input type="file" hidden />
              </label>
            </div>

            <p className="review-note">
              <i className="ti ti-info-circle"></i> {t.reviewNote}
            </p>

            <button className="btn-primary full-width" onClick={handleExpertContinue}>
              {t.continue}
            </button>
          </div>
        </div>
      )}

      {screen === 'pending' && (
        <div className="pending-screen">
          <div className="pending-icon">
            <i className="ti ti-clock-hour-4"></i>
          </div>
          <h2>{t.pendingTitle}</h2>
          <p>{t.pendingMessage}</p>
          <button className="btn-secondary" onClick={() => setScreen('welcome')}>
            {t.backHome}
          </button>
        </div>
      )}

      {screen === 'home' && (
        <div className="home-page">
          <div className="home-header">
            <div className="pending-icon small">
              <i className="ti ti-circle-check"></i>
            </div>
            <h2>{t.registeredSuccess}</h2>
            <span
              className="my-bookings-btn"
              onClick={() => {
                setScreen('profile')
                fetchProfile()
              }}
            >
              <i className="ti ti-user-circle"></i> {t.myProfile}
            </span>
            <span
              className="my-bookings-btn"
              onClick={() => {
                setScreen('myBookings')
                fetchMyBookings()
              }}
            >
              <i className="ti ti-calendar-event"></i> {t.myBookings}
            </span>
          </div>

          <div className="home-section">
            <div className="home-section-title">
              <h3>{t.topExperts}</h3>
              <span>{t.viewAll}</span>
            </div>
            {loadingExperts ? (
              <p className="no-results">{t.loadingText}</p>
            ) : realExperts.length > 0 ? (
              <div className="experts-grid">{realExperts.map((exp) => renderExpertCard(exp))}</div>
            ) : (
              <p className="no-results">{t.noExpertsYet}</p>
            )}
          </div>

          <div className="home-section">
            <div className="home-section-title">
              <h3>{t.specialties}</h3>
              <span
                onClick={() => {
                  setSpecialtySearch('')
                  setScreen('allSpecialties')
                }}
                style={{ cursor: 'pointer' }}
              >
                {t.viewAll}
              </span>
            </div>
            <div className="category-list">
              {categories.slice(0, 4).map((cat, i) => (
                <div
                  className="category-row"
                  key={i}
                  onClick={() => {
                    setSelectedCategory(cat)
                    setScreen('categoryDetail')
                  }}
                >
                  <div className="category-row-left">
                    <div className="category-row-icon">
                      <i className={`ti ${cat.icon}`}></i>
                    </div>
                    <span>{cat.name}</span>
                  </div>
                  <i className="ti ti-chevron-left category-row-arrow"></i>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {screen === 'profile' && (
        <div className="all-specialties-screen">
          <button
            className="back-btn"
            onClick={() => {
              setEditingField(null)
              setScreen(profileType === 'expert' ? 'expertDashboard' : 'home')
            }}
          >
            <i className="ti ti-arrow-right"></i> {t.back}
          </button>

          <h2>{t.myProfile}</h2>

          {loadingProfile ? (
            <p className="no-results">{t.loadingText}</p>
          ) : profileData ? (
            <div className="expert-detail-screen" style={{ width: '100%', maxWidth: '480px' }}>
              <div className="expert-detail-header">
                <div className="expert-avatar large">
                  <i className="ti ti-user"></i>
                </div>
                <h2>{profileData.name}</h2>
                <p className="expert-field">
                  {profileType === 'expert' ? t.expert : t.seeker}
                </p>
              </div>

              <div className="category-list">
                {renderEditableField(t.name, 'name', profileData.name)}

                {profileType === 'seeker' && (
                  <>
                    {renderEditableField(t.university, 'university', profileData.university)}
                    {renderEditableField(t.major, 'major', profileData.major)}
                    {renderEditableField(t.gradYear, 'gradYear', profileData.gradYear)}
                  </>
                )}

                {profileType === 'expert' && (
                  <>
                    {renderEditableField(t.company, 'company', profileData.company)}
                    {renderEditableField(t.jobTitle, 'jobTitle', profileData.jobTitle)}
                    {renderEditableField(t.experience, 'experience', profileData.experience)}
                    {renderEditableField(t.field, 'field', profileData.field)}
                    {renderEditableField(t.bio, 'bio', profileData.bio)}
                  </>
                )}

                {renderEditableField(t.email, 'email', profileData.email, t.emailEditNote)}
              </div>

              <button
                className="btn-secondary full-width"
                style={{
                  marginTop: '20px',
                  borderColor: '#f87171',
                  color: '#f87171',
                  background: 'rgba(248,113,113,0.08)',
                }}
                onClick={handleDeleteAccount}
              >
                <i className="ti ti-trash"></i> {t.deleteAccount}
              </button>
            </div>
          ) : (
            <p className="no-results">{t.profileNoData}</p>
          )}
        </div>
      )}

      {screen === 'allSpecialties' && (
        <div className="all-specialties-screen">
          <button className="back-btn" onClick={() => setScreen('home')}>
            <i className="ti ti-arrow-right"></i> {t.back}
          </button>

          <h2>{t.allSpecialties}</h2>

          <div className="search-box">
            <i className="ti ti-search"></i>
            <input
              type="text"
              placeholder={t.searchSpecialty}
              value={specialtySearch}
              onChange={(e) => setSpecialtySearch(e.target.value)}
            />
          </div>

          {filteredCategories.length > 0 ? (
            <div className="category-list">
              {filteredCategories.map((cat, i) => (
                <div
                  className="category-row"
                  key={i}
                  onClick={() => {
                    setSelectedCategory(cat)
                    setScreen('categoryDetail')
                  }}
                >
                  <div className="category-row-left">
                    <div className="category-row-icon">
                      <i className={`ti ${cat.icon}`}></i>
                    </div>
                    <span>{cat.name}</span>
                  </div>
                  <i className="ti ti-chevron-left category-row-arrow"></i>
                </div>
              ))}
            </div>
          ) : (
            <p className="no-results">{t.noResults}</p>
          )}
        </div>
      )}

      {screen === 'categoryDetail' && selectedCategory && (
        <div className="all-specialties-screen">
          <button className="back-btn" onClick={() => setScreen('allSpecialties')}>
            <i className="ti ti-arrow-right"></i> {t.back}
          </button>

          <h2>{t.expertsIn} {selectedCategory.name}</h2>

          {expertsForCategory.length > 0 ? (
            <div className="experts-grid">{expertsForCategory.map((exp) => renderExpertCard(exp))}</div>
          ) : (
            <p className="no-results">{t.noExpertsYet}</p>
          )}
        </div>
      )}

      {screen === 'expertDetail' && selectedExpert && (
        <div className="expert-detail-screen">
          <button
            className="back-btn"
            onClick={() => {
              setShowBookingForm(false)
              setBookingSubmitted(false)
              setBookingDate('')
              setBookingTime('')
              setBookingNote('')
              setHasMaterial(null)
              setMaterialComment('')
              setScreen('home')
            }}
          >
            <i className="ti ti-arrow-right"></i> {t.back}
          </button>

          <div className="expert-detail-header">
            <div className="expert-avatar large">
              <i className="ti ti-user"></i>
            </div>
            <h2>{selectedExpert.name}</h2>
            <p className="expert-field">{selectedExpert.jobTitle || selectedExpert.field}</p>
            <div className="expert-meta">
              {expertRatingsMap[selectedExpert.name] && (
                <span>
                  ★
                  {expertRatingsMap[selectedExpert.name].avg} (
                  {expertRatingsMap[selectedExpert.name].count} {t.reviewsCount})
                </span>
              )}
              {selectedExpert.company && (
                <span>
                  <i className="ti ti-building"></i> {selectedExpert.company}
                </span>
              )}
              {selectedExpert.experience && (
                <span>
                  <i className="ti ti-briefcase"></i> {selectedExpert.experience}
                </span>
              )}
            </div>
          </div>

          <p className="expert-detail-bio">{selectedExpert.bio}</p>

          {bookingSubmitted ? (
            <div className="booking-success">
              <div className="pending-icon small">
                <i className="ti ti-circle-check"></i>
              </div>
              <h3>{t.bookingSuccessTitle}</h3>
              <p>{t.bookingSuccessMessage}</p>
            </div>
          ) : showBookingForm ? (
            <div className="booking-form">
              <h3>{t.selectDateTime}</h3>
              <div className="form-group">
                <label>{t.date}</label>
                <input
                  type="date"
                  value={bookingDate}
                  onChange={(e) => {
                    setBookingDate(e.target.value)
                    setBookingTime('')
                    fetchBookedSlots(e.target.value)
                  }}
                />
              </div>
              <div className="form-group">
                <label>{t.time}</label>
                <div className="custom-select">
                  <button
                    type="button"
                    className="custom-select-trigger"
                    onClick={() => setTimeDropdownOpen(!timeDropdownOpen)}
                  >
                    <span>{bookingTime ? formatTimeLabel(bookingTime) : t.selectTimePlaceholder}</span>
                    <i className="ti ti-chevron-down"></i>
                  </button>
                  {timeDropdownOpen && (
                    <div className="custom-select-options">
                      {timeSlots.map((slot) => {
                        const isTaken = bookedSlotsForDate.includes(slot)
                        return (
                          <div
                            key={slot}
                            className={`custom-select-option ${bookingTime === slot ? 'selected' : ''} ${
                              isTaken ? 'taken' : ''
                            }`}
                            onClick={() => {
                              if (isTaken) return
                              setBookingTime(slot)
                              setTimeDropdownOpen(false)
                            }}
                          >
                            {formatTimeLabel(slot)}
                          </div>
                        )
                      })}
                    </div>
                  )}
                </div>
              </div>

              <div className="form-group">
                <label>{t.hasMaterialQuestion}</label>
                <div className="booking-actions" style={{ marginTop: 0 }}>
                  <button
                    type="button"
                    className={hasMaterial === 'yes' ? 'btn-primary' : 'btn-secondary'}
                    onClick={() => {
                      setHasMaterial('yes')
                      setMaterialComment('')
                    }}
                  >
                    {t.materialYes}
                  </button>
                  <button
                    type="button"
                    className={hasMaterial === 'no' ? 'btn-primary' : 'btn-secondary'}
                    onClick={() => setHasMaterial('no')}
                  >
                    {t.materialNo}
                  </button>
                </div>
              </div>

              {hasMaterial === 'no' && (
                <div className="form-group">
                  <label>{t.materialCommentLabel}</label>
                  <textarea
                    rows="3"
                    placeholder={t.materialCommentPlaceholder}
                    value={materialComment}
                    onChange={(e) => setMaterialComment(e.target.value)}
                  ></textarea>
                </div>
              )}

              <div className="form-group">
                <label>{t.note}</label>
                <textarea
                  rows="3"
                  placeholder={t.notePlaceholder}
                  value={bookingNote}
                  onChange={(e) => setBookingNote(e.target.value)}
                ></textarea>
              </div>
              <div className="booking-actions">
                <button className="btn-secondary" onClick={() => setShowBookingForm(false)}>
                  {t.cancelBooking}
                </button>
                <button className="btn-primary" onClick={handleBookingSubmit}>
                  {t.confirmBooking}
                </button>
              </div>
            </div>
          ) : (
            <button className="btn-primary full-width" onClick={() => setShowBookingForm(true)}>
              {t.bookSession}
            </button>
          )}

          <div className="reviews-section">
            <h3>{t.reviewsTitle}</h3>
            {loadingReviews ? (
              <p className="no-results">{t.loadingText}</p>
            ) : expertReviews.length > 0 ? (
              expertReviews.map((review, i) => (
                <div className="review-card" key={i}>
                  <div className="review-header">
                    <span className="review-name">{t.anonymousReviewer}</span>
                    <span className="review-rating" style={{ direction: 'ltr' }}>
                      {[1, 2, 3, 4, 5].map((s) => (
                        <span key={s} style={{ color: s <= review.rating ? '#ffb800' : '#555' }}>
                          ★
                        </span>
                      ))}
                    </span>
                  </div>
                  {review.ratingComment && <p className="review-comment">{review.ratingComment}</p>}
                </div>
              ))
            ) : (
              <p className="no-results">{t.noReviewsYet}</p>
            )}
          </div>
        </div>
      )}

      {screen === 'myBookings' && (
        <div className="all-specialties-screen">
          <button className="back-btn" onClick={() => setScreen('home')}>
            <i className="ti ti-arrow-right"></i> {t.back}
          </button>

          <h2>{t.myBookings}</h2>

          {loadingBookings ? (
            <p className="no-results">{t.loadingText}</p>
          ) : myBookings.length > 0 ? (
            <div className="category-list">
              {myBookings.map((b) => (
                <div className="review-card" key={b.id}>
                  <div className="review-header">
                    <span className="review-name">{b.expertName}</span>
                    <span className={`booking-status ${b.status}`}>
                      {b.status === 'confirmed' ? t.bookingStatusConfirmed : t.bookingStatusPending}
                    </span>
                  </div>
                  <p className="review-comment">
                    {b.date} — {formatTimeLabel(b.time)}
                  </p>
                  {b.note && <p className="review-comment">{b.note}</p>}
                  {b.hasMaterial === 'no' && b.materialComment && (
                    <p className="review-comment">
                      <i className="ti ti-book-off"></i> {t.materialCommentLabel} {b.materialComment}
                    </p>
                  )}
                  {b.status === 'confirmed' && b.meetingLink && (
                    <p className="review-comment">
                      <i className="ti ti-video"></i> {t.joinMeeting}:{' '}
                      <a href={b.meetingLink} target="_blank" rel="noreferrer">
                        {b.meetingLink}
                      </a>
                    </p>
                  )}

                  {b.status === 'confirmed' && !b.rating && ratingBookingId !== b.id && (
                    <button
                      className="btn-secondary full-width small"
                      onClick={() => startRating(b.id)}
                    >
                      <i className="ti ti-star"></i> {t.rateSession}
                    </button>
                  )}

                  {b.status === 'confirmed' && ratingBookingId === b.id && (
                    <div className="form-group" style={{ marginTop: '10px' }}>
                      <label>{t.yourRatingLabel}</label>
                      {renderStarPicker()}
                      <textarea
                        rows="2"
                        placeholder={t.ratingCommentPlaceholder}
                        value={ratingCommentInput}
                        onChange={(e) => setRatingCommentInput(e.target.value)}
                        style={{ marginTop: '10px' }}
                      ></textarea>
                      <div className="booking-actions">
                        <button className="btn-secondary" onClick={cancelRating} disabled={submittingRating}>
                          {t.cancelConfirm}
                        </button>
                        <button
                          className="btn-primary"
                          onClick={() => submitRating(b)}
                          disabled={submittingRating}
                        >
                          {t.submitRating}
                        </button>
                      </div>
                    </div>
                  )}

                  {b.rating && (
                    <p className="review-comment" style={{ direction: 'ltr', textAlign: 'right' }}>
                      {t.yourRatingSubmittedLabel}{' '}
                      {[1, 2, 3, 4, 5].map((s) => (
                        <span key={s} style={{ color: s <= b.rating ? '#ffb800' : '#555' }}>
                          ★
                        </span>
                      ))}
                    </p>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <p className="no-results">{t.myBookingsEmpty}</p>
          )}
        </div>
      )}

      {screen === 'expertDashboard' && (
        <div className="all-specialties-screen">
          <button className="back-btn" onClick={() => setScreen('welcome')}>
            <i className="ti ti-arrow-right"></i> {t.back}
          </button>

          <h2>{t.expertDashboardTitle}</h2>

          <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', marginBottom: '20px' }}>
            <span
              className="my-bookings-btn"
              style={{ position: 'static', display: 'inline-flex' }}
              onClick={() => {
                setScreen('profile')
                fetchProfile()
              }}
            >
              <i className="ti ti-user-circle"></i> {t.myProfile}
            </span>
          </div>

          {loadingExpertBookings ? (
            <p className="no-results">{t.loadingText}</p>
          ) : expertBookings.length > 0 ? (
            <div className="category-list">
              {expertBookings.map((b) => (
                <div className="review-card" key={b.id}>
                  <div className="review-header">
                    <span className="review-name">
                      {t.requesterLabel} {b.requesterEmail}
                    </span>
                    <span className={`booking-status ${b.status}`}>
                      {b.status === 'confirmed'
                        ? t.bookingStatusConfirmed
                        : b.status === 'cancelled'
                        ? t.bookingStatusCancelled
                        : t.bookingStatusPending}
                    </span>
                  </div>
                  <p className="review-comment">
                    {b.date} — {formatTimeLabel(b.time)}
                  </p>
                  {b.note && <p className="review-comment">{b.note}</p>}
                  {b.hasMaterial === 'no' && b.materialComment && (
                    <p className="review-comment">
                      <i className="ti ti-book-off"></i> {t.materialCommentLabel} {b.materialComment}
                    </p>
                  )}

                  {b.status === 'confirmed' && b.meetingLink && (
                    <p className="review-comment">
                      <i className="ti ti-video"></i> {t.joinMeeting}: {b.meetingLink}
                    </p>
                  )}

                  {b.rating && (
                    <p className="review-comment" style={{ direction: 'ltr', textAlign: 'right' }}>
                      {[1, 2, 3, 4, 5].map((s) => (
                        <span key={s} style={{ color: s <= b.rating ? '#ffb800' : '#555' }}>
                          ★
                        </span>
                      ))}
                      {b.ratingComment && <span> — {b.ratingComment}</span>}
                    </p>
                  )}

                  {b.status === 'pending' && confirmingBookingId === b.id && (
                    <div className="form-group">
                      <label>{t.meetingLinkLabel}</label>
                      <input
                        type="text"
                        dir="ltr"
                        placeholder={t.meetingLinkPlaceholder}
                        value={meetingLinkInput}
                        onChange={(e) => setMeetingLinkInput(e.target.value)}
                      />
                      <div className="booking-actions">
                        <button className="btn-secondary" onClick={handleCancelAccept}>
                          {t.cancelConfirm}
                        </button>
                        <button
                          className="btn-primary"
                          onClick={() => handleConfirmWithLink(b)}
                          disabled={sendingConfirmation}
                        >
                          {sendingConfirmation ? t.sendingConfirmationText : t.sendConfirmation}
                        </button>
                      </div>
                    </div>
                  )}

                  {b.status === 'pending' && confirmingBookingId !== b.id && (
                    <div className="booking-actions">
                      <button
                        className="btn-secondary"
                        onClick={() => handleUpdateBookingStatus(b.id, 'cancelled')}
                      >
                        {t.rejectBooking}
                      </button>
                      <button className="btn-primary" onClick={() => handleStartAccept(b.id)}>
                        {t.acceptBooking}
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <p className="no-results">{t.noBookingsForExpert}</p>
          )}
        </div>
      )}

      {screen === 'login' && (
        <div className="form-screen">
          <button className="back-btn" onClick={() => setScreen('welcome')}>
            <i className="ti ti-arrow-right"></i> {t.back}
          </button>

          <h2>{t.login}</h2>
          <p style={{ textAlign: 'center', color: '#aaa', marginBottom: '20px' }}>
            {t.loginSubtitle}
          </p>

          <div className="form-fields">
            <div className="form-group">
              <label>{t.email}</label>
              <input
                type="email"
                dir="ltr"
                placeholder={t.emailPlaceholder}
                value={loginEmail}
                onChange={(e) => setLoginEmail(e.target.value)}
              />
            </div>

            <div className="form-group">
              <label>{t.password}</label>
              <input
                type="password"
                dir="ltr"
                value={loginPassword}
                onChange={(e) => setLoginPassword(e.target.value)}
              />
              <p
                className="hero-login-link"
                style={{ textAlign: language === 'ar' ? 'left' : 'right', cursor: 'pointer' }}
                onClick={handleForgotPassword}
              >
                {t.forgotPassword}
              </p>
            </div>

            <button className="btn-primary full-width" onClick={handleLogin}>
              {t.login}
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export default App