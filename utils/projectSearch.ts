import { Project } from '../data/resourcesData';
import { normalizeSearchText } from './jobSearch';

/** Recherche uniquement les champs publiés, jamais les données privées du porteur. */
export function matchesProjectQuery(project: Project, query: string): boolean {
  const terms = normalizeSearchText(query.trim()).split(/\s+/).filter(Boolean);
  const text = normalizeSearchText([
    project.title, project.student, project.school, project.category, project.need,
    project.description, project.problem, project.solution, project.stage,
    ...(project.tags || []), ...(project.team || []).flatMap(member => [member.name, member.role]),
    ...(project.roadmap || []).map(step => step.title)
  ].filter((v): v is string => typeof v === 'string').join(' '));
  return terms.every(term => text.includes(term));
}
