import { 
  users, membershipPlans, userMemberships, courseCategories, courses, courseSections, courseLessons,
  enrollments, lessonProgress, courseReviews, courseAddons, userAddonPurchases,
  courseTranslations, courseSectionTranslations, courseLessonTranslations,
  resourceCategories, resources, resourceRatings, resourceDownloads, resourceViews,
  forumCategories, forumTopics, forumPosts, forumPostLikes,
  mentorProfiles, mentorshipSessions, mentorshipReviews,
  passwordResetTokens, emailVerificationTokens, userSessions,
  type User, type InsertUser, type MembershipPlan, type InsertMembershipPlan, 
  type UserMembership, type InsertUserMembership, type CourseCategory, type InsertCourseCategory, 
  type Course, type InsertCourse, type CourseSection, type InsertCourseSection,
  type CourseLesson, type InsertCourseLesson, type Enrollment, type InsertEnrollment, 
  type LessonProgress, type InsertLessonProgress, type CourseReview, type InsertCourseReview, 
  type CourseAddon, type InsertCourseAddon, type UserAddonPurchase, type InsertUserAddonPurchase,
  type CourseTranslation, type CourseSectionTranslation, type CourseLessonTranslation,
  type ResourceCategory, type InsertResourceCategory, type Resource, type InsertResource,
  type ResourceRating, type InsertResourceRating, type ResourceDownload, type InsertResourceDownload,
  type ResourceView, type InsertResourceView,
  type ForumCategory, type InsertForumCategory, type ForumTopic, type InsertForumTopic,
  type ForumPost, type InsertForumPost, type ForumPostLike, type InsertForumPostLike,
  type MentorProfile, type InsertMentorProfile, type MentorshipSession, type InsertMentorshipSession,
  type MentorshipReview, type InsertMentorshipReview
} from "@shared/schema";
import { db } from "./db";
import { eq, desc, gte, lt, and, or, sql } from "drizzle-orm";

export interface IStorage {
  // Users  
  getUser(id: number): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  getAllUsers(): Promise<User[]>;
  createUser(user: InsertUser): Promise<User>;
  updateUser(id: number, user: Partial<InsertUser>): Promise<User | undefined>;
  updateUserLastLogin(id: number): Promise<void>;
  deleteUser(id: number): Promise<boolean>;
  
  // Authentication operations
  createPasswordResetToken(userId: number, token: string, expiresAt: Date): Promise<void>;
  getPasswordResetToken(token: string): Promise<{ userId: number; expiresAt: Date } | undefined>;
  usePasswordResetToken(token: string): Promise<boolean>;
  createEmailVerificationToken(userId: number, token: string, expiresAt: Date): Promise<void>;
  getEmailVerificationToken(token: string): Promise<{ userId: number; expiresAt: Date } | undefined>;
  useEmailVerificationToken(token: string): Promise<boolean>;
  verifyUserEmail(userId: number): Promise<void>;
  createUserSession(userId: number, sessionToken: string, expiresAt: Date, userAgent?: string, ipAddress?: string): Promise<void>;
  getUserSession(sessionToken: string): Promise<{ userId: number; expiresAt: Date } | undefined>;
  deleteUserSession(sessionToken: string): Promise<boolean>;
  deleteUserSessions(userId: number): Promise<void>;

  // Membership Management
  getMembershipPlans(): Promise<MembershipPlan[]>;
  getMembershipPlan(id: number): Promise<MembershipPlan | undefined>;
  createMembershipPlan(plan: InsertMembershipPlan): Promise<MembershipPlan>;
  updateMembershipPlan(id: number, plan: Partial<InsertMembershipPlan>): Promise<MembershipPlan | undefined>;

  // User Memberships
  getUserMembership(userId: number): Promise<UserMembership | undefined>;
  createUserMembership(membership: InsertUserMembership): Promise<UserMembership>;
  updateUserMembership(id: number, membership: Partial<InsertUserMembership>): Promise<UserMembership | undefined>;
  getUserMemberships(userId: number): Promise<UserMembership[]>;

  // Enrollment Management
  getUserEnrollments(userId: number): Promise<Enrollment[]>;
  createEnrollment(enrollment: InsertEnrollment): Promise<Enrollment>;
  updateEnrollment(id: number, enrollment: Partial<InsertEnrollment>): Promise<Enrollment | undefined>;

  // LMS Methods
  getCourses(filters?: any, language?: string): Promise<Course[]>;
  getCourse(id: number, language?: string): Promise<Course | undefined>;
  getCourseBySlug(slug: string, language?: string): Promise<Course | undefined>;
  createCourse(course: InsertCourse): Promise<Course>;
  updateCourse(id: number, course: Partial<InsertCourse>): Promise<Course | undefined>;
  deleteCourse(id: number): Promise<boolean>;
  duplicateCourse(id: number): Promise<Course | undefined>;
  deleteCourseSection(id: number): Promise<boolean>;
  deleteCourseLesson(id: number): Promise<boolean>;
  getCourseCategories(): Promise<CourseCategory[]>;
  createCourseCategory(category: InsertCourseCategory): Promise<CourseCategory>;
  getCourseSections(courseId: number, language?: string): Promise<CourseSection[]>;
  createCourseSection(section: InsertCourseSection): Promise<CourseSection>;
  updateCourseSection(id: number, updates: Partial<CourseSection>): Promise<CourseSection | undefined>;
  getCourseLessons(sectionId: number, language?: string): Promise<CourseLesson[]>;
  getSectionLessons(sectionId: number, language?: string): Promise<CourseLesson[]>;
  getLesson(id: number, language?: string): Promise<CourseLesson | undefined>;
  createCourseLesson(lesson: InsertCourseLesson): Promise<CourseLesson>;
  updateCourseLesson(id: number, updates: Partial<CourseLesson>): Promise<CourseLesson | undefined>;
  
  // Progress and Reviews
  getCourseEnrollments(courseId: number): Promise<Enrollment[]>;
  getEnrollment(userId: number, courseId: number): Promise<Enrollment | undefined>;
  getLessonProgress(userId: number, lessonId: number): Promise<LessonProgress | undefined>;
  createLessonProgress(progress: InsertLessonProgress): Promise<LessonProgress>;
  updateLessonProgress(id: number, progress: Partial<InsertLessonProgress>): Promise<LessonProgress | undefined>;
  getCourseSection(id: number): Promise<CourseSection | undefined>;
  getCourseReviews(courseId: number): Promise<CourseReview[]>;
  createCourseReview(review: InsertCourseReview): Promise<CourseReview>;
  
  // Course Addons
  getCourseAddons(courseId: number): Promise<CourseAddon[]>;
  createCourseAddon(addon: InsertCourseAddon): Promise<CourseAddon>;
