import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from '../models/User.js';
import Course from '../models/Course.js';
import Video from '../models/Video.js';
import Exam from '../models/Exam.js';

dotenv.config({ path: '../.env' });
dotenv.config();

const seed = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('MongoDB connected for seeding...');

    // Clear existing data
    await User.deleteMany({});
    await Course.deleteMany({});
    await Video.deleteMany({});
    await Exam.deleteMany({});

    // Create users
    const instructor = await User.create({
      name: 'Dr. Sarah Chen',
      email: 'instructor@readify.com',
      password: 'password123',
      role: 'teacher',
    });

    const instructor2 = await User.create({
      name: 'Prof. Rajesh Kumar',
      email: 'instructor2@readify.com',
      password: 'password123',
      role: 'teacher',
    });

    const student = await User.create({
      name: 'John Student',
      email: 'student@readify.com',
      password: 'password123',
      role: 'student',
    });

    const admin = await User.create({
      name: 'Admin User',
      email: 'admin@readify.com',
      password: 'password123',
      role: 'admin',
    });

    console.log('Users created.');

    // =================== COURSES ===================
    const courses = await Course.insertMany([
      {
        title: 'Software Engineering',
        description: 'Learn the principles of software engineering including SDLC, Agile methodologies, design patterns, testing strategies, and project management. Build real-world software with industry best practices.',
        thumbnail_url: 'https://images.pexels.com/photos/3861969/pexels-photo-3861969.jpeg?auto=compress&cs=tinysrgb&w=800',
        instructor: instructor._id,
        instructor_name: 'Dr. Sarah Chen',
        category: 'Computer Science',
        level: 'intermediate',
        duration_hours: 40,
        price: 0,
        is_published: true,
      },
      {
        title: 'Database Management Systems',
        description: 'Master relational databases, SQL queries, normalization, ER diagrams, transaction management, indexing, and NoSQL databases. Hands-on with MySQL, PostgreSQL, and MongoDB.',
        thumbnail_url: 'https://images.pexels.com/photos/1148820/pexels-photo-1148820.jpeg?auto=compress&cs=tinysrgb&w=800',
        instructor: instructor._id,
        instructor_name: 'Dr. Sarah Chen',
        category: 'Computer Science',
        level: 'intermediate',
        duration_hours: 36,
        price: 0,
        is_published: true,
      },
      {
        title: 'Data Structures & Algorithms',
        description: 'Deep dive into arrays, linked lists, stacks, queues, trees, graphs, sorting, searching, and dynamic programming. Essential for coding interviews and competitive programming.',
        thumbnail_url: 'https://images.pexels.com/photos/577585/pexels-photo-577585.jpeg?auto=compress&cs=tinysrgb&w=800',
        instructor: instructor2._id,
        instructor_name: 'Prof. Rajesh Kumar',
        category: 'Computer Science',
        level: 'intermediate',
        duration_hours: 48,
        price: 0,
        is_published: true,
      },
      {
        title: 'Computer Networks',
        description: 'Understand the OSI model, TCP/IP protocol suite, routing algorithms, network security, DNS, HTTP, and socket programming. Learn how the internet works from the ground up.',
        thumbnail_url: 'https://images.pexels.com/photos/2881229/pexels-photo-2881229.jpeg?auto=compress&cs=tinysrgb&w=800',
        instructor: instructor2._id,
        instructor_name: 'Prof. Rajesh Kumar',
        category: 'Computer Science',
        level: 'intermediate',
        duration_hours: 32,
        price: 0,
        is_published: true,
      },
      {
        title: 'Operating Systems',
        description: 'Study process management, memory management, file systems, CPU scheduling, deadlocks, and virtualization. Understand how modern OS like Linux and Windows work internally.',
        thumbnail_url: 'https://images.pexels.com/photos/1089438/pexels-photo-1089438.jpeg?auto=compress&cs=tinysrgb&w=800',
        instructor: instructor._id,
        instructor_name: 'Dr. Sarah Chen',
        category: 'Computer Science',
        level: 'advanced',
        duration_hours: 36,
        price: 0,
        is_published: true,
      },
      {
        title: 'Web Development with React',
        description: 'Build modern web applications with React, TypeScript, Node.js. Covers hooks, state management, REST APIs, authentication, and deployment.',
        thumbnail_url: 'https://images.pexels.com/photos/11035471/pexels-photo-11035471.jpeg?auto=compress&cs=tinysrgb&w=800',
        instructor: instructor._id,
        instructor_name: 'Dr. Sarah Chen',
        category: 'Development',
        level: 'beginner',
        duration_hours: 24,
        price: 0,
        is_published: true,
      },
      {
        title: 'Object-Oriented Programming with Java',
        description: 'Master OOP concepts — classes, inheritance, polymorphism, abstraction, encapsulation. Build Java applications with design patterns and SOLID principles.',
        thumbnail_url: 'https://images.pexels.com/photos/546819/pexels-photo-546819.jpeg?auto=compress&cs=tinysrgb&w=800',
        instructor: instructor2._id,
        instructor_name: 'Prof. Rajesh Kumar',
        category: 'Computer Science',
        level: 'beginner',
        duration_hours: 30,
        price: 0,
        is_published: true,
      },
      {
        title: 'Machine Learning Fundamentals',
        description: 'Introduction to supervised learning, unsupervised learning, neural networks, regression, classification, clustering. Hands-on with Python, scikit-learn, and TensorFlow.',
        thumbnail_url: 'https://images.pexels.com/photos/8386434/pexels-photo-8386434.jpeg?auto=compress&cs=tinysrgb&w=800',
        instructor: instructor2._id,
        instructor_name: 'Prof. Rajesh Kumar',
        category: 'Data Science',
        level: 'advanced',
        duration_hours: 42,
        price: 49.99,
        is_published: true,
      },
    ]);

    console.log('Courses created.');

    // =================== VIDEOS ===================
    // Software Engineering videos
    const seCourse = courses[0];
    await Video.insertMany([
      { course: seCourse._id, title: 'Introduction to Software Engineering', description: 'What is software engineering and why is it important?', url: 'https://www.youtube.com/embed/HQ0jGxMnhKg', duration_minutes: 20, order_index: 1 },
      { course: seCourse._id, title: 'Software Development Life Cycle (SDLC)', description: 'Waterfall, iterative, spiral, and V-model.', url: 'https://www.youtube.com/embed/Fi3_BjVzpqk', duration_minutes: 25, order_index: 2 },
      { course: seCourse._id, title: 'Agile Methodology & Scrum', description: 'Sprint planning, daily standups, retrospectives.', url: 'https://www.youtube.com/embed/NrHpXvDXVrw', duration_minutes: 30, order_index: 3 },
      { course: seCourse._id, title: 'Requirements Engineering', description: 'Functional and non-functional requirements, SRS documents.', url: 'https://www.youtube.com/embed/7ZnT1fBk5WA', duration_minutes: 22, order_index: 4 },
      { course: seCourse._id, title: 'Software Design & Architecture', description: 'Design patterns, UML diagrams, architectural styles.', url: 'https://www.youtube.com/embed/FLtqAi7WNBY', duration_minutes: 28, order_index: 5 },
    ]);

    // DBMS videos
    const dbmsCourse = courses[1];
    await Video.insertMany([
      { course: dbmsCourse._id, title: 'Introduction to DBMS', description: 'What is a database? DBMS vs File System.', url: 'https://www.youtube.com/embed/FR4QIeZaPeM', duration_minutes: 18, order_index: 1 },
      { course: dbmsCourse._id, title: 'ER Model & ER Diagrams', description: 'Entity-Relationship modeling for database design.', url: 'https://www.youtube.com/embed/OwMFJHkfhOc', duration_minutes: 25, order_index: 2 },
      { course: dbmsCourse._id, title: 'SQL Basics - SELECT, INSERT, UPDATE, DELETE', description: 'Master the four fundamental SQL operations.', url: 'https://www.youtube.com/embed/7S_tz1z_5bA', duration_minutes: 35, order_index: 3 },
      { course: dbmsCourse._id, title: 'Normalization (1NF, 2NF, 3NF, BCNF)', description: 'Eliminate data redundancy using normal forms.', url: 'https://www.youtube.com/embed/UrYLYV7WSHM', duration_minutes: 30, order_index: 4 },
      { course: dbmsCourse._id, title: 'Transactions & ACID Properties', description: 'Atomicity, Consistency, Isolation, Durability.', url: 'https://www.youtube.com/embed/P80Js_qClUE', duration_minutes: 22, order_index: 5 },
    ]);

    // DSA videos
    const dsaCourse = courses[2];
    await Video.insertMany([
      { course: dsaCourse._id, title: 'Arrays & Strings', description: 'Contiguous memory, string manipulation, 2D arrays.', url: 'https://www.youtube.com/embed/QJNwK2uJyGs', duration_minutes: 30, order_index: 1 },
      { course: dsaCourse._id, title: 'Linked Lists', description: 'Singly linked, doubly linked, circular linked lists.', url: 'https://www.youtube.com/embed/WwfhLC16bis', duration_minutes: 28, order_index: 2 },
      { course: dsaCourse._id, title: 'Stacks & Queues', description: 'LIFO, FIFO, applications, implementation.', url: 'https://www.youtube.com/embed/wjI1WNcIntg', duration_minutes: 25, order_index: 3 },
      { course: dsaCourse._id, title: 'Trees & Binary Search Trees', description: 'Traversals, balanced trees, AVL, Red-Black trees.', url: 'https://www.youtube.com/embed/oSWTXtMglKE', duration_minutes: 35, order_index: 4 },
      { course: dsaCourse._id, title: 'Sorting Algorithms', description: 'Bubble, Selection, Insertion, Merge, Quick, Heap sort.', url: 'https://www.youtube.com/embed/pkkFqlG0Hds', duration_minutes: 32, order_index: 5 },
    ]);

    // CN videos
    const cnCourse = courses[3];
    await Video.insertMany([
      { course: cnCourse._id, title: 'OSI Model Explained', description: '7 layers of networking explained simply.', url: 'https://www.youtube.com/embed/vv4y_uOneC0', duration_minutes: 20, order_index: 1 },
      { course: cnCourse._id, title: 'TCP/IP Protocol Suite', description: 'How the internet works with TCP and IP.', url: 'https://www.youtube.com/embed/2QGgEk20RXM', duration_minutes: 25, order_index: 2 },
      { course: cnCourse._id, title: 'IP Addressing & Subnetting', description: 'IPv4, IPv6, CIDR notation, subnet masks.', url: 'https://www.youtube.com/embed/rs39FWDhzDs', duration_minutes: 30, order_index: 3 },
      { course: cnCourse._id, title: 'Routing Protocols', description: 'RIP, OSPF, BGP — how data finds its path.', url: 'https://www.youtube.com/embed/AkxqkoxErRk', duration_minutes: 28, order_index: 4 },
    ]);

    // OS videos
    const osCourse = courses[4];
    await Video.insertMany([
      { course: osCourse._id, title: 'Introduction to OS', description: 'What does an OS do? Types of operating systems.', url: 'https://www.youtube.com/embed/26QPDBe-NB8', duration_minutes: 20, order_index: 1 },
      { course: osCourse._id, title: 'Process Management', description: 'Process states, PCB, context switching, threads.', url: 'https://www.youtube.com/embed/OrM7nZcxXZU', duration_minutes: 28, order_index: 2 },
      { course: osCourse._id, title: 'CPU Scheduling Algorithms', description: 'FCFS, SJF, Round Robin, Priority scheduling.', url: 'https://www.youtube.com/embed/Jkmy2YLUbUY', duration_minutes: 30, order_index: 3 },
      { course: osCourse._id, title: 'Memory Management & Paging', description: 'Virtual memory, page tables, segmentation.', url: 'https://www.youtube.com/embed/p9yZNLeOj4s', duration_minutes: 32, order_index: 4 },
    ]);

    // Web Dev videos
    const webCourse = courses[5];
    await Video.insertMany([
      { course: webCourse._id, title: 'HTML & CSS Basics', description: 'Building your first responsive web page.', url: 'https://www.youtube.com/embed/UB1O30fR-EE', duration_minutes: 25, order_index: 1 },
      { course: webCourse._id, title: 'JavaScript Fundamentals', description: 'Variables, functions, DOM manipulation.', url: 'https://www.youtube.com/embed/hdI2bqOjy3c', duration_minutes: 35, order_index: 2 },
      { course: webCourse._id, title: 'React Introduction', description: 'Components, JSX, props, and state.', url: 'https://www.youtube.com/embed/SqcY0GlETPk', duration_minutes: 30, order_index: 3 },
    ]);

    // OOP videos
    const oopCourse = courses[6];
    await Video.insertMany([
      { course: oopCourse._id, title: 'Classes and Objects', description: 'Creating classes, constructors, methods.', url: 'https://www.youtube.com/embed/pTB0EiLXUC8', duration_minutes: 22, order_index: 1 },
      { course: oopCourse._id, title: 'Inheritance & Polymorphism', description: 'Code reuse through inheritance, method overriding.', url: 'https://www.youtube.com/embed/9JpNY-XAseg', duration_minutes: 28, order_index: 2 },
      { course: oopCourse._id, title: 'Abstraction & Encapsulation', description: 'Data hiding and abstract classes.', url: 'https://www.youtube.com/embed/xfL1kal3mOs', duration_minutes: 25, order_index: 3 },
    ]);

    console.log('Videos created.');

    // =================== EXAMS (QUIZZES & ASSIGNMENTS) ===================

    // --- Software Engineering Exams ---
    await Exam.insertMany([
      {
        course: seCourse._id,
        title: 'Software Engineering - Quiz 1: SDLC & Basics',
        description: 'Test your understanding of SDLC models and software engineering fundamentals.',
        created_by: instructor._id,
        time_limit_minutes: 15,
        is_published: true,
        questions: [
          { question: 'What does SDLC stand for?', options: ['Software Development Life Cycle', 'System Design Life Cycle', 'Software Deployment Life Cycle', 'System Development Logic Cycle'], correctAnswer: 0 },
          { question: 'Which SDLC model is also known as the linear sequential model?', options: ['Spiral', 'Agile', 'Waterfall', 'Iterative'], correctAnswer: 2 },
          { question: 'Which phase involves defining what the software should do?', options: ['Design', 'Testing', 'Requirements Analysis', 'Maintenance'], correctAnswer: 2 },
          { question: 'What is a key advantage of Agile methodology?', options: ['No documentation needed', 'Flexibility to changing requirements', 'No testing required', 'Fixed timeline'], correctAnswer: 1 },
          { question: 'What is a Software Requirement Specification (SRS)?', options: ['Source code document', 'Document describing what the software should do', 'Test plan', 'Deployment guide'], correctAnswer: 1 },
          { question: 'Scrum is a type of:', options: ['Waterfall model', 'Agile framework', 'Testing tool', 'Programming language'], correctAnswer: 1 },
          { question: 'What is the purpose of a sprint in Scrum?', options: ['To write all the code at once', 'A time-boxed iteration to deliver incrementally', 'To deploy software', 'To fix all bugs'], correctAnswer: 1 },
          { question: 'Which type of testing verifies individual components?', options: ['Integration Testing', 'System Testing', 'Unit Testing', 'Acceptance Testing'], correctAnswer: 2 },
          { question: 'What is coupling in software design?', options: ['The degree of interdependence between modules', 'A type of bug', 'A testing technique', 'A programming paradigm'], correctAnswer: 0 },
          { question: 'Good software design aims for:', options: ['High coupling, low cohesion', 'Low coupling, high cohesion', 'High coupling, high cohesion', 'No coupling, no cohesion'], correctAnswer: 1 },
        ],
      },
      {
        course: seCourse._id,
        title: 'Software Engineering - Assignment: Design Patterns',
        description: 'Assignment covering design patterns, UML diagrams, and software architecture concepts.',
        created_by: instructor._id,
        time_limit_minutes: 30,
        is_published: true,
        questions: [
          { question: 'Which design pattern provides a way to create objects without exposing the creation logic?', options: ['Observer', 'Factory', 'Singleton', 'Adapter'], correctAnswer: 1 },
          { question: 'The Singleton pattern ensures:', options: ['Multiple instances', 'Exactly one instance of a class', 'No instances', 'Abstract instances'], correctAnswer: 1 },
          { question: 'UML stands for:', options: ['Universal Modeling Language', 'Unified Modeling Language', 'United Markup Language', 'Unified Markup Logic'], correctAnswer: 1 },
          { question: 'Which UML diagram shows the flow of activities?', options: ['Class Diagram', 'Sequence Diagram', 'Activity Diagram', 'Component Diagram'], correctAnswer: 2 },
          { question: 'MVC stands for:', options: ['Model View Controller', 'Module View Component', 'Main Virtual Class', 'Model Version Control'], correctAnswer: 0 },
          { question: 'Which pattern is used when you want to notify multiple objects about changes?', options: ['Singleton', 'Factory', 'Observer', 'Strategy'], correctAnswer: 2 },
          { question: 'What is refactoring?', options: ['Rewriting entire software from scratch', 'Restructuring existing code without changing its behavior', 'Adding new features', 'Fixing bugs'], correctAnswer: 1 },
          { question: 'Which SOLID principle says a class should have only one reason to change?', options: ['Open/Closed', 'Single Responsibility', 'Dependency Inversion', 'Liskov Substitution'], correctAnswer: 1 },
        ],
      },
    ]);

    // --- DBMS Exams ---
    await Exam.insertMany([
      {
        course: dbmsCourse._id,
        title: 'DBMS - Quiz 1: SQL & Relational Model',
        description: 'Test your SQL knowledge and understanding of the relational database model.',
        created_by: instructor._id,
        time_limit_minutes: 15,
        is_published: true,
        questions: [
          { question: 'SQL stands for:', options: ['Structured Query Language', 'Simple Question Language', 'Sequential Query Logic', 'System Query Language'], correctAnswer: 0 },
          { question: 'Which SQL command is used to retrieve data?', options: ['GET', 'FETCH', 'SELECT', 'RETRIEVE'], correctAnswer: 2 },
          { question: 'Which SQL statement adds new data to a table?', options: ['ADD', 'INSERT INTO', 'PUT', 'CREATE'], correctAnswer: 1 },
          { question: 'A primary key must be:', options: ['Nullable', 'Unique and not null', 'Duplicated', 'Auto-incremented'], correctAnswer: 1 },
          { question: 'What does a foreign key do?', options: ['Deletes data', 'References a primary key in another table', 'Creates indexes', 'Locks the table'], correctAnswer: 1 },
          { question: 'Which JOIN returns all rows from both tables?', options: ['INNER JOIN', 'LEFT JOIN', 'FULL OUTER JOIN', 'CROSS JOIN'], correctAnswer: 2 },
          { question: 'GROUP BY is used with:', options: ['WHERE', 'ORDER BY', 'Aggregate functions like COUNT, SUM', 'INSERT'], correctAnswer: 2 },
          { question: 'Which clause filters grouped results?', options: ['WHERE', 'HAVING', 'GROUP BY', 'ORDER BY'], correctAnswer: 1 },
          { question: 'What is a view in SQL?', options: ['A physical table', 'A virtual table based on a query', 'A type of index', 'A stored procedure'], correctAnswer: 1 },
          { question: 'Normalization reduces:', options: ['Query speed', 'Data redundancy', 'Number of tables', 'Number of columns'], correctAnswer: 1 },
        ],
      },
      {
        course: dbmsCourse._id,
        title: 'DBMS - Quiz 2: Normalization & Transactions',
        description: 'Test your knowledge of database normalization and transaction management.',
        created_by: instructor._id,
        time_limit_minutes: 20,
        is_published: true,
        questions: [
          { question: 'First Normal Form (1NF) requires:', options: ['No multi-valued attributes', 'No partial dependencies', 'No transitive dependencies', 'All attributes depend on key'], correctAnswer: 0 },
          { question: 'Second Normal Form (2NF) eliminates:', options: ['Multi-valued attributes', 'Partial dependencies', 'Transitive dependencies', 'All anomalies'], correctAnswer: 1 },
          { question: 'ACID in transactions stands for:', options: ['Atomicity, Consistency, Isolation, Durability', 'Association, Concurrency, Integration, Data', 'Atomic, Coherent, Isolated, Durable', 'Access, Control, Integrity, Durability'], correctAnswer: 0 },
          { question: 'Which property ensures a transaction is all-or-nothing?', options: ['Consistency', 'Isolation', 'Durability', 'Atomicity'], correctAnswer: 3 },
          { question: 'A deadlock occurs when:', options: ['A query is slow', 'Two transactions wait for each other indefinitely', 'The database crashes', 'A table is too large'], correctAnswer: 1 },
          { question: 'Which isolation level has the most concurrency but least consistency?', options: ['Serializable', 'Repeatable Read', 'Read Committed', 'Read Uncommitted'], correctAnswer: 3 },
          { question: 'BCNF is stricter than:', options: ['1NF', '2NF', '3NF', 'All of the above'], correctAnswer: 3 },
          { question: 'A schedule is serializable if:', options: ['It runs serially', 'Its result equals some serial schedule', 'It uses only SELECT', 'It has no joins'], correctAnswer: 1 },
        ],
      },
      {
        course: dbmsCourse._id,
        title: 'DBMS - Assignment: Database Design',
        description: 'Comprehensive assignment on ER modeling, SQL, and normalization.',
        created_by: instructor._id,
        time_limit_minutes: 30,
        is_published: true,
        questions: [
          { question: 'An ER diagram represents:', options: ['Source code structure', 'Data and relationships', 'Network topology', 'CPU architecture'], correctAnswer: 1 },
          { question: 'A weak entity:', options: ['Has its own primary key', 'Cannot exist without a strong entity', 'Is always large', 'Has no attributes'], correctAnswer: 1 },
          { question: 'Which SQL function returns the number of rows?', options: ['SUM()', 'COUNT()', 'TOTAL()', 'NUM()'], correctAnswer: 1 },
          { question: 'CREATE INDEX is used to:', options: ['Create a new table', 'Speed up data retrieval', 'Create a backup', 'Delete records'], correctAnswer: 1 },
          { question: 'A stored procedure is:', options: ['A saved SQL query that can be reused', 'A type of table', 'A database backup', 'A constraint'], correctAnswer: 0 },
          { question: 'Which type of relationship allows many records on both sides?', options: ['One-to-One', 'One-to-Many', 'Many-to-Many', 'None'], correctAnswer: 2 },
          { question: 'The TRUNCATE command:', options: ['Deletes specific rows', 'Removes all rows from a table', 'Drops the table', 'Updates rows'], correctAnswer: 1 },
          { question: 'A composite key is:', options: ['A single column key', 'A combination of two or more columns', 'A foreign key', 'An auto-generated key'], correctAnswer: 1 },
          { question: 'Which command changes the structure of a table?', options: ['UPDATE', 'MODIFY', 'ALTER TABLE', 'CHANGE TABLE'], correctAnswer: 2 },
          { question: 'Data independence means:', options: ['Data cannot be accessed', 'Changing data storage doesn\'t affect the application', 'Data has no schema', 'Data is always consistent'], correctAnswer: 1 },
        ],
      },
    ]);

    // --- DSA Exams ---
    await Exam.insertMany([
      {
        course: dsaCourse._id,
        title: 'DSA - Quiz 1: Arrays, Stacks & Queues',
        description: 'Test your understanding of fundamental data structures.',
        created_by: instructor2._id,
        time_limit_minutes: 15,
        is_published: true,
        questions: [
          { question: 'What is the time complexity of accessing an element in an array by index?', options: ['O(n)', 'O(log n)', 'O(1)', 'O(n²)'], correctAnswer: 2 },
          { question: 'Stack follows which principle?', options: ['FIFO', 'LIFO', 'Random Access', 'Priority'], correctAnswer: 1 },
          { question: 'Queue follows which principle?', options: ['LIFO', 'FIFO', 'LILO', 'Random'], correctAnswer: 1 },
          { question: 'Which data structure is used for recursion implementation?', options: ['Queue', 'Array', 'Stack', 'Linked List'], correctAnswer: 2 },
          { question: 'Time complexity of inserting at the beginning of a dynamic array is:', options: ['O(1)', 'O(log n)', 'O(n)', 'O(n²)'], correctAnswer: 2 },
          { question: 'A circular queue solves the problem of:', options: ['Stack overflow', 'Wasted space in linear queue', 'Sorting', 'Searching'], correctAnswer: 1 },
          { question: 'Which operation adds an element to a stack?', options: ['Enqueue', 'Push', 'Insert', 'Append'], correctAnswer: 1 },
          { question: 'Infix expression (A+B)*C in postfix is:', options: ['AB+C*', 'ABC*+', '+AB*C', '*+ABC'], correctAnswer: 0 },
        ],
      },
      {
        course: dsaCourse._id,
        title: 'DSA - Quiz 2: Trees & Sorting',
        description: 'Test your knowledge of tree data structures and sorting algorithms.',
        created_by: instructor2._id,
        time_limit_minutes: 20,
        is_published: true,
        questions: [
          { question: 'A binary tree has at most how many children per node?', options: ['1', '2', '3', 'Unlimited'], correctAnswer: 1 },
          { question: 'In-order traversal of a BST gives:', options: ['Random order', 'Sorted ascending order', 'Reverse order', 'Level order'], correctAnswer: 1 },
          { question: 'The height of a balanced BST with n nodes is:', options: ['O(n)', 'O(log n)', 'O(n²)', 'O(1)'], correctAnswer: 1 },
          { question: 'Which sorting algorithm has worst-case O(n log n)?', options: ['Quick Sort', 'Bubble Sort', 'Merge Sort', 'Selection Sort'], correctAnswer: 2 },
          { question: 'Best case time complexity of Bubble Sort is:', options: ['O(n²)', 'O(n log n)', 'O(n)', 'O(1)'], correctAnswer: 2 },
          { question: 'Quick Sort uses which algorithm design technique?', options: ['Greedy', 'Dynamic Programming', 'Divide and Conquer', 'Backtracking'], correctAnswer: 2 },
          { question: 'A full binary tree with n leaves has how many internal nodes?', options: ['n', 'n-1', 'n+1', '2n'], correctAnswer: 1 },
          { question: 'Which traversal visits root first?', options: ['Inorder', 'Preorder', 'Postorder', 'Level order'], correctAnswer: 1 },
          { question: 'Heap is a:', options: ['Linear data structure', 'Complete binary tree', 'Graph', 'Hash table'], correctAnswer: 1 },
          { question: 'Counting Sort has time complexity:', options: ['O(n log n)', 'O(n²)', 'O(n + k)', 'O(n)'], correctAnswer: 2 },
        ],
      },
      {
        course: dsaCourse._id,
        title: 'DSA - Assignment: Problem Solving',
        description: 'Comprehensive assignment testing algorithmic thinking.',
        created_by: instructor2._id,
        time_limit_minutes: 30,
        is_published: true,
        questions: [
          { question: 'Time complexity of binary search is:', options: ['O(n)', 'O(log n)', 'O(n²)', 'O(1)'], correctAnswer: 1 },
          { question: 'Which data structure uses hashing?', options: ['Stack', 'Queue', 'HashMap', 'Linked List'], correctAnswer: 2 },
          { question: 'Dijkstra\'s algorithm finds:', options: ['Shortest path', 'Minimum spanning tree', 'Maximum flow', 'Topological order'], correctAnswer: 0 },
          { question: 'BFS uses which data structure?', options: ['Stack', 'Queue', 'Heap', 'Array'], correctAnswer: 1 },
          { question: 'DFS uses which data structure?', options: ['Queue', 'Heap', 'Stack', 'Priority Queue'], correctAnswer: 2 },
          { question: 'Fibonacci sequence computed naively has complexity:', options: ['O(n)', 'O(n²)', 'O(2^n)', 'O(log n)'], correctAnswer: 2 },
          { question: 'The Big-O of two nested loops each running n times is:', options: ['O(n)', 'O(2n)', 'O(n²)', 'O(n log n)'], correctAnswer: 2 },
          { question: 'An AVL tree maintains:', options: ['Color property', 'Balance factor ≤ 1', 'B-tree property', 'Heap property'], correctAnswer: 1 },
        ],
      },
    ]);

    // --- Computer Networks Exams ---
    await Exam.insertMany([
      {
        course: cnCourse._id,
        title: 'CN - Quiz 1: OSI & TCP/IP',
        description: 'Test your knowledge of the OSI model and TCP/IP protocol suite.',
        created_by: instructor2._id,
        time_limit_minutes: 15,
        is_published: true,
        questions: [
          { question: 'How many layers does the OSI model have?', options: ['4', '5', '6', '7'], correctAnswer: 3 },
          { question: 'Which layer handles end-to-end communication?', options: ['Network', 'Transport', 'Data Link', 'Session'], correctAnswer: 1 },
          { question: 'TCP is a:', options: ['Connectionless protocol', 'Connection-oriented protocol', 'Routing protocol', 'Application protocol'], correctAnswer: 1 },
          { question: 'UDP is used when:', options: ['Reliability is critical', 'Speed is more important than reliability', 'Large files are transferred', 'Encryption is needed'], correctAnswer: 1 },
          { question: 'Which layer converts data into frames?', options: ['Physical', 'Data Link', 'Network', 'Transport'], correctAnswer: 1 },
          { question: 'IP operates at which OSI layer?', options: ['Transport', 'Network', 'Data Link', 'Application'], correctAnswer: 1 },
          { question: 'HTTP operates on port:', options: ['21', '25', '80', '443'], correctAnswer: 2 },
          { question: 'DNS converts:', options: ['IP to MAC', 'Domain name to IP address', 'IP to domain name', 'Both B and C'], correctAnswer: 3 },
          { question: 'Which protocol is used for email sending?', options: ['HTTP', 'FTP', 'SMTP', 'POP3'], correctAnswer: 2 },
          { question: 'A subnet mask is used for:', options: ['Encryption', 'Routing', 'Dividing a network into sub-networks', 'DNS resolution'], correctAnswer: 2 },
        ],
      },
      {
        course: cnCourse._id,
        title: 'CN - Assignment: Networking Concepts',
        description: 'Comprehensive test on routing, addressing, and network protocols.',
        created_by: instructor2._id,
        time_limit_minutes: 25,
        is_published: true,
        questions: [
          { question: 'IPv4 address is how many bits?', options: ['16', '32', '64', '128'], correctAnswer: 1 },
          { question: 'IPv6 address is how many bits?', options: ['32', '64', '128', '256'], correctAnswer: 2 },
          { question: 'Which device operates at Layer 3?', options: ['Hub', 'Switch', 'Router', 'Repeater'], correctAnswer: 2 },
          { question: 'ARP resolves:', options: ['IP to MAC address', 'Domain to IP', 'MAC to IP', 'Port to service'], correctAnswer: 0 },
          { question: 'HTTPS uses port:', options: ['80', '443', '22', '25'], correctAnswer: 1 },
          { question: 'Which topology has a single point of failure at the center?', options: ['Mesh', 'Star', 'Ring', 'Bus'], correctAnswer: 1 },
          { question: 'Packet switching divides data into:', options: ['Frames', 'Segments', 'Packets', 'All of the above'], correctAnswer: 2 },
          { question: 'Firewall is used for:', options: ['Routing', 'Network security', 'Load balancing', 'Caching'], correctAnswer: 1 },
        ],
      },
    ]);

    // --- OS Exams ---
    await Exam.insertMany([
      {
        course: osCourse._id,
        title: 'OS - Quiz 1: Process & CPU Scheduling',
        description: 'Test your understanding of process management and CPU scheduling.',
        created_by: instructor._id,
        time_limit_minutes: 15,
        is_published: true,
        questions: [
          { question: 'A process in the "ready" state is:', options: ['Waiting for I/O', 'Currently executing', 'Waiting for CPU', 'Terminated'], correctAnswer: 2 },
          { question: 'Context switching involves:', options: ['Creating a new process', 'Saving and loading process states', 'Deleting a process', 'Allocating memory'], correctAnswer: 1 },
          { question: 'FCFS scheduling stands for:', options: ['First Come First Served', 'Fast CPU First Schedule', 'First Core First Start', 'Fast Cache First Search'], correctAnswer: 0 },
          { question: 'Round Robin uses:', options: ['Priority', 'Shortest job', 'Time quantum', 'Arrival time only'], correctAnswer: 2 },
          { question: 'Which scheduling is preemptive?', options: ['FCFS', 'SJF (non-preemptive)', 'Round Robin', 'None'], correctAnswer: 2 },
          { question: 'A thread is:', options: ['A heavy-weight process', 'A light-weight unit of a process', 'A type of file', 'A memory block'], correctAnswer: 1 },
          { question: 'Semaphore is used for:', options: ['Memory allocation', 'Process synchronization', 'File storage', 'Network routing'], correctAnswer: 1 },
          { question: 'Starvation occurs when:', options: ['A process gets too much CPU', 'A process waits indefinitely for resources', 'Memory overflows', 'The OS crashes'], correctAnswer: 1 },
        ],
      },
      {
        course: osCourse._id,
        title: 'OS - Quiz 2: Memory Management',
        description: 'Test your knowledge of memory management and virtual memory.',
        created_by: instructor._id,
        time_limit_minutes: 15,
        is_published: true,
        questions: [
          { question: 'Virtual memory allows:', options: ['Faster CPU', 'Programs larger than physical memory to run', 'More processes to be created', 'Better graphics'], correctAnswer: 1 },
          { question: 'Paging divides memory into:', options: ['Segments', 'Fixed-size pages', 'Variable blocks', 'Clusters'], correctAnswer: 1 },
          { question: 'A page fault occurs when:', options: ['A page is corrupted', 'Requested page is not in RAM', 'Memory is full', 'CPU overheats'], correctAnswer: 1 },
          { question: 'LRU stands for:', options: ['Last Recently Updated', 'Least Recently Used', 'Latest Resource Usage', 'Lowest Read Unit'], correctAnswer: 1 },
          { question: 'Thrashing happens when:', options: ['CPU is idle', 'Excessive paging slows down the system', 'Disk is full', 'Too many files are open'], correctAnswer: 1 },
          { question: 'Internal fragmentation occurs in:', options: ['Paging', 'Segmentation', 'Linked allocation', 'All'], correctAnswer: 0 },
          { question: 'External fragmentation occurs in:', options: ['Paging', 'Segmentation', 'Virtual memory', 'Cache'], correctAnswer: 1 },
          { question: 'TLB is a:', options: ['Type of RAM', 'Cache for page table entries', 'Disk scheduling algorithm', 'Type of interrupt'], correctAnswer: 1 },
        ],
      },
      {
        course: osCourse._id,
        title: 'OS - Assignment: Comprehensive',
        description: 'Comprehensive assignment covering all OS concepts.',
        created_by: instructor._id,
        time_limit_minutes: 30,
        is_published: true,
        questions: [
          { question: 'Deadlock requires all four conditions. Which is NOT one?', options: ['Mutual Exclusion', 'Hold and Wait', 'Preemption', 'Circular Wait'], correctAnswer: 2 },
          { question: 'Banker\'s algorithm is used for:', options: ['Memory management', 'Deadlock avoidance', 'CPU scheduling', 'File management'], correctAnswer: 1 },
          { question: 'RAID stands for:', options: ['Random Array of Independent Disks', 'Redundant Array of Independent Disks', 'Reliable Array of Integrated Disks', 'Rapid Access to Indexed Data'], correctAnswer: 1 },
          { question: 'Which file allocation method has no external fragmentation?', options: ['Contiguous', 'Linked', 'Indexed', 'Both B and C'], correctAnswer: 3 },
          { question: 'The fork() system call creates:', options: ['A new file', 'A new thread', 'A new process', 'A new directory'], correctAnswer: 2 },
          { question: 'Which disk scheduling has the least seek time for sorted requests?', options: ['FCFS', 'SSTF', 'SCAN', 'C-SCAN'], correctAnswer: 1 },
          { question: 'Kernel mode allows:', options: ['User applications only', 'Unrestricted hardware access', 'Limited access', 'Network only'], correctAnswer: 1 },
          { question: 'A zombie process is:', options: ['A process using too much CPU', 'A terminated process whose entry remains in process table', 'A sleeping process', 'An orphan process'], correctAnswer: 1 },
          { question: 'Spooling is used in:', options: ['CPU scheduling', 'Printer management', 'Memory management', 'File system'], correctAnswer: 1 },
          { question: 'The ready queue contains:', options: ['Terminated processes', 'Processes waiting for I/O', 'Processes ready to execute', 'All processes'], correctAnswer: 2 },
        ],
      },
    ]);

    // --- Web Dev Exam ---
    await Exam.insertMany([
      {
        course: webCourse._id,
        title: 'Web Dev - Quiz: HTML, CSS, JavaScript & React',
        description: 'Test your full-stack web development knowledge.',
        created_by: instructor._id,
        time_limit_minutes: 15,
        is_published: true,
        questions: [
          { question: 'What does HTML stand for?', options: ['Hyper Text Markup Language', 'High Tech Modern Language', 'Hyper Transfer Markup Language', 'Home Tool Markup Language'], correctAnswer: 0 },
          { question: 'Which CSS property changes text color?', options: ['font-color', 'text-color', 'color', 'foreground-color'], correctAnswer: 2 },
          { question: 'React uses which syntax for templates?', options: ['HTML', 'JSX', 'XML', 'JSON'], correctAnswer: 1 },
          { question: 'useState returns:', options: ['A value', 'A function', 'An array of [value, setter]', 'An object'], correctAnswer: 2 },
          { question: 'Which hook handles side effects in React?', options: ['useState', 'useEffect', 'useContext', 'useMemo'], correctAnswer: 1 },
          { question: 'CSS Flexbox direction default is:', options: ['column', 'row', 'row-reverse', 'column-reverse'], correctAnswer: 1 },
          { question: 'JavaScript "===" checks:', options: ['Value only', 'Type only', 'Value and type', 'Reference only'], correctAnswer: 2 },
          { question: 'npm stands for:', options: ['Node Package Manager', 'New Project Maker', 'Node Process Monitor', 'Network Protocol Manager'], correctAnswer: 0 },
        ],
      },
    ]);

    // --- OOP Exam ---
    await Exam.insertMany([
      {
        course: oopCourse._id,
        title: 'OOP - Quiz: Object Oriented Concepts',
        description: 'Test your understanding of OOP principles.',
        created_by: instructor2._id,
        time_limit_minutes: 15,
        is_published: true,
        questions: [
          { question: 'What are the four pillars of OOP?', options: ['Array, Loop, Function, Variable', 'Encapsulation, Abstraction, Inheritance, Polymorphism', 'Class, Object, Method, Package', 'Compile, Run, Debug, Test'], correctAnswer: 1 },
          { question: 'Encapsulation means:', options: ['Inheriting properties', 'Wrapping data and methods together', 'Multiple forms', 'Abstract classes'], correctAnswer: 1 },
          { question: 'Polymorphism allows:', options: ['Data hiding', 'One interface, multiple implementations', 'Single inheritance', 'Static typing'], correctAnswer: 1 },
          { question: 'Method overloading is an example of:', options: ['Runtime polymorphism', 'Compile-time polymorphism', 'Inheritance', 'Abstraction'], correctAnswer: 1 },
          { question: 'An abstract class can:', options: ['Be instantiated directly', 'Have both abstract and concrete methods', 'Only have abstract methods', 'Not be extended'], correctAnswer: 1 },
          { question: 'An interface in Java defines:', options: ['Only variables', 'Method signatures without implementation (before Java 8)', 'Complete methods', 'Constructors'], correctAnswer: 1 },
          { question: 'Multiple inheritance of classes is supported in:', options: ['Java', 'C++', 'C#', 'Kotlin'], correctAnswer: 1 },
          { question: 'this keyword refers to:', options: ['The class itself', 'The current object', 'The parent class', 'A static reference'], correctAnswer: 1 },
        ],
      },
    ]);

    console.log('Exams created.');
    console.log('\n--- Seed Complete ---');
    console.log('Instructor:  instructor@readify.com / password123');
    console.log('Instructor2: instructor2@readify.com / password123');
    console.log('Student:     student@readify.com / password123');
    console.log('Admin:       admin@readify.com / password123');

    process.exit(0);
  } catch (error) {
    console.error('Seed error:', error);
    process.exit(1);
  }
};

seed();
