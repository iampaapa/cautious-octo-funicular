// src/electron.d.ts
interface ElectronAPI {
    readFile: (filePath: string) => string | null;
    getPath: (name: string) => string;
}

interface Window {
    electron: ElectronAPI;
}
