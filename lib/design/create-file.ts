import { uid, type DesignDocument } from "./document.ts";

type Backup = {
  id: string;
  title: string;
  document: DesignDocument;
  updatedAt: number;
  pending: boolean;
};
export class DesignCreationError extends Error {
  backupId: string;
  constructor(message: string, backupId: string) {
    super(message);
    this.backupId = backupId;
    this.name = "DesignCreationError";
  }
}

export async function createDesignCopy(
  document: DesignDocument,
  saveLocal: (backup: Backup) => void,
  saveAccount?: (document: DesignDocument) => Promise<string>,
) {
  const backup: Backup = {
    id: `local-${uid()}`,
    title: document.title,
    document,
    updatedAt: Date.now(),
    pending: !!saveAccount,
  };
  saveLocal(backup);
  if (!saveAccount) return { fileId: backup.id, backupUpdated: true };
  let accountId: string;
  try {
    accountId = await saveAccount(document);
  } catch {
    throw new DesignCreationError(
      "Could not create the account file. Your browser copy is saved.",
      backup.id,
    );
  }
  let backupUpdated = true;
  try {
    saveLocal({ ...backup, pending: false });
  } catch {
    backupUpdated = false;
  }
  return { fileId: `cloud-${accountId}`, backupUpdated };
}
