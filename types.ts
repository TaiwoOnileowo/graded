export interface ILecturer {
  name: string;
  title: string;
  department: string;
}
export interface CourseData {
  name: string;
  code: string;
  description?: string;
  lecturerId: string;
}

export interface Course {
  id: string;
  name: string;
  code: string;
  description?: string;
  isPublished: boolean;
  lecturer: string;
  assignments: number;
}

export interface ICourse {
  id: string;
  name: string;
  code: string;
  description: string | null;
  assignments: number;
  students?: number;
  isPublished: boolean;
  enrolled?: boolean;
  lecturer: string;
}

export interface RubricItem {
  id: string;
  title: string;
  description: string;
  maxPoints: number;
}

export interface IEnrolledCourse {
  id: string;
  name: string;
  code: string;
  description: string | null;
  assignments: number;
  lecturer: string;
}
