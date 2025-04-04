export interface ILecturer {
  name: string;
  title: string;
  department: string;
}
export interface CourseData {
  name: string;
  code: string;
  description?: string;
  isPublished: boolean;
  lecturerId: string;
}

export interface ICourse {
  id: string;
  name: string;
  code: string;
  description: string | null;
  assignments: number;
  students: number;
  isPublished: boolean;
}
