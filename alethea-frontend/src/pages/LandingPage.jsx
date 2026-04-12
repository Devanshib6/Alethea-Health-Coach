import { Link } from 'react-router-dom'
import { useState, useEffect } from 'react'

const LandingPage = () => {
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const features = [
    { icon: '🍽️', title: 'Smart Meal Tracking', desc: 'Log meals with AI-powered nutrition analysis' },
    { icon: '🤖', title: 'AI Diet Plans', desc: 'Personalized meal plans based on your goals' },
    { icon: '📊', title: 'Health Analytics', desc: 'Track your progress with beautiful insights' },
    { icon: '🔮', title: 'Health Predictions', desc: 'AI forecasts your future health trends' },
    { icon: '🎯', title: 'Goal Setting', desc: 'Set and achieve your wellness targets' },
    { icon: '💪', title: 'Fitness Integration', desc: 'Sync with your daily activities' },
  ]

  const stats = [
    { value: '10K+', label: 'Active Users', icon: '👥' },
    { value: '50K+', label: 'Meals Logged', icon: '🍲' },
    { value: '95%', label: 'Satisfaction', icon: '⭐' },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-pink-50">
      {/* Navbar */}
      <nav className={`fixed top-0 w-full z-50 transition-all duration-300 ${scrolled ? 'bg-white/90 backdrop-blur-md shadow-lg' : 'bg-transparent'}`}>
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <div className="w-10 h-10 bg-gradient-to-r from-indigo-600 to-pink-600 rounded-xl flex items-center justify-center">
              <span className="text-white font-bold text-xl">A</span>
            </div>
            <span className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-pink-600 bg-clip-text text-transparent">Alethea</span>
          </div>
          
          <div className="hidden md:flex items-center space-x-8">
            {['Features', 'How It Works', 'Testimonials'].map(item => (
              <a key={item} href={`#${item.toLowerCase().replace(/ /g, '-')}`} className="text-gray-600 hover:text-indigo-600 transition-colors">
                {item}
              </a>
            ))}
          </div>
          
          <div className="flex items-center space-x-4">
            {/* Sign In button - goes to Login page */}
            <Link to="/login" className="text-gray-600 hover:text-indigo-600 transition-colors">
              Sign In
            </Link>
            {/* Get Started button - goes to Signup page */}
            <Link to="/signup" className="bg-gradient-to-r from-indigo-600 to-pink-600 text-white px-6 py-2 rounded-xl hover:shadow-lg transition-all transform hover:-translate-y-0.5">
              Get Started
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-6">
        <div className="max-w-7xl mx-auto text-center">
          <div className="inline-flex items-center px-4 py-2 bg-indigo-100 rounded-full mb-8">
            <span className="text-indigo-600 text-sm font-semibold">✨ AI-Powered Health Coach</span>
          </div>
          
          <h1 className="text-5xl md:text-7xl font-bold mb-6">
            Your Personal{' '}
            <span className="bg-gradient-to-r from-indigo-600 to-pink-600 bg-clip-text text-transparent">
              Nutrition
            </span>
            <br />& Health Companion
          </h1>
          
          <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-10">
            Track meals, get AI-powered diet plans, monitor health metrics, and predict future trends — all in one beautiful platform.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            {/* Start Your Journey button - goes to Signup page */}
            <Link to="/signup" className="bg-gradient-to-r from-indigo-600 to-pink-600 text-white px-8 py-3 rounded-xl font-semibold hover:shadow-xl transition-all transform hover:-translate-y-0.5">
              Start Your Journey Free →
            </Link>
            <a href="#features" className="bg-white text-indigo-600 border-2 border-indigo-600 hover:bg-indigo-50 px-8 py-3 rounded-xl font-semibold transition-all">
              Learn More
            </a>
          </div>

          {/* Stats */}
          <div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-8 max-w-3xl mx-auto">
            {stats.map((stat, i) => (
              <div key={i} className="text-center animate-float" style={{ animationDelay: `${i * 0.2}s` }}>
                <div className="text-4xl mb-2">{stat.icon}</div>
                <div className="text-3xl font-bold text-indigo-600">{stat.value}</div>
                <div className="text-gray-500">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-6 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4">Everything You Need</h2>
            <p className="text-gray-600 text-lg">Powerful features to transform your health journey</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, i) => (
              <div key={i} className="group p-6 bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-1 border border-gray-100">
                <div className="text-4xl mb-4">{feature.icon}</div>
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-gray-500">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-20 px-6 bg-gradient-to-r from-indigo-50 to-pink-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4">Simple 3-Step Process</h2>
            <p className="text-gray-600 text-lg">Get started in minutes</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { step: '01', title: 'Create Account', desc: 'Sign up and set your health goals', icon: '📝' },
              { step: '02', title: 'Track Meals', desc: 'Log what you eat with AI assistance', icon: '🍽️' },
              { step: '03', title: 'Get Insights', desc: 'Receive personalized recommendations', icon: '📈' },
            ].map((item, i) => (
              <div key={i} className="text-center">
                <div className="w-20 h-20 bg-gradient-to-r from-indigo-600 to-pink-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                  <span className="text-3xl">{item.icon}</span>
                </div>
                <div className="text-5xl font-bold text-indigo-200 mb-2">{item.step}</div>
                <h3 className="text-xl font-semibold mb-2">{item.title}</h3>
                <p className="text-gray-500">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section id="testimonials" className="py-20 px-6 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4">What Our Users Say</h2>
            <p className="text-gray-600 text-lg">Real people, real results</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { name: 'Sarah Johnson', role: 'Fitness Enthusiast', text: 'Alethea has completely transformed my relationship with food. The AI recommendations are spot on!' },
              { name: 'Michael Chen', role: 'Software Engineer', text: 'Lost 15kg in 3 months. The meal tracking is so easy and the diet plans are very practical.' },
              { name: 'Dr. Emily Rodriguez', role: 'Nutritionist', text: 'I recommend Alethea to all my patients. The health predictions are surprisingly accurate.' },
            ].map((testimonial, i) => (
              <div key={i} className="p-6 bg-gray-50 rounded-2xl">
                <div className="text-yellow-400 text-xl mb-4">★★★★★</div>
                <p className="text-gray-600 mb-4">"{testimonial.text}"</p>
                <div className="font-semibold text-gray-800">{testimonial.name}</div>
                <div className="text-sm text-gray-500">{testimonial.role}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-6">
        <div className="max-w-4xl mx-auto text-center bg-gradient-to-r from-indigo-600 to-pink-600 rounded-3xl p-12 shadow-2xl">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Ready to Transform Your Health?
          </h2>
          <p className="text-indigo-100 text-lg mb-8">
            Join thousands of users already improving their lives with Alethea
          </p>
          {/* Start Free Trial button - goes to Signup page */}
          <Link to="/signup" className="bg-white text-indigo-600 px-8 py-3 rounded-xl font-semibold hover:shadow-xl transition-all inline-block">
            Start Free Trial →
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12 px-6">
        <div className="max-w-7xl mx-auto text-center">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <div className="w-8 h-8 bg-gradient-to-r from-indigo-500 to-pink-500 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold">A</span>
            </div>
            <span className="text-xl font-bold">Alethea Health Coach</span>
          </div>
          <p className="text-gray-400">© 2024 Alethea — Final Year Project</p>
        </div>
      </footer>
    </div>
  )
}

export default LandingPage