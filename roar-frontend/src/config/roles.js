export const ROLES = {
  STUDENT: 'Student/apc user',
  FACULTY_REP: 'Faculty Representative',
  LIBRARIAN: 'Librarian',
  EXECUTIVE_DIRECTOR: 'Executive Director'
};

export const MOCK_USERS = [
  {
    email: 'student.user@apc.edu.ph',
    password: 'password123',
    name: 'APC Student',
    role: ROLES.STUDENT
  },
  {
    email: 'facrep.cs@apc.edu.ph',
    password: 'password123',
    name: 'CS Faculty Rep',
    role: ROLES.FACULTY_REP
  },
  {
    email: 'librarian@apc.edu.ph',
    password: 'password123',
    name: 'APC Librarian',
    role: ROLES.LIBRARIAN
  },
  {
    email: 'execdirector@apc.edu.ph',
    password: 'password123',
    name: 'SOCIT Executive Director',
    role: ROLES.EXECUTIVE_DIRECTOR
  }
];
