module.exports = {
  packagerConfig: {
    icon: './public/icon' // ✅ Uncommented: Use public/icon.ico (without extension for Windows)
  },
  rebuildConfig: {},
  makers: [
    {
      name: '@electron-forge/maker-squirrel',
      config: {
        name: 'DeskSpaceAI',
        authors: 'DeskSpace Team',
        exe: 'DeskSpaceAI.exe',
        setupExe: 'DeskSpaceAISetup.exe',
        iconUrl: 'https://www.deskspace.in.th/wp-content/uploads/2026/01/Logo_DeskSpace_Full.webp', // Optional: Online URL for installer icon
        setupIcon: './public/icon.ico' // ✅ Setup Icon
      },
    },
    {
      name: '@electron-forge/maker-zip',
      platforms: ['darwin', 'linux'],
    },
    {
      name: '@electron-forge/maker-deb',
      config: {},
    },
    {
      name: '@electron-forge/maker-rpm',
      config: {},
    },
  ],
};