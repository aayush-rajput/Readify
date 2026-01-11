import { Link } from 'react-router-dom';
import { ArrowRight, BookOpen, Brain, Layout, Highlighter, FileText, Activity, GraduationCap, User, Library } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { motion } from 'framer-motion';

export function Landing() {
  return (
    <div className="min-h-screen bg-sky-100">
      {/* Hero Section */}
      <section className="relative min-h-screen flex flex-col justify-center pt-32 pb-20 px-4 sm:px-6 lg:px-8 bg-sky-100">
        <div className="max-w-7xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-block"
          >
            <div className="bg-white/40 backdrop-blur-md rounded-[2.5rem] p-8 md:p-12 shadow-sm border border-white/20">
              <h1 className="text-5xl md:text-7xl font-bold text-slate-900 tracking-tight mb-8">
                Read. Organize. Understand<br />
                <span className="text-slate-600">in One Place.</span>
              </h1>

              <p className="text-xl md:text-2xl text-slate-700 max-w-2xl mx-auto mb-12 font-light leading-relaxed">
                Your AI-powered study workspace that combines structured reading,
                an intelligent notebook, and classroom organization.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                <Link to="/register">
                  <Button size="lg" className="bg-slate-900 hover:bg-slate-800 text-white text-lg px-8 py-6 h-auto rounded-full shadow-lg hover:shadow-xl transition-all">
                    Create Your Study Space
                  </Button>
                </Link>
                <Link to="#how-it-works">
                  <Button variant="ghost" size="lg" className="text-slate-700 hover:text-slate-900 text-lg px-8 py-6 h-auto">
                    See How It Works <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </Link>
              </div>
            </div>
          </motion.div>


        </div>
      </section>

      {/* Why Readify? */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 bg-sky-50 border-t border-sky-100">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-16">Why Readify?</h2>
          <div className="grid md:grid-cols-3 gap-12">
            {[
              { title: "Notebook-style AI", desc: "LLM intelligence embedded directly into your notes and reading materials." },
              { title: "Classroom Structure", desc: "Organize modules, topics, and resources just like Google Classroom." },
              { title: "Reading-First", desc: "Focus on deep understanding through text, not passive video consumption." }
            ].map((item, i) => (
              <div key={i} className="space-y-4">
                <h3 className="text-xl font-semibold text-slate-900">{item.title}</h3>
                <p className="text-slate-500 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section >

      {/* How It Works */}
      < section className="py-24 px-4 sm:px-6 lg:px-8 bg-sky-100" id="how-it-works" >
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { icon: BookOpen, title: "Read", desc: "Import content and highlight key concepts." },
              { icon: Brain, title: "Ask & Organize", desc: "Ask AI for explanations and structure your notes." },
              { icon: GraduationCap, title: "Understand", desc: "Master the material through active engagement." }
            ].map((step, i) => (
              <Card key={i} className="border-0 shadow-sm bg-white/50 hover:bg-white transition-colors">
                <CardContent className="p-8 text-center space-y-6">
                  <div className="w-16 h-16 mx-auto bg-slate-100 rounded-2xl flex items-center justify-center text-slate-900">
                    <step.icon className="w-8 h-8" />
                  </div>
                  <h3 className="text-2xl font-semibold text-slate-900">{step.title}</h3>
                  <p className="text-slate-500">{step.desc}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section >

      {/* Core Features */}
      < section className="py-24 px-4 sm:px-6 lg:px-8 bg-sky-50" >
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-16 text-center">Core Features</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-12">
            {[
              { icon: Highlighter, title: "Smart Reading", desc: "Highlight text and get instant context-aware insights." },
              { icon: Brain, title: "Inline AI Explanations", desc: "Chat with an AI that understands your specific course material." },
              { icon: Layout, title: "Structured Classrooms", desc: "Keep every module, topic, and reading organized." },
              { icon: FileText, title: "Connected Notes", desc: "Your notes live right next to your content, linked forever." },
              { icon: Activity, title: "Progress Tracking", desc: "Visualize your journey through complex topics." },
              { icon: Library, title: "Resource Library", desc: "Centralize all your PDFs, articles, and references." }
            ].map((feature, i) => (
              <div key={i} className="flex gap-4 items-start">
                <div className="p-3 bg-blue-50 rounded-xl text-blue-600">
                  <feature.icon className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-slate-900 mb-2">{feature.title}</h3>
                  <p className="text-slate-500">{feature.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section >

      {/* Who It's For */}
      < section className="py-24 px-4 sm:px-6 lg:px-8 bg-sky-100" >
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-16">Built For Deep Workers</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { icon: GraduationCap, label: "College Students" },
              { icon: FileText, label: "Exam Prep Learners" },
              { icon: User, label: "Self-Learners" }
            ].map((persona, i) => (
              <div key={i} className="p-8 bg-white rounded-2xl shadow-sm hover:shadow-md transition-shadow">
                <persona.icon className="w-10 h-10 mx-auto text-slate-900 mb-4" />
                <div className="font-medium text-slate-700">{persona.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section >

      {/* Footer CTA */}
      < section className="py-24 px-4 sm:px-6 lg:px-8 border-t border-sky-200 bg-sky-50 text-center" >
        <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-8">
          Ready to focus?
        </h2>
        <Link to="/register">
          <Button size="lg" className="bg-slate-900 hover:bg-slate-800 text-white text-lg px-12 py-6 h-auto rounded-full">
            Create Your Study Space
          </Button>
        </Link>
      </section >
    </div >
  );
}
