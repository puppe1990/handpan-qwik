/**
 * Shared UI revision counter. When engine state changes from a child panel
 * (cloud pack load, etc.), bump this so the shell can re-sync.
 */
export const appUi = {
  revision: 0,
  bump() {
    this.revision += 1;
  },
};
