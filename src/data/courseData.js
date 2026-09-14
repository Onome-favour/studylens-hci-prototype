/**
 * StudyLens — Course Data
 *
 * Defines the Database Management course structure, topics, and mock materials.
 * This is the single course used throughout the prototype.
 *
 * ⚠️ Academic prototype. Topics are predefined — not extracted from real documents.
 */

// ─────────────────────────────────────────────────────────────────────────────
// COURSE DEFINITION
// ─────────────────────────────────────────────────────────────────────────────

export const course = {
  id: 'cs3200',
  name: 'Database Management',
  code: 'CS 3200',
  semester: 'Fall 2026',

  // ── Mock materials (visual only — no real upload or processing) ──────────
  materials: [
    {
      id: 'mat-1',
      name: 'CS3200_Lecture_Notes_Week1-7.pdf',
      type: 'lecture-notes',
      icon: '📄',
    },
    {
      id: 'mat-2',
      name: 'Database_Systems_Chapter_Summaries.pdf',
      type: 'reading',
      icon: '📖',
    },
    {
      id: 'mat-3',
      name: 'ER_Modeling_Slides.pdf',
      type: 'slides',
      icon: '📊',
    },
    {
      id: 'mat-4',
      name: 'SQL_Practice_Problems.pdf',
      type: 'practice',
      icon: '📝',
    },
  ],

  // ── Topics (ordered by typical syllabus progression) ────────────────────
  topics: [
    {
      id: 'intro-to-databases',
      name: 'Introduction to Databases',
      order: 1,
      difficulty: 'foundational',
      prerequisites: [],
      summary:
        'An introduction to the fundamental concepts of databases, database management systems (DBMS), and the different types of databases used in modern computing.',
      keyConcepts: ['What is a database', 'DBMS', 'Types of databases'],
    },
    {
      id: 'er-modeling',
      name: 'Entity-Relationship Modeling',
      order: 2,
      difficulty: 'foundational',
      prerequisites: ['intro-to-databases'],
      summary:
        'Entity-Relationship (ER) modeling is a technique for visually representing the structure of a database. It uses diagrams to describe entities, their attributes, and the relationships between them.',
      keyConcepts: [
        'ER diagrams',
        'Entities',
        'Attributes',
        'Relationships',
        'Cardinality',
      ],
    },
    {
      id: 'relational-model',
      name: 'Relational Model',
      order: 3,
      difficulty: 'intermediate',
      prerequisites: ['intro-to-databases'],
      summary:
        'The relational model organises data into tables (relations) with rows and columns. It defines how data is structured, stored, and accessed using keys and relational algebra.',
      keyConcepts: [
        'Tables',
        'Primary keys',
        'Foreign keys',
        'Candidate keys',
        'Relational algebra basics',
      ],
    },
    {
      id: 'sql-fundamentals',
      name: 'SQL Fundamentals',
      order: 4,
      difficulty: 'intermediate',
      prerequisites: ['relational-model'],
      summary:
        'SQL (Structured Query Language) is the standard language for interacting with relational databases. This topic covers the core statements for querying, inserting, updating, and deleting data.',
      keyConcepts: [
        'SELECT',
        'INSERT',
        'UPDATE',
        'DELETE',
        'WHERE',
        'ORDER BY',
      ],
    },
    {
      id: 'sql-joins',
      name: 'SQL JOINs',
      order: 5,
      difficulty: 'intermediate-advanced',
      prerequisites: ['sql-fundamentals'],
      summary:
        'JOINs allow you to combine rows from two or more tables based on a related column. Different types of JOINs control which rows are included when matches are or are not found.',
      keyConcepts: [
        'INNER JOIN',
        'LEFT JOIN',
        'RIGHT JOIN',
        'FULL OUTER JOIN',
        'Self-joins',
      ],
    },
    {
      id: 'database-normalization',
      name: 'Database Normalization',
      order: 6,
      difficulty: 'advanced',
      prerequisites: ['relational-model'],
      summary:
        'Normalization is the process of organising a relational database to reduce redundancy and improve data integrity. It involves decomposing tables into smaller tables following normal form rules.',
      keyConcepts: ['1NF', '2NF', '3NF', 'BCNF', 'Denormalization trade-offs'],
    },
    {
      id: 'functional-dependencies',
      name: 'Functional Dependencies',
      order: 7,
      difficulty: 'advanced',
      prerequisites: ['relational-model', 'database-normalization'],
      summary:
        'Functional dependencies describe relationships between attributes in a relation. They are the theoretical foundation for database normalization and help determine how tables should be decomposed.',
      keyConcepts: [
        'Determinants',
        'Attribute closure',
        'Minimal cover',
        'Relationship to normalization',
      ],
    },
  ],
};

// ─────────────────────────────────────────────────────────────────────────────
// CONVENIENCE HELPERS
// ─────────────────────────────────────────────────────────────────────────────

/** Look up a single topic by ID. Returns undefined if not found. */
export function getTopicById(topicId) {
  return course.topics.find((t) => t.id === topicId);
}

/** Get all topic IDs in syllabus order. */
export function getTopicIds() {
  return course.topics.map((t) => t.id);
}
