
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PostsTab } from "./PostsTab";
import { SocialAccountsTab } from "./SocialAccountsTab";
import { TemplatesTab } from "./TemplatesTab";
import { AnalyticsTab } from "./AnalyticsTab";
import { ProfileTab } from "./ProfileTab";
import { UsersTab } from "./UsersTab";

interface DashboardTabsProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export const DashboardTabs = ({ activeTab, onTabChange }: DashboardTabsProps) => {
  return (
    <Tabs value={activeTab} onValueChange={onTabChange} className="w-full">
      <TabsList className="grid w-full grid-cols-5 bg-gray-50/80 backdrop-blur-sm p-2 rounded-xl border border-gray-200/50">
        <TabsTrigger 
          value="posts" 
          className="data-[state=active]:bg-white data-[state=active]:text-[#0077ff] data-[state=active]:shadow-lg data-[state=active]:border data-[state=active]:border-[#0077ff]/20 rounded-lg font-medium transition-all duration-200 hover:bg-white/50"
        >
          Posts
        </TabsTrigger>
        <TabsTrigger 
          value="social" 
          className="data-[state=active]:bg-white data-[state=active]:text-[#0077ff] data-[state=active]:shadow-lg data-[state=active]:border data-[state=active]:border-[#0077ff]/20 rounded-lg font-medium transition-all duration-200 hover:bg-white/50"
        >
          Contas
        </TabsTrigger>
        <TabsTrigger 
          value="templates" 
          className="data-[state=active]:bg-white data-[state=active]:text-[#0077ff] data-[state=active]:shadow-lg data-[state=active]:border data-[state=active]:border-[#0077ff]/20 rounded-lg font-medium transition-all duration-200 hover:bg-white/50"
        >
          Templates
        </TabsTrigger>
        <TabsTrigger 
          value="analytics" 
          className="data-[state=active]:bg-white data-[state=active]:text-[#0077ff] data-[state=active]:shadow-lg data-[state=active]:border data-[state=active]:border-[#0077ff]/20 rounded-lg font-medium transition-all duration-200 hover:bg-white/50"
        >
          Analytics
        </TabsTrigger>
        <TabsTrigger 
          value="users" 
          className="data-[state=active]:bg-white data-[state=active]:text-[#0077ff] data-[state=active]:shadow-lg data-[state=active]:border data-[state=active]:border-[#0077ff]/20 rounded-lg font-medium transition-all duration-200 hover:bg-white/50"
        >
          Usuários
        </TabsTrigger>
      </TabsList>
      
      <TabsContent value="posts" className="mt-8 px-8 pb-8">
        <PostsTab />
      </TabsContent>
      
      <TabsContent value="social" className="mt-8 px-8 pb-8">
        <SocialAccountsTab />
      </TabsContent>
      
      <TabsContent value="templates" className="mt-8 px-8 pb-8">
        <TemplatesTab />
      </TabsContent>
      
      <TabsContent value="analytics" className="mt-8 px-8 pb-8">
        <AnalyticsTab />
      </TabsContent>
      
      <TabsContent value="users" className="mt-8 px-8 pb-8">
        <UsersTab />
      </TabsContent>
      
      <TabsContent value="profile" className="mt-8 px-8 pb-8">
        <ProfileTab />
      </TabsContent>
    </Tabs>
  );
};
