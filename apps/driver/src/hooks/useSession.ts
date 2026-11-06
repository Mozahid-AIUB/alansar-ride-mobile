import { useSyncExternalStore } from 'react';

import { session } from '@alansar/auth';

export const useSession = () =>
  useSyncExternalStore(session.subscribe, session.getState, session.getState);
