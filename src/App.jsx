import { useState } from 'react'
import './App.css'
import {
  auth,
  db,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  collection,
  addDoc,
  serverTimestamp,
} from './firebase'

function App() {
  const [language, setLanguage] = useState('ar')
  const [screen, setScreen] = useState('welcome')
  const [specialtySearch, setSpecialtySearch] = useState('')
  const [selectedCategory, setSelectedCategory] = useState(null)
  const [selectedExpert, setSelectedExpert] = useState(null)

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
    },
  }

  const t = text[language]

  const mockExperts = [
    {
      name: 'أبو داحم',
      field: 'إدارة الأعمال',
      rating: 4.9,
      sessions: 32,
      bio: 'خبرة 12 سنة في إدارة الأعمال والمشاريع، عملت مع شركات كبرى في السعودية. أساعدك تفهم سوق العمل وتجهز نفسك صح للمقابلات.',
      reviews: [
        { name: 'سلطان', rating: 5, comment: 'ساعدني كثير في تجهيز نفسي للمقابلة، شرح واضح ومباشر.' },
        { name: 'نوف', rating: 5, comment: 'خبرة حقيقية، أعطاني نصائح عملية مب بس نظرية.' },
      ],
    },
    {
      name: 'الحب أبو خلود',
      field: 'هندسة برمجيات',
      rating: 4.8,
      sessions: 45,
      bio: 'مهندس برمجيات بخبرة 8 سنوات، عملت في شركات تقنية محلية وعالمية. أقدر أساعدك في تطوير مهاراتك التقنية ومراجعة السيرة الذاتية.',
      reviews: [
        { name: 'عبدالله', rating: 5, comment: 'جلسة ممتازة، وضح لي أشياء كثير كانت غامضة عندي.' },
        { name: 'ريم', rating: 4, comment: 'مفيد جداً، بس ودي الجلسة تطول شوي أكثر.' },
      ],
    },
    {
      name: 'الحب حصحص',
      field: 'تسويق رقمي',
      rating: 4.7,
      sessions: 28,
      bio: 'متخصصة في التسويق الرقمي وإدارة المحتوى، عملت مع عدة علامات تجارية سعودية. أحب أساعد الشباب يدخلون المجال بثقة.',
      reviews: [
        { name: 'فهد', rating: 5, comment: 'أعطتني خطة واضحة أبدأ فيها بالتسويق الرقمي.' },
        { name: 'لمى', rating: 4, comment: 'شرح زين ومنظم.' },
      ],
    },
  ]

  const categories = [
    { icon: 'ti-device-laptop', name: language === 'ar' ? 'حاسب وتقنية معلومات' : 'Computer & IT' },
    { icon: 'ti-settings', name: language === 'ar' ? 'الهندسة' : 'Engineering' },
    { icon: 'ti-briefcase', name: language === 'ar' ? 'إدارة وأعمال' : 'Business & Management' },
    { icon: 'ti-stethoscope', name: language === 'ar' ? 'طب وصحة' : 'Medical & Health' },
    { icon: 'ti-scale', name: language === 'ar' ? 'قانون' : 'Law' },
    { icon: 'ti-palette', name: language === 'ar' ? 'إعلام وتصميم' : 'Media & Design' },
    { icon: 'ti-school', name: language === 'ar' ? 'تعليم وتدريب' : 'Education & Training' },
    { icon: 'ti-users-group', name: language === 'ar' ? 'علوم اجتماعية وإنسانية' : 'Social Sciences' },
    { icon: 'ti-flask', name: language === 'ar' ? 'علوم طبيعية' : 'Natural Sciences' },
    { icon: 'ti-plane', name: language === 'ar' ? 'سياحة وضيافة' : 'Tourism & Hospitality' },
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

  const expertsForCategory = selectedCategory ? mockExperts : []

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
      await signInWithEmailAndPassword(auth, loginEmail, loginPassword)
      setScreen('home')
    } catch (err) {
      console.error(err)
      alert(t.loginErrorMessage)
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
    try {
      await addDoc(collection(db, 'bookings'), {
        expertName: selectedExpert.name,
        expertField: selectedExpert.field,
        date: bookingDate,
        time: bookingTime,
        note: bookingNote,
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
              <input
                type="text"
                value={expertData.field}
                onChange={(e) => handleExpertChange('field', e.target.value)}
              />
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
          </div>

          <div className="home-section">
            <div className="home-section-title">
              <h3>{t.topExperts}</h3>
              <span>{t.viewAll}</span>
            </div>
            <div className="experts-grid">
              {mockExperts.map((exp, i) => (
                <div
                  className="expert-card"
                  key={i}
                  onClick={() => {
                    setSelectedExpert(exp)
                    setScreen('expertDetail')
                  }}
                  style={{ cursor: 'pointer' }}
                >
                  <div className="expert-avatar">
                    <i className="ti ti-user"></i>
                  </div>
                  <h4>{exp.name}</h4>
                  <p className="expert-field">{exp.field}</p>
                  <div className="expert-meta">
                    <span><i className="ti ti-star-filled"></i> {exp.rating}</span>
                    <span>{exp.sessions} {t.sessions}</span>
                  </div>
                </div>
              ))}
            </div>
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
            <div className="experts-grid">
              {expertsForCategory.map((exp, i) => (
                <div className="expert-card" key={i}>
                  <div
                    onClick={() => {
                      setSelectedExpert(exp)
                      setScreen('expertDetail')
                    }}
                    style={{ cursor: 'pointer' }}
                  >
                    <div className="expert-avatar">
                      <i className="ti ti-user"></i>
                    </div>
                    <h4>{exp.name}</h4>
                    <p className="expert-field">{exp.field}</p>
                    <div className="expert-meta">
                      <span><i className="ti ti-star-filled"></i> {exp.rating}</span>
                      <span>{exp.sessions} {t.sessions}</span>
                    </div>
                  </div>
                  <button
                    className="btn-primary full-width small"
                    onClick={() => {
                      setSelectedExpert(exp)
                      setScreen('expertDetail')
                    }}
                  >
                    {t.bookSession}
                  </button>
                </div>
              ))}
            </div>
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
            <p className="expert-field">{selectedExpert.field}</p>
            <div className="expert-meta">
              <span><i className="ti ti-star-filled"></i> {selectedExpert.rating}</span>
              <span>{selectedExpert.sessions} {t.sessions}</span>
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
                  onChange={(e) => setBookingDate(e.target.value)}
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
                      {timeSlots.map((slot) => (
                        <div
                          key={slot}
                          className={`custom-select-option ${bookingTime === slot ? 'selected' : ''}`}
                          onClick={() => {
                            setBookingTime(slot)
                            setTimeDropdownOpen(false)
                          }}
                        >
                          {formatTimeLabel(slot)}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
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
            {selectedExpert.reviews.map((review, i) => (
              <div className="review-card" key={i}>
                <div className="review-header">
                  <span className="review-name">{review.name}</span>
                  <span className="review-rating">
                    <i className="ti ti-star-filled"></i> {review.rating}
                  </span>
                </div>
                <p className="review-comment">{review.comment}</p>
              </div>
            ))}
          </div>
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