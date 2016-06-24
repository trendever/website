import { loadJSON } from 'utils'

// ToDo make it for dev-server too.
// Now available only for builded server.
export const get = () => loadJSON('/version.json')
