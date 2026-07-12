import { useState } from 'react'
import './App.css'

function App() {
  const [language, setLanguage] = useState('ar')
  const [screen, setScreen] = useState('welcome')
  const [userType, setUserType] = useState('student')
  const [studentData, setStudentData] = useState({
    name: '',
    university: '',
    major: '',
    gradYear: '',
    city: '',
  })
  const [expertData, setExpertData] = useState({
    name: '',
    company: '',
    jobTitle: '',
    experience: '',
    field: '',
    bio: '',
  })

  const text = {
    ar: {
      appName: 'وجهني',
      tagline: 'تواصل مع خبراء مجالك',
      login: 'تسجيل الدخول',
      signup: 'إنشاء حساب',
      chooseType: 'اختر نوع حسابك',
      student: 'طالب',
      graduate: 'حديث تخرج',
      expert: 'خبير',
      back: 'رجوع',
      studentFormTitle: 'بيانات الطالب',
      graduateFormTitle: 'بيانات حديث التخرج',
      expertFormTitle: 'بيانات الخبير',
      name: 'الاسم الكامل',
      university: 'الجامعة',
      major: 'التخصص',
      gradYearExpected: 'سنة التخرج المتوقعة',
      gradYearActual: 'سنة التخرج',
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
      welcomeUser: 'مرحباً',
      homeMessage: 'حسابك جاهز، هذي صفحتك الرئيسية',
      pendingTitle: 'حسابك تحت المراجعة',
      pendingMessage: 'شكراً لتسجيلك! فريقنا يراجع بياناتك الحين، بيوصلك إشعار بالموافقة خلال 24-48 ساعة.',
      backHome: 'رجوع للرئيسية',
    },
    en: {
      appName: 'Wajehni',
      tagline: 'Connect with experts in your field',
      login: 'Login',
      signup: 'Sign Up',
      chooseType: 'Choose your account type',
      student: 'Student',
      graduate: 'Recent Graduate',
      expert: 'Expert',
      back: 'Back',
      studentFormTitle: 'Student Information',
      graduateFormTitle: 'Graduate Information',
      expertFormTitle: 'Expert Information',
      name: 'Full Name',
      university: 'University',
      major: 'Major',
      gradYearExpected: 'Expected Graduation Year',
      gradYearActual: 'Graduation Year',
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
      welcomeUser: 'Welcome',
      homeMessage: 'Your account is ready, this is your homepage',
      pendingTitle: 'Your account is under review',
      pendingMessage: 'Thanks for signing up! Our team is reviewing your details. You will be notified within 24-48 hours.',
      backHome: 'Back to home',
    },
  }

  const t = text[language]

  const handleStudentChange = (field, value) => {
    setStudentData({ ...studentData, [field]: value })
  }

  const handleExpertChange = (field, value) => {
    setExpertData({ ...expertData, [field]: value })
  }

  const openStudentForm = (type) => {
    setUserType(type)
    setScreen('studentForm')
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
            <button className="type-card" onClick={() => openStudentForm('student')}>
              <i className="ti ti-school"></i>
              <span>{t.student}</span>
            </button>
            <button className="type-card" onClick={() => openStudentForm('graduate')}>
              <i className="ti ti-briefcase"></i>
              <span>{t.graduate}</span>
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

          <h2>{userType === 'graduate' ? t.graduateFormTitle : t.studentFormTitle}</h2>

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
              <label>
                {userType === 'graduate' ? t.gradYearActual : t.gradYearExpected}
              </label>
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
              <label>{t.uploadCV}</label>
              <label className="file-upload">
                <i className="ti ti-upload"></i> {t.chooseFile}
                <input type="file" hidden />
              </label>
            </div>

            <button className="btn-primary full-width" onClick={() => setScreen('home')}>
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
              <label>{t.uploadProof}</label>
              <label className="file-upload">
                <i className="ti ti-upload"></i> {t.chooseFile}
                <input type="file" hidden />
              </label>
            </div>

            <p className="review-note">
              <i className="ti ti-info-circle"></i> {t.reviewNote}
            </p>

            <button className="btn-primary full-width" onClick={() => setScreen('pending')}>
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
        <div className="home-screen">
          <div className="pending-icon">
            <i className="ti ti-circle-check"></i>
          </div>
          <h2>{t.welcomeUser}، {studentData.name || '👋'}</h2>
          <p>{t.homeMessage}</p>
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