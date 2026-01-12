import { useEffect, useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, Clock, Award, TrendingUp, Play, Upload } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { DashboardLayout } from '@/components/layouts/DashboardLayout';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabase';
import { motion } from 'framer-motion';
import { toast } from 'sonner';

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
  const { user } = useAuth();
  const [enrollments, setEnrollments] = useState<Enrollment[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

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

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setUploading(true);
    // Simulate upload delay for now since we don't have a storage bucket set up in this context
    setTimeout(() => {
      toast.success(`Successfully uploaded ${file.name}`);
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }, 1500);

    /* Real implementation would be:
    const { data, error } = await supabase.storage.from('assignments').upload(`/${user.id}/${file.name}`, file);
    */
  };

  const statCards = [
    { icon: BookOpen, label: 'Enrolled Courses', value: stats.totalCourses, color: 'text-blue-600 bg-blue-100' },
    { icon: Award, label: 'Completed', value: stats.completedCourses, color: 'text-emerald-600 bg-emerald-100' },
    { icon: Clock, label: 'Hours Learned', value: stats.hoursLearned, color: 'text-orange-600 bg-orange-100' },
    { icon: TrendingUp, label: 'Avg Progress', value: `${stats.averageProgress}%`, color: 'text-violet-600 bg-violet-100' },
  ];

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <DashboardLayout>
      <div className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 font-serif">Welcome back, {user?.name}!</h1>
          <p className="text-slate-600 mt-2">Track your progress and continue learning.</p>
        </div>
        <div>
          <input
            type="file"
            ref={fileInputRef}
            className="hidden"
            onChange={handleFileUpload}
          />
          <Button
            onClick={() => fileInputRef.current?.click()}
            disabled={uploading}
            className="bg-slate-900 hover:bg-slate-800 text-white shadow-lg shadow-slate-900/20"
          >
            <Upload className="h-4 w-4 mr-2" />
            {uploading ? 'Uploading...' : 'Quick Upload'}
          </Button>
        </div>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {statCards.map((stat, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card className="border-none shadow-sm hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <div className={`p-3 rounded-xl ${stat.color}`}>
                    <stat.icon className="h-6 w-6" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-slate-500">{stat.label}</p>
                    <p className="text-2xl font-bold text-slate-900">{stat.value}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-slate-900">Continue Learning</h2>
            <Link to="/courses" className="text-sm text-blue-600 hover:text-blue-700 font-medium">
              View All Courses
            </Link>
          </div>

          <Card className="border-none shadow-sm">
            <CardContent className="p-0">
              {enrollments.length === 0 ? (
                <div className="text-center py-12 px-6">
                  <div className="bg-slate-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                    <BookOpen className="h-8 w-8 text-slate-400" />
                  </div>
                  <h3 className="text-lg font-semibold text-slate-900 mb-2">No courses yet</h3>
                  <p className="text-slate-500 mb-6 max-w-sm mx-auto">
                    You haven't enrolled in any courses yet. Browse our catalog to get started.
                  </p>
                  <Link to="/courses">
                    <Button className="bg-blue-600 hover:bg-blue-700">
                      Browse Courses
                    </Button>
                  </Link>
                </div>
              ) : (
                <div className="divide-y divide-slate-100">
                  {enrollments.map((enrollment) => (
                    <div key={enrollment.id} className="p-6 hover:bg-slate-50 transition-colors group">
                      <div className="flex gap-4">
                        <img
                          src={enrollment.course.thumbnail_url}
                          alt={enrollment.course.title}
                          className="w-32 h-20 object-cover rounded-lg shadow-sm"
                        />
                        <div className="flex-1 min-w-0 py-1">
                          <div className="flex items-start justify-between mb-2">
                            <div>
                              <h4 className="font-semibold text-slate-900 group-hover:text-blue-600 transition-colors line-clamp-1">
                                {enrollment.course.title}
                              </h4>
                              <p className="text-sm text-slate-500">
                                {enrollment.course.instructor_name}
                              </p>
                            </div>
                            <Link to={`/courses/${enrollment.course.id}`}>
                              <Button size="sm" variant="secondary" className="opacity-0 group-hover:opacity-100 transition-opacity">
                                <Play className="h-4 w-4 mr-1" /> Resume
                              </Button>
                            </Link>
                          </div>
                          <div className="flex items-center gap-3">
                            <div className="flex-1 h-2 bg-slate-100 rounded-full overflow-hidden">
                              <div
                                className="h-full bg-blue-600 rounded-full"
                                style={{ width: `${enrollment.progress_percentage}%` }}
                              />
                            </div>
                            <span className="text-sm font-medium text-slate-600 w-12 text-right">
                              {enrollment.progress_percentage}%
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        <div>
          <h2 className="text-xl font-bold text-slate-900 mb-6">Quick Actions</h2>
          <Card className="border-none shadow-sm bg-gradient-to-br from-blue-600 to-blue-700 text-white">
            <CardContent className="p-6">
              <Award className="h-8 w-8 mb-4 opacity-80" />
              <h3 className="text-lg font-bold mb-2">Certification Goals</h3>
              <p className="text-blue-100 text-sm mb-6">
                Complete 2 more courses to earn your "Dedicated Learner" badge.
              </p>
              <Button variant="secondary" className="w-full bg-white text-blue-700 hover:bg-blue-50 border-none">
                View Achievements
              </Button>
            </CardContent>
          </Card>

          <div className="mt-6 space-y-3">
            <Button variant="outline" className="w-full justify-start bg-white hover:bg-slate-50 border-slate-200">
              <BookOpen className="h-4 w-4 mr-3 text-slate-400" />
              Browse Catalog
            </Button>
            <Button variant="outline" className="w-full justify-start bg-white hover:bg-slate-50 border-slate-200">
              <Clock className="h-4 w-4 mr-3 text-slate-400" />
              Learning History
            </Button>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
