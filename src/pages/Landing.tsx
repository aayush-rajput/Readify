import { Link } from 'react-router-dom';
import { ArrowRight, BookOpen, Users, Award, Sparkles, CheckCircle, Play } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { motion } from 'framer-motion';

export function Landing() {
  const features = [
    {
      icon: BookOpen,
      title: 'Expert-Led Courses',
      description: 'Learn from industry professionals with real-world experience',
    },
    {
      icon: Users,
      title: 'Community Support',
      description: 'Join a thriving community of learners and mentors',
    },
    {
      icon: Award,
      title: 'Certificates',
      description: 'Earn recognized certificates upon course completion',
    },
    {
      icon: Sparkles,
      title: 'Interactive Learning',
      description: 'Engage with hands-on projects and practical exercises',
    },
  ];

  const stats = [
    { label: 'Active Students', value: '10,000+' },
    { label: 'Expert Instructors', value: '500+' },
    { label: 'Course Hours', value: '50,000+' },
    { label: 'Success Rate', value: '95%' },
  ];

  return (
    <div className="min-h-screen">
      <section className="relative py-20 px-4 sm:px-6 lg:px-8 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-white to-blue-50" />
        <div className="absolute inset-0 bg-grid-slate-100 [mask-image:linear-gradient(0deg,white,rgba(255,255,255,0.6))] -z-10" />

        <div className="max-w-7xl mx-auto relative">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
            >
              <div className="inline-flex items-center px-4 py-2 bg-blue-100 rounded-full mb-6">
                <Sparkles className="h-4 w-4 text-blue-600 mr-2" />
                <span className="text-sm font-medium text-blue-600">Welcome to the Future of Learning</span>
              </div>

              <h1 className="text-5xl md:text-6xl font-bold text-slate-900 mb-6 leading-tight">
                Master New Skills{' '}
                <span className="bg-gradient-to-r from-blue-600 to-blue-700 bg-clip-text text-transparent">
                  Anytime, Anywhere
                </span>
              </h1>

              <p className="text-xl text-slate-600 mb-8">
                Join thousands of learners advancing their careers with expert-led courses,
                interactive projects, and industry-recognized certificates.
              </p>

              <div className="flex flex-col sm:flex-row gap-4">
                <Link to="/register">
                  <Button size="lg" className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-lg px-8">
                    Start Learning Free
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </Link>
                <Link to="/courses">
                  <Button size="lg" variant="outline" className="text-lg px-8">
                    <Play className="mr-2 h-5 w-5" />
                    Explore Courses
                  </Button>
                </Link>
              </div>

              <div className="mt-12 flex items-center gap-8">
                {stats.slice(0, 2).map((stat, index) => (
                  <div key={index}>
                    <div className="text-3xl font-bold text-blue-600">{stat.value}</div>
                    <div className="text-sm text-slate-600">{stat.label}</div>
                  </div>
                ))}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="relative"
            >
              <div className="relative">
                <img
                  src="https://images.pexels.com/photos/5905857/pexels-photo-5905857.jpeg?auto=compress&cs=tinysrgb&w=800"
                  alt="Students learning"
                  className="rounded-2xl shadow-2xl"
                />
                <div className="absolute -bottom-6 -left-6 bg-white p-6 rounded-xl shadow-xl">
                  <div className="flex items-center gap-4">
                    <div className="bg-gradient-to-br from-blue-600 to-blue-700 p-3 rounded-lg">
                      <Award className="h-8 w-8 text-white" />
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-slate-900">95%</div>
                      <div className="text-sm text-slate-600">Success Rate</div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-slate-900 mb-4">
              Why Choose Readify?
            </h2>
            <p className="text-xl text-slate-600">
              Everything you need to succeed in your learning journey
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <Card className="h-full hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                  <CardContent className="p-6">
                    <div className="bg-gradient-to-br from-blue-600 to-blue-700 w-14 h-14 rounded-lg flex items-center justify-center mb-4">
                      <feature.icon className="h-7 w-7 text-white" />
                    </div>
                    <h3 className="text-xl font-bold text-slate-900 mb-2">
                      {feature.title}
                    </h3>
                    <p className="text-slate-600">{feature.description}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-blue-600 to-blue-700">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-4xl font-bold text-white mb-6">
                Learn at Your Own Pace
              </h2>
              <div className="space-y-4">
                {[
                  'Access courses 24/7 from any device',
                  'Learn from expert instructors',
                  'Track your progress in real-time',
                  'Earn certificates of completion',
                  'Join a community of learners',
                ].map((item, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <CheckCircle className="h-6 w-6 text-emerald-300 flex-shrink-0" />
                    <span className="text-lg text-white">{item}</span>
                  </div>
                ))}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="grid grid-cols-2 gap-6"
            >
              {stats.map((stat, index) => (
                <Card key={index} className="bg-white/10 backdrop-blur-lg border-white/20">
                  <CardContent className="p-6 text-center">
                    <div className="text-4xl font-bold text-white mb-2">{stat.value}</div>
                    <div className="text-blue-100">{stat.label}</div>
                  </CardContent>
                </Card>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-slate-50">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl font-bold text-slate-900 mb-6">
              Ready to Start Your Learning Journey?
            </h2>
            <p className="text-xl text-slate-600 mb-8">
              Join thousands of students already learning on Readify
            </p>
            <Link to="/register">
              <Button size="lg" className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-lg px-12">
                Get Started For Free
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
