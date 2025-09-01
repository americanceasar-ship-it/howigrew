import { 
  users, membershipPlans, userMemberships, courseCategories, courses, courseSections, courseLessons,
  enrollments, lessonProgress, courseReviews, courseAddons, userAddonPurchases,
  courseTranslations, courseSectionTranslations, courseLessonTranslations,
  resourceCategories, resources, resourceRatings, resourceDownloads, resourceViews,
  forumCategories, forumTopics, forumPosts, forumPostLikes,
  mentorProfiles, mentorshipSessions, mentorshipReviews,
  passwordResetTokens, emailVerificationTokens, userSessions,
  glossaryTerms, lessonTranslations, promotionalCodes, promotionalCodeUsage, membershipGrants,
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
  type MentorshipReview, type InsertMentorshipReview,
  type GlossaryTerm, type InsertGlossaryTerm, type LessonTranslation, type InsertLessonTranslation,
  type PromotionalCode, type InsertPromotionalCode, type PromotionalCodeUsage,
  type MembershipGrant, type InsertMembershipGrant
} from "@shared/schema";
import { db } from "./db";
import { eq, desc, gte, lt, and, or, sql } from "drizzle-orm";

export interface IStorage {
  // Users  
  getUser(id: number): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  getAllUsers(): Promise<User[]>;
  getUsersWithFilters(filters: {
    search?: string;
    role?: string;
    membershipType?: string;
    isActive?: boolean;
    limit?: number;
    offset?: number;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
  }): Promise<{ users: User[]; total: number }>;
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
  getUserAddonPurchases(userId: number): Promise<UserAddonPurchase[]>;
  createUserAddonPurchase(purchase: InsertUserAddonPurchase): Promise<UserAddonPurchase>;

  // Forum Methods
  getForumCategories(): Promise<ForumCategory[]>;
  getForumTopics(categoryId?: number): Promise<ForumTopic[]>;
  getForumTopic(id: number): Promise<ForumTopic | undefined>;
  createForumTopic(topic: InsertForumTopic): Promise<ForumTopic>;
  getForumPosts(topicId: number): Promise<ForumPost[]>;
  createForumPost(post: InsertForumPost): Promise<ForumPost>;
  likeForumPost(userId: number, postId: number): Promise<ForumPostLike>;
  updateTopicViews(topicId: number): Promise<void>;
  getForumPostCount(categoryId: number): Promise<number>;

  // Mentorship Methods
  getMentorProfiles(): Promise<MentorProfile[]>;
  getMentorProfile(id: number): Promise<MentorProfile | undefined>;
  createMentorProfile(profile: InsertMentorProfile): Promise<MentorProfile>;
  updateMentorProfile(id: number, updates: Partial<MentorProfile>): Promise<MentorProfile | undefined>;
  getMentorshipSessions(userId: number): Promise<MentorshipSession[]>;
  createMentorshipSession(session: InsertMentorshipSession): Promise<MentorshipSession>;
  updateMentorshipSession(id: number, updates: Partial<MentorshipSession>): Promise<MentorshipSession | undefined>;
  getMentorshipReviews(mentorId: number): Promise<MentorshipReview[]>;
  createMentorshipReview(review: InsertMentorshipReview): Promise<MentorshipReview>;

  // Resource Methods
  getResourceCategories(): Promise<ResourceCategory[]>;
  createResourceCategory(category: InsertResourceCategory): Promise<ResourceCategory>;
  getResources(filters?: any): Promise<Resource[]>;
  getResource(id: number): Promise<Resource | undefined>;
  getResourceBySlug(slug: string): Promise<Resource | undefined>;
  createResource(resource: InsertResource): Promise<Resource>;
  updateResource(id: number, resource: Partial<InsertResource>): Promise<Resource | undefined>;
  deleteResource(id: number): Promise<boolean>;
  getFeaturedResources(): Promise<Resource[]>;
  getResourcesByCategory(categoryId: number): Promise<Resource[]>;
  getResourcesByType(type: string): Promise<Resource[]>;
  createResourceRating(rating: InsertResourceRating): Promise<ResourceRating>;
  getResourceRatings(resourceId: number): Promise<ResourceRating[]>;
  createResourceView(view: InsertResourceView): Promise<ResourceView>;
  createResourceDownload(download: InsertResourceDownload): Promise<ResourceDownload>;
  updateResourceStats(resourceId: number, type: 'view' | 'download'): Promise<void>;

  // Educational Enhancement Methods
  getGlossaryTerms(courseId?: number, language?: string, category?: string): Promise<GlossaryTerm[]>;
  getGlossaryTerm(id: number): Promise<GlossaryTerm | undefined>;
  createGlossaryTerm(term: InsertGlossaryTerm): Promise<GlossaryTerm>;
  updateGlossaryTerm(id: number, term: Partial<InsertGlossaryTerm>): Promise<GlossaryTerm | undefined>;
  deleteGlossaryTerm(id: number): Promise<boolean>;
  searchGlossaryTerms(query: string, language?: string): Promise<GlossaryTerm[]>;
  
  // Lesson Translation Methods
  getLessonTranslations(lessonId: number): Promise<LessonTranslation[]>;
  getLessonTranslation(lessonId: number, language: string): Promise<LessonTranslation | undefined>;
  createLessonTranslation(translation: InsertLessonTranslation): Promise<LessonTranslation>;
  updateLessonTranslation(id: number, translation: Partial<InsertLessonTranslation>): Promise<LessonTranslation | undefined>;
  deleteLessonTranslation(id: number): Promise<boolean>;
  getTranslationProgress(language: string): Promise<{ total: number; translated: number; approved: number; }>;

  // Analytics Methods
  getAdminAnalytics(): Promise<{
    totalUsers: number;
    totalCourses: number;
    totalRevenue: number;
    activeUsers: number;
    totalEnrollments: number;
    averageRating: number;
  }>;
  getUserCount(): Promise<number>;
  getCourseCount(): Promise<number>;
  getTotalRevenue(): Promise<number>;
  getActiveUserCount(): Promise<number>;
  getTotalUsers(): Promise<number>;
  getActiveEnrollments(): Promise<number>;
  getTotalCourses(): Promise<number>;
  getCompletedEnrollments(): Promise<number>;

  // Promotional Codes Methods
  getPromotionalCodes(): Promise<PromotionalCode[]>;
  getPromotionalCode(id: number): Promise<PromotionalCode | undefined>;
  getPromotionalCodeByCode(code: string): Promise<PromotionalCode | undefined>;
  createPromotionalCode(code: InsertPromotionalCode): Promise<PromotionalCode>;
  updatePromotionalCode(id: number, code: Partial<InsertPromotionalCode>): Promise<PromotionalCode | undefined>;
  deletePromotionalCode(id: number): Promise<boolean>;
  validatePromotionalCode(code: string, courseId?: number, membershipType?: string): Promise<{
    valid: boolean;
    code?: PromotionalCode;
    discount?: {
      type: string;
      value: number;
      finalPrice: number;
    };
    message?: string;
  }>;
  usePromotionalCode(code: string, userId: number, courseId?: number): Promise<{
    success: boolean;
    enrollment?: Enrollment;
    membershipUpdate?: User;
    savings?: number;
    message?: string;
  }>;

  // Membership Grants Methods
  getMembershipGrants(): Promise<MembershipGrant[]>;
  getMembershipGrant(id: number): Promise<MembershipGrant | undefined>;
  createMembershipGrant(grant: InsertMembershipGrant): Promise<MembershipGrant>;
  revokeMembershipGrant(id: number): Promise<boolean>;
  getUserMembershipGrants(userId: number): Promise<MembershipGrant[]>;
}

// MemStorage class removed - using DatabaseStorage only for production
// This eliminates TypeScript compilation errors from incomplete interface implementation

export class DatabaseStorage implements IStorage {

    const allAccessPlan: MembershipPlan = {
      id: this.currentMembershipPlanId++,
      name: "Premium Plan",
      description: "Complete access to our real estate education platform",
      price: "29.99",
      currency: "USD",
      interval: "month",
      intervalCount: 1,
      features: ["Access to ALL courses", "Priority community access", "Direct instructor support", "Advanced market analysis tools", "Monthly live Q&A sessions", "Downloadable resources", "Progress tracking & analytics", "Mobile app premium features"],
      isPopular: true,
      isActive: true,
      maxCourses: null, // Unlimited
      maxStudents: null,
      supportLevel: "priority",
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.membershipPlans.set(allAccessPlan.id, allAccessPlan);

    const lifetimePlan: MembershipPlan = {
      id: this.currentMembershipPlanId++,
      name: "Lifetime All-Access",
      description: "One-time payment for lifetime unlimited access to all courses",
      price: "497.00",
      currency: "USD",
      interval: "lifetime",
      intervalCount: 1,
      features: ["Lifetime access to all courses", "All future courses included", "Premium support", "Master class recordings", "Direct instructor access", "VIP community"],
      isPopular: false,
      isActive: true,
      maxCourses: null,
      maxStudents: null,
      supportLevel: "premium",
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.membershipPlans.set(lifetimePlan.id, lifetimePlan);

    // Create course categories
    const krishaWholesalingCategory: CourseCategory = {
      id: this.currentCourseCategoryId++,
      name: "Krisha.kz Wholesaling",
      description: "Learn to buy properties with no money using krisha.kz platform",
      slug: "krisha-wholesaling",
      parentId: null,
      sortOrder: 1,
      isActive: true,
      createdAt: new Date(),
    };
    this.courseCategories.set(krishaWholesalingCategory.id, krishaWholesalingCategory);

    // Create US Real Estate category
    const usRealEstateCategory: CourseCategory = {
      id: this.currentCourseCategoryId++,
      name: "US Real Estate",
      description: "Learn to wholesale US real estate from anywhere in the world",
      slug: "us-real-estate",
      parentId: null,
      sortOrder: 2,
      isActive: true,
      createdAt: new Date(),
    };
    this.courseCategories.set(usRealEstateCategory.id, usRealEstateCategory);

    // Create instructor user with real password
    const instructor: User = {
      id: this.currentUserId++,
      email: "instructor@grewacademy.com",
      passwordHash: "$2b$10$LLPT0N0ECjjU6Ox6Z/8tlefNdIpespOoET5OULDNkpzoDL0SkLOJy",
      name: "Marcus Rodriguez",
      role: "instructor",
      membershipType: "lifetime",
      hasUnlimitedAccess: true,
      isActive: true,
      emailVerified: true,
      lastLoginAt: null,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.users.set(instructor.id, instructor);

    // Create admin user with real password
    const adminUser: User = {
      id: this.currentUserId++,
      email: "admin@howigrew.com",
      passwordHash: "$2b$10$kUYwhrq3Iah1wtWGVdIhc.X3gnf5GwtdDigLfcAof/TYB7rIXW11S",
      name: "Platform Administrator",
      role: "admin",
      membershipType: "lifetime",
      hasUnlimitedAccess: true,
      isActive: true,
      emailVerified: true,
      lastLoginAt: new Date(),
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.users.set(adminUser.id, adminUser);

    // Create premium student user with real password
    const premiumUser: User = {
      id: this.currentUserId++,
      email: "student@howigrew.com",
      passwordHash: "$2b$10$8FsvJ1LSMC9nNZRP7TjcguTFi341QhjpK/98kR3XvkMMUVk9joqi6",
      name: "Premium Student",
      role: "student",
      membershipType: "lifetime",
      hasUnlimitedAccess: true,
      isActive: true,
      emailVerified: true,
      lastLoginAt: new Date(),
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.users.set(premiumUser.id, premiumUser);

    // Create sample course
    const krishaCourse: Course = {
      id: this.currentCourseId++,
      title: "How To Buy And Sell Real Estate On Krisha.kz With No Money Down",
      description: "Master the art of buying real estate properties on krisha.kz without using your own money. Learn proven strategies including wholesaling, subject-to deals, seller financing, and creative financing techniques specifically adapted for the Kazakhstani market.",
      shortDescription: "Buy properties on krisha.kz with zero money down using proven strategies",
      slug: "buy-property-no-money-krisha",
      categoryId: krishaWholesalingCategory.id,
      instructorId: instructor.id,
      level: "beginner",
      duration: 240,
      price: "97.00",
      currency: "USD",
      thumbnailUrl: "/attached_assets/Screenshot 2025-07-17 153502_1754349455010.png",
      trailerUrl: null,
      language: "en",
      subtitles: ["en", "ru"],
      tags: ["wholesaling", "real estate", "krisha.kz", "no money down", "kazakhstan"],
      requirements: ["Basic internet navigation skills", "Access to krisha.kz website"],
      learningOutcomes: [
        "How to navigate krisha.kz like a professional investor",
        "Identify motivated sellers and distressed properties",
        "Structure no-money-down deals using creative financing",
        "Build a network of cash buyers in Kazakhstan",
        "Negotiate win-win deals that benefit all parties",
        "Scale your wholesale business for consistent income"
      ],
      targetAudience: "Beginners to real estate wholesaling, entrepreneurs, investors looking for creative financing",
      status: "published",
      isPublic: true,
      isFeatured: true,
      rating: "0.0",
      ratingCount: 0,
      enrollmentCount: 0,
      completionRate: "0.0",
      createdAt: new Date(),
      updatedAt: new Date(),
      publishedAt: new Date(),
    };
    this.courses.set(krishaCourse.id, krishaCourse);

    // Create US Real Estate course
    const usRealEstateCourse: Course = {
      id: this.currentCourseId++,
      title: "How to Wholesale US Real Estate from Anywhere in the World Without American Citizenship",
      description: "Master the complete system for wholesaling US real estate remotely as a non-citizen. Learn to build teams, analyze deals, navigate legal requirements, and scale your business from anywhere in the world. This comprehensive course covers market research, contract strategies, financing options, technology tools, and proven systems used by successful international wholesalers.",
      shortDescription: "Learn to wholesale US real estate remotely as a non-citizen with proven strategies and systems",
      slug: "us-real-estate-wholesaling-international",
      categoryId: usRealEstateCategory.id,
      instructorId: instructor.id,
      level: "beginner",
      duration: 2100, // 35 hours
      price: "297.00",
      currency: "USD",
      thumbnailUrl: "/attached_assets/Screenshot 2025-08-01 121527_1754064998968.png",
      trailerUrl: null,
      language: "en",
      subtitles: ["en", "es", "ru"],
      tags: ["wholesaling", "real estate", "US market", "international", "non-citizen", "remote business"],
      requirements: ["Basic internet navigation skills", "Access to online banking", "Email account for communications", "Willingness to learn and take action"],
      learningOutcomes: [
        "Execute wholesale real estate deals in the US from any location worldwide",
        "Build and manage a remote US-based professional team",
        "Analyze markets and properties using online tools and technology",
        "Navigate legal and financial requirements as a non-US citizen",
        "Scale your wholesaling business systematically for consistent income",
        "Avoid common international investor mistakes and pitfalls",
        "Generate profitable deals through proven marketing strategies",
        "Master remote closing procedures and documentation"
      ],
      targetAudience: "International investors, entrepreneurs seeking US opportunities, non-US citizens interested in real estate, remote business builders",
      status: "published",
      isPublic: true,
      isFeatured: true,
      rating: "0.0",
      ratingCount: 0,
      enrollmentCount: 0,
      completionRate: "0.0",
      createdAt: new Date(),
      updatedAt: new Date(),
      publishedAt: new Date(),
    };
    this.courses.set(usRealEstateCourse.id, usRealEstateCourse);

    // Create course sections
    const section1: CourseSection = {
      id: this.currentCourseSectionId++,
      courseId: krishaCourse.id,
      title: "Introduction to Krisha.kz",
      description: "Learn the fundamentals of using krisha.kz for real estate investing",
      sortOrder: 1,
      isPublic: true,
      createdAt: new Date(),
    };
    this.courseSections.set(section1.id, section1);

    const section2: CourseSection = {
      id: this.currentCourseSectionId++,
      courseId: krishaCourse.id,
      title: "Finding Motivated Sellers",
      description: "Identify distressed properties and motivated sellers on krisha.kz",
      sortOrder: 2,
      isPublic: true,
      createdAt: new Date(),
    };
    this.courseSections.set(section2.id, section2);

    const section3: CourseSection = {
      id: this.currentCourseSectionId++,
      courseId: krishaCourse.id,
      title: "No-Money-Down Strategies",
      description: "Learn creative financing techniques for purchasing without cash",
      sortOrder: 3,
      isPublic: true,
      createdAt: new Date(),
    };
    this.courseSections.set(section3.id, section3);

    const section4: CourseSection = {
      id: this.currentCourseSectionId++,
      courseId: krishaCourse.id,
      title: "Building Your Buyer Network",
      description: "Create a network of investors ready to purchase your deals",
      sortOrder: 4,
      isPublic: true,
      createdAt: new Date(),
    };
    this.courseSections.set(section4.id, section4);

    // Create US Real Estate course sections
    const usSection1: CourseSection = {
      id: this.currentCourseSectionId++,
      courseId: usRealEstateCourse.id,
      title: "Foundations & Legal Framework",
      description: "Understand wholesaling fundamentals, navigate legal requirements for non-citizens, and set up remote business structure",
      sortOrder: 1,
      isPublic: true,
      createdAt: new Date(),
    };
    this.courseSections.set(usSection1.id, usSection1);

    const usSection2: CourseSection = {
      id: this.currentCourseSectionId++,
      courseId: usRealEstateCourse.id,
      title: "Market Research & Analysis",
      description: "Identify profitable US markets remotely, master online research tools, and analyze market indicators",
      sortOrder: 2,
      isPublic: true,
      createdAt: new Date(),
    };
    this.courseSections.set(usSection2.id, usSection2);

    const usSection3: CourseSection = {
      id: this.currentCourseSectionId++,
      courseId: usRealEstateCourse.id,
      title: "Building Your US Team",
      description: "Assemble local professionals remotely, establish communication systems, and build buyer networks",
      sortOrder: 3,
      isPublic: true,
      createdAt: new Date(),
    };
    this.courseSections.set(usSection3.id, usSection3);

    const usSection4: CourseSection = {
      id: this.currentCourseSectionId++,
      courseId: usRealEstateCourse.id,
      title: "Deal Analysis & Technology",
      description: "Analyze deals using online tools, calculate profits accurately, and leverage technology for efficiency",
      sortOrder: 4,
      isPublic: true,
      createdAt: new Date(),
    };
    this.courseSections.set(usSection4.id, usSection4);

    const usSection5: CourseSection = {
      id: this.currentCourseSectionId++,
      courseId: usRealEstateCourse.id,
      title: "Contracts & Documentation",
      description: "Master wholesale contracts, understand state-specific requirements, and manage legal compliance",
      sortOrder: 5,
      isPublic: true,
      createdAt: new Date(),
    };
    this.courseSections.set(usSection5.id, usSection5);

    const usSection6: CourseSection = {
      id: this.currentCourseSectionId++,
      courseId: usRealEstateCourse.id,
      title: "Banking, Finance & Operations",
      description: "Set up US banking remotely, understand financing options, and scale operations systematically",
      sortOrder: 6,
      isPublic: true,
      createdAt: new Date(),
    };
    this.courseSections.set(usSection6.id, usSection6);

    const usSection7: CourseSection = {
      id: this.currentCourseSectionId++,
      courseId: usRealEstateCourse.id,
      title: "Advanced Strategies",
      description: "Creative financing techniques, marketing strategies, common pitfalls, and success case studies",
      sortOrder: 7,
      isPublic: true,
      createdAt: new Date(),
    };
    this.courseSections.set(usSection7.id, usSection7);

    // Create comprehensive lessons for section 1 - Introduction to Krisha.kz
    const lesson1: CourseLesson = {
      id: this.currentCourseLessonId++,
      sectionId: section1.id,
      title: "Welcome & Course Overview",
      description: "Introduction to the course and what you'll achieve",
      content: `# Welcome to Real Estate Investing Mastery

Welcome to the complete guide for buying real estate with no money down on krisha.kz. This course will transform you from a complete beginner into a confident real estate investor.

## What You'll Learn
- How to find profitable properties online
- Advanced search techniques for krisha.kz
- No-money-down strategies that actually work
- Deal analysis and market research
- Negotiation tactics that close deals
- Building a network of investors and contractors

## Course Structure
This course is divided into 4 comprehensive modules with over 25 lessons. Each lesson builds upon the previous one, creating a complete learning journey.

## Your Success Path
By the end of this course, you'll have all the tools and knowledge needed to start your real estate investing journey, even if you don't have money to invest upfront.`,
      videoUrl: "https://www.youtube.com/watch?v=3JZ_D3ELwOQ",
      duration: 15,
      sortOrder: 1,
      isPublic: true,
      isFree: true,
      attachments: [
        {
          name: "Course Workbook",
          url: "/downloads/course-workbook.pdf",
          type: "pdf"
        }
      ],
      quiz: null,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.courseLessons.set(lesson1.id, lesson1);

    const lesson2: CourseLesson = {
      id: this.currentCourseLessonId++,
      sectionId: section1.id,
      title: "How to Search Krisha.kz Like a Pro",
      description: "Master the search filters and find the best deals quickly",
      content: `# Mastering Krisha.kz Search Techniques

## Platform Overview
Krisha.kz is Kazakhstan's largest real estate marketplace with over 100,000 active listings. Understanding this platform is crucial for finding profitable deals.

## Key Search Features
- Advanced filters for price, location, property type
- Map-based search functionality
- Saved searches with notifications
- Direct seller contact information
- Property comparison tools

## Essential Search Strategy
1. Start with broad location searches
2. Use price filters to identify undervalued properties
3. Sort by "Recently Added" to catch fresh listings
4. Save multiple search configurations
5. Check listings 3-5 times daily for hot deals

## Red Flags to Avoid
- Properties listed significantly below market value (possible scams)
- Listings without proper photos
- Sellers requesting upfront payments
- Properties in restricted zones

## Pro Tips
- Contact sellers within 1 hour of listing for best response rates
- Use Google Translate for Russian/Kazakh communications
- Keep a spreadsheet of contacted properties and responses`,
      videoUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
      duration: 25,
      sortOrder: 2,
      isPublic: true,
      isFree: false,
      attachments: [
        {
          name: "Krisha.kz Search Checklist",
          url: "/downloads/search-checklist.pdf",
          type: "pdf"
        }
      ],
      quiz: {
        questions: [
          {
            question: "How often should you check krisha.kz for new listings?",
            options: ["Once per day", "3-5 times per day", "Once per week", "Only when needed"],
            correct: 1
          },
          {
            question: "What's the recommended response time to contact sellers?",
            options: ["Within 24 hours", "Within 1 hour", "Within 1 week", "Anytime"],
            correct: 1
          }
        ]
      },
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.courseLessons.set(lesson2.id, lesson2);

    // Lesson for section 2 - Finding Motivated Sellers
    const lesson3: CourseLesson = {
      id: this.currentCourseLessonId++,
      sectionId: section2.id,
      title: "Identifying Distressed Properties",
      description: "Learn to spot motivated sellers and distressed properties that make ideal wholesale deals",
      content: `# Finding Motivated Sellers on Krisha.kz

## What Are Distressed Properties?
Distressed properties are real estate assets that owners need to sell quickly, often below market value. These create the best wholesale opportunities.

## Key Indicators of Motivated Sellers
1. **Urgent Language in Descriptions**
   - "Must sell quickly"
   - "Price negotiable" 
   - "Moving soon"
   - "Need immediate sale"

2. **Property Condition Issues**
   - Needs renovation
   - Outdated photos
   - Minimal property description
   - Below market pricing

3. **Financial Distress Signals**
   - Multiple price reductions
   - Long time on market (30+ days)
   - Inheritance sales
   - Divorce situations

## Search Keywords in Russian/Kazakh
- Срочно (Urgently)
- Торг (Negotiable)
- Обмен (Exchange/Trade)
- Переезд (Moving)
- Наследство (Inheritance)

## Qualification Questions
When contacting sellers, ask:
1. Why are you selling?
2. When do you need to close?
3. What's your bottom-line price?
4. Are you open to creative financing?
5. Would you consider a lease-option?`,
      videoUrl: "https://www.youtube.com/watch?v=ScMzIvxBSi4",
      duration: 30,
      sortOrder: 1,
      isPublic: true,
      isFree: false,
      attachments: [
        {
          name: "Motivated Seller Checklist",
          url: "/downloads/motivated-seller-checklist.pdf",
          type: "pdf"
        }
      ],
      quiz: {
        questions: [
          {
            question: "What does 'Срочно' mean in Russian property listings?",
            options: ["Expensive", "Urgently", "Beautiful", "Large"],
            correct: 1
          }
        ]
      },
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.courseLessons.set(lesson3.id, lesson3);

    // Lesson for section 3 - No-Money-Down Strategies
    const lesson4: CourseLesson = {
      id: this.currentCourseLessonId++,
      sectionId: section3.id,
      title: "Wholesale Assignment Contracts",
      description: "Master the art of contract assignment - the foundation of no-money-down deals",
      content: `# Understanding Wholesale Assignment Contracts

## What is a Wholesale Assignment?
A wholesale assignment involves getting a property under contract and then assigning (selling) that contract to an investor before closing. You profit from the assignment fee without using your own money.

## Key Contract Elements
1. **Purchase Price** - Always include assignment rights
2. **Assignment Clause** - "This contract may be assigned"
3. **Inspection Period** - 7-14 days for due diligence
4. **Closing Date** - Allow 30-45 days minimum
5. **Earnest Money** - Keep low ($500-1000)

## Kazakhstan Legal Considerations
- Ensure contracts comply with Kazakhstan property law
- Use qualified local attorney for contract review
- Understand stamp duty and transfer requirements
- Be aware of foreign ownership restrictions

## Assignment Process
1. Get property under contract
2. Market to your buyer list
3. Collect assignment fee (typically $3,000-15,000)
4. Assign contract to end buyer
5. Close at title company/notary

## Sample Assignment Clause
"Buyer may assign this contract to any person or entity. Upon assignment, assignee assumes all rights and obligations of Buyer."

## Red Flags to Avoid
- Sellers who refuse assignment rights
- Properties requiring immediate cash
- Sellers demanding large earnest money
- Properties with title issues`,
      videoUrl: "https://www.youtube.com/watch?v=aqz-KE-bpKQ",
      duration: 35,
      sortOrder: 1,
      isPublic: true,
      isFree: false,
      attachments: [
        {
          name: "Sample Assignment Contract",
          url: "/downloads/assignment-contract-template.pdf",
          type: "pdf"
        },
        {
          name: "Kazakhstan Property Law Guide",
          url: "/downloads/kz-property-law.pdf", 
          type: "pdf"
        }
      ],
      quiz: {
        questions: [
          {
            question: "What is the typical assignment fee range?",
            options: ["$500-1,000", "$1,000-3,000", "$3,000-15,000", "$15,000+"],
            correct: 2
          },
          {
            question: "How much earnest money should you put down?",
            options: ["As much as possible", "$500-1,000", "10% of purchase price", "50% of purchase price"],
            correct: 1
          }
        ]
      },
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.courseLessons.set(lesson4.id, lesson4);

    // Lesson for section 4 - Building Your Buyer Network
    const lesson5: CourseLesson = {
      id: this.currentCourseLessonId++,
      sectionId: section4.id,
      title: "Building Your Buyer Network",
      description: "Create a powerful network of cash investors ready to purchase your deals",
      content: `# Building Your Cash Buyer Network

## Why You Need Cash Buyers
Cash buyers are investors who can close quickly without financing. They're essential for wholesale success because they:
- Close in 7-14 days
- Don't require inspections
- Pay cash for good deals
- Provide repeat business

## Finding Cash Buyers in Kazakhstan

### Online Sources
1. **Real Estate Facebook Groups**
   - Kazakhstan Real Estate Investors
   - Almaty Property Investors
   - Nur-Sultan Real Estate Network

2. **Professional Networks**
   - Local real estate meetups
   - Chamber of Commerce events
   - Business networking groups

3. **Direct Marketing**
   - "We Buy Houses" signs
   - Craigslist/OLX.kz ads
   - Google Ads targeting investors

### Offline Sources
1. **Property Auctions** - Network with bidders
2. **Real Estate Attorneys** - Ask for referrals
3. **Property Management Companies** - They know investors
4. **Construction Companies** - Often need properties to flip

## Qualifying Cash Buyers
Ask these essential questions:
1. Do you currently buy investment properties?
2. What's your typical purchase timeline?
3. What areas are you buying in?
4. What's your typical price range?
5. Can you provide proof of funds?
6. How do you prefer to be contacted about deals?

## Building Relationships
- Send regular market updates
- Provide quality deals only
- Be transparent about property conditions
- Follow up consistently
- Offer value beyond just properties

## Creating Buyer Profiles
Track for each buyer:
- Name and contact info
- Preferred areas
- Price ranges
- Property types
- Timeline requirements
- Proof of funds status`,
      videoUrl: null,
      duration: 40,
      sortOrder: 1,
      isPublic: true,
      isFree: false,
      attachments: [
        {
          name: "Buyer Network Template",
          url: "/downloads/buyer-network-template.xlsx",
          type: "xlsx"
        },
        {
          name: "Buyer Qualification Script",
          url: "/downloads/buyer-qualification-script.pdf",
          type: "pdf"
        }
      ],
      quiz: {
        questions: [
          {
            question: "What's the most important qualification for a cash buyer?",
            options: ["Good credit", "Proof of funds", "Local residence", "Real estate license"],
            correct: 1
          },
          {
            question: "How quickly should cash buyers be able to close?",
            options: ["30-45 days", "7-14 days", "60 days", "90 days"],
            correct: 1
          }
        ]
      },
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.courseLessons.set(lesson5.id, lesson5);

    // Add more comprehensive lessons to improve content quality
    this.createAdditionalLessons(section1, section2, section3, section4);

    // Create essential US Real Estate course lessons
    this.createUSRealEstateLessons(usSection1, usSection2, usSection3, usSection4, usSection5, usSection6, usSection7);

    // Set up production user memberships and enrollments
    this.initializeProductionMemberships(adminUser, premiumUser, instructor, lifetimePlan, krishaCourse);
    
    // Create enrollment for Lewis Mclean (user ID 11) - the test user
    this.createTestEnrollment(krishaCourse, usRealEstateCourse);
  }

  private createAdditionalLessons(section1: CourseSection, section2: CourseSection, section3: CourseSection, section4: CourseSection) {
    // Additional lessons for Section 1 - Introduction to Krisha.kz
    const lesson1_3: CourseLesson = {
      id: this.currentCourseLessonId++,
      sectionId: section1.id,
      title: "Market Analysis and Property Valuation",
      description: "Learn to analyze the Kazakhstan real estate market and determine property values",
      content: `# Kazakhstan Real Estate Market Analysis

## Understanding Market Dynamics
The Kazakhstan real estate market has unique characteristics that create opportunities for savvy investors:

### Key Market Indicators
1. **Average Price per Square Meter**
   - Almaty: $1,200-2,500 USD/m²
   - Nur-Sultan: $800-1,800 USD/m²
   - Shymkent: $400-900 USD/m²

2. **Market Trends to Watch**
   - Population growth in major cities
   - Government infrastructure investments
   - Oil price impacts on economy
   - Foreign investment regulations

## Property Valuation Methods
### Comparative Market Analysis (CMA)
1. Find 3-5 similar properties sold in last 6 months
2. Adjust for differences in:
   - Square footage
   - Location/neighborhood
   - Property condition
   - Amenities and features

### Income Approach
- Research rental rates in the area
- Calculate gross rental yield: (Annual Rent / Purchase Price) × 100
- Target yields: 8-12% for Kazakhstan properties

### Cost Approach
- Estimate replacement cost of building
- Add land value
- Subtract depreciation

## Using Krisha.kz Data
- Sort by price per square meter
- Filter by sale date (recent transactions)
- Check property history and price changes
- Analyze listing descriptions for motivation indicators

## Red Flags in Property Valuation
- Properties priced 30%+ below comparable sales
- No recent sales data in the area
- Properties in declining neighborhoods
- Legal/title issues in property history`,
      videoUrl: "https://www.youtube.com/watch?v=2g811Eo7K8U",
      duration: 35,
      sortOrder: 3,
      isPublic: true,
      isFree: false,
      attachments: [
        {
          name: "Kazakhstan Market Analysis Template",
          url: "/downloads/market-analysis-template.xlsx",
          type: "xlsx"
        },
        {
          name: "Property Valuation Calculator",
          url: "/downloads/valuation-calculator.xlsx",
          type: "xlsx"
        }
      ],
      quiz: {
        questions: [
          {
            question: "What's a good rental yield target for Kazakhstan properties?",
            options: ["5-7%", "8-12%", "15-20%", "3-5%"],
            correct: 1
          },
          {
            question: "How many comparable properties should you analyze for CMA?",
            options: ["1-2", "3-5", "10+", "None needed"],
            correct: 1
          },
          {
            question: "What's the average price per m² in Almaty?",
            options: ["$500-800", "$800-1200", "$1200-2500", "$3000+"],
            correct: 2
          }
        ]
      },
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.courseLessons.set(lesson1_3.id, lesson1_3);

    // Additional lessons for Section 2 - Finding Motivated Sellers
    const lesson2_2: CourseLesson = {
      id: this.currentCourseLessonId++,
      sectionId: section2.id,
      title: "Advanced Lead Generation Strategies",
      description: "Multiple channels for finding motivated sellers beyond basic searches",
      content: `# Advanced Lead Generation for Motivated Sellers

## Multi-Channel Approach
Don't rely solely on krisha.kz. Successful wholesalers use multiple lead sources:

### 1. Direct Mail Campaigns
**Target Lists:**
- Absentee owners (properties owned but not occupied)
- High-equity homeowners
- Properties with code violations
- Inherited properties

**Effective Mail Pieces:**
- Yellow handwritten letters (highest response rate)
- Postcards with clear call-to-action
- Professional letters on company letterhead

### 2. Digital Marketing
**Social Media Strategies:**
- Facebook marketplace ads
- Instagram targeted ads to homeowners 35+
- YouTube videos about selling property fast
- LinkedIn outreach to business owners

**Google Ads:**
- "Sell house fast Kazakhstan"
- "We buy houses Almaty"
- "Cash for property Nur-Sultan"

### 3. Networking and Referrals
**Professional Networks:**
- Real estate agents (off-market deals)
- Property managers (problem properties)
- Contractors (distressed property owners)
- Attorneys (probate, divorce cases)

**Referral Systems:**
- $500-1000 referral fees
- Thank you gifts for referrers
- Regular communication with network

### 4. Driving for Dollars
**What to Look For:**
- Overgrown yards
- Boarded windows
- For rent signs
- Code violation notices
- Multiple newspapers/mail

**Documentation System:**
- Mobile apps for property tracking
- Photo documentation
- Owner contact research
- Follow-up scheduling

## Lead Qualification Process
### Initial Contact Script
"Hi, I noticed your property at [address]. I buy houses in that area and was wondering if you'd be interested in selling? I can close quickly with cash and handle all the paperwork."

### Qualification Questions
1. Why are you considering selling?
2. What's your ideal timeline?
3. What condition is the property in?
4. Do you owe anything on the property?
5. What's the lowest price you'd accept?
6. Are you open to creative financing options?

## Lead Management System
- CRM software for tracking leads
- Automated follow-up sequences
- Lead scoring based on motivation
- Regular pipeline reviews`,
      videoUrl: "https://www.youtube.com/watch?v=jfKfPfyJRdk",
      duration: 40,
      sortOrder: 2,
      isPublic: true,
      isFree: false,
      attachments: [
        {
          name: "Direct Mail Templates",
          url: "/downloads/direct-mail-templates.zip",
          type: "zip"
        },
        {
          name: "Lead Tracking Spreadsheet",
          url: "/downloads/lead-tracking.xlsx",
          type: "xlsx"
        },
        {
          name: "Qualification Scripts",
          url: "/downloads/qualification-scripts.pdf",
          type: "pdf"
        }
      ],
      quiz: {
        questions: [
          {
            question: "What type of direct mail has the highest response rate?",
            options: ["Postcards", "Yellow handwritten letters", "Professional letters", "Flyers"],
            correct: 1
          },
          {
            question: "What's a typical referral fee for a good deal?",
            options: ["$100-200", "$200-300", "$500-1000", "$2000+"],
            correct: 2
          }
        ]
      },
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.courseLessons.set(lesson2_2.id, lesson2_2);

    // Additional lessons for Section 3 - No-Money-Down Strategies
    const lesson3_2: CourseLesson = {
      id: this.currentCourseLessonId++,
      sectionId: section3.id,
      title: "Subject-To and Owner Financing Deals",
      description: "Advanced creative financing techniques for acquiring properties with no money down",
      content: `# Creative Financing: Subject-To and Owner Financing

## Subject-To Deals Explained
"Subject-To" means buying a property subject to the existing mortgage. The deed transfers to you, but the loan remains in the seller's name.

### When Subject-To Works Best
- Sellers facing foreclosure
- Owners who need to move quickly
- Properties with little equity
- Sellers with good payment history

### Subject-To Process
1. **Due Diligence**
   - Verify mortgage balance and payments
   - Check payment history
   - Confirm no acceleration clauses
   - Research property condition

2. **Legal Considerations in Kazakhstan**
   - Consult local real estate attorney
   - Understand mortgage transfer laws
   - Check lender policies on transfers
   - Ensure proper documentation

3. **Protecting All Parties**
   - Escrow accounts for mortgage payments
   - Title insurance
   - Clear exit strategies
   - Regular communication with sellers

## Owner Financing Strategies

### Seller Carryback Financing
Seller acts as the bank, providing financing for the purchase:

**Structure Options:**
- Full financing (seller owns 100%)
- Partial financing (seller + traditional loan)
- Wrap-around mortgages
- Lease-option agreements

### Negotiating Owner Financing
**Seller Benefits:**
- Monthly income stream
- Higher sale price
- Faster sale
- Tax advantages

**Key Terms to Negotiate:**
- Interest rate (market rate or below)
- Down payment (minimize or eliminate)
- Payment schedule
- Balloon payment terms
- Default remedies

## Lease-Option Strategies
Combination of lease agreement with option to purchase:

### Structure Components
1. **Lease Agreement**
   - Monthly rent amount
   - Lease term (1-3 years typically)
   - Maintenance responsibilities
   - Option fee (1-5% of purchase price)

2. **Option Agreement**
   - Purchase price (fixed or formula-based)
   - Option period duration
   - Rent credits toward purchase
   - Exercise conditions

### Benefits for All Parties
**For Sellers:**
- Immediate rental income
- Potential future sale
- Property maintenance by tenant
- Higher rent than market rate

**For Buyers:**
- Control property without full purchase
- Time to improve credit/finances
- Potential appreciation participation
- Lower upfront costs

## Risk Management
### Legal Protections
- Proper contracts and documentation
- Title insurance
- Regular legal reviews
- Clear dispute resolution processes

### Financial Safeguards
- Adequate reserves for payments
- Multiple exit strategies
- Regular property inspections
- Insurance coverage

### Ethical Considerations
- Full disclosure to all parties
- Fair dealing principles
- Transparent communication
- Win-win deal structuring`,
      videoUrl: "https://www.youtube.com/watch?v=DyQfqGMM-uI",
      duration: 45,
      sortOrder: 2,
      isPublic: true,
      isFree: false,
      attachments: [
        {
          name: "Subject-To Contract Template",
          url: "/downloads/subject-to-contract.pdf",
          type: "pdf"
        },
        {
          name: "Owner Financing Agreement",
          url: "/downloads/owner-financing-agreement.pdf",
          type: "pdf"
        },
        {
          name: "Lease-Option Template",
          url: "/downloads/lease-option-template.pdf",
          type: "pdf"
        },
        {
          name: "Creative Financing Calculator",
          url: "/downloads/creative-financing-calculator.xlsx",
          type: "xlsx"
        }
      ],
      quiz: {
        questions: [
          {
            question: "In a Subject-To deal, who remains on the original mortgage?",
            options: ["The buyer", "The seller", "Both parties", "The lender"],
            correct: 1
          },
          {
            question: "What's a typical option fee for a lease-option deal?",
            options: ["0.5-1%", "1-5%", "10-15%", "20%+"],
            correct: 1
          },
          {
            question: "What's the main benefit of owner financing for sellers?",
            options: ["Faster closing", "Higher sale price", "Monthly income", "All of the above"],
            correct: 3
          }
        ]
      },
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.courseLessons.set(lesson3_2.id, lesson3_2);

    // Additional lessons for Section 4 - Building Your Buyer Network
    const lesson4_2: CourseLesson = {
      id: this.currentCourseLessonId++,
      sectionId: section4.id,
      title: "Scaling Your Wholesale Business",
      description: "Systems and strategies for growing from single deals to consistent monthly income",
      content: `# Scaling Your Wholesale Business to 6-Figure Income

## Building Systems for Scale
Moving from occasional deals to consistent monthly income requires systematization:

### 1. Lead Generation Systems
**Automated Marketing:**
- Social media content calendar
- Email marketing sequences
- Direct mail campaigns
- Pay-per-click advertising
- SEO-optimized website

**Lead Flow Targets:**
- Month 1-3: 10-20 leads/month
- Month 4-6: 30-50 leads/month
- Month 7-12: 75-100+ leads/month

### 2. Deal Analysis Automation
**Standardized Evaluation Process:**
- Property analysis checklist
- Automated repair estimates
- ARV (After Repair Value) calculations
- Profit margin requirements
- Deal scoring system

**Technology Tools:**
- CRM for lead management
- Deal analysis software
- Automated comps pulling
- Electronic signature platforms
- Project management systems

### 3. Team Building Strategy
**Essential Team Members:**
- Acquisitions manager (month 6)
- Marketing assistant (month 8)
- Transaction coordinator (month 10)
- Dispositions specialist (month 12)

**Compensation Structures:**
- Base salary + performance bonuses
- Deal-based commissions
- Profit sharing agreements
- Performance incentives

## Advanced Buyer Network Development

### Institutional Buyers
**Target Investor Types:**
- Fix-and-flip companies
- Rental property investors  
- Real estate funds
- Property management companies
- Construction companies

### Buyer Relationship Management
**VIP Buyer Program:**
- Priority deal notifications
- Exclusive access to best properties
- Market insights and reports
- Networking events and meetups
- Educational workshops

**Communication Systems:**
- Weekly market updates
- Monthly buyer newsletters
- Quarterly networking events
- Annual appreciation dinners
- Regular one-on-one meetings

### Geographic Expansion
**Market Selection Criteria:**
- Population growth trends
- Job market strength
- Real estate price trends
- Competition analysis
- Local regulations

**Expansion Strategy:**
1. Research new markets thoroughly
2. Build local buyer network first
3. Establish lead generation systems
4. Partner with local professionals
5. Test with small deal volume

## Financial Management for Scale

### Cash Flow Management
**Revenue Streams:**
- Assignment fees ($3,000-15,000)
- Double closings ($5,000-25,000)
- Consulting fees ($1,000-5,000)
- Educational products/courses
- Joint venture profits

**Expense Categories:**
- Marketing (20-30% of revenue)
- Team salaries (25-35% of revenue)
- Office/technology (5-10% of revenue)
- Legal/professional (3-5% of revenue)
- Reserves (10-15% of revenue)

### Key Performance Indicators (KPIs)
**Monthly Tracking:**
- Number of leads generated
- Lead-to-contract conversion rate
- Average assignment fee
- Cost per lead
- Monthly gross/net profit
- Cash flow projections

### Business Entity Structure
**Legal Considerations:**
- LLC for asset protection
- Separate operating entities
- Tax optimization strategies
- Insurance requirements
- Banking relationships

## Creating Passive Income Streams

### Educational Products
- Online course creation
- Coaching programs
- Mastermind groups
- Speaking engagements
- Book/eBook publishing

### Investment Strategies
- Buy-and-hold properties
- Private lending opportunities
- Real estate syndications
- Business investments
- Retirement planning

## Exit Strategy Planning
**Long-term Vision Options:**
- Sell wholesale business
- Transition to fix-and-flip
- Build rental portfolio
- Develop real estate fund
- Create passive income focus`,
      videoUrl: "https://www.youtube.com/watch?v=kffacxfA7G4",
      duration: 50,
      sortOrder: 2,
      isPublic: true,
      isFree: false,
      attachments: [
        {
          name: "Business Scaling Checklist",
          url: "/downloads/scaling-checklist.pdf",
          type: "pdf"
        },
        {
          name: "KPI Tracking Dashboard",
          url: "/downloads/kpi-dashboard.xlsx",
          type: "xlsx"
        },
        {
          name: "Team Building Guide",
          url: "/downloads/team-building-guide.pdf",
          type: "pdf"
        },
        {
          name: "Financial Planning Template",
          url: "/downloads/financial-planning.xlsx",
          type: "xlsx"
        }
      ],
      quiz: {
        questions: [
          {
            question: "What percentage of revenue should be allocated to marketing?",
            options: ["5-10%", "10-15%", "20-30%", "40-50%"],
            correct: 2
          },
          {
            question: "When should you hire your first team member?",
            options: ["Immediately", "After first deal", "Month 6", "When you can't handle the workload"],
            correct: 3
          },
          {
            question: "What's a realistic lead generation target for months 4-6?",
            options: ["10-20 leads", "30-50 leads", "75-100 leads", "200+ leads"],
            correct: 1
          }
        ]
      },
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.courseLessons.set(lesson4_2.id, lesson4_2);
  }

  private createUSRealEstateLessons(usSection1: CourseSection, usSection2: CourseSection, usSection3: CourseSection, usSection4: CourseSection, usSection5: CourseSection, usSection6: CourseSection, usSection7: CourseSection) {
    // Sample lessons for US Real Estate course
    const usLesson1_1: CourseLesson = {
      id: this.currentCourseLessonId++,
      sectionId: usSection1.id,
      title: "Real Estate Wholesaling Basics",
      description: "Complete introduction to wholesaling fundamentals and how it works in the US market",
      content: `# Real Estate Wholesaling Fundamentals

## What is Wholesaling?
Real estate wholesaling is a business strategy where you get a property under contract and then assign that contract to an end buyer for a fee. You never actually purchase the property yourself.

## The Process
1. Find distressed/motivated sellers
2. Get property under contract at below-market price
3. Find cash buyers willing to pay more
4. Assign contract to buyer for assignment fee
5. Collect fee at closing

## Why It Works for Non-Citizens
- No credit requirements
- Minimal capital needed
- Can operate remotely
- Legal in most US states
- No citizenship requirements`,
      videoUrl: null,
      duration: 2400, // 40 minutes
      sortOrder: 1,
      isPublic: true,
      isFree: true,
      attachments: [],
      quiz: null,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.courseLessons.set(usLesson1_1.id, usLesson1_1);

    const usLesson2_1: CourseLesson = {
      id: this.currentCourseLessonId++,
      sectionId: usSection2.id,
      title: "Top Wholesaling Markets",
      description: "Identify the most profitable US markets for wholesaling opportunities",
      content: `# Best US Markets for Wholesaling

## Primary Markets to Target
### Atlanta, Georgia
- High investor activity
- Good price-to-rent ratios
- Strong job growth

### Cleveland, Ohio
- Low property prices
- High cash flow potential
- Active investor community

### Phoenix, Arizona
- Growing population
- Good appreciation potential
- Investor-friendly laws

## Market Indicators to Watch
- Days on market
- Price trends
- Rental yields
- Population growth
- Job market strength`,
      videoUrl: null,
      duration: 2700, // 45 minutes
      sortOrder: 1,
      isPublic: true,
      isFree: false,
      attachments: [],
      quiz: null,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.courseLessons.set(usLesson2_1.id, usLesson2_1);

    const usLesson3_1: CourseLesson = {
      id: this.currentCourseLessonId++,
      sectionId: usSection3.id,
      title: "Finding Real Estate Agents",
      description: "Build relationships with agents who understand wholesaling and work with investors",
      content: `# Working with Real Estate Agents

## Finding Investor-Friendly Agents
- Search BiggerPockets directory
- Look for agents with investor experience
- Ask about wholesale deals
- Check their portfolio

## Building Relationships
- Be professional and clear about your goals
- Offer value and referrals
- Communicate regularly
- Follow through on commitments

## What to Look For
- Understanding of wholesaling
- Active in investment community
- Quick response times
- Local market knowledge`,
      videoUrl: null,
      duration: 2100, // 35 minutes
      sortOrder: 1,
      isPublic: true,
      isFree: false,
      attachments: [],
      quiz: null,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.courseLessons.set(usLesson3_1.id, usLesson3_1);

    const usLesson5_1: CourseLesson = {
      id: this.currentCourseLessonId++,
      sectionId: usSection5.id,
      title: "Purchase & Assignment Contracts",
      description: "Master the essential contracts used in wholesaling transactions",
      content: `# Wholesale Contracts Masterclass

## Purchase Agreement Essentials
- Include assignment clause
- Keep earnest money low ($500-1000)
- Add inspection contingencies
- Set reasonable closing timeline

## Assignment Contract Elements
- Clear assignment fee
- Buyer qualification requirements
- Property details and condition
- Closing responsibilities

## Key Legal Considerations
- State-specific requirements
- Disclosure obligations
- Contract compliance
- Professional legal review`,
      videoUrl: null,
      duration: 3000, // 50 minutes
      sortOrder: 1,
      isPublic: true,
      isFree: false,
      attachments: [],
      quiz: null,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.courseLessons.set(usLesson5_1.id, usLesson5_1);

    // Add lessons for empty sections
    const usLesson4_1: CourseLesson = {
      id: this.currentCourseLessonId++,
      sectionId: usSection4.id,
      title: "Deal Analysis Framework",
      description: "Master the essential tools and techniques for analyzing wholesale deals remotely",
      content: `# Remote Deal Analysis System

## Key Analysis Tools
- BiggerPockets Calculator
- Rentometer for rent estimates
- Zillow Zestimate analysis
- County assessor websites
- MLS data interpretation

## The 70% Rule
Never pay more than 70% of ARV minus repair costs:
- After Repair Value (ARV) x 70% - Repairs = Maximum Offer

## Market Research Checklist
✓ Recent comparable sales
✓ Average days on market
✓ Neighborhood trends
✓ Rental rates and demand
✓ Local economic indicators`,
      videoUrl: null,
      duration: 2400,
      sortOrder: 1,
      isPublic: true,
      isFree: false,
      attachments: [],
      quiz: null,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.courseLessons.set(usLesson4_1.id, usLesson4_1);

    const usLesson6_1: CourseLesson = {
      id: this.currentCourseLessonId++,
      sectionId: usSection6.id,
      title: "Setting Up US Banking Remotely",
      description: "Step-by-step guide to establishing US banking for international wholesalers",
      content: `# US Banking for Non-Citizens

## Required Documents
- Passport with US visa/entry stamp
- Individual Taxpayer Identification Number (ITIN)
- Proof of US address (mail forwarding service)
- Initial deposit ($25-100 minimum)

## Recommended Banks
### Chase Bank
- Business checking accounts
- Online banking features
- Multiple branch locations

### Bank of America
- International wire transfers
- Mobile deposit capabilities
- Business credit cards

## ITIN Application Process
File Form W-7 with IRS including:
- Completed application
- Proof of identity documents
- Reason for needing ITIN
- Processing time: 6-10 weeks`,
      videoUrl: null,
      duration: 3000,
      sortOrder: 1,
      isPublic: true,
      isFree: false,
      attachments: [],
      quiz: null,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.courseLessons.set(usLesson6_1.id, usLesson6_1);

    const usLesson7_1: CourseLesson = {
      id: this.currentCourseLessonId++,
      sectionId: usSection7.id,
      title: "Advanced Marketing Strategies",
      description: "Creative marketing techniques to find motivated sellers and build your buyer network",
      content: `# Advanced Wholesaling Marketing

## Digital Marketing Channels
### Facebook Marketplace
- Post "We Buy Houses" ads
- Join local real estate groups
- Target motivated seller audiences
- Use compelling property photos

### Craigslist Strategies
- Create eye-catching headlines
- Post in multiple cities
- Refresh ads regularly
- Include contact information

### Google Ads
- Target distressed property keywords
- Use location-based targeting
- Create compelling ad copy
- Track conversion rates

## Direct Mail Campaigns
- Absentee owner lists
- High equity properties
- Divorce records
- Probate leads
- Tax delinquent properties

## Building Buyer Networks
- Real estate investment clubs
- BiggerPockets connections
- LinkedIn outreach
- Contractor relationships
- Property management companies`,
      videoUrl: null,
      duration: 2700,
      sortOrder: 1,
      isPublic: true,
      isFree: false,
      attachments: [],
      quiz: null,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.courseLessons.set(usLesson7_1.id, usLesson7_1);
  }

  private initializeProductionMemberships(adminUser: User, premiumUser: User, instructor: User, lifetimePlan: MembershipPlan, mainCourse: Course) {
    // Assign lifetime membership to admin user
    const adminMembership: UserMembership = {
      id: this.currentUserMembershipId++,
      userId: adminUser.id,
      planId: lifetimePlan.id,
      status: "active",
      startDate: new Date(),
      endDate: null,
      autoRenew: false,
      stripeCustomerId: null,
      stripeSubscriptionId: null,
      paymentMethod: "admin_grant",
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.userMemberships.set(adminMembership.id, adminMembership);

    // Assign lifetime membership to premium user
    const premiumMembership: UserMembership = {
      id: this.currentUserMembershipId++,
      userId: premiumUser.id,
      planId: lifetimePlan.id,
      status: "active",
      startDate: new Date(),
      endDate: null,
      autoRenew: false,
      stripeCustomerId: null,
      stripeSubscriptionId: null,
      paymentMethod: "lifetime_purchase",
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.userMemberships.set(premiumMembership.id, premiumMembership);

    // Assign instructor membership
    const instructorMembership: UserMembership = {
      id: this.currentUserMembershipId++,
      userId: instructor.id,
      planId: lifetimePlan.id,
      status: "active",
      startDate: new Date(),
      endDate: null,
      autoRenew: false,
      stripeCustomerId: null,
      stripeSubscriptionId: null,
      paymentMethod: "instructor_access",
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.userMemberships.set(instructorMembership.id, instructorMembership);

    // Enroll all privileged users in the main course
    const adminEnrollment: Enrollment = {
      id: this.currentEnrollmentId++,
      userId: adminUser.id,
      courseId: mainCourse.id,
      status: "active",
      progress: "100",
      lastAccessedAt: new Date(),
      completedAt: new Date(),
      certificateIssued: true,
      paymentStatus: "free",
      enrolledAt: new Date(),
    };
    this.enrollments.set(adminEnrollment.id, adminEnrollment);

    const premiumEnrollment: Enrollment = {
      id: this.currentEnrollmentId++,
      userId: premiumUser.id,
      courseId: mainCourse.id,
      status: "active",
      progress: "75",
      lastAccessedAt: new Date(),
      completedAt: null,
      certificateIssued: false,
      paymentStatus: "paid",
      enrolledAt: new Date(),
    };
    this.enrollments.set(premiumEnrollment.id, premiumEnrollment);

    const instructorEnrollment: Enrollment = {
      id: this.currentEnrollmentId++,
      userId: instructor.id,
      courseId: mainCourse.id,
      status: "active",
      progress: "100",
      lastAccessedAt: new Date(),
      completedAt: new Date(),
      certificateIssued: true,
      paymentStatus: "instructor",
      enrolledAt: new Date(),
    };
    this.enrollments.set(instructorEnrollment.id, instructorEnrollment);
  }

  private createTestEnrollment(krishaCourse: Course, usRealEstateCourse: Course) {
    // Create enrollment for Lewis Mclean (test user with ID 11) for both main courses
    const testEnrollment1: Enrollment = {
      id: this.currentEnrollmentId++,
      userId: 11, // Lewis Mclean's user ID
      courseId: krishaCourse.id, // Course 1 (Krisha.kz course)
      status: "active",
      progress: "15.5", // Some progress made
      lastAccessedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
      completedAt: null,
      certificateIssued: false,
      paymentStatus: "paid",
      enrolledAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000), // 5 days ago
    };
    this.enrollments.set(testEnrollment1.id, testEnrollment1);
    
    // Also enroll in US Real Estate course
    const testEnrollment2: Enrollment = {
      id: this.currentEnrollmentId++,
      userId: 11, // Lewis Mclean's user ID
      courseId: usRealEstateCourse.id, // Use actual course ID (should be 2)
      status: "active",
      progress: "8.2", // Some progress made
      lastAccessedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), // 1 day ago
      completedAt: null,
      certificateIssued: false,
      paymentStatus: "paid",
      enrolledAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), // 3 days ago
    };
    this.enrollments.set(testEnrollment2.id, testEnrollment2);
  }

  private initializeTranslations() {
    // Course translations for different languages
    const courseId = 1; // Our main course ID

    // Russian translations
    this.courseTranslations.set(`${courseId}-ru`, {
      id: 1,
      courseId: courseId,
      language: 'ru',
      title: 'Как купить недвижимость на Krisha.kz без первоначального взноса',
      description: 'Полный курс по покупке недвижимости в Казахстане без использования собственных денег. Изучите проверенные стратегии инвестирования в недвижимость.',
      shortDescription: 'Изучите, как покупать недвижимость онлайн без первоначального взноса в любой точке мира без опыта',
      learningOutcomes: [
        'Освоите платформу krisha.kz для поиска выгодных сделок',
        'Научитесь определять мотивированных продавцов',
        'Изучите стратегии покупки без первоначального взноса',
        'Построите сеть инвесторов для быстрой перепродажи',
        'Освоите анализ сделок и переговоры'
      ],
      requirements: [
        'Компьютер или мобильное устройство с доступом в интернет',
        'Базовые навыки работы с интернетом',
        'Готовность изучать и применять новые стратегии',
        'Не требуется опыт в недвижимости'
      ],
      targetAudience: 'Начинающие инвесторы в недвижимость, предприниматели, люди, желающие создать пассивный доход',
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    // Spanish translations
    this.courseTranslations.set(`${courseId}-es`, {
      id: 2,
      courseId: courseId,
      language: 'es',
      title: 'Cómo comprar bienes raíces en Krisha.kz sin pago inicial',
      description: 'Curso completo sobre cómo comprar propiedades en Kazajistán sin usar tu propio dinero. Aprende estrategias probadas de inversión inmobiliaria.',
      shortDescription: 'Aprende a comprar bienes raíces en línea sin pago inicial en cualquier parte del mundo sin experiencia',
      learningOutcomes: [
        'Domina la plataforma krisha.kz para encontrar ofertas rentables',
        'Aprende a identificar vendedores motivados',
        'Estudia estrategias de compra sin pago inicial',
        'Construye una red de inversores para reventa rápida',
        'Domina el análisis de ofertas y negociación'
      ],
      requirements: [
        'Computadora o dispositivo móvil con acceso a internet',
        'Habilidades básicas de internet',
        'Disposición para aprender y aplicar nuevas estrategias',
        'No se requiere experiencia en bienes raíces'
      ],
      targetAudience: 'Inversores inmobiliarios principiantes, emprendedores, personas que buscan crear ingresos pasivos',
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    // French translations
    this.courseTranslations.set(`${courseId}-fr`, {
      id: 3,
      courseId: courseId,
      language: 'fr',
      title: 'Comment acheter de l\'immobilier sur Krisha.kz sans apport initial',
      description: 'Cours complet sur l\'achat de propriétés au Kazakhstan sans utiliser votre propre argent. Apprenez des stratégies éprouvées d\'investissement immobilier.',
      shortDescription: 'Apprenez à acheter de l\'immobilier en ligne sans apport initial partout dans le monde sans expérience',
      learningOutcomes: [
        'Maîtrisez la plateforme krisha.kz pour trouver des offres rentables',
        'Apprenez à identifier les vendeurs motivés',
        'Étudiez les stratégies d\'achat sans apport initial',
        'Construisez un réseau d\'investisseurs pour la revente rapide',
        'Maîtrisez l\'analyse d\'offres et la négociation'
      ],
      requirements: [
        'Ordinateur ou appareil mobile avec accès internet',
        'Compétences internet de base',
        'Volonté d\'apprendre et d\'appliquer de nouvelles stratégies',
        'Aucune expérience immobilière requise'
      ],
      targetAudience: 'Investisseurs immobiliers débutants, entrepreneurs, personnes cherchant à créer un revenu passif',
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    // German translations
    this.courseTranslations.set(`${courseId}-de`, {
      id: 4,
      courseId: courseId,
      language: 'de',
      title: 'Wie man Immobilien auf Krisha.kz ohne Anzahlung kauft',
      description: 'Vollständiger Kurs über den Kauf von Immobilien in Kasachstan ohne eigenes Geld. Lernen Sie bewährte Immobilieninvestitionsstrategien.',
      shortDescription: 'Lernen Sie, wie Sie Immobilien online ohne Anzahlung überall auf der Welt ohne Erfahrung kaufen',
      learningOutcomes: [
        'Beherrschen Sie die krisha.kz-Plattform für profitable Deals',
        'Lernen Sie motivierte Verkäufer zu identifizieren',
        'Studieren Sie Kaufstrategien ohne Anzahlung',
        'Bauen Sie ein Investorennetzwerk für schnellen Weiterverkauf auf',
        'Beherrschen Sie Deal-Analyse und Verhandlung'
      ],
      requirements: [
        'Computer oder Mobilgerät mit Internetzugang',
        'Grundlegende Internetkenntnisse',
        'Bereitschaft neue Strategien zu lernen und anzuwenden',
        'Keine Immobilienerfahrung erforderlich'
      ],
      targetAudience: 'Anfänger-Immobilieninvestoren, Unternehmer, Menschen die passives Einkommen schaffen möchten',
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    // Chinese translations
    this.courseTranslations.set(`${courseId}-zh`, {
      id: 5,
      courseId: courseId,
      language: 'zh',
      title: '如何在 Krisha.kz 上无首付购买房地产',
      description: '全面的课程，教您如何在哈萨克斯坦购买房产而不使用自己的资金。学习经过验证的房地产投资策略。',
      shortDescription: '学习如何在世界任何地方无经验无首付在线购买房地产',
      learningOutcomes: [
        '掌握 krisha.kz 平台以寻找盈利交易',
        '学习识别有动机的卖家',
        '研究无首付购买策略',
        '建立投资者网络以便快速转售',
        '掌握交易分析和谈判技巧'
      ],
      requirements: [
        '有互联网接入的电脑或移动设备',
        '基本的互联网技能',
        '愿意学习和应用新策略',
        '不需要房地产经验'
      ],
      targetAudience: '初学者房地产投资者、企业家、希望创造被动收入的人士',
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    // Section translations
    const sections = [
      { id: 1, titles: { ru: 'Введение в Krisha.kz', es: 'Introducción a Krisha.kz', fr: 'Introduction à Krisha.kz', de: 'Einführung in Krisha.kz', zh: 'Krisha.kz 介绍' } },
      { id: 2, titles: { ru: 'Поиск мотивированных продавцов', es: 'Encontrar vendedores motivados', fr: 'Trouver des vendeurs motivés', de: 'Motivierte Verkäufer finden', zh: '寻找有动机的卖家' } },
      { id: 3, titles: { ru: 'Стратегии без первоначального взноса', es: 'Estrategias sin pago inicial', fr: 'Stratégies sans apport initial', de: 'Strategien ohne Anzahlung', zh: '无首付策略' } },
      { id: 4, titles: { ru: 'Создание сети покупателей', es: 'Construir red de compradores', fr: 'Construire un réseau d\'acheteurs', de: 'Käufernetzwerk aufbauen', zh: '建立买家网络' } }
    ];

    sections.forEach(section => {
      Object.entries(section.titles).forEach(([lang, title]) => {
        this.sectionTranslations.set(`${section.id}-${lang}`, {
          id: section.id,
          sectionId: section.id,
          language: lang,
          title: title,
          description: '',
          createdAt: new Date(),
          updatedAt: new Date(),
        });
      });
    });

    // Lesson translations 
    const lessons = [
      { id: 1, titles: { 
        ru: 'Добро пожаловать и обзор курса', 
        es: 'Bienvenida y descripción del curso', 
        fr: 'Bienvenue et aperçu du cours', 
        de: 'Willkommen und Kursübersicht',
        zh: '欢迎和课程概述' 
      }},
      { id: 2, titles: { 
        ru: 'Как искать на Krisha.kz как профессионал', 
        es: 'Cómo buscar en Krisha.kz como un profesional', 
        fr: 'Comment rechercher sur Krisha.kz comme un pro', 
        de: 'Wie man auf Krisha.kz wie ein Profi sucht',
        zh: '如何在 Krisha.kz 上进行专业搜索' 
      }},
      { id: 3, titles: { 
        ru: 'Определение проблемных объектов', 
        es: 'Identificar propiedades en dificultades', 
        fr: 'Identifier les propriétés en détresse', 
        de: 'Problemimmobilien identifizieren',
        zh: '识别问题房产' 
      }},
      { id: 4, titles: { 
        ru: 'Договоры оптовой переуступки', 
        es: 'Contratos de asignación mayorista', 
        fr: 'Contrats de cession en gros', 
        de: 'Großhandels-Übertragungsverträge',
        zh: '批发转让合同' 
      }},
      { id: 5, titles: { 
        ru: 'Создание сети покупателей', 
        es: 'Construir tu red de compradores', 
        fr: 'Construire votre réseau d\'acheteurs', 
        de: 'Ihr Käufernetzwerk aufbauen',
        zh: '建立买家网络' 
      }}
    ];

    lessons.forEach(lesson => {
      Object.entries(lesson.titles).forEach(([lang, title]) => {
        this.lessonTranslations.set(`${lesson.id}-${lang}`, {
          id: lesson.id,
          lessonId: lesson.id,
          language: lang,
          title: title,
          description: '',
          content: '',
          quiz: null,
          createdAt: new Date(),
          updatedAt: new Date(),
        });
      });
    });
  }

  private initializeResourceData() {
    // Create resource categories
    const templatesCategory: ResourceCategory = {
      id: this.currentResourceCategoryId++,
      name: "Templates & Documents",
      slug: "templates-documents",
      description: "Ready-to-use templates, contracts, and documentation for real estate wholesaling",
      icon: "FileText",
      sortOrder: 1,
      isActive: true,
      createdAt: new Date(),
    };
    this.resourceCategories.set(templatesCategory.id, templatesCategory);

    const analysisCategory: ResourceCategory = {
      id: this.currentResourceCategoryId++,
      name: "Market Analysis Tools",
      slug: "market-analysis",
      description: "Tools and guides for analyzing real estate markets and properties",
      icon: "TrendingUp",
      sortOrder: 2,
      isActive: true,
      createdAt: new Date(),
    };
    this.resourceCategories.set(analysisCategory.id, analysisCategory);

    const guidesCategory: ResourceCategory = {
      id: this.currentResourceCategoryId++,
      name: "Guides & Checklists",
      slug: "guides-checklists",
      description: "Step-by-step guides and comprehensive checklists for wholesaling success",
      icon: "CheckSquare",
      sortOrder: 3,
      isActive: true,
      createdAt: new Date(),
    };
    this.resourceCategories.set(guidesCategory.id, guidesCategory);

    const scriptsCategory: ResourceCategory = {
      id: this.currentResourceCategoryId++,
      name: "Scripts & Communication",
      slug: "scripts-communication",
      description: "Proven scripts for calls, emails, and negotiations with sellers and buyers",
      icon: "MessageSquare",
      sortOrder: 4,
      isActive: true,
      createdAt: new Date(),
    };
    this.resourceCategories.set(scriptsCategory.id, scriptsCategory);

    // Create sample resources
    const wholesalingContract: Resource = {
      id: this.currentResourceId++,
      title: "Complete Wholesaling Contract Templates",
      slug: "wholesaling-contract-templates",
      description: "Professional contract templates for wholesaling real estate deals, including purchase agreements, assignment contracts, and disclosure forms.",
      content: `# Complete Wholesaling Contract Templates

This comprehensive collection includes all the essential contracts you need to start wholesaling real estate:

## Included Templates:

### 1. Purchase and Sale Agreement
- Standard real estate purchase contract
- Inspection contingencies and timelines
- Financing terms and conditions
- Assignment clause included

### 2. Assignment Contract
- Legal assignment of purchase contract
- Clear buyer responsibilities
- Assignment fee structure
- Closing coordination details

### 3. Disclosure Forms
- Property condition disclosures
- Lead paint disclosures
- As-is condition acknowledgments
- Investor disclosure statements

### 4. Earnest Money Receipt
- Proper earnest money handling
- Escrow instructions
- Refund conditions
- Timeline specifications

## How to Use These Templates:

1. **Customize for Your State**: These templates are designed to be state-neutral but should be reviewed by a local attorney
2. **Fill in Property Details**: Complete all property-specific information accurately
3. **Set Clear Timelines**: Include realistic inspection and closing periods
4. **Include Assignment Rights**: Ensure your contracts clearly state your right to assign

## Legal Compliance:

⚠️ **Important**: These templates are for educational purposes. Always consult with a qualified real estate attorney in your area before using any contracts in actual transactions.

All templates are provided in both PDF and editable Word formats for your convenience.`,
      type: "template",
      categoryId: templatesCategory.id,
      authorId: 2, // Admin user
      authorName: "Platform Administrator",
      publishedDate: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // 1 week ago
      readTime: "15",
      rating: "4.7",
      ratingCount: 23,
      downloadCount: 156,
      viewCount: 340,
      tags: ["contracts", "templates", "legal", "wholesaling", "assignment"],
      featured: true,
      isPublished: true,
      requiresAuth: false,
      downloadUrl: "/api/pdf/download/template",
      videoUrl: null,
      podcastUrl: null,
      externalUrl: null,
      thumbnailUrl: null,
      seoTitle: "Free Wholesaling Contract Templates - Real Estate Assignment Contracts",
      seoDescription: "Download professional wholesaling contract templates including purchase agreements, assignment contracts, and disclosure forms for real estate investors.",
      seoKeywords: "wholesaling contracts, assignment contracts, real estate templates, purchase agreement",
      createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
      updatedAt: new Date(),
    };
    this.resourcesStorage.set(wholesalingContract.id, wholesalingContract);

    const marketAnalysisGuide: Resource = {
      id: this.currentResourceId++,
      title: "Krisha.kz Market Analysis Workbook",
      slug: "krisha-market-analysis-workbook",
      description: "Complete workbook for analyzing Kazakhstan real estate markets using krisha.kz data, including comparable sales analysis, market trends, and investment calculations.",
      content: `# Krisha.kz Market Analysis Workbook

Master the art of market analysis using krisha.kz to identify profitable investment opportunities in Kazakhstan's real estate market.

## Table of Contents:

### Chapter 1: Market Research Fundamentals
- Understanding Kazakhstan real estate cycles
- Key economic indicators to track
- Regional market differences
- Seasonal buying patterns

### Chapter 2: Using Krisha.kz Effectively  
- Advanced search techniques
- Reading between the lines of listings
- Identifying motivated sellers
- Price trend analysis tools

### Chapter 3: Comparable Sales Analysis
- Finding true comparables
- Adjusting for property differences
- Market value calculations
- Price per square meter analysis

### Chapter 4: Investment Calculations
- Cash flow projections
- Cap rate calculations
- ROI analysis methods
- Risk assessment frameworks

### Chapter 5: Market Timing Strategies
- Identifying market cycles
- Best times to buy and sell
- Economic indicators to watch
- Local market catalysts

## Key Features:

✅ **Interactive Worksheets**: Fill-in-the-blank analysis forms
✅ **Real Examples**: Actual krisha.kz case studies
✅ **Calculator Templates**: Pre-built Excel formulas
✅ **Market Maps**: Visual representation of key areas
✅ **Trend Charts**: Historical price data analysis

## Bonus Materials:

- Kazakhstan Real Estate Law Summary
- Tax Implications for Foreign Investors
- Currency Exchange Considerations
- Local Professional Network Directory

This 45-page workbook transforms complex market analysis into a simple, repeatable process that any investor can master.`,
      type: "guide",
      categoryId: analysisCategory.id,
      authorId: 1, // Instructor
      authorName: "Marcus Rodriguez",
      publishedDate: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000), // 2 weeks ago
      readTime: "25",
      rating: "4.9",
      ratingCount: 18,
      downloadCount: 89,
      viewCount: 267,
      tags: ["market analysis", "krisha.kz", "investment", "kazakhstan", "workbook"],
      featured: true,
      isPublished: true,
      requiresAuth: true,
      downloadUrl: "/api/pdf/download/workbook",
      videoUrl: null,
      podcastUrl: null,
      externalUrl: null,
      thumbnailUrl: null,
      seoTitle: "Krisha.kz Market Analysis Workbook - Kazakhstan Real Estate Analysis",
      seoDescription: "Complete market analysis workbook for Kazakhstan real estate investment using krisha.kz data and tools.",
      seoKeywords: "krisha.kz, market analysis, kazakhstan real estate, investment analysis",
      createdAt: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000),
      updatedAt: new Date(),
    };
    this.resourcesStorage.set(marketAnalysisGuide.id, marketAnalysisGuide);

    const negotiationScripts: Resource = {
      id: this.currentResourceId++,
      title: "Power Negotiation Scripts for Sellers",
      slug: "negotiation-scripts-sellers",
      description: "Proven phone scripts, email templates, and negotiation strategies for contacting motivated sellers and closing wholesale deals.",
      content: `# Power Negotiation Scripts for Sellers

Transform your seller conversations with these battle-tested scripts used by successful wholesalers worldwide.

## Phone Scripts Collection:

### Initial Contact Script
"Hi [Name], I noticed your property listing on krisha.kz and I'm very interested. I represent a group of investors who can close quickly with cash. Would you be open to a fair cash offer that could close in 10-14 days?"

### Follow-up Script
"I wanted to follow up on our conversation about your property. I've done some research and I believe I can present you with a fair offer. When would be a good time to discuss the details?"

### Objection Handling Scripts
- "The price seems low..." response
- "I need to think about it..." response  
- "I have other offers..." response
- "I'm not motivated to sell quickly..." response

## Email Templates:

### Introduction Email
Subject: Quick Cash Offer for Your Property - [Address]

### Follow-up Email Sequence
- Day 1: Initial contact
- Day 3: Value proposition  
- Day 7: Social proof and testimonials
- Day 14: Final follow-up

### Contract Presentation Email
Professional template for sending offers and contracts

## Text Message Templates:

### Initial Contact Text
"Hi [Name], saw your property on krisha.kz. Can offer cash, close in 2 weeks. Interested in discussing? - [Your Name]"

### Appointment Setting Text
"Thanks for your interest! I have openings Tuesday 2pm or Wednesday 10am to view the property. Which works better?"

## Advanced Negotiation Techniques:

### Building Rapport
- Mirror their communication style
- Find common ground
- Use their name frequently
- Listen more than you speak

### Creating Urgency
- Limited time offers
- Competing buyer scenarios
- Market condition references
- Seasonal considerations

### Handling Difficult Sellers
- Angry sellers
- Suspicious sellers  
- Indecisive sellers
- Unrealistic sellers

## Body Language & In-Person Tips:

### First Impressions
- Professional appearance
- Confident handshake
- Appropriate eye contact
- Open body posture

### During Property Viewing
- Take detailed notes
- Ask thoughtful questions
- Show genuine interest
- Maintain professionalism

## Cultural Considerations for Kazakhstan:

### Local Customs
- Proper greetings
- Business etiquette
- Time management expectations
- Gift-giving protocols

### Language Tips
- Key phrases in Kazakh/Russian
- Professional terminology
- Politeness expressions
- Numbers and financial terms

This collection includes over 50 different scripts and templates, all field-tested and proven to increase your success rate with motivated sellers.`,
      type: "guide",
      categoryId: scriptsCategory.id,
      authorId: 1, // Instructor  
      authorName: "Marcus Rodriguez",
      publishedDate: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000), // 5 days ago
      readTime: "12",
      rating: "4.8",
      ratingCount: 31,
      downloadCount: 127,
      viewCount: 198,
      tags: ["negotiation", "scripts", "communication", "sellers", "phone calls"],
      featured: true,
      isPublished: true,
      requiresAuth: false,
      downloadUrl: "/api/pdf/download/scripts",
      videoUrl: null,
      podcastUrl: null,
      externalUrl: null,
      thumbnailUrl: null,
      seoTitle: "Wholesaling Negotiation Scripts - Seller Communication Templates",
      seoDescription: "Proven phone scripts and email templates for negotiating with motivated sellers in real estate wholesaling.",
      seoKeywords: "negotiation scripts, seller scripts, wholesaling communication, real estate phone scripts",
      createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
      updatedAt: new Date(),
    };
    this.resourcesStorage.set(negotiationScripts.id, negotiationScripts);

    const propertyChecklist: Resource = {
      id: this.currentResourceId++,
      title: "Property Inspection Checklist",
      slug: "property-inspection-checklist",
      description: "Comprehensive 50-point property inspection checklist to evaluate properties remotely and estimate repair costs accurately.",
      content: `# Property Inspection Checklist

This comprehensive checklist ensures you never miss critical details when evaluating properties for wholesale deals.

## Exterior Inspection (20 Points)

### Structural Elements
□ Foundation visible cracks or settling
□ Roof condition and age assessment  
□ Siding/exterior wall condition
□ Windows and doors functionality
□ Gutters and downspouts condition

### Grounds & Landscaping  
□ Drainage issues or standing water
□ Driveway and walkway condition
□ Fence condition and property boundaries
□ Tree health and proximity to structure
□ Overall curb appeal assessment

### Utilities & Systems
□ Electrical meter and service condition
□ HVAC unit exterior inspection
□ Plumbing access points
□ Gas meter and connections
□ Septic or sewer access

## Interior Inspection (25 Points)

### Structural & Safety
□ Floor condition and levelness
□ Wall cracks or damage
□ Ceiling stains or sagging
□ Staircase safety and condition
□ Smoke detector presence

### Electrical System
□ Panel box condition and capacity
□ Outlet functionality testing
□ Light fixture condition
□ Wiring visible condition
□ Code compliance assessment

### Plumbing System  
□ Water pressure testing
□ Faucet and fixture condition
□ Toilet functionality
□ Water heater age and condition
□ Visible pipe condition

### HVAC System
□ Heating system functionality
□ Air conditioning operation
□ Ductwork visible condition
□ Filter condition
□ Thermostat operation

### Interior Features
□ Flooring condition throughout
□ Kitchen appliances included/condition
□ Bathroom fixtures condition  
□ Door and window operation
□ Storage space adequacy

## Documentation & Photos (5 Points)

### Required Photos
□ Front and back exterior views
□ Kitchen and bathroom photos
□ Any damage or repair needs
□ Electrical and plumbing systems
□ Unique features or selling points

## Repair Cost Estimation

### Categories & Typical Costs
- **Cosmetic**: $5-15 per sq ft
- **Moderate**: $15-30 per sq ft  
- **Heavy**: $30-50 per sq ft
- **Gut Rehab**: $50-80 per sq ft

### Common Repair Items
- Paint (interior): $2-4 per sq ft
- Flooring replacement: $3-8 per sq ft
- Kitchen renovation: $15,000-30,000
- Bathroom renovation: $8,000-15,000
- Roof replacement: $8,000-20,000

## Red Flags to Avoid

⚠️ **Structural Issues**
- Foundation problems
- Roof structural damage
- Load-bearing wall damage

⚠️ **Major Systems**
- Electrical panel upgrades needed
- Plumbing re-piping required
- HVAC system replacement

⚠️ **Environmental Concerns**
- Mold presence
- Asbestos materials
- Lead paint (pre-1978)

## Mobile App Integration

This checklist is designed to work with mobile apps for:
- Photo organization
- Voice-to-text notes
- Automatic report generation
- Cost estimation calculators

## Professional Referrals

When issues exceed your expertise:
- Structural engineers
- Licensed electricians  
- Plumbing professionals
- HVAC specialists
- Environmental testing

Use this checklist on every property to ensure accurate repair estimates and profitable wholesale deals.`,
      type: "checklist",
      categoryId: guidesCategory.id,
      authorId: 2, // Admin
      authorName: "Platform Administrator", 
      publishedDate: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), // 3 days ago
      readTime: "8",
      rating: "4.6",
      ratingCount: 14,
      downloadCount: 67,
      viewCount: 145,
      tags: ["inspection", "checklist", "property evaluation", "repair costs", "due diligence"],
      featured: false,
      isPublished: true,
      requiresAuth: false,
      downloadUrl: "/api/pdf/download/checklist",
      videoUrl: null,
      podcastUrl: null,
      externalUrl: null,
      thumbnailUrl: null,
      seoTitle: "Property Inspection Checklist - Real Estate Due Diligence",
      seoDescription: "50-point property inspection checklist for real estate investors to evaluate properties and estimate repair costs.",
      seoKeywords: "property inspection, real estate checklist, repair costs, due diligence, property evaluation",
      createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
      updatedAt: new Date(),
    };
    this.resourcesStorage.set(propertyChecklist.id, propertyChecklist);
  }

  // Users
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(user => user.email === email);
  }

  async getAllUsers(): Promise<User[]> {
    return Array.from(this.users.values());
  }

  async getUsersWithFilters(filters: {
    search?: string;
    role?: string;
    membershipType?: string;
    isActive?: boolean;
    limit?: number;
    offset?: number;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
  }): Promise<{ users: User[]; total: number }> {
    let users = Array.from(this.users.values());
    
    // Apply filters
    if (filters.search) {
      const searchTerm = filters.search.toLowerCase();
      users = users.filter(u => 
        u.name.toLowerCase().includes(searchTerm) ||
        u.email.toLowerCase().includes(searchTerm)
      );
    }
    
    if (filters.role && filters.role !== 'all') {
      users = users.filter(u => u.role === filters.role);
    }
    
    if (filters.membershipType && filters.membershipType !== 'all') {
      users = users.filter(u => u.membershipType === filters.membershipType);
    }
    
    if (filters.isActive !== undefined) {
      users = users.filter(u => u.isActive === filters.isActive);
    }

    const total = users.length;

    // Apply sorting
    if (filters.sortBy) {
      users.sort((a: any, b: any) => {
        const aVal = a[filters.sortBy!] || '';
        const bVal = b[filters.sortBy!] || '';
        
        if (filters.sortOrder === 'desc') {
          return bVal > aVal ? 1 : -1;
        }
        return aVal > bVal ? 1 : -1;
      });
    }

    // Apply pagination
    if (filters.offset) {
      users = users.slice(filters.offset);
    }
    if (filters.limit) {
      users = users.slice(0, filters.limit);
    }

    return { users, total };
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const user: User = {
      id: this.currentUserId++,
      email: insertUser.email,
      passwordHash: insertUser.passwordHash || null,
      name: insertUser.name,
      role: insertUser.role || "student",
      membershipType: insertUser.membershipType || "free",
      hasUnlimitedAccess: insertUser.hasUnlimitedAccess || false,
      isActive: insertUser.isActive !== undefined ? insertUser.isActive : true,
      emailVerified: insertUser.emailVerified || false,
      lastLoginAt: insertUser.lastLoginAt || null,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.users.set(user.id, user);
    return user;
  }

  async updateUser(id: number, updateData: Partial<InsertUser>): Promise<User | undefined> {
    const user = this.users.get(id);
    if (!user) return undefined;
    
    const updatedUser = { ...user, ...updateData, updatedAt: new Date() };
    this.users.set(id, updatedUser);
    return updatedUser;
  }

  async updateUserLastLogin(id: number): Promise<void> {
    const user = this.users.get(id);
    if (user) {
      user.lastLoginAt = new Date();
      this.users.set(id, user);
    }
  }

  async deleteUser(id: number): Promise<boolean> {
    return this.users.delete(id);
  }

  // Authentication operations - in-memory implementation for development
  async createPasswordResetToken(userId: number, token: string, expiresAt: Date): Promise<void> {
    // Password reset token created for production use
  }

  async getPasswordResetToken(token: string): Promise<{ userId: number; expiresAt: Date } | undefined> {
    return undefined;
  }

  async usePasswordResetToken(token: string): Promise<boolean> {
    return true;
  }

  async createEmailVerificationToken(userId: number, token: string, expiresAt: Date): Promise<void> {
    // Email verification token created for production use
  }

  async getEmailVerificationToken(token: string): Promise<{ userId: number; expiresAt: Date } | undefined> {
    return undefined;
  }

  async useEmailVerificationToken(token: string): Promise<boolean> {
    return true;
  }

  async verifyUserEmail(userId: number): Promise<void> {
    const user = this.users.get(userId);
    if (user) {
      user.emailVerified = true;
      user.updatedAt = new Date();
      this.users.set(userId, user);
    }
  }

  async createUserSession(userId: number, sessionToken: string, expiresAt: Date, userAgent?: string, ipAddress?: string): Promise<void> {
    // User session created for production use
  }

  async getUserSession(sessionToken: string): Promise<{ userId: number; expiresAt: Date } | undefined> {
    return undefined;
  }

  async deleteUserSession(sessionToken: string): Promise<boolean> {
    return true;
  }

  async deleteUserSessions(userId: number): Promise<void> {
    // Deleting all sessions for user in production
  }

  // LMS Methods
  async getMembershipPlans(): Promise<MembershipPlan[]> {
    return Array.from(this.membershipPlans.values()).filter(plan => plan.isActive);
  }

  async getMembershipPlan(id: number): Promise<MembershipPlan | undefined> {
    return this.membershipPlans.get(id);
  }

  async createMembershipPlan(planData: InsertMembershipPlan): Promise<MembershipPlan> {
    const plan: MembershipPlan = {
      id: this.currentMembershipPlanId++,
      name: planData.name,
      description: planData.description,
      price: planData.price,
      currency: planData.currency || "USD",
      interval: planData.interval,
      intervalCount: planData.intervalCount || 1,
      features: planData.features,
      isPopular: planData.isPopular || false,
      isActive: planData.isActive !== undefined ? planData.isActive : true,
      maxCourses: planData.maxCourses || null,
      maxStudents: planData.maxStudents || null,
      supportLevel: planData.supportLevel || "basic",
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.membershipPlans.set(plan.id, plan);
    return plan;
  }

  async updateMembershipPlan(id: number, updateData: Partial<InsertMembershipPlan>): Promise<MembershipPlan | undefined> {
    const plan = this.membershipPlans.get(id);
    if (!plan) return undefined;
    
    const updatedPlan = { ...plan, ...updateData, updatedAt: new Date() };
    this.membershipPlans.set(id, updatedPlan);
    return updatedPlan;
  }

  // User Memberships
  async getUserMembership(userId: number): Promise<UserMembership | undefined> {
    return Array.from(this.userMemberships.values()).find(membership => membership.userId === userId && membership.status === 'active');
  }

  async createUserMembership(membershipData: InsertUserMembership): Promise<UserMembership> {
    const membership: UserMembership = {
      id: this.currentUserMembershipId++,
      userId: membershipData.userId,
      planId: membershipData.planId,
      status: membershipData.status || "active",
      startDate: membershipData.startDate || new Date(),
      endDate: membershipData.endDate || null,
      autoRenew: membershipData.autoRenew !== undefined ? membershipData.autoRenew : true,
      stripeCustomerId: membershipData.stripeCustomerId || null,
      stripeSubscriptionId: membershipData.stripeSubscriptionId || null,
      paymentMethod: membershipData.paymentMethod || null,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.userMemberships.set(membership.id, membership);
    return membership;
  }

  async updateUserMembership(id: number, updateData: Partial<InsertUserMembership>): Promise<UserMembership | undefined> {
    const membership = this.userMemberships.get(id);
    if (!membership) return undefined;
    
    const updatedMembership = { ...membership, ...updateData, updatedAt: new Date() };
    this.userMemberships.set(id, updatedMembership);
    return updatedMembership;
  }

  async getUserMemberships(userId: number): Promise<UserMembership[]> {
    return Array.from(this.userMemberships.values()).filter(membership => membership.userId === userId);
  }

  // Enrollment Management
  async getUserEnrollments(userId: number): Promise<Enrollment[]> {
    return Array.from(this.enrollments.values()).filter(enrollment => enrollment.userId === userId);
  }

  async createEnrollment(enrollmentData: InsertEnrollment): Promise<Enrollment> {
    const enrollment: Enrollment = {
      id: this.currentEnrollmentId++,
      userId: enrollmentData.userId,
      courseId: enrollmentData.courseId,
      status: enrollmentData.status || "active",
      progress: enrollmentData.progress || "0",
      lastAccessedAt: enrollmentData.lastAccessedAt || null,
      completedAt: enrollmentData.completedAt || null,
      certificateIssued: enrollmentData.certificateIssued || false,
      paymentStatus: enrollmentData.paymentStatus || "free",
      enrolledAt: new Date(),
    };
    this.enrollments.set(enrollment.id, enrollment);
    return enrollment;
  }

  async updateEnrollment(id: number, updateData: Partial<InsertEnrollment>): Promise<Enrollment | undefined> {
    const enrollment = this.enrollments.get(id);
    if (!enrollment) return undefined;
    
    const updatedEnrollment = { ...enrollment, ...updateData };
    this.enrollments.set(id, updatedEnrollment);
    return updatedEnrollment;
  }





  async getCourseCategories(): Promise<CourseCategory[]> {
    return Array.from(this.courseCategories.values()).filter(category => category.isActive);
  }

  async getCourseSections(courseId: number, language: string = 'en'): Promise<CourseSection[]> {
    const sections = Array.from(this.courseSections.values())
      .filter(section => section.courseId === courseId && section.isPublic)
      .sort((a, b) => a.sortOrder - b.sortOrder);

    // Apply translations if available
    return sections.map(section => {
      const translation = this.sectionTranslations.get(`${section.id}-${language}`);
      if (translation) {
        return {
          ...section,
          title: translation.title,
          description: translation.description,
        };
      }
      return section;
    });
  }

  async getCourseLessons(sectionId: number, language: string = 'en'): Promise<CourseLesson[]> {
    const lessons = Array.from(this.courseLessons.values())
      .filter(lesson => lesson.sectionId === sectionId && lesson.isPublic)
      .sort((a, b) => a.sortOrder - b.sortOrder);

    // Apply translations if available
    return lessons.map(lesson => {
      const translation = this.lessonTranslations.get(`${lesson.id}-${language}`);
      if (translation) {
        return {
          ...lesson,
          title: translation.title,
          description: translation.description,
          content: translation.content,
          quiz: translation.quiz,
        };
      }
      return lesson;
    });
  }

  // Forum Methods
  async getForumCategories(): Promise<ForumCategory[]> {
    return Array.from(this.forumCategories.values())
      .filter(category => category.isActive)
      .sort((a, b) => a.sortOrder - b.sortOrder);
  }

  async getForumTopics(categoryId?: number): Promise<ForumTopic[]> {
    const topics = Array.from(this.forumTopics.values());
    return categoryId 
      ? topics.filter(topic => topic.categoryId === categoryId)
      : topics;
  }

  async getForumTopic(id: number): Promise<ForumTopic | undefined> {
    return this.forumTopics.get(id);
  }

  async createForumTopic(topicData: InsertForumTopic): Promise<ForumTopic> {
    const topic: ForumTopic = {
      id: this.currentForumTopicId++,
      categoryId: topicData.categoryId,
      userId: topicData.userId,
      title: topicData.title,
      slug: topicData.slug,
      content: topicData.content,
      tags: topicData.tags || null,
      type: topicData.type || "discussion",
      isPinned: topicData.isPinned || false,
      isLocked: topicData.isLocked || false,
      isSolved: topicData.isSolved || false,
      views: topicData.views || 0,
      likeCount: topicData.likeCount || 0,
      replyCount: topicData.replyCount || 0,
      lastReplyAt: topicData.lastReplyAt || null,
      lastReplyUserId: topicData.lastReplyUserId || null,
      solvedByPostId: topicData.solvedByPostId || null,
      status: topicData.status || "published",
      moderationStatus: topicData.moderationStatus || "approved",
      moderatedAt: topicData.moderatedAt || null,
      moderatedByUserId: topicData.moderatedByUserId || null,
      moderationReason: topicData.moderationReason || null,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.forumTopics.set(topic.id, topic);
    return topic;
  }

  async getForumPosts(topicId: number): Promise<ForumPost[]> {
    return Array.from(this.forumPosts.values())
      .filter(post => post.topicId === topicId)
      .sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime());
  }

  async createForumPost(postData: InsertForumPost): Promise<ForumPost> {
    const post: ForumPost = {
      id: this.currentForumPostId++,
      topicId: postData.topicId,
      userId: postData.userId,
      content: postData.content,
      parentPostId: postData.parentPostId || null,
      isFirstPost: postData.isFirstPost || false,
      isAcceptedAnswer: postData.isAcceptedAnswer || false,
      likeCount: 0,
      replyCount: 0,
      status: postData.status || "published",
      moderationStatus: postData.moderationStatus || "approved",
      moderatedAt: postData.moderatedAt || null,
      moderatedByUserId: postData.moderatedByUserId || null,
      moderationReason: postData.moderationReason || null,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.forumPosts.set(post.id, post);

    // Update topic reply count and last reply info
    const topic = this.forumTopics.get(postData.topicId);
    if (topic && !post.isFirstPost) {
      topic.replyCount++;
      topic.lastReplyAt = new Date();
      topic.lastReplyUserId = postData.userId;
      this.forumTopics.set(topic.id, topic);
    }

    return post;
  }

  async likeForumPost(userId: number, postId: number): Promise<ForumPostLike> {
    const like: ForumPostLike = {
      id: this.currentForumPostLikeId++,
      postId: postId,
      userId: userId,
      type: 'like',
      createdAt: new Date(),
    };
    this.forumPostLikes.set(like.id, like);

    // Update post like count
    const post = this.forumPosts.get(postId);
    if (post) {
      post.likeCount++;
      this.forumPosts.set(post.id, post);
    }

    return like;
  }

  async updateTopicViews(topicId: number): Promise<void> {
    const topic = this.forumTopics.get(topicId);
    if (topic) {
      topic.views++;
      this.forumTopics.set(topic.id, topic);
    }
  }

  async getForumPostCount(categoryId: number): Promise<number> {
    const topics = Array.from(this.forumTopics.values()).filter(topic => topic.categoryId === categoryId);
    let totalPosts = 0;
    for (const topic of topics) {
      const posts = Array.from(this.forumPosts.values()).filter(post => post.topicId === topic.id);
      totalPosts += posts.length;
    }
    return totalPosts;
  }

  // Mentorship Methods Implementation
  async getMentorProfiles(): Promise<MentorProfile[]> {
    return Array.from(this.mentorProfiles.values()).filter(profile => profile.isActive);
  }

  async getMentorProfile(id: number): Promise<MentorProfile | undefined> {
    return this.mentorProfiles.get(id);
  }

  async createMentorProfile(profileData: InsertMentorProfile): Promise<MentorProfile> {
    const profile: MentorProfile = {
      id: this.currentMentorId++,
      ...profileData,
      currency: profileData.currency ?? "USD", // Ensure currency is always set
      certifications: profileData.certifications ?? null, // Ensure certifications is set
      hourlyRate: profileData.hourlyRate ?? null, // Ensure hourlyRate is set
      availability: profileData.availability ?? null, // Ensure availability is set
      languages: profileData.languages ?? ["en"], // Ensure languages is set with default
      rating: "0.00",
      reviewCount: 0,
      totalSessions: 0,
      isActive: profileData.isActive ?? true,
      isVerified: profileData.isVerified ?? false,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.mentorProfiles.set(profile.id, profile);
    return profile;
  }

  async updateMentorProfile(id: number, updates: Partial<MentorProfile>): Promise<MentorProfile | undefined> {
    const profile = this.mentorProfiles.get(id);
    if (!profile) return undefined;
    
    const updatedProfile = { ...profile, ...updates, updatedAt: new Date() };
    this.mentorProfiles.set(id, updatedProfile);
    return updatedProfile;
  }

  async getMentorshipSessions(userId: number): Promise<MentorshipSession[]> {
    return Array.from(this.mentorshipSessions.values())
      .filter(session => session.studentId === userId || 
        (this.mentorProfiles.get(session.mentorId)?.userId === userId))
      .sort((a, b) => b.scheduledAt.getTime() - a.scheduledAt.getTime());
  }

  async createMentorshipSession(sessionData: InsertMentorshipSession): Promise<MentorshipSession> {
    const session: MentorshipSession = {
      id: this.currentSessionId++,
      ...sessionData,
      topicId: sessionData.topicId ?? null, // Ensure topicId is null if undefined
      rating: sessionData.rating ?? null, // Ensure rating is null if undefined
      sessionUrl: sessionData.sessionUrl ?? null, // Ensure sessionUrl is null if undefined
      notes: sessionData.notes ?? null, // Ensure notes is null if undefined
      studentFeedback: sessionData.studentFeedback ?? null, // Ensure studentFeedback is null if undefined
      mentorFeedback: sessionData.mentorFeedback ?? null, // Ensure mentorFeedback is null if undefined
      status: sessionData.status || "scheduled",
      duration: sessionData.duration || 60,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.mentorshipSessions.set(session.id, session);
    
    // Update mentor's total sessions count
    const mentorProfile = this.mentorProfiles.get(session.mentorId);
    if (mentorProfile) {
      mentorProfile.totalSessions += 1;
      mentorProfile.updatedAt = new Date();
      this.mentorProfiles.set(session.mentorId, mentorProfile);
    }
    
    return session;
  }

  async updateMentorshipSession(id: number, updates: Partial<MentorshipSession>): Promise<MentorshipSession | undefined> {
    const session = this.mentorshipSessions.get(id);
    if (!session) return undefined;
    
    const updatedSession = { ...session, ...updates, updatedAt: new Date() };
    this.mentorshipSessions.set(id, updatedSession);
    return updatedSession;
  }

  async getMentorshipReviews(mentorId: number): Promise<MentorshipReview[]> {
    return Array.from(this.mentorshipReviews.values())
      .filter(review => review.mentorId === mentorId && review.isPublic)
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }

  async createMentorshipReview(reviewData: InsertMentorshipReview): Promise<MentorshipReview> {
    const review: MentorshipReview = {
      id: this.currentReviewId++,
      ...reviewData,
      isPublic: reviewData.isPublic ?? true,
      createdAt: new Date(),
    };
    this.mentorshipReviews.set(review.id, review);
    
    // Update mentor's rating and review count
    await this.updateMentorRating(review.mentorId);
    
    return review;
  }

  private async updateMentorRating(mentorId: number): Promise<void> {
    const mentorProfile = this.mentorProfiles.get(mentorId);
    if (!mentorProfile) return;
    
    const reviews = await this.getMentorshipReviews(mentorId);
    if (reviews.length === 0) return;
    
    const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0);
    const averageRating = totalRating / reviews.length;
    
    mentorProfile.rating = averageRating.toFixed(2);
    mentorProfile.reviewCount = reviews.length;
    mentorProfile.updatedAt = new Date();
    
    this.mentorProfiles.set(mentorId, mentorProfile);
  }

  private initializeForumData() {
    // Create forum categories with all required fields
    const generalCategory: ForumCategory = {
      id: this.currentForumCategoryId++,
      name: "General Discussion",
      description: "General discussions about real estate investing and wholesaling",
      slug: "general-discussion",
      color: "#3B82F6",
      icon: "message-square",
      sortOrder: 1,
      isActive: true,
      requiresMembership: false,
      courseId: null,
      moderatorIds: [],
      postCount: 0,
      topicCount: 0,
      lastTopicId: null,
      lastPostAt: null,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.forumCategories.set(generalCategory.id, generalCategory);

    const krishaCategory: ForumCategory = {
      id: this.currentForumCategoryId++,
      name: "Krisha.kz Strategies",
      description: "Specific discussions about using krisha.kz for property deals",
      slug: "krisha-strategies",
      color: "#10B981",
      icon: "target",
      sortOrder: 2,
      isActive: true,
      requiresMembership: true,
      courseId: null,
      moderatorIds: [],
      postCount: 0,
      topicCount: 0,
      lastTopicId: null,
      lastPostAt: null,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.forumCategories.set(krishaCategory.id, krishaCategory);

    const dealsCategory: ForumCategory = {
      id: this.currentForumCategoryId++,
      name: "Deal Analysis",
      description: "Share and analyze potential wholesale deals",
      slug: "deal-analysis",
      color: "#F59E0B",
      icon: "chart-bar",
      sortOrder: 3,
      isActive: true,
      requiresMembership: true,
      courseId: null,
      moderatorIds: [],
      postCount: 0,
      topicCount: 0,
      lastTopicId: null,
      lastPostAt: null,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.forumCategories.set(dealsCategory.id, dealsCategory);

    // Create sample forum topics
    const welcomeTopic: ForumTopic = {
      id: this.currentForumTopicId++,
      categoryId: generalCategory.id,
      userId: 1, // Instructor user
      title: "Welcome to the G.R.E.W. Community Forum!",
      slug: "welcome-to-grew-community",
      content: `Welcome to our exclusive community forum!

This is your place to:
- Ask questions about real estate wholesaling
- Share your wins and challenges
- Connect with fellow investors
- Get feedback on potential deals
- Learn from experienced practitioners

**Forum Guidelines:**
1. Be respectful and supportive
2. No spam or promotional content
3. Stay on topic in each category
4. Share real experiences and insights
5. Help others when you can

Let's build a strong community of successful real estate investors together!`,
      tags: null,
      type: "announcement",
      isPinned: true,
      isLocked: false,
      isSolved: false,
      views: 247,
      likeCount: 15,
      replyCount: 12,
      lastReplyAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
      lastReplyUserId: 3, // Premium user
      solvedByPostId: null,
      status: "published",
      moderationStatus: "approved",
      moderatedAt: null,
      moderatedByUserId: null,
      moderationReason: null,
      createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // 1 week ago
      updatedAt: new Date(),
    };
    this.forumTopics.set(welcomeTopic.id, welcomeTopic);

    const krishaTopic: ForumTopic = {
      id: this.currentForumTopicId++,
      categoryId: krishaCategory.id,
      userId: 3, // Premium user
      title: "Best Time to Search for Properties on Krisha.kz?",
      slug: "best-time-search-properties-krisha",
      content: `Hey everyone! I've been wondering if there's an optimal time of day or week to search for new listings on krisha.kz. 

Has anyone noticed patterns in when motivated sellers post their properties? I'm thinking early morning might be good to catch overnight posts, but curious about your experiences.

Also, do you think there's a difference between weekday vs weekend posting activity?

Would love to hear your strategies!`,
      tags: null,
      type: "question",
      isPinned: false,
      isLocked: false,
      isSolved: false,
      views: 89,
      likeCount: 6,
      replyCount: 7,
      lastReplyAt: new Date(Date.now() - 3 * 60 * 60 * 1000), // 3 hours ago
      lastReplyUserId: 1, // Instructor
      solvedByPostId: null,
      status: "published",
      moderationStatus: "approved",
      moderatedAt: null,
      moderatedByUserId: null,
      moderationReason: null,
      createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), // 3 days ago
      updatedAt: new Date(),
    };
    this.forumTopics.set(krishaTopic.id, krishaTopic);

    // Create sample forum posts
    const welcomePost1: ForumPost = {
      id: this.currentForumPostId++,
      topicId: welcomeTopic.id,
      userId: 1, // Instructor
      content: welcomeTopic.content,
      parentPostId: null,
      isFirstPost: true,
      isAcceptedAnswer: false,
      likeCount: 15,
      replyCount: 0,
      status: "published",
      moderationStatus: "approved",
      moderatedAt: null,
      moderatedByUserId: null,
      moderationReason: null,
      createdAt: welcomeTopic.createdAt,
      updatedAt: new Date(),
    };
    this.forumPosts.set(welcomePost1.id, welcomePost1);

    const welcomeReply1: ForumPost = {
      id: this.currentForumPostId++,
      topicId: welcomeTopic.id,
      userId: 3, // Premium user
      content: `Thanks for setting this up! I'm excited to connect with other investors. I've been following the course and already found 3 potential deals on krisha.kz.

Looking forward to sharing my progress and learning from everyone else's experiences.`,
      parentPostId: null,
      isFirstPost: false,
      isAcceptedAnswer: false,
      likeCount: 8,
      replyCount: 0,
      status: "published",
      moderationStatus: "approved",
      moderatedAt: null,
      moderatedByUserId: null,
      moderationReason: null,
      createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
      updatedAt: new Date(),
    };
    this.forumPosts.set(welcomeReply1.id, welcomeReply1);

    const krishaPost1: ForumPost = {
      id: this.currentForumPostId++,
      topicId: krishaTopic.id,
      userId: 3, // Premium user
      content: krishaTopic.content,
      parentPostId: null,
      isFirstPost: true,
      isAcceptedAnswer: false,
      likeCount: 6,
      replyCount: 0,
      status: "published",
      moderationStatus: "approved",
      moderatedAt: null,
      moderatedByUserId: null,
      moderationReason: null,
      createdAt: krishaTopic.createdAt,
      updatedAt: new Date(),
    };
    this.forumPosts.set(krishaPost1.id, krishaPost1);

    const krishaReply1: ForumPost = {
      id: this.currentForumPostId++,
      topicId: krishaTopic.id,
      userId: 1, // Instructor
      content: `Great question! From my experience, I've found that:

**Best Times:**
- Early morning (6-8 AM) - catches overnight posts
- Lunch time (12-2 PM) - people posting during breaks
- Evening (6-8 PM) - after work hours

**Best Days:**
- Sunday evenings and Monday mornings tend to have fresh listings
- Thursday-Friday can be good for motivated sellers wanting quick weekend showings

The key is consistency. I recommend checking 2-3 times per day and setting up saved searches with notifications.

What patterns have you noticed in your area?`,
      parentPostId: null,
      isFirstPost: false,
      isAcceptedAnswer: false,
      likeCount: 12,
      replyCount: 0,
      status: "published",
      moderationStatus: "approved",
      moderatedAt: null,
      moderatedByUserId: null,
      moderationReason: null,
      createdAt: new Date(Date.now() - 3 * 60 * 60 * 1000),
      updatedAt: new Date(),
    };
    this.forumPosts.set(krishaReply1.id, krishaReply1);
  }

  // Analytics Methods Implementation
  async getAdminAnalytics(): Promise<{
    totalUsers: number;
    totalCourses: number;
    totalRevenue: number;
    activeUsers: number;
    totalEnrollments: number;
    averageRating: number;
  }> {
    const users = Array.from(this.users.values());
    const courses = Array.from(this.courses.values());
    const enrollments = Array.from(this.enrollments.values());
    const reviews = Array.from(this.courseReviews.values());
    
    const totalUsers = users.length;
    const totalCourses = courses.length;
    const activeUsers = users.filter(user => user.isActive).length;
    const totalEnrollments = enrollments.length;
    
    // Calculate total revenue from enrollments
    const totalRevenue = enrollments.reduce((sum, enrollment) => {
      const course = this.courses.get(enrollment.courseId);
      const coursePrice = course?.price;
      return sum + (coursePrice ? parseFloat(coursePrice.toString()) : 0);
    }, 0);
    
    // Calculate average rating
    const averageRating = reviews.length > 0 
      ? reviews.reduce((sum, review) => sum + Number(review.rating), 0) / reviews.length
      : 0;
    
    return {
      totalUsers,
      totalCourses,
      totalRevenue,
      activeUsers,
      totalEnrollments,
      averageRating: Math.round(averageRating * 100) / 100
    };
  }

  async getUserCount(): Promise<number> {
    return this.users.size;
  }

  async getCourseCount(): Promise<number> {
    return this.courses.size;
  }

  async getTotalRevenue(): Promise<number> {
    const enrollments = Array.from(this.enrollments.values());
    return enrollments.reduce((sum, enrollment) => {
      const course = this.courses.get(enrollment.courseId);
      const coursePrice = course?.price;
      return sum + (coursePrice ? parseFloat(coursePrice.toString()) : 0);
    }, 0);
  }

  async getActiveUserCount(): Promise<number> {
    return Array.from(this.users.values()).filter(user => user.isActive).length;
  }

  // Additional LMS Methods (Implementation for missing methods)
  async getCourseBySlug(slug: string, language: string = 'en'): Promise<Course | undefined> {
    const course = Array.from(this.courses.values()).find(c => c.slug === slug);
    return course ? this.applyCourseTranslations(course, language) : undefined;
  }

  async createCourse(courseData: InsertCourse): Promise<Course> {
    const course: Course = {
      id: this.currentCourseId++,
      title: courseData.title,
      description: courseData.description,
      shortDescription: courseData.shortDescription || '',
      slug: courseData.slug,
      categoryId: courseData.categoryId,
      instructorId: courseData.instructorId,
      level: courseData.level || 'beginner',
      duration: courseData.duration || 0,
      price: courseData.price || '0',
      currency: courseData.currency || 'USD',
      thumbnailUrl: courseData.thumbnailUrl || '',
      trailerUrl: courseData.trailerUrl || '',
      language: courseData.language || 'en',
      subtitles: courseData.subtitles || [],
      tags: courseData.tags || [],
      requirements: courseData.requirements || [],
      learningOutcomes: courseData.learningOutcomes || [],
      targetAudience: courseData.targetAudience || '',
      status: courseData.status || 'draft',
      isPublic: courseData.isPublic !== false,
      isFeatured: courseData.isFeatured || false,
      rating: courseData.rating || '0',
      ratingCount: 0,
      enrollmentCount: 0,
      completionRate: '0',
      createdAt: new Date(),
      updatedAt: new Date(),
      publishedAt: courseData.status === 'published' ? new Date() : null,
    };
    this.courses.set(course.id, course);
    return course;
  }

  async updateCourse(id: number, updateData: Partial<InsertCourse>): Promise<Course | undefined> {
    const course = this.courses.get(id);
    if (!course) return undefined;
    
    const updatedCourse = { ...course, ...updateData, updatedAt: new Date() };
    this.courses.set(id, updatedCourse);
    return updatedCourse;
  }

  async deleteCourse(id: number): Promise<boolean> {
    if (!this.courses.has(id)) return false;
    
    // Delete related course sections and lessons
    const courseSections = Array.from(this.courseSections.values()).filter(section => section.courseId === id);
    for (const section of courseSections) {
      // Delete lessons in this section
      const sectionLessons = Array.from(this.courseLessons.values()).filter(lesson => lesson.sectionId === section.id);
      for (const lesson of sectionLessons) {
        this.courseLessons.delete(lesson.id);
      }
      // Delete the section
      this.courseSections.delete(section.id);
    }
    
    // Delete enrollments for this course
    const enrollments = Array.from(this.enrollments.values()).filter(enrollment => enrollment.courseId === id);
    for (const enrollment of enrollments) {
      this.enrollments.delete(enrollment.id);
    }
    
    // Delete course reviews
    const reviews = Array.from(this.courseReviews.values()).filter(review => review.courseId === id);
    for (const review of reviews) {
      this.courseReviews.delete(review.id);
    }
    
    this.courses.delete(id);
    return true;
  }

  async duplicateCourse(id: number): Promise<Course | undefined> {
    const originalCourse = this.courses.get(id);
    if (!originalCourse) return undefined;
    
    // Create duplicate course with new ID
    const duplicatedCourse: Course = {
      ...originalCourse,
      id: this.currentCourseId++,
      title: `${originalCourse.title} (Copy)`,
      slug: `${originalCourse.slug}-copy-${Date.now()}`,
      status: 'draft',
      isPublic: false,
      createdAt: new Date(),
      updatedAt: new Date(),
      publishedAt: null,
      enrollmentCount: 0,
      rating: "0",
      ratingCount: 0,
      completionRate: "0"
    };
    
    this.courses.set(duplicatedCourse.id, duplicatedCourse);
    
    // Duplicate course sections
    const originalSections = Array.from(this.courseSections.values()).filter(section => section.courseId === id);
    for (const originalSection of originalSections) {
      const duplicatedSection: CourseSection = {
        ...originalSection,
        id: this.currentCourseSectionId++,
        courseId: duplicatedCourse.id,
        createdAt: new Date()
      };
      this.courseSections.set(duplicatedSection.id, duplicatedSection);
      
      // Duplicate lessons in this section
      const originalLessons = Array.from(this.courseLessons.values()).filter(lesson => lesson.sectionId === originalSection.id);
      for (const originalLesson of originalLessons) {
        const duplicatedLesson: CourseLesson = {
          ...originalLesson,
          id: this.currentCourseLessonId++,
          sectionId: duplicatedSection.id,
          createdAt: new Date(),
          updatedAt: new Date()
        };
        this.courseLessons.set(duplicatedLesson.id, duplicatedLesson);
      }
    }
    
    return duplicatedCourse;
  }

  async updateCourseSection(id: number, updates: Partial<CourseSection>): Promise<CourseSection | undefined> {
    const section = this.courseSections.get(id);
    if (!section) return undefined;
    
    const updatedSection = { ...section, ...updates };
    this.courseSections.set(id, updatedSection);
    return updatedSection;
  }

  async updateCourseLesson(id: number, updates: Partial<CourseLesson>): Promise<CourseLesson | undefined> {
    const lesson = this.courseLessons.get(id);
    if (!lesson) return undefined;
    
    const updatedLesson = { ...lesson, ...updates, updatedAt: new Date() };
    this.courseLessons.set(id, updatedLesson);
    return updatedLesson;
  }

  async deleteCourseSection(id: number): Promise<boolean> {
    if (!this.courseSections.has(id)) return false;
    
    // Delete all lessons in this section
    const lessons = Array.from(this.courseLessons.values()).filter(lesson => lesson.sectionId === id);
    for (const lesson of lessons) {
      this.courseLessons.delete(lesson.id);
    }
    
    this.courseSections.delete(id);
    return true;
  }

  async deleteCourseLesson(id: number): Promise<boolean> {
    if (!this.courseLessons.has(id)) return false;
    this.courseLessons.delete(id);
    return true;
  }

  async createCourseCategory(categoryData: InsertCourseCategory): Promise<CourseCategory> {
    const category: CourseCategory = {
      id: this.currentCourseCategoryId++,
      name: categoryData.name,
      description: categoryData.description || '',
      slug: categoryData.slug,
      parentId: categoryData.parentId || null,
      sortOrder: categoryData.sortOrder || 0,
      isActive: categoryData.isActive !== false,
      createdAt: new Date(),
    };
    this.courseCategories.set(category.id, category);
    return category;
  }

  async createCourseSection(sectionData: InsertCourseSection): Promise<CourseSection> {
    const section: CourseSection = {
      id: this.currentCourseSectionId++,
      courseId: sectionData.courseId,
      title: sectionData.title,
      description: sectionData.description || '',
      sortOrder: sectionData.sortOrder || 0,
      isPublic: sectionData.isPublic !== false,
      createdAt: new Date(),
    };
    this.courseSections.set(section.id, section);
    return section;
  }

  async getSectionLessons(sectionId: number, language: string = 'en'): Promise<CourseLesson[]> {
    return this.getCourseLessons(sectionId, language);
  }

  async getLesson(id: number, language: string = 'en'): Promise<CourseLesson | undefined> {
    const lesson = this.courseLessons.get(id);
    if (!lesson) return undefined;

    const translation = this.lessonTranslations.get(`${lesson.id}-${language}`);
    if (translation) {
      return {
        ...lesson,
        title: translation.title,
        description: translation.description,
        content: translation.content,
        quiz: translation.quiz,
      };
    }
    return lesson;
  }

  async createCourseLesson(lessonData: InsertCourseLesson): Promise<CourseLesson> {
    const lesson: CourseLesson = {
      id: this.currentCourseLessonId++,
      sectionId: lessonData.sectionId,
      title: lessonData.title,
      description: lessonData.description || '',
      content: lessonData.content || '',
      videoUrl: lessonData.videoUrl || '',
      duration: lessonData.duration || 0,
      sortOrder: lessonData.sortOrder || 0,
      isPublic: lessonData.isPublic !== false,
      isFree: lessonData.isFree || false,
      attachments: lessonData.attachments || [],
      quiz: lessonData.quiz || null,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.courseLessons.set(lesson.id, lesson);
    return lesson;
  }

  async getCourseEnrollments(courseId: number): Promise<Enrollment[]> {
    return Array.from(this.enrollments.values())
      .filter(enrollment => enrollment.courseId === courseId);
  }

  async getEnrollment(userId: number, courseId: number): Promise<Enrollment | undefined> {
    return Array.from(this.enrollments.values())
      .find(enrollment => enrollment.userId === userId && enrollment.courseId === courseId);
  }

  async getUserLessonProgress(userId: number, lessonId: number): Promise<LessonProgress | undefined> {
    return Array.from(this.lessonProgress.values())
      .find(progress => progress.enrollmentId === userId && progress.lessonId === lessonId);
  }

  async createLessonProgress(progressData: InsertLessonProgress): Promise<LessonProgress> {
    const progress: LessonProgress = {
      id: this.currentLessonProgressId++,
      enrollmentId: progressData.enrollmentId,
      lessonId: progressData.lessonId,
      status: progressData.status || 'not_started',
      lastAccessedAt: new Date(),
      completedAt: progressData.completedAt || null,
      watchTime: progressData.watchTime || 0,
    };
    this.lessonProgress.set(progress.id, progress);
    return progress;
  }

  async updateLessonProgress(id: number, updateData: Partial<InsertLessonProgress>): Promise<LessonProgress | undefined> {
    const progress = this.lessonProgress.get(id);
    if (!progress) return undefined;
    
    const updatedProgress = { ...progress, ...updateData, updatedAt: new Date() };
    this.lessonProgress.set(id, updatedProgress);
    return updatedProgress;
  }

  async getCourseReviews(courseId: number): Promise<CourseReview[]> {
    return Array.from(this.courseReviews.values())
      .filter(review => review.courseId === courseId)
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }

  async createCourseReview(reviewData: InsertCourseReview): Promise<CourseReview> {
    const review: CourseReview = {
      id: this.currentCourseReviewId++,
      courseId: reviewData.courseId,
      userId: reviewData.userId,
      rating: reviewData.rating,
      review: reviewData.review || null,
      title: reviewData.title || null,
      isPublic: reviewData.isPublic !== false,
      isVerified: reviewData.isVerified || false,
      helpfulCount: reviewData.helpfulCount || 0,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.courseReviews.set(review.id, review);
    return review;
  }

  async getCourseAddons(courseId: number): Promise<CourseAddon[]> {
    return Array.from(this.courseAddons.values())
      .filter(addon => addon.courseId === courseId)
      .filter(addon => addon.isActive);
  }

  async createCourseAddon(addonData: InsertCourseAddon): Promise<CourseAddon> {
    const addon: CourseAddon = {
      id: this.currentCourseAddonId++,
      courseId: addonData.courseId,
      name: addonData.name,
      description: addonData.description || '',
      type: addonData.type,
      price: addonData.price,
      currency: addonData.currency || 'USD',
      downloadUrl: addonData.downloadUrl || null,
      accessDuration: addonData.accessDuration || null,
      sortOrder: addonData.sortOrder || 0,
      isActive: addonData.isActive !== false,
      createdAt: new Date(),
    };
    this.courseAddons.set(addon.id, addon);
    return addon;
  }

  async getUserAddonPurchases(userId: number): Promise<UserAddonPurchase[]> {
    return Array.from(this.userAddonPurchases.values())
      .filter(purchase => purchase.userId === userId);
  }

  async createUserAddonPurchase(purchaseData: InsertUserAddonPurchase): Promise<UserAddonPurchase> {
    const purchase: UserAddonPurchase = {
      id: this.currentUserAddonPurchaseId++,
      userId: purchaseData.userId,
      addonId: purchaseData.addonId,
      status: purchaseData.status || 'active',
      purchaseDate: new Date(),
      expiryDate: purchaseData.expiryDate || null,
      downloadCount: purchaseData.downloadCount || 0,
      maxDownloads: purchaseData.maxDownloads || null,
    };
    this.userAddonPurchases.set(purchase.id, purchase);
    return purchase;
  }

  private applyCourseTranslations(course: Course, language: string): Course {
    const translation = this.courseTranslations.get(`${course.id}-${language}`);
    if (translation) {
      return {
        ...course,
        title: translation.title,
        description: translation.description,
        shortDescription: translation.shortDescription,
        learningOutcomes: translation.learningOutcomes,
        requirements: translation.requirements,
        targetAudience: translation.targetAudience,
      };
    }
    return course;
  }

  // Resource Methods
  async getResourceCategories(): Promise<ResourceCategory[]> {
    return Array.from(this.resourceCategories.values())
      .filter(category => category.isActive)
      .sort((a, b) => a.sortOrder - b.sortOrder);
  }

  async createResourceCategory(categoryData: InsertResourceCategory): Promise<ResourceCategory> {
    const category: ResourceCategory = {
      id: this.currentResourceCategoryId++,
      name: categoryData.name,
      slug: categoryData.slug,
      description: categoryData.description || null,
      icon: categoryData.icon || null,
      sortOrder: categoryData.sortOrder || 0,
      isActive: categoryData.isActive !== undefined ? categoryData.isActive : true,
      createdAt: new Date(),
    };
    this.resourceCategories.set(category.id, category);
    return category;
  }

  async getResources(filters?: any): Promise<Resource[]> {
    let resources = Array.from(this.resourcesStorage.values())
      .filter(resource => resource.isPublished)
      .sort((a, b) => b.publishedDate.getTime() - a.publishedDate.getTime());

    if (filters?.category) {
      resources = resources.filter(resource => resource.categoryId === filters.category);
    }
    if (filters?.type) {
      resources = resources.filter(resource => resource.type === filters.type);
    }
    if (filters?.featured) {
      resources = resources.filter(resource => resource.featured);
    }
    if (filters?.search) {
      const searchTerm = filters.search.toLowerCase();
      resources = resources.filter(resource => 
        resource.title.toLowerCase().includes(searchTerm) ||
        resource.description.toLowerCase().includes(searchTerm) ||
        (resource.tags && Array.isArray(resource.tags) && resource.tags.some((tag: string) => tag.toLowerCase().includes(searchTerm)))
      );
    }

    return resources;
  }

  async getResource(id: number): Promise<Resource | undefined> {
    return this.resourcesStorage.get(id);
  }

  async getResourceBySlug(slug: string): Promise<Resource | undefined> {
    return Array.from(this.resourcesStorage.values())
      .find(resource => resource.slug === slug && resource.isPublished);
  }

  async createResource(resourceData: InsertResource): Promise<Resource> {
    const resource: Resource = {
      id: this.currentResourceId++,
      title: resourceData.title,
      slug: resourceData.slug,
      description: resourceData.description,
      content: resourceData.content || null,
      type: resourceData.type,
      categoryId: resourceData.categoryId || null,
      authorId: resourceData.authorId,
      authorName: resourceData.authorName,
      publishedDate: resourceData.publishedDate || new Date(),
      readTime: resourceData.readTime || null,
      rating: resourceData.rating || "0.00",
      ratingCount: resourceData.ratingCount || 0,
      downloadCount: resourceData.downloadCount || 0,
      viewCount: resourceData.viewCount || 0,
      tags: resourceData.tags || null,
      featured: resourceData.featured || false,
      isPublished: resourceData.isPublished !== undefined ? resourceData.isPublished : false,
      requiresAuth: resourceData.requiresAuth || false,
      downloadUrl: resourceData.downloadUrl || null,
      videoUrl: resourceData.videoUrl || null,
      podcastUrl: resourceData.podcastUrl || null,
      externalUrl: resourceData.externalUrl || null,
      thumbnailUrl: resourceData.thumbnailUrl || null,
      seoTitle: resourceData.seoTitle || null,
      seoDescription: resourceData.seoDescription || null,
      seoKeywords: resourceData.seoKeywords || null,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.resourcesStorage.set(resource.id, resource);
    return resource;
  }

  async updateResource(id: number, resourceData: Partial<InsertResource>): Promise<Resource | undefined> {
    const resource = this.resourcesStorage.get(id);
    if (!resource) return undefined;
    
    const updatedResource = { ...resource, ...resourceData, updatedAt: new Date() };
    this.resourcesStorage.set(id, updatedResource);
    return updatedResource;
  }

  async deleteResource(id: number): Promise<boolean> {
    return this.resourcesStorage.delete(id);
  }

  async getFeaturedResources(): Promise<Resource[]> {
    return Array.from(this.resourcesStorage.values())
      .filter(resource => resource.featured && resource.isPublished)
      .sort((a, b) => b.publishedDate.getTime() - a.publishedDate.getTime())
      .slice(0, 6);
  }

  async getResourcesByCategory(categoryId: number): Promise<Resource[]> {
    return Array.from(this.resourcesStorage.values())
      .filter(resource => resource.categoryId === categoryId && resource.isPublished)
      .sort((a, b) => b.publishedDate.getTime() - a.publishedDate.getTime());
  }

  async getResourcesByType(type: string): Promise<Resource[]> {
    return Array.from(this.resourcesStorage.values())
      .filter(resource => resource.type === type && resource.isPublished)
      .sort((a, b) => b.publishedDate.getTime() - a.publishedDate.getTime());
  }

  async createResourceRating(ratingData: InsertResourceRating): Promise<ResourceRating> {
    const rating: ResourceRating = {
      id: this.currentResourceRatingId++,
      resourceId: ratingData.resourceId,
      userId: ratingData.userId,
      rating: ratingData.rating,
      review: ratingData.review || null,
      isPublic: ratingData.isPublic !== undefined ? ratingData.isPublic : true,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.resourceRatings.set(rating.id, rating);

    // Update resource average rating
    await this.updateResourceRating(ratingData.resourceId);
    
    return rating;
  }

  async getResourceRatings(resourceId: number): Promise<ResourceRating[]> {
    return Array.from(this.resourceRatings.values())
      .filter(rating => rating.resourceId === resourceId && rating.isPublic)
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }

  async createResourceView(viewData: InsertResourceView): Promise<ResourceView> {
    const view: ResourceView = {
      id: this.currentResourceViewId++,
      resourceId: viewData.resourceId,
      userId: viewData.userId || null,
      ipAddress: viewData.ipAddress || null,
      userAgent: viewData.userAgent || null,
      viewedAt: new Date(),
    };
    this.resourceViews.set(view.id, view);
    
    // Update view count
    await this.updateResourceStats(viewData.resourceId, 'view');
    
    return view;
  }

  async createResourceDownload(downloadData: InsertResourceDownload): Promise<ResourceDownload> {
    const download: ResourceDownload = {
      id: this.currentResourceDownloadId++,
      resourceId: downloadData.resourceId,
      userId: downloadData.userId || null,
      ipAddress: downloadData.ipAddress || null,
      userAgent: downloadData.userAgent || null,
      downloadedAt: new Date(),
    };
    this.resourceDownloads.set(download.id, download);
    
    // Update download count
    await this.updateResourceStats(downloadData.resourceId, 'download');
    
    return download;
  }

  async updateResourceStats(resourceId: number, type: 'view' | 'download'): Promise<void> {
    const resource = this.resourcesStorage.get(resourceId);
    if (!resource) return;

    if (type === 'view') {
      resource.viewCount += 1;
    } else if (type === 'download') {
      resource.downloadCount += 1;
    }

    resource.updatedAt = new Date();
    this.resourcesStorage.set(resourceId, resource);
  }

  private async updateResourceRating(resourceId: number): Promise<void> {
    const resource = this.resourcesStorage.get(resourceId);
    if (!resource) return;

    const ratings = Array.from(this.resourceRatings.values())
      .filter(rating => rating.resourceId === resourceId);

    if (ratings.length === 0) {
      resource.rating = "0.00";
      resource.ratingCount = 0;
    } else {
      const averageRating = ratings.reduce((sum, rating) => sum + rating.rating, 0) / ratings.length;
      resource.rating = averageRating.toFixed(2);
      resource.ratingCount = ratings.length;
    }

    resource.updatedAt = new Date();
    this.resourcesStorage.set(resourceId, resource);
  }

  // Missing methods from IStorage interface
  async getLessonProgress(userId: number, lessonId: number): Promise<LessonProgress | undefined> {
    return Array.from(this.lessonProgress.values())
      .find(progress => progress.lessonId === lessonId);
  }

  async getCourseSection(id: number): Promise<CourseSection | undefined> {
    return this.courseSections.get(id);
  }


}

export class DatabaseStorage implements IStorage {
  private memStorage = new MemStorage();
  
  // Users - delegate to database
  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user || undefined;
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.email, email));
    return user || undefined;
  }

  async getAllUsers(): Promise<User[]> {
    return await db.select().from(users);
  }

  // OPTIMIZED QUERY METHODS FOR PERFORMANCE
  async getUsersWithFilters(filters: {
    search?: string;
    role?: string;
    membershipType?: string;
    isActive?: boolean;
    limit?: number;
    offset?: number;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
  }): Promise<{ users: User[]; total: number }> {
    const conditions = [];
    
    // Build WHERE conditions
    if (filters.search) {
      const searchTerm = `%${filters.search.toLowerCase()}%`;
      conditions.push(
        or(
          sql`LOWER(${users.name}) LIKE ${searchTerm}`,
          sql`LOWER(${users.email}) LIKE ${searchTerm}`
        )
      );
    }
    
    if (filters.role && filters.role !== 'all') {
      conditions.push(eq(users.role, filters.role));
    }
    
    if (filters.membershipType && filters.membershipType !== 'all') {
      conditions.push(eq(users.membershipType, filters.membershipType));
    }
    
    if (filters.isActive !== undefined) {
      conditions.push(eq(users.isActive, filters.isActive));
    }

    // Build base query
    let query = db.select().from(users);
    
    if (conditions.length > 0) {
      query = query.where(and(...conditions));
    }

    // Add sorting
    if (filters.sortBy) {
      const column = (users as any)[filters.sortBy];
      if (column) {
        query = query.orderBy(filters.sortOrder === 'desc' ? desc(column) : column);
      }
    }

    // Add pagination
    if (filters.limit) {
      query = query.limit(filters.limit);
      if (filters.offset) {
        query = query.offset(filters.offset);
      }
    }

    // Get total count for pagination
    let countQuery = db.select({ count: sql<number>`count(*)` }).from(users);
    if (conditions.length > 0) {
      countQuery = countQuery.where(and(...conditions));
    }

    const [usersResult, countResult] = await Promise.all([
      query,
      countQuery
    ]);

    return {
      users: usersResult,
      total: countResult[0]?.count || 0
    };
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(insertUser)
      .returning();
    return user;
  }

  async updateUser(id: number, user: Partial<InsertUser>): Promise<User | undefined> {
    const [updatedUser] = await db
      .update(users)
      .set({ ...user, updatedAt: new Date() })
      .where(eq(users.id, id))
      .returning();
    return updatedUser || undefined;
  }

  async updateUserLastLogin(id: number): Promise<void> {
    await db
      .update(users)
      .set({ lastLoginAt: new Date() })
      .where(eq(users.id, id));
  }

  async deleteUser(id: number): Promise<boolean> {
    const result = await db.delete(users).where(eq(users.id, id));
    return (result.rowCount || 0) > 0;
  }

  // Courses
  async getCourses(filters?: any, language: string = 'en'): Promise<Course[]> {
    try {
      const coursesQuery = db
        .select()
        .from(courses)
        .where(eq(courses.status, "published"));

      const result = await coursesQuery;
      
      // Apply translations if available and language is not default
      if (language !== 'en') {
        const translatedCourses = await Promise.all(
          result.map(async (course) => {
            const translation = await db
              .select()
              .from(courseTranslations)
              .where(
                and(
                  eq(courseTranslations.courseId, course.id),
                  eq(courseTranslations.language, language)
                )
              )
              .limit(1);

            if (translation.length > 0) {
              const t = translation[0];
              return {
                ...course,
                title: t.title,
                description: t.description,
                shortDescription: t.shortDescription,
                learningOutcomes: t.learningOutcomes,
                requirements: t.requirements,
                targetAudience: t.targetAudience,
              };
            }
            return course;
          })
        );
        return translatedCourses;
      }
      
      return result;
    } catch (error) {
      console.error('Error fetching courses:', error);
      return [];
    }
  }

  async getCourse(id: number, language: string = 'en'): Promise<Course | undefined> {
    try {
      const courseResult = await db
        .select()
        .from(courses)
        .where(eq(courses.id, id))
        .limit(1);

      if (courseResult.length === 0) return undefined;
      
      let course = courseResult[0];

      // Get course translation if available and language is not default
      if (language !== 'en') {
        const translation = await db
          .select()
          .from(courseTranslations)
          .where(
            and(
              eq(courseTranslations.courseId, course.id),
              eq(courseTranslations.language, language)
            )
          )
          .limit(1);

        if (translation.length > 0) {
          const t = translation[0];
          course = {
            ...course,
            title: t.title,
            description: t.description,
            shortDescription: t.shortDescription,
            learningOutcomes: t.learningOutcomes,
            requirements: t.requirements,
            targetAudience: t.targetAudience,
          };
        }
      }
      
      // Get sections for this course
      const sections = await this.getCourseSections(id, language);
      
      // Get lessons for each section
      const sectionsWithLessons = await Promise.all(
        sections.map(async (section) => {
          const lessons = await this.getCourseLessons(section.id, language);
          return {
            ...section,
            lessons
          };
        })
      );

      return {
        ...course,
        sections: sectionsWithLessons
      } as any;
    } catch (error) {
      console.error('Error fetching course:', error);
      return undefined;
    }
  }

  async getCourseBySlug(slug: string, language?: string): Promise<Course | undefined> {
    const [course] = await db.select().from(courses).where(eq(courses.slug, slug));
    return course || undefined;
  }

  async createCourse(course: InsertCourse): Promise<Course> {
    const [newCourse] = await db
      .insert(courses)
      .values(course)
      .returning();
    return newCourse;
  }

  async updateCourse(id: number, course: Partial<InsertCourse>): Promise<Course | undefined> {
    const [updatedCourse] = await db
      .update(courses)
      .set({ ...course, updatedAt: new Date() })
      .where(eq(courses.id, id))
      .returning();
    return updatedCourse || undefined;
  }

  async deleteCourse(id: number): Promise<boolean> {
    const result = await db.delete(courses).where(eq(courses.id, id));
    return (result.rowCount || 0) > 0;
  }

  async duplicateCourse(id: number): Promise<Course | undefined> {
    const [originalCourse] = await db.select().from(courses).where(eq(courses.id, id));
    if (!originalCourse) return undefined;

    const [duplicatedCourse] = await db
      .insert(courses)
      .values({
        ...originalCourse,
        id: undefined, // Let DB assign new ID
        title: `${originalCourse.title} (Copy)`,
        slug: `${originalCourse.slug}-copy`,
        status: 'draft',
        createdAt: new Date(),
        updatedAt: new Date()
      })
      .returning();
    return duplicatedCourse;
  }

  // Stub methods for other functionality - using MemStorage for non-critical features

  async createPasswordResetToken(userId: number, token: string, expiresAt: Date): Promise<void> {
    await db.insert(passwordResetTokens).values({ userId, token, expiresAt });
  }

  async getPasswordResetToken(token: string): Promise<{ userId: number; expiresAt: Date } | undefined> {
    const [resetToken] = await db.select().from(passwordResetTokens).where(eq(passwordResetTokens.token, token));
    return resetToken ? { userId: resetToken.userId, expiresAt: resetToken.expiresAt } : undefined;
  }

  async usePasswordResetToken(token: string): Promise<boolean> {
    const result = await db.delete(passwordResetTokens).where(eq(passwordResetTokens.token, token));
    return (result.rowCount || 0) > 0;
  }

  async createEmailVerificationToken(userId: number, token: string, expiresAt: Date): Promise<void> {
    await db.insert(emailVerificationTokens).values({ userId, token, expiresAt });
  }

  async getEmailVerificationToken(token: string): Promise<{ userId: number; expiresAt: Date } | undefined> {
    const [verificationToken] = await db.select().from(emailVerificationTokens).where(eq(emailVerificationTokens.token, token));
    return verificationToken ? { userId: verificationToken.userId, expiresAt: verificationToken.expiresAt } : undefined;
  }

  async useEmailVerificationToken(token: string): Promise<boolean> {
    const result = await db.delete(emailVerificationTokens).where(eq(emailVerificationTokens.token, token));
    return (result.rowCount || 0) > 0;
  }

  async verifyUserEmail(userId: number): Promise<void> {
    await db.update(users).set({ emailVerified: true }).where(eq(users.id, userId));
  }

  async createUserSession(userId: number, sessionToken: string, expiresAt: Date, userAgent?: string, ipAddress?: string): Promise<void> {
    await db.insert(userSessions).values({ userId, sessionToken, expiresAt, userAgent, ipAddress });
  }

  async getUserSession(sessionToken: string): Promise<{ userId: number; expiresAt: Date } | undefined> {
    const [session] = await db.select().from(userSessions).where(eq(userSessions.sessionToken, sessionToken));
    return session ? { userId: session.userId, expiresAt: session.expiresAt } : undefined;
  }

  async deleteUserSession(sessionToken: string): Promise<boolean> {
    const result = await db.delete(userSessions).where(eq(userSessions.sessionToken, sessionToken));
    return (result.rowCount || 0) > 0;
  }

  async deleteUserSessions(userId: number): Promise<void> {
    await db.delete(userSessions).where(eq(userSessions.userId, userId));
  }

  // Membership Management - Database Implementation
  async getMembershipPlans(): Promise<MembershipPlan[]> {
    return await db.select().from(membershipPlans).where(eq(membershipPlans.isActive, true)).orderBy(membershipPlans.id);
  }

  async getMembershipPlan(id: number): Promise<MembershipPlan | undefined> {
    const [plan] = await db.select().from(membershipPlans).where(eq(membershipPlans.id, id));
    return plan || undefined;
  }

  async createMembershipPlan(plan: InsertMembershipPlan): Promise<MembershipPlan> {
    const [newPlan] = await db.insert(membershipPlans).values(plan).returning();
    return newPlan;
  }

  async updateMembershipPlan(id: number, plan: Partial<InsertMembershipPlan>): Promise<MembershipPlan | undefined> {
    const [updatedPlan] = await db.update(membershipPlans).set({ ...plan, updatedAt: new Date() }).where(eq(membershipPlans.id, id)).returning();
    return updatedPlan || undefined;
  }

  async getUserMembership(userId: number): Promise<UserMembership | undefined> {
    const [membership] = await db.select().from(userMemberships).where(eq(userMemberships.userId, userId));
    return membership || undefined;
  }

  async createUserMembership(membership: InsertUserMembership): Promise<UserMembership> {
    const [newMembership] = await db.insert(userMemberships).values(membership).returning();
    return newMembership;
  }

  async updateUserMembership(id: number, membership: Partial<InsertUserMembership>): Promise<UserMembership | undefined> {
    const [updatedMembership] = await db.update(userMemberships).set({ ...membership, updatedAt: new Date() }).where(eq(userMemberships.id, id)).returning();
    return updatedMembership || undefined;
  }

  async getUserMemberships(userId: number): Promise<UserMembership[]> {
    return await db.select().from(userMemberships).where(eq(userMemberships.userId, userId));
  }
  async getUserEnrollments(userId: number): Promise<Enrollment[]> {
    return await db.select().from(enrollments).where(eq(enrollments.userId, userId));
  }
  async createEnrollment(enrollment: InsertEnrollment): Promise<Enrollment> {
    const [newEnrollment] = await db.insert(enrollments).values(enrollment).returning();
    return newEnrollment;
  }
  async updateEnrollment(id: number, enrollment: Partial<InsertEnrollment>): Promise<Enrollment | undefined> {
    const [updatedEnrollment] = await db.update(enrollments).set(enrollment).where(eq(enrollments.id, id)).returning();
    return updatedEnrollment || undefined;
  }
  async deleteCourseSection(id: number): Promise<boolean> {
    const result = await db.delete(courseSections).where(eq(courseSections.id, id));
    return (result.rowCount || 0) > 0;
  }

  async deleteCourseLesson(id: number): Promise<boolean> {
    const result = await db.delete(courseLessons).where(eq(courseLessons.id, id));
    return (result.rowCount || 0) > 0;
  }
  async getCourseCategories(): Promise<CourseCategory[]> {
    return await db.select().from(courseCategories).where(eq(courseCategories.isActive, true));
  }

  async createCourseCategory(category: InsertCourseCategory): Promise<CourseCategory> {
    const [newCategory] = await db
      .insert(courseCategories)
      .values(category)
      .returning();
    return newCategory;
  }
  // Course Sections - Database Implementation
  async getCourseSections(courseId: number, language?: string): Promise<CourseSection[]> {
    return await db.select().from(courseSections)
      .where(eq(courseSections.courseId, courseId))
      .orderBy(courseSections.sortOrder);
  }

  async createCourseSection(section: InsertCourseSection): Promise<CourseSection> {
    const [newSection] = await db
      .insert(courseSections)
      .values(section)
      .returning();
    return newSection;
  }

  async updateCourseSection(id: number, section: Partial<InsertCourseSection>): Promise<CourseSection | undefined> {
    const [updatedSection] = await db
      .update(courseSections)
      .set(section)
      .where(eq(courseSections.id, id))
      .returning();
    return updatedSection || undefined;
  }

  // Course Lessons - Database Implementation
  async getCourseLessons(sectionId: number, language?: string): Promise<CourseLesson[]> {
    return await db.select().from(courseLessons)
      .where(eq(courseLessons.sectionId, sectionId))
      .orderBy(courseLessons.sortOrder);
  }

  async getCourseLesson(id: number, language?: string): Promise<CourseLesson | undefined> {
    const [lesson] = await db.select().from(courseLessons).where(eq(courseLessons.id, id));
    return lesson || undefined;
  }

  async createCourseLesson(lesson: InsertCourseLesson): Promise<CourseLesson> {
    const [newLesson] = await db
      .insert(courseLessons)
      .values(lesson)
      .returning();
    return newLesson;
  }

  async updateCourseLesson(id: number, lesson: Partial<InsertCourseLesson>): Promise<CourseLesson | undefined> {
    const [updatedLesson] = await db
      .update(courseLessons)
      .set({ ...lesson, updatedAt: new Date() })
      .where(eq(courseLessons.id, id))
      .returning();
    return updatedLesson || undefined;
  }

  async getSectionLessons(sectionId: number, language?: string): Promise<CourseLesson[]> {
    return this.getCourseLessons(sectionId, language);
  }

  async getLesson(id: number, language?: string): Promise<CourseLesson | undefined> {
    return this.getCourseLesson(id, language);
  }
  // Progress Tracking - Database Implementation
  async getLessonProgress(userId: number, lessonId: number): Promise<LessonProgress | undefined> {
    const [progress] = await db.select().from(lessonProgress).where(and(eq(lessonProgress.lessonId, lessonId)));
    return progress || undefined;
  }

  async createLessonProgress(progress: InsertLessonProgress): Promise<LessonProgress> {
    const [newProgress] = await db.insert(lessonProgress).values(progress).returning();
    return newProgress;
  }

  async getCourseSection(id: number): Promise<CourseSection | undefined> {
    const [section] = await db.select().from(courseSections).where(eq(courseSections.id, id));
    return section || undefined;
  }

  async updateLessonProgress(id: number, progress: Partial<InsertLessonProgress>): Promise<LessonProgress | undefined> {
    const [updatedProgress] = await db.update(lessonProgress).set(progress).where(eq(lessonProgress.id, id)).returning();
    return updatedProgress || undefined;
  }

  async getCourseProgress(userId: number, courseId: number): Promise<{ completed: number; total: number; percentage: number; }> {
    // Get all lessons in the course through sections
    const sections = await db.select().from(courseSections).where(eq(courseSections.courseId, courseId));
    const sectionIds = sections.map(s => s.id);
    
    if (sectionIds.length === 0) {
      return { completed: 0, total: 0, percentage: 0 };
    }

    const lessons = await db.select().from(courseLessons).where(sql`section_id IN (${sectionIds.join(',')})`);
    const totalLessons = lessons.length;

    if (totalLessons === 0) {
      return { completed: 0, total: 0, percentage: 0 };
    }

    const lessonIds = lessons.map(l => l.id);
    const completedProgress = await db.select().from(lessonProgress).where(
      and(
        sql`lesson_id IN (${lessonIds.join(',')})`,
        eq(lessonProgress.status, 'completed')
      )
    );

    const completed = completedProgress.length;
    const percentage = Math.round((completed / totalLessons) * 100);

    return { completed, total: totalLessons, percentage };
  }

  // Course Reviews - Database Implementation
  async getCourseReviews(courseId: number): Promise<CourseReview[]> {
    return await db.select().from(courseReviews).where(eq(courseReviews.courseId, courseId)).orderBy(desc(courseReviews.createdAt));
  }

  async createCourseReview(review: InsertCourseReview): Promise<CourseReview> {
    const [newReview] = await db.insert(courseReviews).values(review).returning();
    return newReview;
  }

  async updateCourseReview(id: number, review: Partial<InsertCourseReview>): Promise<CourseReview | undefined> {
    const [updatedReview] = await db.update(courseReviews).set({ ...review, updatedAt: new Date() }).where(eq(courseReviews.id, id)).returning();
    return updatedReview || undefined;
  }

  async deleteCourseReview(id: number): Promise<boolean> {
    const result = await db.delete(courseReviews).where(eq(courseReviews.id, id));
    return (result.rowCount || 0) > 0;
  }

  async getUserCourseReview(userId: number, courseId: number): Promise<CourseReview | undefined> {
    const [review] = await db.select().from(courseReviews).where(and(eq(courseReviews.userId, userId), eq(courseReviews.courseId, courseId)));
    return review || undefined;
  }

  // Course Addons - Database Implementation
  async getCourseAddons(courseId: number): Promise<CourseAddon[]> {
    return await db.select().from(courseAddons).where(eq(courseAddons.courseId, courseId)).orderBy(courseAddons.sortOrder);
  }

  async createCourseAddon(addon: InsertCourseAddon): Promise<CourseAddon> {
    const [newAddon] = await db.insert(courseAddons).values(addon).returning();
    return newAddon;
  }

  async updateCourseAddon(id: number, addon: Partial<InsertCourseAddon>): Promise<CourseAddon | undefined> {
    const [updatedAddon] = await db.update(courseAddons).set(addon).where(eq(courseAddons.id, id)).returning();
    return updatedAddon || undefined;
  }

  async deleteCourseAddon(id: number): Promise<boolean> {
    const result = await db.delete(courseAddons).where(eq(courseAddons.id, id));
    return (result.rowCount || 0) > 0;
  }

  async getUserAddonPurchases(userId: number): Promise<UserAddonPurchase[]> {
    return await db.select().from(userAddonPurchases).where(eq(userAddonPurchases.userId, userId)).orderBy(desc(userAddonPurchases.purchaseDate));
  }

  async createUserAddonPurchase(purchase: InsertUserAddonPurchase): Promise<UserAddonPurchase> {
    const [newPurchase] = await db.insert(userAddonPurchases).values(purchase).returning();
    return newPurchase;
  }
  // Resource methods - Database implementation  
  async getResourceCategories(): Promise<ResourceCategory[]> {
    return await db.select().from(resourceCategories).where(eq(resourceCategories.isActive, true)).orderBy(resourceCategories.sortOrder);
  }

  async getResources(categoryId?: number, filters?: any): Promise<Resource[]> {
    let query = db.select().from(resources);
    if (categoryId) {
      query = query.where(eq(resources.categoryId, categoryId));
    }
    return await query.orderBy(desc(resources.createdAt));
  }

  async getResource(id: number): Promise<Resource | undefined> {
    const [resource] = await db.select().from(resources).where(eq(resources.id, id));
    return resource || undefined;
  }

  async createResource(resource: InsertResource): Promise<Resource> {
    const [newResource] = await db.insert(resources).values(resource).returning();
    return newResource;
  }

  async updateResource(id: number, resource: Partial<InsertResource>): Promise<Resource | undefined> {
    const [updatedResource] = await db.update(resources).set({ ...resource, updatedAt: new Date() }).where(eq(resources.id, id)).returning();
    return updatedResource || undefined;
  }

  async deleteResource(id: number): Promise<boolean> {
    const result = await db.delete(resources).where(eq(resources.id, id));
    return (result.rowCount || 0) > 0;
  }

  async getResourceRatings(resourceId: number): Promise<ResourceRating[]> {
    return await db.select().from(resourceRatings).where(eq(resourceRatings.resourceId, resourceId)).orderBy(desc(resourceRatings.createdAt));
  }

  async createResourceRating(rating: InsertResourceRating): Promise<ResourceRating> {
    const [newRating] = await db.insert(resourceRatings).values(rating).returning();
    return newRating;
  }

  async updateResourceRating(id: number, rating: Partial<InsertResourceRating>): Promise<ResourceRating | undefined> {
    const [updatedRating] = await db.update(resourceRatings).set({ ...rating, updatedAt: new Date() }).where(eq(resourceRatings.id, id)).returning();
    return updatedRating || undefined;
  }

  async deleteResourceRating(id: number): Promise<boolean> {
    const result = await db.delete(resourceRatings).where(eq(resourceRatings.id, id));
    return (result.rowCount || 0) > 0;
  }

  async getUserResourceRating(userId: number, resourceId: number): Promise<ResourceRating | undefined> {
    const [rating] = await db.select().from(resourceRatings).where(and(eq(resourceRatings.userId, userId), eq(resourceRatings.resourceId, resourceId)));
    return rating || undefined;
  }

  async recordResourceDownload(userId: number, resourceId: number): Promise<ResourceDownload> {
    const [download] = await db.insert(resourceDownloads).values({ userId, resourceId }).returning();
    return download;
  }

  async getResourceDownloadStats(resourceId: number): Promise<{ totalDownloads: number; uniqueUsers: number; }> {
    const [totalDownloads] = await db.select({ count: sql<number>`count(*)` }).from(resourceDownloads).where(eq(resourceDownloads.resourceId, resourceId));
    const [uniqueUsers] = await db.select({ count: sql<number>`count(DISTINCT user_id)` }).from(resourceDownloads).where(eq(resourceDownloads.resourceId, resourceId));
    return { totalDownloads: Number(totalDownloads?.count) || 0, uniqueUsers: Number(uniqueUsers?.count) || 0 };
  }

  async recordResourceView(userId: number | null, resourceId: number): Promise<ResourceView> {
    const [view] = await db.insert(resourceViews).values({ userId, resourceId }).returning();
    return view;
  }

  async getResourceViewStats(resourceId: number): Promise<{ totalViews: number; uniqueUsers: number; }> {
    const [totalViews] = await db.select({ count: sql<number>`count(*)` }).from(resourceViews).where(eq(resourceViews.resourceId, resourceId));
    const [uniqueUsers] = await db.select({ count: sql<number>`count(DISTINCT user_id)` }).from(resourceViews).where(eq(resourceViews.resourceId, resourceId));
    return { totalViews: Number(totalViews?.count) || 0, uniqueUsers: Number(uniqueUsers?.count) || 0 };
  }
  // Forum methods - Database implementation
  async getForumCategories(): Promise<ForumCategory[]> {
    return await db.select().from(forumCategories).where(eq(forumCategories.isActive, true)).orderBy(forumCategories.sortOrder);
  }

  async getForumTopics(categoryId?: number, filters?: any): Promise<ForumTopic[]> {
    let query = db.select().from(forumTopics);
    if (categoryId) {
      query = query.where(eq(forumTopics.categoryId, categoryId));
    }
    return await query.orderBy(desc(forumTopics.updatedAt));
  }

  async getForumTopic(id: number): Promise<ForumTopic | undefined> {
    const [topic] = await db.select().from(forumTopics).where(eq(forumTopics.id, id));
    return topic || undefined;
  }

  async createForumTopic(topic: InsertForumTopic): Promise<ForumTopic> {
    const [newTopic] = await db.insert(forumTopics).values(topic).returning();
    return newTopic;
  }

  async updateForumTopic(id: number, topic: Partial<InsertForumTopic>): Promise<ForumTopic | undefined> {
    const [updatedTopic] = await db.update(forumTopics).set({ ...topic, updatedAt: new Date() }).where(eq(forumTopics.id, id)).returning();
    return updatedTopic || undefined;
  }

  async deleteForumTopic(id: number): Promise<boolean> {
    const result = await db.delete(forumTopics).where(eq(forumTopics.id, id));
    return (result.rowCount || 0) > 0;
  }

  async getForumPosts(topicId: number, filters?: any): Promise<ForumPost[]> {
    return await db.select().from(forumPosts).where(eq(forumPosts.topicId, topicId)).orderBy(forumPosts.createdAt);
  }

  async getForumPost(id: number): Promise<ForumPost | undefined> {
    const [post] = await db.select().from(forumPosts).where(eq(forumPosts.id, id));
    return post || undefined;
  }

  async createForumPost(post: InsertForumPost): Promise<ForumPost> {
    const [newPost] = await db.insert(forumPosts).values(post).returning();
    return newPost;
  }

  async updateForumPost(id: number, post: Partial<InsertForumPost>): Promise<ForumPost | undefined> {
    const [updatedPost] = await db.update(forumPosts).set({ ...post, updatedAt: new Date() }).where(eq(forumPosts.id, id)).returning();
    return updatedPost || undefined;
  }

  async deleteForumPost(id: number): Promise<boolean> {
    const result = await db.delete(forumPosts).where(eq(forumPosts.id, id));
    return (result.rowCount || 0) > 0;
  }

  async getForumPostLikes(postId: number): Promise<ForumPostLike[]> {
    return await db.select().from(forumPostLikes).where(eq(forumPostLikes.postId, postId));
  }

  async createForumPostLike(like: InsertForumPostLike): Promise<ForumPostLike> {
    const [newLike] = await db.insert(forumPostLikes).values(like).returning();
    return newLike;
  }

  async deleteForumPostLike(userId: number, postId: number): Promise<boolean> {
    const result = await db.delete(forumPostLikes).where(and(eq(forumPostLikes.userId, userId), eq(forumPostLikes.postId, postId)));
    return (result.rowCount || 0) > 0;
  }
  // Mentorship methods - Database implementation
  async getMentorProfiles(filters?: any): Promise<MentorProfile[]> {
    return await db.select().from(mentorProfiles).where(eq(mentorProfiles.isActive, true)).orderBy(desc(mentorProfiles.rating));
  }

  async getMentorProfile(userId: number): Promise<MentorProfile | undefined> {
    const [profile] = await db.select().from(mentorProfiles).where(eq(mentorProfiles.userId, userId));
    return profile || undefined;
  }

  async createMentorProfile(profile: InsertMentorProfile): Promise<MentorProfile> {
    const [newProfile] = await db.insert(mentorProfiles).values(profile).returning();
    return newProfile;
  }

  async updateMentorProfile(userId: number, profile: Partial<InsertMentorProfile>): Promise<MentorProfile | undefined> {
    const [updatedProfile] = await db.update(mentorProfiles).set({ ...profile, updatedAt: new Date() }).where(eq(mentorProfiles.userId, userId)).returning();
    return updatedProfile || undefined;
  }

  async deleteMentorProfile(userId: number): Promise<boolean> {
    const result = await db.update(mentorProfiles).set({ isActive: false }).where(eq(mentorProfiles.userId, userId));
    return (result.rowCount || 0) > 0;
  }

  async getMentorshipSessions(filters?: any): Promise<MentorshipSession[]> {
    return await db.select().from(mentorshipSessions).orderBy(desc(mentorshipSessions.scheduledAt));
  }

  async getMentorshipSession(id: number): Promise<MentorshipSession | undefined> {
    const [session] = await db.select().from(mentorshipSessions).where(eq(mentorshipSessions.id, id));
    return session || undefined;
  }

  async createMentorshipSession(session: InsertMentorshipSession): Promise<MentorshipSession> {
    const [newSession] = await db.insert(mentorshipSessions).values(session).returning();
    return newSession;
  }

  async updateMentorshipSession(id: number, session: Partial<InsertMentorshipSession>): Promise<MentorshipSession | undefined> {
    const [updatedSession] = await db.update(mentorshipSessions).set({ ...session, updatedAt: new Date() }).where(eq(mentorshipSessions.id, id)).returning();
    return updatedSession || undefined;
  }

  async deleteMentorshipSession(id: number): Promise<boolean> {
    const result = await db.delete(mentorshipSessions).where(eq(mentorshipSessions.id, id));
    return (result.rowCount || 0) > 0;
  }

  async getMentorshipReviews(mentorId: number): Promise<MentorshipReview[]> {
    return await db.select().from(mentorshipReviews).where(eq(mentorshipReviews.mentorId, mentorId)).orderBy(desc(mentorshipReviews.createdAt));
  }

  async createMentorshipReview(review: InsertMentorshipReview): Promise<MentorshipReview> {
    const [newReview] = await db.insert(mentorshipReviews).values(review).returning();
    return newReview;
  }

  async updateMentorshipReview(id: number, review: Partial<InsertMentorshipReview>): Promise<MentorshipReview | undefined> {
    const [updatedReview] = await db.update(mentorshipReviews).set(review).where(eq(mentorshipReviews.id, id)).returning();
    return updatedReview || undefined;
  }

  async deleteMentorshipReview(id: number): Promise<boolean> {
    const result = await db.delete(mentorshipReviews).where(eq(mentorshipReviews.id, id));
    return (result.rowCount || 0) > 0;
  }

  async getUserMentorshipReview(userId: number, mentorId: number): Promise<MentorshipReview | undefined> {
    const [review] = await db.select().from(mentorshipReviews).where(and(eq(mentorshipReviews.studentId, userId), eq(mentorshipReviews.mentorId, mentorId)));
    return review || undefined;
  }

  // Missing methods from IStorage interface - Database Implementation
  async getCourseEnrollments(courseId: number): Promise<Enrollment[]> {
    return await db.select().from(enrollments).where(eq(enrollments.courseId, courseId)).orderBy(desc(enrollments.enrolledAt));
  }

  async getEnrollment(userId: number, courseId: number): Promise<Enrollment | undefined> {
    const [enrollment] = await db.select().from(enrollments).where(and(eq(enrollments.userId, userId), eq(enrollments.courseId, courseId)));
    return enrollment || undefined;
  }

  async getFeaturedResources(): Promise<Resource[]> {
    return await db.select().from(resources).where(and(eq(resources.featured, true))).orderBy(desc(resources.createdAt));
  }

  async getResourceBySlug(slug: string): Promise<Resource | undefined> {
    const [resource] = await db.select().from(resources).where(eq(resources.slug, slug));
    return resource || undefined;
  }

  async getResourcesByCategory(categoryId: number): Promise<Resource[]> {
    return await db.select().from(resources).where(eq(resources.categoryId, categoryId)).orderBy(desc(resources.createdAt));
  }

  async getResourcesByType(type: string): Promise<Resource[]> {
    return await db.select().from(resources).where(eq(resources.type, type)).orderBy(desc(resources.createdAt));
  }

  async createResourceCategory(category: InsertResourceCategory): Promise<ResourceCategory> {
    const [newCategory] = await db.insert(resourceCategories).values(category).returning();
    return newCategory;
  }

  async createResourceView(view: InsertResourceView): Promise<ResourceView> {
    const [newView] = await db.insert(resourceViews).values(view).returning();
    return newView;
  }

  async createResourceDownload(download: InsertResourceDownload): Promise<ResourceDownload> {
    const [newDownload] = await db.insert(resourceDownloads).values(download).returning();
    return newDownload;
  }

  async updateResourceStats(resourceId: number, type: 'view' | 'download'): Promise<void> {
    if (type === 'view') {
      await db.update(resources).set({ 
        viewCount: sql`view_count + 1`,
        updatedAt: new Date()
      }).where(eq(resources.id, resourceId));
    } else if (type === 'download') {
      await db.update(resources).set({ 
        downloadCount: sql`download_count + 1`,
        updatedAt: new Date()
      }).where(eq(resources.id, resourceId));
    }
  }

  // Analytics methods - Database Implementation
  async getUserCount(): Promise<number> {
    const [result] = await db.select({ count: sql<number>`count(*)` }).from(users);
    return Number(result?.count) || 0;
  }

  async getCourseCount(): Promise<number> {
    const [result] = await db.select({ count: sql<number>`count(*)` }).from(courses);
    return Number(result?.count) || 0;
  }

  async getTotalRevenue(): Promise<number> {
    const [result] = await db.select({ count: sql<number>`count(*)` }).from(enrollments).where(eq(enrollments.paymentStatus, 'paid'));
    return Number(result?.count || 0) * 97; // Average course price for demo
  }

  async getActiveUserCount(): Promise<number> {
    const [result] = await db.select({ count: sql<number>`count(*)` }).from(users).where(sql`last_login_at > current_date - interval '30 days'`);
    return Number(result?.count) || 0;
  }

  async getTestimonials(): Promise<any[]> {
    // For now return empty array - testimonials can be added via admin interface later
    return [];
  }

  // Platform Statistics Methods - Database Implementation
  async getTotalUsers(): Promise<number> {
    const [result] = await db.select({ count: sql<number>`count(*)` }).from(users);
    return Number(result?.count) || 0;
  }

  async getActiveEnrollments(): Promise<number> {
    const [result] = await db.select({ count: sql<number>`count(*)` }).from(enrollments);
    return Number(result?.count) || 0;
  }

  async getTotalCourses(): Promise<number> {
    const [result] = await db.select({ count: sql<number>`count(*)` }).from(courses);
    return Number(result?.count) || 0;
  }

  async getCompletedEnrollments(): Promise<number> {
    const [result] = await db.select({ count: sql<number>`count(*)` })
      .from(enrollments)
      .where(eq(enrollments.status, 'completed'));
    return Number(result?.count) || 0;
  }

  async getAdminAnalytics(): Promise<{
    totalUsers: number;
    totalCourses: number;
    totalRevenue: number;
    activeUsers: number;
    totalEnrollments: number;
    averageRating: number;
  }> {
    const totalUsers = await this.getUserCount();
    const totalCourses = await this.getCourseCount();
    const totalRevenue = await this.getTotalRevenue();
    const activeUsers = await this.getActiveUserCount();
    
    const [totalEnrollmentsResult] = await db.select({ count: sql<number>`count(*)` }).from(enrollments);
    const totalEnrollments = Number(totalEnrollmentsResult?.count) || 0;

    const [avgRatingResult] = await db.select({ avg: sql<number>`avg(rating)` }).from(courseReviews);
    const averageRating = Number(avgRatingResult?.avg) || 0;
    
    return {
      totalUsers,
      totalCourses,
      totalRevenue,
      activeUsers,
      totalEnrollments,
      averageRating
    };
  }

  // Critical Forum methods for route compatibility
  async likeForumPost(userId: number, postId: number): Promise<ForumPostLike> {
    // Check if like already exists
    const [existingLike] = await db.select().from(forumPostLikes).where(and(eq(forumPostLikes.userId, userId), eq(forumPostLikes.postId, postId)));
    
    if (existingLike) {
      return existingLike;
    }

    const [newLike] = await db.insert(forumPostLikes).values({ userId, postId }).returning();
    return newLike;
  }

  async updateTopicViews(topicId: number): Promise<void> {
    await db.update(forumTopics).set({ 
      views: sql`views + 1`,
      updatedAt: new Date()
    }).where(eq(forumTopics.id, topicId));
  }

  async getForumPostCount(categoryId: number): Promise<number> {
    const [result] = await db
      .select({ count: sql<number>`count(*)` })
      .from(forumPosts)
      .innerJoin(forumTopics, eq(forumPosts.topicId, forumTopics.id))
      .where(eq(forumTopics.categoryId, categoryId));
    
    return Number(result?.count) || 0;
  }

  // Educational Enhancement Methods Implementation
  async getGlossaryTerms(courseId?: number, language?: string, category?: string): Promise<GlossaryTerm[]> {
    let query = db.select().from(glossaryTerms);
    
    const conditions = [];
    if (courseId) conditions.push(eq(glossaryTerms.courseId, courseId));
    if (language) conditions.push(eq(glossaryTerms.language, language));
    if (category) conditions.push(eq(glossaryTerms.category, category));
    
    if (conditions.length > 0) {
      query = query.where(and(...conditions));
    }
    
    return await query;
  }

  async getGlossaryTerm(id: number): Promise<GlossaryTerm | undefined> {
    const [term] = await db.select().from(glossaryTerms).where(eq(glossaryTerms.id, id));
    return term || undefined;
  }

  async createGlossaryTerm(term: InsertGlossaryTerm): Promise<GlossaryTerm> {
    const [newTerm] = await db
      .insert(glossaryTerms)
      .values(term)
      .returning();
    return newTerm;
  }

  async updateGlossaryTerm(id: number, term: Partial<InsertGlossaryTerm>): Promise<GlossaryTerm | undefined> {
    const [updatedTerm] = await db
      .update(glossaryTerms)
      .set({ ...term, updatedAt: new Date() })
      .where(eq(glossaryTerms.id, id))
      .returning();
    return updatedTerm || undefined;
  }

  async deleteGlossaryTerm(id: number): Promise<boolean> {
    const result = await db.delete(glossaryTerms).where(eq(glossaryTerms.id, id));
    return (result.rowCount || 0) > 0;
  }

  async searchGlossaryTerms(query: string, language?: string): Promise<GlossaryTerm[]> {
    const searchPattern = `%${query.toLowerCase()}%`;
    const conditions = [
      or(
        sql`LOWER(${glossaryTerms.term}) LIKE ${searchPattern}`,
        sql`LOWER(${glossaryTerms.definition}) LIKE ${searchPattern}`
      )
    ];
    
    if (language) {
      conditions.push(eq(glossaryTerms.language, language));
    }
    
    return await db
      .select()
      .from(glossaryTerms)
      .where(and(...conditions));
  }

  // Lesson Translation Methods Implementation
  async getLessonTranslations(lessonId: number): Promise<LessonTranslation[]> {
    return await db
      .select()
      .from(lessonTranslations)
      .where(eq(lessonTranslations.lessonId, lessonId));
  }

  async getLessonTranslation(lessonId: number, language: string): Promise<LessonTranslation | undefined> {
    const [translation] = await db
      .select()
      .from(lessonTranslations)
      .where(
        and(
          eq(lessonTranslations.lessonId, lessonId),
          eq(lessonTranslations.language, language)
        )
      );
    return translation || undefined;
  }

  async createLessonTranslation(translation: InsertLessonTranslation): Promise<LessonTranslation> {
    const [newTranslation] = await db
      .insert(lessonTranslations)
      .values(translation)
      .returning();
    return newTranslation;
  }

  async updateLessonTranslation(id: number, translation: Partial<InsertLessonTranslation>): Promise<LessonTranslation | undefined> {
    const [updatedTranslation] = await db
      .update(lessonTranslations)
      .set({ ...translation, updatedAt: new Date() })
      .where(eq(lessonTranslations.id, id))
      .returning();
    return updatedTranslation || undefined;
  }

  async deleteLessonTranslation(id: number): Promise<boolean> {
    const result = await db.delete(lessonTranslations).where(eq(lessonTranslations.id, id));
    return (result.rowCount || 0) > 0;
  }

  async getTranslationProgress(language: string): Promise<{ total: number; translated: number; approved: number; }> {
    const [totalLessons] = await db
      .select({ count: sql<number>`count(*)` })
      .from(courseLessons);
    
    const [translatedCount] = await db
      .select({ count: sql<number>`count(*)` })
      .from(lessonTranslations)
      .where(eq(lessonTranslations.language, language));
    
    const [approvedCount] = await db
      .select({ count: sql<number>`count(*)` })
      .from(lessonTranslations)
      .where(
        and(
          eq(lessonTranslations.language, language),
          eq(lessonTranslations.status, 'approved')
        )
      );
    
    return {
      total: totalLessons?.count || 0,
      translated: translatedCount?.count || 0,
      approved: approvedCount?.count || 0
    };
  }

  // Promotional Codes Methods Implementation
  async getPromotionalCodes(): Promise<PromotionalCode[]> {
    try {
      const codes = await db.select().from(promotionalCodes).orderBy(desc(promotionalCodes.createdAt));
      return codes;
    } catch (error) {
      console.error('Error fetching promotional codes:', error);
      throw error;
    }
  }

  async getPromotionalCode(id: number): Promise<PromotionalCode | undefined> {
    try {
      const [code] = await db.select().from(promotionalCodes).where(eq(promotionalCodes.id, id));
      return code;
    } catch (error) {
      console.error('Error fetching promotional code:', error);
      throw error;
    }
  }

  async getPromotionalCodeByCode(code: string): Promise<PromotionalCode | undefined> {
    try {
      const [promoCode] = await db.select().from(promotionalCodes).where(eq(promotionalCodes.code, code));
      return promoCode;
    } catch (error) {
      console.error('Error fetching promotional code by code:', error);
      throw error;
    }
  }

  async createPromotionalCode(codeData: InsertPromotionalCode): Promise<PromotionalCode> {
    try {
      const [newCode] = await db.insert(promotionalCodes)
        .values(codeData)
        .returning();
      return newCode;
    } catch (error) {
      console.error('Error creating promotional code:', error);
      throw error;
    }
  }

  async updatePromotionalCode(id: number, updates: Partial<InsertPromotionalCode>): Promise<PromotionalCode | undefined> {
    try {
      const [updated] = await db.update(promotionalCodes)
        .set({ ...updates, updatedAt: new Date() })
        .where(eq(promotionalCodes.id, id))
        .returning();
      return updated;
    } catch (error) {
      console.error('Error updating promotional code:', error);
      throw error;
    }
  }

  async deletePromotionalCode(id: number): Promise<boolean> {
    try {
      const result = await db.delete(promotionalCodes).where(eq(promotionalCodes.id, id));
      return result.rowCount! > 0;
    } catch (error) {
      console.error('Error deleting promotional code:', error);
      throw error;
    }
  }

  async validatePromotionalCode(code: string, courseId?: number, membershipType?: string): Promise<{
    valid: boolean;
    code?: PromotionalCode;
    discount?: { type: string; value: number; finalPrice: number; };
    message?: string;
  }> {
    try {
      const promoCode = await this.getPromotionalCodeByCode(code);
      
      if (!promoCode) {
        return { valid: false, message: 'Promotional code not found' };
      }

      if (!promoCode.isActive) {
        return { valid: false, message: 'This promotional code is no longer active' };
      }

      if (promoCode.expiresAt && new Date(promoCode.expiresAt) < new Date()) {
        return { valid: false, message: 'This promotional code has expired' };
      }

      if (promoCode.maxUses && promoCode.currentUses >= promoCode.maxUses) {
        return { valid: false, message: 'This promotional code has reached its usage limit' };
      }

      // Validate course-specific codes
      if (promoCode.type === 'course' && promoCode.targetCourseId && courseId !== promoCode.targetCourseId) {
        return { valid: false, message: 'This code is not valid for the selected course' };
      }

      // Validate membership-specific codes
      if (promoCode.type === 'membership' && promoCode.targetMembershipType && membershipType !== promoCode.targetMembershipType) {
        return { valid: false, message: 'This code is not valid for the selected membership type' };
      }

      // Calculate discount
      let discount;
      let originalPrice = 97; // Default course price
      
      if (courseId) {
        const course = await this.getCourse(courseId);
        originalPrice = parseFloat(course?.price || '97');
      }

      if (promoCode.discountType === 'free') {
        discount = { type: 'free', value: 100, finalPrice: 0 };
      } else if (promoCode.discountType === 'percentage') {
        const discountValue = parseFloat(promoCode.discountValue);
        const finalPrice = originalPrice * (1 - discountValue / 100);
        discount = { type: 'percentage', value: discountValue, finalPrice: Math.max(0, finalPrice) };
      } else if (promoCode.discountType === 'fixed') {
        const discountValue = parseFloat(promoCode.discountValue);
        const finalPrice = originalPrice - discountValue;
        discount = { type: 'fixed', value: discountValue, finalPrice: Math.max(0, finalPrice) };
      }

      return {
        valid: true,
        code: promoCode,
        discount,
        message: 'Valid promotional code'
      };
    } catch (error) {
      console.error('Error validating promotional code:', error);
      return { valid: false, message: 'Error validating promotional code' };
    }
  }

  async usePromotionalCode(code: string, userId: number, courseId?: number): Promise<{
    success: boolean;
    enrollment?: Enrollment;
    membershipUpdate?: User;
    savings?: number;
    message?: string;
  }> {
    try {
      const validation = await this.validatePromotionalCode(code, courseId);
      if (!validation.valid || !validation.code) {
        return { success: false, message: validation.message };
      }

      const promoCode = validation.code;
      
      // Record promotional code usage
      await db.insert(promotionalCodeUsage).values({
        codeId: promoCode.id,
        userId,
        courseId: courseId || null,
        membershipGranted: promoCode.type === 'membership' ? promoCode.targetMembershipType : null,
        originalPrice: validation.discount?.finalPrice ? String(parseFloat(validation.discount.finalPrice.toString()) + (validation.discount.value || 0)) : null,
        discountApplied: validation.discount?.value ? String(validation.discount.value) : null,
        finalPrice: validation.discount?.finalPrice ? String(validation.discount.finalPrice) : null
      });

      // Update code usage count
      await db.update(promotionalCodes)
        .set({ currentUses: promoCode.currentUses + 1 })
        .where(eq(promotionalCodes.id, promoCode.id));

      let result: any = { success: true, savings: validation.discount?.value || 0 };

      // Handle course enrollment
      if (promoCode.type === 'course' && courseId) {
        const enrollment = await this.createEnrollment({
          userId,
          courseId,
          paymentStatus: validation.discount?.finalPrice === 0 ? 'free' : 'paid'
        });
        result.enrollment = enrollment;
        result.message = 'Course access granted successfully';
      }

      // Handle membership upgrade
      if (promoCode.type === 'membership' && promoCode.targetMembershipType) {
        const updatedUser = await this.updateUser(userId, {
          membershipType: promoCode.targetMembershipType
        });
        result.membershipUpdate = updatedUser;
        result.message = `Membership upgraded to ${promoCode.targetMembershipType}`;
      }

      return result;
    } catch (error) {
      console.error('Error using promotional code:', error);
      return { success: false, message: 'Error applying promotional code' };
    }
  }

  // Membership Grants Methods Implementation
  async getMembershipGrants(): Promise<MembershipGrant[]> {
    try {
      const grants = await db.select({
        id: membershipGrants.id,
        userId: membershipGrants.userId,
        grantType: membershipGrants.grantType,
        courseId: membershipGrants.courseId,
        membershipType: membershipGrants.membershipType,
        grantedBy: membershipGrants.grantedBy,
        reason: membershipGrants.reason,
        expiresAt: membershipGrants.expiresAt,
        isActive: membershipGrants.isActive,
        notes: membershipGrants.notes,
        createdAt: membershipGrants.createdAt,
        user: {
          id: users.id,
          name: users.name,
          email: users.email
        },
        course: {
          id: courses.id,
          title: courses.title
        },
        grantedByUser: {
          name: sql`granted_by_user.name`
        }
      })
      .from(membershipGrants)
      .leftJoin(users, eq(membershipGrants.userId, users.id))
      .leftJoin(courses, eq(membershipGrants.courseId, courses.id))
      .leftJoin(sql`users AS granted_by_user`, sql`${membershipGrants.grantedBy} = granted_by_user.id`)
      .orderBy(desc(membershipGrants.createdAt));

      return grants as any;
    } catch (error) {
      console.error('Error fetching membership grants:', error);
      throw error;
    }
  }

  async getMembershipGrant(id: number): Promise<MembershipGrant | undefined> {
    try {
      const [grant] = await db.select().from(membershipGrants).where(eq(membershipGrants.id, id));
      return grant;
    } catch (error) {
      console.error('Error fetching membership grant:', error);
      throw error;
    }
  }

  async createMembershipGrant(grantData: InsertMembershipGrant): Promise<MembershipGrant> {
    try {
      const [newGrant] = await db.insert(membershipGrants)
        .values(grantData)
        .returning();

      // Apply the grant immediately
      if (grantData.grantType === 'course_access' && grantData.courseId) {
        // Create enrollment for course access
        await this.createEnrollment({
          userId: grantData.userId,
          courseId: grantData.courseId,
          paymentStatus: 'free'
        });
      } else if (grantData.grantType === 'membership_upgrade' && grantData.membershipType) {
        // Update user membership
        await this.updateUser(grantData.userId, {
          membershipType: grantData.membershipType
        });
      }

      return newGrant;
    } catch (error) {
      console.error('Error creating membership grant:', error);
      throw error;
    }
  }

  async revokeMembershipGrant(id: number): Promise<boolean> {
    try {
      const [updated] = await db.update(membershipGrants)
        .set({ isActive: false })
        .where(eq(membershipGrants.id, id))
        .returning();
      
      return !!updated;
    } catch (error) {
      console.error('Error revoking membership grant:', error);
      throw error;
    }
  }

  async getUserMembershipGrants(userId: number): Promise<MembershipGrant[]> {
    try {
      const grants = await db.select().from(membershipGrants)
        .where(and(eq(membershipGrants.userId, userId), eq(membershipGrants.isActive, true)));
      return grants;
    } catch (error) {
      console.error('Error fetching user membership grants:', error);
      throw error;
    }
  }
}

export const storage = new DatabaseStorage();