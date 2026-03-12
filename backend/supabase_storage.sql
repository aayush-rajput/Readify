-- ============================================================================
-- READIFY — SUPABASE STORAGE BUCKET SETUP
-- ============================================================================
-- Run this in Supabase Dashboard → SQL Editor AFTER supabase_migration.sql
-- Creates storage buckets for file uploads with appropriate access policies.
-- ============================================================================


-- ============================================================================
-- 1. CREATE STORAGE BUCKETS
-- ============================================================================

-- Course thumbnails (public — anyone can view thumbnails)
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
    'course-thumbnails',
    'course-thumbnails',
    true,
    5242880, -- 5MB max
    ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif']
)
ON CONFLICT (id) DO NOTHING;

-- Lesson content (private — only enrolled students and instructors)
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
    'lesson-content',
    'lesson-content',
    false,
    104857600, -- 100MB max (videos can be large)
    ARRAY[
        'video/mp4', 'video/webm', 'video/ogg',
        'application/pdf',
        'image/jpeg', 'image/png', 'image/webp'
    ]
)
ON CONFLICT (id) DO NOTHING;

-- Student assignment uploads (private)
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
    'assignments',
    'assignments',
    false,
    20971520, -- 20MB max
    ARRAY[
        'application/pdf',
        'application/msword',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'image/jpeg', 'image/png',
        'application/zip'
    ]
)
ON CONFLICT (id) DO NOTHING;

-- Instructor resources (private)
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
    'resources',
    'resources',
    false,
    52428800, -- 50MB max
    ARRAY[
        'application/pdf',
        'application/zip',
        'image/jpeg', 'image/png', 'image/webp',
        'video/mp4'
    ]
)
ON CONFLICT (id) DO NOTHING;


-- ============================================================================
-- 2. STORAGE POLICIES
-- ============================================================================

-- --------------------------------------------------------------------------
-- COURSE THUMBNAILS (public read, authenticated upload)
-- --------------------------------------------------------------------------

-- Anyone can view course thumbnails
CREATE POLICY "Public can view course thumbnails"
    ON storage.objects FOR SELECT
    USING (bucket_id = 'course-thumbnails');

-- Teachers and admins can upload thumbnails
CREATE POLICY "Teachers and admins can upload thumbnails"
    ON storage.objects FOR INSERT
    WITH CHECK (
        bucket_id = 'course-thumbnails'
        AND auth.role() = 'authenticated'
        AND EXISTS (
            SELECT 1 FROM public.profiles
            WHERE profiles.id = auth.uid()
            AND profiles.role IN ('teacher', 'admin')
        )
    );

-- Teachers and admins can update thumbnails
CREATE POLICY "Teachers and admins can update thumbnails"
    ON storage.objects FOR UPDATE
    USING (
        bucket_id = 'course-thumbnails'
        AND auth.role() = 'authenticated'
        AND EXISTS (
            SELECT 1 FROM public.profiles
            WHERE profiles.id = auth.uid()
            AND profiles.role IN ('teacher', 'admin')
        )
    );

-- Teachers and admins can delete thumbnails
CREATE POLICY "Teachers and admins can delete thumbnails"
    ON storage.objects FOR DELETE
    USING (
        bucket_id = 'course-thumbnails'
        AND auth.role() = 'authenticated'
        AND EXISTS (
            SELECT 1 FROM public.profiles
            WHERE profiles.id = auth.uid()
            AND profiles.role IN ('teacher', 'admin')
        )
    );


-- --------------------------------------------------------------------------
-- LESSON CONTENT (authenticated read, teacher/admin upload)
-- --------------------------------------------------------------------------

-- Authenticated users can view lesson content
CREATE POLICY "Authenticated users can view lesson content"
    ON storage.objects FOR SELECT
    USING (
        bucket_id = 'lesson-content'
        AND auth.role() = 'authenticated'
    );

-- Teachers and admins can upload lesson content
CREATE POLICY "Teachers and admins can upload lesson content"
    ON storage.objects FOR INSERT
    WITH CHECK (
        bucket_id = 'lesson-content'
        AND auth.role() = 'authenticated'
        AND EXISTS (
            SELECT 1 FROM public.profiles
            WHERE profiles.id = auth.uid()
            AND profiles.role IN ('teacher', 'admin')
        )
    );

-- Teachers and admins can delete lesson content
CREATE POLICY "Teachers and admins can delete lesson content"
    ON storage.objects FOR DELETE
    USING (
        bucket_id = 'lesson-content'
        AND auth.role() = 'authenticated'
        AND EXISTS (
            SELECT 1 FROM public.profiles
            WHERE profiles.id = auth.uid()
            AND profiles.role IN ('teacher', 'admin')
        )
    );


-- --------------------------------------------------------------------------
-- ASSIGNMENTS (students upload to own folder, teachers can read all)
-- --------------------------------------------------------------------------

-- Students can upload to their own folder
CREATE POLICY "Students can upload own assignments"
    ON storage.objects FOR INSERT
    WITH CHECK (
        bucket_id = 'assignments'
        AND auth.role() = 'authenticated'
        AND (storage.foldername(name))[1] = auth.uid()::text
    );

-- Users can view their own assignments; teachers/admins can view all
CREATE POLICY "Users can view own or teacher can view all assignments"
    ON storage.objects FOR SELECT
    USING (
        bucket_id = 'assignments'
        AND auth.role() = 'authenticated'
        AND (
            (storage.foldername(name))[1] = auth.uid()::text
            OR EXISTS (
                SELECT 1 FROM public.profiles
                WHERE profiles.id = auth.uid()
                AND profiles.role IN ('teacher', 'admin')
            )
        )
    );


-- --------------------------------------------------------------------------
-- RESOURCES (teacher/admin upload and manage, authenticated read)
-- --------------------------------------------------------------------------

-- Authenticated users can view resources
CREATE POLICY "Authenticated users can view resources"
    ON storage.objects FOR SELECT
    USING (
        bucket_id = 'resources'
        AND auth.role() = 'authenticated'
    );

-- Teachers and admins can upload resources
CREATE POLICY "Teachers and admins can upload resources"
    ON storage.objects FOR INSERT
    WITH CHECK (
        bucket_id = 'resources'
        AND auth.role() = 'authenticated'
        AND EXISTS (
            SELECT 1 FROM public.profiles
            WHERE profiles.id = auth.uid()
            AND profiles.role IN ('teacher', 'admin')
        )
    );

-- Teachers and admins can delete resources
CREATE POLICY "Teachers and admins can delete resources"
    ON storage.objects FOR DELETE
    USING (
        bucket_id = 'resources'
        AND auth.role() = 'authenticated'
        AND EXISTS (
            SELECT 1 FROM public.profiles
            WHERE profiles.id = auth.uid()
            AND profiles.role IN ('teacher', 'admin')
        )
    );


-- ============================================================================
-- DONE! Storage buckets are ready.
-- ============================================================================
