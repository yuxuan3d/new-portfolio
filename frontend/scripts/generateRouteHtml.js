import { writeStaticArtifacts } from './staticArtifacts.js';

const { routeShells } = await writeStaticArtifacts();
console.log(`Generated ${routeShells} route-specific HTML shells from the validated manifest.`);
