'use client';

import { createContext, useContext } from 'react';

/** Authenticated request helpers shared by every admin screen (see AdminProvider). */
export const AdminContext = createContext(null);
export const useAdmin = () => useContext(AdminContext);
