import { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Eye, EyeOff, Upload, File, MoreVertical, DollarSign, Users, BookOpen } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { DashboardLayout } from '@/components/layouts/DashboardLayout';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/contexts/AuthContext';
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
    is_published: boolean;
    created_at: string;
}

export function InstructorDashboard() {
    const { user } = useAuth();
    const [courses, setCourses] = useState<Course[]>([]);
    const [loading, setLoading] = useState(true);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [editingCourse, setEditingCourse] = useState<Course | null>(null);

    // New Upload State
    const [resources, setResources] = useState<{ name: string, type: string, size: string }[]>([]);
    const [uploading, setUploading] = useState(false);

    const [formData, setFormData] = useState({
        title: '',
        description: '',
        thumbnail_url: '',
        instructor_name: '',
        category: '',
        level: 'beginner',
        duration_hours: 0,
        price: 0,
        is_published: false,
    });

    useEffect(() => {
        fetchCourses();
        // Simulate fetching resources
        setResources([
            { name: 'Introduction_to_React.pdf', type: 'PDF', size: '2.4 MB' },
            { name: 'Course_Assets_Bundle.zip', type: 'ZIP', size: '14.2 MB' },
        ]);
    }, []);

    const fetchCourses = async () => {
        try {
            const { data, error } = await supabase
                .from('courses')
                .select('*')
                .order('created_at', { ascending: false });

            if (error) throw error;
            setCourses(data || []);
        } catch (error) {
            console.error('Error fetching courses:', error);
            toast.error('Failed to load courses');
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            if (editingCourse) {
                const { error } = await supabase
                    .from('courses')
                    .update(formData)
                    .eq('id', editingCourse.id);

                if (error) throw error;
                toast.success('Course updated successfully!');
            } else {
                const { error } = await supabase
                    .from('courses')
                    .insert({ ...formData, created_by: user?.id });

                if (error) throw error;
                toast.success('Course created successfully!');
            }

            setIsDialogOpen(false);
            resetForm();
            fetchCourses();
        } catch (error: any) {
            toast.error(error.message || 'Failed to save course');
        }
    };

    const handleEdit = (course: Course) => {
        setEditingCourse(course);
        setFormData({
            title: course.title,
            description: course.description,
            thumbnail_url: course.thumbnail_url,
            instructor_name: course.instructor_name,
            category: course.category,
            level: course.level,
            duration_hours: course.duration_hours,
            price: course.price,
            is_published: course.is_published,
        });
        setIsDialogOpen(true);
    };

    const handleDelete = async (courseId: string) => {
        if (!confirm('Are you sure you want to delete this course?')) return;

        try {
            const { error } = await supabase
                .from('courses')
                .delete()
                .eq('id', courseId);

            if (error) throw error;
            toast.success('Course deleted successfully!');
            fetchCourses();
        } catch (error: any) {
            toast.error(error.message || 'Failed to delete course');
        }
    };

    const togglePublish = async (course: Course) => {
        try {
            const { error } = await supabase
                .from('courses')
                .update({ is_published: !course.is_published })
                .eq('id', course.id);

            if (error) throw error;
            toast.success(`Course ${!course.is_published ? 'published' : 'unpublished'} successfully!`);
            fetchCourses();
        } catch (error: any) {
            toast.error(error.message || 'Failed to update course');
        }
    };

    const handleResourceUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setUploading(true);
        setTimeout(() => {
            setResources(prev => [{ name: file.name, type: file.name.split('.').pop()?.toUpperCase() || 'FILE', size: '1.2 MB' }, ...prev]);
            setUploading(false);
            toast.success('Resource uploaded successfully');
        }, 1500);
    };

    const resetForm = () => {
        setEditingCourse(null);
        setFormData({
            title: '',
            description: '',
            thumbnail_url: '',
            instructor_name: '',
            category: '',
            level: 'beginner',
            duration_hours: 0,
            price: 0,
            is_published: false,
        });
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-slate-900"></div>
            </div>
        );
    }

    return (
        <DashboardLayout>
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-slate-900 font-serif">Instructor Dashboard</h1>
                <p className="text-slate-600 mt-2">Manage your courses and track performance.</p>
            </div>

            <Tabs defaultValue="overview" className="space-y-6">
                <TabsList className="bg-white border p-1 rounded-lg">
                    <TabsTrigger value="overview">Overview</TabsTrigger>
                    <TabsTrigger value="courses">My Courses</TabsTrigger>
                    <TabsTrigger value="resources">Resources</TabsTrigger>
                </TabsList>

                {/* OVERVIEW TAB */}
                <TabsContent value="overview" className="space-y-6">
                    <div className="grid md:grid-cols-3 gap-6">
                        <Card>
                            <CardContent className="p-6 flex items-center gap-4">
                                <div className="p-4 rounded-full bg-blue-100 text-blue-600">
                                    <Users className="h-6 w-6" />
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-slate-500">Total Students</p>
                                    <h3 className="text-2xl font-bold text-slate-900">1,234</h3>
                                </div>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardContent className="p-6 flex items-center gap-4">
                                <div className="p-4 rounded-full bg-emerald-100 text-emerald-600">
                                    <DollarSign className="h-6 w-6" />
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-slate-500">Total Revenue</p>
                                    <h3 className="text-2xl font-bold text-slate-900">$12,450</h3>
                                </div>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardContent className="p-6 flex items-center gap-4">
                                <div className="p-4 rounded-full bg-violet-100 text-violet-600">
                                    <BookOpen className="h-6 w-6" />
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-slate-500">Active Courses</p>
                                    <h3 className="text-2xl font-bold text-slate-900">{courses.length}</h3>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    <div className="grid md:grid-cols-2 gap-6">
                        <Card>
                            <CardHeader>
                                <CardTitle>Recent Sales</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="text-sm text-slate-500 text-center py-8">
                                    No recent sales data available.
                                </div>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardHeader>
                                <CardTitle>Top Performing Courses</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="text-sm text-slate-500 text-center py-8">
                                    Not enough data to display rankings.
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </TabsContent>

                {/* COURSES TAB */}
                <TabsContent value="courses">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-xl font-bold text-slate-900">Course Library</h2>
                        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                            <DialogTrigger asChild>
                                <Button onClick={() => resetForm()} className="bg-slate-900 text-white hover:bg-slate-800">
                                    <Plus className="h-4 w-4 mr-2" /> Create Course
                                </Button>
                            </DialogTrigger>

                            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                                <DialogHeader>
                                    <DialogTitle>
                                        {editingCourse ? 'Edit Course' : 'Create New Course'}
                                    </DialogTitle>
                                </DialogHeader>
                                <form onSubmit={handleSubmit} className="space-y-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="title">Title</Label>
                                        <Input
                                            id="title"
                                            value={formData.title}
                                            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                            required
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="description">Description</Label>
                                        <Textarea
                                            id="description"
                                            value={formData.description}
                                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                            rows={3}
                                            required
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="thumbnail">Thumbnail URL</Label>
                                        <Input
                                            id="thumbnail"
                                            value={formData.thumbnail_url}
                                            onChange={(e) => setFormData({ ...formData, thumbnail_url: e.target.value })}
                                            placeholder="https://images.pexels.com/..."
                                            required
                                        />
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <Label htmlFor="instructor">Instructor Name</Label>
                                            <Input
                                                id="instructor"
                                                value={formData.instructor_name}
                                                onChange={(e) => setFormData({ ...formData, instructor_name: e.target.value })}
                                                required
                                            />
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="category">Category</Label>
                                            <Input
                                                id="category"
                                                value={formData.category}
                                                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                                                placeholder="e.g., Development, Design"
                                                required
                                            />
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-3 gap-4">
                                        <div className="space-y-2">
                                            <Label htmlFor="level">Level</Label>

                                            <select
                                                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                                value={formData.level}
                                                onChange={(e) => setFormData({ ...formData, level: e.target.value })}
                                            >
                                                <option value="beginner">Beginner</option>
                                                <option value="intermediate">Intermediate</option>
                                                <option value="advanced">Advanced</option>
                                            </select>
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="duration">Duration (hours)</Label>
                                            <Input
                                                id="duration"
                                                type="number"
                                                value={formData.duration_hours}
                                                onChange={(e) => setFormData({ ...formData, duration_hours: parseInt(e.target.value) })}
                                                min="0"
                                                required
                                            />
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="price">Price ($)</Label>
                                            <Input
                                                id="price"
                                                type="number"
                                                value={formData.price}
                                                onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) })}
                                                min="0"
                                                step="0.01"
                                                required
                                            />
                                        </div>
                                    </div>

                                    <div className="flex items-center space-x-2">
                                        <input
                                            type="checkbox"
                                            id="published"
                                            checked={formData.is_published}
                                            onChange={(e) => setFormData({ ...formData, is_published: e.target.checked })}
                                            className="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                                        />
                                        <Label htmlFor="published">Publish immediately</Label>
                                    </div>

                                    <div className="flex gap-2 pt-4">
                                        <Button type="submit" className="flex-1 bg-slate-900 text-white hover:bg-slate-800">
                                            {editingCourse ? 'Update Course' : 'Create Course'}
                                        </Button>
                                        <Button
                                            type="button"
                                            variant="outline"
                                            onClick={() => setIsDialogOpen(false)}
                                        >
                                            Cancel
                                        </Button>
                                    </div>
                                </form>
                            </DialogContent>
                        </Dialog>
                    </div>

                    <div className="bg-white border rounded-lg overflow-hidden">
                        <table className="w-full text-left text-sm">
                            <thead className="bg-slate-50 border-b">
                                <tr>
                                    <th className="px-6 py-4 font-semibold text-slate-900">Course Info</th>
                                    <th className="px-6 py-4 font-semibold text-slate-900">Status</th>
                                    <th className="px-6 py-4 font-semibold text-slate-900">Price</th>
                                    <th className="px-6 py-4 font-semibold text-slate-900">Created</th>
                                    <th className="px-6 py-4 font-semibold text-slate-900 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y">
                                {courses.map((course) => (
                                    <tr key={course.id} className="hover:bg-slate-50 transition-colors">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-4">
                                                <img src={course.thumbnail_url} className="w-12 h-12 rounded object-cover" alt="" />
                                                <div>
                                                    <p className="font-medium text-slate-900">{course.title}</p>
                                                    <p className="text-slate-500 text-xs">{course.instructor_name}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <Badge variant={course.is_published ? 'default' : 'secondary'}>
                                                {course.is_published ? 'Published' : 'Draft'}
                                            </Badge>
                                        </td>
                                        <td className="px-6 py-4 font-medium">${course.price}</td>
                                        <td className="px-6 py-4 text-slate-500">{new Date(course.created_at).toLocaleDateString()}</td>
                                        <td className="px-6 py-4 text-right">
                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
                                                    <Button variant="ghost" size="icon" className="h-8 w-8">
                                                        <MoreVertical className="h-4 w-4" />
                                                    </Button>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent align="end">
                                                    <DropdownMenuItem onClick={() => handleEdit(course)}>
                                                        <Edit className="h-4 w-4 mr-2" /> Edit
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem onClick={() => togglePublish(course)}>
                                                        {course.is_published ? <EyeOff className="h-4 w-4 mr-2" /> : <Eye className="h-4 w-4 mr-2" />}
                                                        {course.is_published ? 'Unpublish' : 'Publish'}
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem onClick={() => handleDelete(course.id)} className="text-red-600">
                                                        <Trash2 className="h-4 w-4 mr-2" /> Delete
                                                    </DropdownMenuItem>
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                        </td>
                                    </tr>
                                ))}
                                {courses.length === 0 && (
                                    <tr>
                                        <td colSpan={5} className="text-center py-12 text-slate-500">
                                            No courses found. Create one to get started.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </TabsContent>

                {/* RESOURCES TAB */}
                <TabsContent value="resources">
                    <div className="flex justify-between items-center mb-6">
                        <div>
                            <h2 className="text-xl font-bold text-slate-900">Resource Manager</h2>
                            <p className="text-slate-600 text-sm">Upload materials for your students.</p>
                        </div>
                        <div className="relative">
                            <input type="file" className="hidden" id="resource-upload" onChange={handleResourceUpload} />
                            <label htmlFor="resource-upload">
                                <Button asChild disabled={uploading} className="cursor-pointer bg-slate-900 text-white hover:bg-slate-800">
                                    <span>
                                        <Upload className="h-4 w-4 mr-2" />
                                        {uploading ? 'Uploading...' : 'Upload File'}
                                    </span>
                                </Button>
                            </label>
                        </div>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {resources.map((file, i) => (
                            <Card key={i}>
                                <CardContent className="p-4 flex items-start gap-4">
                                    <div className="p-3 bg-slate-100 rounded-lg">
                                        <File className="h-6 w-6 text-slate-500" />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="font-medium text-slate-900 truncate">{file.name}</p>
                                        <div className="flex items-center gap-2 text-xs text-slate-500 mt-1">
                                            <Badge variant="outline" className="text-xs font-normal">{file.type}</Badge>
                                            <span>{file.size}</span>
                                        </div>
                                    </div>
                                    <Button variant="ghost" size="icon" className="text-slate-400 hover:text-red-600">
                                        <Trash2 className="h-4 w-4" />
                                    </Button>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </TabsContent>
            </Tabs>
        </DashboardLayout>
    );
}
