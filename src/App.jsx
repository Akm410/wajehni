import { useState } from 'react'
import './App.css'

function App() {
  const [language, setLanguage] = useState('ar')
  const [screen, setScreen] = useState('welcome')
  const [specialtySearch, setSpecialtySearch] = useState('')
  const [selectedCategory, setSelectedCategory] = useState(null)
  const [studentData, setStudentData] = useState({
    name: '',
    university: '',
    major: '',
    gradYear: '',
    city: '',
    phone: '',
  })
  const [expertData, setExpertData] = useState({
    name: '',
    company: '',
    jobTitle: '',
    experience: '',
    field: '',
    bio: '',
    phone: '',
  })
  const [otpCode, setOtpCode] = useState('')
  const [otpInput, setOtpInput] = useState('')
  const [otpSent, setOtpSent] = useState(false)
  const [otpVerified, setOtpVerified] = useState(false)
  const [otpFor, setOtpFor] = useState('')

  const text = {
    ar: {
      appName: 'وجهني',
      tagline: 'تواصل مع خبراء مجالك',
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
      major: 'التخصص',
      gradYear: 'سنة التخرج',
      city: 'المدينة',
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
      phone: 'رقم الجوال',
      sendCode: 'إرسال الكود',
      otpSentMessage: 'تم إرسال كود التحقق إلى رقمك (وضع تجريبي، الكود ظاهر تحت)',
      demoCode: 'الكود التجريبي',
      enterCode: 'أدخل الكود المكوّن من 4 أرقام',
      verify: 'تحقق',
      verified: 'تم التحقق ✓',
      wrongCode: 'الكود غير صحيح، حاول مرة أخرى',
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
      major: 'Major',
      gradYear: 'Graduation Year',
      city: 'City',
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
      phone: 'Phone Number',
      sendCode: 'Send Code',
      otpSentMessage: 'A verification code has been sent (demo mode, code shown below)',
      demoCode: 'Demo Code',
      enterCode: 'Enter the 4-digit code',
      verify: 'Verify',
      verified: 'Verified ✓',
      wrongCode: 'Incorrect code, try again',
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

  const generateOtp = (forWhich) => {
    const code = Math.floor(1000 + Math.random() * 9000).toString()
    setOtpCode(code)
    setOtpSent(true)
    setOtpVerified(false)
    setOtpInput('')
    setOtpFor(forWhich)
  }

  const checkOtp = () => {
    if (otpInput === otpCode) {
      setOtpVerified(true)
    } else {
      alert(t.wrongCode)
    }
  }

  const handleStudentContinue = () => {
    if (!studentData.name.trim() || !studentData.university.trim() || !studentData.major.trim()) {
      alert(t.requiredFieldsMissing)
      return
    }
    setScreen('home')
  }

  const handleExpertContinue = () => {
    if (!expertData.name.trim() || !expertData.company.trim() || !expertData.jobTitle.trim()) {
      alert(t.requiredFieldsMissing)
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
        <div className="welcome-screen">
          <div className="logo-section">
            <div className="logo-circle">
              <i className="ti ti-compass"></i>
            </div>
            <h1>{t.appName}</h1>
            <p>{t.tagline}</p>
          </div>

          <div className="auth-buttons">
            <button className="btn-primary" onClick={() => setScreen('accountType')}>
              {t.signup}
            </button>
            <button className="btn-secondary" onClick={() => setScreen('login')}>
              {t.login}
            </button>
          </div>
        </div>
      )}

      {screen === 'accountType' && (
        <div className="account-type-screen">
          <button className="back-btn" onClick={() => setScreen('welcome')}>
            <i className="ti ti-arrow-right"></i> {t.back}
          </button>

          <h2>{t.chooseType}</h2>

          <div className="type-cards">
            <button className="type-card" onClick={() => setScreen('studentForm')}>
              <i className="ti ti-briefcase"></i>
              <span>{t.seeker}</span>
            </button>
            <button className="type-card" onClick={() => setScreen('expertForm')}>
              <i className="ti ti-star"></i>
              <span>{t.expert}</span>
            </button>
          </div>
        </div>
      )}

      {screen === 'studentForm' && (
        <div className="form-screen">
          <button className="back-btn" onClick={() => setScreen('accountType')}>
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
              <label>{t.city}</label>
              <input
                type="text"
                value={studentData.city}
                onChange={(e) => handleStudentChange('city', e.target.value)}
              />
            </div>

            <div className="form-group">
              <label>{t.phone}</label>
              <div className="phone-row">
                <input
                  type="text"
                  placeholder="05XXXXXXXX"
                  value={studentData.phone}
                  onChange={(e) => handleStudentChange('phone', e.target.value)}
                />
                <button
                  type="button"
                  className="btn-otp"
                  onClick={() => generateOtp('student')}
                >
                  {t.sendCode}
                </button>
              </div>
            </div>

            {otpSent && otpFor === 'student' && (
              <div className="otp-box">
                <p className="otp-hint">
                  {t.otpSentMessage} — {t.demoCode}: <b>{otpCode}</b>
                </p>
                <div className="phone-row">
                  <input
                    type="text"
                    maxLength="4"
                    placeholder={t.enterCode}
                    value={otpInput}
                    onChange={(e) => setOtpInput(e.target.value)}
                  />
                  <button type="button" className="btn-otp" onClick={checkOtp}>
                    {t.verify}
                  </button>
                </div>
                {otpVerified && <p className="otp-success">{t.verified}</p>}
              </div>
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
          <button className="back-btn" onClick={() => setScreen('accountType')}>
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
              <label>{t.phone}</label>
              <div className="phone-row">
                <input
                  type="text"
                  placeholder="05XXXXXXXX"
                  value={expertData.phone}
                  onChange={(e) => handleExpertChange('phone', e.target.value)}
                />
                <button
                  type="button"
                  className="btn-otp"
                  onClick={() => generateOtp('expert')}
                >
                  {t.sendCode}
                </button>
              </div>
            </div>

            {otpSent && otpFor === 'expert' && (
              <div className="otp-box">
                <p className="otp-hint">
                  {t.otpSentMessage} — {t.demoCode}: <b>{otpCode}</b>
                </p>
                <div className="phone-row">
                  <input
                    type="text"
                    maxLength="4"
                    placeholder={t.enterCode}
                    value={otpInput}
                    onChange={(e) => setOtpInput(e.target.value)}
                  />
                  <button type="button" className="btn-otp" onClick={checkOtp}>
                    {t.verify}
                  </button>
                </div>
                {otpVerified && <p className="otp-success">{t.verified}</p>}
              </div>
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