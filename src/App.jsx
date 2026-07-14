import { useState, useEffect } from 'react'
import './App.css'
import {
  auth,
  actionCodeSettings,
  sendSignInLinkToEmail,
  isSignInWithEmailLink,
  signInWithEmailLink,
} from './firebase'

function App() {
  const [language, setLanguage] = useState('ar')
  const [screen, setScreen] = useState('welcome')
  const [specialtySearch, setSpecialtySearch] = useState('')
  const [selectedCategory, setSelectedCategory] = useState(null)

  const [studentVerified, setStudentVerified] = useState(false)
  const [studentLinkSent, setStudentLinkSent] = useState(false)
  const [expertVerified, setExpertVerified] = useState(false)
  const [expertLinkSent, setExpertLinkSent] = useState(false)

  const [studentData, setStudentData] = useState({
    name: '',
    university: '',
    major: '',
    gradYear: '',
    email: '',
  })
  const [expertData, setExpertData] = useState({
    name: '',
    company: '',
    jobTitle: '',
    experience: '',
    field: '',
    bio: '',
    email: '',
  })

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
      sendVerificationLink: 'إرسال رابط التحقق',
      resendLink: 'إعادة الإرسال',
      sending: 'جاري الإرسال...',
      checkEmailMessage: 'افتح بريدك الإلكتروني واضغط على رابط التحقق. بعد الضغط بيرجع لك هذا التاب ويكمل تلقائياً.',
      emailVerifiedMsg: 'تم التحقق من بريدك ✓',
      verifyEmailFirst: 'الرجاء إرسال رابط التحقق والضغط عليه من بريدك قبل المتابعة',
      invalidEmailFormat: 'صيغة البريد الإلكتروني غير صحيحة',
      linkErrorMessage: 'صار خطأ أثناء التحقق، جرب ترسل الرابط مرة ثانية',
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
      requiredFieldsMissing: 'الرجاء تعبئة الاسم على الأقل قبل المتابعة',
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
      sendVerificationLink: 'Send Verification Link',
      resendLink: 'Resend',
      sending: 'Sending...',
      checkEmailMessage: 'Open your email and click the verification link. This tab will finish automatically once you do.',
      emailVerifiedMsg: 'Email verified ✓',
      verifyEmailFirst: 'Please send and click the verification link before continuing',
      invalidEmailFormat: 'Invalid email format',
      linkErrorMessage: 'Something went wrong verifying your email, try sending the link again',
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
      requiredFieldsMissing: 'Please fill in at least your name before continuing',
    },
  }

  const t = text[language]

  const mockExperts = [
    { name: 'أبو داحم', field: 'إدارة الأعمال', rating: 4.9, sessions: 32 },
    { name: 'الحب أبو خلود', field: 'هندسة برمجيات', rating: 4.8, sessions: 45 },
    { name: 'الحب حصحص', field: 'تسويق رقمي', rating: 4.7, sessions: 28 },
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

  // إرسال رابط التحقق الحقيقي عبر Firebase
  const sendVerificationEmail = async (formType) => {
    const email = formType === 'student' ? studentData.email : expertData.email

    if (!isValidEmail(email)) {
      alert(t.invalidEmailFormat)
      return
    }

    try {
      await sendSignInLinkToEmail(auth, email, actionCodeSettings)
      localStorage.setItem('emailForSignIn', email)
      localStorage.setItem('signupType', formType)
      localStorage.setItem(
        'formDraft',
        JSON.stringify(formType === 'student' ? studentData : expertData)
      )
      if (formType === 'student') {
        setStudentLinkSent(true)
      } else {
        setExpertLinkSent(true)
      }
    } catch (err) {
      console.error(err)
      alert(t.linkErrorMessage)
    }
  }

  // عند فتح الرابط اللي وصل بالإيميل، نكمل التحقق تلقائياً
  useEffect(() => {
    if (isSignInWithEmailLink(auth, window.location.href)) {
      let email = localStorage.getItem('emailForSignIn')
      if (!email) {
        email = window.prompt(t.email)
      }

      signInWithEmailLink(auth, email, window.location.href)
        .then(() => {
          const type = localStorage.getItem('signupType')
          const draftRaw = localStorage.getItem('formDraft')
          const draft = draftRaw ? JSON.parse(draftRaw) : null

          if (type === 'student') {
            setStudentData((prev) => ({ ...(draft || prev), email }))
            setStudentVerified(true)
            setScreen('studentForm')
          } else if (type === 'expert') {
            setExpertData((prev) => ({ ...(draft || prev), email }))
            setExpertVerified(true)
            setScreen('expertForm')
          }

          localStorage.removeItem('emailForSignIn')
          localStorage.removeItem('signupType')
          localStorage.removeItem('formDraft')
          window.history.replaceState({}, document.title, window.location.pathname)
        })
        .catch((err) => {
          console.error(err)
          alert(t.linkErrorMessage)
        })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const handleStudentContinue = () => {
    if (!studentData.name.trim() || !studentData.university.trim() || !studentData.major.trim()) {
      alert(t.requiredFieldsMissing)
      return
    }
    if (!studentVerified) {
      alert(t.verifyEmailFirst)
      return
    }
    setScreen('home')
  }

  const handleExpertContinue = () => {
    if (!expertData.name.trim() || !expertData.company.trim() || !expertData.jobTitle.trim()) {
      alert(t.requiredFieldsMissing)
      return
    }
    if (!expertVerified) {
      alert(t.verifyEmailFirst)
      return
    }
    setScreen('pending')
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
              <div
                className={`email-input-wrapper ${
                  studentData.email ? (isValidEmail(studentData.email) ? 'valid' : 'invalid') : ''
                }`}
              >
                <i className="ti ti-mail email-icon"></i>
                <input
                  type="email"
                  dir="ltr"
                  placeholder={t.emailPlaceholder}
                  value={studentData.email}
                  disabled={studentVerified}
                  onChange={(e) => handleStudentChange('email', e.target.value)}
                />
                {studentVerified && <i className="ti ti-circle-check email-check"></i>}
              </div>
            </div>

            {studentVerified ? (
              <p className="otp-success">{t.emailVerifiedMsg}</p>
            ) : (
              <>
                <button
                  type="button"
                  className="btn-secondary full-width"
                  disabled={!isValidEmail(studentData.email)}
                  onClick={() => sendVerificationEmail('student')}
                >
                  {studentLinkSent ? t.resendLink : t.sendVerificationLink}
                </button>
                {studentLinkSent && <p className="otp-hint">{t.checkEmailMessage}</p>}
              </>
            )}

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
              <div
                className={`email-input-wrapper ${
                  expertData.email ? (isValidEmail(expertData.email) ? 'valid' : 'invalid') : ''
                }`}
              >
                <i className="ti ti-mail email-icon"></i>
                <input
                  type="email"
                  dir="ltr"
                  placeholder={t.emailPlaceholder}
                  value={expertData.email}
                  disabled={expertVerified}
                  onChange={(e) => handleExpertChange('email', e.target.value)}
                />
                {expertVerified && <i className="ti ti-circle-check email-check"></i>}
              </div>
            </div>

            {expertVerified ? (
              <p className="otp-success">{t.emailVerifiedMsg}</p>
            ) : (
              <>
                <button
                  type="button"
                  className="btn-secondary full-width"
                  disabled={!isValidEmail(expertData.email)}
                  onClick={() => sendVerificationEmail('expert')}
                >
                  {expertLinkSent ? t.resendLink : t.sendVerificationLink}
                </button>
                {expertLinkSent && <p className="otp-hint">{t.checkEmailMessage}</p>}
              </>
            )}

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
                <div className="expert-card" key={i}>
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
                  <div className="expert-avatar">
                    <i className="ti ti-user"></i>
                  </div>
                  <h4>{exp.name}</h4>
                  <p className="expert-field">{exp.field}</p>
                  <div className="expert-meta">
                    <span><i className="ti ti-star-filled"></i> {exp.rating}</span>
                    <span>{exp.sessions} {t.sessions}</span>
                  </div>
                  <button className="btn-primary full-width small">{t.bookSession}</button>
                </div>
              ))}
            </div>
          ) : (
            <p className="no-results">{t.noExpertsYet}</p>
          )}
        </div>
      )}

      {screen === 'login' && (
        <div className="account-type-screen">
          <button className="back-btn" onClick={() => setScreen('welcome')}>
            <i className="ti ti-arrow-right"></i> {t.back}
          </button>
          <h2>{t.login}</h2>
          <p>هذي الشاشة بنكملها بعدين</p>
        </div>
      )}
    </div>
  )
}

export default App