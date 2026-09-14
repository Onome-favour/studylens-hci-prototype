/**
 * StudyLens — Quiz Data
 *
 * 3 multiple-choice questions per topic × 7 topics = 21 questions total.
 * Each question has 4 options, a correct answer, and a short explanation.
 *
 * Correct answers are distributed across A/B/C/D to avoid positional bias.
 *
 * ⚠️ Academic prototype. Questions are illustrative, not validated assessments.
 */

const quizzes = {
  // ─────────────────────────────────────────────────────────────────────────
  // Topic 1: Introduction to Databases
  // ─────────────────────────────────────────────────────────────────────────
  'intro-to-databases': {
    topicId: 'intro-to-databases',
    questions: [
      {
        id: 'intro-q1',
        text: 'What does DBMS stand for?',
        options: [
          { id: 'a', text: 'Data Backup Management Service' },
          { id: 'b', text: 'Database Management System' },
          { id: 'c', text: 'Digital Base Management Software' },
          { id: 'd', text: 'Database Maintenance System' },
        ],
        correctId: 'b',
        explanation:
          'DBMS stands for Database Management System — software that manages the creation, querying, updating, and administration of databases.',
      },
      {
        id: 'intro-q2',
        text: 'Which of the following is an example of a NoSQL database?',
        options: [
          { id: 'a', text: 'MySQL' },
          { id: 'b', text: 'PostgreSQL' },
          { id: 'c', text: 'MongoDB' },
          { id: 'd', text: 'Oracle Database' },
        ],
        correctId: 'c',
        explanation:
          'MongoDB is a document-oriented NoSQL database. MySQL, PostgreSQL, and Oracle are relational (SQL) databases.',
      },
      {
        id: 'intro-q3',
        text: 'What is the primary purpose of a database?',
        options: [
          { id: 'a', text: 'To organise, store, and retrieve data efficiently' },
          { id: 'b', text: 'To create graphical user interfaces' },
          { id: 'c', text: 'To compile programming code' },
          { id: 'd', text: 'To manage network connections' },
        ],
        correctId: 'a',
        explanation:
          'The primary purpose of a database is to organise, store, and retrieve data efficiently, enabling structured access to information.',
      },
    ],
  },

  // ─────────────────────────────────────────────────────────────────────────
  // Topic 2: Entity-Relationship Modeling
  // ─────────────────────────────────────────────────────────────────────────
  'er-modeling': {
    topicId: 'er-modeling',
    questions: [
      {
        id: 'er-q1',
        text: 'In an ER diagram, what does a rectangle represent?',
        options: [
          { id: 'a', text: 'An attribute' },
          { id: 'b', text: 'A relationship' },
          { id: 'c', text: 'An entity' },
          { id: 'd', text: 'A primary key' },
        ],
        correctId: 'c',
        explanation:
          'In ER diagrams, rectangles represent entities — real-world objects or concepts about which data is stored.',
      },
      {
        id: 'er-q2',
        text: 'What does cardinality describe in an ER model?',
        options: [
          { id: 'a', text: 'The size of the database' },
          { id: 'b', text: 'The number of instances in a relationship between entities' },
          { id: 'c', text: 'The number of attributes an entity has' },
          { id: 'd', text: 'The storage format of data' },
        ],
        correctId: 'b',
        explanation:
          'Cardinality describes how many instances of one entity relate to instances of another — for example, one-to-many or many-to-many.',
      },
      {
        id: 'er-q3',
        text: 'Which shape is used to represent attributes in a traditional ER diagram?',
        options: [
          { id: 'a', text: 'Rectangle' },
          { id: 'b', text: 'Diamond' },
          { id: 'c', text: 'Triangle' },
          { id: 'd', text: 'Oval (ellipse)' },
        ],
        correctId: 'd',
        explanation:
          'Attributes are represented by ovals (ellipses) connected to their entity or relationship in traditional ER diagrams.',
      },
    ],
  },

  // ─────────────────────────────────────────────────────────────────────────
  // Topic 3: Relational Model
  // ─────────────────────────────────────────────────────────────────────────
  'relational-model': {
    topicId: 'relational-model',
    questions: [
      {
        id: 'rel-q1',
        text: 'What uniquely identifies each row in a relational table?',
        options: [
          { id: 'a', text: 'Foreign key' },
          { id: 'b', text: 'Primary key' },
          { id: 'c', text: 'Index' },
          { id: 'd', text: 'Column name' },
        ],
        correctId: 'b',
        explanation:
          'A primary key is a column (or set of columns) that uniquely identifies each row in a table. No two rows can have the same primary key value.',
      },
      {
        id: 'rel-q2',
        text: 'A foreign key in a table refers to:',
        options: [
          { id: 'a', text: 'A column that stores encrypted data' },
          { id: 'b', text: 'A column that must contain unique values only' },
          { id: 'c', text: 'A column with no constraints' },
          { id: 'd', text: 'The primary key of another table' },
        ],
        correctId: 'd',
        explanation:
          'A foreign key is a column that references the primary key of another table, creating a link between the two tables.',
      },
      {
        id: 'rel-q3',
        text: 'In the relational model, a "relation" is another term for:',
        options: [
          { id: 'a', text: 'A table' },
          { id: 'b', text: 'A row' },
          { id: 'c', text: 'A database' },
          { id: 'd', text: 'A query' },
        ],
        correctId: 'a',
        explanation:
          'In relational database theory, a "relation" refers to a table — a structured set of data organised into rows (tuples) and columns (attributes).',
      },
    ],
  },

  // ─────────────────────────────────────────────────────────────────────────
  // Topic 4: SQL Fundamentals
  // ─────────────────────────────────────────────────────────────────────────
  'sql-fundamentals': {
    topicId: 'sql-fundamentals',
    questions: [
      {
        id: 'sql-q1',
        text: 'Which SQL statement is used to retrieve data from a database?',
        options: [
          { id: 'a', text: 'GET' },
          { id: 'b', text: 'RETRIEVE' },
          { id: 'c', text: 'SELECT' },
          { id: 'd', text: 'FETCH' },
        ],
        correctId: 'c',
        explanation:
          'SELECT is the SQL statement used to query and retrieve data from one or more tables.',
      },
      {
        id: 'sql-q2',
        text: 'What does the WHERE clause do in a SQL query?',
        options: [
          { id: 'a', text: 'Filters rows based on a specified condition' },
          { id: 'b', text: 'Sorts the result set' },
          { id: 'c', text: 'Groups rows by a column' },
          { id: 'd', text: 'Limits the number of columns returned' },
        ],
        correctId: 'a',
        explanation:
          'The WHERE clause filters rows so that only those meeting the specified condition are included in the result.',
      },
      {
        id: 'sql-q3',
        text: 'Which SQL statement is used to remove rows from a table?',
        options: [
          { id: 'a', text: 'REMOVE' },
          { id: 'b', text: 'DELETE' },
          { id: 'c', text: 'DROP' },
          { id: 'd', text: 'ERASE' },
        ],
        correctId: 'b',
        explanation:
          'DELETE removes rows from a table based on a condition. DROP removes the entire table structure, which is different.',
      },
    ],
  },

  // ─────────────────────────────────────────────────────────────────────────
  // Topic 5: SQL JOINs
  // ─────────────────────────────────────────────────────────────────────────
  'sql-joins': {
    topicId: 'sql-joins',
    questions: [
      {
        id: 'join-q1',
        text: 'Which type of JOIN returns all records from the left table and only matching records from the right table?',
        options: [
          { id: 'a', text: 'INNER JOIN' },
          { id: 'b', text: 'LEFT JOIN' },
          { id: 'c', text: 'RIGHT JOIN' },
          { id: 'd', text: 'CROSS JOIN' },
        ],
        correctId: 'b',
        explanation:
          'A LEFT JOIN (or LEFT OUTER JOIN) returns all rows from the left table and the matching rows from the right table. Non-matching right-side rows appear as NULL.',
      },
      {
        id: 'join-q2',
        text: 'What happens to non-matching rows in an INNER JOIN?',
        options: [
          { id: 'a', text: 'They are filled with NULL values' },
          { id: 'b', text: 'They appear at the end of the result' },
          { id: 'c', text: 'They are excluded from the result' },
          { id: 'd', text: 'They cause an error' },
        ],
        correctId: 'c',
        explanation:
          'An INNER JOIN returns only the rows that have matching values in both tables. Non-matching rows are excluded entirely.',
      },
      {
        id: 'join-q3',
        text: 'A self-join is used when:',
        options: [
          { id: 'a', text: 'A table needs to be joined with itself' },
          { id: 'b', text: 'Two databases are connected' },
          { id: 'c', text: 'The query runs automatically' },
          { id: 'd', text: 'No JOIN keyword is needed' },
        ],
        correctId: 'a',
        explanation:
          'A self-join joins a table with itself, typically using table aliases. It is useful for comparing rows within the same table — for example, finding employees who share the same manager.',
      },
    ],
  },

  // ─────────────────────────────────────────────────────────────────────────
  // Topic 6: Database Normalization
  // ─────────────────────────────────────────────────────────────────────────
  'database-normalization': {
    topicId: 'database-normalization',
    questions: [
      {
        id: 'norm-q1',
        text: 'What is the primary goal of database normalization?',
        options: [
          { id: 'a', text: 'To increase query speed' },
          { id: 'b', text: 'To add more tables' },
          { id: 'c', text: 'To make the database larger' },
          { id: 'd', text: 'To reduce data redundancy and improve data integrity' },
        ],
        correctId: 'd',
        explanation:
          'Normalization reduces data redundancy (duplicate data) and improves data integrity by organising data into well-structured tables.',
      },
      {
        id: 'norm-q2',
        text: 'A table is in First Normal Form (1NF) if:',
        options: [
          { id: 'a', text: 'Each column contains only atomic (indivisible) values' },
          { id: 'b', text: 'It has no foreign keys' },
          { id: 'c', text: 'All columns are of the same data type' },
          { id: 'd', text: 'It has exactly one primary key column' },
        ],
        correctId: 'a',
        explanation:
          '1NF requires that each column contains only atomic (indivisible) values — no repeating groups or arrays within a single cell.',
      },
      {
        id: 'norm-q3',
        text: 'Denormalization is sometimes used because:',
        options: [
          { id: 'a', text: 'It always improves data integrity' },
          { id: 'b', text: 'It eliminates the need for indexes' },
          { id: 'c', text: 'It can improve read performance by reducing the number of joins needed' },
          { id: 'd', text: 'It is required by all modern databases' },
        ],
        correctId: 'c',
        explanation:
          'Denormalization intentionally introduces some redundancy to reduce the number of joins needed for common queries, which can improve read performance at the cost of more complex writes.',
      },
    ],
  },

  // ─────────────────────────────────────────────────────────────────────────
  // Topic 7: Functional Dependencies
  // ─────────────────────────────────────────────────────────────────────────
  'functional-dependencies': {
    topicId: 'functional-dependencies',
    questions: [
      {
        id: 'fd-q1',
        text: 'In the functional dependency A → B, what is A called?',
        options: [
          { id: 'a', text: 'The dependent' },
          { id: 'b', text: 'The candidate key' },
          { id: 'c', text: 'The determinant' },
          { id: 'd', text: 'The foreign key' },
        ],
        correctId: 'c',
        explanation:
          'In A → B, A is the determinant — it determines (uniquely identifies) the value of B for any given value of A.',
      },
      {
        id: 'fd-q2',
        text: 'The closure of a set of attributes is:',
        options: [
          { id: 'a', text: 'The minimum number of tables needed' },
          { id: 'b', text: 'The set of all attributes that can be functionally determined from those attributes' },
          { id: 'c', text: 'The total number of rows in a table' },
          { id: 'd', text: 'A type of database index' },
        ],
        correctId: 'b',
        explanation:
          'The closure of a set of attributes X (written X⁺) is the set of all attributes that can be functionally determined from X using the given functional dependencies.',
      },
      {
        id: 'fd-q3',
        text: 'Functional dependencies are directly used to determine:',
        options: [
          { id: 'a', text: 'Query execution speed' },
          { id: 'b', text: 'Network latency' },
          { id: 'c', text: 'Storage file format' },
          { id: 'd', text: 'The appropriate level of normalization for a table' },
        ],
        correctId: 'd',
        explanation:
          'Functional dependencies are the theoretical basis for normalization. They help determine whether a table satisfies a particular normal form and how it should be decomposed.',
      },
    ],
  },
};

export default quizzes;

/** Look up quiz for a specific topic. Returns undefined if not found. */
export function getQuizByTopicId(topicId) {
  return quizzes[topicId];
}
