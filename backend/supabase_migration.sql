-- ============================================================================
-- READIFY — COMPLETE SUPABASE DATABASE MIGRATION
-- ============================================================================
-- Run this entire file in your Supabase Dashboard → SQL Editor
-- This creates all tables, triggers, RLS policies, and indexes needed
-- for the Readify Smart Classroom platform.
--
-- IMPORTANT: Run this ONCE on a fresh Supabase project.
-- If tables already exist, you may need to drop them first (see bottom).
-- ============================================================================


-- ============================================================================
-- 1. PROFILES TABLE
-- ============================================================================
-- Linked 1:1 with auth.users. Stores public user data.
-- The trigger below auto-creates a row when a user signs up.

CREATE TABLE IF NOT EXISTS public.profiles (
    id          uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email       text,
    name        text,
    role        text NOT NULL DEFAULT 'student'
                CHECK (role IN ('student', 'teacher', 'admin')),
    bio         text,
    avatar      text,
    created_at  timestamptz NOT NULL DEFAULT now(),
    updated_at  timestamptz NOT NULL DEFAULT now()
);

COMMENT ON TABLE public.profiles IS 'Public user profiles, linked 1:1 with auth.users';
COMMENT ON COLUMN public.profiles.role IS 'User role: student, teacher, or admin';


-- ============================================================================
-- 2. COURSES TABLE
-- ============================================================================

CREATE TABLE IF NOT EXISTS public.courses (
    id              uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    title           text NOT NULL,
    description     text NOT NULL,
    thumbnail_url   text NOT NULL DEFAULT '',
    instructor_name text NOT NULL DEFAULT '',
    category        text NOT NULL DEFAULT '',
    level           text NOT NULL DEFAULT 'beginner'
                    CHECK (level IN ('beginner', 'intermediate', 'advanced')),
    duration_hours  integer NOT NULL DEFAULT 0,
    price           numeric(10, 2) NOT NULL DEFAULT 0,
    is_published    boolean NOT NULL DEFAULT false,
    created_by      uuid REFERENCES public.profiles(id) ON DELETE SET NULL,
    created_at      timestamptz NOT NULL DEFAULT now(),
    updated_at      timestamptz NOT NULL DEFAULT now()
);

COMMENT ON TABLE public.courses IS 'Course catalog — created by instructors/admins';
COMMENT ON COLUMN public.courses.is_published IS 'Only published courses are visible to students';
COMMENT ON COLUMN public.courses.created_by IS 'The user (teacher/admin) who created this course';


-- ============================================================================
-- 3. LESSONS TABLE
-- ============================================================================

CREATE TABLE IF NOT EXISTS public.lessons (
    id                uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    course_id         uuid NOT NULL REFERENCES public.courses(id) ON DELETE CASCADE,
    title             text NOT NULL,
    description       text DEFAULT '',
    content_type      text NOT NULL DEFAULT 'text'
                      CHECK (content_type IN ('video', 'pdf', 'text')),
    content_url       text,
    content_text      text,
    duration_minutes  integer NOT NULL DEFAULT 0,
    order_index       integer NOT NULL DEFAULT 0,
    is_free           boolean NOT NULL DEFAULT false,
    created_at        timestamptz NOT NULL DEFAULT now(),
    updated_at        timestamptz NOT NULL DEFAULT now()
);

COMMENT ON TABLE public.lessons IS 'Individual lessons within a course';
COMMENT ON COLUMN public.lessons.order_index IS 'Sort order within the course';
COMMENT ON COLUMN public.lessons.is_free IS 'Free preview lessons accessible without enrollment';
COMMENT ON COLUMN public.lessons.content_type IS 'Type of content: video, pdf, or text';


-- ============================================================================
-- 4. ENROLLMENTS TABLE
-- ============================================================================

CREATE TABLE IF NOT EXISTS public.enrollments (
    id                    uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id               uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    course_id             uuid NOT NULL REFERENCES public.courses(id) ON DELETE CASCADE,
    progress_percentage   integer NOT NULL DEFAULT 0
                          CHECK (progress_percentage >= 0 AND progress_percentage <= 100),
    completed_lessons     jsonb NOT NULL DEFAULT '[]'::jsonb,
    last_accessed_at      timestamptz DEFAULT now(),
    created_at            timestamptz NOT NULL DEFAULT now(),
    updated_at            timestamptz NOT NULL DEFAULT now(),

    -- A user can only enroll in a course once
    UNIQUE (user_id, course_id)
);

COMMENT ON TABLE public.enrollments IS 'Tracks student enrollment and progress in courses';
COMMENT ON COLUMN public.enrollments.completed_lessons IS 'JSON array of completed lesson UUIDs';
COMMENT ON COLUMN public.enrollments.progress_percentage IS 'Calculated as (completed_lessons.length / total_lessons) * 100';


-- ============================================================================
-- 5. AUTO-UPDATE updated_at TRIGGER FUNCTION
-- ============================================================================
-- Reusable trigger function that sets updated_at = now() on any UPDATE.

CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply to all tables
CREATE TRIGGER update_profiles_updated_at
    BEFORE UPDATE ON public.profiles
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_courses_updated_at
    BEFORE UPDATE ON public.courses
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_lessons_updated_at
    BEFORE UPDATE ON public.lessons
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_enrollments_updated_at
    BEFORE UPDATE ON public.enrollments
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();


-- ============================================================================
-- 6. HANDLE NEW USER TRIGGER
-- ============================================================================
-- When a new user signs up via Supabase Auth, this trigger automatically
-- creates a corresponding row in public.profiles with the metadata they
-- provided during signup (name, role).
--
-- The frontend sends metadata via:
--   supabase.auth.signUp({ email, password, options: { data: { name, role } } })

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.profiles (id, email, name, role)
    VALUES (
        NEW.id,
        NEW.email,
        COALESCE(NEW.raw_user_meta_data ->> 'name', ''),
        COALESCE(NEW.raw_user_meta_data ->> 'role', 'student')
    );
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- The trigger fires AFTER a new row is inserted into auth.users
CREATE OR REPLACE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();


-- ============================================================================
-- 7. ROW LEVEL SECURITY (RLS) POLICIES
-- ============================================================================

-- Enable RLS on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.courses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.lessons ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.enrollments ENABLE ROW LEVEL SECURITY;


-- --------------------------------------------------------------------------
-- PROFILES POLICIES
-- --------------------------------------------------------------------------

-- Anyone can read profiles (needed for instructor info, admin user list, etc.)
CREATE POLICY "Profiles are viewable by everyone"
    ON public.profiles FOR SELECT
    USING (true);

-- Users can update their own profile only
CREATE POLICY "Users can update own profile"
    ON public.profiles FOR UPDATE
    USING (auth.uid() = id)
    WITH CHECK (auth.uid() = id);

-- Profiles are created by the trigger, not directly by users
-- But we allow insert for the trigger (which runs as SECURITY DEFINER)
CREATE POLICY "Service role can insert profiles"
    ON public.profiles FOR INSERT
    WITH CHECK (true);


-- --------------------------------------------------------------------------
-- COURSES POLICIES
-- --------------------------------------------------------------------------

-- Anyone can read published courses (for browsing)
CREATE POLICY "Published courses are viewable by everyone"
    ON public.courses FOR SELECT
    USING (
        is_published = true
        OR auth.uid() = created_by
        OR EXISTS (
            SELECT 1 FROM public.profiles
            WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
        )
    );

-- Teachers and admins can create courses
CREATE POLICY "Teachers and admins can create courses"
    ON public.courses FOR INSERT
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.profiles
            WHERE profiles.id = auth.uid()
            AND profiles.role IN ('teacher', 'admin')
        )
    );

-- Course creator or admin can update courses
CREATE POLICY "Course creator or admin can update courses"
    ON public.courses FOR UPDATE
    USING (
        auth.uid() = created_by
        OR EXISTS (
            SELECT 1 FROM public.profiles
            WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
        )
    )
    WITH CHECK (
        auth.uid() = created_by
        OR EXISTS (
            SELECT 1 FROM public.profiles
            WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
        )
    );

-- Course creator or admin can delete courses
CREATE POLICY "Course creator or admin can delete courses"
    ON public.courses FOR DELETE
    USING (
        auth.uid() = created_by
        OR EXISTS (
            SELECT 1 FROM public.profiles
            WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
        )
    );


-- --------------------------------------------------------------------------
-- LESSONS POLICIES
-- --------------------------------------------------------------------------

-- Anyone can read lessons (the frontend controls access via enrollment check)
CREATE POLICY "Lessons are viewable by everyone"
    ON public.lessons FOR SELECT
    USING (true);

-- Teachers and admins can create lessons
CREATE POLICY "Teachers and admins can create lessons"
    ON public.lessons FOR INSERT
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.profiles
            WHERE profiles.id = auth.uid()
            AND profiles.role IN ('teacher', 'admin')
        )
    );

-- Teachers and admins can update lessons
CREATE POLICY "Teachers and admins can update lessons"
    ON public.lessons FOR UPDATE
    USING (
        EXISTS (
            SELECT 1 FROM public.profiles
            WHERE profiles.id = auth.uid()
            AND profiles.role IN ('teacher', 'admin')
        )
    )
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.profiles
            WHERE profiles.id = auth.uid()
            AND profiles.role IN ('teacher', 'admin')
        )
    );

-- Teachers and admins can delete lessons
CREATE POLICY "Teachers and admins can delete lessons"
    ON public.lessons FOR DELETE
    USING (
        EXISTS (
            SELECT 1 FROM public.profiles
            WHERE profiles.id = auth.uid()
            AND profiles.role IN ('teacher', 'admin')
        )
    );


-- --------------------------------------------------------------------------
-- ENROLLMENTS POLICIES
-- --------------------------------------------------------------------------

-- Users can see their own enrollments
CREATE POLICY "Users can view own enrollments"
    ON public.enrollments FOR SELECT
    USING (
        auth.uid() = user_id
        OR EXISTS (
            SELECT 1 FROM public.profiles
            WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
        )
    );

-- Authenticated users can enroll themselves (user_id must match auth.uid)
CREATE POLICY "Users can enroll themselves"
    ON public.enrollments FOR INSERT
    WITH CHECK (auth.uid() = user_id);

-- Users can update their own enrollment progress
CREATE POLICY "Users can update own enrollment"
    ON public.enrollments FOR UPDATE
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

-- Users can unenroll themselves; admins can unenroll anyone
CREATE POLICY "Users can delete own enrollment"
    ON public.enrollments FOR DELETE
    USING (
        auth.uid() = user_id
        OR EXISTS (
            SELECT 1 FROM public.profiles
            WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
        )
    );


-- ============================================================================
-- 8. PERFORMANCE INDEXES
-- ============================================================================

-- Courses: filter by published status (most common query)
CREATE INDEX IF NOT EXISTS idx_courses_is_published
    ON public.courses (is_published)
    WHERE is_published = true;

-- Courses: sort by created_at (admin/instructor views)
CREATE INDEX IF NOT EXISTS idx_courses_created_at
    ON public.courses (created_at DESC);

-- Courses: filter by creator
CREATE INDEX IF NOT EXISTS idx_courses_created_by
    ON public.courses (created_by);

-- Lessons: lookup by course_id + sort by order_index (most common query)
CREATE INDEX IF NOT EXISTS idx_lessons_course_id_order
    ON public.lessons (course_id, order_index);

-- Enrollments: lookup by user_id (student dashboard)
CREATE INDEX IF NOT EXISTS idx_enrollments_user_id
    ON public.enrollments (user_id);

-- Enrollments: lookup by course_id (admin stats)
CREATE INDEX IF NOT EXISTS idx_enrollments_course_id
    ON public.enrollments (course_id);

-- Enrollments: sort by last_accessed_at (student dashboard "continue learning")
CREATE INDEX IF NOT EXISTS idx_enrollments_last_accessed
    ON public.enrollments (last_accessed_at DESC);

-- Profiles: filter by role (admin dashboard student count)
CREATE INDEX IF NOT EXISTS idx_profiles_role
    ON public.profiles (role);


-- ============================================================================
-- 9. GRANT PERMISSIONS
-- ============================================================================
-- Supabase manages these automatically for the anon and authenticated roles,
-- but we explicitly grant them for clarity.

GRANT USAGE ON SCHEMA public TO anon, authenticated;

GRANT SELECT ON public.profiles TO anon, authenticated;
GRANT INSERT, UPDATE ON public.profiles TO authenticated;

GRANT SELECT ON public.courses TO anon, authenticated;
GRANT INSERT, UPDATE, DELETE ON public.courses TO authenticated;

GRANT SELECT ON public.lessons TO anon, authenticated;
GRANT INSERT, UPDATE, DELETE ON public.lessons TO authenticated;

GRANT SELECT, INSERT, UPDATE, DELETE ON public.enrollments TO authenticated;


-- ============================================================================
-- DONE! Your Readify database is ready.
-- ============================================================================
-- Next steps:
-- 1. Run supabase_storage.sql to set up file storage buckets
-- 2. Run seed_data.sql to populate test data
-- 3. Update your frontend .env with your Supabase URL and anon key
-- 4. Start the frontend: npm run dev
-- ============================================================================


-- ============================================================================
-- DANGER ZONE: DROP EVERYTHING (uncomment only if you need to reset)
-- ============================================================================
-- DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
-- DROP FUNCTION IF EXISTS public.handle_new_user();
-- DROP FUNCTION IF EXISTS public.update_updated_at_column() CASCADE;
-- DROP TABLE IF EXISTS public.enrollments CASCADE;
-- DROP TABLE IF EXISTS public.lessons CASCADE;
-- DROP TABLE IF EXISTS public.courses CASCADE;
-- DROP TABLE IF EXISTS public.profiles CASCADE;
