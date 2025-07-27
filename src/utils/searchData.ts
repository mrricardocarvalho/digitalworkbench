// Content adapter to convert existing content into searchable format
import { type SearchableContent } from './search';

// Blog post data - imported from your actual content
const blogPosts = [
  {
    slug: "exploring-secrettext-feature-business-central",
    title: "Exploring the New SecretText Feature in Business Central Control Add-ins",
    description: "Master the SecretText feature introduced in 2025 release wave 1. Complete guide to secure data handling in control add-ins and JSON objects with AL code examples and compliance best practices.",
    date: "July 21, 2025",
    readingTime: 8,
    featured: false,
    category: "Security & Compliance"
  },
  {
    slug: "automating-tests-copilot-extensions-business-central",
    title: "Automating Tests for Copilot Extensions Using Business Central Test Toolkit",
    description: "Comprehensive guide to testing AI-driven features in Business Central. Learn setup, test scripts, and interpretation with practical examples that save time and improve Copilot reliability.",
    date: "July 21, 2025",
    readingTime: 10,
    featured: false,
    category: "Testing & Quality Assurance"
  },
  {
    slug: "leveraging-ai-resources-business-central-copilot",
    title: "Leveraging AI Resources in Your Business Central Copilot Extensions",
    description: "Explore Azure AI integration in Business Central 2025. Build intelligent extensions with predictive analytics, natural language processing, and sample projects demonstrating AI capabilities.",
    date: "July 21, 2025",
    readingTime: 12,
    featured: false,
    category: "AI & Machine Learning"
  },
  {
    slug: "refactoring-moving-tables-fields-extensions",
    title: "Refactoring Made Easy: Moving Tables and Fields Across Extensions with Data",
    description: "Master the new capability to move tables and fields with data during refactoring. Streamline extension updates, reduce errors, and maintain data integrity with real-world scenarios.",
    date: "July 21, 2025",
    readingTime: 9,
    featured: false,
    category: "Database & Extensions"
  },
  {
    slug: "enhancing-user-interfaces-cardpageid-extension",
    title: "Enhancing User Interfaces: Extending CardPageId on List and ListPart Pages",
    description: "Customize user interfaces with CardPageId extension features. Create intuitive navigation and tailored user experiences with practical AL code samples and implementation examples.",
    date: "July 21, 2025",
    readingTime: 7,
    featured: false,
    category: "User Interface"
  },
  {
    slug: "ai-powered-features-business-central-guide",
    title: "AI-Powered Features in Business Central: What's New and How to Use Them",
    description: "Discover predictive inventory, late payment forecasting, and cash flow analysis using Azure AI. Learn how developers can leverage these features with practical examples and business impact.",
    date: "July 21, 2025",
    readingTime: 11,
    featured: false,
    category: "AI & Machine Learning"
  },
  {
    slug: "migrating-dynamics-gp-business-central-guide",
    title: "Migrating from Dynamics GP to Business Central: Benefits and Best Practices",
    description: "Complete migration guide from Dynamics GP to Business Central. Cloud-native scalability, modern features, step-by-step developer assistance, and common challenge solutions.",
    date: "July 21, 2025",
    readingTime: 13,
    featured: false,
    category: "Migration & Cloud"
  },
  {
    slug: "mastering-dotnet-assemblies-business-central",
    title: "Mastering .NET Assemblies in Business Central Development",
    description: "In-depth guide to using .NET assemblies in AL code. Setup, integration, common use cases with examples for external APIs and complex data processing to extend BC functionality.",
    date: "July 21, 2025",
    readingTime: 10,
    featured: false,
    category: "Advanced Development"
  },
  {
    slug: "crafting-effective-success-messages-business-central",
    title: "Crafting Effective Success Messages in Business Central",
    description: "Design clear, user-friendly success messages in Business Central applications. Best practices for meaningful feedback, graceful error handling, and improved user experience with AL examples.",
    date: "July 21, 2025",
    readingTime: 6,
    featured: false,
    category: "User Experience"
  },
  {
    slug: "advanced-email-handling-business-central",
    title: "Advanced Email Handling in Business Central: CC, BCC, and More",
    description: "Implement advanced email functionalities including CC and BCC. Complete tutorial on email workflows, external service integration, and ensuring deliverability with code samples.",
    date: "July 21, 2025",
    readingTime: 8,
    featured: false,
    category: "Integration & Email"
  },
  // The 4 TRULY FEATURED articles (shown on HomePage)
  {
    slug: "business-central-performance-bottlenecks-guide",
    title: "Business Central Performance Bottlenecks: The Complete Developer's Guide",
    description: "Master 7 critical performance bottlenecks that impact Business Central systems. Includes AL code optimizations, SQL tuning techniques, and proven strategies used in enterprise implementations.",
    date: "July 22, 2025",
    readingTime: 12,
    featured: true,
    category: "Performance Optimization"
  },
  {
    slug: "business-central-cloud-vs-onpremises-migration-guide",
    title: "Business Central Cloud vs On-Premises: Complete Migration Decision Framework",
    description: "Strategic guide using the SCALE methodology to make informed migration decisions. Includes TCO calculator, decision matrix, and real-world migration timelines for enterprise implementations.",
    date: "July 22, 2025",
    readingTime: 15,
    featured: true,
    category: "Migration & Cloud"
  },
  {
    slug: "business-central-al-extensions-advanced-patterns",
    title: "Business Central AL Extensions: Advanced Patterns for Enterprise-Grade Development",
    description: "Master advanced AL extension patterns used in enterprise implementations. Learn dependency injection, event-driven architecture, and scalable patterns that handle 1000+ concurrent users.",
    date: "July 22, 2025",
    readingTime: 18,
    featured: true,
    category: "Advanced Development"
  },
  {
    slug: "business-central-data-migration-zero-downtime-strategies",
    title: "Business Central Data Migration: Zero-Downtime Strategies for Enterprise Implementations",
    description: "Complete framework for zero-downtime data migration with parallel loading, delta synchronization, and proven strategies that handle 2TB+ databases without business disruption.",
    date: "July 22, 2025",
    readingTime: 20,
    featured: true,
    category: "Data Migration"
  }
];

// Project data - imported from your actual content
const projects = [
  {
    slug: "digital-workbench-portfolio",
    title: "Digital Workbench - Modern Portfolio Platform",
    description: "A high-performance React portfolio showcasing modern web development practices. Built with TypeScript, Vite, and Framer Motion, featuring interactive 3D elements, comprehensive SEO optimization, and real-time performance monitoring.",
    tech: ["React 19", "TypeScript", "Vite", "Framer Motion", "CSS3 Animations", "Web Vitals API", "Vitest"],
    category: "Web Development",
    date: "2025-01-15",
    featured: true
  }
];

// Project data structure (from your existing projects)
interface ProjectData {
  slug: string;
  title: string;
  description: string;
  tech: string[];
  category: string;
  date: string;
  featured?: boolean;
}

// Article data structure (from your existing articles)
interface ArticleData {
  slug: string;
  title: string;
  description: string;
  date: string;
  readingTime: number;
  featured?: boolean;
  category: string;
}

/**
 * Convert project data to searchable content
 */
export function convertProjectsToSearchable(projects: ProjectData[]): SearchableContent[] {
  return projects.map(project => ({
    id: project.slug,
    type: 'project' as const,
    title: project.title,
    description: project.description,
    content: project.description, // For projects, description is the main content
    tags: [],
    category: project.category,
    date: project.date,
    slug: project.slug,
    featured: project.featured || false,
    technologies: project.tech
  }));
}

/**
 * Convert article data to searchable content
 */
export function convertArticlesToSearchable(articles: ArticleData[]): SearchableContent[] {
  return articles.map(article => ({
    id: article.slug,
    type: 'article' as const,
    title: article.title,
    description: article.description,
    content: article.description, // For articles, description is the main content for search
    tags: [],
    category: article.category,
    date: article.date,
    slug: article.slug,
    featured: article.featured || false,
    technologies: ['Business Central', 'AL Language', 'Microsoft Dynamics 365'] // All articles focus on Business Central
  }));
}

/**
 * Get all searchable content from your Digital Workbench
 */
export function getAllSearchableContent(): SearchableContent[] {
  // Convert your actual content
  const searchableProjects = convertProjectsToSearchable(projects);
  const searchableArticles = convertArticlesToSearchable(blogPosts);

  return [...searchableProjects, ...searchableArticles];
}

/**
 * Get content by type
 */
export function getContentByType(type: 'project' | 'article' | 'case-study'): SearchableContent[] {
  return getAllSearchableContent().filter(content => content.type === type);
}

/**
 * Get featured content
 */
export function getFeaturedContent(): SearchableContent[] {
  return getAllSearchableContent().filter(content => content.featured);
}

/**
 * Get recent content (last 30 days)
 */
export function getRecentContent(days: number = 30): SearchableContent[] {
  const cutoffDate = new Date();
  cutoffDate.setDate(cutoffDate.getDate() - days);

  return getAllSearchableContent().filter(content => {
    const contentDate = new Date(content.date);
    return contentDate >= cutoffDate;
  });
}
