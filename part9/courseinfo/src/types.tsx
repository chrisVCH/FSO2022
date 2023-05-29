export interface HeaderProps {
    name: string;
}

export interface CourseInfo {
    name: string;
    exerciseCount: number;
}

export interface CoursePartBase {
    name: string;
    exerciseCount: number;
  }

export interface CoursePartWithDesc extends CoursePartBase {
  description: string;
}  
  
export interface CoursePartBasic extends CoursePartWithDesc {
  kind: "basic"
}
  
export interface CoursePartGroup extends CoursePartBase {
  groupProjectCount: number;
  kind: "group"
}
  
export interface CoursePartBackground extends CoursePartWithDesc {
  backgroundMaterial: string;
  kind: "background"
}

export interface CoursePartSpecial extends CoursePartWithDesc {
  requirements: string[];
  kind: "special"
}

export type CoursePart = CoursePartBasic | CoursePartGroup | CoursePartBackground | CoursePartSpecial ;

export interface ContentProps {
  parts: CoursePart[]
}

export interface PartProps {
  part: CoursePart
}