import React from 'react';
import { Link } from 'react-router-dom';
import type { Variants } from 'framer-motion';
import { motion } from 'framer-motion';
import './InsightsPage.css';

// Define the structure for an insight/blog post
type Insight = {
  slug: string;
  title: string;
  description: string;
  date: string;
  readingTime: number; // in minutes
};

// Create a sample list of all your insights - All 20 Business Central Development Blog Posts
const allInsights: Insight[] = [
  // From TrendingBlogs.md - 10 posts
  { 
    slug: "exploring-secrettext-feature-business-central", 
    title: "Exploring the New SecretText Feature in Business Central Control Add-ins", 
    description: "Master the SecretText feature introduced in 2025 release wave 1. Complete guide to secure data handling in control add-ins and JSON objects with AL code examples and compliance best practices.", 
    date: "July 21, 2025", 
    readingTime: 8 
  },
  { 
    slug: "automating-tests-copilot-extensions-business-central", 
    title: "Automating Tests for Copilot Extensions Using Business Central Test Toolkit", 
    description: "Comprehensive guide to testing AI-driven features in Business Central. Learn setup, test scripts, and interpretation with practical examples that save time and improve Copilot reliability.", 
    date: "July 21, 2025", 
    readingTime: 10 
  },
  { 
    slug: "leveraging-ai-resources-business-central-copilot", 
    title: "Leveraging AI Resources in Your Business Central Copilot Extensions", 
    description: "Explore Azure AI integration in Business Central 2025. Build intelligent extensions with predictive analytics, natural language processing, and sample projects demonstrating AI capabilities.", 
    date: "July 21, 2025", 
    readingTime: 12 
  },
  { 
    slug: "refactoring-moving-tables-fields-extensions", 
    title: "Refactoring Made Easy: Moving Tables and Fields Across Extensions with Data", 
    description: "Master the new capability to move tables and fields with data during refactoring. Streamline extension updates, reduce errors, and maintain data integrity with real-world scenarios.", 
    date: "July 21, 2025", 
    readingTime: 9 
  },
  { 
    slug: "enhancing-user-interfaces-cardpageid-extension", 
    title: "Enhancing User Interfaces: Extending CardPageId on List and ListPart Pages", 
    description: "Customize user interfaces with CardPageId extension features. Create intuitive navigation and tailored user experiences with practical AL code samples and implementation examples.", 
    date: "July 21, 2025", 
    readingTime: 7 
  },
  { 
    slug: "ai-powered-features-business-central-guide", 
    title: "AI-Powered Features in Business Central: What's New and How to Use Them", 
    description: "Discover predictive inventory, late payment forecasting, and cash flow analysis using Azure AI. Learn how developers can leverage these features with practical examples and business impact.", 
    date: "July 21, 2025", 
    readingTime: 11 
  },
  { 
    slug: "migrating-dynamics-gp-business-central-guide", 
    title: "Migrating from Dynamics GP to Business Central: Benefits and Best Practices", 
    description: "Complete migration guide from Dynamics GP to Business Central. Cloud-native scalability, modern features, step-by-step developer assistance, and common challenge solutions.", 
    date: "July 21, 2025", 
    readingTime: 13 
  },
  { 
    slug: "mastering-dotnet-assemblies-business-central", 
    title: "Mastering .NET Assemblies in Business Central Development", 
    description: "In-depth guide to using .NET assemblies in AL code. Setup, integration, common use cases with examples for external APIs and complex data processing to extend BC functionality.", 
    date: "July 21, 2025", 
    readingTime: 10 
  },
  { 
    slug: "crafting-effective-success-messages-business-central", 
    title: "Crafting Effective Success Messages in Business Central", 
    description: "Design clear, user-friendly success messages in Business Central applications. Best practices for meaningful feedback, graceful error handling, and improved user experience with AL examples.", 
    date: "July 21, 2025", 
    readingTime: 6 
  },
  { 
    slug: "advanced-email-handling-business-central", 
    title: "Advanced Email Handling in Business Central: CC, BCC, and More", 
    description: "Implement advanced email functionalities including CC and BCC. Complete tutorial on email workflows, external service integration, and ensuring deliverability with code samples.", 
    date: "July 21, 2025", 
    readingTime: 8 
  },
  // From MoreIdeas.md - 10 posts
  { 
    slug: "getting-started-ai-customizing-copilot-business-central", 
    title: "Getting Started with AI: A Developer's Guide to Customizing Copilot in Business Central", 
    description: "Learn how to extend and customize Copilot features in Business Central. Practical examples of creating custom AI-powered experiences within extensions with step-by-step implementation.", 
    date: "July 21, 2025", 
    readingTime: 11 
  },
  { 
    slug: "whats-new-developers-business-central-2026-release", 
    title: "What's New for Developers in the Business Central 2026 Release Wave", 
    description: "In-depth look at the latest developer features and enhancements in Business Central 2026. Coverage of AL language changes, new APIs, and enhanced development tools.", 
    date: "July 21, 2025", 
    readingTime: 9 
  },
  { 
    slug: "building-first-power-app-business-central-data", 
    title: "Building Your First Power App with Business Central Data", 
    description: "Step-by-step tutorial for creating Power Apps that read and write Business Central data without Dataverse. Perfect for developers leveraging the Power Platform ecosystem.", 
    date: "July 21, 2025", 
    readingTime: 12 
  },
  { 
    slug: "advanced-al-development-interfaces-abstract-classes", 
    title: "Advanced AL Development: Working with Interfaces and Abstract Classes", 
    description: "Master advanced AL development techniques using interfaces and abstract classes. Build more flexible and maintainable extensions with proven enterprise patterns and examples.", 
    date: "July 21, 2025", 
    readingTime: 10 
  },
  { 
    slug: "deep-dive-business-foundation-module-business-central", 
    title: "A Deep Dive into the New Business Foundation Module in Business Central", 
    description: "Explore the Business Foundation module and its developer implications. Learn how to use the new module effectively and refactor existing code for improved performance.", 
    date: "July 21, 2025", 
    readingTime: 8 
  },
  { 
    slug: "mastering-api-integrations-business-central-external-services", 
    title: "Mastering API Integrations: Connecting Business Central to External Services", 
    description: "Practical guide to robust API integrations with Business Central. Covers authentication, error handling, and working with JSON data formats for seamless external service connections.", 
    date: "July 21, 2025", 
    readingTime: 11 
  },
  { 
    slug: "performance-tuning-business-central-extensions", 
    title: "Performance Tuning Your Business Central Extensions: Tips and Tricks", 
    description: "Actionable advice for identifying and resolving performance bottlenecks in Business Central extensions. Efficient data access, background processing, and code optimization techniques.", 
    date: "July 21, 2025", 
    readingTime: 9 
  },
  { 
    slug: "from-idea-to-appsource-publishing-business-central-app", 
    title: "From Idea to AppSource: A Guide to Publishing Your First Business Central App", 
    description: "Comprehensive walkthrough of developing and publishing Business Central apps on Microsoft AppSource marketplace. Perfect for developers looking to monetize their extensions.", 
    date: "July 21, 2025", 
    readingTime: 14 
  },
  { 
    slug: "new-report-document-features-business-central", 
    title: "How to Use the New Report and Document Features in Business Central", 
    description: "Tutorial on improved report and document features in Business Central. Learn to use sections in Word layouts and create flexible report designs with enhanced capabilities.", 
    date: "July 21, 2025", 
    readingTime: 8 
  },
  { 
    slug: "automating-business-processes-power-automate-business-central", 
    title: "Automating Business Processes with Power Automate and Business Central", 
    description: "Create intelligent workflows and approvals using Power Automate with Business Central. Examples include automating invoice processing, sales order creation, and other common tasks.", 
    date: "July 21, 2025", 
    readingTime: 10 
  }
];

const InsightsPage: React.FC = () => {
  const pageVariants: Variants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  };

  return (
    <div className="container">
      <div className="insights-header">
        <h1>Business Central Articles & Insights</h1>
        <p className="insights-subtitle">Real-world Business Central development techniques, performance tips, and architectural insights from 8+ years in the field.</p>
      </div>

      <motion.div 
        className="insights-grid"
        variants={pageVariants}
        initial="hidden"
        animate="visible"
      >
        {allInsights.map((insight) => (
          <motion.div key={insight.slug} className="insight-card" variants={itemVariants}>
            <div className="insight-meta">
              <span>{insight.date}</span>
              <span>•</span>
              <span>{insight.readingTime} min read</span>
            </div>
            <h3>{insight.title}</h3>
            <p>{insight.description}</p>
            <Link to={`/insights/${insight.slug}`} className="view-all-link">Read More →</Link>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
};

export default InsightsPage;