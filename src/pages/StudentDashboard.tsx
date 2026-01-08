import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, Clock, Award, TrendingUp, Play } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabase';
import { motion } from 'framer-motion';

interface Enrollment {
  id: string;
  progress_percentage: number;
  last_accessed_at: string;
  course: {
    id: string;
    title: string;
    thumbnail_url: string;
    instructor_name: string;
    duration_hours: number;
  };
}

export function StudentDashboard() {
  const { profile } = useAuth();
  const [enrollments, setEnrollments] = useState<Enrollment[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalCourses: 0,
    completedCourses: 0,
    hoursLearned: 0,
    averageProgress: 0,
  });

  useEffect(() => {
    fetchEnrollments();
  }, []);

  const fetchEnrollments = async () => {
    try {
      const { data, error } = await supabase
        .from('enrollments')
        .select(`
          *,
          course:courses(id, title, thumbnail_url, instructor_name, duration_hours)
        `)
        .order('last_accessed_at', { ascending: false });

      if (error) throw error;

      setEnrollments(data || []);

      const totalCourses = data?.length || 0;
      const completedCourses = data?.filter((e: Enrollment) => e.progress_percentage === 100).length || 0;
      const totalProgress = data?.reduce((sum: number, e: Enrollment) => sum + e.progress_percentage, 0) || 0;
      const averageProgress = totalCourses > 0 ? Math.round(totalProgress / totalCourses) : 0;
      const hoursLearned = data?.reduce((sum: number, e: Enrollment) => {
        return sum + ((e.course.duration_hours * e.progress_percentage) / 100);
      }, 0) || 0;

      setStats({
        totalCourses,
        completedCourses,
        hoursLearned: Math.round(hoursLearned),
        averageProgress,
      });
    } catch (error) {
      console.error('Error fetching enrollments:', error);
    } finally {
      setLoading(false);
    }
  };

  const statCards = [
    { icon: BookOpen, label: 'Enrolled Courses', value: stats.totalCourses, color: 'from-blue-600 to-blue-700' },
    { icon: Award, label: 'Completed', value: stats.completedCourses, color: 'from-emerald-600 to-emerald-700' },
    { icon: Clock, label: 'Hours Learned', value: stats.hoursLearned, color: 'from-orange-600 to-orange-700' },
    { icon: TrendingUp, label: 'Avg Progress', value: `${stats.averageProgress}%`, color: 'from-violet-600 to-violet-700' },
  ];

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900">Welcome back, {profile?.full_name}!</h1>
          <p className="text-slate-600 mt-2">Continue your learning journey</p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {statCards.map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-slate-600 mb-1">{stat.label}</p>
                      <p className="text-3xl font-bold text-slate-900">{stat.value}</p>
                    </div>
                    <div className={`bg-gradient-to-br ${stat.color} p-3 rounded-lg`}>
                      <stat.icon className="h-6 w-6 text-white" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Continue Learning</CardTitle>
              </CardHeader>
              <CardContent>
                {enrollments.length === 0 ? (
                  <div className="text-center py-12">
                    <BookOpen className="h-16 w-16 text-slate-300 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-slate-900 mb-2">No courses yet</h3>
                    <p className="text-slate-600 mb-4">Start learning by enrolling in a course</p>
                    <Link to="/courses">
                      <Button className="bg-gradient-to-r from-blue-600 to-blue-700">
                        Browse Courses
                      </Button>
                    </Link>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {enrollments.map((enrollment) => (
                      <Link
                        key={enrollment.id}
                        to={`/courses/${enrollment.course.id}`}
                        className="block"
                      >
                        <div className="flex items-center gap-4 p-4 rounded-lg hover:bg-slate-50 transition-colors">
                          <img
                            src={enrollment.course.thumbnail_url}
                            alt={enrollment.course.title}
                            className="w-24 h-16 object-cover rounded-lg"
                          />
                          <div className="flex-1 min-w-0">
                            <h4 className="font-semibold text-slate-900 mb-1 truncate">
                              {enrollment.course.title}
                            </h4>
                            <p className="text-sm text-slate-600 mb-2">
                              {enrollment.course.instructor_name}
                            </p>
                            <div className="flex items-center gap-4">
                              <Progress value={enrollment.progress_percentage} className="flex-1" />
                              <span className="text-sm font-medium text-slate-900">
                                {enrollment.progress_percentage}%
                              </span>
                            </div>
                          </div>
                          <Button size="sm" className="bg-gradient-to-r from-blue-600 to-blue-700">
                            <Play className="h-4 w-4 mr-2" />
                            Continue
                          </Button>
                        </div>
                      </Link>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          <div>
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Link to="/courses">
                  <Button variant="outline" className="w-full justify-start">
                    <BookOpen className="h-4 w-4 mr-2" />
                    Browse All Courses
                  </Button>
                </Link>
                <Link to="/profile">
                  <Button variant="outline" className="w-full justify-start">
                    <Award className="h-4 w-4 mr-2" />
                    View Certificates
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
