-- ============================================================================
-- READIFY — SEED DATA FOR DEVELOPMENT
-- ============================================================================
-- Run this in Supabase Dashboard → SQL Editor AFTER supabase_migration.sql
-- This inserts sample courses and lessons for testing.
--
-- NOTE: This does NOT create users — sign up via the frontend to create
-- test accounts. The handle_new_user trigger will auto-create profiles.
-- After signing up, you can manually set a user as admin:
--   UPDATE profiles SET role = 'admin' WHERE email = 'your@email.com';
-- ============================================================================


-- ============================================================================
-- SAMPLE COURSES
-- ============================================================================

INSERT INTO public.courses (id, title, description, thumbnail_url, instructor_name, category, level, duration_hours, price, is_published, created_at)
VALUES
    (
        'a1b2c3d4-e5f6-7890-abcd-111111111111',
        'Introduction to Web Development',
        'Learn the fundamentals of HTML, CSS, and JavaScript. Build your first website from scratch with hands-on projects and real-world examples.',
        'https://images.pexels.com/photos/270348/pexels-photo-270348.jpeg?auto=compress&cs=tinysrgb&w=800',
        'Dr. Sarah Chen',
        'Development',
        'beginner',
        24,
        0,
        true,
        now() - interval '30 days'
    ),
    (
        'a1b2c3d4-e5f6-7890-abcd-222222222222',
        'Advanced React Patterns',
        'Master advanced React concepts including custom hooks, compound components, render props, and state machines. Level up your frontend architecture skills.',
        'https://images.pexels.com/photos/11035471/pexels-photo-11035471.jpeg?auto=compress&cs=tinysrgb&w=800',
        'Prof. James Miller',
        'Development',
        'advanced',
        18,
        49.99,
        true,
        now() - interval '20 days'
    ),
    (
        'a1b2c3d4-e5f6-7890-abcd-333333333333',
        'UI/UX Design Fundamentals',
        'Discover the principles of user interface and user experience design. Learn to create beautiful, accessible, and user-friendly digital products.',
        'https://images.pexels.com/photos/196644/pexels-photo-196644.jpeg?auto=compress&cs=tinysrgb&w=800',
        'Maria Rodriguez',
        'Design',
        'beginner',
        16,
        29.99,
        true,
        now() - interval '15 days'
    ),
    (
        'a1b2c3d4-e5f6-7890-abcd-444444444444',
        'Data Science with Python',
        'Explore data analysis, visualization, and machine learning using Python. Work with pandas, matplotlib, scikit-learn, and real-world datasets.',
        'https://images.pexels.com/photos/577585/pexels-photo-577585.jpeg?auto=compress&cs=tinysrgb&w=800',
        'Dr. Alex Thompson',
        'Data Science',
        'intermediate',
        32,
        59.99,
        true,
        now() - interval '10 days'
    ),
    (
        'a1b2c3d4-e5f6-7890-abcd-555555555555',
        'Digital Marketing Masterclass',
        'Learn SEO, social media marketing, email campaigns, and paid advertising. Build a complete digital marketing strategy from the ground up.',
        'https://images.pexels.com/photos/905163/pexels-photo-905163.jpeg?auto=compress&cs=tinysrgb&w=800',
        'Lisa Park',
        'Marketing',
        'intermediate',
        20,
        39.99,
        false,  -- DRAFT — not published
        now() - interval '5 days'
    );


-- ============================================================================
-- SAMPLE LESSONS (for "Introduction to Web Development")
-- ============================================================================

INSERT INTO public.lessons (course_id, title, description, content_type, content_text, duration_minutes, order_index, is_free)
VALUES
    (
        'a1b2c3d4-e5f6-7890-abcd-111111111111',
        'What is Web Development?',
        'An overview of web development, the roles of frontend and backend, and what you''ll learn in this course.',
        'text',
        'Web development is the process of building and maintaining websites. It includes several areas: web design, web publishing, web programming, and database management.

In this course, we''ll focus on the three core technologies of the web:

1. **HTML** — the structure of web pages
2. **CSS** — the styling and layout
3. **JavaScript** — the interactivity and behavior

By the end of this course, you''ll be able to build a complete website from scratch!',
        15,
        1,
        true  -- Free preview
    ),
    (
        'a1b2c3d4-e5f6-7890-abcd-111111111111',
        'HTML Basics: Structure of a Web Page',
        'Learn the fundamental HTML tags and how to structure a web page.',
        'text',
        'HTML (HyperText Markup Language) is the standard markup language for creating web pages. Every web page is built with HTML.

Key concepts:
- Tags and elements: <h1>, <p>, <div>, <a>, <img>
- Attributes: class, id, src, href
- Document structure: <!DOCTYPE>, <html>, <head>, <body>
- Semantic elements: <header>, <nav>, <main>, <footer>

Practice: Create a simple personal page with a heading, paragraph, image, and navigation links.',
        30,
        2,
        false
    ),
    (
        'a1b2c3d4-e5f6-7890-abcd-111111111111',
        'CSS Fundamentals: Styling Your Page',
        'Introduction to CSS selectors, properties, the box model, and flexbox.',
        'text',
        'CSS (Cascading Style Sheets) controls the visual presentation of HTML elements.

Topics covered:
- Selectors: element, class, ID, combinator
- Properties: color, font-size, background, border, padding, margin
- The Box Model: content → padding → border → margin
- Display: block, inline, flex, grid
- Flexbox: align and distribute space among items

Practice: Style the personal page you created in the previous lesson.',
        45,
        3,
        false
    ),
    (
        'a1b2c3d4-e5f6-7890-abcd-111111111111',
        'JavaScript: Adding Interactivity',
        'Learn variables, functions, DOM manipulation, and event handling.',
        'text',
        'JavaScript is the programming language of the web. It allows you to add interactivity to your web pages.

Topics covered:
- Variables: let, const, var
- Data types: strings, numbers, booleans, arrays, objects
- Functions: declaration, expression, arrow functions
- DOM manipulation: getElementById, querySelector, innerHTML
- Events: click, submit, keydown, mouseover

Practice: Add a dark mode toggle and form validation to your page.',
        60,
        4,
        false
    ),
    (
        'a1b2c3d4-e5f6-7890-abcd-111111111111',
        'Building Your First Complete Website',
        'Put it all together — build a responsive portfolio website from scratch.',
        'text',
        'In this final lesson, you''ll combine everything you''ve learned to build a complete, responsive portfolio website.

Project requirements:
- Responsive navigation bar
- Hero section with a call-to-action
- Projects grid with hover effects
- Contact form with JavaScript validation
- Footer with social media links
- Mobile-friendly (responsive design)

Deploy your website using GitHub Pages or Netlify.',
        90,
        5,
        false
    );


-- ============================================================================
-- SAMPLE LESSONS (for "Advanced React Patterns")
-- ============================================================================

INSERT INTO public.lessons (course_id, title, description, content_type, content_text, duration_minutes, order_index, is_free)
VALUES
    (
        'a1b2c3d4-e5f6-7890-abcd-222222222222',
        'Why Advanced Patterns Matter',
        'Understanding when and why to use advanced React patterns in production applications.',
        'text',
        'As React applications grow, basic component patterns break down. Advanced patterns help you:

- Build reusable, composable component APIs
- Manage complex state without prop drilling
- Create flexible, extensible component libraries
- Improve performance and developer experience

In this course, we''ll explore patterns used by the best React libraries in the ecosystem.',
        20,
        1,
        true
    ),
    (
        'a1b2c3d4-e5f6-7890-abcd-222222222222',
        'Custom Hooks: Extracting Logic',
        'Build powerful, reusable custom hooks for data fetching, forms, and more.',
        'text',
        'Custom hooks let you extract component logic into reusable functions.

We''ll build:
- useLocalStorage: Persist state to localStorage
- useFetch: Data fetching with loading/error states
- useDebounce: Debounced values for search inputs
- useMediaQuery: Responsive design in JavaScript

Rules of hooks:
1. Only call hooks at the top level
2. Only call hooks from React functions',
        45,
        2,
        false
    ),
    (
        'a1b2c3d4-e5f6-7890-abcd-222222222222',
        'Compound Components Pattern',
        'Build flexible component APIs like Radix UI and Headless UI.',
        'text',
        'The Compound Components pattern allows components to communicate implicitly through a shared parent.

Example: <Select> + <SelectTrigger> + <SelectContent>

We''ll build a custom Accordion component using:
- React.createContext for shared state
- React.Children.map for flexible composition
- Controlled vs uncontrolled patterns',
        60,
        3,
        false
    );


-- ============================================================================
-- SAMPLE LESSONS (for "UI/UX Design Fundamentals")
-- ============================================================================

INSERT INTO public.lessons (course_id, title, description, content_type, content_text, duration_minutes, order_index, is_free)
VALUES
    (
        'a1b2c3d4-e5f6-7890-abcd-333333333333',
        'What is UX Design?',
        'Understanding user experience, user-centered design, and the UX design process.',
        'text',
        'User Experience (UX) design is the process of creating products that provide meaningful and relevant experiences to users.

Key concepts:
- User-centered design methodology
- The double diamond: Discover → Define → Develop → Deliver
- Empathy mapping and user personas
- Usability vs. aesthetics',
        25,
        1,
        true
    ),
    (
        'a1b2c3d4-e5f6-7890-abcd-333333333333',
        'Visual Design Principles',
        'Color theory, typography, spacing, and visual hierarchy.',
        'text',
        'Great visual design follows principles that guide the user''s eye and create a pleasant experience.

Principles:
- Hierarchy: Size, color, and position create importance
- Contrast: Light/dark, big/small, thick/thin
- Alignment: Consistent alignment creates order
- Proximity: Related items should be grouped together
- Repetition: Consistent patterns build recognition',
        35,
        2,
        false
    );


-- ============================================================================
-- DONE! Sample data is loaded.
-- ============================================================================
-- To test the full flow:
-- 1. Sign up a student account via the frontend
-- 2. Browse courses — you should see 4 published courses
-- 3. Enroll in "Introduction to Web Development"
-- 4. Navigate through lessons, mark them complete
-- 5. Check the Student Dashboard for progress stats
--
-- To test admin features:
-- 1. Sign up an account, then manually set role to admin:
--    UPDATE profiles SET role = 'admin' WHERE email = 'your-email@example.com';
-- 2. Visit /admin to see platform stats
-- 3. Visit /dashboard/instructor to manage courses
-- ============================================================================
