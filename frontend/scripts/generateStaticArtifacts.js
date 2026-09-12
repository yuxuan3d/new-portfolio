import { writeStaticArtifacts } from './staticArtifacts.js';

const { manifest, routeShells } = await writeStaticArtifacts();
console.log(`Generated ${routeShells} route-specific HTML shells and a sitemap with ${manifest.length} routes.`);
