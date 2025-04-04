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
