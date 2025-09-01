// 'use client';

// import { usePathname } from 'next/navigation';
// import Overview from '../app/Overview/page';
// import KernelModules from '../app/Kernel Modules/page';
// import FirewallRules from '../app/Firewall Rules/page';
// import ApiInterface from '../app/API Interface/page';
// import LogsTesting from '../app/Logs & Testing/page';

// export default function MainView() {
//   const pathname = usePathname();

//   const renderContent = () => {
//     switch (pathname) {
//       case '/':
//         return <Overview />;
//       case '/Overview':
//         return <Overview />;
//       case '/Kernel%20Modules':
//         return <KernelModules />;
//       case '/Firewall%20Rules':
//         return <FirewallRules />;
//       case '/API%20Interface':
//         return <ApiInterface />;
//       case '/Logs%20%26%20Testing':
//         return <LogsTesting />;
//       default:
//         return <Overview />;
//     }
//   };

//   return (
//     <main className="flex-1 p-6 bg-gray-50 min-h-screen">
//       <div className="max-w-7xl mx-auto">
//         {renderContent()}
//       </div>
//     </main>
//   );
// }
