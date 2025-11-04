import { Outlet, NavLink, useLocation } from 'react-router-dom';
import { 
  Settings, 
  Map, 
  LayoutDashboard, 
  Cable,
  ChevronRight
} from 'lucide-react';
import { Card } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';

const menuItems = [
  {
    id: 'device-sensor',
    title: 'Device & Sensor',
    icon: Cable,
    path: '/master-config/device-sensor-mapping',
  },
  {
    id: 'maps',
    title: 'Maps Config',
    icon: Map,
    path: '/master-config/maps-config',
  },
  {
    id: 'dashboard',
    title: 'Dashboard Layout',
    icon: LayoutDashboard,
    path: '/master-config/dashboard-layout',
  },
  {
    id: 'system',
    title: 'System Settings',
    icon: Settings,
    path: '/master-config/system-settings',
  },
];

export default function MasterConfigLayout() {
  const location = useLocation();
  
  // If we're at the root /master-config, redirect to first item
  const isRootPath = location.pathname === '/master-config';
  
  return (
    <div className="flex h-full gap-4 p-4">
      {/* Sidebar */}
      <Card className="w-64 flex-shrink-0">
        <div className="p-4 border-b">
          <h2 className="text-lg font-semibold flex items-center gap-2">
            <Settings className="h-5 w-5" />
            Master Config
          </h2>
        </div>
        <ScrollArea className="h-[calc(100vh-12rem)]">
          <nav className="p-2 space-y-1">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              
              return (
                <NavLink
                  key={item.id}
                  to={item.path}
                  className={cn(
                    'flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-colors',
                    isActive
                      ? 'bg-primary text-primary-foreground'
                      : 'hover:bg-accent hover:text-accent-foreground'
                  )}
                >
                  <Icon className="h-4 w-4" />
                  <span className="flex-1">{item.title}</span>
                  {isActive && <ChevronRight className="h-4 w-4" />}
                </NavLink>
              );
            })}
          </nav>
        </ScrollArea>
      </Card>

      {/* Content */}
      <div className="flex-1 overflow-auto">
        {isRootPath ? (
          <Card className="p-8">
            <div className="text-center space-y-4">
              <Settings className="h-16 w-16 mx-auto text-muted-foreground" />
              <h2 className="text-2xl font-bold">Master Configuration</h2>
              <p className="text-muted-foreground">
                Select a configuration section from the sidebar to get started.
              </p>
            </div>
          </Card>
        ) : (
          <Outlet />
        )}
      </div>
    </div>
  );
}
