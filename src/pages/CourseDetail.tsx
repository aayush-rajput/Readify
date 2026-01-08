import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Clock, BookOpen, Award, Play, CheckCircle, Lock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabase';
import { motion } from 'framer-motion';
import { toast } from 'sonner';

interface Course {
  id: string;
  title: string;
  description: string;
  thumbnail_url: string;
  instructor_name: string;
  category: string;
  level: string;
  duration_hours: number;
  price: number;
}

interface Lesson {
  id: string;
  title: string;
  description: string;
  content_type: string;
  duration_minutes: number;
  order_index: number;
  is_free: boolean;
}

export function CourseDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [course, setCourse] = useState<Course | null>(null);
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [isEnrolled, setIsEnrolled] = useState(false);
  const [loading, setLoading] = useState(true);
  const [enrolling, setEnrolling] = useState(false);

  useEffect(() => {
    if (id) {
      fetchCourseDetails();
      if (user) {
        checkEnrollment();
      }
    }
  }, [id, user]);

  const fetchCourseDetails = async () => {
    try {
      const { data: courseData, error: courseError } = await supabase
        .from('courses')
        .select('*')
        .eq('id', id)
        .maybeSingle();

      if (courseError) throw courseError;
      setCourse(courseData);

      const { data: lessonsData, error: lessonsError } = await supabase
        .from('lessons')
        .select('*')
        .eq('course_id', id)
        .order('order_index');

      if (lessonsError) throw lessonsError;
      setLessons(lessonsData || []);
    } catch (error) {
      console.error('Error fetching course:', error);
      toast.error('Failed to load course');
    } finally {
      setLoading(false);
    }
  };

  const checkEnrollment = async () => {
    try {
      const { data, error } = await supabase
        .from('enrollments')
        .select('id')
        .eq('course_id', id)
        .eq('user_id', user?.id)
        .maybeSingle();

      if (error) throw error;
      setIsEnrolled(!!data);
    } catch (error) {
      console.error('Error checking enrollment:', error);
    }
  };

  const handleEnroll = async () => {
    if (!user) {
      navigate('/login');
      return;
    }

    setEnrolling(true);
    try {
      const { error } = await supabase.from('enrollments').insert({
        user_id: user.id,
        course_id: id,
        progress_percentage: 0,
        completed_lessons: [],
      });

      if (error) throw error;

      setIsEnrolled(true);
      toast.success('Successfully enrolled in course!');
    } catch (error: any) {
      toast.error(error.message || 'Failed to enroll');
    } finally {
      setEnrolling(false);
    }
  };

  const handleStartLesson = (lessonId: string) => {
    navigate(`/courses/${id}/lessons/${lessonId}`);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-slate-900 mb-2">Course not found</h2>
          <Button onClick={() => navigate('/courses')}>Back to Courses</Button>
        </div>
      </div>
    );
  }

  const levelColors = {
    beginner: 'bg-emerald-100 text-emerald-700',
    intermediate: 'bg-blue-100 text-blue-700',
    advanced: 'bg-orange-100 text-orange-700',
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="relative h-96 bg-gradient-to-br from-blue-600 to-blue-700">
        <img
          src={course.thumbnail_url}
          alt={course.title}
          className="w-full h-full object-cover opacity-20"
        />
        <div className="absolute inset-0 flex items-center">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="max-w-3xl"
            >
              <div className="flex gap-3 mb-4">
                <Badge className={levelColors[course.level as keyof typeof levelColors]}>
                  {course.level}
                </Badge>
                <Badge variant="secondary">{course.category}</Badge>
              </div>
              <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
                {course.title}
              </h1>
              <p className="text-xl text-blue-100 mb-6">{course.description}</p>
              <div className="flex items-center gap-6 text-white mb-6">
                <div className="flex items-center gap-2">
                  <Clock className="h-5 w-5" />
                  <span>{course.duration_hours} hours</span>
                </div>
                <div className="flex items-center gap-2">
                  <BookOpen className="h-5 w-5" />
                  <span>{lessons.length} lessons</span>
                </div>
                <div className="flex items-center gap-2">
                  <Award className="h-5 w-5" />
                  <span>Certificate</span>
                </div>
              </div>
              {!isEnrolled && (
                <Button
                  size="lg"
                  onClick={handleEnroll}
                  disabled={enrolling}
                  className="bg-white text-blue-600 hover:bg-blue-50"
                >
                  {enrolling ? 'Enrolling...' : course.price > 0 ? `Enroll for $${course.price}` : 'Enroll For Free'}
                </Button>
              )}
            </motion.div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <Card>
              <CardContent className="p-6">
                <h2 className="text-2xl font-bold text-slate-900 mb-4">About This Course</h2>
                <p className="text-slate-600 mb-6">{course.description}</p>

                <Separator className="my-6" />

                <h3 className="text-xl font-bold text-slate-900 mb-4">What You'll Learn</h3>
                <ul className="space-y-3">
                  {[
                    'Master the fundamentals and advanced concepts',
                    'Build real-world projects from scratch',
                    'Learn industry best practices',
                    'Get lifetime access to course materials',
                  ].map((item, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <CheckCircle className="h-5 w-5 text-emerald-600 flex-shrink-0 mt-0.5" />
                      <span className="text-slate-700">{item}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            <Card className="mt-6">
              <CardContent className="p-6">
                <h2 className="text-2xl font-bold text-slate-900 mb-4">Course Content</h2>
                <div className="space-y-3">
                  {lessons.map((lesson, index) => (
                    <div
                      key={lesson.id}
                      className="flex items-center justify-between p-4 rounded-lg border border-slate-200 hover:border-blue-300 hover:bg-blue-50 transition-all"
                    >
                      <div className="flex items-start gap-4 flex-1">
                        <div className="bg-slate-100 p-2 rounded-lg">
                          {lesson.is_free || isEnrolled ? (
                            <Play className="h-5 w-5 text-blue-600" />
                          ) : (
                            <Lock className="h-5 w-5 text-slate-400" />
                          )}
                        </div>
                        <div className="flex-1">
                          <h4 className="font-semibold text-slate-900 mb-1">
                            {index + 1}. {lesson.title}
                          </h4>
                          <p className="text-sm text-slate-600">{lesson.description}</p>
                          <div className="flex items-center gap-4 mt-2 text-sm text-slate-500">
                            <span>{lesson.content_type}</span>
                            <span>•</span>
                            <span>{lesson.duration_minutes} min</span>
                            {lesson.is_free && (
                              <>
                                <span>•</span>
                                <Badge variant="secondary" className="text-xs">Free Preview</Badge>
                              </>
                            )}
                          </div>
                        </div>
                      </div>
                      {(lesson.is_free || isEnrolled) && (
                        <Button
                          size="sm"
                          onClick={() => handleStartLesson(lesson.id)}
                          className="bg-gradient-to-r from-blue-600 to-blue-700"
                        >
                          Start
                        </Button>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          <div>
            <Card className="sticky top-24">
              <CardContent className="p-6">
                <h3 className="text-xl font-bold text-slate-900 mb-4">Instructor</h3>
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-600 to-blue-700 flex items-center justify-center text-white text-xl font-bold">
                    {course.instructor_name.charAt(0)}
                  </div>
                  <div>
                    <h4 className="font-semibold text-slate-900">{course.instructor_name}</h4>
                    <p className="text-sm text-slate-600">Expert Instructor</p>
                  </div>
                </div>

                <Separator className="my-6" />

                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-600">Duration</span>
                    <span className="font-semibold text-slate-900">{course.duration_hours} hours</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-600">Lessons</span>
                    <span className="font-semibold text-slate-900">{lessons.length}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-600">Level</span>
                    <span className="font-semibold text-slate-900">{course.level}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-600">Price</span>
                    <span className="font-semibold text-slate-900">
                      {course.price > 0 ? `$${course.price}` : 'Free'}
                    </span>
                  </div>
                </div>

                {!isEnrolled && (
                  <>
                    <Separator className="my-6" />
                    <Button
                      className="w-full bg-gradient-to-r from-blue-600 to-blue-700"
                      size="lg"
                      onClick={handleEnroll}
                      disabled={enrolling}
                    >
                      {enrolling ? 'Enrolling...' : 'Enroll Now'}
                    </Button>
                  </>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
