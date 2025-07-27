// Quick verification of search content numbers
import { getAllSearchableContent } from './searchData';

const content = getAllSearchableContent();

console.log('=== SEARCH CONTENT VERIFICATION ===');
console.log(`Total Items: ${content.length}`);
console.log(`Projects: ${content.filter(item => item.type === 'project').length}`);
console.log(`Articles: ${content.filter(item => item.type === 'article').length}`);
console.log(`Featured Items: ${content.filter(item => item.featured).length}`);

const allTechnologies = new Set(content.flatMap(item => item.technologies || []));
console.log(`Unique Technologies: ${allTechnologies.size}`);
console.log('Technologies:', Array.from(allTechnologies).sort());

console.log('\n=== PROJECTS ===');
content.filter(item => item.type === 'project').forEach(item => {
  console.log(`- ${item.title} (Featured: ${item.featured})`);
});

console.log('\n=== ARTICLES (First 5) ===');
content.filter(item => item.type === 'article').slice(0, 5).forEach(item => {
  console.log(`- ${item.title} (Featured: ${item.featured})`);
});

export {};
